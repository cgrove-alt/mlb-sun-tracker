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

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const selections = [
  { entryId: 1416380, name: 'Back-Up Documents', expectedPageCount: 128, hitPageNumber: 32 },
  { entryId: 1436539, name: 'Back-Up Documents', expectedPageCount: 632, hitPageNumber: 158 },
  { entryId: 1454990, name: 'Back-Up Documents', expectedPageCount: 433, hitPageNumber: 86 },
].map((selection) => ({
  ...selection,
  exportRange: {
    firstPage: Math.max(1, selection.hitPageNumber),
    lastPage: Math.min(selection.expectedPageCount, selection.hitPageNumber + 2),
  },
}));
const approvedEntryIds = new Set(selections.map((selection) => selection.entryId));

const endpointBase = option('endpoint-base', 'https://documents.miamigov.com/WebLink/');
const endpointBaseUrl = new URL(endpointBase);
if (
  endpointBaseUrl.protocol !== 'https:'
  || endpointBaseUrl.hostname !== 'documents.miamigov.com'
  || endpointBaseUrl.pathname !== '/WebLink/'
) {
  throw new Error(`Unapproved City WebLink base URL: ${endpointBase}`);
}
const indexPath = path.resolve(option(
  'index',
  'tmp/lidar/marlins-city-weblink-cyclomedia-records-2026/manifest.json',
));
const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-city-weblink-cyclomedia-matched-pages-2026',
));
await mkdir(outputDirectory, { recursive: true });

const indexBytes = await readFile(indexPath);
const index = JSON.parse(indexBytes.toString('utf8'));
if (index.artifactKind !== 'marlins-city-weblink-cyclomedia-record-discovery') {
  throw new Error('Input is not the locked City Cyclomedia record discovery');
}
for (const selection of selections) {
  const record = index.uniqueResults.find((result) => result.entryId === selection.entryId);
  if (
    !record
    || record.entryType !== 'document'
    || record.name !== selection.name
    || record.pageCount !== selection.expectedPageCount
    || !record.matchedQueries.includes('CycloMedia')
  ) {
    throw new Error(`Unexpected City Cyclomedia search result: ${JSON.stringify({ selection, record })}`);
  }
}

function assertApprovedUrl(value) {
  const url = new URL(value);
  const fixedPaths = new Set([
    '/WebLink/DocumentService.aspx/GetBasicDocumentInfo',
    '/WebLink/GeneratePDF10.aspx',
    '/WebLink/DocumentService.aspx/PDFTransition',
  ]);
  const pdfMatch = /^\/WebLink\/PDF10\/[0-9a-f-]+\/(\d+)$/.exec(url.pathname);
  const approvedPdf = pdfMatch && approvedEntryIds.has(Number(pdfMatch[1]));
  if (
    url.protocol !== 'https:'
    || url.hostname !== 'documents.miamigov.com'
    || (!fixedPaths.has(url.pathname) && !approvedPdf)
  ) {
    throw new Error(`Unapproved City WebLink URL: ${value}`);
  }
}

const cookieJar = new Map();
function captureCookies(response) {
  for (const header of response.headers.getSetCookie()) {
    const match = /^(AcceptsCookies|MachineTag|WebLinkSession)=([^;]*)/.exec(header);
    if (match) cookieJar.set(match[1], match[2]);
  }
}

async function cityFetch(url, init = {}) {
  assertApprovedUrl(url);
  const headers = new Headers(init.headers ?? {});
  headers.set('accept-language', 'en-US,en;q=0.9');
  headers.set('cache-control', 'no-cache');
  headers.set('user-agent', 'mlb-sun-tracker-marlins-city-cyclomedia-record-audit/1.0');
  const cookies = [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join('; ');
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
  const bytes = Buffer.from(await response.arrayBuffer());
  const wrapper = JSON.parse(bytes.toString('utf8'));
  if (wrapper.error) throw new Error(`City WebLink error: ${JSON.stringify(wrapper.error)}`);
  return { bytes, data: wrapper.data };
}

async function exportPages(selection) {
  const info = await postJson('DocumentService.aspx/GetBasicDocumentInfo', {
    repoName: 'Administration',
    entryId: selection.entryId,
  });
  if (
    info.data.id !== selection.entryId
    || info.data.name !== selection.name
    || info.data.pageCount !== selection.expectedPageCount
    || info.data.hasImagedPages !== true
  ) {
    throw new Error(`Unexpected document info for ${selection.entryId}`);
  }
  const generateUrl = new URL('GeneratePDF10.aspx', endpointBaseUrl);
  generateUrl.searchParams.set('key', String(selection.entryId));
  generateUrl.searchParams.set(
    'PageRange',
    `${selection.exportRange.firstPage} - ${selection.exportRange.lastPage}`,
  );
  generateUrl.searchParams.set('Watermark', '0');
  generateUrl.searchParams.set('repo', 'Administration');
  const generateResponse = await cityFetch(generateUrl, {
    method: 'POST',
    headers: {
      accept: 'text/plain',
      'content-type': 'application/json',
      'x-lf-suppress-login-redirect': '1',
    },
    body: '{}',
  });
  const generateBytes = Buffer.from(await generateResponse.arrayBuffer());
  const exportKey = generateBytes.toString('utf8').split(/\r?\n/, 1)[0].trim();
  if (!/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(exportKey)) {
    throw new Error(`Unexpected PDF export key for ${selection.entryId}: ${exportKey}`);
  }
  const progressRecords = [];
  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    const progress = await postJson('DocumentService.aspx/PDFTransition', { Key: exportKey });
    progressRecords.push(JSON.parse(progress.bytes.toString('utf8')));
    if (progress.data.finished) {
      if (!progress.data.success) throw new Error(`PDF export failed for ${selection.entryId}`);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!progressRecords.at(-1)?.data?.finished) {
    throw new Error(`PDF export timed out for ${selection.entryId}`);
  }
  const pdfUrl = new URL(`PDF10/${exportKey}/${selection.entryId}`, endpointBaseUrl);
  const pdfResponse = await cityFetch(pdfUrl, { headers: { accept: 'application/pdf' } });
  const pdfBytes = Buffer.from(await pdfResponse.arrayBuffer());
  if (!pdfBytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    throw new Error(`Invalid PDF signature for ${selection.entryId}`);
  }
  return {
    infoBytes: info.bytes,
    generateBytes,
    progressBytes: Buffer.from(`${JSON.stringify(progressRecords, null, 2)}\n`, 'utf8'),
    pdfBytes,
  };
}

const acquiredPages = [];
for (const selection of selections) {
  const result = await exportPages(selection);
  const baseName = `${selection.entryId}-${slug(selection.name)}`;
  const infoPath = path.join(outputDirectory, `${baseName}-document-info.json`);
  const generatePath = path.join(outputDirectory, `${baseName}-pdf-generate-response.txt`);
  const progressPath = path.join(outputDirectory, `${baseName}-pdf-progress.json`);
  const pdfPath = path.join(outputDirectory, `${baseName}-matched-pages.pdf`);
  await Promise.all([
    writeFile(infoPath, result.infoBytes),
    writeFile(generatePath, result.generateBytes),
    writeFile(progressPath, result.progressBytes),
    writeFile(pdfPath, result.pdfBytes),
  ]);
  acquiredPages.push({
    ...selection,
    exportedPageCount: selection.exportRange.lastPage - selection.exportRange.firstPage + 1,
    inputs: {
      documentInfo: { path: path.relative(process.cwd(), infoPath), sha256: sha256(result.infoBytes) },
      pdfGenerateResponse: { path: path.relative(process.cwd(), generatePath), sha256: sha256(result.generateBytes) },
      pdfProgress: { path: path.relative(process.cwd(), progressPath), sha256: sha256(result.progressBytes) },
      pdf: {
        path: path.relative(process.cwd(), pdfPath),
        sha256: sha256(result.pdfBytes),
        byteLength: result.pdfBytes.length,
      },
    },
  });
}

const stable = {
  analysisVersion: 'marlins-city-weblink-cyclomedia-matched-page-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  source: {
    authority: 'City of Miami Office of the City Clerk',
    repositoryName: 'Administration',
    baseUrl: endpointBaseUrl.href,
  },
  inputs: {
    searchManifest: {
      path: path.relative(process.cwd(), indexPath),
      sha256: sha256(indexBytes),
      artifactVersion: index.artifactVersion,
    },
  },
  acquiredPages,
  acquisitionSummary: {
    documentCount: acquiredPages.length,
    exportedPageCount: acquiredPages.reduce((sum, record) => sum + record.exportedPageCount, 0),
    totalByteLength: acquiredPages.reduce((sum, record) => sum + record.inputs.pdf.byteLength, 0),
  },
  geometryBoundary: {
    establishesOfficialCityMatchedPageCopies: true,
    establishesDocumentContentFindingsBeforeReview: false,
    establishesCyclomediaContractOrAccuracyRecord: false,
    establishesPublicStreetSmartAccess: false,
    establishesPositionalAccuracy: false,
    establishesCurrentGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'MATCHED_PAGE_CONTENT_REVIEW_REQUIRED',
      'PUBLIC_STREETSMART_ACCESS_NOT_ESTABLISHED',
      'POSITIONAL_ACCURACY_NOT_ESTABLISHED',
      'CURRENT_ROW_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-cyclomedia-matched-page-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  acquisitionSummary: artifact.acquisitionSummary,
  acquiredPages: artifact.acquiredPages,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
