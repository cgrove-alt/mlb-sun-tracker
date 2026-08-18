export interface ProviderRowCoordinateCompleteness {
  providerDirectRows: number | null;
  providerRecoveredRows: number;
  providerDirectCoveragePercent: number;
  legacyMeasurementVocabularyTranslated: boolean;
}

function finiteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/**
 * Provider viewer coordinates are useful row-map inputs, but they are not
 * physical measurements. Schema v3 used "directMeasured" for coordinates
 * fetched directly from the provider rather than recovered locally. Translate
 * that legacy vocabulary at the read boundary and never expose it as surveyed
 * or remotely measured geometry.
 */
export function summarizeProviderRowCoordinateCompleteness(
  completeness: Record<string, unknown>,
): ProviderRowCoordinateCompleteness {
  const providerDirectRows = finiteNumber(completeness.providerDirectRows)
    ?? finiteNumber(completeness.directMeasuredRows);
  const providerRecoveredRows = finiteNumber(completeness.providerRecoveredRows)
    ?? finiteNumber(completeness.modelAssistedRows)
    ?? 0;
  const providerDirectCoveragePercent = finiteNumber(completeness.providerDirectPercent)
    ?? finiteNumber(completeness.directMeasuredPercent)
    ?? 0;

  return {
    providerDirectRows,
    providerRecoveredRows,
    providerDirectCoveragePercent,
    legacyMeasurementVocabularyTranslated:
      completeness.directMeasuredRows !== undefined
      || completeness.directMeasuredPercent !== undefined,
  };
}
