import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { MLB_STADIUMS } from '../src/data/stadiums';
import {
  SEAT_SHADE_RELEASE_THRESHOLDS,
  evaluateGeometryForSeatShade,
  getStadiumGeometryEvidence,
} from '../src/data/stadiumGeometryEvidence';
import { verifyResearchArtifactFreshnessAudit } from
  '../src/data/researchArtifactFreshnessTrust';
import { summarizeProviderRowCoordinateCompleteness } from
  '../src/data/providerRowCoordinateSemantics';
import {
  currentObstructionArtifactCandidates,
  evidenceFreshnessArtifactCandidates,
} from '../src/data/researchArtifactCandidates';

function option(name: string): string | null {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? null;
}

async function readJsonIfPresent(path: string): Promise<Record<string, unknown> | null> {
  try {
    await access(path);
    return JSON.parse(await readFile(path, 'utf8')) as Record<string, unknown>;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

async function readFirstJsonIfPresent(paths: string[]): Promise<{
  path: string;
  value: Record<string, unknown>;
} | null> {
  for (const path of paths) {
    const value = await readJsonIfPresent(path);
    if (value) return { path, value };
  }
  return null;
}

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value as Record<string, unknown>)
        .sort()
        .map((key) => [
          key,
          canonicalJson((value as Record<string, unknown>)[key]),
        ]),
    );
  }
  return value;
}

function canonicalArtifactVersionValid(artifact: Record<string, unknown> | null): boolean {
  if (!artifact || typeof artifact.artifactVersion !== 'string') return false;
  const stable = { ...artifact };
  delete stable.artifactVersion;
  return artifact.artifactVersion
    === `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`;
}

async function main(): Promise<void> {
  const outputArgument = option('output');
  const records = await Promise.all(MLB_STADIUMS.map(async (stadium) => {
    const metricRowsArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-3ddv-metric-rows-v2.json`),
      resolve(`tmp/lidar/${stadium.id}-3ddv-metric-rows-v1.json`),
      resolve(`tmp/lidar/${stadium.id}-3ddv-metric-rows.json`),
    ]);
    const providerRowMapArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-ticketmaster-assigned-rows-2026.json`),
      resolve(`tmp/lidar/${stadium.id}-ticketmaster-assigned-rows.json`),
    ]);
    const providerFieldControlArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-ticketmaster-field-controls-2026.json`),
    ]);
    const providerWorldRegistrationArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-ticketmaster-drcog-row-registration-candidate-2026.json`),
      resolve(`tmp/lidar/${stadium.id}-ticketmaster-lidar-plan-registration-candidate-2026.json`),
      resolve(`tmp/lidar/${stadium.id}-3ddv-survey-orthophoto-world-registration-candidate-v3-2026.json`),
      resolve(`tmp/lidar/${stadium.id}-3ddv-survey-orthophoto-world-registration-candidate-v2-2026.json`),
      resolve(`tmp/lidar/${stadium.id}-3ddv-survey-orthophoto-world-registration-candidate-2026.json`),
    ]);
    const currentObstructionArtifact = await readFirstJsonIfPresent(
      currentObstructionArtifactCandidates(stadium.id).map((candidate) => resolve(candidate)),
    );
    const registrationRepeatabilityArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-ticketmaster-lidar-registration-repeatability-audit-2026.json`),
    ]);
    const lidarRowSurfaceAuditArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-ticketmaster-lidar-flightline-row-surface-audit-2026.json`),
    ]);
    const orthophotoRowReviewArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-ticketmaster-orthophoto-row-review-2026/manifest.json`),
    ]);
    const groundFrameRegistrationAuditArtifact = await readFirstJsonIfPresent([
      ...(stadium.id === 'marlins' ? [
        resolve(
          'tmp/lidar/marlins-usgs-fl-miamidade-d23/'
          + 'orthophoto-ground-control-fresh-hard-curb-final-audit-v7.json',
        ),
      ] : []),
      resolve(`tmp/lidar/${stadium.id}-usgs-2021-open-roof/hard-structure-local-registration-v1.json`),
      resolve(`tmp/lidar/${stadium.id}-survey-qc-orthophoto-registration-audit-2026.json`),
      resolve(`tmp/lidar/${stadium.id}-ngs-drcog-orthophoto-registration-audit-2026.json`),
    ]);
    const evidenceFreshnessArtifact = await readFirstJsonIfPresent(
      evidenceFreshnessArtifactCandidates(stadium.id).map((candidate) => resolve(candidate)),
    );
    const observedBoundaryInventoryArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-observed-shade-boundary-inventory-v1.json`),
      resolve(`tmp/lidar/${stadium.id}-sec35-observed-shade-boundary-inventory-v1.json`),
    ]);
    const semanticRowAdjudicationArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-row-surface-semantic-adjudication-v1-2026.json`),
    ]);
    const currentProviderVerticalHoldoutArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-current-sec4-vertical-holdout-audit-v1-2026.json`),
    ]);
    const currentProviderProvenanceArtifact = await readFirstJsonIfPresent([
      resolve(`tmp/lidar/${stadium.id}-current-provider-provenance-audit-v1-2026.json`),
    ]);
    const metricRowsPath = metricRowsArtifact?.path ?? null;
    const metricRows = metricRowsArtifact?.value ?? null;
    const providerRowMapPath = providerRowMapArtifact?.path ?? null;
    const providerRowMap = providerRowMapArtifact?.value ?? null;
    const providerFieldControlPath = providerFieldControlArtifact?.path ?? null;
    const providerFieldControl = providerFieldControlArtifact?.value ?? null;
    const providerWorldRegistrationPath = providerWorldRegistrationArtifact?.path ?? null;
    const providerWorldRegistration = providerWorldRegistrationArtifact?.value ?? null;
    const currentObstructionPath = currentObstructionArtifact?.path ?? null;
    const currentObstruction = currentObstructionArtifact?.value ?? null;
    const currentGeometryDeltas = Array.isArray(currentObstruction?.currentGeometryDeltas)
      ? currentObstruction.currentGeometryDeltas as Record<string, unknown>[]
      : Array.isArray(currentObstruction?.changes)
        ? currentObstruction.changes as Record<string, unknown>[]
        : [];
    const currentObstructionEvidenceBoundary = (
      currentObstruction?.evidenceBoundary
      ?? currentObstruction?.geometryBoundary
      ?? {}
    ) as Record<string, unknown>;
    const currentOfficialGameVisualReview = (
      currentObstruction?.officialCurrentGameVisualReviewRoute ?? {}
    ) as Record<string, unknown>;
    const registrationRepeatabilityPath = registrationRepeatabilityArtifact?.path ?? null;
    const registrationRepeatability = registrationRepeatabilityArtifact?.value ?? null;
    const lidarRowSurfaceAuditPath = lidarRowSurfaceAuditArtifact?.path ?? null;
    const lidarRowSurfaceAudit = lidarRowSurfaceAuditArtifact?.value ?? null;
    const orthophotoRowReviewPath = orthophotoRowReviewArtifact?.path ?? null;
    const orthophotoRowReview = orthophotoRowReviewArtifact?.value ?? null;
    const groundFrameRegistrationAuditPath =
      groundFrameRegistrationAuditArtifact?.path ?? null;
    const groundFrameRegistrationAudit =
      groundFrameRegistrationAuditArtifact?.value ?? null;
    const evidenceFreshnessPath = evidenceFreshnessArtifact?.path ?? null;
    const evidenceFreshness = evidenceFreshnessArtifact?.value ?? null;
    const observedBoundaryInventoryPath = observedBoundaryInventoryArtifact?.path ?? null;
    const observedBoundaryInventory = observedBoundaryInventoryArtifact?.value ?? null;
    const observedBoundarySummary =
      (observedBoundaryInventory?.summary ?? {}) as Record<string, unknown>;
    const observedBoundaryGateResults =
      (observedBoundaryInventory?.gateResults ?? {}) as Record<string, unknown>;
    const semanticRowAdjudicationPath = semanticRowAdjudicationArtifact?.path ?? null;
    const semanticRowAdjudication = semanticRowAdjudicationArtifact?.value ?? null;
    const semanticRowAdjudicationSummary =
      (semanticRowAdjudication?.summary ?? {}) as Record<string, unknown>;
    const currentProviderVerticalHoldoutPath = currentProviderVerticalHoldoutArtifact?.path ?? null;
    const currentProviderVerticalHoldout = currentProviderVerticalHoldoutArtifact?.value ?? null;
    const currentProviderVerticalHoldoutSummary =
      (currentProviderVerticalHoldout?.summary ?? {}) as Record<string, unknown>;
    const currentProviderVerticalHoldoutTraining =
      (currentProviderVerticalHoldout?.training ?? {}) as Record<string, unknown>;
    const currentProviderVerticalHoldoutBoundary =
      (currentProviderVerticalHoldout?.geometryBoundary ?? {}) as Record<string, unknown>;
    const currentProviderProvenancePath = currentProviderProvenanceArtifact?.path ?? null;
    const currentProviderProvenance = currentProviderProvenanceArtifact?.value ?? null;
    const currentProviderProvenanceAssessment =
      (currentProviderProvenance?.sourceCurrencyAssessment ?? {}) as Record<string, unknown>;
    const currentProviderProvenanceBoundary =
      (currentProviderProvenance?.evidenceBoundary ?? {}) as Record<string, unknown>;
    const currentProviderProvenanceVersionValid =
      canonicalArtifactVersionValid(currentProviderProvenance);
    const currentProviderSourceProvenanceVerified = Boolean(
      currentProviderProvenance?.artifactKind === 'current-provider-source-provenance-audit'
      && currentProviderProvenance?.stadiumId === stadium.id
      && currentProviderProvenanceVersionValid
      && currentProviderProvenanceAssessment.currentProviderSourceProvenanceVerified === true
      && currentProviderProvenanceBoundary.establishesOfficialClubPublicationOfProviderMap
        === true
      && currentProviderProvenanceBoundary.establishesOfficialIframeProviderIdentity === true
      && currentProviderProvenanceBoundary.establishesCurrentProviderResourceAcquisition === true
      && currentProviderProvenanceBoundary.establishesCurrentProviderSourceProvenance === true
      && currentProviderProvenanceBoundary.resolvesProviderFeedSourceCurrencyBlocker === true
      && currentProviderProvenanceBoundary.establishesProviderCoordinateAccuracy === false
      && currentProviderProvenanceBoundary.establishesCurrentPhysicalRowGeometry === false
      && currentProviderProvenanceBoundary.establishesPhysicalMeasurement === false
    );
    const evidence = getStadiumGeometryEvidence(stadium.id);
    const evidenceEvaluation = evaluateGeometryForSeatShade(evidence);
    const metricPublication = metricRows?.publication as {
      eligible?: boolean;
      blockers?: string[];
    } | undefined;
    const originalMetricPublicationBlockers = metricPublication?.blockers ?? [];
    const effectiveMetricPublicationBlockers = originalMetricPublicationBlockers.filter(
      (blocker) => !(
        blocker === 'SOURCE_CURRENCY_NOT_VERIFIED'
        && currentProviderSourceProvenanceVerified
      ),
    );
    const completeness = (metricRows?.completeness ?? {}) as Record<string, unknown>;
    const unresolvedProducts = Array.isArray(completeness.unresolvedBlockmapProducts)
      ? completeness.unresolvedBlockmapProducts.length
      : null;
    const excludedProducts = Array.isArray(completeness.excludedNonAssignedRowProducts)
      ? completeness.excludedNonAssignedRowProducts.length
      : null;
    const assignedRowGeometryPresent = Boolean(metricRows);
    const assignedRowCoveragePercent = typeof completeness.percent === 'number'
      ? completeness.percent
      : 0;
    const providerCoordinateCompleteness =
      summarizeProviderRowCoordinateCompleteness(completeness);
    const assignedSeatCoverageClaimAllowed = completeness.assignedSeatCoverageClaimAllowed === true
      || (
        completeness.scope === 'ticket-addressable-assigned-rows'
        && (unresolvedProducts === null || unresolvedProducts === 0)
      );
    const completeAssignedRowScope = Boolean(
      assignedSeatCoverageClaimAllowed
      && completeness.percent === 100
      && providerCoordinateCompleteness.providerDirectCoveragePercent === 100
      && completeness.missingRows === 0,
    );
    const requiredFreshArtifactPaths = [
      metricRowsPath,
      providerRowMapPath,
      providerFieldControlPath,
      providerWorldRegistrationPath,
      currentObstructionPath,
      registrationRepeatabilityPath,
      lidarRowSurfaceAuditPath,
      orthophotoRowReviewPath,
      groundFrameRegistrationAuditPath,
      observedBoundaryInventoryPath,
      currentProviderProvenancePath,
    ].filter((path): path is string => path !== null);
    const liveFreshnessValidation = evidenceFreshness
      ? await verifyResearchArtifactFreshnessAudit(evidenceFreshness)
      : null;
    const freshAuditedPaths = new Set(
      (liveFreshnessValidation?.records ?? [])
        .filter((record) => record.ready && record.path !== null)
        .map((record) => resolve(record.path as string)),
    );
    const missingFreshnessCoverage = requiredFreshArtifactPaths
      .filter((path) => !freshAuditedPaths.has(resolve(path)));
    const freshnessSummary = (evidenceFreshness?.summary ?? {}) as Record<string, unknown>;
    const declaredAllFreshnessAuditsPassed = freshnessSummary.allArtifactsFresh === true;
    const allFreshnessAuditsPassed = liveFreshnessValidation?.ready === true;
    const evidenceFreshnessReady = Boolean(
      evidenceFreshness
      && allFreshnessAuditsPassed
      && requiredFreshArtifactPaths.length > 0
      && missingFreshnessCoverage.length === 0,
    );
    const groundFrameRegistrationAccepted =
      (groundFrameRegistrationAudit?.registrationAcceptance as
        Record<string, unknown> | undefined)?.accepted === true
      || (
        groundFrameRegistrationAudit?.artifactKind
          === 'marlins-2025-fresh-hard-curb-final-registration-audit'
        && (groundFrameRegistrationAudit?.assessment as
          Record<string, unknown> | undefined)?.groundRegistrationAccepted === true
      );
    const groundFrameRegistrationBlockers =
      groundFrameRegistrationAccepted
        ? []
        : ((groundFrameRegistrationAudit?.registrationAcceptance as
            Record<string, unknown> | undefined)?.blockers
          ?? (groundFrameRegistrationAudit?.assessment as
            Record<string, unknown> | undefined)?.blockers
          ?? []) as string[];
    const blockers = [...new Set([
      ...(!metricRows ? ['NO_VERSIONED_ASSIGNED_ROW_GEOMETRY_ARTIFACT'] : []),
      ...(!completeAssignedRowScope ? ['ASSIGNED_ROW_SCOPE_NOT_COMPLETE'] : []),
      ...(!groundFrameRegistrationAudit
        ? ['NO_GROUND_FRAME_REGISTRATION_AUDIT'] : []),
      ...(groundFrameRegistrationAudit && !groundFrameRegistrationAccepted
        ? groundFrameRegistrationBlockers : []),
      ...(!evidenceFreshness ? ['NO_CURRENT_EVIDENCE_FRESHNESS_AUDIT'] : []),
      ...(evidenceFreshness && !declaredAllFreshnessAuditsPassed
        ? ['EVIDENCE_FRESHNESS_AUDIT_FAILED'] : []),
      ...(evidenceFreshness && liveFreshnessValidation?.artifactVersionValid !== true
        ? ['EVIDENCE_FRESHNESS_AUDIT_INTEGRITY_FAILED'] : []),
      ...(evidenceFreshness && liveFreshnessValidation?.allAuditedArtifactsLiveFresh !== true
        ? ['EVIDENCE_FRESHNESS_LIVE_VERIFICATION_FAILED'] : []),
      ...(evidenceFreshness && missingFreshnessCoverage.length > 0
        ? ['EVIDENCE_FRESHNESS_AUDIT_INCOMPLETE'] : []),
      ...effectiveMetricPublicationBlockers,
      ...evidenceEvaluation.blockers,
    ])];
    const publicationEligible = Boolean(
      completeAssignedRowScope
      && metricPublication?.eligible === true
      && evidenceEvaluation.publishable
      && evidenceFreshnessReady
      && groundFrameRegistrationAccepted,
    );
    return {
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      assignedRowProviderCoordinates: {
        artifactPresent: assignedRowGeometryPresent,
        path: assignedRowGeometryPresent ? metricRowsPath : null,
        artifactVersion: metricRows?.artifactVersion ?? null,
        scope: completeness.scope ?? null,
        expectedRows: completeness.expectedRows ?? null,
        extractedRows: completeness.extractedRows ?? null,
        missingRows: completeness.missingRows ?? null,
        coveragePercent: assignedRowCoveragePercent,
        coordinateClassification: 'provider-rendering-coordinate',
        establishesPhysicalMeasurement: false,
        providerDirectCoveragePercent:
          providerCoordinateCompleteness.providerDirectCoveragePercent,
        providerDirectRows: providerCoordinateCompleteness.providerDirectRows,
        providerRecoveredRows: providerCoordinateCompleteness.providerRecoveredRows,
        legacyMeasurementVocabularyTranslated:
          providerCoordinateCompleteness.legacyMeasurementVocabularyTranslated,
        assignedSeatCoverageClaimAllowed,
        unresolvedBlockmapProducts: unresolvedProducts,
        excludedNonAssignedRowProducts: excludedProducts,
        sourceCurrencyBlockerOriginallyPresent:
          originalMetricPublicationBlockers.includes('SOURCE_CURRENCY_NOT_VERIFIED'),
        sourceCurrencyBlockerResolvedByCurrentProviderProvenance:
          originalMetricPublicationBlockers.includes('SOURCE_CURRENCY_NOT_VERIFIED')
          && currentProviderSourceProvenanceVerified,
        originalPublicationBlockers: originalMetricPublicationBlockers,
        effectivePublicationBlockers: effectiveMetricPublicationBlockers,
      },
      currentProviderProvenanceAudit: {
        artifactPresent: Boolean(currentProviderProvenance),
        path: currentProviderProvenancePath,
        artifactKind: currentProviderProvenance?.artifactKind ?? null,
        artifactVersion: currentProviderProvenance?.artifactVersion ?? null,
        artifactVersionValid: currentProviderProvenanceVersionValid,
        officialMapUrl:
          (currentProviderProvenance?.officialPublication as
            Record<string, unknown> | undefined)?.resolvedUrl ?? null,
        embeddedProviderUrl:
          (currentProviderProvenance?.officialPublication as
            Record<string, unknown> | undefined)?.embeddedProviderUrl ?? null,
        retrievedOn:
          (currentProviderProvenance?.officialPublication as
            Record<string, unknown> | undefined)?.retrievedOn ?? null,
        viewerConfigLastModified:
          (currentProviderProvenance?.providerSource as
            Record<string, unknown> | undefined)?.viewerConfigLastModified ?? null,
        siteConfigurationLastModified:
          (currentProviderProvenance?.providerSource as
            Record<string, unknown> | undefined)?.siteConfigurationLastModified ?? null,
        viewer3dRuntimeLastModified:
          (currentProviderProvenance?.providerSource as
            Record<string, unknown> | undefined)?.viewer3dRuntimeLastModified ?? null,
        currentProviderSourceProvenanceVerified,
        resolvesProviderFeedSourceCurrencyBlocker:
          currentProviderSourceProvenanceVerified,
        establishesProviderCoordinateAccuracy:
          currentProviderProvenanceBoundary.establishesProviderCoordinateAccuracy === true,
        establishesCurrentPhysicalRowGeometry:
          currentProviderProvenanceBoundary.establishesCurrentPhysicalRowGeometry === true,
        establishesPhysicalMeasurement:
          currentProviderProvenanceBoundary.establishesPhysicalMeasurement === true,
        publicationEligible:
          (currentProviderProvenance?.publication as Record<string, unknown> | undefined)
            ?.eligible === true,
        blockers:
          (currentProviderProvenance?.publication as Record<string, unknown> | undefined)
            ?.blockers ?? [],
      },
      providerRowMapGeometry: {
        artifactPresent: Boolean(providerRowMap),
        path: providerRowMapPath,
        artifactVersion: providerRowMap?.artifactVersion ?? null,
        coordinateKind: (providerRowMap?.coordinateReference as Record<string, unknown> | undefined)
          ?.kind ?? null,
        metric: (providerRowMap?.coordinateReference as Record<string, unknown> | undefined)
          ?.metric === true,
        elevationIncluded:
          (providerRowMap?.coordinateReference as Record<string, unknown> | undefined)
            ?.elevationIncluded === true,
        extractedRows:
          (providerRowMap?.completeness as Record<string, unknown> | undefined)
            ?.extractedRows ?? null,
        extractedPlaces:
          (providerRowMap?.completeness as Record<string, unknown> | undefined)
            ?.extractedPlaces ?? null,
        providerMapCoordinateCoveragePercent:
          (providerRowMap?.completeness as Record<string, unknown> | undefined)
            ?.providerMapCoordinateCoveragePercent ?? null,
        assignedSeatCoverageClaimAllowed:
          (providerRowMap?.completeness as Record<string, unknown> | undefined)
            ?.assignedSeatCoverageClaimAllowed === true,
      },
      providerFieldControls: {
        artifactPresent: Boolean(providerFieldControl),
        path: providerFieldControlPath,
        artifactVersion: providerFieldControl?.artifactVersion ?? null,
        analysisVersion: providerFieldControl?.analysisVersion ?? null,
        establishesProviderMapScale:
          (providerFieldControl?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesProviderMapScale === true,
        establishesProviderFieldAxis:
          (providerFieldControl?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesProviderFieldAxis === true,
        establishesSurveyedWorldCoordinates:
          (providerFieldControl?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesSurveyedWorldCoordinates === true,
        moundDistanceResidualFeet:
          (providerFieldControl?.controls as Record<string, unknown> | undefined)
            ?.moundDistanceResidualFeet ?? null,
        regulationMoundCheckWithinOneFoot:
          (providerFieldControl?.validation as Record<string, unknown> | undefined)
            ?.regulationMoundCheckWithinOneFoot === true,
      },
      providerWorldRegistrationCandidate: {
        artifactPresent: Boolean(providerWorldRegistration),
        path: providerWorldRegistrationPath,
        artifactKind: providerWorldRegistration?.artifactKind ?? null,
        artifactVersion: providerWorldRegistration?.artifactVersion ?? null,
        rowCount:
          (providerWorldRegistration?.coverage as Record<string, unknown> | undefined)
            ?.rowCount ?? null,
        seatCount:
          (providerWorldRegistration?.coverage as Record<string, unknown> | undefined)
            ?.seatCount ?? null,
        rowsWithProjectedCoordinates:
          (providerWorldRegistration?.coverage as Record<string, unknown> | undefined)
            ?.rowsWithProjectedCoordinates ?? null,
        seatsWithProjectedCoordinates:
          (providerWorldRegistration?.coverage as Record<string, unknown> | undefined)
            ?.seatsWithProjectedCoordinates ?? null,
        rowsWithMeasuredElevation:
          (providerWorldRegistration?.coverage as Record<string, unknown> | undefined)
            ?.rowsWithMeasuredElevation ?? null,
        establishesCandidateProjectedPlanCoordinates:
          (providerWorldRegistration?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesCandidateProjectedPlanCoordinates === true,
        establishesSubFootAbsoluteHorizontalAccuracy:
          (providerWorldRegistration?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesSubFootAbsoluteHorizontalAccuracy === true,
        establishesSubFootGroundOrthophotoFrame:
          (providerWorldRegistration?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesSubFootGroundOrthophotoFrame === true,
        groundOrthophotoFrameHorizontalUncertainty95Feet:
          (providerWorldRegistration?.diagnostics as Record<string, unknown> | undefined)
            ?.orthophotoGroundFrameHorizontalUncertainty95Feet ?? null,
        publicationEligible:
          (providerWorldRegistration?.publication as Record<string, unknown> | undefined)
            ?.eligible === true,
        blockers:
          (providerWorldRegistration?.publication as Record<string, unknown> | undefined)
            ?.blockers ?? [],
      },
      currentObstructionCandidate: {
        artifactPresent: Boolean(currentObstruction),
        path: currentObstructionPath,
        artifactKind: currentObstruction?.artifactKind ?? null,
        artifactVersion: currentObstruction?.artifactVersion ?? null,
        featureCount:
          (currentObstruction?.inventory as Record<string, unknown> | undefined)
            ?.featureCount
          ?? (currentObstruction?.search as Record<string, unknown> | undefined)
            ?.candidateCount
          ?? (currentGeometryDeltas.length > 0 ? currentGeometryDeltas.length : null)
          ?? null,
        primaryFeatureCount:
          (currentObstruction?.semanticSelection as Record<string, unknown> | undefined)
            ?.primaryFeatureCount
          ?? (currentObstruction?.selectedStadiumCandidate ? 1 : null),
        secondaryOverlapFeatureCount:
          (currentObstruction?.semanticSelection as Record<string, unknown> | undefined)
            ?.secondaryOverlapFeatureCount ?? null,
        establishesCurrentNeighbourhoodRoofprintCandidates:
          (currentObstruction?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesCurrentNeighbourhoodRoofprintCandidates === true,
        establishesCurrentChangeInventory:
          currentObstructionEvidenceBoundary.establishesCurrentChangeInventory === true
          || currentObstructionEvidenceBoundary.establishesCurrentChangeClasses === true,
        establishesCurrentCityFootprintCandidate:
          currentObstructionEvidenceBoundary.establishesCurrentCityFootprintCandidate === true,
        establishesCurrentAsBuiltGeometry:
          currentObstructionEvidenceBoundary.establishesCurrentAsBuiltGeometry === true,
        establishesCompleteObstructionGeometry:
          currentObstructionEvidenceBoundary.establishesCompleteObstructionGeometry === true,
        unresolvedDeltaCount: currentGeometryDeltas.filter((delta) =>
          delta.currentAsBuiltResolved !== true
          && delta.currentMetricGeometryResolved !== true
          && delta.completeShapeResolved !== true).length,
        datedOfficialGameVisualReviewPresent:
          currentObstructionEvidenceBoundary.establishesDatedOfficial2026GameFootage === true,
        datedOfficialGameReviewedSampleCount:
          currentOfficialGameVisualReview.reviewedSampleCount ?? null,
        datedOfficialGameReviewedContactSheetCount:
          currentOfficialGameVisualReview.reviewedContactSheetCount ?? null,
        section4UniquelyIdentifiedFrameCount:
          currentOfficialGameVisualReview.section4UniquelyIdentifiedFrameCount ?? null,
        establishesSection4PhysicalPersistenceFromDatedOfficialGameFootage:
          currentObstructionEvidenceBoundary
            .establishesSection4PhysicalPersistenceFromDatedOfficialGameFootage === true,
        establishesOverhangUndersides:
          (currentObstruction?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesOverhangUndersides === true,
        reports95PercentSubFootHorizontalAccuracy:
          (currentObstruction?.accuracyEvidence as Record<string, unknown> | undefined)
            ?.reports95PercentSubFootHorizontalAccuracy === true,
        publicationEligible:
          (currentObstruction?.publication as Record<string, unknown> | undefined)
            ?.eligible === true,
        blockers:
          (currentObstruction?.publication as Record<string, unknown> | undefined)
            ?.blockers ?? [],
      },
      registrationRepeatabilityAudit: {
        artifactPresent: Boolean(registrationRepeatability),
        path: registrationRepeatabilityPath,
        artifactVersion: registrationRepeatability?.artifactVersion ?? null,
        candidateCount:
          (registrationRepeatability?.summary as Record<string, unknown> | undefined)
            ?.candidateCount ?? null,
        maximumPositionDeltaFeet:
          (registrationRepeatability?.summary as Record<string, unknown> | undefined)
            ?.maximumPositionDeltaFeet ?? null,
        maximumBearingDeltaDegrees:
          (registrationRepeatability?.summary as Record<string, unknown> | undefined)
            ?.maximumBearingDeltaDegrees ?? null,
        positionRepeatabilityPassed:
          (registrationRepeatability?.summary as Record<string, unknown> | undefined)
            ?.positionRepeatabilityPassed === true,
        bearingRepeatabilityPassed:
          (registrationRepeatability?.summary as Record<string, unknown> | undefined)
            ?.bearingRepeatabilityPassed === true,
        registrationRepeatabilityPassed:
          (registrationRepeatability?.summary as Record<string, unknown> | undefined)
            ?.registrationRepeatabilityPassed === true,
      },
      lidarRowSurfaceAudit: {
        artifactPresent: Boolean(lidarRowSurfaceAudit),
        path: lidarRowSurfaceAuditPath,
        artifactVersion: lidarRowSurfaceAudit?.artifactVersion ?? null,
        rowCount:
          (lidarRowSurfaceAudit?.summary as Record<string, unknown> | undefined)
            ?.rowCount ?? null,
        repeatableTopmostSurfaceRowCount:
          (lidarRowSurfaceAudit?.summary as Record<string, unknown> | undefined)
            ?.repeatableTopmostSurfaceRowCount ?? null,
        seatingProfileCandidateRowCount:
          (lidarRowSurfaceAudit?.summary as Record<string, unknown> | undefined)
            ?.seatingProfileCandidateRowCount ?? null,
        seatingProfileRunCount:
          (lidarRowSurfaceAudit?.summary as Record<string, unknown> | undefined)
            ?.seatingProfileRunCount ?? null,
        measuredRowElevationCount:
          (lidarRowSurfaceAudit?.summary as Record<string, unknown> | undefined)
            ?.measuredRowElevationCount ?? null,
        establishesIndependentFlightlineRepeatabilityAtFixedPlanCoordinates:
          (lidarRowSurfaceAudit?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesIndependentFlightlineRepeatabilityAtFixedPlanCoordinates === true,
        establishesMeasuredRowElevations:
          (lidarRowSurfaceAudit?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesMeasuredRowElevations === true,
        publicationEligible:
          (lidarRowSurfaceAudit?.publication as Record<string, unknown> | undefined)
            ?.eligible === true,
        blockers:
          (lidarRowSurfaceAudit?.publication as Record<string, unknown> | undefined)
            ?.blockers ?? [],
      },
      orthophotoRowReviewQueue: {
        artifactPresent: Boolean(orthophotoRowReview),
        path: orthophotoRowReviewPath,
        artifactVersion: orthophotoRowReview?.artifactVersion ?? null,
        queuedSectionCount:
          (orthophotoRowReview?.summary as Record<string, unknown> | undefined)
            ?.queuedSectionCount ?? null,
        queuedRowCount:
          (orthophotoRowReview?.summary as Record<string, unknown> | undefined)
            ?.queuedRowCount ?? null,
        acceptedSectionCount:
          (orthophotoRowReview?.summary as Record<string, unknown> | undefined)
            ?.acceptedSectionCount ?? null,
        acceptedRowCount:
          (orthophotoRowReview?.summary as Record<string, unknown> | undefined)
            ?.acceptedRowCount ?? null,
        establishesIndependentReviewedControls:
          (orthophotoRowReview?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesIndependentReviewedControls === true,
        establishesExactRowRegistration:
          (orthophotoRowReview?.geometryBoundary as Record<string, unknown> | undefined)
            ?.establishesExactRowRegistration === true,
        publicationEligible:
          (orthophotoRowReview?.publication as Record<string, unknown> | undefined)
            ?.eligible === true,
        blockers:
          (orthophotoRowReview?.publication as Record<string, unknown> | undefined)
            ?.blockers ?? [],
      },
      groundFrameRegistrationAudit: {
        artifactPresent: Boolean(groundFrameRegistrationAudit),
        path: groundFrameRegistrationAuditPath,
        artifactKind: groundFrameRegistrationAudit?.artifactKind ?? null,
        artifactVersion: groundFrameRegistrationAudit?.artifactVersion ?? null,
        acceptedControlCount:
          (groundFrameRegistrationAudit?.controlGeometry as
            Record<string, unknown> | undefined)?.acceptedControlCount
          ?? (groundFrameRegistrationAudit?.metrics as
            Record<string, unknown> | undefined)?.finalResponseSurfaceCount
          ?? null,
        numericRegistrationAccepted:
          (groundFrameRegistrationAudit?.numericRegistrationAcceptance as
            Record<string, unknown> | undefined)?.accepted === true
          || (
            groundFrameRegistrationAudit?.artifactKind
              === 'ngs-drcog-orthophoto-registration-audit'
            && groundFrameRegistrationAccepted
          )
          || (
            groundFrameRegistrationAudit?.artifactKind
              === 'marlins-2025-fresh-hard-curb-final-registration-audit'
            && groundFrameRegistrationAccepted
          ),
        registrationAccepted: groundFrameRegistrationAccepted,
        combinedAbsoluteHorizontalUncertainty95Feet:
          (groundFrameRegistrationAudit?.uncertainty as
            Record<string, unknown> | undefined)
            ?.combinedAbsoluteHorizontalUncertainty95Feet
          ?? (groundFrameRegistrationAudit?.uncertainty as
            Record<string, unknown> | undefined)
            ?.combinedHorizontalAccuracy95Feet
          ?? (groundFrameRegistrationAudit?.metrics as
            Record<string, unknown> | undefined)
            ?.combinedHorizontalUncertainty95Feet
          ?? null,
        orientationUncertainty95Degrees:
          ((groundFrameRegistrationAudit?.uncertainty as
            Record<string, unknown> | undefined)?.monteCarlo as
              Record<string, unknown> | undefined)
            ?.orientationUncertainty95Degrees
          ?? (groundFrameRegistrationAudit?.uncertainty as
            Record<string, unknown> | undefined)
            ?.combinedOrientationAccuracy95Degrees
          ?? (groundFrameRegistrationAudit?.metrics as
            Record<string, unknown> | undefined)
            ?.maximumAbsoluteOrientationCorrectionDegrees
          ?? null,
        provenanceBlockers:
          (groundFrameRegistrationAudit?.controlProvenance as
            Record<string, unknown> | undefined)?.blockers ?? [],
        blockers: groundFrameRegistrationBlockers,
      },
      evidenceFreshnessAudit: {
        artifactPresent: Boolean(evidenceFreshness),
        path: evidenceFreshnessPath,
        artifactVersion: evidenceFreshness?.artifactVersion ?? null,
        artifactCount: freshnessSummary.artifactCount ?? null,
        freshArtifactCount: freshnessSummary.freshArtifactCount ?? null,
        declaredAllArtifactsFresh: declaredAllFreshnessAuditsPassed,
        allArtifactsFresh: allFreshnessAuditsPassed,
        artifactVersionValid: liveFreshnessValidation?.artifactVersionValid ?? false,
        declaredSummaryValid: liveFreshnessValidation?.declaredSummaryValid ?? false,
        allAuditedArtifactsLiveFresh:
          liveFreshnessValidation?.allAuditedArtifactsLiveFresh ?? false,
        liveVerifiedArtifactCount: liveFreshnessValidation?.records.filter((record) =>
          record.ready).length ?? 0,
        liveVerificationFailures: liveFreshnessValidation?.records.filter((record) =>
          !record.ready) ?? [],
        trustBlockers: liveFreshnessValidation?.blockers ?? [],
        requiredArtifactCount: requiredFreshArtifactPaths.length,
        coveredRequiredArtifactCount:
          requiredFreshArtifactPaths.length - missingFreshnessCoverage.length,
        missingRequiredArtifactPaths: missingFreshnessCoverage,
        ready: evidenceFreshnessReady,
        blockers: evidenceFreshness?.blockers ?? [],
      },
      observedShadeBoundaryInventory: {
        artifactPresent: Boolean(observedBoundaryInventory),
        path: observedBoundaryInventoryPath,
        artifactVersion: observedBoundaryInventory?.artifactVersion ?? null,
        sectionId: observedBoundaryInventory?.sectionId ?? null,
        observedBoundaryMeasurementCount:
          observedBoundarySummary.observedBoundaryMeasurementCount ?? 0,
        independentObservationCount:
          observedBoundarySummary.independentObservationCount ?? 0,
        uniqueDateCount: observedBoundarySummary.uniqueDateCount ?? 0,
        solarAltitudeSpanDegrees:
          observedBoundarySummary.solarAltitudeSpanDegrees ?? 0,
        maximumLabelUncertaintyRows:
          observedBoundarySummary.maximumLabelUncertaintyRows ?? null,
        maximumTimestampUncertaintySeconds:
          observedBoundarySummary.maximumTimestampUncertaintySeconds ?? null,
        geometryPredictionCount: observedBoundarySummary.geometryPredictionCount ?? 0,
        scoredShadowHoldoutCount:
          observedBoundarySummary.scoredShadowHoldoutCount ?? 0,
        passingShadowHoldoutCount:
          observedBoundarySummary.passingShadowHoldoutCount ?? 0,
        observedMeasurementCorpusPassed:
          observedBoundarySummary.observedMeasurementCorpusPassed === true,
        independentObservationCountPassed:
          observedBoundaryGateResults.independentObservationCountPassed === true,
        uniqueDatesPassed: observedBoundaryGateResults.uniqueDatesPassed === true,
        solarAltitudeSpanPassed:
          observedBoundaryGateResults.solarAltitudeSpanPassed === true,
        labelUncertaintyPassed:
          observedBoundaryGateResults.labelUncertaintyPassed === true,
        timestampUncertaintyPassed:
          observedBoundaryGateResults.timestampUncertaintyPassed === true,
        evidenceSemantics:
          observedBoundaryInventory?.evidenceSemantics ?? null,
        publicationEligible:
          (observedBoundaryInventory?.publication as Record<string, unknown> | undefined)
            ?.eligible === true,
        blockers:
          (observedBoundaryInventory?.publication as Record<string, unknown> | undefined)
            ?.blockers ?? [],
      },
      semanticRowAdjudication: {
        artifactPresent: Boolean(semanticRowAdjudication),
        path: semanticRowAdjudicationPath,
        artifactKind: semanticRowAdjudication?.artifactKind ?? null,
        artifactVersion: semanticRowAdjudication?.artifactVersion ?? null,
        rowsReviewed: semanticRowAdjudicationSummary.rowsReviewed ?? 0,
        rowsRejected: semanticRowAdjudicationSummary.rowsRejected ?? 0,
        rowsSemanticTreadSupportedNotMeasured:
          semanticRowAdjudicationSummary.rowsSemanticTreadSupportedNotMeasured ?? 0,
        measuredRows: semanticRowAdjudicationSummary.measuredRows ?? 0,
        recentEpochsReviewed: semanticRowAdjudicationSummary.recentEpochsReviewed ?? 0,
        recentOpenRoofEpochs: semanticRowAdjudicationSummary.recentOpenRoofEpochs ?? 0,
        publicationEligible:
          (semanticRowAdjudication?.publication as Record<string, unknown> | undefined)
            ?.eligible === true,
        blockers:
          (semanticRowAdjudication?.publication as Record<string, unknown> | undefined)
            ?.blockers ?? [],
      },
      currentProviderVerticalHoldoutAudit: {
        artifactPresent: Boolean(currentProviderVerticalHoldout),
        path: currentProviderVerticalHoldoutPath,
        artifactKind: currentProviderVerticalHoldout?.artifactKind ?? null,
        artifactVersion: currentProviderVerticalHoldout?.artifactVersion ?? null,
        sectionId: currentProviderVerticalHoldout?.sectionId ?? null,
        trainingCameraToTreadOffsetFeet:
          currentProviderVerticalHoldoutTraining.selectedCameraToTreadOffsetFeet ?? null,
        trainingCameraToTreadOffsetSpreadFeet:
          currentProviderVerticalHoldoutTraining.cameraToTreadOffsetSpreadFeet ?? null,
        predeclaredHoldoutRows: currentProviderVerticalHoldoutSummary.holdoutRowCount ?? 0,
        passingPredeclaredHoldoutRows:
          currentProviderVerticalHoldoutSummary.passingHoldoutRows ?? 0,
        exploratoryRows: currentProviderVerticalHoldoutSummary.exploratoryRowCount ?? 0,
        passingExploratoryRows:
          currentProviderVerticalHoldoutSummary.passingExploratoryRows ?? 0,
        referenceVerticalAccuracy95Feet:
          currentProviderVerticalHoldoutSummary.referenceVerticalAccuracy95Feet ?? null,
        establishesCurrentProviderRelativeVerticalConsistency:
          currentProviderVerticalHoldoutBoundary
            .establishesCurrentProviderRelativeVerticalConsistency === true,
        establishesCurrentPhysicalRowPersistence:
          currentProviderVerticalHoldoutBoundary.establishesCurrentPhysicalRowPersistence === true,
        establishesSubFootHorizontalTransferToHoldoutRows:
          currentProviderVerticalHoldoutBoundary
            .establishesSubFootHorizontalTransferToHoldoutRows === true,
        establishesMeasuredHoldoutRows:
          currentProviderVerticalHoldoutBoundary.establishesMeasuredHoldoutRows === true,
        publicationEligible:
          (currentProviderVerticalHoldout?.publication as Record<string, unknown> | undefined)
            ?.eligible === true,
        blockers:
          (currentProviderVerticalHoldout?.publication as Record<string, unknown> | undefined)
            ?.blockers ?? [],
      },
      evidenceRegistry: {
        reviewedOn: evidence.reviewedOn,
        frameStage: evidence.stadiumFrame.stage,
        rowStage: evidence.rowGeometry.stage,
        rowMeasuredCoveragePercent: evidence.rowGeometry.measuredCoveragePercent,
        obstructionStage: evidence.obstructionGeometry.stage,
        obstructionMeasuredCoveragePercent:
          evidence.obstructionGeometry.measuredCoveragePercent,
        currencyStage: evidence.geometryCurrency.stage,
        holdoutStage: evidence.observationHoldout.stage,
        heldOutObservationCount: evidence.observationHoldout.heldOutObservationCount,
        uniqueDates: evidence.observationHoldout.uniqueDates,
        solarAltitudeSpanDeg: evidence.observationHoldout.solarAltitudeSpanDeg,
        medianBoundaryErrorRows: evidence.observationHoldout.medianBoundaryErrorRows,
        p95BoundaryErrorRows: evidence.observationHoldout.p95BoundaryErrorRows,
      },
      publicationEligible,
      blockers,
    };
  }));
  const stable = {
    releaseThresholds: SEAT_SHADE_RELEASE_THRESHOLDS,
    records,
  };
  const artifact = {
    schemaVersion: 2,
    artifactKind: 'mlb-exact-row-shade-publication-readiness',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    auditedOn: new Date().toISOString(),
    releaseThresholds: SEAT_SHADE_RELEASE_THRESHOLDS,
    summary: {
      stadiums: records.length,
      publicationEligible: records.filter((record) => record.publicationEligible).length,
      assignedRowProviderCoordinateArtifacts: records.filter((record) =>
        record.assignedRowProviderCoordinates.artifactPresent).length,
      providerRowMapArtifacts: records.filter((record) =>
        record.providerRowMapGeometry.artifactPresent).length,
      providerFieldControlArtifacts: records.filter((record) =>
        record.providerFieldControls.artifactPresent).length,
      providerFieldControlsPassingOneFootInternalCheck: records.filter((record) =>
        record.providerFieldControls.artifactPresent
        && record.providerFieldControls.establishesProviderMapScale
        && record.providerFieldControls.establishesProviderFieldAxis
        && record.providerFieldControls.regulationMoundCheckWithinOneFoot).length,
      providerWorldRegistrationCandidates: records.filter((record) =>
        record.providerWorldRegistrationCandidate.artifactPresent).length,
      providerWorldRegistrationCandidatesWithCompletePlanCoordinates: records.filter((record) =>
        record.providerWorldRegistrationCandidate.artifactPresent
        && record.providerWorldRegistrationCandidate.rowsWithProjectedCoordinates
          === record.providerWorldRegistrationCandidate.rowCount
        && record.providerWorldRegistrationCandidate.seatsWithProjectedCoordinates
          === record.providerWorldRegistrationCandidate.seatCount).length,
      providerWorldRegistrationCandidatesWithMeasuredElevations: records.filter((record) =>
        record.providerWorldRegistrationCandidate.artifactPresent
        && typeof record.providerWorldRegistrationCandidate.rowsWithMeasuredElevation === 'number'
        && record.providerWorldRegistrationCandidate.rowsWithMeasuredElevation > 0).length,
      providerWorldRegistrationCandidatesWithSubFootGroundOrthophotoFrames: records.filter(
        (record) => record.providerWorldRegistrationCandidate.artifactPresent
          && record.providerWorldRegistrationCandidate
            .establishesSubFootGroundOrthophotoFrame,
      ).length,
      currentObstructionCandidateArtifacts: records.filter((record) =>
        record.currentObstructionCandidate.artifactPresent).length,
      currentObstructionCandidatesWithOverhangUndersides: records.filter((record) =>
        record.currentObstructionCandidate.artifactPresent
        && record.currentObstructionCandidate.establishesOverhangUndersides).length,
      currentObstructionCandidatesWithCurrentChangeInventories: records.filter((record) =>
        record.currentObstructionCandidate.artifactPresent
        && record.currentObstructionCandidate.establishesCurrentChangeInventory).length,
      currentObstructionCandidatesWithCurrentCityFootprints: records.filter((record) =>
        record.currentObstructionCandidate.artifactPresent
        && record.currentObstructionCandidate.establishesCurrentCityFootprintCandidate).length,
      currentObstructionCandidatesWithCompleteAsBuiltGeometry: records.filter((record) =>
        record.currentObstructionCandidate.artifactPresent
        && record.currentObstructionCandidate.establishesCurrentAsBuiltGeometry
        && record.currentObstructionCandidate.establishesCompleteObstructionGeometry).length,
      currentObstructionCandidatesWithDatedOfficialGameVisualReviews: records.filter((record) =>
        record.currentObstructionCandidate.artifactPresent
        && record.currentObstructionCandidate.datedOfficialGameVisualReviewPresent).length,
      registrationRepeatabilityAudits: records.filter((record) =>
        record.registrationRepeatabilityAudit.artifactPresent).length,
      registrationRepeatabilityAuditsPassed: records.filter((record) =>
        record.registrationRepeatabilityAudit.artifactPresent
        && record.registrationRepeatabilityAudit.registrationRepeatabilityPassed).length,
      lidarRowSurfaceAudits: records.filter((record) =>
        record.lidarRowSurfaceAudit.artifactPresent).length,
      lidarRowSurfaceAuditsWithIndependentFlightlineRepeatability: records.filter((record) =>
        record.lidarRowSurfaceAudit.artifactPresent
        && record.lidarRowSurfaceAudit
          .establishesIndependentFlightlineRepeatabilityAtFixedPlanCoordinates).length,
      lidarRowSurfaceAuditsWithMeasuredRowElevations: records.filter((record) =>
        record.lidarRowSurfaceAudit.artifactPresent
        && record.lidarRowSurfaceAudit.establishesMeasuredRowElevations
        && typeof record.lidarRowSurfaceAudit.measuredRowElevationCount === 'number'
        && record.lidarRowSurfaceAudit.measuredRowElevationCount > 0).length,
      orthophotoRowReviewQueues: records.filter((record) =>
        record.orthophotoRowReviewQueue.artifactPresent).length,
      orthophotoRowReviewQueuesWithIndependentReviewedControls: records.filter((record) =>
        record.orthophotoRowReviewQueue.artifactPresent
        && record.orthophotoRowReviewQueue.establishesIndependentReviewedControls).length,
      orthophotoRowReviewQueuesWithExactRowRegistration: records.filter((record) =>
        record.orthophotoRowReviewQueue.artifactPresent
        && record.orthophotoRowReviewQueue.establishesExactRowRegistration).length,
      groundFrameRegistrationAudits: records.filter((record) =>
        record.groundFrameRegistrationAudit.artifactPresent).length,
      groundFrameRegistrationAuditsPassingNumericGates: records.filter((record) =>
        record.groundFrameRegistrationAudit.artifactPresent
        && record.groundFrameRegistrationAudit.numericRegistrationAccepted).length,
      groundFrameRegistrationAuditsAccepted: records.filter((record) =>
        record.groundFrameRegistrationAudit.artifactPresent
        && record.groundFrameRegistrationAudit.registrationAccepted).length,
      evidenceFreshnessAudits: records.filter((record) =>
        record.evidenceFreshnessAudit.artifactPresent).length,
      completePassingEvidenceFreshnessAudits: records.filter((record) =>
        record.evidenceFreshnessAudit.ready).length,
      observedShadeBoundaryInventories: records.filter((record) =>
        record.observedShadeBoundaryInventory.artifactPresent).length,
      observedBoundaryMeasurements: records.reduce((total, record) =>
        total + Number(record.observedShadeBoundaryInventory.observedBoundaryMeasurementCount),
      0),
      scoredShadowHoldoutObservations: records.reduce((total, record) =>
        total + Number(record.observedShadeBoundaryInventory.scoredShadowHoldoutCount),
      0),
      passingShadowHoldoutObservations: records.reduce((total, record) =>
        total + Number(record.observedShadeBoundaryInventory.passingShadowHoldoutCount),
      0),
      semanticRowAdjudicationArtifacts: records.filter((record) =>
        record.semanticRowAdjudication.artifactPresent).length,
      semanticRowsReviewed: records.reduce((total, record) =>
        total + Number(record.semanticRowAdjudication.rowsReviewed),
      0),
      semanticRowsRejected: records.reduce((total, record) =>
        total + Number(record.semanticRowAdjudication.rowsRejected),
      0),
      semanticRowsTreadSupportedNotMeasured: records.reduce((total, record) =>
        total + Number(record.semanticRowAdjudication.rowsSemanticTreadSupportedNotMeasured),
      0),
      semanticRowsMeasured: records.reduce((total, record) =>
        total + Number(record.semanticRowAdjudication.measuredRows),
      0),
      currentProviderVerticalHoldoutAudits: records.filter((record) =>
        record.currentProviderVerticalHoldoutAudit.artifactPresent).length,
      predeclaredVerticalHoldoutRows: records.reduce((total, record) =>
        total + Number(record.currentProviderVerticalHoldoutAudit.predeclaredHoldoutRows),
      0),
      passingPredeclaredVerticalHoldoutRows: records.reduce((total, record) =>
        total + Number(record.currentProviderVerticalHoldoutAudit
          .passingPredeclaredHoldoutRows),
      0),
      exploratoryVerticalDiagnosticRows: records.reduce((total, record) =>
        total + Number(record.currentProviderVerticalHoldoutAudit.exploratoryRows),
      0),
      passingExploratoryVerticalDiagnosticRows: records.reduce((total, record) =>
        total + Number(record.currentProviderVerticalHoldoutAudit.passingExploratoryRows),
      0),
      stadiumsWithAnyRowMapArtifact: records.filter((record) =>
        record.assignedRowProviderCoordinates.artifactPresent
        || record.providerRowMapGeometry.artifactPresent).length,
      completeProviderAssignedRowCoordinateScopes: records.filter((record) =>
        record.assignedRowProviderCoordinates.assignedSeatCoverageClaimAllowed
        && record.assignedRowProviderCoordinates.coveragePercent === 100
        && record.assignedRowProviderCoordinates.providerDirectCoveragePercent === 100).length,
      passedShadowHoldouts: records.filter((record) =>
        record.evidenceRegistry.holdoutStage === 'passed').length,
    },
    records,
  };
  const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
  if (outputArgument) {
    const output = resolve(outputArgument);
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, serialized);
    console.log(JSON.stringify({
      output,
      artifactVersion: artifact.artifactVersion,
      summary: artifact.summary,
    }, null, 2));
  } else {
    process.stdout.write(serialized);
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack : error);
  process.exitCode = 1;
});
