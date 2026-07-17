'use client';

import React, { useMemo, useState } from 'react';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { getSunPosition } from '../utils/sunCalculations';
import { getSectionSunExposure } from '../utils/sectionSunCalculations';
import { stadiumLocalToUTC } from '../utils/stadiumTime';

// Interactive at-a-glance seating bowl (audit Phase 8 follow-up). Recolors each
// section by its REAL sun exposure for a user-selected date and time, using the
// same shade engine (getSunPosition + getSectionSunExposure) as the rest of the
// site. Renders a deterministic default on the server (so it is SSR-friendly)
// and becomes interactive on hydration.

// Deterministic default so server and first client render match (no hydration
// mismatch). An early-evening summer game (6:30 PM) is chosen because that is
// when the orientation-driven shade split is clearest — at high-noon day games
// the sun is nearly overhead and almost every open seat is in the sun (which
// the slider will honestly show as the user drags earlier).
const DEFAULT_DATE = '2026-07-15';
const DEFAULT_TIME = '18:30';

const cx = 170;
const cy = 170;
const rIn = 80;
const rOut = 150;

function pt(r: number, localDeg: number): [number, number] {
  const a = (localDeg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy - r * Math.sin(a)];
}

function wedgePath(a0: number, a1: number): string {
  const [x0o, y0o] = pt(rOut, a0);
  const [x1o, y1o] = pt(rOut, a1);
  const [x1i, y1i] = pt(rIn, a1);
  const [x0i, y0i] = pt(rIn, a0);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0o} ${y0o} A ${rOut} ${rOut} 0 ${large} 0 ${x1o} ${y1o} L ${x1i} ${y1i} A ${rIn} ${rIn} 0 ${large} 1 ${x0i} ${y0i} Z`;
}

// Exposure (0-100 from getSectionSunExposure) → colour bucket. Thresholds are
// calibrated to the engine's output range (open sections rarely read below the
// mid-range at higher sun angles).
function colorFor(exposure: number, domed: boolean): string {
  if (domed || exposure <= 5) return '#1e3a5f'; // shaded
  if (exposure <= 35) return '#93c5fd'; // light sun
  if (exposure <= 60) return '#f6c453'; // moderate sun
  return '#f59e0b'; // full sun
}

const COMPASS = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
const compassOf = (az: number) => COMPASS[Math.round((((az % 360) + 360) % 360) / 45) % 8];

const pad = (n: number) => n.toString().padStart(2, '0');
const minutesToTime = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const timeToMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};
const fmt12 = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${pad(m)} ${period}`;
};

export function InteractiveSeatingBowl({
  sections,
  orientation,
  latitude,
  longitude,
  timezone,
  roof,
  name,
  sport = 'baseball',
}: {
  sections: StadiumSection[];
  orientation: number;
  latitude: number;
  longitude: number;
  timezone: string;
  roof?: string;
  name: string;
  sport?: 'baseball' | 'football';
}) {
  const [dateStr, setDateStr] = useState(DEFAULT_DATE);
  const [minutes, setMinutes] = useState(timeToMinutes(DEFAULT_TIME));

  const drawable = useMemo(
    () => sections.filter((s) => typeof s.baseAngle === 'number' && typeof s.angleSpan === 'number' && s.angleSpan > 0),
    [sections],
  );

  const domed = roof === 'fixed';
  const timeStr = minutesToTime(minutes);

  const { sun, wedges, counts } = useMemo(() => {
    const counts = { shaded: 0, light: 0, moderate: 0, full: 0 };
    let sun: { altitudeDegrees: number; azimuthDegrees: number } | null = null;
    try {
      const utc = stadiumLocalToUTC(dateStr, timeStr, timezone);
      sun = getSunPosition(utc, latitude, longitude);
    } catch {
      sun = null;
    }
    const belowHorizon = !sun || sun.altitudeDegrees <= 0;

    const wedges = drawable.map((s, i) => {
      const exposure = domed || belowHorizon || !sun
        ? 0
        : getSectionSunExposure(s, sun.altitudeDegrees, sun.azimuthDegrees, orientation);
      const fill = colorFor(exposure, domed || belowHorizon);
      if (fill === '#1e3a5f') counts.shaded++;
      else if (fill === '#93c5fd') counts.light++;
      else if (fill === '#f6c453') counts.moderate++;
      else counts.full++;
      return <path key={s.id ?? i} d={wedgePath(s.baseAngle, s.baseAngle + s.angleSpan)} fill={fill} stroke="#ffffff" strokeWidth={0.75} />;
    });

    return { sun, wedges, counts };
  }, [drawable, dateStr, timeStr, timezone, latitude, longitude, orientation, domed]);

  if (drawable.length < 6) return null;

  const belowHorizon = !sun || sun.altitudeDegrees <= 0;
  const sunReadout = domed
    ? 'Fixed roof — the whole bowl is shaded.'
    : belowHorizon
      ? 'Sun is below the horizon — the whole park is shaded.'
      : `Sun: ${compassOf(sun!.azimuthDegrees)} · ${Math.round(sun!.altitudeDegrees)}° above the horizon`;

  const label = (localDeg: number, text: string) => {
    const [x, y] = pt(rOut + 16, localDeg);
    return (
      <text x={x} y={y} fontSize={12} fill="#475569" textAnchor="middle" dominantBaseline="middle">
        {text}
      </text>
    );
  };

  const legend: Array<[string, string]> = [
    ['#1e3a5f', 'Shaded'],
    ['#93c5fd', 'Light sun'],
    ['#f6c453', 'Moderate sun'],
    ['#f59e0b', 'Full sun'],
  ];
  const legendCount: Record<string, number> = {
    Shaded: counts.shaded,
    'Light sun': counts.light,
    'Moderate sun': counts.moderate,
    'Full sun': counts.full,
  };

  return (
    <section
      aria-label={`Interactive seating-bowl shade diagram for ${name}`}
      style={{ margin: '1.5rem auto', maxWidth: 1200, padding: '1rem 1.25rem' }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.25rem' }}>At a glance: pick a game time</h2>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 0.75rem' }} aria-live="polite">
        {sunReadout}
      </p>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem 1.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', color: '#374151' }}>
          Date
          <input
            type="date"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value || DEFAULT_DATE)}
            style={{ marginTop: 4, padding: '4px 8px', border: '1px solid #cbd5e1', borderRadius: 6 }}
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', fontSize: '0.8rem', color: '#374151', minWidth: 240 }}>
          Time: <strong>{fmt12(timeStr)}</strong>
          <input
            type="range"
            min={480}
            max={1260}
            step={15}
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
            aria-label="Game time"
            style={{ marginTop: 8 }}
          />
        </label>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
        <svg width={340} height={340} viewBox="0 0 340 340" role="img" aria-label={`${name} seating bowl colored by shade at ${fmt12(timeStr)}`}>
          <circle cx={cx} cy={cy} r={rIn - 6} fill="#eaf4e6" stroke="#cbd5e1" strokeWidth={1} />
          <text x={cx} y={cy} fontSize={12} fill="#94a3b8" textAnchor="middle" dominantBaseline="middle">
            Field
          </text>
          {wedges}
          {sport === 'baseball' && label(0, '1B')}
          {sport === 'baseball' && label(90, 'CF')}
          {sport === 'baseball' && label(180, '3B')}
          {sport === 'baseball' && label(270, 'Home')}
        </svg>

        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.9rem' }}>
          {legend.map(([color, text]) => (
            <li key={text} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span aria-hidden="true" style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: color, border: '1px solid #cbd5e1', marginRight: 8 }} />
              {text} <span style={{ color: '#9ca3af', marginLeft: 6 }}>({legendCount[text]})</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
