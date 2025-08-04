import { useState, useCallback, useRef, useMemo } from 'react';
import { debounce } from '../utils/performanceUtils';

// Custom hook to batch multiple state updates
export function useBatchedState<T extends Record<string, any>>(initialState: T) {
  const [state, setState] = useState(initialState);
  const pendingUpdates = useRef<Partial<T>>({});
  const updateTimeoutRef = useRef<NodeJS.Timeout>();

  const batchUpdate = useCallback((updates: Partial<T>) => {
    pendingUpdates.current = { ...pendingUpdates.current, ...updates };
    
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    
    updateTimeoutRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, ...pendingUpdates.current }));
      pendingUpdates.current = {};
    }, 0);
  }, []);

  return [state, batchUpdate] as const;
}

// Custom hook for debounced state updates
export function useDebouncedState<T>(initialValue: T, delay: number = 300) {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);
  
  const debouncedSetValue = useMemo(
    () => debounce((newValue: T) => {
      setDebouncedValue(newValue);
    }, delay),
    [delay]
  );

  const updateValue = useCallback((newValue: T) => {
    setValue(newValue);
    debouncedSetValue(newValue);
  }, [debouncedSetValue]);

  return [value, debouncedValue, updateValue] as const;
}

// Custom hook for memoized calculations
export function useMemoizedCalculation<T, D extends readonly unknown[]>(
  calculation: () => T,
  deps: D,
  shouldUpdate?: (prev: D, next: D) => boolean
): T {
  const prevDepsRef = useRef<D>();
  const resultRef = useRef<T>();

  if (!prevDepsRef.current || !resultRef.current || 
      (shouldUpdate ? shouldUpdate(prevDepsRef.current, deps) : 
       !deps.every((dep, i) => dep === prevDepsRef.current![i]))) {
    resultRef.current = calculation();
    prevDepsRef.current = deps;
  }

  return resultRef.current;
}