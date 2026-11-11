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
  /** 'blue-cast' for flights whose grass reads as blue as it is green. */
  grassRule?: 'blue-cast';
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
  {
    stadiumId: 'dodgers',
    imageCenter: { latitude: 34.07358, longitude: -118.24014 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3411863_nw_11_060_20220511',
    acquired: '2022-05-11',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [266, 370],
    moundSeedPx: [300, 303],
    homeCenterPx: [266, 370],
    moundCenterPx: [299.93, 305.32],
    bearingHomeToMoundDeg: 27.68,
    bearingInfieldSymmetryDeg: 27.1,
    orientationDeg: 27,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Mound under a tarp. The home-plate circle runs into the dirt around it, so home is the hand-placed point; home → mound 27.68°. ' +
      'Infield mirror axis 27.1° (97.9% overlap). The four straight edges of the infield grass square (parallel to the baselines) give ' +
      '25.87°, 26.66°, 27.78° and 26.16° (mean 26.62°; corners 90.8°). Chalk foul lines are not visible at 0.6 m. Mean 27.1°, recorded ' +
      'as 27° ±1°. Replaces 25° (ballparks.com lists 30°).',
  },
  {
    stadiumId: 'cubs',
    imageCenter: { latitude: 41.94805, longitude: -87.65569 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_4108703_ne_16_060_20190807',
    acquired: '2019-08-07',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [247, 368],
    moundSeedPx: [298, 303],
    homeCenterPx: [247, 368],
    moundCenterPx: [298.11, 302.89],
    bearingHomeToMoundDeg: 38.14,
    bearingInfieldSymmetryDeg: 38.5,
    orientationDeg: 38,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Taken during a game. The home-plate circle runs into the dirt around it, so home is the hand-placed point; home → mound 38.14°. ' +
      'Infield mirror axis 38.5° (94.1% overlap). The infield grass square\'s edges give 37.55°, 35.99° (edge partly in a stand\'s shadow), ' +
      '38.89° and 37.68° (mean 37.53°). Mean 38.1°, recorded as 38° ±1°. Replaces 30° (ballparks.com lists 30°), 8° low; the stands in ' +
      'the wider image run at about 80° (first base) and 358° (third base), consistent with 38°.',
  },
  {
    stadiumId: 'giants',
    imageCenter: { latitude: 37.7786, longitude: -122.3893 },
    imageHalfWidthMeters: 200,
    imageSizePx: 1000,
    naipTile: 'm_3712213_se_10_060_20220518',
    acquired: '2022-05-18',
    nativeResolutionMeters: 0.6,
    grassRule: 'blue-cast',
    homeSeedPx: [365, 563],
    moundSeedPx: [410, 560],
    homeCenterPx: [365, 563],
    moundCenterPx: [410, 560],
    bearingHomeToMoundDeg: 86.19,
    bearingInfieldSymmetryDeg: 85.4,
    orientationDeg: 86,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Measured on the 400 m wide image (the USGS server timed out on a close-up; the source is 0.6 m either way). This flight has a ' +
      'blue cast (grass 95, 115, 115), hence grassRule. Home plate is under a cover; home → mound 86.19°. Infield mirror axis 85.4° ' +
      '(81.6% overlap). The infield grass square\'s edges give 85.27°, 84.49°, 86.22° and 86.41° (mean 85.6°). Mean 85.7°, recorded as ' +
      '86° ±1°. Replaces 87° (ballparks.com lists 90°).',
  },
  {
    stadiumId: 'mets',
    imageCenter: { latitude: 40.75675, longitude: -73.84598 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_4007310_sw_18_060_20190809',
    acquired: '2019-08-09',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [283, 372],
    moundSeedPx: [300, 302],
    homeCenterPx: [283, 372],
    moundCenterPx: [300, 302],
    bearingHomeToMoundDeg: 13.65,
    bearingInfieldSymmetryDeg: 14.4,
    orientationDeg: 14,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Clear infield, no covers. The home-plate circle runs into the dirt around it, so home is the hand-placed point; home → mound ' +
      '13.65°. Infield mirror axis 14.4° (96.3% overlap). The infield grass square\'s edges give 13.31°, 13.61°, 13.75° and 13.32° ' +
      '(mean 13.5°, spread 0.44°). Mean 13.85°, recorded as 14° ±1°. Replaces 35°, which was 21° high.',
  },
  {
    stadiumId: 'phillies',
    imageCenter: { latitude: 39.90575, longitude: -75.16656 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3907507_se_18_060_20220510',
    acquired: '2022-05-10',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [288, 376],
    moundSeedPx: [299, 305],
    homeCenterPx: [287.6, 376.18],
    moundCenterPx: [299.01, 302.51],
    bearingHomeToMoundDeg: 9.1,
    bearingInfieldSymmetryDeg: 9,
    orientationDeg: 9,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'A cover sits on the mound and a tarp over the front of the infield grass. Home-plate circle (98% non-grass) → mound 9.1° ' +
      '(from the seed point, 8.52°). Infield mirror axis 9.0° (97.8% overlap). Third check: a circle fitted to the outer edge of the ' +
      'infield dirt (103 of 111 rays; radius 30.2 m, centre 18.6 m from home) puts its centre at 8.84° from home; the same fit gives ' +
      '14.35° at Citi Field (recorded 14°). The grass square\'s home-side edges run under the tarp, so it is not used. Mean 8.98°, ' +
      'recorded as 9° ±1°. Replaces 18° (ballparks.com lists 15°).',
  },
];

export function getOrientationMeasurement(stadiumId: string): OrientationMeasurement | undefined {
  return ORIENTATION_MEASUREMENTS.find((m) => m.stadiumId === stadiumId);
}
