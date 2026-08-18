/** @jest-environment node */

import {
  SEAT_SHADE_RELEASE_THRESHOLDS,
  auditStadiumGeometryEvidenceRegistry,
  evaluateGeometryForSeatShade,
  getStadiumGeometryEvidence,
  validateStadiumGeometryEvidence,
  type StadiumGeometryEvidence,
} from '../stadiumGeometryEvidence';

function passingEvidence(): StadiumGeometryEvidence {
  const thresholds = SEAT_SHADE_RELEASE_THRESHOLDS;
  const measurement = {
    stage: 'remotely-measured' as const,
    measuredCoveragePercent: thresholds.measuredCoveragePercent,
    horizontalUncertaintyFt: thresholds.horizontalUncertaintyFt,
    verticalUncertaintyFt: thresholds.verticalUncertaintyFt,
    orientationUncertaintyDeg: thresholds.orientationUncertaintyDeg,
    sourceIds: ['metric-source'],
    artifactVersion: 'sha256:test',
  };

  return {
    stadiumId: 'test-park',
    sources: [{
      id: 'metric-source',
      provider: 'Test provider',
      method: 'public-lidar',
      sourceUrl: 'https://example.com/source.laz',
      discoveredOn: '2026-08-07',
      license: 'public-domain',
      components: ['stadium-frame', 'row-surfaces', 'overhangs'],
    }],
    stadiumFrame: { ...measurement },
    rowGeometry: { ...measurement },
    obstructionGeometry: { ...measurement },
    geometryCurrency: {
      stage: 'current',
      assessedOn: '2026-08-08',
      latestKnownChangeOn: null,
      sourceUrls: ['https://example.com/current-geometry-review'],
    },
    observationHoldout: {
      stage: 'passed',
      observationCount: thresholds.heldOutObservationCount,
      heldOutObservationCount: thresholds.heldOutObservationCount,
      uniqueDates: thresholds.uniqueDates,
      solarAltitudeSpanDeg: thresholds.solarAltitudeSpanDeg,
      medianBoundaryErrorRows: thresholds.medianBoundaryErrorRows,
      p95BoundaryErrorRows: thresholds.p95BoundaryErrorRows,
      geometryArtifactVersion: 'sha256:test',
      sourceUrls: ['https://example.com/observation'],
    },
    reviewedOn: '2026-08-07',
  };
}

describe('remote geometry publication evidence', () => {
  it('keeps every registered evidence record internally auditable', () => {
    expect(auditStadiumGeometryEvidenceRegistry()).toEqual([]);
  });

  it('records the Petco USGS lidar tile as a candidate without promoting it', () => {
    const evidence = getStadiumGeometryEvidence('padres');
    const evaluation = evaluateGeometryForSeatShade(evidence);

    expect(evidence.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'usgs-petco-2014-280835',
        method: 'public-lidar',
        coordinateReferenceSystem: 'EPSG:6426',
      }),
    ]));
    expect(evidence.rowGeometry.stage).toBe('source-located');
    expect(evidence.rowGeometry.artifactVersion).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(evidence.obstructionGeometry.stage).toBe('source-located');
    expect(evidence.geometryCurrency.stage).toBe('stale');
    expect(evaluation.publishable).toBe(false);
    expect(evaluation.blockers).toEqual(expect.arrayContaining([
      'ROW_GEOMETRY_NOT_MEASURED',
      'OBSTRUCTION_GEOMETRY_NOT_MEASURED',
      'GEOMETRY_SOURCE_STALE',
      'OBSERVATION_HOLDOUT_NOT_PASSED',
    ]));
  });

  it('records complete multi-tile Dodger Stadium lidar without promoting raw returns', () => {
    const evidence = getStadiumGeometryEvidence('dodgers');
    const evaluation = evaluateGeometryForSeatShade(evidence);

    expect(evidence.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'usgs-dodgers-los-angeles-2023',
        method: 'public-lidar',
        acquiredOn: '2023-11-22',
        acquiredThrough: '2023-12-04',
        footprintCoveragePercent: 100,
        additionalSourceUrls: expect.arrayContaining([
          expect.stringContaining('11SLT038500377100.laz'),
        ]),
      }),
    ]));
    expect(evidence.rowGeometry).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
    });
    expect(evidence.geometryCurrency.stage).toBe('stale');
    expect(evaluation).toMatchObject({
      publishable: false,
      blockers: expect.arrayContaining([
        'ROW_GEOMETRY_NOT_MEASURED',
        'OBSTRUCTION_GEOMETRY_NOT_MEASURED',
        'GEOMETRY_SOURCE_STALE',
        'OBSERVATION_HOLDOUT_NOT_PASSED',
      ]),
    });
  });

  it('records the incomplete 2023 Angel Stadium project as partial source evidence', () => {
    const evidence = getStadiumGeometryEvidence('angels');

    expect(evidence.sources[0]).toMatchObject({
      id: 'usgs-angels-california-gaps-2023-partial',
      footprintCoveragePercent: 67.86,
    });
    expect(evidence.stadiumFrame.measuredCoveragePercent).toBe(0);
    expect(evidence.rowGeometry.stage).toBe('source-located');
    expect(evaluateGeometryForSeatShade(evidence).publishable).toBe(false);
  });

  it('keeps Daikin Park fail-closed across source accuracy and moving-state gaps', () => {
    const evidence = getStadiumGeometryEvidence('astros');
    const evaluation = evaluateGeometryForSeatShade(evidence);

    expect(evidence.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'usgs-astros-tx-houston-2024',
        acquiredOn: '2024-02-18',
        footprintCoveragePercent: 100,
        nominalPointSpacingFt: 1.1483,
      }),
      expect.objectContaining({
        id: '3ddv-astros-current-provider-row-map-2026',
        coordinateReferenceSystem: expect.stringContaining('not georeferenced'),
      }),
    ]));
    expect(evidence.stadiumFrame).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: 'sha256:d938ed71a8da16a5d1ec1998de9618cc4d0f4e97f6f57571bbad67ab5ae44f57',
    });
    expect(evidence.rowGeometry).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: 'sha256:625c1a2882ce5f2ac1667198a7d40e3f4b2b719ffe2160a758fc9d87204cb197',
    });
    expect(evidence.geometryCurrency).toMatchObject({
      stage: 'stale',
      latestKnownChangeOn: '2025-03-27',
    });
    expect(evaluation).toMatchObject({
      publishable: false,
      blockers: expect.arrayContaining([
        'ROW_GEOMETRY_NOT_MEASURED',
        'OBSTRUCTION_GEOMETRY_NOT_MEASURED',
        'GEOMETRY_SOURCE_STALE',
        'OBSERVATION_HOLDOUT_NOT_PASSED',
      ]),
    });
  });

  it('accepts the Marlins metric stadium frame without promoting rows or roof volume', () => {
    const evidence = getStadiumGeometryEvidence('marlins');
    const evaluation = evaluateGeometryForSeatShade(evidence);

    expect(evidence.stadiumFrame).toMatchObject({
      stage: 'remotely-measured',
      measuredCoveragePercent: 100,
      horizontalUncertaintyFt: 0.654302963,
      verticalUncertaintyFt: 0.31,
      orientationUncertaintyDeg: 0.030824776,
      artifactVersion: 'sha256:09544e44259be4feb1fea12029abd07da267bfda632c9f423030aef2b15588d6',
    });
    expect(evidence.rowGeometry).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: 'sha256:8acdc53af396067317110dac35987287192ab749a2e38806ec244d8c77c08c80',
    });
    expect(evidence.obstructionGeometry).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: 'sha256:5c3fe20a669eb3d09ace779ea17eaef0757b68c42c85e6310054b7ccde0f91ae',
    });
    expect(evidence.geometryCurrency.stage).toBe('stale');
    expect(evaluation.publishable).toBe(false);
    expect(evaluation.blockers).not.toContain('NO_METRIC_STADIUM_FRAME');
    expect(evaluation.blockers).toEqual(expect.arrayContaining([
      'ROW_GEOMETRY_NOT_MEASURED',
      'OBSTRUCTION_GEOMETRY_NOT_MEASURED',
      'GEOMETRY_SOURCE_STALE',
      'OBSERVATION_HOLDOUT_NOT_PASSED',
    ]));
  });

  it('keeps T-Mobile Park fail-closed after unstable registration and current changes', () => {
    const evidence = getStadiumGeometryEvidence('mariners');
    const evaluation = evaluateGeometryForSeatShade(evidence);

    expect(evidence.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'usgs-mariners-wa-kingcounty-2021',
        acquiredOn: '2021-04-14',
        footprintCoveragePercent: 100,
      }),
      expect.objectContaining({
        id: 'ticketmaster-mariners-current-provider-row-map-2026',
        coordinateReferenceSystem: expect.stringContaining('not georeferenced'),
      }),
    ]));
    expect(evidence.stadiumFrame).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: 'sha256:aaefd472f701dfd929135acac3e59d0ddecf8aebd4df32427accaeced3c89681',
    });
    expect(evidence.obstructionGeometry).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: 'sha256:8a28ef545daad36fc8f24d626d8ec4137be068db5dcff83876371bff1ee453cc',
    });
    expect(evidence.geometryCurrency).toMatchObject({
      stage: 'stale',
      latestKnownChangeOn: '2026-06-29',
    });
    expect(evaluation).toMatchObject({
      publishable: false,
      blockers: expect.arrayContaining([
        'ROW_GEOMETRY_NOT_MEASURED',
        'OBSTRUCTION_GEOMETRY_NOT_MEASURED',
        'GEOMETRY_SOURCE_STALE',
        'OBSERVATION_HOLDOUT_NOT_PASSED',
      ]),
    });
  });

  it('records the complete recent Phillies lidar without ignoring 2026 structural changes', () => {
    const evidence = getStadiumGeometryEvidence('phillies');
    const evaluation = evaluateGeometryForSeatShade(evidence);

    expect(evidence.sources[0]).toMatchObject({
      id: 'usgs-phillies-pa-17county-2024-2025',
      acquiredOn: '2024-12-17',
      acquiredThrough: '2025-04-02',
      footprintCoveragePercent: 100,
    });
    expect(evidence.rowGeometry).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
    });
    expect(evidence.geometryCurrency).toMatchObject({
      stage: 'stale',
      latestKnownChangeOn: '2026-03-26',
    });
    expect(evaluation).toMatchObject({
      publishable: false,
      blockers: expect.arrayContaining([
        'ROW_GEOMETRY_NOT_MEASURED',
        'OBSTRUCTION_GEOMETRY_NOT_MEASURED',
        'GEOMETRY_SOURCE_STALE',
        'OBSERVATION_HOLDOUT_NOT_PASSED',
      ]),
    });
  });

  it('keeps Rate Field fail-closed across source accuracy and current changes', () => {
    const evidence = getStadiumGeometryEvidence('whitesox');
    const evaluation = evaluateGeometryForSeatShade(evidence);

    expect(evidence.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'cook-county-2022-ql1-lidar-rate-field',
        acquiredOn: '2022-04-05',
        acquiredThrough: '2022-06-29',
        footprintCoveragePercent: 100,
        nominalPointSpacingFt: 0.721785,
      }),
      expect.objectContaining({
        id: 'cook-county-2025-orthophoto-rate-field',
        nominalRasterPixelSizeFt: 0.5,
      }),
      expect.objectContaining({
        id: 'ticketmaster-whitesox-current-provider-row-map-2026',
        coordinateReferenceSystem: expect.stringContaining('not georeferenced'),
      }),
    ]));
    expect(evidence.stadiumFrame).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: 'sha256:763f480bdfd8d09a250a02a51ac0679ba2c62a84f80bbbfce1954ad14d99d474',
    });
    expect(evidence.rowGeometry).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: 'sha256:7c53e36cf9976ca08b2385e1fc20ed9b54e8e5a0f14b296f24b1b49f67c5aa20',
    });
    expect(evidence.geometryCurrency).toMatchObject({
      stage: 'stale',
      latestKnownChangeOn: '2026-02-25',
    });
    expect(evaluation).toMatchObject({
      publishable: false,
      blockers: expect.arrayContaining([
        'NO_METRIC_STADIUM_FRAME',
        'ROW_GEOMETRY_NOT_MEASURED',
        'OBSTRUCTION_GEOMETRY_NOT_MEASURED',
        'GEOMETRY_SOURCE_STALE',
        'OBSERVATION_HOLDOUT_NOT_PASSED',
      ]),
    });
  });

  it('keeps Camden Yards fail-closed after the 2026 renovation', () => {
    const evidence = getStadiumGeometryEvidence('orioles');
    const evaluation = evaluateGeometryForSeatShade(evidence);

    expect(evidence.sources).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'usgs-orioles-md-4county-2024',
        acquiredOn: '2024-12-17',
        acquiredThrough: '2024-12-30',
        footprintCoveragePercent: 100,
      }),
      expect.objectContaining({
        id: 'mdimap-orioles-three-inch-orthophoto-2025',
        nominalRasterPixelSizeFt: 0.25,
      }),
      expect.objectContaining({
        id: 'baltimore-dot-official-survey-control-map',
        method: 'surveyed',
      }),
    ]));
    expect(
      evidence.sources.find((source) => source.id === 'mdimap-orioles-three-inch-orthophoto-2025'),
    ).not.toHaveProperty('nominalPointSpacingFt');
    expect(evidence.stadiumFrame).toMatchObject({
      stage: 'source-located',
      measuredCoveragePercent: 0,
      artifactVersion: expect.stringMatching(/^sha256:[a-f0-9]{64}$/),
    });
    expect(evidence.geometryCurrency).toMatchObject({
      stage: 'stale',
      latestKnownChangeOn: '2026-03-26',
    });
    expect(evaluation).toMatchObject({
      publishable: false,
      blockers: expect.arrayContaining([
        'ROW_GEOMETRY_NOT_MEASURED',
        'OBSTRUCTION_GEOMETRY_NOT_MEASURED',
        'GEOMETRY_SOURCE_STALE',
        'OBSERVATION_HOLDOUT_NOT_PASSED',
      ]),
    });
  });

  it('keeps an unknown park modeled and fail-closed', () => {
    const evidence = getStadiumGeometryEvidence('unknown');
    expect(evidence.sources).toHaveLength(0);
    expect(evidence.rowGeometry.stage).toBe('modeled');
    expect(evaluateGeometryForSeatShade(evidence).publishable).toBe(false);
  });

  it('accepts remote measurement at the conservative release thresholds', () => {
    const evidence = passingEvidence();
    const evaluation = evaluateGeometryForSeatShade(evidence);
    expect(validateStadiumGeometryEvidence(evidence)).toEqual([]);
    expect(evaluation).toEqual({ publishable: true, blockers: [] });
  });

  it('rejects broken source references and unsupported measured claims', () => {
    const evidence = passingEvidence();
    evidence.rowGeometry.sourceIds = ['missing-source'];
    evidence.rowGeometry.artifactVersion = '';
    evidence.rowGeometry.measuredCoveragePercent = 101;

    expect(validateStadiumGeometryEvidence(evidence)).toEqual(expect.arrayContaining([
      'rowGeometry.measuredCoveragePercent must be between 0 and 100',
      'rowGeometry.sourceIds references unknown source missing-source',
      'rowGeometry at remotely-measured stage requires artifactVersion',
    ]));
  });

  it('rejects malformed multi-tile source metadata', () => {
    const evidence = passingEvidence();
    evidence.sources[0].additionalSourceUrls = ['http://example.com/tile.laz'];
    evidence.sources[0].acquiredOn = '2026-08-08';
    evidence.sources[0].acquiredThrough = '2026-08-07';
    evidence.sources[0].footprintCoveragePercent = 100.01;

    expect(validateStadiumGeometryEvidence(evidence)).toEqual(expect.arrayContaining([
      'sources[0].additionalSourceUrls[0] must use HTTPS',
      'sources[0].acquiredThrough cannot precede acquiredOn',
      'sources[0].footprintCoveragePercent must be between 0 and 100',
    ]));
  });

  it.each([
    ['missing row coverage', (evidence: StadiumGeometryEvidence) => {
      evidence.rowGeometry.measuredCoveragePercent = 99;
    }, 'ROW_GEOMETRY_COVERAGE_INCOMPLETE'],
    ['unknown vertical uncertainty', (evidence: StadiumGeometryEvidence) => {
      evidence.obstructionGeometry.verticalUncertaintyFt = null;
    }, 'VERTICAL_UNCERTAINTY_UNKNOWN_OR_HIGH'],
    ['too few held-out observations', (evidence: StadiumGeometryEvidence) => {
      evidence.observationHoldout.heldOutObservationCount = 29;
    }, 'OBSERVATION_HOLDOUT_TOO_SMALL'],
    ['high p95 boundary error', (evidence: StadiumGeometryEvidence) => {
      evidence.observationHoldout.p95BoundaryErrorRows = 2.01;
    }, 'OBSERVED_P95_ERROR_UNKNOWN_OR_HIGH'],
    ['mismatched holdout geometry version', (evidence: StadiumGeometryEvidence) => {
      evidence.observationHoldout.geometryArtifactVersion = 'sha256:old';
    }, 'OBSERVATION_GEOMETRY_VERSION_MISMATCH'],
    ['stale geometry', (evidence: StadiumGeometryEvidence) => {
      evidence.geometryCurrency.stage = 'stale';
    }, 'GEOMETRY_SOURCE_STALE'],
    ['unreviewed geometry currency', (evidence: StadiumGeometryEvidence) => {
      evidence.geometryCurrency.stage = 'not-reviewed';
    }, 'GEOMETRY_CURRENCY_NOT_VERIFIED'],
  ])('fails closed for %s', (_label, mutate, expectedBlocker) => {
    const evidence = passingEvidence();
    mutate(evidence);
    expect(evaluateGeometryForSeatShade(evidence)).toMatchObject({
      publishable: false,
      blockers: expect.arrayContaining([expectedBlocker]),
    });
  });

  it('rejects unsupported currency claims', () => {
    const evidence = passingEvidence();
    evidence.geometryCurrency.assessedOn = null;
    evidence.geometryCurrency.sourceUrls = [];

    expect(validateStadiumGeometryEvidence(evidence)).toEqual(expect.arrayContaining([
      'geometryCurrency at stale/current stage requires an ISO assessedOn date',
      'geometryCurrency at stale/current stage requires source URLs',
    ]));
  });
});
