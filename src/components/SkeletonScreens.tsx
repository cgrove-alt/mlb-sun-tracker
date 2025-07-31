import React from 'react';
import './SkeletonScreens.css';

// Base skeleton component with shimmer animation
export const Skeleton: React.FC<{
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}> = ({ width = '100%', height = '20px', borderRadius = 'var(--radius-sm)', className = '' }) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
    />
  );
};

// Stadium selector skeleton
export const StadiumSelectorSkeleton: React.FC = () => {
  return (
    <div className="stadium-selector-skeleton">
      <Skeleton height="48px" borderRadius="var(--radius-lg)" />
    </div>
  );
};

// Game selector skeleton
export const GameSelectorSkeleton: React.FC = () => {
  return (
    <div className="game-selector-skeleton">
      <Skeleton height="36px" width="150px" className="skeleton-title" />
      <div className="skeleton-games">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} height="80px" borderRadius="var(--radius-lg)" />
        ))}
      </div>
    </div>
  );
};

// Weather display skeleton
export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="weather-skeleton">
      <div className="weather-skeleton-header">
        <Skeleton width="120px" height="24px" />
        <Skeleton width="80px" height="20px" />
      </div>
      <div className="weather-skeleton-content">
        <Skeleton width="60px" height="60px" borderRadius="50%" />
        <div className="weather-skeleton-details">
          <Skeleton width="100px" height="32px" />
          <Skeleton width="150px" height="20px" />
        </div>
      </div>
    </div>
  );
};

// Section card skeleton
export const SectionCardSkeleton: React.FC = () => {
  return (
    <div className="section-card-skeleton">
      <div className="section-card-skeleton-header">
        <Skeleton width="120px" height="24px" />
        <Skeleton width="60px" height="20px" borderRadius="var(--radius-full)" />
      </div>
      <div className="section-card-skeleton-content">
        <Skeleton width="100%" height="16px" />
        <Skeleton width="80%" height="16px" />
      </div>
      <div className="section-card-skeleton-footer">
        <Skeleton width="40px" height="40px" borderRadius="50%" />
        <Skeleton width="40px" height="40px" borderRadius="50%" />
        <Skeleton width="40px" height="40px" borderRadius="50%" />
      </div>
    </div>
  );
};

// Section list skeleton
export const SectionListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="section-list-skeleton">
      {Array.from({ length: count }).map((_, i) => (
        <SectionCardSkeleton key={i} />
      ))}
    </div>
  );
};

// Mobile stadium card skeleton
export const MobileStadiumCardSkeleton: React.FC = () => {
  return (
    <div className="mobile-stadium-card-skeleton">
      <div className="stadium-card-header">
        <Skeleton width="60%" height="28px" />
        <Skeleton width="30%" height="20px" />
      </div>
      <Skeleton width="40%" height="20px" className="stadium-card-team" />
    </div>
  );
};

// Mobile game card skeleton
export const MobileGameCardSkeleton: React.FC = () => {
  return (
    <div className="mobile-game-card-skeleton">
      <div className="game-card-teams">
        <Skeleton width="100px" height="20px" />
        <Skeleton width="30px" height="20px" borderRadius="var(--radius-sm)" />
        <Skeleton width="100px" height="20px" />
      </div>
      <Skeleton width="120px" height="16px" className="game-card-time" />
    </div>
  );
};

// Overview stats skeleton
export const OverviewStatsSkeleton: React.FC = () => {
  return (
    <div className="overview-stats-skeleton">
      <div className="stat-card-skeleton">
        <Skeleton width="100px" height="20px" />
        <Skeleton width="60px" height="32px" />
      </div>
      <div className="stat-card-skeleton">
        <Skeleton width="100px" height="20px" />
        <Skeleton width="60px" height="32px" />
      </div>
      <div className="stat-card-skeleton">
        <Skeleton width="100px" height="20px" />
        <Skeleton width="60px" height="32px" />
      </div>
    </div>
  );
};

// Sun info skeleton
export const SunInfoSkeleton: React.FC = () => {
  return (
    <div className="sun-info-skeleton">
      <Skeleton width="150px" height="24px" className="sun-info-title" />
      <div className="sun-info-content">
        <div className="sun-info-row">
          <Skeleton width="80px" height="16px" />
          <Skeleton width="60px" height="16px" />
        </div>
        <div className="sun-info-row">
          <Skeleton width="80px" height="16px" />
          <Skeleton width="60px" height="16px" />
        </div>
        <div className="sun-info-row">
          <Skeleton width="80px" height="16px" />
          <Skeleton width="60px" height="16px" />
        </div>
      </div>
    </div>
  );
};