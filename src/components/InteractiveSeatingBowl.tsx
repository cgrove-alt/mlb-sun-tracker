'use client';

import React, { useMemo, useState } from 'react';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { getSunPosition } from '../utils/sunPosition';
import { getSectionSunExposure } from '../utils/sectionSunCalculations';
import { shadeTierOf, reconciledExposure, type ShadeTier } from '../utils/sectionShadeTier';
import { stadiumLocalToUTC } from '../utils/stadiumTime';

// MLB-only, SECTION-LEVEL shade guide. Draws the seating bowl as a ring of
// discrete wedges (one per section, positioned by baseAngle/angleSpan) colored
// by each section's shade at a user-selected game time. It is a GUIDE, not a
// row-by-row shadow simulation — it has no per-row/height/overhang geometry and
// does not pretend to. Two honest guarantees:
//   1. It uses the same verified stadium orientation + real sun position as the
//      rest of the site (getSunPosition + getSectionSunExposure).
//   2. It is reconciled with the section table via shadeTierOf: a section can
//      never be shown sunnier than its structural tier allows (covered→shaded,
//      partial→at most light). Enforced by reconciledExposure() + an invariant
//      test across all 30 MLB venues.
// Rendered only where the data supports it (MLB); MiLB/NFL fall back to the table.

const DEFAULT_DATE = '2026-07-15';
// Evening default: the orientation-driven sun/shade split is clearest at a low
// sun angle. At high noon almost every open seat is in the sun (which the slider
// will honestly show as the user drags earlier).
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

type Tier = 'shaded' | 'light' | 'moderate' | 'full';
function tierOf(exposure: number): Tier {
  if (exposure <= 5) return 'shaded';
  if (exposure <= 35) return 'light';
  if (exposure <= 60) return 'moderate';
  return 'full';
}
const TIER_COLOR: Record<Tier, string> = {
  shaded: '#1e3a5f',
  light: '#93c5fd',
  moderate: '#f6c453',
  full: '#f59e0b',
};
const TIER_LABEL: Record<Tier, string> = {
  shaded: 'Shaded',
  light: 'Light sun',
  moderate: 'Moderate sun',
  full: 'Full sun',
};

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
  orientationNote,
}: {
  sections: StadiumSection[];
  orientation: number;
  latitude: number;
  longitude: number;
  timezone: string;
  roof?: string;
  name: string;
  sport?: 'baseball' | 'football';
  // Optional lower-confidence disclaimer, e.g. for parks whose orientation is
  // only estimated (±15–20°). Computed by the caller from orientation provenance.
  orientationNote?: string | null;
}) {
  const [dateStr, setDateStr] = useState(DEFAULT_DATE);
  const [minutes, setMinutes] = useState(timeToMinutes(DEFAULT_TIME));

  const drawable = useMemo(
    () => sections.filter((s) => typeof s.baseAngle === 'number' && typeof s.angleSpan === 'number' && s.angleSpan > 0),
    [sections],
  );

  const domed = roof === 'fixed';
  const retractable = roof === 'retractable';
  const timeStr = minutesToTime(minutes);

  const { sun, wedges, counts, srList } = useMemo(() => {
    const counts: Record<Tier, number> = { shaded: 0, light: 0, moderate: 0, full: 0 };
    let sun: { altitudeDegrees: number; azimuthDegrees: number } | null = null;
    try {
      const utc = stadiumLocalToUTC(dateStr, timeStr, timezone);
      sun = getSunPosition(utc, latitude, longitude);
    } catch {
      sun = null;
    }
    const belowHorizon = !sun || sun.altitudeDegrees <= 0;
    const srList: string[] = [];

    const wedges = drawable.map((s, i) => {
      const raw = domed || belowHorizon || !sun
        ? 0
        : getSectionSunExposure(s, sun.altitudeDegrees, sun.azimuthDegrees, orientation);
      // Reconcile with the table's structural tier: never show more sun than the
      // tier permits (covered→0, partial→≤35, fixed dome→0).
      const exposure = reconciledExposure(raw, s, domed || belowHorizon);
      const tier = tierOf(exposure);
      counts[tier]++;
      srList.push(`${s.name}: ${TIER_LABEL[tier]}`);
      return (
        <path key={s.id ?? i} d={wedgePath(s.baseAngle, s.baseAngle + s.angleSpan)} fill={TIER_COLOR[tier]} stroke="#ffffff" strokeWidth={0.75}>
          <title>{`${s.name} — ${TIER_LABEL[tier]}`}</title>
        </path>
      );
    });

    return { sun, wedges, counts, srList };
  }, [drawable, dateStr, timeStr, timezone, latitude, longitude, orientation, domed]);

  if (drawable.length < 6) return null;

  const belowHorizon = !sun || sun.altitudeDegrees <= 0;
  const sunReadout = domed
    ? 'Fixed roof — every seat is shaded regardless of sun position.'
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

  const tiers: Tier[] = ['shaded', 'light', 'moderate', 'full'];

  return (
    <section
      aria-label={`Section-level shade guide for ${name}`}
      style={{ margin: '1.5rem auto', maxWidth: 760, padding: '1rem 1.25rem' }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.15rem' }}>
        Section-level shade guide
      </h2>
      <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 0.6rem' }}>
        Pick a game time to see which <strong>sections</strong> face the sun. Based on the
        sun&apos;s position and {name}&apos;s orientation — actual shade also varies by row,
        deck overhang, and weather. Covered sections are always shown shaded.
      </p>

      {retractable && (
        <p role="note" style={{ fontSize: '0.78rem', color: '#7c5e10', background: '#fef9ec', border: '1px solid #f5e6b8', borderRadius: 6, padding: '6px 10px', margin: '0 0 0.6rem' }}>
          Retractable roof: shade shown assumes the roof is <strong>open</strong>. With the roof closed, every seat is shaded.
        </p>
      )}
      {orientationNote && (
        <p role="note" style={{ fontSize: '0.78rem', color: '#475569', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '6px 10px', margin: '0 0 0.6rem' }}>
          {orientationNote}
        </p>
      )}

      <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 0.75rem' }} aria-live="polite">
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
        <svg
          viewBox="0 0 340 340"
          role="img"
          aria-label={`${name} seating bowl, sections colored by shade at ${fmt12(timeStr)}. A full text breakdown follows.`}
          style={{ width: '100%', maxWidth: 340, height: 'auto' }}
        >
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
          {tiers.map((t) => (
            <li key={t} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <span aria-hidden="true" style={{ display: 'inline-block', width: 16, height: 16, borderRadius: 3, background: TIER_COLOR[t], border: '1px solid #cbd5e1', marginRight: 8 }} />
              {TIER_LABEL[t]} <span style={{ color: '#9ca3af', marginLeft: 6 }}>({counts[t]})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Non-visual text alternative: the diagram is never the only way to get
          the information (color is not the sole signal). The full section table
          on this page is the primary accessible source; this list mirrors the
          diagram's current-time result for screen-reader users. */}
      <ul className="sr-only">
        {srList.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
    </section>
  );
}
