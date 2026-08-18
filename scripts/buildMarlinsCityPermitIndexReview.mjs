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

function normalized(value) {
  return typeof value === 'string' ? value.trim().toUpperCase() : '';
}

function issuedDateIso(record) {
  return Number.isFinite(record.PermitIssuedDate)
    ? new Date(record.PermitIssuedDate).toISOString()
    : null;
}

function reviewRecord(record) {
  return {
    objectId: record.OBJECTID,
    planNumber: record.PlanNumber ?? null,
    applicationNumber: record.ApplicationNumber ?? null,
    permitNumber: record.PermitNumber ?? null,
    issuedDate: issuedDateIso(record),
    permitStatus: record.PermitStatus ?? null,
    masterPlanStatus: record.MasterPlanStatus ?? null,
    permitType: record.PermitType ?? null,
    scopeOfWork: record.ScopeOfWork ?? null,
    address: record.FULLADDR ?? null,
    folio: record.FOLIO ?? null,
    projectName: record.ProjectName || null,
  };
}

function recordSort(a, b) {
  return (a.issuedDate ?? '9999').localeCompare(b.issuedDate ?? '9999')
    || (a.planNumber ?? '').localeCompare(b.planNumber ?? '')
    || a.objectId - b.objectId;
}

const permitIndexPath = path.resolve(option(
  'permit-index',
  'tmp/lidar/marlins-city-miami-permit-index-2026/manifest.json',
));
const outputDirectory = path.resolve(option(
  'output-dir',
  'tmp/lidar/marlins-city-miami-permit-index-review-2026',
));

const permitIndexBytes = await readFile(permitIndexPath);
const permitIndex = JSON.parse(permitIndexBytes.toString('utf8'));
requireEqual(
  permitIndex.artifactKind,
  'marlins-city-miami-permit-index-acquisition',
  'permit index kind',
);
requireEqual(permitIndex.stadiumId, 'marlins', 'permit index stadiumId');
requireEqual(permitIndex.summary?.recordCount, 163, 'permit index record count');
requireEqual(
  permitIndex.geometryBoundary?.establishesCompleteHistoricalPermitInventory,
  false,
  'permit index historical completeness boundary',
);
requireEqual(
  permitIndex.geometryBoundary?.establishesPlanAvailability,
  false,
  'permit index plan availability boundary',
);
requireEqual(
  permitIndex.geometryBoundary?.establishesCurrentObstructionGeometry,
  false,
  'permit index obstruction geometry boundary',
);

const records = permitIndex.records;
if (!Array.isArray(records)) throw new Error('permit index records are absent');
const objectIds = new Set(records.map((record) => record.OBJECTID));
requireEqual(objectIds.size, records.length, 'unique permit index OBJECTIDs');

const directGeometryScopes = new Set([
  'ADDITION AND REMODELING',
  'BUILDING ROOFING',
  'DEMOLITION',
  'ELEVATOR',
  'NEW CONSTRUCTION',
  'PHASED PERMIT',
  'REMODELING/REPAIRS',
]);
const possibleObstructionOrEquipmentScopes = new Set([
  'ELECTRICAL',
  'FIRE',
  'MECHANICAL',
  'PLUMBING',
  'SIGN',
]);
const post2024Start = Date.parse('2024-01-01T00:00:00Z');

const directGeometryCandidates = records
  .filter((record) => directGeometryScopes.has(normalized(record.ScopeOfWork)))
  .map(reviewRecord)
  .sort(recordSort);
const possibleObstructionOrEquipmentCandidates = records
  .filter((record) => possibleObstructionOrEquipmentScopes.has(normalized(record.ScopeOfWork)))
  .map(reviewRecord)
  .sort(recordSort);
const post2024Candidates = records
  .filter((record) => (
    (Number.isFinite(record.PermitIssuedDate) && record.PermitIssuedDate >= post2024Start)
    || /^BD(?:24|25|26)/.test(normalized(record.PlanNumber))
  ))
  .map(reviewRecord)
  .sort(recordSort);

const activeOrInProcessStates = new Set([
  'ACTIVE',
  'APPLICANT CORRECTIONS',
  'APPROVED',
  'IN REVIEW',
  'PERMIT ISSUED',
  'SUBMITTED',
]);
const currentUnresolvedWorkflowCandidates = post2024Candidates.filter((record) => (
  activeOrInProcessStates.has(normalized(record.permitStatus))
  || activeOrInProcessStates.has(normalized(record.masterPlanStatus))
));

const exactIdentityGroups = new Map();
for (const record of records) {
  const key = JSON.stringify([
    record.PlanNumber ?? null,
    record.PermitNumber ?? null,
    record.ScopeOfWork ?? null,
    record.PermitStatus ?? null,
    record.MasterPlanStatus ?? null,
  ]);
  const group = exactIdentityGroups.get(key) ?? [];
  group.push(record.OBJECTID);
  exactIdentityGroups.set(key, group);
}
const duplicatePublishedIdentities = [...exactIdentityGroups.entries()]
  .filter(([, ids]) => ids.length > 1)
  .map(([key, ids]) => {
    const [planNumber, permitNumber, scopeOfWork, permitStatus, masterPlanStatus] = JSON.parse(key);
    return {
      planNumber,
      permitNumber,
      scopeOfWork,
      permitStatus,
      masterPlanStatus,
      featureCount: ids.length,
      objectIds: ids.sort((a, b) => a - b),
    };
  })
  .sort((a, b) => (a.planNumber ?? '').localeCompare(b.planNumber ?? ''));

const requestPriorityPlanNumbers = [...new Set([
  ...directGeometryCandidates.map((record) => record.planNumber),
  ...post2024Candidates.map((record) => record.planNumber),
].filter(Boolean))].sort();

const stable = {
  analysisVersion: 'marlins-city-miami-permit-index-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    permitIndex: {
      path: path.relative(process.cwd(), permitIndexPath),
      sha256: sha256(permitIndexBytes),
      artifactVersion: permitIndex.artifactVersion,
    },
  },
  reviewMethod: {
    sourceFieldsOnly: true,
    directGeometryScopes: [...directGeometryScopes].sort(),
    possibleObstructionOrEquipmentScopes: [...possibleObstructionOrEquipmentScopes].sort(),
    post2024Rule: 'PermitIssuedDate on or after 2024-01-01 UTC, or a PlanNumber beginning BD24, BD25, or BD26.',
    limitation: 'Scope and status fields identify records requiring plan review. They do not establish that permanent geometry changed or disclose the dimensions, location, or final as-built condition of any work.',
  },
  inventory: {
    sourceFeatureCount: records.length,
    sourceUniqueObjectIdCount: objectIds.size,
    sourceUniquePlanNumberCount: new Set(records.map((record) => record.PlanNumber).filter(Boolean)).size,
    sourceRecordsWithoutIssuedDateCount: records.filter((record) => !Number.isFinite(record.PermitIssuedDate)).length,
    duplicatePublishedIdentityGroupCount: duplicatePublishedIdentities.length,
    directGeometryCandidateFeatureCount: directGeometryCandidates.length,
    possibleObstructionOrEquipmentCandidateFeatureCount: possibleObstructionOrEquipmentCandidates.length,
    post2024CandidateFeatureCount: post2024Candidates.length,
    post2024UniquePlanNumberCount: new Set(post2024Candidates.map((record) => record.planNumber).filter(Boolean)).size,
    currentUnresolvedWorkflowCandidateCount: currentUnresolvedWorkflowCandidates.length,
    requestPriorityPlanNumberCount: requestPriorityPlanNumbers.length,
  },
  directGeometryCandidates,
  possibleObstructionOrEquipmentCandidates,
  post2024Candidates,
  currentUnresolvedWorkflowCandidates,
  duplicatePublishedIdentities,
  requestPriorityPlanNumbers,
  findings: {
    officialPermitIdentifiersEstablished: true,
    post2024PermitAndApplicationCandidatesIdentified: post2024Candidates.length > 0,
    activeOrInProcessCandidatesIdentified: currentUnresolvedWorkflowCandidates.length > 0,
    originalConstructionMasterPermitIdentified: false,
    completeHistoricalPermitInventoryEstablished: false,
    planSheetsIncluded: false,
    approvedPlanSheetsIncluded: false,
    asBuiltSheetsIncluded: false,
    permanentGeometryChangeEstablished: false,
    completeCurrentChangeInventoryEstablished: false,
  },
  geometryBoundary: {
    establishesCurrentPermitIndexSnapshot: true,
    establishesPotentialGeometryChangeIdentifiers: true,
    establishesCompleteHistoricalPermitInventory: false,
    establishesCompleteCurrentChangeInventory: false,
    establishesPlanAvailability: false,
    establishesAsBuiltGeometry: false,
    establishesMetricRowGeometry: false,
    establishesCurrentObstructionGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'ORIGINAL_CONSTRUCTION_MASTER_PERMIT_NOT_IDENTIFIED',
      'PERMIT_INDEX_HAS_NO_PLAN_SHEETS',
      'POST_2024_GEOMETRY_CHANGE_CANDIDATES_NOT_RESOLVED',
      'CURRENT_AS_BUILT_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-city-miami-permit-index-review',
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
  inventory: artifact.inventory,
  findings: artifact.findings,
  publication: artifact.publication,
}, null, 2));
