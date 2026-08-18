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

async function snapshot(page) {
  const html = await page.content();
  const bodyText = (await page.locator('body').innerText()).replace(/\s+\n/g, '\n').trim();
  const controls = await page.locator('input, select, textarea, button, a').evaluateAll((elements) => (
    elements.map((element) => ({
      tag: element.tagName,
      id: element.id || null,
      name: element.getAttribute('name'),
      text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 300),
      href: element instanceof HTMLAnchorElement ? element.href : null,
      visible: Boolean(element.getClientRects().length),
    }))
  ));
  return {
    url: page.url(),
    title: await page.title(),
    bodyText,
    htmlSha256: sha256(html),
    controls,
  };
}

const query = argument('query');
const recordNumber = argument('record');
const outputDirectory = path.resolve(argument('output', 'tmp/lidar/denver-epermits-record'));
if (!query || !recordNumber) throw new Error('Required: --query=SEARCH-TEXT --record=RECORD-NUMBER');
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  });
  const sourceUrl = 'https://www.denvergov.org/accelacitizenaccess/';
  await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  const searchInput = page.locator('#txtSearchCondition:visible');
  await searchInput.fill(query.replaceAll('-', ' '));
  await searchInput.press('Enter');
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(5000);

  let found = false;
  for (let pageIndex = 1; pageIndex <= 100; pageIndex += 1) {
    const recordLink = page.getByRole('link', { name: recordNumber, exact: true });
    if (await recordLink.count() > 0 && await recordLink.isVisible()) {
      await recordLink.click();
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});
      await page.waitForTimeout(5000);
      found = true;
      break;
    }
    const next = page.getByRole('link', { name: 'Next >', exact: true });
    if (await next.count() === 0 || !(await next.isVisible())) break;
    const previousUrl = page.url();
    await next.click();
    await page.waitForTimeout(3000);
    if (page.url() === previousUrl) await page.waitForTimeout(2000);
  }
  if (!found) throw new Error(`Record not found in search results: ${recordNumber}`);

  const detail = await snapshot(page);
  await writeFile(path.join(outputDirectory, 'record-detail.html'), await page.content(), 'utf8');
  await page.screenshot({ path: path.join(outputDirectory, 'record-detail.png'), fullPage: true });

  let attachments = null;
  const attachmentLink = page.getByRole('link', { name: /attachments/i }).first();
  if (await attachmentLink.count() > 0 && await attachmentLink.isVisible()) {
    await attachmentLink.click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(4000);
    attachments = await snapshot(page);
    await writeFile(path.join(outputDirectory, 'attachments.html'), await page.content(), 'utf8');
    await page.screenshot({ path: path.join(outputDirectory, 'attachments.png'), fullPage: true });
  }

  const stable = {
    sourceUrl,
    query: query.replaceAll('-', ' '),
    recordNumber,
    detail,
    attachments,
  };
  const artifact = {
    schemaVersion: 1,
    analysisVersion: 'denver-epermits-public-record-inspection-v1',
    artifactStage: 'official-denver-permit-record-discovery',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    ...stable,
    publicationEligible: false,
    blockers: [
      'PERMIT_RECORD_IS_NOT_GEOMETRY',
      'ANY_DRAWINGS_REQUIRE_CONTENT_AND_ACCURACY_REVIEW',
    ],
  };
  await writeFile(path.join(outputDirectory, 'manifest.json'), `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({
    outputDirectory,
    artifactVersion: artifact.artifactVersion,
    detailUrl: detail.url,
    attachmentPageFound: attachments !== null,
  }, null, 2)}\n`);
} finally {
  await browser.close();
}
