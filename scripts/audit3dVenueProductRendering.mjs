#!/usr/bin/env node

/** Capture checksum-locked visible provider text for one block-map product. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const auditPath = typeof args.audit === 'string' ? args.audit : null;
const sectionId = typeof args.section === 'string' ? args.section : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
const screenshotPath = typeof args.screenshot === 'string' ? args.screenshot : null;
if (!auditPath || !sectionId || !outputPath || !screenshotPath) {
  throw new Error('Required: --audit=PATH --section=ID --output=PATH --screenshot=PATH');
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const auditBytes = await readFile(auditPath);
const audit = JSON.parse(auditBytes.toString('utf8'));
if (audit?.artifactKind !== 'venue-blockmap-product-audit') {
  throw new Error('Input is not a venue-blockmap-product-audit artifact');
}
const product = audit.products.find((candidate) => candidate.sectionId === sectionId);
if (!product) throw new Error(`Unknown audited product ${sectionId}`);

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

try {
  await page.goto(audit.source.clubLinkedMapUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await page.waitForTimeout(5_000);
  const rejectButton = page.locator('button').filter({ hasText: /reject all/i }).first();
  if (await rejectButton.count() > 0) {
    await rejectButton.click({ force: true });
    await page.waitForTimeout(2_000);
  }
  const searchControl = page.locator(
    'app-search-simple button:visible, app-search button:visible',
  ).first();
  if (await searchControl.count() > 0) {
    await searchControl.click({ force: true });
  } else {
    await page.mouse.click(34, 52);
  }
  await page.waitForTimeout(2_000);
  const searchInput = page.locator(
    'input[placeholder="Enter section number..."]:visible, '
      + 'input[placeholder="Enter section number"]:visible',
  ).first();
  const inputCount = await searchInput.count();
  let suggestionTexts = [];
  let exactSuggestionTexts = [];
  let clickedSuggestion = false;
  if (inputCount > 0) {
    await searchInput.fill(sectionId);
    await page.waitForTimeout(2_000);
    suggestionTexts = (await page.locator(
      'app-searcher-bar li:visible, app-searcher-bar [role="option"]:visible, '
        + 'app-searcher-bar .result:visible',
    ).allInnerTexts()).map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean);
    const exactLabels = [sectionId, `Section ${sectionId}`];
    for (const label of exactLabels) {
      const exactSuggestions = page.getByText(label, { exact: true });
      const exactCount = await exactSuggestions.count();
      for (let index = 0; index < exactCount; index += 1) {
        const candidate = exactSuggestions.nth(index);
        if (await candidate.isVisible()) {
          exactSuggestionTexts.push((await candidate.innerText()).replace(/\s+/g, ' ').trim());
          await candidate.click({ force: true });
          clickedSuggestion = true;
          break;
        }
      }
      if (clickedSuggestion) break;
    }
  }
  await page.waitForTimeout(5_000);
  const productNode = page.locator(`[id="S_${sectionId}"]`).first();
  const productNodeCount = await productNode.count();
  let clickedProductNode = false;
  if (!clickedSuggestion && productNodeCount > 0) {
    await productNode.click({ force: true });
    clickedProductNode = true;
    await page.waitForTimeout(5_000);
  }
  const visibleText = (await page.locator('body').innerText())
    .replace(/\s+/g, ' ')
    .trim();
  const headings = (await page.locator('h1:visible, h2:visible, h3:visible, h4:visible')
    .allInnerTexts()).map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const controls = (await page.locator('button:visible, [role="button"]:visible')
    .allInnerTexts()).map((text) => text.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const screenshot = resolve(screenshotPath);
  await mkdir(dirname(screenshot), { recursive: true });
  const screenshotBytes = await page.screenshot({ path: screenshot, fullPage: false });
  const stable = {
    blockmapAuditArtifactVersion: audit.artifactVersion,
    blockmapAuditSha256: sha256(auditBytes),
    sectionId,
    mapUrl: audit.source.clubLinkedMapUrl,
    finalUrl: page.url(),
    inputCount,
    suggestionTexts,
    exactSuggestionTexts,
    clickedSuggestion,
    productNodeCount,
    clickedProductNode,
    headings,
    controls,
    visibleText,
    screenshotPath: screenshot,
    screenshotSha256: sha256(screenshotBytes),
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-product-rendering-audit',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    auditedOn: new Date().toISOString(),
    stadiumId: audit.stadiumId,
    venueId: audit.venueId,
    ...stable,
    publication: {
      eligible: false,
      blockers: [
        'RENDERED_PRODUCT_TEXT_REQUIRES_REVIEW',
        'METRIC_ZONE_GEOMETRY_NOT_EXTRACTED',
        'SHADOW_HOLDOUT_NOT_PASSED'
      ]
    }
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    sectionId,
    suggestionTexts,
    exactSuggestionTexts,
    clickedSuggestion,
    productNodeCount,
    clickedProductNode,
    headings,
    controls,
    visibleText,
    screenshotPath: screenshot,
    screenshotSha256: artifact.screenshotSha256,
  }, null, 2));
} finally {
  await browser.close();
}
