export function currentObstructionArtifactCandidates(stadiumId: string): string[] {
  return [
    `tmp/lidar/${stadiumId}-current-geometry-delta-2026/manifest.json`,
    `tmp/lidar/${stadiumId}-current-geometry-delta-audit-v1.json`,
    `tmp/lidar/${stadiumId}-drcog-roofprint-analysis-2026.json`,
    `tmp/lidar/${stadiumId}-miami-dade-building-model-candidate-2026.json`,
  ];
}

export function evidenceFreshnessArtifactCandidates(stadiumId: string): string[] {
  return [
    `tmp/lidar/${stadiumId}-evidence-freshness-audit-2026.json`,
    `tmp/lidar/${stadiumId}-evidence-freshness-audit-v2.json`,
    `tmp/lidar/${stadiumId}-evidence-freshness-audit-v1.json`,
    `tmp/lidar/${stadiumId}-current-official-section-207-evidence-freshness-audit-v1.json`,
  ];
}
