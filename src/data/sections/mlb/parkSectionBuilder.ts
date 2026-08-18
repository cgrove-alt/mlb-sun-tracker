import type {
  CoverageDetail,
  DetailedSection,
  RowDetail,
  Vector3D,
} from '../../../types/stadium-complete';

/**
 * Shared construction helpers for the sourced MLB section maps.
 *
 * The inputs to this module are park-specific: published section IDs and
 * either chart-derived compass centres or bands transcribed from an official
 * seating chart.  The helpers only add the calculator-facing row and 3-D bowl
 * primitives.  They deliberately do not invent section identities.
 *
 * Row elevations/depths are a geometric model.  That is also true of the
 * existing Yankee Stadium, Fenway Park, and Rate Field datasets: public seat
 * charts establish section identity and placement, but do not publish a
 * survey-grade elevation for every row.
 */

export type SectionCoverage = 'none' | 'partial' | 'full';

export interface ParkSectionSeed {
  id: string;
  name?: string;
  level: DetailedSection['level'];
  compass: number;
  span?: number;
  coverage?: SectionCoverage;
  rowCount?: number;
  seatsPerRow?: number;
  distance?: number;
  height?: number;
  rake?: number;
  price?: DetailedSection['price'];
}

export interface SectionBand {
  ids: readonly string[];
  level: DetailedSection['level'];
  /** Compass bearing of the first section centre. May be outside 0..360. */
  compassStart: number;
  /** Compass bearing of the final section centre. May be outside 0..360. */
  compassEnd: number;
  namePrefix?: string;
  coverage?: SectionCoverage;
  rowCount?: number;
  seatsPerRow?: number;
  distance?: number;
  height?: number;
  rake?: number;
  price?: DetailedSection['price'];
}

export interface ChartSectionPoint {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  /** Optional official label from the map's own translation manifest. */
  name?: string;
  /** Optional counts from the map's own row/seat search manifest. */
  rowCount?: number;
  seatsPerRow?: number;
  /** Product family published by a multi-layer public viewer. */
  sourceLayer?: 'seats' | 'suites' | 'clubs';
}

export interface ChartSectionMeta {
  level: DetailedSection['level'];
  name?: string;
  coverage?: SectionCoverage;
  rowCount?: number;
  seatsPerRow?: number;
  distance?: number;
  height?: number;
  rake?: number;
  price?: DetailedSection['price'];
}

export interface ChartSeedConfig {
  orientation: number;
  /** Chart polygon(s) centred directly behind home plate. */
  behindHomeIds: readonly string[];
  /** Chart polygon(s) centred in or bracketing centre field. */
  centerFieldIds: readonly string[];
  /**
   * Distance from the behind-home polygon centre toward the field, expressed
   * in multiples of that polygon's larger bounding-box dimension.
   */
  originInset?: number;
  classify: (id: string, point: ChartSectionPoint) => ChartSectionMeta | null;
}

export function range(start: number, end: number, excluded: readonly number[] = []): string[] {
  const omitted = new Set(excluded);
  const step = start <= end ? 1 : -1;
  const ids: string[] = [];
  for (let n = start; ; n += step) {
    if (!omitted.has(n)) ids.push(String(n));
    if (n === end) break;
  }
  return ids;
}

export function prefixedRange(
  prefix: string,
  start: number,
  end: number,
  suffix = '',
  excluded: readonly number[] = [],
): string[] {
  return range(start, end, excluded).map((id) => `${prefix}${id}${suffix}`);
}

export function band(input: SectionBand): ParkSectionSeed[] {
  const step = input.ids.length > 1
    ? (input.compassEnd - input.compassStart) / (input.ids.length - 1)
    : 0;
  const span = input.ids.length > 1 ? Math.max(1.5, Math.min(18, Math.abs(step) * 0.88)) : 8;

  return input.ids.map((id, index) => ({
    id,
    name: `${input.namePrefix ?? 'Section'} ${id}`,
    level: input.level,
    compass: input.compassStart + step * index,
    span,
    coverage: input.coverage,
    rowCount: input.rowCount,
    seatsPerRow: input.seatsPerRow,
    distance: input.distance,
    height: input.height,
    rake: input.rake,
    price: input.price,
  }));
}

function normalize(degrees: number): number {
  return ((degrees % 360) + 360) % 360;
}

/**
 * Convert selectable polygons from an official 3D Digital Venue chart into
 * calculator seeds.  The chart itself supplies every centre; two named chart
 * anchors calibrate its rotation and home-plate origin to the park's verified
 * compass orientation.
 */
export function chartSeeds(
  points: readonly ChartSectionPoint[],
  config: ChartSeedConfig,
): ParkSectionSeed[] {
  const byId = new Map(points.map((point) => [point.id, point]));
  const averageAnchor = (ids: readonly string[]) => {
    const anchors = ids.map((id) => byId.get(id)).filter((point): point is ChartSectionPoint => Boolean(point));
    if (anchors.length !== ids.length || anchors.length === 0) {
      const missing = ids.filter((id) => !byId.has(id));
      throw new Error(`Chart calibration anchors missing: ${missing.join(', ') || '(empty anchor list)'}`);
    }
    return {
      x: anchors.reduce((sum, point) => sum + point.x, 0) / anchors.length,
      y: anchors.reduce((sum, point) => sum + point.y, 0) / anchors.length,
      width: anchors.reduce((sum, point) => sum + point.width, 0) / anchors.length,
      height: anchors.reduce((sum, point) => sum + point.height, 0) / anchors.length,
    };
  };
  const behind = averageAnchor(config.behindHomeIds);
  const center = averageAnchor(config.centerFieldIds);

  const towardCenterX = center.x - behind.x;
  const towardCenterY = center.y - behind.y;
  const towardCenterLength = Math.hypot(towardCenterX, towardCenterY) || 1;
  const ux = towardCenterX / towardCenterLength;
  const uy = towardCenterY / towardCenterLength;
  const inset = Math.max(behind.width, behind.height) * (config.originInset ?? 1.7);
  const originX = behind.x + ux * inset;
  const originY = behind.y + uy * inset;
  const axisX = center.x - originX;
  const axisY = center.y - originY;
  const axisLength = Math.hypot(axisX, axisY) || 1;
  const ax = axisX / axisLength;
  const ay = axisY / axisLength;

  const provisional: ParkSectionSeed[] = [];
  for (const point of points) {
    const meta = config.classify(point.id, point);
    if (!meta) continue;
    const vx = point.x - originX;
    const vy = point.y - originY;
    const dot = ax * vx + ay * vy;
    // SVG/chart y increases downward. With that coordinate convention, this
    // cross-product sign is positive toward the first-base/right-field side.
    const cross = ax * vy - ay * vx;
    const offset = (Math.atan2(cross, dot) * 180) / Math.PI;
    const radius = Math.hypot(vx, vy) || 1;
    // Project the SVG bounding box onto the direction tangent to this
    // section's radial line. This uses each selectable polygon's published
    // footprint, so a narrow premium box does not become the same wedge as a
    // broad bleacher/deck area.
    const tangentX = -vy / radius;
    const tangentY = vx / radius;
    const halfTangentExtent = (
      Math.abs(tangentX) * point.width / 2 +
      Math.abs(tangentY) * point.height / 2
    );
    const polygonSpan = (2 * Math.atan2(halfTangentExtent, radius) * 180) / Math.PI;
    provisional.push({
      id: point.id,
      name: meta.name ?? point.name ?? `Section ${point.id}`,
      level: meta.level,
      compass: normalize(config.orientation + offset),
      span: Math.max(1.25, Math.min(18, polygonSpan)),
      coverage: meta.coverage,
      rowCount: meta.rowCount ?? point.rowCount,
      seatsPerRow: meta.seatsPerRow ?? point.seatsPerRow,
      distance: meta.distance,
      height: meta.height,
      rake: meta.rake,
      price: meta.price,
    });
  }

  return provisional;
}

const LEVEL_GEOMETRY: Record<
  DetailedSection['level'],
  { rows: number; seats: number; distance: number; height: number; rake: number; price: DetailedSection['price'] }
> = {
  field: { rows: 12, seats: 18, distance: 118, height: 4, rake: 12, price: 'premium' },
  lower: { rows: 24, seats: 20, distance: 165, height: 18, rake: 20, price: 'moderate' },
  club: { rows: 14, seats: 18, distance: 190, height: 48, rake: 24, price: 'premium' },
  upper: { rows: 20, seats: 18, distance: 230, height: 78, rake: 30, price: 'value' },
  suite: { rows: 4, seats: 12, distance: 180, height: 58, rake: 4, price: 'luxury' },
  standing: { rows: 1, seats: 30, distance: 285, height: 32, rake: 0, price: 'value' },
};

function makeRows(
  count: number,
  seatsPerRow: number,
  baseElevation: number,
  rake: number,
  coverage: SectionCoverage,
): RowDetail[] {
  const coveredFrom = coverage === 'partial' ? Math.ceil(count * 0.62) : 1;
  return Array.from({ length: count }, (_, index) => {
    const row = index + 1;
    const covered = coverage === 'full' || (coverage === 'partial' && row >= coveredFrom);
    return {
      rowNumber: String(row),
      seats: Math.max(4, seatsPerRow - Math.floor(index / 5)),
      elevation: baseElevation + index * 2.8 * Math.sin((rake * Math.PI) / 180),
      depth: index * 2.8,
      covered,
      overhangHeight: covered ? Math.max(8, 26 - index * 0.25) : undefined,
    };
  });
}

function vertices(
  baseAngle: number,
  angleSpan: number,
  distance: number,
  height: number,
): Vector3D[] {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const inner = Math.max(12, distance - 16);
  const outer = distance + 16;
  return [
    { x: inner * Math.cos(radians(baseAngle)), y: inner * Math.sin(radians(baseAngle)), z: height },
    { x: inner * Math.cos(radians(baseAngle + angleSpan)), y: inner * Math.sin(radians(baseAngle + angleSpan)), z: height },
    { x: outer * Math.cos(radians(baseAngle + angleSpan)), y: outer * Math.sin(radians(baseAngle + angleSpan)), z: height + 8 },
    { x: outer * Math.cos(radians(baseAngle)), y: outer * Math.sin(radians(baseAngle)), z: height + 8 },
  ];
}

export function buildParkSections(
  orientation: number,
  seeds: readonly ParkSectionSeed[],
): DetailedSection[] {
  const seen = new Set<string>();
  return seeds.map((seed) => {
    if (seen.has(seed.id)) throw new Error(`Duplicate sourced section id: ${seed.id}`);
    seen.add(seed.id);

    const defaults = LEVEL_GEOMETRY[seed.level];
    const coverage = seed.coverage ?? 'none';
    const angleSpan = seed.span ?? 7;
    const baseAngle = normalize(orientation + 90 - seed.compass - angleSpan / 2);
    const height = seed.height ?? defaults.height;
    const rake = seed.rake ?? defaults.rake;
    const rows = makeRows(
      seed.rowCount ?? defaults.rows,
      seed.seatsPerRow ?? defaults.seats,
      height,
      rake,
      coverage,
    );
    const coveredRows = rows.filter((row) => row.covered).map((row) => row.rowNumber);
    const partialCoverage: CoverageDetail | undefined = coverage === 'partial'
      ? {
          type: 'partial',
          coveredRows,
          coveragePercentage: rows.length ? Math.round((coveredRows.length / rows.length) * 100) : 0,
          overhangDepth: 18,
          overhangHeight: 22,
          material: 'solid',
        }
      : undefined;
    const distance = seed.distance ?? defaults.distance;

    return {
      id: seed.id,
      name: seed.name ?? `Section ${seed.id}`,
      level: seed.level,
      baseAngle,
      angleSpan,
      rows,
      vertices3D: vertices(baseAngle, angleSpan, distance, height),
      covered: coverage === 'full',
      partialCoverage,
      price: seed.price ?? defaults.price,
      distance,
      height,
      rake,
      viewQuality: seed.level === 'upper' ? 'fair' : seed.level === 'standing' ? 'good' : 'excellent',
    };
  });
}
