/**
 * Regression test for the Rules of Hooks violation in useMultipleLoadingStates.
 *
 * It used to call useLoadingState() once per key inside keys.forEach(...), so the
 * number of hook calls tracked keys.length. React matches hooks by call order, so
 * changing the key set between renders shifted every later hook and React threw
 * "Rendered more hooks than during the previous render."
 *
 * The hook now holds all keys in a single useState map, so the hook count is
 * constant. These tests render it with a changing key set — which is exactly what
 * used to crash.
 */
import { renderHook, act } from '@testing-library/react';
import { useMultipleLoadingStates } from '../useLoadingState';

describe('useMultipleLoadingStates', () => {
  it('exposes a state entry for every key', () => {
    const { result } = renderHook(() =>
      useMultipleLoadingStates<{ a: string; b: string }>(['a', 'b'])
    );

    expect(Object.keys(result.current.states).sort()).toEqual(['a', 'b']);
    expect(result.current.allLoading).toBe(true); // initialLoading defaults to true
  });

  it('does not throw when the key set GROWS between renders', () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useMultipleLoadingStates<Record<string, string>>(keys),
      { initialProps: { keys: ['a', 'b'] as string[] } }
    );

    expect(() => rerender({ keys: ['a', 'b', 'c', 'd'] })).not.toThrow();
    expect(Object.keys(result.current.states).sort()).toEqual(['a', 'b', 'c', 'd']);
  });

  it('does not throw when the key set SHRINKS between renders', () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useMultipleLoadingStates<Record<string, string>>(keys),
      { initialProps: { keys: ['a', 'b', 'c'] as string[] } }
    );

    expect(() => rerender({ keys: ['a'] })).not.toThrow();
    expect(Object.keys(result.current.states)).toEqual(['a']);
  });

  it('keeps each key\'s state independent and correctly addressed', () => {
    const { result } = renderHook(() =>
      useMultipleLoadingStates<{ a: string; b: string }>(['a', 'b'], { minLoadingTime: 0 })
    );

    act(() => { result.current.states.a.setData('alpha'); });
    expect(result.current.states.a.data).toBe('alpha');
    expect(result.current.states.b.data).toBeNull();

    act(() => { result.current.states.b.setData('beta'); });
    expect(result.current.states.a.data).toBe('alpha');
    expect(result.current.states.b.data).toBe('beta');
  });

  it('does not reassign state to the wrong key when keys are reordered', () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useMultipleLoadingStates<Record<string, string>>(keys, { minLoadingTime: 0 }),
      { initialProps: { keys: ['a', 'b'] as string[] } }
    );

    act(() => { result.current.states.a.setData('alpha'); });

    // Order swap: with per-key hook calls this silently handed 'a' its sibling's slot.
    rerender({ keys: ['b', 'a'] });

    expect(result.current.states.a.data).toBe('alpha');
    expect(result.current.states.b.data).toBeNull();
  });

  it('reports aggregate flags across keys', () => {
    const { result } = renderHook(() =>
      useMultipleLoadingStates<{ a: string; b: string }>(['a', 'b'], {
        initialLoading: false,
        minLoadingTime: 0
      })
    );

    expect(result.current.anyLoading).toBe(false);
    expect(result.current.anyError).toBe(false);

    act(() => { result.current.states.a.setError(new Error('boom')); });
    expect(result.current.anyError).toBe(true);

    act(() => {
      result.current.states.a.setData('x');
      result.current.states.b.setData('y');
    });
    expect(result.current.allSuccess).toBe(true);
  });
});
