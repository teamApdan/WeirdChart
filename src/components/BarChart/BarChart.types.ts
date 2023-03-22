export type Position = 'FIRST' | 'MIDDLE' | 'LAST' | 'NONE';
export type radii = number | [number] | [number, number] | [number, number, number] | [number, number, number, number];
export type Dataset = {
  label: string;
  value: number;
  color?: string;
};
export type CumulativeDataset = Dataset & {
  cumulativeSum: number;
  position: Position;
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
  animationTimingFunction?: (frameCount: number) => number;
};

// unwrap optional type
export type BarConfig = {
  [K in keyof Option]-?: Option[K];
};
