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

const outputDirectory = path.resolve(argument('output', 'tmp/lidar/denver-epermits-search'));
const query = argument('query');
await mkdir(outputDirectory, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  });
  const consoleMessages = [];
  const responseRecords = [];
  page.on('console', (message) => consoleMessages.push({ type: message.type(), text: message.text() }));
  page.on('response', (pageResponse) => {
    const responseUrl = pageResponse.url();
    if (/accela|search|cap|record/i.test(responseUrl)) {
      responseRecords.push({ url: responseUrl, status: pageResponse.status() });
    }
  });
  const sourceUrl = 'https://www.denvergov.org/accelacitizenaccess/';
  const response = await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  if (query) {
    const searchInput = page.locator('#txtSearchCondition:visible');
    await searchInput.fill(query.replaceAll('-', ' '));
    await searchInput.press('Enter');
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(8000);
  }
  const html = await page.content();
  const screenshotPath = path.join(outputDirectory, query ? 'search-results.png' : 'landing-page.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  const controls = await page.locator('input, select, textarea, button, a').evaluateAll((elements) => (
    elements.map((element) => ({
      tag: element.tagName,
      id: element.id || null,
      name: element.getAttribute('name'),
      type: element.getAttribute('type'),
      text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 200),
      ariaLabel: element.getAttribute('aria-label'),
      placeholder: element.getAttribute('placeholder'),
      href: element instanceof HTMLAnchorElement ? element.href : null,
      visible: Boolean(element.getClientRects().length),
    }))
  ));
  const stable = {
    sourceUrl,
    query: query ?? null,
    resolvedUrl: page.url(),
    responseStatus: response?.status() ?? null,
    title: await page.title(),
    bodyText: (await page.locator('body').innerText()).replace(/\s+\n/g, '\n').trim(),
    htmlSha256: sha256(html),
    controls,
    responseRecords,
    consoleMessages,
  };
  const artifact = {
    schemaVersion: 1,
    analysisVersion: 'denver-epermits-public-search-inspection-v1',
    artifactStage: 'official-denver-permit-record-discovery',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    ...stable,
    publicationEligible: false,
    note: 'This is a read-only inventory of the public permit-search interface. It is not geometry evidence.',
  };
  await writeFile(path.join(outputDirectory, query ? 'search-results.html' : 'landing-page.html'), html, 'utf8');
  await writeFile(path.join(outputDirectory, 'manifest.json'), `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({
    outputDirectory,
    artifactVersion: artifact.artifactVersion,
    responseStatus: artifact.responseStatus,
    resolvedUrl: artifact.resolvedUrl,
    controlCount: controls.length,
  }, null, 2)}\n`);
} finally {
  await browser.close();
}
