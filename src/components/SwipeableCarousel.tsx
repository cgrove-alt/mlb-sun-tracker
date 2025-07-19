import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { haptics } from '../utils/haptics';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import './SwipeableCarousel.css';

interface SwipeableCarouselProps {
  items: ReactNode[];
  itemsPerView?: number;
  gap?: number;
  showIndicators?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  onIndexChange?: (index: number) => void;
}

export const SwipeableCarousel: React.FC<SwipeableCarouselProps> = ({
  items,
  itemsPerView = 1,
  gap = 16,
  showIndicators = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  onIndexChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout>();

  const totalPages = Math.ceil(items.length / itemsPerView);
  const canSwipeLeft = currentIndex > 0;
  const canSwipeRight = currentIndex < totalPages - 1;

  // Handle swipe gestures
  const swipeRef = useSwipeGesture({
    onSwipeLeft: () => {
      if (canSwipeRight) {
        goToIndex(currentIndex + 1);
      }
    },
    onSwipeRight: () => {
      if (canSwipeLeft) {
        goToIndex(currentIndex - 1);
      }
    }
  }, {
    threshold: 30,
    velocity: 0.2,
    trackMouse: true // Enable mouse for testing
  });

  // Set swipe ref to container
  useEffect(() => {
    if (containerRef.current) {
      (swipeRef as any).current = containerRef.current;
    }
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex(prev => {
          const next = prev + 1;
          return next >= totalPages ? 0 : next;
        });
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, isDragging, totalPages]);

  // Notify parent of index changes
  useEffect(() => {
    onIndexChange?.(currentIndex);
  }, [currentIndex, onIndexChange]);

  const goToIndex = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, totalPages - 1)));
    haptics.swipe();
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number, startX: number) => {
    if (!isDragging) return;
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    
    // Snap to next/previous based on drag distance
    const threshold = 50;
    if (dragOffset > threshold && canSwipeLeft) {
      goToIndex(currentIndex - 1);
    } else if (dragOffset < -threshold && canSwipeRight) {
      goToIndex(currentIndex + 1);
    }
    
    setDragOffset(0);
  };

  const getTransform = () => {
    const baseOffset = -(currentIndex * 100);
    const dragOffsetPercent = isDragging ? (dragOffset / (containerRef.current?.offsetWidth || 1)) * 100 : 0;
    return `translateX(${baseOffset + dragOffsetPercent}%)`;
  };

  return (
    <div className="swipeable-carousel">
      <div 
        ref={(el) => {
          if (el) {
            (containerRef as any).current = el;
            (swipeRef as any).current = el;
          }
        }}
        className="carousel-container"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => {
          if (isDragging && e.buttons === 1) {
            handleDragMove(e.clientX, e.clientX - dragOffset);
          }
        }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
      >
        <div 
          ref={trackRef}
          className="carousel-track"
          style={{
            transform: getTransform(),
            transition: isDragging ? 'none' : 'transform 0.3s ease-out',
            gap: `${gap}px`
          }}
        >
          {items.map((item, index) => (
            <div 
              key={index}
              className="carousel-item"
              style={{
                minWidth: `calc(${100 / itemsPerView}% - ${gap * (itemsPerView - 1) / itemsPerView}px)`
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {showIndicators && totalPages > 1 && (
        <div className="carousel-indicators">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToIndex(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation buttons for accessibility */}
      {canSwipeLeft && (
        <button
          className="carousel-nav carousel-nav-prev"
          onClick={() => goToIndex(currentIndex - 1)}
          aria-label="Previous"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
      )}

      {canSwipeRight && (
        <button
          className="carousel-nav carousel-nav-next"
          onClick={() => goToIndex(currentIndex + 1)}
          aria-label="Next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>
      )}
    </div>
  );
};