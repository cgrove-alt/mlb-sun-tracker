#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

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
  'aecom.com',
  'www.canam.com',
  'moss.com',
]);

async function acquire(source, outputDirectory) {
  const requestedUrl = new URL(source.url);
  if (requestedUrl.protocol !== 'https:' || !allowedHosts.has(requestedUrl.hostname)) {
    throw new Error(`Unapproved project-team source URL: ${source.url}`);
  }
  const response = await fetch(requestedUrl, {
    redirect: 'follow',
    headers: {
      accept: 'text/html,*/*',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
        + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 '
        + 'mlb-sun-tracker-marlins-project-team-bim-audit/1.0',
    },
    signal: AbortSignal.timeout(180_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${source.url}`);
  const resolvedUrl = new URL(response.url);
  if (resolvedUrl.protocol !== 'https:' || !allowedHosts.has(resolvedUrl.hostname)) {
    throw new Error(`Unexpected project-team source redirect: ${response.url}`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  const expectedContentType = source.mediaType === 'image/jpeg'
    ? /image\/(?:jpeg|jpg)/i
    : /text\/html/i;
  if (!expectedContentType.test(contentType)) {
    throw new Error(`Expected ${source.mediaType} for ${source.key}, received ${contentType}`);
  }
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

const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-project-team-bim-sources-2026',
));
await mkdir(outputDirectory, { recursive: true });

const sources = [
  {
    key: 'aecom-hunt-loandepot-park-project',
    sourceAuthority: 'AECOM',
    relationshipToProject: 'Construction manager and design-assist team member',
    mediaType: 'text/html',
    fileName: 'aecom-hunt-loandepot-park.html',
    url: option('aecom-url', 'https://aecom.com/projects/loandepot-park/'),
  },
  {
    key: 'canam-marlins-park-project',
    sourceAuthority: 'Canam Group',
    relationshipToProject: 'Retractable-roof builder, detailer, fabricator, and erector',
    mediaType: 'text/html',
    fileName: 'canam-marlins-park.html',
    url: option('canam-url', 'https://www.canam.com/en/project/marlins-park/'),
  },
  {
    key: 'moss-marlins-park-project',
    sourceAuthority: 'Moss Construction',
    relationshipToProject: 'Construction-manager joint-venture team member',
    mediaType: 'text/html',
    fileName: 'moss-marlins-park.html',
    url: option('moss-url', 'https://moss.com/projects/marlins-park/'),
  },
  {
    key: 'canam-marlins-roof-steel-model-view-1',
    sourceAuthority: 'Canam Group',
    relationshipToProject: 'Retractable-roof builder model image',
    mediaType: 'image/jpeg',
    fileName: 'canam-marlins-roof-model-12.jpg',
    url: option(
      'canam-model-12-url',
      'https://www.canam.com/wp-content/uploads/2016/05/Marlins-Park-12.jpg',
    ),
  },
  {
    key: 'canam-marlins-roof-steel-model-view-2',
    sourceAuthority: 'Canam Group',
    relationshipToProject: 'Retractable-roof builder model image',
    mediaType: 'image/jpeg',
    fileName: 'canam-marlins-roof-model-13.jpg',
    url: option(
      'canam-model-13-url',
      'https://www.canam.com/wp-content/uploads/2016/05/Marlins-Park-13.jpg',
    ),
  },
  {
    key: 'canam-marlins-roof-steel-model-view-3',
    sourceAuthority: 'Canam Group',
    relationshipToProject: 'Retractable-roof builder BIM image',
    mediaType: 'image/jpeg',
    fileName: 'canam-marlins-roof-model-14.jpg',
    url: option(
      'canam-model-14-url',
      'https://www.canam.com/wp-content/uploads/2016/05/Marlins-Park-14.jpg',
    ),
  },
];

const records = [];
for (const source of sources) records.push(await acquire(source, outputDirectory));

const stable = {
  analysisVersion: 'marlins-project-team-bim-source-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  sources: records,
  inputs: Object.fromEntries(records.map((record) => [
    record.key,
    { path: record.localPath, sha256: record.sha256 },
  ])),
  boundary: {
    firstPartyProjectTeamSources: true,
    establishesProjectTeamRoles: true,
    establishesCurrentModelPossession: false,
    establishesOwnerDelivery: false,
    establishesPublicAvailability: false,
    establishesConstructionAsBuiltGeometry: false,
    establishesCurrentGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'SOURCE_CONTENT_REVIEW_REQUIRED',
      'MODEL_CUSTODY_AND_DISPOSITION_NOT_ESTABLISHED',
      'OWNER_DELIVERY_NOT_ESTABLISHED',
      'PUBLIC_RELEASE_NOT_ESTABLISHED',
      'CURRENT_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-project-team-bim-source-acquisition',
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
  boundary: artifact.boundary,
  publication: artifact.publication,
}, null, 2));
