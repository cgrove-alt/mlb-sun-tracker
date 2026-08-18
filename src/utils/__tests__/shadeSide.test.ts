/** @jest-environment node */

import { bestShadedSideForDayGame } from '../shadeSide';

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
