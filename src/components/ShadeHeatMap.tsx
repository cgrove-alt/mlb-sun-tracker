'use client';

import React from 'react';
import './ShadeHeatMap.css';

interface ShadeHeatMapProps {
  /** Sun exposure percentage (0-100) */
  sunExposure: number;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Show percentage label */
  showLabel?: boolean;
  /** Show legend */
  showLegend?: boolean;
}

export const ShadeHeatMap: React.FC<ShadeHeatMapProps> = ({
  sunExposure,
  size = 'medium',
  showLabel = true,
  showLegend = false,
}) => {
  // Determine shade category
  const getShadeCategory = () => {
    if (sunExposure <= 20) return 'excellent';
    if (sunExposure <= 40) return 'good';
    if (sunExposure <= 60) return 'moderate';
    if (sunExposure <= 80) return 'poor';
    return 'minimal';
  };

  const getShadeLabel = () => {
    if (sunExposure <= 20) return 'Excellent Shade';
    if (sunExposure <= 40) return 'Good Shade';
    if (sunExposure <= 60) return 'Partial Shade';
    if (sunExposure <= 80) return 'Mostly Sun';
    return 'Full Sun';
  };

  const getShadeColor = () => {
    if (sunExposure <= 20) return '#10b981'; // green
    if (sunExposure <= 40) return '#34d399'; // lighter green
    if (sunExposure <= 60) return '#fbbf24'; // yellow
    if (sunExposure <= 80) return '#fb923c'; // orange
    return '#f97316'; // red-orange
  };

  const getShadeIcon = () => {
    if (sunExposure <= 20) return '🛡️';
    if (sunExposure <= 40) return '⛱️';
    if (sunExposure <= 60) return '🌤️';
    if (sunExposure <= 80) return '☀️';
    return '🔥';
  };

  const category = getShadeCategory();
  const shadePercentage = 100 - sunExposure;

  return (
    <div className={`shade-heat-map shade-heat-map-${size}`}>
      {/* Visual Bar */}
      <div className="shade-bar-container">
        <div className={`shade-bar shade-category-${category}`}>
          <div
            className="shade-fill"
            style={{
              width: `${shadePercentage}%`,
              backgroundColor: getShadeColor(),
            }}
          >
            {showLabel && size !== 'small' && (
              <span className="shade-percentage-overlay">{Math.round(shadePercentage)}%</span>
            )}
          </div>
          <div
            className="sun-fill"
            style={{
              width: `${sunExposure}%`,
            }}
          />
        </div>

        {/* Icon Indicator */}
        <div className="shade-icon" title={getShadeLabel()}>
          {getShadeIcon()}
        </div>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="shade-label">
          <span className="shade-label-text">{getShadeLabel()}</span>
          <span className="shade-label-percent">
            {Math.round(shadePercentage)}% shade
          </span>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className="shade-legend">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#10b981' }} />
            <span>Excellent (80-100%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#34d399' }} />
            <span>Good (60-80%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#fbbf24' }} />
            <span>Partial (40-60%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#fb923c' }} />
            <span>Mostly Sun (20-40%)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#f97316' }} />
            <span>Full Sun (0-20%)</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Compact inline version for lists
interface ShadeIndicatorProps {
  sunExposure: number;
  compact?: boolean;
}

export const ShadeIndicator: React.FC<ShadeIndicatorProps> = ({
  sunExposure,
  compact = false
}) => {
  const getShadeColor = () => {
    if (sunExposure <= 20) return '#10b981';
    if (sunExposure <= 40) return '#34d399';
    if (sunExposure <= 60) return '#fbbf24';
    if (sunExposure <= 80) return '#fb923c';
    return '#f97316';
  };

  const getShadeIcon = () => {
    if (sunExposure <= 20) return '🛡️';
    if (sunExposure <= 40) return '⛱️';
    if (sunExposure <= 60) return '🌤️';
    if (sunExposure <= 80) return '☀️';
    return '🔥';
  };

  const shadePercentage = 100 - sunExposure;

  if (compact) {
    return (
      <div className="shade-indicator-compact">
        <span className="indicator-icon">{getShadeIcon()}</span>
        <div
          className="indicator-dot"
          style={{ backgroundColor: getShadeColor() }}
          title={`${shadePercentage}% shade`}
        />
      </div>
    );
  }

  return (
    <div className="shade-indicator">
      <div className="indicator-bar-mini">
        <div
          className="indicator-fill"
          style={{
            width: `${shadePercentage}%`,
            backgroundColor: getShadeColor(),
          }}
        />
      </div>
      <span className="indicator-text">
        {getShadeIcon()} {Math.round(shadePercentage)}%
      </span>
    </div>
  );
};

export default ShadeHeatMap;
