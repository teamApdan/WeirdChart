import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import RatioBarChart from './RatioBarChart';

export default {
  title: 'ReactComponentLibrary/RatioBarChart',
  component: RatioBarChart,
} as ComponentMeta<typeof RatioBarChart>;

const Template: ComponentStory<typeof RatioBarChart> = (args) => <RatioBarChart {...args} />;

export const NormalSpeed = Template.bind({});
NormalSpeed.args = {
  dataset: [
    { label: 'A', value: 20 },
    { label: 'B', value: 20 },
    { label: 'C', value: 20 },
    { label: 'D', value: 0 },
  ],
  colors: 'light',
};

export const DoubleSpeed = Template.bind({});
DoubleSpeed.args = {
  dataset: [
    { label: 'A', value: 10 },
    { label: 'B', value: 10 },
    { label: 'B', value: 30 },
    { label: 'C', value: 0 },
  ],
  colors: 'dark',
  option: {
    animationSpeed: 2,
  },
};

export const HalfSpeed = Template.bind({});
HalfSpeed.args = {
  dataset: [
    { label: 'A', value: 50, color: '#ff9393' },
    { label: 'B', value: 20, color: '#b4ffb4' },
    { label: 'B', value: 10, color: '#679fff' },
    { label: 'D', value: 10, color: '#f995f0' },
    { label: 'E', value: 10, color: '#25A5b3' },
  ],
  option: {
    animationSpeed: 0.7,
    startAnimation: 'fromEqual',
  },
};

export const Grouping = Template.bind({});
Grouping.args = {
  dataset: [
    { label: 'good', value: 10 },
    { label: 'bad', value: 10 },
    { label: 'bad', value: 10 },
  ],
  grouping: true,
  colors: 'pastel',
  option: {
    startAnimation: 'fromEqual',
  },
};
