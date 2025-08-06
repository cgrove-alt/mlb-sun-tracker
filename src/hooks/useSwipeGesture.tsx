import { useEffect, useRef, useState } from 'react';

interface SwipeOptions {
  threshold?: number;
  preventScroll?: boolean;
  enableHaptic?: boolean;
}

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
}

interface TouchPosition {
  x: number;
  y: number;
  time: number;
}

export const useSwipeGesture = (
  handlers: SwipeHandlers,
  options: SwipeOptions = {}
) => {
  const {
    threshold = 50,
    preventScroll = false,
    enableHaptic = true
  } = options;

  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const startPos = useRef<TouchPosition | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const triggerHaptic = () => {
    if (enableHaptic && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setIsSwiping(true);
    handlers.onSwipeStart?.();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!startPos.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;

    if (preventScroll && Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
    }

    // Determine swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    } else {
      setSwipeDirection(deltaY > 0 ? 'down' : 'up');
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!startPos.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    const deltaTime = Date.now() - startPos.current.time;
    const velocity = Math.sqrt(deltaX ** 2 + deltaY ** 2) / deltaTime;

    // Check if swipe meets threshold
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold || velocity > 0.5) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
          triggerHaptic();
        } else {
          handlers.onSwipeLeft?.();
          triggerHaptic();
        }
      } else {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
          triggerHaptic();
        } else {
          handlers.onSwipeUp?.();
          triggerHaptic();
        }
      }
    }

    startPos.current = null;
    setIsSwiping(false);
    setSwipeDirection(null);
    handlers.onSwipeEnd?.();
  };

  const bind = (element: HTMLElement | null) => {
    if (!element) return;
    
    elementRef.current = element;
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventScroll });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
  };

  const unbind = () => {
    if (!elementRef.current) return;
    
    elementRef.current.removeEventListener('touchstart', handleTouchStart);
    elementRef.current.removeEventListener('touchmove', handleTouchMove);
    elementRef.current.removeEventListener('touchend', handleTouchEnd);
  };

  useEffect(() => {
    return () => {
      unbind();
    };
  }, []);

  return {
    bind,
    unbind,
    isSwiping,
    swipeDirection
  };
};

// Hook for swipeable cards
export const useSwipeableCard = (
  onSwipeAway?: (direction: 'left' | 'right') => void,
  threshold = 100
) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const startPos = useRef<TouchPosition | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startPos.current) return;

    const touch = e.touches[0];
    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;

    setOffset({ x: deltaX, y: deltaY * 0.3 });
    setOpacity(1 - Math.abs(deltaX) / (threshold * 2));
  };

  const handleTouchEnd = () => {
    if (!startPos.current) return;

    const shouldSwipeAway = Math.abs(offset.x) > threshold;

    if (shouldSwipeAway && onSwipeAway) {
      const direction = offset.x > 0 ? 'right' : 'left';
      onSwipeAway(direction);
      
      // Animate card off screen
      setOffset({ x: offset.x * 5, y: offset.y });
      setOpacity(0);
    } else {
      // Spring back to center
      setOffset({ x: 0, y: 0 });
      setOpacity(1);
    }

    setTimeout(() => {
      setIsDragging(false);
      startPos.current = null;
    }, 300);
  };

  const cardStyle: React.CSSProperties = {
    transform: `translate(${offset.x}px, ${offset.y}px) rotate(${offset.x * 0.1}deg)`,
    opacity,
    transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  return {
    cardStyle,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
};

// Hook for pull-to-refresh
export const usePullToRefresh = (
  onRefresh: () => Promise<void>,
  threshold = 80
) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY.current;

    if (distance > 0 && window.scrollY === 0) {
      e.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(distance, threshold * 1.5));
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setIsPulling(false);
    setPullDistance(0);
    startY.current = null;
  };

  const indicatorStyle: React.CSSProperties = {
    transform: `translateY(${pullDistance}px) rotate(${pullDistance * 2}deg)`,
    opacity: Math.min(pullDistance / threshold, 1),
    transition: isPulling ? 'none' : 'all 0.3s ease-out'
  };

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    indicatorStyle,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
};