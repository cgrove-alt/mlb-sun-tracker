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

const acquisitionPath = path.resolve(option(
  'acquisition',
  'tmp/lidar/marlins-city-weblink-dd-plans-2009/manifest.json',
));
const renderManifestPath = path.resolve(option(
  'render-manifest',
  'tmp/lidar/marlins-city-weblink-dd-plan-review-render-2026/manifest.json',
));
const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-city-weblink-dd-plan-review-2026',
));

const [acquisition, renderManifest] = await Promise.all([
  readJson(acquisitionPath),
  readJson(renderManifestPath),
]);

requireEqual(
  acquisition.value.artifactKind,
  'marlins-city-weblink-design-plan-acquisition',
  'acquisition kind',
);
requireEqual(acquisition.value.stadiumId, 'marlins', 'acquisition stadiumId');
requireEqual(acquisition.value.source?.entryId, 1198453, 'City record entry ID');
requireEqual(acquisition.value.source?.fileId, '09-00141mu', 'City file ID');
requireEqual(acquisition.value.source?.resolution, 'R-09-0199', 'City resolution');
requireEqual(acquisition.value.source?.status, 'Final', 'City record status');
requireEqual(acquisition.value.document?.pageCount, 96, 'source page count');
requireEqual(acquisition.value.document?.imagedPageCount, 96, 'imaged page count');
requireEqual(
  acquisition.value.document?.imageDimensions,
  ['2550x3300@300x300dpi'],
  'source image dimensions',
);
requireEqual(
  acquisition.value.geometryBoundary?.establishesConstructionAsBuiltGeometry,
  false,
  'construction as-built boundary',
);
requireEqual(
  acquisition.value.geometryBoundary?.establishesCurrentGeometry,
  false,
  'current geometry boundary',
);

requireEqual(renderManifest.value.analysisVersion, 'pdf-review-render-v1', 'render kind');
requireEqual(renderManifest.value.sourcePageCount, 96, 'render source page count');
requireEqual(renderManifest.value.renderedPageRange, [1, 96], 'rendered page range');
requireEqual(renderManifest.value.pageCount, 96, 'rendered page count');
requireEqual(renderManifest.value.contactSheets?.length, 6, 'contact sheet count');
requireEqual(
  renderManifest.value.source?.sha256,
  acquisition.value.inputs?.designDevelopmentPlans?.sha256,
  'render source checksum',
);

const renderedPagesByNumber = new Map(
  renderManifest.value.pages.map((pageRecord) => [pageRecord.pageNumber, pageRecord]),
);
const reviewedPageNumbers = [
  2,
  ...Array.from({ length: 16 }, (_, index) => 41 + index),
  ...Array.from({ length: 5 }, (_, index) => 92 + index),
];
const lockedReviewedPages = [];
for (const pageNumber of reviewedPageNumbers) {
  const pageRecord = renderedPagesByNumber.get(pageNumber);
  if (!pageRecord) throw new Error(`Rendered review page ${pageNumber} is absent`);
  const pagePath = path.resolve(pageRecord.path);
  const pageBytes = await readFile(pagePath);
  requireEqual(sha256(pageBytes), pageRecord.sha256, `review page ${pageNumber} checksum`);
  lockedReviewedPages.push({
    pageNumber,
    path: path.relative(process.cwd(), pagePath),
    sha256: pageRecord.sha256,
    width: pageRecord.width,
    height: pageRecord.height,
  });
}

const lockedContactSheets = [];
for (const sheetRecord of renderManifest.value.contactSheets) {
  const sheetPath = path.resolve(sheetRecord.path);
  const sheetBytes = await readFile(sheetPath);
  requireEqual(sha256(sheetBytes), sheetRecord.sha256, `contact sheet ${sheetRecord.path} checksum`);
  lockedContactSheets.push({
    firstPage: sheetRecord.firstPage,
    lastPage: sheetRecord.lastPage,
    path: path.relative(process.cwd(), sheetPath),
    sha256: sheetRecord.sha256,
  });
}

const architecturalSheetMap = [
  [41, 'A19', 'Service Level Floor Plan'],
  [42, 'A20', 'Mezzanine Level Floor Plan'],
  [43, 'A21', 'Main Concourse Level Floor Plan'],
  [44, 'A22', 'Suite Level Floor Plan'],
  [45, 'A23', 'Club Level Floor Plan'],
  [46, 'A24', 'Press Level Floor Plan'],
  [47, 'A25', 'Upper Concourse Floor Plan'],
  [48, 'A26', 'Upper Deck Floor Plan'],
  [49, 'A27', 'Canopy Plan'],
  [50, 'A28', 'Roof Plan Closed'],
  [51, 'A29', 'Roof Plan Open'],
  [52, 'A30', 'Overall Building Elevations North and South'],
  [53, 'A31', 'Overall Building Elevations East and West'],
  [54, 'A32', 'Detail Building Elevations North and South'],
  [55, 'A33', 'Detail Building Elevations East and West'],
  [56, 'A34', 'Building Details'],
].map(([pdfPage, sheetId, title]) => ({ pdfPage, sheetId, title }));

const surveySheetMap = [
  [92, 'S1', 'Boundary and Topography Survey'],
  [93, 'S2', 'Existing Main Street Lines Survey'],
  [94, 'S3', 'ALTA/ACSM Land Title Survey'],
  [95, 'S4', 'ALTA/ACSM Land Title Survey'],
  [96, 'S5', 'ALTA/ACSM Land Title Survey'],
].map(([pdfPage, sheetId, title]) => ({ pdfPage, sheetId, title }));

const stable = {
  analysisVersion: 'marlins-city-weblink-design-plan-manual-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    acquisitionManifest: {
      path: acquisition.path,
      sha256: acquisition.sha256,
      artifactVersion: acquisition.value.artifactVersion,
    },
    designDevelopmentPlans: acquisition.value.inputs.designDevelopmentPlans,
    renderManifest: {
      path: renderManifest.path,
      sha256: renderManifest.sha256,
      artifactVersion: renderManifest.value.artifactVersion,
    },
    lockedReviewedPages,
    lockedContactSheets,
  },
  sourceStatus: {
    authority: acquisition.value.source.authority,
    repositoryEntryId: acquisition.value.source.entryId,
    fileId: acquisition.value.source.fileId,
    resolution: acquisition.value.source.resolution,
    recordDate: acquisition.value.source.recordDate,
    recordStatus: acquisition.value.source.status,
    designStage: 'design-development',
    constructionAsBuiltRecord: false,
    currentAsBuiltRecord: false,
    imagedPageCount: acquisition.value.document.imagedPageCount,
    sourcePixelDimensions: [2550, 3300],
    sourceDpi: [300, 300],
  },
  reviewScope: {
    completeContactSheetReviewPageRange: [1, 96],
    drawingIndexPage: 2,
    architecturalDetailReviewPageRange: [41, 56],
    surveyDetailReviewPageRange: [92, 96],
    reviewStatus: 'manually-reviewed',
  },
  drawingIndex: {
    architecturalSheetMap,
    surveySheetsListedOnIndex: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6'],
    surveySheetMap,
    listedSurveySheetAbsentFromExport: 'S6',
    exportEndsAtPdfPage: 96,
    exportFinalSheetId: 'S5',
  },
  findings: [
    {
      pdfPages: [41, 48],
      sheetIds: ['A19', 'A20', 'A21', 'A22', 'A23', 'A24', 'A25', 'A26'],
      category: 'seating-bowl-plan-topology',
      finding: 'The floor plans depict the seating bowl across service, mezzanine, main-concourse, suite, club, press, upper-concourse, and upper-deck levels. Individual seating-row linework is visible on the main-concourse and upper-deck plans, so the scans can support a candidate semantic row-topology comparison after controlled digitization.',
    },
    {
      pdfPages: [49, 51],
      sheetIds: ['A27', 'A28', 'A29'],
      category: 'historical-canopy-and-roof-plans',
      finding: 'The set includes a canopy plan plus closed-roof and open-roof plans. These are historical design-stage plan footprints and do not establish constructed panel coordinates, current mechanization state, elevations, thickness, or underside surfaces.',
    },
    {
      pdfPages: [52, 56],
      sheetIds: ['A30', 'A31', 'A32', 'A33', 'A34'],
      category: 'exterior-elevations-and-details',
      finding: 'The set includes overall and detail exterior elevations plus selected building details. It does not include a seating-bowl building section or row elevation schedule sufficient to establish row surface elevations.',
    },
    {
      pdfPages: [92, 96],
      sheetIds: ['S1', 'S2', 'S3', 'S4', 'S5'],
      category: 'historical-site-surveys',
      finding: 'The exported survey sheets describe the preconstruction site and title-survey context. They can support historical control provenance but do not establish current stadium row or obstruction geometry.',
    },
    {
      pdfPages: [2, 96],
      sheetIds: ['S6'],
      category: 'incomplete-export',
      finding: 'The drawing index lists survey sheet S6, but the 96-page City export ends with S5. The missing S6 sheet must be obtained before this package can be treated as a complete copy of its own indexed survey subset.',
    },
  ],
  digitizationAssessment: {
    semanticRowTopologyResolvableFromScans: true,
    candidatePlanRegistrationWorthTesting: true,
    planScanMetricAccuracyEstablished: false,
    scanWarpQuantified: false,
    lineCenterUncertaintyQuantified: false,
    disjointRegistrationHoldoutPassed: false,
    horizontalAccuracyAtOrBelowOneFootEstablished: false,
    orientationAccuracyAtOrBelowOneDegreeEstablished: false,
    currentRowPlanGeometryEstablished: false,
    currentRowElevationsEstablished: false,
    note: 'Nominal pixels per stadium span do not establish positional accuracy. Scan distortion, line thickness, sheet reduction, construction changes, and later alterations must be measured independently before any row coordinate can pass the metric gate.',
  },
  geometryBoundary: {
    establishesOfficialCityApprovalRecord: true,
    establishesHistoricalDesignRowTopology: true,
    establishesHistoricalCanopyAndRoofPlanFootprints: true,
    establishesCompleteIndexedSurveySubset: false,
    establishesConstructionAsBuiltGeometry: false,
    establishesCurrentAsBuiltGeometry: false,
    establishesCurrentMeasuredRowGeometry: false,
    establishesCurrentMeasuredRowElevations: false,
    establishesCurrentRoofPanelCoordinates: false,
    establishesCurrentRoofUndersideGeometry: false,
    establishesCompleteCurrentObstructionGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  nextMeasurementTest: {
    objective: 'Register the A21 and A26 row-plan scans to the accepted metric stadium frame using construction-stable hard-structure controls, reserve disjoint controls as holdouts, quantify local scan warp, and compare provider row anchors against independently digitized row linework.',
    acceptanceGates: {
      horizontalUncertainty95FeetMaximum: 1,
      orientationUncertainty95DegreesMaximum: 1,
      measuredCoveragePercentMinimum: 100,
    },
    promotionRule: 'A plan-derived row coordinate remains a historical candidate unless the scan registration passes all metric gates and current evidence establishes that the constructed row location is unchanged.',
  },
  publication: {
    eligible: false,
    blockers: [
      'DESIGN_DEVELOPMENT_IS_NOT_CONSTRUCTION_AS_BUILT',
      'INDEXED_SURVEY_SHEET_S6_ABSENT_FROM_EXPORT',
      'PLAN_SCAN_WARP_AND_LINE_UNCERTAINTY_NOT_QUANTIFIED',
      'DISJOINT_PLAN_REGISTRATION_HOLDOUT_NOT_PASSED',
      'CURRENT_ROW_PLAN_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_ROW_ELEVATIONS_NOT_ESTABLISHED',
      'CURRENT_ROOF_UNDERSIDE_GEOMETRY_NOT_ESTABLISHED',
      'COMPLETE_CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-weblink-design-plan-manual-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};

await mkdir(outputDirectory, { recursive: true });
const outputPath = path.join(outputDirectory, 'review.json');
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  sourceStatus: artifact.sourceStatus,
  digitizationAssessment: artifact.digitizationAssessment,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
