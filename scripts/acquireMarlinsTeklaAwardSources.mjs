#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFile as execFileCallback } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFile = promisify(execFileCallback);

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]),
    );
  }
  return value;
}

const allowedHosts = new Set([
  'web.archive.org',
  'www.youtube.com',
  'www.tekla.com',
]);

async function acquireHttpSource(source, outputDirectory) {
  const requestedUrl = new URL(source.url);
  if (requestedUrl.protocol !== 'https:' || !allowedHosts.has(requestedUrl.hostname)) {
    throw new Error(`Unapproved Tekla award source URL: ${source.url}`);
  }
  const response = await fetch(requestedUrl, {
    redirect: 'follow',
    headers: {
      accept: source.mediaType === 'application/json'
        ? 'application/json'
        : 'text/html,*/*',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
        + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 '
        + 'mlb-sun-tracker-marlins-tekla-award-audit/1.0',
    },
    signal: AbortSignal.timeout(180_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${source.url}`);
  const resolvedUrl = new URL(response.url);
  if (resolvedUrl.protocol !== 'https:' || !allowedHosts.has(resolvedUrl.hostname)) {
    throw new Error(`Unexpected Tekla award source redirect: ${response.url}`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  const bytes = Buffer.from(await response.arrayBuffer());
  const outputPath = path.join(outputDirectory, source.fileName);
  await writeFile(outputPath, bytes);
  return {
    key: source.key,
    sourceAuthority: source.sourceAuthority,
    relationshipToProject: source.relationshipToProject,
    mediaType: source.mediaType,
    localPath: path.relative(process.cwd(), outputPath),
    requestedUrl: source.url,
    resolvedUrl: response.url,
    response: {
      status: response.status,
      contentType,
      contentLength: response.headers.get('content-length'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
    },
    byteLength: bytes.length,
    sha256: sha256(bytes),
  };
}

function summarizeVideoMetadata(metadata) {
  return {
    id: metadata.id,
    title: metadata.title,
    description: metadata.description,
    channel: metadata.channel,
    channelId: metadata.channel_id,
    channelUrl: metadata.channel_url,
    uploader: metadata.uploader,
    uploaderId: metadata.uploader_id,
    uploadDate: metadata.upload_date,
    timestamp: metadata.timestamp,
    durationSeconds: metadata.duration,
    availability: metadata.availability,
    webpageUrl: metadata.webpage_url,
    tags: metadata.tags ?? [],
    categories: metadata.categories ?? [],
    availableFormats: (metadata.formats ?? [])
      .filter((format) => format.format_id && format.ext !== 'mhtml')
      .map((format) => ({
        formatId: format.format_id,
        ext: format.ext,
        width: format.width ?? null,
        height: format.height ?? null,
        fps: format.fps ?? null,
        audioCodec: format.acodec ?? null,
        videoCodec: format.vcodec ?? null,
        filesize: format.filesize ?? null,
        protocol: format.protocol ?? null,
      })),
  };
}

async function acquireYouTubeVideo(outputDirectory) {
  const python = option('python', process.env.MLB_YTDLP_PYTHON ?? 'python3');
  const videoUrl = option(
    'video-url',
    'https://www.youtube.com/watch?v=zTkzE1pcr6w',
  );
  const extractorArgs = 'youtube:player_client=android_vr,tv,web';
  const childEnvironment = {
    ...process.env,
    PYTHONPATH: option('pythonpath', process.env.MLB_YTDLP_PYTHONPATH ?? ''),
  };
  const metadataResult = await execFile(
    python,
    ['-m', 'yt_dlp', '-J', '--no-warnings', '--extractor-args', extractorArgs, videoUrl],
    { env: childEnvironment, maxBuffer: 64 * 1024 * 1024 },
  );
  const metadata = JSON.parse(metadataResult.stdout);
  if (metadata.id !== 'zTkzE1pcr6w') {
    throw new Error(`Unexpected Tekla award video ID: ${metadata.id}`);
  }
  const summarizedMetadata = summarizeVideoMetadata(metadata);
  const metadataPath = path.join(outputDirectory, 'youtube-video-metadata.json');
  const metadataBytes = Buffer.from(`${JSON.stringify(summarizedMetadata, null, 2)}\n`);
  await writeFile(metadataPath, metadataBytes);

  const videoPath = path.join(outputDirectory, 'tekla-intelibuild-marlins-roof-720p.mp4');
  await execFile(
    python,
    [
      '-m',
      'yt_dlp',
      '--no-warnings',
      '--force-overwrites',
      '--extractor-args',
      extractorArgs,
      '-f',
      '136',
      '-o',
      videoPath,
      videoUrl,
    ],
    { env: childEnvironment, maxBuffer: 64 * 1024 * 1024 },
  );
  const videoBytes = await readFile(videoPath);
  const audioPath = path.join(outputDirectory, 'tekla-intelibuild-marlins-roof-audio.m4a');
  await execFile(
    python,
    [
      '-m',
      'yt_dlp',
      '--no-warnings',
      '--force-overwrites',
      '--extractor-args',
      extractorArgs,
      '-f',
      '140',
      '-o',
      audioPath,
      videoUrl,
    ],
    { env: childEnvironment, maxBuffer: 64 * 1024 * 1024 },
  );
  const audioBytes = await readFile(audioPath);
  return {
    metadata: {
      localPath: path.relative(process.cwd(), metadataPath),
      byteLength: metadataBytes.length,
      sha256: sha256(metadataBytes),
      summary: summarizedMetadata,
    },
    video: {
      sourceAuthority: 'Tekla Software YouTube channel',
      relationshipToProject: 'Video embedded by the archived official 2011 Tekla award page',
      requestedUrl: videoUrl,
      formatId: '136',
      mediaType: 'video/mp4',
      width: 1280,
      height: 720,
      hasAudio: false,
      localPath: path.relative(process.cwd(), videoPath),
      byteLength: videoBytes.length,
      sha256: sha256(videoBytes),
    },
    audio: {
      sourceAuthority: 'Tekla Software YouTube channel',
      relationshipToProject: 'Audio track associated with the video embedded by the archived official award page',
      requestedUrl: videoUrl,
      formatId: '140',
      mediaType: 'audio/mp4',
      localPath: path.relative(process.cwd(), audioPath),
      byteLength: audioBytes.length,
      sha256: sha256(audioBytes),
    },
  };
}

const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-tekla-award-sources-2026',
));
await mkdir(outputDirectory, { recursive: true });

const sources = [
  {
    key: 'archived-tekla-marlins-award-page',
    sourceAuthority: 'Tekla Corporation via Internet Archive replay',
    relationshipToProject: 'Official 2011 BIM Awards Marlins roof submission page',
    mediaType: 'text/html',
    fileName: 'tekla-steelproject4.html',
    url: option(
      'project-page-url',
      'https://web.archive.org/web/20110722095741id_/http://www.tekla.com/us/Documents/BIM-awards-2011/steelproject4.html',
    ),
  },
  {
    key: 'archived-tekla-steel-category-page',
    sourceAuthority: 'Tekla Corporation via Internet Archive replay',
    relationshipToProject: 'Official 2011 BIM Awards steel category index',
    mediaType: 'text/html',
    fileName: 'tekla-steelcategory.html',
    url: option(
      'category-page-url',
      'https://web.archive.org/web/20110722090408id_/http://www.tekla.com/us/Documents/BIM-awards-2011/steelcategory.html',
    ),
  },
  {
    key: 'archived-tekla-award-rules-page',
    sourceAuthority: 'Tekla Corporation via Internet Archive replay',
    relationshipToProject: 'Official 2011 BIM Awards rules page',
    mediaType: 'text/html',
    fileName: 'tekla-rules.html',
    url: option(
      'rules-page-url',
      'https://web.archive.org/web/20110723184137id_/http://www.tekla.com/us/Documents/BIM-awards-2011/rules.html',
    ),
  },
  {
    key: 'archived-tekla-award-winners-page',
    sourceAuthority: 'Tekla Corporation via Internet Archive replay',
    relationshipToProject: 'Official 2011 BIM Awards winners page naming the Marlins roof steel winner',
    mediaType: 'text/html',
    fileName: 'tekla-winners.html',
    url: option(
      'winners-page-url',
      'https://web.archive.org/web/20110910173750id_/http://www.tekla.com/us/Documents/BIM-awards-2011/winners.html',
    ),
  },
  {
    key: 'archived-tekla-award-directory-index',
    sourceAuthority: 'Internet Archive CDX index for official Tekla directory',
    relationshipToProject: 'Complete unique successful captures under the official award directory',
    mediaType: 'application/json',
    fileName: 'tekla-directory-cdx.json',
    url: option(
      'cdx-url',
      'https://web.archive.org/cdx/search/cdx?url=www.tekla.com/us/Documents/BIM-awards-2011/*&output=json&filter=statuscode:200&collapse=urlkey&fl=timestamp,original,mimetype,statuscode,digest,length',
    ),
  },
  {
    key: 'youtube-oembed-metadata',
    sourceAuthority: 'YouTube',
    relationshipToProject: 'Public metadata for the video embedded by the official award page',
    mediaType: 'application/json',
    fileName: 'youtube-oembed.json',
    url: option(
      'oembed-url',
      'https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=zTkzE1pcr6w&format=json',
    ),
  },
  {
    key: 'current-tekla-award-submission-page',
    sourceAuthority: 'Trimble Tekla',
    relationshipToProject: 'Current first-party award submission process and North America marketing contact route',
    mediaType: 'text/html',
    fileName: 'tekla-current-award-submission.html',
    url: option(
      'current-submission-page-url',
      'https://www.tekla.com/us/bim-awards/submit-your-project',
    ),
  },
];

const records = [];
for (const source of sources) records.push(await acquireHttpSource(source, outputDirectory));
const youtube = await acquireYouTubeVideo(outputDirectory);

const directoryIndex = JSON.parse(await readFile(
  path.join(outputDirectory, 'tekla-directory-cdx.json'),
  'utf8',
));
const directoryRows = directoryIndex.slice(1);
const nonHtmlDirectoryRows = directoryRows.filter((row) => row[2] !== 'text/html');

const stable = {
  analysisVersion: 'marlins-tekla-award-source-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  sources: records,
  youtube,
  archiveDirectoryIndex: {
    successfulUniqueUrlCount: directoryRows.length,
    nonHtmlUrlCount: nonHtmlDirectoryRows.length,
    nonHtmlRows: nonHtmlDirectoryRows,
  },
  inputs: {
    ...Object.fromEntries(records.map((record) => [
      record.key,
      { path: record.localPath, sha256: record.sha256 },
    ])),
    youtubeMetadata: {
      path: youtube.metadata.localPath,
      sha256: youtube.metadata.sha256,
    },
    youtubeVideo: {
      path: youtube.video.localPath,
      sha256: youtube.video.sha256,
    },
    youtubeAudio: {
      path: youtube.audio.localPath,
      sha256: youtube.audio.sha256,
    },
  },
  boundary: {
    officialHistoricalAwardPagePreserved: true,
    officialHistoricalBimAnimationPreserved: true,
    submitterIdentified: true,
    nativeModelFileLocated: false,
    modelCoordinateReferenceLocated: false,
    constructionAsBuiltStatusEstablished: false,
    currentGeometryEstablished: false,
    measuredRowGeometryEstablished: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'VIDEO_AND_PAGE_CONTENT_REVIEW_REQUIRED',
      'NATIVE_MODEL_FILE_NOT_LOCATED',
      'MODEL_COORDINATE_REFERENCE_NOT_LOCATED',
      'CONSTRUCTION_AS_BUILT_STATUS_NOT_ESTABLISHED',
      'CURRENT_GEOMETRY_NOT_ESTABLISHED',
      'MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-tekla-award-source-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  sources: records.map((record) => ({
    key: record.key,
    byteLength: record.byteLength,
    sha256: record.sha256,
    resolvedUrl: record.resolvedUrl,
  })),
  youtube: {
    id: youtube.metadata.summary.id,
    title: youtube.metadata.summary.title,
    uploadDate: youtube.metadata.summary.uploadDate,
    durationSeconds: youtube.metadata.summary.durationSeconds,
    video: youtube.video,
    audio: youtube.audio,
  },
  archiveDirectoryIndex: stable.archiveDirectoryIndex,
  boundary: artifact.boundary,
  publication: artifact.publication,
}, null, 2));
