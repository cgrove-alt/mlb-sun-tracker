import type { Stadium } from './stadiums';
import {
  SEAT_SHADE_RELEASE_THRESHOLDS,
  type ShadowObservationHoldout,
} from './stadiumGeometryEvidence';
import { getSunPosition } from '../utils/sunPosition';
import { formatInTimeZone } from 'date-fns-tz';

export interface ShadowBoundaryObservation {
  id: string;
  stadiumId: string;
  /** ISO 8601 instant with an explicit Z or numeric UTC offset. */
  capturedAt: string;
  sourceUrl: string;
  timestampEvidence: {
    sourceUrl: string;
    method: 'embedded-metadata' | 'mlb-play-guid-event-window' | 'venue-camera-clock';
    uncertaintySeconds: number;
  };
  frameProvenance: {
    status: 'confirmed-live' | 'replay' | 'unknown';
    evidenceUrl: string;
  };
  cameraLocation: {
    description: string;
    evidenceUrl: string;
  };
  /** Distinct camera/clip/instant key used to reject duplicated frames. */
  independenceKey: string;
  partition: 'calibration' | 'holdout';
  sectionId: string;
  rowCoordinateSystem: {
    kind: 'front-to-back-ordinal';
    /** Exact source row IDs in physical front-to-back order. */
    rowIdsFrontToBack: readonly string[];
    sectionFractionReference: 'first-to-last-seat-anchor-in-geometry-artifact';
    boundarySemantics: 'row-intersected-or-first-shadeward-row';
  };
  /**
   * One frame may sample a diagonal boundary at several lateral positions.
   * Samples remain one independent observation and never inflate the holdout.
   */
  boundarySamples: readonly {
    /** 0 is the first row anchor and 1 is the last row anchor in the geometry artifact. */
    sectionFraction: number;
    observedBoundaryRowId: string;
    observedBoundaryRow: number;
    observedBoundaryUncertaintyRows: number;
    predictedBoundaryRow: number;
  }[];
  geometryArtifactVersion: string;
  roofState: 'open' | 'closed' | 'not-applicable' | 'unknown';
  visibility: 'clear' | 'usable' | 'obscured';
  notes?: string;
}

const EXPLICIT_TIMEZONE = /(Z|[+-]\d{2}:\d{2})$/;
const HTTPS_URL = /^https:\/\//i;

function quantile(sorted: readonly number[], probability: number): number | null {
  if (sorted.length === 0) return null;
  const index = Math.ceil(probability * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, index))];
}

export function validateShadowObservations(
  stadium: Stadium,
  observations: readonly ShadowBoundaryObservation[],
): void {
  const ids = new Set<string>();
  const independenceKeys = new Set<string>();

  observations.forEach((observation) => {
    if (observation.stadiumId !== stadium.id) {
      throw new Error(`Observation ${observation.id} belongs to ${observation.stadiumId}, not ${stadium.id}`);
    }
    if (!EXPLICIT_TIMEZONE.test(observation.capturedAt) || Number.isNaN(Date.parse(observation.capturedAt))) {
      throw new Error(`Observation ${observation.id} needs an ISO timestamp with an explicit UTC offset`);
    }
    const rowIds = observation.rowCoordinateSystem.rowIdsFrontToBack;
    if (rowIds.length === 0 || new Set(rowIds).size !== rowIds.length || rowIds.some((rowId) => !rowId.trim())) {
      throw new Error(`Observation ${observation.id} needs unique non-empty source row IDs`);
    }
    if (observation.boundarySamples.length === 0) {
      throw new Error(`Observation ${observation.id} needs at least one boundary sample`);
    }
    const sectionFractions = new Set<number>();
    observation.boundarySamples.forEach((sample) => {
      if (!Number.isFinite(sample.sectionFraction) || sample.sectionFraction < 0 || sample.sectionFraction > 1) {
        throw new Error(`Observation ${observation.id} has an invalid boundary section fraction`);
      }
      if (sectionFractions.has(sample.sectionFraction)) {
        throw new Error(`Observation ${observation.id} has duplicate boundary section fractions`);
      }
      sectionFractions.add(sample.sectionFraction);
      if (!Number.isFinite(sample.observedBoundaryRow) || !Number.isFinite(sample.predictedBoundaryRow)) {
        throw new Error(`Observation ${observation.id} has a non-numeric boundary row`);
      }
      if (sample.observedBoundaryRow < 1 || sample.predictedBoundaryRow < 1) {
        throw new Error(`Observation ${observation.id} boundary rows must be positive`);
      }
      const sourceRowIndex = rowIds.indexOf(sample.observedBoundaryRowId);
      if (sourceRowIndex < 0 || sample.observedBoundaryRow !== sourceRowIndex + 1) {
        throw new Error(`Observation ${observation.id} boundary row does not match its source row ID`);
      }
      if (
        !Number.isFinite(sample.observedBoundaryUncertaintyRows) ||
        sample.observedBoundaryUncertaintyRows < 0
      ) {
        throw new Error(`Observation ${observation.id} has invalid boundary-label uncertainty`);
      }
      if (
        observation.partition === 'holdout' &&
        sample.observedBoundaryUncertaintyRows > SEAT_SHADE_RELEASE_THRESHOLDS.maxBoundaryLabelUncertaintyRows
      ) {
        throw new Error(`Observation ${observation.id} boundary-label uncertainty exceeds the holdout threshold`);
      }
    });
    if (!HTTPS_URL.test(observation.sourceUrl)) {
      throw new Error(`Observation ${observation.id} sourceUrl must use HTTPS`);
    }
    if (!HTTPS_URL.test(observation.timestampEvidence.sourceUrl)) {
      throw new Error(`Observation ${observation.id} timestamp evidence must use HTTPS`);
    }
    if (!HTTPS_URL.test(observation.frameProvenance.evidenceUrl)) {
      throw new Error(`Observation ${observation.id} frame-provenance evidence must use HTTPS`);
    }
    if (
      !Number.isFinite(observation.timestampEvidence.uncertaintySeconds) ||
      observation.timestampEvidence.uncertaintySeconds < 0
    ) {
      throw new Error(`Observation ${observation.id} has invalid timestamp uncertainty`);
    }
    if (!observation.cameraLocation.description.trim() || !HTTPS_URL.test(observation.cameraLocation.evidenceUrl)) {
      throw new Error(`Observation ${observation.id} needs HTTPS-backed camera location evidence`);
    }
    if (!observation.geometryArtifactVersion.trim()) {
      throw new Error(`Observation ${observation.id} needs a geometry artifact version`);
    }
    if (
      observation.partition === 'holdout' &&
      observation.frameProvenance.status !== 'confirmed-live'
    ) {
      throw new Error(`Observation ${observation.id} is not a confirmed live frame`);
    }
    if (
      observation.partition === 'holdout' &&
      observation.timestampEvidence.uncertaintySeconds > SEAT_SHADE_RELEASE_THRESHOLDS.maxObservationTimeUncertaintySeconds
    ) {
      throw new Error(`Observation ${observation.id} timestamp uncertainty exceeds the holdout threshold`);
    }
    if (ids.has(observation.id)) throw new Error(`Duplicate observation id: ${observation.id}`);
    ids.add(observation.id);
    if (independenceKeys.has(observation.independenceKey)) {
      throw new Error(`Duplicate observation independence key: ${observation.independenceKey}`);
    }
    independenceKeys.add(observation.independenceKey);
  });
}

/**
 * Compute holdout metrics from raw observations. Obscured frames and calibration
 * observations never count toward release. This prevents a hand-entered
 * `passed` label from bypassing the quantitative gate.
 */
export function summarizeShadowObservationHoldout(
  stadium: Stadium,
  observations: readonly ShadowBoundaryObservation[],
): ShadowObservationHoldout {
  validateShadowObservations(stadium, observations);
  const usable = observations.filter((observation) => observation.visibility !== 'obscured');
  const holdout = usable.filter((observation) => observation.partition === 'holdout');
  const geometryArtifactVersions = new Set(holdout.map((observation) => observation.geometryArtifactVersion));
  if (geometryArtifactVersions.size > 1) {
    throw new Error('Holdout observations reference multiple geometry artifact versions');
  }
  const errors = holdout
    .map((observation) => Math.max(...observation.boundarySamples.map((sample) => (
      Math.abs(sample.predictedBoundaryRow - sample.observedBoundaryRow)
    ))))
    .sort((a, b) => a - b);
  const solarAltitudes = holdout.map((observation) => getSunPosition(
    new Date(observation.capturedAt),
    stadium.latitude,
    stadium.longitude,
  ).altitudeDegrees);
  const solarAltitudeSpanDeg = solarAltitudes.length > 0
    ? Math.max(...solarAltitudes) - Math.min(...solarAltitudes)
    : 0;
  const uniqueDates = new Set(holdout.map((observation) => formatInTimeZone(
    new Date(observation.capturedAt),
    stadium.timezone,
    'yyyy-MM-dd',
  ))).size;
  const medianBoundaryErrorRows = quantile(errors, 0.5);
  const p95BoundaryErrorRows = quantile(errors, 0.95);
  const threshold = SEAT_SHADE_RELEASE_THRESHOLDS;
  const passed = holdout.length >= threshold.heldOutObservationCount
    && uniqueDates >= threshold.uniqueDates
    && solarAltitudeSpanDeg >= threshold.solarAltitudeSpanDeg
    && medianBoundaryErrorRows !== null
    && medianBoundaryErrorRows <= threshold.medianBoundaryErrorRows
    && p95BoundaryErrorRows !== null
    && p95BoundaryErrorRows <= threshold.p95BoundaryErrorRows;

  return {
    stage: holdout.length === 0 ? 'not-started' : passed ? 'passed' : 'collecting',
    observationCount: usable.length,
    heldOutObservationCount: holdout.length,
    uniqueDates,
    solarAltitudeSpanDeg: Math.round(solarAltitudeSpanDeg * 100) / 100,
    medianBoundaryErrorRows,
    p95BoundaryErrorRows,
    geometryArtifactVersion: [...geometryArtifactVersions][0] ?? null,
    sourceUrls: [...new Set(holdout.map((observation) => observation.sourceUrl))].sort(),
  };
}
