/**
 * The fan's answer: every section's shade from first pitch to about three
 * hours later, in half-hour steps, with a confidence label and one plain
 * sentence ("Section 214A: shade from about the 4th inning.").
 *
 * Sun position: NREL SPA (solarPosition.ts). Shade: the row-level engine
 * (shadeEngine.ts) on the park's structure profile (stadiumStructures.ts).
 *
 * Confidence is a robustness test, not a guess. Every answer is recomputed
 * with the park's orientation moved by its measured ± error and with the
 * structure around the seats moved as far as its data could plausibly be off
 * (estimated heights and setbacks ±50%; measured ones ±10–20%; a back over
 * the rows of a stand with a deck moves with the deck's edge). If no
 * half-hour step changes, the answer is High; one or two steps, Medium;
 * more, Low.
 */
import type { DetailedSection } from '../types/stadium-complete';
import type { StadiumStructure, TierStructure } from '../data/stadiumStructures';
import { getSolarPosition } from './solarPosition';
import { DEFAULT_TREAD_FT, rowLight, shadedFraction, statusFor, type ShadeStatus, type StandProfile, type SunAngles } from './shadeEngine';

export const GAME_WINDOW_MINUTES = 180;
export const STEP_MINUTES = 30;
/** MLB's 2025 average nine-inning game took 2:38, about 17.6 minutes per inning. */
export const MINUTES_PER_INNING = 158 / 9;

export type Confidence = 'high' | 'medium' | 'low';

export interface ShadeSample {
  minutesFromStart: number;
  shadedFraction: number;
  status: ShadeStatus;
}

export interface SectionGameShade {
  sectionId: string;
  sectionName: string;
  tier: string;
  tierLabel: string;
  samples: ShadeSample[];
  confidence: Confidence;
  sentence: string;
}

export interface GameShadeInput {
  sections: readonly DetailedSection[];
  structure: StadiumStructure;
  /** Bearing from home plate to center field, and its ± error, degrees. */
  orientationDeg: number;
  orientationPrecisionDeg: number;
  latitude: number;
  longitude: number;
  firstPitch: Date;
}

export interface GameShadeResult {
  sun: Array<SunAngles & { minutesFromStart: number }>;
  sections: SectionGameShade[];
}

export function sampleOffsets(): number[] {
  const offsets: number[] = [];
  for (let m = 0; m <= GAME_WINDOW_MINUTES; m += STEP_MINUTES) offsets.push(m);
  return offsets;
}

const ordinal = (n: number) => {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]}`;
};

/** "the 4th inning" for a time after first pitch; null once the game is likely over. */
export function inningAt(minutesFromStart: number): string | null {
  const inning = Math.floor(minutesFromStart / MINUTES_PER_INNING) + 1;
  return inning <= 9 ? `the ${ordinal(inning)} inning` : null;
}

/** One plain sentence for a section's game. */
export function shadeSentence(label: string, samples: readonly ShadeSample[], sunDown: boolean): string {
  const statuses = samples.map((s) => s.status);
  if (sunDown) return `${label}: out of the sun all game (the sun is down).`;
  if (statuses.every((s) => s === 'shaded')) return `${label}: shaded the whole game.`;
  if (statuses.every((s) => s === 'sun')) return `${label}: in the sun the whole game.`;

  const firstShaded = statuses.indexOf('shaded');
  if (firstShaded === 0) {
    const lost = statuses.findIndex((s) => s !== 'shaded');
    const next = statuses[lost] === 'sun' ? 'sun' : 'partial shade';
    const when = inningAt(samples[lost].minutesFromStart);
    return when ? `${label}: shaded until about ${when}, then ${next}.` : `${label}: shaded until late in the game.`;
  }
  if (firstShaded > 0) {
    const when = inningAt(samples[firstShaded].minutesFromStart);
    return when ? `${label}: shade from about ${when}.` : `${label}: shade arrives by the end of the game.`;
  }
  const firstPartial = statuses.indexOf('partial');
  if (firstPartial === 0) {
    const sun = statuses.indexOf('sun');
    if (sun === -1) return `${label}: partly shaded, with sun on some rows all game.`;
    const until = inningAt(samples[sun].minutesFromStart);
    return until ? `${label}: partly shaded until about ${until}, then sun.` : `${label}: partly shaded until late in the game.`;
  }
  const when = inningAt(samples[firstPartial].minutesFromStart);
  return when ? `${label}: partial shade from about ${when}.` : `${label}: mostly in the sun.`;
}

/**
 * The section's stand profile: its tier's, with the club map's row count when
 * the tier uses it (`mapRows`), and any section-specific changes on top.
 */
export function standFor(
  structure: StadiumStructure,
  sectionId: string,
  mapRows?: number,
): { tierKey: string; tier: TierStructure; stand: StandProfile } | null {
  const tierKey = structure.tierOf(sectionId);
  if (!tierKey) return null;
  const tier = structure.tiers[tierKey];
  if (!tier) return null;
  const override = tier.sections?.[sectionId];
  const rows = tier.rowsFromMap && mapRows ? mapRows : tier.stand.rows;
  const stand: StandProfile = { ...tier.stand, rows, ...override };
  if (override?.noCover) delete stand.overhang;
  return { tierKey, tier, stand };
}

/** The same stand with no deck overhead, and with one over its back half. */
function coverAlternatives(stand: StandProfile): StandProfile[] {
  const rise = (stand.treadFt ?? 2.75) * Math.tan((stand.rakeDeg * Math.PI) / 180);
  const halfway = Math.max(1, Math.ceil(stand.rows / 2));
  const { overhang: _omit, ...open } = stand;
  return [
    open,
    {
      ...stand,
      overhang: {
        coveredFromRow: halfway,
        soffitHeightFt: stand.frontRowHeightFt + (stand.rows - 1) * rise + 8,
      },
    },
  ];
}

/**
 * The structure around the seats moved by `factor`: how far the back wall and
 * the deck's underside and front rise above the front row, how far back the structure
 * stands and how far the deck reaches out. Scaling every height together
 * would barely change the geometry that matters; this changes the structure
 * relative to the seats.
 */
function perturbStructure(stand: StandProfile, heightFactor: number, setbackFactor: number): StandProfile {
  const base = stand.frontRowHeightFt;
  return {
    ...stand,
    backHeightFt: base + (stand.backHeightFt - base) * heightFactor,
    backSetbackFt: movedSetback(stand, setbackFactor),
    deckFrontFt: stand.deckFrontFt === undefined ? undefined : base + (stand.deckFrontFt - base) * heightFactor,
    overhang: stand.overhang
      ? {
          ...stand.overhang,
          soffitHeightFt: base + (stand.overhang.soffitHeightFt - base) * heightFactor,
          reachFt: stand.overhang.reachFt === undefined ? undefined : stand.overhang.reachFt * setbackFactor,
        }
      : undefined,
  };
}

/**
 * The back's setback with its distance from what it stands on moved by
 * `factor`. That is the last row, except for a back over the rows of a stand
 * with a deck: it stands on that deck (its front, or the deck above), so it
 * keeps its place relative to the deck's edge and moves with it, the way the
 * deck's reach is moved. A share of its distance from the last row would
 * slide it rows past that edge, out over the open rows.
 */
function movedSetback(stand: StandProfile, factor: number): number | undefined {
  const setback = stand.backSetbackFt;
  if (setback === undefined) return undefined;
  if (setback >= 0 || !stand.overhang) return setback * factor;
  // The deck's edge, in feet behind the last row (negative: in front of it),
  // before and after its reach is moved.
  const tread = stand.treadFt ?? DEFAULT_TREAD_FT;
  const coveredDepth = (Math.max(1, Math.round(stand.rows)) - Math.max(1, stand.overhang.coveredFromRow) + 1) * tread;
  const reach = stand.overhang.reachFt ?? 0;
  const edge = -(coveredDepth + reach);
  const movedEdge = -(coveredDepth + reach * factor);
  return movedEdge + (setback - edge) * factor;
}

/** Bearing from home plate to a section, for parks without stand directions. */
function bearingFromHome(section: DetailedSection, orientationDeg: number): number {
  return (((orientationDeg + 90 - section.baseAngle - section.angleSpan / 2) % 360) + 360) % 360;
}

export function computeGameShade(input: GameShadeInput): GameShadeResult {
  const offsets = sampleOffsets();
  const sun = offsets.map((minutesFromStart) => {
    const p = getSolarPosition(
      new Date(input.firstPitch.getTime() + minutesFromStart * 60000),
      input.latitude,
      input.longitude,
    );
    return { minutesFromStart, azimuthDeg: p.azimuthDegrees, altitudeDeg: p.altitudeDegrees };
  });
  const sunDown = sun.every((s) => s.altitudeDeg <= 0);
  const park = input.structure.park;

  const sections: SectionGameShade[] = [];
  for (const section of input.sections) {
    const resolved = standFor(input.structure, section.id, section.rows?.length);
    if (!resolved) continue;
    const { tierKey, tier, stand } = resolved;
    const facing = section.standCompass ?? bearingFromHome(section, input.orientationDeg);

    const run = (standUsed: StandProfile, facingUsed: number, rimScale = 1) =>
      sun.map((s) => statusFor(shadedFraction(rowLight(
        standUsed,
        facingUsed,
        { ...park, farRimHeightFt: park.farRimHeightFt * rimScale },
        s,
      ))));

    const fractions = sun.map((s) => shadedFraction(rowLight(stand, facing, park, s)));
    const base = fractions.map(statusFor);

    // How far the structure could plausibly be off: estimated heights and
    // setbacks ±50%, measured ones ±10% and ±20%.
    const e = tier.heightsSourced ? 0.1 : 0.5;
    const setbackError = tier.heightsSourced ? 0.2 : 0.5;
    const precision = input.orientationPrecisionDeg;
    const variants = [
      run(stand, facing + precision),
      run(stand, facing - precision),
      run(perturbStructure(stand, 1 + e, 1), facing, 1 + e),
      run(perturbStructure(stand, 1 - e, 1), facing, 1 - e),
      run(perturbStructure(stand, 1, 1 + setbackError), facing),
      run(perturbStructure(stand, 1, 1 - setbackError), facing),
      // When no source says which rows are covered, try both.
      ...(tier.coverSourced ? [] : coverAlternatives(stand).map((alt) => run(alt, facing))),
    ];
    const unstableSteps = base.filter((status, i) => variants.some((v) => v[i] !== status)).length;
    const confidence: Confidence = unstableSteps === 0 ? 'high' : unstableSteps <= 2 ? 'medium' : 'low';

    const samples = offsets.map((minutesFromStart, i) => ({
      minutesFromStart,
      shadedFraction: fractions[i],
      status: base[i],
    }));
    sections.push({
      sectionId: section.id,
      sectionName: section.name,
      tier: tierKey,
      tierLabel: tier.label,
      samples,
      confidence,
      sentence: shadeSentence(`Section ${section.id}`, samples, sunDown),
    });
  }
  return { sun, sections };
}
