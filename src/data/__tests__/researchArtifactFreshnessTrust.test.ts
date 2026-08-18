/** @jest-environment node */

import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  computeResearchFreshnessArtifactVersion,
  verifyResearchArtifactFreshnessAudit,
} from '../researchArtifactFreshnessTrust';

function sha256(value: Uint8Array | string): string {
  return createHash('sha256').update(value).digest('hex');
}

describe('research artifact freshness trust boundary', () => {
  let directory: string;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'mlb-freshness-trust-'));
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  async function fixture() {
    const sourcePath = join(directory, 'source.json');
    const derivedPath = join(directory, 'derived.json');
    const source = { artifactVersion: 'sha256:source-v1', value: 1 };
    await writeFile(sourcePath, `${JSON.stringify(source)}\n`);
    const sourceRaw = await readFile(sourcePath);
    const derived = {
      artifactVersion: 'sha256:derived-v1',
      inputs: {
        sourcePath,
        sourceSha256: sha256(sourceRaw),
        sourceArtifactVersion: source.artifactVersion,
      },
    };
    await writeFile(derivedPath, `${JSON.stringify(derived)}\n`);
    const derivedRaw = await readFile(derivedPath);
    const inputRecord = {
      inputStem: 'source',
      recordedPath: sourcePath,
      resolvedPath: sourcePath,
      sourceExists: true,
      recordedSha256: sha256(sourceRaw),
      actualSha256: sha256(sourceRaw),
      checksumMatches: true,
      recordedArtifactVersion: source.artifactVersion,
      sourceArtifactVersion: source.artifactVersion,
      artifactVersionMatches: true,
      fresh: true,
      directFresh: true,
      transitiveAudit: null,
    };
    const auditRecord = {
      path: derivedPath,
      resolvedPath: derivedPath,
      sha256: sha256(derivedRaw),
      artifactVersion: derived.artifactVersion as string | null,
      inputCount: 1,
      freshInputCount: 1,
      allInputsFresh: true,
      inputs: [inputRecord],
      blockers: [],
    };
    const stable = {
      analysisVersion: 'research-artifact-input-freshness-v1',
      artifacts: [auditRecord],
      summary: {
        artifactCount: 1,
        freshArtifactCount: 1,
        allArtifactsFresh: true,
      },
      publicationEligible: false,
      blockers: [],
    };
    const audit = {
      schemaVersion: 1,
      artifactStage: 'research-artifact-input-freshness-audit',
      artifactVersion: computeResearchFreshnessArtifactVersion(stable),
      ...stable,
    };
    return { audit, sourcePath, derivedPath };
  }

  test('accepts an intact audit only after live artifact and input checks', async () => {
    const { audit } = await fixture();
    const result = await verifyResearchArtifactFreshnessAudit(audit);
    expect(result.ready).toBe(true);
    expect(result.records).toEqual([
      expect.objectContaining({ ready: true, blockers: [] }),
    ]);
  });

  test('normalizes a legitimately absent artifact version to null', async () => {
    const { audit, derivedPath } = await fixture();
    await writeFile(derivedPath, '{"inputs":{}}\n');
    const current = await readFile(derivedPath);
    audit.artifacts[0].sha256 = sha256(current);
    audit.artifacts[0].artifactVersion = null;
    audit.artifactVersion = computeResearchFreshnessArtifactVersion(audit);
    const result = await verifyResearchArtifactFreshnessAudit(audit);
    expect(result.ready).toBe(true);
  });

  test('rejects an audited artifact changed after the freshness audit', async () => {
    const { audit, derivedPath } = await fixture();
    await writeFile(derivedPath, '{"artifactVersion":"sha256:derived-v2"}\n');
    const result = await verifyResearchArtifactFreshnessAudit(audit);
    expect(result.ready).toBe(false);
    expect(result.records[0].blockers).toEqual(expect.arrayContaining([
      'AUDITED_ARTIFACT_SHA256_MISMATCH',
      'AUDITED_ARTIFACT_VERSION_MISMATCH',
    ]));
  });

  test('rejects a source input changed after the freshness audit', async () => {
    const { audit, sourcePath } = await fixture();
    await writeFile(sourcePath, '{"artifactVersion":"sha256:source-v2","value":2}\n');
    const result = await verifyResearchArtifactFreshnessAudit(audit);
    expect(result.ready).toBe(false);
    expect(result.records[0].blockers).toEqual(expect.arrayContaining([
      'AUDITED_INPUT_SHA256_MISMATCH',
      'AUDITED_INPUT_VERSION_MISMATCH',
    ]));
  });

  test('rejects a freshness audit modified without recomputing its identity', async () => {
    const { audit } = await fixture();
    audit.summary.freshArtifactCount = 0;
    const result = await verifyResearchArtifactFreshnessAudit(audit);
    expect(result.ready).toBe(false);
    expect(result.artifactVersionValid).toBe(false);
    expect(result.declaredSummaryValid).toBe(false);
  });
});
