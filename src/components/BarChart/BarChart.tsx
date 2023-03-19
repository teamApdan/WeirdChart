import React, { useState, useEffect } from 'react';
import Canvas from '../Canvas';
import { usePrevState } from '../../hooks';
import './BarChart.css';

export type Position = 'FIRST' | 'MIDDLE' | 'LAST' | 'NONE';
export type radii = number | [number] | [number, number] | [number, number, number] | [number, number, number, number];
export type Dataset = {
  label: string;
  value: number;
  color?: string;
};
export type CumulativeDataset = Dataset & {
  cumulativeSum: number;
  state: Position;
};

export type Bar = {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radii: radii;
};

export type Option = {
  offsetX?: number;
  offsetY?: number;
  barHeight?: number;
  barMaxWidth?: number;
  barRadius?: number;
  widthRatio?: number;
  animationSpeed?: number;
  frameCount?: number;
};

// unwrap optional type
export type RequiredOption = {
  [K in keyof Option]-?: Option[K];
};

export interface BarChartProps {
  dataset: Dataset[];
  option?: Option;
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function toCumulativeDataset(dataset: Dataset[]): CumulativeDataset[] {
  const totalValue = dataset.reduce((acc, obj) => acc + obj.value, 0);

  let sum = 0;
  let state: Position | 'NONE';
  return dataset.map((obj, index) => {
    if (sum === 0 && obj.value !== 0) {
      state = 'FIRST';
    } else if (index > 0 && obj.value === 0) {
      state = 'NONE';
    } else if (sum + obj.value === totalValue) {
      state = 'LAST';
    } else {
      state = 'MIDDLE';
    }
    sum += obj.value;
    return { ...obj, cumulativeSum: sum, state: state };
  });
}

function makeBarOffsetX(position: Position, option: RequiredOption) {
  if (position === 'FIRST') return 0;
  return option.barRadius;
}

function makeBarRadius(position: Position, option: RequiredOption): radii {
  if (position === 'FIRST') return [option.barRadius, 0, 0, option.barRadius];
  if (position === 'LAST') return [0, option.barRadius, option.barRadius, 0];
  return [0, 0, 0, 0];
}

function makeBarWidth(
  startValue: number,
  destinationValue: number,
  totalValue: number,
  prevTotalValue: number,
  position: Position,
  option: RequiredOption
) {
  function additionalWidth(position: Position, option: RequiredOption) {
    if (position === 'MIDDLE' || position === 'LAST') return -option.barRadius;
    return 0;
  }
  const animationWidth = (startWidth: number, destinationWidth: number, frameCount: number) => {
    if (frameCount * option.animationSpeed > 60) return destinationWidth;
    return startWidth + (destinationWidth - startWidth) * easeInOut((frameCount * option.animationSpeed) / 60);
  };
  if (position === 'LAST') {
    return animationWidth(startValue !== destinationValue ? option.barMaxWidth : option.barRadius, option.barMaxWidth, option.frameCount);
  }
  if (startValue === destinationValue) {
    startValue = option.barRadius;
  }
  const result =
    animationWidth(
      option.barMaxWidth * (startValue / prevTotalValue),
      option.barMaxWidth * (destinationValue / totalValue),
      option.frameCount
    ) + additionalWidth(position, option);
  return result;
}

function makeBar(
  ctx: CanvasRenderingContext2D,
  cumulativeDataset: CumulativeDataset[],
  prevDataset: CumulativeDataset[],
  option: RequiredOption
): Bar[] {
  const totalValue = cumulativeDataset.reduce((acc, obj) => acc + obj.value, 0);
  const prevTotalValue = prevDataset.reduce((acc, obj) => acc + obj.value, 0);

  option.barMaxWidth = ctx.canvas.width - option.offsetX;
  option.barRadius = option.barHeight / 2;

  return cumulativeDataset
    .filter((obj) => obj.state !== 'NONE')
    .map((obj, index) => {
      return {
        color: obj.color || '#000000',
        x: makeBarOffsetX(obj.state, option),
        y: option.offsetY || 10,
        width: makeBarWidth(prevDataset[index].cumulativeSum, obj.cumulativeSum, totalValue, prevTotalValue, obj.state, option),
        height: option.barHeight,
        radii: makeBarRadius(obj.state, option),
      };
    });
}

function drawBars(ctx: CanvasRenderingContext2D, bars: Bar[]) {
  bars.reverse().forEach((bar) => {
    drawBar(ctx, bar);
  });
}

function drawBar(ctx: CanvasRenderingContext2D, bar: Bar) {
  ctx.fillStyle = bar.color;
  ctx.beginPath();
  bar.width = Math.floor(bar.width);
  if (bar.width % 2 === 1) bar.width -= 1;
  ctx.roundRect(bar.x, bar.y, bar.width, bar.height, bar.radii);
  ctx.fill();
}

const BarChart = ({ dataset, option }: BarChartProps) => {
  const cumulativeDataset = toCumulativeDataset(dataset);
  const prevDataset = usePrevState<CumulativeDataset[]>(cumulativeDataset);

  const defaultOption: RequiredOption = {
    offsetX: 10,
    offsetY: 10,
    barHeight: 20,
    barMaxWidth: 100,
    barRadius: 20,
    widthRatio: 1,
    animationSpeed: 1,
    frameCount: 0,
  };

  function draw(
    ctx: CanvasRenderingContext2D,
    frameCount: number,
    cumulativeDataset: CumulativeDataset[],
    prevDataset: CumulativeDataset[]
  ) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const bars = makeBar(ctx, cumulativeDataset, prevDataset, { ...defaultOption, frameCount, ...option });
    drawBars(ctx, bars);
  }

  useEffect(() => {
    console.log(prevDataset);
  }, []);

  return (
    <div className='barchart' style={{ position: 'relative' }}>
      <Canvas
        draw={(ctx, frameCount) => {
          draw(ctx, frameCount, cumulativeDataset, prevDataset);
        }}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
      />
    </div>
  );
};

export default BarChart;
