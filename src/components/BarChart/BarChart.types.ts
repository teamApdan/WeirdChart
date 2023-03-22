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

export type StartAnimation = 'fromZero' | 'fromEqual';

/**
 * @description The option for the bar chart.
 * @default { offsetX: 0, offsetY: 0, barHeight: 30, barMaxWidth: 100, barRadius: 20, animationSpeed: 1, frameCount: 0, animationTimingFunction: easeInOut, startAnimation: 'fromZero' }
 */
export type Option = {
  /**
   * @description The offset of the bar chart from the left side of the container.
   * @default 0
   */
  offsetX?: number;
  /**
   * @description The offset of the bar chart from the top side of the container.
   * @default 0
   */
  offsetY?: number;
  /**
   * @description The height of the bar.
   * @default 30
   */
  barHeight?: number;
  /**
   * @description The maximum width of the bar.
   *  If the value is greater than the width of the container, it will be ignored.
   * @default 100
   */
  barMaxWidth?: number;
  /**
   * @description The radius of the bar.
   * @default 20
   */
  barRadius?: number;
  /**
   * @description The ratio of the width of the bar to the width of the container.
   * @default 1
   */
  animationSpeed?: number;
  /**
   * @description The number of frames for animation.
   * @default 0
   */
  frameCount?: number;
  /**
   * @description The function that determines the animation timing.
   * @default easeInOut
   */
  animationTimingFunction?: (frameCount: number) => number;
  /**
   * @description Whether to start the animation when the component is mounted.
   * @default false
   */
  isStart?: boolean;
  /**
   * @description The animation that starts when the component is mounted.
   * @default 'fromZero'
   * @see StartAnimation
   */
  startAnimation?: StartAnimation;
};

// unwrap optional type
export type BarConfig = {
  [K in keyof Option]-?: Option[K];
};
