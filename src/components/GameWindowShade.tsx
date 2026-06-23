'use client';

import React, { useMemo } from 'react';
import { MLB_STADIUMS } from '../data/stadiums';
import { getStadiumSections } from '../data/stadium-data-aggregator';
import {
  calculateGameWindowShade,
  gameWindowOffsets,
  type SunSample,
  type SectionWindowShade,
} from '../utils/sunCalculator';
import { getSunPosition } from '../utils/sunCalculations';
import { stadiumLocalDateAndTimeToUTC } from '../utils/stadiumTime';

interface GameWindowShadeProps {
  stadiumId: string;
  /** Stadium-local first-pitch time, "HH:MM". */
  gameTime: string;
  /** Game date (the weather code derives the same first-pitch instant from this). */
  gameDate: Date;
  /** Length of the game window in minutes (default 180 ≈ a pitch-clock game + margin). */
  windowMinutes?: number;
}

// Compose a short, fan-readable summary of how shade migrates across the game.
function describeStart(end: number): string {
  return end >= 50 ? 'ends shaded' : 'ends sunny';
}

/**
 * Surfaces the whole-game-window shade (Phase 9 A5): instead of a single
 * instant, it samples the sun across the game and shows how each section moves
 * between sun and shade — e.g. "shaded at first pitch → sunny by the 7th".
 *
 * Computed client-side with the SAME pure functions the API uses and the SAME
 * first-pitch instant the weather panel derives (via stadiumLocalDateAndTimeToUTC),
 * so there's no network round-trip and no timezone/date drift.
 *
 * Renders nothing for night games (sun already down across the window) or when
 * the stadium isn't found.
 */
export const GameWindowShade: React.FC<GameWindowShadeProps> = ({
  stadiumId,
  gameTime,
  gameDate,
  windowMinutes = 180,
}) => {
  const model = useMemo(() => {
    const stadium = MLB_STADIUMS.find((s) => s.id === stadiumId);
    if (!stadium) return null;

    const [h, m] = gameTime.split(':').map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    const firstPitchUTC = stadiumLocalDateAndTimeToUTC(gameDate, h, m, stadium.timezone || 'UTC');

    const offsets = gameWindowOffsets(windowMinutes, 30);
    const samples: SunSample[] = offsets.map((min) => {
      const t = new Date(firstPitchUTC.getTime() + min * 60_000);
      const sp = getSunPosition(t, stadium.latitude, stadium.longitude);
      return { minutesFromStart: min, altitudeDegrees: sp.altitudeDegrees, azimuthDegrees: sp.azimuthDegrees };
    });

    // Skip night games — "shaded" then just means the sun is down, which the
    // single-instant view already conveys.
    const sunUp = samples.some((s) => s.altitudeDegrees > 3);
    if (!sunUp) return { night: true } as const;

    const sections = getStadiumSections(stadiumId, 'MLB');
    const windows = sections.map((s) => calculateGameWindowShade(s, samples, stadium.orientation || 0));

    const count = (p: SectionWindowShade['progression']) =>
      windows.filter((w) => w.progression === p).length;

    // Sections that flip sun→shade are the actionable ones for fans who stay
    // late; show a few, sorted by how dramatic the swing is.
    const becomesShaded = windows
      .filter((w) => w.progression === 'sun-to-shade')
      .sort((a, b) => (b.endCoverage - b.startCoverage) - (a.endCoverage - a.startCoverage))
      .slice(0, 4);
    const becomesSunny = windows
      .filter((w) => w.progression === 'shade-to-sun')
      .sort((a, b) => (b.startCoverage - b.endCoverage) - (a.startCoverage - a.endCoverage))
      .slice(0, 4);

    return {
      night: false as const,
      windowMinutes,
      shadedAll: count('shaded-all'),
      sunnyAll: count('sunny-all'),
      sunToShade: count('sun-to-shade'),
      shadeToSun: count('shade-to-sun'),
      becomesShaded,
      becomesSunny,
    };
  }, [stadiumId, gameTime, gameDate, windowMinutes]);

  if (!model || model.night) return null;

  const hours = Math.round(model.windowMinutes / 60);

  return (
    <section className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4" aria-labelledby="window-shade-title">
      <h3 id="window-shade-title" className="text-lg font-semibold text-gray-900 mb-1">
        ☀️ How shade moves during the game
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        The sun shifts ~15°/hour, so shade migrates over the ~{hours}-hour game. Based on first pitch through the final out.
      </p>

      <div className="flex flex-wrap gap-2 mb-3 text-sm">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-100 text-teal-800">
          {model.shadedAll} shaded all game
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800">
          {model.sunToShade} sun → shade
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-800">
          {model.shadeToSun} shade → sun
        </span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800">
          {model.sunnyAll} sunny all game
        </span>
      </div>

      {model.becomesShaded.length > 0 && (
        <div className="mb-2">
          <p className="text-sm font-medium text-gray-700">Good if you stay late (starts sunny → ends shaded):</p>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            {model.becomesShaded.map((w) => (
              <li key={w.sectionId}>
                <span className="font-medium">{w.sectionName}</span>{' '}
                — {Math.round(100 - w.startCoverage)}% sun at first pitch, {describeStart(w.endCoverage)} ({Math.round(w.endCoverage)}% covered) by the end
              </li>
            ))}
          </ul>
        </div>
      )}

      {model.becomesSunny.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700">Best early, sunnier later (shade fades as the game goes):</p>
          <ul className="text-sm text-gray-700 list-disc list-inside">
            {model.becomesSunny.map((w) => (
              <li key={w.sectionId}>
                <span className="font-medium">{w.sectionName}</span>{' '}
                — {Math.round(w.startCoverage)}% covered at first pitch, {Math.round(100 - w.endCoverage)}% sun by the end
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default GameWindowShade;
