#!/usr/bin/env node

/** Locate target strings in checksum-locked first-party team site resources. */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const pageUrl = typeof args.url === 'string' ? args.url : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
const targets = typeof args.targets === 'string'
  ? args.targets.split(',').map((value) => value.trim()).filter(Boolean)
  : [];
if (!pageUrl || !outputPath || targets.length === 0) {
  throw new Error('Required: --url=URL --targets=TEXT,TEXT --output=PATH');
}
const parsedPageUrl = new URL(pageUrl);
const allowedHost = parsedPageUrl.hostname === 'www.mlb.com'
  || parsedPageUrl.hostname.endsWith('.mlb.com')
  || parsedPageUrl.hostname.endsWith('.mlbstatic.com')
  || parsedPageUrl.hostname === 'premium.cleguardians.com';
if (parsedPageUrl.protocol !== 'https:' || !allowedHost) {
  throw new Error('The URL must be an approved HTTPS first-party team site');
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
    const matchedTargets = targets.filter((target) =>
      text.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
    if (matchedTargets.length === 0) return;
    const snippets = matchedTargets.map((target) => {
      const index = text.toLocaleLowerCase().indexOf(target.toLocaleLowerCase());
      return {
        target,
        index,
        excerpt: text.slice(Math.max(0, index - 500), index + target.length + 1_500),
      };
    });
    matches.push({
      url,
      requestMethod: response.request().method(),
      requestPostData: response.request().postData(),
      requestContentType: response.request().headers()['content-type'] ?? null,
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
  await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForTimeout(12_000);
  await Promise.allSettled(Array.from(pending));
  const visibleText = (await page.locator('body').innerText()).replace(/\s+/g, ' ').trim();
  const visibleMatches = targets.filter((target) =>
    visibleText.toLocaleLowerCase().includes(target.toLocaleLowerCase()));
  matches.sort((left, right) => left.url.localeCompare(right.url));
  const stable = {
    pageUrl,
    finalUrl: page.url(),
    targets,
    visibleText,
    visibleMatches,
    matches,
    resourceErrors,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'official-site-resource-string-audit',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    auditedOn: new Date().toISOString(),
    ...stable,
    conclusion: {
      matchedResourceCount: matches.length,
      targetsLocated: targets.filter((target) =>
        matches.some((match) => match.matchedTargets.includes(target))
        || visibleMatches.includes(target)),
      targetsNotLocated: targets.filter((target) =>
        !matches.some((match) => match.matchedTargets.includes(target))
        && !visibleMatches.includes(target)),
    },
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    artifactVersion: artifact.artifactVersion,
    finalUrl: artifact.finalUrl,
    visibleMatches,
    matches: matches.map((match) => ({
      url: match.url,
      requestMethod: match.requestMethod,
      requestPostData: match.requestPostData,
      requestContentType: match.requestContentType,
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
