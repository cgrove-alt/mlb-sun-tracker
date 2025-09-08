/**
 * Stadium Sun Path Viewer Component
 * Integrates 3D visualization with time controls and stadium selection
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Stadium, MLB_STADIUMS } from '../data/stadiums';
import { getSunPosition, SunPosition } from '../utils/sunCalculations';
import { DetailedSection } from '../types/stadium-complete';
import { Obstruction3D } from '../types/stadium-complete';
import { format } from 'date-fns';

// Dynamic import for Three.js component (client-side only)
const Stadium3DVisualization = dynamic(
  () => import('./Stadium3DVisualization'),
  { 
    ssr: false,
    loading: () => <div className="loading-3d">Loading 3D viewer...</div>
  }
);

interface StadiumSunPathViewerProps {
  stadium: Stadium;
  sections: DetailedSection[];
  obstructions: Obstruction3D[];
  initialDate?: Date;
  initialTime?: string;
}

export const StadiumSunPathViewer: React.FC<StadiumSunPathViewerProps> = ({
  stadium,
  sections,
  obstructions,
  initialDate = new Date(),
  initialTime = '15:00'
}) => {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [animating, setAnimating] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showSunPath, setShowSunPath] = useState(true);
  const [showShadows, setShowShadows] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'timeline'>('3d');

  // Calculate current sun position
  const currentDateTime = useMemo(() => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const date = new Date(selectedDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }, [selectedDate, selectedTime]);

  const sunPosition = useMemo(() => {
    return getSunPosition(
      currentDateTime,
      stadium.latitude,
      stadium.longitude,
      stadium.timezone
    );
  }, [currentDateTime, stadium]);

  // Generate sun positions for the entire day
  const daySunPositions = useMemo(() => {
    const positions: { time: string; position: SunPosition; isDaytime: boolean }[] = [];
    const date = new Date(selectedDate);
    
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        date.setHours(hour, minute, 0, 0);
        const position = getSunPosition(
          date,
          stadium.latitude,
          stadium.longitude,
          stadium.timezone
        );
        
        positions.push({
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          position,
          isDaytime: position.altitudeDegrees > 0
        });
      }
    }
    
    return positions;
  }, [selectedDate, stadium]);

  // Animation timer
  useEffect(() => {
    if (!animating) return;

    const interval = setInterval(() => {
      setSelectedTime(prevTime => {
        const [hours, minutes] = prevTime.split(':').map(Number);
        let newMinutes = minutes + 15;
        let newHours = hours;
        
        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours = (hours + 1) % 24;
        }
        
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [animating]);

  const handleSectionClick = useCallback((sectionId: string) => {
    setSelectedSection(prevSection => 
      prevSection === sectionId ? null : sectionId
    );
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTime(e.target.value);
  };

  const selectedSectionData = useMemo(() => {
    if (!selectedSection) return null;
    return sections.find(s => s.id === selectedSection);
  }, [selectedSection, sections]);

  return (
    <div className="stadium-sun-path-viewer">
      {/* Header Controls */}
      <div className="viewer-header">
        <h2>{stadium.name} - Sun Path Visualization</h2>
        <div className="view-mode-toggle">
          <button 
            className={viewMode === '3d' ? 'active' : ''}
            onClick={() => setViewMode('3d')}
          >
            3D View
          </button>
          <button 
            className={viewMode === 'timeline' ? 'active' : ''}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
        </div>
      </div>

      {/* Time Controls */}
      <div className="time-controls">
        <div className="control-group">
          <label htmlFor="date">Date:</label>
          <input 
            type="date" 
            id="date"
            value={format(selectedDate, 'yyyy-MM-dd')}
            onChange={handleDateChange}
          />
        </div>
        
        <div className="control-group">
          <label htmlFor="time">Time:</label>
          <input 
            type="time" 
            id="time"
            value={selectedTime}
            onChange={handleTimeChange}
            step="900"
          />
        </div>

        <div className="control-group">
          <button 
            className="animate-btn"
            onClick={() => setAnimating(!animating)}
          >
            {animating ? '⏸ Pause' : '▶ Animate'}
          </button>
        </div>

        <div className="sun-info">
          <span>☀️ Azimuth: {sunPosition.azimuthDegrees.toFixed(1)}°</span>
          <span>📐 Elevation: {sunPosition.altitudeDegrees.toFixed(1)}°</span>
          <span>{sunPosition.altitudeDegrees > 0 ? '🌞 Daytime' : '🌙 Nighttime'}</span>
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="visualization-container">
        {viewMode === '3d' ? (
          <Stadium3DVisualization
            sections={sections}
            obstructions={obstructions}
            sunPosition={sunPosition}
            currentTime={currentDateTime}
            showSunPath={showSunPath}
            showShadows={showShadows}
            showLabels={showLabels}
            selectedSection={selectedSection || undefined}
            onSectionClick={handleSectionClick}
            width={1000}
            height={600}
          />
        ) : (
          <div className="timeline-view">
            <h3>Sun Position Throughout the Day</h3>
            <div className="timeline-chart">
              <svg width="1000" height="400" viewBox="0 0 1000 400">
                {/* Grid lines */}
                {[0, 6, 12, 18, 24].map(hour => (
                  <g key={hour}>
                    <line
                      x1={hour * (1000 / 24)}
                      y1="0"
                      x2={hour * (1000 / 24)}
                      y2="400"
                      stroke="#e0e0e0"
                      strokeDasharray="2,2"
                    />
                    <text
                      x={hour * (1000 / 24)}
                      y="395"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#666"
                    >
                      {hour}:00
                    </text>
                  </g>
                ))}

                {/* Sun elevation path */}
                <polyline
                  points={daySunPositions
                    .map((pos, i) => {
                      const x = (i / daySunPositions.length) * 1000;
                      const y = 350 - (Math.max(0, pos.position.altitudeDegrees) / 90) * 300;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#ffd700"
                  strokeWidth="3"
                />

                {/* Current time indicator */}
                {(() => {
                  const [hours, minutes] = selectedTime.split(':').map(Number);
                  const x = ((hours + minutes / 60) / 24) * 1000;
                  return (
                    <g>
                      <line
                        x1={x}
                        y1="0"
                        x2={x}
                        y2="350"
                        stroke="#ff6b6b"
                        strokeWidth="2"
                      />
                      <circle
                        cx={x}
                        cy={350 - (Math.max(0, sunPosition.altitudeDegrees) / 90) * 300}
                        r="6"
                        fill="#ff6b6b"
                      />
                    </g>
                  );
                })()}

                {/* Horizon line */}
                <line
                  x1="0"
                  y1="350"
                  x2="1000"
                  y2="350"
                  stroke="#333"
                  strokeWidth="1"
                />
                
                {/* Labels */}
                <text x="10" y="20" fontSize="14" fill="#666">90°</text>
                <text x="10" y="185" fontSize="14" fill="#666">45°</text>
                <text x="10" y="345" fontSize="14" fill="#666">0°</text>
                <text x="10" y="370" fontSize="12" fill="#999">Horizon</text>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Section Information Panel */}
      {selectedSectionData && (
        <div className="section-info-panel">
          <h3>Selected Section: {selectedSectionData.name}</h3>
          <div className="section-details">
            <p>Level: {selectedSectionData.level}</p>
            <p>Capacity: {selectedSectionData.capacity} seats</p>
            <p>Covered: {selectedSectionData.covered ? 'Yes' : 'No'}</p>
            <p>Elevation: {selectedSectionData.elevation}ft</p>
            <p>Angle: {selectedSectionData.baseAngle}° - {(selectedSectionData.baseAngle + selectedSectionData.angleSpan) % 360}°</p>
          </div>
          <button 
            className="close-btn"
            onClick={() => setSelectedSection(null)}
          >
            Close
          </button>
        </div>
      )}

      {/* Display Options */}
      <div className="display-options">
        <h4>Display Options</h4>
        <label>
          <input 
            type="checkbox" 
            checked={showSunPath}
            onChange={(e) => setShowSunPath(e.target.checked)}
          />
          Show Sun Path
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={showShadows}
            onChange={(e) => setShowShadows(e.target.checked)}
          />
          Show Shadows
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
          Show Section Labels
        </label>
      </div>

      <style jsx>{`
        .stadium-sun-path-viewer {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .viewer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e0e0e0;
        }

        .viewer-header h2 {
          margin: 0;
          color: #333;
          font-size: 24px;
        }

        .view-mode-toggle {
          display: flex;
          gap: 10px;
        }

        .view-mode-toggle button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-mode-toggle button.active {
          background: #4a90e2;
          color: white;
          border-color: #4a90e2;
        }

        .time-controls {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .control-group label {
          font-weight: 500;
          color: #555;
        }

        .control-group input {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .animate-btn {
          padding: 8px 16px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s ease;
        }

        .animate-btn:hover {
          background: #218838;
        }

        .sun-info {
          margin-left: auto;
          display: flex;
          gap: 15px;
          font-size: 14px;
          color: #666;
        }

        .visualization-container {
          margin-bottom: 20px;
          display: flex;
          justify-content: center;
        }

        .loading-3d {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 600px;
          font-size: 18px;
          color: #666;
        }

        .timeline-view {
          width: 100%;
          padding: 20px;
          background: #fafafa;
          border-radius: 8px;
        }

        .timeline-view h3 {
          margin-top: 0;
          color: #333;
        }

        .timeline-chart {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .section-info-panel {
          position: fixed;
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 300px;
          padding: 20px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 100;
        }

        .section-info-panel h3 {
          margin-top: 0;
          color: #333;
          font-size: 18px;
        }

        .section-details p {
          margin: 8px 0;
          color: #666;
          font-size: 14px;
        }

        .close-btn {
          margin-top: 15px;
          padding: 8px 16px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
        }

        .display-options {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .display-options h4 {
          margin: 0;
          margin-right: 10px;
          color: #555;
          font-size: 16px;
        }

        .display-options label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #666;
          cursor: pointer;
        }

        .display-options input[type="checkbox"] {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default StadiumSunPathViewer;