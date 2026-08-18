import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { getSunPosition } from '../src/utils/sunPosition';

function argument(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function sha256(value: Buffer | string): string {
  return createHash('sha256').update(value).digest('hex');
}

function roundedSolarPosition(date: Date, latitude: number, longitude: number) {
  const value = getSunPosition(date, latitude, longitude);
  return {
    altitudeDegrees: Math.round(value.altitudeDegrees * 100_000) / 100_000,
    azimuthDegrees: Math.round(value.azimuthDegrees * 100_000) / 100_000,
  };
}

async function main(): Promise<void> {
  const stadiumId = argument('stadium');
  const inputPath = argument('input');
  const outputPath = argument('output');
  if (!stadiumId || !inputPath || !outputPath) {
    throw new Error('Usage: --stadium=ID --input=CANDIDATES_JSON --output=OUTPUT_JSON');
  }
  const stadium = MLB_STADIUMS.find((candidate) => candidate.id === stadiumId);
  if (!stadium) throw new Error(`Unknown stadium: ${stadiumId}`);
  const inputBytes = await readFile(inputPath);
  const input = JSON.parse(inputBytes.toString('utf8')) as {
    stadiumId: string;
    candidates: Array<{
      candidateId: string;
      event: { startTime: string; midpointTime: string; endTime: string; eventWindowSeconds: number };
      solarPositionAtMidpoint: { altitudeDegrees: number; azimuthDegrees: number };
    }>;
  };
  if (input.stadiumId !== stadium.id) {
    throw new Error(`Candidate stadium ${input.stadiumId} does not match ${stadium.id}`);
  }
  const candidates = input.candidates.map((candidate) => {
    const start = new Date(candidate.event.startTime);
    const midpoint = new Date(candidate.event.midpointTime);
    const end = new Date(candidate.event.endTime);
    if ([start, midpoint, end].some((date) => Number.isNaN(date.getTime()))) {
      throw new Error(`Invalid timestamp in ${candidate.candidateId}`);
    }
    const midpointRecomputed = roundedSolarPosition(
      midpoint,
      stadium.latitude,
      stadium.longitude,
    );
    const midpointDifference = Math.max(
      Math.abs(midpointRecomputed.altitudeDegrees - candidate.solarPositionAtMidpoint.altitudeDegrees),
      Math.abs(midpointRecomputed.azimuthDegrees - candidate.solarPositionAtMidpoint.azimuthDegrees),
    );
    if (midpointDifference > 0.011) {
      throw new Error(`Midpoint solar recomputation differs in ${candidate.candidateId}`);
    }
    return {
      candidateId: candidate.candidateId,
      eventWindowSeconds: candidate.event.eventWindowSeconds,
      startTime: candidate.event.startTime,
      midpointTime: candidate.event.midpointTime,
      endTime: candidate.event.endTime,
      solarPositionAtStart: roundedSolarPosition(start, stadium.latitude, stadium.longitude),
      solarPositionAtMidpoint: midpointRecomputed,
      solarPositionAtEnd: roundedSolarPosition(end, stadium.latitude, stadium.longitude),
      midpointSolarMaximumDifferenceDegrees: midpointDifference,
    };
  });
  const maximumWindowSeconds = Math.max(...candidates.map((candidate) => candidate.eventWindowSeconds));
  const maximumMidpointDifferenceDegrees = Math.max(
    ...candidates.map((candidate) => candidate.midpointSolarMaximumDifferenceDegrees),
  );
  const stable = {
    inputSha256: sha256(inputBytes),
    stadiumId,
    coordinates: { latitude: stadium.latitude, longitude: stadium.longitude },
    candidates,
  };
  const result = {
    schemaVersion: 1,
    analysisVersion: 'suncalc-event-window-endpoints-v1',
    artifactStage: 'official-mlb-observation-solar-time-uncertainty',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    inputs: { candidatePath: inputPath, candidateSha256: stable.inputSha256 },
    stadiumId,
    coordinates: stable.coordinates,
    candidates,
    summary: {
      candidateCount: candidates.length,
      maximumEventWindowSeconds: maximumWindowSeconds,
      candidateCountWithinThirtySecondGate: candidates.filter(
        (candidate) => candidate.eventWindowSeconds <= 30,
      ).length,
      maximumMidpointSolarDifferenceDegrees: maximumMidpointDifferenceDegrees,
    },
    publicationEligible: false,
    blockers: [
      'FRAME_ABSOLUTE_TIME_REMAINS_BOUNDED_BY_EVENT_WINDOW',
      'SOLAR_ENDPOINTS_MUST_BE_PROPAGATED_WITH_GEOMETRY_UNCERTAINTY',
    ],
  };
  await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ outputPath, artifactVersion: result.artifactVersion, summary: result.summary }, null, 2));
}

void main();
