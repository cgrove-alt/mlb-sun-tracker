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

function normalizeMetadata(result) {
  return Object.fromEntries((result.metadata ?? []).map((record) => [
    record.name,
    record.values ?? [],
  ]));
}

function unique(values) {
  return [...new Set(values)].sort();
}

function assertApprovedUrl(value) {
  const url = new URL(value);
  const approvedPaths = new Set([
    '/WebLink/SearchService.aspx/GetSearchListing',
    '/WebLink/DocumentService.aspx/GetBasicDocumentInfo',
  ]);
  if (
    url.protocol !== 'https:'
    || url.hostname !== 'documents.miamigov.com'
    || !approvedPaths.has(url.pathname)
  ) {
    throw new Error(`Unapproved City WebLink URL: ${value}`);
  }
}

const endpointBase = option('endpoint-base', 'https://documents.miamigov.com/WebLink/');
const endpointBaseUrl = new URL(endpointBase);
if (
  endpointBaseUrl.protocol !== 'https:'
  || endpointBaseUrl.hostname !== 'documents.miamigov.com'
  || endpointBaseUrl.pathname !== '/WebLink/'
) {
  throw new Error(`Unapproved City WebLink base URL: ${endpointBase}`);
}

const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-city-weblink-bureau-veritas-2010',
));
await mkdir(outputDirectory, { recursive: true });

const repositoryName = 'Administration';
const fileId = '10-00847';
const expectedResolution = 'R-10-0335';
const expectedDescription = 'Stadium Site- Bureau Veritas North America';
const searchSyntax = `{LF:Basic ~= "${fileId}", option="DFNLT"}`;
const pageSize = 20;

const cookieJar = new Map();
function cookieHeader() {
  return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
}

function captureCookies(response) {
  const allowedCookieNames = new Set(['AcceptsCookies', 'MachineTag', 'WebLinkSession']);
  for (const header of response.headers.getSetCookie()) {
    const match = /^([^=;]+)=([^;]*)/.exec(header);
    if (match && allowedCookieNames.has(match[1])) cookieJar.set(match[1], match[2]);
  }
}

async function cityFetch(url, init = {}) {
  assertApprovedUrl(url);
  const headers = new Headers(init.headers ?? {});
  headers.set('accept-language', 'en-US,en;q=0.9');
  headers.set('cache-control', 'no-cache');
  headers.set('user-agent', 'mlb-sun-tracker-marlins-city-weblink-audit/1.0');
  const cookies = cookieHeader();
  if (cookies) headers.set('cookie', cookies);
  const response = await fetch(url, {
    ...init,
    headers,
    redirect: 'error',
    signal: AbortSignal.timeout(180_000),
  });
  captureCookies(response);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response;
}

async function postJson(endpoint, payload) {
  const url = new URL(endpoint, endpointBaseUrl).href;
  const response = await cityFetch(url, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'x-lf-suppress-login-redirect': '1',
    },
    body: JSON.stringify(payload),
  });
  const text = await response.text();
  const wrapper = JSON.parse(text);
  if (wrapper.error) throw new Error(`City WebLink error: ${JSON.stringify(wrapper.error)}`);
  return { data: wrapper.data, bytes: Buffer.from(text, 'utf8') };
}

const searchPages = [];
let searchUuid = null;
let hitCount = null;
for (let startIdx = 0; hitCount === null || startIdx < hitCount; startIdx += pageSize) {
  const result = await postJson('SearchService.aspx/GetSearchListing', {
    repoName: repositoryName,
    searchSyn: searchSyntax,
    searchUuid,
    sortColumn: '',
    startIdx,
    endIdx: startIdx + pageSize,
    getNewListing: startIdx === 0,
    sortOrder: 2,
    displayInGridView: false,
  });
  if (result.data.failed) {
    throw new Error(`City WebLink search failed: ${result.data.errMsg ?? 'unknown error'}`);
  }
  if (!Array.isArray(result.data.results)) throw new Error('City search omitted results');
  hitCount ??= result.data.hitCount;
  searchUuid ??= result.data.searchUUID;
  if (result.data.hitCount !== hitCount) throw new Error('City search hit count changed mid-query');
  if (result.data.searchUUID !== searchUuid) throw new Error('City search UUID changed mid-query');
  const fileName = `search-page-${String(searchPages.length + 1).padStart(3, '0')}.json`;
  const filePath = path.join(outputDirectory, fileName);
  await writeFile(filePath, result.bytes);
  searchPages.push({
    path: path.relative(process.cwd(), filePath),
    sha256: sha256(result.bytes),
    startIdx,
    endIdx: startIdx + result.data.results.length,
    results: result.data.results,
  });
  if (result.data.results.length === 0 && startIdx < hitCount) {
    throw new Error('City search pagination made no progress');
  }
}

const allResults = searchPages.flatMap((page) => page.results);
const exactResults = allResults.filter((result) => (
  normalizeMetadata(result)['File ID']?.includes(fileId)
));
if (exactResults.length === 0) throw new Error(`No exact City records found for ${fileId}`);

const exactDocuments = exactResults.filter((result) => result.type === -2);
const documentInfoRecords = [];
for (const result of exactDocuments) {
  const info = await postJson('DocumentService.aspx/GetBasicDocumentInfo', {
    repoName: repositoryName,
    entryId: result.entryId,
  });
  if (info.data.id !== result.entryId) throw new Error(`Document info ID mismatch for ${result.entryId}`);
  const fileName = `document-info-${result.entryId}.json`;
  const filePath = path.join(outputDirectory, fileName);
  await writeFile(filePath, info.bytes);
  documentInfoRecords.push({
    path: path.relative(process.cwd(), filePath),
    sha256: sha256(info.bytes),
    entryId: result.entryId,
    name: result.name,
    pageCount: info.data.pageCount,
    hasImagedPages: info.data.hasImagedPages,
    imagedPageCount: (info.data.pageInfos ?? []).filter(Boolean).length,
    repositoryPath: info.data.metadata?.path ?? null,
  });
}

const exactInventory = exactResults.map((result) => {
  const metadata = normalizeMetadata(result);
  const documentInfo = documentInfoRecords.find((record) => record.entryId === result.entryId);
  return {
    entryId: result.entryId,
    entryType: result.type === -2 ? 'document' : result.type === 0 ? 'folder' : `type-${result.type}`,
    name: result.name,
    pageCount: documentInfo?.pageCount ?? result.thumbnailPageCount ?? null,
    imagedPageCount: documentInfo?.imagedPageCount ?? null,
    hasImagedPages: documentInfo?.hasImagedPages ?? null,
    repositoryPath: documentInfo?.repositoryPath ?? null,
    metadata: {
      agendaNumber: metadata['Agenda Number'] ?? [],
      description: metadata.Description ?? [],
      documentNumber: metadata['Doc number'] ?? [],
      fileId: metadata['File ID'] ?? [],
      meetingType: metadata['Meeting type'] ?? [],
      recordDate: metadata['Record Date'] ?? [],
      recordType: metadata['Record Type'] ?? [],
      status: metadata.Status ?? [],
    },
    publicDocumentUrl: result.type === -2
      ? new URL(`DocView.aspx?dbid=0&id=${result.entryId}&repo=${repositoryName}`, endpointBaseUrl).href
      : null,
  };
});

const resolutionValues = unique(exactInventory.flatMap((record) => record.metadata.documentNumber));
const descriptionValues = unique(exactInventory.flatMap((record) => record.metadata.description));
const statusValues = unique(exactInventory.flatMap((record) => record.metadata.status));
if (!resolutionValues.includes(expectedResolution)) {
  throw new Error(`Expected City resolution ${expectedResolution}, received ${resolutionValues.join(', ')}`);
}
if (!descriptionValues.includes(expectedDescription)) {
  throw new Error(`Expected City description ${expectedDescription}, received ${descriptionValues.join(', ')}`);
}

const stable = {
  analysisVersion: 'marlins-city-weblink-bureau-veritas-index-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  source: {
    authority: 'City of Miami Office of the City Clerk',
    repositoryName,
    baseUrl: endpointBaseUrl.href,
    fileId,
    expectedResolution,
    expectedDescription,
    searchSyntax,
  },
  inputs: {
    searchPages: searchPages.map((record) => ({
      path: record.path,
      sha256: record.sha256,
      startIdx: record.startIdx,
      endIdx: record.endIdx,
    })),
    documentInfo: documentInfoRecords.map((record) => ({
      path: record.path,
      sha256: record.sha256,
      entryId: record.entryId,
    })),
  },
  search: {
    hitCount,
    returnedCount: allResults.length,
    exactRecordCount: exactResults.length,
    exactDocumentCount: exactDocuments.length,
    exactFolderCount: exactResults.filter((record) => record.type === 0).length,
    resultPageCount: searchPages.length,
  },
  recordSummary: {
    resolutionValues,
    descriptionValues,
    statusValues,
    totalDocumentPages: documentInfoRecords.reduce((sum, record) => sum + record.pageCount, 0),
    totalImagedPages: documentInfoRecords.reduce((sum, record) => sum + record.imagedPageCount, 0),
  },
  exactInventory,
  geometryBoundary: {
    establishesOfficialCityRecordInventory: true,
    establishesCompleteSearchResultInventoryForExactFileIdAtAcquisitionTime: true,
    establishesDocumentContentFindingsBeforeReview: false,
    establishesConstructionAsBuiltGeometry: false,
    establishesCurrentGeometry: false,
    establishesCurrentMeasuredRowGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'DOCUMENT_CONTENT_REVIEW_REQUIRED',
      'CONSTRUCTION_AS_BUILT_STATUS_NOT_ESTABLISHED',
      'CURRENT_CHANGE_INVENTORY_NOT_ESTABLISHED',
      'CURRENT_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-bureau-veritas-index',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  search: artifact.search,
  recordSummary: artifact.recordSummary,
  exactInventory: artifact.exactInventory,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
