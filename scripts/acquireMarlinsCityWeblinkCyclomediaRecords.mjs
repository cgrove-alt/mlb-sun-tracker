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

function querySlug(query) {
  return query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function assertApprovedUrl(value) {
  const url = new URL(value);
  if (
    url.protocol !== 'https:'
    || url.hostname !== 'documents.miamigov.com'
    || url.pathname !== '/WebLink/SearchService.aspx/GetSearchListing'
  ) {
    throw new Error(`Unapproved City WebLink URL: ${value}`);
  }
}

function summarizeResult(result, endpointBaseUrl) {
  const metadata = normalizeMetadata(result);
  return {
    entryId: result.entryId,
    entryType: result.type === -2 ? 'document' : result.type === 0 ? 'folder' : `type-${result.type}`,
    name: result.name,
    pageCount: Number(result.data?.[5] || result.thumbnailPageCount || 0),
    repositoryPath: result.data?.[6] ?? null,
    context: (result.contexthits ?? []).map((hit) => hit.Context ?? '').join(' '),
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
      ? new URL(
        `DocView.aspx?dbid=0&id=${result.entryId}&repo=Administration`,
        endpointBaseUrl,
      ).href
      : null,
  };
}

const queries = [
  'CycloMedia',
  'CycloMedia Technology',
  'Street Smart',
  'street-level imagery',
  '3D measurements',
];
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
  'tmp/lidar/marlins-city-weblink-cyclomedia-records-2026',
));
await mkdir(outputDirectory, { recursive: true });

const repositoryName = 'Administration';
const pageSize = 20;

function createSession() {
  const cookieJar = new Map();
  return {
    async search(payload) {
      const url = new URL('SearchService.aspx/GetSearchListing', endpointBaseUrl).href;
      assertApprovedUrl(url);
      const headers = new Headers({
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'user-agent': 'mlb-sun-tracker-marlins-city-cyclomedia-record-audit/1.0',
        'x-lf-suppress-login-redirect': '1',
      });
      const cookies = [...cookieJar.entries()]
        .map(([name, value]) => `${name}=${value}`).join('; ');
      if (cookies) headers.set('cookie', cookies);
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        redirect: 'error',
        signal: AbortSignal.timeout(180_000),
      });
      for (const header of response.headers.getSetCookie()) {
        const match = /^(AcceptsCookies|MachineTag|WebLinkSession)=([^;]*)/.exec(header);
        if (match) cookieJar.set(match[1], match[2]);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      const wrapper = JSON.parse(bytes.toString('utf8'));
      if (wrapper.error) throw new Error(`City WebLink error: ${JSON.stringify(wrapper.error)}`);
      if (wrapper.data?.failed) {
        throw new Error(`City WebLink search failed: ${wrapper.data.errMsg ?? 'unknown error'}`);
      }
      return { bytes, data: wrapper.data };
    },
  };
}

async function acquireQuery(query) {
  const session = createSession();
  const searchSyntax = `{LF:Basic ~= "'${query}'", option="DFNLT"}`;
  let searchUuid = null;
  let hitCount = null;
  const results = [];
  const inputs = [];
  let pageNumber = 0;
  for (let startIdx = 0; hitCount === null || startIdx < hitCount; startIdx += pageSize) {
    pageNumber += 1;
    const response = await session.search({
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
    if (!Array.isArray(response.data?.results)) throw new Error(`Search omitted results for ${query}`);
    hitCount ??= response.data.hitCount;
    searchUuid ??= response.data.searchUUID;
    if (response.data.hitCount !== hitCount) throw new Error(`Hit count changed for ${query}`);
    if (response.data.searchUUID !== searchUuid) throw new Error(`Search UUID changed for ${query}`);
    const fileName = `${querySlug(query)}-page-${String(pageNumber).padStart(3, '0')}.json`;
    const filePath = path.join(outputDirectory, fileName);
    await writeFile(filePath, response.bytes);
    inputs.push({
      query,
      path: path.relative(process.cwd(), filePath),
      sha256: sha256(response.bytes),
      startIdx,
      returnedCount: response.data.results.length,
    });
    results.push(...response.data.results);
    if (response.data.results.length === 0 && startIdx < hitCount) {
      throw new Error(`Pagination made no progress for ${query}`);
    }
  }
  return {
    inputs,
    search: {
      query,
      searchSyntax,
      hitCount,
      returnedCount: results.length,
      resultPageCount: pageNumber,
      results: results.map((result) => summarizeResult(result, endpointBaseUrl)),
    },
  };
}
const acquiredQueries = await Promise.all(queries.map((query) => acquireQuery(query)));
const searchRecords = acquiredQueries.map((record) => record.search);
const rawInputs = acquiredQueries.flatMap((record) => record.inputs);

const uniqueByEntryId = new Map();
for (const search of searchRecords) {
  for (const result of search.results) {
    const record = uniqueByEntryId.get(result.entryId) ?? {
      ...result,
      matchedQueries: [],
    };
    record.matchedQueries.push(search.query);
    uniqueByEntryId.set(result.entryId, record);
  }
}
const uniqueResults = [...uniqueByEntryId.values()]
  .map((record) => ({ ...record, matchedQueries: [...new Set(record.matchedQueries)].sort() }))
  .sort((first, second) => Number(first.entryId) - Number(second.entryId));
const documentResults = uniqueResults.filter((result) => result.entryType === 'document');

const stable = {
  analysisVersion: 'marlins-city-weblink-cyclomedia-record-discovery-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  source: {
    authority: 'City of Miami Office of the City Clerk',
    repositoryName,
    endpointBase: endpointBaseUrl.href,
    searchMode: 'exact phrase in WebLink Basic field',
  },
  inputs: { searchPages: rawInputs },
  searches: searchRecords.map(({ results, ...record }) => record),
  inventory: {
    queryCount: queries.length,
    totalReturnedAcrossQueries: searchRecords.reduce((sum, record) => sum + record.returnedCount, 0),
    uniqueResultCount: uniqueResults.length,
    uniqueDocumentCount: documentResults.length,
    uniqueFolderCount: uniqueResults.filter((result) => result.entryType === 'folder').length,
    totalDocumentPageCount: documentResults.reduce((sum, result) => sum + result.pageCount, 0),
  },
  uniqueResults,
  geometryBoundary: {
    establishesCompleteExactPhraseSearchInventoryAtAcquisitionTime: true,
    establishesCyclomediaContractOrAccuracyRecordBeforeDocumentReview: false,
    establishesPublicStreetSmartAccess: false,
    establishesPositionalAccuracy: false,
    establishesCurrentExteriorGeometry: false,
    establishesInteriorSeatingGeometry: false,
    establishesCurrentMeasuredRowGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      ...(documentResults.length > 0 ? ['DOCUMENT_CONTENT_REVIEW_REQUIRED'] : ['NO_MATCHING_CITY_DOCUMENTS_FOUND']),
      'PUBLIC_STREETSMART_ACCESS_NOT_ESTABLISHED',
      'POSITIONAL_ACCURACY_NOT_ESTABLISHED',
      'CURRENT_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-cyclomedia-record-discovery',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  inventory: artifact.inventory,
  searches: artifact.searches,
  uniqueResults: artifact.uniqueResults,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
