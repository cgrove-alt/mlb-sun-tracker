import {
  canPublishSeatLevelShade,
  getStadiumShadeConfidence,
} from '../data/stadiumShadeConfidence';
import { getStadiumGeometryEvidence } from '../data/stadiumGeometryEvidence';
import { hasPublishedMeasuredShadeRuntime } from '../data/publishedShadeRuntime';
import {
  loadMeasuredGeometryArtifact,
  stampMeasuredGeometryArtifact,
  type MeasuredGeometryArtifact,
  type MeasuredVec3,
} from '../data/measuredGeometryArtifact';
import type {
  RowShadowResult,
  RowShadowRow,
  SectionWindowShade,
  SunSample,
  ShadeProgression,
  RowWindowShade,
} from './sunCalculator';

export type MeasuredRoofState = 'open' | 'closed' | 'not-applicable';

export type MeasuredRuntimeBindResult =
  | { ok: true; artifact: MeasuredGeometryArtifact }
  | { ok: false; code: string; blockers: readonly string[] };

/**
 * Third publication latch. Evidence and the runtime registry are not enough:
 * production must load the exact hashed artifact those records name, and that
 * artifact must not be the legacy 2D/3D estimators.
 */
export function bindMeasuredShadeRuntime(stadiumId: string): MeasuredRuntimeBindResult {
  if (!hasPublishedMeasuredShadeRuntime(stadiumId)) {
    return { ok: false, code: 'MEASURED_SHADE_RUNTIME_UNAVAILABLE', blockers: [] };
  }
  if (!canPublishSeatLevelShade(stadiumId)) {
    return {
      ok: false,
      code: 'UNVALIDATED_SEAT_GEOMETRY',
      blockers: getStadiumShadeConfidence(stadiumId).publicationBlockers,
    };
  }

  const artifact = loadMeasuredGeometryArtifact(stadiumId);
  if (!artifact) {
    return {
      ok: false,
      code: 'MEASURED_SHADE_ARTIFACT_UNAVAILABLE',
      blockers: ['NO_MEASURED_GEOMETRY_ARTIFACT'],
    };
  }

  const evidence = getStadiumGeometryEvidence(stadiumId);
  const expected = artifact.artifactVersion;
  if (
    evidence.stadiumFrame.artifactVersion !== expected
    || evidence.rowGeometry.artifactVersion !== expected
    || evidence.obstructionGeometry.artifactVersion !== expected
    || evidence.observationHoldout.geometryArtifactVersion !== expected
  ) {
    return {
      ok: false,
      code: 'MEASURED_SHADE_ARTIFACT_MISMATCH',
      blockers: ['OBSERVATION_GEOMETRY_VERSION_MISMATCH'],
    };
  }

  return { ok: true, artifact };
}

export function sunDirectionEnu(azimuthDeg: number, altitudeDeg: number): MeasuredVec3 {
  const az = (azimuthDeg * Math.PI) / 180;
  const alt = (altitudeDeg * Math.PI) / 180;
  const cosAlt = Math.cos(alt);
  return {
    x: Math.sin(az) * cosAlt,
    y: Math.cos(az) * cosAlt,
    z: Math.sin(alt),
  };
}

function recommendForCoverage(coverage: number): RowShadowRow['recommendation'] {
  if (coverage >= 80) return 'excellent';
  if (coverage >= 60) return 'good';
  if (coverage >= 40) return 'fair';
  return 'poor';
}

/**
 * Möller–Trumbore. Returns hit distance along the ray, or null.
 */
export function rayHitsTriangle(
  origin: MeasuredVec3,
  direction: MeasuredVec3,
  v0: MeasuredVec3,
  v1: MeasuredVec3,
  v2: MeasuredVec3,
): number | null {
  const epsilon = 1e-7;
  const e1x = v1.x - v0.x;
  const e1y = v1.y - v0.y;
  const e1z = v1.z - v0.z;
  const e2x = v2.x - v0.x;
  const e2y = v2.y - v0.y;
  const e2z = v2.z - v0.z;
  const px = direction.y * e2z - direction.z * e2y;
  const py = direction.z * e2x - direction.x * e2z;
  const pz = direction.x * e2y - direction.y * e2x;
  const det = e1x * px + e1y * py + e1z * pz;
  if (Math.abs(det) < epsilon) return null;
  const inv = 1 / det;
  const tx = origin.x - v0.x;
  const ty = origin.y - v0.y;
  const tz = origin.z - v0.z;
  const u = (tx * px + ty * py + tz * pz) * inv;
  if (u < 0 || u > 1) return null;
  const qx = ty * e1z - tz * e1y;
  const qy = tz * e1x - tx * e1z;
  const qz = tx * e1y - ty * e1x;
  const v = (direction.x * qx + direction.y * qy + direction.z * qz) * inv;
  if (v < 0 || u + v > 1) return null;
  const t = (e2x * qx + e2y * qy + e2z * qz) * inv;
  return t > epsilon ? t : null;
}

function sampleIsShaded(
  origin: MeasuredVec3,
  sunDir: MeasuredVec3,
  artifact: MeasuredGeometryArtifact,
): boolean {
  for (const obstruction of artifact.obstructions) {
    for (const [a, b, c] of obstruction.triangles) {
      if (rayHitsTriangle(origin, sunDir, a, b, c) !== null) return true;
    }
  }
  return false;
}

function rowCoverage(
  row: MeasuredGeometryArtifact['rows'][number],
  sunDir: MeasuredVec3,
  artifact: MeasuredGeometryArtifact,
  sunAltitudeDeg: number,
  roofState: MeasuredRoofState,
): number {
  if (sunAltitudeDeg <= 0 || row.covered || roofState === 'closed') return 100;
  const samples = row.seatSamples && row.seatSamples.length > 0
    ? row.seatSamples.map((seat) => seat.origin)
    : [row.origin];
  const shaded = samples.filter((origin) => sampleIsShaded(origin, sunDir, artifact)).length;
  return Math.round((100 * shaded) / samples.length);
}

function toRowResult(
  row: MeasuredGeometryArtifact['rows'][number],
  coverage: number,
): RowShadowRow {
  const clamped = Math.max(0, Math.min(100, coverage));
  return {
    rowNumber: row.rowId,
    seats: row.seats,
    elevation: row.origin.z,
    depth: 0,
    coverage: clamped,
    sunExposure: 100 - clamped,
    inShadow: clamped >= 50,
    shadowSources: {
      roof: row.covered ? clamped : 0,
      upperDeck: 0,
      overhang: 0,
      bowl: row.covered ? 0 : clamped,
    },
    recommendation: recommendForCoverage(clamped),
  };
}

function assembleSection(
  sectionId: string,
  sectionName: string,
  rows: RowShadowRow[],
): RowShadowResult {
  const averageCoverage = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.coverage, 0) / rows.length)
    : 100;
  const byCoverageDesc = [...rows].sort((a, b) => b.coverage - a.coverage);
  return {
    sectionId,
    sectionName,
    rows,
    averageCoverage,
    bestRows: byCoverageDesc.slice(0, 5).map((row) => row.rowNumber),
    worstRows: byCoverageDesc.slice(-5).reverse().map((row) => row.rowNumber),
  };
}

export function calculateMeasuredVenueShade(
  artifact: MeasuredGeometryArtifact,
  sun: { altitudeDegrees: number; azimuthDegrees: number },
  options?: { roofState?: MeasuredRoofState; sectionId?: string },
): RowShadowResult[] {
  const roofState = options?.roofState
    ?? (artifact.roof.type === 'fixed' ? 'closed' : 'open');
  const sunDir = sunDirectionEnu(sun.azimuthDegrees, sun.altitudeDegrees);
  const grouped = new Map<string, { name: string; rows: RowShadowRow[] }>();

  for (const row of artifact.rows) {
    if (
      options?.sectionId
      && row.sectionId !== options.sectionId
      && row.sectionName !== options.sectionId
    ) continue;
    const coverage = rowCoverage(row, sunDir, artifact, sun.altitudeDegrees, roofState);
    const bucket = grouped.get(row.sectionId) ?? { name: row.sectionName, rows: [] };
    bucket.rows.push(toRowResult(row, coverage));
    grouped.set(row.sectionId, bucket);
  }

  return [...grouped.entries()].map(([sectionId, bucket]) =>
    assembleSection(sectionId, bucket.name, bucket.rows),
  );
}

function mean(xs: number[]): number {
  return xs.length ? xs.reduce((sum, x) => sum + x, 0) / xs.length : 0;
}

function classifyProgression(timeline: { coverage: number }[]): ShadeProgression {
  if (timeline.length === 0) return 'mixed';
  const cov = timeline.map((point) => point.coverage);
  const first = cov[0];
  const last = cov[cov.length - 1];
  const lo = Math.min(...cov);
  const hi = Math.max(...cov);
  if (lo >= 50) return 'shaded-all';
  if (hi < 50) return 'sunny-all';
  if (last - first > 10) return 'sun-to-shade';
  if (first - last > 10) return 'shade-to-sun';
  return 'mixed';
}

export function calculateMeasuredGameWindowShade(
  artifact: MeasuredGeometryArtifact,
  sunSamples: SunSample[],
  options?: { roofState?: MeasuredRoofState; sectionId?: string },
): SectionWindowShade[] {
  const samples = sunSamples.length
    ? sunSamples
    : [{ minutesFromStart: 0, altitudeDegrees: 0, azimuthDegrees: 0 }];
  const perSample = samples.map((sample) => ({
    minutesFromStart: sample.minutesFromStart,
    sections: calculateMeasuredVenueShade(artifact, sample, options),
  }));
  const sectionIds = [...new Set(perSample.flatMap((sample) => sample.sections.map((section) => section.sectionId)))];

  return sectionIds.map((sectionId) => {
    const series = perSample.map((sample) => ({
      minutesFromStart: sample.minutesFromStart,
      result: sample.sections.find((section) => section.sectionId === sectionId)!,
    }));
    const timeline = series.map((sample) => ({
      minutesFromStart: sample.minutesFromStart,
      coverage: sample.result.averageCoverage,
    }));
    const rowCount = series[0].result.rows.length;
    const rows: RowWindowShade[] = [];
    for (let i = 0; i < rowCount; i++) {
      const rowTimeline = series.map((sample) => ({
        minutesFromStart: sample.minutesFromStart,
        coverage: sample.result.rows[i].coverage,
      }));
      const cov = rowTimeline.map((point) => point.coverage);
      const base = series[0].result.rows[i];
      const avg = Math.round(mean(cov));
      rows.push({
        rowNumber: base.rowNumber,
        seats: base.seats,
        elevation: base.elevation,
        depth: base.depth,
        coverageStart: cov[0],
        coverageEnd: cov[cov.length - 1],
        coverageAvg: avg,
        coverageMin: Math.min(...cov),
        coverageMax: Math.max(...cov),
        timeline: rowTimeline,
        recommendation: recommendForCoverage(avg),
      });
    }
    const byCoverageDesc = [...rows].sort((a, b) => b.coverageAvg - a.coverageAvg);
    return {
      sectionId,
      sectionName: series[0].result.sectionName,
      rows,
      averageCoverage: Math.round(mean(rows.map((row) => row.coverageAvg))),
      startCoverage: timeline[0].coverage,
      endCoverage: timeline[timeline.length - 1].coverage,
      coverageMin: Math.min(...timeline.map((point) => point.coverage)),
      coverageMax: Math.max(...timeline.map((point) => point.coverage)),
      progression: classifyProgression(timeline),
      timeline,
      bestRows: byCoverageDesc.slice(0, 5).map((row) => row.rowNumber),
      worstRows: byCoverageDesc.slice(-5).reverse().map((row) => row.rowNumber),
    };
  });
}

/**
 * Synthetic self-shading bowl for runtime tests only. A west wall stands
 * behind west seats. It is not a survey of any real park.
 */
export function createSelfShadingGrandstandArtifact(
  stadiumId: string,
  sectionIds: { west: string; east: string; covered: string } = {
    west: 'west',
    east: 'east',
    covered: 'covered',
  },
  options?: { includeEast?: boolean; westName?: string; eastName?: string; coveredName?: string },
): MeasuredGeometryArtifact {
  const wall: [MeasuredVec3, MeasuredVec3, MeasuredVec3][] = [
    [{ x: -110, y: -40, z: 0 }, { x: -110, y: 40, z: 0 }, { x: -110, y: 40, z: 50 }],
    [{ x: -110, y: -40, z: 0 }, { x: -110, y: 40, z: 50 }, { x: -110, y: -40, z: 50 }],
  ];
  return stampMeasuredGeometryArtifact({
    schemaVersion: 1,
    kind: 'measured-shade-geometry',
    stadiumId,
    coordinateFrame: {
      eastNorthUp: true,
      originLatitude: 40.8296,
      originLongitude: -73.9262,
      orientationDeg: 55,
    },
    roof: { type: 'open' },
    coverage: {
      stadiumFramePercent: 100,
      rowGeometryPercent: 100,
      obstructionPercent: 100,
    },
    uncertainty: {
      horizontalFt: 1,
      verticalFt: 1,
      orientationDeg: 1,
    },
    rows: [
      {
        sectionId: sectionIds.west,
        sectionName: options?.westName ?? 'West grandstand',
        rowId: '1',
        rowIndexFrontToBack: 1,
        seats: 20,
        covered: false,
        origin: { x: -100, y: 0, z: 10 },
      },
      {
        sectionId: sectionIds.west,
        sectionName: options?.westName ?? 'West grandstand',
        rowId: '2',
        rowIndexFrontToBack: 2,
        seats: 20,
        covered: false,
        origin: { x: -100, y: 5, z: 12 },
      },
      ...(options?.includeEast === false ? [] : [{
        sectionId: sectionIds.east,
        sectionName: options?.eastName ?? 'East grandstand',
        rowId: '1',
        rowIndexFrontToBack: 1,
        seats: 20,
        covered: false,
        origin: { x: 100, y: 0, z: 10 },
      }]),
      {
        sectionId: sectionIds.covered,
        sectionName: options?.coveredName ?? 'Covered upper',
        rowId: '1',
        rowIndexFrontToBack: 1,
        seats: 18,
        covered: true,
        origin: { x: 0, y: -80, z: 40 },
      },
    ],
    obstructions: [
      { id: 'west-wall', kind: 'structure', opacity: 1, triangles: wall },
    ],
  });
}
