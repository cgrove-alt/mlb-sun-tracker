import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

const itemId = option('item', '83fd50fdc0704488b58ea76e706ec0d7');
const layerUrl = option(
  'layer',
  'https://services.arcgis.com/fLeGjb7u4uXqeF9q/arcgis/rest/services/building_footprints/FeatureServer/0',
)?.replace(/\/$/, '');
const address = option('address', '1 CITIZENS BANK WAY');
const outputPath = resolve(option(
  'output',
  'tmp/lidar/phillies-phila-current-building-footprint-2026.json',
));
if (!itemId || !layerUrl || !address) {
  throw new Error('Required: --item, --layer, and --address');
}

const itemUrl = `https://www.arcgis.com/sharing/rest/content/items/${itemId}?f=json`;
const layerMetadataUrl = `${layerUrl}?f=json`;
const queryUrl = new URL(`${layerUrl}/query`);
queryUrl.searchParams.set('where', `address = '${address.replaceAll("'", "''")}'`);
queryUrl.searchParams.set('outFields', '*');
queryUrl.searchParams.set('returnGeometry', 'true');
queryUrl.searchParams.set('outSR', '6347');
queryUrl.searchParams.set('orderByFields', 'objectid ASC');
queryUrl.searchParams.set('f', 'json');

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'mlb-sun-tracker-phila-building-footprint-audit/1.0',
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

const [itemResponse, layerResponse, queryResponse] = await Promise.all([
  fetchJson(itemUrl),
  fetchJson(layerMetadataUrl),
  fetchJson(queryUrl),
]);
const item = itemResponse.value;
const layer = layerResponse.value;
const features = queryResponse.value.features ?? [];
if (item.id !== itemId || item.orgId !== 'fLeGjb7u4uXqeF9q') {
  throw new Error('Building-footprint item is not in the expected City ArcGIS organisation');
}
if (item.owner !== 'maps.phl.data' || !item.tags?.includes('Authoritative')) {
  throw new Error('Building-footprint item no longer identifies City authority');
}
if (layer.name !== 'building_footprints' || layer.geometryType !== 'esriGeometryPolygon') {
  throw new Error('Unexpected building-footprint layer identity');
}
if (features.length !== 1) {
  throw new Error(`Expected one exact-address stadium footprint, received ${features.length}`);
}
const feature = features[0];
if (feature.attributes.address !== address) {
  throw new Error(`Unexpected feature address ${feature.attributes.address}`);
}
if (!Array.isArray(feature.geometry?.rings) || feature.geometry.rings.length === 0) {
  throw new Error('Stadium footprint has no polygon rings');
}
const vertices = feature.geometry.rings.flat();
const x = vertices.map((point) => point[0]);
const y = vertices.map((point) => point[1]);
const positionalAccuracyReported = /\b(?:accuracy|ce95|rmse|positional)\b/i.test([
  item.description,
  item.snippet,
  item.accessInformation,
  item.licenseInfo,
  layer.description,
  layer.copyrightText,
].filter(Boolean).join('\n'))
  && !/makes no representation about the accuracy/i.test(item.licenseInfo ?? '');
const stable = {
  stadiumId: 'phillies',
  source: {
    provider: 'City of Philadelphia Licenses and Inspections',
    itemId,
    itemUrl,
    layerUrl,
    queryUrl: queryUrl.toString(),
    owner: item.owner,
    organisationId: item.orgId,
    itemTitle: item.title,
    itemTags: item.tags,
    itemSnippet: item.snippet,
    itemCreatedEpochMs: item.created,
    itemModifiedEpochMs: item.modified,
    layerDescription: layer.description,
    layerLastEditEpochMs: layer.editingInfo?.lastEditDate ?? null,
    layerDataLastEditEpochMs: layer.editingInfo?.dataLastEditDate ?? null,
    licenseInfo: item.licenseInfo,
  },
  responseChecksums: {
    item: { sha256: itemResponse.sha256, byteLength: itemResponse.byteLength },
    layer: { sha256: layerResponse.sha256, byteLength: layerResponse.byteLength },
    query: { sha256: queryResponse.sha256, byteLength: queryResponse.byteLength },
  },
  coordinateReferenceSystem: {
    wkid: queryResponse.value.spatialReference?.latestWkid
      ?? queryResponse.value.spatialReference?.wkid,
    name: 'NAD83(2011) / UTM zone 18N',
    horizontalUnits: 'metres',
    attributeMeasurementUnits: 'feet per layer metadata',
  },
  footprint: {
    objectId: feature.attributes.objectid,
    bin: feature.attributes.bin,
    address: feature.attributes.address,
    parcelId: feature.attributes.parcel_id_num,
    parcelIdSource: feature.attributes.parcel_id_source,
    baseElevationFt: feature.attributes.base_elevation,
    approximateHeightFt: feature.attributes.approx_hgt,
    maximumHeightFt: feature.attributes.max_hgt,
    reportedSquareFt: feature.attributes.square_ft,
    ringCount: feature.geometry.rings.length,
    vertexCount: vertices.length,
    boundsMetres: {
      minimumX: Math.min(...x),
      minimumY: Math.min(...y),
      maximumX: Math.max(...x),
      maximumY: Math.max(...y),
    },
    rings: feature.geometry.rings,
  },
  accuracyEvidence: {
    positionalAccuracyReported,
    featureLevelAcquisitionDateReported: false,
    featureLevelLastEditDateReported: false,
    heightAccuracyReported: false,
    heightSemanticsSufficientForRayCasting: false,
  },
  geometryBoundary: {
    establishesCurrentCityFootprintCandidate: true,
    establishesCandidateProjectedPlanCoordinates: true,
    establishesSubFootAbsoluteHorizontalAccuracy: false,
    establishesCompleteExteriorRoofShape: false,
    establishesOverhangUndersides: false,
    establishesInteriorBowlObstructions: false,
    establishesWatertightShadowCastingVolume: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'FEATURE_LEVEL_CURRENCY_NOT_REPORTED',
      'HORIZONTAL_POSITIONAL_ACCURACY_NOT_REPORTED',
      'HEIGHT_ACCURACY_AND_SEMANTICS_NOT_REPORTED',
      'OVERHANG_UNDERSIDES_NOT_CAPTURED',
      'INTERIOR_BOWL_OBSTRUCTIONS_NOT_CAPTURED',
      'WATERTIGHT_SHADOW_CASTING_VOLUME_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'philadelphia-current-building-footprint-candidate',
  artifactVersion: `sha256:${createHash('sha256')
    .update(JSON.stringify(stable))
    .digest('hex')}`,
  acquiredOn: new Date().toISOString(),
  ...stable,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  footprint: {
    objectId: artifact.footprint.objectId,
    ringCount: artifact.footprint.ringCount,
    vertexCount: artifact.footprint.vertexCount,
    baseElevationFt: artifact.footprint.baseElevationFt,
    approximateHeightFt: artifact.footprint.approximateHeightFt,
    maximumHeightFt: artifact.footprint.maximumHeightFt,
  },
  publication: artifact.publication,
}, null, 2));
