// Rate Field section list — projected from the canonical real seating data in
// `src/data/sections/mlb/whitesox.ts` so the stadium page UI ("Best Shaded
// Seats" panel etc.) and the /api/stadium/whitesox/rows/shade endpoint share
// one source of truth. Authored 2026-05-21.
//
// Previously this file contained a stylized template (Club Box 218-275,
// Upper Deck 318-375, etc.) that did not match Rate Field's actual section
// IDs. Replaced with a projection of the real 132-section dataset.

import type { StadiumSection } from '../stadiumSectionTypes';
import { whitesoxSections } from '../sections/mlb/whitesox';

type Level = StadiumSection['level'];

function projectLevel(level: string): Level {
  // StadiumSection.level doesn't include 'standing'; map it to 'field' for UI
  // purposes (Miller Lite Landing is field-level standing room).
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
  stadiumId: 'whitesox',
  sections: whitesoxSections.map<StadiumSection>((s) => ({
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
