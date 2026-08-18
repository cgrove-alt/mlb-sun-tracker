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

async function fillIfPresent(page, selector, value) {
  if (value === undefined || value === null || value === '') return;
  const field = page.locator(selector);
  if (await field.count() === 0) throw new Error(`Advanced search field is missing: ${selector}`);
  await field.fill(value);
}

async function setMaskedDateIfPresent(page, selector, value) {
  if (value === undefined || value === null || value === '') return;
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    throw new Error(`Advanced search date must use MM/DD/YYYY: ${value}`);
  }
  const field = page.locator(selector);
  if (await field.count() === 0) throw new Error(`Advanced search field is missing: ${selector}`);
  // Accela's masked-date behavior appends text when Playwright fill() replaces
  // a populated default. Assign the exact value so the WebForms POST receives
  // one date rather than a concatenated invalid DateTime string.
  await field.evaluate((element, exactValue) => {
    element.value = exactValue;
  }, value);
  const submittedValue = await field.inputValue();
  if (submittedValue !== value) {
    throw new Error(`Advanced search date was not assigned exactly: ${submittedValue}`);
  }
}

const outputPath = path.resolve(argument('output', 'tmp/lidar/denver-epermits-advanced-record-index.json'));
const filters = {
  permitNumber: argument('permit-number', null),
  projectName: argument('project-name', null),
  startDate: argument('start-date', '01/01/1900'),
  endDate: argument('end-date', '08/10/2026'),
  streetNumberFrom: argument('street-number-from', null),
  streetNumberTo: argument('street-number-to', null),
  streetName: argument('street-name', null),
  parcelNumber: argument('parcel-number', null),
};
if (!Object.entries(filters).some(([key, value]) => !['startDate', 'endDate'].includes(key) && value)) {
  throw new Error('At least one non-date advanced search filter is required');
}
await mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  });
  const sourceUrl = 'https://aca-prod.accela.com/DENVER/Cap/CapHome.aspx?module=Development&TabName=Development';
  const landingResponse = await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);

  await fillIfPresent(page, '#ctl00_PlaceHolderMain_generalSearchForm_txtGSPermitNumber', filters.permitNumber);
  await fillIfPresent(page, '#ctl00_PlaceHolderMain_generalSearchForm_txtGSProjectName', filters.projectName);
  await setMaskedDateIfPresent(page, '#ctl00_PlaceHolderMain_generalSearchForm_txtGSStartDate', filters.startDate);
  await setMaskedDateIfPresent(page, '#ctl00_PlaceHolderMain_generalSearchForm_txtGSEndDate', filters.endDate);
  await fillIfPresent(page, '#ctl00_PlaceHolderMain_generalSearchForm_txtGSNumber_ChildControl0', filters.streetNumberFrom);
  await fillIfPresent(page, '#ctl00_PlaceHolderMain_generalSearchForm_txtGSNumber_ChildControl1', filters.streetNumberTo);
  await fillIfPresent(page, '#ctl00_PlaceHolderMain_generalSearchForm_txtGSStreetName', filters.streetName);
  await fillIfPresent(page, '#ctl00_PlaceHolderMain_generalSearchForm_txtGSParcelNo', filters.parcelNumber);

  await page.locator('#ctl00_PlaceHolderMain_btnNewSearch').click();
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(5000);

  const pages = [];
  const records = [];
  const seenRecordNumbers = new Set();
  const duplicateRecordRows = [];
  let searchOutcome = null;
  for (let pageIndex = 1; pageIndex <= 100; pageIndex += 1) {
    const bodyText = (await page.locator('body').innerText()).replace(/\s+\n/g, '\n').trim();
    const pageRecords = await page.locator('[id$="gdvPermitList"] tr').evaluateAll((rows) => (
      rows.map((row) => {
        const text = (selector) => (
          (row.querySelector(selector)?.textContent || '').trim().replace(/\s+/g, ' ')
        );
        const recordLink = row.querySelector('a[id$="lnkPermitNumber"], a[id$="hlPermitNumber"]');
        if (!recordLink) return null;
        const href = recordLink.getAttribute('href');
        return {
          date: text('[id$="lblUpdatedTime"]') || null,
          recordNumber: (recordLink.textContent || '').trim(),
          recordType: text('[id$="lblType"]') || null,
          module: 'Development',
          shortNotes: text('[id$="lblShortNote"]') || null,
          projectName: text('[id$="lblProjectName"]') || null,
          address: text('[id$="lblAddress"]') || text('[id$="lblPermitAddress"]') || null,
          status: text('[id$="lblStatus"]') || null,
          postbackHref: href,
          directDetailUrl: href ? new URL(href, document.baseURI).href : null,
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
      if (pageIndex === 1) {
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
      throw new Error(`No records parsed from noninitial result page ${pageIndex}`);
    }
    let uniqueRecordCount = 0;
    for (const record of pageRecords) {
      if (seenRecordNumbers.has(record.recordNumber)) {
        duplicateRecordRows.push({
          pageIndex,
          ...record,
        });
        continue;
      }
      seenRecordNumbers.add(record.recordNumber);
      records.push(record);
      uniqueRecordCount += 1;
    }
    pages.push({
      pageIndex,
      resolvedUrl: page.url(),
      bodyTextSha256: sha256(bodyText),
      resultPageClassification,
      recordCount: pageRecords.length,
      uniqueRecordCount,
      firstRecordNumber: pageRecords[0].recordNumber,
      lastRecordNumber: pageRecords.at(-1).recordNumber,
    });
    searchOutcome = 'result-grid';
    process.stdout.write(`page ${pageIndex} records ${pageRecords.length}\n`);
    const next = page.getByRole('link', { name: 'Next >', exact: true });
    if (await next.count() === 0 || !(await next.isVisible())) break;
    if (pageIndex === 100) {
      throw new Error('Denver e-permits still exposes a Next link at the 100-page safety ceiling');
    }
    const previousFirst = pageRecords[0].recordNumber;
    let pageAdvanced = false;
    let nextPageAttempts = 0;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      nextPageAttempts = attempt;
      const currentFirst = await page.locator(
        '[id$="gdvPermitList"] a[id$="lnkPermitNumber"], [id$="gdvPermitList"] a[id$="hlPermitNumber"]',
      ).first().textContent();
      if (currentFirst?.trim() !== previousFirst) {
        pageAdvanced = true;
        break;
      }
      await next.click();
      pageAdvanced = await page.waitForFunction((recordNumber) => {
        const first = document.querySelector(
          '[id$="gdvPermitList"] a[id$="lnkPermitNumber"], [id$="gdvPermitList"] a[id$="hlPermitNumber"]',
        );
        return first && first.textContent?.trim() !== recordNumber;
      }, previousFirst, { timeout: 20000 }).then(() => true).catch(() => false);
      if (pageAdvanced) break;
    }
    pages.at(-1).nextPageAttempts = nextPageAttempts;
    if (!pageAdvanced) {
      throw new Error(`Denver e-permits did not advance after ${nextPageAttempts} Next clicks from result page ${pageIndex}`);
    }
    await page.waitForTimeout(1000);
  }

  const stable = {
    sourceUrl,
    landingResponseStatus: landingResponse?.status() ?? null,
    filters,
    resultUrl: page.url(),
    searchOutcome,
    pages,
    recordCount: records.length,
    duplicateRecordRowCount: duplicateRecordRows.length,
    duplicateRecordRows,
    records,
  };
  const artifact = {
    schemaVersion: 1,
    analysisVersion: 'denver-epermits-public-advanced-record-index-v6',
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
    duplicateRecordRowCount: duplicateRecordRows.length,
  }, null, 2)}\n`);
} finally {
  await browser.close();
}
