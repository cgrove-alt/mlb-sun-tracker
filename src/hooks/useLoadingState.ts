import { useState, useCallback, useRef, useEffect } from 'react';

interface LoadingState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  isInitialLoad: boolean;
  isRefreshing: boolean;
  retryCount: number;
}

interface UseLoadingStateOptions {
  initialLoading?: boolean;
  minLoadingTime?: number;
  retryLimit?: number;
  retryDelay?: number;
}

export function useLoadingState<T = any>(
  options: UseLoadingStateOptions = {}
) {
  const {
    initialLoading = true,
    minLoadingTime = 300,
    retryLimit = 3,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<LoadingState<T>>({
    data: null,
    loading: initialLoading,
    error: null,
    isInitialLoad: true,
    isRefreshing: false,
    retryCount: 0
  });

  const loadingTimeoutRef = useRef<number | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);
  const loadStartTimeRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        window.clearTimeout(loadingTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  const setLoading = useCallback((loading: boolean, isRefreshing = false) => {
    if (loading) {
      loadStartTimeRef.current = Date.now();
      setState(prev => ({
        ...prev,
        loading: true,
        isRefreshing: !prev.isInitialLoad && isRefreshing,
        error: null
      }));
    } else {
      // Ensure minimum loading time for smooth transitions
      const loadTime = Date.now() - loadStartTimeRef.current;
      const remainingTime = Math.max(0, minLoadingTime - loadTime);

      if (remainingTime > 0) {
        loadingTimeoutRef.current = window.setTimeout(() => {
          setState(prev => ({
            ...prev,
            loading: false,
            isRefreshing: false,
            isInitialLoad: false
          }));
        }, remainingTime);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          isRefreshing: false,
          isInitialLoad: false
        }));
      }
    }
  }, [minLoadingTime]);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({
      ...prev,
      data,
      error: null,
      retryCount: 0
    }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({
      ...prev,
      error,
      loading: false,
      isRefreshing: false
    }));
  }, []);

  const retry = useCallback(() => {
    if (state.retryCount >= retryLimit) {
      return false;
    }

    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      error: null
    }));

    return true;
  }, [state.retryCount, retryLimit]);

  const reset = useCallback(() => {
    if (loadingTimeoutRef.current) {
      window.clearTimeout(loadingTimeoutRef.current);
    }
    if (retryTimeoutRef.current) {
      window.clearTimeout(retryTimeoutRef.current);
    }

    setState({
      data: null,
      loading: false,
      error: null,
      isInitialLoad: true,
      isRefreshing: false,
      retryCount: 0
    });
  }, []);

  const execute = useCallback(async <R = T>(
    asyncFunction: () => Promise<R>,
    options: {
      onSuccess?: (data: R) => void;
      onError?: (error: Error) => void;
      isRefresh?: boolean;
      autoRetry?: boolean;
    } = {}
  ) => {
    const { onSuccess, onError, isRefresh = false, autoRetry = true } = options;

    try {
      setLoading(true, isRefresh);
      const result = await asyncFunction();
      
      setData(result as any);
      setLoading(false);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setError(err);

      // Auto-retry for transient errors
      if (autoRetry && state.retryCount < retryLimit) {
        const isNetworkError = err.message.toLowerCase().includes('network') || 
                             err.message.toLowerCase().includes('fetch');
        
        if (isNetworkError) {
          const delay = retryDelay * Math.pow(2, state.retryCount);
          retryTimeoutRef.current = window.setTimeout(() => {
            if (retry()) {
              execute(asyncFunction, options);
            }
          }, delay);
        }
      }

      if (onError) {
        onError(err);
      }
      
      throw err;
    }
  }, [setLoading, setData, setError, retry, state.retryCount, retryLimit, retryDelay]);

  return {
    ...state,
    setLoading,
    setData,
    setError,
    retry,
    reset,
    execute
  };
}

// Hook for managing multiple loading states
export function useMultipleLoadingStates<T extends Record<string, any>>(
  keys: (keyof T)[],
  options?: UseLoadingStateOptions
) {
  const states = {} as Record<keyof T, ReturnType<typeof useLoadingState>>;
  
  keys.forEach(key => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    states[key] = useLoadingState(options);
  });

  const allLoading = keys.every(key => states[key].loading);
  const anyLoading = keys.some(key => states[key].loading);
  const anyError = keys.some(key => states[key].error);
  const allSuccess = keys.every(key => states[key].data !== null && !states[key].error);

  return {
    states,
    allLoading,
    anyLoading,
    anyError,
    allSuccess
  };
}