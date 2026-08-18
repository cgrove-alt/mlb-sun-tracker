/** @jest-environment node */

import { MLB_STADIUMS } from '../stadiums';
import {
  summarizeShadowObservationHoldout,
  type ShadowBoundaryObservation,
} from '../shadowObservationValidation';

const padres = MLB_STADIUMS.find((stadium) => stadium.id === 'padres')!;

function observation(
  index: number,
  date: string,
  hour: string,
  predictedOffset = 0,
): ShadowBoundaryObservation {
  return {
    id: `obs-${index}`,
    stadiumId: 'padres',
    capturedAt: `${date}T${hour}:00-07:00`,
    sourceUrl: `https://example.com/clip/${index}`,
    timestampEvidence: {
      sourceUrl: `https://example.com/timestamp/${index}`,
      method: 'mlb-play-guid-event-window',
      uncertaintySeconds: 10,
    },
    frameProvenance: {
      status: 'confirmed-live',
      evidenceUrl: `https://example.com/live-frame/${index}`,
    },
    cameraLocation: {
      description: 'High-home broadcast camera, identified from field landmarks',
      evidenceUrl: `https://example.com/camera/${index}`,
    },
    independenceKey: `camera-a:${date}:${hour}:${index}`,
    partition: 'holdout',
    sectionId: '101',
    rowCoordinateSystem: {
      kind: 'front-to-back-ordinal',
      rowIdsFrontToBack: Array.from({ length: 20 }, (_, rowIndex) => String(rowIndex + 1)),
      sectionFractionReference: 'first-to-last-seat-anchor-in-geometry-artifact',
      boundarySemantics: 'row-intersected-or-first-shadeward-row',
    },
    boundarySamples: [{
      sectionFraction: 0.5,
      observedBoundaryRowId: '10',
      observedBoundaryRow: 10,
      observedBoundaryUncertaintyRows: 0.5,
      predictedBoundaryRow: 10 + predictedOffset,
    }],
    geometryArtifactVersion: 'sha256:test',
    roofState: 'not-applicable',
    visibility: 'clear',
  };
}

describe('shadow observation holdout', () => {
  it('computes a passing holdout from independent raw observations', () => {
    const dates = ['2026-04-15', '2026-06-15', '2026-08-15'];
    const observations = Array.from({ length: 30 }, (_, index) => observation(
      index,
      dates[index % dates.length],
      index % 2 === 0 ? '08:00' : '13:00',
      index % 10 === 0 ? 2 : index % 3 === 0 ? 1 : 0,
    ));
    const summary = summarizeShadowObservationHoldout(padres, observations);

    expect(summary).toMatchObject({
      stage: 'passed',
      heldOutObservationCount: 30,
      uniqueDates: 3,
      medianBoundaryErrorRows: 0,
      p95BoundaryErrorRows: 2,
      geometryArtifactVersion: 'sha256:test',
    });
    expect(summary.solarAltitudeSpanDeg).toBeGreaterThanOrEqual(25);
  });

  it('does not count calibration or obscured frames as holdout evidence', () => {
    const calibration = { ...observation(1, '2026-06-15', '12:00'), partition: 'calibration' as const };
    const obscured = { ...observation(2, '2026-06-15', '13:00'), visibility: 'obscured' as const };
    const summary = summarizeShadowObservationHoldout(padres, [calibration, obscured]);
    expect(summary).toMatchObject({
      stage: 'not-started',
      observationCount: 1,
      heldOutObservationCount: 0,
    });
  });

  it('rejects duplicate frames masquerading as independent evidence', () => {
    const first = observation(1, '2026-06-15', '12:00');
    const duplicate = { ...observation(2, '2026-06-15', '12:01'), independenceKey: first.independenceKey };
    expect(() => summarizeShadowObservationHoldout(padres, [first, duplicate]))
      .toThrow(/Duplicate observation independence key/);
  });

  it('requires an explicit timezone in every timestamp', () => {
    const invalid = { ...observation(1, '2026-06-15', '12:00'), capturedAt: '2026-06-15T12:00:00' };
    expect(() => summarizeShadowObservationHoldout(padres, [invalid]))
      .toThrow(/explicit UTC offset/);
  });

  it('counts independent calendar dates in the stadium timezone, not UTC', () => {
    const beforeUtcMidnight = {
      ...observation(1, '2025-07-04', '16:00'),
      capturedAt: '2025-07-04T23:00:00Z',
    };
    const afterUtcMidnight = {
      ...observation(2, '2025-07-04', '18:00'),
      capturedAt: '2025-07-05T01:00:00Z',
    };

    expect(summarizeShadowObservationHoldout(padres, [beforeUtcMidnight, afterUtcMidnight]).uniqueDates)
      .toBe(1);
  });

  it('rejects holdout labels with excessive time or row uncertainty', () => {
    const uncertainTime = observation(1, '2026-06-15', '12:00');
    uncertainTime.timestampEvidence.uncertaintySeconds = 31;
    expect(() => summarizeShadowObservationHoldout(padres, [uncertainTime]))
      .toThrow(/timestamp uncertainty exceeds/);

    const uncertainRow = observation(2, '2026-06-15', '12:00');
    uncertainRow.boundarySamples[0].observedBoundaryUncertaintyRows = 1.01;
    expect(() => summarizeShadowObservationHoldout(padres, [uncertainRow]))
      .toThrow(/boundary-label uncertainty exceeds/);
  });

  it('requires source row IDs to agree with the front-to-back ordinal', () => {
    const mismatched = observation(1, '2026-06-15', '12:00');
    mismatched.boundarySamples[0].observedBoundaryRowId = 'G';
    expect(() => summarizeShadowObservationHoldout(padres, [mismatched]))
      .toThrow(/does not match its source row ID/);
  });

  it('scores each independent frame by its worst lateral boundary sample', () => {
    const sampled = observation(1, '2026-06-15', '12:00');
    sampled.boundarySamples = [
      { ...sampled.boundarySamples[0], sectionFraction: 0.25, predictedBoundaryRow: 10 },
      { ...sampled.boundarySamples[0], sectionFraction: 0.75, predictedBoundaryRow: 13 },
    ];
    const summary = summarizeShadowObservationHoldout(padres, [sampled]);
    expect(summary).toMatchObject({
      heldOutObservationCount: 1,
      medianBoundaryErrorRows: 3,
      p95BoundaryErrorRows: 3,
    });
  });

  it('never counts a replay or unresolved edited frame in the holdout', () => {
    const replay = observation(1, '2026-06-15', '12:00');
    replay.frameProvenance.status = 'replay';
    expect(() => summarizeShadowObservationHoldout(padres, [replay]))
      .toThrow(/not a confirmed live frame/);

    const unknown = observation(2, '2026-06-15', '12:00');
    unknown.frameProvenance.status = 'unknown';
    expect(() => summarizeShadowObservationHoldout(padres, [unknown]))
      .toThrow(/not a confirmed live frame/);
  });

  it('does not combine observations from different geometry versions', () => {
    const first = observation(1, '2026-06-15', '12:00');
    const second = observation(2, '2026-06-16', '13:00');
    second.geometryArtifactVersion = 'sha256:different';
    expect(() => summarizeShadowObservationHoldout(padres, [first, second]))
      .toThrow(/multiple geometry artifact versions/);
  });
});
