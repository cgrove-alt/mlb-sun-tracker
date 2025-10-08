'use client';

import React from 'react';
import './SkeletonLoaders.css';

// Base Skeleton Component
export const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
}> = ({ width = '100%', height = '1rem', circle = false, className = '' }) => {
  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: circle ? '50%' : '8px',
  };

  return <div className={`skeleton ${className}`} style={style} />;
};

// Section Card Skeleton
export const SectionCardSkeleton: React.FC<{ variant?: 'compact' | 'default' | 'detailed' }> = ({
  variant = 'default'
}) => {
  if (variant === 'compact') {
    return (
      <div className="skeleton-card skeleton-card-compact">
        <div className="skeleton-header-compact">
          <Skeleton width="60%" height="1.25rem" />
          <Skeleton width="3rem" height="1.25rem" />
        </div>
        <div className="skeleton-meta-compact">
          <Skeleton width="4rem" height="1rem" />
          <Skeleton width="2rem" height="1rem" />
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="skeleton-card skeleton-card-detailed">
        <div className="skeleton-header">
          <Skeleton width="70%" height="1.5rem" />
          <Skeleton width="5rem" height="2rem" />
        </div>
        <div className="skeleton-heatmap">
          <Skeleton width="100%" height="32px" />
        </div>
        <div className="skeleton-stats">
          <div>
            <Skeleton width="80%" height="0.875rem" />
            <Skeleton width="60%" height="1.25rem" />
          </div>
          <div>
            <Skeleton width="80%" height="0.875rem" />
            <Skeleton width="60%" height="1.25rem" />
          </div>
        </div>
        <div className="skeleton-badges">
          <Skeleton width="4rem" height="1.75rem" />
          <Skeleton width="3rem" height="1.75rem" />
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-card skeleton-card-default">
      <div className="skeleton-header">
        <Skeleton width="60%" height="1.25rem" />
        <Skeleton width="4rem" height="1.5rem" />
      </div>
      <div className="skeleton-heatmap">
        <Skeleton width="100%" height="24px" />
      </div>
      <div className="skeleton-time">
        <Skeleton width="100%" height="2.5rem" />
      </div>
    </div>
  );
};

// Stadium Guide Skeleton
export const StadiumGuideSkeleton: React.FC = () => {
  return (
    <div className="skeleton-stadium-guide">
      {/* Title Block */}
      <div className="skeleton-title-block">
        <Skeleton width="60%" height="2.5rem" />
        <Skeleton width="40%" height="1.25rem" />
        <div className="skeleton-quick-facts">
          <Skeleton width="48%" height="3rem" />
          <Skeleton width="48%" height="3rem" />
        </div>
      </div>

      {/* Sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-section">
          <Skeleton width="30%" height="1.75rem" />
          <Skeleton width="100%" height="1rem" />
          <Skeleton width="95%" height="1rem" />
          <Skeleton width="90%" height="1rem" />
          <div className="skeleton-list">
            <Skeleton width="100%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
            <Skeleton width="100%" height="2rem" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Sun Position Dial Skeleton
export const SunDialSkeleton: React.FC = () => {
  return (
    <div className="skeleton-sun-dial">
      <Skeleton width="200px" height="200px" circle />
      <div className="skeleton-dial-info">
        <Skeleton width="6rem" height="1.25rem" />
        <div className="skeleton-dial-data">
          <Skeleton width="5rem" height="1rem" />
          <Skeleton width="5rem" height="1rem" />
        </div>
      </div>
    </div>
  );
};

// Stadium List Skeleton
export const StadiumListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="skeleton-stadium-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-stadium-item">
          <div className="skeleton-stadium-header">
            <Skeleton width="70%" height="1.5rem" />
            <Skeleton width="3rem" height="1.25rem" />
          </div>
          <div className="skeleton-stadium-details">
            <Skeleton width="100%" height="0.875rem" />
            <Skeleton width="80%" height="0.875rem" />
          </div>
          <div className="skeleton-stadium-stats">
            <Skeleton width="30%" height="2rem" />
            <Skeleton width="30%" height="2rem" />
            <Skeleton width="30%" height="2rem" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Search Results Skeleton
export const SearchResultsSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="skeleton-search-results">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-search-item">
          <div className="skeleton-search-content">
            <Skeleton width="70%" height="1rem" />
            <Skeleton width="50%" height="0.875rem" />
          </div>
          <Skeleton width="3rem" height="1.5rem" />
        </div>
      ))}
    </div>
  );
};

// Time Presets Skeleton
export const TimePresetsSkeleton: React.FC = () => {
  return (
    <div className="skeleton-time-presets">
      <Skeleton width="60%" height="1.5rem" />
      <Skeleton width="40%" height="1rem" />
      <div className="skeleton-presets-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-preset-button">
            <Skeleton width="3rem" height="3rem" circle />
            <Skeleton width="60%" height="0.875rem" />
            <Skeleton width="40%" height="0.75rem" />
          </div>
        ))}
      </div>
    </div>
  );
};

// Weather Widget Skeleton
export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="skeleton-weather">
      <div className="skeleton-weather-header">
        <Skeleton width="8rem" height="1.25rem" />
      </div>
      <div className="skeleton-weather-main">
        <Skeleton width="4rem" height="4rem" circle />
        <div className="skeleton-weather-details">
          <Skeleton width="5rem" height="2rem" />
          <Skeleton width="7rem" height="1rem" />
        </div>
      </div>
      <div className="skeleton-weather-stats">
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="100%" height="1rem" />
      </div>
    </div>
  );
};

export default {
  Skeleton,
  SectionCardSkeleton,
  StadiumGuideSkeleton,
  SunDialSkeleton,
  StadiumListSkeleton,
  SearchResultsSkeleton,
  TimePresetsSkeleton,
  WeatherSkeleton,
};
