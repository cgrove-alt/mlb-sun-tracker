import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { MLB_STADIUMS } from '../src/data/stadiums';
import {
  buildMlbObservationCandidates,
  type MlbGameContent,
  type MlbGameFeed,
} from '../src/data/mlbObservationCandidates';

function argumentsFor(name: string): string[] {
  const prefix = `--${name}=`;
  return process.argv.filter((value) => value.startsWith(prefix)).map((value) => value.slice(prefix.length));
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

async function fetchText(url: string, maximumAttempts = 4): Promise<string> {
  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    const response = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'theshadium-shadow-observation-audit/1.0' },
    });
    if (response.ok) return await response.text();
    const retryable = response.status === 429 || response.status >= 500;
    if (!retryable || attempt === maximumAttempts) {
      throw new Error(`${url} returned HTTP ${response.status} after ${attempt} attempt(s)`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * (2 ** (attempt - 1))));
  }
  throw new Error(`${url} exhausted its fetch attempts`);
}

async function main(): Promise<void> {
  const stadiumId = argumentsFor('stadium')[0];
  const gamePks = [...new Set(argumentsFor('game').map(Number))];
  const requestedPlayIds = [...new Set(argumentsFor('play-id'))];
  const output = argumentsFor('output')[0];
  if (!stadiumId || gamePks.length === 0 || gamePks.some((value) => !Number.isInteger(value))) {
    throw new Error('Usage: --stadium=ID --game=GAME_PK [--game=GAME_PK ...] [--play-id=PLAY_ID ...] [--output=FILE]');
  }
  const stadium = MLB_STADIUMS.find((candidate) => candidate.id === stadiumId);
  if (!stadium) throw new Error(`Unknown stadium: ${stadiumId}`);

  const gameSources = await Promise.all(gamePks.map(async (gamePk) => {
    const feedUrl = `https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`;
    const contentUrl = `https://statsapi.mlb.com/api/v1/game/${gamePk}/content`;
    const [feedText, contentText] = await Promise.all([
      fetchText(feedUrl),
      fetchText(contentUrl),
    ]);
    const feed = JSON.parse(feedText) as MlbGameFeed;
    const content = JSON.parse(contentText) as MlbGameContent;
    return {
      gamePk,
      feedUrl,
      feedSha256: sha256(feedText),
      contentUrl,
      contentSha256: sha256(contentText),
      candidates: buildMlbObservationCandidates(stadium, feed, content),
    };
  }));
  const allCandidates = gameSources
    .flatMap((source) => source.candidates)
    .sort((left, right) => left.event.midpointTime.localeCompare(right.event.midpointTime));
  const availablePlayIds = new Set(allCandidates.map((candidate) => candidate.playId));
  const missingPlayIds = requestedPlayIds.filter((playId) => !availablePlayIds.has(playId));
  if (missingPlayIds.length > 0) {
    throw new Error(`Requested play IDs were not found in official highlights: ${missingPlayIds.join(', ')}`);
  }
  const requestedPlayIdSet = new Set(requestedPlayIds);
  const candidates = requestedPlayIds.length > 0
    ? allCandidates.filter((candidate) => requestedPlayIdSet.has(candidate.playId))
    : allCandidates;

  const dates = new Set(candidates.map((candidate) => candidate.event.stadiumLocalDate));
  const altitudes = candidates.map((candidate) => candidate.solarPositionAtMidpoint.altitudeDegrees);
  const candidateIds = new Set(candidates.map((candidate) => candidate.candidateId));
  if (candidateIds.size !== candidates.length) {
    throw new Error('Candidate IDs must be unique even when MLB publishes multiple edits of one play');
  }
  const independenceKeys = new Set(candidates.map((candidate) => candidate.evidence.independenceKey));
  const stable = {
    schemaVersion: 2,
    artifactStage: 'observation-candidates',
    analysisVersion: 'official-mlb-content-observation-candidates-v2',
    stadiumId,
    gamePks,
    requestedPlayIds,
    sources: gameSources.map(({ candidates: _candidates, ...source }) => source),
    candidateCount: candidates.length,
    independentEventCount: independenceKeys.size,
    uniqueDates: dates.size,
    solarAltitudeSpanDeg: altitudes.length > 0
      ? Math.round((Math.max(...altitudes) - Math.min(...altitudes)) * 100) / 100
      : 0,
    reviewQueue: [...candidates]
      .sort((left, right) => right.review.priority.score - left.review.priority.score
        || left.event.midpointTime.localeCompare(right.event.midpointTime))
      .map((candidate) => candidate.candidateId),
    reviewQueueNote: 'Heuristic ordering only: title, solar altitude, and reported weather can prioritize visual review but never establish evidence or publication eligibility.',
    publicationEligible: false,
    note: 'Candidates are source/timestamp joins only. Frame review, camera evidence, section identification, boundary labels, geometry linkage, and holdout partitioning remain mandatory.',
    candidates,
  };
  const result = {
    ...stable,
    generatedOn: new Date().toISOString(),
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  };
  const serialized = `${JSON.stringify(result, null, 2)}\n`;
  if (output) {
    await writeFile(output, serialized, 'utf8');
    console.log(JSON.stringify({ output, candidateCount: candidates.length, uniqueDates: dates.size, solarAltitudeSpanDeg: result.solarAltitudeSpanDeg }, null, 2));
  } else {
    process.stdout.write(serialized);
  }
}

void main();
