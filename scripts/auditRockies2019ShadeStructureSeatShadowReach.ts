#!/usr/bin/env npx tsx

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { getSunPosition } from '../src/utils/sunPosition';

type Point = [number, number];
type JsonObject = Record<string, any>;

const ANALYSIS_VERSION = 'rockies-2019-shade-structure-seat-shadow-reach-v2';
const STADIUM_LATITUDE = 39.7559;
const STADIUM_LONGITUDE = -104.9942;
const SAMPLE_INTERVAL_MINUTES = 5;
const HOURS_AFTER_FIRST_PITCH = 6;
const CONSERVATIVE_HEIGHT_FEET = 100;
const HORIZONTAL_UNCERTAINTY_FEET = 30;
const INDEPENDENT_SENSITIVITY_RESERVE_FEET = 30;
const CLEARANCE_SEARCH_PADDING_FEET = 130;
const SPATIAL_GRID_SIZE_FEET = 50;

function argument(name: string, fallback: string): string {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function sha256(value: Buffer | string): string {
  return createHash('sha256').update(value).digest('hex');
}

function cross(origin: Point, first: Point, second: Point): number {
  return (first[0] - origin[0]) * (second[1] - origin[1])
    - (first[1] - origin[1]) * (second[0] - origin[0]);
}

function convexHull(points: Point[]): Point[] {
  const unique = [...new Map(points.map((point) => [`${point[0]},${point[1]}`, point])).values()]
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (unique.length < 3) return unique;
  const lower: Point[] = [];
  for (const point of unique) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
      lower.pop();
    }
    lower.push(point);
  }
  const upper: Point[] = [];
  for (const point of [...unique].reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
      upper.pop();
    }
    upper.push(point);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

function pointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let current = 0, previous = polygon.length - 1; current < polygon.length; previous = current++) {
    const a = polygon[current];
    const b = polygon[previous];
    const crosses = (a[1] > point[1]) !== (b[1] > point[1])
      && point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0];
    if (crosses) inside = !inside;
  }
  return inside;
}

function pointToSegmentDistance(point: Point, first: Point, second: Point): number {
  const deltaX = second[0] - first[0];
  const deltaY = second[1] - first[1];
  const denominator = deltaX * deltaX + deltaY * deltaY;
  if (denominator === 0) return Math.hypot(point[0] - first[0], point[1] - first[1]);
  const fraction = Math.max(0, Math.min(1,
    ((point[0] - first[0]) * deltaX + (point[1] - first[1]) * deltaY) / denominator));
  return Math.hypot(
    point[0] - (first[0] + fraction * deltaX),
    point[1] - (first[1] + fraction * deltaY),
  );
}

function pointToPolygonDistance(point: Point, polygon: Point[]): number {
  if (pointInPolygon(point, polygon)) return 0;
  let minimum = Number.POSITIVE_INFINITY;
  for (let index = 0; index < polygon.length; index += 1) {
    minimum = Math.min(
      minimum,
      pointToSegmentDistance(point, polygon[index], polygon[(index + 1) % polygon.length]),
    );
  }
  return minimum;
}

function polygonBounds(polygon: Point[], paddingFeet: number): [number, number, number, number] {
  const x = polygon.map((point) => point[0]);
  const y = polygon.map((point) => point[1]);
  return [
    Math.min(...x) - paddingFeet,
    Math.min(...y) - paddingFeet,
    Math.max(...x) + paddingFeet,
    Math.max(...y) + paddingFeet,
  ];
}

function spatialKey(x: number, y: number): string {
  return `${Math.floor(x / SPATIAL_GRID_SIZE_FEET)},${Math.floor(y / SPATIAL_GRID_SIZE_FEET)}`;
}

function shadowCorridor(
  polygon: Point[],
  trueAzimuthDegrees: number,
  altitudeDegrees: number,
  meridianConvergenceDegrees: number,
): { polygon: Point[]; lengthFeet: number; gridShadowBearingDegrees: number } {
  const gridSunAzimuth = trueAzimuthDegrees - meridianConvergenceDegrees;
  const gridShadowBearing = (gridSunAzimuth + 180) % 360;
  const lengthFeet = CONSERVATIVE_HEIGHT_FEET / Math.tan(altitudeDegrees * Math.PI / 180);
  const bearing = gridShadowBearing * Math.PI / 180;
  const translation: Point = [lengthFeet * Math.sin(bearing), lengthFeet * Math.cos(bearing)];
  const translated = polygon.map((point): Point => [point[0] + translation[0], point[1] + translation[1]]);
  return {
    polygon: convexHull(polygon.concat(translated)),
    lengthFeet,
    gridShadowBearingDegrees: gridShadowBearing,
  };
}

async function loadJson(path: string): Promise<{ bytes: Buffer; value: JsonObject }> {
  const bytes = await readFile(resolve(path));
  return { bytes, value: JSON.parse(bytes.toString('utf8')) };
}

async function main(): Promise<void> {
const shadePath = argument('shade-audit', 'tmp/lidar/rockies-2019-shade-structure-change-audit-2026.json');
const rowsPath = argument('rows', 'tmp/lidar/rockies-ticketmaster-drcog-row-registration-candidate-2026.json');
const gamesPath = argument('games', 'tmp/lidar/rockies-2025-official-home-game-index.json');
const fieldControlsPath = argument('field-controls', 'tmp/lidar/rockies-drcog-orthophoto-2022/coors-field-controls.json');
const outputPath = resolve(argument('output', 'tmp/lidar/rockies-2019-shade-structure-seat-shadow-reach-2026.json'));

const shade = await loadJson(shadePath);
const rows = await loadJson(rowsPath);
const games = await loadJson(gamesPath);
const fieldControls = await loadJson(fieldControlsPath);

if (shade.value.artifactKind !== 'rockies-2019-shade-structure-change-audit') {
  throw new Error('Unexpected shade-structure change audit');
}
if (rows.value.artifactKind !== 'ticketmaster-drcog-row-registration-candidate') {
  throw new Error('Unexpected row registration candidate');
}
if (games.value.artifactKind !== 'official-mlb-home-game-index') {
  throw new Error('Unexpected home-game index');
}
if (fieldControls.value.artifactKind !== 'drcog-regulation-field-control-candidate') {
  throw new Error('Unexpected field controls');
}
const meridianConvergenceDegrees = Number(fieldControls.value.controls.meridianConvergenceDegrees);
if (!Number.isFinite(meridianConvergenceDegrees)) throw new Error('Missing meridian convergence');

const seats: Point[] = rows.value.rows.flatMap((row: JsonObject) =>
  row.seats.map((seat: JsonObject): Point => seat.positionProjectedFeet));
if (seats.length !== rows.value.coverage.seatCount) throw new Error('Registered seat count changed');
const seatGrid = new Map<string, Point[]>();
for (const seat of seats) {
  const key = spatialKey(seat[0], seat[1]);
  const values = seatGrid.get(key) ?? [];
  values.push(seat);
  seatGrid.set(key, values);
}
function seatsNearPolygon(polygon: Point[]): Point[] {
  const bounds = polygonBounds(polygon, CLEARANCE_SEARCH_PADDING_FEET);
  const minimumCellX = Math.floor(bounds[0] / SPATIAL_GRID_SIZE_FEET);
  const minimumCellY = Math.floor(bounds[1] / SPATIAL_GRID_SIZE_FEET);
  const maximumCellX = Math.floor(bounds[2] / SPATIAL_GRID_SIZE_FEET);
  const maximumCellY = Math.floor(bounds[3] / SPATIAL_GRID_SIZE_FEET);
  const nearby: Point[] = [];
  for (let x = minimumCellX; x <= maximumCellX; x += 1) {
    for (let y = minimumCellY; y <= maximumCellY; y += 1) {
      nearby.push(...(seatGrid.get(`${x},${y}`) ?? []));
    }
  }
  return nearby;
}
const sourceGames = games.value.games as JsonObject[];
if (!sourceGames.length) throw new Error('Home-game index is empty');

const candidateResults = shade.value.candidates.map((candidate: JsonObject) => {
  const rawPolygon = candidate.currentRoofprint.polygonProjectedFeet as Point[];
  const polygon = rawPolygon.slice(0, -1);
  let minimumSeatClearanceFeet = Number.POSITIVE_INFINITY;
  let maximumPossibleSeatCount = 0;
  let closestSample: JsonObject | null = null;
  let sunAboveHorizonSampleCount = 0;
  let maximumShadowLengthFeet = 0;
  let maximumActualHeightShadowLengthFeet = 0;
  const actualHeightFeet = Number(candidate.currentRoofprint.reportedMaximumHeightFeet);

  for (const game of sourceGames) {
    const firstPitch = new Date(game.gameDate);
    for (
      let offsetMinutes = 0;
      offsetMinutes <= HOURS_AFTER_FIRST_PITCH * 60;
      offsetMinutes += SAMPLE_INTERVAL_MINUTES
    ) {
      const sampledAt = new Date(firstPitch.getTime() + offsetMinutes * 60_000);
      const solar = getSunPosition(sampledAt, STADIUM_LATITUDE, STADIUM_LONGITUDE);
      if (solar.altitudeDegrees <= 0) continue;
      sunAboveHorizonSampleCount += 1;
      const corridor = shadowCorridor(
        polygon,
        solar.azimuthDegrees,
        solar.altitudeDegrees,
        meridianConvergenceDegrees,
      );
      maximumShadowLengthFeet = Math.max(maximumShadowLengthFeet, corridor.lengthFeet);
      maximumActualHeightShadowLengthFeet = Math.max(
        maximumActualHeightShadowLengthFeet,
        corridor.lengthFeet * actualHeightFeet / CONSERVATIVE_HEIGHT_FEET,
      );
      let possibleCount = 0;
      let sampleMinimum = Number.POSITIVE_INFINITY;
      const nearbySeats = seatsNearPolygon(corridor.polygon);
      for (const seat of nearbySeats) {
        const distance = pointToPolygonDistance(seat, corridor.polygon);
        sampleMinimum = Math.min(sampleMinimum, distance);
        if (distance <= HORIZONTAL_UNCERTAINTY_FEET) possibleCount += 1;
      }
      maximumPossibleSeatCount = Math.max(maximumPossibleSeatCount, possibleCount);
      if (sampleMinimum < minimumSeatClearanceFeet) {
        minimumSeatClearanceFeet = sampleMinimum;
        closestSample = {
          gamePk: game.gamePk,
          officialDate: game.officialDate,
          firstPitchUtc: game.gameDate,
          sampledAtUtc: sampledAt.toISOString(),
          minutesAfterFirstPitch: offsetMinutes,
          solarAltitudeDegrees: solar.altitudeDegrees,
          solarAzimuthDegrees: solar.azimuthDegrees,
          gridShadowBearingDegrees: corridor.gridShadowBearingDegrees,
          conservativeShadowLengthFeet: corridor.lengthFeet,
          possibleSeatCountWithinHorizontalEnvelope: possibleCount,
        };
      }
    }
  }
  const minimumPlanSeatClearanceLowerBoundFeet = Number.isFinite(minimumSeatClearanceFeet)
    ? Math.min(minimumSeatClearanceFeet, CLEARANCE_SEARCH_PADDING_FEET)
    : CLEARANCE_SEARCH_PADDING_FEET;
  const minimumRequiredPlanClearanceFeet =
    HORIZONTAL_UNCERTAINTY_FEET + INDEPENDENT_SENSITIVITY_RESERVE_FEET;
  const hasNoRegisteredPlanSeatsWithinPrimaryEnvelope = maximumPossibleSeatCount === 0;
  const passesDoubleEnvelopeSensitivity = hasNoRegisteredPlanSeatsWithinPrimaryEnvelope
    && minimumPlanSeatClearanceLowerBoundFeet >= minimumRequiredPlanClearanceFeet;
  return {
    candidateId: candidate.candidateId,
    permitLocation: candidate.permitLocation,
    roofprintObjectId: candidate.objectId,
    reportedMaximumHeightFeet: actualHeightFeet,
    conservativeTestHeightFeet: CONSERVATIVE_HEIGHT_FEET,
    sunAboveHorizonSampleCount,
    maximumConservativeShadowLengthFeet: maximumShadowLengthFeet,
    maximumActualHeightShadowLengthFeet,
    minimumPlanSeatClearanceFeet:
      Number.isFinite(minimumSeatClearanceFeet) ? minimumSeatClearanceFeet : null,
    minimumPlanSeatClearanceLowerBoundFeet,
    clearanceSearchPaddingFeet: CLEARANCE_SEARCH_PADDING_FEET,
    minimumPlanSeatClearanceIsExactWithinSearchPadding:
      minimumSeatClearanceFeet < CLEARANCE_SEARCH_PADDING_FEET,
    horizontalUncertaintyEnvelopeFeet: HORIZONTAL_UNCERTAINTY_FEET,
    independentSensitivityReserveFeet: INDEPENDENT_SENSITIVITY_RESERVE_FEET,
    minimumRequiredPlanClearanceFeet,
    minimumClearanceBeyondEnvelopeFeet:
      minimumPlanSeatClearanceLowerBoundFeet - HORIZONTAL_UNCERTAINTY_FEET,
    maximumPossibleSeatCountWithinEnvelope: maximumPossibleSeatCount,
    hasNoRegisteredPlanSeatsWithinPrimaryEnvelope,
    passesDoubleEnvelopeSensitivity,
    diagnosticDecision: passesDoubleEnvelopeSensitivity ? 'excluded' : 'inconclusive',
    closestSample,
  };
});

const stable = {
  analysisVersion: ANALYSIS_VERSION,
  stadiumId: 'rockies',
  inputs: {
    shadeStructureChangeAudit: { path: resolve(shadePath), sha256: sha256(shade.bytes), artifactVersion: shade.value.artifactVersion },
    registeredProviderRows: { path: resolve(rowsPath), sha256: sha256(rows.bytes), artifactVersion: rows.value.artifactVersion },
    officialHomeGames: { path: resolve(gamesPath), sha256: sha256(games.bytes), artifactVersion: games.value.artifactVersion },
    fieldControls: { path: resolve(fieldControlsPath), sha256: sha256(fieldControls.bytes), artifactVersion: fieldControls.value.artifactVersion },
  },
  corpus: {
    season: 2025,
    officialHomeGameCount: sourceGames.length,
    registeredPlanSeatCount: seats.length,
    sampleIntervalMinutes: SAMPLE_INTERVAL_MINUTES,
    hoursAfterFirstPitch: HOURS_AFTER_FIRST_PITCH,
    meridianConvergenceDegrees,
  },
  conservativeEnvelope: {
    testedRoofHeightFeet: CONSERVATIVE_HEIGHT_FEET,
    actualReportedMaximumRoofHeightsFeet: candidateResults.map((candidate) => candidate.reportedMaximumHeightFeet),
    horizontalUncertaintyFeet: HORIZONTAL_UNCERTAINTY_FEET,
    independentSensitivityReserveFeet: INDEPENDENT_SENSITIVITY_RESERVE_FEET,
    minimumRequiredPlanClearanceFeet:
      HORIZONTAL_UNCERTAINTY_FEET + INDEPENDENT_SENSITIVITY_RESERVE_FEET,
    clearanceSearchPaddingFeet: CLEARANCE_SEARCH_PADDING_FEET,
    seatElevationAssumption: 'All seats are tested in plan without elevation credit, which can only enlarge the reach of these low exterior roofs toward elevated seating.',
    shadowPrimitive: 'Convex sweep from the roof eave polygon to its horizontal-plane shadow at the tested height.',
  },
  candidates: candidateResults,
  interpretation: {
    allCandidatesHaveNoSeatsWithinPrimaryEnvelope: candidateResults.every(
      (candidate) => candidate.hasNoRegisteredPlanSeatsWithinPrimaryEnvelope,
    ),
    allCandidatesPassDoubleEnvelopeSensitivity: candidateResults.every(
      (candidate) => candidate.passesDoubleEnvelopeSensitivity,
    ),
    excludedCandidateIds: candidateResults
      .filter((candidate) => candidate.diagnosticDecision === 'excluded')
      .map((candidate) => candidate.candidateId),
    inconclusiveCandidateIds: candidateResults
      .filter((candidate) => candidate.diagnosticDecision === 'inconclusive')
      .map((candidate) => candidate.candidateId),
    supportedUse: 'Diagnostic exclusion only for candidates that remain clear after both the primary 30-foot envelope and a second independent 30-foot sensitivity reserve. Inconclusive candidates remain in the obstruction inventory.',
    prohibitedUse: 'This result cannot establish exact row shade because the provider rows and roofprints are not release-grade absolute geometry and row elevations are not measured.',
  },
  publication: {
    eligibleForExactRowShade: false,
    blockers: [
      'REGISTERED_PROVIDER_ROWS_ARE_CANDIDATE_PLAN_GEOMETRY',
      'ROW_ELEVATIONS_NOT_MEASURED',
      'ROOFPRINT_ABSOLUTE_HORIZONTAL_ACCURACY_NOT_BELOW_ONE_FOOT',
      'OVERHANG_UNDERSIDES_NOT_MEASURED',
      'SCHEDULE_CORPUS_IS_NOT_AN_INDEPENDENT_SHADOW_HOLDOUT',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'rockies-shade-structure-seat-shadow-reach-audit',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  ...stable,
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  candidateCount: candidateResults.length,
  allCandidatesPassDoubleEnvelopeSensitivity:
    artifact.interpretation.allCandidatesPassDoubleEnvelopeSensitivity,
  inconclusiveCandidateIds: artifact.interpretation.inconclusiveCandidateIds,
  publicationEligible: artifact.publication.eligibleForExactRowShade,
}, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
