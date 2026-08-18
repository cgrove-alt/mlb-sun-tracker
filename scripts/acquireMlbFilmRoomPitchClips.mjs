#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const GRAPHQL_URL = 'https://fastball-gateway.mlb.com/graphql';
const ALLOWED_GRAPHQL_HOSTNAME = 'fastball-gateway.mlb.com';
const ALLOWED_VIDEO_HOSTNAMES = new Set([
  'fastball-clips.mlb.com',
  'mlb-cuts-diamond.mlb.com',
]);

function option(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

function listOption(name) {
  return (option(name) ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
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

const gamePk = Number(option('game'));
const inning = Number(option('inning'));
const requestedPlayIds = listOption('plays');
const requestedFeedTypes = listOption('feeds').map((value) => value.toUpperCase());
const outputDirectoryArgument = option('output');
if (
  !Number.isInteger(gamePk)
  || !Number.isInteger(inning)
  || inning < 1
  || requestedPlayIds.length === 0
  || requestedFeedTypes.length === 0
  || !outputDirectoryArgument
) {
  throw new Error(
    'Usage: node scripts/acquireMlbFilmRoomPitchClips.mjs '
      + '--game=GAME_PK --inning=INNING --plays=PLAY_ID[,PLAY_ID] '
      + '--feeds=HOME[,AWAY] --output=DIRECTORY',
  );
}
if (new Set(requestedPlayIds).size !== requestedPlayIds.length) {
  throw new Error('Requested play IDs must be unique');
}
if (new Set(requestedFeedTypes).size !== requestedFeedTypes.length) {
  throw new Error('Requested feed types must be unique');
}
for (const feedType of requestedFeedTypes) {
  if (!new Set(['HOME', 'AWAY']).has(feedType)) {
    throw new Error(`Unsupported feed type: ${feedType}`);
  }
}

const graphQlQuery = `
  query Search(
    $query: String!
    $page: Int
    $limit: Int
    $languagePreference: LanguagePreference
    $contentPreference: ContentPreference
    $forgeInstance: ForgeType = MLB
    $queryType: QueryType = STRUCTURED
  ) {
    search(
      query: $query
      page: $page
      limit: $limit
      languagePreference: $languagePreference
      contentPreference: $contentPreference
      forgeInstance: $forgeInstance
      queryType: $queryType
    ) {
      plays {
        mediaPlayback {
          id
          slug
          title
          blurb
          description
          date
          feeds {
            type
            duration
            playbacks {
              name
              url
              mimetype
            }
          }
          playInfo {
            balls
            strikes
            outs
            inning
            inningHalf
            pitchSpeed
            pitchType
            gamePk
            players {
              pitcher { id name }
              batter { id name }
            }
          }
        }
      }
      total
    }
  }
`;
const variables = {
  query: `gamePk = ${gamePk} AND Inning = [${inning}] Order By Timestamp ASC`,
  page: 0,
  limit: 100,
  languagePreference: 'EN',
  contentPreference: 'MIXED',
  forgeInstance: 'MLB',
};
const requestBody = Buffer.from(JSON.stringify({ query: graphQlQuery, variables }));
const response = await fetch(GRAPHQL_URL, {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': 'theshadium-shadow-observation-audit/1.0',
    'apollographql-client-name': 'filmroom-app',
  },
  body: requestBody,
  redirect: 'follow',
});
if (!response.ok) {
  throw new Error(`${GRAPHQL_URL} returned HTTP ${response.status}`);
}
const resolvedGraphQlUrl = new URL(response.url);
if (
  resolvedGraphQlUrl.protocol !== 'https:'
  || resolvedGraphQlUrl.hostname !== ALLOWED_GRAPHQL_HOSTNAME
) {
  throw new Error(`Unexpected Film Room redirect: ${response.url}`);
}
const responseBytes = Buffer.from(await response.arrayBuffer());
const payload = JSON.parse(responseBytes.toString('utf8'));
if (Array.isArray(payload.errors) && payload.errors.length > 0) {
  throw new Error(`Film Room GraphQL errors: ${JSON.stringify(payload.errors)}`);
}
const search = payload?.data?.search;
if (!search || !Array.isArray(search.plays)) {
  throw new Error('Film Room response has an unexpected structure');
}
const allMedia = search.plays.flatMap((play) => play.mediaPlayback ?? []);
const selectedMedia = requestedPlayIds.map((playId) => {
  const matches = allMedia.filter((media) => media.id === playId);
  if (matches.length !== 1) {
    throw new Error(`Expected one Film Room item for ${playId}, found ${matches.length}`);
  }
  const media = matches[0];
  if (media.playInfo?.gamePk !== gamePk || media.playInfo?.inning !== inning) {
    throw new Error(`Film Room metadata mismatch for ${playId}`);
  }
  return media;
});

const outputDirectory = path.resolve(outputDirectoryArgument);
await mkdir(outputDirectory, { recursive: true });
const requestPath = path.join(outputDirectory, 'official-film-room-request.json');
const responsePath = path.join(outputDirectory, 'official-film-room-response.json');
await writeFile(requestPath, `${JSON.stringify({ query: graphQlQuery, variables }, null, 2)}\n`);
await writeFile(responsePath, responseBytes);

const videos = [];
for (const media of selectedMedia) {
  for (const feedType of requestedFeedTypes) {
    const feeds = (media.feeds ?? []).filter((feed) => feed.type === feedType);
    if (feeds.length !== 1) {
      throw new Error(`Expected one ${feedType} feed for ${media.id}, found ${feeds.length}`);
    }
    const playbacks = (feeds[0].playbacks ?? []).filter((candidate) =>
      candidate.name === 'mp4Avc' && candidate.mimetype === 'video/mp4'
    );
    if (playbacks.length !== 1 || !playbacks[0].url) {
      throw new Error(`Expected one mp4Avc playback for ${media.id} ${feedType}`);
    }
    const playback = playbacks[0];
    assertOfficialHttps(playback.url, ALLOWED_VIDEO_HOSTNAMES);
    const videoPath = path.join(
      outputDirectory,
      `${media.id}-${feedType.toLowerCase()}-mp4Avc.mp4`,
    );
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
      const videoResponse = await fetch(playback.url, {
        headers: {
          Accept: '*/*',
          Origin: 'https://www.mlb.com',
          Referer: 'https://www.mlb.com/',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0',
        },
        redirect: 'follow',
      });
      if (!videoResponse.ok || !videoResponse.body) {
        throw new Error(`${playback.url} returned HTTP ${videoResponse.status}`);
      }
      assertOfficialHttps(videoResponse.url, ALLOWED_VIDEO_HOSTNAMES);
      await pipeline(
        Readable.fromWeb(videoResponse.body),
        createWriteStream(temporaryPath, { flags: 'wx' }),
      );
      await rename(temporaryPath, videoPath);
    }
    const videoStats = await stat(videoPath);
    videos.push({
      playId: media.id,
      feedType,
      path: videoPath,
      sourceUrl: playback.url,
      duration: feeds[0].duration ?? null,
      byteLength: videoStats.size,
      sha256: await sha256File(videoPath),
      reusedExistingFile,
    });
  }
}

const liveFeedPathArgument = option('live-feed');
let liveFeed = null;
if (liveFeedPathArgument) {
  const liveFeedPath = path.resolve(liveFeedPathArgument);
  const liveFeedBytes = await readFile(liveFeedPath);
  const source = JSON.parse(liveFeedBytes.toString('utf8'));
  if (source?.gamePk !== gamePk || !Array.isArray(source?.liveData?.plays?.allPlays)) {
    throw new Error('The supplied official live feed has an unexpected structure');
  }
  const pitchEvents = source.liveData.plays.allPlays
    .flatMap((play) => play.playEvents ?? [])
    .filter((event) => event.isPitch && requestedPlayIds.includes(event.playId));
  if (pitchEvents.length !== requestedPlayIds.length) {
    throw new Error(
      `Expected ${requestedPlayIds.length} live-feed pitch identities, found ${pitchEvents.length}`,
    );
  }
  liveFeed = {
    path: liveFeedPath,
    sha256: sha256Buffer(liveFeedBytes),
    pitchEvents: pitchEvents.map((event) => ({
      playId: event.playId,
      startTime: event.startTime ?? null,
      endTime: event.endTime ?? null,
      isPitch: event.isPitch,
      details: event.details ?? null,
      count: event.count ?? null,
    })),
  };
}

const manifestWithoutVersion = {
  schemaVersion: 1,
  artifactStage: 'official-mlb-film-room-pitch-corpus',
  acquiredOn: new Date().toISOString(),
  gamePk,
  inning,
  requestedPlayIds,
  requestedFeedTypes,
  source: {
    graphQlUrl: GRAPHQL_URL,
    resolvedGraphQlUrl: response.url,
    requestPath,
    requestSha256: sha256Buffer(requestBody),
    responsePath,
    responseSha256: sha256Buffer(responseBytes),
    resultCount: search.total,
    allowedVideoHostnames: [...ALLOWED_VIDEO_HOSTNAMES].sort(),
  },
  media: selectedMedia,
  videos,
  liveFeed,
  evidencePolicy: {
    use: 'local geometry and shadow-boundary validation research only',
    redistributionAuthorized: false,
    publicationEligible: false,
    blockers: [
      'SECTION_AND_ROW_REGISTRATION_REQUIRED',
      'SHADOW_BOUNDARY_LABEL_REQUIRED',
      'INDEPENDENT_HOLDOUT_ERROR_GATE_REQUIRED',
    ],
    note: liveFeed
      ? 'Each clip is bound to an official Film Room play ID and the same official live-feed pitch identity.'
      : 'A checksum-locked official live feed is still required for exact event timing.',
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
  videos,
  liveFeed: manifest.liveFeed,
}, null, 2)}\n`);
