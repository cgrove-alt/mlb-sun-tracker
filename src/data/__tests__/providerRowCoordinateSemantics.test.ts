import { summarizeProviderRowCoordinateCompleteness } from '../providerRowCoordinateSemantics';

describe('provider row coordinate semantics', () => {
  it('reports schema v4 provider-coordinate fields without a measurement claim', () => {
    expect(summarizeProviderRowCoordinateCompleteness({
      providerDirectRows: 120,
      providerRecoveredRows: 3,
      providerDirectPercent: 97.5,
    })).toEqual({
      providerDirectRows: 120,
      providerRecoveredRows: 3,
      providerDirectCoveragePercent: 97.5,
      legacyMeasurementVocabularyTranslated: false,
    });
  });

  it('translates legacy directMeasured fields strictly as provider coordinates', () => {
    expect(summarizeProviderRowCoordinateCompleteness({
      directMeasuredRows: 99,
      modelAssistedRows: 1,
      directMeasuredPercent: 99,
    })).toEqual({
      providerDirectRows: 99,
      providerRecoveredRows: 1,
      providerDirectCoveragePercent: 99,
      legacyMeasurementVocabularyTranslated: true,
    });
  });

  it('does not infer direct provider coverage from generic extracted coverage', () => {
    expect(summarizeProviderRowCoordinateCompleteness({
      extractedRows: 50,
      percent: 100,
    })).toEqual({
      providerDirectRows: null,
      providerRecoveredRows: 0,
      providerDirectCoveragePercent: 0,
      legacyMeasurementVocabularyTranslated: false,
    });
  });
});
