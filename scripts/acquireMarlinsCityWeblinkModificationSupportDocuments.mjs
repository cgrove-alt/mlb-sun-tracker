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

function normalizedHeaders(headers) {
  return Object.fromEntries([
    'content-disposition',
    'content-length',
    'content-type',
    'date',
    'etag',
    'last-modified',
  ].map((name) => [name, headers.get(name)]).filter(([, value]) => value !== null));
}

const selectedDocuments = [
  { entryId: 1204724, name: 'Analysis', expectedPageCount: 7 },
  { entryId: 1204727, name: 'Exhibit A', expectedPageCount: 2 },
  { entryId: 1204728, name: 'Exhibit B', expectedPageCount: 1 },
  { entryId: 1204736, name: 'Section A. Tab 1. Letter of Intent', expectedPageCount: 5 },
  {
    entryId: 1204737,
    name: 'Section A. Tab 10. Project Description Information per Ordinance 11000',
    expectedPageCount: 11,
  },
  { entryId: 1204740, name: 'Section A. Tab 3. Zoning Division Analysis for Public Hearing', expectedPageCount: 1 },
  { entryId: 1204745, name: 'Section A. Tab 6. Project Data Sheet', expectedPageCount: 3 },
  { entryId: 1204750, name: 'Table of Contents', expectedPageCount: 2 },
];
const approvedEntryIds = new Set(selectedDocuments.map((record) => record.entryId));

function assertApprovedUrl(value) {
  const url = new URL(value);
  const fixedApprovedPaths = new Set([
    '/WebLink/DocumentService.aspx/GetBasicDocumentInfo',
    '/WebLink/GeneratePDF10.aspx',
    '/WebLink/DocumentService.aspx/PDFTransition',
  ]);
  const pdfMatch = /^\/WebLink\/PDF10\/[0-9a-f-]+\/(\d+)$/.exec(url.pathname);
  const approvedPdf = pdfMatch && approvedEntryIds.has(Number(pdfMatch[1]));
  if (
    url.protocol !== 'https:'
    || url.hostname !== 'documents.miamigov.com'
    || (!fixedApprovedPaths.has(url.pathname) && !approvedPdf)
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

const indexPath = path.resolve(option(
  'index',
  'tmp/lidar/marlins-city-weblink-substantial-modification-2010/manifest.json',
));
const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-city-weblink-substantial-modification-support-2010',
));
await mkdir(outputDirectory, { recursive: true });

const indexBytes = await readFile(indexPath);
const index = JSON.parse(indexBytes.toString('utf8'));
if (
  index.artifactKind !== 'marlins-city-weblink-substantial-modification-index'
  || index.source?.fileId !== '09-00141mm'
  || index.source?.expectedResolution !== 'R-10-0058'
) {
  throw new Error('Input is not the locked City 2010 substantial-modification index');
}
for (const selection of selectedDocuments) {
  const indexedEntry = index.exactInventory.find((record) => record.entryId === selection.entryId);
  if (
    !indexedEntry
    || indexedEntry.entryType !== 'document'
    || indexedEntry.name !== selection.name
    || indexedEntry.pageCount !== selection.expectedPageCount
    || !indexedEntry.metadata?.documentNumber?.includes('R-10-0058')
  ) {
    throw new Error(`Unexpected indexed support document: ${JSON.stringify({ selection, indexedEntry })}`);
  }
}

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

async function exportPdf(documentInfo) {
  const generateUrl = new URL('GeneratePDF10.aspx', endpointBaseUrl);
  generateUrl.searchParams.set('key', String(documentInfo.id));
  generateUrl.searchParams.set('PageRange', `1 - ${documentInfo.pageCount}`);
  generateUrl.searchParams.set('Watermark', '0');
  generateUrl.searchParams.set('repo', 'Administration');
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
    throw new Error(`Unexpected City PDF export key for ${documentInfo.id}: ${exportKey}`);
  }

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
        throw new Error(`City PDF export failed for ${documentInfo.id}: ${progress.data.errMsg ?? 'unknown error'}`);
      }
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  if (!progressRecords.at(-1)?.response?.data?.finished) {
    throw new Error(`City PDF export ${documentInfo.id} did not finish before timeout`);
  }

  const pdfUrl = new URL(`PDF10/${exportKey}/${documentInfo.id}`, endpointBaseUrl);
  const pdfResponse = await cityFetch(pdfUrl.href, { headers: { accept: 'application/pdf' } });
  const contentType = pdfResponse.headers.get('content-type') ?? '';
  if (!/application\/pdf/i.test(contentType)) {
    throw new Error(`Expected a City PDF for ${documentInfo.id}, received ${contentType}`);
  }
  const pdfBytes = Buffer.from(await pdfResponse.arrayBuffer());
  if (!pdfBytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    throw new Error(`City export ${documentInfo.id} does not start with a PDF signature`);
  }
  return {
    generateBytes: Buffer.from(generateText, 'utf8'),
    progressBytes: Buffer.from(`${JSON.stringify(progressRecords, null, 2)}\n`, 'utf8'),
    pdfBytes,
    responseHeaders: normalizedHeaders(pdfResponse.headers),
  };
}

const acquiredDocuments = [];
for (const selection of selectedDocuments) {
  const documentInfoResult = await postJson('DocumentService.aspx/GetBasicDocumentInfo', {
    repoName: 'Administration',
    entryId: selection.entryId,
  });
  const documentInfo = documentInfoResult.data;
  if (
    documentInfo.id !== selection.entryId
    || documentInfo.name !== selection.name
    || documentInfo.pageCount !== selection.expectedPageCount
    || documentInfo.hasImagedPages !== true
  ) {
    throw new Error(`Unexpected City support document metadata: ${JSON.stringify({
      selection,
      id: documentInfo.id,
      name: documentInfo.name,
      pageCount: documentInfo.pageCount,
      hasImagedPages: documentInfo.hasImagedPages,
    })}`);
  }

  const baseName = `${selection.entryId}-${slug(selection.name)}`;
  const exportResult = await exportPdf(documentInfo);
  const documentInfoPath = path.join(outputDirectory, `${baseName}-document-info.json`);
  const generatePath = path.join(outputDirectory, `${baseName}-pdf-generate-response.txt`);
  const progressPath = path.join(outputDirectory, `${baseName}-pdf-progress.json`);
  const headersPath = path.join(outputDirectory, `${baseName}-pdf-response-headers.json`);
  const pdfPath = path.join(outputDirectory, `${baseName}.pdf`);
  const headerBytes = Buffer.from(`${JSON.stringify(exportResult.responseHeaders, null, 2)}\n`, 'utf8');
  await Promise.all([
    writeFile(documentInfoPath, documentInfoResult.bytes),
    writeFile(generatePath, exportResult.generateBytes),
    writeFile(progressPath, exportResult.progressBytes),
    writeFile(headersPath, headerBytes),
    writeFile(pdfPath, exportResult.pdfBytes),
  ]);

  acquiredDocuments.push({
    entryId: selection.entryId,
    name: selection.name,
    pageCount: documentInfo.pageCount,
    imagedPageCount: documentInfo.pageInfos.filter(Boolean).length,
    imageDimensions: [...new Set(documentInfo.pageInfos.filter(Boolean).map((page) => (
      `${page.imageWidth}x${page.imageHeight}@${page.xdpi}x${page.ydpi}dpi`
    )))],
    publicDocumentUrl: new URL(
      `DocView.aspx?dbid=0&id=${selection.entryId}&repo=Administration`,
      endpointBaseUrl,
    ).href,
    inputs: {
      documentInfo: {
        path: path.relative(process.cwd(), documentInfoPath),
        sha256: sha256(documentInfoResult.bytes),
      },
      pdfGenerateResponse: {
        path: path.relative(process.cwd(), generatePath),
        sha256: sha256(exportResult.generateBytes),
      },
      pdfProgress: {
        path: path.relative(process.cwd(), progressPath),
        sha256: sha256(exportResult.progressBytes),
      },
      pdfResponseHeaders: {
        path: path.relative(process.cwd(), headersPath),
        sha256: sha256(headerBytes),
      },
      pdf: {
        path: path.relative(process.cwd(), pdfPath),
        sha256: sha256(exportResult.pdfBytes),
        byteLength: exportResult.pdfBytes.length,
      },
    },
  });
}

const stable = {
  analysisVersion: 'marlins-city-weblink-substantial-modification-support-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  source: {
    authority: 'City of Miami Office of the City Clerk',
    repositoryName: 'Administration',
    baseUrl: endpointBaseUrl.href,
    fileId: index.source.fileId,
    resolution: index.source.expectedResolution,
    recordStatus: 'Final',
  },
  inputs: {
    substantialModificationIndex: {
      path: path.relative(process.cwd(), indexPath),
      sha256: sha256(indexBytes),
      artifactVersion: index.artifactVersion,
    },
  },
  acquiredDocuments,
  acquisitionSummary: {
    documentCount: acquiredDocuments.length,
    totalPageCount: acquiredDocuments.reduce((sum, record) => sum + record.pageCount, 0),
    totalByteLength: acquiredDocuments.reduce((sum, record) => sum + record.inputs.pdf.byteLength, 0),
  },
  geometryBoundary: {
    establishesOfficialCitySupportDocumentCopies: true,
    establishesDocumentContentFindingsBeforeReview: false,
    establishesConstructionAsBuiltGeometry: false,
    establishesCurrentGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'SUPPORT_DOCUMENT_CONTENT_REVIEW_REQUIRED',
      'CONSTRUCTION_AS_BUILT_STATUS_NOT_ESTABLISHED',
      'CURRENT_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-substantial-modification-support-acquisition',
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
  acquiredDocuments: acquiredDocuments.map((record) => ({
    entryId: record.entryId,
    name: record.name,
    pageCount: record.pageCount,
    pdf: record.inputs.pdf,
  })),
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
