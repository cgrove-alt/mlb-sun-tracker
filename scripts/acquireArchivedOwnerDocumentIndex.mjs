#!/usr/bin/env node

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

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

function archiveQueryUrl(hostname) {
  const query = new URL('https://web.archive.org/cdx/search/cdx');
  query.searchParams.set('url', `${hostname}/*`);
  query.searchParams.set('output', 'json');
  query.searchParams.set('fl', 'urlkey,timestamp,original,mimetype,statuscode,digest,length');
  query.searchParams.append('filter', 'statuscode:200');
  query.searchParams.set('collapse', 'urlkey');
  query.searchParams.set('limit', '50000');
  return query;
}

function extensionFromUrl(value) {
  try {
    return path.extname(new URL(value).pathname).toLowerCase();
  } catch {
    return '';
  }
}

function classify(record) {
  const extension = extensionFromUrl(record.original);
  const documentExtensions = new Set([
    '.pdf', '.doc', '.docx', '.dwg', '.dxf', '.xls', '.xlsx', '.ppt', '.pptx',
    '.tif', '.tiff', '.jpg', '.jpeg', '.png', '.zip',
  ]);
  const documentMimeTypes = new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/tiff',
  ]);
  return {
    ...record,
    extension,
    potentialDocument: documentExtensions.has(extension) || documentMimeTypes.has(record.mimetype),
    archivedRetrievalUrl: `https://web.archive.org/web/${record.timestamp}id_/${record.original}`,
  };
}

async function acquire(hostname) {
  const queryUrl = archiveQueryUrl(hostname);
  const response = await fetch(queryUrl, {
    headers: {
      accept: 'application/json',
      'user-agent': 'mlb-sun-tracker-evidence-research/1.0',
    },
  });
  const responseBytes = Buffer.from(await response.arrayBuffer());
  requireCondition(response.ok, `Archive CDX request failed for ${hostname}: ${response.status}`);
  let rows;
  try {
    rows = JSON.parse(responseBytes.toString('utf8'));
  } catch (error) {
    throw new Error(`Archive CDX response for ${hostname} was not JSON: ${error.message}`);
  }
  requireCondition(Array.isArray(rows) && rows.length >= 1, `Archive CDX response for ${hostname} was empty`);
  const [fields, ...values] = rows;
  requireCondition(Array.isArray(fields), `Archive CDX response for ${hostname} lacks a header row`);
  return {
    hostname,
    queryUrl: queryUrl.toString(),
    responseSha256: sha256(responseBytes),
    recordCount: values.length,
    records: values.map((row) => classify(Object.fromEntries(
      fields.map((field, index) => [field, row[index]]),
    ))),
  };
}

const outputPath = path.resolve(argument(
  'output',
  'tmp/lidar/rockies-dmmlbsd-archive-document-index-2026.json',
));
const hostnames = argument('hostnames', 'dmmlbsd.com,www.dmmlbsd.com')
  .split(',')
  .map((hostname) => hostname.trim())
  .filter(Boolean);
requireCondition(hostnames.length > 0, 'At least one owner-site hostname is required');

const acquisitions = [];
for (const hostname of hostnames) {
  acquisitions.push(await acquire(hostname));
}

const uniqueRecords = new Map();
for (const acquisition of acquisitions) {
  for (const record of acquisition.records) {
    const key = `${record.original}\n${record.digest}`;
    const previous = uniqueRecords.get(key);
    if (!previous || record.timestamp > previous.timestamp) uniqueRecords.set(key, record);
  }
}
const records = [...uniqueRecords.values()].sort((left, right) => (
  left.original.localeCompare(right.original) || left.timestamp.localeCompare(right.timestamp)
));
const potentialDocuments = records.filter((record) => record.potentialDocument);
const filenameMatches = potentialDocuments.filter((record) => (
  /coors|baseball|section|seat|roof|renovat|plan|drawing|exhibit|resolution|architect|populous/i
    .test(record.original)
));
const geometryPlanFilenameMatches = potentialDocuments.filter((record) => (
  /populous|301(?:-|_|%20|\+| )*(?:to|-)*(?:-|_|%20|\+| )*310|(?:coors|stadium|rooftop|roof|section).*(?:drawing|plan|exhibit)|(?:drawing|plan|exhibit).*(?:coors|stadium|rooftop|roof|section)/i
    .test(record.original)
));

const stable = {
  stadiumId: 'rockies',
  publisher: 'Denver Metropolitan Major League Baseball Stadium District',
  archiveProvider: 'Internet Archive Wayback Machine CDX API',
  archiveRole: 'Retrieval index for files originally published on the official owner website',
  acquisitions: acquisitions.map(({ records: ignored, ...acquisition }) => acquisition),
  recordCount: records.length,
  potentialDocumentCount: potentialDocuments.length,
  filenameMatchCount: filenameMatches.length,
  geometryPlanFilenameMatchCount: geometryPlanFilenameMatches.length,
  records,
  filenameMatches,
  geometryPlanFilenameMatches,
  limitations: [
    'The archive index only covers URLs captured by the Internet Archive.',
    'A missing URL does not prove that the owner or architect never created or published the file elsewhere.',
    'Filename matching is a discovery aid and is not evidence of geometry until the underlying document is acquired and reviewed.',
  ],
  publication: {
    eligibleForExactRowShade: false,
    reason: 'This is a document-discovery index, not measured stadium geometry.',
  },
};
const artifact = {
  schemaVersion: 1,
  artifactStage: 'archived-official-owner-document-index',
  analysisVersion: 'archived-owner-document-index-v1',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  createdOn: new Date().toISOString(),
  ...stable,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  recordCount: artifact.recordCount,
  potentialDocumentCount: artifact.potentialDocumentCount,
  filenameMatchCount: artifact.filenameMatchCount,
  geometryPlanFilenameMatchCount: artifact.geometryPlanFilenameMatchCount,
}, null, 2)}\n`);
