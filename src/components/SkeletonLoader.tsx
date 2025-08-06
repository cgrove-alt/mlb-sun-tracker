import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  variant?: 'text' | 'card' | 'section' | 'game' | 'weather';
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  variant = 'card', 
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return (
          <div className="skeleton-text">
            <div className="skeleton-line skeleton-shimmer" />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '80%' }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '60%' }} />
          </div>
        );
      
      case 'card':
        return (
          <div className="skeleton-card">
            <div className="skeleton-card-header skeleton-shimmer" />
            <div className="skeleton-card-body">
              <div className="skeleton-line skeleton-shimmer" />
              <div className="skeleton-line skeleton-shimmer" style={{ width: '90%' }} />
              <div className="skeleton-line skeleton-shimmer" style={{ width: '70%' }} />
            </div>
            <div className="skeleton-card-footer">
              <div className="skeleton-badge skeleton-shimmer" />
              <div className="skeleton-badge skeleton-shimmer" />
            </div>
          </div>
        );
      
      case 'section':
        return (
          <div className="skeleton-section">
            <div className="skeleton-section-header">
              <div className="skeleton-title skeleton-shimmer" />
              <div className="skeleton-subtitle skeleton-shimmer" />
            </div>
            <div className="skeleton-section-grid">
              <div className="skeleton-section-item skeleton-shimmer" />
              <div className="skeleton-section-item skeleton-shimmer" />
              <div className="skeleton-section-item skeleton-shimmer" />
              <div className="skeleton-section-item skeleton-shimmer" />
            </div>
          </div>
        );
      
      case 'game':
        return (
          <div className="skeleton-game">
            <div className="skeleton-game-teams">
              <div className="skeleton-team skeleton-shimmer" />
              <div className="skeleton-vs skeleton-shimmer" />
              <div className="skeleton-team skeleton-shimmer" />
            </div>
            <div className="skeleton-game-info">
              <div className="skeleton-date skeleton-shimmer" />
              <div className="skeleton-time skeleton-shimmer" />
            </div>
          </div>
        );
      
      case 'weather':
        return (
          <div className="skeleton-weather">
            <div className="skeleton-weather-icon skeleton-shimmer" />
            <div className="skeleton-weather-info">
              <div className="skeleton-temp skeleton-shimmer" />
              <div className="skeleton-conditions skeleton-shimmer" />
              <div className="skeleton-details skeleton-shimmer" />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`skeleton-loader ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-item">
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export const SectionCardSkeleton: React.FC = () => (
  <div className="section-card-skeleton">
    <div className="skeleton-section-header">
      <div className="skeleton-section-name skeleton-shimmer" />
      <div className="skeleton-sun-badge skeleton-shimmer" />
    </div>
    <div className="skeleton-section-details">
      <div className="skeleton-detail-row">
        <div className="skeleton-icon skeleton-shimmer" />
        <div className="skeleton-text-small skeleton-shimmer" />
      </div>
      <div className="skeleton-detail-row">
        <div className="skeleton-icon skeleton-shimmer" />
        <div className="skeleton-text-small skeleton-shimmer" />
      </div>
    </div>
    <div className="skeleton-section-footer">
      <div className="skeleton-price skeleton-shimmer" />
      <div className="skeleton-action skeleton-shimmer" />
    </div>
  </div>
);

export const GameListSkeleton: React.FC = () => (
  <div className="game-list-skeleton">
    {[1, 2, 3].map(i => (
      <div key={i} className="skeleton-game-item">
        <div className="skeleton-game-date skeleton-shimmer" />
        <div className="skeleton-game-teams">
          <div className="skeleton-team-logo skeleton-shimmer" />
          <div className="skeleton-vs-text skeleton-shimmer" />
          <div className="skeleton-team-logo skeleton-shimmer" />
        </div>
        <div className="skeleton-game-time skeleton-shimmer" />
      </div>
    ))}
  </div>
);

export const StadiumDetailsSkeleton: React.FC = () => (
  <div className="stadium-details-skeleton">
    <div className="skeleton-stadium-header">
      <div className="skeleton-stadium-image skeleton-shimmer" />
      <div className="skeleton-stadium-info">
        <div className="skeleton-stadium-name skeleton-shimmer" />
        <div className="skeleton-stadium-location skeleton-shimmer" />
        <div className="skeleton-stadium-meta">
          <div className="skeleton-badge skeleton-shimmer" />
          <div className="skeleton-badge skeleton-shimmer" />
          <div className="skeleton-badge skeleton-shimmer" />
        </div>
      </div>
    </div>
    <div className="skeleton-stadium-sections">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton-section-preview skeleton-shimmer" />
      ))}
    </div>
  </div>
);