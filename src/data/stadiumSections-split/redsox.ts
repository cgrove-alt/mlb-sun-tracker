// Fenway Park section list — projected from the current club-linked product data
// in `src/data/sections/mlb/redsox.ts` so the stadium page UI and
// /api/stadium/redsox/rows/shade endpoint share one source of truth.
// The active inventory contains all 483 products in the current live viewer.

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
