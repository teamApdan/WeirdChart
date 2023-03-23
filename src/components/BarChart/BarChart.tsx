import React from 'react';
import Canvas from '../Canvas';
import { useBarChartDataset } from '../../hooks';
import { Color, Theme } from '../../utils/color';
import { positiveOrZero } from '../../utils/calculation';
import { defaultBarConfig } from './BarChart.static';
import { Dataset, CumulativeDataset, Position, Bar, radii, Option, BarConfig } from './BarChart.types';
import './BarChart.css';

export type BarChartProps = {
  dataset: Dataset[];
  /**
   * @description can be custom color array or theme
   * @see Theme
   * @default 'pastel'
   */
  colors?: string[] | Theme;
  option?: Option;
} & React.CanvasHTMLAttributes<HTMLCanvasElement>;

const BarChart = ({ dataset, colors, option, ...rest }: BarChartProps) => {
  const { isMount, cumulativeDataset, defaultDataset, prevDataset, mount } = useBarChartDataset(dataset);
  const barColors = new Color(colors);

  function draw(
    ctx: CanvasRenderingContext2D,
    frameCount: number,
    cumulativeDataset: CumulativeDataset[],
    defaultDataset: CumulativeDataset[],
    prevDataset: CumulativeDataset[],
    barColors: Color,
    isMount: boolean,
    mount: () => void,
    option?: Option
  ) {
    const config = setConfig(ctx, frameCount, isMount, defaultBarConfig, option);
    const bars = makeBars(cumulativeDataset, config.isStart ? prevDataset : defaultDataset, barColors, config);
    drawBars(ctx, bars);
    if (frameCount * config.animationSpeed >= 60) {
      mount();
    }
  }

  return (
    <div className='barchart'>
      <Canvas
        className='barchart__canvas'
        draw={(ctx, frameCount) => {
          draw(ctx, frameCount, cumulativeDataset, defaultDataset, prevDataset, barColors, isMount, mount, option);
        }}
        {...rest}
      />
    </div>
  );
};

export default BarChart;

function makeBarOffsetX(position: Position) {
  return position === 'FIRST' ? 0 : 1;
}

function makeBarRadius(position: Position, { barRadius }: BarConfig, nonePositionByLast: boolean): radii {
  switch (position) {
    case 'MIDDLE':
    case 'FIRST':
      return [barRadius, 0, 0, barRadius];
    case 'LAST':
      return [barRadius, barRadius, barRadius, barRadius];
    case 'NONE':
      return nonePositionByLast ? [barRadius, barRadius, barRadius, barRadius] : [barRadius, 0, 0, barRadius];
    default:
      return [barRadius, 0, 0, barRadius];
  }
}

function makeBarWidth(
  prevValue: number,
  prevTotalValue: number,
  destinationValue: number,
  destinationTotalValue: number,
  position: Position,
  barConfig: BarConfig
) {
  const { isStart, startAnimation, barMaxWidth } = barConfig;
  const startWidth = !isStart && startAnimation === 'fromZero' ? prevValue : (prevValue / prevTotalValue) * barMaxWidth;
  const destinationWidth = (destinationValue / destinationTotalValue) * barMaxWidth;
  const additionalWidth = position === 'FIRST' ? 0 : -1;

  const animation = (startWidth: number, destinationWidth: number, { animationSpeed, frameCount, animationTimingFunction }: BarConfig) => {
    return startWidth + (destinationWidth - startWidth) * animationTimingFunction((frameCount * animationSpeed) / 60);
  };

  return positiveOrZero(animation(startWidth, destinationWidth, barConfig) + additionalWidth);
}

function makeBars(cumulativeDataset: CumulativeDataset[], prevDataset: CumulativeDataset[], barColors: Color, barConfig: BarConfig): Bar[] {
  const destinationTotalValue = cumulativeDataset.reduce((acc, obj) => acc + obj.value, 0);
  const prevTotalValue = prevDataset.reduce((acc, obj) => acc + obj.value, 0);
  const checkPositionLastIndex = (cumulativeDataset: CumulativeDataset[]) => cumulativeDataset.findIndex((obj) => obj.position === 'LAST');

  return cumulativeDataset.map((cumulativeData, index) => {
    const prevValue = prevDataset[index].cumulativeSum;
    const destinationValue = cumulativeData.cumulativeSum;
    return {
      color: cumulativeData.color ?? barColors.getColor(index),
      x: makeBarOffsetX(cumulativeData.position),
      y: barConfig.offsetY,
      width: makeBarWidth(prevValue, prevTotalValue, destinationValue, destinationTotalValue, cumulativeData.position, barConfig),
      height: barConfig.barHeight,
      radii: makeBarRadius(cumulativeData.position, barConfig, index > checkPositionLastIndex(cumulativeDataset)),
    };
  });
}

function drawBars(ctx: CanvasRenderingContext2D, bars: Bar[]) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  bars.reverse().forEach((bar) => {
    ctx.fillStyle = bar.color;
    ctx.beginPath();
    ctx.roundRect(bar.x, bar.y, bar.width, bar.height, bar.radii);
    ctx.fill();
  });
}

function setConfig(
  ctx: CanvasRenderingContext2D,
  frameCount: number,
  isStart: boolean,
  defaultBarConfig: BarConfig,
  option?: Option
): BarConfig {
  const config = { ...defaultBarConfig, frameCount, ...option };
  return {
    ...config,
    isStart,
    barMaxWidth: ctx.canvas.width - config.offsetX,
    barRadius: config.barHeight / 2,
  };
}
