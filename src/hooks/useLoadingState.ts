import { useState, useCallback, useRef, useEffect, useMemo } from 'react';

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
      setLoading(false); // Ensure loading is set to false on error

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

// Hook for managing multiple loading states.
//
// This deliberately does NOT call useLoadingState() once per key. Doing that
// (as this hook previously did, inside a forEach with the rules-of-hooks lint
// error suppressed) makes the number of hook calls depend on `keys.length`.
// React identifies hooks purely by call order, so the moment `keys` grew or
// shrank between renders every subsequent hook shifted position and React threw
// "Rendered fewer hooks than expected" / returned another key's state.
//
// Instead all keys share ONE useState holding a map. The hook count is now
// constant regardless of how many keys are passed.
export function useMultipleLoadingStates<T extends Record<string, any>>(
  keys: (keyof T)[],
  options: UseLoadingStateOptions = {}
) {
  const {
    initialLoading = true,
    minLoadingTime = 300,
    retryLimit = 3
  } = options;

  const makeInitialState = useCallback((): LoadingState<any> => ({
    data: null,
    loading: initialLoading,
    error: null,
    isInitialLoad: true,
    isRefreshing: false,
    retryCount: 0
  }), [initialLoading]);

  const [stateMap, setStateMap] = useState<Record<string, LoadingState<any>>>({});
  const timeoutsRef = useRef<Record<string, number>>({});
  const loadStartRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      Object.values(timeouts).forEach(id => window.clearTimeout(id));
    };
  }, []);

  const update = useCallback((
    key: string,
    updater: (prev: LoadingState<any>) => LoadingState<any>
  ) => {
    setStateMap(prev => ({
      ...prev,
      [key]: updater(prev[key] ?? {
        data: null,
        loading: initialLoading,
        error: null,
        isInitialLoad: true,
        isRefreshing: false,
        retryCount: 0
      })
    }));
  }, [initialLoading]);

  // Stable per-key controls. Keyed by name rather than by call order, so adding
  // or removing keys can never desynchronise anything.
  const controlsFor = useCallback((key: string) => {
    const setLoading = (loading: boolean, isRefreshing = false) => {
      if (loading) {
        loadStartRef.current[key] = Date.now();
        update(key, prev => ({
          ...prev,
          loading: true,
          isRefreshing: !prev.isInitialLoad && isRefreshing,
          error: null
        }));
        return;
      }

      const elapsed = Date.now() - (loadStartRef.current[key] ?? 0);
      const remaining = Math.max(0, minLoadingTime - elapsed);
      const finish = () => update(key, prev => ({
        ...prev,
        loading: false,
        isRefreshing: false,
        isInitialLoad: false
      }));

      if (remaining > 0) {
        timeoutsRef.current[key] = window.setTimeout(finish, remaining);
      } else {
        finish();
      }
    };

    const setData = (data: any) =>
      update(key, prev => ({ ...prev, data, error: null, retryCount: 0 }));

    const setError = (error: Error | null) =>
      update(key, prev => ({ ...prev, error, loading: false, isRefreshing: false }));

    const retry = () => {
      const current = stateMap[key];
      if ((current?.retryCount ?? 0) >= retryLimit) return false;
      update(key, prev => ({ ...prev, retryCount: prev.retryCount + 1, error: null }));
      return true;
    };

    const reset = () => {
      if (timeoutsRef.current[key]) {
        window.clearTimeout(timeoutsRef.current[key]);
        delete timeoutsRef.current[key];
      }
      update(key, () => ({
        data: null,
        loading: false,
        error: null,
        isInitialLoad: true,
        isRefreshing: false,
        retryCount: 0
      }));
    };

    const execute = async <R,>(
      asyncFunction: () => Promise<R>,
      opts: {
        onSuccess?: (data: R) => void;
        onError?: (error: Error) => void;
        isRefresh?: boolean;
      } = {}
    ) => {
      const { onSuccess, onError, isRefresh = false } = opts;
      try {
        setLoading(true, isRefresh);
        const result = await asyncFunction();
        setData(result);
        setLoading(false);
        onSuccess?.(result);
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setError(err);
        setLoading(false);
        onError?.(err);
        throw err;
      }
    };

    return { setLoading, setData, setError, retry, reset, execute };
  }, [update, minLoadingTime, retryLimit, stateMap]);

  const states = useMemo(() => {
    const out = {} as Record<keyof T, LoadingState<any> & ReturnType<typeof controlsFor>>;
    for (const key of keys) {
      const k = String(key);
      out[key] = {
        ...(stateMap[k] ?? makeInitialState()),
        ...controlsFor(k)
      };
    }
    return out;
  }, [keys, stateMap, controlsFor, makeInitialState]);

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