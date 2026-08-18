/** @jest-environment node */

import { MLB_STADIUMS } from '../stadiums';
import { STADIUM_GEOMETRY_EVIDENCE } from '../stadiumGeometryEvidence';
import {
  FIELD_VALIDATED_SHADE_STADIUMS,
  canPublishSeatLevelShade,
  getStadiumShadeConfidence,
  publicShadeStatus,
} from '../stadiumShadeConfidence';

describe('MLB shade publication boundary', () => {
  it('keeps identity provenance separate from physical geometry', () => {
    const parksWithGeometrySources = new Set(Object.keys(STADIUM_GEOMETRY_EVIDENCE));
    MLB_STADIUMS.filter((stadium) => !parksWithGeometrySources.has(stadium.id)).forEach((stadium) => {
      expect(getStadiumShadeConfidence(stadium.id)).toMatchObject({
        stadiumId: stadium.id,
        sectionIdentity: 'source-backed',
        rowGeometry: 'modeled',
        obstructionGeometry: 'generic-model',
        observationValidation: 'not-started',
        fieldValidation: 'unvalidated',
      });
    });

    expect(getStadiumShadeConfidence('bluejays')).toMatchObject({
      rowGeometry: 'modeled',
      obstructionGeometry: 'source-located',
      observationValidation: 'not-started',
      fieldValidation: 'unvalidated',
    });

    ['angels', 'braves', 'dodgers', 'padres', 'phillies'].forEach((stadiumId) => {
      expect(getStadiumShadeConfidence(stadiumId)).toMatchObject({
        rowGeometry: 'source-located',
        obstructionGeometry: 'source-located',
        observationValidation: 'not-started',
        fieldValidation: 'unvalidated',
        publicationBlockers: expect.arrayContaining([
          'ROW_GEOMETRY_NOT_MEASURED',
          'OBSERVATION_HOLDOUT_NOT_PASSED',
        ]),
      });
    });
  });

  it('publishes no seat-level MLB shade until evidence passes the validation gate', () => {
    expect(FIELD_VALIDATED_SHADE_STADIUMS.size).toBe(0);
    expect(MLB_STADIUMS.every((stadium) => !canPublishSeatLevelShade(stadium.id))).toBe(true);
  });

  it('keeps unresolved source inventories inside the publication gate', () => {
    expect(getStadiumShadeConfidence('bluejays').sectionInventory).toBe('reconciled');
    expect(getStadiumShadeConfidence('redsox').sectionInventory).toBe('reconciled');
    expect(getStadiumShadeConfidence('yankees').sectionInventory).toBe('reconciled');
    expect(getStadiumShadeConfidence('whitesox').sectionInventory).toBe('reconciled');
    expect(getStadiumShadeConfidence('padres').sectionInventory).toBe('reconciled');
  });

  it('uses conservative public statuses', () => {
    expect(publicShadeStatus({ stadiumId: 'yankees', roof: 'open', sunAboveHorizon: true }))
      .toBe('uncertain');
    expect(publicShadeStatus({ stadiumId: 'rangers', roof: 'retractable', sunAboveHorizon: true }))
      .toBe('roof-state-dependent');
    expect(publicShadeStatus({ stadiumId: 'rays', roof: 'fixed', sunAboveHorizon: true }))
      .toBe('verified-shaded');
    expect(publicShadeStatus({ stadiumId: 'yankees', roof: 'open', sunAboveHorizon: false }))
      .toBe('verified-shaded');
  });
});
