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

function classifyResultPage(url, bodyText, recordCount) {
  if (/\/Error\.aspx(?:\?|$)/i.test(url) || /an unexpected error has occurred/i.test(bodyText)) {
    return 'portal-error';
  }
  if (/\/Cap\/CapDetail\.aspx(?:\?|$)/i.test(url) || /Applications and Permits\s+[^:\n]+:/i.test(bodyText)) {
    return 'direct-record-detail';
  }
  if (recordCount > 0) return 'result-grid';
  if (/no records? found|no results? found|returned no results|no matching records?/i.test(bodyText)) {
    return 'zero-results';
  }
  return 'unrecognized';
}

function parseDirectRecord(bodyText, resolvedUrl) {
  const match = bodyText.match(/Applications and Permits\s+([^:\n]+):\s*\n([^\n]+)/i);
  if (!match) return null;
  const status = bodyText.match(/Record Status:\s*([^\n]+)/i)?.[1] ?? null;
  return {
    date: null,
    recordNumber: normalizeText(match[1]),
    recordType: normalizeText(match[2]),
    module: 'Development',
    shortNotes: null,
    projectName: null,
    status: normalizeText(status) || null,
    postbackHref: null,
    directDetailUrl: resolvedUrl,
  };
}

const query = argument('query');
const outputPath = path.resolve(argument('output', 'tmp/lidar/denver-epermits-record-index.json'));
if (!query) throw new Error('Required: --query=SEARCH-TEXT');
await mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  });
  const sourceUrl = 'https://www.denvergov.org/accelacitizenaccess/';
  const landingResponse = await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  const normalizedQuery = query.replaceAll('-', ' ');
  const searchInput = page.locator('#txtSearchCondition:visible');
  await searchInput.fill(normalizedQuery);
  await searchInput.press('Enter');
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(5000);

  const pages = [];
  const records = [];
  const seenRecordNumbers = new Set();
  let searchOutcome = null;
  for (let pageIndex = 1; pageIndex <= 100; pageIndex += 1) {
    const bodyText = (await page.locator('body').innerText()).replace(/\s+\n/g, '\n').trim();
    const pageRecords = await page.locator('[id$="gdvPermitList"] tr').evaluateAll((rows) => (
      rows.map((row) => {
        const cells = [...row.querySelectorAll(':scope > th, :scope > td')].map((cell) => (
          (cell.textContent || '').trim().replace(/\s+/g, ' ')
        ));
        const recordLink = row.querySelector('a[id$="lnkPermitNumber"]');
        if (!recordLink) return null;
        return {
          date: cells[0] || null,
          recordNumber: (recordLink.textContent || '').trim(),
          recordType: cells[2] || null,
          module: cells[3] || null,
          shortNotes: cells[4] || null,
          projectName: cells[5] || null,
          status: cells[6] || null,
          postbackHref: recordLink.getAttribute('href'),
        };
      }).filter(Boolean)
    ));
    const resultPageClassification = classifyResultPage(page.url(), bodyText, pageRecords.length);
    if (resultPageClassification === 'portal-error') {
      throw new Error(`Denver e-permits returned an error page: ${page.url()}`);
    }
    if (resultPageClassification === 'direct-record-detail') {
      if (pageIndex !== 1) throw new Error(`Unexpected direct record detail after result page ${pageIndex - 1}`);
      const directRecord = parseDirectRecord(bodyText, page.url());
      if (!directRecord) throw new Error('Direct record detail was detected but its record number could not be parsed');
      records.push(directRecord);
      pages.push({
        pageIndex,
        resolvedUrl: page.url(),
        bodyTextSha256: sha256(bodyText),
        resultPageClassification,
        recordCount: 1,
        firstRecordNumber: directRecord.recordNumber,
        lastRecordNumber: directRecord.recordNumber,
      });
      searchOutcome = 'direct-record-detail';
      break;
    }
    if (pageRecords.length === 0) {
      if (pageIndex !== 1) throw new Error(`No records parsed from noninitial result page ${pageIndex}`);
      if (resultPageClassification !== 'zero-results') {
        throw new Error(`Search response contained neither a result grid nor an explicit zero-results message: ${page.url()}`);
      }
      pages.push({
        pageIndex,
        resolvedUrl: page.url(),
        bodyTextSha256: sha256(bodyText),
        resultPageClassification,
        recordCount: 0,
        firstRecordNumber: null,
        lastRecordNumber: null,
      });
      searchOutcome = 'zero-results';
      break;
    }
    for (const record of pageRecords) {
      if (seenRecordNumbers.has(record.recordNumber)) {
        throw new Error(`Duplicate record across result pages: ${record.recordNumber}`);
      }
      seenRecordNumbers.add(record.recordNumber);
      records.push(record);
    }
    pages.push({
      pageIndex,
      resolvedUrl: page.url(),
      bodyTextSha256: sha256(bodyText),
      resultPageClassification,
      recordCount: pageRecords.length,
      firstRecordNumber: pageRecords[0].recordNumber,
      lastRecordNumber: pageRecords.at(-1).recordNumber,
    });
    searchOutcome = 'result-grid';
    process.stdout.write(`page ${pageIndex} records ${pageRecords.length}\n`);
    const next = page.getByRole('link', { name: 'Next >', exact: true });
    if (await next.count() === 0 || !(await next.isVisible())) break;
    const previousFirst = pageRecords[0].recordNumber;
    await next.click();
    await page.waitForFunction((recordNumber) => {
      const first = document.querySelector('[id$="gdvPermitList"] a[id$="lnkPermitNumber"]');
      return first && first.textContent?.trim() !== recordNumber;
    }, previousFirst, { timeout: 60000 });
    await page.waitForTimeout(1000);
  }

  const stable = {
    sourceUrl,
    landingResponseStatus: landingResponse?.status() ?? null,
    normalizedQuery,
    resultUrl: page.url(),
    searchOutcome,
    pages,
    recordCount: records.length,
    records,
  };
  const artifact = {
    schemaVersion: 1,
    analysisVersion: 'denver-epermits-public-record-index-v2',
    artifactStage: 'official-denver-permit-record-discovery',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    ...stable,
    publicationEligible: false,
    blockers: [
      'PERMIT_METADATA_IS_NOT_GEOMETRY',
      'DRAWING_ATTACHMENTS_REQUIRE_SEPARATE_ACCESS_AND_REVIEW',
    ],
  };
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    pageCount: pages.length,
    recordCount: records.length,
  }, null, 2)}\n`);
} finally {
  await browser.close();
}
