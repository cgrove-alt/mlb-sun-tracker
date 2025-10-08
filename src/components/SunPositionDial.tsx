'use client';

import React from 'react';
import './SunPositionDial.css';

interface SunPositionDialProps {
  /** Sun altitude in degrees (0-90) */
  altitude: number;
  /** Sun azimuth in degrees (0-360) */
  azimuth: number;
  /** Game time for display */
  gameTime?: Date;
  /** Size of the component in pixels */
  size?: number;
  /** Show labels */
  showLabels?: boolean;
}

export const SunPositionDial: React.FC<SunPositionDialProps> = ({
  altitude,
  azimuth,
  gameTime,
  size = 200,
  showLabels = true,
}) => {
  const center = size / 2;
  const radius = (size / 2) - 20;

  // Calculate sun position on the dial
  // Map azimuth (0-360) to angle on dial where 0° is North (top)
  const angleRad = ((azimuth - 90) * Math.PI) / 180;

  // Map altitude (0-90) to distance from center
  // Higher altitude = closer to center
  const distanceFromCenter = radius * (1 - altitude / 90);

  const sunX = center + Math.cos(angleRad) * distanceFromCenter;
  const sunY = center + Math.sin(angleRad) * distanceFromCenter;

  // Determine sun color based on altitude
  const getSunColor = () => {
    if (altitude < 0) return '#4b5563'; // Night (gray)
    if (altitude < 10) return '#fb923c'; // Sunrise/sunset (orange)
    if (altitude < 30) return '#fbbf24'; // Low sun (amber)
    return '#facc15'; // High sun (yellow)
  };

  // Format time if provided
  const formattedTime = gameTime
    ? gameTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : null;

  return (
    <div className="sun-position-dial-container" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="sun-position-dial"
      >
        {/* Outer circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* Inner circles for altitude reference */}
        <circle
          cx={center}
          cy={center}
          r={radius * 0.66}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <circle
          cx={center}
          cy={center}
          r={radius * 0.33}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Cardinal direction markers */}
        {showLabels && (
          <>
            {/* North */}
            <text
              x={center}
              y={15}
              textAnchor="middle"
              className="dial-label"
              fontSize="12"
              fontWeight="600"
              fill="#6b7280"
            >
              N
            </text>
            {/* East */}
            <text
              x={size - 12}
              y={center + 4}
              textAnchor="middle"
              className="dial-label"
              fontSize="12"
              fontWeight="600"
              fill="#6b7280"
            >
              E
            </text>
            {/* South */}
            <text
              x={center}
              y={size - 5}
              textAnchor="middle"
              className="dial-label"
              fontSize="12"
              fontWeight="600"
              fill="#6b7280"
            >
              S
            </text>
            {/* West */}
            <text
              x={12}
              y={center + 4}
              textAnchor="middle"
              className="dial-label"
              fontSize="12"
              fontWeight="600"
              fill="#6b7280"
            >
              W
            </text>
          </>
        )}

        {/* Sun position indicator */}
        {altitude >= 0 ? (
          <>
            {/* Line from center to sun */}
            <line
              x1={center}
              y1={center}
              x2={sunX}
              y2={sunY}
              stroke={getSunColor()}
              strokeWidth="2"
              strokeDasharray="3 3"
              opacity="0.5"
            />

            {/* Sun circle */}
            <circle
              cx={sunX}
              cy={sunY}
              r="8"
              fill={getSunColor()}
              stroke="white"
              strokeWidth="2"
              className="sun-indicator"
            />

            {/* Sun rays */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rayAngle = (angle * Math.PI) / 180;
              const rayStartX = sunX + Math.cos(rayAngle) * 11;
              const rayStartY = sunY + Math.sin(rayAngle) * 11;
              const rayEndX = sunX + Math.cos(rayAngle) * 15;
              const rayEndY = sunY + Math.sin(rayAngle) * 15;

              return (
                <line
                  key={angle}
                  x1={rayStartX}
                  y1={rayStartY}
                  x2={rayEndX}
                  y2={rayEndY}
                  stroke={getSunColor()}
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="sun-ray"
                />
              );
            })}
          </>
        ) : (
          /* Moon for night games */
          <>
            <circle
              cx={center}
              cy={center}
              r="8"
              fill="#6b7280"
              stroke="white"
              strokeWidth="2"
            />
            <text
              x={center}
              y={center + 4}
              textAnchor="middle"
              fontSize="12"
              fill="white"
            >
              ☾
            </text>
          </>
        )}

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="3"
          fill="#9ca3af"
        />
      </svg>

      {/* Labels below dial */}
      <div className="dial-info">
        {formattedTime && (
          <div className="dial-time">{formattedTime}</div>
        )}
        <div className="dial-data">
          <span className="dial-data-item">
            <span className="dial-data-label">Altitude:</span>
            <span className="dial-data-value">{altitude.toFixed(1)}°</span>
          </span>
          <span className="dial-data-item">
            <span className="dial-data-label">Azimuth:</span>
            <span className="dial-data-value">{azimuth.toFixed(1)}°</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SunPositionDial;
