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
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]));
  }
  return value;
}

function plainText(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#8211;|&ndash;/gi, '-')
    .replace(/&#8212;|&mdash;/gi, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

const allowedHost = 'houstonsports.org';
const after = option('after', '2024-01-01T00:00:00');
const outputPath = path.resolve(option(
  'output',
  'tmp/lidar/astros-hchsa-official-media-index-2024-2026.json',
));
const endpoint = new URL('https://houstonsports.org/wp-json/wp/v2/media');
const userAgent = 'mlb-sun-tracker-hchsa-public-record-index/1.0';

async function fetchPage(page) {
  const requestUrl = new URL(endpoint);
  requestUrl.searchParams.set('after', after);
  requestUrl.searchParams.set('order', 'asc');
  requestUrl.searchParams.set('orderby', 'date');
  requestUrl.searchParams.set('per_page', '100');
  requestUrl.searchParams.set('page', String(page));
  if (requestUrl.protocol !== 'https:' || requestUrl.hostname !== allowedHost) {
    throw new Error(`Unapproved media-index URL: ${requestUrl}`);
  }
  const response = await fetch(requestUrl, {
    redirect: 'error',
    headers: {
      accept: 'application/json',
      'cache-control': 'no-cache',
      'user-agent': userAgent,
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${requestUrl}`);
  const contentType = response.headers.get('content-type') ?? '';
  if (!/application\/json/i.test(contentType)) {
    throw new Error(`Expected JSON for ${requestUrl}, received ${contentType}`);
  }
  return {
    records: await response.json(),
    total: Number(response.headers.get('x-wp-total')),
    totalPages: Number(response.headers.get('x-wp-totalpages')),
    requestUrl: requestUrl.toString(),
  };
}

const first = await fetchPage(1);
if (!Number.isInteger(first.totalPages) || first.totalPages < 1) {
  throw new Error('Official media index omitted a valid total-page count');
}
const remaining = await Promise.all(
  Array.from({ length: first.totalPages - 1 }, (_, index) => fetchPage(index + 2)),
);
const pages = [first, ...remaining].sort((left, right) => {
  const leftPage = Number(new URL(left.requestUrl).searchParams.get('page'));
  const rightPage = Number(new URL(right.requestUrl).searchParams.get('page'));
  return leftPage - rightPage;
});
if (pages.some((page) => page.total !== first.total || page.totalPages !== first.totalPages)) {
  throw new Error('Official media index totals changed during pagination');
}

const rawRecords = pages.flatMap((page) => page.records);
if (rawRecords.length > first.total) {
  throw new Error(`Received ${rawRecords.length} media records for server total ${first.total}`);
}
const ids = new Set(rawRecords.map((record) => record.id));
if (ids.size !== rawRecords.length) throw new Error('Official media index contains duplicate IDs');

const media = rawRecords.map((record) => ({
  id: Number(record.id),
  date: record.date_gmt ?? record.date ?? null,
  modified: record.modified_gmt ?? record.modified ?? null,
  slug: String(record.slug ?? ''),
  title: plainText(record.title?.rendered),
  description: plainText(record.description?.rendered),
  caption: plainText(record.caption?.rendered),
  altText: plainText(record.alt_text),
  mediaType: String(record.media_type ?? ''),
  mimeType: String(record.mime_type ?? ''),
  sourceUrl: String(record.source_url ?? ''),
  fileName: String(record.filename ?? ''),
  fileSize: Number.isFinite(Number(record.filesize)) ? Number(record.filesize) : null,
  parentPostId: Number.isFinite(Number(record.post)) ? Number(record.post) : null,
}));

for (const record of media) {
  const sourceUrl = new URL(record.sourceUrl);
  if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== allowedHost) {
    throw new Error(`Unapproved media source URL: ${record.sourceUrl}`);
  }
}

const geometryTerms = [
  'astros',
  'ballpark',
  'capital',
  'daikin',
  'drawings',
  'improvements',
  'minute-maid',
  'minute maid',
  'plans',
  'roof',
  'stadium',
];
const governanceTerms = [
  'agenda',
  'board',
  'budget',
  'finance',
  'meeting',
  'minutes',
];

function matchingTerms(record, terms) {
  const haystack = [
    record.slug,
    record.title,
    record.description,
    record.caption,
    record.altText,
    record.fileName,
  ].join(' ').toLowerCase();
  return terms.filter((term) => haystack.includes(term));
}

const candidateRecords = media
  .map((record) => ({
    ...record,
    geometryTerms: matchingTerms(record, geometryTerms),
    governanceTerms: matchingTerms(record, governanceTerms),
  }))
  .filter((record) => (
    record.geometryTerms.length > 0
    || (record.mimeType === 'application/pdf' && record.governanceTerms.length > 0)
  ));

const stable = {
  analysisVersion: 'hchsa-official-media-index-v1',
  stadiumId: 'astros',
  source: {
    authority: 'Harris County-Houston Sports Authority',
    endpoint: endpoint.toString(),
    after,
    pageCount: first.totalPages,
    serverReportedMediaCount: first.total,
    accessibleMediaCount: media.length,
    inaccessibleMediaCount: first.total - media.length,
    pageRecordCounts: pages.map((page) => ({
      page: Number(new URL(page.requestUrl).searchParams.get('page')),
      records: page.records.length,
    })),
    pdfCount: media.filter((record) => record.mimeType === 'application/pdf').length,
  },
  media,
  candidateRecords,
  geometryBoundary: {
    completeOfficialMediaEnumerationSinceAfterDate: media.length === first.total,
    allPubliclyAccessibleRecordsEnumerated: ids.size === media.length,
    establishesDocumentRelevance: false,
    establishesMetricGeometry: false,
    establishesCurrentAsBuiltGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      ...(media.length === first.total ? [] : ['MEDIA_INDEX_SERVER_COUNT_MISMATCH']),
      'CANDIDATE_DOCUMENTS_REQUIRE_CONTENT_REVIEW',
      'CURRENT_METRIC_AS_BUILT_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'hchsa-official-media-index',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  serverReportedMediaCount: first.total,
  accessibleMediaCount: media.length,
  inaccessibleMediaCount: first.total - media.length,
  pdfCount: artifact.source.pdfCount,
  candidateCount: candidateRecords.length,
}, null, 2));
