import { useEffect, useRef, useState, useCallback } from 'react';
import { useHapticFeedback } from './useHapticFeedback';

interface PullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  enabled?: boolean;
}

interface PullToRefreshState {
  isPulling: boolean;
  pullDistance: number;
  isRefreshing: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  enabled = true,
}: PullToRefreshOptions) => {
  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
  });

  const haptic = useHapticFeedback();
  const touchStartY = useRef<number>(0);
  const scrollableElement = useRef<HTMLElement | null>(null);
  const thresholdReached = useRef<boolean>(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    // Only activate if scrolled to top
    const element = scrollableElement.current || document.documentElement;
    if (element.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || state.isRefreshing) return;

    const element = scrollableElement.current || document.documentElement;

    // Only pull if at top of scroll
    if (element.scrollTop === 0 && touchStartY.current > 0) {
      const currentY = e.touches[0].clientY;
      const pullDistance = Math.max(0, currentY - touchStartY.current);

      if (pullDistance > 0) {
        // Prevent default to stop page scroll
        e.preventDefault();

        // Apply resistance curve - gets harder to pull as distance increases
        const resistanceFactor = 1 - (pullDistance / maxPullDistance) * 0.5;
        const adjustedDistance = Math.min(pullDistance * resistanceFactor, maxPullDistance);

        setState(prev => ({
          ...prev,
          isPulling: true,
          pullDistance: adjustedDistance,
        }));

        // Haptic feedback when threshold reached
        if (adjustedDistance >= threshold && !thresholdReached.current) {
          haptic.light();
          thresholdReached.current = true;
        } else if (adjustedDistance < threshold && thresholdReached.current) {
          thresholdReached.current = false;
        }
      }
    }
  }, [enabled, state.isRefreshing, threshold, maxPullDistance, haptic]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled) return;

    const { isPulling, pullDistance } = state;

    if (isPulling) {
      if (pullDistance >= threshold) {
        // Trigger refresh
        setState(prev => ({
          ...prev,
          isRefreshing: true,
          isPulling: false,
        }));

        haptic.success(); // Success haptic when refresh triggered

        try {
          await onRefresh();
        } catch (error) {
          console.error('Pull-to-refresh error:', error);
        } finally {
          setState(prev => ({
            ...prev,
            isRefreshing: false,
            pullDistance: 0,
          }));
        }
      } else {
        // Snap back without refreshing
        setState(prev => ({
          ...prev,
          isPulling: false,
          pullDistance: 0,
        }));
      }
    }

    touchStartY.current = 0;
    thresholdReached.current = false;
  }, [enabled, state, threshold, haptic, onRefresh]);

  useEffect(() => {
    if (!enabled) return;

    const element = scrollableElement.current || document.body;

    // Add touch event listeners with passive: false for preventDefault
    const options = { passive: false };
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, options);
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ...state,
    setScrollableElement: (element: HTMLElement | null) => {
      scrollableElement.current = element;
    },
    progress: Math.min(state.pullDistance / threshold, 1),
  };
};
