import { useRef, useEffect, TouchEvent } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  threshold?: number; // Minimum distance for swipe
  velocity?: number; // Minimum velocity for swipe
  preventDefaultTouchmoveEvent?: boolean;
  trackMouse?: boolean; // Also track mouse events for testing
}

export const useSwipeGesture = (
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) => {
  const {
    threshold = 50,
    velocity = 0.3,
    preventDefaultTouchmoveEvent = false,
    trackMouse = false
  } = config;

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let isMouseDown = false;

    const handleStart = (clientX: number, clientY: number) => {
      touchStartX.current = clientX;
      touchStartY.current = clientY;
      touchStartTime.current = Date.now();
    };

    const handleEnd = (clientX: number, clientY: number) => {
      const deltaX = clientX - touchStartX.current;
      const deltaY = clientY - touchStartY.current;
      const deltaTime = Date.now() - touchStartTime.current;
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Check if it's a swipe (not just a tap)
      if (Math.max(absX, absY) < threshold) return;

      // Calculate velocity
      const velocityX = absX / deltaTime;
      const velocityY = absY / deltaTime;

      // Determine swipe direction
      if (absX > absY && velocityX > velocity) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      } else if (absY > absX && velocityY > velocity) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    };

    // Touch event handlers
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      handleEnd(touch.clientX, touch.clientY);
    };

    // Mouse event handlers (for testing)
    const handleMouseDown = (e: MouseEvent) => {
      if (!trackMouse) return;
      isMouseDown = true;
      handleStart(e.clientX, e.clientY);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!trackMouse || !isMouseDown) return;
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault();
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!trackMouse || !isMouseDown) return;
      isMouseDown = false;
      handleEnd(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      isMouseDown = false;
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart as any, { passive: true });
    element.addEventListener('touchmove', handleTouchMove as any, { passive: !preventDefaultTouchmoveEvent });
    element.addEventListener('touchend', handleTouchEnd as any, { passive: true });

    if (trackMouse) {
      element.addEventListener('mousedown', handleMouseDown);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseup', handleMouseUp);
      element.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart as any);
      element.removeEventListener('touchmove', handleTouchMove as any);
      element.removeEventListener('touchend', handleTouchEnd as any);

      if (trackMouse) {
        element.removeEventListener('mousedown', handleMouseDown);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('mouseup', handleMouseUp);
        element.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [handlers, threshold, velocity, preventDefaultTouchmoveEvent, trackMouse]);

  return elementRef;
};