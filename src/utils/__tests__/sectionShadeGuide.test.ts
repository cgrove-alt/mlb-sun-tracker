import type { StadiumSection } from '../../data/stadiumSectionTypes';
import {
  bowlSideOfLocalAngle,
  buildSectionShadeGuide,
  formatGuideHeadline,
} from '../sectionShadeGuide';

const open = (id: string, name: string, baseAngle: number): StadiumSection => ({
  id,
  name,
  level: 'lower',
  baseAngle,
  angleSpan: 10,
  covered: false,
});

describe('bowlSideOfLocalAngle', () => {
  it('maps baseball-local angles onto the four fan-facing sides', () => {
    expect(bowlSideOfLocalAngle(0)).toBe('first');
    expect(bowlSideOfLocalAngle(90)).toBe('outfield');
    expect(bowlSideOfLocalAngle(180)).toBe('third');
    expect(bowlSideOfLocalAngle(270)).toBe('home');
    expect(bowlSideOfLocalAngle(350)).toBe('first');
  });
});

describe('buildSectionShadeGuide', () => {
  it('groups sections and prefers the self-shaded side of the bowl', () => {
    const sections = [
      open('1b-a', 'Section 110', 0),
      open('1b-b', 'Section 111', 10),
      open('3b-a', 'Section 130', 180),
      open('3b-b', 'Section 131', 190),
      open('cf', 'Section 150', 90),
      open('hp', 'Section 120', 270),
    ];
    // Western sun: first-base grandstand (compass ~ east for a north-facing park)
    // Orientation 0 (HP→CF north). 1B compass is 90°, 3B is 270°.
    // Sun at 270° sits behind 3B → 3B shaded, 1B sunny.
    const guide = buildSectionShadeGuide(
      sections,
      { altitudeDegrees: 20, azimuthDegrees: 270 },
      0,
      false,
    );
    const third = guide.sides.find((s) => s.id === 'third')!;
    const first = guide.sides.find((s) => s.id === 'first')!;
    expect(third.meanExposure).toBeLessThan(first.meanExposure);
    expect(guide.bestSide?.id).toBe('third');
  });
});

describe('formatGuideHeadline', () => {
  it('tells fans which side to sit on when that side is mostly shade', () => {
    const text = formatGuideHeadline({
      timeLabel: '4:00 PM',
      domed: false,
      belowHorizon: false,
      bestSide: {
        id: 'first',
        label: 'First base',
        hint: '',
        total: 10,
        shadeCount: 9,
        sunCount: 1,
        meanExposure: 8,
        verdict: 'mostly-shade',
        examples: ['110'],
      },
    });
    expect(text).toMatch(/first-base/i);
    expect(text).toMatch(/4:00 PM/);
    expect(text.toLowerCase()).not.toContain('azimuth');
  });

  it('does not recommend a side when the uncovered bowl is all sun', () => {
    const text = formatGuideHeadline({
      timeLabel: '1:00 PM',
      domed: false,
      belowHorizon: false,
      bestSide: {
        id: 'first',
        label: 'First base',
        hint: '',
        total: 10,
        shadeCount: 0,
        sunCount: 10,
        meanExposure: 90,
        verdict: 'mostly-sun',
        examples: ['110'],
      },
    });
    expect(text).toMatch(/uncovered sections are in the sun/i);
    expect(text.toLowerCase()).not.toContain('best remaining chance');
  });
});
