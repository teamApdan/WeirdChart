import { BarConfig } from './BarChart.types';
import { easeInOut } from '../../utils/animation';

export const defaultBarConfig: BarConfig = {
  offsetX: 0,
  offsetY: 0,
  barHeight: 20,
  barMaxWidth: 100,
  barRadius: 20,
  widthRatio: 1,
  animationSpeed: 1,
  frameCount: 0,
  animationTimingFunction: easeInOut,
};
