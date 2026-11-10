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
  {
    stadiumId: 'redsox',
    imageCenter: { latitude: 42.3463, longitude: -71.0975 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_4207148_nw_19_030_20230707',
    acquired: '2023-07-07',
    nativeResolutionMeters: 0.3,
    homeSeedPx: [212.5, 327.3],
    moundSeedPx: [263, 275.5],
    homeCenterPx: [212.54, 327.33],
    moundCenterPx: [262.84, 275.81],
    bearingHomeToMoundDeg: 44.35,
    bearingInfieldSymmetryDeg: 44,
    orientationDeg: 44,
    precisionDeg: 1,
    measuredOn: '2026-11-10',
    notes:
      'The chalk foul lines are visible: fitted at 359.21° (third base, 128 samples) and 89.55° (first base, 197 samples), ' +
      '90.34° apart, bisector 44.38°. Home is where they cross; home → mound 44.35°; infield mirror axis 44.0° (96.1% overlap). ' +
      'Replaces 52°, which was 8° high (ballparks.com lists 45°).',
  },
];

export function getOrientationMeasurement(stadiumId: string): OrientationMeasurement | undefined {
  return ORIENTATION_MEASUREMENTS.find((m) => m.stadiumId === stadiumId);
}
