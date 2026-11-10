/**
 * The park list the shade finder needs, built on the server so the large
 * orientation-provenance file never ships to the browser.
 */
import { MLB_STADIUMS } from '../../data/stadiums';
import { getOrientationPrecision } from '../../data/stadiumOrientationProvenance';
import type { FinderPark } from './ShadeFinder';

export function finderParks(onlyId?: string): FinderPark[] {
  return MLB_STADIUMS
    .filter((stadium) => !onlyId || stadium.id === onlyId)
    .map((stadium) => ({
      id: stadium.id,
      name: stadium.name,
      team: stadium.team.replace(/^(?:Los Angeles|New York|San Francisco|San Diego|St\. Louis|Kansas City|Tampa Bay|Chicago|Boston|Toronto|Seattle|Houston|Texas|Arizona|Colorado|Atlanta|Miami|Washington|Philadelphia|Pittsburgh|Cincinnati|Cleveland|Detroit|Milwaukee|Minnesota|Baltimore) /, ''),
      timezone: stadium.timezone,
      latitude: stadium.latitude,
      longitude: stadium.longitude,
      orientation: stadium.orientation,
      roof: stadium.roof,
      precisionDeg: getOrientationPrecision(stadium.id),
    }));
}
