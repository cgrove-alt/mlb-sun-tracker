#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

function argument(name, fallback = undefined) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function normalizeText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

function collectPotentialGeometryReferences(value, currentPath = '$', output = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectPotentialGeometryReferences(item, `${currentPath}[${index}]`, output));
    return output;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      const childPath = `${currentPath}.${key}`;
      if (/sketch|drawing|diagram|plan|photo|image|building|structure|floor|area/i.test(key)) {
        output.push({ path: childPath, value: child });
      }
      collectPotentialGeometryReferences(child, childPath, output);
    }
    return output;
  }
  if (typeof value === 'string' && /sketch|drawing|diagram|plan|photo|image|building|structure|floor/i.test(value)) {
    output.push({ path: currentPath, value });
  }
  return output;
}

const scheduleNumber = argument('schedule-number');
const outputPath = path.resolve(argument('output', 'tmp/lidar/denver-property-record.json'));
if (!/^\d{13}$/.test(scheduleNumber ?? '')) {
  throw new Error('Required: --schedule-number=13-DIGIT-SCHEDULE-NUMBER');
}
await mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  });
  const sourceUrl = `https://property.spatialest.com/co/denver/#/property/${scheduleNumber}`;
  const responsePromise = page.waitForResponse((response) => (
    response.url().includes(`/api/v1/recordcard/${scheduleNumber}`)
  ), { timeout: 60000 });
  const landingResponse = await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const recordResponse = await responsePromise;
  if (!recordResponse.ok()) {
    throw new Error(`Denver property record returned HTTP ${recordResponse.status()}`);
  }
  const recordBytes = Buffer.from(await recordResponse.body());
  const recordPayload = JSON.parse(recordBytes.toString('utf8'));
  await page.waitForTimeout(5000);
  const bodyText = (await page.locator('body').innerText()).replace(/\s+\n/g, '\n').trim();
  if (!bodyText.includes(scheduleNumber)) {
    throw new Error(`Rendered property record does not contain schedule number ${scheduleNumber}`);
  }
  const links = await page.locator('a').evaluateAll((elements) => elements.map((element) => ({
    text: String(element.textContent ?? '').trim().replace(/\s+/g, ' '),
    href: element.href || null,
    title: element.getAttribute('title'),
  })).filter((link) => link.text || link.href));
  const potentialGeometryReferences = collectPotentialGeometryReferences(recordPayload).map((entry) => ({
    path: entry.path,
    value: typeof entry.value === 'string' || typeof entry.value === 'number' || typeof entry.value === 'boolean'
      ? entry.value
      : JSON.stringify(entry.value),
  }));

  const stable = {
    sourceUrl,
    landingResponseStatus: landingResponse?.status() ?? null,
    recordResponseUrl: recordResponse.url(),
    recordResponseStatus: recordResponse.status(),
    recordResponseHeaders: {
      contentType: recordResponse.headers()['content-type'] ?? null,
      contentLength: recordResponse.headers()['content-length'] ?? null,
      etag: recordResponse.headers().etag ?? null,
      lastModified: recordResponse.headers()['last-modified'] ?? null,
    },
    scheduleNumber,
    recordPayloadSha256: sha256(recordBytes),
    recordPayload,
    renderedUrl: page.url(),
    renderedBodyTextSha256: sha256(bodyText),
    renderedBodyText: bodyText,
    links,
    potentialGeometryReferences,
  };
  const artifact = {
    schemaVersion: 1,
    analysisVersion: 'denver-public-property-record-acquisition-v1',
    artifactStage: 'official-denver-assessor-record-discovery',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    acquiredOn: new Date().toISOString(),
    ...stable,
    geometryBoundary: {
      measuredStadiumGeometryEstablished: false,
      note: 'Assessor record data is metadata unless an independently reviewed measurement-bearing attachment is acquired.',
    },
    publicationEligible: false,
    blockers: [
      'ASSESSOR_RECORD_METADATA_IS_NOT_MEASURED_STADIUM_GEOMETRY',
      'MEASUREMENT_BEARING_ATTACHMENTS_REQUIRE_SEPARATE_REVIEW',
    ],
  };
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    scheduleNumber,
    recordPayloadSha256: artifact.recordPayloadSha256,
    potentialGeometryReferenceCount: potentialGeometryReferences.length,
    renderedLinkCount: links.length,
  }, null, 2)}\n`);
} finally {
  await browser.close();
}
