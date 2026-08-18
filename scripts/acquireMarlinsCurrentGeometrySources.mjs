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
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]),
    );
  }
  return value;
}

const allowedHosts = new Set([
  'www.miamidade.gov',
  'www.miamidadeclerk.gov',
  'www.miami.gov',
  'www.mlb.com',
  'www.leg.state.fl.us',
]);

const acceptedContentTypes = {
  'application/pdf': /application\/(?:pdf|octet-stream)/i,
  'text/html': /text\/html/i,
};

async function fetchSource(source, outputDirectory) {
  const requestedUrl = new URL(source.url);
  if (requestedUrl.protocol !== 'https:' || !allowedHosts.has(requestedUrl.hostname)) {
    throw new Error(`Unapproved source URL: ${source.url}`);
  }

  const response = await fetch(requestedUrl, {
    redirect: 'follow',
    headers: {
      accept: `${source.mediaType},*/*`,
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'no-cache',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
        + 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36 '
        + 'mlb-sun-tracker-marlins-current-geometry-audit/1.0',
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${source.url}`);

  const resolvedUrl = new URL(response.url);
  if (resolvedUrl.protocol !== 'https:' || !allowedHosts.has(resolvedUrl.hostname)) {
    throw new Error(`Unexpected source redirect: ${response.url}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type');
  const expected = acceptedContentTypes[source.mediaType];
  if (!expected?.test(contentType ?? '')) {
    throw new Error(`Expected ${source.mediaType} for ${source.key}, received ${contentType}`);
  }

  const outputPath = path.join(outputDirectory, source.fileName);
  await writeFile(outputPath, bytes);
  return {
    key: source.key,
    sourceAuthority: source.sourceAuthority,
    mediaType: source.mediaType,
    localPath: path.relative(process.cwd(), outputPath),
    requestedUrl: source.url,
    resolvedUrl: response.url,
    response: {
      status: response.status,
      contentType,
      contentLength: response.headers.get('content-length'),
      etag: response.headers.get('etag'),
      lastModified: response.headers.get('last-modified'),
    },
    byteLength: bytes.length,
    sha256: sha256(bytes),
  };
}

const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-current-geometry-sources-2026',
));
await mkdir(outputDirectory, { recursive: true });

const sources = [
  {
    key: 'miami-dade-construction-administration-agreement-2009',
    sourceAuthority: 'Miami-Dade County',
    mediaType: 'application/pdf',
    fileName: 'construction-administration-agreement-2009.pdf',
    url: option(
      'construction-agreement-url',
      'https://www.miamidade.gov/govaction/legistarfiles/MinMatters/Y2009/091009min.pdf',
    ),
  },
  {
    key: 'miami-dade-legislative-matter-090730',
    sourceAuthority: 'Miami-Dade County',
    mediaType: 'text/html',
    fileName: 'miami-dade-legislative-matter-090730.html',
    url: option(
      'legislative-matter-url',
      'https://www.miamidade.gov/govaction/matter.asp?file=true&fileAnalysis=false&matter=090730&yearFolder=Y2009',
    ),
  },
  {
    key: 'miami-dade-county-owned-property-current',
    sourceAuthority: 'Miami-Dade County',
    mediaType: 'text/html',
    fileName: 'miami-dade-county-owned-property-current.html',
    url: option(
      'county-property-url',
      'https://www.miamidade.gov/apps/ISD/RealEstate_Portal/CountyOwnedProperties?pageIndex=402&sortOrder=zone_desc',
    ),
  },
  {
    key: 'miami-dade-acfr-2025-current',
    sourceAuthority: 'Miami-Dade County Clerk of the Court and Comptroller',
    mediaType: 'application/pdf',
    fileName: 'miami-dade-acfr-2025.pdf',
    url: option(
      'county-acfr-2025-url',
      'https://www.miamidadeclerk.gov/resources-clerk/library/finance/cafr2025-complete.pdf',
    ),
  },
  {
    key: 'miami-marlins-roof-current',
    sourceAuthority: 'Miami Marlins and MLB',
    mediaType: 'text/html',
    fileName: 'miami-marlins-roof-current.html',
    url: option('marlins-roof-url', 'https://www.mlb.com/marlins/ballpark/roof'),
  },
  {
    key: 'miami-marlins-contact-current',
    sourceAuthority: 'Miami Marlins and MLB',
    mediaType: 'text/html',
    fileName: 'miami-marlins-contact-current.html',
    url: option(
      'marlins-contact-url',
      'https://www.mlb.com/marlins/official-information/contact',
    ),
  },
  {
    key: 'miami-marlins-front-office-current',
    sourceAuthority: 'Miami Marlins and MLB',
    mediaType: 'text/html',
    fileName: 'miami-marlins-front-office-current.html',
    url: option(
      'marlins-front-office-url',
      'https://www.mlb.com/marlins/team/front-office',
    ),
  },
  {
    key: 'city-of-miami-building-records-current',
    sourceAuthority: 'City of Miami',
    mediaType: 'text/html',
    fileName: 'city-of-miami-building-records-current.html',
    url: option(
      'city-building-records-url',
      'https://www.miami.gov/Permits-Construction/Property-Information/Request-Building-Records-Microfilm',
    ),
  },
  {
    key: 'florida-statutes-119-071-current',
    sourceAuthority: 'Florida Legislature',
    mediaType: 'text/html',
    fileName: 'florida-statutes-119-071-current.html',
    url: option(
      'florida-statutes-url',
      'https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0100-0199/0119/Sections/0119.071.html',
    ),
  },
];

const records = [];
for (const source of sources) {
  records.push(await fetchSource(source, outputDirectory));
}

const stable = {
  analysisVersion: 'marlins-current-geometry-source-acquisition-v1',
  stadiumId: 'marlins',
  acquiredOn: '2026-08-11',
  inputs: Object.fromEntries(records.map((record) => [
    record.key,
    {
      path: record.localPath,
      sha256: record.sha256,
    },
  ])),
  sources: records,
  boundary: {
    officialSourcesOnly: true,
    establishesCurrentChangeInventory: false,
    establishesMetricGeometry: false,
    establishesAsBuiltGeometry: false,
    establishesCurrentRoofPanelCoordinates: false,
    establishesRoofConfigurationForAnyGame: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'SOURCE_DOCUMENTS_REQUIRE_GEOMETRY_REVIEW',
      'MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_METRIC_ROOF_VOLUME_NOT_ESTABLISHED',
      'GAME_SPECIFIC_ROOF_CONFIGURATION_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-current-geometry-source-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};

const manifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  sourceCount: records.length,
  sources: records.map(({ key, byteLength, sha256: digest }) => ({
    key,
    byteLength,
    sha256: digest,
  })),
}, null, 2));
