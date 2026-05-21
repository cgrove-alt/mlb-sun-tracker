// Yankee Stadium section list — projected from the canonical real seating
// data in `src/data/sections/mlb/yankees.ts` so the stadium page UI and
// /api/stadium/yankees/rows/shade endpoint share one source of truth.
// Authored 2026-05-21.
//
// Previously this file contained a stylized template (Legends 011-013,
// generic Box 100s, Bleachers, etc.) that did not match Yankee Stadium's
// actual section IDs. Replaced with a projection of the real 184-section
// dataset (Field Box / Legends Suite with letter sub-sections, Lower Box
// 103-136, Field MVP, RF Bleachers 201-204, Main Level 205-234 including
// Champions Suite 215-216 and Audi Club 230-233, LF Bleachers 235-239,
// Terrace 305-334 including Jim Beam Suites 317-321, Grandstand 405-434B,
// plus Mohegan Sun Sports Bar, Bleacher Café, Audi Yankees Club, Pepsi Lounge).

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
    price: priceFor(s.level),
  })),
};
