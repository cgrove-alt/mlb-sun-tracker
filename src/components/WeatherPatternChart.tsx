'use client';

import React from 'react';
import { SunIcon, CloudIcon, DropletIcon, WindIcon } from './common/Icons';
import './WeatherPatternChart.css';

interface MonthlyWeatherPattern {
  month: string;
  avgTemp: number;
  sunnyDays: number;
  rainyDays: number;
  avgWindSpeed: number;
}

interface WeatherPatternChartProps {
  stadiumId: string;
  city: string;
}

// Simplified weather patterns for MLB stadiums
const stadiumWeatherPatterns: Record<string, MonthlyWeatherPattern[]> = {
  'angels': [
    { month: 'Apr', avgTemp: 68, sunnyDays: 23, rainyDays: 3, avgWindSpeed: 7 },
    { month: 'May', avgTemp: 71, sunnyDays: 25, rainyDays: 2, avgWindSpeed: 7 },
    { month: 'Jun', avgTemp: 77, sunnyDays: 27, rainyDays: 1, avgWindSpeed: 7 },
    { month: 'Jul', avgTemp: 83, sunnyDays: 29, rainyDays: 0, avgWindSpeed: 6 },
    { month: 'Aug', avgTemp: 84, sunnyDays: 29, rainyDays: 0, avgWindSpeed: 6 },
    { month: 'Sep', avgTemp: 81, sunnyDays: 26, rainyDays: 1, avgWindSpeed: 6 },
    { month: 'Oct', avgTemp: 74, sunnyDays: 24, rainyDays: 2, avgWindSpeed: 6 },
  ],
  'orioles': [
    { month: 'Apr', avgTemp: 57, sunnyDays: 15, rainyDays: 10, avgWindSpeed: 10 },
    { month: 'May', avgTemp: 67, sunnyDays: 17, rainyDays: 11, avgWindSpeed: 9 },
    { month: 'Jun', avgTemp: 76, sunnyDays: 18, rainyDays: 10, avgWindSpeed: 8 },
    { month: 'Jul', avgTemp: 81, sunnyDays: 19, rainyDays: 10, avgWindSpeed: 8 },
    { month: 'Aug', avgTemp: 79, sunnyDays: 20, rainyDays: 9, avgWindSpeed: 8 },
    { month: 'Sep', avgTemp: 72, sunnyDays: 19, rainyDays: 8, avgWindSpeed: 8 },
    { month: 'Oct', avgTemp: 60, sunnyDays: 18, rainyDays: 8, avgWindSpeed: 9 },
  ],
  'redsox': [
    { month: 'Apr', avgTemp: 48, sunnyDays: 13, rainyDays: 11, avgWindSpeed: 12 },
    { month: 'May', avgTemp: 59, sunnyDays: 15, rainyDays: 11, avgWindSpeed: 11 },
    { month: 'Jun', avgTemp: 68, sunnyDays: 16, rainyDays: 10, avgWindSpeed: 10 },
    { month: 'Jul', avgTemp: 74, sunnyDays: 17, rainyDays: 9, avgWindSpeed: 10 },
    { month: 'Aug', avgTemp: 73, sunnyDays: 18, rainyDays: 9, avgWindSpeed: 9 },
    { month: 'Sep', avgTemp: 65, sunnyDays: 17, rainyDays: 9, avgWindSpeed: 10 },
    { month: 'Oct', avgTemp: 54, sunnyDays: 16, rainyDays: 9, avgWindSpeed: 11 },
  ],
  // Add default pattern for stadiums not listed
  'default': [
    { month: 'Apr', avgTemp: 60, sunnyDays: 16, rainyDays: 9, avgWindSpeed: 10 },
    { month: 'May', avgTemp: 70, sunnyDays: 18, rainyDays: 8, avgWindSpeed: 9 },
    { month: 'Jun', avgTemp: 78, sunnyDays: 20, rainyDays: 7, avgWindSpeed: 8 },
    { month: 'Jul', avgTemp: 83, sunnyDays: 22, rainyDays: 6, avgWindSpeed: 8 },
    { month: 'Aug', avgTemp: 82, sunnyDays: 22, rainyDays: 6, avgWindSpeed: 8 },
    { month: 'Sep', avgTemp: 74, sunnyDays: 20, rainyDays: 7, avgWindSpeed: 9 },
    { month: 'Oct', avgTemp: 63, sunnyDays: 18, rainyDays: 8, avgWindSpeed: 10 },
  ]
};

const WeatherPatternChartComponent: React.FC<WeatherPatternChartProps> = ({ stadiumId, city }) => {
  // Use React.memo to prevent unnecessary re-renders
  const patterns = React.useMemo(() => 
    stadiumWeatherPatterns[stadiumId] || stadiumWeatherPatterns['default'],
    [stadiumId]
  );
  
  // Find max values for scaling
  const maxTemp = React.useMemo(() => 
    Math.max(...patterns.map(p => p.avgTemp)),
    [patterns]
  );
  const maxDays = 31;
  
  return (
    <div className="weather-pattern-chart">
      <h3>Typical Weather Patterns - Baseball Season</h3>
      <p className="chart-subtitle">Average conditions during day games in {city}</p>
      
      <div className="chart-container">
        <div className="temperature-chart">
          <h4><SunIcon size={16} /> Average Temperature</h4>
          <div className="bar-chart">
            {patterns.map((pattern, idx) => (
              <div key={idx} className="bar-group">
                <div className="bar-wrapper">
                  <div 
                    className="temp-bar"
                    style={{ 
                      height: `${(pattern.avgTemp / maxTemp) * 150}px`,
                      background: pattern.avgTemp > 80 ? '#ff6b6b' : pattern.avgTemp > 70 ? '#ffd93d' : '#4ecdc4'
                    }}
                  >
                    <span className="bar-value">{pattern.avgTemp}°</span>
                  </div>
                </div>
                <span className="bar-label">{pattern.month}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="weather-stats">
          <h4>Monthly Breakdown</h4>
          <div className="stats-grid">
            {patterns.map((pattern, idx) => (
              <div key={idx} className="month-stats">
                <h5>{pattern.month}</h5>
                <div className="stat-row">
                  <SunIcon size={14} />
                  <span className="stat-label">Sunny Days:</span>
                  <span className="stat-value">{pattern.sunnyDays}</span>
                </div>
                <div className="stat-row">
                  <DropletIcon size={14} />
                  <span className="stat-label">Rainy Days:</span>
                  <span className="stat-value">{pattern.rainyDays}</span>
                </div>
                <div className="stat-row">
                  <WindIcon size={14} />
                  <span className="stat-label">Wind:</span>
                  <span className="stat-value">{pattern.avgWindSpeed} mph</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="weather-tips">
          <h4>Weather Tips</h4>
          <ul>
            <li>
              <strong>Hottest Months:</strong> {
                patterns
                  .filter(p => p.avgTemp === maxTemp)
                  .map(p => p.month)
                  .join(', ')
              } - Extra sun protection needed
            </li>
            <li>
              <strong>Most Sunny Days:</strong> {
                patterns
                  .reduce((max, p) => p.sunnyDays > max.sunnyDays ? p : max)
                  .month
              } - Highest chance of clear skies
            </li>
            <li>
              <strong>Rain Risk:</strong> {
                patterns
                  .filter(p => p.rainyDays > 8)
                  .map(p => p.month)
                  .join(', ') || 'Minimal'
              } {patterns.some(p => p.rainyDays > 8) && '- Consider covered seating'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Export memoized component
export const WeatherPatternChart = React.memo(WeatherPatternChartComponent);