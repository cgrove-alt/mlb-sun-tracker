import {
  currentObstructionArtifactCandidates,
  evidenceFreshnessArtifactCandidates,
} from '../researchArtifactCandidates';

describe('research artifact candidate priority', () => {
  it('prefers the dated current obstruction audit over a legacy v1 filename', () => {
    expect(currentObstructionArtifactCandidates('marlins').slice(0, 2)).toEqual([
      'tmp/lidar/marlins-current-geometry-delta-2026/manifest.json',
      'tmp/lidar/marlins-current-geometry-delta-audit-v1.json',
    ]);
  });

  it('prefers the dated freshness audit over legacy versioned filenames', () => {
    expect(evidenceFreshnessArtifactCandidates('marlins').slice(0, 3)).toEqual([
      'tmp/lidar/marlins-evidence-freshness-audit-2026.json',
      'tmp/lidar/marlins-evidence-freshness-audit-v2.json',
      'tmp/lidar/marlins-evidence-freshness-audit-v1.json',
    ]);
  });
});
