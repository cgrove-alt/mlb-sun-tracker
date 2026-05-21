// Fenway Park section list — projected from the canonical real seating data
// in `src/data/sections/mlb/redsox.ts` so the stadium page UI and
// /api/stadium/redsox/rows/shade endpoint share one source of truth.
// Authored 2026-05-21.
//
// Previously this file contained a stylized template that did not match
// Fenway's actual section IDs. Replaced with a projection of the real
// 275-section dataset (Field Box FB-1..82, Loge Box LB-98..165, Grandstand
// GS-1..33, Bleachers BL-34..43, Monster Seats M-1..10, Right Field Box
// RB-87..97, Right Field Roof Box RR-23/25/.../43, EMC Club EMCC-1..6,
// Home Plate Pavilion Club HPPC-1..5, State Street Pavilion Club
// SSPC-1..14, Pavilion Box PB-1..14, Pavilion Reserved PR-15/16/18/20,
// Royal Rooters Club, plus 9 standing/specialty areas).

import type { StadiumSection } from '../stadiumSectionTypes';
import { redsoxSections } from '../sections/mlb/redsox';

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
  stadiumId: 'redsox',
  sections: redsoxSections.map<StadiumSection>((s) => ({
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
