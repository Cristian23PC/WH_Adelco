import { useRef, useEffect } from 'react';
import { debounce } from '../../debounce';

interface UseDebounceProps {
  fn: (...args: any[]) => any;
  delay?: number;
}

type UseDebounceReturnType = (...args: any[]) => any;

const useDebounce = ({
  fn,
  delay = 500
}: UseDebounceProps): UseDebounceReturnType => {
  const debouncedFunction = useRef(debounce(fn, delay)).current;

  useEffect(() => {
    return () => {
      debouncedFunction.cancel();
    };
  }, [debouncedFunction]);

  return debouncedFunction;
};

export default useDebounce;
