/** @jest-environment node */

import { MLB_STADIUMS } from '../../data/stadiums';
import type { StadiumSection } from '../../data/stadiumSectionTypes';
import {
  clearUnifiedCaches,
  getUnifiedCalculator,
  getUnifiedShadedSections,
  type UnifiedStadium,
} from '../unifiedStadiumShade';

const stadium: UnifiedStadium = {
  ...MLB_STADIUMS.find((candidate) => candidate.id === 'yankees')!,
  type: 'MLB',
};

const section = (id: string, baseAngle: number): StadiumSection => ({
  id,
  name: id,
  baseAngle,
  angleSpan: 10,
  level: 'lower',
  covered: false,
  price: 'moderate',
});

describe('unified stadium shade guardrails', () => {
  beforeEach(() => clearUnifiedCaches());

  it('does not silently return an empty MLB result when geometry is missing', () => {
    expect(() => getUnifiedShadedSections(
      stadium,
      new Date('2025-07-15T17:00:00Z'),
    )).toThrow(/No section geometry supplied/);
  });

  it('keeps calculator geometry isolated for distinct supplied section sets', () => {
    const first = getUnifiedCalculator(stadium, [section('first', 0)]);
    const second = getUnifiedCalculator(stadium, [section('second', 180)]);
    expect(second).not.toBe(first);
  });

  it('does not convert cloudy weather into structural shade', () => {
    const at = new Date('2025-07-15T17:00:00Z');
    const sections = [section('section', 0)];
    const clear = getUnifiedShadedSections(stadium, at, undefined, sections)[0];
    const cloudy = getUnifiedShadedSections(stadium, at, {
      temperature: 75,
      feelsLike: 75,
      humidity: 60,
      pressure: 1013,
      windSpeed: 2,
      windDirection: 0,
      cloudCover: 90,
      visibility: 10000,
      uvIndex: 1,
      conditions: [],
    }, sections)[0];

    expect(cloudy.shadePercentage).toBe(clear.shadePercentage);
    expect(cloudy.effectiveSunPercent).toBeLessThanOrEqual(clear.effectiveSunPercent);
  });
});
