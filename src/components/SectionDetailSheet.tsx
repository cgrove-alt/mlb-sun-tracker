'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { calculateShadeScore, getShadeScoreColor, getShadeScoreTextColor } from '../utils/shadeScore';
import { getSunPosition } from '../utils/sunCalculations';
import type { SectionShadowData } from '../utils/sunCalculator';

interface SectionDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  sectionName: string;
  shadePercentage: number;
  rowData?: SectionShadowData | null;
  onSeeDetails?: () => void;
  gameHour?: number;
  stadiumLat?: number;
  stadiumLng?: number;
  stadiumTimezone?: string;
  sectionBaseAngle?: number;
}

/** Estimate shade % for a section at a given hour using sun position + section angle */
function estimateShadeAtHour(
  hour: number,
  lat: number,
  lng: number,
  timezone: string,
  sectionAngle: number
): number {
  const dt = new Date();
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  dt.setHours(h, m, 0, 0);

  const sun = getSunPosition(dt, lat, lng, timezone);
  if (sun.altitudeDegrees <= 0) return 100; // night = full shade

  const angleDiff = Math.abs(((sectionAngle - sun.azimuthDegrees + 180) % 360) - 180);
  let exposure = Math.max(0, 100 - angleDiff);
  if (sun.altitudeDegrees < 30) {
    exposure *= sun.altitudeDegrees / 30;
  }
  return Math.round(100 - exposure);
}

export const SectionDetailSheet: React.FC<SectionDetailSheetProps> = ({
  isOpen, onClose, sectionName, shadePercentage, rowData, onSeeDetails,
  gameHour, stadiumLat, stadiumLng, stadiumTimezone, sectionBaseAngle,
}) => {
  const [touchStart, setTouchStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const sunExposure = 100 - shadePercentage;
  const shade = calculateShadeScore(sunExposure);

  // Shade timeline: game start, +1.5hr, +3hr
  const timeline = useMemo(() => {
    if (
      gameHour === undefined ||
      stadiumLat === undefined ||
      stadiumLng === undefined ||
      sectionBaseAngle === undefined
    ) {
      return null;
    }
    const tz = stadiumTimezone || 'America/New_York';
    const offsets = [0, 1.5, 3];
    return offsets.map(offset => {
      const h = gameHour + offset;
      const shadePct = estimateShadeAtHour(h, stadiumLat, stadiumLng, tz, sectionBaseAngle);
      const score = calculateShadeScore(100 - shadePct);
      const hours = Math.floor(h);
      const mins = Math.round((h - hours) * 60);
      const label = offset === 0
        ? 'Start'
        : `+${offset}hr`;
      const timeStr = `${hours % 12 || 12}:${mins.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
      return { label, timeStr, shadePct, score };
    });
  }, [gameHour, stadiumLat, stadiumLng, stadiumTimezone, sectionBaseAngle]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const diff = e.touches[0].clientY - touchStart;
    if (diff > 0) setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset > 100) onClose();
    setDragOffset(0);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <div
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'white', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem',
          padding: '1.5rem', maxHeight: '60vh', overflowY: 'auto',
          transform: `translateY(${dragOffset}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div style={{
          width: '40px', height: '4px', borderRadius: '2px',
          background: '#d1d5db', margin: '0 auto 1rem',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%',
            background: getShadeScoreColor(shade.score),
            color: getShadeScoreTextColor(shade.score),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1.25rem',
          }}>
            {shade.score}
          </div>
          <div>
            <h3 style={{ fontWeight: 600, fontSize: '1.125rem', color: '#1f2937', margin: 0 }}>
              Section {sectionName}
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0.25rem 0 0' }}>
              {shade.label} &middot; Score: {shade.score}/10 &middot; {Math.round(shadePercentage)}% shade
            </p>
          </div>
        </div>

        {/* Sun exposure bar */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Sun Exposure</div>
          <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${sunExposure}%`,
              background: getShadeScoreColor(shade.score),
              borderRadius: '4px', transition: 'width 0.3s',
            }} />
          </div>
        </div>

        <p style={{ fontSize: '0.8125rem', color: '#374151', marginBottom: '1rem' }}>
          {shade.recommendation}
        </p>

        {/* Shade timeline — 3 blocks for game start, +1.5hr, +3hr */}
        {timeline && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>
              Shade During Game
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {timeline.map((t, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: getShadeScoreColor(t.score.score),
                    color: getShadeScoreTextColor(t.score.score),
                    borderRadius: '0.375rem',
                    padding: '0.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '0.6875rem', fontWeight: 600, opacity: 0.85 }}>{t.label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700 }}>{t.shadePct}%</div>
                  <div style={{ fontSize: '0.625rem', opacity: 0.75 }}>{t.timeStr}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best rows */}
        {rowData && rowData.bestRows.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem' }}>
              Best rows for shade
            </div>
            <div style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
              Rows {rowData.bestRows.join(', ')}
            </div>
          </div>
        )}

        {onSeeDetails && (
          <button
            onClick={onSeeDetails}
            style={{
              width: '100%', padding: '0.75rem', background: '#0f766e', color: 'white',
              border: 'none', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem',
              cursor: 'pointer', minHeight: '48px',
            }}
          >
            See Full Details
          </button>
        )}
      </div>
    </div>
  );
};

export default SectionDetailSheet;
