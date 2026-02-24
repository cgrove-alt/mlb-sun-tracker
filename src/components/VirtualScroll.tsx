'use client';

import React, { useState, useEffect, useRef, useCallback, CSSProperties } from 'react';

interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number | ((index: number) => number);
  renderItem: (item: T, index: number) => React.ReactNode;
  containerHeight?: number;
  overscan?: number;
  className?: string;
  style?: CSSProperties;
  onScroll?: (scrollTop: number) => void;
  scrollToIndex?: number;
  getItemKey?: (item: T, index: number) => string | number;
}

export default function VirtualScroll<T>({
  items,
  itemHeight,
  renderItem,
  containerHeight = 400,
  overscan = 3,
  className = '',
  style = {},
  onScroll,
  scrollToIndex,
  getItemKey,
}: VirtualScrollProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });

  // Calculate item heights
  const getItemOffset = useCallback(
    (index: number): number => {
      if (typeof itemHeight === 'number') {
        return index * itemHeight;
      }

      let offset = 0;
      for (let i = 0; i < index; i++) {
        offset += itemHeight(i);
      }
      return offset;
    },
    [itemHeight]
  );

  const getItemHeightValue = useCallback(
    (index: number): number => {
      return typeof itemHeight === 'number' ? itemHeight : itemHeight(index);
    },
    [itemHeight]
  );

  // Calculate total height
  const totalHeight = getItemOffset(items.length);

  // Calculate visible range
  const calculateVisibleRange = useCallback(
    (scrollTop: number) => {
      const viewportHeight = containerHeight;
      let start = 0;
      let accumulatedHeight = 0;

      // Find start index
      for (let i = 0; i < items.length; i++) {
        const height = getItemHeightValue(i);
        if (accumulatedHeight + height > scrollTop) {
          start = Math.max(0, i - overscan);
          break;
        }
        accumulatedHeight += height;
      }

      // Find end index
      let end = start;
      accumulatedHeight = getItemOffset(start);

      for (let i = start; i < items.length; i++) {
        if (accumulatedHeight > scrollTop + viewportHeight) {
          end = Math.min(items.length, i + overscan);
          break;
        }
        accumulatedHeight += getItemHeightValue(i);
      }

      // Ensure we show at least some items
      if (end === start) {
        end = Math.min(items.length, start + Math.ceil(viewportHeight / getItemHeightValue(0)) + overscan * 2);
      }

      return { start, end };
    },
    [items.length, containerHeight, overscan, getItemHeightValue, getItemOffset]
  );

  // Handle scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const scrollTop = containerRef.current.scrollTop;
    scrollPositionRef.current = scrollTop;

    const newRange = calculateVisibleRange(scrollTop);
    setVisibleRange(newRange);

    if (onScroll) {
      onScroll(scrollTop);
    }
  }, [calculateVisibleRange, onScroll]);

  // Initial calculation
  useEffect(() => {
    const newRange = calculateVisibleRange(0);
    setVisibleRange(newRange);
  }, [calculateVisibleRange]);

  // Scroll to index
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      const offset = getItemOffset(scrollToIndex);
      containerRef.current.scrollTop = offset;
      handleScroll();
    }
  }, [scrollToIndex, getItemOffset, handleScroll]);

  // Render visible items
  const visibleItems = [];
  for (let i = visibleRange.start; i < visibleRange.end && i < items.length; i++) {
    const item = items[i];
    const key = getItemKey ? getItemKey(item, i) : i;
    const offset = getItemOffset(i);
    const height = getItemHeightValue(i);

    visibleItems.push(
      <div
        key={key}
        style={{
          position: 'absolute',
          top: offset,
          left: 0,
          right: 0,
          height,
        }}
      >
        {renderItem(item, i)}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`virtual-scroll-container ${className}`}
      style={{
        position: 'relative',
        height: containerHeight,
        overflow: 'auto',
        ...style,
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          position: 'relative',
          height: totalHeight,
        }}
      >
        {visibleItems}
      </div>
    </div>
  );
}

// Hook for virtual scrolling with dynamic loading
export function useVirtualScroll<T>(
  items: T[],
  options: {
    itemHeight: number | ((index: number) => number);
    containerHeight?: number;
    overscan?: number;
    loadMore?: () => Promise<void>;
    hasMore?: boolean;
    loadThreshold?: number;
  }
) {
  const [loading, setLoading] = useState(false);
  const { loadMore, hasMore = false, loadThreshold = 0.8 } = options;

  const handleScroll = useCallback(
    async (scrollTop: number) => {
      if (!loadMore || !hasMore || loading) return;

      const containerHeight = options.containerHeight || 400;
      const totalHeight =
        typeof options.itemHeight === 'number'
          ? items.length * options.itemHeight
          : items.reduce((acc, _, i) => acc + (options.itemHeight as Function)(i), 0);

      const scrollPercentage = (scrollTop + containerHeight) / totalHeight;

      if (scrollPercentage >= loadThreshold) {
        setLoading(true);
        try {
          await loadMore();
        } finally {
          setLoading(false);
        }
      }
    },
    [items, loading, loadMore, hasMore, loadThreshold, options.itemHeight, options.containerHeight]
  );

  return {
    handleScroll,
    loading,
  };
}