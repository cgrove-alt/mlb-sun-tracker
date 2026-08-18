#!/usr/bin/env node

import { createHash } from 'node:crypto';
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
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

async function readJson(inputPath) {
  const resolvedPath = path.resolve(inputPath);
  const bytes = await readFile(resolvedPath);
  return {
    path: path.relative(process.cwd(), resolvedPath),
    bytes,
    sha256: sha256(bytes),
    value: JSON.parse(bytes.toString('utf8')),
  };
}

const paths = {
  sourceManifest: option(
    'source-manifest',
    'tmp/lidar/marlins-current-geometry-sources-2026/manifest.json',
  ),
  fullRenderManifest: option(
    'full-render-manifest',
    'tmp/lidar/marlins-caa-image-exhibits-review-2026/manifest.json',
  ),
  highResolutionRenderManifest: option(
    'high-resolution-render-manifest',
    'tmp/lidar/marlins-caa-program-highres-review-2026/manifest.json',
  ),
  operatingAgreementMaintenanceRenderManifest: option(
    'operating-agreement-maintenance-render-manifest',
    'tmp/lidar/marlins-operating-agreement-maintenance-review-2026/manifest.json',
  ),
  outputDirectory: option(
    'output-dir',
    'tmp/lidar/marlins-caa-image-exhibit-manual-review-2026',
  ),
};

const [
  sourceManifest,
  fullRenderManifest,
  highResolutionRenderManifest,
  operatingAgreementMaintenanceRenderManifest,
] = await Promise.all([
  readJson(paths.sourceManifest),
  readJson(paths.fullRenderManifest),
  readJson(paths.highResolutionRenderManifest),
  readJson(paths.operatingAgreementMaintenanceRenderManifest),
]);

requireEqual(
  sourceManifest.value.artifactKind,
  'marlins-current-geometry-source-acquisition',
  'source manifest kind',
);
const agreement = sourceManifest.value.sources.find((source) => (
  source.key === 'miami-dade-construction-administration-agreement-2009'
));
if (!agreement) throw new Error('Construction Administration Agreement source is absent');

for (const [label, renderManifest, range, pageCount, contactSheetCount] of [
  ['full render', fullRenderManifest, [100, 391], 292, 15],
  ['high-resolution render', highResolutionRenderManifest, [126, 152], 27, 3],
]) {
  requireEqual(renderManifest.value.analysisVersion, 'pdf-review-render-v1', `${label} kind`);
  requireEqual(renderManifest.value.sourcePageCount, 391, `${label} source page count`);
  requireEqual(renderManifest.value.pageCount, pageCount, `${label} rendered page count`);
  requireEqual(
    renderManifest.value.contactSheets?.length,
    contactSheetCount,
    `${label} contact-sheet count`,
  );
  requireEqual(
    renderManifest.value.source?.sha256,
    agreement.sha256,
    `${label} source checksum`,
  );
  requireEqual(
    renderManifest.value.renderedPageRange,
    range,
    `${label} rendered page range`,
  );
}

requireEqual(
  operatingAgreementMaintenanceRenderManifest.value.analysisVersion,
  'pdf-review-render-v1',
  'Operating Agreement maintenance render kind',
);
requireEqual(
  operatingAgreementMaintenanceRenderManifest.value.sourcePageCount,
  391,
  'Operating Agreement maintenance source page count',
);
requireEqual(
  operatingAgreementMaintenanceRenderManifest.value.renderedPageRange,
  [232, 236],
  'Operating Agreement maintenance rendered page range',
);
requireEqual(
  operatingAgreementMaintenanceRenderManifest.value.pageCount,
  5,
  'Operating Agreement maintenance rendered page count',
);
requireEqual(
  operatingAgreementMaintenanceRenderManifest.value.source?.sha256,
  agreement.sha256,
  'Operating Agreement maintenance source checksum',
);

async function lockContactSheets(renderManifest, label) {
  const locked = [];
  for (const sheet of renderManifest.value.contactSheets) {
    const sheetPath = path.resolve(sheet.path);
    const sheetBytes = await readFile(sheetPath);
    requireEqual(sha256(sheetBytes), sheet.sha256, `${label} ${sheet.path} checksum`);
    locked.push({
      path: path.relative(process.cwd(), sheetPath),
      sha256: sheet.sha256,
    });
  }
  return locked;
}

const [fullReviewContactSheets, highResolutionReviewContactSheets] = await Promise.all([
  lockContactSheets(fullRenderManifest, 'full review contact sheet'),
  lockContactSheets(highResolutionRenderManifest, 'high-resolution contact sheet'),
]);

const operatingAgreementMaintenancePages = [];
for (const page of operatingAgreementMaintenanceRenderManifest.value.pages) {
  const pagePath = path.resolve(page.path);
  const pageBytes = await readFile(pagePath);
  requireEqual(sha256(pageBytes), page.sha256, `Operating Agreement PDF page ${page.pageNumber}`);
  operatingAgreementMaintenancePages.push({
    pageNumber: page.pageNumber,
    path: path.relative(process.cwd(), pagePath),
    sha256: page.sha256,
    visualReviewStatus: 'manually-reviewed-at-high-resolution',
  });
}

const stable = {
  analysisVersion: 'marlins-caa-image-exhibit-manual-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    sourceManifest: {
      path: sourceManifest.path,
      sha256: sourceManifest.sha256,
      artifactVersion: sourceManifest.value.artifactVersion,
    },
    fullRenderManifest: {
      path: fullRenderManifest.path,
      sha256: fullRenderManifest.sha256,
      artifactVersion: fullRenderManifest.value.artifactVersion,
    },
    highResolutionRenderManifest: {
      path: highResolutionRenderManifest.path,
      sha256: highResolutionRenderManifest.sha256,
      artifactVersion: highResolutionRenderManifest.value.artifactVersion,
    },
    operatingAgreementMaintenanceRenderManifest: {
      path: operatingAgreementMaintenanceRenderManifest.path,
      sha256: operatingAgreementMaintenanceRenderManifest.sha256,
      artifactVersion: operatingAgreementMaintenanceRenderManifest.value.artifactVersion,
    },
    fullReviewContactSheets,
    highResolutionReviewContactSheets,
    operatingAgreementMaintenancePages,
  },
  reviewScope: {
    sourcePdfPageCount: 391,
    fullImageReviewPageRange: [100, 391],
    fullImageReviewContactSheetCount: 15,
    highResolutionSecondPassPageRange: [126, 152],
    highResolutionSecondPassContactSheetCount: 3,
    operatingAgreementMaintenanceExactPageRange: [232, 236],
    operatingAgreementMaintenanceExactPageCount: 5,
    reviewStatus: 'manually-reviewed',
  },
  findings: [
    {
      pdfPages: [126, 127],
      category: 'site-context-maps',
      finding: 'Exhibits A and B are January 21, 2009 stadium-site and entire-site context maps. They depict parcel-scale stadium and parking envelopes but do not define the seating bowl, roof surfaces, row coordinates, elevations, or an as-built condition.',
    },
    {
      pdfPages: [129, 133],
      category: 'systems-general-description',
      finding: 'The systems narrative describes food service, sound, mechanical, security, electrical, lighting, communications, and display systems. It contains no dimensioned physical geometry suitable for shadow casting.',
    },
    {
      pdfPages: [134, 152],
      category: 'project-program-statement',
      finding: 'The Project Program Statement lists program areas, approximate capacity, seat categories, room functions, and broad level relationships. It is a program schedule, not a construction drawing set, seating plan, building section, elevation, or as-built record.',
    },
    {
      pdfPages: [153, 190],
      category: 'administrative-exhibits',
      finding: 'The remaining Construction Administration Agreement exhibits contain deeds, legal descriptions, budgets, schedules, procurement terms, requisition forms, and maps. They contain no row-level or roof-mechanization geometry.',
    },
    {
      pdfPages: [191, 391],
      category: 'other-stadium-agreements',
      finding: 'The Operating Agreement, City Parking Agreement, Non-Relocation Agreement, Assurance Agreement, and related exhibits contain operating, financial, insurance, and parking material. They do not include the stadium construction drawing packages required by the records clauses.',
    },
    {
      pdfPages: [232, 232],
      operatingAgreementPages: [34, 34],
      category: 'operator-maintenance-and-capital-improvement-duty',
      finding: 'Operating Agreement section 9.1 requires the Operator to undertake and pay for all Maintenance and Repairs. Section 9.2 requires prior written approval by the County Representative for a nonemergency Capital Improvement above the contractual threshold.',
    },
    {
      pdfPages: [233, 233],
      operatingAgreementPages: [35, 35],
      category: 'capital-reserve-withdrawal-documentation',
      finding: 'Operating Agreement section 9.3(c) requires the Operator to give Government Representatives each Capital Reserve Fund withdrawal request and a description of the funded work, and to provide payment documentation upon request.',
    },
    {
      pdfPages: [234, 235],
      operatingAgreementPages: [36, 37],
      category: 'annual-government-maintenance-and-capital-report-route',
      finding: 'Operating Agreement section 9.5 requires the Operator to provide County and City representatives an annual Capital Reserve Fund report. The required contents include prior capital-project details, anticipated Necessary Improvements, maintenance and repair work conducted and planned on mechanical, electrical, and structural systems, and anticipated other Capital Improvements. Government and Operator representatives collaboratively review the report, and planned Necessary Improvements and the annual budget require government approval subject to the agreement.',
    },
    {
      pdfPages: [236, 236],
      operatingAgreementPages: [38, 38],
      category: 'city-report-right-limitation',
      finding: 'Operating Agreement section 9.5(4) limits the City representative information, participation, and approval rights under section 9.5 to periods when the City is contributing to the Capital Reserve Fund. The page does not establish present City report possession.',
    },
  ],
  searchedGeometryRecordClasses: {
    constructionDrawingIndexPresent: false,
    seatingBowlPlanPresent: false,
    rowLayoutOrRowDimensionSchedulePresent: false,
    buildingSectionPresent: false,
    buildingElevationPresent: false,
    roofMechanizationDrawingPresent: false,
    roofUndersideGeometryPresent: false,
    asBuiltDrawingPresent: false,
    surveyControlCoordinatesPresent: false,
    currentChangeDrawingPresent: false,
  },
  conclusion: {
    completeVisualReviewOfOfficial391PageFile: true,
    usefulRecordsCustodyEvidencePresent: true,
    exactMetricGeometryPresent: false,
    result: 'The official agreement file establishes the records route and program context but does not contain the design-development, construction-document, or as-built geometry needed to resolve current rows and shadow-casting surfaces.',
  },
  recordsRoute: {
    operatorAllMaintenanceAndRepairsDutyEstablished: true,
    countyApprovalRouteForAboveThresholdCapitalImprovementsEstablished: true,
    governmentWithdrawalRequestAndPaymentDocumentationRouteEstablished: true,
    annualCountyMaintenanceAndStructuralSystemReportRouteEstablished: true,
    annualCityMaintenanceAndStructuralSystemReportRouteHistoricallyEstablished: true,
    presentCitySection9Point5RightsEstablished: false,
    currentCountyReportPossessionEstablished: false,
    currentCityReportPossessionEstablished: false,
    roofSpecificMaintenanceRecordIdentified: false,
    gameSpecificPanelPositionRecordIdentified: false,
  },
  geometryBoundary: {
    establishesCompleteVisualReviewOfSource: true,
    establishesMetricStadiumFrame: false,
    establishesMeasuredRowGeometry: false,
    establishesCurrentAsBuiltGeometry: false,
    establishesCompleteObstructionGeometry: false,
    establishesOverhangUndersides: false,
    establishesCurrentRoofPanelCoordinates: false,
    establishesCurrentChangeInventory: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'CONSTRUCTION_DRAWING_PACKAGES_NOT_INCLUDED',
      'AS_BUILT_DRAWING_SET_NOT_INCLUDED',
      'MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_METRIC_ROOF_VOLUME_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-caa-image-exhibit-manual-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};

const outputDirectory = path.resolve(paths.outputDirectory);
await mkdir(outputDirectory, { recursive: true });
const outputPath = path.join(outputDirectory, 'review.json');
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  reviewScope: artifact.reviewScope,
  searchedGeometryRecordClasses: artifact.searchedGeometryRecordClasses,
  publication: artifact.publication,
}, null, 2));
