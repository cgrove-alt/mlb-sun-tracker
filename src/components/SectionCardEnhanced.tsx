'use client';

import React from 'react';
import { ShadeHeatMap, ShadeIndicator } from './ShadeHeatMap';
import './SectionCardEnhanced.css';

interface SectionCardEnhancedProps {
  sectionName: string;
  sectionId: string;
  sunExposure: number;
  timeInSun?: number;
  level: string;
  priceRange?: string;
  covered?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
  showHeatMap?: boolean;
}

export const SectionCardEnhanced: React.FC<SectionCardEnhancedProps> = ({
  sectionName,
  sectionId,
  sunExposure,
  timeInSun,
  level,
  priceRange,
  covered = false,
  onClick,
  variant = 'default',
  showHeatMap = true,
}) => {
  const getLevelBadgeColor = () => {
    switch (level) {
      case 'lower':
      case 'field':
        return 'badge-premium';
      case 'club':
      case 'suite':
        return 'badge-luxury';
      case 'upper':
        return 'badge-value';
      default:
        return 'badge-default';
    }
  };

  const getPriceDisplay = () => {
    if (!priceRange) return null;
    const priceLabels: Record<string, string> = {
      value: '$',
      moderate: '$$',
      premium: '$$$',
      luxury: '$$$$',
    };
    return priceLabels[priceRange] || '$$';
  };

  const formatTime = (minutes?: number) => {
    if (minutes === undefined) return null;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  if (variant === 'compact') {
    return (
      <div
        className="section-card-enhanced section-card-compact"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <div className="card-header-compact">
          <div className="card-title-row">
            <h3 className="section-name-compact">{sectionName}</h3>
            {covered && <span className="covered-badge-mini" title="Covered section">🏠</span>}
          </div>
          <ShadeIndicator sunExposure={sunExposure} compact />
        </div>
        <div className="card-meta-compact">
          <span className={`level-badge-mini ${getLevelBadgeColor()}`}>{level}</span>
          {priceRange && <span className="price-badge-mini">{getPriceDisplay()}</span>}
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className="section-card-enhanced section-card-detailed"
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
      >
        <div className="card-header">
          <div className="card-title-section">
            <h3 className="section-name">{sectionName}</h3>
            <span className="section-id">{sectionId}</span>
          </div>
          {covered && (
            <div className="covered-badge" title="Covered section">
              <span className="badge-icon">🏠</span>
              <span className="badge-text">Covered</span>
            </div>
          )}
        </div>

        <div className="card-body">
          {showHeatMap && (
            <div className="shade-visualization">
              <ShadeHeatMap
                sunExposure={sunExposure}
                size="large"
                showLabel={true}
                showLegend={false}
              />
            </div>
          )}

          <div className="card-stats">
            <div className="stat-item">
              <span className="stat-label">Time in Sun</span>
              <span className="stat-value">{timeInSun ? formatTime(timeInSun) : 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Shade %</span>
              <span className="stat-value">{Math.round(100 - sunExposure)}%</span>
            </div>
          </div>

          <div className="card-meta">
            <span className={`level-badge ${getLevelBadgeColor()}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
            {priceRange && (
              <span className="price-badge" title={`${priceRange} price range`}>
                {getPriceDisplay()}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className="section-card-enhanced section-card-default"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="card-header">
        <div className="card-title-section">
          <h3 className="section-name">{sectionName}</h3>
          {covered && <span className="covered-badge-small" title="Covered">🏠</span>}
        </div>
        <div className="card-meta-inline">
          <span className={`level-badge-small ${getLevelBadgeColor()}`}>{level}</span>
          {priceRange && <span className="price-badge-small">{getPriceDisplay()}</span>}
        </div>
      </div>

      <div className="card-body">
        {showHeatMap ? (
          <ShadeHeatMap
            sunExposure={sunExposure}
            size="medium"
            showLabel={true}
          />
        ) : (
          <ShadeIndicator sunExposure={sunExposure} />
        )}

        {timeInSun !== undefined && (
          <div className="time-info">
            <span className="time-label">⏱️ Time in sun:</span>
            <span className="time-value">{formatTime(timeInSun)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionCardEnhanced;
