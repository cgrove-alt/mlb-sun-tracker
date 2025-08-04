import React, { useState, useEffect } from 'react';
import { DetailedStadium, SeatSection } from '../data/detailedStadiums';
import { SunPosition } from '../utils/sunCalculations';
import { useTranslation } from '../i18n/i18nContext';

interface AccessibleDetailedStadiumViewProps {
  stadium: DetailedStadium;
  sunPosition: SunPosition;
  sunnySections: Map<string, boolean>;
}

export const AccessibleDetailedStadiumView: React.FC<AccessibleDetailedStadiumViewProps> = ({ 
  stadium, 
  sunPosition, 
  sunnySections 
}) => {
  const { t } = useTranslation();
  const [highContrastMode, setHighContrastMode] = useState(() => {
    const saved = localStorage.getItem('stadiumHighContrastMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('stadiumHighContrastMode', highContrastMode.toString());
  }, [highContrastMode]);

  const getSectionSunStatus = (section: SeatSection): 'sunny' | 'shaded' | 'partial' => {
    if (!sunPosition || sunPosition.altitudeDegrees < 0) return 'shaded';
    if (stadium.roof === 'fixed') return 'shaded';
    
    const sectionKeys = [
      section.name,
      section.id,
      `Section ${section.name}`,
      `Section ${section.id}`,
      section.name.replace(/\s+/g, ''),
      section.id.replace(/\s+/g, '')
    ];
    
    for (const key of sectionKeys) {
      const sectionInSun = sunnySections.get(key);
      if (sectionInSun !== undefined) {
        if (sectionInSun) {
          return section.level === 'Field' && sunPosition.altitudeDegrees < 20 ? 'partial' : 'sunny';
        } else {
          return 'shaded';
        }
      }
    }
    
    const relativeSunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
    
    let inSun = false;
    if (section.angle.start > section.angle.end) {
      inSun = relativeSunAngle >= section.angle.start || relativeSunAngle <= section.angle.end;
    } else {
      inSun = relativeSunAngle >= section.angle.start && relativeSunAngle <= section.angle.end;
    }
    
    if (section.level === 'Field' && sunPosition.altitudeDegrees < 20) {
      return inSun ? 'partial' : 'shaded';
    } else if (section.level === 'Grandstand' || section.level === '400' || section.level === 'Top Deck') {
      return inSun ? 'sunny' : 'partial';
    }
    
    return inSun ? 'sunny' : 'shaded';
  };

  const renderGenericDetailedStadium = () => (
    <svg 
      viewBox="0 0 400 300" 
      className={`max-w-2xl mx-auto block ${highContrastMode ? 'bg-white' : 'bg-gradient-to-br from-blue-50 to-blue-100'} rounded-2xl shadow-lg p-4`}
      role="img"
      aria-label={`${stadium.name} seating map showing sun exposure`}
    >
      <title>{stadium.name} Stadium Sun Exposure Map</title>
      <defs>
        <pattern id="sunnyPattern" patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill={highContrastMode ? "#FFD700" : "#FFF176"} />
          <circle cx="5" cy="5" r="3" fill={highContrastMode ? "#FFA500" : "#FFE082"} />
        </pattern>
        <pattern id="shadedPattern" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill={highContrastMode ? "#4A5568" : "#90A4AE"} />
          <line x1="0" y1="8" x2="8" y2="0" stroke={highContrastMode ? "#2D3748" : "#78909C"} strokeWidth="1" />
        </pattern>
        <pattern id="partialPattern" patternUnits="userSpaceOnUse" width="12" height="12">
          <rect width="12" height="12" fill={highContrastMode ? "#F59E0B" : "#FFB74D"} />
          <rect x="0" y="0" width="6" height="6" fill={highContrastMode ? "#D97706" : "#FF9800"} />
          <rect x="6" y="6" width="6" height="6" fill={highContrastMode ? "#D97706" : "#FF9800"} />
        </pattern>
      </defs>

      {/* Field */}
      <g className="field" role="group" aria-label="Baseball field">
        <ellipse cx="200" cy="200" rx="80" ry="60" fill="#10B981" stroke="#059669" strokeWidth="3"/>
        <path d="M 200 200 L 160 160 L 200 120 L 240 160 Z" fill="#92400E" stroke="#78350F" strokeWidth="2"/>
        <circle cx="200" cy="200" r="8" fill="#92400E" stroke="#78350F" strokeWidth="2"/>
      </g>

      {/* Render each seating section */}
      {stadium.seatingSections.map((section, index) => {
        const radiusBase = 120;
        const radiusIncrement = 25;
        const radius = radiusBase + (index * radiusIncrement);
        
        const startAngleRad = (section.angle.start - 90) * Math.PI / 180;
        const endAngleRad = (section.angle.end - 90) * Math.PI / 180;
        
        const x1 = 200 + (radius - 20) * Math.cos(startAngleRad);
        const y1 = 200 + (radius - 20) * Math.sin(startAngleRad);
        const x2 = 200 + radius * Math.cos(startAngleRad);
        const y2 = 200 + radius * Math.sin(startAngleRad);
        
        const x3 = 200 + radius * Math.cos(endAngleRad);
        const y3 = 200 + radius * Math.sin(endAngleRad);
        const x4 = 200 + (radius - 20) * Math.cos(endAngleRad);
        const y4 = 200 + (radius - 20) * Math.sin(endAngleRad);
        
        const largeArcFlag = Math.abs(section.angle.end - section.angle.start) > 180 ? 1 : 0;
        const sunStatus = getSectionSunStatus(section);
        
        return (
          <g 
            key={section.id} 
            role="group" 
            aria-label={`${section.name} section, ${sunStatus === 'sunny' ? 'in direct sunlight' : sunStatus === 'partial' ? 'partially shaded' : 'fully shaded'}`}
            tabIndex={0}
            className="focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                alert(`${section.name}: ${sunStatus === 'sunny' ? 'In direct sunlight' : sunStatus === 'partial' ? 'Partially shaded' : 'Fully shaded'}, ${section.capacity.toLocaleString()} seats`);
              }
            }}
          >
            <path
              d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${radius - 20} ${radius - 20} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`}
              fill={
                highContrastMode 
                  ? (sunStatus === 'sunny' ? 'url(#sunnyPattern)' : sunStatus === 'partial' ? 'url(#partialPattern)' : 'url(#shadedPattern)')
                  : (sunStatus === 'sunny' ? '#FFF176' : sunStatus === 'partial' ? '#FFB74D' : '#90A4AE')
              }
              stroke={highContrastMode ? "#000000" : "#333333"}
              strokeWidth={highContrastMode ? "3" : "2"}
              opacity={0.9}
              className="cursor-pointer hover:opacity-100 transition-opacity duration-200"
            />
            <text
              x={200 + (radius - 10) * Math.cos((startAngleRad + endAngleRad) / 2)}
              y={200 + (radius - 10) * Math.sin((startAngleRad + endAngleRad) / 2)}
              textAnchor="middle"
              fontSize={highContrastMode ? "14" : "12"}
              fill={highContrastMode ? "#000000" : "#1F2937"}
              fontWeight="bold"
              className="pointer-events-none select-none"
            >
              {section.name}
            </text>
          </g>
        );
      })}

      {/* Sun indicator */}
      {sunPosition && sunPosition.altitudeDegrees > 0 && (
        <g className="sun-indicator" role="group" aria-label={`Sun position at ${Math.round(sunPosition.azimuthDegrees)} degrees azimuth`}>
          {(() => {
            const sunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
            const sunX = 200 + 150 * Math.cos((sunAngle - 90) * Math.PI / 180);
            const sunY = 150 + 150 * Math.sin((sunAngle - 90) * Math.PI / 180);
            return (
              <>
                <circle 
                  cx={sunX} 
                  cy={sunY} 
                  r="12" 
                  fill="#FFD700" 
                  stroke="#FFA500" 
                  strokeWidth="3"
                  className="animate-pulse"
                />
                <text 
                  x={sunX} 
                  y={sunY - 16} 
                  textAnchor="middle" 
                  fontSize="16" 
                  fill={highContrastMode ? "#000000" : "#333333"}
                  aria-hidden="true"
                >
                  ☀️
                </text>
              </>
            );
          })()}
        </g>
      )}

      {/* Compass */}
      <g className="compass" role="group" aria-label="Compass directions">
        <text x="200" y="15" textAnchor="middle" fontSize="16" fill={highContrastMode ? "#000000" : "#4B5563"} fontWeight="bold">N</text>
        <text x="385" y="150" textAnchor="middle" fontSize="16" fill={highContrastMode ? "#000000" : "#4B5563"} fontWeight="bold">E</text>
        <text x="200" y="295" textAnchor="middle" fontSize="16" fill={highContrastMode ? "#000000" : "#4B5563"} fontWeight="bold">S</text>
        <text x="15" y="150" textAnchor="middle" fontSize="16" fill={highContrastMode ? "#000000" : "#4B5563"} fontWeight="bold">W</text>
      </g>
    </svg>
  );

  return (
    <div className={`${highContrastMode ? 'bg-gray-100' : 'bg-white'} rounded-2xl shadow-xl p-6 lg:p-8 transition-colors duration-300`}>
      {/* Accessibility Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className={`text-2xl lg:text-3xl font-bold ${highContrastMode ? 'text-black' : 'text-indigo-900'}`}>
          {stadium.name} Sun Exposure Map
        </h2>
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

      {/* Stadium Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${highContrastMode ? 'bg-white border-2 border-black' : 'bg-gray-50'}`}>
          <span className={`text-sm font-medium ${highContrastMode ? 'text-black' : 'text-gray-600'}`}>Team</span>
          <p className={`text-lg font-bold ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>{stadium.team}</p>
        </div>
        <div className={`p-4 rounded-lg ${highContrastMode ? 'bg-white border-2 border-black' : 'bg-gray-50'}`}>
          <span className={`text-sm font-medium ${highContrastMode ? 'text-black' : 'text-gray-600'}`}>Capacity</span>
          <p className={`text-lg font-bold ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>{stadium.capacity.toLocaleString()}</p>
        </div>
        <div className={`p-4 rounded-lg ${highContrastMode ? 'bg-white border-2 border-black' : 'bg-gray-50'}`}>
          <span className={`text-sm font-medium ${highContrastMode ? 'text-black' : 'text-gray-600'}`}>Roof Type</span>
          <p className={`text-lg font-bold ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>
            {stadium.roof === 'open' ? 'Open Air' : stadium.roof === 'fixed' ? 'Fixed Dome' : 'Retractable'}
          </p>
        </div>
      </div>

      {stadium.roof === 'fixed' && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          highContrastMode 
            ? 'bg-yellow-100 border-black text-black' 
            : 'bg-red-50 border-red-500 text-red-900'
        }`} role="alert">
          <p className="font-semibold text-lg">This stadium has a fixed roof - all seats are always shaded</p>
        </div>
      )}

      {/* Stadium Map */}
      {renderGenericDetailedStadium()}

      {/* Legend */}
      <div className={`mt-8 p-6 rounded-lg ${highContrastMode ? 'bg-white border-2 border-black' : 'bg-gray-50'}`}>
        <h3 className={`text-xl font-bold mb-4 ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>
          Legend
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg border-2 ${
              highContrastMode 
                ? 'bg-yellow-400 border-black' 
                : 'bg-yellow-200 border-yellow-400'
            }`} aria-hidden="true"></div>
            <div>
              <p className={`font-semibold text-lg ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>
                Sunny
              </p>
              <p className={`text-sm ${highContrastMode ? 'text-black' : 'text-gray-600'}`}>
                Direct sunlight
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg border-2 ${
              highContrastMode 
                ? 'bg-orange-500 border-black' 
                : 'bg-orange-300 border-orange-400'
            }`} aria-hidden="true"></div>
            <div>
              <p className={`font-semibold text-lg ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>
                Partial
              </p>
              <p className={`text-sm ${highContrastMode ? 'text-black' : 'text-gray-600'}`}>
                Some shade
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg border-2 ${
              highContrastMode 
                ? 'bg-gray-600 border-black' 
                : 'bg-gray-400 border-gray-500'
            }`} aria-hidden="true"></div>
            <div>
              <p className={`font-semibold text-lg ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>
                Shaded
              </p>
              <p className={`text-sm ${highContrastMode ? 'text-black' : 'text-gray-600'}`}>
                Full shade
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Details */}
      <div className="mt-8">
        <h3 className={`text-xl font-bold mb-4 ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>
          Seating Sections
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stadium.seatingSections.map((section) => {
            const sunStatus = getSectionSunStatus(section);
            return (
              <div
                key={section.id}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  ${highContrastMode 
                    ? sunStatus === 'sunny' ? 'bg-yellow-100 border-black' 
                      : sunStatus === 'partial' ? 'bg-orange-100 border-black' 
                      : 'bg-gray-200 border-black'
                    : sunStatus === 'sunny' ? 'bg-yellow-50 border-yellow-300' 
                      : sunStatus === 'partial' ? 'bg-orange-50 border-orange-300' 
                      : 'bg-gray-50 border-gray-300'
                  }
                  hover:shadow-lg focus-within:ring-4 focus-within:ring-offset-2
                  ${highContrastMode ? 'focus-within:ring-black' : 'focus-within:ring-indigo-400'}
                `}
                tabIndex={0}
                role="article"
                aria-label={`${section.name} section details`}
              >
                <h4 className={`font-bold text-lg mb-2 ${highContrastMode ? 'text-black' : 'text-gray-900'}`}>
                  {section.name}
                </h4>
                <p className={`text-sm mb-1 ${highContrastMode ? 'text-black' : 'text-gray-700'}`}>
                  {section.level} Level
                </p>
                <p className={`text-sm mb-2 ${highContrastMode ? 'text-black' : 'text-gray-700'}`}>
                  {section.capacity.toLocaleString()} seats
                </p>
                <div className={`
                  inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold
                  ${highContrastMode
                    ? sunStatus === 'sunny' ? 'bg-yellow-400 text-black' 
                      : sunStatus === 'partial' ? 'bg-orange-500 text-white' 
                      : 'bg-gray-600 text-white'
                    : sunStatus === 'sunny' ? 'bg-yellow-200 text-yellow-900' 
                      : sunStatus === 'partial' ? 'bg-orange-200 text-orange-900' 
                      : 'bg-gray-200 text-gray-900'
                  }
                `}>
                  <span aria-hidden="true">
                    {sunStatus === 'sunny' ? '☀️' : sunStatus === 'partial' ? '⛅' : '🌥️'}
                  </span>
                  {sunStatus === 'sunny' ? 'Sunny' : sunStatus === 'partial' ? 'Partial' : 'Shaded'}
                </div>
                {section.premium && (
                  <span className={`
                    ml-2 inline-flex px-2 py-1 rounded-full text-xs font-bold
                    ${highContrastMode 
                      ? 'bg-black text-white' 
                      : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                    }
                  `}>
                    PREMIUM
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard Navigation Instructions */}
      <div className={`mt-8 p-4 rounded-lg ${highContrastMode ? 'bg-white border-2 border-black' : 'bg-blue-50'}`}>
        <h3 className={`font-semibold mb-2 ${highContrastMode ? 'text-black' : 'text-blue-900'}`}>
          Keyboard Navigation
        </h3>
        <p className={`text-sm ${highContrastMode ? 'text-black' : 'text-blue-800'}`}>
          Use Tab to navigate between sections. Press Enter or Space on the stadium map sections to hear details.
        </p>
      </div>
    </div>
  );
};