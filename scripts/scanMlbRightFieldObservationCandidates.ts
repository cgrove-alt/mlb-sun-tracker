import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { MLB_STADIUMS } from '../src/data/stadiums';
import {
  selectMlbSavantObservationSeeds,
  type MlbSavantGameFeed,
} from '../src/data/mlbSavantObservationCandidates';

type HomeGame = {
  gamePk: number;
  officialDate: string;
  gameDate: string;
  detailedState: string | null;
  opponent: string | null;
  venue: string | null;
};

function argument(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function required(name: string): string {
  const value = argument(name);
  if (!value) throw new Error(`Required: --${name}`);
  return value;
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

async function fetchText(url: string, maximumAttempts = 4): Promise<string> {
  for (let attempt = 1; attempt <= maximumAttempts; attempt += 1) {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'theshadium-right-field-observation-scan/1.0',
      },
    });
    if (response.ok) return await response.text();
    if ((response.status !== 429 && response.status < 500) || attempt === maximumAttempts) {
      throw new Error(`${url} returned HTTP ${response.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250 * (2 ** (attempt - 1))));
  }
  throw new Error(`${url} exhausted its fetch attempts`);
}

async function main(): Promise<void> {
  const inputPath = required('input');
  const outputPath = required('output');
  const stadiumId = required('stadium');
  const maximumAltitude = Number(argument('maximum-altitude') ?? 45);
  const minimumAltitude = Number(argument('minimum-altitude') ?? 5);
  const concurrency = Number(argument('concurrency') ?? 4);
  if (
    !Number.isFinite(maximumAltitude)
    || !Number.isFinite(minimumAltitude)
    || minimumAltitude >= maximumAltitude
    || !Number.isInteger(concurrency)
    || concurrency < 1
    || concurrency > 8
  ) {
    throw new Error('Invalid altitude or concurrency threshold');
  }
  const stadium = MLB_STADIUMS.find((candidate) => candidate.id === stadiumId);
  if (!stadium) throw new Error(`Unknown stadium: ${stadiumId}`);
  const inputText = await readFile(inputPath, 'utf8');
  const input = JSON.parse(inputText) as {
    artifactKind?: string;
    artifactVersion?: string;
    games?: HomeGame[];
  };
  if (input.artifactKind !== 'official-mlb-home-game-index' || !Array.isArray(input.games)) {
    throw new Error('Input is not an official MLB home-game index');
  }

  const uniqueGames = [...new Map(
    input.games
      .filter((game) => game.detailedState === 'Final')
      .map((game) => [game.gamePk, game]),
  ).values()].sort((left, right) => left.gameDate.localeCompare(right.gameDate));
  const feedRecords = new Array<{
    game: HomeGame;
    sourceUrl: string;
    sourceSha256: string;
    candidates: ReturnType<typeof selectMlbSavantObservationSeeds>;
  }>(uniqueGames.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, uniqueGames.length) }, async () => {
    while (true) {
      const index = cursor;
      cursor += 1;
      if (index >= uniqueGames.length) return;
      const game = uniqueGames[index];
      const sourceUrl = `https://statsapi.mlb.com/api/v1.1/game/${game.gamePk}/feed/live`;
      const sourceText = await fetchText(sourceUrl);
      const feed = JSON.parse(sourceText) as MlbSavantGameFeed;
      if (feed.gamePk !== game.gamePk) throw new Error(`MLB feed mismatch for ${game.gamePk}`);
      const candidates = selectMlbSavantObservationSeeds(stadium, feed).filter((candidate) => {
        const description = candidate.event.resultDescription ?? '';
        const altitude = candidate.solarPositionAtMidpoint.altitudeDegrees;
        return (
          /\b(?:right|right-center) field(?:er)?\b/i.test(description)
          && altitude >= minimumAltitude
          && altitude <= maximumAltitude
        );
      });
      feedRecords[index] = {
        game,
        sourceUrl,
        sourceSha256: sha256(sourceText),
        candidates,
      };
      process.stdout.write(
        `${String(index + 1).padStart(3, '0')}/${uniqueGames.length} `
        + `${game.gamePk} candidates ${candidates.length}\n`,
      );
    }
  });
  await Promise.all(workers);

  const candidates = feedRecords
    .flatMap((record) => record.candidates)
    .sort((left, right) => (
      left.solarPositionAtMidpoint.altitudeDegrees
      - right.solarPositionAtMidpoint.altitudeDegrees
      || left.event.midpointTime.localeCompare(right.event.midpointTime)
    ));
  const stable = {
    input: {
      path: inputPath,
      sha256: sha256(inputText),
      artifactVersion: input.artifactVersion ?? null,
    },
    stadiumId,
    thresholds: {
      minimumSolarAltitudeDegrees: minimumAltitude,
      maximumSolarAltitudeDegrees: maximumAltitude,
      descriptionPattern: '\\b(?:right|right-center) field(?:er)?\\b',
    },
    scannedGames: feedRecords.map((record) => ({
      ...record.game,
      feedSourceUrl: record.sourceUrl,
      feedSourceSha256: record.sourceSha256,
      candidateCount: record.candidates.length,
    })),
    candidates,
  };
  const artifact = {
    schemaVersion: 1,
    analysisVersion: 'official-mlb-right-field-observation-scan-v1',
    artifactStage: 'official-mlb-right-field-observation-discovery',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    ...stable,
    summary: {
      scannedGameCount: feedRecords.length,
      candidateCount: candidates.length,
      uniqueDateCount: new Set(candidates.map((candidate) => candidate.event.stadiumLocalDate)).size,
      minimumCandidateSolarAltitudeDegrees: candidates[0]?.solarPositionAtMidpoint.altitudeDegrees ?? null,
      maximumCandidateSolarAltitudeDegrees: candidates.length > 0
        ? Math.max(...candidates.map((candidate) => candidate.solarPositionAtMidpoint.altitudeDegrees))
        : null,
    },
    publicationEligible: false,
    blockers: [
      'DESCRIPTION_MATCH_IS_NOT_SECTION_IDENTIFICATION',
      'OFFICIAL_VIDEO_AVAILABILITY_NOT_RESOLVED',
      'FULL_RESOLUTION_LIVE_FRAME_REVIEW_REQUIRED',
      'SHADE_BOUNDARY_NOT_LABELED',
    ],
  };
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    output: outputPath,
    artifactVersion: artifact.artifactVersion,
    summary: artifact.summary,
  }, null, 2));
}

void main();
