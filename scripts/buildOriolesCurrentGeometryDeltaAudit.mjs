#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

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
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]));
  }
  return value;
}

async function fetchText(url, accept = 'text/html,*/*') {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      accept,
      'user-agent': 'mlb-sun-tracker-orioles-current-geometry-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const text = await response.text();
  return {
    text,
    request: {
      requestedUrl: String(url),
      resolvedUrl: response.url,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      sha256: sha256(text),
      byteLength: Buffer.byteLength(text),
    },
  };
}

async function fetchBytes(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      accept: 'image/avif,image/webp,image/png,image/jpeg,*/*',
      'user-agent': 'mlb-sun-tracker-orioles-current-geometry-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  return {
    bytes,
    request: {
      requestedUrl: String(url),
      resolvedUrl: response.url,
      status: response.status,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
      sha256: sha256(bytes),
      byteLength: bytes.length,
    },
  };
}

function absoluteUrl(base, candidate) {
  return new URL(candidate.replaceAll('&amp;', '&'), base).toString();
}

function cleanHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function snippets(text, terms) {
  const clean = cleanHtml(text);
  const lower = clean.toLowerCase();
  const output = [];
  for (const term of terms) {
    let start = 0;
    while (output.length < 100) {
      const index = lower.indexOf(term.toLowerCase(), start);
      if (index < 0) break;
      const value = clean.slice(Math.max(0, index - 180), Math.min(clean.length, index + 620));
      if (!output.some((entry) => entry.text === value)) output.push({ term, text: value });
      start = index + term.length;
    }
  }
  return output;
}

function quotedStrings(source) {
  const output = [];
  for (const match of source.matchAll(/"([^"\\]{8,1000})"/g)) {
    output.push(match[1]);
  }
  return output;
}

function matchingStrings(source, pattern) {
  return [...new Set(quotedStrings(source)
    .filter((value) => pattern.test(value))
    .map((value) => value.replace(/\\u00a0/g, ' ').replace(/\s+/g, ' ').trim()))];
}

function assetPaths(source) {
  return [...new Set([...source.matchAll(/"((?:\/assets\/|\/stadium-map-)[^"?]+)(?:\?[^"\s]+)?"/g)]
    .map((match) => match[1]))];
}

function stadiumMapMarkers(source) {
  const output = [];
  const pattern = /"Marker (\d+)":\{title:"([^"]+)",description:"([^"]+)"(?:,disclaimer:"([^"]+)")?,image:/g;
  for (const match of source.matchAll(pattern)) {
    output.push({
      markerNumber: Number(match[1]),
      title: match[2],
      description: match[3],
      disclaimer: match[4] ?? null,
    });
  }
  return output;
}

function outputImageName(index, sourcePath, contentType) {
  const base = path.basename(sourcePath).replace(/[^A-Za-z0-9._-]+/g, '-');
  const extension = /webp/i.test(contentType ?? '')
    ? '.webp'
    : /png/i.test(contentType ?? '')
      ? '.png'
      : /jpe?g/i.test(contentType ?? '')
        ? '.jpg'
        : path.extname(base) || '.bin';
  return `${String(index + 1).padStart(2, '0')}-${base.replace(/\.[^.]+$/, '')}${extension}`;
}

const outputDir = path.resolve(option(
  'output-dir',
  'tmp/lidar/orioles-current-geometry-delta-2026',
));
const msaProjectUrl = option(
  'msa-project',
  'https://mdstad.com/projects/renovation-projects-oriole-park-camden-yards',
);
const msaApprovalUrl = option(
  'msa-approval',
  'https://mdstad.com/press-release/maryland-stadium-authority-approves-oriole-park-upgrades',
);
const msaCompletionUrl = option(
  'msa-completion',
  'https://mdstad.com/press-release/governor-moore-unveils-historic-stadium-upgrades-oriole-park-camden-yards-opening-day',
);
const oriolesRedirectUrl = option(
  'orioles-redirect',
  'https://www.mlb.com/orioles/ballpark/stadium-renovations',
);

const [msaProject, msaApproval, msaCompletion, oriolesRoot] = await Promise.all([
  fetchText(msaProjectUrl),
  fetchText(msaApprovalUrl),
  fetchText(msaCompletionUrl),
  fetchText(oriolesRedirectUrl),
]);
if (!/Renovation Projects at Oriole Park at Camden Yards/i.test(msaProject.text)) {
  throw new Error('Unexpected Maryland Stadium Authority project page');
}
if (!/Maryland Stadium Authority Approves Oriole Park Upgrades/i.test(msaApproval.text)) {
  throw new Error('Unexpected Maryland Stadium Authority approval release');
}
if (!/Governor Moore Unveils Historic Stadium Upgrades/i.test(msaCompletion.text)) {
  throw new Error('Unexpected Maryland Stadium Authority completion release');
}
if (new URL(oriolesRoot.request.resolvedUrl).hostname !== 'hospitality.orioles.com') {
  throw new Error(`Unexpected official Orioles redirect: ${oriolesRoot.request.resolvedUrl}`);
}
const indexBundlePath = oriolesRoot.text.match(/<script[^>]+src="([^"]*\/assets\/index-[^"]+\.js)"/i)?.[1];
if (!indexBundlePath) throw new Error('Official Orioles app did not expose its index bundle');
const indexBundleUrl = absoluteUrl(oriolesRoot.request.resolvedUrl, indexBundlePath);
const indexBundle = await fetchText(indexBundleUrl, 'application/javascript,text/javascript');
const ballparkBundlePath = indexBundle.text.match(/assets\/(Ballmark-[^"]+\.js)/)?.[1];
const premiumBundlePath = indexBundle.text.match(/assets\/(Premium-[^"]+\.js)/)?.[1];
if (!ballparkBundlePath || !premiumBundlePath) {
  throw new Error('Official Orioles app route bundles were not found');
}
const appBaseUrl = new URL('/assets/', oriolesRoot.request.resolvedUrl).toString();
const [ballparkBundle, premiumBundle] = await Promise.all([
  fetchText(absoluteUrl(appBaseUrl, ballparkBundlePath), 'application/javascript,text/javascript'),
  fetchText(absoluteUrl(appBaseUrl, premiumBundlePath), 'application/javascript,text/javascript'),
]);

const geometryAssetPattern = /(?:stadium-map|truist-club|homeplate-club|center-field-videoboard|renovated-club|right-field-videoboard|purewager|flagcourt|suite-club-gallery|premium-club|seating-experience)/i;
const officialAppAssetPaths = [...new Set([
  ...assetPaths(ballparkBundle.text),
  ...assetPaths(premiumBundle.text),
])].filter((assetPath) => geometryAssetPattern.test(assetPath));
const msaRenderingPaths = [...new Set([
  ...msaApproval.text.matchAll(/(?:src|href)="([^"]*OPACY%20Rendering[^"]+\.(?:jpg|jpeg|png|webp))"/gi),
].map((match) => match[1]))];
const imageUrls = [
  ...officialAppAssetPaths.map((assetPath) => ({
    sourceKind: 'official-orioles-app-asset',
    sourcePath: assetPath,
    url: absoluteUrl(oriolesRoot.request.resolvedUrl, assetPath),
  })),
  ...msaRenderingPaths.map((assetPath) => ({
    sourceKind: 'msa-rendering',
    sourcePath: assetPath,
    url: absoluteUrl(msaApproval.request.resolvedUrl, assetPath),
  })),
];
const uniqueImages = imageUrls.filter((entry, index) => imageUrls.findIndex(
  (candidate) => candidate.url === entry.url,
) === index);
const imageDownloads = await Promise.all(uniqueImages.map(async (entry, index) => {
  const response = await fetchBytes(entry.url);
  return {
    ...entry,
    response,
    localName: outputImageName(index, entry.sourcePath, response.request.contentType),
  };
}));

await mkdir(path.join(outputDir, 'images'), { recursive: true });
const textSources = [
  ['msa-project.html', msaProject],
  ['msa-approval.html', msaApproval],
  ['msa-completion.html', msaCompletion],
  ['orioles-app-root.html', oriolesRoot],
  ['orioles-index-bundle.js', indexBundle],
  ['orioles-ballpark-bundle.js', ballparkBundle],
  ['orioles-premium-bundle.js', premiumBundle],
];
await Promise.all([
  ...textSources.map(([name, response]) => writeFile(path.join(outputDir, name), response.text, 'utf8')),
  ...imageDownloads.map((entry) => writeFile(
    path.join(outputDir, 'images', entry.localName),
    entry.response.bytes,
  )),
]);

const sourceTerms = [
  'first phase',
  'multi-phase',
  'new videoboard',
  'right field wall display',
  'Premium Club',
  'former press box',
  'Club Level',
  'Scoreboard Social',
  'covered patio',
  'Flag Court',
  'after the conclusion of the 2026 Orioles season',
];
const appFeaturePattern = /(?:videoboard|club level|flag court|premium club|homeplate club|sound system|ribbon board|right field|truist club|seating)/i;
const appFeatureStrings = [...new Set([
  ...matchingStrings(indexBundle.text, appFeaturePattern),
  ...matchingStrings(ballparkBundle.text, appFeaturePattern),
  ...matchingStrings(premiumBundle.text, appFeaturePattern),
])];
const officialOriolesStadiumMapMarkers = stadiumMapMarkers(ballparkBundle.text);
if (officialOriolesStadiumMapMarkers.length !== 9) {
  throw new Error(
    `Expected nine official Orioles stadium-map markers, received ${officialOriolesStadiumMapMarkers.length}`,
  );
}

const changes = [
  {
    changeId: 'center-field-video-board-and-scoreboard-social',
    location: 'center field',
    sourceStatus: 'officially completed for 2026 Opening Day',
    structuralRelevance: [
      'larger vertical video-board obstruction',
      'new covered patio below the board',
      'new social-space surfaces and supports',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: 'truist-club-former-press-box-area',
    location: 'behind home plate, sections C31 through C43',
    sourceStatus: 'officially completed for 2026 Opening Day',
    structuralRelevance: [
      'former press-box area replaced with indoor and outdoor club space',
      'seating and facade configuration changed behind home plate',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: 'club-level-first-and-third-base-bars',
    location: 'Club Level along first-base and third-base lines',
    sourceStatus: 'officially completed for 2026 Opening Day',
    structuralRelevance: [
      'two new climate-controlled bars',
      'new enclosed surfaces, furniture, and lighting',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: 'right-field-wall-display-and-ribbon-boards',
    location: 'right-field wall and Club Level',
    sourceStatus: 'officially completed for 2026 Opening Day',
    structuralRelevance: [
      'new right-field wall display',
      'new Club Level ribbon boards and supporting structures',
    ],
    exactAsBuiltGeometryEstablished: false,
  },
  {
    changeId: 'right-field-flag-court-bar',
    location: 'Right Field Flag Court',
    sourceStatus: 'officially under construction on 2026-03-26 and described by the current Orioles app as set to open after the All-Star break',
    structuralRelevance: [
      'redesigned open-air gathering space',
      'new wraparound bar and associated fixtures',
    ],
    exactAsBuiltGeometryEstablished: false,
    currentCompletionIndependentlyEstablished: false,
  },
  {
    changeId: 'post-2026-next-phase',
    location: 'details not yet published',
    sourceStatus: 'officially planned to begin after the 2026 Orioles season',
    structuralRelevance: ['future geometry remains unresolved'],
    exactAsBuiltGeometryEstablished: false,
  },
];

const inputs = {
  textSources: textSources.map(([name, response]) => ({
    path: path.join(outputDir, name),
    sha256: response.request.sha256,
  })),
  visualAssets: imageDownloads.map((entry) => ({
    path: path.join(outputDir, 'images', entry.localName),
    sha256: entry.response.request.sha256,
  })),
};

const stable = {
  analysisVersion: 'orioles-current-geometry-delta-audit-v2',
  inputs,
  stadiumId: 'orioles',
  source: {
    msaProjectUrl,
    msaApprovalUrl,
    msaCompletionUrl,
    oriolesRedirectUrl,
    officialOriolesResolvedUrl: oriolesRoot.request.resolvedUrl,
    indexBundleUrl,
    ballparkBundleUrl: ballparkBundle.request.resolvedUrl,
    premiumBundleUrl: premiumBundle.request.resolvedUrl,
    responses: Object.fromEntries(textSources.map(([name, response]) => [name, response.request])),
  },
  sourceEvidence: {
    msaProjectSnippets: snippets(msaProject.text, sourceTerms),
    msaApprovalSnippets: snippets(msaApproval.text, sourceTerms),
    msaCompletionSnippets: snippets(msaCompletion.text, sourceTerms),
    officialOriolesAppFeatureStrings: appFeatureStrings,
    officialOriolesStadiumMapMarkers,
  },
  officialVisualAssets: imageDownloads.map((entry) => ({
    sourceKind: entry.sourceKind,
    sourcePath: entry.sourcePath,
    sourceUrl: entry.url,
    localPath: path.join(outputDir, 'images', entry.localName),
    request: entry.response.request,
    visualOnly: true,
    establishesMetricAsBuiltGeometry: false,
  })),
  changes,
  currentGeometryAssessment: {
    lidarEpoch: '2024-12-17 through 2024-12-30',
    lidarPredatesDocumentedStructuralChanges: true,
    phaseOneCompletionEstablished: true,
    rightFieldFlagCourtCurrentCompletionEstablished: false,
    post2026FuturePhaseAcknowledged: true,
    exactCurrentAsBuiltCoordinatesEstablished: false,
    exactCurrentObstructionHeightsEstablished: false,
    exactCurrentOverhangUndersidesEstablished: false,
    currentWatertightShadowCastingVolumeEstablished: false,
  },
  geometryBoundary: {
    establishesCurrentChangeClasses: true,
    establishesOfficialVisualCandidates: true,
    establishesMeasuredHorizontalCoordinates: false,
    establishesMeasuredVerticalCoordinates: false,
    establishesAsBuiltDimensions: false,
    establishesOverhangUndersides: false,
    establishesCurrentWatertightShadowCastingVolume: false,
  },
  publication: {
    eligible: false,
    blockers: [
      '2024_LIDAR_PREDATES_2026_STRUCTURAL_CHANGES',
      'PHASE_ONE_AS_BUILT_COORDINATES_NOT_PUBLISHED',
      'PHASE_ONE_OBSTRUCTION_HEIGHTS_NOT_PUBLISHED',
      'PHASE_ONE_OVERHANG_UNDERSIDES_NOT_PUBLISHED',
      'RIGHT_FIELD_FLAG_COURT_CURRENT_COMPLETION_NOT_ESTABLISHED',
      'CURRENT_WATERTIGHT_SHADOW_CASTING_VOLUME_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'orioles-current-geometry-delta-audit',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
const manifestPath = path.join(outputDir, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  sourceResponseCount: textSources.length,
  officialVisualAssetCount: imageDownloads.length,
  changeCount: changes.length,
  changes,
  currentGeometryAssessment: artifact.currentGeometryAssessment,
  publication: artifact.publication,
}, null, 2));
