/**
 * Ballpark orientations measured from public-domain USGS NAIP aerial imagery.
 *
 * Orientation is the compass bearing from home plate toward center field.
 * Official Baseball Rule 2.01 puts home plate, the pitcher's plate and second
 * base on one straight line that points at center field, so the bearing from
 * the center of the home-plate circle to the center of the pitcher's mound is
 * the orientation. The infield dirt is also mirror-symmetric about that line,
 * which gives an independent second measurement from the same image.
 *
 * Images are requested north-up in Web Mercator (EPSG:3857), which preserves
 * angles, so a bearing measured in pixels is the true compass bearing.
 *
 * Reproduce with: `npx tsx scripts/measureOrientation.ts <stadiumId>`. The
 * script re-fetches the image, re-finds both centers from the seed points
 * below, and prints every method's bearing.
 */

export interface OrientationMeasurement {
  stadiumId: string;
  /** Image center and half-width on the ground, in metres. */
  imageCenter: { latitude: number; longitude: number };
  imageHalfWidthMeters: number;
  imageSizePx: number;
  /** NAIP source tile and the date it was flown. */
  naipTile: string;
  acquired: string;
  nativeResolutionMeters: number;
  /** Approximate pixel positions the script refines from. */
  homeSeedPx: [number, number];
  moundSeedPx: [number, number];
  /** Results recorded from the last run. */
  homeCenterPx: [number, number];
  moundCenterPx: [number, number];
  bearingHomeToMoundDeg: number;
  bearingInfieldSymmetryDeg: number;
  /** Final value written to stadiums.ts. */
  orientationDeg: number;
  /** Honest ± uncertainty of `orientationDeg`. */
  precisionDeg: number;
  measuredOn: string;
  notes?: string;
}

export const ORIENTATION_MEASUREMENTS: readonly OrientationMeasurement[] = [
  {
    stadiumId: 'yankees',
    imageCenter: { latitude: 40.8296, longitude: -73.9262 },
    imageHalfWidthMeters: 160,
    imageSizePx: 1280,
    naipTile: 'm_4007309_ne_18_060_20190830',
    acquired: '2019-08-30',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [385, 690],
    moundSeedPx: [457, 670],
    homeCenterPx: [385.38, 691.82],
    moundCenterPx: [457.54, 671.89],
    bearingHomeToMoundDeg: 74.56,
    bearingInfieldSymmetryDeg: 75.3,
    orientationDeg: 75,
    precisionDeg: 1,
    measuredOn: '2026-11-10',
    notes:
      'Home plate and mound were under tarps. Tarp centers give 74.56°; the infield-dirt mirror axis through the home tarp gives 74.5°; ' +
      'home → infield-dirt centroid gives 74.9°; the script\'s angle-and-offset symmetry search gives 75.3°. Mean 74.8°, recorded as 75° ±1°. ' +
      'The field is unchanged since the park opened in 2009. Replaces 55°, which was 20° low (ballparks.com lists 75°).',
  },
];

export function getOrientationMeasurement(stadiumId: string): OrientationMeasurement | undefined {
  return ORIENTATION_MEASUREMENTS.find((m) => m.stadiumId === stadiumId);
}
