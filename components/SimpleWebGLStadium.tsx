'use client';

import React from 'react';
import { Stadium } from '../src/data/stadiums';

interface SimpleWebGLStadiumProps {
  stadium: Stadium;
  sunPosition: { azimuthDegrees: number; altitudeDegrees: number };
  gameDateTime: Date;
  selectedSections?: string[];
  onSectionClick?: (sectionId: string) => void;
}

/**
 * Legacy placeholder component - NOT IN USE
 * The actual 3D visualization is handled by StadiumSunPathViewer
 * This can be safely removed in a future cleanup
 */
export default function SimpleWebGLStadium({
  stadium,
  sunPosition,
}: SimpleWebGLStadiumProps) {
  return (
    <div style={{ padding: '20px', background: '#f0f0f0', color: '#333', margin: '20px 0', borderRadius: '8px' }}>
      <p><strong>3D Visualization Placeholder</strong></p>
      <p>Stadium: {stadium?.name}</p>
      <p>Sun Position: {sunPosition?.azimuthDegrees}°/{sunPosition?.altitudeDegrees}°</p>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
        Note: Full 3D visualization is loaded via StadiumVisualizationSection
      </p>
    </div>
  );
}