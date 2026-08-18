#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

const gamePk = Number(option('game'));
const outputDirectoryArgument = option('output');
if (!Number.isInteger(gamePk) || !outputDirectoryArgument) {
  throw new Error(
    'Usage: node scripts/acquireMlbPlayByPlay.mjs --game=GAME_PK --output=DIRECTORY',
  );
}

const sourceUrl = `https://statsapi.mlb.com/api/v1.1/game/${gamePk}/feed/live`;
const response = await fetch(sourceUrl, {
  headers: {
    Accept: 'application/json',
    'User-Agent': 'theshadium-shadow-observation-audit/1.0',
  },
  redirect: 'follow',
});
if (!response.ok) {
  throw new Error(`${sourceUrl} returned HTTP ${response.status}`);
}
const resolved = new URL(response.url);
if (resolved.protocol !== 'https:' || resolved.hostname !== 'statsapi.mlb.com') {
  throw new Error(`Unexpected play-by-play redirect: ${response.url}`);
}
const sourceBytes = Buffer.from(await response.arrayBuffer());
const source = JSON.parse(sourceBytes.toString('utf8'));
if (source?.gamePk !== gamePk || !Array.isArray(source?.liveData?.plays?.allPlays)) {
  throw new Error('MLB play-by-play response has an unexpected structure');
}
const outputDirectory = path.resolve(outputDirectoryArgument);
await mkdir(outputDirectory, { recursive: true });
const feedPath = path.join(outputDirectory, 'official-live-feed.json');
await writeFile(feedPath, sourceBytes);
const plays = source.liveData.plays.allPlays;
const pitchEvents = plays.flatMap((play) => play.playEvents ?? []).filter((event) => event.isPitch);
const manifestWithoutVersion = {
  schemaVersion: 1,
  artifactStage: 'official-mlb-play-by-play-source',
  acquiredOn: new Date().toISOString(),
  gamePk,
  sourceUrl,
  resolvedUrl: response.url,
  feedPath,
  feedSha256: sha256(sourceBytes),
  gameDate: source.gameData?.datetime?.dateTime ?? null,
  venue: source.gameData?.venue?.name ?? null,
  playCount: plays.length,
  pitchEventCount: pitchEvents.length,
  evidencePolicy: {
    eventIdentityEligible: true,
    visualIdentityEligible: false,
    note: 'The feed supplies official play and event identities. A video frame still requires an independently reviewed scoreboard and action match.',
  },
};
const manifest = {
  ...manifestWithoutVersion,
  artifactVersion: `sha256:${sha256(Buffer.from(JSON.stringify(manifestWithoutVersion)))}`,
};
const manifestPath = path.join(outputDirectory, 'play-by-play-manifest.json');
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  manifestPath,
  artifactVersion: manifest.artifactVersion,
  feedPath,
  feedSha256: manifest.feedSha256,
  playCount: manifest.playCount,
  pitchEventCount: manifest.pitchEventCount,
}, null, 2)}\n`);
