import React, { useState, useEffect } from 'react';
import { Stadium } from '../data/stadiums';
import { SunPosition } from '../utils/sunCalculations';

interface AccessibleStadiumViewProps {
  stadium: Stadium;
  sunPosition: SunPosition;
  sunnySections: Map<string, boolean>;
}

export const AccessibleStadiumView: React.FC<AccessibleStadiumViewProps> = ({ 
  stadium, 
  sunPosition, 
  sunnySections 
}) => {
  const [highContrastMode, setHighContrastMode] = useState(() => {
    const saved = localStorage.getItem('stadiumHighContrastMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('stadiumHighContrastMode', highContrastMode.toString());
  }, [highContrastMode]);

  const getSectionClass = (sectionName: string): string => {
    const inSun = sunnySections.get(sectionName);
    if (sunPosition.altitudeDegrees < 0) return 'night';
    return inSun ? 'sunny' : 'shaded';
  };

  const getSectionFill = (sectionName: string): string => {
    const status = getSectionClass(sectionName);
    if (highContrastMode) {
      return status === 'sunny' ? '#FFD700' : status === 'shaded' ? '#4A5568' : '#1A202C';
    }
    return status === 'sunny' ? '#FFF176' : status === 'shaded' ? '#90A4AE' : '#546E7A';
  };

  const getSectionLabel = (sectionName: string): string => {
    const status = getSectionClass(sectionName);
    return `${sectionName}: ${status === 'sunny' ? 'in direct sunlight' : status === 'shaded' ? 'in shade' : 'night game - no sun'}`;
  };

  // Calculate sun indicator position
  const sunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
  const sunX = 50 + 40 * Math.cos((sunAngle - 90) * Math.PI / 180);
  const sunY = 50 + 40 * Math.sin((sunAngle - 90) * Math.PI / 180);

  return (
    <div className={`${highContrastMode ? 'bg-gray-100' : 'bg-white'} rounded-2xl shadow-xl p-6 lg:p-8 transition-colors duration-300`}>
      {/* Header with accessibility toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${highContrastMode ? 'text-black' : 'text-indigo-900'}`}>
            {stadium.name}
          </h3>
          <div className="space-y-1">
            <p className={`text-lg ${highContrastMode ? 'text-black' : 'text-gray-700'}`}>
              <span className="font-semibold">Team:</span> {stadium.team}
            </p>
            <p className={`text-lg ${highContrastMode ? 'text-black' : 'text-gray-700'}`}>
              <span className="font-semibold">Roof:</span> {stadium.roof === 'open' ? 'Open' : stadium.roof === 'fixed' ? 'Fixed Dome' : stadium.roof === 'retractable' ? 'Retractable' : stadium.roof}
            </p>
          </div>
        </div>
        <button
          onClick={() => setHighContrastMode(!highContrastMode)}
          className={`
            px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-200
            ${highContrastMode 
              ? 'bg-black text-white hover:bg-gray-800 focus:ring-4 focus:ring-gray-600' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-400'
            }
            focus:outline-none focus:ring-offset-2
          `}
          aria-label={`Toggle high contrast mode. Currently ${highContrastMode ? 'on' : 'off'}`}
          aria-pressed={highContrastMode}
        >
          {highContrastMode ? '🌑' : '🌞'} {highContrastMode ? 'Normal Mode' : 'High Contrast'}
        </button>
      </div>

      {stadium.roof === 'fixed' && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          highContrastMode 
            ? 'bg-yellow-100 border-black text-black' 
            : 'bg-red-50 border-red-500 text-red-900'
        }`} role="alert">
          <p className="font-semibold text-lg">This stadium has a fixed roof - no direct sunlight on seats</p>
        </div>
      )}
      
      {/* Stadium SVG */}
      <svg 
        className={`w-full max-w-2xl mx-auto h-auto ${highContrastMode ? 'bg-white' : 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-2xl p-4`}
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${stadium.name} simplified seating map showing sun exposure`}
      >
        <title>{stadium.name} Stadium Sun Exposure Map</title>
        
        {/* Stadium outline */}
        <g className="stadium-outline">
          {/* Infield */}
          <path
            d="M 50 70 L 30 50 L 50 30 L 70 50 Z"
            fill={getSectionFill('Infield')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('Infield')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('Infield'));
              }
            }}
          />
          
          {/* Home plate area */}
          <rect
            x="45" y="65" width="10" height="10"
            fill={getSectionFill('Home Plate')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('Home Plate')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('Home Plate'));
              }
            }}
          />
          
          {/* First base line */}
          <path
            d="M 55 65 L 75 65 L 75 45 L 55 45 Z"
            fill={getSectionFill('First Base Line')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('First Base Line')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('First Base Line'));
              }
            }}
          />
          
          {/* Third base line */}
          <path
            d="M 45 65 L 25 65 L 25 45 L 45 45 Z"
            fill={getSectionFill('Third Base Line')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('Third Base Line')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('Third Base Line'));
              }
            }}
          />
          
          {/* Right field */}
          <path
            d="M 70 50 L 85 35 L 85 20 L 70 20 Z"
            fill={getSectionFill('Right Field')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('Right Field')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('Right Field'));
              }
            }}
          />
          
          {/* Center field */}
          <path
            d="M 50 30 L 50 10 L 35 10 L 35 20 L 65 20 L 65 10 L 50 10"
            fill={getSectionFill('Center Field')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('Center Field')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('Center Field'));
              }
            }}
          />
          
          {/* Left field */}
          <path
            d="M 30 50 L 15 35 L 15 20 L 30 20 Z"
            fill={getSectionFill('Left Field')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('Left Field')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('Left Field'));
              }
            }}
          />
          
          {/* Upper deck indicators */}
          <circle 
            cx="75" cy="55" r="5" 
            fill={getSectionFill('Upper Deck - First Base')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('Upper Deck - First Base')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('Upper Deck - First Base'));
              }
            }}
          />
          <circle 
            cx="25" cy="55" r="5" 
            fill={getSectionFill('Upper Deck - Third Base')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('Upper Deck - Third Base')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('Upper Deck - Third Base'));
              }
            }}
          />
          <circle 
            cx="50" cy="15" r="5" 
            fill={getSectionFill('Upper Deck - Outfield')}
            stroke={highContrastMode ? '#000000' : '#333333'}
            strokeWidth={highContrastMode ? '2' : '1'}
            role="group"
            aria-label={getSectionLabel('Upper Deck - Outfield')}
            tabIndex={0}
            className="cursor-pointer focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(getSectionLabel('Upper Deck - Outfield'));
              }
            }}
          />
        </g>
        
        {/* Sun position indicator */}
        {sunPosition.altitudeDegrees > 0 && (
          <g className="sun-indicator" role="group" aria-label={`Sun position at ${Math.round(sunPosition.azimuthDegrees)} degrees azimuth`}>
            <circle
              cx={sunX}
              cy={sunY}
              r="6"
              fill="#FFD700"
              stroke="#FFA500"
              strokeWidth="2"
              className="animate-pulse"
            />
            <text
              x={sunX}
              y={sunY - 10}
              textAnchor="middle"
              fontSize="12"
              fill={highContrastMode ? '#000000' : '#333333'}
              aria-hidden="true"
            >
              ☀️
            </text>
          </g>
        )}
        
        {/* Compass */}
        <g className="compass" role="group" aria-label="Compass directions">
          <text x="50" y="5" textAnchor="middle" fontSize="10" fill={highContrastMode ? '#000000' : '#666666'} fontWeight="bold">N</text>
          <text x="95" y="50" textAnchor="middle" fontSize="10" fill={highContrastMode ? '#000000' : '#666666'} fontWeight="bold">E</text>
          <text x="50" y="98" textAnchor="middle" fontSize="10" fill={highContrastMode ? '#000000' : '#666666'} fontWeight="bold">S</text>
          <text x="5" y="50" textAnchor="middle" fontSize="10" fill={highContrastMode ? '#000000' : '#666666'} fontWeight="bold">W</text>
        </g>
      </svg>
      
      {/* Legend */}
      <div className={`mt-8 p-6 rounded-lg ${highContrastMode ? 'bg-white border-2 border-black' : 'bg-gray-50'}`}>
        <h4 className={`text-xl font-bold mb-4 ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>
          Legend
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded border-2 ${
              highContrastMode 
                ? 'bg-yellow-400 border-black' 
                : 'bg-yellow-200 border-yellow-400'
            }`} aria-hidden="true"></div>
            <span className={`text-lg ${highContrastMode ? 'text-black' : 'text-gray-800'}`}>
              In direct sunlight
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded border-2 ${
              highContrastMode 
                ? 'bg-gray-600 border-black' 
                : 'bg-gray-400 border-gray-500'
            }`} aria-hidden="true"></div>
            <span className={`text-lg ${highContrastMode ? 'text-black' : 'text-gray-800'}`}>
              In shade
            </span>
          </div>
          {sunPosition.altitudeDegrees < 0 && (
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded border-2 ${
                highContrastMode 
                  ? 'bg-gray-900 border-black' 
                  : 'bg-gray-700 border-gray-800'
              }`} aria-hidden="true"></div>
              <span className={`text-lg ${highContrastMode ? 'text-black' : 'text-gray-800'}`}>
                Night game
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Navigation Instructions */}
      <div className={`mt-6 p-4 rounded-lg ${highContrastMode ? 'bg-white border-2 border-black' : 'bg-blue-50'}`}>
        <h4 className={`font-semibold mb-2 ${highContrastMode ? 'text-black' : 'text-blue-900'}`}>
          Keyboard Navigation
        </h4>
        <p className={`text-sm ${highContrastMode ? 'text-black' : 'text-blue-800'}`}>
          Use Tab to navigate between stadium sections. Press Enter or Space when focused on a section to hear its sun exposure status.
        </p>
      </div>
    </div>
  );
};