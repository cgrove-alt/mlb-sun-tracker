'use client';

console.log('SIMPLE: SimpleWebGLStadium module loading...');

import React, { useRef, useEffect, useState } from 'react';
import { Stadium } from '../src/data/stadiums';

interface SimpleWebGLStadiumProps {
  stadium: Stadium;
  sunPosition: { azimuthDegrees: number; altitudeDegrees: number };
  gameDateTime: Date;
  selectedSections?: string[];
  onSectionClick?: (sectionId: string) => void;
}

export default function SimpleWebGLStadium({
  stadium,
  sunPosition,
  gameDateTime,
  selectedSections = [],
  onSectionClick,
}: SimpleWebGLStadiumProps) {
  console.log('SIMPLE: SimpleWebGLStadium function called');
  console.log('SIMPLE: SimpleWebGLStadium rendering');
  
  const [debugInfo, setDebugInfo] = useState('');
  
  useEffect(() => {
    console.log('SIMPLE: SimpleWebGLStadium useEffect executed');
    setDebugInfo('SimpleWebGLStadium useEffect executed at ' + new Date().toLocaleTimeString());
  }, []);
  
  return (
    <div style={{ padding: '20px', background: '#9c27b0', color: 'white', margin: '20px 0' }}>
      <p>SIMPLE: SimpleWebGLStadium component is working!</p>
      <p>SIMPLE: Stadium: {stadium?.name}</p>
      <p>SIMPLE: Sun Position: {sunPosition?.azimuthDegrees}°/{sunPosition?.altitudeDegrees}°</p>
      <p style={{ color: 'yellow', fontWeight: 'bold' }}>DEBUG: {debugInfo}</p>
      <p>SIMPLE: This version has NO Three.js imports</p>
    </div>
  );
}