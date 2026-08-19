'use client';

import React, { useMemo, useState } from 'react';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { getSunPosition } from '../utils/sunPosition';
import { stadiumLocalToUTC } from '../utils/stadiumTime';
import { sectionAngleConventionFor } from '../utils/bowlGeometry';
import {
  BOWL_SIDE_LABEL,
  EXPOSURE_TIER_LABEL,
  SIDE_VERDICT_LABEL,
  buildSectionShadeGuide,
  formatGuideHeadline,
  type BowlSideId,
} from '../utils/sectionShadeGuide';
import styles from './InteractiveSeatingBowl.module.css';

// MLB-only, SECTION-LEVEL shade guide. Fans choose a typical game time and
// see which SIDE of the bowl to sit on, then look up a section by name.
// This is a GUIDE, not a row-by-row shadow simulation.
// Physics: getSectionSunExposure + reconciledExposure (same as the table).

const DEFAULT_DATE = '2026-07-15';
const DEFAULT_MINUTES = 16 * 60; // 4:00 PM — shade split is visible, still a day game

const TIME_PRESETS: Array<{ label: string; minutes: number }> = [
  { label: '1:00 PM', minutes: 13 * 60 },
  { label: '4:00 PM', minutes: 16 * 60 },
  { label: '7:00 PM', minutes: 19 * 60 },
];

const pad = (n: number) => n.toString().padStart(2, '0');
const minutesToTime = (m: number) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const fmt12 = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${((h + 11) % 12) + 1}:${pad(m)} ${period}`;
};

const SIDE_CLASS: Record<BowlSideId, string> = {
  first: styles.sideFirst,
  third: styles.sideThird,
  home: styles.sideHome,
  outfield: styles.sideOutfield,
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
  orientationNote?: string | null;
}) {
  const [dateStr, setDateStr] = useState(DEFAULT_DATE);
  const [minutes, setMinutes] = useState(DEFAULT_MINUTES);
  const [query, setQuery] = useState('');
  const [selectedSide, setSelectedSide] = useState<BowlSideId | null>(null);

  const drawable = useMemo(
    () => sections.filter((s) => typeof s.baseAngle === 'number' && typeof s.angleSpan === 'number' && s.angleSpan > 0),
    [sections],
  );

  const domed = roof === 'fixed';
  const retractable = roof === 'retractable';
  const timeStr = minutesToTime(minutes);
  const timeLabel = fmt12(timeStr);

  const { sun, guide, belowHorizon } = useMemo(() => {
    let sun: { altitudeDegrees: number; azimuthDegrees: number } | null = null;
    try {
      const utc = stadiumLocalToUTC(dateStr, timeStr, timezone);
      sun = getSunPosition(utc, latitude, longitude);
    } catch {
      sun = null;
    }
    const belowHorizon = !sun || sun.altitudeDegrees <= 0;
    const convention = sectionAngleConventionFor({ sport });
    const guide = buildSectionShadeGuide(
      drawable,
      sun ?? { altitudeDegrees: 0, azimuthDegrees: 180 },
      orientation,
      domed || belowHorizon,
      convention,
    );
    return { sun, guide, belowHorizon };
  }, [drawable, dateStr, timeStr, timezone, latitude, longitude, orientation, domed, sport]);

  if (drawable.length < 6) return null;

  const headline = formatGuideHeadline({
    timeLabel,
    domed,
    belowHorizon,
    bestSide: guide.bestSide,
  });

  const q = query.trim().toLowerCase();
  const matches = (q
    ? guide.rows.filter((r) =>
        r.section.name.toLowerCase().includes(q) || r.section.id.toLowerCase().includes(q))
    : selectedSide
      ? guide.rows.filter((r) => r.side === selectedSide)
      : []
  ).slice(0, 12);

  const lookingUp = q.length > 0 || selectedSide !== null;

  return (
    <section className={styles.guide} aria-label={`Where to sit in the shade at ${name}`}>
      <h2 className={styles.title}>Where to Sit</h2>
      <p className={styles.lede}>
        Choose a typical first-pitch time. Results are for <strong>sections</strong> at {name},
        not individual rows. Covered sections stay shaded.
      </p>

      {retractable && (
        <p role="note" className={styles.note}>
          Retractable roof: this guide assumes the roof is <strong>open</strong>. Closed, every seat is shaded.
        </p>
      )}
      {orientationNote && (
        <p role="note" className={styles.orientNote}>
          {orientationNote}
        </p>
      )}

      <div className={styles.controls}>
        <div className={styles.field}>
          Game time
          <div className={styles.presets} role="group" aria-label="Typical first-pitch times">
            {TIME_PRESETS.map((preset) => {
              const active = minutes === preset.minutes;
              return (
                <button
                  key={preset.minutes}
                  type="button"
                  className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                  aria-pressed={active}
                  onClick={() => setMinutes(preset.minutes)}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>
        <label className={styles.field} htmlFor="shade-guide-date">
          Date
          <input
            id="shade-guide-date"
            className={styles.dateInput}
            type="date"
            name="shade-guide-date"
            autoComplete="off"
            value={dateStr}
            onChange={(e) => setDateStr(e.target.value || DEFAULT_DATE)}
          />
        </label>
      </div>

      <p className={styles.headline} aria-live="polite">
        {headline}
      </p>

      <div className={styles.diamond} aria-label="Shade by side of the ballpark">
        <div className={styles.fieldMark} aria-hidden="true">Field</div>
        {guide.sides.map((side) => {
          const tone = side.verdict === 'mostly-shade'
            ? styles.sideShade
            : side.verdict === 'mostly-sun'
              ? styles.sideSun
              : styles.sideMixed;
          const selected = selectedSide === side.id;
          return (
            <button
              key={side.id}
              type="button"
              className={`${styles.sideCard} ${SIDE_CLASS[side.id]} ${tone}`}
              aria-pressed={selected}
              aria-label={`${side.label}: ${SIDE_VERDICT_LABEL[side.verdict]}. ${side.shadeCount} of ${side.total} sections in shade.`}
              onClick={() => setSelectedSide((cur) => (cur === side.id ? null : side.id))}
            >
              <span className={styles.sideName}>{side.label}</span>
              <span className={styles.sideHint}>{side.hint}</span>
              <span className={styles.sideVerdict}>{SIDE_VERDICT_LABEL[side.verdict]}</span>
              <span className={styles.sideCount}>
                {side.shadeCount} of {side.total} sections in shade
              </span>
              {side.examples.length > 0 && (
                <span className={styles.sideExamples}>{side.examples.join(', ')}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className={styles.lookup}>
        <label className={styles.lookupLabel} htmlFor="shade-guide-section">
          Find your section
          <input
            id="shade-guide-section"
            className={styles.searchInput}
            type="search"
            name="section"
            autoComplete="off"
            spellCheck={false}
            placeholder="e.g. 114 or Grandstand…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value) setSelectedSide(null);
            }}
          />
        </label>
        {lookingUp && matches.length === 0 && (
          <p className={styles.empty} role="status">
            No matching section. Try a number from your ticket, like 110.
          </p>
        )}
        {matches.length > 0 && (
          <ul className={styles.matches}>
            {matches.map((row) => (
              <li key={row.section.id} className={styles.match}>
                <span className={styles.matchName}>{row.section.name}</span>
                <span className={styles.matchMeta}>
                  {BOWL_SIDE_LABEL[row.side]} · {EXPOSURE_TIER_LABEL[row.tier]}
                </span>
              </li>
            ))}
          </ul>
        )}
        {selectedSide && !q && matches.length === 12 && (
          <p className={styles.empty}>Showing the first 12 sections on this side. Search to jump to yours.</p>
        )}
      </div>

      <p className={styles.fineprint}>
        Based on {name}&apos;s orientation and the sun&apos;s position at {timeLabel}.
        Shade also changes by row, deck overhang, and weather.
      </p>
    </section>
  );
}
