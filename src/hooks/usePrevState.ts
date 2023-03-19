import { useEffect, useRef } from 'react';

const usePrevState = <T = any>(state: T) => {
  const ref = useRef(state);
  useEffect(() => {
    ref.current = state;
  }, [state]);
  return ref.current;
};

export default usePrevState;
