#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function argument(name) {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : undefined;
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

const videoId = argument('video-id');
const outputArgument = argument('output');
const manifestArgument = argument('manifest');
if (!videoId || !/^\d+$/.test(videoId) || !outputArgument || !manifestArgument) {
  throw new Error('Usage: --video-id=ID --output=FILE --manifest=FILE');
}

const accountId = '6415718365001';
const playerId = 'default';
const officialPageUrl = `https://www.nhl.com/video/${videoId}`;
const configUrl = `https://players.brightcove.net/${accountId}/${playerId}_default/config.json`;
const configResponse = await fetch(configUrl, {
  redirect: 'follow',
  headers: { Accept: 'application/json', 'User-Agent': 'theshadium-current-structure-audit/1.0' },
});
if (!configResponse.ok) throw new Error(`Official NHL player config returned HTTP ${configResponse.status}`);
const config = await configResponse.json();
const policyKey = config?.video_cloud?.policy_key;
if (typeof policyKey !== 'string' || !policyKey) {
  throw new Error('Official NHL player configuration has no public playback policy key');
}

const playbackUrl = `https://edge.api.brightcove.com/playback/v1/accounts/${accountId}/videos/${videoId}`;
const playbackResponse = await fetch(playbackUrl, {
  redirect: 'follow',
  headers: {
    Accept: `application/json;pk=${policyKey}`,
    'User-Agent': 'theshadium-current-structure-audit/1.0',
  },
});
if (!playbackResponse.ok) throw new Error(`Official NHL playback metadata returned HTTP ${playbackResponse.status}`);
const playbackBytes = Buffer.from(await playbackResponse.arrayBuffer());
const playback = JSON.parse(playbackBytes.toString('utf8'));
if (String(playback.id) !== videoId) throw new Error('Official NHL playback metadata returned the wrong video');
const mp4Sources = (playback.sources ?? []).filter((source) => (
  source.container === 'MP4'
  && source.codec === 'H264'
  && typeof source.src === 'string'
  && source.src.startsWith('https://')
));
if (!mp4Sources.length) throw new Error('Official NHL playback metadata has no HTTPS H264 MP4 source');
mp4Sources.sort((first, second) => (
  Number(second.height ?? 0) - Number(first.height ?? 0)
  || Number(second.avg_bitrate ?? 0) - Number(first.avg_bitrate ?? 0)
  || Number(second.size ?? 0) - Number(first.size ?? 0)
));
const selected = mp4Sources[0];
const selectedUrl = new URL(selected.src);
const allowedMediaHost = selectedUrl.hostname.endsWith('.brightcovecdn.com')
  || selectedUrl.hostname.endsWith('.boltdns.net');
if (!allowedMediaHost) throw new Error(`Unexpected official NHL media host: ${selectedUrl.hostname}`);
const mediaResponse = await fetch(selected.src, {
  redirect: 'follow',
  headers: { Accept: 'video/mp4', 'User-Agent': 'theshadium-current-structure-audit/1.0' },
});
if (!mediaResponse.ok) throw new Error(`Official NHL MP4 returned HTTP ${mediaResponse.status}`);
const resolvedMediaUrl = new URL(mediaResponse.url);
const resolvedAllowed = resolvedMediaUrl.hostname.endsWith('.brightcovecdn.com')
  || resolvedMediaUrl.hostname.endsWith('.boltdns.net');
if (!resolvedAllowed) throw new Error(`Unexpected official NHL media redirect: ${mediaResponse.url}`);
const contentType = mediaResponse.headers.get('content-type');
if (!contentType?.toLowerCase().startsWith('video/')) {
  throw new Error(`Official NHL asset is not a video: ${contentType ?? 'missing content type'}`);
}
const mediaBytes = Buffer.from(await mediaResponse.arrayBuffer());
if (selected.size && mediaBytes.length !== Number(selected.size)) {
  throw new Error(`Official NHL MP4 byte length mismatch: ${mediaBytes.length} versus ${selected.size}`);
}

const output = path.resolve(outputArgument);
const manifestPath = path.resolve(manifestArgument);
await mkdir(path.dirname(output), { recursive: true });
await mkdir(path.dirname(manifestPath), { recursive: true });
await writeFile(output, mediaBytes);
const unsignedMediaUrl = `${selectedUrl.origin}${selectedUrl.pathname}`;
const stable = {
  officialPageUrl,
  accountId,
  playerId,
  videoId,
  playbackMetadataUrl: playbackUrl,
  playbackMetadataSha256: sha256(playbackBytes),
  retrievedOn: new Date().toISOString(),
  playbackMetadata: {
    name: playback.name,
    description: playback.description,
    longDescription: playback.long_description,
    referenceId: playback.reference_id,
    publishedAt: playback.published_at,
    createdAt: playback.created_at,
    updatedAt: playback.updated_at,
    contentDate: playback.custom_fields?.content_date,
    tags: playback.tags,
    durationMilliseconds: playback.duration,
  },
  selectedSource: {
    unsignedUrl: unsignedMediaUrl,
    container: selected.container,
    codec: selected.codec,
    width: selected.width,
    height: selected.height,
    averageBitrate: selected.avg_bitrate,
    declaredDurationMilliseconds: selected.duration,
    declaredByteLength: selected.size,
  },
  output,
  byteLength: mediaBytes.length,
  sha256: sha256(mediaBytes),
  responseHeaders: {
    contentType,
    date: mediaResponse.headers.get('date'),
    lastModified: mediaResponse.headers.get('last-modified'),
    etag: mediaResponse.headers.get('etag'),
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'official-nhl-video-acquisition',
  artifactVersion: `sha256:${sha256(Buffer.from(JSON.stringify(stable)))}`,
  ...stable,
};
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  output,
  videoId,
  byteLength: mediaBytes.length,
  sha256: artifact.sha256,
  playbackMetadata: artifact.playbackMetadata,
  selectedSource: artifact.selectedSource,
  artifactVersion: artifact.artifactVersion,
}, null, 2));
