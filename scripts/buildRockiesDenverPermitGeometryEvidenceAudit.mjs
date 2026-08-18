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

function normalizeText(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ');
}

async function jsonSource(relativePath, kind) {
  const bytes = await readFile(path.resolve(relativePath));
  return {
    relativePath,
    kind,
    byteLength: bytes.length,
    sha256: sha256(bytes),
    json: JSON.parse(bytes.toString('utf8')),
  };
}

function publicSource(source) {
  return {
    relativePath: source.relativePath,
    kind: source.kind,
    byteLength: source.byteLength,
    sha256: source.sha256,
    artifactVersion: source.json.artifactVersion,
  };
}

function applicationInformationText(detail) {
  return normalizeText((detail.detailInventory?.rows ?? [])
    .filter((row) => row.some((cell) => normalizeText(cell).includes('Application Information')))
    .flat()
    .join(' '));
}

function capture(text, expression, transform = (value) => value) {
  const match = text.match(expression);
  return match ? transform(normalizeText(match[1])) : null;
}

function detailFacts(detail) {
  const applicationText = applicationInformationText(detail);
  return {
    typeOfBidLog: capture(applicationText, /Type of BID Log:\s*(.*?)(?=\s(?:Log Number:|Tenant Name:|Comments:|Date Review Due:|Are you|Intake Comments:|PROJECT SCOPE|$))/i),
    logNumber: capture(applicationText, /Log Number:\s*([^ ]+)/i),
    tenantName: capture(applicationText, /Tenant Name:\s*(.*?)(?=\s(?:Date Review Due:|Are you|Intake Comments:|PROJECT SCOPE|$))/i),
    dateReviewDue: capture(applicationText, /Date Review Due:\s*([0-9/]+)/i),
    intakeComments: capture(applicationText, /Intake Comments:\s*(.*?)(?=\s(?:Are you|Is your|Is this|PROJECT SCOPE|VALUATION DETAILS|PLAN FILE METHOD INFO|PARKING|$))/i),
    constructionValuation: capture(applicationText, /Construction Valuation Total:\s*([0-9.]+)/i, Number),
    electronicPlans: capture(applicationText, /Electronic Plans:\s*(Yes|No)/i),
    previousUse: capture(applicationText, /Previous use:\s*(.*?)(?=\sProposed use:|$)/i),
    proposedUse: capture(applicationText, /Proposed use:\s*(.*?)(?=\sBusiness name:|$)/i),
    businessName: capture(applicationText, /Business name:\s*(.*?)(?=\sZone lot size|$)/i),
    heightFeet: capture(applicationText, /Height \(ft\.\):\s*([0-9.]+)/i, Number),
    stories: capture(applicationText, /Stories:\s*([0-9.]+)/i, Number),
    otherSiteImprovementDescription: capture(applicationText, /Other Description:\s*(.*?)(?=\s(?:VALUATION DETAILS|PROJECT SCOPE|$))/i),
    applicationInformationTextSha256: sha256(applicationText),
  };
}

const outputPath = path.resolve(argument(
  'output',
  'tmp/lidar/rockies-denver-permit-geometry-evidence-audit-2026.json',
));

const partitionSpecs = [
  {
    path: 'tmp/lidar/rockies-denver-epermits-advanced-2001-blake-1990-1999-complete-record-index-2026.json',
    startDate: '01/01/1990',
    endDate: '12/31/1999',
  },
  {
    path: 'tmp/lidar/rockies-denver-epermits-advanced-2001-blake-2000-2009-complete-record-index-2026.json',
    startDate: '01/01/2000',
    endDate: '12/31/2009',
  },
  {
    path: 'tmp/lidar/rockies-denver-epermits-advanced-2001-blake-2010-2019-complete-record-index-2026.json',
    startDate: '01/01/2010',
    endDate: '12/31/2019',
  },
  {
    path: 'tmp/lidar/rockies-denver-epermits-advanced-2001-blake-2020-2026-complete-record-index-2026.json',
    startDate: '01/01/2020',
    endDate: '08/11/2026',
  },
];

const prioritySpecs = [
  {
    recordNumber: '1997-LOG-X000992',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-1997-log-x000992.json',
    geometryReason: 'party suite addition',
  },
  {
    recordNumber: '1999-LOG-X000104',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-1999-log-x000104.json',
    geometryReason: 'new picnic area',
  },
  {
    recordNumber: '2000-LOG-M000243',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2000-log-m000243.json',
    geometryReason: 'Field Club seating construction',
  },
  {
    recordNumber: '2001-LOG-X000131',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2001-log-x000131.json',
    geometryReason: 'modified Field Club seating drawings',
  },
  {
    recordNumber: '2007-LOG-X000116',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2007-log-x000116.json',
    geometryReason: 'permanent picnic shelter',
  },
  {
    recordNumber: '2011-LOG-W003401',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2011-log-w003401.json',
    geometryReason: 'press box window replacement',
  },
  {
    recordNumber: '2011-LOG-X001289',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2011-log-x001289.json',
    geometryReason: 'Section 203 interior expansion',
  },
  {
    recordNumber: '2012-LOG-W003929',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2012-log-w003929.json',
    geometryReason: 'Sections 125, 130, and 144 work',
  },
  {
    recordNumber: '2013-LOG-M000229',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2013-log-m000229-v2.json',
    geometryReason: 'center-field grandstand removal',
  },
  {
    recordNumber: '2013-LOG-M000234',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2013-log-m000234-v2.json',
    geometryReason: '2013 phased enclosure package',
  },
  {
    recordNumber: '2013-LOG-M000304',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2013-log-m000304-v2.json',
    geometryReason: 'Sections 301 through 310 renovation',
  },
  {
    recordNumber: '2016-LOG-0002734',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2016-log-0002734-v2.json',
    geometryReason: 'playground canopy',
  },
  {
    recordNumber: '2017-LOG-0004111',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2017-log-0004111-v2.json',
    geometryReason: 'scoreboard and landlord improvements',
  },
  {
    recordNumber: '2018-LOG-0005448',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2018-log-0005448-v2.json',
    geometryReason: 'club-level renovation',
  },
  {
    recordNumber: '2019-LOG-0000784',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2019-log-0000784-v3.json',
    geometryReason: 'new shade structures',
  },
  {
    recordNumber: '2022-LOG-0008002',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2022-log-0008002-v2.json',
    geometryReason: 'suite-level renovation',
  },
  {
    recordNumber: '2022-LOG-0015897',
    detailPath: 'tmp/lidar/rockies-denver-epermits-record-detail-2022-log-0015897-v2.json',
    geometryReason: 'covered entry structure',
  },
];

const partitions = await Promise.all(partitionSpecs.map(async (spec) => ({
  spec,
  source: await jsonSource(spec.path, 'official-denver-exact-address-permit-index'),
})));
const details = await Promise.all(prioritySpecs.map(async (spec) => ({
  spec,
  source: await jsonSource(spec.detailPath, 'official-denver-priority-permit-detail'),
})));
const shadeStructureConstructionPermit = await jsonSource(
  'tmp/lidar/rockies-denver-epermits-record-detail-2019-commcon-0000537-v4.json',
  'official-denver-related-construction-permit-detail',
);
const shadeStructureSudpPermit = await jsonSource(
  'tmp/lidar/rockies-denver-epermits-record-detail-2019-sudp-0000843-v4.json',
  'official-denver-related-sewer-use-and-drainage-permit-detail',
);
const shadeStructureChangeAudit = await jsonSource(
  'tmp/lidar/rockies-2019-shade-structure-change-audit-2026.json',
  'official-imagery-and-lidar-shade-structure-change-audit',
);
const shadeStructureSeatShadowReachAudit = await jsonSource(
  'tmp/lidar/rockies-2019-shade-structure-seat-shadow-reach-2026.json',
  'diagnostic-shade-structure-seat-shadow-reach-audit',
);

const canonicalRecords = new Map();
let duplicateRecordRowCount = 0;
let sourceRecordRowCount = 0;
for (const { spec, source } of partitions) {
  const artifact = source.json;
  requireCondition(
    artifact.analysisVersion === 'denver-epermits-public-advanced-record-index-v6',
    `${spec.path} is not a v6 fail-closed index`,
  );
  requireCondition(artifact.searchOutcome === 'result-grid', `${spec.path} did not return a result grid`);
  requireCondition(artifact.filters?.streetNumberFrom === '2001', `${spec.path} changed street-number-from`);
  requireCondition(artifact.filters?.streetNumberTo === '2001', `${spec.path} changed street-number-to`);
  requireCondition(artifact.filters?.streetName === 'Blake', `${spec.path} changed street name`);
  requireCondition(artifact.filters?.startDate === spec.startDate, `${spec.path} changed start date`);
  requireCondition(artifact.filters?.endDate === spec.endDate, `${spec.path} changed end date`);
  requireCondition(artifact.pages.length > 0 && artifact.pages.length <= 100, `${spec.path} has invalid pagination`);
  duplicateRecordRowCount += artifact.duplicateRecordRowCount;
  sourceRecordRowCount += artifact.recordCount + artifact.duplicateRecordRowCount;
  for (const record of artifact.records) {
    requireCondition(!canonicalRecords.has(record.recordNumber), `Record crosses date partitions: ${record.recordNumber}`);
    canonicalRecords.set(record.recordNumber, record);
  }
}

requireCondition(canonicalRecords.size === 981, `Exact-address canonical record count changed: ${canonicalRecords.size}`);
requireCondition(sourceRecordRowCount === 985, `Exact-address source row count changed: ${sourceRecordRowCount}`);
requireCondition(duplicateRecordRowCount === 4, `Exact-address duplicate row count changed: ${duplicateRecordRowCount}`);

const priorityRecords = [];
for (const { spec, source } of details) {
  const detail = source.json;
  const indexRecord = canonicalRecords.get(spec.recordNumber);
  requireCondition(indexRecord, `Priority record is absent from exact-address corpus: ${spec.recordNumber}`);
  requireCondition(
    ['denver-epermits-public-record-detail-v2', 'denver-epermits-public-record-detail-v3']
      .includes(detail.analysisVersion),
    `${spec.recordNumber} detail is not v2 or v3`,
  );
  requireCondition(detail.recordNumber === spec.recordNumber, `${spec.recordNumber} detail record mismatch`);
  requireCondition(detail.detailUrl === indexRecord.directDetailUrl, `${spec.recordNumber} direct URL mismatch`);
  requireCondition(detail.detailBodyText.includes(spec.recordNumber), `${spec.recordNumber} is absent from detail body`);
  requireCondition(detail.attachmentTab?.clicked === false, `${spec.recordNumber} unexpectedly opened an attachment tab`);
  priorityRecords.push({
    recordNumber: spec.recordNumber,
    recordDate: indexRecord.date,
    recordType: indexRecord.recordType,
    projectName: indexRecord.projectName,
    address: indexRecord.address,
    status: indexRecord.status,
    geometryReason: spec.geometryReason,
    directDetailUrl: indexRecord.directDetailUrl,
    detailArtifactPath: source.relativePath,
    detailArtifactSha256: source.sha256,
    detailArtifactVersion: detail.artifactVersion,
    facts: detailFacts(detail),
    publicAttachmentTabExposed: false,
    publicDocumentStatusCharacterCount:
      detail.publicPageMethods?.loadDocStatuses?.characterCount ?? null,
    publicRelatedRecordNumbers: normalizeText(
      detail.publicPageMethods?.getBuildCapTree?.html ?? '',
    ).match(/\b\d{4}-[A-Z]+-[A-Z0-9]+\b/g) ?? [],
  });
}

const shadeStructureRecord = priorityRecords.find((record) => record.recordNumber === '2019-LOG-0000784');
requireCondition(shadeStructureRecord.facts.electronicPlans === 'Yes', '2019 shade-structure record lost electronic-plan evidence');
requireCondition(shadeStructureRecord.facts.constructionValuation === 98000, '2019 shade-structure valuation changed');
requireCondition(shadeStructureRecord.publicDocumentStatusCharacterCount === 0, '2019 public document-status endpoint is no longer empty');
for (const relatedRecordNumber of [
  '2019-SUDP-0000843',
  '2019-COMMCON-0000537',
  '2019-ZONE-0001373',
]) {
  requireCondition(
    shadeStructureRecord.publicRelatedRecordNumbers.includes(relatedRecordNumber),
    `2019 shade-structure related tree lost ${relatedRecordNumber}`,
  );
}
requireCondition(
  shadeStructureConstructionPermit.json.analysisVersion === 'denver-epermits-public-record-detail-v4',
  '2019 shade-structure construction-permit detail is not v4',
);
requireCondition(
  shadeStructureConstructionPermit.json.recordNumber === '2019-COMMCON-0000537',
  '2019 shade-structure construction-permit record mismatch',
);
requireCondition(
  /Record Status:\s*Permit Finaled/i.test(shadeStructureConstructionPermit.json.detailBodyText),
  '2019 shade-structure construction permit is not recorded as finaled',
);
requireCondition(
  shadeStructureConstructionPermit.json.attachmentTab?.clicked === false,
  '2019 shade-structure construction permit unexpectedly opened an attachment tab',
);
requireCondition(
  shadeStructureConstructionPermit.json.publicPageMethods?.loadDocStatuses?.characterCount === 0,
  '2019 shade-structure construction-permit public document-status endpoint is no longer empty',
);
requireCondition(
  shadeStructureConstructionPermit.json.reportControls?.hiddenShowReportLinkValue === 'N'
    && shadeStructureConstructionPermit.json.reportControls?.reportTriggerVisible === false
    && shadeStructureConstructionPermit.json.reportControls?.reportListLinkCount === 0,
  '2019 shade-structure construction permit now exposes a public report and requires acquisition',
);
requireCondition(
  normalizeText(shadeStructureConstructionPermit.json.publicPageMethods?.getBuildCapTree?.html ?? '')
    .includes('2019-LOG-0000784'),
  '2019 shade-structure construction-permit related tree lost its building log',
);
requireCondition(
  shadeStructureSudpPermit.json.analysisVersion === 'denver-epermits-public-record-detail-v4',
  '2019 shade-structure SUDP detail is not v4',
);
requireCondition(
  shadeStructureSudpPermit.json.recordNumber === '2019-SUDP-0000843',
  '2019 shade-structure SUDP record mismatch',
);
requireCondition(
  shadeStructureSudpPermit.json.detailBodyText.includes('Record Status:\u00a0Issued'),
  '2019 shade-structure SUDP is not recorded as issued',
);
const shadeStructureSudpApplicationText = applicationInformationText(shadeStructureSudpPermit.json);
requireCondition(
  shadeStructureSudpApplicationText.includes(
    'Two new shade structures not over utilities for Coors Field: Entrance B and Picnic area.',
  ),
  '2019 shade-structure SUDP lost the official location description',
);
requireCondition(
  shadeStructureSudpPermit.json.publicPageMethods?.loadDocStatuses?.characterCount === 0,
  '2019 shade-structure SUDP public document-status endpoint is no longer empty',
);
requireCondition(
  shadeStructureSudpPermit.json.reportControls?.hiddenShowReportLinkValue === 'N'
    && shadeStructureSudpPermit.json.reportControls?.reportTriggerVisible === false
    && shadeStructureSudpPermit.json.reportControls?.reportListLinkCount === 0,
  '2019 shade-structure SUDP now exposes a public report and requires acquisition',
);
requireCondition(
  shadeStructureChangeAudit.json.artifactKind === 'rockies-2019-shade-structure-change-audit',
  '2019 shade-structure change audit kind changed',
);
requireCondition(
  shadeStructureChangeAudit.json.changeValidation?.allCandidatesPassPresenceChangeGates === true,
  '2019 shade-structure change audit lost its independent presence-change result',
);
requireCondition(
  shadeStructureChangeAudit.json.candidates?.length === 2,
  '2019 shade-structure change audit candidate count changed',
);
requireCondition(
  JSON.stringify(shadeStructureChangeAudit.json.candidates.map((candidate) => candidate.permitLocation))
    === JSON.stringify(['Entrance B', 'Picnic area']),
  '2019 shade-structure change audit location identities changed',
);
requireCondition(
  shadeStructureChangeAudit.json.candidates.every(
    (candidate) => candidate.geometryBoundary?.establishesOverhangUnderside === false
      && candidate.geometryBoundary?.establishesExactPermitPlanMatch === false,
  ),
  '2019 shade-structure candidates now overclaim underside or exact permit-plan identity',
);
requireCondition(
  shadeStructureSeatShadowReachAudit.json.artifactKind
    === 'rockies-shade-structure-seat-shadow-reach-audit',
  '2019 shade-structure seat shadow-reach audit kind changed',
);
requireCondition(
  shadeStructureSeatShadowReachAudit.json.analysisVersion
    === 'rockies-2019-shade-structure-seat-shadow-reach-v2',
  '2019 shade-structure seat shadow-reach audit is not the conservative v2 result',
);
requireCondition(
  shadeStructureSeatShadowReachAudit.json.interpretation
    ?.allCandidatesHaveNoSeatsWithinPrimaryEnvelope === true,
  '2019 shade-structure shadow audit lost its primary-envelope result',
);
requireCondition(
  shadeStructureSeatShadowReachAudit.json.interpretation
    ?.allCandidatesPassDoubleEnvelopeSensitivity === false,
  '2019 shade-structure shadow audit no longer retains an inconclusive candidate',
);
requireCondition(
  JSON.stringify(shadeStructureSeatShadowReachAudit.json.interpretation?.excludedCandidateIds)
    === JSON.stringify(['GATE_B_SHADE_STRUCTURE'])
    && JSON.stringify(shadeStructureSeatShadowReachAudit.json.interpretation?.inconclusiveCandidateIds)
      === JSON.stringify(['COORS_OUTFIELD_PICNIC_NEW_SHELTER']),
  '2019 shade-structure diagnostic decisions changed',
);
requireCondition(
  shadeStructureSeatShadowReachAudit.json.publication?.eligibleForExactRowShade === false,
  '2019 shade-structure shadow audit overclaims publication eligibility',
);
const coveredEntryRecord = priorityRecords.find((record) => record.recordNumber === '2022-LOG-0015897');
requireCondition(coveredEntryRecord.facts.heightFeet === 12.5, '2022 covered-entry height changed');
requireCondition(coveredEntryRecord.facts.stories === 1, '2022 covered-entry story count changed');

const recordTypeCounts = {};
for (const record of canonicalRecords.values()) {
  const key = record.recordType ?? 'Unknown';
  recordTypeCounts[key] = (recordTypeCounts[key] ?? 0) + 1;
}

const stable = {
  stadiumId: 'rockies',
  auditScope: 'official-denver-exact-address-permit-geometry-evidence',
  queryCoverage: {
    address: '2001 Blake Street, Denver, Colorado',
    startDate: '1990-01-01',
    throughDate: '2026-08-11',
    partitionCount: partitions.length,
    sourceRecordRowCount,
    duplicateRecordRowCount,
    canonicalRecordCount: canonicalRecords.size,
    priorityGeometryRecordCount: priorityRecords.length,
    successfulV6ArtifactsFailAtSafetyCeiling: true,
    recordTypeCounts: Object.fromEntries(Object.entries(recordTypeCounts).sort(([a], [b]) => a.localeCompare(b))),
  },
  inputs: {
    partitions: partitions.map(({ source }) => publicSource(source)),
    priorityDetails: details.map(({ source }) => publicSource(source)),
    relatedPermitDetails: [
      publicSource(shadeStructureConstructionPermit),
      publicSource(shadeStructureSudpPermit),
    ],
    shadeStructureChangeAudit: publicSource(shadeStructureChangeAudit),
    shadeStructureSeatShadowReachAudit: publicSource(shadeStructureSeatShadowReachAudit),
  },
  priorityGeometryRecords: priorityRecords,
  strongestRecoveredPermitFacts: {
    electronicShadeStructurePlanRecord: '2019-LOG-0000784',
    electronicShadeStructurePlansRecorded: true,
    electronicShadeStructureConstructionValuation: 98000,
    electronicShadeStructurePublicAttachmentExposed: false,
    electronicShadeStructurePublicDocumentStatusHtmlEmpty: true,
    electronicShadeStructureRelatedRecords: [
      '2019-SUDP-0000843',
      '2019-COMMCON-0000537',
      '2019-ZONE-0001373',
    ],
    shadeStructureFinaledConstructionPermitRecord: '2019-COMMCON-0000537',
    shadeStructureFinaledConstructionPermitStatus: 'Permit Finaled',
    shadeStructureFinaledConstructionPermitPublicAttachmentExposed: false,
    shadeStructureFinaledConstructionPermitPublicDocumentStatusHtmlEmpty: true,
    shadeStructureFinaledConstructionPermitPublicReportExposed: false,
    shadeStructureIssuedSudpRecord: '2019-SUDP-0000843',
    shadeStructureCount: 2,
    shadeStructureNamedLocations: ['Entrance B', 'Picnic area'],
    shadeStructureIssuedSudpPublicDocumentStatusHtmlEmpty: true,
    shadeStructureIssuedSudpPublicReportExposed: false,
    shadeStructureCurrentElevatedFootprintCandidateCount: 2,
    shadeStructurePresenceChangeGatesPassed: true,
    shadeStructureCandidateIds: shadeStructureChangeAudit.json.candidates
      .map((candidate) => candidate.candidateId),
    shadeStructureCandidatePermitAttributionIsInference: true,
    shadeStructureCandidateOverhangUndersidesEstablished: false,
    shadeStructureDiagnosticShadowExcludedCandidateIds:
      shadeStructureSeatShadowReachAudit.json.interpretation.excludedCandidateIds,
    shadeStructureDiagnosticShadowInconclusiveCandidateIds:
      shadeStructureSeatShadowReachAudit.json.interpretation.inconclusiveCandidateIds,
    shadeStructureAllCandidatesPassDoubleEnvelopeShadowSensitivity: false,
    fieldClubSeatingPlanRecord: '2000-LOG-M000243',
    fieldClubSeatingModifiedDrawingRecord: '2001-LOG-X000131',
    explicitSectionPlanRecords: ['2011-LOG-X001289', '2012-LOG-W003929', '2013-LOG-M000304'],
    currentCoveredEntryRecord: '2022-LOG-0015897',
    currentCoveredEntryNominalHeightFeet: 12.5,
  },
  releaseGate: {
    publicationReady: false,
    exactRowShadeClaimAllowed: false,
    recoveredPermitDrawingFileCount: 0,
    blockers: [
      'PRIORITY_PERMIT_PLAN_FILES_NOT_PUBLICLY_EXPOSED',
      'SHADE_STRUCTURE_PARENT_AND_FINALED_CONSTRUCTION_PERMIT_PUBLIC_DOCUMENT_ENDPOINTS_EMPTY',
      'SHADE_STRUCTURE_ISSUED_SUDP_PUBLIC_DOCUMENT_AND_REPORT_ENDPOINTS_EMPTY',
      'PERMIT_METADATA_IS_NOT_MEASURED_GEOMETRY',
      'SHADE_STRUCTURE_FOOTPRINTS_ARE_CANDIDATES_WITHOUT_EXACT_PERMIT_PLAN_MATCH',
      'PICNIC_SHADE_STRUCTURE_SHADOW_REACH_REMAINS_INCONCLUSIVE',
      'CURRENT_AS_BUILT_GEOMETRY_NOT_ESTABLISHED',
      'ROW_ELEVATIONS_NOT_MEASURED',
      'OVERHANG_UNDERSIDES_NOT_MEASURED',
      'THIRTY_INDEPENDENT_TIMESTAMPED_SHADOW_HOLDOUTS_NOT_PASSED',
    ],
  },
  nextEvidenceAction: {
    action: 'Request the 17 priority plan sets from Denver and the stadium owner, beginning with the 2019 electronic shade-structure set and the 2000/2001 Field Club seating sets, then checksum-lock and register every received drawing.',
    requiresExternalCommunication: true,
    externalCommunicationPerformed: false,
  },
  conclusion: 'The exhaustive exact-address index identifies the relevant permit families. The official SUDP fixes the 2019 work to two named locations, Entrance B and the Picnic area. Independent 2013 and 2020 USGS LiDAR plus 2018, 2020, and 2022 DRCOG orthophotos localize two permanent elevated footprint candidates at those locations. A conservative 2025 scheduled-game plan test diagnostically excludes Gate B only; the Picnic area remains inconclusive under the second 30-foot sensitivity reserve. Denver still exposes no public permit plan, and the candidates do not establish exact permit-plan identity, sub-foot absolute position, overhang undersides, row geometry, or independent shadow validation.',
};

const artifact = {
  schemaVersion: 1,
  analysisVersion: 'rockies-denver-permit-geometry-evidence-audit-v5',
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
  canonicalRecordCount: artifact.queryCoverage.canonicalRecordCount,
  priorityGeometryRecordCount: artifact.queryCoverage.priorityGeometryRecordCount,
  recoveredPermitDrawingFileCount: artifact.releaseGate.recoveredPermitDrawingFileCount,
  publicationReady: artifact.releaseGate.publicationReady,
}, null, 2)}\n`);
