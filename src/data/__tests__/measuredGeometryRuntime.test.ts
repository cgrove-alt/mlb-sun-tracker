/** @jest-environment node */

import {
  hashMeasuredGeometryPayload,
  stampMeasuredGeometryArtifact,
  validateMeasuredGeometryArtifact,
  loadMeasuredGeometryArtifact,
  MEASURED_GEOMETRY_ARTIFACT_PATHS,
} from '../measuredGeometryArtifact';
import {
  bindMeasuredShadeRuntime,
  calculateMeasuredVenueShade,
  createSelfShadingGrandstandArtifact,
  rayHitsTriangle,
  sunDirectionEnu,
} from '../../utils/measuredShadeRuntime';
import { MLB_STADIUMS } from '../stadiums';

describe('measured geometry artifact hashing', () => {
  it('stamps a stable sha256 that changes when a vertex moves', () => {
    const artifact = createSelfShadingGrandstandArtifact('test-park');
    expect(artifact.artifactVersion).toMatch(/^sha256:[a-f0-9]{64}$/);
    expect(hashMeasuredGeometryPayload(artifact)).toBe(artifact.artifactVersion);
    expect(validateMeasuredGeometryArtifact(artifact)).toEqual([]);

    const tampered = {
      ...artifact,
      rows: artifact.rows.map((row, index) => (
        index === 0 ? { ...row, origin: { ...row.origin, x: row.origin.x + 0.01 } } : row
      )),
    };
    expect(hashMeasuredGeometryPayload(tampered)).not.toBe(artifact.artifactVersion);
  });

  it('rejects an artifact whose version was copied from a different payload', () => {
    const stamped = createSelfShadingGrandstandArtifact('test-park');
    const forged = { ...stamped, stadiumId: 'other-park' };
    expect(validateMeasuredGeometryArtifact(forged)).toEqual(
      expect.arrayContaining([expect.stringMatching(/does not match the canonical payload hash/)]),
    );
  });

  it('has no production artifact files yet', () => {
    expect(MEASURED_GEOMETRY_ARTIFACT_PATHS).toEqual({});
    expect(loadMeasuredGeometryArtifact('yankees')).toBeNull();
  });
});

describe('bindMeasuredShadeRuntime', () => {
  it('does not bind any current MLB park', () => {
    for (const stadium of MLB_STADIUMS) {
      const bound = bindMeasuredShadeRuntime(stadium.id);
      expect(bound.ok).toBe(false);
      if (!bound.ok) {
        expect(bound.code).toMatch(/MEASURED_SHADE_RUNTIME_UNAVAILABLE|UNVALIDATED_SEAT_GEOMETRY|MEASURED_SHADE_ARTIFACT/);
      }
    }
  });
});

describe('measured ray-cast runtime', () => {
  const artifact = createSelfShadingGrandstandArtifact('test-park');
  const westSun = { altitudeDegrees: 30, azimuthDegrees: 270 };

  it('casts a ray that hits a west wall and misses an eastward miss', () => {
    const dir = sunDirectionEnu(270, 30);
    expect(dir.x).toBeLessThan(-0.8);
    const hit = rayHitsTriangle(
      { x: -100, y: 0, z: 10 },
      dir,
      { x: -110, y: -40, z: 0 },
      { x: -110, y: 40, z: 0 },
      { x: -110, y: 40, z: 50 },
    );
    expect(hit).not.toBeNull();
    expect(hit!).toBeGreaterThan(0);
  });

  it('puts the sun-side (west) grandstand in shade and the east side in sun', () => {
    const sections = calculateMeasuredVenueShade(artifact, westSun);
    const west = sections.find((section) => section.sectionId === 'west')!;
    const east = sections.find((section) => section.sectionId === 'east')!;
    expect(west.averageCoverage).toBe(100);
    expect(east.averageCoverage).toBe(0);
    expect(west.rows[0].inShadow).toBe(true);
    expect(east.rows[0].inShadow).toBe(false);
  });

  it('keeps a covered row at 100% shade at high sun', () => {
    const sections = calculateMeasuredVenueShade(artifact, { altitudeDegrees: 70, azimuthDegrees: 180 });
    const covered = sections.find((section) => section.sectionId === 'covered')!;
    expect(covered.rows.every((row) => row.coverage === 100 && row.sunExposure === 0)).toBe(true);
  });

  it('shades every seat when a retractable roof is closed', () => {
    const retractable = stampMeasuredGeometryArtifact({
      schemaVersion: artifact.schemaVersion,
      kind: artifact.kind,
      stadiumId: artifact.stadiumId,
      coordinateFrame: artifact.coordinateFrame,
      roof: { type: 'retractable' },
      coverage: artifact.coverage,
      uncertainty: artifact.uncertainty,
      rows: artifact.rows,
      obstructions: artifact.obstructions,
    });
    const open = calculateMeasuredVenueShade(retractable, westSun, { roofState: 'open' });
    const closed = calculateMeasuredVenueShade(retractable, westSun, { roofState: 'closed' });
    expect(open.find((section) => section.sectionId === 'east')!.averageCoverage).toBe(0);
    expect(closed.every((section) => section.averageCoverage === 100)).toBe(true);
  });

  it('never consults bowl defaults: an empty obstruction set is full sun above the horizon', () => {
    const openBowl = stampMeasuredGeometryArtifact({
      schemaVersion: 1,
      kind: 'measured-shade-geometry',
      stadiumId: 'open-bowl',
      coordinateFrame: artifact.coordinateFrame,
      roof: { type: 'open' },
      coverage: artifact.coverage,
      uncertainty: artifact.uncertainty,
      rows: artifact.rows,
      obstructions: [],
    });
    const sections = calculateMeasuredVenueShade(openBowl, westSun);
    expect(sections.filter((section) => section.sectionId !== 'covered').every((section) => section.averageCoverage === 0)).toBe(true);
  });
});
