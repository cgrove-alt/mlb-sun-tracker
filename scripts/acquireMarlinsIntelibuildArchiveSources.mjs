#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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

async function acquire(source, outputDirectory) {
  const requestedUrl = new URL(source.url);
  if (requestedUrl.protocol !== 'https:' || requestedUrl.hostname !== 'web.archive.org') {
    throw new Error(`Unapproved InteliBuild archive URL: ${source.url}`);
  }
  let response;
  let finalError;
  const retryDelayMilliseconds = [0, 2_000, 5_000, 15_000];
  for (let attempt = 0; attempt < retryDelayMilliseconds.length; attempt += 1) {
    if (retryDelayMilliseconds[attempt] > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMilliseconds[attempt]));
    }
    try {
      response = await fetch(requestedUrl, {
        redirect: 'follow',
        headers: {
          accept: source.mediaType === 'application/json'
            ? 'application/json'
            : 'text/html,*/*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
            + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 '
            + 'mlb-sun-tracker-marlins-intelibuild-archive-audit/1.0',
        },
        signal: AbortSignal.timeout(180_000),
      });
      if (response.ok || ![429, 500, 502, 503, 504].includes(response.status)) break;
      finalError = new Error(`HTTP ${response.status} for ${source.url}`);
    } catch (error) {
      finalError = error;
    }
  }
  if (!response) throw finalError ?? new Error(`No response for ${source.url}`);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${source.url}`);
  const resolvedUrl = new URL(response.url);
  if (resolvedUrl.protocol !== 'https:' || resolvedUrl.hostname !== 'web.archive.org') {
    throw new Error(`Unexpected InteliBuild archive redirect: ${response.url}`);
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
      contentType: response.headers.get('content-type') ?? '',
      contentLength: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
    },
    byteLength: bytes.length,
    sha256: sha256(bytes),
  };
}

const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-intelibuild-archive-sources-2026',
));
await mkdir(outputDirectory, { recursive: true });

const searchedExtensions = ['tbp', 'db1', 'ifc', 'zip', 'dwg', 'dxf', 'dgn', 'pdf'];

const sources = [
  {
    key: 'archived-intelibuild-miami-ballpark-project',
    sourceAuthority: 'InteliBuild via Internet Archive replay',
    relationshipToProject: 'Historical first-party project page from the roof model and drawing participant',
    mediaType: 'text/html',
    fileName: 'intelibuild-miami-ballpark.html',
    url: option(
      'project-url',
      'https://web.archive.org/web/20111114133836id_/http://www.intelibuild.com/en/projects/commercial/miami-ballpark',
    ),
  },
  {
    key: 'archived-intelibuild-north-america-award-news',
    sourceAuthority: 'InteliBuild via Internet Archive replay',
    relationshipToProject: 'Historical first-party announcement of the 2011 North America Tekla award',
    mediaType: 'text/html',
    fileName: 'intelibuild-north-america-award.html',
    url: option(
      'north-america-award-url',
      'https://web.archive.org/web/20111114133831id_/http://www.intelibuild.com/en/news/httpintelibuildcomennewsintelibuild-takes-top-honors-2011-tekla-structures-north-america-bim-awards',
    ),
  },
  {
    key: 'archived-intelibuild-global-award-finalist-news',
    sourceAuthority: 'InteliBuild via Internet Archive replay',
    relationshipToProject: 'Historical first-party announcement linking the Marlins model to the global award page',
    mediaType: 'text/html',
    fileName: 'intelibuild-global-award-finalist.html',
    url: option(
      'global-finalist-url',
      'https://web.archive.org/web/20111225074145id_/http://www.intelibuild.com/en/news/httpwwwintelibuildcomennewsmiami-ballpark-project-among-the-finalists-now-its-your-turn-to-vote',
    ),
  },
  {
    key: 'archived-tekla-global-award-marlins-page',
    sourceAuthority: 'Tekla Corporation via Internet Archive replay',
    relationshipToProject: 'Official 2011 global BIM Awards Marlins roof finalist page',
    mediaType: 'text/html',
    fileName: 'tekla-global-steel-retractable-roof.html',
    url: option(
      'tekla-global-url',
      'https://web.archive.org/web/20111114153049id_/http://www.tekla.com/international/solutions/building-construction/Documents/Tekla-global-BIM-awards-2011/steel-Retractable-Roof.html',
    ),
  },
  ...searchedExtensions.map((extension) => ({
    key: `archived-intelibuild-${extension}-index`,
    sourceAuthority: 'Internet Archive CDX index for InteliBuild',
    relationshipToProject: extension === 'pdf'
      ? 'Public successful InteliBuild captures with Marlins in a .pdf URL'
      : `Public successful InteliBuild captures with .${extension} URL extension`,
    mediaType: 'application/json',
    fileName: `intelibuild-${extension}-cdx.json`,
    url: option(
      `${extension}-cdx-url`,
      extension === 'pdf'
        ? 'https://web.archive.org/cdx/search/cdx?url=www.intelibuild.com/*marlins*.pdf&output=json&filter=statuscode:200&collapse=urlkey&fl=timestamp,original,mimetype,statuscode,digest,length'
        : `https://web.archive.org/cdx/search/cdx?url=www.intelibuild.com/*.${extension}&output=json&filter=statuscode:200&collapse=urlkey&fl=timestamp,original,mimetype,statuscode,digest,length`,
    ),
  })),
  {
    key: 'archived-tekla-global-award-directory-index',
    sourceAuthority: 'Internet Archive CDX index for official Tekla global award directory',
    relationshipToProject: 'Complete unique successful captures under the official global award directory',
    mediaType: 'application/json',
    fileName: 'tekla-global-award-directory-cdx.json',
    url: option(
      'tekla-global-cdx-url',
      'https://web.archive.org/cdx/search/cdx?url=www.tekla.com/international/solutions/building-construction/Documents/Tekla-global-BIM-awards-2011/*&output=json&filter=statuscode:200&collapse=urlkey&fl=timestamp,original,mimetype,statuscode,digest,length',
    ),
  },
  {
    key: 'archived-intelibuild-project-images-www-index',
    sourceAuthority: 'Internet Archive CDX index for InteliBuild',
    relationshipToProject: 'Public successful captures under the historical www project-image directory',
    mediaType: 'application/json',
    fileName: 'intelibuild-project-images-www-cdx.json',
    url: option(
      'project-images-www-cdx-url',
      'https://web.archive.org/cdx/search/cdx?url=www.intelibuild.com/upload/images/projets/*&output=json&filter=statuscode:200&collapse=urlkey&fl=timestamp,original,mimetype,statuscode,digest,length',
    ),
  },
  {
    key: 'archived-intelibuild-project-images-bare-index',
    sourceAuthority: 'Internet Archive CDX index for InteliBuild',
    relationshipToProject: 'Public successful captures under the historical bare-domain project-image directory',
    mediaType: 'application/json',
    fileName: 'intelibuild-project-images-bare-cdx.json',
    url: option(
      'project-images-bare-cdx-url',
      'https://web.archive.org/cdx/search/cdx?url=intelibuild.com/upload/images/projets/*&output=json&filter=statuscode:200&collapse=urlkey&fl=timestamp,original,mimetype,statuscode,digest,length',
    ),
  },
];

const records = [];
for (const source of sources) records.push(await acquire(source, outputDirectory));

const extensionIndexes = {};
for (const extension of searchedExtensions) {
  const index = JSON.parse(await readFile(
    path.join(outputDirectory, `intelibuild-${extension}-cdx.json`),
    'utf8',
  ));
  extensionIndexes[extension] = {
    successfulUniqueUrlCount: Math.max(0, index.length - 1),
    rows: index.slice(1),
  };
}
const globalDirectoryIndex = JSON.parse(await readFile(
  path.join(outputDirectory, 'tekla-global-award-directory-cdx.json'),
  'utf8',
));
const globalDirectoryRows = globalDirectoryIndex.slice(1);
const projectImageDirectoryIndexes = {};
for (const hostname of ['www', 'bare']) {
  const index = JSON.parse(await readFile(
    path.join(outputDirectory, `intelibuild-project-images-${hostname}-cdx.json`),
    'utf8',
  ));
  projectImageDirectoryIndexes[hostname] = {
    successfulUniqueUrlCount: Math.max(0, index.length - 1),
    rows: index.slice(1),
  };
}

const stable = {
  analysisVersion: 'marlins-intelibuild-archive-source-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  sources: records,
  searchedExtensions,
  extensionIndexes,
  projectImageDirectoryIndexes,
  globalAwardDirectoryIndex: {
    successfulUniqueUrlCount: globalDirectoryRows.length,
    nonHtmlUrlCount: globalDirectoryRows.filter((row) => row[2] !== 'text/html').length,
  },
  inputs: Object.fromEntries(records.map((record) => [
    record.key,
    { path: record.localPath, sha256: record.sha256 },
  ])),
  boundary: {
    historicalFirstPartyProjectPagePreserved: true,
    historicalFirstPartyAwardNewsPreserved: true,
    officialGlobalAwardPagePreserved: true,
    publicTbpLocated: extensionIndexes.tbp.successfulUniqueUrlCount > 0,
    publicDb1Located: extensionIndexes.db1.successfulUniqueUrlCount > 0,
    publicIfcLocated: extensionIndexes.ifc.successfulUniqueUrlCount > 0,
    publicZipLocated: extensionIndexes.zip.successfulUniqueUrlCount > 0,
    publicDwgLocated: extensionIndexes.dwg.successfulUniqueUrlCount > 0,
    publicDxfLocated: extensionIndexes.dxf.successfulUniqueUrlCount > 0,
    publicDgnLocated: extensionIndexes.dgn.successfulUniqueUrlCount > 0,
    publicPdfLocated: extensionIndexes.pdf.successfulUniqueUrlCount > 0,
    publicReferencedProjectImageDirectoryCaptureLocated:
      projectImageDirectoryIndexes.www.successfulUniqueUrlCount > 0
      || projectImageDirectoryIndexes.bare.successfulUniqueUrlCount > 0,
    nativeModelLocated: false,
    coordinateReferenceLocated: false,
    constructionAsBuiltStatusEstablished: false,
    currentGeometryEstablished: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'SOURCE_CONTENT_REVIEW_REQUIRED',
      'PUBLIC_NATIVE_MODEL_NOT_LOCATED',
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
  artifactKind: 'marlins-intelibuild-archive-source-acquisition',
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
  extensionIndexes,
  projectImageDirectoryIndexes,
  globalAwardDirectoryIndex: artifact.globalAwardDirectoryIndex,
  boundary: artifact.boundary,
  publication: artifact.publication,
}, null, 2));
