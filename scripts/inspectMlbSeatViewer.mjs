#!/usr/bin/env node

/**
 * Inspect a current MLB seat-view page and any club-linked public viewer it
 * loads. The output is a checksum-locked discovery record, not measured row or
 * obstruction geometry.
 */

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

function safeFilename(value) {
  return value.replace(/[^A-Za-z0-9._-]+/g, '_').slice(0, 180);
}

function textTargets(value) {
  const lower = value.toLocaleLowerCase();
  return [
    'sportsdigita',
    'rockies.html',
    'section 207',
    'section207',
    '"207"',
    'section 208',
    'section208',
    '"208"',
    'section 209',
    'section209',
    '"209"',
    'panorama',
    'virtual venue',
  ].filter((target) => lower.includes(target));
}

async function snapshotPage(page) {
  const html = await page.content();
  const frames = page.frames().map((frame) => ({
    name: frame.name() || null,
    url: frame.url(),
  }));
  const controls = await page.locator('a, button, input, select, [role="button"]').evaluateAll(
    (elements) => elements.map((element) => ({
      tag: element.tagName,
      id: element.id || null,
      role: element.getAttribute('role'),
      name: element.getAttribute('name'),
      text: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 250),
      ariaLabel: element.getAttribute('aria-label'),
      href: element instanceof HTMLAnchorElement ? element.href : null,
      visible: Boolean(element.getClientRects().length),
    })),
  );
  const embeds = await page.locator('iframe, embed, object').evaluateAll((elements) => (
    elements.map((element) => ({
      tag: element.tagName,
      id: element.id || null,
      title: element.getAttribute('title'),
      src: element.getAttribute('src'),
      data: element.getAttribute('data'),
      visible: Boolean(element.getClientRects().length),
    }))
  ));
  return {
    url: page.url(),
    title: await page.title(),
    html,
    htmlSha256: sha256(html),
    bodyText: (await page.locator('body').innerText()).replace(/\s+\n/g, '\n').trim(),
    frames,
    embeds,
    controls,
  };
}

const sourceUrl = argument('url', 'https://www.mlb.com/rockies/ballpark/seat-viewer');
const outputDirectory = path.resolve(argument('output', 'tmp/lidar/rockies-current-official-seat-viewer-inspection'));
const followViewer = argument('follow-viewer', 'true') !== 'false';
const parsedSource = new URL(sourceUrl);
if (parsedSource.protocol !== 'https:' || !parsedSource.hostname.endsWith('mlb.com')) {
  throw new Error('The source URL must be an HTTPS MLB page');
}

await mkdir(outputDirectory, { recursive: true });
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1200 },
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
});
const resources = [];
const matchingResources = [];
const resourceTasks = new Set();

function observe(page, pageLabel) {
  page.on('response', (response) => {
    const task = (async () => {
      const headers = response.headers();
      const contentType = headers['content-type'] ?? null;
      const record = {
        pageLabel,
        url: response.url(),
        status: response.status(),
        contentType,
        contentLength: headers['content-length'] ?? null,
        lastModified: headers['last-modified'] ?? null,
        etag: headers.etag ?? null,
      };
      resources.push(record);
      if (!/(?:json|javascript|text|xml|svg|html)/i.test(contentType ?? '')) return;
      let body;
      try {
        body = await response.body();
      } catch {
        return;
      }
      if (body.length > 20_000_000) return;
      const text = body.toString('utf8');
      const targets = textTargets(text);
      if (targets.length === 0) return;
      const resourcePath = path.join(
        outputDirectory,
        `resource-${matchingResources.length + 1}-${safeFilename(new URL(response.url()).pathname || 'root')}.txt`,
      );
      await writeFile(resourcePath, text, 'utf8');
      matchingResources.push({
        ...record,
        byteLength: body.length,
        sha256: sha256(body),
        targets,
        localPath: resourcePath,
      });
    })();
    resourceTasks.add(task);
    task.finally(() => resourceTasks.delete(task));
  });
}

try {
  const officialPage = await context.newPage();
  observe(officialPage, 'official-mlb-page');
  const officialResponse = await officialPage.goto(sourceUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 60_000,
  });
  await officialPage.waitForTimeout(12_000);
  const official = await snapshotPage(officialPage);
  await writeFile(path.join(outputDirectory, 'official-page.html'), official.html, 'utf8');
  await officialPage.screenshot({
    path: path.join(outputDirectory, 'official-page.png'),
    fullPage: true,
  });

  const linkedViewerUrls = Array.from(new Set([
    ...official.frames.map((frame) => frame.url),
    ...official.embeds.flatMap((embed) => [embed.src, embed.data]),
    ...official.controls.map((control) => control.href),
  ].filter((value) => {
    if (!value) return false;
    try {
      const parsed = new URL(value, official.url);
      return /sportsdigita|virtualvenue|io-media|3ddigitalvenue/i.test(parsed.hostname + parsed.pathname);
    } catch {
      return false;
    }
  }).map((value) => new URL(value, official.url).toString())));

  const viewers = [];
  if (followViewer) {
    for (const [index, viewerUrl] of linkedViewerUrls.entries()) {
      const viewerPage = await context.newPage();
      observe(viewerPage, `linked-viewer-${index + 1}`);
      const response = await viewerPage.goto(viewerUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      await viewerPage.waitForTimeout(12_000);
      const viewer = await snapshotPage(viewerPage);
      const htmlPath = path.join(outputDirectory, `linked-viewer-${index + 1}.html`);
      const screenshotPath = path.join(outputDirectory, `linked-viewer-${index + 1}.png`);
      await writeFile(htmlPath, viewer.html, 'utf8');
      await viewerPage.screenshot({ path: screenshotPath, fullPage: true });
      viewers.push({
        sourceUrl: viewerUrl,
        responseStatus: response?.status() ?? null,
        ...viewer,
        htmlPath,
        screenshotPath,
      });
      await viewerPage.close();
    }
  }

  await Promise.allSettled(Array.from(resourceTasks));
  resources.sort((left, right) => left.url.localeCompare(right.url));
  matchingResources.sort((left, right) => left.url.localeCompare(right.url));
  const stable = {
    sourceUrl,
    officialResponseStatus: officialResponse?.status() ?? null,
    official: {
      url: official.url,
      title: official.title,
      htmlSha256: official.htmlSha256,
      bodyText: official.bodyText,
      frames: official.frames,
      embeds: official.embeds,
      controls: official.controls,
    },
    linkedViewerUrls,
    viewers: viewers.map(({ html, ...viewer }) => viewer),
    resources,
    matchingResources,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'official-mlb-seat-viewer-discovery',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    inspectedOn: new Date().toISOString(),
    ...stable,
    publication: {
      eligible: false,
      blockers: [
        'VIEWER_CONTENT_IS_DISCOVERY_EVIDENCE_ONLY',
        'METRIC_ROW_GEOMETRY_NOT_ESTABLISHED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  await writeFile(path.join(outputDirectory, 'manifest.json'), `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  process.stdout.write(`${JSON.stringify({
    outputDirectory,
    artifactVersion: artifact.artifactVersion,
    officialUrl: official.url,
    linkedViewerUrls,
    viewerCount: viewers.length,
    resourceCount: resources.length,
    matchingResources: matchingResources.map((resource) => ({
      url: resource.url,
      targets: resource.targets,
      byteLength: resource.byteLength,
      sha256: resource.sha256,
      localPath: resource.localPath,
    })),
    publicationEligible: false,
  }, null, 2)}\n`);
} finally {
  await browser.close();
}
