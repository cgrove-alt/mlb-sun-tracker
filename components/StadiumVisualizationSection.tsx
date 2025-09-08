/**
 * Stadium Visualization Section Component
 * Integrates the 3D viewer into stadium pages with dynamic loading
 */

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Stadium } from '../src/data/stadiums';
import { getSunPosition } from '../src/utils/sunCalculations';
import { getStadiumCompleteData } from '../src/data/stadium-data-aggregator';

// Dynamic import for 3D viewer to reduce initial bundle size
const StadiumSunPathViewer = dynamic(
  () => import('../src/components/StadiumSunPathViewer'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading 3D visualization...</p>
        </div>
      </div>
    )
  }
);

interface StadiumVisualizationSectionProps {
  stadium: Stadium;
  defaultDate?: Date;
  defaultTime?: string;
}

export const StadiumVisualizationSection: React.FC<StadiumVisualizationSectionProps> = ({
  stadium,
  defaultDate = new Date(),
  defaultTime = '13:00'
}) => {
  const [show3D, setShow3D] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get stadium data with sections and obstructions
  const stadiumData = useMemo(() => {
    return getStadiumCompleteData(stadium.id, 'MLB');
  }, [stadium.id]);

  // Calculate current sun position for preview
  const sunPosition = useMemo(() => {
    const [hours, minutes] = defaultTime.split(':').map(Number);
    const dateTime = new Date(defaultDate);
    dateTime.setHours(hours, minutes, 0, 0);
    
    return getSunPosition(
      dateTime,
      stadium.latitude,
      stadium.longitude,
      stadium.timezone
    );
  }, [defaultDate, defaultTime, stadium]);

  const handleShow3D = () => {
    setLoading(true);
    setShow3D(true);
    // Loading state will be handled by the dynamic import
  };

  if (show3D) {
    return (
      <div className="stadium-visualization-section">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Interactive 3D Stadium View
          </h2>
          <button
            onClick={() => setShow3D(false)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hide 3D View
          </button>
        </div>
        <StadiumSunPathViewer
          stadium={stadium}
          sections={stadiumData.sections}
          obstructions={stadiumData.obstructions}
          initialDate={defaultDate}
          initialTime={defaultTime}
        />
      </div>
    );
  }

  return (
    <div className="stadium-visualization-section bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Explore {stadium.name} in 3D
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            Visualize sun paths and shadows throughout the day
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Current Sun Position</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Azimuth:</span>
                <span className="font-medium">{sunPosition.azimuthDegrees.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Elevation:</span>
                <span className="font-medium">{sunPosition.altitudeDegrees.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">
                  {sunPosition.altitudeDegrees > 0 ? '☀️ Daytime' : '🌙 Nighttime'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Interactive 3D stadium model
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Real-time shadow calculations
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Time controls and animation
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Section-by-section analysis
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleShow3D}
            disabled={loading}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Launch 3D Viewer
              </>
            )}
          </button>
          <p className="mt-3 text-sm text-gray-500">
            Requires WebGL support • Works best on desktop
          </p>
        </div>
      </div>
    </div>
  );
};

export default StadiumVisualizationSection;