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
  /**
   * 'blue-cast' for flights whose grass reads as blue as it is green;
   * 'slight-blue-cast' when grass is only a little greener than blue and a
   * bluish cover would otherwise pass for grass.
   */
  grassRule?: 'blue-cast' | 'slight-blue-cast';
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
  {
    stadiumId: 'braves',
    imageCenter: { latitude: 33.89098, longitude: -84.4678 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3308405_sw_16_060_20231007',
    acquired: '2023-10-07',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [275.95, 235.8],
    moundSeedPx: [301, 302],
    homeCenterPx: [275.95, 235.8],
    moundCenterPx: [301, 302],
    bearingHomeToMoundDeg: 159.27,
    bearingInfieldSymmetryDeg: 158.7,
    orientationDeg: 159,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Home plate and mound under white covers. Home cover centre (white-pixel centroid) → mound 159.27°; infield mirror axis 158.7° (95.7% overlap). ' +
      'Third check: a circle fitted to the outer edge of the infield dirt (109 of 111 rays; radius 30.3 m) is centred 160.0° from home. ' +
      'The infield grass square\'s four edges give 158.8° (spread 1.9°). Chalk foul lines traced 30–95 m out on a 260 m-wide image of the same flight: ' +
      '204.16° and 113.76°, 90.4° apart, midline 158.96°. Mean 159.1°, recorded as 159° ±1°. Replaces 135°, which was 24° low ' +
      '(it came from "southeast" descriptions, not a measurement).',
  },
  {
    stadiumId: 'cardinals',
    imageCenter: { latitude: 38.62249, longitude: -90.19321 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3809023_sw_15_060_20220618',
    acquired: '2022-06-18',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [236.09, 334.31],
    moundSeedPx: [299, 300],
    homeCenterPx: [236.09, 334.31],
    moundCenterPx: [299, 300.03],
    bearingHomeToMoundDeg: 61.41,
    bearingInfieldSymmetryDeg: 62.6,
    orientationDeg: 62,
    precisionDeg: 1.5,
    measuredOn: '2026-11-11',
    notes:
      '0.6 m imagery, softer than the other parks, with the right-field corner in the stands\' shadow. Home cover centre (white-pixel centroid) → ' +
      'mound 61.41°; infield mirror axis 62.6° (93.8% overlap). Chalk foul lines 20–60 m out: 108.45° and 18.05°, 90.4° apart, midline 63.25°; ' +
      'traced 30–95 m out on a 260 m-wide image: midline 61.34° (the right-field line only 18 points, in shadow). The grass-square and dirt-arc ' +
      'fits are too noisy here (spread 6.5°; 35 of 96 rays kept). Mean of the four 62.2°, recorded as 62° with a wider ±1.5° for the softer ' +
      'image. Replaces 60° (ballparks.com lists 60°).',
  },
  {
    stadiumId: 'nationals',
    imageCenter: { latitude: 38.87273, longitude: -77.00757 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3807716_ne_18_030_20230901',
    acquired: '2023-09-01',
    nativeResolutionMeters: 0.3,
    homeSeedPx: [259.5, 368.7],
    moundSeedPx: [294, 306],
    homeCenterPx: [259.5, 368.7],
    moundCenterPx: [293.73, 306.24],
    bearingHomeToMoundDeg: 28.72,
    bearingInfieldSymmetryDeg: 29.3,
    orientationDeg: 29,
    precisionDeg: 1,
    grassRule: 'slight-blue-cast',
    measuredOn: '2026-11-11',
    notes:
      'Grass reads almost as blue as green (85, 99, 97) next to a bluish mound cover (85, 103, 107), hence grassRule \'slight-blue-cast\'. ' +
      'A translucent cover on home plate, fitted as a circle of radius 3.9–4.1 m (the 13 ft home circle) centred at the home point used here. ' +
      'Home → mound 28.72°; infield mirror axis 29.3° (91.7% overlap); the infield grass square\'s four edges 29.45° (spread 1.1°); chalk ' +
      'foul lines 20–70 m out: 73.1–73.4° and 344.6–344.9°, midline 28.9–29.1°. The dirt-arc fit lands 2 m from the mound, so it is not used. ' +
      'Mean 29.1°, recorded as 29° ±1°. Replaces 30° (ballparks.com lists 30°).',
  },
  {
    stadiumId: 'orioles',
    imageCenter: { latitude: 39.28366, longitude: -76.6218 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3907644_sw_18_030_20230525',
    acquired: '2023-05-25',
    nativeResolutionMeters: 0.3,
    homeSeedPx: [261.2, 365.4],
    moundSeedPx: [298, 304],
    homeCenterPx: [261.2, 365.4],
    moundCenterPx: [298, 304],
    bearingHomeToMoundDeg: 30.94,
    bearingInfieldSymmetryDeg: 31.2,
    orientationDeg: 31,
    precisionDeg: 1,
    grassRule: 'blue-cast',
    measuredOn: '2026-11-11',
    notes:
      'Home plate and mound under white covers. Home cover centre → mound 30.94° (31.3° to the mound cover\'s own centre); infield mirror axis 31.2° ' +
      '(82.3% overlap, lowered by a logo painted on the grass). On a 260 m-wide image of the same flight the foul poles stand 346.4° (102 m) and ' +
      '76.4° (98 m) from home, 90.0° apart, midline 31.4°; the infield grass square\'s home-side edges give 30.9° and 31.0°. Not used: the infield ' +
      'dirt\'s outer edge is not a clean circle here (its fitted centre moves 2 m with the rays used, 28.4–29.8°), and the grass square\'s ' +
      'outfield-side edges give 27.8–28.3°. Mean of the methods used 31.2°, recorded as 31° ±1°. Replaces 30° (ballparks.com lists 30°).',
  },
  {
    stadiumId: 'padres',
    imageCenter: { latitude: 32.70721, longitude: -117.15706 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3211723_ne_11_060_20220425',
    acquired: '2022-04-25',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [298.46, 372.47],
    moundSeedPx: [298, 301],
    homeCenterPx: [298.46, 372.47],
    moundCenterPx: [297.96, 301],
    bearingHomeToMoundDeg: 359.6,
    bearingInfieldSymmetryDeg: 0,
    orientationDeg: 0,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Home-plate dirt circle centre → mound (under a bluish cover) 359.6° (0.5° and 359.5° from the other two home-centre fits); infield mirror ' +
      'axis 0.0° (95.4% overlap). Chalk foul lines traced 30–95 m out on a 260 m-wide image of the same flight: 45.66° and 313.71°, midline ' +
      '359.7°. A light tower\'s shadow crosses the first-base side of the infield, so the grass-square and dirt-arc fits are not used. ' +
      'Recorded 0° ±1°, unchanged: confirms the published "due north".',
  },
  {
    stadiumId: 'angels',
    imageCenter: { latitude: 33.79998, longitude: -117.8831 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3311709_se_11_060_20220425',
    acquired: '2022-04-25',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [274.5, 327],
    moundSeedPx: [325, 273],
    homeCenterPx: [274.5, 327],
    moundCenterPx: [325.04, 273],
    bearingHomeToMoundDeg: 43.1,
    bearingInfieldSymmetryDeg: 44,
    orientationDeg: 44,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Mound under a teal cover; home plate read as the centre of its dirt circle. Home → mound 43.1°; infield mirror axis 44.0° (96% overlap). ' +
      'Third check: a circle fitted to the infield dirt\'s outer edge (98 of 111 rays; radius 28.9 m) is centred 43.2–43.7° from home. The infield ' +
      'grass square\'s edges give 43.8° (spread 2.1°). Chalk foul lines 20–60 m out: midline 44.1–44.7°; traced 30–95 m out on a 260 m-wide image ' +
      'of the same flight: 88.9° and 357.6°, midline 43.3–44.3°. Mean 43.8°, recorded as 44° ±1°. Replaces 50°, a midpoint of two published ' +
      'values (ballparks.com 45°, "ENE" ~65°).',
  },
  {
    stadiumId: 'rockies',
    imageCenter: { latitude: 39.75579, longitude: -104.99419 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3910409_sw_13_060_20190803',
    acquired: '2019-08-03',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [297.5, 336],
    moundSeedPx: [303.5, 264.5],
    homeCenterPx: [297.5, 336],
    moundCenterPx: [303.92, 265.03],
    bearingHomeToMoundDeg: 5.17,
    bearingInfieldSymmetryDeg: 4.6,
    orientationDeg: 5,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Home plate and mound under white covers. Home → mound 5.17°; infield mirror axis 4.6° (97.1% overlap); a circle fitted to the infield dirt\'s ' +
      'outer edge (109 of 111 rays; radius 29.4 m) is centred 4.55–4.71° from home. Chalk foul lines 20–60 m out: midline 4.8–5.4°; 30–95 m out on a ' +
      '260 m-wide image of the same flight: 50.0° and 319.7°, 90.3° apart, midline 4.8°. The grass square\'s edges are too noisy here (spread 14.7°). ' +
      'Mean 4.85°, recorded as 5° ±1°. Replaces 0° (ballparks.com lists 0°).',
  },
  {
    stadiumId: 'royals',
    imageCenter: { latitude: 39.05131, longitude: -94.48074 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3909461_sw_15_060_20220629',
    acquired: '2022-06-29',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [272.5, 327.5],
    moundSeedPx: [324, 278.5],
    homeCenterPx: [272.5, 327.5],
    moundCenterPx: [323.83, 279.02],
    bearingHomeToMoundDeg: 46.63,
    bearingInfieldSymmetryDeg: 47,
    orientationDeg: 47,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Mound under a white cover. Home → mound 46.63°; infield mirror axis 47.0° (96.4% overlap). Chalk foul lines 20–60 m out: midline 46.8–47.3°; ' +
      '30–95 m out on a 260 m-wide image of the same flight: 92.0° and 1.3°, 90.7° apart, midline 46.6–46.9°. The grass square\'s edges give 45.8° ' +
      '(spread 3°) and the dirt-arc circle 48.6°, both outside the others\' spread, so they are not used. Mean 46.9°, recorded as 47° ±1°. ' +
      'Replaces 48° (ballparks.com lists 45°).',
  },
  {
    stadiumId: 'reds',
    imageCenter: { latitude: 39.09744, longitude: -84.50697 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3908460_ne_17_030_20230522',
    acquired: '2023-05-22',
    nativeResolutionMeters: 0.3,
    homeSeedPx: [271.1, 284.8],
    moundSeedPx: [334, 323],
    homeCenterPx: [271.1, 284.8],
    moundCenterPx: [334.02, 323.02],
    bearingHomeToMoundDeg: 121.27,
    bearingInfieldSymmetryDeg: 121.8,
    orientationDeg: 122,
    precisionDeg: 1,
    grassRule: 'slight-blue-cast',
    measuredOn: '2026-11-11',
    notes:
      'Grass reads only a little greener than blue (g − b ≈ 3), hence grassRule \'slight-blue-cast\'. Home → mound 121.27°; infield mirror axis ' +
      '121.8° (89.8% overlap); the infield grass square\'s edges 122.3° (spread 1.9°). Chalk foul lines 20–60 m out: midline 122.85–123.0°; 30–95 m ' +
      'out on a 260 m-wide image of the same flight: 168.1° and 75.3°, midline 121.7–122.8°. The dirt-arc circle (90 of 111 rays) lands at ' +
      '117.9–118.7°, 3–4° off the rest, so it is not used. Mean of the others 122.25°, recorded as 122° ±1°. Replaces 115° (ballparks.com lists 120°).',
  },
  {
    stadiumId: 'pirates',
    imageCenter: { latitude: 40.44704, longitude: -80.00609 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_4008040_ne_17_060_20220509',
    acquired: '2022-05-09',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [268.5, 290],
    moundSeedPx: [333.5, 320.5],
    homeCenterPx: [268.5, 290],
    moundCenterPx: [333.89, 320.82],
    bearingHomeToMoundDeg: 115.24,
    bearingInfieldSymmetryDeg: 115.6,
    orientationDeg: 116,
    precisionDeg: 1.5,
    measuredOn: '2026-11-11',
    notes:
      'Home plate under a grey cover (fitted by eye from its edges at 268.5, 290–290.5), mound under a logo cover. Home → mound 115.24°; infield ' +
      'mirror axis 115.6° (96.5% overlap); a circle fitted to the infield dirt\'s outer edge (88 of 111 rays; radius 29.5 m) is centred 116.6° from ' +
      'home; the infield grass square\'s edges 117.15° (spread 1.4°). Chalk foul lines 20–60 m out: midline 116.0–117.35°; 30–95 m out on a 260 m-wide ' +
      'image of the same flight: 162.3° and 69.2°, midline 115.7–117.0°. Mean 116.3°, recorded as 116° with ±1.5° for the spread (115.2–117.35°). ' +
      'Replaces 120° (ballparks.com lists 120°).',
  },
  {
    stadiumId: 'tigers',
    imageCenter: { latitude: 42.33922, longitude: -83.04880 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_4208348_ne_17_060_20220730',
    acquired: '2022-07-30',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [243.27, 196.23],
    moundSeedPx: [276.57, 257.74],
    homeCenterPx: [243.27, 196.23],
    moundCenterPx: [276.96, 258.03],
    bearingHomeToMoundDeg: 151.4,
    bearingInfieldSymmetryDeg: 150.8,
    orientationDeg: 151,
    precisionDeg: 1,
    measuredOn: '2026-11-11',
    notes:
      'Home plate under a blue cover. Home → mound 151.4°; infield mirror axis 150.8° (96.8% overlap); a circle fitted to the infield dirt\'s outer ' +
      'edge (108 of 111 rays, radius 29.1 m) is centred 151.3° from home; the infield grass square\'s edges 150.9° (spread 3.8°). Chalk foul lines ' +
      '20–60 m out: 195.95° and 105.9°, midline 150.9°; 30–95 m out on a 260 m-wide image of the same flight: 195.6° and 104.7°, midline ' +
      '150.1–151.35°. Mean 151.0°, recorded as 151° ±1°. Replaces 145° (ballparks.com lists 150°).',
  },
  {
    stadiumId: 'guardians',
    imageCenter: { latitude: 41.49581, longitude: -81.68528 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_4108135_ne_17_030_20230526',
    acquired: '2023-05-26',
    nativeResolutionMeters: 0.3,
    homeSeedPx: [299.29, 412.72],
    moundSeedPx: [298.49, 344.46],
    homeCenterPx: [299.29, 412.72],
    moundCenterPx: [298, 344],
    bearingHomeToMoundDeg: 358.92,
    bearingInfieldSymmetryDeg: 359.2,
    orientationDeg: 0,
    precisionDeg: 1.5,
    grassRule: 'slight-blue-cast',
    measuredOn: '2026-11-11',
    notes:
      'Grass reads only a little greener than blue (76, 85, 76), hence grassRule \'slight-blue-cast\'. Home → mound 358.92°; infield mirror axis ' +
      '359.2° (94.5% overlap); the infield grass square\'s edges 1.25° (spread 4°). Chalk foul lines 20–60 m out: 45.6° and 313.5°, midline 359.55°; ' +
      '30–95 m out on a 260 m-wide image of the same flight: midline 359.9–0.6°. A circle fitted to the infield dirt\'s outer edge kept only 49 of 98 ' +
      'rays (the third-base side is in the stands\' shadow) and lands at 358.3°, so it is not used. Mean of the others 359.9°, recorded as 0° with ' +
      '±1.5° for the spread (358.9–1.25°). Replaces 356°.',
  },
  {
    stadiumId: 'twins',
    imageCenter: { latitude: 44.98171, longitude: -93.27792 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_4409306_ne_15_060_20210618',
    acquired: '2021-06-18',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [180, 292],
    moundSeedPx: [253.58, 294.29],
    homeCenterPx: [180, 292],
    moundCenterPx: [254, 294],
    bearingHomeToMoundDeg: 91.55,
    bearingInfieldSymmetryDeg: 90.6,
    orientationDeg: 91,
    precisionDeg: 1,
    grassRule: 'slight-blue-cast',
    measuredOn: '2026-11-11',
    notes:
      'Grass reads only a little greener than blue (61, 86, 84), hence grassRule \'slight-blue-cast\'. Home → mound 91.55°; infield mirror axis ' +
      '90.6° (91.7% overlap); a circle fitted to the infield dirt\'s outer edge (103 of 111 rays, radius 29.7 m) is centred 91.55° from home; the ' +
      'infield grass square\'s edges 90.6° (spread 3.8°). Chalk foul lines 20–60 m out: midline 90.5°; 30–95 m out on a 260 m-wide image of the ' +
      'same flight: 135.5° and 44.8°, midline 90.1–90.55°. Mean 90.8°, recorded as 91° ±1°. Replaces 90° (ballparks.com lists 90°).',
  },
  {
    stadiumId: 'whitesox',
    imageCenter: { latitude: 41.83000, longitude: -87.63397 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_4108711_ne_16_060_20190802',
    acquired: '2019-08-02',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [211, 214],
    moundSeedPx: [265.18, 259.79],
    homeCenterPx: [211, 214],
    moundCenterPx: [265.22, 259.65],
    bearingHomeToMoundDeg: 130.1,
    bearingInfieldSymmetryDeg: 128.6,
    orientationDeg: 129,
    precisionDeg: 2,
    measuredOn: '2026-11-11',
    notes:
      'The only USGS flight here (2019, 0.6 m) is an afternoon one: the first-base stands\' shadow covers home plate\'s left half and the ' +
      'first-base line. Home is read from the sunlit edges of the home-plate circle (top 418, right 447 on the 260 m image, radius 16 px), so it ' +
      'is fixed by eye, not refined. Home → mound 130.1°; infield mirror axis 128.6° (90% overlap; the shadow counts as non-grass); home → the ' +
      'centre of a circle fitted to the sunlit infield dirt edge (104 of 108 rays) 130.45°. The third-base chalk line is in the sun: 84.5° at ' +
      '20–60 m, 82.9–84.0° at 30–95 m, and the left-field corner sits 82.6° from home, so the axis is 127.6–129.5° (the lines are square). The ' +
      'sunlit edges of the grass square give 127.6° and 129.6°. The first-base line\'s fits (172–177°) follow the shadow\'s edge and are not used. ' +
      'Mean 128.9°, recorded as 129° ±2° for the shadow. Replaces 120°.',
  },
  {
    stadiumId: 'athletics',
    imageCenter: { latitude: 38.58040, longitude: -121.51380 },
    imageHalfWidthMeters: 75,
    imageSizePx: 600,
    naipTile: 'm_3812128_ne_10_060_20220621',
    acquired: '2022-06-21',
    nativeResolutionMeters: 0.6,
    homeSeedPx: [211.71, 382.31],
    moundSeedPx: [264.2, 335.49],
    homeCenterPx: [211.71, 382.31],
    moundCenterPx: [264, 335],
    bearingHomeToMoundDeg: 47.86,
    bearingInfieldSymmetryDeg: 47.1,
    orientationDeg: 47,
    precisionDeg: 1.5,
    measuredOn: '2026-11-11',
    notes:
      'Sutter Health Park, the Athletics\' home in 2025. Home → mound 47.86°; infield mirror axis 47.1° (93.3% overlap); a circle fitted to the ' +
      'infield dirt\'s outer edge (all 111 rays, radius 29.1 m) is centred 47.2° from home; the infield grass square\'s edges 46.7° (spread ' +
      '1.1°). Chalk foul lines 30–95 m out on a 260 m-wide image of the same flight: 93.0° and 1.5°, midline 45.7–47.3° (the 20–60 m fit put ' +
      'them 96° apart, so it is not used). Mean 47.0°, recorded as 47° with ±1.5° for the spread (45.7–47.9°). Replaces 20°, which was 27° low.',
  },
];

export function getOrientationMeasurement(stadiumId: string): OrientationMeasurement | undefined {
  return ORIENTATION_MEASUREMENTS.find((m) => m.stadiumId === stadiumId);
}
