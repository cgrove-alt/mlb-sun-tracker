import React, { useState, useEffect } from 'react';
import { DetailedStadium, SeatSection } from '../data/detailedStadiums';
import { SunPosition } from '../utils/sunCalculations';
import { useTranslation } from '../i18n/i18nContext';
import { MobileStadiumMapWrapper } from './MobileStadiumMapWrapper';
import './DetailedStadiumView.css';

interface DetailedStadiumViewProps {
  stadium: DetailedStadium;
  sunPosition: SunPosition;
  sunnySections: Map<string, boolean>;
}

export const DetailedStadiumView: React.FC<DetailedStadiumViewProps> = ({ 
  stadium, 
  sunPosition, 
  sunnySections 
}) => {
  const { t } = useTranslation();
  const getSectionSunStatus = (section: SeatSection): 'sunny' | 'shaded' | 'partial' => {
    if (!sunPosition || sunPosition.altitudeDegrees < 0) return 'shaded';
    if (stadium.roof === 'fixed') return 'shaded';
    
    // First, try to use weather-adjusted sun data from sunnySections Map
    const sectionKeys = [
      section.name,
      section.id,
      `Section ${section.name}`,
      `Section ${section.id}`,
      section.name.replace(/\s+/g, ''), // Remove spaces
      section.id.replace(/\s+/g, '')    // Remove spaces
    ];
    
    for (const key of sectionKeys) {
      const sectionInSun = sunnySections.get(key);
      if (sectionInSun !== undefined) {
        // Use the weather-adjusted data
        console.log(`Found weather-adjusted data for section ${section.name}/${section.id} using key: ${key}, inSun: ${sectionInSun}`);
        if (sectionInSun) {
          return section.level === 'Field' && sunPosition.altitudeDegrees < 20 ? 'partial' : 'sunny';
        } else {
          return 'shaded';
        }
      }
    }
    
    // Fallback to manual calculation if no match found (shouldn't happen with proper data)
    console.warn(`No weather-adjusted data found for section: ${section.name}/${section.id}`);
    
    const relativeSunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
    
    let inSun = false;
    if (section.angle.start > section.angle.end) {
      // Section crosses 0 degrees
      inSun = relativeSunAngle >= section.angle.start || relativeSunAngle <= section.angle.end;
    } else {
      inSun = relativeSunAngle >= section.angle.start && relativeSunAngle <= section.angle.end;
    }
    
    // Consider sun altitude for different levels
    if (section.level === 'Field' && sunPosition.altitudeDegrees < 20) {
      return inSun ? 'partial' : 'shaded';
    } else if (section.level === 'Grandstand' || section.level === '400' || section.level === 'Top Deck') {
      return inSun ? 'sunny' : 'partial'; // Upper levels get more sun
    }
    
    return inSun ? 'sunny' : 'shaded';
  };

  const renderYankeeStadium = () => (
    <svg viewBox="0 0 400 300" className="stadium-svg">
      {/* Field */}
      <g className="field">
        <ellipse cx="200" cy="200" rx="80" ry="60" fill="#90EE90" stroke="#4A5D23" strokeWidth="2"/>
        <path d="M 200 200 L 160 160 L 200 120 L 240 160 Z" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
        <circle cx="200" cy="200" r="8" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      </g>

      {/* Field Level Infield */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[0])}`}>
        <path d="M 140 180 Q 200 140 260 180 L 260 200 Q 200 160 140 200 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="200" y="170" textAnchor="middle" fontSize="10" fill="#333">Field Level Infield</text>
      </g>

      {/* Field Level Outfield */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[1])}`}>
        <path d="M 120 180 Q 80 200 80 240 Q 80 260 120 280 L 280 280 Q 320 260 320 240 Q 320 200 280 180 L 260 180 Q 200 140 140 180 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="100" y="230" textAnchor="middle" fontSize="8" fill="#333">Left Field</text>
        <text x="300" y="230" textAnchor="middle" fontSize="8" fill="#333">Right Field</text>
      </g>

      {/* Main Level (200s) */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[2])}`}>
        <path d="M 100 160 Q 60 180 60 220 Q 60 280 100 300 L 300 300 Q 340 280 340 220 Q 340 180 300 160 L 280 180 Q 200 140 120 180 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="200" y="250" textAnchor="middle" fontSize="10" fill="#333">Main Level (200s)</text>
      </g>

      {/* Terrace Level (300s) */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[3])}`}>
        <path d="M 110 120 Q 70 140 70 180 Q 70 260 110 280 L 290 280 Q 330 260 330 180 Q 330 140 290 120 L 280 140 Q 200 100 120 140 Z" 
              stroke="#333" strokeWidth="1" opacity="0.6"/>
        <text x="200" y="200" textAnchor="middle" fontSize="10" fill="#333">Terrace (300s)</text>
      </g>

      {/* Grandstand (400s) */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[4])}`}>
        <path d="M 120 80 Q 80 100 80 140 Q 80 240 120 260 L 280 260 Q 320 240 320 140 Q 320 100 280 80 L 270 100 Q 200 60 130 100 Z" 
              stroke="#333" strokeWidth="1" opacity="0.4"/>
        <text x="200" y="150" textAnchor="middle" fontSize="10" fill="#333">Grandstand (400s)</text>
      </g>

      {/* Sun indicator */}
      {sunPosition && sunPosition.altitudeDegrees > 0 && (
        <g className="sun-indicator">
          {(() => {
            const sunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
            const sunX = 200 + 150 * Math.cos((sunAngle - 90) * Math.PI / 180);
            const sunY = 150 + 150 * Math.sin((sunAngle - 90) * Math.PI / 180);
            return (
              <>
                <circle cx={sunX} cy={sunY} r="8" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
                <text x={sunX} y={sunY - 12} textAnchor="middle" fontSize="10" fill="#333">☀️</text>
              </>
            );
          })()}
        </g>
      )}

      {/* Compass */}
      <g className="compass">
        <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">N</text>
        <text x="385" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">E</text>
        <text x="200" y="295" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">S</text>
        <text x="15" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">W</text>
      </g>
    </svg>
  );

  const renderDodgerStadium = () => (
    <svg viewBox="0 0 400 300" className="stadium-svg">
      {/* Field */}
      <g className="field">
        <ellipse cx="200" cy="210" rx="90" ry="70" fill="#90EE90" stroke="#4A5D23" strokeWidth="2"/>
        <path d="M 200 210 L 160 170 L 200 130 L 240 170 Z" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
        <circle cx="200" cy="210" r="8" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      </g>

      {/* Field Level */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[0])}`}>
        <path d="M 130 190 Q 200 150 270 190 L 270 220 Q 200 180 130 220 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="200" y="180" textAnchor="middle" fontSize="10" fill="#333">Field Level</text>
      </g>

      {/* Loge Level */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[1])}`}>
        <path d="M 110 170 Q 70 190 70 230 Q 70 270 110 290 L 290 290 Q 330 270 330 230 Q 330 190 290 170 L 270 190 Q 200 150 130 190 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="200" y="240" textAnchor="middle" fontSize="10" fill="#333">Loge Level</text>
      </g>

      {/* Reserve Level */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[2])}`}>
        <path d="M 90 150 Q 50 170 50 210 Q 50 270 90 290 L 310 290 Q 350 270 350 210 Q 350 170 310 150 L 290 170 Q 200 130 110 170 Z" 
              stroke="#333" strokeWidth="1" opacity="0.6"/>
        <text x="200" y="220" textAnchor="middle" fontSize="10" fill="#333">Reserve Level</text>
      </g>

      {/* Top Deck */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[3])}`}>
        <path d="M 130 100 Q 90 120 90 160 Q 90 200 130 220 L 270 220 Q 310 200 310 160 Q 310 120 270 100 L 250 120 Q 200 80 150 120 Z" 
              stroke="#333" strokeWidth="1" opacity="0.4"/>
        <text x="200" y="160" textAnchor="middle" fontSize="10" fill="#333">Top Deck</text>
      </g>

      {/* Pavilion (Outfield) */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[4])}`}>
        <path d="M 90 250 Q 50 270 90 290 L 120 290 L 120 270 Q 90 260 90 250 Z M 310 250 Q 350 270 310 290 L 280 290 L 280 270 Q 310 260 310 250 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="105" y="280" textAnchor="middle" fontSize="8" fill="#333">Pavilion</text>
        <text x="295" y="280" textAnchor="middle" fontSize="8" fill="#333">Pavilion</text>
      </g>

      {/* Sun indicator */}
      {sunPosition && sunPosition.altitudeDegrees > 0 && (
        <g className="sun-indicator">
          {(() => {
            const sunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
            const sunX = 200 + 150 * Math.cos((sunAngle - 90) * Math.PI / 180);
            const sunY = 150 + 150 * Math.sin((sunAngle - 90) * Math.PI / 180);
            return (
              <>
                <circle cx={sunX} cy={sunY} r="8" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
                <text x={sunX} y={sunY - 12} textAnchor="middle" fontSize="10" fill="#333">☀️</text>
              </>
            );
          })()}
        </g>
      )}

      {/* Compass */}
      <g className="compass">
        <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">N</text>
        <text x="385" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">E</text>
        <text x="200" y="295" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">S</text>
        <text x="15" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">W</text>
      </g>
    </svg>
  );

  const renderFenwayPark = () => (
    <svg viewBox="0 0 400 300" className="stadium-svg">
      {/* Field */}
      <g className="field">
        <ellipse cx="200" cy="200" rx="85" ry="65" fill="#90EE90" stroke="#4A5D23" strokeWidth="2"/>
        <path d="M 200 200 L 160 160 L 200 120 L 240 160 Z" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
        <circle cx="200" cy="200" r="8" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      </g>

      {/* Green Monster */}
      <g className={`seating-section green-monster ${getSectionSunStatus(stadium.seatingSections[1])}`}>
        <rect x="110" y="180" width="8" height="40" fill="#228B22" stroke="#006400" strokeWidth="2"/>
        <rect x="110" y="175" width="8" height="10" stroke="#333" strokeWidth="1" opacity="0.9"/>
        <text x="115" y="170" textAnchor="middle" fontSize="8" fill="#333" fontWeight="bold">Green Monster</text>
      </g>

      {/* Field Box */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[0])}`}>
        <path d="M 140 180 Q 200 140 260 180 L 280 200 Q 200 160 120 200 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="200" y="170" textAnchor="middle" fontSize="10" fill="#333">Field Box</text>
      </g>

      {/* Loge Box */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[2])}`}>
        <path d="M 120 160 Q 80 180 80 220 Q 80 260 120 280 L 280 280 Q 320 260 320 220 Q 320 180 280 160 L 260 180 Q 200 140 140 180 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="200" y="240" textAnchor="middle" fontSize="10" fill="#333">Loge Box</text>
      </g>

      {/* Grandstand */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[3])}`}>
        <path d="M 130 120 Q 90 140 90 180 Q 90 240 130 260 L 270 260 Q 310 240 310 180 Q 310 140 270 120 L 250 140 Q 200 100 150 140 Z" 
              stroke="#333" strokeWidth="1" opacity="0.6"/>
        <text x="200" y="200" textAnchor="middle" fontSize="10" fill="#333">Grandstand</text>
      </g>

      {/* Bleachers */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[4])}`}>
        <path d="M 280 180 Q 320 200 320 240 L 340 240 L 340 200 Q 320 180 290 180 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="320" y="220" textAnchor="middle" fontSize="8" fill="#333">Bleachers</text>
      </g>

      {/* Pesky Pole */}
      <g className="pesky-pole">
        <line x1="295" y1="200" x2="295" y2="180" stroke="#FFD700" strokeWidth="3"/>
        <text x="300" y="175" fontSize="8" fill="#333">Pesky Pole</text>
      </g>

      {/* Sun indicator */}
      {sunPosition && sunPosition.altitudeDegrees > 0 && (
        <g className="sun-indicator">
          {(() => {
            const sunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
            const sunX = 200 + 150 * Math.cos((sunAngle - 90) * Math.PI / 180);
            const sunY = 150 + 150 * Math.sin((sunAngle - 90) * Math.PI / 180);
            return (
              <>
                <circle cx={sunX} cy={sunY} r="8" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
                <text x={sunX} y={sunY - 12} textAnchor="middle" fontSize="10" fill="#333">☀️</text>
              </>
            );
          })()}
        </g>
      )}

      {/* Compass */}
      <g className="compass">
        <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">N</text>
        <text x="385" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">E</text>
        <text x="200" y="295" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">S</text>
        <text x="15" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">W</text>
      </g>
    </svg>
  );


  const renderOraclePark = () => (
    <svg viewBox="0 0 400 300" className="stadium-svg">
      {/* Field */}
      <g className="field">
        <ellipse cx="200" cy="200" rx="85" ry="65" fill="#90EE90" stroke="#4A5D23" strokeWidth="2"/>
        <path d="M 200 200 L 160 160 L 200 120 L 240 160 Z" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
        <circle cx="200" cy="200" r="8" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      </g>

      {/* McCovey Cove representation */}
      <g className="mccovey-cove">
        <ellipse cx="320" cy="200" rx="30" ry="60" fill="#4169E1" stroke="#1E90FF" strokeWidth="2" opacity="0.7"/>
        <text x="320" y="270" textAnchor="middle" fontSize="8" fill="#333">McCovey Cove</text>
      </g>

      {/* Field Club */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[0])}`}>
        <path d="M 140 185 Q 200 145 260 185 L 260 205 Q 200 165 140 205 Z" 
              stroke="#333" strokeWidth="1" opacity="0.9"/>
        <text x="200" y="175" textAnchor="middle" fontSize="9" fill="#333">Field Club</text>
      </g>

      {/* Lower Box */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[1])}`}>
        <path d="M 120 170 Q 80 190 80 230 Q 80 270 120 290 L 280 290 Q 320 270 320 230 Q 320 190 280 170 L 260 185 Q 200 145 140 185 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="200" y="240" textAnchor="middle" fontSize="10" fill="#333">Lower Box</text>
      </g>

      {/* Club Level */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[2])}`}>
        <path d="M 110 140 Q 70 160 70 200 Q 70 260 110 280 L 290 280 Q 330 260 330 200 Q 330 160 290 140 L 270 155 Q 200 115 130 155 Z" 
              stroke="#333" strokeWidth="1" opacity="0.7"/>
        <text x="200" y="210" textAnchor="middle" fontSize="10" fill="#333">Club Level</text>
      </g>

      {/* Upper Reserved */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[3])}`}>
        <path d="M 100 110 Q 60 130 60 170 Q 60 240 100 260 L 300 260 Q 340 240 340 170 Q 340 130 300 110 L 280 125 Q 200 85 120 125 Z" 
              stroke="#333" strokeWidth="1" opacity="0.6"/>
        <text x="200" y="180" textAnchor="middle" fontSize="10" fill="#333">Upper Reserved</text>
      </g>

      {/* Right Field Bleachers */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[4])}`}>
        <path d="M 280 180 Q 300 200 300 240 L 290 260 L 270 250 Q 280 220 280 180 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="285" y="220" textAnchor="middle" fontSize="8" fill="#333">Bleachers</text>
      </g>

      {/* Sun indicator */}
      {sunPosition && sunPosition.altitudeDegrees > 0 && (
        <g className="sun-indicator">
          {(() => {
            const sunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
            const sunX = 200 + 150 * Math.cos((sunAngle - 90) * Math.PI / 180);
            const sunY = 150 + 150 * Math.sin((sunAngle - 90) * Math.PI / 180);
            return (
              <>
                <circle cx={sunX} cy={sunY} r="8" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
                <text x={sunX} y={sunY - 12} textAnchor="middle" fontSize="10" fill="#333">☀️</text>
              </>
            );
          })()}
        </g>
      )}

      {/* Compass */}
      <g className="compass">
        <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">N</text>
        <text x="385" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">E</text>
        <text x="200" y="295" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">S</text>
        <text x="15" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">W</text>
      </g>
    </svg>
  );

  const renderWrigleyField = () => (
    <svg viewBox="0 0 400 300" className="stadium-svg">
      {/* Field */}
      <g className="field">
        <ellipse cx="200" cy="200" rx="80" ry="60" fill="#90EE90" stroke="#4A5D23" strokeWidth="2"/>
        <path d="M 200 200 L 160 160 L 200 120 L 240 160 Z" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
        <circle cx="200" cy="200" r="8" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      </g>

      {/* Ivy walls */}
      <g className="ivy-walls">
        <path d="M 280 200 Q 320 200 320 240" stroke="#228B22" strokeWidth="4" fill="none"/>
        <path d="M 120 200 Q 80 200 80 240" stroke="#228B22" strokeWidth="4" fill="none"/>
        <text x="300" y="275" fontSize="8" fill="#228B22">Ivy Wall</text>
        <text x="100" y="275" fontSize="8" fill="#228B22">Ivy Wall</text>
      </g>

      {/* Manual Scoreboard */}
      <g className="scoreboard">
        <rect x="190" y="80" width="20" height="15" fill="#004d25" stroke="#333" strokeWidth="1"/>
        <text x="200" y="75" textAnchor="middle" fontSize="7" fill="#333">Manual Scoreboard</text>
      </g>

      {/* Field Box */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[0])}`}>
        <path d="M 140 180 Q 200 140 260 180 L 260 200 Q 200 160 140 200 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="200" y="170" textAnchor="middle" fontSize="10" fill="#333">Field Box</text>
      </g>

      {/* Terrace Box */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[1])}`}>
        <path d="M 120 160 Q 80 180 80 220 Q 80 260 120 280 L 280 280 Q 320 260 320 220 Q 320 180 280 160 L 260 180 Q 200 140 140 180 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="200" y="240" textAnchor="middle" fontSize="10" fill="#333">Terrace Box</text>
      </g>

      {/* Upper Deck Box */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[2])}`}>
        <path d="M 110 120 Q 70 140 70 180 Q 70 240 110 260 L 290 260 Q 330 240 330 180 Q 330 140 290 120 L 270 140 Q 200 100 130 140 Z" 
              stroke="#333" strokeWidth="1" opacity="0.6"/>
        <text x="200" y="200" textAnchor="middle" fontSize="10" fill="#333">Upper Deck</text>
      </g>

      {/* Bleachers */}
      <g className={`seating-section ${getSectionSunStatus(stadium.seatingSections[3])}`}>
        <path d="M 280 170 Q 330 190 330 230 L 340 240 L 320 250 Q 300 230 280 200 Z M 120 170 Q 70 190 70 230 L 60 240 L 80 250 Q 100 230 120 200 Z" 
              stroke="#333" strokeWidth="1" opacity="0.8"/>
        <text x="320" y="220" textAnchor="middle" fontSize="8" fill="#333">Bleachers</text>
        <text x="80" y="220" textAnchor="middle" fontSize="8" fill="#333">Bleachers</text>
      </g>

      {/* Sun indicator */}
      {sunPosition && sunPosition.altitudeDegrees > 0 && (
        <g className="sun-indicator">
          {(() => {
            const sunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
            const sunX = 200 + 150 * Math.cos((sunAngle - 90) * Math.PI / 180);
            const sunY = 150 + 150 * Math.sin((sunAngle - 90) * Math.PI / 180);
            return (
              <>
                <circle cx={sunX} cy={sunY} r="8" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
                <text x={sunX} y={sunY - 12} textAnchor="middle" fontSize="10" fill="#333">☀️</text>
              </>
            );
          })()}
        </g>
      )}

      {/* Compass */}
      <g className="compass">
        <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">N</text>
        <text x="385" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">E</text>
        <text x="200" y="295" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">S</text>
        <text x="15" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">W</text>
      </g>
    </svg>
  );

  const renderGenericDetailedStadium = () => (
    <svg viewBox="0 0 400 300" className="stadium-svg">
      {/* Field */}
      <g className="field">
        <ellipse cx="200" cy="200" rx="80" ry="60" fill="#90EE90" stroke="#4A5D23" strokeWidth="2"/>
        <path d="M 200 200 L 160 160 L 200 120 L 240 160 Z" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
        <circle cx="200" cy="200" r="8" fill="#8B4513" stroke="#654321" strokeWidth="1"/>
      </g>

      {/* Render each seating section */}
      {stadium.seatingSections.map((section, index) => {
        const radiusBase = 120;
        const radiusIncrement = 25;
        const radius = radiusBase + (index * radiusIncrement);
        
        // Convert angles to SVG path
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
        
        return (
          <g key={section.id} className={`seating-section ${getSectionSunStatus(section)}`}>
            <path
              d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x3} ${y3} L ${x4} ${y4} A ${radius - 20} ${radius - 20} 0 ${largeArcFlag} 0 ${x1} ${y1} Z`}
              stroke="#333"
              strokeWidth="1"
              opacity={0.8 - index * 0.1}
            />
            <text
              x={200 + (radius - 10) * Math.cos((startAngleRad + endAngleRad) / 2)}
              y={200 + (radius - 10) * Math.sin((startAngleRad + endAngleRad) / 2)}
              textAnchor="middle"
              fontSize="8"
              fill="#333"
              fontWeight="bold"
            >
              {section.name}
            </text>
          </g>
        );
      })}

      {/* Stadium-specific features */}
      {stadium.id === 'redsox' && (
        <g className="green-monster">
          <rect x="110" y="180" width="8" height="40" fill="#228B22" stroke="#006400" strokeWidth="2"/>
          <rect x="110" y="175" width="8" height="10" stroke="#333" strokeWidth="1" opacity="0.9"/>
          <text x="115" y="170" textAnchor="middle" fontSize="8" fill="#333" fontWeight="bold">Green Monster</text>
        </g>
      )}

      {stadium.id === 'giants' && (
        <g className="mccovey-cove">
          <ellipse cx="320" cy="200" rx="30" ry="60" fill="#4169E1" stroke="#1E90FF" strokeWidth="2" opacity="0.7"/>
          <text x="320" y="270" textAnchor="middle" fontSize="8" fill="#333">McCovey Cove</text>
        </g>
      )}

      {stadium.id === 'cubs' && (
        <>
          <g className="ivy-walls">
            <path d="M 280 200 Q 320 200 320 240" stroke="#228B22" strokeWidth="4" fill="none"/>
            <path d="M 120 200 Q 80 200 80 240" stroke="#228B22" strokeWidth="4" fill="none"/>
            <text x="300" y="275" fontSize="8" fill="#228B22">Ivy Wall</text>
          </g>
          <g className="scoreboard">
            <rect x="190" y="80" width="20" height="15" fill="#004d25" stroke="#333" strokeWidth="1"/>
            <text x="200" y="75" textAnchor="middle" fontSize="7" fill="#333">Manual Scoreboard</text>
          </g>
        </>
      )}

      {stadium.id === 'pirates' && (
        <g className="bridge">
          <path d="M 50 100 Q 100 80 150 100" stroke="#FFD700" strokeWidth="3" fill="none"/>
          <text x="100" y="95" textAnchor="middle" fontSize="8" fill="#333">Clemente Bridge</text>
        </g>
      )}

      {stadium.id === 'orioles' && (
        <g className="warehouse">
          <rect x="300" y="120" width="80" height="40" fill="#8B4513" stroke="#654321" strokeWidth="2"/>
          <text x="340" y="115" textAnchor="middle" fontSize="8" fill="#333">Warehouse</text>
        </g>
      )}

      {stadium.id === 'astros' && stadium.roof === 'retractable' && (
        <g className="roof-indicator">
          <text x="200" y="40" textAnchor="middle" fontSize="10" fill="#666">Retractable Roof</text>
        </g>
      )}

      {stadium.id === 'rays' && (
        <g className="dome">
          <ellipse cx="200" cy="150" rx="180" ry="120" fill="none" stroke="#666" strokeWidth="2" strokeDasharray="5,5"/>
          <text x="200" y="50" textAnchor="middle" fontSize="10" fill="#666">Fixed Dome</text>
        </g>
      )}

      {stadium.id === 'rockies' && (
        <g className="mountains">
          <path d="M 50 100 L 80 70 L 110 100 L 140 60 L 170 100 L 200 50 L 230 100 L 260 60 L 290 100 L 320 70 L 350 100" 
                stroke="#8B7355" strokeWidth="3" fill="none"/>
          <text x="200" y="45" textAnchor="middle" fontSize="8" fill="#333">Rocky Mountains</text>
        </g>
      )}

      {stadium.id === 'royals' && (
        <g className="fountains">
          <circle cx="320" cy="220" r="8" fill="#4169E1" opacity="0.7"/>
          <circle cx="80" cy="220" r="8" fill="#4169E1" opacity="0.7"/>
          <text x="200" y="290" textAnchor="middle" fontSize="8" fill="#333">Fountains</text>
        </g>
      )}

      {/* Sun indicator */}
      {sunPosition && sunPosition.altitudeDegrees > 0 && (
        <g className="sun-indicator">
          {(() => {
            const sunAngle = (sunPosition.azimuthDegrees - stadium.orientation + 360) % 360;
            const sunX = 200 + 150 * Math.cos((sunAngle - 90) * Math.PI / 180);
            const sunY = 150 + 150 * Math.sin((sunAngle - 90) * Math.PI / 180);
            return (
              <>
                <circle cx={sunX} cy={sunY} r="8" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
                <text x={sunX} y={sunY - 12} textAnchor="middle" fontSize="10" fill="#333">☀️</text>
              </>
            );
          })()}
        </g>
      )}

      {/* Compass */}
      <g className="compass">
        <text x="200" y="15" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">N</text>
        <text x="385" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">E</text>
        <text x="200" y="295" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">S</text>
        <text x="15" y="150" textAnchor="middle" fontSize="12" fill="#666" fontWeight="bold">W</text>
      </g>
    </svg>
  );

  const renderStadium = () => {
    // Use specific renderings for the most iconic stadiums
    switch (stadium.id) {
      case 'yankees':
        return renderYankeeStadium();
      case 'dodgers':
        return renderDodgerStadium();
      case 'redsox':
        return renderFenwayPark();
      case 'giants':
        return renderOraclePark();
      case 'cubs':
        return renderWrigleyField();
      default:
        // Use the generic detailed rendering for all other stadiums
        return renderGenericDetailedStadium();
    }
  };

  return (
    <div className="detailed-stadium-container">
      <div className="stadium-header">
        <h3>{t(`mlb.stadiums.${stadium.id}`)}</h3>
        <div className="stadium-details">
          <span>{t('game.homeTeam')}: {t(`mlb.teams.${stadium.id}`)}</span>
          <span>{t('stadium.capacity')}: {stadium.capacity.toLocaleString()}</span>
          <span>{t('stadium.roof')}: {t(`stadium.roofTypes.${stadium.roof}`)}</span>
        </div>
        {stadium.roof === 'fixed' && (
          <p className="roof-warning">This stadium has a fixed roof - no direct sunlight on seats</p>
        )}
      </div>

      <MobileStadiumMapWrapper>
        {renderStadium()}
      </MobileStadiumMapWrapper>

      <div className="section-details">
        <h4>Seating Sections</h4>
        <div className="sections-grid">
          {stadium.seatingSections.map((section) => (
            <div key={section.id} className={`section-card ${getSectionSunStatus(section)}`}>
              <h5>{section.name}</h5>
              <p className="section-level">{section.level} Level</p>
              <p className="section-capacity">{section.capacity.toLocaleString()} seats</p>
              <div className="sun-status">
                {getSectionSunStatus(section) === 'sunny' && <span className="status sunny">☀️ Sunny</span>}
                {getSectionSunStatus(section) === 'partial' && <span className="status partial">⛅ Partial</span>}
                {getSectionSunStatus(section) === 'shaded' && <span className="status shaded">🌥️ Shaded</span>}
              </div>
              {section.premium && <span className="premium-badge">Premium</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="special-features">
        <h4>Special Features</h4>
        <div className="features-list">
          {stadium.specialFeatures.map((feature, index) => (
            <span key={index} className="feature-badge">{feature}</span>
          ))}
        </div>
      </div>
    </div>
  );
};