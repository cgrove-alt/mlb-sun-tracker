/** @jest-environment node */

import { MLB_STADIUMS } from '../stadiums';
import { STADIUM_GEOMETRY_EVIDENCE } from '../stadiumGeometryEvidence';
import {
  FIELD_VALIDATED_SHADE_STADIUMS,
  canPublishSeatLevelShade,
  canPublishSectionLevelShadeTiers,
  canPublishVenueSeatShade,
  getStadiumShadeConfidence,
  publicShadeStatus,
} from '../stadiumShadeConfidence';
import { ALL_UNIFIED_VENUES } from '../unifiedVenues';

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

  it('publishes fixed-roof shade without waiting on row-geometry evidence', () => {
    expect(canPublishVenueSeatShade({ id: 'rays', roof: 'fixed' })).toBe(true);
    expect(canPublishVenueSeatShade({ id: 'caesars-superdome', roof: 'fixed' })).toBe(true);
    expect(canPublishVenueSeatShade({ id: 'yankees', roof: 'open' })).toBe(false);
    expect(canPublishVenueSeatShade({ id: 'lambeau-field', roof: 'open' })).toBe(false);
  });

  it('publishes section-level shade tiers for every reconciled MLB inventory', () => {
    MLB_STADIUMS.forEach((stadium) => {
      expect(canPublishSectionLevelShadeTiers(stadium)).toBe(true);
    });
  });

  it('withholds section-level shade tiers for NFL and MiLB venues', () => {
    ALL_UNIFIED_VENUES.filter((venue) => venue.league !== 'MLB').forEach((venue) => {
      expect(canPublishSectionLevelShadeTiers(venue)).toBe(false);
    });
  });

  it('keeps seat-level percentages gated separately from section tiers', () => {
    expect(canPublishSectionLevelShadeTiers({ id: 'yankees', league: 'MLB' })).toBe(true);
    expect(canPublishVenueSeatShade({ id: 'yankees', roof: 'open' })).toBe(false);
  });
});
