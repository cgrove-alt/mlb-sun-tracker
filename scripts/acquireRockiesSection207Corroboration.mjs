#!/usr/bin/env node

/**
 * Acquire checksum-locked public Section 207 images for local corroboration.
 * These third-party pixels do not establish survey geometry or shadow truth.
 */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function argument(name, fallback) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function acquire(url, headers = {}) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/139 Safari/537.36',
      ...headers,
    },
  });
  if (!response.ok) throw new Error(`${url} failed with HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    bytes,
    finalUrl: response.url,
    response: {
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      lastModified: response.headers.get('last-modified'),
      etag: response.headers.get('etag'),
      cacheControl: response.headers.get('cache-control'),
    },
  };
}

const outputDirectory = path.resolve(argument(
  'output',
  'tmp/lidar/rockies-section-207-public-image-corroboration-2026',
));
await mkdir(outputDirectory, { recursive: true });

const sources = [
  {
    id: 'rateyourseats-section-207',
    publisher: 'RateYourSeats',
    pageUrl: 'https://www.rateyourseats.com/coors-field/seating/sections/207',
    pageFilename: 'rateyourseats-section-207.html',
    pageClaims: {
      sectionId: '207',
      rowRange: ['1', '17'],
      exactImageRow: null,
    },
    images: [
      {
        filename: 'rateyourseats-section-207-general.jpg',
        url: 'https://www.rateyourseats.com/shared/1646189269_66687791.jpg',
        publisherLabel: 'Baseball Seat View From Section 207',
        exactRow: null,
      },
      {
        filename: 'rateyourseats-section-207-row-6.jpg',
        url: 'https://www.rateyourseats.com/shared/Coors-Field-Section-207-Row-6-on-7-23-2017_FL.jpg',
        publisherLabel: 'Baseball Seat View From Section 207, Row 6',
        exactRow: '6',
      },
    ],
  },
  {
    id: 'seatgeek-section-207',
    publisher: 'SeatGeek',
    pageUrl: 'https://seatgeek.com/venues/coors-field/views/section-207',
    pageFilename: 'seatgeek-section-207.html',
    pageClaims: {
      sectionId: '207',
      rowRange: null,
      exactImageRow: null,
    },
    images: [
      {
        filename: 'seatgeek-official-section-207-flat.jpg',
        url: 'https://seatgeekimages.com/seatviews/coors-field-section-207/be906bd2-c04e-40f5-a6b5-e8dd281bc714/flat/1224x579.jpg',
        publisherLabel: 'Official view from Section 207 at Coors Field',
        exactRow: null,
      },
    ],
  },
];

const acquiredSources = [];
for (const source of sources) {
  let pageRecord;
  let finalPageUrl = null;
  try {
    const page = await acquire(source.pageUrl);
    const pagePath = path.join(outputDirectory, source.pageFilename);
    await writeFile(pagePath, page.bytes);
    finalPageUrl = page.finalUrl;
    pageRecord = {
      available: true,
      localPath: pagePath,
      byteLength: page.bytes.length,
      sha256: sha256(page.bytes),
      response: page.response,
    };
  } catch (error) {
    pageRecord = {
      available: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
  const imageRecords = [];
  for (const image of source.images) {
    const acquired = await acquire(image.url, { referer: source.pageUrl });
    if (!String(acquired.response.contentType).startsWith('image/')) {
      throw new Error(`${image.url} did not return an image`);
    }
    const imagePath = path.join(outputDirectory, image.filename);
    await writeFile(imagePath, acquired.bytes);
    imageRecords.push({
      ...image,
      finalUrl: acquired.finalUrl,
      localPath: imagePath,
      byteLength: acquired.bytes.length,
      sha256: sha256(acquired.bytes),
      response: acquired.response,
    });
  }
  acquiredSources.push({
    id: source.id,
    publisher: source.publisher,
    pageUrl: source.pageUrl,
    finalPageUrl,
    pageClaims: source.pageClaims,
    page: pageRecord,
    images: imageRecords,
  });
}

const stable = {
  artifactKind: 'third-party-section-image-corroboration',
  stadiumId: 'rockies',
  sectionId: '207',
  sources: acquiredSources,
  rightsAssessment: {
    publicAccessConfirmed: true,
    redistributionRightsEstablished: false,
    permittedUseInThisArtifact: 'local research corroboration only',
  },
  interpretation: {
    publisherSectionLabelSupported: true,
    exactRowLabelSupportedForRows: ['6'],
    metricGeometrySupported: false,
    currentPhysicalConfigurationSupported: false,
    shadowBoundaryTruthSupported: false,
  },
  publicationEligible: false,
  blockers: [
    'THIRD_PARTY_LABELS_ARE_NOT_SURVEY_CONTROL',
    'IMAGE_CAPTURE_DATES_AND_CAMERA_POSES_ARE_INCOMPLETE',
    'CURRENT_PHYSICAL_CONFIGURATION_NOT_ESTABLISHED',
    'METRIC_GEOMETRY_NOT_ESTABLISHED',
    'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
  ],
};
const artifact = {
  schemaVersion: 1,
  artifactStage: 'section-image-corroboration',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  acquiredOn: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  sourceCount: acquiredSources.length,
  imageCount: acquiredSources.reduce((sum, source) => sum + source.images.length, 0),
  publicationEligible: false,
}, null, 2)}\n`);
