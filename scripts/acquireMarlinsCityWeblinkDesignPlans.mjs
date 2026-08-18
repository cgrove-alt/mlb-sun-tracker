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

function assertApprovedUrl(value, allowedPaths) {
  const url = new URL(value);
  if (
    url.protocol !== 'https:'
    || url.hostname !== 'documents.miamigov.com'
    || !allowedPaths.some((pattern) => pattern.test(url.pathname))
  ) {
    throw new Error(`Unapproved City WebLink URL: ${value}`);
  }
  return url;
}

function normalizeMetadata(result) {
  return Object.fromEntries((result.metadata ?? []).map((record) => [
    record.name,
    record.values ?? [],
  ]));
}

function normalizedHeaders(headers) {
  return Object.fromEntries([
    'accept-ranges',
    'content-disposition',
    'content-length',
    'content-type',
    'date',
    'etag',
    'last-modified',
  ].map((name) => [name, headers.get(name)]).filter(([, value]) => value !== null));
}

const allowedPaths = [
  /^\/WebLink\/SearchService\.aspx\/GetSearchListing$/,
  /^\/WebLink\/DocumentService\.aspx\/GetBasicDocumentInfo$/,
  /^\/WebLink\/GeneratePDF10\.aspx$/,
  /^\/WebLink\/DocumentService\.aspx\/PDFTransition$/,
  /^\/WebLink\/PDF10\/[0-9a-f-]+\/1198453$/,
  /^\/WebLink\/DocView\.aspx$/,
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
  'tmp/lidar/marlins-city-weblink-dd-plans-2009',
));
await mkdir(outputDirectory, { recursive: true });

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
  assertApprovedUrl(url, allowedPaths);
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
  return {
    data: wrapper.data,
    bytes: Buffer.from(text, 'utf8'),
    response,
  };
}

const repositoryName = 'Administration';
const fileId = '09-00141mu';
const searchSyntax = `{LF:Basic ~= "${fileId}", option="DFNLT"}`;
const pageSize = 20;
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
const planCandidates = allResults.filter((result) => {
  const metadata = normalizeMetadata(result);
  return result.entryId === 1198453
    && result.type === -2
    && result.name === 'Vol. II. 7. Design Development Plans'
    && metadata['File ID']?.includes(fileId)
    && metadata['Doc number']?.includes('R-09-0199')
    && metadata.Status?.includes('Final');
});
if (planCandidates.length !== 1) {
  throw new Error(`Expected one exact design-plan entry, received ${planCandidates.length}`);
}
const planEntry = planCandidates[0];

const documentInfoResult = await postJson('DocumentService.aspx/GetBasicDocumentInfo', {
  repoName: repositoryName,
  entryId: planEntry.entryId,
});
const documentInfo = documentInfoResult.data;
if (
  documentInfo.id !== 1198453
  || documentInfo.name !== 'Vol. II. 7. Design Development Plans'
  || documentInfo.pageCount !== 96
  || documentInfo.hasImagedPages !== true
) {
  throw new Error(`Unexpected City design-plan metadata: ${JSON.stringify({
    id: documentInfo.id,
    name: documentInfo.name,
    pageCount: documentInfo.pageCount,
    hasImagedPages: documentInfo.hasImagedPages,
  })}`);
}
const documentInfoPath = path.join(outputDirectory, 'document-info.json');
await writeFile(documentInfoPath, documentInfoResult.bytes);

const generateUrl = new URL('GeneratePDF10.aspx', endpointBaseUrl);
generateUrl.searchParams.set('key', String(documentInfo.id));
generateUrl.searchParams.set('PageRange', `1 - ${documentInfo.pageCount}`);
generateUrl.searchParams.set('Watermark', '0');
generateUrl.searchParams.set('repo', repositoryName);
const generateResponse = await cityFetch(generateUrl.href, {
  method: 'POST',
  headers: {
    accept: 'text/plain',
    'content-type': 'application/json',
    'x-lf-suppress-login-redirect': '1',
  },
  body: '{}',
});
const generateText = await generateResponse.text();
const exportKey = generateText.split(/\r?\n/, 1)[0].trim();
if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(exportKey)) {
  throw new Error(`Unexpected City PDF export key: ${exportKey}`);
}
const generateBytes = Buffer.from(generateText, 'utf8');
const generatePath = path.join(outputDirectory, 'pdf-generate-response.txt');
await writeFile(generatePath, generateBytes);

const progressRecords = [];
const deadline = Date.now() + 180_000;
while (Date.now() < deadline) {
  const progress = await postJson('DocumentService.aspx/PDFTransition', { Key: exportKey });
  progressRecords.push({
    checkedAt: new Date().toISOString(),
    response: JSON.parse(progress.bytes.toString('utf8')),
  });
  if (progress.data.finished) {
    if (!progress.data.success) {
      throw new Error(`City PDF export failed: ${progress.data.errMsg ?? 'unknown error'}`);
    }
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 1_000));
}
if (!progressRecords.at(-1)?.response?.data?.finished) {
  throw new Error('City PDF export did not finish before timeout');
}
const progressBytes = Buffer.from(`${JSON.stringify(progressRecords, null, 2)}\n`, 'utf8');
const progressPath = path.join(outputDirectory, 'pdf-progress.json');
await writeFile(progressPath, progressBytes);

const pdfUrl = new URL(`PDF10/${exportKey}/${documentInfo.id}`, endpointBaseUrl);
const pdfResponse = await cityFetch(pdfUrl.href, {
  headers: { accept: 'application/pdf' },
});
const contentType = pdfResponse.headers.get('content-type') ?? '';
if (!/application\/pdf/i.test(contentType)) {
  throw new Error(`Expected a City PDF response, received ${contentType}`);
}
const pdfBytes = Buffer.from(await pdfResponse.arrayBuffer());
if (!pdfBytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
  throw new Error('City plan export does not start with a PDF signature');
}
const pdfPath = path.join(outputDirectory, 'miami-ballpark-design-development-plans-2009.pdf');
await writeFile(pdfPath, pdfBytes);
const pdfHeaders = normalizedHeaders(pdfResponse.headers);
const pdfHeadersBytes = Buffer.from(`${JSON.stringify(pdfHeaders, null, 2)}\n`, 'utf8');
const pdfHeadersPath = path.join(outputDirectory, 'pdf-response-headers.json');
await writeFile(pdfHeadersPath, pdfHeadersBytes);

const inputRecords = {
  searchPages: searchPages.map(({ path: inputPath, sha256: digest, startIdx, endIdx }) => ({
    path: inputPath,
    sha256: digest,
    startIdx,
    endIdx,
  })),
  documentInfo: {
    path: path.relative(process.cwd(), documentInfoPath),
    sha256: sha256(documentInfoResult.bytes),
  },
  pdfGenerateResponse: {
    path: path.relative(process.cwd(), generatePath),
    sha256: sha256(generateBytes),
  },
  pdfProgress: {
    path: path.relative(process.cwd(), progressPath),
    sha256: sha256(progressBytes),
  },
  pdfResponseHeaders: {
    path: path.relative(process.cwd(), pdfHeadersPath),
    sha256: sha256(pdfHeadersBytes),
  },
  designDevelopmentPlans: {
    path: path.relative(process.cwd(), pdfPath),
    sha256: sha256(pdfBytes),
    byteLength: pdfBytes.length,
  },
};
const entryMetadata = normalizeMetadata(planEntry);
const stable = {
  analysisVersion: 'marlins-city-weblink-design-plan-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  source: {
    authority: 'City of Miami Office of the City Clerk',
    repositoryName,
    baseUrl: endpointBaseUrl.href,
    publicDocumentUrl: new URL(
      `DocView.aspx?dbid=0&id=${documentInfo.id}&repo=${repositoryName}`,
      endpointBaseUrl,
    ).href,
    fileId,
    resolution: 'R-09-0199',
    recordDate: entryMetadata['Record Date']?.[0] ?? null,
    status: entryMetadata.Status?.[0] ?? null,
    description: entryMetadata.Description?.[0] ?? null,
    entryId: documentInfo.id,
    entryName: documentInfo.name,
    repositoryPath: documentInfo.metadata?.path ?? null,
  },
  inputs: inputRecords,
  search: {
    syntax: searchSyntax,
    hitCount,
    returnedCount: allResults.length,
    resultPageCount: searchPages.length,
    exactPlanEntryCount: planCandidates.length,
  },
  document: {
    pageCount: documentInfo.pageCount,
    imagedPageCount: documentInfo.pageInfos.filter(Boolean).length,
    hasImagedPages: documentInfo.hasImagedPages,
    imageDimensions: [...new Set(documentInfo.pageInfos.filter(Boolean).map((page) => (
      `${page.imageWidth}x${page.imageHeight}@${page.xdpi}x${page.ydpi}dpi`
    )))],
    contentType: pdfHeaders['content-type'] ?? null,
    contentDisposition: pdfHeaders['content-disposition'] ?? null,
  },
  geometryBoundary: {
    officialCityApprovalRecord: true,
    designDevelopmentPlanSetPresent: true,
    planSetContainsSeatingBowlFloorPlans: true,
    planSetContainsRoofOpenAndClosedPlans: true,
    planSetContainsBoundaryAndTopographicSurvey: true,
    establishesConstructionAsBuiltGeometry: false,
    establishesCurrentGeometry: false,
    establishesCurrentMeasuredRowGeometry: false,
    establishesCurrentRoofUndersideGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'DESIGN_DEVELOPMENT_IS_NOT_CONSTRUCTION_AS_BUILT',
      'CURRENT_CHANGE_INVENTORY_NOT_ESTABLISHED',
      'ROW_PLAN_DIGITIZATION_AND_METRIC_REGISTRATION_NOT_VALIDATED',
      'CURRENT_ROW_ELEVATIONS_NOT_ESTABLISHED',
      'CURRENT_ROOF_UNDERSIDE_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-design-plan-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  source: artifact.source,
  search: artifact.search,
  document: artifact.document,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
