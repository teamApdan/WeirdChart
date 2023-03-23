import { BarConfig } from './RatioBarChart.types';
import { easeInOut } from '../../utils/animation';

export const defaultBarConfig: BarConfig = {
  offsetX: 0,
  offsetY: 0,
  barHeight: 30,
  barMaxWidth: 100,
  barRadius: 20,
  animationSpeed: 1,
  frameCount: 0,
  startAnimation: 'fromZero',
  animationTimingFunction: easeInOut,
  isStart: false,
};
