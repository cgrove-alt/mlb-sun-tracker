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
  /** Compass bearing the stand's back faces (outward normal of its rows). */
  standCompass?: number;
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
  /**
   * Field-box sections whose rows run parallel to each foul line. When given,
   * the chart is calibrated from them instead of from the two anchors:
   *   - a straight line is fitted through each set;
   *   - the chart's vertical squash is solved so the two lines are 90° apart
   *     (foul lines are perpendicular; club maps are often drawn at an angle);
   *   - their crossing point is the origin and their bisector is the
   *     home → center-field axis.
   * Two anchor sections can sit off-center (Yankee Stadium's 122/123 tilted
   * the axis by about 16°); a fit through a dozen sections cannot.
   */
  foulLineRows?: { firstBase: readonly string[]; thirdBase: readonly string[] };
  /**
   * Which seating ring a section belongs to, for fitting stand directions.
   * Defaults to the section's level; give it when two physical rings share a
   * level (Yankee Stadium's 200s and 300s are both "club").
   */
  tierOf?: (id: string, level: DetailedSection['level']) => string;
  classify: (id: string, point: ChartSectionPoint) => ChartSectionMeta | null;
}

interface ChartFrame {
  /** Multiply chart y by this to undo the map's vertical squash. */
  stretchY: number;
  originX: number;
  originY: number;
  /** Unit vector from the origin toward center field, in stretched chart space. */
  axisX: number;
  axisY: number;
}

interface FittedLine {
  mx: number;
  my: number;
  dx: number;
  dy: number;
}

function fitLine(points: readonly { x: number; y: number }[]): FittedLine {
  const mx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const my = points.reduce((sum, p) => sum + p.y, 0) / points.length;
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const p of points) {
    sxx += (p.x - mx) ** 2;
    syy += (p.y - my) ** 2;
    sxy += (p.x - mx) * (p.y - my);
  }
  const theta = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  return { mx, my, dx: Math.cos(theta), dy: Math.sin(theta) };
}

function frameFromFoulLines(
  byId: ReadonlyMap<string, ChartSectionPoint>,
  rows: NonNullable<ChartSeedConfig['foulLineRows']>,
  centerField: { x: number; y: number },
): ChartFrame {
  const pick = (ids: readonly string[]) => ids.map((id) => {
    const point = byId.get(id);
    if (!point) throw new Error(`Foul-line calibration section missing: ${id}`);
    return point;
  });
  const first = pick(rows.firstBase);
  const third = pick(rows.thirdBase);
  const stretched = (pts: ChartSectionPoint[], k: number) => pts.map((p) => ({ x: p.x, y: p.y * k }));
  const angleBetween = (k: number) => {
    const a = fitLine(stretched(first, k));
    const b = fitLine(stretched(third, k));
    return (Math.acos(Math.min(1, Math.abs(a.dx * b.dx + a.dy * b.dy))) * 180) / Math.PI;
  };

  let stretchY = 1;
  let bestError = Infinity;
  for (let k = 0.6; k <= 1.8; k += 0.0005) {
    const error = Math.abs(angleBetween(k) - 90);
    if (error < bestError) {
      bestError = error;
      stretchY = k;
    }
  }
  if (bestError > 0.5) throw new Error(`Foul-line rows cannot be made perpendicular (off by ${bestError.toFixed(2)}°)`);

  const a = fitLine(stretched(first, stretchY));
  const b = fitLine(stretched(third, stretchY));
  const det = a.dx * -b.dy - a.dy * -b.dx;
  const t = ((b.mx - a.mx) * -b.dy - (b.my - a.my) * -b.dx) / det;
  const originX = a.mx + a.dx * t;
  const originY = a.my + a.dy * t;

  // Point each line away from the crossing point (down the line), then bisect.
  const outward = (line: FittedLine) => {
    const sign = Math.sign((line.mx - originX) * line.dx + (line.my - originY) * line.dy) || 1;
    return { x: line.dx * sign, y: line.dy * sign };
  };
  const u1 = outward(a);
  const u3 = outward(b);
  let axisX = u1.x + u3.x;
  let axisY = u1.y + u3.y;
  const length = Math.hypot(axisX, axisY);
  axisX /= length;
  axisY /= length;

  // The axis must point at center field, and the first-base rows must be on
  // the first-base side (positive cross product in a y-down chart).
  const toCenter = { x: centerField.x - originX, y: centerField.y * stretchY - originY };
  if (axisX * toCenter.x + axisY * toCenter.y <= 0) throw new Error('Foul-line axis does not point toward center field');
  if (axisX * u1.y - axisY * u1.x <= 0) throw new Error('First-base rows are not on the first-base side of the axis');

  return { stretchY, originX, originY, axisX, axisY };
}

/**
 * Compass bearing each section's stand faces AWAY from the field: the
 * outward normal of its seating rows, from a straight-line fit through its
 * same-tier neighbours. This, not the bearing from home plate, is what
 * decides whether the sun is behind a stand or in its face. Along a foul
 * line the two differ by 45° or more.
 */
function standCompasses(
  seeds: readonly { tier: string; x: number; y: number; area: number; width: number; height: number }[],
  frame: ChartFrame,
  orientation: number,
  fieldCenter: { x: number; y: number },
): (number | undefined)[] {
  const byTier = new Map<string, number[]>();
  seeds.forEach((seed, index) => byTier.set(seed.tier, [...(byTier.get(seed.tier) ?? []), index]));

  const result: (number | undefined)[] = seeds.map(() => undefined);
  for (const indices of byTier.values()) {
    // Markers drawn on or beside a section (wheelchair platforms, standing
    // rails) are not part of the row line. A marker sits inside a larger
    // section's outline, or is under 15% of the size of a section right
    // next to it (wheelchair strips are ~10%). Markers take their parent's
    // direction.
    const parentOf = (i: number): number | undefined => indices.find((j) => {
      if (j === i || seeds[j].area <= seeds[i].area) return false;
      const dx = Math.abs(seeds[i].x - seeds[j].x);
      const dy = Math.abs(seeds[i].y - seeds[j].y);
      const inside = dx < seeds[j].width / 2 && dy < seeds[j].height / 2;
      const tinyNeighbour = seeds[i].area < seeds[j].area * 0.15 &&
        Math.hypot(dx, dy) < Math.max(seeds[j].width, seeds[j].height);
      return inside || tinyNeighbour;
    });
    const parents = new Map(indices.map((i) => [i, parentOf(i)]));
    const fitters = indices.filter((i) => parents.get(i) === undefined);

    for (const i of fitters) {
      const near = fitters
        .filter((j) => j !== i)
        .map((j) => ({ j, d: Math.hypot(seeds[i].x - seeds[j].x, seeds[i].y - seeds[j].y) }))
        .sort((p, q) => p.d - q.d)
        .slice(0, 4);
      const size = Math.max(seeds[i].width, seeds[i].height);
      let nx: number;
      let ny: number;
      if (near.length >= 2 && near[near.length - 1].d <= size * 4) {
        const line = fitLine([seeds[i], ...near.map(({ j }) => seeds[j])]);
        nx = -line.dy;
        ny = line.dx;
      } else {
        // Too few ring-mates nearby to fit a row line (a lone deck or a
        // small group spread around the park): face straight away from
        // the middle of the field.
        nx = seeds[i].x - fieldCenter.x;
        ny = seeds[i].y - fieldCenter.y;
      }
      if (nx * (seeds[i].x - fieldCenter.x) + ny * (seeds[i].y - fieldCenter.y) < 0) {
        nx = -nx;
        ny = -ny;
      }
      const dot = frame.axisX * nx + frame.axisY * ny;
      const cross = frame.axisX * ny - frame.axisY * nx;
      result[i] = normalize(orientation + (Math.atan2(cross, dot) * 180) / Math.PI);
    }
    for (const i of indices) {
      let parent = parents.get(i);
      // Follow marker-of-marker chains to the section that was fitted.
      for (let hops = 0; parent !== undefined && result[parent] === undefined && hops < 4; hops++) {
        parent = parents.get(parent);
      }
      if (parent !== undefined && result[i] === undefined) result[i] = result[parent];
    }
  }
  return result;
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

  let frame: ChartFrame;
  if (config.foulLineRows) {
    const fitted = frameFromFoulLines(byId, config.foulLineRows, center);
    // The foul-line rows sit off the lines themselves, so they cross behind
    // home plate. Home plate is on the fitted axis: project the behind-home
    // anchors onto it (removing their sideways offset) and step in toward
    // the field by the usual inset.
    const bx = behind.x - fitted.originX;
    const by = behind.y * fitted.stretchY - fitted.originY;
    const along = bx * fitted.axisX + by * fitted.axisY;
    const inset = Math.max(behind.width, behind.height * fitted.stretchY) * (config.originInset ?? 1.7);
    frame = {
      ...fitted,
      originX: fitted.originX + fitted.axisX * (along + inset),
      originY: fitted.originY + fitted.axisY * (along + inset),
    };
  } else {
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
    frame = { stretchY: 1, originX, originY, axisX: axisX / axisLength, axisY: axisY / axisLength };
  }
  const { stretchY, originX, originY, axisX: ax, axisY: ay } = frame;

  const provisional: ParkSectionSeed[] = [];
  const positions: { tier: string; x: number; y: number; area: number; width: number; height: number }[] = [];
  for (const point of points) {
    const meta = config.classify(point.id, point);
    if (!meta) continue;
    const px = point.x;
    const py = point.y * stretchY;
    positions.push({
      tier: config.tierOf ? config.tierOf(point.id, meta.level) : meta.level,
      x: px,
      y: py,
      area: point.width * point.height * stretchY,
      width: point.width,
      height: point.height * stretchY,
    });
    const vx = px - originX;
    const vy = py - originY;
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
      Math.abs(tangentY) * point.height * stretchY / 2
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

  // The field's middle, for pointing each stand normal away from the field.
  const toCenter = Math.hypot(center.x - originX, center.y * stretchY - originY);
  const fieldCenter = { x: originX + ax * toCenter * 0.45, y: originY + ay * toCenter * 0.45 };
  const stands = standCompasses(positions, frame, config.orientation, fieldCenter);
  return provisional.map((seed, index) => ({ ...seed, standCompass: stands[index] }));
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
      standCompass: seed.standCompass,
      viewQuality: seed.level === 'upper' ? 'fair' : seed.level === 'standing' ? 'good' : 'excellent',
    };
  });
}
