#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
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

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

function requireText(haystack, needle, sourceLabel) {
  if (!haystack.includes(needle)) {
    throw new Error(`Required text not found in ${sourceLabel}: ${needle}`);
  }
}

const acquisitionPath = path.resolve(option(
  'acquisition',
  'tmp/lidar/marlins-roof-mechanization-sources-2026/manifest.json',
));
const outputPath = path.resolve(option(
  'output',
  'tmp/lidar/marlins-roof-mechanization-source-review-2026.json',
));

const acquisitionBytes = await readFile(acquisitionPath);
const acquisition = JSON.parse(acquisitionBytes.toString('utf8'));
requireEqual(
  acquisition.artifactKind,
  'marlins-roof-mechanization-source-acquisition',
  'roof-mechanization source acquisition kind',
);
requireEqual(acquisition.sources?.length, 2, 'roof-mechanization source count');

const sourcesByKey = Object.fromEntries(acquisition.sources.map((source) => [source.key, source]));
const sourceText = {};
for (const [key, source] of Object.entries(sourcesByKey)) {
  const bytes = await readFile(path.resolve(source.localPath));
  requireEqual(bytes.length, source.byteLength, `${key} byte length`);
  requireEqual(sha256(bytes), source.sha256, `${key} checksum`);
  sourceText[key] = bytes.toString('utf8');
}

const uniSystemsPage = sourceText['uni-systems-marlins-retractable-roof-current'];
const walterPMoorePage = sourceText['walter-p-moore-loandepot-retractable-roof-current'];

for (const [needle, label] of [
  ['The roof comprises three stacking panels', 'three-panel arrangement'],
  ['operate each one independently', 'independent panel operation'],
  ['A collection of cameras, sensors, and feedback/diagnostic systems reports on the roof progress', 'position feedback systems'],
  ['monitors conditions of the roof panels and mechanization', 'mechanization monitoring'],
  ['Populous and Hunt-Moss', 'client identification'],
  ['01/2000', 'published completion date'],
  ['Design, Fabricate, Install', 'project scope'],
  ['Alan Wilcox', 'project engineer'],
  ['href="/inquire-now"', 'current inquiry route'],
  ['763-404-8820', 'current phone route'],
  ['© 2026 Uni-Systems', 'current-page copyright'],
]) requireText(uniSystemsPage, needle, `Uni-Systems page ${label}`);

for (const [needle, label] of [
  ['Completed 2012', 'completion year'],
  ['Structural Engineering', 'structural engineering service'],
  ['Construction Engineering', 'construction engineering service'],
  ['spans between 530 and 560 feet', 'panel spans'],
  ['The panels operate independently', 'independent panel operation'],
  ['They nest together when fully open', 'open-state nesting'],
  ['spanning from 128 feet to 210 feet', 'panel heights'],
  ['custom algorithm to determine the roof’s final geometry', 'final-geometry calculation'],
  ['mechanization consultant Uni-Systems', 'mechanization consultant'],
  ['provided mechanization design and supply', 'mechanization design and supply'],
  ['href="https://www.walterpmoore.com/contact"', 'current contact route'],
  ['"email":"info@walterpmoore.com"', 'current published email'],
]) requireText(walterPMoorePage, needle, `Walter P Moore page ${label}`);

const stable = {
  analysisVersion: 'marlins-roof-mechanization-source-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    acquisition: {
      path: path.relative(process.cwd(), acquisitionPath),
      sha256: sha256(acquisitionBytes),
      artifactVersion: acquisition.artifactVersion,
    },
  },
  projectRoleEvidence: {
    walterPMooreServices: [
      'structural engineering',
      'construction engineering',
    ],
    uniSystemsRoleFromWalterPMoore: 'mechanization consultant providing mechanization design and supply',
    uniSystemsPublishedScope: [
      'design',
      'fabricate',
      'install',
    ],
    uniSystemsPublishedClient: 'Populous and Hunt-Moss',
    uniSystemsPublishedProjectEngineer: 'Alan Wilcox',
    roleCrossSourceSupported: true,
  },
  mechanismEvidence: {
    panelCount: 3,
    arrangement: 'one upper panel and two lower panels that stack beneath the upper panel when fully retracted',
    panelsCanOperateIndependently: true,
    panelsNestWhenFullyOpen: true,
    structuralSpanRangeFeet: [530, 560],
    publishedPanelHeightRangeFeet: [128, 210],
    finalGeometryUsedCustomAlgorithm: true,
    camerasReported: true,
    sensorsReported: true,
    feedbackOrDiagnosticSystemsReported: true,
    systemsReportRoofProgress: true,
    systemsMonitorPanelAndMechanizationConditions: true,
    currentSensorTypesIdentified: false,
    currentPositionVariableSchemaPublished: false,
    currentPositionUnitsPublished: false,
    currentSensorCalibrationPublished: false,
    fullyOpenStopCoordinatesPublished: false,
    historicalGamePanelPositionLogsPublished: false,
  },
  sourceConsistency: {
    walterPMoorePublishedCompletion: '2012',
    uniSystemsPublishedCompletion: '01/2000',
    completionFieldsConflict: true,
    uniSystemsCompletionFieldAcceptedAsProjectChronology: false,
    interpretation: 'The Uni-Systems completion field predates construction and conflicts with the Walter P Moore completion year. It is treated as a source metadata error and is not used to date the project, geometry, or mechanization records.',
  },
  currentCustodyRoute: {
    potentialCustodiansOrTransferSources: [
      'Uni-Systems as mechanization designer, supplier, fabricator, and installer',
      'Walter P Moore as structural and construction engineer',
      'Populous and Hunt-Moss as Uni-Systems clients',
      'Miami-Dade County as stadium owner',
      'Miami Marlins or stadium operator as control-system operator',
    ],
    requestedRecordClasses: [
      'mechanization design and as-built drawings',
      'rail, bogie, drive, brake, clamp, and turnbuckle drawings',
      'panel edge, underside, lower-chord, and fully-open stop coordinates',
      'limit-switch and position-sensor schedules',
      'sensor calibration and coordinate conversion records',
      'commissioning, acceptance, and final-position surveys',
      'control-variable data dictionary and units',
      'timestamped panel-position event history',
      'maintenance changes affecting panel stops or sensor calibration',
    ],
    uniSystemsCurrentInquiryUrl: 'https://www.uni-systems.com/inquire-now',
    uniSystemsCurrentPhone: '763-404-8820',
    walterPMooreCurrentContactUrl: 'https://www.walterpmoore.com/contact',
    walterPMooreCurrentPublishedEmail: 'info@walterpmoore.com',
    currentRecordRetentionEstablished: false,
    currentReleaseAuthorityEstablished: false,
    externalRequestSent: false,
  },
  geometryBoundary: {
    establishesHistoricalMechanizationDesignSupplyAndInstallationRoute: true,
    establishesHistoricalPositionFeedbackSystemExistence: true,
    establishesCurrentMetricPanelGeometry: false,
    establishesCurrentPanelUndersides: false,
    establishesCurrentFullyOpenStopCoordinates: false,
    establishesCurrentSensorCalibration: false,
    establishesGameSpecificPanelPositions: false,
    establishesCurrentChangeInventory: false,
    establishesMeasuredRowGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'CURRENT_MECHANIZATION_RECORD_RETENTION_NOT_VERIFIED',
      'CURRENT_METRIC_PANEL_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_PANEL_UNDERSIDES_NOT_ESTABLISHED',
      'FULLY_OPEN_STOP_COORDINATES_NOT_ESTABLISHED',
      'CURRENT_SENSOR_CALIBRATION_NOT_ESTABLISHED',
      'GAME_SPECIFIC_PANEL_POSITION_HISTORY_NOT_ESTABLISHED',
      'MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-roof-mechanization-source-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  projectRoleEvidence: artifact.projectRoleEvidence,
  mechanismEvidence: artifact.mechanismEvidence,
  sourceConsistency: artifact.sourceConsistency,
  currentCustodyRoute: artifact.currentCustodyRoute,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
