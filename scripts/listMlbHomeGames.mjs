#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

function argument(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'theshadium-current-structure-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return await response.json();
}

async function main() {
  const teamId = Number(argument('team'));
  const venueId = Number(argument('venue'));
  const startDate = argument('start-date');
  const endDate = argument('end-date');
  const output = argument('output');
  if (!Number.isInteger(teamId) || !Number.isInteger(venueId) || !startDate || !endDate || !output) {
    throw new Error('Usage: --team=ID --venue=ID --start-date=YYYY-MM-DD --end-date=YYYY-MM-DD --output=FILE');
  }
  const url = new URL('https://statsapi.mlb.com/api/v1/schedule');
  url.searchParams.set('sportId', '1');
  url.searchParams.set('teamId', String(teamId));
  url.searchParams.set('startDate', startDate);
  url.searchParams.set('endDate', endDate);
  url.searchParams.set('hydrate', 'venue,team');
  const response = await fetchJson(url);
  const games = response.dates
    .flatMap((date) => date.games)
    .filter((game) => Number(game.venue?.id) === venueId && Number(game.teams?.home?.team?.id) === teamId)
    .map((game) => ({
      gamePk: game.gamePk,
      officialDate: game.officialDate,
      gameDate: game.gameDate,
      detailedState: game.status?.detailedState ?? null,
      codedGameState: game.status?.codedGameState ?? null,
      opponent: game.teams?.away?.team?.name ?? null,
      venue: game.venue?.name ?? null,
    }))
    .sort((left, right) => left.gameDate.localeCompare(right.gameDate));
  const stable = {
    sourceUrl: url.toString(),
    teamId,
    venueId,
    startDate,
    endDate,
    games,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'official-mlb-home-game-index',
    artifactVersion: `sha256:${createHash('sha256').update(JSON.stringify(stable)).digest('hex')}`,
    generatedOn: new Date().toISOString(),
    ...stable,
    gameCount: games.length,
  };
  await writeFile(output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output, artifactVersion: artifact.artifactVersion, gameCount: games.length, games }, null, 2));
}

await main();
