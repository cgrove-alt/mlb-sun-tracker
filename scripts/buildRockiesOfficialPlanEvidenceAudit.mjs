#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function argument(name, fallback) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

async function sourceFile(relativePath, kind) {
  const absolutePath = path.resolve(relativePath);
  const bytes = await readFile(absolutePath);
  return {
    relativePath,
    kind,
    byteLength: bytes.length,
    sha256: sha256(bytes),
    bytes,
  };
}

async function jsonSource(relativePath, kind) {
  const source = await sourceFile(relativePath, kind);
  return {
    ...source,
    json: JSON.parse(source.bytes.toString('utf8')),
  };
}

function publicSource(source, extra = {}) {
  return {
    relativePath: source.relativePath,
    kind: source.kind,
    byteLength: source.byteLength,
    sha256: source.sha256,
    ...extra,
  };
}

function checksumLockedInput(source) {
  const input = {
    path: source.relativePath,
    sha256: source.sha256,
    kind: source.kind,
  };
  if (typeof source.json?.artifactVersion === 'string') {
    input.artifactVersion = source.json.artifactVersion;
  }
  return input;
}

const outputPath = path.resolve(argument(
  'output',
  'tmp/lidar/rockies-official-plan-evidence-audit-2026.json',
));

const permitIndex = await jsonSource(
  'tmp/lidar/rockies-denver-epermits-global-2013-coors-field-record-index-2026.json',
  'official-denver-permit-index',
);
const permitDetail = await jsonSource(
  'tmp/lidar/rockies-denver-epermits-record-detail-2013-log-m000304.json',
  'official-denver-permit-detail',
);
const denverPermitGeometryAudit = await jsonSource(
  'tmp/lidar/rockies-denver-permit-geometry-evidence-audit-2026.json',
  'official-denver-exact-address-permit-geometry-audit',
);
const propertyRecord = await jsonSource(
  'tmp/lidar/rockies-denver-property-record-0227916044000-2026.json',
  'official-denver-assessor-record',
);
const ownerMinutes = await sourceFile(
  'tmp/lidar/rockies-dmmlbsd-minutes-2013-06-17.pdf',
  'official-stadium-owner-board-minutes',
);
const ownerMinutesOcr = await jsonSource(
  'tmp/lidar/rockies-dmmlbsd-minutes-2013-06-17-ocr.json',
  'ocr-cross-check',
);
const ownerArchiveIndex = await jsonSource(
  'tmp/lidar/rockies-dmmlbsd-archive-document-index-2026.json',
  'archived-official-owner-document-index',
);
const ownerDocumentReview = await jsonSource(
  'tmp/lidar/rockies-owner-document-geometry-review-2026.json',
  'official-owner-document-geometry-review',
);
const assessorMap = await sourceFile(
  'tmp/lidar/rockies-denver-assessor-map-02279-2026.pdf',
  'official-denver-assessor-map',
);
const aiscArticle = await sourceFile(
  'tmp/lidar/coors-field-aisc-modern-steel-april-1998.pdf',
  'primary-project-team-technical-article',
);
const rowRegistration = await jsonSource(
  'tmp/lidar/rockies-ticketmaster-drcog-row-registration-candidate-2026.json',
  'registered-provider-row-candidate',
);
const canopyLayers = await jsonSource(
  'tmp/lidar/rockies-lidar-canopy-layer-evidence-2026.json',
  'official-usgs-lidar-layer-analysis',
);
const section207RailHeights = await jsonSource(
  'tmp/lidar/rockies-current-official-section-207-complete-relative-rail-heights-v1.json',
  'current-official-panorama-relative-height-control',
);
const shadeStructureChangeAudit = await jsonSource(
  'tmp/lidar/rockies-2019-shade-structure-change-audit-2026.json',
  'official-imagery-and-lidar-shade-structure-change-audit',
);
const shadeStructureSeatShadowReachAudit = await jsonSource(
  'tmp/lidar/rockies-2019-shade-structure-seat-shadow-reach-2026.json',
  'diagnostic-shade-structure-seat-shadow-reach-audit',
);

const permitRecord = permitIndex.json.records.find(
  (record) => record.recordNumber === '2013-LOG-M000304',
);
const normalizedPermitEvidence = [
  permitDetail.json.attachmentBodyText,
  JSON.stringify(permitDetail.json.attachmentInventory?.rows ?? []),
].join('\n').replace(/\s+/g, ' ').trim();
requireCondition(permitRecord, 'Permit index lacks 2013-LOG-M000304');
requireCondition(
  permitRecord.projectName === '2013M00304 - 2001 Blake St - Coors Field 2013 improvements - 301-310 project',
  'Permit project name changed or was not parsed exactly',
);
requireCondition(
  permitRecord.status === 'Closed - Approved',
  'Permit 2013-LOG-M000304 is not recorded as closed and approved',
);
requireCondition(
  normalizedPermitEvidence.includes('Collected & sent Assessor plans. 10/2/13 dcm'),
  'Permit detail lacks the assessor-plan intake note',
);
requireCondition(
  permitDetail.json.attachmentTab?.clicked === false,
  'Public permit detail unexpectedly reports an opened attachment tab',
);
requireCondition(
  denverPermitGeometryAudit.json.analysisVersion === 'rockies-denver-permit-geometry-evidence-audit-v5',
  'Denver permit geometry audit version changed',
);
requireCondition(
  denverPermitGeometryAudit.json.queryCoverage?.canonicalRecordCount === 981,
  'Denver exact-address canonical record count changed',
);
requireCondition(
  denverPermitGeometryAudit.json.queryCoverage?.priorityGeometryRecordCount === 17,
  'Denver priority geometry record count changed',
);
requireCondition(
  denverPermitGeometryAudit.json.strongestRecoveredPermitFacts?.electronicShadeStructurePlansRecorded === true,
  'Denver permit audit lost the 2019 electronic shade-structure plan evidence',
);
requireCondition(
  denverPermitGeometryAudit.json.strongestRecoveredPermitFacts
    ?.shadeStructureFinaledConstructionPermitPublicDocumentStatusHtmlEmpty === true,
  'Denver permit audit lost the finaled shade-structure permit document-status result',
);
requireCondition(
  JSON.stringify(
    denverPermitGeometryAudit.json.strongestRecoveredPermitFacts?.shadeStructureNamedLocations,
  ) === JSON.stringify(['Entrance B', 'Picnic area']),
  'Denver permit audit lost the official SUDP shade-structure locations',
);
requireCondition(
  denverPermitGeometryAudit.json.releaseGate?.recoveredPermitDrawingFileCount === 0,
  'Denver permit audit reports drawing files that have not been reviewed here',
);
requireCondition(
  shadeStructureChangeAudit.json.artifactKind === 'rockies-2019-shade-structure-change-audit',
  'Shade-structure change audit kind changed',
);
requireCondition(
  shadeStructureChangeAudit.json.changeValidation?.allCandidatesPassPresenceChangeGates === true,
  'Shade-structure change audit lost its presence-change result',
);
requireCondition(
  shadeStructureChangeAudit.json.candidates?.length === 2,
  'Shade-structure change candidate count changed',
);
requireCondition(
  shadeStructureChangeAudit.json.candidates.every(
    (candidate) => candidate.geometryBoundary?.establishesOverhangUnderside === false
      && candidate.geometryBoundary?.establishesSubFootAbsoluteHorizontalAccuracy === false,
  ),
  'Shade-structure candidates now overclaim release geometry',
);
requireCondition(
  shadeStructureSeatShadowReachAudit.json.artifactKind
    === 'rockies-shade-structure-seat-shadow-reach-audit',
  'Shade-structure seat shadow-reach audit kind changed',
);
requireCondition(
  shadeStructureSeatShadowReachAudit.json.analysisVersion
    === 'rockies-2019-shade-structure-seat-shadow-reach-v2',
  'Shade-structure seat shadow-reach audit is not the conservative v2 result',
);
requireCondition(
  JSON.stringify(shadeStructureSeatShadowReachAudit.json.interpretation?.excludedCandidateIds)
    === JSON.stringify(['GATE_B_SHADE_STRUCTURE'])
    && JSON.stringify(shadeStructureSeatShadowReachAudit.json.interpretation?.inconclusiveCandidateIds)
      === JSON.stringify(['COORS_OUTFIELD_PICNIC_NEW_SHELTER']),
  'Shade-structure diagnostic shadow decisions changed',
);
requireCondition(
  shadeStructureSeatShadowReachAudit.json.publication?.eligibleForExactRowShade === false,
  'Shade-structure seat shadow-reach audit overclaims publication eligibility',
);

requireCondition(
  propertyRecord.json.scheduleNumber === '0227916044000',
  'Assessor record schedule number changed',
);
requireCondition(
  propertyRecord.json.recordPayload?.parcel?.header?.PARID === '0227916044000',
  'Assessor payload does not identify the Coors Field master parcel',
);
requireCondition(
  propertyRecord.json.recordPayload?.parcel?.sections?.[0]?.[0]?.[0]?.LUC === '393 - STADIUM',
  'Assessor payload no longer classifies the master parcel as a stadium',
);

const ocrText = ownerMinutesOcr.json.documents.map((document) => document.text).join('\n');
for (const requiredText of [
  'A new concept for the renovation of Sections 301 to 310 of the ballpark was presented by',
  'approximately 3,000 permanent seats would be removed',
  'two tiers of restaurant/bars',
  'RESOLUTION 7-13',
  'planned renovation of Sections 301 to 310 of Coors Field',
]) {
  requireCondition(ocrText.includes(requiredText), `Owner-minute OCR lacks: ${requiredText}`);
}
requireCondition(
  ownerArchiveIndex.json.recordCount >= 697,
  'Owner archive index lost previously recovered official-site URLs',
);
requireCondition(
  ownerArchiveIndex.json.potentialDocumentCount >= 180,
  'Owner archive index lost previously recovered potential documents',
);
requireCondition(
  ownerArchiveIndex.json.geometryPlanFilenameMatchCount === 0,
  'Owner archive now contains a filename that may identify a geometry plan and requires review',
);
requireCondition(
  ownerDocumentReview.json.visualReview?.reviewedPageCount === 278,
  'Owner-document visual review page count changed',
);
requireCondition(
  ownerDocumentReview.json.geometryRecovery?.usefulGeometryForExactRowShadeRecovered === false,
  'Owner-document review reports geometry that has not been integrated',
);

requireCondition(rowRegistration.json.coverage?.rowCount === 3059, 'Registered Coors row count changed');
requireCondition(rowRegistration.json.coverage?.seatCount === 46014, 'Registered Coors seat count changed');
requireCondition(
  rowRegistration.json.coverage?.rowsWithMeasuredElevation === 0,
  'Row registration unexpectedly claims measured elevations',
);
requireCondition(
  canopyLayers.json.interpretation?.undersideSurfaceEstablished === false,
  'LiDAR analysis unexpectedly claims an underside surface',
);
requireCondition(
  canopyLayers.json.interpretation?.watertightObstructionVolumeEstablished === false,
  'LiDAR analysis unexpectedly claims a watertight obstruction volume',
);
requireCondition(
  section207RailHeights.json.summary?.measuredRowCount === 17,
  'Section 207 relative rail-height row count changed',
);

const stable = {
  stadiumId: 'rockies',
  auditScope: 'official-public-plan-and-geometry-evidence',
  inputs: {
    sources: [
      permitIndex,
      permitDetail,
      denverPermitGeometryAudit,
      propertyRecord,
      ownerMinutes,
      ownerMinutesOcr,
      ownerArchiveIndex,
      ownerDocumentReview,
      assessorMap,
      aiscArticle,
      rowRegistration,
      canopyLayers,
      section207RailHeights,
      shadeStructureChangeAudit,
      shadeStructureSeatShadowReachAudit,
    ].map(checksumLockedInput),
  },
  sources: [
    publicSource(permitIndex, { artifactVersion: permitIndex.json.artifactVersion }),
    publicSource(permitDetail, { artifactVersion: permitDetail.json.artifactVersion }),
    publicSource(denverPermitGeometryAudit, { artifactVersion: denverPermitGeometryAudit.json.artifactVersion }),
    publicSource(propertyRecord, {
      artifactVersion: propertyRecord.json.artifactVersion,
      recordDataUpdatedOn: '2026-08-10',
    }),
    publicSource(ownerMinutes, {
      publisher: 'Denver Metropolitan Major League Baseball Stadium District',
      meetingDate: '2013-06-17',
      originalSourceUrl: 'http://dmmlbsd.com/wp-content/uploads/2015/01/Minutes_6_17_13_baseball.pdf',
      archivedRetrievalUrl: 'https://web.archive.org/web/20221128084722id_/https://dmmlbsd.com/wp-content/uploads/2015/01/Minutes_6_17_13_baseball.pdf',
    }),
    publicSource(ownerMinutesOcr, { analysisVersion: ownerMinutesOcr.json.analysisVersion }),
    publicSource(ownerArchiveIndex, { artifactVersion: ownerArchiveIndex.json.artifactVersion }),
    publicSource(ownerDocumentReview, { artifactVersion: ownerDocumentReview.json.artifactVersion }),
    publicSource(assessorMap, {
      sourceUrl: 'https://www.denvergov.org/media/gis/WebDocs/Assessment/AssessorMaps/asmt_02279.pdf',
      mapUpdatedOn: '2026-03-31',
      mapScale: '1:1200',
    }),
    publicSource(aiscArticle, {
      sourceUrl: 'https://cloud.aisc.org/msc/archive/1998/1998v04.pdf',
      publisher: 'American Institute of Steel Construction',
    }),
    publicSource(rowRegistration, { artifactVersion: rowRegistration.json.artifactVersion }),
    publicSource(canopyLayers, { artifactVersion: canopyLayers.json.artifactVersion }),
    publicSource(section207RailHeights, { artifactVersion: section207RailHeights.json.artifactVersion }),
    publicSource(shadeStructureChangeAudit, { artifactVersion: shadeStructureChangeAudit.json.artifactVersion }),
    publicSource(shadeStructureSeatShadowReachAudit, {
      artifactVersion: shadeStructureSeatShadowReachAudit.json.artifactVersion,
    }),
  ],
  verifiedProjectLineage: {
    owner: 'Denver Metropolitan Major League Baseball Stadium District',
    architectFor2013Concept: 'Populous',
    approvedProjectArea: 'Sections 301 through 310',
    ownerApproval: 'Resolution 7-13 on 2013-06-17',
    denverPermitRecordNumber: '2013-LOG-M000304',
    denverPermitStatus: 'Closed - Approved',
    assessorPlanIntakeNotePresent: true,
    stadiumMasterParcelScheduleNumber: '0227916044000',
  },
  reviewedPlanFacts: {
    sourcePage: 3,
    resolutionPage: 4,
    approximatelyPermanentSeatsRemoved: 3000,
    replacementTypes: [
      'movable seating',
      'standing room areas',
      'gathering areas for viewing the game',
    ],
    restaurantBarTierCount: 2,
    planWasPresentedToOwnerBoard: true,
    planWasIncludedInRecoveredMinutesPdf: false,
    visualReviewCompleted: true,
    macosVisionOcrCrossCheckCompleted: true,
  },
  publicGeometryFindings: {
    registeredProviderRows: 3059,
    registeredProviderSeats: 46014,
    measuredRowElevations: 0,
    section207RelativeRailHeightRows: 17,
    section207AbsoluteSeatElevationDatumEstablished: false,
    lidarUndersideSurfaceEstablished: false,
    lidarWatertightObstructionVolumeEstablished: false,
    assessorMapContainsStadiumParcelBoundary: true,
    assessorMapContainsSeatingBowlOrRoofGeometry: false,
    assessorRecordContainsBuildingSketchOrPlan: false,
    permitDetailContainsPublicAttachmentControl: false,
    archivedOwnerSiteDistinctCapturedUrlsReviewed: ownerArchiveIndex.json.recordCount,
    archivedOwnerSitePotentialDocumentsIndexed: ownerArchiveIndex.json.potentialDocumentCount,
    archivedOwnerSiteGeometryPlanFilenameMatches: ownerArchiveIndex.json.geometryPlanFilenameMatchCount,
    archivedOwnerDocumentPagesVisuallyReviewed: ownerDocumentReview.json.visualReview.reviewedPageCount,
    archivedOwnerDocumentsContainUsefulShadeGeometry: false,
    denverExactAddressPermitRecordCount: denverPermitGeometryAudit.json.queryCoverage.canonicalRecordCount,
    denverPriorityGeometryPermitRecordCount: denverPermitGeometryAudit.json.queryCoverage.priorityGeometryRecordCount,
    denverPriorityPermitDrawingFilesRecovered: denverPermitGeometryAudit.json.releaseGate.recoveredPermitDrawingFileCount,
    denverElectronicShadeStructurePlansKnownToExist: true,
    shadeStructureCurrentElevatedFootprintCandidateCount: shadeStructureChangeAudit.json.candidates.length,
    shadeStructurePresenceChangeGatesPassed: true,
    shadeStructureExactPermitPlanMatchEstablished: false,
    shadeStructureOverhangUndersidesEstablished: false,
    shadeStructureDiagnosticShadowExcludedCandidateIds:
      shadeStructureSeatShadowReachAudit.json.interpretation.excludedCandidateIds,
    shadeStructureDiagnosticShadowInconclusiveCandidateIds:
      shadeStructureSeatShadowReachAudit.json.interpretation.inconclusiveCandidateIds,
    shadeStructureAllCandidatesPassDoubleEnvelopeShadowSensitivity: false,
  },
  geometryDocumentsKnownToExistButNotPubliclyRecovered: [
    {
      description: 'Electronic plan set for the 2019 Coors Field new shade structures project',
      evidence: 'Official Denver record 2019-LOG-0000784 records Electronic Plans: Yes',
    },
    {
      description: 'Field Club seating plans and modified drawings',
      evidence: 'Official Denver records 2000-LOG-M000243 and 2001-LOG-X000131',
    },
    {
      description: 'Populous concept plans presented for the Sections 301 through 310 renovation',
      evidence: 'Official owner minutes, pages 3 and 4, Resolution 7-13',
    },
    {
      description: 'Assessor plans collected for Denver building log 2013M00304',
      evidence: 'Official Denver permit intake note dated 2013-10-02',
    },
    {
      description: 'Approved construction drawings and resubmittals for 2013M00304',
      evidence: 'Official Denver permit record with listed discipline resubmittal dates',
    },
  ],
  releaseGate: {
    publicationReady: false,
    exactRowShadeClaimAllowed: false,
    publicationEligibleMeasuredGeometryCoveragePercent: 0,
    blockers: [
      'APPROVED_PLAN_SET_NOT_PUBLICLY_ACQUIRED',
      'SEVENTEEN_PRIORITY_PERMIT_PLAN_SETS_NOT_PUBLICLY_ACQUIRED',
      'ROW_ELEVATIONS_NOT_MEASURED',
      'RAIL_TO_SEAT_AND_TREAD_OFFSETS_NOT_MEASURED',
      'CURRENT_OVERHANG_UNDERSIDES_NOT_MEASURED',
      'SHADE_STRUCTURE_FOOTPRINT_CANDIDATES_NOT_RELEASE_GRADE_AS_BUILT_GEOMETRY',
      'PICNIC_SHADE_STRUCTURE_SHADOW_REACH_REMAINS_INCONCLUSIVE',
      'WATERTIGHT_OBSTRUCTION_VOLUMES_NOT_ESTABLISHED',
      'THIRTY_INDEPENDENT_TIMESTAMPED_SHADOW_HOLDOUTS_NOT_PASSED',
    ],
  },
  nextEvidenceAction: {
    action: 'Acquire the 17 priority Denver permit plan sets, using the localized 2019 shade footprints to register any recovered site plan. Retain the Picnic area shelter in the obstruction inventory until its shadow reach is resolved. Prioritize the 2000/2001 Field Club seating sets, Populous concept set, assessor plans, current overhang undersides, and measured row elevations.',
    requiresExternalCommunication: true,
    externalCommunicationPerformed: false,
    reasonNotPerformed: 'The user authorized public web acquisition, not submission of a records request or communication with an external party.',
  },
};

const artifact = {
  schemaVersion: 1,
  analysisVersion: 'rockies-official-plan-evidence-audit-v4',
  artifactStage: 'official-source-geometry-gap-audit',
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  createdOn: new Date().toISOString(),
  ...stable,
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  sourceCount: artifact.sources.length,
  publicationReady: artifact.releaseGate.publicationReady,
  nextEvidenceAction: artifact.nextEvidenceAction,
}, null, 2)}\n`);
