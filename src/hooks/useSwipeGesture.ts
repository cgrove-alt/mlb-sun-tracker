import { useRef, useEffect, useCallback } from 'react';
import { useHapticFeedback } from './useHapticFeedback';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  velocity?: number;
  preventDefault?: boolean;
  trackMouse?: boolean;
  enableHaptic?: boolean;
}

interface TouchData {
  startX: number;
  startY: number;
  startTime: number;
  currentX: number;
  currentY: number;
}

export function useSwipeGesture(config: SwipeConfig) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    velocity = 0.3,
    preventDefault = false,
    trackMouse = false,
    enableHaptic = true
  } = config;

  const touchData = useRef<TouchData | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);
  const haptic = useHapticFeedback();

  const handleSwipeEnd = useCallback(() => {
    if (!touchData.current) return;

    const { startX, startY, startTime, currentX, currentY } = touchData.current;
    const deltaX = currentX - startX;
    const deltaY = currentY - startY;
    const deltaTime = Date.now() - startTime;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Calculate velocity
    const velocityX = absX / deltaTime;
    const velocityY = absY / deltaTime;

    // Determine if it's a valid swipe
    const isValidSwipe = (
      (absX > threshold || absY > threshold) &&
      (velocityX > velocity || velocityY > velocity)
    );

    if (!isValidSwipe) {
      touchData.current = null;
      return;
    }

    // Determine swipe direction
    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        if (enableHaptic) haptic.medium();
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        if (enableHaptic) haptic.medium();
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        if (enableHaptic) haptic.medium();
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        if (enableHaptic) haptic.medium();
        onSwipeUp();
      }
    }

    touchData.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocity, haptic, enableHaptic]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchData.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      currentX: touch.clientX,
      currentY: touch.clientY
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchData.current) return;

    const touch = e.touches[0];
    touchData.current.currentX = touch.clientX;
    touchData.current.currentY = touch.clientY;

    // Only prevent default if it's clearly a horizontal swipe
    if (preventDefault) {
      const deltaX = Math.abs(touch.clientX - touchData.current.startX);
      const deltaY = Math.abs(touch.clientY - touchData.current.startY);
      
      // If horizontal movement is greater than vertical, prevent default
      if (deltaX > deltaY && deltaX > 10) {
        e.preventDefault();
      }
    }
  }, [preventDefault]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    handleSwipeEnd();
  }, [handleSwipeEnd]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!trackMouse) return;
    
    touchData.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      currentX: e.clientX,
      currentY: e.clientY
    };
  }, [trackMouse]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!trackMouse || !touchData.current) return;
    
    touchData.current.currentX = e.clientX;
    touchData.current.currentY = e.clientY;
  }, [trackMouse]);

  const handleMouseUp = useCallback(() => {
    if (!trackMouse) return;
    handleSwipeEnd();
  }, [trackMouse, handleSwipeEnd]);

  const ref = useCallback((element: HTMLElement | null) => {
    if (elementRef.current) {
      // Clean up old listeners
      elementRef.current.removeEventListener('touchstart', handleTouchStart);
      elementRef.current.removeEventListener('touchmove', handleTouchMove);
      elementRef.current.removeEventListener('touchend', handleTouchEnd);
      
      if (trackMouse) {
        elementRef.current.removeEventListener('mousedown', handleMouseDown);
        elementRef.current.removeEventListener('mousemove', handleMouseMove);
        elementRef.current.removeEventListener('mouseup', handleMouseUp);
      }
    }

    elementRef.current = element;

    if (element) {
      // Add new listeners - always passive for touchstart and touchend
      element.addEventListener('touchstart', handleTouchStart, { passive: true });
      element.addEventListener('touchmove', handleTouchMove, { passive: false });
      element.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      if (trackMouse) {
        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseup', handleMouseUp);
      }
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, preventDefault, trackMouse]);

  useEffect(() => {
    return () => {
      if (elementRef.current) {
        elementRef.current.removeEventListener('touchstart', handleTouchStart);
        elementRef.current.removeEventListener('touchmove', handleTouchMove);
        elementRef.current.removeEventListener('touchend', handleTouchEnd);
        
        if (trackMouse) {
          elementRef.current.removeEventListener('mousedown', handleMouseDown);
          elementRef.current.removeEventListener('mousemove', handleMouseMove);
          elementRef.current.removeEventListener('mouseup', handleMouseUp);
        }
      }
    };
  }, []);

  return ref;
}

// Hook for swipeable carousel
export function useSwipeableCarousel<T>(
  items: T[],
  initialIndex = 0,
  onChange?: (index: number, item: T) => void
) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const haptic = useHapticFeedback();

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentIndex(nextIndex);
    haptic.light();
    onChange?.(nextIndex, items[nextIndex]);
  }, [currentIndex, items, haptic, onChange]);

  const goToPrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    setCurrentIndex(prevIndex);
    haptic.light();
    onChange?.(prevIndex, items[prevIndex]);
  }, [currentIndex, items, haptic, onChange]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
      haptic.light();
      onChange?.(index, items[index]);
    }
  }, [items, haptic, onChange]);

  const swipeRef = useSwipeGesture({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 30,
    velocity: 0.2,
    preventDefault: true
  });

  return {
    currentIndex,
    currentItem: items[currentIndex],
    goToNext,
    goToPrevious,
    goToIndex,
    swipeRef,
    isFirst: currentIndex === 0,
    isLast: currentIndex === items.length - 1
  };
}

import { useState } from 'react';