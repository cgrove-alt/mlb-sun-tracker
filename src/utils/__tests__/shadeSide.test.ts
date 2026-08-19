/** @jest-environment node */

import {
  bestShadedSideForDayGame,
  baseballShadedBaseline,
  baseballSunnyBaseline,
} from '../shadeSide';

describe('bestShadedSideForDayGame — baseball', () => {
  it('picks first base when HP→CF faces east-northeast (Yankee Stadium class)', () => {
    expect(bestShadedSideForDayGame(55)).toBe('first base side');
  });

  it('picks seating behind home when HP→CF faces north (Rogers Centre / Petco / Coors)', () => {
    // 1 PM sun is ~south. A north-facing diamond puts the sun behind home;
    // third base becomes the shade side later as the sun moves west.
    expect(bestShadedSideForDayGame(0)).toBe('seating behind home plate');
  });

  it('does not invent baseball sides for football', () => {
    const side = bestShadedSideForDayGame(0, 'football');
    expect(side).not.toMatch(/base|home plate|center field/i);
    expect(side).toMatch(/end zone|sideline/);
  });
});

describe('bestShadedSideForDayGame — football', () => {
  it('names the south end zone on a north-south field', () => {
    expect(bestShadedSideForDayGame(0, 'football')).toBe('south end zone');
  });

  it('names the south sideline on an east-west field', () => {
    expect(bestShadedSideForDayGame(90, 'football')).toBe('south sideline');
  });

  it('names the south end zone for SoFi\'s NNW-SSE axis, not a leftover E-W sideline', () => {
    // SoFi is 338°, not the leftover 90° east-west placeholder that used to
    // produce "south sideline".
    expect(bestShadedSideForDayGame(338, 'football')).toBe('south end zone');
  });
});

describe('baseballShadedBaseline follows grandstand self-shade, not a 3B default', () => {
  it('puts Yankee Stadium (orientation 55°) midday shade on the first-base side', () => {
    expect(baseballShadedBaseline(55, 180)).toBe('first base side');
    expect(baseballSunnyBaseline(55, 180)).toBe('third base side');
  });

  it('puts Yankee Stadium afternoon shade on the third-base side as the sun moves west', () => {
    expect(baseballShadedBaseline(55, 250)).toBe('third base side');
  });

  it('puts Comerica (orientation 145°) afternoon shade on the first-base side, not a 3B default', () => {
    expect(baseballShadedBaseline(145, 250)).toBe('first base side');
    expect(baseballSunnyBaseline(145, 250)).toBe('third base side');
  });

  it('puts Wrigley-class north parks (orientation 13°) afternoon shade on the third-base side', () => {
    expect(baseballShadedBaseline(13, 250)).toBe('third base side');
    expect(baseballSunnyBaseline(13, 250)).toBe('first base side');
  });
});
