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

const searchQueries = [
  'Miami Ballpark construction documents',
  'Miami Ballpark as-built',
  'Miami Ballpark record drawings',
  'Miami Ballpark roof drawings',
  'Marlins stadium construction documents',
  'Marlins stadium as-built',
  'Marlins Park permit plans',
  '501 Marlins Way',
  '1501 NW 3rd Street',
  'loanDepot Park',
  'loanDepot stadium',
  'Marlins Ballpark',
  'Marlins stadium',
  'Marlins Park',
  'Miami Ballpark',
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
  'tmp/lidar/marlins-city-weblink-construction-record-discovery-2026',
));
await mkdir(outputDirectory, { recursive: true });

function createCitySession() {
  const cookieJar = new Map();
  return {
    async postJson(endpoint, payload) {
      const url = new URL(endpoint, endpointBaseUrl).href;
      assertApprovedUrl(url);
      const headers = new Headers({
        accept: 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'user-agent': 'mlb-sun-tracker-marlins-city-weblink-audit/1.0',
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
      const allowedCookieNames = new Set(['AcceptsCookies', 'MachineTag', 'WebLinkSession']);
      for (const header of response.headers.getSetCookie()) {
        const match = /^([^=;]+)=([^;]*)/.exec(header);
        if (match && allowedCookieNames.has(match[1])) cookieJar.set(match[1], match[2]);
      }
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
      const text = await response.text();
      const wrapper = JSON.parse(text);
      if (wrapper.error) throw new Error(`City WebLink error: ${JSON.stringify(wrapper.error)}`);
      return { data: wrapper.data, bytes: Buffer.from(text, 'utf8') };
    },
  };
}

async function runTasksWithConcurrency(tasks, concurrency) {
  const results = new Array(tasks.length);
  let nextTaskIndex = 0;
  async function worker() {
    while (nextTaskIndex < tasks.length) {
      const taskIndex = nextTaskIndex;
      nextTaskIndex += 1;
      results[taskIndex] = await tasks[taskIndex]();
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker()),
  );
  return results;
}

function querySlug(query) {
  return query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function basicAndSearchSyntax(query) {
  const phrasePrefixes = [
    'Miami Ballpark',
    'Marlins Park',
    'Marlins stadium',
    'Marlins Ballpark',
    'loanDepot Park',
    'loanDepot stadium',
    '501 Marlins Way',
    '1501 NW 3rd Street',
  ];
  const phrase = phrasePrefixes.find((candidate) => (
    query === candidate || query.startsWith(`${candidate} `)
  ));
  if (!phrase) throw new Error(`City search query has no approved phrase prefix: ${query}`);
  const commands = [`{LF:Basic ~= "'${phrase}'", option="DFNLT"}`];
  const remainder = query.slice(phrase.length).trim();
  for (const term of remainder.split(/\s+/).filter(Boolean)) {
    if (!/^[A-Za-z0-9-]+$/.test(term)) throw new Error(`Unsafe City search term: ${term}`);
    commands.push(`{LF:Basic ~= "${term}", option="DFNLT"}`);
  }
  return commands.join(' & ');
}

function summarizeResult(result) {
  const metadata = normalizeMetadata(result);
  const context = (result.contexthits ?? []).map((hit) => hit.Context ?? '').join(' ');
  return {
    entryId: result.entryId,
    entryType: result.type === -2 ? 'document' : result.type === 0 ? 'folder' : `type-${result.type}`,
    name: result.name,
    pageCount: Number(result.data?.[5] || result.thumbnailPageCount || 0),
    repositoryPath: result.data?.[6] ?? null,
    context,
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

const repositoryName = 'Administration';
const pageSize = Number(option('page-size', '20'));
const requestConcurrency = Number(option('request-concurrency', '6'));
if (!Number.isInteger(pageSize) || pageSize !== 20) {
  throw new Error(`City search page size must be 20: ${pageSize}`);
}
if (!Number.isInteger(requestConcurrency) || requestConcurrency < 1 || requestConcurrency > 8) {
  throw new Error(`Request concurrency must be an integer from 1 through 8: ${requestConcurrency}`);
}

async function writeSearchPage(state, result, startIdx, pageNumber) {
  if (result.data.failed) {
    throw new Error(`City WebLink search failed for ${state.query}: ${result.data.errMsg ?? 'unknown error'}`);
  }
  if (!Array.isArray(result.data.results)) {
    throw new Error(`City search omitted results for ${state.query}`);
  }
  if (result.data.hitCount !== state.hitCount) throw new Error(`Hit count changed for ${state.query}`);
  if (result.data.searchUUID !== state.searchUuid) throw new Error(`Search UUID changed for ${state.query}`);
  const fileName = `${querySlug(state.query)}-page-${String(pageNumber).padStart(3, '0')}.json`;
  const filePath = path.join(outputDirectory, fileName);
  await writeFile(filePath, result.bytes);
  state.pages.push({
    path: path.relative(process.cwd(), filePath),
    sha256: sha256(result.bytes),
    startIdx,
    endIdx: startIdx + result.data.results.length,
    results: result.data.results,
  });
}

const initialSearchTasks = searchQueries.map((query) => async () => {
  const session = createCitySession();
  const searchSyntax = basicAndSearchSyntax(query);
  const result = await session.postJson('SearchService.aspx/GetSearchListing', {
    repoName: repositoryName,
    searchSyn: searchSyntax,
    searchUuid: null,
    sortColumn: '',
    startIdx: 0,
    endIdx: pageSize,
    getNewListing: true,
    sortOrder: 2,
    displayInGridView: false,
  });
  if (result.data.failed) {
    throw new Error(`City WebLink search failed for ${query}: ${result.data.errMsg ?? 'unknown error'}`);
  }
  if (!Array.isArray(result.data.results)) throw new Error(`City search omitted results for ${query}`);
  const state = {
    query,
    searchSyntax,
    searchUuid: result.data.searchUUID,
    hitCount: result.data.hitCount,
    session,
    pages: [],
  };
  await writeSearchPage(state, result, 0, 1);
  if (result.data.results.length !== Math.min(pageSize, state.hitCount)) {
    throw new Error(`Unexpected first-page length for ${query}`);
  }
  return state;
});
const searchStates = await runTasksWithConcurrency(
  initialSearchTasks,
  Math.min(4, requestConcurrency),
);

const paginationTasks = [];
for (const state of searchStates) {
  for (let startIdx = pageSize; startIdx < state.hitCount; startIdx += pageSize) {
    const pageNumber = Math.floor(startIdx / pageSize) + 1;
    paginationTasks.push(async () => {
      const result = await state.session.postJson('SearchService.aspx/GetSearchListing', {
      repoName: repositoryName,
      searchSyn: state.searchSyntax,
      searchUuid: state.searchUuid,
      sortColumn: '',
      startIdx,
      endIdx: startIdx + pageSize,
      getNewListing: false,
      sortOrder: 2,
      displayInGridView: false,
      });
      const expectedLength = Math.min(pageSize, state.hitCount - startIdx);
      if (result.data.results?.length !== expectedLength) {
        throw new Error(`Unexpected page length for ${state.query} at ${startIdx}`);
      }
      await writeSearchPage(state, result, startIdx, pageNumber);
    });
  }
}
await runTasksWithConcurrency(paginationTasks, requestConcurrency);

const searches = searchStates.map((state) => {
  state.pages.sort((left, right) => left.startIdx - right.startIdx);
  const returnedCount = state.pages.reduce((sum, page) => sum + page.results.length, 0);
  if (returnedCount !== state.hitCount) {
    throw new Error(`Complete pagination failed for ${state.query}: ${returnedCount}/${state.hitCount}`);
  }
  return {
    query: state.query,
    searchSyntax: state.searchSyntax,
    hitCount: state.hitCount,
    returnedCount,
    pages: state.pages,
  };
});

const uniqueResultsByEntryId = new Map();
for (const search of searches) {
  for (const page of search.pages) {
    for (const result of page.results) {
      const summary = summarizeResult(result);
      const prior = uniqueResultsByEntryId.get(summary.entryId);
      if (!prior) {
        uniqueResultsByEntryId.set(summary.entryId, {
          ...summary,
          matchedQueries: [search.query],
        });
      } else if (!prior.matchedQueries.includes(search.query)) {
        prior.matchedQueries.push(search.query);
      }
    }
  }
}

const exclusionPattern = /(?:agenda|marked agenda|minutes|signature report|master report|fact sheet)/i;
const knownReviewedEntryIds = new Set([1198453, 1204749]);
const uniqueResults = [...uniqueResultsByEntryId.values()].sort((left, right) => (
  left.entryId - right.entryId
));
const candidates = uniqueResults
  .filter((record) => record.entryType === 'document')
  .map((record) => {
    const searchable = [
      record.name,
      record.repositoryPath,
      record.context,
      ...record.metadata.description,
      ...record.metadata.recordType,
    ].filter(Boolean).join(' ');
    const geometryTerms = [...new Set(
      searchable.toLowerCase().match(/as[ -]?built|construction|record drawing|roof|permit|plan|drawing|section|elevation|stadium|ballpark|marlins/g) ?? [],
    )].sort();
    return {
      ...record,
      geometryTerms,
      excludedRoutineMeetingRecord: exclusionPattern.test(record.name),
      alreadyReviewedGeometryEntry: knownReviewedEntryIds.has(record.entryId),
    };
  })
  .filter((record) => record.geometryTerms.length > 0)
  .sort((left, right) => (
    Number(left.excludedRoutineMeetingRecord) - Number(right.excludedRoutineMeetingRecord)
    || Number(left.alreadyReviewedGeometryEntry) - Number(right.alreadyReviewedGeometryEntry)
    || right.matchedQueries.length - left.matchedQueries.length
    || right.geometryTerms.length - left.geometryTerms.length
    || left.entryId - right.entryId
  ));

const stable = {
  analysisVersion: 'marlins-city-weblink-construction-record-discovery-v3',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  source: {
    authority: 'City of Miami Office of the City Clerk',
    repositoryName,
    baseUrl: endpointBaseUrl.href,
    publicReadOnlySearch: true,
  },
  inputs: {
    searchPages: searches.flatMap((search) => search.pages.map((page) => ({
      path: page.path,
      sha256: page.sha256,
      query: search.query,
      startIdx: page.startIdx,
      endIdx: page.endIdx,
    }))),
  },
  searches: searches.map((search) => ({
    query: search.query,
    searchSyntax: search.searchSyntax,
    hitCount: search.hitCount,
    returnedCount: search.returnedCount,
    resultPageCount: search.pages.length,
  })),
  inventory: {
    queryCount: searches.length,
    totalReturnedAcrossQueries: searches.reduce((sum, search) => sum + search.returnedCount, 0),
    uniqueEntryCount: uniqueResults.length,
    uniqueDocumentCount: uniqueResults.filter((record) => record.entryType === 'document').length,
    candidateDocumentCount: candidates.length,
    unreviewedNonRoutineCandidateCount: candidates.filter((record) => (
      !record.excludedRoutineMeetingRecord && !record.alreadyReviewedGeometryEntry
    )).length,
  },
  uniqueResults,
  candidates,
  geometryBoundary: {
    establishesOfficialCitySearchSnapshot: true,
    establishesCandidateConstructionRecordInventory: true,
    establishesDocumentContentWithoutCandidateReview: false,
    establishesConstructionAsBuiltGeometry: false,
    establishesCurrentGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'DISCOVERY_CANDIDATE_REVIEW_REQUIRED',
      'CONSTRUCTION_AS_BUILT_STADIUM_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-construction-record-discovery',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  searches: artifact.searches,
  inventory: artifact.inventory,
  topCandidates: candidates.slice(0, 40).map((record) => ({
    entryId: record.entryId,
    name: record.name,
    pageCount: record.pageCount,
    matchedQueries: record.matchedQueries,
    geometryTerms: record.geometryTerms,
    excludedRoutineMeetingRecord: record.excludedRoutineMeetingRecord,
    alreadyReviewedGeometryEntry: record.alreadyReviewedGeometryEntry,
    metadata: record.metadata,
    publicDocumentUrl: record.publicDocumentUrl,
  })),
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
