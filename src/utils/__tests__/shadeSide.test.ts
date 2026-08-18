/** @jest-environment node */

import { bestShadedSideForDayGame } from '../shadeSide';

describe('bestShadedSideForDayGame — baseball', () => {
  it('picks first base when HP→CF faces east-northeast (Yankee Stadium class)', () => {
    expect(bestShadedSideForDayGame(55)).toBe('first base side');
  });

  it('picks third base when HP→CF faces north (Rogers Centre / Petco / Coors)', () => {
    expect(bestShadedSideForDayGame(0)).toBe('third base side');
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

  it('names the south sideline on an east-west field (SoFi)', () => {
    expect(bestShadedSideForDayGame(90, 'football')).toBe('south sideline');
  });
});
