import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import BarChart from './BarChart';

export default {
  title: 'ReactComponentLibrary/BarChart',
  component: BarChart,
} as ComponentMeta<typeof BarChart>;

const Template: ComponentStory<typeof BarChart> = (args) => <BarChart {...args} />;

export const NormalSpeed = Template.bind({});
NormalSpeed.args = {
  dataset: [
    { label: 'A', value: 20, color: '#ff0000' },
    { label: 'B', value: 20, color: '#00ff00' },
    { label: 'C', value: 20, color: '#0000ff' },
    { label: 'D', value: 0 },
  ],
};

export const DoubleSpeed = Template.bind({});
DoubleSpeed.args = {
  dataset: [
    { label: 'A', value: 10, color: '#ff0000' },
    { label: 'B', value: 10, color: '#00ff00' },
    { label: 'B', value: 30, color: '#0000ff' },
    { label: 'C', value: 0 },
  ],
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
  },
};
