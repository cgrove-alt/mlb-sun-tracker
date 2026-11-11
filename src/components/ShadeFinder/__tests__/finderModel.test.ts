import { bestSections, buildShareUrl, findSection, formatGameOption, layoutSeatMap, parseShareParams } from '../finderModel';
import type { SectionGameShade } from '../../../utils/gameShade';
import type { MLBGame } from '../../../services/mlbApi';
import { yankeesSections } from '../../../data/sections/mlb/yankees';

const shade = (id: string, fractions: number[], confidence: SectionGameShade['confidence'] = 'high'): SectionGameShade => ({
  sectionId: id,
  sectionName: `Section ${id}`,
  tier: 'main',
  tierLabel: 'Main level',
  samples: fractions.map((f, i) => ({ minutesFromStart: i * 30, shadedFraction: f, status: f >= 0.75 ? 'shaded' : f <= 0.25 ? 'sun' : 'partial' })),
  confidence,
  sentence: `Section ${id}: test.`,
});

describe('share links', () => {
  it('round-trips a game and a section', () => {
    const url = buildShareUrl('https://theshadium.com', 'yankees', 852989, '214A');
    expect(url).toBe('https://theshadium.com/stadium/yankees?game=852989&section=214A');
    expect(parseShareParams(new URL(url).search)).toEqual({ gamePk: 852989, sectionId: '214A' });
  });

  it('ignores junk', () => {
    expect(parseShareParams('?game=abc&section=')).toEqual({ gamePk: undefined, sectionId: undefined });
  });
});

describe('finding a section', () => {
  const list = [shade('214A', [0]), shade('214B', [0]), shade('020', [0])];
  it('matches exactly, then by prefix, ignoring case and "Section"', () => {
    expect(findSection(list, '214b')?.sectionId).toBe('214B');
    expect(findSection(list, 'Section 214')?.sectionId).toBe('214A');
    expect(findSection(list, '999')).toBeUndefined();
  });
});

describe('best sections', () => {
  it('ranks by shade over the game and leaves out low-confidence answers', () => {
    const list = [shade('A', [0.2, 0.2]), shade('B', [1, 1], 'low'), shade('C', [0.9, 0.9]), shade('D', [0.5, 0.5])]
      .map((s, i) => ({ ...s, tier: `tier${i}` }));
    expect(bestSections(list, 2).map((s) => s.sectionId)).toEqual(['C', 'D']);
  });

  it('never recommends a suite', () => {
    const suite = { ...shade('S1', [1, 1]), tier: 'suite' };
    const club = { ...shade('C1', [0.8, 0.8]), tier: 'club' };
    expect(bestSections([suite, club], 2).map((s) => s.sectionId)).toEqual(['C1']);
  });

  it('offers one section per seating area before repeating an area', () => {
    const club = (id: string) => ({ ...shade(id, [1, 1]), tier: 'club' });
    const loge = { ...shade('L1', [0.6, 0.6]), tier: 'loge' };
    expect(bestSections([club('C1'), club('C2'), club('C3'), loge], 3).map((s) => s.sectionId)).toEqual(['C1', 'L1', 'C2']);
  });
});

describe('game labels', () => {
  const game = (gameDate: string, tbd = false): MLBGame => ({
    gamePk: 1,
    gameDate,
    status: { statusCode: 'S', detailedState: 'Scheduled', startTimeTBD: tbd },
    teams: { away: { team: { id: 141, name: 'Toronto Blue Jays' } }, home: { team: { id: 147, name: 'New York Yankees' } } },
    venue: { id: 3313, name: 'Yankee Stadium' },
    gameType: 'R',
    scheduledInnings: 9,
  });

  it('shows the stadium-local day and first pitch', () => {
    expect(formatGameOption(game('2027-03-25T17:35:00Z'), 'America/New_York')).toBe('Thu, Mar 25 · 1:35 PM · vs Toronto Blue Jays');
  });

  it('never shows MLB\'s placeholder time', () => {
    expect(formatGameOption(game('2027-03-31T07:33:00Z', true), 'America/New_York')).toContain('time TBD');
  });
});

describe('seat map layout', () => {
  it('puts first base on the right and center field up, inside the view box', () => {
    const layout = layoutSeatMap(yankeesSections, 75);
    const tile = (id: string) => layout.tiles.find((t) => t.id === id)!;
    expect(tile('015A').cx).toBeGreaterThan(0);
    expect(tile('025').cx).toBeLessThan(0);
    expect(tile('203').cy).toBeLessThan(0);
    expect(tile('020').cy).toBeGreaterThan(0);
    const [x, y, w, h] = layout.viewBox.split(' ').map(Number);
    for (const t of layout.tiles) {
      expect(t.cx).toBeGreaterThanOrEqual(x);
      expect(t.cx).toBeLessThanOrEqual(x + w);
      expect(t.cy).toBeGreaterThanOrEqual(y);
      expect(t.cy).toBeLessThanOrEqual(y + h);
    }
  });
});
