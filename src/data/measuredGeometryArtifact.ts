import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { SEAT_SHADE_RELEASE_THRESHOLDS } from './stadiumGeometryEvidence';

/**
 * Versioned, hash-locked stadium geometry used by the measured shade runtime.
 *
 * This is not a seating chart and not BOWL_DEFAULTS. Every published percent
 * must come from these surfaces. An empty registry is correct until a park
 * has reconstructed rows, obstructions, and a matching observation holdout.
 */
export const MEASURED_GEOMETRY_SCHEMA_VERSION = 1 as const;

export interface MeasuredVec3 {
  x: number;
  y: number;
  z: number;
}

export interface MeasuredSeatSample {
  seatId: string;
  /** ENU feet from home plate; x = east, y = north, z = up. */
  origin: MeasuredVec3;
}

export interface MeasuredRow {
  sectionId: string;
  sectionName: string;
  rowId: string;
  /** 1-based front-to-back index in this section. */
  rowIndexFrontToBack: number;
  seats: number;
  /** Structural canopy directly over the row — 100% shade, no ray needed. */
  covered: boolean;
  origin: MeasuredVec3;
  seatSamples?: readonly MeasuredSeatSample[];
}

export interface MeasuredObstruction {
  id: string;
  kind: 'roof' | 'upper_deck' | 'overhang' | 'scoreboard' | 'facade' | 'structure';
  opacity: number;
  /** Triangle soup in the same ENU frame. */
  triangles: readonly [MeasuredVec3, MeasuredVec3, MeasuredVec3][];
}

export interface MeasuredGeometryArtifact {
  schemaVersion: typeof MEASURED_GEOMETRY_SCHEMA_VERSION;
  kind: 'measured-shade-geometry';
  stadiumId: string;
  /**
   * sha256 of the canonical payload with this field omitted. Bind fails if it
   * does not match the evidence registry artifactVersion.
   */
  artifactVersion: string;
  coordinateFrame: {
    eastNorthUp: true;
    originLatitude: number;
    originLongitude: number;
    orientationDeg: number;
  };
  roof: {
    type: 'open' | 'fixed' | 'retractable';
  };
  coverage: {
    stadiumFramePercent: number;
    rowGeometryPercent: number;
    obstructionPercent: number;
  };
  uncertainty: {
    horizontalFt: number;
    verticalFt: number;
    orientationDeg: number;
  };
  rows: readonly MeasuredRow[];
  obstructions: readonly MeasuredObstruction[];
}

/**
 * Parks that have a committed measured-geometry JSON file on disk.
 * Remain empty until a reconstruction meets SEAT_SHADE_RELEASE_THRESHOLDS.
 */
export const MEASURED_GEOMETRY_ARTIFACT_PATHS: Readonly<Record<string, string>> = Object.freeze({});

export function canonicalMeasuredGeometryJson(value: unknown): string {
  return canonicalize(value, new Set(['artifactVersion']));
}

function canonicalize(value: unknown, omitKeys: Set<string>): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalize(item, omitKeys)).join(',')}]`;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).filter((key) => !omitKeys.has(key)).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${canonicalize(record[key], omitKeys)}`).join(',')}}`;
}

export function hashMeasuredGeometryPayload(artifact: Omit<MeasuredGeometryArtifact, 'artifactVersion'> | MeasuredGeometryArtifact): string {
  const digest = createHash('sha256').update(canonicalMeasuredGeometryJson(artifact)).digest('hex');
  return `sha256:${digest}`;
}

export function stampMeasuredGeometryArtifact(
  artifact: Omit<MeasuredGeometryArtifact, 'artifactVersion'>,
): MeasuredGeometryArtifact {
  return {
    ...artifact,
    artifactVersion: hashMeasuredGeometryPayload(artifact),
  };
}

export function validateMeasuredGeometryArtifact(artifact: MeasuredGeometryArtifact): string[] {
  const errors: string[] = [];
  if (artifact.schemaVersion !== MEASURED_GEOMETRY_SCHEMA_VERSION) {
    errors.push(`unsupported schemaVersion ${artifact.schemaVersion}`);
  }
  if (artifact.kind !== 'measured-shade-geometry') {
    errors.push('kind must be measured-shade-geometry');
  }
  if (!artifact.stadiumId.trim()) errors.push('stadiumId is required');
  if (artifact.rows.length === 0) errors.push('artifact has no measured rows');
  if (hashMeasuredGeometryPayload(artifact) !== artifact.artifactVersion) {
    errors.push('artifactVersion does not match the canonical payload hash');
  }

  const thresholds = SEAT_SHADE_RELEASE_THRESHOLDS;
  if (artifact.coverage.stadiumFramePercent < thresholds.measuredCoveragePercent) {
    errors.push('stadium frame coverage is below the release threshold');
  }
  if (artifact.coverage.rowGeometryPercent < thresholds.measuredCoveragePercent) {
    errors.push('row geometry coverage is below the release threshold');
  }
  if (artifact.coverage.obstructionPercent < thresholds.measuredCoveragePercent) {
    errors.push('obstruction coverage is below the release threshold');
  }
  if (artifact.uncertainty.horizontalFt > thresholds.horizontalUncertaintyFt) {
    errors.push('horizontal uncertainty exceeds the release threshold');
  }
  if (artifact.uncertainty.verticalFt > thresholds.verticalUncertaintyFt) {
    errors.push('vertical uncertainty exceeds the release threshold');
  }
  if (artifact.uncertainty.orientationDeg > thresholds.orientationUncertaintyDeg) {
    errors.push('orientation uncertainty exceeds the release threshold');
  }

  const rowKeys = new Set<string>();
  for (const row of artifact.rows) {
    const key = `${row.sectionId}:${row.rowId}`;
    if (rowKeys.has(key)) errors.push(`duplicate row ${key}`);
    rowKeys.add(key);
    if (!Number.isFinite(row.origin.x) || !Number.isFinite(row.origin.y) || !Number.isFinite(row.origin.z)) {
      errors.push(`row ${key} has a non-finite origin`);
    }
    if (row.seats < 1) errors.push(`row ${key} has no seats`);
    for (const seat of row.seatSamples ?? []) {
      if (!Number.isFinite(seat.origin.x) || !Number.isFinite(seat.origin.y) || !Number.isFinite(seat.origin.z)) {
        errors.push(`seat ${seat.seatId} has a non-finite origin`);
      }
    }
  }

  for (const obstruction of artifact.obstructions) {
    if (obstruction.triangles.length === 0) {
      errors.push(`obstruction ${obstruction.id} has no triangles`);
    }
    if (!(obstruction.opacity > 0 && obstruction.opacity <= 1)) {
      errors.push(`obstruction ${obstruction.id} opacity must be in (0, 1]`);
    }
  }

  return errors;
}

export function loadMeasuredGeometryArtifact(stadiumId: string): MeasuredGeometryArtifact | null {
  const path = MEASURED_GEOMETRY_ARTIFACT_PATHS[stadiumId];
  if (!path) return null;
  const parsed = JSON.parse(readFileSync(path, 'utf8')) as MeasuredGeometryArtifact;
  const errors = validateMeasuredGeometryArtifact(parsed);
  if (errors.length > 0) {
    throw new Error(`Measured geometry artifact for ${stadiumId} is invalid: ${errors.join('; ')}`);
  }
  if (parsed.stadiumId !== stadiumId) {
    throw new Error(`Measured geometry artifact stadiumId ${parsed.stadiumId} does not match ${stadiumId}`);
  }
  return parsed;
}
