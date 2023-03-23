# WeirdChart

Styled Ratio Bar Chart for Dynamic Data made with Canvas API.

<br>

# Quickstart

Install this library with peer dependencies:

```shell
npm i @teamapdan/weirdchart
yarn add @teamapdan/weirdchart
pnpm add @teamapdan/weirdchart
```

Then, import and use individual components:

```tsx
import {BarChart} from '@teamapdan/weirdchart';

<BarChart dataset={...} />
```

<br>

# Document

All component's width and height are 100% of parent element. So if you want to set width and height, you should set parent element's width and height. Or you can set with canvas props like this.

```tsx
<BarChart
  dataset={...}
  width={300}
  height={300}
/>
```

<br>

## BarChart

### Useage

```tsx
import React from 'react';
import { BarChart } from '@teamapdan/weirdchart';

function App() {
  return (
    <div className="App" style={{ width: '300px' }}>
      <BarChart
        dataset={[...]}
        option={...}
        {...props}
      />
    </div>
  );
}
```

### Props

Also supports all standard `<canvas>` props.

<table>
  <thead>
	<tr>
	  <th>Name</th>
	  <th>Type</th>
	  <th>Default</th>
	  <th>Description</th>
	</tr>
  </thead>
  <tbody>
	<tr>
	  <td>dataset</td>
	  <td><code>Dataset</code></td>
	  <td>[]</td>
	  <td>Dataset to be displayed in the chart.</td>
	</tr>
	<tr>
	  <td>colors</td>
	  <td><code>string[] | Theme</code></td>
	  <td>'pastel'</td>
	  <td>Custom color arry for Bar Or choose from Theme. string[] must be hex color code.</td>
	</tr>
	<tr>
	  <td>option</td>
	  <td><code>Option</code></td>
	  <td>{}</td>
	  <td>Options for the chart.</td>
	</tr>
  </tbody>
</table>

<br>

# Example

## BarChart

- use Theme

```tsx
<BarChart
  dataset={[
    { name: 'A', value: 10 },
    { name: 'B', value: 0, color: '#ff0000' }, // you can set custom color for each bar
    { name: 'C', value: 30 },
    { name: 'D', value: 40 },
  ]}
  colors='dark'
  option={{
    animationSpeed: 0.5, // default 1
  }}
/>
```

- use custom color

```tsx
<BarChart
  dataset={[
    { name: 'A', value: 10 },
    { name: 'B', value: 0 },
    { name: 'C', value: 30 },
    { name: 'D', value: 40 },
  ]}
  colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00']}
/>
```

- set startAnimation

```tsx
<BarChart
  dataset={[
	{ name: 'A', value: 10 },
	{ name: 'B', value: 0 },
	{ name: 'C', value: 30 },
	{ name: 'D', value: 40 },
  ]}
  colors={['#ff0000', '#00ff00', '#0000ff', '#ffff00']}
  option={
	startAnimation: 'fromEqual', // or 'fromZero',
  /**
   * function customTimingFunction(frameCount: number) {
   *  return frameCount / 100;
   * }
   */
  }
  animationTimanimationTimingFunctioning: customTimingFunction,
  }
/>
```

# License

MIT Licensed Copyright (c) 2020 Jeremy Ayerst

```

```
