'use client';

import React from 'react';
import styles from './SkeletonLoader.module.css';

interface SkeletonLoaderProps {
  type?: 'card' | 'bar' | 'tabs' | 'pills' | 'diagram';
  count?: number;
  className?: string;
}

/**
 * SkeletonLoader - Loading placeholder for layout transitions
 *
 * Provides visual feedback during loading states with animated placeholders.
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 1,
  className = '',
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (type === 'tabs') {
    return (
      <div className={`${styles.tabsContainer} ${className}`} aria-busy="true" aria-label="Loading tabs">
        {items.map((i) => (
          <div key={i} className={styles.tabSkeleton} />
        ))}
      </div>
    );
  }

  if (type === 'pills') {
    return (
      <div className={`${styles.pillsContainer} ${className}`} aria-busy="true" aria-label="Loading filters">
        {items.map((i) => (
          <div key={i} className={styles.pillSkeleton} />
        ))}
      </div>
    );
  }

  if (type === 'bar') {
    return (
      <div className={`${styles.barContainer} ${className}`} aria-busy="true" aria-label="Loading selector">
        <div className={styles.barSkeleton} />
        <div className={styles.barSkeletonSmall} />
      </div>
    );
  }

  if (type === 'diagram') {
    return (
      <div className={`${styles.diagramContainer} ${className}`} aria-busy="true" aria-label="Loading diagram">
        <div className={styles.diagramSkeleton} />
      </div>
    );
  }

  // Default: card skeleton
  return (
    <div className={`${styles.cardsContainer} ${className}`} aria-busy="true" aria-label="Loading content">
      {items.map((i) => (
        <div key={i} className={styles.cardSkeleton}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle} />
            <div className={styles.cardBadge} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLine} />
            <div className={styles.cardLineShort} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
