import React, { useState, useEffect } from 'react';
import Canvas from '../Canvas';
import { usePrevState } from '../../hooks';
import { defaultBarConfig } from './BarChart.static';
import { Dataset, CumulativeDataset, Position, Bar, radii, Option, BarConfig } from './BarChart.types';
import './BarChart.css';
import { Color } from '../../utils/color';

export interface BarChartProps {
  dataset: Dataset[];
  colors?: string[];
  option?: Option;
}

function makeCumulativeDataset(dataset: Dataset[]): CumulativeDataset[] {
  const totalValue = dataset.reduce((acc, data) => acc + data.value, 0);
  let cumulativeSum = 0;
  let position: Position;
  return dataset.map((data) => {
    if (cumulativeSum === 0 && data.value !== 0) {
      position = 'FIRST';
    } else if (data.value === 0) {
      position = 'NONE';
    } else if (cumulativeSum + data.value === totalValue) {
      position = 'LAST';
    } else {
      position = 'MIDDLE';
    }
    cumulativeSum += data.value;
    return { ...data, cumulativeSum, position };
  });
}

function makeBarOffsetX(position: Position) {
  if (position === 'FIRST') return 0;
  return 1;
}

function makeBarRadius(position: Position, config: BarConfig, nonePositionByLast: boolean): radii {
  switch (position) {
    case 'MIDDLE':
    case 'FIRST':
      return [config.barRadius, 0, 0, config.barRadius];
    case 'LAST':
      return [config.barRadius, config.barRadius, config.barRadius, config.barRadius];
    case 'NONE':
      if (nonePositionByLast) return [config.barRadius, config.barRadius, config.barRadius, config.barRadius];
      return [config.barRadius, 0, 0, config.barRadius];
    default:
      return [config.barRadius, 0, 0, config.barRadius];
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
  function additionalWidth(position: Position, barConfig: BarConfig) {
    if (position === 'FIRST') return 0;
    return -barConfig.barRadius - 1;
  }
  function animationWidth(startWidth: number, destinationWidth: number, frameCount: number) {
    if (frameCount * barConfig.animationSpeed >= 60) {
      return destinationWidth;
    }
    return startWidth + ((destinationWidth - startWidth) * (frameCount * barConfig.animationSpeed)) / 60;
  }
  const result =
    animationWidth(
      barConfig.barMaxWidth * (prevValue / prevTotalValue),
      barConfig.barMaxWidth * (destinationValue / destinationTotalValue),
      barConfig.frameCount
    ) + additionalWidth(position, barConfig);
  return result < 0 ? 0 : result;
}

function makeBar(cumulativeDataset: CumulativeDataset[], prevDataset: CumulativeDataset[], barConfig: BarConfig): Bar[] {
  const destinationTotalValue = cumulativeDataset.reduce((acc, obj) => acc + obj.value, 0);
  const prevTotalValue = prevDataset ? prevDataset.reduce((acc, obj) => acc + obj.value, 0) : 0;

  function checkPositionLastIndex(cumulativeDataset: CumulativeDataset[]) {
    return cumulativeDataset.findIndex((obj) => obj.position === 'LAST');
  }
  return cumulativeDataset.map((cumulativeData, index) => {
    const prevValue = prevDataset[index].cumulativeSum;
    const destinationValue = cumulativeData.cumulativeSum;
    return {
      color: cumulativeData.color ?? 'black',
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

function setConfig(ctx: CanvasRenderingContext2D, frameCount: number, defaultBarConfig: BarConfig, option?: Option) {
  const config = { ...defaultBarConfig, frameCount, ...option };
  return {
    ...config,
    barMaxWidth: ctx.canvas.width - config.offsetX,
    barRadius: config.barHeight / 2,
  };
}

const BarChart = ({ dataset, colors, option }: BarChartProps) => {
  const cumulativeDataset = makeCumulativeDataset(dataset);
  const prevDataset = usePrevState<CumulativeDataset[]>(cumulativeDataset);
  const barColors = Color(colors);

  function draw(
    ctx: CanvasRenderingContext2D,
    frameCount: number,
    cumulativeDataset: CumulativeDataset[],
    prevDataset: CumulativeDataset[],
    option?: Option
  ) {
    const config = setConfig(ctx, frameCount, defaultBarConfig, option);
    const bars = makeBar(cumulativeDataset, prevDataset, config);
    drawBars(ctx, bars);
  }

  return (
    <div className='barchart' style={{ position: 'relative' }}>
      <Canvas
        draw={(ctx, frameCount) => {
          draw(ctx, frameCount, cumulativeDataset, prevDataset, option);
        }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
    </div>
  );
};

export default BarChart;
