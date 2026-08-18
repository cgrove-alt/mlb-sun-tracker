#!/usr/bin/env node

/**
 * Acquire a small, reproducible public panorama pair for geometry research.
 *
 * The files are public viewer assets, but public access does not establish a
 * redistribution license. Images remain research inputs in tmp and are never
 * promoted as publication geometry.
 *
 * Usage:
 *   node scripts/extract3dVenuePanoramaPair.mjs \
 *     <map-url> <venue-resource-root> <viewer-version> <output-dir> <seat-id>...
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const [mapUrl, venueResourceRoot, viewerVersion, outputDirectory, ...seatArguments] = process.argv.slice(2);
const seatIds = [];
for (const argument of seatArguments) {
  if (argument.startsWith('@')) {
    const listPath = argument.slice(1);
    const list = (await readFile(listPath, 'utf8'))
      .split(/\r?\n/)
      .map((value) => value.trim())
      .filter(Boolean);
    seatIds.push(...list);
  } else {
    seatIds.push(argument);
  }
}
if (!mapUrl || !venueResourceRoot || !viewerVersion || !outputDirectory || seatIds.length < 2) {
  console.error(
    'Usage: node scripts/extract3dVenuePanoramaPair.mjs <map-url> <venue-resource-root> <viewer-version> <output-dir> <seat-id>...',
  );
  process.exit(2);
}
if (!seatIds.every((seatId) => /^S_[A-Za-z0-9]+-[A-Za-z0-9]+-[A-Za-z0-9]+$/.test(seatId))) {
  throw new Error('Every seat ID must use the S_section-row-seat form');
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

try {
  await page.goto(mapUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(5_000);
  const resourceRoot = venueResourceRoot.replace(/\/$/, '');
  const viewerConfigUrl = `${resourceRoot}/viewer3d/config.json?v=${encodeURIComponent(viewerVersion)}`;
  const viewerConfigResource = await page.evaluate(async (url) => {
    const response = await fetch(url, { credentials: 'include' });
    return {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      config: response.ok ? await response.json() : null,
    };
  }, viewerConfigUrl);
  if (viewerConfigResource.status !== 200) {
    throw new Error(`Viewer config request failed with ${viewerConfigResource.status}`);
  }
  const panoramaSet = viewerConfigResource.config?.si;
  if (typeof panoramaSet !== 'string' || !/^v\d+(?:\.\d+)*$/.test(panoramaSet)) {
    throw new Error(`Viewer config returned invalid panorama set ${JSON.stringify(panoramaSet)}`);
  }
  const panoRoot = `${resourceRoot}/viewer3d/panos/${panoramaSet}`;
  await mkdir(outputDirectory, { recursive: true });
  const images = [];
  for (const seatId of seatIds) {
    const resource = await page.evaluate(async ({ id, root, version }) => {
      const configUrl = `${root}/${id}/config.json?v=${encodeURIComponent(version)}`;
      const panoramaUrl = `${root}/${id}/spherical/hres/pano.jpg?v=${encodeURIComponent(version)}`;
      const [configResponse, panoramaResponse] = await Promise.all([
        fetch(configUrl, { credentials: 'include' }),
        fetch(panoramaUrl, { credentials: 'include' }),
      ]);
      return {
        seatId: id,
        configUrl,
        panoramaUrl,
        configStatus: configResponse.status,
        panoramaStatus: panoramaResponse.status,
        configHeaders: Object.fromEntries(configResponse.headers.entries()),
        panoramaHeaders: Object.fromEntries(panoramaResponse.headers.entries()),
        config: configResponse.ok ? await configResponse.json() : null,
        panoramaBase64: panoramaResponse.ok
          ? arrayBufferToBase64(await panoramaResponse.arrayBuffer())
          : null,
      };

      function arrayBufferToBase64(arrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer);
        const batchSize = 32_768;
        let binary = '';
        for (let offset = 0; offset < bytes.length; offset += batchSize) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + batchSize));
        }
        return btoa(binary);
      }
    }, { id: seatId, root: panoRoot, version: viewerVersion });
    if (resource.configStatus !== 200 || resource.panoramaStatus !== 200) {
      throw new Error(
        `Failed to acquire ${seatId}: config ${resource.configStatus}, panorama ${resource.panoramaStatus}`,
      );
    }
    const imageBuffer = Buffer.from(resource.panoramaBase64, 'base64');
    const imagePath = path.resolve(outputDirectory, `${resource.seatId}.jpg`);
    await writeFile(imagePath, imageBuffer);
    const metadata = await sharp(imageBuffer).metadata();
    images.push({
      seatId: resource.seatId,
      config: resource.config,
      configUrl: resource.configUrl,
      panoramaUrl: resource.panoramaUrl,
      configLastModified: resource.configHeaders['last-modified'] ?? null,
      panoramaLastModified: resource.panoramaHeaders['last-modified'] ?? null,
      panoramaEtag: resource.panoramaHeaders.etag ?? null,
      localPath: imagePath,
      imageSha256: sha256(imageBuffer),
      imageBytes: imageBuffer.length,
      width: metadata.width ?? null,
      height: metadata.height ?? null,
      format: metadata.format ?? null,
    });
    console.error(`Acquired ${images.length}/${seatIds.length}: ${seatId}`);
  }

  const baselineMode = images.length <= 24 ? 'all-pairs' : 'consecutive-input-pairs';
  const baselines = [];
  for (let leftIndex = 0; leftIndex < images.length; leftIndex += 1) {
    const rightLimit = baselineMode === 'all-pairs'
      ? images.length
      : Math.min(images.length, leftIndex + 2);
    for (let rightIndex = leftIndex + 1; rightIndex < rightLimit; rightIndex += 1) {
      const left = images[leftIndex];
      const right = images[rightIndex];
      const leftPosition = left.config?.p;
      const rightPosition = right.config?.p;
      baselines.push({
        leftSeatId: left.seatId,
        rightSeatId: right.seatId,
        baselineMetres: (
          Array.isArray(leftPosition)
          && Array.isArray(rightPosition)
          && leftPosition.length === 3
          && rightPosition.length === 3
        ) ? Math.hypot(
          leftPosition[0] - rightPosition[0],
          leftPosition[1] - rightPosition[1],
          leftPosition[2] - rightPosition[2],
        ) : null,
      });
    }
  }

  const manifest = {
    schemaVersion: 1,
    artifactKind: 'public-venue-panorama-geometry-research-input',
    extractedOn: new Date().toISOString(),
    mapUrl,
    venueResourceRoot: resourceRoot,
    viewerVersion,
    viewerConfig: {
      url: viewerConfigUrl,
      lastModified: viewerConfigResource.headers['last-modified'] ?? null,
      etag: viewerConfigResource.headers.etag ?? null,
      value: viewerConfigResource.config,
    },
    panoramaSet,
    images,
    baselineMode,
    baselines,
    licenseAssessment: {
      publicAccessConfirmed: true,
      redistributionTermsEstablished: false,
      permittedUseInThisArtifact: 'local-research-input-only',
    },
    publication: {
      eligible: false,
      blockers: [
        'PANORAMA_DEPTH_NOT_PROVIDED',
        'CAMERA_AXIS_SEMANTICS_NOT_INDEPENDENTLY_ESTABLISHED',
        'VENUE_LOCAL_FRAME_NOT_RELEASE_REGISTERED',
        'IMAGE_REUSE_TERMS_NOT_ESTABLISHED',
      ],
    },
  };
  const manifestPath = path.resolve(outputDirectory, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify({
    manifestPath,
    imageCount: images.length,
    images: images.map((image) => ({
      seatId: image.seatId,
      width: image.width,
      height: image.height,
      imageSha256: image.imageSha256,
    })),
    baselines,
    publicationEligible: false,
  }, null, 2));
} finally {
  await browser.close();
}
