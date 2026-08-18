#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]),
    );
  }
  return value;
}

function approvedStreetSmartUrl(value) {
  const url = new URL(value);
  return url.protocol === 'https:'
    && url.hostname === 'streetsmart.cyclomedia.com'
    && url.pathname === '/streetsmart';
}

function safeNetworkUrl(value) {
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return `${url.protocol}<redacted>`;
    const allowedPublicValues = new Set(['q']);
    const query = [...url.searchParams.keys()].sort().map((key) => (
      allowedPublicValues.has(key) ? `${key}=${url.searchParams.get(key)}` : `${key}=<redacted>`
    ));
    return `${url.origin}${url.pathname}${query.length > 0 ? `?${query.join('&')}` : ''}`;
  } catch {
    return '<invalid-url>';
  }
}

function summarizeNetwork(records) {
  const hostCounts = {};
  const statusCounts = {};
  const resourceTypeCounts = {};
  for (const record of records) {
    let hostname = '<non-network-or-invalid>';
    try {
      hostname = new URL(record.url).hostname || '<non-network-or-invalid>';
    } catch {
      // Preserve only the categorical invalid marker.
    }
    hostCounts[hostname] = (hostCounts[hostname] ?? 0) + 1;
    if (record.status !== null) {
      statusCounts[String(record.status)] = (statusCounts[String(record.status)] ?? 0) + 1;
    }
    resourceTypeCounts[record.resourceType] = (resourceTypeCounts[record.resourceType] ?? 0) + 1;
  }
  return {
    requestCount: records.length,
    hostCounts: Object.fromEntries(Object.entries(hostCounts).sort()),
    statusCounts: Object.fromEntries(Object.entries(statusCounts).sort()),
    resourceTypeCounts: Object.fromEntries(Object.entries(resourceTypeCounts).sort()),
  };
}

const indexManifestPath = path.resolve(option(
  'index-manifest',
  'tmp/lidar/marlins-city-cyclomedia-index-2026/manifest.json',
));
const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-city-cyclomedia-streetsmart-review-2026',
));
const executablePath = option(
  'browser-executable',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
);
const waitMilliseconds = Number(option('wait-ms', '45000'));
if (!Number.isFinite(waitMilliseconds) || waitMilliseconds < 0 || waitMilliseconds > 120_000) {
  throw new Error(`Invalid wait-ms: ${waitMilliseconds}`);
}
await mkdir(outputDirectory, { recursive: true });

const indexManifestBytes = await readFile(indexManifestPath);
const indexManifest = JSON.parse(indexManifestBytes.toString('utf8'));
if (indexManifest.artifactKind !== 'marlins-city-cyclomedia-index') {
  throw new Error(`Unexpected index kind: ${indexManifest.artifactKind}`);
}
const imageUrl = option('url', indexManifest.nearestPointSamples?.[0]?.url);
if (!imageUrl || !approvedStreetSmartUrl(imageUrl)) {
  throw new Error(`Unapproved or missing City-provided Street Smart URL: ${imageUrl}`);
}

const requests = [];
const requestByObject = new WeakMap();
const failedRequests = [];
const consoleMessages = [];
const pageErrors = [];
const browser = await chromium.launch({ headless: true, executablePath });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    locale: 'en-US',
    timezoneId: 'America/New_York',
  });
  const page = await context.newPage();
  page.on('request', (request) => {
    const record = {
      method: request.method(),
      resourceType: request.resourceType(),
      url: safeNetworkUrl(request.url()),
      status: null,
    };
    requestByObject.set(request, record);
    requests.push(record);
  });
  page.on('response', (response) => {
    const record = requestByObject.get(response.request());
    if (record) record.status = response.status();
  });
  page.on('requestfailed', (request) => {
    failedRequests.push({
      method: request.method(),
      resourceType: request.resourceType(),
      url: safeNetworkUrl(request.url()),
      errorText: request.failure()?.errorText ?? null,
    });
  });
  page.on('console', (message) => {
    if (['error', 'warning'].includes(message.type())) {
      consoleMessages.push({ type: message.type(), text: message.text().slice(0, 1000) });
    }
  });
  page.on('pageerror', (error) => pageErrors.push(String(error).slice(0, 2000)));

  const navigationResponse = await page.goto(imageUrl, {
    waitUntil: 'domcontentloaded',
    timeout: 120_000,
  });
  await page.waitForTimeout(waitMilliseconds);

  const screenshotPath = path.join(outputDirectory, 'nearest-recording-point.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  const screenshotBytes = await readFile(screenshotPath);
  const dom = await page.evaluate(() => {
    const clean = (value) => (value ?? '').replace(/\s+/g, ' ').trim();
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rectangle = element.getBoundingClientRect();
      return style.visibility !== 'hidden'
        && style.display !== 'none'
        && rectangle.width > 0
        && rectangle.height > 0;
    };
    const elements = [...document.querySelectorAll('button,[role="button"],a,input,select')]
      .filter(visible)
      .slice(0, 300)
      .map((element) => ({
        tagName: element.tagName,
        role: element.getAttribute('role'),
        text: clean(element.textContent).slice(0, 300),
        ariaLabel: element.getAttribute('aria-label'),
        title: element.getAttribute('title'),
        type: element.getAttribute('type'),
        placeholder: element.getAttribute('placeholder'),
        disabled: 'disabled' in element ? Boolean(element.disabled) : null,
      }));
    return {
      title: document.title,
      finalUrl: location.href,
      bodyText: clean(document.body?.innerText).slice(0, 20_000),
      visibleControls: elements,
      canvasCount: document.querySelectorAll('canvas').length,
      visibleCanvasCount: [...document.querySelectorAll('canvas')].filter(visible).length,
      imageCount: document.querySelectorAll('img').length,
      iframeCount: document.querySelectorAll('iframe').length,
      localStorageKeys: Object.keys(localStorage).sort(),
      sessionStorageKeys: Object.keys(sessionStorage).sort(),
      streetSmartGlobalType: typeof window.StreetSmart,
      streetSmartGlobalKeys: typeof window.StreetSmart === 'object'
        ? Object.keys(window.StreetSmart).sort().slice(0, 200)
        : [],
    };
  });
  const observedFinalUrl = dom.finalUrl;
  dom.finalUrl = safeNetworkUrl(observedFinalUrl);

  const cookieNames = (await context.cookies()).map((cookie) => cookie.name).sort();
  const safeRequests = requests.map((record) => ({ ...record }));
  const imageResponseCandidates = safeRequests.filter((record) => (
    record.status === 200
    && ['image', 'media'].includes(record.resourceType)
    && /cyclomedia/i.test(record.url)
  ));
  const visibleControlText = dom.visibleControls.map((control) => (
    [control.text, control.ariaLabel, control.title].filter(Boolean).join(' ')
  )).join(' ');
  const accessFindings = {
    landingPageHttpStatus: navigationResponse?.status() ?? null,
    finalUrlRemainedStreetSmart: approvedStreetSmartUrl(observedFinalUrl),
    loginPromptVisible: /\b(?:log in|login|sign in|username|password)\b/i.test(dom.bodyText),
    accountCreationPromptVisible: /\b(?:create account|sign up|register)\b/i.test(dom.bodyText),
    imageryNetworkResponseCount: imageResponseCandidates.length,
    renderedCanvasPresent: dom.visibleCanvasCount > 0,
    measurementControlLabelPresent: /\b(?:measure|measurement|distance|height|area)\b/i.test(
      visibleControlText,
    ),
    measurementResultEstablished: false,
    publicAccessEstablished: false,
  };
  accessFindings.publicAccessEstablished = accessFindings.landingPageHttpStatus === 200
    && accessFindings.finalUrlRemainedStreetSmart
    && !accessFindings.loginPromptVisible
    && !accessFindings.accountCreationPromptVisible
    && accessFindings.renderedCanvasPresent
    && accessFindings.imageryNetworkResponseCount > 0;

  const stable = {
    analysisVersion: 'marlins-city-cyclomedia-streetsmart-review-v1',
    stadiumId: 'marlins',
    reviewedOn: '2026-08-11',
    source: {
      authority: 'City of Miami Cyclomedia recording-point URL',
      imageUrl,
      imageId: new URL(imageUrl).searchParams.get('q'),
    },
    inputs: {
      indexManifest: {
        path: path.relative(process.cwd(), indexManifestPath),
        sha256: sha256(indexManifestBytes),
        artifactVersion: indexManifest.artifactVersion,
      },
      screenshot: {
        path: path.relative(process.cwd(), screenshotPath),
        sha256: sha256(screenshotBytes),
        byteLength: screenshotBytes.length,
        width: 1440,
        height: 1000,
      },
    },
    browserObservation: {
      waitMilliseconds,
      dom,
      cookieNames,
      networkSummary: summarizeNetwork(safeRequests),
      networkRequests: safeRequests,
      failedRequests,
      consoleMessages,
      pageErrors,
      imageResponseCandidates,
    },
    accessFindings,
    geometryBoundary: {
      establishesPublicImageAccess: accessFindings.publicAccessEstablished,
      establishesMeasurementControlPresence: accessFindings.measurementControlLabelPresent,
      establishesSuccessfulMetricMeasurement: false,
      establishesCaptureCameraCalibration: false,
      establishesPositionalAccuracy: false,
      establishesCurrentExteriorGeometry: false,
      establishesInteriorSeatingGeometry: false,
      establishesCurrentMeasuredRowGeometry: false,
      establishesIndependentShadowValidation: false,
    },
    publication: {
      eligible: false,
      blockers: [
        ...(accessFindings.publicAccessEstablished ? [] : ['PUBLIC_IMAGE_ACCESS_NOT_ESTABLISHED']),
        'SUCCESSFUL_METRIC_MEASUREMENT_NOT_ESTABLISHED',
        'POSITIONAL_ACCURACY_NOT_ESTABLISHED',
        'INTERIOR_SEATING_GEOMETRY_NOT_ESTABLISHED',
        'CURRENT_ROW_GEOMETRY_NOT_ESTABLISHED',
        'CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'marlins-city-cyclomedia-streetsmart-review',
    artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
    generatedAt: new Date().toISOString(),
    ...stable,
  };
  const manifestPath = path.join(outputDirectory, 'manifest.json');
  await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    manifestPath,
    artifactVersion: artifact.artifactVersion,
    screenshot: artifact.inputs.screenshot,
    accessFindings: artifact.accessFindings,
    geometryBoundary: artifact.geometryBoundary,
    publication: artifact.publication,
    networkSummary: artifact.browserObservation.networkSummary,
    failedRequestCount: failedRequests.length,
    consoleMessageCount: consoleMessages.length,
    pageErrorCount: pageErrors.length,
    bodyText: dom.bodyText,
    visibleControls: dom.visibleControls,
  }, null, 2));
} finally {
  await browser.close();
}
