import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

const itemId = option('item', '4bba468b846b45bdb132d82758e5a652');
const layerUrl = option(
  'layer',
  'https://services.arcgis.com/PMTtzuTB6WiPuNSv/arcgis/rest/services/CBP_Rows/FeatureServer/3',
)?.replace(/\/$/, '');
const outputPath = resolve(option(
  'output',
  'tmp/lidar/phillies-arcgis-row-control-metadata-audit-2026.json',
));
if (!itemId || !layerUrl) throw new Error('Required: --item and --layer');

const endpoints = {
  item: `https://www.arcgis.com/sharing/rest/content/items/${itemId}?f=json`,
  itemData: `https://www.arcgis.com/sharing/rest/content/items/${itemId}/data?f=json`,
  layer: `${layerUrl}?f=json`,
};

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'mlb-sun-tracker-row-control-metadata-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const text = await response.text();
  const value = JSON.parse(text);
  if (value.error) {
    throw new Error(`ArcGIS error ${value.error.code}: ${value.error.message}`);
  }
  return {
    value,
    sha256: createHash('sha256').update(text).digest('hex'),
    byteLength: Buffer.byteLength(text),
  };
}

const [itemResponse, itemDataResponse, layerResponse] = await Promise.all([
  fetchJson(endpoints.item),
  fetchJson(endpoints.itemData),
  fetchJson(endpoints.layer),
]);
const item = itemResponse.value;
const layer = layerResponse.value;
if (item.id !== itemId) throw new Error('ArcGIS item ID changed unexpectedly');
if (layer.id !== 3 || layer.name !== 'CBP_Rows') {
  throw new Error(`Unexpected ArcGIS layer identity ${layer.id}:${layer.name}`);
}

const positionalTerms = [
  /\baccuracy\b/i,
  /\bce95\b/i,
  /\brmse\b/i,
  /\blineage\b/i,
  /\bpositional\b/i,
  /\bsurvey(?:ed|ing)?\b/i,
];
const metadataText = [
  item.description,
  item.snippet,
  item.documentation,
  item.accessInformation,
  item.licenseInfo,
  layer.description,
  layer.copyrightText,
].filter((value) => typeof value === 'string' && value.trim()).join('\n');
const positionalAccuracyTermsFound = positionalTerms
  .filter((pattern) => pattern.test(metadataText))
  .map((pattern) => pattern.source);
const owner = String(item.owner ?? '');
const authorityAssessment = {
  owner,
  ownerIdentifiesPhillies: /phillies/i.test(owner),
  ownerIdentifiesPhiladelphiaGovernment: /phila(?:delphia)?(?:\.gov|_gov|government)/i.test(owner),
  ownerIdentifiesEsriCommunityAccount: /@esri\.com_commteam/i.test(owner),
  authoritativeClubOrMunicipalProvenanceEstablished: false,
  positionalAccuracyReported: positionalAccuracyTermsFound.length > 0,
};
const stable = {
  stadiumId: 'phillies',
  endpoints,
  responseChecksums: {
    item: { sha256: itemResponse.sha256, byteLength: itemResponse.byteLength },
    itemData: { sha256: itemDataResponse.sha256, byteLength: itemDataResponse.byteLength },
    layer: { sha256: layerResponse.sha256, byteLength: layerResponse.byteLength },
  },
  itemMetadata: {
    id: item.id,
    owner: item.owner,
    organisationId: item.orgId,
    title: item.title,
    type: item.type,
    createdEpochMs: item.created,
    modifiedEpochMs: item.modified,
    description: item.description,
    snippet: item.snippet,
    documentation: item.documentation,
    accessInformation: item.accessInformation,
    licenseInfo: item.licenseInfo,
    access: item.access,
    listed: item.listed,
  },
  layerMetadata: {
    id: layer.id,
    name: layer.name,
    description: layer.description,
    copyrightText: layer.copyrightText,
    type: layer.type,
    geometryType: layer.geometryType,
    spatialReference: layer.spatialReference,
    lastEditEpochMs: layer.editingInfo?.lastEditDate ?? null,
    dataLastEditEpochMs: layer.editingInfo?.dataLastEditDate ?? null,
    capabilities: layer.capabilities,
  },
  metadataTextReview: {
    positionalAccuracyTermsFound,
    reviewedFields: [
      'item.description',
      'item.snippet',
      'item.documentation',
      'item.accessInformation',
      'item.licenseInfo',
      'layer.description',
      'layer.copyrightText',
    ],
  },
  authorityAssessment,
  evidenceBoundary: {
    establishesPublicAvailability: item.access === 'public',
    establishesRowPolygonSourceConsistencyControl: true,
    establishesClubOrMunicipalAuthority: false,
    establishesPhysicalMeasurement: false,
    establishesSubFootHorizontalAccuracy: false,
    establishesCurrentGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'ROW_CONTROL_NOT_CLUB_OR_MUNICIPAL_AUTHORITATIVE',
      'ROW_CONTROL_POSITIONAL_ACCURACY_NOT_REPORTED',
      'ROW_CONTROL_SOURCE_LINEAGE_NOT_REPORTED',
      'ROW_CONTROL_STALE_SINCE_2019',
      'ROW_CONTROL_HAS_NO_VERTICAL_GEOMETRY',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'arcgis-row-control-live-metadata-audit',
  artifactVersion: `sha256:${createHash('sha256')
    .update(JSON.stringify(stable))
    .digest('hex')}`,
  auditedOn: new Date().toISOString(),
  ...stable,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  authorityAssessment,
  publication: artifact.publication,
}, null, 2));
