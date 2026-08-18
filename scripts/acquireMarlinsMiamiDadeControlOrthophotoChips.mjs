#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SERVICE_URL = 'https://imageserverintra.miamidade.gov/arcgis/rest/services/WGS1984_WebMercator/2025_Woolpert_WGS1984_WebMercator/ImageServer';
const TARGET_CRS = 'EPSG:6438';
const TARGET_WKID = '6438';
const PIXEL_SIZE_FEET = 0.25;
const CHIP_SPAN_FEET = 100;

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

async function fetchBytes(url, accept) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      accept,
      'user-agent': 'mlb-sun-tracker-miami-dade-control-orthophoto-research/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    bytes,
    request: {
      requestedUrl: url.toString(),
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

async function fetchJson(url) {
  const response = await fetchBytes(url, 'application/json');
  const value = JSON.parse(response.bytes.toString('utf8'));
  if (value.error) throw new Error(`ArcGIS error ${value.error.code}: ${value.error.message}`);
  return { value, request: response.request };
}

async function main() {
  const transformsArgument = option('transforms');
  const outputArgument = option('output-dir');
  if (!transformsArgument || !outputArgument) {
    throw new Error('Usage: acquireMarlinsMiamiDadeControlOrthophotoChips.mjs --transforms=PATH --output-dir=PATH');
  }
  const transformsPath = path.resolve(transformsArgument);
  const outputDirectory = path.resolve(outputArgument);
  const transformsBytes = await readFile(transformsPath);
  const transforms = JSON.parse(transformsBytes.toString('utf8'));
  if (transforms.targetCoordinateReferenceSystem !== TARGET_CRS) {
    throw new Error(`Transform target must be ${TARGET_CRS}`);
  }
  const training = transforms.controls.filter((control) => control.role === 'training');
  const holdouts = transforms.controls.filter((control) => control.role === 'final-holdout');
  if (training.length < 3 || holdouts.length < 3) {
    throw new Error('At least three training and three final-holdout controls are required');
  }
  await mkdir(outputDirectory, { recursive: true });

  const metadataUrl = new URL(SERVICE_URL);
  metadataUrl.searchParams.set('f', 'json');
  const metadataResponse = await fetchJson(metadataUrl);
  const metadata = metadataResponse.value;
  if (metadata.name !== 'WGS1984_WebMercator/2025_Woolpert_WGS1984_WebMercator') {
    throw new Error('Unexpected official 2025 orthophoto service identity');
  }
  if (metadata.pixelSizeX !== 0.07620015240030541 || metadata.pixelSizeY !== 0.07620015240030482) {
    throw new Error('Official orthophoto native pixel size changed');
  }

  const width = Math.round(CHIP_SPAN_FEET / PIXEL_SIZE_FEET);
  const height = width;
  const chips = [];
  for (const control of transforms.controls) {
    const centerX = control.target.eastingUsSurveyFeet;
    const centerY = control.target.northingUsSurveyFeet;
    const halfSpan = CHIP_SPAN_FEET / 2;
    const extent = {
      xmin: centerX - halfSpan,
      ymin: centerY - halfSpan,
      xmax: centerX + halfSpan,
      ymax: centerY + halfSpan,
    };

    const queryUrl = new URL(`${SERVICE_URL}/query`);
    queryUrl.searchParams.set('where', 'Category = 1');
    queryUrl.searchParams.set('outFields', '*');
    queryUrl.searchParams.set('geometry', `${centerX},${centerY}`);
    queryUrl.searchParams.set('geometryType', 'esriGeometryPoint');
    queryUrl.searchParams.set('inSR', TARGET_WKID);
    queryUrl.searchParams.set('spatialRel', 'esriSpatialRelIntersects');
    queryUrl.searchParams.set('returnGeometry', 'false');
    queryUrl.searchParams.set('f', 'json');
    const catalog = await fetchJson(queryUrl);
    if (!catalog.value.features?.length) {
      throw new Error(`No 2025 source catalog item covers ${control.id}`);
    }

    const exportUrl = new URL(`${SERVICE_URL}/exportImage`);
    exportUrl.searchParams.set('bbox', `${extent.xmin},${extent.ymin},${extent.xmax},${extent.ymax}`);
    exportUrl.searchParams.set('bboxSR', TARGET_WKID);
    exportUrl.searchParams.set('imageSR', TARGET_WKID);
    exportUrl.searchParams.set('size', `${width},${height}`);
    exportUrl.searchParams.set('format', 'png');
    exportUrl.searchParams.set('pixelType', 'U8');
    exportUrl.searchParams.set('noData', '0');
    exportUrl.searchParams.set('interpolation', 'RSP_NearestNeighbor');
    exportUrl.searchParams.set('f', 'image');
    const image = await fetchBytes(exportUrl, 'image/png');
    if (!image.bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
      throw new Error(`Export for ${control.id} is not a PNG`);
    }
    const outputPath = path.join(outputDirectory, `${control.id}.png`);
    await writeFile(outputPath, image.bytes);
    chips.push({
      id: control.id,
      role: control.role,
      mark: control.mark,
      expectedCenter: {
        eastingUsSurveyFeet: centerX,
        northingUsSurveyFeet: centerY,
      },
      extent,
      coordinateReferenceSystem: TARGET_CRS,
      width,
      height,
      pixelSizeFeet: PIXEL_SIZE_FEET,
      interpolation: 'nearest-neighbor',
      sourceCatalogItems: catalog.value.features.map((feature) => feature.attributes),
      catalogRequest: catalog.request,
      outputPath,
      imageRequest: image.request,
    });
  }

  const stable = {
    artifactKind: 'marlins-miami-dade-control-orthophoto-chips',
    acquiredOn: new Date().toISOString(),
    transforms: {
      path: transformsPath,
      sha256: sha256(transformsBytes),
      artifactVersion: transforms.artifactVersion,
      roleLock: transforms.roleLock,
    },
    source: {
      agency: 'Miami-Dade County',
      serviceUrl: SERVICE_URL,
      sourceYear: 2025,
      serviceMetadata: metadataResponse.request,
      nativeSpatialReference: metadata.spatialReference,
      nativePixelSize: {
        x: metadata.pixelSizeX,
        y: metadata.pixelSizeY,
      },
    },
    chips,
    accessProtocol: {
      training: 'Training chips may be reviewed and localized during method development.',
      finalHoldout: 'Final-holdout chips are acquired and checksummed but cannot be visually inspected, localized, or scored until the training registration method and transform are frozen.',
    },
    publication: {
      eligible: false,
      blockers: [
        'COUNTY_CONTROL_ACCURACY_NOT_ESTABLISHED',
        'TRAINING_MONUMENT_RECOVERY_NOT_ESTABLISHED',
        'TRAINING_TRANSFORM_NOT_FROZEN',
        'FINAL_HOLDOUTS_NOT_OPENED_OR_EVALUATED',
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
    trainingControlIds: training.map((control) => control.id),
    finalHoldoutControlIds: holdouts.map((control) => control.id),
    chips: chips.map((chip) => ({
      id: chip.id,
      role: chip.role,
      sha256: chip.imageRequest.sha256,
      byteLength: chip.imageRequest.byteLength,
    })),
    publicationEligible: artifact.publication.eligible,
  }, null, 2));
}

await main();
