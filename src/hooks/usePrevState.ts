import { useEffect, useRef } from 'react';

const usePrevState = <T extends any[]>(state: T): T => {
  const ref = useRef<T>(state);

  useEffect(() => {
    ref.current = state;
  }, [state]);

  return ref.current;
};

export default usePrevState;
