import { useState } from 'react';
import { Dataset, CumulativeDataset, Position } from '../components/RatioBarChart/RatioBarChart.types';
import usePrevState from './usePrevState';

const useBarChartDataset = (dataset: Dataset[]) => {
  const [isMount, setIsMount] = useState(false);
  const cumulativeDataset = makeCumulativeDataset(dataset);
  const defaultDataset = makeCumulativeDataset(makeDefaultDataset(dataset));
  const prevDataset = usePrevState<CumulativeDataset[]>(cumulativeDataset);

  function makeDefaultDataset(dataset: Dataset[]): Dataset[] {
    return dataset.map((data) => ({ ...data, value: 1 }));
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

  function mount() {
    setIsMount(true);
  }

  return { isMount, cumulativeDataset, defaultDataset, prevDataset, mount };
};

export default useBarChartDataset;
