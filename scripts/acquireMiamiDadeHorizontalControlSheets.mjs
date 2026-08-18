#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const WEB_MAP_ITEM_ID = '9917360a2407461596b71f034cfef8ba';
const EXPECTED_LAYER_URL = 'https://gisweb.miamidade.gov/arcgis/rest/services/PW/PWhorizontal/MapServer/0';
const EXPECTED_SHEET_TEMPLATE = 'https://gisweb.miamidade.gov/survey/images/{NAME}.pdf';
const CONTROL_NAMES = [
  'AUSTIN',
  'BP-2',
  'BP-3',
  'HERMAN_AZMK',
  'NICOLAS',
  'PULSE',
  'RR SPIKE',
  'TATO',
];

function option(name) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length);
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

function artifactVersion(value) {
  return `sha256:${sha256(JSON.stringify(canonicalJson(value)))}`;
}

async function fetchResponse(url, accept) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      accept,
      'user-agent': 'mlb-sun-tracker-miami-dade-horizontal-control-research/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response;
}

async function fetchJson(url) {
  const response = await fetchResponse(url, 'application/json');
  const bytes = Buffer.from(await response.arrayBuffer());
  const value = JSON.parse(bytes.toString('utf8'));
  if (value.error) {
    throw new Error(`ArcGIS error ${value.error.code}: ${value.error.message}`);
  }
  return {
    value,
    request: {
      requestedUrl: url,
      resolvedUrl: response.url,
      responseDate: response.headers.get('date'),
      contentType: response.headers.get('content-type'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      byteLength: bytes.length,
      sha256: sha256(bytes),
    },
  };
}

async function fetchPdf(url) {
  const response = await fetchResponse(url, 'application/pdf');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!bytes.subarray(0, 5).equals(Buffer.from('%PDF-'))) {
    throw new Error(`Response is not a PDF: ${url}`);
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/pdf')) {
    throw new Error(`Unexpected PDF content type ${contentType}: ${url}`);
  }
  return {
    bytes,
    request: {
      requestedUrl: url,
      resolvedUrl: response.url,
      responseDate: response.headers.get('date'),
      contentType,
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      byteLength: bytes.length,
      sha256: sha256(bytes),
    },
  };
}

function extractPopupText(layer) {
  return (layer.popupInfo?.popupElements ?? [])
    .filter((element) => element.type === 'text')
    .map((element) => String(element.text ?? ''))
    .join('\n');
}

async function main() {
  const outputArgument = option('output-dir');
  if (!outputArgument) {
    throw new Error('Usage: acquireMiamiDadeHorizontalControlSheets.mjs --output-dir=PATH');
  }
  const outputDirectory = path.resolve(outputArgument);
  await mkdir(outputDirectory, { recursive: true });

  const itemUrl = `https://www.arcgis.com/sharing/rest/content/items/${WEB_MAP_ITEM_ID}?f=json`;
  const itemDataUrl = `https://www.arcgis.com/sharing/rest/content/items/${WEB_MAP_ITEM_ID}/data?f=json`;
  const [itemResponse, dataResponse] = await Promise.all([
    fetchJson(itemUrl),
    fetchJson(itemDataUrl),
  ]);
  const item = itemResponse.value;
  if (item.id !== WEB_MAP_ITEM_ID || item.type !== 'Web Map' || item.access !== 'public') {
    throw new Error('Miami-Dade survey-control web map identity or public access changed');
  }
  const horizontalLayer = dataResponse.value.operationalLayers?.find(
    (layer) => layer.url === EXPECTED_LAYER_URL,
  );
  if (!horizontalLayer) throw new Error('Expected horizontal control layer is missing');
  const popupText = extractPopupText(horizontalLayer);
  if (!popupText.includes(EXPECTED_SHEET_TEMPLATE)) {
    throw new Error('Official control-sheet link template changed');
  }

  const query = new URL(`${EXPECTED_LAYER_URL}/query`);
  query.searchParams.set('where', `NAME IN ('${CONTROL_NAMES.join("','")}')`);
  query.searchParams.set('outFields', '*');
  query.searchParams.set('returnGeometry', 'true');
  query.searchParams.set('outSR', '6438');
  query.searchParams.set('f', 'json');
  const featureResponse = await fetchJson(query.toString());
  const features = featureResponse.value.features ?? [];
  const featureByName = new Map(features.map((feature) => [feature.attributes?.NAME, feature]));
  if (features.length !== CONTROL_NAMES.length || CONTROL_NAMES.some((name) => !featureByName.has(name))) {
    throw new Error('Did not obtain every requested nearby county control from the official layer');
  }

  const sheetRecords = [];
  for (const name of CONTROL_NAMES) {
    const url = EXPECTED_SHEET_TEMPLATE.replace('{NAME}', encodeURIComponent(name));
    const pdf = await fetchPdf(url);
    const outputPath = path.join(outputDirectory, `${name}.pdf`);
    await writeFile(outputPath, pdf.bytes);
    const feature = featureByName.get(name);
    sheetRecords.push({
      name,
      officialFeature: feature,
      outputPath,
      ...pdf.request,
    });
  }

  const stable = {
    artifactKind: 'miami-dade-horizontal-control-sheet-acquisition',
    acquiredOn: new Date().toISOString(),
    officialWebMap: {
      itemId: WEB_MAP_ITEM_ID,
      title: item.title,
      owner: item.owner,
      modifiedEpochMilliseconds: item.modified,
      itemRequest: itemResponse.request,
      dataRequest: dataResponse.request,
    },
    horizontalLayer: {
      title: horizontalLayer.title,
      url: horizontalLayer.url,
      controlSheetUrlTemplate: EXPECTED_SHEET_TEMPLATE,
      queryRequest: featureResponse.request,
      coordinateReferenceSystem: 'EPSG:6438',
    },
    sheets: sheetRecords,
    publication: {
      eligible: false,
      blockers: [
        'CONTROL_SHEETS_NOT_REVIEWED',
        'CONTROL_ACCURACY_NOT_YET_ESTABLISHED',
        'CURRENT_MONUMENT_RECOVERY_NOT_YET_ESTABLISHED',
        'LIDAR_CORRESPONDENCE_NOT_YET_ESTABLISHED',
      ],
    },
  };
  const artifact = {
    schemaVersion: 1,
    artifactVersion: artifactVersion(stable),
    ...stable,
  };
  const manifestPath = path.join(outputDirectory, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    manifestPath,
    artifactVersion: artifact.artifactVersion,
    sheets: artifact.sheets.map((sheet) => ({
      name: sheet.name,
      byteLength: sheet.byteLength,
      sha256: sheet.sha256,
      lastModified: sheet.lastModified,
    })),
    publicationEligible: artifact.publication.eligible,
  }, null, 2));
}

await main();
