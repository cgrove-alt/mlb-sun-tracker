import React from 'react';
import './PullToRefreshIndicator.css';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  isRefreshing: boolean;
  progress: number; // 0 to 1
}

export const PullToRefreshIndicator: React.FC<PullToRefreshIndicatorProps> = ({
  pullDistance,
  isRefreshing,
  progress,
}) => {
  // Don't render if not pulling or refreshing
  if (pullDistance === 0 && !isRefreshing) {
    return null;
  }

  const rotation = progress * 360; // Full rotation when threshold reached
  const scale = Math.min(progress * 1.2, 1);
  const opacity = Math.min(progress * 1.5, 1);

  return (
    <div
      className="pull-to-refresh-indicator"
      style={{
        transform: `translateY(${pullDistance}px)`,
        opacity,
      }}
    >
      <div className="pull-to-refresh-content">
        {isRefreshing ? (
          // Spinning loader when refreshing
          <div className="pull-to-refresh-spinner" />
        ) : (
          // Arrow that rotates as you pull
          <svg
            className="pull-to-refresh-arrow"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              transform: `rotate(${rotation}deg) scale(${scale})`,
            }}
          >
            <path
              d="M12 5v14m0-14l-4 4m4-4l4 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        <span className="pull-to-refresh-text">
          {isRefreshing
            ? 'Refreshing...'
            : progress >= 1
            ? 'Release to refresh'
            : 'Pull to refresh'}
        </span>
      </div>
    </div>
  );
};
