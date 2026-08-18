#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const PLAN_NUMBERS = [
  'BD24028916001',
  'BD24029883001',
  'BD25010190001',
  'BD25023559001',
  'BD25029346001',
  'BD26000143001',
  'BD26018449001',
  'BD26018489001',
];
const REPOSITORY_NAME = 'Administration';
const PAGE_SIZE = 20;

function option(name, fallback) {
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
      description: metadata.Description ?? [],
      documentNumber: metadata['Doc number'] ?? [],
      fileId: metadata['File ID'] ?? [],
      recordDate: metadata['Record Date'] ?? [],
      recordType: metadata['Record Type'] ?? [],
      status: metadata.Status ?? [],
    },
    publicDocumentUrl: result.type === -2
      ? new URL(
        `DocView.aspx?dbid=0&id=${result.entryId}&repo=${REPOSITORY_NAME}`,
        endpointBaseUrl,
      ).href
      : null,
  };
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
  'tmp/lidar/marlins-city-weblink-current-permit-plan-records-2026',
));
await mkdir(outputDirectory, { recursive: true });

function createSession() {
  const cookieJar = new Map();
  return {
    async search(payload) {
      const url = new URL('SearchService.aspx/GetSearchListing', endpointBaseUrl);
      if (
        url.protocol !== 'https:'
        || url.hostname !== 'documents.miamigov.com'
        || url.pathname !== '/WebLink/SearchService.aspx/GetSearchListing'
      ) {
        throw new Error(`Unapproved City WebLink URL: ${url.href}`);
      }
      const headers = new Headers({
        accept: 'application/json',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'user-agent': 'mlb-sun-tracker-marlins-current-permit-record-audit/1.0',
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
      if (!response.ok) throw new Error(`HTTP ${response.status} for ${url.href}`);
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

const searchDefinitions = PLAN_NUMBERS.flatMap((planNumber) => [
  {
    planNumber,
    mode: 'token',
    searchSyntax: `{LF:Basic ~= "${planNumber}", option="DFNLT"}`,
  },
  {
    planNumber,
    mode: 'exact-phrase',
    searchSyntax: `{LF:Basic ~= "'${planNumber}'", option="DFNLT"}`,
  },
]);

async function acquireSearch(definition) {
  const session = createSession();
  let searchUuid = null;
  let hitCount = null;
  const results = [];
  const inputs = [];
  let pageNumber = 0;
  for (let startIdx = 0; hitCount === null || startIdx < hitCount; startIdx += PAGE_SIZE) {
    pageNumber += 1;
    const response = await session.search({
      repoName: REPOSITORY_NAME,
      searchSyn: definition.searchSyntax,
      searchUuid,
      sortColumn: '',
      startIdx,
      endIdx: startIdx + PAGE_SIZE,
      getNewListing: startIdx === 0,
      sortOrder: 2,
      displayInGridView: false,
    });
    if (!Array.isArray(response.data?.results)) {
      throw new Error(`Search omitted results for ${definition.planNumber} ${definition.mode}`);
    }
    hitCount ??= response.data.hitCount;
    searchUuid ??= response.data.searchUUID;
    if (response.data.hitCount !== hitCount) throw new Error('Hit count changed during pagination');
    if (response.data.searchUUID !== searchUuid) throw new Error('Search UUID changed during pagination');
    const fileName = [
      definition.planNumber.toLowerCase(),
      definition.mode,
      `page-${String(pageNumber).padStart(3, '0')}.json`,
    ].join('-');
    const filePath = path.join(outputDirectory, fileName);
    await writeFile(filePath, response.bytes);
    inputs.push({
      path: path.relative(process.cwd(), filePath),
      sha256: sha256(response.bytes),
      startIdx,
      returnedCount: response.data.results.length,
    });
    results.push(...response.data.results);
    if (response.data.results.length === 0 && startIdx < hitCount) {
      throw new Error('Pagination made no progress');
    }
  }
  return {
    ...definition,
    hitCount,
    returnedCount: results.length,
    pageCount: pageNumber,
    inputs,
    results: results.map((result) => summarizeResult(result, endpointBaseUrl)),
  };
}

async function runWithConcurrency(values, concurrency, worker) {
  const outputs = new Array(values.length);
  let nextIndex = 0;
  async function runWorker() {
    while (nextIndex < values.length) {
      const selectedIndex = nextIndex;
      nextIndex += 1;
      outputs[selectedIndex] = await worker(values[selectedIndex]);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, values.length) }, () => runWorker()),
  );
  return outputs;
}

const searches = await runWithConcurrency(searchDefinitions, 4, acquireSearch);

const uniqueByEntryId = new Map();
for (const search of searches) {
  for (const result of search.results) {
    const record = uniqueByEntryId.get(result.entryId) ?? { ...result, matches: [] };
    record.matches.push({ planNumber: search.planNumber, mode: search.mode });
    uniqueByEntryId.set(result.entryId, record);
  }
}
const uniqueResults = [...uniqueByEntryId.values()].sort(
  (first, second) => Number(first.entryId) - Number(second.entryId),
);
const documentResults = uniqueResults.filter((record) => record.entryType === 'document');

const stable = {
  analysisVersion: 'marlins-city-weblink-current-permit-plan-record-discovery-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  source: {
    authority: 'City of Miami Office of the City Clerk',
    repositoryName: REPOSITORY_NAME,
    endpointBase: endpointBaseUrl.href,
    access: 'public read-only full-text search',
  },
  planNumbers: PLAN_NUMBERS,
  searchModes: ['token', 'exact-phrase'],
  inputs: {
    searchPages: searches.flatMap((search) => search.inputs.map((input) => ({
      ...input,
      planNumber: search.planNumber,
      mode: search.mode,
    }))),
  },
  searches: searches.map(({ inputs, results, ...search }) => search),
  inventory: {
    planNumberCount: PLAN_NUMBERS.length,
    searchCount: searches.length,
    totalReturnedAcrossSearches: searches.reduce((sum, search) => sum + search.returnedCount, 0),
    uniqueResultCount: uniqueResults.length,
    uniqueDocumentCount: documentResults.length,
  },
  uniqueResults,
  evidenceBoundary: {
    establishesCompleteTokenAndExactPhraseSearchAtAcquisitionTime: true,
    establishesPublicCityClerkPlanRecord: documentResults.length > 0,
    establishesIbuildOrProjectDoxPlanAccess: false,
    establishesCurrentMetricGeometry: false,
    establishesCurrentAsBuiltGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      ...(documentResults.length > 0
        ? ['MATCHED_DOCUMENT_CONTENT_REVIEW_REQUIRED']
        : ['NO_MATCHING_PUBLIC_CITY_CLERK_DOCUMENT_FOUND']),
      'IBUILD_ACCOUNT_REQUIRED_FOR_GLOBAL_INQUIRY',
      'PROJECTDOX_PLAN_ACCESS_NOT_ESTABLISHED',
      'CURRENT_METRIC_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-current-permit-plan-record-discovery',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  inventory: artifact.inventory,
  searches: artifact.searches,
  uniqueResults: artifact.uniqueResults,
  evidenceBoundary: artifact.evidenceBoundary,
  publication: artifact.publication,
}, null, 2));
