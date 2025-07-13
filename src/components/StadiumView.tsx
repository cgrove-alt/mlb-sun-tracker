import React from 'react';
import { Stadium } from '../data/stadiums';
import { SunPosition } from '../utils/sunCalculations';
import './StadiumView.css';

interface StadiumViewProps {
  stadium: Stadium;
  sunPosition: SunPosition;
  sunnySections: Map<string, boolean>;
}

export const StadiumView: React.FC<StadiumViewProps> = ({ stadium, sunPosition, sunnySections }) => {
  const getSectionClass = (sectionName: string): string => {
    const inSun = sunnySections.get(sectionName);
    if (sunPosition.altitudeDegrees < 0) return 'section night';
    return inSun ? 'section sunny' : 'section shaded';
  };

  // Calculate sun indicator position
  const sunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
  const sunX = 50 + 40 * Math.cos((sunAngle - 90) * Math.PI / 180);
  const sunY = 50 + 40 * Math.sin((sunAngle - 90) * Math.PI / 180);

  return (
    <div className="stadium-container">
      <h3>{stadium.name}</h3>
      <div className="stadium-info">
        <p>Team: {stadium.team}</p>
        <p>Roof: {stadium.roof}</p>
        {stadium.roof === 'fixed' && (
          <p className="roof-warning">This stadium has a fixed roof - no direct sunlight on seats</p>
        )}
      </div>
      
      <svg className="stadium-svg" viewBox="0 0 100 100">
        {/* Stadium outline */}
        <g className="stadium-outline">
          {/* Infield */}
          <path
            d="M 50 70 L 30 50 L 50 30 L 70 50 Z"
            className={getSectionClass('Infield')}
          />
          
          {/* Home plate area */}
          <rect
            x="45" y="65" width="10" height="10"
            className={getSectionClass('Home Plate')}
          />
          
          {/* First base line */}
          <path
            d="M 55 65 L 75 65 L 75 45 L 55 45 Z"
            className={getSectionClass('First Base Line')}
          />
          
          {/* Third base line */}
          <path
            d="M 45 65 L 25 65 L 25 45 L 45 45 Z"
            className={getSectionClass('Third Base Line')}
          />
          
          {/* Right field */}
          <path
            d="M 70 50 L 85 35 L 85 20 L 70 20 Z"
            className={getSectionClass('Right Field')}
          />
          
          {/* Center field */}
          <path
            d="M 50 30 L 50 10 L 35 10 L 35 20 L 65 20 L 65 10 L 50 10"
            className={getSectionClass('Center Field')}
          />
          
          {/* Left field */}
          <path
            d="M 30 50 L 15 35 L 15 20 L 30 20 Z"
            className={getSectionClass('Left Field')}
          />
          
          {/* Upper deck indicators */}
          <circle cx="75" cy="55" r="3" className={getSectionClass('Upper Deck - First Base')} />
          <circle cx="25" cy="55" r="3" className={getSectionClass('Upper Deck - Third Base')} />
          <circle cx="50" cy="15" r="3" className={getSectionClass('Upper Deck - Outfield')} />
        </g>
        
        {/* Sun position indicator */}
        {sunPosition.altitudeDegrees > 0 && (
          <g className="sun-indicator">
            <circle
              cx={sunX}
              cy={sunY}
              r="5"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="1"
            />
            <text
              x={sunX}
              y={sunY - 8}
              textAnchor="middle"
              fontSize="8"
              fill="#333"
            >
              ☀️
            </text>
          </g>
        )}
        
        {/* Compass */}
        <g className="compass">
          <text x="50" y="5" textAnchor="middle" fontSize="8" fill="#666">N</text>
          <text x="95" y="50" textAnchor="middle" fontSize="8" fill="#666">E</text>
          <text x="50" y="98" textAnchor="middle" fontSize="8" fill="#666">S</text>
          <text x="5" y="50" textAnchor="middle" fontSize="8" fill="#666">W</text>
        </g>
      </svg>
      
      <div className="legend">
        <h4>Legend:</h4>
        <div className="legend-item">
          <div className="legend-color sunny"></div>
          <span>In direct sunlight</span>
        </div>
        <div className="legend-item">
          <div className="legend-color shaded"></div>
          <span>In shade</span>
        </div>
        {sunPosition.altitudeDegrees < 0 && (
          <div className="legend-item">
            <div className="legend-color night"></div>
            <span>Night game</span>
          </div>
        )}
      </div>
    </div>
  );
};