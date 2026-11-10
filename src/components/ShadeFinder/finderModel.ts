/**
 * Pure helpers for the shade finder: share links, seat-map layout, the best
 * sections list and game labels. Kept free of React so they can be tested.
 */
import type { DetailedSection } from '../../types/stadium-complete';
import type { SectionGameShade } from '../../utils/gameShade';
import type { MLBGame } from '../../services/mlbApi';

/** `https://theshadium.com/stadium/yankees?game=852989&section=214A` */
export function buildShareUrl(origin: string, stadiumId: string, gamePk?: number, sectionId?: string): string {
  const params = new URLSearchParams();
  if (gamePk) params.set('game', String(gamePk));
  if (sectionId) params.set('section', sectionId);
  const query = params.toString();
  return `${origin}/stadium/${stadiumId}${query ? `?${query}` : ''}`;
}

export function parseShareParams(search: string): { gamePk?: number; sectionId?: string } {
  const params = new URLSearchParams(search);
  const game = Number(params.get('game'));
  const section = params.get('section')?.trim();
  return {
    gamePk: Number.isInteger(game) && game > 0 ? game : undefined,
    sectionId: section ? section.toUpperCase() : undefined,
  };
}

export interface MapTile {
  id: string;
  cx: number;
  cy: number;
  w: number;
  h: number;
  /** Degrees to rotate the tile so its long side runs along the stand. */
  rotate: number;
}

export interface SeatMapLayout {
  tiles: MapTile[];
  viewBox: string;
  grassPath: string;
  dirtPath: string;
}

const LEVEL_RADIUS: Record<string, number> = { field: 0.34, lower: 0.5, club: 0.66, suite: 0.74, upper: 0.86, standing: 0.94 };

/**
 * Seat-map layout in a frame with home plate at (0, 0) and center field up.
 * Club-map parks use each section's real position; the others are laid out
 * in rings by seating level at their bearing from home plate.
 */
export function layoutSeatMap(sections: readonly DetailedSection[], orientationDeg: number): SeatMapLayout {
  const tiles: MapTile[] = sections.map((section) => {
    let x: number;
    let y: number;
    let w: number;
    let h: number;
    if (section.map) {
      ({ x, y, w, h } = section.map);
    } else {
      const bearing = orientationDeg + 90 - section.baseAngle - section.angleSpan / 2;
      const offset = ((bearing - orientationDeg) * Math.PI) / 180;
      const r = LEVEL_RADIUS[section.level] ?? 0.6;
      x = r * Math.sin(offset);
      y = -r * Math.cos(offset);
      w = Math.max(0.02, (r * section.angleSpan * Math.PI) / 180 * 0.9);
      h = 0.12;
    }
    const rotate = (Math.atan2(y, x) * 180) / Math.PI + 90;
    return { id: section.id, cx: x, cy: y, w: Math.max(w, 0.012), h: Math.max(h, 0.012), rotate };
  });

  // Outfield wall just inside the nearest seats toward center field.
  const outfield = tiles
    .filter((t) => t.cy < 0 && Math.abs(Math.atan2(t.cx, -t.cy)) < (35 * Math.PI) / 180)
    .map((t) => Math.hypot(t.cx, t.cy) - t.h / 2);
  const wall = outfield.length ? Math.max(0.3, Math.min(...outfield) * 0.94) : 0.55;
  const corner = wall * 0.78;
  const c45 = Math.SQRT1_2;
  const grassPath = `M0 0 L${-corner * c45} ${-corner * c45} Q0 ${-wall * 1.35} ${corner * c45} ${-corner * c45} Z`;
  const base = wall * 0.22;
  const dirtPath = `M0 0 L${base * c45} ${-base * c45} L0 ${-base * 2 * c45} L${-base * c45} ${-base * c45} Z`;

  let minX = -wall;
  let maxX = wall;
  let minY = -wall * 1.2;
  let maxY = 0.1;
  for (const t of tiles) {
    const r = Math.max(t.w, t.h) / 2;
    minX = Math.min(minX, t.cx - r);
    maxX = Math.max(maxX, t.cx + r);
    minY = Math.min(minY, t.cy - r);
    maxY = Math.max(maxY, t.cy + r);
  }
  const pad = 0.03;
  const viewBox = [minX - pad, minY - pad, maxX - minX + 2 * pad, maxY - minY + 2 * pad].map((v) => v.toFixed(4)).join(' ');
  return { tiles, viewBox, grassPath, dirtPath };
}

const confidenceRank = { high: 2, medium: 1, low: 0 } as const;

/**
 * Sections with the most shade over the game, most-confident first among
 * ties. At most one per seating area first, so fans see options across
 * price levels rather than five boxes of the same club.
 */
export function bestSections(sections: readonly SectionGameShade[], count = 5): SectionGameShade[] {
  const mean = (s: SectionGameShade) => s.samples.reduce((sum, x) => sum + x.shadedFraction, 0) / s.samples.length;
  const ranked = [...sections]
    .filter((s) => s.confidence !== 'low')
    .sort((a, b) => mean(b) - mean(a) || confidenceRank[b.confidence] - confidenceRank[a.confidence]);
  const seenTiers = new Set<string>();
  const onePerTier = ranked.filter((s) => (seenTiers.has(s.tier) ? false : (seenTiers.add(s.tier), true)));
  const rest = ranked.filter((s) => !onePerTier.includes(s));
  return [...onePerTier, ...rest].slice(0, count);
}

/** Find a section by what a fan types: exact id, then an id that starts with it. */
export function findSection(sections: readonly SectionGameShade[], query: string): SectionGameShade | undefined {
  const q = query.trim().toUpperCase().replace(/^SECTION\s+/, '');
  if (!q) return undefined;
  return sections.find((s) => s.sectionId.toUpperCase() === q)
    ?? sections.find((s) => s.sectionId.toUpperCase().startsWith(q));
}

export function formatGameOption(game: MLBGame, timeZone: string): string {
  const when = new Date(game.gameDate);
  const day = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short', month: 'short', day: 'numeric' }).format(when);
  const time = game.status.startTimeTBD
    ? 'time TBD'
    : new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }).format(when);
  return `${day} · ${time} · vs ${game.teams.away.team.name}`;
}

export function formatClock(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }).format(date);
}
