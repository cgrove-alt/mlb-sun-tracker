#!/usr/bin/env node

/**
 * Acquire checksum-locked cube faces for selected public Sportsdigita section
 * panoramas linked from an official MLB seat-view page. Public access does not
 * establish redistribution rights, so these files remain local research inputs.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import JSON5 from 'json5';
import { chromium } from 'playwright';

function argument(name, fallback = undefined) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

const officialInspectionPath = path.resolve(argument(
  'official-inspection',
  'tmp/lidar/rockies-current-official-seat-viewer-inspection/manifest.json',
));
const mapUrl = argument('map-url', 'https://rockies.sportsdigita.com/venue/rockies/map/seats.json');
const cdnRoot = argument('cdn-root', 'https://seat-viewer.sportsdigita.com/rockies');
const sections = argument('sections', '205,206,207,208,209')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);
const outputDirectory = path.resolve(argument(
  'output',
  'tmp/lidar/rockies-current-official-right-field-section-panoramas',
));

const officialInspectionBytes = await readFile(officialInspectionPath);
const officialInspection = JSON.parse(officialInspectionBytes.toString('utf8'));
if (officialInspection?.artifactKind !== 'official-mlb-seat-viewer-discovery') {
  throw new Error('Official inspection is not an official-mlb-seat-viewer-discovery artifact');
}
if (!officialInspection.linkedViewerUrls.some((url) => url.includes('rockies.sportsdigita.com'))) {
  throw new Error('Official inspection does not establish the Sportsdigita viewer link');
}

await mkdir(outputDirectory, { recursive: true });
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
try {
  const page = await browser.newPage();
  await page.goto(officialInspection.sourceUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  const mapResponse = await page.request.get(mapUrl);
  if (!mapResponse.ok()) throw new Error(`Seat map failed with HTTP ${mapResponse.status()}`);
  const mapBytes = await mapResponse.body();
  const map = JSON5.parse(mapBytes.toString('utf8'));

  const records = [];
  for (const sectionId of sections) {
    const section = map.sections?.[sectionId];
    if (!section) throw new Error(`Section ${sectionId} is absent from the current viewer map`);
    if (!Array.isArray(section.subsections) || section.subsections.length !== 1) {
      throw new Error(`Section ${sectionId} does not have exactly one current panorama subsection`);
    }
    const panoramaId = section.subsections[0];
    const subsection = map.subsections?.[panoramaId];
    if (!subsection || String(subsection.section) !== sectionId) {
      throw new Error(`Panorama ${panoramaId} does not map back to section ${sectionId}`);
    }
    const images = [];
    for (const face of ['f', 'r', 'b', 'l', 'u', 'd']) {
      const url = `${cdnRoot}/${encodeURIComponent(panoramaId)}/${encodeURIComponent(panoramaId)}_${face}.jpg`;
      const response = await page.request.get(url);
      if (!response.ok()) {
        throw new Error(`Panorama ${panoramaId} face ${face} failed with HTTP ${response.status()}`);
      }
      const bytes = await response.body();
      const filename = `${panoramaId}_${face}.jpg`;
      const localPath = path.join(outputDirectory, filename);
      await writeFile(localPath, bytes);
      images.push({
        face,
        url,
        localPath,
        byteLength: bytes.length,
        sha256: sha256(bytes),
        contentType: response.headers()['content-type'] ?? null,
        contentLength: response.headers()['content-length'] ?? null,
        lastModified: response.headers()['last-modified'] ?? null,
        etag: response.headers().etag ?? null,
      });
    }
    records.push({
      sectionId,
      panoramaId,
      mapMetadata: {
        section: subsection.section,
        label: subsection.pano_footer_label ?? null,
        rowStartNotAvailable: subsection.row_start_na ?? null,
        rowEndNotAvailable: subsection.row_end_na ?? null,
        sectionTitle: subsection.section_title ?? null,
        hlookat: subsection.hlookat ?? null,
        vlookat: subsection.vlookat ?? null,
      },
      images,
    });
  }

  const stable = {
    officialInspection: {
      path: officialInspectionPath,
      sha256: sha256(officialInspectionBytes),
      artifactVersion: officialInspection.artifactVersion,
      sourceUrl: officialInspection.sourceUrl,
      linkedViewerUrls: officialInspection.linkedViewerUrls,
    },
    map: {
      url: mapUrl,
      byteLength: mapBytes.length,
      sha256: sha256(mapBytes),
      lastModified: mapResponse.headers()['last-modified'] ?? null,
      etag: mapResponse.headers().etag ?? null,
    },
    cdnRoot,
    sections: records,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'club-linked-section-panorama-research-input',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    acquiredOn: new Date().toISOString(),
    ...stable,
    licenseAssessment: {
      publicAccessConfirmed: true,
      redistributionTermsEstablished: false,
      permittedUseInThisArtifact: 'local-research-input-only',
    },
    conclusion: {
      sectionIdentitySupported: true,
      rowIdentitySupported: false,
      metricGeometrySupported: false,
      note: 'The club-linked viewer maps panorama IDs to section labels. It does not identify exact rows or provide surveyed geometry.',
    },
    publication: {
      eligible: false,
      blockers: [
        'PANORAMAS_ARE_RENDERED_IMAGERY_NOT_MEASURED_GEOMETRY',
        'EXACT_ROW_IDENTITY_NOT_ESTABLISHED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  const manifestPath = path.join(outputDirectory, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({
    manifestPath,
    artifactVersion: artifact.artifactVersion,
    mapSha256: artifact.map.sha256,
    sections: records.map((record) => ({
      sectionId: record.sectionId,
      panoramaId: record.panoramaId,
      imageCount: record.images.length,
      imageBytes: record.images.reduce((sum, image) => sum + image.byteLength, 0),
    })),
    publicationEligible: false,
  }, null, 2)}\n`);
} finally {
  await browser.close();
}
