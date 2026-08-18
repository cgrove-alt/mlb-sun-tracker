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
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

async function readLockedInput(inputPath) {
  const resolvedPath = path.resolve(inputPath);
  const bytes = await readFile(resolvedPath);
  const value = JSON.parse(bytes.toString('utf8'));
  return {
    path: path.relative(process.cwd(), resolvedPath),
    sha256: sha256(bytes),
    artifactVersion: value.artifactVersion,
    value,
  };
}

const paths = {
  sourceManifest: option(
    'source-manifest',
    'tmp/lidar/marlins-current-geometry-sources-2026/manifest.json',
  ),
  sourceReview: option(
    'source-review',
    'tmp/lidar/marlins-current-geometry-source-review-2026/review.json',
  ),
  stadiumFrame: option(
    'stadium-frame',
    'tmp/lidar/marlins-usgs-2021-open-roof/hard-structure-local-registration-v1.json',
  ),
  metricRows: option(
    'metric-rows',
    'tmp/lidar/marlins-3ddv-metric-rows.json',
  ),
  rowSurfaceUnion: option(
    'row-surface-union',
    'tmp/lidar/marlins-noaa-2018/row-surface-candidate-union-v1.json',
  ),
  providerWorldRegistration: option(
    'provider-world-registration',
    'tmp/lidar/marlins-3ddv-survey-orthophoto-world-registration-candidate-v3-2026.json',
  ),
  currentUpperPanelShape: option(
    'current-upper-panel-shape',
    'tmp/lidar/marlins-usgs-fl-miamidade-d23/upper-panel-current-shape-audit-v1.json',
  ),
  current2025OrthophotoGeometry: option(
    'current-2025-orthophoto-geometry',
    'tmp/lidar/marlins-2025-orthophoto-current-geometry-audit-v1-2026.json',
  ),
  cityPermitIndexReview: option(
    'city-permit-index-review',
    'tmp/lidar/marlins-city-miami-permit-index-review-2026/review.json',
  ),
  cityPermitPlanRecordDiscovery: option(
    'city-permit-plan-record-discovery',
    'tmp/lidar/marlins-city-weblink-current-permit-plan-records-2026/manifest.json',
  ),
  officialCurrentBallparkChangesReview: option(
    'official-current-ballpark-changes-review',
    'tmp/lidar/marlins-official-current-ballpark-changes-2026/review.json',
  ),
  officialCurrentGameSection4Adjudication: option(
    'official-current-game-section4-adjudication',
    'tmp/lidar/marlins-official-current-game-section4-adjudication-v1-2026.json',
  ),
  officialCurrentSection4CandidateAdjudication: option(
    'official-current-section4-candidate-adjudication',
    'tmp/lidar/marlins-official-current-section4-candidate-adjudication-v1-2026.json',
  ),
  officialCurrentStandsCandidateAdjudication: option(
    'official-current-stands-candidate-adjudication',
    'tmp/lidar/marlins-official-current-stands-adjudication-2026.json',
  ),
  savantObservationAdjudication: option(
    'savant-observation-adjudication',
    'tmp/lidar/marlins-2026-04-18-savant-observation-adjudication-v1.json',
  ),
  historicalLowSunSavantAdjudication: option(
    'historical-low-sun-savant-adjudication',
    'tmp/lidar/marlins-2021-open-weather-savant-observation-adjudication-v1.json',
  ),
  historical2025SavantAdjudication: option(
    'historical-2025-savant-adjudication',
    'tmp/lidar/marlins-2025-open-roof-savant-observation-adjudication-v1.json',
  ),
  current2026RoofOpenCandidateSavantAdjudication: option(
    'current-2026-roof-open-candidate-savant-adjudication',
    'tmp/lidar/marlins-2026-three-roof-open-candidate-savant-observation-adjudication-v1.json',
  ),
  current3ddvNativeGeometryAudit: option(
    'current-3ddv-native-geometry-audit',
    'tmp/lidar/marlins-current-3ddv-native-geometry-audit-v1-2026.json',
  ),
  current3ddvSection35DepthAnchors: option(
    'current-3ddv-section35-depth-anchors',
    'tmp/lidar/marlins-current-stereo/sec35-cross-target-depth-anchors-patch-fine-v2.json',
  ),
  current3ddvSection35PanelCorners: option(
    'current-3ddv-section35-panel-corners',
    'tmp/lidar/marlins-current-stereo/sec35-panel-corners-four-camera-v1.json',
  ),
  current3ddvSection35PanelRectangle: option(
    'current-3ddv-section35-panel-rectangle',
    'tmp/lidar/marlins-current-stereo/sec35-panel-rectangle-bundles-v4.json',
  ),
  caaImageExhibitReview: option(
    'caa-image-exhibit-review',
    'tmp/lidar/marlins-caa-image-exhibit-manual-review-2026/review.json',
  ),
  cityWeblinkDesignPlanReview: option(
    'city-weblink-design-plan-review',
    'tmp/lidar/marlins-city-weblink-dd-plan-review-2026/review.json',
  ),
  cityWeblinkPlanRegistration: option(
    'city-weblink-plan-registration',
    'tmp/lidar/marlins-city-weblink-dd-plan-metric-registration-2026/line-registration-v1.json',
  ),
  cityWeblinkModificationReview: option(
    'city-weblink-modification-review',
    'tmp/lidar/marlins-city-weblink-substantial-modification-review-2026.json',
  ),
  cityWeblinkBureauVeritasReview: option(
    'city-weblink-bureau-veritas-review',
    'tmp/lidar/marlins-city-weblink-bureau-veritas-review-2026.json',
  ),
  projectTeamBimSourceReview: option(
    'project-team-bim-source-review',
    'tmp/lidar/marlins-project-team-bim-source-review-2026.json',
  ),
  inteliBuildArchiveSourceReview: option(
    'intelibuild-archive-source-review',
    'tmp/lidar/marlins-intelibuild-archive-source-review-2026.json',
  ),
  roofMechanizationSourceReview: option(
    'roof-mechanization-source-review',
    'tmp/lidar/marlins-roof-mechanization-source-review-2026.json',
  ),
  cityCyclomediaSourceReview: option(
    'city-cyclomedia-source-review',
    'tmp/lidar/marlins-city-cyclomedia-source-review-2026.json',
  ),
  teklaAwardSourceReview: option(
    'tekla-award-source-review',
    'tmp/lidar/marlins-tekla-award-source-review-2026.json',
  ),
  outputDirectory: option(
    'output-dir',
    'tmp/lidar/marlins-current-geometry-delta-2026',
  ),
};

const [
  sourceManifest,
  sourceReview,
  stadiumFrame,
  metricRows,
  rowSurfaceUnion,
  providerWorldRegistration,
  currentUpperPanelShape,
  current2025OrthophotoGeometry,
  cityPermitIndexReview,
  cityPermitPlanRecordDiscovery,
  officialCurrentBallparkChangesReview,
  officialCurrentGameSection4Adjudication,
  officialCurrentSection4CandidateAdjudication,
  officialCurrentStandsCandidateAdjudication,
  savantObservationAdjudication,
  historicalLowSunSavantAdjudication,
  historical2025SavantAdjudication,
  current2026RoofOpenCandidateSavantAdjudication,
  current3ddvNativeGeometryAudit,
  current3ddvSection35DepthAnchors,
  current3ddvSection35PanelCorners,
  current3ddvSection35PanelRectangle,
  caaImageExhibitReview,
  cityWeblinkDesignPlanReview,
  cityWeblinkPlanRegistration,
  cityWeblinkModificationReview,
  cityWeblinkBureauVeritasReview,
  projectTeamBimSourceReview,
  inteliBuildArchiveSourceReview,
  roofMechanizationSourceReview,
  cityCyclomediaSourceReview,
  teklaAwardSourceReview,
] = await Promise.all([
  readLockedInput(paths.sourceManifest),
  readLockedInput(paths.sourceReview),
  readLockedInput(paths.stadiumFrame),
  readLockedInput(paths.metricRows),
  readLockedInput(paths.rowSurfaceUnion),
  readLockedInput(paths.providerWorldRegistration),
  readLockedInput(paths.currentUpperPanelShape),
  readLockedInput(paths.current2025OrthophotoGeometry),
  readLockedInput(paths.cityPermitIndexReview),
  readLockedInput(paths.cityPermitPlanRecordDiscovery),
  readLockedInput(paths.officialCurrentBallparkChangesReview),
  readLockedInput(paths.officialCurrentGameSection4Adjudication),
  readLockedInput(paths.officialCurrentSection4CandidateAdjudication),
  readLockedInput(paths.officialCurrentStandsCandidateAdjudication),
  readLockedInput(paths.savantObservationAdjudication),
  readLockedInput(paths.historicalLowSunSavantAdjudication),
  readLockedInput(paths.historical2025SavantAdjudication),
  readLockedInput(paths.current2026RoofOpenCandidateSavantAdjudication),
  readLockedInput(paths.current3ddvNativeGeometryAudit),
  readLockedInput(paths.current3ddvSection35DepthAnchors),
  readLockedInput(paths.current3ddvSection35PanelCorners),
  readLockedInput(paths.current3ddvSection35PanelRectangle),
  readLockedInput(paths.caaImageExhibitReview),
  readLockedInput(paths.cityWeblinkDesignPlanReview),
  readLockedInput(paths.cityWeblinkPlanRegistration),
  readLockedInput(paths.cityWeblinkModificationReview),
  readLockedInput(paths.cityWeblinkBureauVeritasReview),
  readLockedInput(paths.projectTeamBimSourceReview),
  readLockedInput(paths.inteliBuildArchiveSourceReview),
  readLockedInput(paths.roofMechanizationSourceReview),
  readLockedInput(paths.cityCyclomediaSourceReview),
  readLockedInput(paths.teklaAwardSourceReview),
]);

requireEqual(
  sourceManifest.value.artifactKind,
  'marlins-current-geometry-source-acquisition',
  'source manifest kind',
);
requireEqual(
  sourceReview.value.artifactKind,
  'marlins-current-geometry-manual-source-review',
  'source review kind',
);
requireEqual(
  sourceReview.value.sourceAcquisitionArtifactVersion,
  sourceManifest.value.artifactVersion,
  'source review acquisition version',
);
requireEqual(
  stadiumFrame.value.artifactKind,
  'hard-structure-registered-2021-lidar-local-frame',
  'stadium frame kind',
);
requireEqual(
  stadiumFrame.value.registrationAcceptance?.accepted,
  true,
  'stadium frame registration acceptance',
);
requireEqual(
  metricRows.value.artifactKind,
  'venue-local-metric-row-anchors',
  'metric rows kind',
);
requireEqual(metricRows.value.completeness?.expectedRows, 2037, 'provider row count');
requireEqual(metricRows.value.completeness?.percent, 100, 'provider row coverage');
requireEqual(
  rowSurfaceUnion.value.artifactKind,
  '3ddv-lidar-row-surface-candidate-union',
  'row surface union kind',
);
requireEqual(
  rowSurfaceUnion.value.geometryBoundary?.candidateRowCount,
  781,
  'candidate row surface count',
);
requireEqual(
  providerWorldRegistration.value.artifactKind,
  '3ddv-survey-orthophoto-world-registration-candidate',
  'provider world registration kind',
);
requireEqual(
  currentUpperPanelShape.value.artifactKind,
  'current-upper-roof-panel-shape-holdout-audit',
  'current upper-panel shape kind',
);
requireEqual(
  currentUpperPanelShape.value.assessment?.current2024UpperPanelShapeHoldoutPassed,
  true,
  'current upper-panel shape holdout',
);
requireEqual(
  currentUpperPanelShape.value.assessment?.current2024AbsolutePanelPositionEligible,
  false,
  'current upper-panel absolute position eligibility',
);
requireEqual(
  current2025OrthophotoGeometry.value.artifactKind,
  'marlins-2025-orthophoto-current-geometry-audit',
  'current 2025 orthophoto geometry kind',
);
requireEqual(
  current2025OrthophotoGeometry.value.accuracyAssessment
    ?.officialDatasetPlanFrameAccepted,
  true,
  'current 2025 orthophoto dataset plan frame',
);
requireEqual(
  current2025OrthophotoGeometry.value.accuracyAssessment
    ?.officialDatasetHorizontalAccuracy95Feet,
  0.384,
  'current 2025 orthophoto dataset accuracy',
);
requireEqual(
  current2025OrthophotoGeometry.value.accuracyAssessment
    ?.roofTopEdgeMetricMeasurementAccepted,
  false,
  'current 2025 orthophoto roof-edge metric boundary',
);
requireEqual(
  current2025OrthophotoGeometry.value.geometryBoundary
    ?.establishesClosedRoofVisualStateWithinPublishedAcquisitionDateSet,
  true,
  'current 2025 orthophoto closed-roof visual state',
);
requireEqual(
  current2025OrthophotoGeometry.value.geometryBoundary
    ?.establishesCurrentRowPersistence,
  false,
  'current 2025 orthophoto row-persistence boundary',
);
requireEqual(
  current2025OrthophotoGeometry.value.geometryBoundary
    ?.establishesRoofUndersideGeometry,
  false,
  'current 2025 orthophoto underside boundary',
);
requireEqual(
  sourceReview.value.recordsRoute?.contractuallyRequiredAsBuiltDeliveryEstablished,
  true,
  'contractual as-built delivery route',
);
requireEqual(
  sourceReview.value.recordsRoute?.currentAgencyPossessionEstablished,
  false,
  'current agency possession',
);
requireEqual(
  sourceReview.value.recordsRoute?.operatingAgreementOperatorDayToDayResponsibilityEstablished,
  true,
  'operating agreement operator day-to-day responsibility route',
);
requireEqual(
  sourceReview.value.recordsRoute?.operatingAgreementOperatorMaintenanceAndRepairResponsibilityEstablished,
  true,
  'operating agreement operator maintenance route',
);
requireEqual(
  sourceReview.value.recordsRoute?.current2026OperatorIdentityEstablished,
  false,
  'current 2026 operator identity boundary',
);
requireEqual(
  sourceReview.value.recordsRoute?.currentOperatorRecordPossessionEstablished,
  false,
  'current operator record possession boundary',
);
requireEqual(
  sourceReview.value.recordsRoute?.currentMarlinsBallparkOperationsDepartmentRouteEstablished,
  true,
  'current Marlins ballpark operations department route',
);
requireEqual(
  sourceReview.value.recordsRoute?.operatorAgreementAccountingIdentityEstablishedThrough2025,
  true,
  'FY 2025 audited operator-agreement accounting identity',
);
requireEqual(
  sourceReview.value.recordsRoute?.countyOwnedStadiumCapitalReserveFundBalanceAsOf2025Usd,
  15200000,
  'FY 2025 audited County stadium reserve balance',
);
requireEqual(
  sourceReview.value.recordsRoute?.currentCountySection9Point5MaintenanceReportPossessionEstablished,
  false,
  'current County section 9.5 report possession boundary',
);
requireEqual(
  cityPermitIndexReview.value.artifactKind,
  'marlins-city-miami-permit-index-review',
  'City permit index review kind',
);
requireEqual(
  cityPermitIndexReview.value.inventory?.sourceFeatureCount,
  163,
  'City permit source feature count',
);
requireEqual(
  cityPermitIndexReview.value.inventory?.post2024CandidateFeatureCount,
  17,
  'City post-2024 permit candidate count',
);
requireEqual(
  cityPermitIndexReview.value.inventory?.currentUnresolvedWorkflowCandidateCount,
  6,
  'City current unresolved workflow count',
);
requireEqual(
  cityPermitIndexReview.value.findings?.completeCurrentChangeInventoryEstablished,
  false,
  'City current change inventory completeness',
);
requireEqual(
  cityPermitPlanRecordDiscovery.value.artifactKind,
  'marlins-city-weblink-current-permit-plan-record-discovery',
  'City permit plan-record discovery kind',
);
requireEqual(
  cityPermitPlanRecordDiscovery.value.inventory?.planNumberCount,
  8,
  'City permit plan-record plan number count',
);
requireEqual(
  cityPermitPlanRecordDiscovery.value.inventory?.searchCount,
  16,
  'City permit plan-record search count',
);
requireEqual(
  cityPermitPlanRecordDiscovery.value.inventory?.uniqueDocumentCount,
  0,
  'City permit plan-record public document count',
);
requireEqual(
  officialCurrentBallparkChangesReview.value.artifactKind,
  'marlins-official-current-ballpark-changes-review',
  'official current ballpark changes review kind',
);
requireEqual(
  officialCurrentBallparkChangesReview.value.summary?.officialPageCount,
  4,
  'official current ballpark source page count',
);
requireEqual(
  officialCurrentBallparkChangesReview.value.summary?.currentChangeCount,
  6,
  'official current ballpark change count',
);
requireEqual(
  officialCurrentBallparkChangesReview.value.summary?.currentMetricGeometryResolvedCount,
  0,
  'official current ballpark metric geometry count',
);
requireEqual(
  officialCurrentBallparkChangesReview.value.geometryBoundary
    ?.establishesCompleteCurrentChangeInventory,
  false,
  'official current ballpark change inventory completeness',
);
requireEqual(
  officialCurrentGameSection4Adjudication.value.artifactKind,
  'marlins-official-current-game-section4-adjudication',
  'official current-game Section 4 adjudication kind',
);
requireEqual(
  officialCurrentGameSection4Adjudication.value.reviewScope
    ?.manualVisualReviewCompletedForEveryContactSheet,
  true,
  'official current-game complete contact-sheet review',
);
requireEqual(
  officialCurrentGameSection4Adjudication.value.reviewScope?.sampleCount,
  477,
  'official current-game reviewed sample count',
);
requireEqual(
  officialCurrentGameSection4Adjudication.value.summary
    ?.section4UniquelyIdentifiedFrameCount,
  0,
  'official current-game Section 4 uniquely identified frame count',
);
requireEqual(
  officialCurrentGameSection4Adjudication.value.geometryBoundary
    ?.establishesMetricRowGeometry,
  false,
  'official current-game metric row geometry boundary',
);
requireEqual(
  officialCurrentSection4CandidateAdjudication.value.artifactKind,
  'marlins-official-current-section4-candidate-adjudication',
  'official current Section 4 candidate adjudication kind',
);
requireEqual(
  officialCurrentSection4CandidateAdjudication.value.reviewScope
    ?.manualVisualReviewCompletedForEveryContactSheet,
  true,
  'official current Section 4 candidate complete contact-sheet review',
);
requireEqual(
  officialCurrentSection4CandidateAdjudication.value.reviewScope?.sampleCount,
  792,
  'official current Section 4 candidate reviewed sample count',
);
requireEqual(
  officialCurrentSection4CandidateAdjudication.value.summary
    ?.section4UniquelyIdentifiedFrameCount,
  0,
  'official current Section 4 candidate uniquely identified frame count',
);
requireEqual(
  officialCurrentSection4CandidateAdjudication.value.geometryBoundary
    ?.establishesMetricRowGeometry,
  false,
  'official current Section 4 candidate metric row geometry boundary',
);
requireEqual(
  officialCurrentStandsCandidateAdjudication.value.artifactKind,
  'marlins-official-current-stands-candidate-adjudication',
  'official current stands candidate adjudication kind',
);
requireEqual(
  officialCurrentStandsCandidateAdjudication.value.reviewScope
    ?.manualVisualReviewCompletedForEveryContactSheet,
  true,
  'official current stands candidate complete contact-sheet review',
);
requireEqual(
  officialCurrentStandsCandidateAdjudication.value.summary
    ?.reviewedContactSheetCount,
  65,
  'official current stands candidate reviewed contact-sheet count',
);
requireEqual(
  officialCurrentStandsCandidateAdjudication.value.summary
    ?.reviewedSampleCount,
  1856,
  'official current stands candidate reviewed sample count',
);
requireEqual(
  officialCurrentStandsCandidateAdjudication.value.summary
    ?.independentShadeBoundaryObservationCount,
  0,
  'official current stands candidate shade observation count',
);
requireEqual(
  officialCurrentStandsCandidateAdjudication.value.evidenceBoundary
    ?.establishesMetricSeatOrRowGeometry,
  false,
  'official current stands candidate metric row geometry boundary',
);
requireEqual(
  savantObservationAdjudication.value.artifactKind,
  'marlins-savant-observation-corpus-adjudication',
  'April 18 Savant observation adjudication kind',
);
requireEqual(
  savantObservationAdjudication.value.summary?.candidateCount,
  58,
  'April 18 Savant candidate count',
);
requireEqual(
  savantObservationAdjudication.value.summary?.sampleCount,
  1461,
  'April 18 Savant reviewed sample count',
);
requireEqual(
  savantObservationAdjudication.value.summary?.exactObservedBoundaryCount,
  3,
  'April 18 Savant exact observed boundary count',
);
requireEqual(
  savantObservationAdjudication.value.summary?.censoredAllShadedObservationCount,
  4,
  'April 18 Savant censored all-shaded count',
);
requireEqual(
  savantObservationAdjudication.value.summary?.newScoredShadowHoldoutCount,
  0,
  'April 18 Savant scored holdout boundary',
);
requireEqual(
  savantObservationAdjudication.value.evidenceSemantics
    ?.allShadedStateIncreasesBoundarySolarAltitudeSpan,
  false,
  'April 18 Savant censored solar-span boundary',
);
requireEqual(
  historicalLowSunSavantAdjudication.value.artifactKind,
  'marlins-savant-observation-corpus-adjudication',
  '2021 low-sun Savant observation adjudication kind',
);
requireEqual(
  historicalLowSunSavantAdjudication.value.summary?.candidateCount,
  19,
  '2021 low-sun Savant candidate count',
);
requireEqual(
  historicalLowSunSavantAdjudication.value.summary?.sampleCount,
  519,
  '2021 low-sun Savant reviewed sample count',
);
requireEqual(
  historicalLowSunSavantAdjudication.value.summary?.openRoofDateCount,
  2,
  '2021 low-sun Savant open-roof date count',
);
requireEqual(
  historicalLowSunSavantAdjudication.value.summary?.exactObservedBoundaryCount,
  0,
  '2021 low-sun Savant exact observed boundary count',
);
requireEqual(
  historicalLowSunSavantAdjudication.value.summary?.newScoredShadowHoldoutCount,
  0,
  '2021 low-sun Savant scored holdout boundary',
);
requireEqual(
  historicalLowSunSavantAdjudication.value.evidenceSemantics
    ?.openRoofConditionEstablishesDirectSolarIllumination,
  false,
  '2021 low-sun Savant direct-solar boundary',
);
requireEqual(
  historical2025SavantAdjudication.value.artifactKind,
  'marlins-savant-observation-corpus-adjudication',
  '2025 open-roof Savant observation adjudication kind',
);
requireEqual(
  historical2025SavantAdjudication.value.summary?.candidateCount,
  65,
  '2025 open-roof Savant candidate count',
);
requireEqual(
  historical2025SavantAdjudication.value.summary?.sampleCount,
  2608,
  '2025 open-roof Savant reviewed sample count',
);
requireEqual(
  historical2025SavantAdjudication.value.summary
    ?.exactObservedBoundaryInCorpusCount,
  0,
  '2025 open-roof Savant in-corpus exact observed boundary count',
);
requireEqual(
  historical2025SavantAdjudication.value.summary
    ?.existingExactBoundaryOutsideCorpusCrossReferenceCount,
  1,
  '2025 open-roof Savant outside-corpus exact-boundary cross-reference count',
);
requireEqual(
  historical2025SavantAdjudication.value.summary?.newCountedObservedBoundaryCount,
  0,
  '2025 open-roof Savant new observed boundary count',
);
requireEqual(
  historical2025SavantAdjudication.value.summary?.newScoredShadowHoldoutCount,
  0,
  '2025 open-roof Savant scored holdout count',
);
requireEqual(
  historical2025SavantAdjudication.value.evidenceSemantics
    ?.corpusSolarAltitudeSpanIsBoundarySolarAltitudeSpan,
  false,
  '2025 open-roof Savant corpus solar-span boundary',
);
requireEqual(
  current2026RoofOpenCandidateSavantAdjudication.value.artifactKind,
  'marlins-savant-observation-corpus-adjudication',
  '2026 roof-open-candidate Savant observation adjudication kind',
);
requireEqual(
  current2026RoofOpenCandidateSavantAdjudication.value.summary?.candidateCount,
  39,
  '2026 roof-open-candidate Savant candidate count',
);
requireEqual(
  current2026RoofOpenCandidateSavantAdjudication.value.summary?.sampleCount,
  960,
  '2026 roof-open-candidate Savant reviewed sample count',
);
requireEqual(
  current2026RoofOpenCandidateSavantAdjudication.value.summary
    ?.nativeReviewedFrameCount,
  33,
  '2026 roof-open-candidate Savant native frame count',
);
requireEqual(
  current2026RoofOpenCandidateSavantAdjudication.value.summary
    ?.exactObservedBoundaryCount,
  0,
  '2026 roof-open-candidate Savant exact observed boundary count',
);
requireEqual(
  current2026RoofOpenCandidateSavantAdjudication.value.summary
    ?.newScoredShadowHoldoutCount,
  0,
  '2026 roof-open-candidate Savant scored holdout count',
);
requireEqual(
  current2026RoofOpenCandidateSavantAdjudication.value.evidenceSemantics
    ?.officialNonClosedConditionEstablishesRoofOpen,
  false,
  '2026 roof-open-candidate official condition boundary',
);
requireEqual(
  current2026RoofOpenCandidateSavantAdjudication.value.evidenceSemantics
    ?.corpusSolarAltitudeSpanIsBoundarySolarAltitudeSpan,
  false,
  '2026 roof-open-candidate corpus solar-span boundary',
);
requireEqual(
  current3ddvNativeGeometryAudit.value.artifactKind,
  'marlins-current-3ddv-native-geometry-audit',
  'current 3DDV native geometry audit kind',
);
requireEqual(
  current3ddvNativeGeometryAudit.value.softwareVersions?.viewer3d,
  '1.6.18',
  'current 3DDV runtime version',
);
requireEqual(
  current3ddvNativeGeometryAudit.value.marlinsVenueTrace
    ?.uniqueSection4PanoramaConfigCount,
  127,
  'current 3DDV Section 4 panorama config count',
);
requireEqual(
  current3ddvNativeGeometryAudit.value.marlinsVenueTrace
    ?.uniqueNativeGeometryResponseCount,
  0,
  'current 3DDV native geometry response count',
);
requireEqual(
  current3ddvNativeGeometryAudit.value.geometryBoundary
    ?.rendererSupportsNativeMeshResourcesInGeneral,
  true,
  'current 3DDV renderer native mesh capability',
);
requireEqual(
  current3ddvNativeGeometryAudit.value.geometryBoundary
    ?.establishesCurrentNativeObstructionMesh,
  false,
  'current 3DDV venue native obstruction mesh boundary',
);
requireEqual(
  current3ddvSection35DepthAnchors.value.artifactStage,
  'cross-target-current-provider-model-depth-anchors',
  'current 3DDV Section 35 depth-anchor stage',
);
requireEqual(
  current3ddvSection35DepthAnchors.value.assessment
    ?.crossTargetProviderModelDepthAnchorCandidateEligible,
  true,
  'current 3DDV Section 35 depth-anchor provider candidate',
);
requireEqual(
  current3ddvSection35DepthAnchors.value.assessment
    ?.physicalAsBuiltMeasurementEligible,
  false,
  'current 3DDV Section 35 depth-anchor physical boundary',
);
requireEqual(
  current3ddvSection35PanelCorners.value.artifactStage,
  'current-provider-model-disjoint-panel-corner-triangulation',
  'current 3DDV Section 35 panel-corner stage',
);
requireEqual(
  current3ddvSection35PanelCorners.value.assessment
    ?.currentProviderModelPanelFaceCandidateEligible,
  false,
  'current 3DDV Section 35 panel-corner candidate boundary',
);
requireEqual(
  current3ddvSection35PanelCorners.value.gates
    ?.allOrientationComparisonsPassed,
  false,
  'current 3DDV Section 35 panel-corner orientation gate',
);
requireEqual(
  current3ddvSection35PanelRectangle.value.artifactStage,
  'current-provider-model-disjoint-panel-rectangle-fit',
  'current 3DDV Section 35 panel-rectangle stage',
);
requireEqual(
  current3ddvSection35PanelRectangle.value.assessment
    ?.currentProviderModelPanelFaceCandidateEligible,
  false,
  'current 3DDV Section 35 panel-rectangle candidate boundary',
);
requireEqual(
  current3ddvSection35PanelRectangle.value.gates
    ?.allOrientationComparisonsPassed,
  false,
  'current 3DDV Section 35 panel-rectangle orientation gate',
);
requireEqual(
  caaImageExhibitReview.value.artifactKind,
  'marlins-caa-image-exhibit-manual-review',
  'CAA image-exhibit review kind',
);
requireEqual(
  caaImageExhibitReview.value.conclusion?.completeVisualReviewOfOfficial391PageFile,
  true,
  'CAA complete visual review',
);
requireEqual(
  caaImageExhibitReview.value.conclusion?.exactMetricGeometryPresent,
  false,
  'CAA exact metric geometry finding',
);
requireEqual(
  caaImageExhibitReview.value.recordsRoute?.operatorAllMaintenanceAndRepairsDutyEstablished,
  true,
  'Operating Agreement operator maintenance duty',
);
requireEqual(
  caaImageExhibitReview.value.recordsRoute?.annualCountyMaintenanceAndStructuralSystemReportRouteEstablished,
  true,
  'Operating Agreement County annual maintenance report route',
);
requireEqual(
  caaImageExhibitReview.value.recordsRoute?.currentCountyReportPossessionEstablished,
  false,
  'current County annual maintenance report possession boundary',
);
requireEqual(
  cityWeblinkDesignPlanReview.value.artifactKind,
  'marlins-city-weblink-design-plan-manual-review',
  'City WebLink design-plan review kind',
);
requireEqual(
  cityWeblinkDesignPlanReview.value.geometryBoundary?.establishesHistoricalDesignRowTopology,
  true,
  'City WebLink historical row topology finding',
);
requireEqual(
  cityWeblinkDesignPlanReview.value.geometryBoundary?.establishesConstructionAsBuiltGeometry,
  false,
  'City WebLink construction as-built boundary',
);
requireEqual(
  cityWeblinkPlanRegistration.value.artifactKind,
  'marlins-provider-city-plan-line-registration-candidate',
  'City WebLink plan registration kind',
);
requireEqual(
  cityWeblinkPlanRegistration.value.assessment?.holdoutP95AtOrBelowOneFoot,
  false,
  'City WebLink plan registration one-foot holdout gate',
);
requireEqual(
  cityWeblinkPlanRegistration.value.assessment?.measurementEligible,
  false,
  'City WebLink plan registration measurement eligibility',
);
requireEqual(
  cityWeblinkModificationReview.value.artifactKind,
  'marlins-city-weblink-substantial-modification-review',
  'City WebLink substantial-modification review kind',
);
requireEqual(
  cityWeblinkModificationReview.value.modificationScope?.officialResolution,
  'R-10-0058',
  'City WebLink substantial-modification resolution',
);
requireEqual(
  cityWeblinkModificationReview.value.modificationScope?.analysisExplicitlyLimitsConditionsToParkingGarages,
  true,
  'City WebLink substantial-modification garage scope',
);
requireEqual(
  cityWeblinkModificationReview.value.modificationScope?.modifiesStadiumSeatingBowlGeometry,
  false,
  'City WebLink substantial-modification seating-bowl boundary',
);
requireEqual(
  cityWeblinkModificationReview.value.modificationScope?.modifiesStadiumRetractableRoofGeometry,
  false,
  'City WebLink substantial-modification retractable-roof boundary',
);
requireEqual(
  cityWeblinkBureauVeritasReview.value.artifactKind,
  'marlins-city-weblink-bureau-veritas-review',
  'City WebLink Bureau Veritas review kind',
);
requireEqual(
  cityWeblinkBureauVeritasReview.value.reviewScope?.officialResolution,
  'R-10-0335',
  'City WebLink Bureau Veritas resolution',
);
requireEqual(
  cityWeblinkBureauVeritasReview.value.reviewScope?.pagesReviewed,
  46,
  'City WebLink Bureau Veritas reviewed page count',
);
requireEqual(
  cityWeblinkBureauVeritasReview.value.consultantScope?.siteSurveyingExplicitlyExcludedFromConsultantScope,
  true,
  'City WebLink Bureau Veritas site-surveying exclusion',
);
requireEqual(
  cityWeblinkBureauVeritasReview.value.recordsCustodyFindings?.establishesCityCustodyOfStadiumArchitecturalRecordDrawings,
  false,
  'City WebLink Bureau Veritas architectural-record custody boundary',
);
requireEqual(
  cityWeblinkBureauVeritasReview.value.geometryFindings?.containsConstructionAsBuiltStadiumGeometry,
  false,
  'City WebLink Bureau Veritas construction as-built boundary',
);
requireEqual(
  projectTeamBimSourceReview.value.artifactKind,
  'marlins-project-team-bim-source-review',
  'project-team BIM source review kind',
);
requireEqual(
  projectTeamBimSourceReview.value.geometryBoundary?.establishesHistoricalDetailedRoofModelExistence,
  true,
  'project-team historical roof model existence',
);
requireEqual(
  projectTeamBimSourceReview.value.modelCustodyRoute?.nativeModelPubliclyAvailable,
  false,
  'project-team native model public availability',
);
requireEqual(
  projectTeamBimSourceReview.value.geometryBoundary?.establishesConstructionAsBuiltModel,
  false,
  'project-team construction as-built model boundary',
);
requireEqual(
  projectTeamBimSourceReview.value.modelCustodyRoute?.currentCanamProjectPageLinksContactRoute,
  true,
  'project-team current Canam contact route',
);
requireEqual(
  inteliBuildArchiveSourceReview.value.artifactKind,
  'marlins-intelibuild-archive-source-review',
  'InteliBuild archive source review kind',
);
requireEqual(
  inteliBuildArchiveSourceReview.value.centralBimEvidence?.inteliBuildProducedCentralBimModel,
  true,
  'InteliBuild central BIM producer finding',
);
requireEqual(
  inteliBuildArchiveSourceReview.value.centralBimEvidence?.prefabricatedConcreteRoofRailsIncluded,
  true,
  'InteliBuild precast roof-rail model scope',
);
requireEqual(
  inteliBuildArchiveSourceReview.value.centralBimEvidence?.threeRoofPanelClashSimulationsIntegrated,
  true,
  'InteliBuild three-panel clash-simulation scope',
);
requireEqual(
  inteliBuildArchiveSourceReview.value.geometryBoundary?.establishesConstructionAsBuiltModel,
  false,
  'InteliBuild construction as-built model boundary',
);
requireEqual(
  inteliBuildArchiveSourceReview.value.geometryBoundary?.establishesCurrentNativeModelRetention,
  false,
  'InteliBuild current native-model retention boundary',
);
requireEqual(
  inteliBuildArchiveSourceReview.value.publicArchiveSearch?.publicNativeModelLocated,
  false,
  'InteliBuild public native-model boundary',
);
requireEqual(
  roofMechanizationSourceReview.value.artifactKind,
  'marlins-roof-mechanization-source-review',
  'roof-mechanization source review kind',
);
requireEqual(
  roofMechanizationSourceReview.value.projectRoleEvidence?.roleCrossSourceSupported,
  true,
  'roof-mechanization cross-source role finding',
);
requireEqual(
  roofMechanizationSourceReview.value.mechanismEvidence?.systemsReportRoofProgress,
  true,
  'roof-mechanization position-feedback finding',
);
requireEqual(
  roofMechanizationSourceReview.value.sourceConsistency?.uniSystemsCompletionFieldAcceptedAsProjectChronology,
  false,
  'Uni-Systems erroneous completion-date boundary',
);
requireEqual(
  roofMechanizationSourceReview.value.geometryBoundary?.establishesCurrentFullyOpenStopCoordinates,
  false,
  'roof-mechanization fully-open stop-coordinate boundary',
);
requireEqual(
  roofMechanizationSourceReview.value.geometryBoundary?.establishesGameSpecificPanelPositions,
  false,
  'roof-mechanization game-specific panel-position boundary',
);
requireEqual(
  cityCyclomediaSourceReview.value.artifactKind,
  'marlins-city-cyclomedia-source-review',
  'City Cyclomedia source review kind',
);
requireEqual(
  cityCyclomediaSourceReview.value.inventoryFindings?.officialCityEnvelopePointCount,
  6645,
  'City Cyclomedia stadium-envelope point count',
);
requireEqual(
  cityCyclomediaSourceReview.value.inventoryFindings?.captureYear,
  2019,
  'City Cyclomedia capture year',
);
requireEqual(
  cityCyclomediaSourceReview.value.accessFindings?.loginRequired,
  true,
  'City Cyclomedia login requirement',
);
requireEqual(
  cityCyclomediaSourceReview.value.accessFindings?.publicUnauthenticatedGeometryAccessEstablished,
  false,
  'City Cyclomedia public unauthenticated geometry access',
);
requireEqual(
  cityCyclomediaSourceReview.value.geometryBoundary?.establishesSuccessfulMetricMeasurement,
  false,
  'City Cyclomedia successful metric measurement boundary',
);
requireEqual(
  teklaAwardSourceReview.value.artifactKind,
  'marlins-tekla-award-source-review',
  'Tekla award source review kind',
);
requireEqual(
  teklaAwardSourceReview.value.historicalCompetitionEvidence?.marlinsSteelCategoryWinner,
  true,
  'Tekla award Marlins winner finding',
);
requireEqual(
  teklaAwardSourceReview.value.historicalCompetitionEvidence?.winningProjectModelFolderRequiredByRules,
  true,
  'Tekla award winning model-folder rule',
);
requireEqual(
  teklaAwardSourceReview.value.historicalCompetitionEvidence?.actualWinningModelReceiptIndependentlyVerified,
  false,
  'Tekla award model receipt boundary',
);
requireEqual(
  teklaAwardSourceReview.value.publicArchiveSearch?.publicNativeModelLocated,
  false,
  'Tekla award public native-model boundary',
);
requireEqual(
  teklaAwardSourceReview.value.animationReview?.metricGeometryExtractable,
  false,
  'Tekla award animation metric-geometry boundary',
);

const inputs = {
  sourceManifest: {
    path: sourceManifest.path,
    sha256: sourceManifest.sha256,
    artifactVersion: sourceManifest.artifactVersion,
  },
  sourceReview: {
    path: sourceReview.path,
    sha256: sourceReview.sha256,
    artifactVersion: sourceReview.artifactVersion,
  },
  stadiumFrame: {
    path: stadiumFrame.path,
    sha256: stadiumFrame.sha256,
    artifactVersion: stadiumFrame.artifactVersion,
  },
  metricRows: {
    path: metricRows.path,
    sha256: metricRows.sha256,
    artifactVersion: metricRows.artifactVersion,
  },
  rowSurfaceUnion: {
    path: rowSurfaceUnion.path,
    sha256: rowSurfaceUnion.sha256,
    artifactVersion: rowSurfaceUnion.artifactVersion,
  },
  providerWorldRegistration: {
    path: providerWorldRegistration.path,
    sha256: providerWorldRegistration.sha256,
    artifactVersion: providerWorldRegistration.artifactVersion,
  },
  currentUpperPanelShape: {
    path: currentUpperPanelShape.path,
    sha256: currentUpperPanelShape.sha256,
    artifactVersion: currentUpperPanelShape.artifactVersion,
  },
  current2025OrthophotoGeometry: {
    path: current2025OrthophotoGeometry.path,
    sha256: current2025OrthophotoGeometry.sha256,
    artifactVersion: current2025OrthophotoGeometry.artifactVersion,
  },
  cityPermitIndexReview: {
    path: cityPermitIndexReview.path,
    sha256: cityPermitIndexReview.sha256,
    artifactVersion: cityPermitIndexReview.artifactVersion,
  },
  cityPermitPlanRecordDiscovery: {
    path: cityPermitPlanRecordDiscovery.path,
    sha256: cityPermitPlanRecordDiscovery.sha256,
    artifactVersion: cityPermitPlanRecordDiscovery.artifactVersion,
  },
  officialCurrentBallparkChangesReview: {
    path: officialCurrentBallparkChangesReview.path,
    sha256: officialCurrentBallparkChangesReview.sha256,
    artifactVersion: officialCurrentBallparkChangesReview.artifactVersion,
  },
  officialCurrentGameSection4Adjudication: {
    path: officialCurrentGameSection4Adjudication.path,
    sha256: officialCurrentGameSection4Adjudication.sha256,
    artifactVersion: officialCurrentGameSection4Adjudication.artifactVersion,
  },
  officialCurrentSection4CandidateAdjudication: {
    path: officialCurrentSection4CandidateAdjudication.path,
    sha256: officialCurrentSection4CandidateAdjudication.sha256,
    artifactVersion: officialCurrentSection4CandidateAdjudication.artifactVersion,
  },
  officialCurrentStandsCandidateAdjudication: {
    path: officialCurrentStandsCandidateAdjudication.path,
    sha256: officialCurrentStandsCandidateAdjudication.sha256,
    artifactVersion: officialCurrentStandsCandidateAdjudication.artifactVersion,
  },
  savantObservationAdjudication: {
    path: savantObservationAdjudication.path,
    sha256: savantObservationAdjudication.sha256,
    artifactVersion: savantObservationAdjudication.artifactVersion,
  },
  historicalLowSunSavantAdjudication: {
    path: historicalLowSunSavantAdjudication.path,
    sha256: historicalLowSunSavantAdjudication.sha256,
    artifactVersion: historicalLowSunSavantAdjudication.artifactVersion,
  },
  historical2025SavantAdjudication: {
    path: historical2025SavantAdjudication.path,
    sha256: historical2025SavantAdjudication.sha256,
    artifactVersion: historical2025SavantAdjudication.artifactVersion,
  },
  current2026RoofOpenCandidateSavantAdjudication: {
    path: current2026RoofOpenCandidateSavantAdjudication.path,
    sha256: current2026RoofOpenCandidateSavantAdjudication.sha256,
    artifactVersion: current2026RoofOpenCandidateSavantAdjudication.artifactVersion,
  },
  current3ddvNativeGeometryAudit: {
    path: current3ddvNativeGeometryAudit.path,
    sha256: current3ddvNativeGeometryAudit.sha256,
    artifactVersion: current3ddvNativeGeometryAudit.artifactVersion,
  },
  current3ddvSection35DepthAnchors: {
    path: current3ddvSection35DepthAnchors.path,
    sha256: current3ddvSection35DepthAnchors.sha256,
    artifactVersion: current3ddvSection35DepthAnchors.artifactVersion,
  },
  current3ddvSection35PanelCorners: {
    path: current3ddvSection35PanelCorners.path,
    sha256: current3ddvSection35PanelCorners.sha256,
    artifactVersion: current3ddvSection35PanelCorners.artifactVersion,
  },
  current3ddvSection35PanelRectangle: {
    path: current3ddvSection35PanelRectangle.path,
    sha256: current3ddvSection35PanelRectangle.sha256,
    artifactVersion: current3ddvSection35PanelRectangle.artifactVersion,
  },
  caaImageExhibitReview: {
    path: caaImageExhibitReview.path,
    sha256: caaImageExhibitReview.sha256,
    artifactVersion: caaImageExhibitReview.artifactVersion,
  },
  cityWeblinkDesignPlanReview: {
    path: cityWeblinkDesignPlanReview.path,
    sha256: cityWeblinkDesignPlanReview.sha256,
    artifactVersion: cityWeblinkDesignPlanReview.artifactVersion,
  },
  cityWeblinkPlanRegistration: {
    path: cityWeblinkPlanRegistration.path,
    sha256: cityWeblinkPlanRegistration.sha256,
    artifactVersion: cityWeblinkPlanRegistration.artifactVersion,
  },
  cityWeblinkModificationReview: {
    path: cityWeblinkModificationReview.path,
    sha256: cityWeblinkModificationReview.sha256,
    artifactVersion: cityWeblinkModificationReview.artifactVersion,
  },
  cityWeblinkBureauVeritasReview: {
    path: cityWeblinkBureauVeritasReview.path,
    sha256: cityWeblinkBureauVeritasReview.sha256,
    artifactVersion: cityWeblinkBureauVeritasReview.artifactVersion,
  },
  projectTeamBimSourceReview: {
    path: projectTeamBimSourceReview.path,
    sha256: projectTeamBimSourceReview.sha256,
    artifactVersion: projectTeamBimSourceReview.artifactVersion,
  },
  inteliBuildArchiveSourceReview: {
    path: inteliBuildArchiveSourceReview.path,
    sha256: inteliBuildArchiveSourceReview.sha256,
    artifactVersion: inteliBuildArchiveSourceReview.artifactVersion,
  },
  roofMechanizationSourceReview: {
    path: roofMechanizationSourceReview.path,
    sha256: roofMechanizationSourceReview.sha256,
    artifactVersion: roofMechanizationSourceReview.artifactVersion,
  },
  cityCyclomediaSourceReview: {
    path: cityCyclomediaSourceReview.path,
    sha256: cityCyclomediaSourceReview.sha256,
    artifactVersion: cityCyclomediaSourceReview.artifactVersion,
  },
  teklaAwardSourceReview: {
    path: teklaAwardSourceReview.path,
    sha256: teklaAwardSourceReview.sha256,
    artifactVersion: teklaAwardSourceReview.artifactVersion,
  },
};

const currentGeometryDeltas = [
  {
    deltaId: 'current-independent-operable-roof-panels',
    status: 'current-operational-degree-of-freedom-confirmed',
    evidence: 'The current official Marlins roof page identifies one upper and two lower panels and states that panels can be operated independently.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'CURRENT_PANEL_COORDINATES_NOT_PUBLISHED',
      'GAME_SPECIFIC_PANEL_CONFIGURATION_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'operating-agreement-stadium-operator-record-custody-route',
    status: 'contractual-operations-and-maintenance-route-currently-accounted-through-2025',
    evidence: 'The official Miami-Dade legislative matter says the Operating Agreement appoints Marlins Stadium Operator, LLC to operate and manage the ballpark and assigns the Operator all day-to-day operations and associated management costs. Exact high-resolution review of signed Operating Agreement sections 9.1, 9.3, and 9.5 establishes the Operator duty for all maintenance and repairs, a government route to Capital Reserve Fund withdrawal documentation, and annual reports to the County covering completed and planned mechanical, electrical, and structural maintenance plus capital projects. Miami-Dade County audited financial statements for the year ended September 30, 2025 still identify the Operating Agreement with Marlins Stadium Operator, LLC and report a County-owned stadium Capital Reserve Fund balance of 15.2 million dollars. Current official Marlins pages publish a Ballpark Operations and Events department plus general mail, telephone, and inquiry routes. These facts establish contractual, owner-reporting, current-through-2025 accounting, and present-day organizational routes to roof-operation and maintenance records. They do not establish the legal operator identity after September 30, 2025, present section 9.5 report possession, present operator record possession, a roof-specific maintenance record, control-system log existence or retention, a data dictionary, or timestamped game-specific panel positions.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'CURRENT_2026_STADIUM_OPERATOR_IDENTITY_NOT_ESTABLISHED',
      'CURRENT_OPERATOR_RECORD_POSSESSION_NOT_VERIFIED',
      'CURRENT_COUNTY_SECTION_9_5_REPORT_POSSESSION_NOT_VERIFIED',
      'ROOF_SPECIFIC_MAINTENANCE_RECORD_NOT_IDENTIFIED',
      'PANEL_POSITION_DATA_DICTIONARY_NOT_ACQUIRED',
      'GAME_SPECIFIC_PANEL_HISTORY_NOT_ACQUIRED',
      'CURRENT_SENSOR_CALIBRATION_NOT_ACQUIRED',
    ],
  },
  {
    deltaId: 'historical-roof-mechanization-and-position-feedback-route',
    status: 'mechanization-design-supply-installation-and-position-feedback-route-established',
    evidence: 'Current first-party Walter P Moore and Uni-Systems pages cross-support Uni-Systems as the mechanization consultant with design and supply responsibility and a published design, fabrication, and installation scope. Uni-Systems states that cameras, sensors, and feedback or diagnostic systems report roof progress and monitor panel and mechanization conditions. This establishes a specific route to commissioning geometry, stop coordinates, sensor calibration, and panel-position records. The pages do not publish the current sensor schema, units, calibration, fully-open coordinates, current metric panel undersides, or timestamped game-specific panel positions. Uni-Systems also publishes an erroneous 01/2000 completion field, which is rejected as project chronology.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'CURRENT_MECHANIZATION_RECORD_RETENTION_NOT_VERIFIED',
      'CURRENT_SENSOR_SCHEMA_AND_CALIBRATION_NOT_ESTABLISHED',
      'FULLY_OPEN_STOP_COORDINATES_NOT_ESTABLISHED',
      'CURRENT_PANEL_UNDERSIDES_NOT_ESTABLISHED',
      'GAME_SPECIFIC_PANEL_POSITION_HISTORY_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'upper-panel-top-shape-through-2024',
    status: 'partial-shape-persistence-supported',
    evidence: 'A locked 138-bin holdout supports the one-dimensional upper-panel top shape through the 2024 LiDAR acquisition with 0.0531 ft p95 residual.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      '2024_ABSOLUTE_HORIZONTAL_ACCURACY_EXCEEDS_ONE_FOOT',
      'NUISANCE_ALIGNMENT_DOES_NOT_ESTABLISH_ABSOLUTE_POSITION',
      'CURRENT_2026_POSITION_NOT_PROVEN',
    ],
  },
  {
    deltaId: 'official-2025-closed-roof-orthophoto-plan-frame',
    status: 'sub-foot-dataset-plan-frame-accepted-closed-roof-topology-only',
    evidence: 'The official 0.25-foot Miami-Dade County orthophoto dataset reports 0.384-foot actual horizontal accuracy at 95 percent confidence over 61 independent surveyed checkpoints. Complete visual review of the checksum-locked stadium mosaic shows the opening covered by the closed roof and exposes exterior panel top surfaces. The producer also documents separate manual corrections for elevated features, and the correction polygons were not acquired. Therefore the dataset plan frame is accepted, but no roof top edge is promoted as a sub-foot metric feature. The closed roof hides every seating row and exposes no roof underside.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'ELEVATED_FEATURE_CORRECTION_POLYGONS_NOT_ACQUIRED',
      'ROOF_TOP_EDGE_ACCURACY_NOT_ESTABLISHED_WITHIN_ONE_FOOT',
      'ORTHOPHOTO_IS_TWO_DIMENSIONAL',
      'SEATING_BOWL_HIDDEN_BY_CLOSED_ROOF',
      'ROOF_UNDERSIDES_NOT_VISIBLE',
      'TILE_SPECIFIC_ACQUISITION_DATE_NOT_ESTABLISHED',
      'SOURCE_ACQUISITION_TIME_NOT_ESTABLISHED_WITHIN_THIRTY_SECONDS',
      'CURRENT_2026_ROOF_POSITION_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'lower-panels-open-state-and-roof-undersides',
    status: 'unresolved-shadow-volume',
    evidence: 'The available open and closed aerial scans do not measure every lower-panel open surface, panel underside, track beam, or fully open stop coordinate.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'LOWER_PANEL_OPEN_SURFACES_NOT_COMPLETE',
      'PANEL_UNDERSIDES_NOT_MEASURED',
      'FULLY_OPEN_STOP_COORDINATES_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'current-provider-row-model-to-measured-rows',
    status: 'provider-model-complete-measurement-incomplete',
    evidence: 'The provider exposes 2,037 assigned rows and 17,859 anchors, but only 781 row locations have candidate aerial surface support and none are accepted as semantically measured seating treads.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'MEASURED_ROW_COVERAGE_IS_ZERO',
      'CANDIDATE_ROW_SURFACE_COVERAGE_IS_38_34_PERCENT',
      'ROW_ELEVATIONS_NOT_INDEPENDENTLY_MEASURED',
      'PROVIDER_WORLD_REGISTRATION_P95_EXCEEDS_ONE_FOOT',
    ],
  },
  {
    deltaId: 'official-2009-design-plan-row-topology-to-current-measured-rows',
    status: 'historical-row-topology-resolved-metric-and-current-gates-failed',
    evidence: 'The official City Clerk WebLink record contains the 2009 A21 main-concourse and A26 upper-deck floor plans with visible row linework. A locked similarity fit from current provider row centroids to A21 linework gives a 0.0622 ft median residual across 224 disjoint holdout rows, but the p95 residual is 2.6963 ft. The fit therefore fails the one-foot gate and does not resolve dense-line integer-row ambiguity, row labels, construction as-built status, or current geometry.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'DESIGN_DEVELOPMENT_IS_NOT_CONSTRUCTION_AS_BUILT',
      'INDEXED_SURVEY_SHEET_S6_ABSENT_FROM_CITY_EXPORT',
      'NEAREST_DARK_LINE_IS_NOT_SEMANTIC_ROW_CONTROL',
      'PLAN_REGISTRATION_HOLDOUT_P95_EXCEEDS_ONE_FOOT',
      'PLAN_SCAN_METRIC_ACCURACY_NOT_ESTABLISHED',
      'CURRENT_ROW_GEOMETRY_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'official-2010-substantial-modification-scope',
    status: 'historical-approval-scope-resolved-to-stadium-site-parking',
    evidence: 'The official City Clerk file 09-00141mm under Resolution R-10-0058 contains 29 final documents and 299 pages. Detailed review of the geometry-relevant support records and all 25 pages of Section B establishes six modification items involving retail area, parking count, garage heights, garage-roof photovoltaic coverage, a garage-roof antenna, and garage-liner uses. The City analysis explicitly limits the conditions to the parking garages and states that the garage-height changes do not affect the approved retractable-roof maximum height. The plan attachment is a Stadium Site Parking set, not a stadium bowl or roof set.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      '2010_MODIFICATION_SET_HAS_NO_STADIUM_BOWL_GEOMETRY',
      '2010_MODIFICATION_SET_HAS_NO_STADIUM_RETRACTABLE_ROOF_GEOMETRY',
      'CONSTRUCTION_AS_BUILT_STADIUM_SET_STILL_MISSING',
      'POST_CONSTRUCTION_STADIUM_CHANGE_INVENTORY_STILL_INCOMPLETE',
    ],
  },
  {
    deltaId: 'official-2010-bureau-veritas-records-and-geometry-scope',
    status: 'consultant-record-scope-resolved-to-parking-environmental-work',
    evidence: 'The complete official City Clerk file 10-00847 under Resolution R-10-0335 contains eight final documents and 46 pages. The consultant agreement and incorporated proposals limit Bureau Veritas to worker-risk, air-monitoring, and soil-management services for the surface parking lots and parking garages. Site surveying is explicitly excluded, all construction activities are performed by others, and no stadium bowl, seating row, roof, architectural record-drawing, or as-built geometry is present. The generic City ownership clause applies only to documents prepared or obtained under that limited agreement.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'BUREAU_VERITAS_FILE_HAS_NO_STADIUM_BOWL_GEOMETRY',
      'BUREAU_VERITAS_FILE_HAS_NO_STADIUM_RETRACTABLE_ROOF_GEOMETRY',
      'BUREAU_VERITAS_SCOPE_EXPLICITLY_EXCLUDES_SITE_SURVEYING',
      'GENERIC_DOCUMENT_OWNERSHIP_CLAUSE_DOES_NOT_ESTABLISH_ARCHITECTURAL_CUSTODY',
      'CONSTRUCTION_AS_BUILT_STADIUM_SET_STILL_MISSING',
    ],
  },
  {
    deltaId: 'historical-project-team-retractable-roof-bim-route',
    status: 'historical-detailed-roof-model-existence-and-project-team-route-established',
    evidence: 'Current first-party AECOM, Canam, and Moss project pages establish the construction-manager, design-assist, roof detailing, BIM management, virtual-construction, fabrication, and erection roles. Canam publishes two structural-model views, including a color-coded retractable-roof BIM image. These sources establish that a detailed historical roof model existed and identify the likely custody or transfer chain, but they do not publish the native model, its datum, its coordinates, owner-delivery records, as-built status, or current configuration.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'NATIVE_PROJECT_TEAM_BIM_NOT_ACQUIRED',
      'MODEL_CUSTODY_AND_DISPOSITION_NOT_ESTABLISHED',
      'OWNER_DELIVERY_NOT_ESTABLISHED',
      'MODEL_DATUM_AND_COORDINATES_NOT_ESTABLISHED',
      'CONSTRUCTION_AS_BUILT_MODEL_STATUS_NOT_ESTABLISHED',
      'CURRENT_ROOF_CONFIGURATION_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'historical-intelibuild-central-bim-collaboration-route',
    status: 'historical-central-roof-model-scope-and-model-sharing-route-established',
    evidence: 'Archived first-party InteliBuild project and award pages state that InteliBuild produced the Miami Ballpark central BIM model and shared it with the steel contractor, erector, and steel deck supplier. The model included prefabricated concrete rails used by the roof sections and integrated simulations to avoid clashes among all three panels. InteliBuild also reports that 40 drafters produced 7,100 drawings depicting exact component dimensions and locations. These facts strengthen the historical model scope and multi-party custody route, but no public native model, metric drawing package, datum, coordinate system, construction as-built certification, present retention record, or current configuration was located.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'NATIVE_INTELIBUILD_CENTRAL_BIM_NOT_ACQUIRED',
      'CURRENT_INTELIBUILD_OR_SUCCESSOR_RETENTION_NOT_VERIFIED',
      'MODEL_DATUM_AND_COORDINATES_NOT_ESTABLISHED',
      'CONSTRUCTION_AS_BUILT_MODEL_STATUS_NOT_ESTABLISHED',
      'OWNER_DELIVERY_NOT_ESTABLISHED',
      'CURRENT_ROOF_CONFIGURATION_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'official-city-cyclomedia-street-level-measurement-route',
    status: 'access-controlled-2019-exterior-capture-candidate',
    evidence: 'The official City Cyclomedia service returns 6,645 unique recording points in the stadium envelope and describes its street-level ortho imagery as suitable for 3D measurements. Every returned point has a 2019 capture timestamp and a published Z value of zero. The nearest City hyperlink is 127.12 meters from the stadium center, but it redirects to a Cyclomedia username login screen. No queried stadium image, measurement workspace, successful metric measurement, positional-accuracy specification, interior seating geometry, or current 2026 geometry is publicly exposed.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'STREETSMART_AUTHORIZATION_REQUIRED',
      'CYCLOMEDIA_CAPTURE_DATA_IS_FROM_2019',
      'PUBLISHED_CYCLOMEDIA_POINT_Z_VALUES_ARE_ZERO',
      'SUCCESSFUL_METRIC_MEASUREMENT_NOT_ESTABLISHED',
      'CYCLOMEDIA_POSITIONAL_ACCURACY_NOT_ESTABLISHED',
      'CYCLOMEDIA_HAS_NO_INTERIOR_SEATING_GEOMETRY',
      'CURRENT_2026_GEOMETRY_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'official-2011-tekla-award-native-model-custody-route',
    status: 'historical-winning-model-folder-requirement-and-current-contact-route-established',
    evidence: 'The archived official 2011 Tekla rules required each entrant to provide a Tekla BIMsight .tbp or Tekla .db1 plus profile data and required the model folder from winning projects. The archived official winners page names the Marlins retractable roof by InteliBuild as the steel winner. Tekla therefore has a documented historical custody route, and its current first-party North America submission page publishes a marketing contact and still requires .db1, aligned IFC, and model-folder material. However, actual 2011 receipt, present retention, release authority, datum, coordinates, construction as-built status, and current geometry remain unverified. The public archive retains only HTML pages, and the official animation is detailed but not metrically extractable.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'HISTORICAL_NATIVE_MODEL_RECEIPT_NOT_VERIFIED',
      'CURRENT_NATIVE_MODEL_RETENTION_NOT_VERIFIED',
      'PUBLIC_OR_AUTHORIZED_MODEL_RELEASE_NOT_ESTABLISHED',
      'MODEL_DATUM_AND_COORDINATES_NOT_ESTABLISHED',
      'CONSTRUCTION_AS_BUILT_MODEL_STATUS_NOT_ESTABLISHED',
      'CURRENT_ROOF_CONFIGURATION_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'official-club-2025-2026-geometry-change-inventory',
    status: 'official-current-change-locations-established-metric-geometry-unresolved',
    evidence: 'Four checksum-locked first-party MLB and Marlins pages confirm six current or recent ballpark changes. The set includes the 2025 120-seat PNC Club expansion behind home plate, upgraded 2026 Bullpen Bar seating in left field, the Section 228 Kids Zone relocation, opaque World Series banners moved next to the right-field foul pole, the expanded Marlins Museum behind home plate, and the current group deck at the former home-run-sculpture location. The pages establish change existence and coarse location but publish no current metric seat coordinates, obstruction dimensions, mount coordinates, or as-built drawings.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'PNC_CLUB_120_SEAT_EXPANSION_METRIC_GEOMETRY_NOT_RESOLVED',
      'BULLPEN_BAR_UPGRADED_SEATING_METRIC_GEOMETRY_NOT_RESOLVED',
      'SECTION_228_KIDS_ZONE_FIXTURE_GEOMETRY_NOT_RESOLVED',
      'RIGHT_FIELD_WORLD_SERIES_BANNER_GEOMETRY_NOT_RESOLVED',
      'EXPANDED_MARLINS_MUSEUM_GEOMETRY_NOT_RESOLVED',
      'LEFT_CENTER_GROUP_DECK_GEOMETRY_NOT_RESOLVED',
      'CURRENT_AS_BUILT_DRAWINGS_NOT_ACQUIRED',
      'CURRENT_CHANGE_INVENTORY_NOT_COMPLETE',
    ],
  },
  {
    deltaId: 'official-2026-game-footage-section4-persistence-review',
    status: 'dated-game-footage-reviewed-section4-not-uniquely-identified',
    evidence: 'All 477 half-second samples across 17 checksum-locked contact sheets from three official MLB clips tied to the April 7, 2026 Reds at Marlins game were visually reviewed. The clips show current game action and general stadium conditions, but no sampled frame contains a legible Section 4 marker or unique geometry that establishes Section 4. The footage therefore cannot establish current Section 4 persistence, metric rows, obstruction geometry, or an independent shade boundary.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'SECTION_4_NOT_UNIQUELY_IDENTIFIED_IN_DATED_OFFICIAL_GAME_FOOTAGE',
      'SECTION_4_PHYSICAL_PERSISTENCE_NOT_ESTABLISHED',
      'METRIC_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADE_HOLDOUT_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'official-2026-section4-candidate-footage-expanded-review',
    status: 'expanded-dated-footage-reviewed-section4-not-uniquely-identified',
    evidence: 'All 792 quarter-second samples across 29 checksum-locked contact sheets from five official MLB clips dated April 9 through June 24, 2026 were visually reviewed. The clips were selected for fan, dugout, protective-net, foul-line, and low-bowl coverage. The Camp Day clip explicitly shows portal markers 24 and 25. The netting clip supplies current visitor-side dugout context, and the ball-boy clip supplies a foul-line pan, but neither contains a Section 4 marker or a separately registered camera solution. No frame therefore establishes current Section 4 persistence, metric rows, obstruction geometry, or an independent shade boundary.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'SECTION_4_NOT_UNIQUELY_IDENTIFIED_IN_EXPANDED_DATED_OFFICIAL_FOOTAGE',
      'SECTION_4_PHYSICAL_PERSISTENCE_NOT_ESTABLISHED',
      'METRIC_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADE_HOLDOUT_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'official-2026-stand-focused-footage-shade-review',
    status: 'stand-focused-footage-reviewed-no-direct-solar-shade-boundary',
    evidence: 'All 1,856 quarter-second samples across 65 checksum-locked contact sheets from seven official MLB clips dated May 4 through July 28, 2026 were manually reviewed at full contact-sheet resolution. Six clips visibly show the stadium under a closed roof; the tight-only June 22 clip does not expose enough roof to assess its position. May 23 sheets 3 and 4 show numbered seat plaques, but no sample contains direct solar illumination, a seating shade boundary, an exact section label, an exact row label, or metric seat coordinates. The numbered plaques establish current physical seat detail only and are not converted into row-level shade observations.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'DIRECT_SOLAR_ILLUMINATION_NOT_OBSERVED_IN_STAND_FOCUSED_FOOTAGE',
      'SEATING_SHADE_BOUNDARY_NOT_OBSERVED_IN_STAND_FOCUSED_FOOTAGE',
      'EXACT_SECTION_AND_ROW_IDENTITY_NOT_ESTABLISHED',
      'METRIC_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADE_HOLDOUT_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'official-2026-open-roof-section35-shadow-corpus-review',
    status: 'complete-corpus-reviewed-three-observed-boundaries-four-censored-states',
    evidence: 'All 58 official MLB Savant clips from the open-roof April 18, 2026 game were reviewed through 1,461 checksum-locked half-second samples and 58 contact sheets. Three plays already supply exact observed Section 35 row boundaries. Native 1280 by 720 review of 23 frames from four additional plays at solar altitudes from 18.78 through 45.55 degrees shows the entire visible Section 35 row bank shaded, with no within-bank boundary. Those four plays are retained as censored all-shaded state evidence only. They do not increase the exact-boundary count, scored-holdout count, or boundary solar-altitude span.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'ONLY_THREE_EXACT_OBSERVED_BOUNDARIES_IN_COMPLETE_ONE_DATE_CORPUS',
      'CENSORED_ALL_SHADED_STATES_CANNOT_BE_ROW_ERROR_HOLDOUTS',
      'NO_GEOMETRY_PREDICTIONS_ATTACHED',
      'NO_SCORED_SHADOW_HOLDOUTS',
      'CURRENT_COMPLETE_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'official-2026-three-roof-open-candidate-shadow-corpus-review',
    status: 'complete-three-date-corpus-reviewed-no-exact-row-boundary',
    evidence: 'All 39 official MLB Savant clips from March 27, March 31, and April 17, 2026 were manually reviewed through 960 checksum-locked half-second samples and 39 complete contact sheets. Thirty-three checksum-locked native 1280 by 720 frames from five promising clips were reviewed separately. The Section 35 region is identifiable in those five clips and the row bank is visible at row resolution in four, but none contains a defensible within-bank sun-to-shade row transition. The official Partly Cloudy condition makes each game a roof-open candidate only. It does not independently prove the roof position or direct sunlight on Section 35. The candidate corpus spans solar altitudes from 0.13 through 11.59 degrees, but that clip coverage is not boundary coverage and receives no validation-span credit.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'NO_WITHIN_CORPUS_EXACT_ROW_BOUNDARIES',
      'CORPUS_SOLAR_SPAN_CANNOT_BE_USED_AS_BOUNDARY_SOLAR_SPAN',
      'DIRECT_SOLAR_ILLUMINATION_OF_TARGET_BANK_NOT_ESTABLISHED',
      'ROOF_POSITION_NOT_PROVED_BY_OFFICIAL_WEATHER_CONDITION_FIELD',
      'NO_GEOMETRY_PREDICTIONS_ATTACHED',
      'NO_SCORED_SHADOW_HOLDOUTS',
      'CURRENT_COMPLETE_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
    ],
  },
  {
    deltaId: 'official-2021-low-sun-open-roof-shadow-corpus-review',
    status: 'complete-two-date-low-sun-corpus-reviewed-no-exact-row-boundary',
    evidence: 'All 19 official MLB Savant clips from April 5 and April 6, 2021 were reviewed through 519 checksum-locked half-second samples and 19 contact sheets. Native 1280 by 720 frames preserve broadcast graphics stating that the roof was open on both dates. The Section 35 region appears in five clips, but never at sufficient exact-row resolution with direct solar illumination and a visible within-bank sun/shade boundary. The corpus spans solar altitudes from 0.01 through 11.89 degrees, but roof-open condition and uniform dusk illumination are not converted into row labels, observations, solar-span credit, or holdouts.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'NO_WITHIN_BANK_EXACT_ROW_BOUNDARY_IN_COMPLETE_LOW_SUN_CORPUS',
      'TARGET_SECTION_NOT_VISIBLE_AT_EXACT_ROW_RESOLUTION',
      'DIRECT_SOLAR_ILLUMINATION_NOT_ESTABLISHED',
      'HISTORICAL_2021_FOOTAGE_DOES_NOT_ESTABLISH_CURRENT_2026_GEOMETRY',
      'NO_GEOMETRY_PREDICTIONS_ATTACHED',
      'NO_SCORED_SHADOW_HOLDOUTS',
    ],
  },
  {
    deltaId: 'official-2025-open-roof-shadow-corpus-review',
    status: 'complete-four-date-corpus-reviewed-no-new-exact-row-boundary',
    evidence: 'All 65 official MLB clips in the 2025 open-roof corpus were manually reviewed through 2,608 checksum-locked half-second samples and 65 contact sheets across March 27, April 13, April 17, and May 7. Nine clips expose the Section 35 region, but none establishes a defensible within-bank exact row transition. The corpus spans solar altitudes from 4.04 through 74.81 degrees, but that is clip coverage rather than boundary coverage and receives no validation-span credit. The accepted May 7 exact boundary is a separate official in-play event outside this 65-clip corpus, already counted in the observed-boundary inventory, and is not counted again.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'NO_WITHIN_CORPUS_EXACT_ROW_BOUNDARIES',
      'CORPUS_SOLAR_SPAN_CANNOT_BE_USED_AS_BOUNDARY_SOLAR_SPAN',
      'EXISTING_MAY_7_BOUNDARY_ALREADY_COUNTED_OUTSIDE_CORPUS',
      'HISTORICAL_2025_FOOTAGE_DOES_NOT_ESTABLISH_CURRENT_2026_GEOMETRY',
      'NO_GEOMETRY_PREDICTIONS_ATTACHED',
      'NO_SCORED_SHADOW_HOLDOUTS',
    ],
  },
  {
    deltaId: 'current-provider-native-obstruction-geometry-route',
    status: 'renderer-capability-confirmed-venue-native-geometry-not-exposed',
    evidence: 'The current public viewer application, DVM module manager 1.16.6, and Viewer3d runtime 1.6.18 were checksum locked and inspected together with a current Section 4 network trace. The renderer contains general code paths for native mesh, space3d, depth, and normal resources. The Marlins venue trace instead returned 127 legacy panorama configs whose full schema contains camera pose, spherical texture type, and panorama identifier only. It requested zero native mesh, depth, normal, binary geometry, or space3d resources. General runtime capability is not accepted as proof that a Marlins venue asset exists.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'CURRENT_MARLINS_NATIVE_OBSTRUCTION_MESH_NOT_EXPOSED',
      'CURRENT_MARLINS_PANORAMA_DEPTH_NOT_EXPOSED',
      'CURRENT_METRIC_OVERHANG_UNDERSIDES_NOT_ESTABLISHED',
      'FULL_STADIUM_CURRENT_OBSTRUCTION_SCOPE_NOT_COMPLETE',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
  {
    deltaId: 'current-provider-section35-photogrammetric-geometry-route',
    status: 'provider-model-sparse-depth-and-dense-boundary-rays-supported-disjoint-orientation-failed',
    evidence: 'Two checksum-locked, disjoint photometric reconstructions of the current Section 35 provider panoramas produced 354 mutual depth anchors. Their cross-target separation is 0.0364 m median and 0.0746 m p95, so they support sparse provider-render surface points only. A separately detected Marlins-logo display face was then reconstructed from fixed, disjoint training, holdout, and final four-camera bundles. A signed subpixel detector retained all 3,840 boundary samples, passed its unchanged three-pixel initializer and two-pixel line-residual gates, and supplied 320 labeled edge rays per view. Independent 3D planar-rectangle fits passed the unchanged ray-distance, conditioning, optimizer, and one-foot corner-agreement gates. Maximum boundary-ray distance was 0.0266 m and maximum pairwise corner disagreement was 0.0605 m p95. The independently fitted face normals nevertheless disagree by as much as 4.6134 degrees, exceeding the unchanged one-degree orientation gate. No face is promoted, no view-dependent-rendering explanation is assumed, no thickness or rear face is inferred, and no closed obstruction volume is established.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'PROVIDER_DEPTH_ANCHORS_LACK_SEMANTIC_CLOSED_SURFACES',
      'PANEL_ORIENTATION_DISAGREEMENT_EXCEEDS_ONE_DEGREE',
      'PANEL_THICKNESS_AND_REAR_FACE_NOT_ESTABLISHED',
      'CURRENT_PROVIDER_RENDER_IS_NOT_PHYSICAL_AS_BUILT_MEASUREMENT',
      'PROVIDER_WORLD_REGISTRATION_P95_EXCEEDS_ONE_FOOT',
      'FULL_STADIUM_CURRENT_OBSTRUCTION_SCOPE_NOT_COMPLETE',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
  {
    deltaId: 'post-2024-current-change-inventory',
    status: 'official-permit-index-and-public-record-search-locked-change-details-unresolved',
    evidence: 'The current official City iBuild GIS layer exposes 163 stadium-address permit features, including 17 distinct post-2024 plan identifiers and six active, approved, or submitted building-workflow candidates. The index supplies identifiers, broad scope, and status only. Eight priority plan numbers, comprising the six unresolved current workflow candidates plus the two 2025 final building records, were each searched in the official City Clerk repository by token and exact phrase. All 16 checksum-locked searches returned zero records. This establishes that no matching document was exposed through that public City Clerk search at acquisition time. It does not establish that iBuild or ProjectDox lacks the plans, and it does not disclose project descriptions, plan sheets, the original construction master permit, or final as-built geometry.',
    currentAsBuiltResolved: false,
    currentMetricGeometryResolved: false,
    completeShapeResolved: false,
    blockers: [
      'CURRENT_AGENCY_RECORD_POSSESSION_NOT_CONFIRMED',
      'ORIGINAL_CONSTRUCTION_MASTER_PERMIT_NOT_IDENTIFIED',
      'PERMIT_PLAN_FILES_NOT_INCLUDED',
      'NO_PRIORITY_PLAN_RECORDS_EXPOSED_IN_PUBLIC_CITY_CLERK_SEARCH',
      'IBUILD_OR_PROJECTDOX_PLAN_ACCESS_NOT_ESTABLISHED',
      'POST_2024_GEOMETRY_CHANGE_CANDIDATES_NOT_RESOLVED',
      'CURRENT_CHANGE_INVENTORY_NOT_COMPLETE',
      'RECORD_RELEASE_PATH_NOT_AUTHORIZED',
    ],
  },
];

const geometryBoundary = {
  establishesMetricStadiumFrame: true,
  establishesCurrentChangeInventory: false,
  establishesCurrentCityPermitIndexSnapshot: true,
  establishesPost2024ChangeCandidates: true,
  establishesOfficialClubCurrentChangeInventoryPartial: true,
  establishesOfficialClubCurrentChangeLocations: true,
  establishesOfficialClubCurrentChangeMetricGeometry: false,
  establishesDatedOfficial2026GameFootage: true,
  establishesExpandedDatedOfficial2026Section4CandidateReview: true,
  establishesExpandedDatedOfficial2026StandFocusedShadeReview: true,
  establishesCompleteApril18SavantObservationReview: true,
  establishesComplete2026ThreeDateRoofOpenCandidateSavantObservationReview: true,
  establishes2026RoofOpenConditionFromOfficialWeatherField: false,
  establishes2026ThreeDateExactObservedSection35Boundary: false,
  establishesComplete2021LowSunSavantObservationReview: true,
  establishes2021LowSunOpenRoofConditionOnTwoDates: true,
  establishes2021LowSunExactObservedSection35Boundary: false,
  establishesComplete2025OpenRoofSavantObservationReview: true,
  establishes2025ExactObservedSection35BoundaryInReviewed65ClipCorpus: false,
  establishesExistingMay7ExactBoundaryOutsideReviewed65ClipCorpus: true,
  establishesCurrentNumberedSeatPlaquesFromDatedOfficialFootage: true,
  establishesDirectSolarIlluminationFromDatedOfficialFootage: true,
  establishesSeatingShadeBoundaryFromDatedOfficialFootage: true,
  establishesThreeExactObservedSection35Boundaries: true,
  establishesFourCensoredAllShadedSection35States: true,
  establishesScoredSection35ShadowHoldout: false,
  establishesSection4UniqueIdentificationFromDatedOfficialGameFootage: false,
  establishesSection4PhysicalPersistenceFromDatedOfficialGameFootage: false,
  establishesCurrent3ddvRendererNativeMeshCapability: true,
  establishesCurrentMarlins3ddvNativeObstructionMesh: false,
  establishesCurrentMarlins3ddvPanoramaDepth: false,
  establishesCurrentMarlins3ddvPanoramaNormals: false,
  establishesCurrentMarlins3ddvSpace3dScene: false,
  establishesCurrentMarlins3ddvSparsePhotometricDepthAnchors: true,
  establishesCurrentMarlins3ddvSemanticClosedObstructionSurface: false,
  establishesCurrentMarlins3ddvPanelOrientationWithinOneDegree: false,
  establishesCurrentMarlins3ddvPanelClosedVolume: false,
  establishesCurrentCityFootprintCandidate: false,
  establishesHistoricalDesignRowTopology: true,
  establishesOfficial2010ApprovalScope: true,
  establishes2010ApprovalDidNotModifyStadiumBowlOrRetractableRoofGeometry: true,
  establishesOfficial2010BureauVeritasScope: true,
  establishesBureauVeritasArchitecturalRecordRoute: false,
  establishesHistoricalDetailedRoofModelExistence: true,
  establishesProjectTeamBimRoute: true,
  establishesHistoricalInteliBuildCentralBimExistence: true,
  establishesHistoricalInteliBuildPrecastRoofRailModelScope: true,
  establishesHistoricalInteliBuildThreePanelSimulationScope: true,
  establishesCurrentInteliBuildModelRetention: false,
  establishesHistoricalMechanizationDesignSupplyAndInstallationRoute: true,
  establishesHistoricalPositionFeedbackSystemExistence: true,
  establishesContractualStadiumOperatorOperationsAndMaintenanceRoute: true,
  establishesOperatorAgreementAccountingIdentityThrough2025: true,
  establishesCountyOwnedStadiumCapitalReserveFundThrough2025: true,
  establishesContractualOperatorAllMaintenanceAndRepairsDuty: true,
  establishesContractualCountyAnnualStructuralMaintenanceReportRoute: true,
  establishesCurrentCountyAnnualStructuralMaintenanceReportPossession: false,
  establishesRoofSpecificMaintenanceRecord: false,
  establishesCurrent2026StadiumOperatorIdentity: false,
  establishesCurrentOperatorRecordPossession: false,
  establishesCurrentOperatorControlSystemLogExistence: false,
  establishesCurrentMechanizationRecordRetention: false,
  establishesCurrentFullyOpenStopCoordinates: false,
  establishesCurrentSensorCalibration: false,
  establishesGameSpecificPanelPositionHistory: false,
  establishesTeklaAwardNativeModelCustodyRoute: true,
  establishesActualTeklaWinningModelReceipt: false,
  establishesCurrentTeklaWinningModelRetention: false,
  establishesPublicTeklaNativeModelAvailability: false,
  establishesNativeProjectTeamBimCoordinates: false,
  establishesOfficialCityCyclomediaRecordingPointCoverage: true,
  establishesCyclomediaCaptureCoverageIn2019: true,
  establishesPublicCyclomediaImageAccess: false,
  establishesSuccessfulCyclomediaMetricMeasurement: false,
  establishesCyclomediaPositionalAccuracy: false,
  establishesHistoricalPlanLineAgreementCandidate: true,
  establishesSubFootCityPlanRegistration: false,
  establishesCurrentAsBuiltGeometry: false,
  establishesCompleteObstructionGeometry: false,
  establishesOverhangUndersides: false,
  establishesMeasuredRowGeometry: false,
  establishesCurrentUpperPanelShapePersistenceThrough2024: true,
  establishesOfficial2025OrthophotoDatasetPlanFrameWithinOneFootAt95Percent: true,
  establishesOfficial2025ClosedRoofVisualStateWithinPublishedAcquisitionDateSet: true,
  establishesOfficial2025OrthophotoRoofTopEdgesWithinOneFoot: false,
  establishesOfficial2025CurrentRowPersistence: false,
  establishesOfficial2025RoofUndersideGeometry: false,
  establishesOfficial2025ExactShadowTimestamp: false,
  establishesCurrentRoofPanelCoordinates: false,
  establishesGameSpecificRoofConfiguration: false,
};

const stable = {
  analysisVersion: 'marlins-current-geometry-delta-audit-v2',
  stadiumId: 'marlins',
  assessedOn: '2026-08-11',
  inputs,
  currentGeometryDeltas,
  inventory: {
    featureCount: currentGeometryDeltas.length,
    resolvedCurrentMetricFeatureCount: 0,
    unresolvedCurrentMetricFeatureCount: currentGeometryDeltas.length,
  },
  evidenceBoundary: geometryBoundary,
  geometryBoundary,
  accuracyEvidence: {
    metricStadiumFrameAccepted: true,
    frameHorizontalUncertainty95Feet: 0.654302963,
    frameVerticalUncertainty95Feet: 0.31,
    frameOrientationUncertaintyDegrees: 0.030824776,
    reports95PercentSubFootHorizontalAccuracy: false,
    official2025OrthophotoDatasetHorizontalAccuracy95Feet: 0.384,
    official2025OrthophotoDatasetPlanFrameAccepted: true,
    official2025OrthophotoRoofTopEdgeAccuracy95Feet: null,
    official2025OrthophotoRoofTopEdgeMetricMeasurementAccepted: false,
    currentObstructionHorizontalUncertainty95Feet: null,
    currentObstructionVerticalUncertainty95Feet: null,
  },
  recordsRoute: {
    ...sourceReview.value.recordsRoute,
    agreementFileCompleteVisualReview: {
      reviewed: true,
      sourcePdfPageCount: caaImageExhibitReview.value.reviewScope.sourcePdfPageCount,
      exactMetricGeometryPresent: false,
      constructionDrawingIndexPresent: false,
      seatingBowlPlanPresent: false,
      buildingSectionPresent: false,
      roofMechanizationDrawingPresent: false,
      asBuiltDrawingPresent: false,
      operatingAgreementMaintenanceExactPageRange:
        caaImageExhibitReview.value.reviewScope.operatingAgreementMaintenanceExactPageRange,
      operatorAllMaintenanceAndRepairsDutyEstablished: true,
      annualCountyMaintenanceAndStructuralSystemReportRouteEstablished: true,
      currentCountyReportPossessionEstablished: false,
      roofSpecificMaintenanceRecordIdentified: false,
    },
    cityClerkWeblinkDesignPlanRecord: {
      repositoryEntryId: cityWeblinkDesignPlanReview.value.sourceStatus.repositoryEntryId,
      fileId: cityWeblinkDesignPlanReview.value.sourceStatus.fileId,
      resolution: cityWeblinkDesignPlanReview.value.sourceStatus.resolution,
      sourcePdfPageCount: cityWeblinkDesignPlanReview.value.sourceStatus.imagedPageCount,
      seatingRowTopologyPresent: true,
      constructionAsBuiltRecord: false,
      currentAsBuiltRecord: false,
      indexedSurveySheetS6Present: false,
      holdoutRowCount: cityWeblinkPlanRegistration.value.counts.holdoutRows,
      holdoutMedianNearestLineResidualFeet:
        cityWeblinkPlanRegistration.value.holdoutNearestLineResidualFeet.median,
      holdoutP95NearestLineResidualFeet:
        cityWeblinkPlanRegistration.value.holdoutNearestLineResidualFeet.p95,
      holdoutP95AtOrBelowOneFoot: false,
      semanticRowIdentityEstablished: false,
    },
    cityClerkWeblink2010SubstantialModificationRecord: {
      fileId: cityWeblinkModificationReview.value.modificationScope.officialApprovalFileId,
      resolution: cityWeblinkModificationReview.value.modificationScope.officialResolution,
      recordStatus: cityWeblinkModificationReview.value.modificationScope.recordStatus,
      exactDocumentCount:
        cityWeblinkModificationReview.value.reviewScope.exactCityDocumentCount,
      exactDocumentPageCount:
        cityWeblinkModificationReview.value.reviewScope.exactCityDocumentPageCount,
      detailedSupportPageCount:
        cityWeblinkModificationReview.value.reviewScope.detailedSupportPagesReviewed,
      planPageCount:
        cityWeblinkModificationReview.value.reviewScope.planPagesReviewed,
      modificationConditionsLimitedToParkingGarages: true,
      stadiumBowlGeometryModified: false,
      stadiumRetractableRoofGeometryModified: false,
      constructionAsBuiltRecord: false,
      currentAsBuiltRecord: false,
    },
    cityClerkWeblink2010BureauVeritasRecord: {
      fileId: cityWeblinkBureauVeritasReview.value.reviewScope.officialFileId,
      resolution: cityWeblinkBureauVeritasReview.value.reviewScope.officialResolution,
      recordStatus: cityWeblinkBureauVeritasReview.value.reviewScope.recordStatus,
      exactDocumentCount:
        cityWeblinkBureauVeritasReview.value.reviewScope.exactCityDocumentCount,
      exactDocumentPageCount:
        cityWeblinkBureauVeritasReview.value.reviewScope.exactCityDocumentPageCount,
      pagesReviewed:
        cityWeblinkBureauVeritasReview.value.reviewScope.pagesReviewed,
      physicalScope: cityWeblinkBureauVeritasReview.value.consultantScope.physicalProjectScope,
      siteSurveyingIncluded: false,
      stadiumArchitecturalRecordCustodyEstablished: false,
      constructionAsBuiltRecord: false,
      currentAsBuiltRecord: false,
    },
    projectTeamBimRecordRoute: {
      potentialCustodiansOrTransferSources:
        projectTeamBimSourceReview.value.modelCustodyRoute.potentialCustodiansOrTransferSources,
      requestedNativeModelClasses:
        projectTeamBimSourceReview.value.modelCustodyRoute.requestedNativeModelClasses,
      firstPartyCanamContactUrl:
        projectTeamBimSourceReview.value.modelCustodyRoute.firstPartyCanamContactUrl,
      currentCanamProjectPageLinksContactRoute: true,
      externalRequestSent: false,
      historicalDetailedRoofModelExistenceEstablished: true,
      currentModelPossessionEstablished: false,
      ownerDeliveryEstablished: false,
      nativeModelPubliclyAvailable: false,
      constructionAsBuiltModelEstablished: false,
      currentConfigurationEstablished: false,
    },
    inteliBuildCentralBimRecordRoute: {
      historicalPotentialModelCustodiansOrUsers:
        inteliBuildArchiveSourceReview.value.currentCustodyRoute.historicalPotentialModelCustodiansOrUsers,
      documentedModelConsumers:
        inteliBuildArchiveSourceReview.value.centralBimEvidence.documentedModelConsumers,
      documentedDrawingCount:
        inteliBuildArchiveSourceReview.value.centralBimEvidence.documentedDrawingCount,
      centralBimExistenceEstablished: true,
      precastRoofRailModelScopeEstablished: true,
      threeRoofPanelSimulationScopeEstablished: true,
      currentModelRetentionEstablished: false,
      ownerDeliveryEstablished: false,
      nativeModelPubliclyAvailable: false,
      constructionAsBuiltModelEstablished: false,
      currentConfigurationEstablished: false,
      externalRequestSent: false,
    },
    roofMechanizationRecordRoute: {
      potentialCustodiansOrTransferSources:
        roofMechanizationSourceReview.value.currentCustodyRoute.potentialCustodiansOrTransferSources,
      requestedRecordClasses:
        roofMechanizationSourceReview.value.currentCustodyRoute.requestedRecordClasses,
      uniSystemsCurrentInquiryUrl:
        roofMechanizationSourceReview.value.currentCustodyRoute.uniSystemsCurrentInquiryUrl,
      walterPMooreCurrentContactUrl:
        roofMechanizationSourceReview.value.currentCustodyRoute.walterPMooreCurrentContactUrl,
      mechanizationDesignSupplyAndInstallationRouteEstablished: true,
      historicalPositionFeedbackSystemExistenceEstablished: true,
      currentRecordRetentionEstablished: false,
      currentFullyOpenStopCoordinatesEstablished: false,
      currentSensorCalibrationEstablished: false,
      gameSpecificPanelPositionHistoryEstablished: false,
      externalRequestSent: false,
    },
    teklaAwardModelRoute: {
      winner: teklaAwardSourceReview.value.historicalCompetitionEvidence.winnerName,
      submitter: teklaAwardSourceReview.value.historicalCompetitionEvidence.submitter,
      winningProjectModelFolderRequiredByRules: true,
      actualWinningModelReceiptIndependentlyVerified: false,
      currentNativeModelRetentionVerified: false,
      publicNativeModelLocated: false,
      firstPartyNorthAmericaAwardContact:
        teklaAwardSourceReview.value.currentCustodyRoute.firstPartyNorthAmericaAwardContact,
      externalRequestSent: false,
      constructionAsBuiltModelEstablished: false,
      currentConfigurationEstablished: false,
    },
  },
  cityCyclomediaRoute: {
    officialStadiumEnvelopePointCount:
      cityCyclomediaSourceReview.value.inventoryFindings.officialCityEnvelopePointCount,
    uniqueImageIdCount:
      cityCyclomediaSourceReview.value.inventoryFindings.uniqueImageIdCount,
    nearestPointDistanceToStadiumCenterMeters:
      cityCyclomediaSourceReview.value.inventoryFindings.nearestPointDistanceToStadiumCenterMeters,
    captureYear: cityCyclomediaSourceReview.value.inventoryFindings.captureYear,
    allPublishedZCoordinatesAreZero:
      cityCyclomediaSourceReview.value.inventoryFindings.allPublishedZCoordinatesAreZero,
    loginRequired: cityCyclomediaSourceReview.value.accessFindings.loginRequired,
    publicUnauthenticatedGeometryAccessEstablished: false,
    successfulMetricMeasurementEstablished: false,
    positionalAccuracyEstablished: false,
    currentExteriorGeometryEstablished: false,
    interiorSeatingGeometryEstablished: false,
  },
  cityPermitIndexRoute: {
    officialPermitFeatureCount: cityPermitIndexReview.value.inventory.sourceFeatureCount,
    officialUniquePlanNumberCount: cityPermitIndexReview.value.inventory.sourceUniquePlanNumberCount,
    post2024CandidateCount: cityPermitIndexReview.value.inventory.post2024CandidateFeatureCount,
    currentUnresolvedWorkflowCandidateCount: cityPermitIndexReview.value.inventory.currentUnresolvedWorkflowCandidateCount,
    priorityPlanNumberPublicCityClerkSearchCount:
      cityPermitPlanRecordDiscovery.value.inventory.searchCount,
    priorityPlanNumberPublicCityClerkDocumentCount:
      cityPermitPlanRecordDiscovery.value.inventory.uniqueDocumentCount,
    completeTokenAndExactPhraseSearchAtAcquisitionTime:
      cityPermitPlanRecordDiscovery.value.evidenceBoundary
        .establishesCompleteTokenAndExactPhraseSearchAtAcquisitionTime,
    originalConstructionMasterPermitIdentified: false,
    planSheetsIncluded: false,
    iBuildOrProjectDoxPlanAccessEstablished: false,
    completeCurrentChangeInventoryEstablished: false,
  },
  official2025OrthophotoRoute: {
    acquisitionDates:
      current2025OrthophotoGeometry.value.sourceMetadata.acquisitionDates,
    tileSpecificAcquisitionDateEstablished: false,
    tileSpecificAcquisitionTimeEstablished: false,
    pixelSizeFeet:
      current2025OrthophotoGeometry.value.inputs.mosaic.pixelSizeFeet,
    officialDatasetHorizontalAccuracy95Feet:
      current2025OrthophotoGeometry.value.accuracyAssessment
        .officialDatasetHorizontalAccuracy95Feet,
    independentSurveyedCheckpointCount:
      current2025OrthophotoGeometry.value.sourceMetadata.horizontalAccuracy
        .independentSurveyedCheckpointCount,
    officialDatasetPlanFrameAccepted: true,
    elevatedFeatureManualFixesDocumented: true,
    elevatedFeatureCorrectionPolygonsAcquired: false,
    closedRoofVisualStateEstablishedWithinPublishedAcquisitionDateSet: true,
    roofTopEdgeMetricMeasurementAccepted: false,
    currentRowPersistenceEstablished: false,
    roofUndersideGeometryEstablished: false,
    exactShadowTimestampEstablished: false,
  },
  officialCurrentBallparkChangesRoute: {
    officialPageCount:
      officialCurrentBallparkChangesReview.value.summary.officialPageCount,
    currentChangeCount:
      officialCurrentBallparkChangesReview.value.summary.currentChangeCount,
    seatingTopologyChangeCount:
      officialCurrentBallparkChangesReview.value.summary.seatingTopologyChangeCount,
    obstructionRelevantChangeCount:
      officialCurrentBallparkChangesReview.value.summary.obstructionRelevantChangeCount,
    changeIds:
      officialCurrentBallparkChangesReview.value.changes.map((change) => change.changeId),
    completeCurrentChangeInventoryEstablished: false,
    currentMetricGeometryEstablished: false,
    currentAsBuiltGeometryEstablished: false,
  },
  officialCurrentGameVisualReviewRoute: {
    gameDateLocal:
      officialCurrentGameSection4Adjudication.value.reviewScope.gameDateLocal,
    expandedCandidateSourceDateCount:
      officialCurrentSection4CandidateAdjudication.value.reviewScope.sourceDateCount,
    expandedCandidateEarliestSourceDate:
      officialCurrentSection4CandidateAdjudication.value.reviewScope.earliestSourceDate,
    expandedCandidateLatestSourceDate:
      officialCurrentSection4CandidateAdjudication.value.reviewScope.latestSourceDate,
    standFocusedSourceDateCount:
      officialCurrentStandsCandidateAdjudication.value.reviewScope.sourceDateCount,
    standFocusedEarliestSourceDate:
      officialCurrentStandsCandidateAdjudication.value.reviewScope.earliestSourceDate,
    standFocusedLatestSourceDate:
      officialCurrentStandsCandidateAdjudication.value.reviewScope.latestSourceDate,
    reviewedClipCount:
      officialCurrentGameSection4Adjudication.value.summary.reviewedClipCount
      + officialCurrentSection4CandidateAdjudication.value.summary.reviewedClipCount
      + officialCurrentStandsCandidateAdjudication.value.summary.reviewedClipCount
      + savantObservationAdjudication.value.summary.candidateCount
      + current2026RoofOpenCandidateSavantAdjudication.value.summary.candidateCount,
    reviewedSampleCount:
      officialCurrentGameSection4Adjudication.value.summary.reviewedSampleCount
      + officialCurrentSection4CandidateAdjudication.value.summary.reviewedSampleCount
      + officialCurrentStandsCandidateAdjudication.value.summary.reviewedSampleCount
      + savantObservationAdjudication.value.summary.sampleCount
      + current2026RoofOpenCandidateSavantAdjudication.value.summary.sampleCount,
    reviewedContactSheetCount:
      officialCurrentGameSection4Adjudication.value.summary.reviewedContactSheetCount
      + officialCurrentSection4CandidateAdjudication.value.summary.reviewedContactSheetCount
      + officialCurrentStandsCandidateAdjudication.value.summary.reviewedContactSheetCount
      + savantObservationAdjudication.value.summary.reviewSheetCount
      + current2026RoofOpenCandidateSavantAdjudication.value.summary.reviewSheetCount,
    standFocusedRoofClosedClipCount:
      officialCurrentStandsCandidateAdjudication.value.summary.roofClosedClipCount,
    standFocusedNumberedSeatPlaqueContactSheetCount:
      officialCurrentStandsCandidateAdjudication.value.summary
        .numberedSeatPlaqueContactSheetCount,
    standFocusedDirectSolarIlluminationFrameCount: 0,
    standFocusedSeatingShadeBoundaryFrameCount: 0,
    april18SavantExactObservedBoundaryCount:
      savantObservationAdjudication.value.summary.exactObservedBoundaryCount,
    april18SavantCensoredAllShadedObservationCount:
      savantObservationAdjudication.value.summary.censoredAllShadedObservationCount,
    april18SavantCensoredSolarAltitudeSpanDegrees:
      savantObservationAdjudication.value.summary.censoredSolarAltitudeSpanDegrees,
    april18SavantNewScoredShadowHoldoutCount: 0,
    threeDateRoofOpenCandidateSavantReviewedClipCount:
      current2026RoofOpenCandidateSavantAdjudication.value.summary.candidateCount,
    threeDateRoofOpenCandidateSavantReviewedSampleCount:
      current2026RoofOpenCandidateSavantAdjudication.value.summary.sampleCount,
    threeDateRoofOpenCandidateSavantNativeReviewedFrameCount:
      current2026RoofOpenCandidateSavantAdjudication.value.summary
        .nativeReviewedFrameCount,
    threeDateRoofOpenCandidateSavantExactObservedBoundaryCount: 0,
    threeDateRoofOpenCandidateSavantCandidateSolarAltitudeSpanDegrees:
      current2026RoofOpenCandidateSavantAdjudication.value.summary
        .candidateSolarAltitudeSpanDegrees,
    threeDateRoofOpenCandidateSavantCandidateSolarSpanIsBoundarySolarSpan: false,
    section4UniquelyIdentifiedFrameCount: 0,
    section4PhysicalPersistenceEstablished: false,
    metricRowGeometryEstablished: false,
    currentObstructionGeometryEstablished: false,
    independentShadeBoundaryObservationCount:
      savantObservationAdjudication.value.summary.exactObservedBoundaryCount,
    independentScoredShadeHoldoutCount: 0,
  },
  historicalLowSunShadowObservationRoute: {
    sourceDates: historicalLowSunSavantAdjudication.value.sourceDates,
    reviewedClipCount:
      historicalLowSunSavantAdjudication.value.summary.candidateCount,
    reviewedSampleCount:
      historicalLowSunSavantAdjudication.value.summary.sampleCount,
    reviewedContactSheetCount:
      historicalLowSunSavantAdjudication.value.summary.reviewSheetCount,
    nativeReviewedFrameCount:
      historicalLowSunSavantAdjudication.value.summary.nativeReviewedFrameCount,
    openRoofDateCount:
      historicalLowSunSavantAdjudication.value.summary.openRoofDateCount,
    minimumSolarAltitudeDegrees:
      historicalLowSunSavantAdjudication.value.summary.minimumSolarAltitudeDegrees,
    maximumSolarAltitudeDegrees:
      historicalLowSunSavantAdjudication.value.summary.maximumSolarAltitudeDegrees,
    exactObservedBoundaryCount: 0,
    independentScoredShadeHoldoutCount: 0,
    currentGeometryEstablished: false,
  },
  historical2025ShadowObservationRoute: {
    sourceDates: historical2025SavantAdjudication.value.sourceDates,
    reviewedClipCount:
      historical2025SavantAdjudication.value.summary.candidateCount,
    reviewedSampleCount:
      historical2025SavantAdjudication.value.summary.sampleCount,
    reviewedContactSheetCount:
      historical2025SavantAdjudication.value.summary.reviewSheetCount,
    section35RegionVisibleCandidateCount:
      historical2025SavantAdjudication.value.summary
        .section35RegionVisibleCandidateCount,
    minimumSolarAltitudeDegrees:
      historical2025SavantAdjudication.value.summary.minimumSolarAltitudeDegrees,
    maximumSolarAltitudeDegrees:
      historical2025SavantAdjudication.value.summary.maximumSolarAltitudeDegrees,
    corpusSolarAltitudeSpanDegrees:
      historical2025SavantAdjudication.value.summary.solarAltitudeSpanDegrees,
    corpusSolarAltitudeSpanIsBoundarySolarAltitudeSpan: false,
    exactObservedBoundaryInCorpusCount: 0,
    existingExactBoundaryOutsideCorpusCrossReferenceCount: 1,
    newCountedObservedBoundaryCount: 0,
    independentScoredShadeHoldoutCount: 0,
    currentGeometryEstablished: false,
  },
  current2026ThreeDateRoofOpenCandidateShadowObservationRoute: {
    sourceDates: current2026RoofOpenCandidateSavantAdjudication.value.sourceDates,
    reviewedClipCount:
      current2026RoofOpenCandidateSavantAdjudication.value.summary.candidateCount,
    reviewedSampleCount:
      current2026RoofOpenCandidateSavantAdjudication.value.summary.sampleCount,
    reviewedContactSheetCount:
      current2026RoofOpenCandidateSavantAdjudication.value.summary.reviewSheetCount,
    nativeReviewedFrameCount:
      current2026RoofOpenCandidateSavantAdjudication.value.summary
        .nativeReviewedFrameCount,
    officialRoofOpenCandidateDateCount:
      current2026RoofOpenCandidateSavantAdjudication.value.summary
        .officialRoofOpenCandidateDateCount,
    roofOpenEstablishedByOfficialConditionField: false,
    directSolarIlluminationOfSection35EstablishedCount: 0,
    exactObservedBoundaryCount: 0,
    newCountedObservedBoundaryCount: 0,
    independentScoredShadeHoldoutCount: 0,
    minimumCandidateSolarAltitudeDegrees:
      current2026RoofOpenCandidateSavantAdjudication.value.summary
        .minimumCandidateSolarAltitudeDegrees,
    maximumCandidateSolarAltitudeDegrees:
      current2026RoofOpenCandidateSavantAdjudication.value.summary
        .maximumCandidateSolarAltitudeDegrees,
    candidateSolarAltitudeSpanDegrees:
      current2026RoofOpenCandidateSavantAdjudication.value.summary
        .candidateSolarAltitudeSpanDegrees,
    candidateSolarAltitudeSpanIsBoundarySolarAltitudeSpan: false,
    currentGeometryEstablished: false,
  },
  current3ddvNativeGeometryRoute: {
    dvmModuleManagerVersion:
      current3ddvNativeGeometryAudit.value.softwareVersions.dvmModuleManager,
    viewer3dVersion:
      current3ddvNativeGeometryAudit.value.softwareVersions.viewer3d,
    venuePanoramaSchema:
      current3ddvNativeGeometryAudit.value.softwareVersions.venuePanoramaSchema,
    uniqueVenueResponseCount:
      current3ddvNativeGeometryAudit.value.marlinsVenueTrace.uniqueVenueResponseCount,
    uniqueSection4PanoramaConfigCount:
      current3ddvNativeGeometryAudit.value.marlinsVenueTrace
        .uniqueSection4PanoramaConfigCount,
    uniqueNativeGeometryResponseCount:
      current3ddvNativeGeometryAudit.value.marlinsVenueTrace
        .uniqueNativeGeometryResponseCount,
    rendererSupportsNativeMeshResourcesInGeneral: true,
    currentMarlinsNativeObstructionMeshEstablished: false,
    currentMarlinsPanoramaDepthEstablished: false,
    currentMarlinsPanoramaNormalsEstablished: false,
    currentMarlinsSpace3dSceneEstablished: false,
    currentSection35SparsePhotometricDepthAnchorCount:
      current3ddvSection35DepthAnchors.value.crossValidation.mutualAnchorCount,
    currentSection35SparsePhotometricDepthAnchorsEstablished: true,
    currentSection35SemanticClosedObstructionSurfaceEstablished: false,
    currentSection35PanelMaximumOrientationDisagreementDegrees: Math.max(
      ...current3ddvSection35PanelRectangle.value.partitionComparisons.map(
        (comparison) => comparison.normalDisagreementDegrees,
      ),
    ),
    currentSection35PanelOrientationWithinOneDegreeEstablished: false,
    currentSection35PanelClosedVolumeEstablished: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'CURRENT_CHANGE_INVENTORY_NOT_COMPLETE',
      'MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED',
      'CITY_DESIGN_PLAN_REGISTRATION_P95_EXCEEDS_ONE_FOOT',
      'CURRENT_METRIC_ROOF_VOLUME_NOT_ESTABLISHED',
      'CURRENT_MECHANIZATION_GEOMETRY_AND_POSITION_HISTORY_NOT_ESTABLISHED',
      'CURRENT_OPERATOR_IDENTITY_AND_RECORD_POSSESSION_NOT_VERIFIED',
      'INTELIBUILD_CENTRAL_BIM_RETENTION_AND_RELEASE_NOT_VERIFIED',
      'TEKLA_WINNING_MODEL_RECEIPT_AND_RETENTION_NOT_VERIFIED',
      'ROOF_UNDERSIDES_NOT_MEASURED',
      'CURRENT_PROVIDER_NATIVE_OBSTRUCTION_GEOMETRY_NOT_EXPOSED',
      'GAME_SPECIFIC_ROOF_CONFIGURATION_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-current-geometry-delta-audit',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};

const outputDirectory = path.resolve(paths.outputDirectory);
await mkdir(outputDirectory, { recursive: true });
const outputPath = path.join(outputDirectory, 'manifest.json');
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  inventory: artifact.inventory,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
