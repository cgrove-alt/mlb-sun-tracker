#!/usr/bin/env node

/** Locate target identifiers in checksum-locked public 3D Digital Venue resources. */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const mapUrl = typeof args.url === 'string' ? args.url : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
const targets = typeof args.targets === 'string'
  ? args.targets.split(',').map((value) => value.trim()).filter(Boolean)
  : [];
if (!mapUrl || !outputPath || targets.length === 0) {
  throw new Error('Required: --url=URL --targets=ID,ID --output=PATH');
}
const parsedMapUrl = new URL(mapUrl);
if (
  parsedMapUrl.protocol !== 'https:'
  || !parsedMapUrl.hostname.endsWith('3ddigitalvenue.com')
) {
  throw new Error('The map URL must be an HTTPS 3D Digital Venue page');
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pending = new Set();
const matches = [];
const resourceErrors = [];

page.on('response', (response) => {
  const task = (async () => {
    const url = response.url();
    const contentType = response.headers()['content-type'] ?? '';
    if (!/(?:json|javascript|text|xml|svg|html)/i.test(contentType)) return;
    let body;
    try {
      body = await response.body();
    } catch (error) {
      resourceErrors.push({ url, error: String(error) });
      return;
    }
    if (body.length > 25_000_000) return;
    const text = body.toString('utf8');
    const matchedTargets = targets.filter((target) => text.includes(target));
    if (matchedTargets.length === 0) return;
    const snippets = matchedTargets.map((target) => {
      const index = text.indexOf(target);
      return {
        target,
        index,
        excerpt: text.slice(Math.max(0, index - 320), index + target.length + 520),
      };
    });
    matches.push({
      url,
      status: response.status(),
      contentType,
      byteLength: body.length,
      bodySha256: sha256(body),
      matchedTargets,
      snippets,
    });
  })();
  pending.add(task);
  task.finally(() => pending.delete(task));
});

try {
  await page.goto(mapUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(12_000);
  await Promise.allSettled(Array.from(pending));
  matches.sort((left, right) => left.url.localeCompare(right.url));
  const stable = {
    mapUrl,
    finalUrl: page.url(),
    targets,
    matches,
    resourceErrors,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-resource-string-audit',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    auditedOn: new Date().toISOString(),
    ...stable,
    conclusion: {
      matchedResourceCount: matches.length,
      targetsLocated: targets.filter((target) =>
        matches.some((match) => match.matchedTargets.includes(target))),
      targetsNotLocated: targets.filter((target) =>
        !matches.some((match) => match.matchedTargets.includes(target))),
    },
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    matches: matches.map((match) => ({
      url: match.url,
      status: match.status,
      contentType: match.contentType,
      byteLength: match.byteLength,
      bodySha256: match.bodySha256,
      matchedTargets: match.matchedTargets,
    })),
    conclusion: artifact.conclusion,
  }, null, 2));
} finally {
  await browser.close();
}
