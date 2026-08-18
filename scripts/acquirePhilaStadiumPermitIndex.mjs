import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

function option(name, fallback) {
  const prefix = `--${name}=`;
  const value = process.argv.find((argument) => argument.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

const opaAccount = option('opa-account', '788020010');
const issuedOnOrAfter = option('issued-on-or-after', '2024-01-01');
const outputPath = resolve(option(
  'output',
  'tmp/lidar/phillies-phila-permit-index-2024-current.json',
));
const endpoint = 'https://phl.carto.com/api/v2/sql';
const selectedFields = [
  'permitnumber',
  'permittype',
  'permitdescription',
  'typeofwork',
  'approvedscopeofwork',
  'permitissuedate',
  'status',
  'mostrecentinsp',
  'permitcompleteddate',
  'address',
  'opa_account_num',
  'opa_owner',
  'systemofrecord',
  'parentjobid',
  'zoningpermitjobid',
  'posse_jobid',
  'numberofstories',
  'areaofdisturbance',
];
const query = [
  `SELECT ${selectedFields.join(', ')}`,
  'FROM permits',
  `WHERE opa_account_num = '${opaAccount.replaceAll("'", "''")}'`,
  `AND permitissuedate >= '${issuedOnOrAfter.replaceAll("'", "''")}'`,
  'ORDER BY permitissuedate DESC, permitnumber DESC',
].join(' ');
const url = new URL(endpoint);
url.searchParams.set('q', query);

const response = await fetch(url, {
  headers: { 'user-agent': 'mlb-sun-tracker-evidence-audit/1.0' },
});
if (!response.ok) {
  throw new Error(`Philadelphia permit API returned HTTP ${response.status}`);
}
const payload = await response.json();
if (!Array.isArray(payload.rows) || payload.rows.length === 0) {
  throw new Error('Philadelphia permit API returned no permit rows');
}
const rows = payload.rows;
for (const row of rows) {
  if (row.opa_account_num !== opaAccount) {
    throw new Error(`Unexpected OPA account in ${row.permitnumber}`);
  }
}

const planReviewTypes = new Set([
  'Building',
  'Zoning',
  'Site / Utility Permit',
  'General Permit Minor',
]);
const geometryKeywords = [
  'addition',
  'alteration',
  'bullpen',
  'canopy',
  'display',
  'drain',
  'dugout',
  'foundation',
  'led',
  'roof',
  'scoreboard',
  'sign',
  'slab',
  'structure',
  'tent',
  'tower',
];
const containsGeometryKeyword = (row) => {
  const text = [row.typeofwork, row.approvedscopeofwork]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return geometryKeywords.some((keyword) => text.includes(keyword));
};
const planReviewRecords = rows.filter((row) => planReviewTypes.has(row.permittype));
const geometryKeywordRecords = planReviewRecords.filter(containsGeometryKeyword);
const permitTypeCounts = Object.fromEntries([...new Set(rows.map((row) => row.permittype))]
  .toSorted()
  .map((type) => [type, rows.filter((row) => row.permittype === type).length]));

const stable = {
  source: {
    provider: 'City of Philadelphia Licenses and Inspections open data',
    endpoint,
    datasetMetadataUrl:
      'https://catalog.data.gov/dataset/licenses-and-inspections-building-and-zoning-permits',
    query,
    opaAccount,
    issuedOnOrAfter,
  },
  rows,
  review: {
    planReviewPermitNumbers: planReviewRecords.map((row) => row.permitnumber),
    geometryKeywordPermitNumbers: geometryKeywordRecords.map((row) => row.permitnumber),
  },
};
const artifactVersion = `sha256:${createHash('sha256')
  .update(JSON.stringify(stable))
  .digest('hex')}`;
const artifact = {
  schemaVersion: 1,
  artifactKind: 'philadelphia-stadium-permit-index',
  artifactVersion,
  acquiredOn: new Date().toISOString(),
  ...stable,
  summary: {
    recordCount: rows.length,
    permitTypeCounts,
    planReviewRecordCount: planReviewRecords.length,
    geometryKeywordRecordCount: geometryKeywordRecords.length,
    latestPermitIssuedOn: rows.map((row) => row.permitissuedate).filter(Boolean).toSorted().at(-1),
  },
  evidenceBoundary: {
    establishesCurrentPermitInventory: true,
    establishesAsBuiltGeometry: false,
    establishesCompleteShadowCastingObstructionGeometry: false,
    note: 'Permit scopes identify changed geometry requiring plan or field evidence. They do not supply as-built dimensions by themselves.',
  },
  publication: {
    eligible: false,
    blockers: [
      'PERMIT_PLAN_SETS_NOT_ACQUIRED',
      'AS_BUILT_COMPLETION_GEOMETRY_NOT_ACQUIRED',
      'CURRENT_ROW_AND_OBSTRUCTION_GEOMETRY_NOT_COMPLETE',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion,
  summary: artifact.summary,
}, null, 2));
