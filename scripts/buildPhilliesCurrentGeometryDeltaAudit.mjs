import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

function option(name, fallback) {
  const prefix = `--${name}=`;
  const value = process.argv.find((argument) => argument.startsWith(prefix));
  return resolve(value ? value.slice(prefix.length) : fallback);
}

const paths = {
  controls: option(
    'controls',
    'tmp/lidar/phillies-current-geometry-delta-controls-v1.json',
  ),
  permitIndex: option(
    'permit-index',
    'tmp/lidar/phillies-phila-permit-index-2024-current.json',
  ),
  cityBuildingFootprint: option(
    'city-building-footprint',
    'tmp/lidar/phillies-phila-current-building-footprint-2026.json',
  ),
  teamStoreManifest: option(
    'team-store-manifest',
    'tmp/lidar/phillies-2025-team-store-art-commission-submission.json',
  ),
  renderManifestA: option(
    'render-manifest-a',
    'tmp/lidar/phillies-2025-team-store-plan-review-05-12/manifest.json',
  ),
  renderManifestB: option(
    'render-manifest-b',
    'tmp/lidar/phillies-2025-team-store-plan-review-26-33/manifest.json',
  ),
  rowRegistration: option(
    'row-registration',
    'tmp/lidar/phillies-nested-3d-current-row-registration-v2.json',
  ),
  rowControl: option(
    'row-control',
    'tmp/lidar/phillies-arcgis-row-control.json',
  ),
  rowControlMetadataAudit: option(
    'row-control-metadata-audit',
    'tmp/lidar/phillies-arcgis-row-control-metadata-audit-2026.json',
  ),
  clubPageManifest: option(
    'club-page-manifest',
    'tmp/lidar/phillies-official-2026-enhancements.json',
  ),
  clubPageHtml: option(
    'club-page-html',
    'tmp/lidar/phillies-official-2026-enhancements.html',
  ),
  output: option(
    'output',
    'tmp/lidar/phillies-current-geometry-delta-audit-v1.json',
  ),
};

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

function requireNear(actual, expected, tolerance, label) {
  if (!Number.isFinite(actual) || Math.abs(actual - expected) > tolerance) {
    throw new Error(`${label}: expected ${expected} within ${tolerance}, received ${actual}`);
  }
}

const [
  controls,
  permitIndex,
  cityBuildingFootprint,
  teamStoreManifest,
  renderManifestA,
  renderManifestB,
  rowRegistration,
  rowControl,
  rowControlMetadataAudit,
  clubPageManifest,
  clubPageHtml,
] = await Promise.all([
  readJson(paths.controls),
  readJson(paths.permitIndex),
  readJson(paths.cityBuildingFootprint),
  readJson(paths.teamStoreManifest),
  readJson(paths.renderManifestA),
  readJson(paths.renderManifestB),
  readJson(paths.rowRegistration),
  readJson(paths.rowControl),
  readJson(paths.rowControlMetadataAudit),
  readJson(paths.clubPageManifest),
  readFile(paths.clubPageHtml, 'utf8'),
]);

requireEqual(controls.stadiumId, 'phillies', 'controls stadiumId');
requireEqual(
  cityBuildingFootprint.artifactVersion,
  controls.cityBuildingFootprintArtifactVersion,
  'current City building-footprint artifact',
);
requireEqual(
  cityBuildingFootprint.footprint.address,
  '1 CITIZENS BANK WAY',
  'current City building-footprint address',
);
requireEqual(
  teamStoreManifest.artifactVersion,
  controls.teamStoreDesign.sourceManifestArtifactVersion,
  'team-store acquisition manifest',
);
requireEqual(
  teamStoreManifest.sha256,
  controls.teamStoreDesign.sourcePdfSha256,
  'team-store source PDF SHA-256',
);
for (const [index, manifest] of [renderManifestA, renderManifestB].entries()) {
  requireEqual(
    manifest.artifactVersion,
    controls.teamStoreDesign.renderManifestArtifactVersions[index],
    `render manifest ${index + 1}`,
  );
  requireEqual(
    manifest.source.sha256,
    controls.teamStoreDesign.sourcePdfSha256,
    `render manifest ${index + 1} source SHA-256`,
  );
}
const renderedPages = new Set([
  ...renderManifestA.pages.map((page) => page.pageNumber),
  ...renderManifestB.pages.map((page) => page.pageNumber),
]);
for (const page of controls.teamStoreDesign.reviewedPages) {
  if (!renderedPages.has(page)) throw new Error(`Reviewed PDF page ${page} was not rendered`);
}

requireEqual(
  rowRegistration.artifactVersion,
  controls.rowRegistrationDiagnostic.artifactVersion,
  'current row-registration artifact',
);
requireEqual(
  rowControl.artifactVersion,
  controls.rowRegistrationDiagnostic.rowControlArtifactVersion,
  'public ArcGIS row-control artifact',
);
requireEqual(
  rowRegistration.sources.rowControlArtifactVersion,
  rowControl.artifactVersion,
  'row-registration source row-control artifact',
);
requireEqual(
  rowControlMetadataAudit.artifactVersion,
  controls.rowRegistrationDiagnostic.rowControlMetadataAuditArtifactVersion,
  'live row-control metadata audit',
);
requireEqual(
  rowControlMetadataAudit.itemMetadata.id,
  rowControl.source.itemId,
  'live metadata audit item ID',
);
requireEqual(
  rowControlMetadataAudit.itemMetadata.owner,
  rowControl.source.owner,
  'live metadata audit owner',
);
requireEqual(
  rowRegistration.finalHoldout.centroid.sampleCount,
  controls.rowRegistrationDiagnostic.expectedFinalHoldoutRows,
  'final centroid holdout sample count',
);
requireNear(
  rowRegistration.finalHoldout.centroid.p95ResidualMetres,
  controls.rowRegistrationDiagnostic.expectedCentroidP95Metres,
  1e-12,
  'final centroid p95 residual',
);
requireNear(
  rowRegistration.finalHoldout.endpointsDiagnosticOnly.p95ResidualMetres,
  controls.rowRegistrationDiagnostic.expectedEndpointP95Metres,
  1e-12,
  'final endpoint p95 residual',
);

const permitsByNumber = new Map(
  permitIndex.rows.map((record) => [record.permitnumber, record]),
);
for (const permitNumber of controls.requiredPermitNumbers) {
  if (!permitsByNumber.has(permitNumber)) {
    throw new Error(`Required official permit record is absent: ${permitNumber}`);
  }
}
requireEqual(permitIndex.summary.recordCount, 130, 'official permit record count');
requireEqual(permitIndex.summary.planReviewRecordCount, 19, 'plan-review permit count');

const expectedClubPageSha = clubPageManifest.sha256;
const actualClubPageSha = createHash('sha256').update(clubPageHtml).digest('hex');
requireEqual(actualClubPageSha, expectedClubPageSha, 'official club page SHA-256');
if (!clubPageHtml.includes('five 25-foot-tall LED towers')) {
  throw new Error('Official club page no longer contains the reviewed LED tower statement');
}
if (!clubPageHtml.includes('expanded footprint')) {
  throw new Error('Official club page no longer contains the reviewed team-store footprint statement');
}

const selectedPermitNumbers = controls.requiredPermitNumbers;
const selectedPermits = selectedPermitNumbers.map((permitNumber) => {
  const record = permitsByNumber.get(permitNumber);
  return {
    permitNumber,
    permitType: record.permittype,
    issuedOn: record.permitissuedate,
    status: record.status,
    completedOn: record.permitcompleteddate,
    scope: record.approvedscopeofwork,
  };
});
const feetPerMetre = 3.280839895013123;
const stable = {
  stadiumId: 'phillies',
  reviewedOn: controls.reviewedOn,
  sources: {
    permitIndexArtifactVersion: permitIndex.artifactVersion,
    cityBuildingFootprintArtifactVersion: cityBuildingFootprint.artifactVersion,
    teamStoreManifestArtifactVersion: teamStoreManifest.artifactVersion,
    teamStorePdfSha256: teamStoreManifest.sha256,
    renderManifestArtifactVersions: [
      renderManifestA.artifactVersion,
      renderManifestB.artifactVersion,
    ],
    clubPageArtifactVersion: clubPageManifest.artifactVersion,
    rowRegistrationArtifactVersion: rowRegistration.artifactVersion,
    rowControlArtifactVersion: rowControl.artifactVersion,
    rowControlMetadataAuditArtifactVersion: rowControlMetadataAudit.artifactVersion,
  },
  officialPermitInventory: {
    recordCount: permitIndex.summary.recordCount,
    planReviewRecordCount: permitIndex.summary.planReviewRecordCount,
    latestPermitIssuedOn: permitIndex.summary.latestPermitIssuedOn,
    selectedPermits,
  },
  currentCityBuildingFootprintCandidate: {
    artifactVersion: cityBuildingFootprint.artifactVersion,
    objectId: cityBuildingFootprint.footprint.objectId,
    coordinateReferenceSystem: cityBuildingFootprint.coordinateReferenceSystem,
    ringCount: cityBuildingFootprint.footprint.ringCount,
    vertexCount: cityBuildingFootprint.footprint.vertexCount,
    reportedSquareFt: cityBuildingFootprint.footprint.reportedSquareFt,
    baseElevationFt: cityBuildingFootprint.footprint.baseElevationFt,
    approximateHeightFt: cityBuildingFootprint.footprint.approximateHeightFt,
    maximumHeightFt: cityBuildingFootprint.footprint.maximumHeightFt,
    establishesCurrentCityFootprintCandidate:
      cityBuildingFootprint.geometryBoundary.establishesCurrentCityFootprintCandidate,
    featureLevelCurrencyReported:
      cityBuildingFootprint.accuracyEvidence.featureLevelLastEditDateReported,
    positionalAccuracyReported:
      cityBuildingFootprint.accuracyEvidence.positionalAccuracyReported,
    heightAccuracyReported:
      cityBuildingFootprint.accuracyEvidence.heightAccuracyReported,
    establishesCompleteShadowCastingGeometry: false,
  },
  currentGeometryDeltas: [
    {
      id: 'team-store-addition',
      state: 'design-package-located',
      designControl: controls.teamStoreDesign,
      currentCityFootprintCandidateAvailable: true,
      currentAsBuiltResolved: false,
      metricPositionResolved: false,
      shadowEnvelopeToTicketRowsResolved: false,
    },
    {
      id: 'five-team-store-led-towers',
      state: 'official-current-description-located',
      count: 5,
      describedHeightFt: 25,
      metricPositionResolved: false,
      completeShapeResolved: false,
      shadowEnvelopeToTicketRowsResolved: false,
    },
    {
      id: 'permanent-detached-tent',
      state: 'permit-scope-located-plan-unavailable',
      permitNumbers: ['CP-2026-001044', 'ZP-2026-002612', 'SP-2025-000192'],
      currentCompletionResolved: false,
      metricPositionResolved: false,
      completeShapeResolved: false,
    },
    {
      id: 'stadium-topping-slabs-and-drains',
      state: 'completed-permit-scope-located-plan-unavailable',
      permitNumbers: ['CP-2026-000219'],
      affectedLocationsResolved: false,
      currentSurfaceElevationsResolved: false,
    },
    {
      id: 'bullpen-and-dugout-renovations',
      state: 'completed-permit-scopes-located-plans-unavailable',
      permitNumbers: ['CP-2025-000429', 'CP-2025-000424'],
      currentMetricGeometryResolved: false,
      effectOnTicketRowShadeResolved: false,
    },
  ],
  rowRegistrationDiagnostic: {
    semanticRole: 'source-consistency-diagnostic-only',
    rowControlProvenance: {
      itemId: rowControl.source.itemId,
      owner: rowControl.source.owner,
      itemAccess: rowControl.source.itemAccess,
      itemListed: rowControl.source.itemListed,
      itemDescription: rowControl.source.itemDescription,
      layerCopyrightText: rowControl.source.layerCopyrightText,
      clubOrMunicipalAuthoritative:
        rowControlMetadataAudit.authorityAssessment
          .authoritativeClubOrMunicipalProvenanceEstablished,
      reportsPositionalAccuracy:
        rowControlMetadataAudit.authorityAssessment.positionalAccuracyReported,
    },
    controlVintage: 2019,
    providerArtifactVintage: '2026-05',
    finalHoldoutRows: rowRegistration.finalHoldout.centroid.sampleCount,
    centroidMedianResidualMetres:
      rowRegistration.finalHoldout.centroid.medianResidualMetres,
    centroidP95ResidualMetres:
      rowRegistration.finalHoldout.centroid.p95ResidualMetres,
    centroidP95ResidualFt:
      rowRegistration.finalHoldout.centroid.p95ResidualMetres * feetPerMetre,
    centroidWithinOneFootPercent:
      rowRegistration.finalHoldout.centroid.withinOneFootPercent,
    endpointP95ResidualMetres:
      rowRegistration.finalHoldout.endpointsDiagnosticOnly.p95ResidualMetres,
    establishesPhysicalMeasurement: false,
    passesOneFootHorizontalGate: false,
  },
  evidenceBoundary: {
    establishesCurrentChangeInventory: true,
    establishesCurrentCityFootprintCandidate: true,
    establishesCurrentAsBuiltGeometry: false,
    establishesCompleteRowGeometry: false,
    establishesCompleteObstructionGeometry: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'CURRENT_AS_BUILT_DELTAS_NOT_MEASURED',
      'CURRENT_ROW_SURFACE_GEOMETRY_NOT_COMPLETE',
      'CURRENT_OBSTRUCTION_GEOMETRY_NOT_COMPLETE',
      'ONE_FOOT_HORIZONTAL_ROW_GATE_NOT_PASSED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'phillies-current-geometry-delta-audit',
  artifactVersion: `sha256:${createHash('sha256')
    .update(JSON.stringify(stable))
    .digest('hex')}`,
  ...stable,
};

await mkdir(dirname(paths.output), { recursive: true });
await writeFile(paths.output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  output: paths.output,
  artifactVersion: artifact.artifactVersion,
  deltaCount: artifact.currentGeometryDeltas.length,
  publication: artifact.publication,
}, null, 2));
