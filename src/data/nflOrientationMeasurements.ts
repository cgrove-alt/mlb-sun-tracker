/**
 * Measured direction of each NFL field's long axis (end zone to end zone),
 * in compass degrees. Measured 2026-11-10 for the 2025 season's stadiums, and
 * 2026-11-24 for the one the Bills moved to in 2026.
 *
 * A field is the same end to end, so 10° and 190° are the same axis. Each
 * value is written in whichever of the two directions is nearer the value
 * the data held before, so the old data's "end zone 1" keeps its end.
 *
 * Methods:
 * - `osm-pitch`: the long side of the playing-field outline mapped in
 *   OpenStreetMap (scripts/measureNflOrientation.ts), checked against USGS
 *   NAIP aerial imagery with the axis drawn on top and, where the turf
 *   shows, the principal axis of the green pixels
 *   (scripts/checkNflOrientationImagery.ts).
 * - `osm-grass-tray`: roll-out grass fields. OSM maps the tray's outdoor
 *   growing area; the tray rolls lengthwise into the stadium (the stadium
 *   center lies on the tray's axis, within 1.5°), so its axis is the field's.
 * - `imagery`: read from NAIP where OSM had nothing usable: the turf axis,
 *   the sidelines seen through a roof opening, or the roof outline.
 * - `satellite`: a rectangle fitted to the grass in Sentinel-2 images
 *   (scripts/measureNflSatellite.py), for a stadium newer than the aerial
 *   photos. On 13 fields measured the other ways it lands within 2°.
 * - `not-measured`: the roof was closed in the only aerial photo and
 *   nothing else pins the field down. Pages say so instead of guessing.
 *   Fixed-roof stadiums are listed here too: there the direction never
 *   affects shade.
 */
export interface NflFieldAxis {
  orientation: number;
  precisionDeg?: number;
  method: 'osm-pitch' | 'osm-grass-tray' | 'imagery' | 'satellite' | 'not-measured';
  source: string;
}

export const NFL_FIELD_AXES: Record<string, NflFieldAxis> = {
  'highmark-stadium': { orientation: 168, precisionDeg: 3, method: 'satellite', source: 'Opened in 2026. Sentinel-2, April to October 2026: 168.0° (16 images, spread 0.2°). OSM: the opening in the canopy (way 1577454592) runs 167.5°.' },
  'hard-rock-stadium': { orientation: 301, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 171419978 (113 x 52 m), 121.4°; canopy hides the turf, outline matches the canopy opening.' },
  'gillette-stadium': { orientation: 342, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 129176835, 162.3°; NAIP turf axis 164.6°.' },
  'metlife-stadium-jets': { orientation: 346, precisionDeg: 4, method: 'osm-pitch', source: 'OSM way 180559973 (110 x 48 m), 166.4°; sidelines on NAIP about 170°.' },
  'metlife-stadium-giants': { orientation: 346, precisionDeg: 4, method: 'osm-pitch', source: 'Same field as the Jets: OSM way 180559973, 166.4°.' },
  'm-t-bank-stadium': { orientation: 110, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 172620322 (114 x 52 m), 110.0°; matches the covered field on NAIP.' },
  'paycor-stadium': { orientation: 321, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 32946979, 141.3°; matches NAIP.' },
  'huntington-bank-field': { orientation: 236, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 172658198 (113 x 52 m), 56.1°; NAIP turf axis 61.2°.' },
  'acrisure-stadium': { orientation: 335, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 172659571, 154.7°; NAIP turf axis 156.0°.' },
  'nrg-stadium': { orientation: 0, precisionDeg: 5, method: 'imagery', source: 'NAIP roof outline: a rectangle running north–south. Only practice fields are mapped in OSM.' },
  'lucas-oil-stadium': { orientation: 0, method: 'not-measured', source: 'Roof closed on NAIP; no field in OSM.' },
  'everbank-stadium': { orientation: 16, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 172665883, 15.9°; NAIP turf axis 17.7°.' },
  'nissan-stadium': { orientation: 336, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 172668023 (114 x 52 m), 155.5°; matches the covered field on NAIP.' },
  'empower-field': { orientation: 0, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 72605220 (110 x 49 m), 0.2°; NAIP turf axis 0.6°.' },
  'geha-field-arrowhead': { orientation: 317, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 65960009 (113 x 53 m), 136.9°; matches the covered field on NAIP.' },
  'allegiant-stadium': { orientation: 25, precisionDeg: 3, method: 'osm-grass-tray', source: 'OSM way 816371013 (grass tray), 25.2°; the stadium lies 24.1° from it. Fixed roof.' },
  'sofi-stadium-chargers': { orientation: 90, method: 'not-measured', source: 'Fixed roof: direction does not affect shade.' },
  'sofi-stadium-rams': { orientation: 90, method: 'not-measured', source: 'Fixed roof: direction does not affect shade.' },
  'at-t-stadium': { orientation: 340, method: 'not-measured', source: 'Roof closed on NAIP; no field in OSM.' },
  'lincoln-financial-field': { orientation: 351, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 708050530, 171.3°; NAIP turf axis 175.2°.' },
  'northwest-stadium': { orientation: 119, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 612644655 (109 x 48 m), 119.1°; matches NAIP.' },
  'soldier-field': { orientation: 356, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 91535224 (109 x 49 m), 175.8°; NAIP turf axis 174.1°.' },
  'ford-field': { orientation: 45, method: 'not-measured', source: 'Fixed roof: direction does not affect shade.' },
  'lambeau-field': { orientation: 0, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 145797338 (113 x 52 m), 179.8°; NAIP turf axis 0.0°.' },
  'us-bank-stadium': { orientation: 88, method: 'not-measured', source: 'Fixed roof: direction does not affect shade.' },
  'mercedes-benz-stadium': { orientation: 80, precisionDeg: 4, method: 'imagery', source: 'NAIP: sidelines and the ATL end zone visible through the roof opening, about 80°.' },
  'bank-of-america-stadium': { orientation: 140, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 187011790, 139.9°; NAIP turf axis 140.6°.' },
  'caesars-superdome': { orientation: 0, method: 'not-measured', source: 'Fixed roof: direction does not affect shade.' },
  'raymond-james-stadium': { orientation: 0, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 172698720, 179.7°; NAIP turf axis 4.3°.' },
  'state-farm-stadium': { orientation: 328, precisionDeg: 3, method: 'osm-grass-tray', source: 'OSM way 130353352 (grass tray), 148.1°; the stadium lies 146.7° from it.' },
  'levis-stadium': { orientation: 332, precisionDeg: 3, method: 'osm-pitch', source: 'OSM way 357300430 (113 x 52 m), 151.8°; NAIP turf axis 148.0°.' },
  'lumen-field': { orientation: 0, precisionDeg: 3, method: 'osm-pitch', source: 'OSM ways 174251770 and 163840038, 0.0°; matches NAIP.' },
};

/** True when we know which way this field runs. */
export function isFieldAxisMeasured(stadiumId: string): boolean {
  const axis = NFL_FIELD_AXES[stadiumId];
  return Boolean(axis && axis.method !== 'not-measured');
}
