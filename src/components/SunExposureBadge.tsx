import React from 'react';
import './SunExposureBadge.css';

interface SunExposureBadgeProps {
  percentage: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animated?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const SunExposureBadge: React.FC<SunExposureBadgeProps> = ({
  percentage,
  size = 'medium',
  showLabel = true,
  animated = true,
  variant = 'default'
}) => {
  const getExposureLevel = (percent: number): {
    level: string;
    label: string;
    color: string;
    icon: string;
    description: string;
  } => {
    if (percent >= 80) {
      return {
        level: 'extreme',
        label: 'Full Sun',
        color: 'var(--color-sun-extreme)',
        icon: '☀️',
        description: 'Maximum sun exposure - sunscreen essential'
      };
    } else if (percent >= 60) {
      return {
        level: 'high',
        label: 'High Sun',
        color: 'var(--color-sun-high)',
        icon: '🌤️',
        description: 'Significant sun exposure - protection recommended'
      };
    } else if (percent >= 40) {
      return {
        level: 'moderate',
        label: 'Partial Sun',
        color: 'var(--color-sun-moderate)',
        icon: '⛅',
        description: 'Moderate sun exposure - some shade available'
      };
    } else if (percent >= 20) {
      return {
        level: 'low',
        label: 'Mostly Shade',
        color: 'var(--color-sun-low)',
        icon: '🌥️',
        description: 'Minimal sun exposure - mostly shaded'
      };
    } else if (percent > 0) {
      return {
        level: 'minimal',
        label: 'Full Shade',
        color: 'var(--color-sun-minimal)',
        icon: '🌳',
        description: 'Fully shaded - excellent sun protection'
      };
    } else {
      return {
        level: 'none',
        label: 'Covered',
        color: 'var(--color-sun-none)',
        icon: '🏢',
        description: 'Completely covered - no sun exposure'
      };
    }
  };

  const exposure = getExposureLevel(percentage);

  if (variant === 'compact') {
    return (
      <div 
        className={`sun-badge sun-badge--compact sun-badge--${size} sun-badge--${exposure.level} ${animated ? 'sun-badge--animated' : ''}`}
        title={exposure.description}
      >
        <span className="sun-badge__percentage">{percentage}%</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`sun-badge sun-badge--detailed sun-badge--${size} sun-badge--${exposure.level} ${animated ? 'sun-badge--animated' : ''}`}>
        <div className="sun-badge__header">
          <span className="sun-badge__icon">{exposure.icon}</span>
          <span className="sun-badge__percentage">{percentage}%</span>
        </div>
        <div className="sun-badge__body">
          <span className="sun-badge__label">{exposure.label}</span>
          <span className="sun-badge__description">{exposure.description}</span>
        </div>
        <div className="sun-badge__progress">
          <div 
            className="sun-badge__progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`sun-badge sun-badge--${size} sun-badge--${exposure.level} ${animated ? 'sun-badge--animated' : ''}`}
      title={exposure.description}
    >
      <span className="sun-badge__icon">{exposure.icon}</span>
      <div className="sun-badge__content">
        <span className="sun-badge__percentage">{percentage}%</span>
        {showLabel && <span className="sun-badge__label">{exposure.label}</span>}
      </div>
    </div>
  );
};

export const SunExposureIndicator: React.FC<{ percentage: number }> = ({ percentage }) => {
  const getIndicatorClass = (percent: number): string => {
    if (percent >= 80) return 'indicator--extreme';
    if (percent >= 60) return 'indicator--high';
    if (percent >= 40) return 'indicator--moderate';
    if (percent >= 20) return 'indicator--low';
    if (percent > 0) return 'indicator--minimal';
    return 'indicator--none';
  };

  return (
    <div className={`sun-indicator ${getIndicatorClass(percentage)}`}>
      <div className="sun-indicator__ring">
        <svg viewBox="0 0 36 36" className="sun-indicator__svg">
          <path
            className="sun-indicator__circle-bg"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="sun-indicator__circle"
            strokeDasharray={`${percentage}, 100`}
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <text x="18" y="20.35" className="sun-indicator__text">
            {percentage}%
          </text>
        </svg>
      </div>
    </div>
  );
};

export const SunExposureBar: React.FC<{ 
  percentage: number;
  height?: number;
  showMarkers?: boolean;
}> = ({ percentage, height = 8, showMarkers = true }) => {
  return (
    <div className="sun-exposure-bar" style={{ height: `${height}px` }}>
      <div className="sun-exposure-bar__track">
        <div 
          className="sun-exposure-bar__fill"
          style={{ 
            width: `${percentage}%`,
            background: `var(--gradient-sun-${
              percentage >= 80 ? 'extreme' :
              percentage >= 60 ? 'high' :
              percentage >= 40 ? 'moderate' :
              percentage >= 20 ? 'low' :
              percentage > 0 ? 'minimal' : 'none'
            })`
          }}
        />
        {showMarkers && (
          <div className="sun-exposure-bar__markers">
            <span className="marker" style={{ left: '0%' }}>0</span>
            <span className="marker" style={{ left: '20%' }}>20</span>
            <span className="marker" style={{ left: '40%' }}>40</span>
            <span className="marker" style={{ left: '60%' }}>60</span>
            <span className="marker" style={{ left: '80%' }}>80</span>
            <span className="marker" style={{ left: '100%' }}>100</span>
          </div>
        )}
      </div>
      <div className="sun-exposure-bar__labels">
        <span className="label label--shade">Shade</span>
        <span className="label label--sun">Sun</span>
      </div>
    </div>
  );
};

export const SunExposureLegend: React.FC = () => {
  const levels = [
    { range: '0%', label: 'Covered', color: 'var(--color-sun-none)', icon: '🏢' },
    { range: '1-20%', label: 'Full Shade', color: 'var(--color-sun-minimal)', icon: '🌳' },
    { range: '21-40%', label: 'Mostly Shade', color: 'var(--color-sun-low)', icon: '🌥️' },
    { range: '41-60%', label: 'Partial Sun', color: 'var(--color-sun-moderate)', icon: '⛅' },
    { range: '61-80%', label: 'High Sun', color: 'var(--color-sun-high)', icon: '🌤️' },
    { range: '81-100%', label: 'Full Sun', color: 'var(--color-sun-extreme)', icon: '☀️' }
  ];

  return (
    <div className="sun-exposure-legend">
      <h4 className="sun-exposure-legend__title">Sun Exposure Guide</h4>
      <div className="sun-exposure-legend__items">
        {levels.map((level, index) => (
          <div key={index} className="legend-item">
            <div 
              className="legend-item__color"
              style={{ background: level.color }}
            >
              <span className="legend-item__icon">{level.icon}</span>
            </div>
            <div className="legend-item__info">
              <span className="legend-item__label">{level.label}</span>
              <span className="legend-item__range">{level.range}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};