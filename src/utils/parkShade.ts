/**
 * Game shade for any MLB park: its own structure profile when it has one
 * (stadiumStructures.ts), a generic stand shape per seating level otherwise.
 */
import type { DetailedSection } from '../types/stadium-complete';
import type { Stadium } from '../data/stadiums';
import { genericStructure, getStadiumStructure } from '../data/stadiumStructures';
import { computeGameShade, type GameShadeResult } from './gameShade';

export interface ParkGameShade extends GameShadeResult {
  /** True when the park has its own sourced structure profile. */
  profiled: boolean;
  roof: Stadium['roof'];
}

export function parkGameShade(
  stadium: Pick<Stadium, 'id' | 'latitude' | 'longitude' | 'orientation' | 'roof'>,
  sections: readonly DetailedSection[],
  firstPitch: Date,
  orientationPrecisionDeg: number,
): ParkGameShade {
  const profile = getStadiumStructure(stadium.id);
  const structure = profile ?? genericStructure(stadium.id, stadium.roof, sections);
  const result = computeGameShade({
    sections,
    structure,
    orientationDeg: stadium.orientation,
    orientationPrecisionDeg,
    latitude: stadium.latitude,
    longitude: stadium.longitude,
    firstPitch,
  });
  return { ...result, profiled: Boolean(profile), roof: stadium.roof };
}
