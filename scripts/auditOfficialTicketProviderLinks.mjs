#!/usr/bin/env node

/** Capture rendered ticket-provider links from an official MLB ticket page. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
for (const name of ['stadium', 'url', 'official-page', 'official-acquisition', 'output']) {
  if (typeof args[name] !== 'string') throw new Error(`Required: --${name}=VALUE`);
}
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const pageBytes = await readFile(resolve(args['official-page']));
const acquisition = JSON.parse(await readFile(resolve(args['official-acquisition']), 'utf8'));
if (
  acquisition.artifactKind !== 'official-mlb-page-acquisition'
  || acquisition.sha256 !== sha256(pageBytes)
) {
  throw new Error('Official page acquisition lineage is invalid');
}
if (acquisition.resolvedUrl !== args.url) {
  throw new Error('Official page acquisition URL does not match requested live page');
}

const browser = await chromium.launch({
  headless: true,
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
const networkUrls = new Set();
page.on('response', (response) => {
  const url = response.url();
  if (/ticket|seat|event|game|inventory|map/i.test(url)) networkUrls.add(url);
});
try {
  await page.goto(args.url, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(10_000);
  const frames = [];
  for (const frame of page.frames()) {
    let anchors = [];
    try {
      anchors = await frame.locator('a[href]').evaluateAll((elements) => elements.map((element) => ({
        href: element.href,
        text: element.textContent?.replace(/\s+/g, ' ').trim() || null,
        ariaLabel: element.getAttribute('aria-label'),
        title: element.getAttribute('title'),
      })));
    } catch {
      anchors = [];
    }
    frames.push({ url: frame.url(), anchors });
  }
  const allAnchors = frames.flatMap((frame) => frame.anchors.map((anchor) => ({
    ...anchor,
    frameUrl: frame.url,
  })));
  const ticketProviderAnchors = allAnchors.filter((anchor) =>
    /ticketmaster|tickets\.com|seatgeek|ticket|seat|purchase|buy/i.test(anchor.href)
    || /ticket|seat|purchase|buy/i.test(anchor.text ?? ''));
  const stable = {
    stadiumId: args.stadium,
    officialPageArtifactVersion: acquisition.artifactVersion,
    livePageUrl: page.url(),
    frames,
    ticketProviderAnchors,
    networkUrls: [...networkUrls].sort(),
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'official-mlb-rendered-ticket-provider-audit',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    auditedOn: new Date().toISOString(),
    officialPage: {
      sourceUrl: acquisition.sourceUrl,
      artifactVersion: acquisition.artifactVersion,
      sha256: acquisition.sha256,
    },
    ...stable,
  };
  const outputPath = resolve(args.output);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    frames: frames.length,
    anchors: allAnchors.length,
    ticketProviderAnchors: ticketProviderAnchors.length,
    ticketLikeNetworkResponses: networkUrls.size,
  }, null, 2));
} finally {
  await browser.close();
}
