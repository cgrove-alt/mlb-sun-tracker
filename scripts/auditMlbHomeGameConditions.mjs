#!/usr/bin/env node

/** Build a checksum-locked roof/weather index from official MLB game feeds. */

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

function argument(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function required(name) {
  const value = argument(name);
  if (!value) throw new Error(`Required: --${name}`);
  return value;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function fetchGame(game) {
  const sourceUrl = `https://statsapi.mlb.com/api/v1.1/game/${game.gamePk}/feed/live`;
  const response = await fetch(sourceUrl, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'theshadium-home-game-condition-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`${sourceUrl} returned HTTP ${response.status}`);
  const text = await response.text();
  const feed = JSON.parse(text);
  if (feed.gamePk !== game.gamePk) throw new Error(`MLB feed game mismatch for ${game.gamePk}`);
  const condition = feed.gameData?.weather?.condition ?? null;
  return {
    gamePk: game.gamePk,
    officialDate: game.officialDate,
    gameDate: feed.gameData?.datetime?.dateTime ?? game.gameDate,
    dayNight: feed.gameData?.datetime?.dayNight ?? null,
    venueId: feed.gameData?.venue?.id ?? null,
    venueName: feed.gameData?.venue?.name ?? null,
    condition,
    temperatureF: Number.isFinite(Number(feed.gameData?.weather?.temp))
      ? Number(feed.gameData.weather.temp)
      : null,
    wind: feed.gameData?.weather?.wind ?? null,
    roofOpenCandidate: typeof condition === 'string'
      && !/(?:roof\s+closed|^dome$)/i.test(condition.trim()),
    sourceUrl,
    sourceSha256: sha256(text),
  };
}

const inputPath = required('input');
const outputPath = required('output');
const inputText = await readFile(inputPath, 'utf8');
const input = JSON.parse(inputText);
if (input.artifactKind !== 'official-mlb-home-game-index' || !Array.isArray(input.games)) {
  throw new Error('Input is not an official MLB home-game index');
}

const records = new Array(input.games.length);
let cursor = 0;
const workers = Array.from({ length: Math.min(8, input.games.length) }, async () => {
  while (true) {
    const index = cursor;
    cursor += 1;
    if (index >= input.games.length) return;
    records[index] = await fetchGame(input.games[index]);
  }
});
await Promise.all(workers);

const stable = {
  inputArtifactVersion: input.artifactVersion,
  teamId: input.teamId,
  venueId: input.venueId,
  records,
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'official-mlb-home-game-condition-audit',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  generatedOn: new Date().toISOString(),
  inputPath,
  inputSha256: sha256(inputText),
  ...stable,
  summary: {
    games: records.length,
    roofOpenCandidates: records.filter((record) => record.roofOpenCandidate).length,
    explicitRoofClosed: records.filter((record) => /roof\s+closed/i.test(record.condition ?? '')).length,
    explicitDome: records.filter((record) => /^dome$/i.test(record.condition?.trim() ?? '')).length,
  },
  publicationEligible: false,
  note: 'A non-closed weather string is only a roof-open review candidate. Visual frame review must confirm the roof state and direct sunlight.',
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  summary: artifact.summary,
}, null, 2));
