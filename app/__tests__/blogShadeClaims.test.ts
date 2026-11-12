/** @jest-environment node */
/**
 * Every concrete shade claim in a published blog post, checked against the
 * shade engine for the 2025 game the post names. Each claim's sentence must
 * appear in the post word for word, so the text and the engine can't drift
 * apart: change either one and this fails.
 */
import fs from 'node:fs';
import path from 'node:path';
import { MLB_STADIUMS } from '@/src/data/stadiums';
import { yankeesSections } from '@/src/data/sections/mlb/yankees';
import { redsoxSections } from '@/src/data/sections/mlb/redsox';
import { getOrientationPrecision } from '@/src/data/stadiumOrientationProvenance';
import { parkGameShade } from '@/src/utils/parkShade';
import { stadiumLocalToUTC } from '@/src/utils/stadiumTime';
import type { Confidence, GameShadeResult, SectionGameShade } from '@/src/utils/gameShade';

type Status = 'shaded' | 'partial' | 'sun';
type Pick = (s: SectionGameShade) => boolean;
type Expect =
  | { every: Status; from?: number; to?: number; minConfidence: Confidence }
  | { share: Status | 'not-sun'; at: number[]; atLeast?: number; atMost?: number };
interface Claim { quote: string; game: string; sections: Pick; expect: Expect }

const PARKS = {
  yankees: { slug: 'complete-guide-shaded-seats-yankee-stadium', sections: yankeesSections },
  redsox: { slug: 'shaded-seats-fenway-park', sections: redsoxSections },
} as const;
type ParkId = keyof typeof PARKS;

const cache = new Map<string, GameShadeResult>();
function game(park: ParkId, when: string): GameShadeResult {
  const key = `${park} ${when}`;
  if (!cache.has(key)) {
    const [date, time] = when.split(' ');
    const stadium = MLB_STADIUMS.find((s) => s.id === park)!;
    cache.set(key, parkGameShade(stadium, PARKS[park].sections, stadiumLocalToUTC(date, time, 'America/New_York'), getOrientationPrecision(park)));
  }
  return cache.get(key)!;
}

const number = (id: string) => Number(id.replace(/^[A-Z]+/, '').replace(/[A-Z]+$/, ''));
const tier = (label: string): Pick => (s) => s.tierLabel === label;
const ids = (...list: string[]): Pick => (s) => list.includes(s.sectionId);
/** Sections whose number is in one of the ranges, with an optional letter prefix (F9, B132). */
const numbered = (prefix: string, ...ranges: [number, number][]): Pick => (s) =>
  new RegExp(`^${prefix}\\d`).test(s.sectionId) && ranges.some(([a, b]) => number(s.sectionId) >= a && number(s.sectionId) <= b);
const and = (...picks: Pick[]): Pick => (s) => picks.every((p) => p(s));
const or = (...picks: Pick[]): Pick => (s) => picks.some((p) => p(s));

const ALL = [0, 30, 60, 90, 120, 150, 180];
const rank: Record<Confidence, number> = { low: 0, medium: 1, high: 2 };

const CLAIMS: Record<ParkId, Claim[]> = {
  yankees: [
    { quote: 'Bleacher sections 202–204 and 235–238 are in the sun for the whole game.', game: '2025-07-12 13:05', sections: tier('Bleachers'), expect: { every: 'sun', minConfidence: 'high' } },
    { quote: 'The Legends seats (sections 011–029) are in the sun through the 9th inning (Medium confidence for most of them).', game: '2025-07-12 13:05', sections: tier('Legends seats'), expect: { every: 'sun', to: 150, minConfidence: 'medium' } },
    { quote: 'Field level sections 103, 104, 135 and 136 are in the sun for the whole game.', game: '2025-07-12 13:05', sections: ids('103', '104', '135', '136'), expect: { every: 'sun', minConfidence: 'high' } },
    { quote: 'Terrace sections 305–309 and 332–334 are in the sun for the whole game.', game: '2025-07-12 13:05', sections: and(tier('Terrace level (300s)'), numbered('', [305, 309], [332, 334])), expect: { every: 'sun', minConfidence: 'high' } },
    { quote: 'Main level sections 232–234 are partly shaded all game: the back rows sit under the Terrace deck above, the front rows get sun (Low confidence for 234).', game: '2025-07-12 13:05', sections: and(tier('Main level (200s)'), numbered('', [232, 234])), expect: { every: 'partial', minConfidence: 'low' } },
    { quote: 'Main level sections 232–234 are partly shaded all game: the back rows sit under the Terrace deck above, the front rows get sun (Low confidence for 234).', game: '2025-07-12 13:05', sections: and(tier('Main level (200s)'), numbered('', [232, 233])), expect: { every: 'partial', minConfidence: 'high' } },
    { quote: 'The rest of 205–213 and 228–231 are never in full sun', game: '2025-07-12 13:05', sections: and(tier('Main level (200s)'), numbered('', [205, 213], [228, 231])), expect: { share: 'not-sun', at: ALL, atLeast: 1 } },
    { quote: 'and 211–213 are shaded all game (Low confidence for most of these).', game: '2025-07-12 13:05', sections: and(tier('Main level (200s)'), numbered('', [211, 213])), expect: { every: 'shaded', minConfidence: 'low' } },
    { quote: 'Most field level sections between 105 and 129 are partly shaded through the 7th inning, with the front rows in the sun.', game: '2025-07-12 13:05', sections: and(tier('Field level (100s)'), numbered('S?', [105, 129])), expect: { share: 'partial', at: [0, 30, 60, 90, 120], atLeast: 0.9 } },
    { quote: 'By the 9th, about one in four is fully shaded.', game: '2025-07-12 13:05', sections: and(tier('Field level (100s)'), numbered('S?', [105, 129])), expect: { share: 'shaded', at: [150], atLeast: 0.2, atMost: 0.3 } },
    { quote: 'it reaches over all but each section\'s front row. Most 400-level sections (30 of 36) are shaded at first pitch', game: '2025-07-12 13:05', sections: tier('Grandstand (400s)'), expect: { share: 'shaded', at: [0], atLeast: 0.8, atMost: 0.86 } },
    { quote: 'and all of them by the 7th inning.', game: '2025-07-12 13:05', sections: tier('Grandstand (400s)'), expect: { share: 'shaded', at: [120], atLeast: 1 } },
    { quote: 'Sections 405–430 are shaded from first pitch through at least the 7th inning', game: '2025-07-12 13:05', sections: and(tier('Grandstand (400s)'), numbered('', [405, 430])), expect: { every: 'shaded', to: 120, minConfidence: 'medium' } },
    { quote: 'and the third-base end, 432–434, gets its shade between the 2nd and the 7th.', game: '2025-07-12 13:05', sections: and(tier('Grandstand (400s)'), numbered('', [432, 434])), expect: { every: 'shaded', from: 120, minConfidence: 'medium' } },
    { quote: 'and the third-base end, 432–434, gets its shade between the 2nd and the 7th.', game: '2025-07-12 13:05', sections: and(tier('Grandstand (400s)'), numbered('', [432, 434])), expect: { share: 'shaded', at: [0], atMost: 0 } },
    { quote: 'By the 2nd inning, almost every section in the 100s and 200s is in shade', game: '2025-07-10 19:05', sections: or(tier('Field level (100s)'), tier('Main level (200s)')), expect: { share: 'shaded', at: [30], atLeast: 0.95 } },
    { quote: 'and by the 6th inning the whole ballpark is.', game: '2025-07-10 19:05', sections: () => true, expect: { share: 'shaded', at: [90, 120, 150, 180], atLeast: 1 } },
    { quote: 'a third of the terrace sections were shaded at first pitch', game: '2025-04-13 13:35', sections: tier('Terrace level (300s)'), expect: { share: 'shaded', at: [0], atLeast: 0.3, atMost: 0.35 } },
    { quote: 'and three in four by the end of the game;', game: '2025-04-13 13:35', sections: tier('Terrace level (300s)'), expect: { share: 'shaded', at: [180], atLeast: 0.7, atMost: 0.76 } },
    { quote: 'on July 12 none of them were shaded until the 6th inning.', game: '2025-07-12 13:05', sections: tier('Terrace level (300s)'), expect: { share: 'shaded', at: [0, 30, 60], atMost: 0 } },
    { quote: 'on July 12 none of them were shaded until the 6th inning.', game: '2025-07-12 13:05', sections: tier('Terrace level (300s)'), expect: { share: 'shaded', at: [90], atLeast: 0.01 } },
  ],
  redsox: [
    { quote: 'Grandstand sections 1–33 are under the roof and shaded through the 9th inning', game: '2025-07-13 13:35', sections: tier('Grandstand'), expect: { every: 'shaded', to: 150, minConfidence: 'medium' } },
    { quote: 'Grandstand sections 1–33 are under the roof and shaded through the 9th inning', game: '2025-07-13 13:35', sections: and(tier('Grandstand'), numbered('G', [7, 33])), expect: { every: 'shaded', minConfidence: 'high' } },
    { quote: '(Medium confidence for sections 1–6, whose front rows see some sun at the very end of a long game)', game: '2025-07-13 13:35', sections: numbered('G', [1, 6]), expect: { share: 'partial', at: [180], atLeast: 0.5 } },
    { quote: 'The Pavilion clubs (the Dell Technologies Club and the Aura Club) are shaded for the whole game.', game: '2025-07-13 13:35', sections: tier('Pavilion club (Aura Club, Dell Technologies Club)'), expect: { every: 'shaded', minConfidence: 'high' } },
    { quote: 'Bleacher sections 34–43 are in the sun for the whole game.', game: '2025-07-13 13:35', sections: tier('Bleachers'), expect: { every: 'sun', minConfidence: 'high' } },
    { quote: 'The Green Monster seats are in the sun for the whole game.', game: '2025-07-13 13:35', sections: tier('Green Monster seats'), expect: { every: 'sun', minConfidence: 'high' } },
    { quote: 'On the first-base side, Field Box 9–38 is in the sun for the whole game.', game: '2025-07-13 13:35', sections: numbered('F', [9, 38]), expect: { every: 'sun', minConfidence: 'high' } },
    { quote: 'Most Field Box seats are in the sun through the 6th inning;', game: '2025-07-13 13:35', sections: tier('Field Box'), expect: { share: 'sun', at: [0, 30, 60, 90], atLeast: 0.85 } },
    { quote: 'by the 9th, more than half of them have some shade.', game: '2025-07-13 13:35', sections: tier('Field Box'), expect: { share: 'not-sun', at: [150], atLeast: 0.5 } },
    { quote: 'Roof Box seats are in the sun from the 7th inning on;', game: '2025-07-13 13:35', sections: numbered('R', [23, 41]), expect: { every: 'sun', from: 120, minConfidence: 'medium' } },
    { quote: 'until then the press box right behind them shades their back rows (Medium confidence).', game: '2025-07-13 13:35', sections: numbered('R', [23, 41]), expect: { share: 'partial', at: [0, 30, 60, 90], atLeast: 0.8 } },
    { quote: 'has some rows in shade from the 2nd inning and stays partly shaded.', game: '2025-07-13 13:35', sections: numbered('B', [132, 155]), expect: { share: 'not-sun', at: [30, 60, 90, 120, 150], atLeast: 0.9 } },
    { quote: 'has some rows in shade from the 2nd inning and stays partly shaded.', game: '2025-07-13 13:35', sections: numbered('B', [132, 155]), expect: { share: 'partial', at: [150], atLeast: 1 } },
    { quote: 'Field Box 50–61, right behind home plate, are shaded from first pitch.', game: '2025-07-12 16:10', sections: numbered('F', [50, 61]), expect: { every: 'shaded', minConfidence: 'medium' } },
    { quote: 'The first-base side stays in the sun: Field Box 9–38 at High confidence', game: '2025-07-12 16:10', sections: numbered('F', [9, 38]), expect: { every: 'sun', minConfidence: 'high' } },
    { quote: 'Loge Box 87–106 at Low', game: '2025-07-12 16:10', sections: numbered('B', [87, 106]), expect: { every: 'sun', minConfidence: 'low' } },
    { quote: 'The Green Monster seats get no shade at all during 1:35 PM or 4:10 PM games in July.', game: '2025-07-13 13:35', sections: tier('Green Monster seats'), expect: { every: 'sun', minConfidence: 'high' } },
    { quote: 'The Green Monster seats get no shade at all during 1:35 PM or 4:10 PM games in July.', game: '2025-07-12 16:10', sections: tier('Green Monster seats'), expect: { every: 'sun', minConfidence: 'high' } },
    { quote: 'Most Field Box seats are already in shade by the 2nd inning', game: '2025-07-11 19:10', sections: tier('Field Box'), expect: { share: 'shaded', at: [30], atLeast: 0.9 } },
    { quote: 'and by the 6th inning every seat is out of the sun.', game: '2025-07-11 19:10', sections: () => true, expect: { share: 'shaded', at: [90, 120, 150, 180], atLeast: 1 } },
  ],
};

const SUN_CLAIMS: { park: ParkId; quote: string; game: string; azimuth: [number, number]; altitude: [number, number]; setsDuringGame?: boolean }[] = [
  { park: 'yankees', quote: 'when the sun was nearly due south and about 70° up at first pitch', game: '2025-07-12 13:05', azimuth: [170, 195], altitude: [67, 73] },
  { park: 'yankees', quote: 'the sun was low in the west-northwest at first pitch and set during the game', game: '2025-07-10 19:05', azimuth: [281, 304], altitude: [0, 20], setsDuringGame: true },
  { park: 'redsox', quote: 'when the sun was high in the south-southwest at first pitch', game: '2025-07-13 13:35', azimuth: [191, 214], altitude: [60, 75] },
  { park: 'redsox', quote: 'the sun was low in the west-northwest at first pitch and set during the game', game: '2025-07-11 19:10', azimuth: [281, 304], altitude: [0, 20], setsDuringGame: true },
];

const postText = (park: ParkId) =>
  fs.readFileSync(path.join(process.cwd(), 'content/blog', `${PARKS[park].slug}.mdx`), 'utf8').replace(/\s+/g, ' ');

describe.each(Object.keys(CLAIMS) as ParkId[])('%s post: shade claims match the engine', (park) => {
  const text = postText(park);

  it.each(CLAIMS[park].map((c) => [c.quote, c]))('%s', (_quote, claim) => {
    const c = claim as Claim;
    expect(text).toContain(c.quote);
    const sections = game(park, c.game).sections.filter(c.sections);
    expect(sections.length).toBeGreaterThan(0);
    const sampleIndex = (minute: number) => ALL.indexOf(minute);

    if ('every' in c.expect) {
      const { every, from = 0, to = 180, minConfidence } = c.expect;
      const wrong = sections
        .filter((s) => s.samples.slice(sampleIndex(from), sampleIndex(to) + 1).some((x) => x.status !== every) || rank[s.confidence] < rank[minConfidence])
        .map((s) => `${s.sectionId} ${s.samples.map((x) => x.status[0]).join('')} ${s.confidence}`);
      expect(wrong).toEqual([]);
    } else {
      const { share, at, atLeast = 0, atMost = 1 } = c.expect;
      for (const minute of at) {
        const i = sampleIndex(minute);
        const hits = sections.filter((s) => (share === 'not-sun' ? s.samples[i].status !== 'sun' : s.samples[i].status === share)).length;
        const fraction = hits / sections.length;
        expect([minute, fraction >= atLeast && fraction <= atMost]).toEqual([minute, true]);
      }
    }
  });
});

describe('sun positions quoted in the posts', () => {
  it.each(SUN_CLAIMS.map((c) => [c.quote, c]))('%s', (_quote, claim) => {
    const c = claim as (typeof SUN_CLAIMS)[number];
    expect(postText(c.park)).toContain(c.quote);
    const sun = game(c.park, c.game).sun;
    expect(sun[0].azimuthDeg).toBeGreaterThanOrEqual(c.azimuth[0]);
    expect(sun[0].azimuthDeg).toBeLessThanOrEqual(c.azimuth[1]);
    expect(sun[0].altitudeDeg).toBeGreaterThanOrEqual(c.altitude[0]);
    expect(sun[0].altitudeDeg).toBeLessThanOrEqual(c.altitude[1]);
    if (c.setsDuringGame) expect(sun[sun.length - 1].altitudeDeg).toBeLessThan(0);
  });
});
