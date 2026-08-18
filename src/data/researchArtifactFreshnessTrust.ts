import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

type JsonRecord = Record<string, unknown>;

export interface LiveFreshnessRecordValidation {
  path: string | null;
  ready: boolean;
  blockers: string[];
}

export interface ResearchFreshnessAuditValidation {
  artifactVersionValid: boolean;
  declaredSummaryValid: boolean;
  allAuditedArtifactsLiveFresh: boolean;
  ready: boolean;
  records: LiveFreshnessRecordValidation[];
  blockers: string[];
}

function sha256Bytes(value: Uint8Array): string {
  return createHash('sha256').update(value).digest('hex');
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSha256(value: unknown): value is string {
  return typeof value === 'string' && /^[0-9a-f]{64}$/.test(value);
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') {
    return JSON.stringify(value);
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('Canonical JSON cannot encode non-finite numbers');
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalJson(item)).join(',')}]`;
  }
  if (isRecord(value)) {
    return `{${Object.keys(value).sort().map((key) =>
      `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(',')}}`;
  }
  throw new TypeError(`Canonical JSON cannot encode ${typeof value}`);
}

export function computeResearchFreshnessArtifactVersion(audit: JsonRecord): string {
  const stable = {
    analysisVersion: audit.analysisVersion,
    artifacts: audit.artifacts,
    summary: audit.summary,
    publicationEligible: audit.publicationEligible,
    blockers: audit.blockers,
  };
  return `sha256:${createHash('sha256').update(canonicalJson(stable)).digest('hex')}`;
}

function recordPath(record: JsonRecord): string | null {
  const candidate = typeof record.resolvedPath === 'string'
    ? record.resolvedPath
    : record.path;
  return typeof candidate === 'string' && candidate.length > 0
    ? resolve(candidate)
    : null;
}

async function readIdentity(path: string): Promise<{
  sha256: string;
  artifactVersion: unknown;
} | null> {
  try {
    const raw = await readFile(path);
    let artifactVersion: unknown = null;
    try {
      const parsed = JSON.parse(raw.toString('utf8')) as unknown;
      artifactVersion = isRecord(parsed) ? parsed.artifactVersion ?? null : null;
    } catch {
      artifactVersion = null;
    }
    return { sha256: sha256Bytes(raw), artifactVersion };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw error;
  }
}

async function validateInputRecord(input: JsonRecord): Promise<string[]> {
  const blockers: string[] = [];
  const path = recordPath(input);
  const expectedSha256 = input.recordedSha256;
  if (!path) blockers.push('AUDITED_INPUT_PATH_INVALID');
  if (!isSha256(expectedSha256)) blockers.push('AUDITED_INPUT_SHA256_INVALID');
  if (
    input.sourceExists !== true
    || input.checksumMatches !== true
    || input.directFresh !== true
    || input.fresh !== true
  ) {
    blockers.push('AUDITED_INPUT_DECLARED_STALE');
  }
  if (input.artifactVersionMatches === false) {
    blockers.push('AUDITED_INPUT_DECLARED_VERSION_MISMATCH');
  }

  if (path && isSha256(expectedSha256)) {
    const identity = await readIdentity(path);
    if (!identity) {
      blockers.push('AUDITED_INPUT_MISSING');
    } else {
      if (identity.sha256 !== expectedSha256 || identity.sha256 !== input.actualSha256) {
        blockers.push('AUDITED_INPUT_SHA256_MISMATCH');
      }
      if (
        input.recordedArtifactVersion !== null
        && input.recordedArtifactVersion !== undefined
        && (
          identity.artifactVersion !== input.recordedArtifactVersion
          || identity.artifactVersion !== input.sourceArtifactVersion
        )
      ) {
        blockers.push('AUDITED_INPUT_VERSION_MISMATCH');
      }
    }
  }

  if (isRecord(input.transitiveAudit)) {
    const transitive = await validateAuditedArtifactRecord(input.transitiveAudit);
    if (!transitive.ready) blockers.push('AUDITED_TRANSITIVE_INPUT_STALE');
  }
  return [...new Set(blockers)];
}

export async function validateAuditedArtifactRecord(
  record: JsonRecord,
): Promise<LiveFreshnessRecordValidation> {
  const blockers: string[] = [];
  const path = recordPath(record);
  const expectedSha256 = record.sha256;
  const inputs = Array.isArray(record.inputs)
    ? record.inputs.filter(isRecord)
    : [];
  if (!path) blockers.push('AUDITED_ARTIFACT_PATH_INVALID');
  if (!isSha256(expectedSha256)) blockers.push('AUDITED_ARTIFACT_SHA256_INVALID');
  if (record.allInputsFresh !== true || (Array.isArray(record.blockers) && record.blockers.length > 0)) {
    blockers.push('AUDITED_ARTIFACT_DECLARED_STALE');
  }
  if (typeof record.inputCount !== 'number' || record.inputCount < 1) {
    blockers.push('AUDITED_ARTIFACT_INPUT_COUNT_INVALID');
  }
  if (record.inputCount !== inputs.length || record.freshInputCount !== inputs.length) {
    blockers.push('AUDITED_ARTIFACT_INPUT_SUMMARY_MISMATCH');
  }

  if (path && isSha256(expectedSha256)) {
    const identity = await readIdentity(path);
    if (!identity) {
      blockers.push('AUDITED_ARTIFACT_MISSING');
    } else {
      if (identity.sha256 !== expectedSha256) {
        blockers.push('AUDITED_ARTIFACT_SHA256_MISMATCH');
      }
      if (identity.artifactVersion !== record.artifactVersion) {
        blockers.push('AUDITED_ARTIFACT_VERSION_MISMATCH');
      }
    }
  }

  const inputBlockers = await Promise.all(inputs.map(validateInputRecord));
  blockers.push(...inputBlockers.flat());
  const uniqueBlockers = [...new Set(blockers)].sort();
  return {
    path,
    ready: uniqueBlockers.length === 0,
    blockers: uniqueBlockers,
  };
}

export async function verifyResearchArtifactFreshnessAudit(
  audit: JsonRecord,
): Promise<ResearchFreshnessAuditValidation> {
  const declaredArtifactVersion = audit.artifactVersion;
  const artifactVersionValid = typeof declaredArtifactVersion === 'string'
    && declaredArtifactVersion === computeResearchFreshnessArtifactVersion(audit);
  const artifacts = Array.isArray(audit.artifacts)
    ? audit.artifacts.filter(isRecord)
    : [];
  const summary = isRecord(audit.summary) ? audit.summary : {};
  const auditBlockers = Array.isArray(audit.blockers) ? audit.blockers : [];
  const declaredSummaryValid = Boolean(
    summary.allArtifactsFresh === true
    && summary.artifactCount === artifacts.length
    && summary.freshArtifactCount === artifacts.length
    && auditBlockers.length === 0,
  );
  const records = await Promise.all(artifacts.map(validateAuditedArtifactRecord));
  const allAuditedArtifactsLiveFresh = artifacts.length > 0
    && records.every((record) => record.ready);
  const blockers = [
    ...(!artifactVersionValid ? ['FRESHNESS_AUDIT_ARTIFACT_VERSION_INVALID'] : []),
    ...(!declaredSummaryValid ? ['FRESHNESS_AUDIT_DECLARED_SUMMARY_INVALID'] : []),
    ...(!allAuditedArtifactsLiveFresh ? ['FRESHNESS_AUDIT_LIVE_VERIFICATION_FAILED'] : []),
  ];
  return {
    artifactVersionValid,
    declaredSummaryValid,
    allAuditedArtifactsLiveFresh,
    ready: blockers.length === 0,
    records,
    blockers,
  };
}
