import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { MLB_STADIUMS } from '../src/data/stadiums';
import {
  parseSavantSportyClipPage,
  selectMlbSavantObservationSeeds,
  type MlbSavantGameFeed,
  type MlbSavantObservationSeed,
} from '../src/data/mlbSavantObservationCandidates';

type ResolvedSavantCandidate = Omit<MlbSavantObservationSeed, 'video'> & {
  video: Omit<MlbSavantObservationSeed['video'], 'assets'> & {
    assets: { mp4Url: string | null };
    sourcePageSha256: string | null;
    sourcePageStatus: 'clip-available' | 'clip-unavailable' | 'source-error';
    sourcePageError: string | null;
  };
};

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
      headers: { Accept: 'text/html,application/json', 'User-Agent': 'theshadium-shadow-observation-audit/1.0' },
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

async function resolveSavantClips(
  seeds: MlbSavantObservationSeed[],
  concurrency: number,
): Promise<ResolvedSavantCandidate[]> {
  const results = new Array(seeds.length) as ResolvedSavantCandidate[];
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, seeds.length) }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= seeds.length) return;
      const seed = seeds[index];
      let html: string;
      try {
        html = await fetchText(seed.video.pageUrl);
      } catch (error) {
        const sourcePageError = error instanceof Error ? error.message : String(error);
        results[index] = {
          ...seed,
          video: {
            ...seed.video,
            assets: { mp4Url: null },
            sourcePageSha256: null,
            sourcePageStatus: 'source-error',
            sourcePageError,
          },
        };
        process.stdout.write(`${String(index + 1).padStart(3, '0')}/${seeds.length} source-error ${seed.playId}\n`);
        continue;
      }
      const mp4Url = parseSavantSportyClipPage(html, seed.playId);
      results[index] = {
        ...seed,
        video: {
          ...seed.video,
          assets: { mp4Url },
          sourcePageSha256: sha256(html),
          sourcePageStatus: mp4Url ? 'clip-available' : 'clip-unavailable',
          sourcePageError: null,
        },
      };
      process.stdout.write(`${String(index + 1).padStart(3, '0')}/${seeds.length} ${mp4Url ? 'available' : 'unavailable'} ${seed.playId}\n`);
    }
  });
  await Promise.all(workers);
  return results;
}

async function main(): Promise<void> {
  const stadiumId = argumentsFor('stadium')[0];
  const gamePks = [...new Set(argumentsFor('game').map(Number))];
  const requestedPlayIds = [...new Set(argumentsFor('play-id'))];
  const output = argumentsFor('output')[0];
  const concurrency = Number(argumentsFor('concurrency')[0] ?? 6);
  if (
    !stadiumId
    || !output
    || gamePks.length === 0
    || gamePks.some((value) => !Number.isInteger(value))
    || !Number.isInteger(concurrency)
    || concurrency < 1
    || concurrency > 8
  ) {
    throw new Error('Usage: --stadium=ID --game=GAME_PK [--game=GAME_PK ...] [--play-id=PLAY_ID ...] --output=FILE [--concurrency=1..8]');
  }
  const stadium = MLB_STADIUMS.find((candidate) => candidate.id === stadiumId);
  if (!stadium) throw new Error(`Unknown stadium: ${stadiumId}`);

  const feedSources = await Promise.all(gamePks.map(async (gamePk) => {
    const url = `https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`;
    const text = await fetchText(url);
    const feed = JSON.parse(text) as MlbSavantGameFeed;
    if (feed.gamePk !== gamePk) throw new Error(`MLB feed game mismatch for ${gamePk}`);
    return { gamePk, url, sha256: sha256(text), feed };
  }));
  const allSeeds = feedSources
    .flatMap(({ feed }) => selectMlbSavantObservationSeeds(stadium, feed))
    .sort((left, right) => left.event.midpointTime.localeCompare(right.event.midpointTime));
  const availablePlayIds = new Set(allSeeds.map((seed) => seed.playId));
  const missingPlayIds = requestedPlayIds.filter((playId) => !availablePlayIds.has(playId));
  if (missingPlayIds.length > 0) {
    throw new Error(`Requested play IDs were not found in the supplied games: ${missingPlayIds.join(', ')}`);
  }
  const requestedPlayIdSet = new Set(requestedPlayIds);
  const seeds = requestedPlayIds.length > 0
    ? allSeeds.filter((seed) => requestedPlayIdSet.has(seed.playId))
    : allSeeds;
  const candidates = await resolveSavantClips(seeds, concurrency);
  const dates = new Set(candidates.map((candidate) => candidate.event.stadiumLocalDate));
  const altitudes = candidates.map((candidate) => candidate.solarPositionAtMidpoint.altitudeDegrees);
  const stable = {
    stadiumId,
    gamePks,
    requestedPlayIds,
    feedSources: feedSources.map(({ feed: _feed, ...source }) => source),
    candidateCount: candidates.length,
    availableClipCount: candidates.filter((candidate) => candidate.video.assets.mp4Url).length,
    unavailableClipCount: candidates.filter((candidate) => !candidate.video.assets.mp4Url).length,
    independentEventCount: new Set(candidates.map((candidate) => candidate.evidence.independenceKey)).size,
    uniqueDates: dates.size,
    solarAltitudeSpanDeg: altitudes.length > 0
      ? Math.round((Math.max(...altitudes) - Math.min(...altitudes)) * 100) / 100
      : 0,
    candidates,
  };
  const artifact = {
    schemaVersion: 1,
    artifactStage: 'official-mlb-savant-observation-candidates',
    generatedOn: new Date().toISOString(),
    ...stable,
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    publicationEligible: false,
    note: 'Each candidate is a timestamp and public official-video join only. Full-resolution frame review, live-frame confirmation, section identification, boundary labels, geometry linkage, and holdout partitioning remain mandatory.',
  };
  await writeFile(output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    output,
    artifactVersion: artifact.artifactVersion,
    candidateCount: artifact.candidateCount,
    availableClipCount: artifact.availableClipCount,
    uniqueDates: artifact.uniqueDates,
    solarAltitudeSpanDeg: artifact.solarAltitudeSpanDeg,
  }, null, 2));
}

void main();
