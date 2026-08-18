#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const ALLOWED_CONTENT_HOSTNAME = 'statsapi.mlb.com';
const ALLOWED_VIDEO_HOSTNAMES = new Set([
  'mlb-cuts-diamond.mlb.com',
  'bdata-producedclips.mlb.com',
]);

function option(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function sha256Buffer(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function sha256File(filePath) {
  const hash = createHash('sha256');
  await pipeline(createReadStream(filePath), hash);
  return hash.digest('hex');
}

function assertOfficialHttps(value, allowedHostnames) {
  const parsed = new URL(value);
  if (parsed.protocol !== 'https:' || !allowedHostnames.has(parsed.hostname)) {
    throw new Error(`Source is not on an approved official MLB host: ${value}`);
  }
  return parsed;
}

function allObjects(value) {
  const pending = [value];
  const found = [];
  while (pending.length > 0) {
    const current = pending.pop();
    if (!current || typeof current !== 'object') continue;
    found.push(current);
    for (const child of Object.values(current)) {
      if (child && typeof child === 'object') pending.push(child);
    }
  }
  return found;
}

const gamePk = Number(option('game'));
const outputDirectoryArgument = option('output');
const quality = option('quality') ?? 'mp4Avc';
if (!Number.isInteger(gamePk) || !outputDirectoryArgument) {
  throw new Error(
    'Usage: node scripts/acquireMlbCondensedGame.mjs --game=GAME_PK --output=DIRECTORY '
      + '[--quality=mp4Avc|highBit]',
  );
}
if (!new Set(['mp4Avc', 'highBit']).has(quality)) {
  throw new Error('Quality must be mp4Avc or highBit');
}

const outputDirectory = path.resolve(outputDirectoryArgument);
await mkdir(outputDirectory, { recursive: true });
const contentUrl = `https://${ALLOWED_CONTENT_HOSTNAME}/api/v1/game/${gamePk}/content`;
const contentResponse = await fetch(contentUrl, {
  headers: {
    Accept: 'application/json',
    'User-Agent': 'theshadium-shadow-observation-audit/1.0',
  },
  redirect: 'follow',
});
if (!contentResponse.ok) {
  throw new Error(`${contentUrl} returned HTTP ${contentResponse.status}`);
}
const resolvedContentUrl = new URL(contentResponse.url);
if (resolvedContentUrl.protocol !== 'https:' || resolvedContentUrl.hostname !== ALLOWED_CONTENT_HOSTNAME) {
  throw new Error(`Unexpected game-content redirect: ${contentResponse.url}`);
}
const contentBytes = Buffer.from(await contentResponse.arrayBuffer());
const content = JSON.parse(contentBytes.toString('utf8'));
const condensedCandidates = allObjects(content).filter((candidate) =>
  typeof candidate.title === 'string'
  && /^Condensed Game:/i.test(candidate.title)
  && Array.isArray(candidate.playbacks)
);
const condensedByIdentity = new Map();
for (const candidate of condensedCandidates) {
  const identity = JSON.stringify({
    id: candidate.id ?? null,
    slug: candidate.slug ?? null,
    title: candidate.title,
    duration: candidate.duration ?? null,
    playbacks: candidate.playbacks.map((playbackCandidate) => ({
      name: playbackCandidate.name ?? null,
      url: playbackCandidate.url ?? null,
    })),
  });
  condensedByIdentity.set(identity, candidate);
}
const condensed = [...condensedByIdentity.values()];
if (condensed.length !== 1) {
  throw new Error(
    `Expected one distinct condensed game asset, found ${condensed.length} `
      + `from ${condensedCandidates.length} content-tree matches`,
  );
}
const playback = condensed[0].playbacks.find((candidate) => candidate.name === quality);
if (!playback?.url) {
  throw new Error(`Condensed game does not publish a ${quality} playback`);
}
assertOfficialHttps(playback.url, ALLOWED_VIDEO_HOSTNAMES);

const contentPath = path.join(outputDirectory, 'official-game-content.json');
await writeFile(contentPath, contentBytes);
const videoPath = path.join(outputDirectory, `game-${gamePk}-${quality}.mp4`);
let reusedExistingFile = false;
try {
  const existing = await stat(videoPath);
  reusedExistingFile = existing.size > 0;
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}
if (!reusedExistingFile) {
  const temporaryPath = `${videoPath}.partial`;
  await rm(temporaryPath, { force: true });
  const videoResponse = await fetch(playback.url, { redirect: 'follow' });
  if (!videoResponse.ok || !videoResponse.body) {
    throw new Error(`Condensed-game download returned HTTP ${videoResponse.status}`);
  }
  assertOfficialHttps(videoResponse.url, ALLOWED_VIDEO_HOSTNAMES);
  await pipeline(
    Readable.fromWeb(videoResponse.body),
    createWriteStream(temporaryPath, { flags: 'wx' }),
  );
  await rename(temporaryPath, videoPath);
}

const videoStats = await stat(videoPath);
const manifestWithoutVersion = {
  schemaVersion: 1,
  artifactStage: 'official-mlb-condensed-game-corpus',
  generatedOn: new Date().toISOString(),
  gamePk,
  source: {
    contentUrl,
    resolvedContentUrl: contentResponse.url,
    contentPath,
    contentSha256: sha256Buffer(contentBytes),
    title: condensed[0].title,
    description: condensed[0].description ?? null,
    slug: condensed[0].slug ?? condensed[0].id ?? null,
    duration: condensed[0].duration ?? null,
    playbackName: quality,
    playbackUrl: playback.url,
    allowedVideoHostnames: [...ALLOWED_VIDEO_HOSTNAMES].sort(),
  },
  video: {
    path: videoPath,
    byteLength: videoStats.size,
    sha256: await sha256File(videoPath),
    reusedExistingFile,
  },
  evidencePolicy: {
    use: 'local geometry-validation research only',
    redistributionAuthorized: false,
    publicationEligible: false,
    blockers: [
      'CONDENSED_TIMELINE_IS_NOT_THE_ORIGINAL_BROADCAST_TIMELINE',
      'EACH_FRAME_REQUIRES_EXACT_PLAY_BY_PLAY_IDENTITY',
      'SECTION_AND_ROW_REGISTRATION_REQUIRED',
      'SHADOW_BOUNDARY_LABEL_REQUIRED',
    ],
  },
};
const manifest = {
  ...manifestWithoutVersion,
  artifactVersion: `sha256:${sha256Buffer(Buffer.from(JSON.stringify(manifestWithoutVersion)))}`,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  manifestPath,
  artifactVersion: manifest.artifactVersion,
  title: manifest.source.title,
  video: manifest.video,
}, null, 2)}\n`);
