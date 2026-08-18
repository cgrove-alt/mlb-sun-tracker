#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ENTRY_ID = 1464301;
const EXPECTED_NAME = 'SEOPW CRA 2019-06-27 Agenda Packet';
const EXPECTED_PAGE_COUNT = 253;
const PAGE_RANGES = [
  { id: 'front-matter', firstPage: 1, lastPage: 10 },
  { id: 'marlins-park-context', firstPage: 28, lastPage: 35 },
  { id: 'construction-plan-cover-and-index', firstPage: 82, lastPage: 110 },
];

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

const endpointBase = option('endpoint-base', 'https://documents.miamigov.com/WebLink/');
const endpointBaseUrl = new URL(endpointBase);
if (
  endpointBaseUrl.protocol !== 'https:'
  || endpointBaseUrl.hostname !== 'documents.miamigov.com'
  || endpointBaseUrl.pathname !== '/WebLink/'
) {
  throw new Error(`Unapproved City WebLink base URL: ${endpointBase}`);
}
const discoveryPath = path.resolve(option(
  'discovery',
  'tmp/lidar/marlins-city-weblink-construction-record-discovery-v5-2026/manifest.json',
));
const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-city-weblink-candidate-plan-pages-1464301-2026',
));
await mkdir(outputDirectory, { recursive: true });

const discoveryBytes = await readFile(discoveryPath);
const discovery = JSON.parse(discoveryBytes.toString('utf8'));
if (discovery.artifactKind !== 'marlins-city-weblink-construction-record-discovery') {
  throw new Error('Input is not the locked construction-record discovery');
}
const candidate = discovery.candidates.find((record) => record.entryId === ENTRY_ID);
if (
  !candidate
  || candidate.name !== EXPECTED_NAME
  || candidate.pageCount !== EXPECTED_PAGE_COUNT
  || !candidate.matchedQueries.includes('Marlins Park permit plans')
) {
  throw new Error(`Unexpected locked discovery candidate: ${JSON.stringify(candidate)}`);
}

function assertApprovedUrl(value) {
  const url = new URL(value);
  const fixedPaths = new Set([
    '/WebLink/DocumentService.aspx/GetBasicDocumentInfo',
    '/WebLink/GeneratePDF10.aspx',
    '/WebLink/DocumentService.aspx/PDFTransition',
  ]);
  const pdfMatch = /^\/WebLink\/PDF10\/[0-9a-f-]+\/(\d+)$/.exec(url.pathname);
  const approvedPdf = pdfMatch && Number(pdfMatch[1]) === ENTRY_ID;
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
  headers.set('cache-control', 'no-cache');
  headers.set('user-agent', 'mlb-sun-tracker-marlins-city-candidate-plan-audit/1.0');
  const cookies = [...cookieJar.entries()]
    .map(([name, value]) => `${name}=${value}`).join('; ');
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

const info = await postJson('DocumentService.aspx/GetBasicDocumentInfo', {
  repoName: 'Administration',
  entryId: ENTRY_ID,
});
if (
  info.data.id !== ENTRY_ID
  || info.data.name !== EXPECTED_NAME
  || info.data.pageCount !== EXPECTED_PAGE_COUNT
  || info.data.hasImagedPages !== true
) {
  throw new Error('Live City document metadata does not match the locked candidate');
}
const infoPath = path.join(outputDirectory, 'document-info.json');
await writeFile(infoPath, info.bytes);

async function exportRange(pageRange) {
  const generateUrl = new URL('GeneratePDF10.aspx', endpointBaseUrl);
  generateUrl.searchParams.set('key', String(ENTRY_ID));
  generateUrl.searchParams.set('PageRange', `${pageRange.firstPage} - ${pageRange.lastPage}`);
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
    throw new Error(`Unexpected PDF export key: ${exportKey}`);
  }
  const progressRecords = [];
  const deadline = Date.now() + 180_000;
  while (Date.now() < deadline) {
    const progress = await postJson('DocumentService.aspx/PDFTransition', { Key: exportKey });
    progressRecords.push(JSON.parse(progress.bytes.toString('utf8')));
    if (progress.data.finished) {
      if (!progress.data.success) throw new Error(`PDF export failed for ${pageRange.id}`);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  if (!progressRecords.at(-1)?.data?.finished) {
    throw new Error(`PDF export timed out for ${pageRange.id}`);
  }
  const pdfUrl = new URL(`PDF10/${exportKey}/${ENTRY_ID}`, endpointBaseUrl);
  const pdfResponse = await cityFetch(pdfUrl, { headers: { accept: 'application/pdf' } });
  const pdfBytes = Buffer.from(await pdfResponse.arrayBuffer());
  if (!pdfBytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    throw new Error(`Invalid PDF signature for ${pageRange.id}`);
  }
  const pdfPath = path.join(outputDirectory, `${pageRange.id}.pdf`);
  const progressPath = path.join(outputDirectory, `${pageRange.id}-progress.json`);
  await Promise.all([
    writeFile(pdfPath, pdfBytes),
    writeFile(progressPath, `${JSON.stringify(progressRecords, null, 2)}\n`),
  ]);
  return {
    ...pageRange,
    exportedPageCount: pageRange.lastPage - pageRange.firstPage + 1,
    pdf: {
      path: path.relative(process.cwd(), pdfPath),
      sha256: sha256(pdfBytes),
      byteLength: pdfBytes.length,
    },
    progress: {
      path: path.relative(process.cwd(), progressPath),
      sha256: sha256(Buffer.from(`${JSON.stringify(progressRecords, null, 2)}\n`)),
    },
  };
}

const exports = [];
for (const pageRange of PAGE_RANGES) exports.push(await exportRange(pageRange));

const stable = {
  analysisVersion: 'marlins-city-weblink-candidate-plan-page-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  source: {
    authority: 'City of Miami Office of the City Clerk',
    repositoryName: 'Administration',
    entryId: ENTRY_ID,
    name: EXPECTED_NAME,
    pageCount: EXPECTED_PAGE_COUNT,
  },
  inputs: {
    discovery: {
      path: path.relative(process.cwd(), discoveryPath),
      sha256: sha256(discoveryBytes),
      artifactVersion: discovery.artifactVersion,
    },
    documentInfo: {
      path: path.relative(process.cwd(), infoPath),
      sha256: sha256(info.bytes),
    },
  },
  exports,
  acquisitionSummary: {
    rangeCount: exports.length,
    exportedPageCount: exports.reduce((sum, record) => sum + record.exportedPageCount, 0),
    totalByteLength: exports.reduce((sum, record) => sum + record.pdf.byteLength, 0),
  },
  evidenceBoundary: {
    establishesOfficialCityPageCopies: true,
    establishesComplete253PageReview: false,
    establishesStadiumGeometryBeforePageReview: false,
    establishesCurrentMetricGeometry: false,
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-candidate-plan-page-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`);
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  acquisitionSummary: artifact.acquisitionSummary,
  exports: artifact.exports,
}, null, 2));
