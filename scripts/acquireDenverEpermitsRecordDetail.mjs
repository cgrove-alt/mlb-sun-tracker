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

async function visibleBodyText(page) {
  return (await page.locator('body').innerText()).replace(/\s+\n/g, '\n').trim();
}

async function pageInventory(page) {
  return page.locator('body').evaluate((body) => {
    const text = (value) => String(value ?? '').trim().replace(/\s+/g, ' ');
    const links = [...body.querySelectorAll('a')].map((link) => ({
      text: text(link.textContent),
      id: link.id || null,
      href: link.getAttribute('href'),
      title: link.getAttribute('title'),
    })).filter((link) => link.text || link.href);
    const buttons = [...body.querySelectorAll('button, input[type="button"], input[type="submit"]')].map((button) => ({
      text: text(button.textContent || button.getAttribute('value')),
      id: button.id || null,
      name: button.getAttribute('name'),
      type: button.getAttribute('type'),
    })).filter((button) => button.text || button.id || button.name);
    const rows = [...body.querySelectorAll('tr')].map((row) => {
      const cells = [...row.querySelectorAll(':scope > th, :scope > td')].map((cell) => text(cell.textContent));
      return cells.filter(Boolean);
    }).filter((cells) => cells.length > 0);
    return { links, buttons, rows };
  });
}

async function searchForRecord(page, sourceUrl, query, recordNumber) {
  const landingResponse = await page.goto(sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(5000);
  const searchInput = page.locator('#txtSearchCondition:visible');
  await searchInput.fill(query.replaceAll('-', ' '));
  await searchInput.press('Enter');
  await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(5000);

  for (let pageIndex = 1; pageIndex <= 100; pageIndex += 1) {
    const recordLink = page.locator('[id$="gdvPermitList"] a[id$="lnkPermitNumber"]').filter({ hasText: recordNumber });
    if (await recordLink.count() > 0) {
      const href = await recordLink.first().getAttribute('href');
      await recordLink.first().click();
      await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});
      await page.waitForFunction((expectedRecordNumber) => (
        document.body?.innerText.includes(expectedRecordNumber)
        && document.body?.innerText.includes('Record Status')
      ), recordNumber, { timeout: 60000 });
      await page.waitForTimeout(10000);
      return {
        landingResponseStatus: landingResponse?.status() ?? null,
        resultPageIndex: pageIndex,
        resultPostbackHref: href,
      };
    }
    const next = page.getByRole('link', { name: 'Next >', exact: true });
    if (await next.count() === 0 || !(await next.isVisible())) break;
    const first = normalizeText(await page.locator('[id$="gdvPermitList"] a[id$="lnkPermitNumber"]').first().textContent());
    await next.click();
    await page.waitForFunction((previousFirst) => {
      const current = document.querySelector('[id$="gdvPermitList"] a[id$="lnkPermitNumber"]');
      return current && current.textContent?.trim() !== previousFirst;
    }, first, { timeout: 60000 });
    await page.waitForTimeout(1000);
  }
  throw new Error(`Record ${recordNumber} was not found for query ${query}`);
}

async function openAttachmentsTab(page) {
  const recordInfoMenu = page.getByText('Record Info', { exact: true }).first();
  if (await recordInfoMenu.count() > 0 && await recordInfoMenu.isVisible().catch(() => false)) {
    await recordInfoMenu.click().catch(() => {});
    await page.waitForTimeout(500);
  }
  const candidates = page.locator('a, button').filter({ hasText: /attachments?/i });
  const candidateCount = await candidates.count();
  for (let index = 0; index < candidateCount; index += 1) {
    const candidate = candidates.nth(index);
    if (!(await candidate.isVisible().catch(() => false))) continue;
    const label = normalizeText(await candidate.textContent().catch(() => ''));
    const href = await candidate.getAttribute('href').catch(() => null);
    const id = await candidate.getAttribute('id').catch(() => null);
    await candidate.click();
    await page.waitForLoadState('domcontentloaded', { timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(3000);
    return { clicked: true, label, href, id };
  }
  return { clicked: false, label: null, href: null, id: null };
}

async function callPublicPageMethod(page, method, payload) {
  return page.evaluate(async ({ requestedMethod, requestedPayload }) => {
    const response = await fetch(`${window.location.pathname}/${requestedMethod}`, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(requestedPayload),
    });
    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(`${requestedMethod} returned HTTP ${response.status}: ${responseText.slice(0, 500)}`);
    }
    const parsed = JSON.parse(responseText);
    if (!Object.hasOwn(parsed, 'd')) {
      throw new Error(`${requestedMethod} response lacks the ASP.NET d field`);
    }
    return String(parsed.d ?? '');
  }, { requestedMethod: method, requestedPayload: payload });
}

async function publicReportControls(page) {
  return page.evaluate(() => {
    const normalize = (value) => String(value ?? '').trim().replace(/\s+/g, ' ');
    const reportRow = document.querySelector('#reportLink');
    const reportTrigger = document.querySelector('a[title="Report List"]');
    const reportList = document.querySelector('#reportList');
    const reportPostback = document.querySelector('#ctl00_HeaderNavigation_btnPostForReport');
    return {
      hiddenShowReportLinkValue:
        document.querySelector('#ctl00_HeaderNavigation_hdnShowReportLink')?.value ?? null,
      reportRowPresent: Boolean(reportRow),
      reportRowComputedDisplay: reportRow ? getComputedStyle(reportRow).display : null,
      reportTriggerPresent: Boolean(reportTrigger),
      reportTriggerVisible: Boolean(reportTrigger?.getClientRects().length),
      reportListPresent: Boolean(reportList),
      reportListComputedDisplay: reportList ? getComputedStyle(reportList).display : null,
      reportListText: normalize(reportList?.textContent),
      reportListLinkCount: reportList?.querySelectorAll('a').length ?? 0,
      reportPostbackPresent: Boolean(reportPostback),
    };
  });
}

const query = argument('query');
const recordNumber = argument('record-number');
const requestedDetailUrl = argument('detail-url');
const outputPath = path.resolve(argument('output', 'tmp/lidar/denver-epermits-record-detail.json'));
if (!query && !requestedDetailUrl) throw new Error('Required: --query=SEARCH-TEXT or --detail-url=URL');
if (!recordNumber) throw new Error('Required: --record-number=RECORD-NUMBER');
await mkdir(path.dirname(outputPath), { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  });
  const sourceUrl = 'https://www.denvergov.org/accelacitizenaccess/';
  let discovery;
  if (requestedDetailUrl) {
    const parsedDetailUrl = new URL(requestedDetailUrl);
    if (parsedDetailUrl.protocol !== 'https:' || parsedDetailUrl.hostname !== 'aca-prod.accela.com') {
      throw new Error(`Unexpected Denver permit detail host: ${parsedDetailUrl.hostname}`);
    }
    const directResponse = await page.goto(parsedDetailUrl.href, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await page.waitForFunction((expectedRecordNumber) => (
      document.body?.innerText.includes(expectedRecordNumber)
      && document.body?.innerText.includes('Record Status')
    ), recordNumber, { timeout: 60000 });
    await page.waitForTimeout(5000);
    discovery = {
      landingResponseStatus: directResponse?.status() ?? null,
      resultPageIndex: null,
      resultPostbackHref: null,
      directDetailUrlUsed: true,
    };
  } else {
    discovery = await searchForRecord(page, sourceUrl, query, recordNumber);
  }
  const detailUrl = page.url();
  const detailBodyText = await visibleBodyText(page);
  const detailInventory = await pageInventory(page);
  const reportControls = await publicReportControls(page);
  const publicDocumentStatusesHtml = await callPublicPageMethod(page, 'LoadDocStatuses', {
    clientId: 'ctl00_PlaceHolderMain_documentStatusList',
    moduleName: 'Development',
  });
  const publicRelatedRecordsHtml = await callPublicPageMethod(page, 'GetBuildCapTree', {
    moduleName: 'Development',
    isShowAll: 'False',
  });
  const attachmentTab = await openAttachmentsTab(page);
  const attachmentUrl = page.url();
  const attachmentBodyText = await visibleBodyText(page);
  const attachmentInventory = await pageInventory(page);

  const stable = {
    sourceUrl,
    normalizedQuery: query ? query.replaceAll('-', ' ') : null,
    requestedDetailUrl: requestedDetailUrl ?? null,
    recordNumber,
    ...discovery,
    detailUrl,
    detailBodyTextSha256: sha256(detailBodyText),
    detailBodyText,
    detailInventory,
    reportControls,
    publicPageMethods: {
      loadDocStatuses: {
        htmlSha256: sha256(publicDocumentStatusesHtml),
        characterCount: publicDocumentStatusesHtml.length,
        html: publicDocumentStatusesHtml,
      },
      getBuildCapTree: {
        htmlSha256: sha256(publicRelatedRecordsHtml),
        characterCount: publicRelatedRecordsHtml.length,
        html: publicRelatedRecordsHtml,
      },
    },
    attachmentTab,
    attachmentUrl,
    attachmentBodyTextSha256: sha256(attachmentBodyText),
    attachmentBodyText,
    attachmentInventory,
  };
  const artifact = {
    schemaVersion: 1,
    analysisVersion: 'denver-epermits-public-record-detail-v4',
    artifactStage: 'official-denver-permit-record-detail-discovery',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    ...stable,
    publicationEligible: false,
    blockers: [
      'PERMIT_RECORD_TEXT_IS_NOT_MEASURED_GEOMETRY',
      'ATTACHMENTS_REQUIRE_FILE_LEVEL_ACQUISITION_AND_REVIEW',
    ],
  };
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    detailUrl,
    attachmentTab,
    attachmentLinkCount: attachmentInventory.links.length,
  }, null, 2)}\n`);
} finally {
  await browser.close();
}
