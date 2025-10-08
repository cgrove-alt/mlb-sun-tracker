'use client';

import React from 'react';
import { SunIcon, CloudIcon, DropletIcon, WindIcon } from './Icons';

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
    <div className="bg-gray-50 rounded-xl p-8 mt-8">
      <h3 className="text-2xl text-primary-900 mb-2">Typical Weather Patterns - Baseball Season</h3>
      <p className="text-gray-600 mb-8">Average conditions during day games in {city}</p>

      <div className="grid gap-8">
        <div>
          <h4 className="text-lg text-gray-700 mb-4 flex items-center gap-2"><SunIcon size={16} /> Average Temperature</h4>
          <div className="flex gap-4 items-end h-[180px] py-4 overflow-x-auto md:justify-start">
            {patterns.map((pattern, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 min-w-[60px]">
                <div className="h-[150px] flex items-end">
                  <div
                    className="w-10 rounded-t relative transition-all duration-300 hover:-translate-y-1"
                    style={{
                      height: `${(pattern.avgTemp / maxTemp) * 150}px`,
                      background: pattern.avgTemp > 80 ? '#ff6b6b' : pattern.avgTemp > 70 ? '#ffd93d' : '#4ecdc4'
                    }}
                  >
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 font-semibold text-sm text-primary-900">{pattern.avgTemp}°</span>
                  </div>
                </div>
                <span className="text-sm text-gray-600 font-medium">{pattern.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg text-gray-700 mb-4">Monthly Breakdown</h4>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 md:grid-cols-2">
            {patterns.map((pattern, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                <h5 className="text-base text-primary-900 mb-3 font-semibold">{pattern.month}</h5>
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <SunIcon size={14} />
                  <span className="text-gray-600 flex-1">Sunny Days:</span>
                  <span className="font-semibold text-gray-700">{pattern.sunnyDays}</span>
                </div>
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <DropletIcon size={14} />
                  <span className="text-gray-600 flex-1">Rainy Days:</span>
                  <span className="font-semibold text-gray-700">{pattern.rainyDays}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <WindIcon size={14} />
                  <span className="text-gray-600 flex-1">Wind:</span>
                  <span className="font-semibold text-gray-700">{pattern.avgWindSpeed} mph</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h4 className="text-lg text-gray-700 mb-4">Weather Tips</h4>
          <ul className="list-none p-0 m-0">
            <li className="py-2 text-gray-700 leading-relaxed">
              <strong className="text-primary-900">Hottest Months:</strong> {
                patterns
                  .filter(p => p.avgTemp === maxTemp)
                  .map(p => p.month)
                  .join(', ')
              } - Extra sun protection needed
            </li>
            <li className="py-2 text-gray-700 leading-relaxed">
              <strong className="text-primary-900">Most Sunny Days:</strong> {
                patterns
                  .reduce((max, p) => p.sunnyDays > max.sunnyDays ? p : max)
                  .month
              } - Highest chance of clear skies
            </li>
            <li className="py-2 text-gray-700 leading-relaxed">
              <strong className="text-primary-900">Rain Risk:</strong> {
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