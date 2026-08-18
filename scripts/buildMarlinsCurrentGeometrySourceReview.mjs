#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback) {
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

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

function requireText(value, expected, label) {
  if (!value.includes(expected)) throw new Error(`${label}: missing ${JSON.stringify(expected)}`);
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

const sourceManifestPath = path.resolve(option(
  'source-manifest',
  'tmp/lidar/marlins-current-geometry-sources-2026/manifest.json',
));
const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-current-geometry-source-review-2026',
));
const pdftoppm = option('pdftoppm', 'pdftoppm');
const pdftotext = option('pdftotext', 'pdftotext');

await mkdir(outputDirectory, { recursive: true });
const sourceManifestBytes = await readFile(sourceManifestPath);
const sourceManifest = JSON.parse(sourceManifestBytes.toString('utf8'));
requireEqual(
  sourceManifest.artifactKind,
  'marlins-current-geometry-source-acquisition',
  'source manifest kind',
);
requireEqual(sourceManifest.stadiumId, 'marlins', 'source manifest stadiumId');

const sources = new Map(sourceManifest.sources.map((source) => [source.key, source]));
const requiredSourceKeys = [
  'miami-dade-construction-administration-agreement-2009',
  'miami-dade-legislative-matter-090730',
  'miami-dade-county-owned-property-current',
  'miami-dade-acfr-2025-current',
  'miami-marlins-roof-current',
  'miami-marlins-contact-current',
  'miami-marlins-front-office-current',
  'city-of-miami-building-records-current',
  'florida-statutes-119-071-current',
];
for (const key of requiredSourceKeys) {
  if (!sources.has(key)) throw new Error(`Required source is absent: ${key}`);
}

for (const source of sourceManifest.sources) {
  const sourceBytes = await readFile(path.resolve(source.localPath));
  requireEqual(sha256(sourceBytes), source.sha256, `${source.key} SHA-256`);
}

const agreement = sources.get('miami-dade-construction-administration-agreement-2009');
const agreementPath = path.resolve(agreement.localPath);
const reviewedPages = [
  { pdfPage: 45, agreementPage: 4, topic: 'construction-documents-definition' },
  { pdfPage: 46, agreementPage: 5, topic: 'design-documents-definitions' },
  { pdfPage: 53, agreementPage: 12, topic: 'survey-on-file-with-clerk' },
  { pdfPage: 69, agreementPage: 28, topic: 'stadium-design-management' },
  { pdfPage: 70, agreementPage: 29, topic: 'architect-contract-review' },
  { pdfPage: 71, agreementPage: 30, topic: 'government-design-document-review' },
  { pdfPage: 72, agreementPage: 31, topic: 'government-design-document-revisions' },
  { pdfPage: 73, agreementPage: 32, topic: 'use-of-plans-license' },
  { pdfPage: 74, agreementPage: 33, topic: 'complete-project-records-requirement' },
  { pdfPage: 75, agreementPage: 34, topic: 'as-built-delivery-requirement' },
];

const renderedPages = [];
for (const page of reviewedPages) {
  const pageToken = String(page.pdfPage).padStart(3, '0');
  const agreementToken = String(page.agreementPage).padStart(3, '0');
  const outputPrefix = path.join(
    outputDirectory,
    `caa-pdf-${pageToken}-agreement-${agreementToken}`,
  );
  execFileSync(pdftoppm, [
    '-f', String(page.pdfPage),
    '-l', String(page.pdfPage),
    '-singlefile',
    '-png',
    '-r', '160',
    agreementPath,
    outputPrefix,
  ], { stdio: 'pipe' });
  const outputPath = `${outputPrefix}.png`;
  const outputBytes = await readFile(outputPath);
  renderedPages.push({
    ...page,
    path: path.relative(process.cwd(), outputPath),
    byteLength: outputBytes.length,
    sha256: sha256(outputBytes),
    visualReviewStatus: 'manually-reviewed',
  });
}

const acfr2025 = sources.get('miami-dade-acfr-2025-current');
const acfr2025Path = path.resolve(acfr2025.localPath);
const acfr2025PageNumber = 109;
const acfr2025PageText = execFileSync(pdftotext, [
  '-f', String(acfr2025PageNumber),
  '-l', String(acfr2025PageNumber),
  '-layout',
  acfr2025Path,
  '-',
], { encoding: 'utf8' });
const normalizedAcfr2025PageText = normalizeWhitespace(acfr2025PageText);
requireText(
  normalizedAcfr2025PageText,
  'As per the Operating Agreement between the County, the Marlins Stadium Operator, LLC (the Operator) and the City of Miami (City), a Capital Reserve Fund was established',
  'FY 2025 ACFR stadium operator and reserve statement',
);
requireText(
  normalizedAcfr2025PageText,
  'As of September 30, 2025, the balance of the Capital Reserve Fund was $15.2 million',
  'FY 2025 ACFR stadium reserve balance',
);
const acfr2025OutputPrefix = path.join(
  outputDirectory,
  `acfr2025-pdf-${String(acfr2025PageNumber).padStart(3, '0')}-stadium-reserve`,
);
execFileSync(pdftoppm, [
  '-f', String(acfr2025PageNumber),
  '-l', String(acfr2025PageNumber),
  '-singlefile',
  '-png',
  '-r', '160',
  acfr2025Path,
  acfr2025OutputPrefix,
], { stdio: 'pipe' });
const acfr2025RenderedPath = `${acfr2025OutputPrefix}.png`;
const acfr2025RenderedBytes = await readFile(acfr2025RenderedPath);

const matterHtml = await readFile(
  path.resolve(sources.get('miami-dade-legislative-matter-090730').localPath),
  'utf8',
);
requireText(
  matterHtml,
  'will then own the land and the stadium structure',
  'County ownership statement',
);
requireText(
  matterHtml,
  'HOK Sport (HOK) is the primary architectural and design firm',
  'architect statement',
);
requireText(
  matterHtml,
  'Marlins Stadium Operator, LLC (Operator) will operate and manage the ballpark',
  'stadium operator statement',
);
requireText(
  matterHtml,
  'all of the day-to-day operations of the ballpark',
  'operator day-to-day responsibility statement',
);
requireText(
  matterHtml,
  'including maintenance and repairs, security, staffing, scheduling and contracting for events',
  'operator maintenance responsibility statement',
);

const roofHtml = await readFile(
  path.resolve(sources.get('miami-marlins-roof-current').localPath),
  'utf8',
);
requireText(
  roofHtml,
  'Roof panels can be operated independently to produce micro shading effects.',
  'independent roof-panel statement',
);
requireText(
  roofHtml,
  'one (1) upper panel and two (2) lower panels',
  'roof-panel count statement',
);

const marlinsContactHtml = await readFile(
  path.resolve(sources.get('miami-marlins-contact-current').localPath),
  'utf8',
);
requireText(marlinsContactHtml, 'Miami Marlins<br/>501 Marlins Way', 'Marlins mail route');
requireText(
  marlinsContactHtml,
  'General Information: (305) 480-1300',
  'Marlins general contact route',
);
requireText(marlinsContactHtml, 'All Other Inquiries', 'Marlins inquiry route');

const marlinsFrontOfficeHtml = await readFile(
  path.resolve(sources.get('miami-marlins-front-office-current').localPath),
  'utf8',
);
requireText(
  marlinsFrontOfficeHtml,
  'Ballpark Operations &amp; Events',
  'Marlins ballpark operations department route',
);

const cityRecordsHtml = await readFile(
  path.resolve(sources.get('city-of-miami-building-records-current').localPath),
  'utf8',
);
requireText(cityRecordsHtml, '$44.00 complete permit history search', 'City search fee');
requireText(cityRecordsHtml, 'Please anticipate 20 working days', 'City search time');
requireText(cityRecordsHtml, 'stadium', 'City stadium authorization scope');
requireText(cityRecordsHtml, 'require explicit owner permission', 'City owner permission');

const statuteHtml = await readFile(
  path.resolve(sources.get('florida-statutes-119-071-current').localPath),
  'utf8',
);
requireText(
  statuteHtml,
  'internal layout and structural elements of a building, arena, stadium',
  'Florida stadium-plan exemption',
);

const stable = {
  analysisVersion: 'marlins-current-geometry-manual-source-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  sourceAcquisitionArtifactVersion: sourceManifest.artifactVersion,
  inputs: {
    sourceManifest: {
      path: path.relative(process.cwd(), sourceManifestPath),
      sha256: sha256(sourceManifestBytes),
      artifactVersion: sourceManifest.artifactVersion,
    },
  },
  reviewedDocuments: [
    {
      sourceKey: agreement.key,
      sourceSha256: agreement.sha256,
      reviewMethod: 'rendered-page visual review',
      renderedPages,
      findings: [
        {
          agreementSection: 'Definitions',
          agreementPage: 4,
          pdfPage: 45,
          finding: 'Construction Documents are architectural drawings, specifications, and other documents detailed enough for permitting and construction.',
        },
        {
          agreementSection: 'Definitions',
          agreementPage: 5,
          pdfPage: 46,
          finding: 'Design Development Documents include plans, sections, elevations, typical construction details, and equipment layouts. Design Documents means the latest schematic, design development, or construction documents.',
        },
        {
          agreementSection: '3.1',
          agreementPage: 12,
          pdfPage: 53,
          finding: 'The stadium-site ALTA/ACSM survey is incorporated by reference and a copy is stated to be on file with the Clerk of the Board.',
        },
        {
          agreementSection: '4.3(a)',
          agreementPage: 30,
          pdfPage: 71,
          finding: 'County and City representatives had the right to review and approve the schematic, design development, and construction documents for the stadium.',
        },
        {
          agreementSection: '4.4',
          agreementPage: 32,
          pdfPage: 73,
          finding: 'The Architect Contract was required to grant the County a perpetual license to use the Design Documents for stadium development, operation, and modification, subject to payment and statutory security procedures. The City license is conditioned on site reversion.',
        },
        {
          agreementSection: '5.1(f)',
          agreementPage: 33,
          pdfPage: 74,
          finding: 'The Stadium Developer was required to maintain complete and accurate design and construction records, including Design Documents, shop drawings, Change Orders, as-built drawings, permits, reports, and related records.',
        },
        {
          agreementSection: '5.1(j)',
          agreementPage: 34,
          pdfPage: 75,
          finding: 'At Final Completion, the Stadium Developer was required to provide the County and City representatives an as-built set of Construction Documents revised to show the as-built stadium and construction changes.',
        },
      ],
    },
    {
      sourceKey: 'miami-dade-legislative-matter-090730',
      sourceSha256: sources.get('miami-dade-legislative-matter-090730').sha256,
      reviewMethod: 'checksum-locked HTML text review',
      findings: [
        'The County matter identifies County ownership of the land and stadium structure.',
        'The County matter identifies HOK Sport as the primary architectural and design firm.',
        'The County matter says the Operating Agreement appoints Marlins Stadium Operator, LLC to operate and manage the ballpark.',
        'The County matter assigns the Operator the ballpark day-to-day operations and associated management costs, including maintenance and repairs, staffing, scheduling, and event contracting.',
      ],
    },
    {
      sourceKey: acfr2025.key,
      sourceSha256: acfr2025.sha256,
      reviewMethod: 'checksum-locked PDF text extraction and rendered-page visual review',
      renderedPages: [{
        pdfPage: acfr2025PageNumber,
        path: path.relative(process.cwd(), acfr2025RenderedPath),
        byteLength: acfr2025RenderedBytes.length,
        sha256: sha256(acfr2025RenderedBytes),
        visualReviewStatus: 'manually-reviewed',
      }],
      findings: [
        'The audited FY 2025 County financial report identifies an Operating Agreement among the County, Marlins Stadium Operator, LLC, and the City and reports the County-owned stadium Capital Reserve Fund as of September 30, 2025.',
        'The audited report gives a September 30, 2025 Capital Reserve Fund balance of 15.2 million dollars and says the fund may be used for necessary improvements or emergency capital repairs to the stadium.',
        'The accounting disclosure establishes an operator-agreement and County financial-record route through September 30, 2025. It does not prove the legal operator identity on August 11, 2026 or possession of section 9.5 annual maintenance reports.',
      ],
    },
    {
      sourceKey: 'miami-marlins-roof-current',
      sourceSha256: sources.get('miami-marlins-roof-current').sha256,
      reviewMethod: 'checksum-locked HTML text review',
      findings: [
        'The current official roof page identifies one upper and two lower operable panels.',
        'The current official roof page says the panels can be operated independently to produce micro shading effects.',
      ],
    },
    {
      sourceKey: 'miami-marlins-contact-current',
      sourceSha256: sources.get('miami-marlins-contact-current').sha256,
      reviewMethod: 'checksum-locked HTML text review',
      findings: [
        'The current official Marlins contact page publishes a mail route at 501 Marlins Way, a general-information phone route, and an All Other Inquiries route.',
      ],
    },
    {
      sourceKey: 'miami-marlins-front-office-current',
      sourceSha256: sources.get('miami-marlins-front-office-current').sha256,
      reviewMethod: 'checksum-locked HTML text review',
      findings: [
        'The current official Marlins front-office page identifies a Ballpark Operations and Events department.',
      ],
    },
    {
      sourceKey: 'city-of-miami-building-records-current',
      sourceSha256: sources.get('city-of-miami-building-records-current').sha256,
      reviewMethod: 'checksum-locked HTML text review',
      findings: [
        'The current City page lists a non-refundable 44 dollar complete permit-history search and a 20-working-day expectation after payment.',
        'The current City page says plans for stadiums and other government structures require explicit owner permission.',
      ],
    },
    {
      sourceKey: 'florida-statutes-119-071-current',
      sourceSha256: sources.get('florida-statutes-119-071-current').sha256,
      reviewMethod: 'checksum-locked HTML text review',
      findings: [
        'The current statute exempts plans depicting the internal layout and structural elements of government-owned stadiums from ordinary public inspection and defines limited disclosure paths.',
      ],
    },
  ],
  recordsRoute: {
    contractuallyRequiredAsBuiltRecipients: [
      'Miami-Dade County representative',
      'City of Miami representative',
    ],
    contractuallyRequiredAsBuiltDeliveryEstablished: true,
    contractuallyRequiredCompleteProjectRecordsEstablished: true,
    currentAgencyPossessionEstablished: false,
    currentRecordIndexEstablished: false,
    currentReleaseEligibilityEstablished: false,
    operatingAgreementNamedStadiumOperator: 'Marlins Stadium Operator, LLC',
    operatingAgreementOperatorDayToDayResponsibilityEstablished: true,
    operatingAgreementOperatorMaintenanceAndRepairResponsibilityEstablished: true,
    current2026OperatorIdentityEstablished: false,
    operatorAgreementAccountingIdentityEstablishedThrough: '2025-09-30',
    operatorAgreementAccountingIdentityEstablishedThrough2025: true,
    countyOwnedStadiumCapitalReserveFundReportedThrough2025: true,
    countyOwnedStadiumCapitalReserveFundBalanceAsOf2025Usd: 15200000,
    currentCountyStadiumFinancialRecordPossessionEstablished: true,
    currentCountySection9Point5MaintenanceReportPossessionEstablished: false,
    currentOperatorRecordPossessionEstablished: false,
    currentOperatorControlSystemLogExistenceEstablished: false,
    currentMarlinsBallparkOperationsDepartmentRouteEstablished: true,
    currentMarlinsGeneralContactUrl: 'https://www.mlb.com/marlins/official-information/contact',
    currentMarlinsGeneralInformationPhone: '305-480-1300',
    currentMarlinsMailRoute: 'Miami Marlins, 501 Marlins Way, Miami, FL 33125',
    currentMarlinsExternalRequestSubmitted: false,
    paidCitySearchAuthorized: false,
    externalRequestSubmitted: false,
  },
  geometryBoundary: {
    establishesMetricStadiumFrame: false,
    establishesMeasuredRowCoordinates: false,
    establishesMeasuredRowElevations: false,
    establishesCurrentMetricObstructionVolume: false,
    establishesCurrentRoofPanelCoordinates: false,
    establishesGameSpecificRoofConfiguration: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'CURRENT_AGENCY_RECORD_POSSESSION_NOT_CONFIRMED',
      'RECORD_RELEASE_PATH_NOT_AUTHORIZED',
      'MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_METRIC_ROOF_VOLUME_NOT_ESTABLISHED',
      'GAME_SPECIFIC_ROOF_CONFIGURATION_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-current-geometry-manual-source-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};

const outputPath = path.join(outputDirectory, 'review.json');
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  renderedPageCount: renderedPages.length + 1,
  recordsRoute: artifact.recordsRoute,
  publication: artifact.publication,
}, null, 2));
