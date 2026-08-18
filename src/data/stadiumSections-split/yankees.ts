// Yankee Stadium section list — projected from the canonical real seating
// data in `src/data/sections/mlb/yankees.ts` so the stadium page UI and
// /api/stadium/yankees/rows/shade endpoint share one source of truth.
// Authored 2026-05-21.
//
// Previously this file contained a stylized template (Legends 011-013,
// generic Box 100s, Bleachers, etc.) that did not match Yankee Stadium's
// actual live product IDs. It now projects all 222 current IOMEDIA products,
// including zero-padded field IDs and accessibility/standing variants.

import type { StadiumSection } from '../stadiumSectionTypes';
import { yankeesSections } from '../sections/mlb/yankees';

type Level = StadiumSection['level'];

function projectLevel(level: string): Level {
  return (level === 'standing' ? 'field' : level) as Level;
}

function priceFor(level: string): StadiumSection['price'] {
  switch (level) {
    case 'field':    return 'premium';
    case 'lower':    return 'premium';
    case 'club':     return 'luxury';
    case 'suite':    return 'luxury';
    case 'upper':    return 'value';
    case 'standing': return 'value';
    default:         return 'moderate';
  }
}

export const stadiumSections = {
  stadiumId: 'yankees',
  sections: yankeesSections.map<StadiumSection>((s) => ({
    id: s.id,
    name: s.name,
    level: projectLevel(s.level),
    baseAngle: s.baseAngle,
    angleSpan: s.angleSpan,
    rows: s.rows.length,
    covered: s.covered,
    partialCoverage: Boolean(s.partialCoverage),
    coveredRows: s.partialCoverage ? 'back rows only' : undefined,
    price: priceFor(s.level),
  })),
};
