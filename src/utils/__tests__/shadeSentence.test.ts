import { sampleOffsets, shadeSentence, type ShadeSample } from '../gameShade';
import type { ShadeStatus } from '../shadeEngine';

// Seven half-hour statuses from first pitch (0, 30, … 180 minutes).
const FRACTION: Record<ShadeStatus, number> = { shaded: 1, partial: 0.5, sun: 0 };
const game = (...statuses: ShadeStatus[]): ShadeSample[] =>
  sampleOffsets().map((minutesFromStart, i) => ({ minutesFromStart, shadedFraction: FRACTION[statuses[i]], status: statuses[i] }));
const sentence = (...statuses: ShadeStatus[]) => shadeSentence('Section T', game(...statuses), false);

describe('shadeSentence names what comes after the first change', () => {
  it('shaded, then partial (never sun): says partial shade, not sun', () => {
    expect(sentence('shaded', 'partial', 'partial', 'partial', 'partial', 'partial', 'partial'))
      .toBe('Section T: shaded until about the 2nd inning, then partial shade.');
  });

  it('shaded, then sun: says sun', () => {
    expect(sentence('shaded', 'shaded', 'shaded', 'sun', 'sun', 'sun', 'sun'))
      .toBe('Section T: shaded until about the 6th inning, then sun.');
  });

  it('partial, then sun: names the inning the sun comes', () => {
    expect(sentence('partial', 'partial', 'partial', 'partial', 'sun', 'sun', 'sun'))
      .toBe('Section T: partly shaded until about the 7th inning, then sun.');
  });

  it('partial until after the 9th inning, then sun: late in the game', () => {
    expect(sentence('partial', 'partial', 'partial', 'partial', 'partial', 'partial', 'sun'))
      .toBe('Section T: partly shaded until late in the game.');
  });

  it('partial the whole game: all game', () => {
    expect(sentence('partial', 'partial', 'partial', 'partial', 'partial', 'partial', 'partial'))
      .toBe('Section T: partly shaded, with sun on some rows all game.');
  });
});
