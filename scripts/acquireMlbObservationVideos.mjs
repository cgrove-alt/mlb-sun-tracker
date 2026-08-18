#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const ALLOWED_HOSTNAMES = new Set([
  'mlb-cuts-diamond.mlb.com',
  'bdata-producedclips.mlb.com',
  'sporty-clips.mlb.com',
]);

function usage() {
  throw new Error(
    'Usage: node scripts/acquireMlbObservationVideos.mjs CANDIDATES_JSON OUTPUT_DIRECTORY [--concurrency=N]',
  );
}

function sha256Buffer(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function sha256File(filePath) {
  const hash = createHash('sha256');
  await pipeline(createReadStream(filePath), hash);
  return hash.digest('hex');
}

function safeFileStem(index, candidate) {
  const assetId = candidate.video?.assetId ?? candidate.candidateId;
  const normalized = String(assetId)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
  return `${String(index + 1).padStart(3, '0')}-${normalized}`;
}

async function download(candidate, index, outputDirectory) {
  const url = candidate.video?.assets?.mp4Url;
  if (!url) {
    return {
      candidateId: candidate.candidateId,
      status: 'unavailable',
      unavailableReason: 'OFFICIAL_MLB_MP4_URL_NOT_PUBLISHED',
      sourcePageUrl: candidate.video?.pageUrl ?? null,
    };
  }
  const sourceUrl = new URL(url);
  if (sourceUrl.protocol !== 'https:' || !ALLOWED_HOSTNAMES.has(sourceUrl.hostname)) {
    throw new Error(`Candidate ${candidate.candidateId} has a non-approved MP4 URL`);
  }
  const output = path.join(outputDirectory, `${safeFileStem(index, candidate)}.mp4`);
  const temporary = `${output}.partial`;
  try {
    const existing = await stat(output);
    if (existing.size > 0) {
      return {
        candidateId: candidate.candidateId,
        status: 'acquired',
        sourceUrl: url,
        output,
        byteLength: existing.size,
        sha256: await sha256File(output),
        reusedExistingFile: true,
      };
    }
    await rm(output, { force: true });
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }

  await rm(temporary, { force: true });
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok || !response.body) {
    throw new Error(`Download failed for ${candidate.candidateId}: HTTP ${response.status}`);
  }
  const resolvedUrl = new URL(response.url);
  if (resolvedUrl.protocol !== 'https:' || !ALLOWED_HOSTNAMES.has(resolvedUrl.hostname)) {
    throw new Error(`Unexpected redirect target for ${candidate.candidateId}: ${response.url}`);
  }
  await pipeline(Readable.fromWeb(response.body), createWriteStream(temporary, { flags: 'wx' }));
  await rename(temporary, output);
  const outputStats = await stat(output);
  if (outputStats.size === 0) {
    await rm(output, { force: true });
    return {
      candidateId: candidate.candidateId,
      status: 'unavailable',
      unavailableReason: 'OFFICIAL_MLB_MP4_RESPONSE_WAS_EMPTY',
      sourceUrl: url,
      resolvedUrl: response.url,
    };
  }
  return {
    candidateId: candidate.candidateId,
    status: 'acquired',
    sourceUrl: url,
    resolvedUrl: response.url,
    output,
    byteLength: outputStats.size,
    sha256: await sha256File(output),
    reusedExistingFile: false,
  };
}

const [, , candidatesArgument, outputArgument, ...options] = process.argv;
if (!candidatesArgument || !outputArgument) usage();
const concurrencyOption = options.find((value) => value.startsWith('--concurrency='));
const concurrency = concurrencyOption ? Number(concurrencyOption.slice('--concurrency='.length)) : 4;
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 8) {
  throw new Error('Concurrency must be an integer from 1 through 8');
}

const candidatesPath = path.resolve(candidatesArgument);
const outputDirectory = path.resolve(outputArgument);
const sourceBytes = await readFile(candidatesPath);
const source = JSON.parse(sourceBytes.toString('utf8'));
const candidates = source.candidates;
if (!Array.isArray(candidates) || candidates.length === 0) {
  throw new Error('Candidate artifact contains no candidates');
}
await mkdir(outputDirectory, { recursive: true });

const acquired = new Array(candidates.length);
let nextIndex = 0;
async function worker() {
  while (nextIndex < candidates.length) {
    const index = nextIndex;
    nextIndex += 1;
    acquired[index] = await download(candidates[index], index, outputDirectory);
    if (acquired[index].status === 'unavailable') {
      process.stdout.write(
        `${String(index + 1).padStart(3, '0')}/${candidates.length} unavailable ${acquired[index].unavailableReason}\n`,
      );
    } else {
      process.stdout.write(
        `${String(index + 1).padStart(3, '0')}/${candidates.length} ${acquired[index].reusedExistingFile ? 'verified' : 'downloaded'} ${acquired[index].byteLength} bytes\n`,
      );
    }
  }
}
await Promise.all(Array.from({ length: Math.min(concurrency, candidates.length) }, () => worker()));

const manifestWithoutVersion = {
  schemaVersion: 2,
  artifactStage: 'official-mlb-observation-video-corpus',
  generatedOn: new Date().toISOString(),
  inputs: {
    candidatesPath,
    candidatesSha256: sha256Buffer(sourceBytes),
  },
  sourcePolicy: {
    allowedHostnames: [...ALLOWED_HOSTNAMES].sort(),
    use: 'local geometry-validation research only',
    redistributionAuthorized: false,
  },
  candidateCount: candidates.length,
  acquiredCount: acquired.filter((item) => item.status === 'acquired').length,
  unavailableCount: acquired.filter((item) => item.status === 'unavailable').length,
  totalBytes: acquired.reduce((sum, item) => sum + (item.byteLength ?? 0), 0),
  acquired,
};
const artifactVersion = `sha256:${sha256Buffer(Buffer.from(JSON.stringify(manifestWithoutVersion)))}`;
const manifest = { ...manifestWithoutVersion, artifactVersion };
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  manifestPath,
  artifactVersion,
  candidateCount: candidates.length,
  acquiredCount: manifest.acquiredCount,
  unavailableCount: manifest.unavailableCount,
  totalBytes: manifest.totalBytes,
}, null, 2)}\n`);
