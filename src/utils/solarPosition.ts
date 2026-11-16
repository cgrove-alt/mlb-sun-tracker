/**
 * NREL Solar Position Algorithm (SPA): the single source of truth for where
 * the sun is.
 *
 *   Reda, I. and Andreas, A. "Solar Position Algorithm for Solar Radiation
 *   Applications." NREL/TP-560-34302, revised January 2008.
 *   https://www.nrel.gov/docs/fy08osti/34302.pdf
 *
 * Stated uncertainty: ±0.0003° from the year −2000 to 6000. The periodic-term
 * tables below are the paper's Tables A4.2 (Earth: L, B, R) and A4.3
 * (nutation). `spa.test.ts` checks every intermediate value of the paper's own
 * worked example, so a typo in a table fails the build.
 *
 * Conventions:
 *   - Input is a real UTC `Date`. Convert stadium wall-clock time first
 *     (`stadiumLocalDateAndTimeToUTC`). UTC is used as UT (|UT1 − UTC| < 0.9 s,
 *     under 0.004° of sun movement).
 *   - Longitude is east-positive, latitude north-positive (WGS84).
 *   - Azimuth is compass degrees: 0 = north, 90 = east, 180 = south, 270 = west.
 *   - `altitudeDegrees` is the topocentric elevation the sun APPEARS at, with
 *     atmospheric refraction. Shadows follow the apparent sun, which matters
 *     most for evening games, when the sun is within a few degrees of the
 *     horizon and shadow length ≈ height / tan(altitude).
 */

export interface SolarPosition {
  /** Topocentric azimuth, compass degrees [0, 360). 0 = N, 90 = E, 180 = S, 270 = W. */
  azimuthDegrees: number;
  /** Apparent topocentric elevation in degrees (with refraction). */
  altitudeDegrees: number;
  /** Topocentric elevation without refraction, in degrees. */
  geometricAltitudeDegrees: number;
  /** Atmospheric refraction correction applied, in degrees. */
  refractionDegrees: number;
  /** Topocentric zenith angle, in degrees (90 − altitudeDegrees). */
  zenithDegrees: number;
}

export interface SpaOptions {
  /** Observer elevation above sea level, metres. Default 0. */
  elevationMeters?: number;
  /** Mean annual local pressure, millibars. Default: standard atmosphere at `elevationMeters`. */
  pressureMbar?: number;
  /** Mean annual local temperature, °C. Default 15. */
  temperatureC?: number;
  /** TT − UT, seconds. Default `DEFAULT_DELTA_T_SECONDS`. */
  deltaTSeconds?: number;
}

/**
 * TT − UT for 2025: TT − TAI (32.184 s) + TAI − UTC (37 s) − (UT1 − UTC,
 * about +0.05 s through 2025 per IERS Bulletin A) ≈ 69.1 s. A 1 s error here
 * moves the sun by about 0.004°.
 */
export const DEFAULT_DELTA_T_SECONDS = 69.1;

const SUN_RADIUS_DEG = 0.26667;
const STANDARD_REFRACTION_DEG = 0.5667;

const DEG = Math.PI / 180;
const rad = (d: number) => d * DEG;
const deg = (r: number) => r / DEG;
const limitDegrees = (d: number) => {
  const x = d % 360;
  return x < 0 ? x + 360 : x;
};

type Term = readonly [number, number, number];

// Table A4.2: Earth periodic terms. Each row is [A, B, C]; a term is A·cos(B + C·JME).
const L0: readonly Term[] = [
  [175347046, 0, 0], [3341656, 4.6692568, 6283.07585], [34894, 4.6261, 12566.1517],
  [3497, 2.7441, 5753.3849], [3418, 2.8289, 3.5231], [3136, 3.6277, 77713.7715],
  [2676, 4.4181, 7860.4194], [2343, 6.1352, 3930.2097], [1324, 0.7425, 11506.7698],
  [1273, 2.0371, 529.691], [1199, 1.1096, 1577.3435], [990, 5.233, 5884.927],
  [902, 2.045, 26.298], [857, 3.508, 398.149], [780, 1.179, 5223.694],
  [753, 2.533, 5507.553], [505, 4.583, 18849.228], [492, 4.205, 775.523],
  [357, 2.92, 0.067], [317, 5.849, 11790.629], [284, 1.899, 796.298],
  [271, 0.315, 10977.079], [243, 0.345, 5486.778], [206, 4.806, 2544.314],
  [205, 1.869, 5573.143], [202, 2.458, 6069.777], [156, 0.833, 213.299],
  [132, 3.411, 2942.463], [126, 1.083, 20.775], [115, 0.645, 0.98],
  [103, 0.636, 4694.003], [102, 0.976, 15720.839], [102, 4.267, 7.114],
  [99, 6.21, 2146.17], [98, 0.68, 155.42], [86, 5.98, 161000.69],
  [85, 1.3, 6275.96], [85, 3.67, 71430.7], [80, 1.81, 17260.15],
  [79, 3.04, 12036.46], [75, 1.76, 5088.63], [74, 3.5, 3154.69],
  [74, 4.68, 801.82], [70, 0.83, 9437.76], [62, 3.98, 8827.39],
  [61, 1.82, 7084.9], [57, 2.78, 6286.6], [56, 4.39, 14143.5],
  [56, 3.47, 6279.55], [52, 0.19, 12139.55], [52, 1.33, 1748.02],
  [51, 0.28, 5856.48], [49, 0.49, 1194.45], [41, 5.37, 8429.24],
  [41, 2.4, 19651.05], [39, 6.17, 10447.39], [37, 6.04, 10213.29],
  [37, 2.57, 1059.38], [36, 1.71, 2352.87], [36, 1.78, 6812.77],
  [33, 0.59, 17789.85], [30, 0.44, 83996.85], [30, 2.74, 1349.87],
  [25, 3.16, 4690.48],
];
const L1: readonly Term[] = [
  [628331966747, 0, 0], [206059, 2.678235, 6283.07585], [4303, 2.6351, 12566.1517],
  [425, 1.59, 3.523], [119, 5.796, 26.298], [109, 2.966, 1577.344],
  [93, 2.59, 18849.23], [72, 1.14, 529.69], [68, 1.87, 398.15],
  [67, 4.41, 5507.55], [59, 2.89, 5223.69], [56, 2.17, 155.42],
  [45, 0.4, 796.3], [36, 0.47, 775.52], [29, 2.65, 7.11],
  [21, 5.34, 0.98], [19, 1.85, 5486.78], [19, 4.97, 213.3],
  [17, 2.99, 6275.96], [16, 0.03, 2544.31], [16, 1.43, 2146.17],
  [15, 1.21, 10977.08], [12, 2.83, 1748.02], [12, 3.26, 5088.63],
  [12, 5.27, 1194.45], [12, 2.08, 4694], [11, 0.77, 553.57],
  [10, 1.3, 6286.6], [10, 4.24, 1349.87], [9, 2.7, 242.73],
  [9, 5.64, 951.72], [8, 5.3, 2352.87], [6, 2.65, 9437.76],
  [6, 4.67, 4690.48],
];
const L2: readonly Term[] = [
  [52919, 0, 0], [8720, 1.0721, 6283.0758], [309, 0.867, 12566.152],
  [27, 0.05, 3.52], [16, 5.19, 26.3], [16, 3.68, 155.42],
  [10, 0.76, 18849.23], [9, 2.06, 77713.77], [7, 0.83, 775.52],
  [5, 4.66, 1577.34], [4, 1.03, 7.11], [4, 3.44, 5573.14],
  [3, 5.14, 796.3], [3, 6.05, 5507.55], [3, 1.19, 242.73],
  [3, 6.12, 529.69], [3, 0.31, 398.15], [3, 2.28, 553.57],
  [2, 4.38, 5223.69], [2, 3.75, 0.98],
];
const L3: readonly Term[] = [
  [289, 5.844, 6283.076], [35, 0, 0], [17, 5.49, 12566.15],
  [3, 5.2, 155.42], [1, 4.72, 3.52], [1, 5.3, 18849.23],
  [1, 5.97, 242.73],
];
const L4: readonly Term[] = [[114, 3.142, 0], [8, 4.13, 6283.08], [1, 3.84, 12566.15]];
const L5: readonly Term[] = [[1, 3.14, 0]];

const B0: readonly Term[] = [
  [280, 3.199, 84334.662], [102, 5.422, 5507.553], [80, 3.88, 5223.69],
  [44, 3.7, 2352.87], [32, 4, 1577.34],
];
const B1: readonly Term[] = [[9, 3.9, 5507.55], [6, 1.73, 5223.69]];

const R0: readonly Term[] = [
  [100013989, 0, 0], [1670700, 3.0984635, 6283.07585], [13956, 3.05525, 12566.1517],
  [3084, 5.1985, 77713.7715], [1628, 1.1739, 5753.3849], [1576, 2.8469, 7860.4194],
  [925, 5.453, 11506.77], [542, 4.564, 3930.21], [472, 3.661, 5884.927],
  [346, 0.964, 5507.553], [329, 5.9, 5223.694], [307, 0.299, 5573.143],
  [243, 4.273, 11790.629], [212, 5.847, 1577.344], [186, 5.022, 10977.079],
  [175, 3.012, 18849.228], [110, 5.055, 5486.778], [98, 0.89, 6069.78],
  [86, 5.69, 15720.84], [86, 1.27, 161000.69], [65, 0.27, 17260.15],
  [63, 0.92, 529.69], [57, 2.01, 83996.85], [56, 5.24, 71430.7],
  [49, 3.25, 2544.31], [47, 2.58, 775.52], [45, 5.54, 9437.76],
  [43, 6.01, 6275.96], [39, 5.36, 4694], [38, 2.39, 8827.39],
  [37, 0.83, 19651.05], [37, 4.9, 12139.55], [36, 1.67, 12036.46],
  [35, 1.84, 2942.46], [33, 0.24, 7084.9], [32, 0.18, 5088.63],
  [32, 1.78, 398.15], [28, 1.21, 6286.6], [28, 1.9, 6279.55],
  [26, 4.59, 10447.39],
];
const R1: readonly Term[] = [
  [103019, 1.10749, 6283.07585], [1721, 1.0644, 12566.1517], [702, 3.142, 0],
  [32, 1.02, 18849.23], [31, 2.84, 5507.55], [25, 1.32, 5223.69],
  [18, 1.42, 1577.34], [10, 5.91, 10977.08], [9, 1.42, 6275.96],
  [9, 0.27, 5486.78],
];
const R2: readonly Term[] = [
  [4359, 5.7846, 6283.0758], [124, 5.579, 12566.152], [12, 3.14, 0],
  [9, 3.63, 77713.77], [6, 1.87, 5573.14], [3, 5.47, 18849.23],
];
const R3: readonly Term[] = [[145, 4.273, 6283.076], [7, 3.92, 12566.15]];
const R4: readonly Term[] = [[4, 2.56, 6283.08]];

/** Table A4.3: multiples of X0..X4 in each nutation argument. */
const NUTATION_Y: readonly (readonly [number, number, number, number, number])[] = [
  [0, 0, 0, 0, 1], [-2, 0, 0, 2, 2], [0, 0, 0, 2, 2], [0, 0, 0, 0, 2], [0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0], [-2, 1, 0, 2, 2], [0, 0, 0, 2, 1], [0, 0, 1, 2, 2], [-2, -1, 0, 2, 2],
  [-2, 0, 1, 0, 0], [-2, 0, 0, 2, 1], [0, 0, -1, 2, 2], [2, 0, 0, 0, 0], [0, 0, 1, 0, 1],
  [2, 0, -1, 2, 2], [0, 0, -1, 0, 1], [0, 0, 1, 2, 1], [-2, 0, 2, 0, 0], [0, 0, -2, 2, 1],
  [2, 0, 0, 2, 2], [0, 0, 2, 2, 2], [0, 0, 2, 0, 0], [-2, 0, 1, 2, 2], [0, 0, 0, 2, 0],
  [-2, 0, 0, 2, 0], [0, 0, -1, 2, 1], [0, 2, 0, 0, 0], [2, 0, -1, 0, 1], [-2, 2, 0, 2, 2],
  [0, 1, 0, 0, 1], [-2, 0, 1, 0, 1], [0, -1, 0, 0, 1], [0, 0, 2, -2, 0], [2, 0, -1, 2, 1],
  [2, 0, 1, 2, 2], [0, 1, 0, 2, 2], [-2, 1, 1, 0, 0], [0, -1, 0, 2, 2], [2, 0, 0, 2, 1],
  [2, 0, 1, 0, 0], [-2, 0, 2, 2, 2], [-2, 0, 1, 2, 1], [2, 0, -2, 0, 1], [2, 0, 0, 0, 1],
  [0, -1, 1, 0, 0], [-2, -1, 0, 2, 1], [-2, 0, 0, 0, 1], [0, 0, 2, 2, 1], [-2, 0, 2, 0, 1],
  [-2, 1, 0, 2, 1], [0, 0, 1, -2, 0], [-1, 0, 1, 0, 0], [-2, 1, 0, 0, 0], [1, 0, 0, 0, 0],
  [0, 0, 1, 2, 0], [0, 0, -2, 2, 2], [-1, -1, 1, 0, 0], [0, 1, 1, 0, 0], [0, -1, 1, 2, 2],
  [2, -1, -1, 2, 2], [0, 0, 3, 2, 2], [2, -1, 0, 2, 2],
];

/** Table A4.3: [a, b, c, d]; Δψ term = (a + b·JCE)·sin(arg), Δε term = (c + d·JCE)·cos(arg), in 0.0001″. */
const NUTATION_PE: readonly (readonly [number, number, number, number])[] = [
  [-171996, -174.2, 92025, 8.9], [-13187, -1.6, 5736, -3.1], [-2274, -0.2, 977, -0.5],
  [2062, 0.2, -895, 0.5], [1426, -3.4, 54, -0.1], [712, 0.1, -7, 0],
  [-517, 1.2, 224, -0.6], [-386, -0.4, 200, 0], [-301, 0, 129, -0.1],
  [217, -0.5, -95, 0.3], [-158, 0, 0, 0], [129, 0.1, -70, 0],
  [123, 0, -53, 0], [63, 0, 0, 0], [63, 0.1, -33, 0],
  [-59, 0, 26, 0], [-58, -0.1, 32, 0], [-51, 0, 27, 0],
  [48, 0, 0, 0], [46, 0, -24, 0], [-38, 0, 16, 0],
  [-31, 0, 13, 0], [29, 0, 0, 0], [29, 0, -12, 0],
  [26, 0, 0, 0], [-22, 0, 0, 0], [21, 0, -10, 0],
  [17, -0.1, 0, 0], [16, 0, -8, 0], [-16, 0.1, 7, 0],
  [-15, 0, 9, 0], [-13, 0, 7, 0], [-12, 0, 6, 0],
  [11, 0, 0, 0], [-10, 0, 5, 0], [-8, 0, 3, 0],
  [7, 0, -3, 0], [-7, 0, 0, 0], [-7, 0, 3, 0],
  [-7, 0, 3, 0], [6, 0, 0, 0], [6, 0, -3, 0],
  [6, 0, -3, 0], [-6, 0, 3, 0], [-6, 0, 3, 0],
  [5, 0, 0, 0], [-5, 0, 3, 0], [-5, 0, 3, 0],
  [-5, 0, 3, 0], [4, 0, 0, 0], [4, 0, 0, 0],
  [4, 0, 0, 0], [-4, 0, 0, 0], [-4, 0, 0, 0],
  [-4, 0, 0, 0], [3, 0, 0, 0], [-3, 0, 0, 0],
  [-3, 0, 0, 0], [-3, 0, 0, 0], [-3, 0, 0, 0],
  [-3, 0, 0, 0], [-3, 0, 0, 0], [-3, 0, 0, 0],
];

function earthValue(tables: readonly (readonly Term[])[], jme: number): number {
  let total = 0;
  for (let i = 0; i < tables.length; i++) {
    let sum = 0;
    for (const [a, b, c] of tables[i]) sum += a * Math.cos(b + c * jme);
    total += sum * Math.pow(jme, i);
  }
  return total / 1e8;
}

/** Every intermediate value of the SPA, named as in the paper (degrees unless noted). */
export interface SpaResult {
  jd: number;
  jde: number;
  jc: number;
  jce: number;
  jme: number;
  /** Earth heliocentric longitude L. */
  L: number;
  /** Earth heliocentric latitude B. */
  B: number;
  /** Earth radius vector R, astronomical units. */
  R: number;
  /** Geocentric longitude Θ. */
  theta: number;
  /** Geocentric latitude β. */
  beta: number;
  deltaPsi: number;
  deltaEpsilon: number;
  /** True obliquity of the ecliptic ε. */
  epsilon: number;
  /** Apparent sun longitude λ. */
  lambda: number;
  /** Apparent sidereal time at Greenwich ν. */
  nu: number;
  /** Geocentric right ascension α. */
  alpha: number;
  /** Geocentric declination δ. */
  delta: number;
  /** Observer local hour angle H. */
  H: number;
  /** Topocentric declination δ′. */
  deltaPrime: number;
  /** Topocentric local hour angle H′. */
  HPrime: number;
  /** Topocentric elevation without refraction e0. */
  e0: number;
  /** Refraction correction Δe. */
  deltaE: number;
  /** Topocentric elevation with refraction e. */
  e: number;
  /** Topocentric zenith angle θ. */
  zenith: number;
  /** Topocentric azimuth Φ, measured eastward from north. */
  azimuth: number;
}

export function standardPressureMbar(elevationMeters: number): number {
  return 1013.25 * Math.pow(1 - 2.25577e-5 * elevationMeters, 5.25588);
}

/** SPA atmospheric refraction (Eq. 42), degrees. Zero when the sun is fully below the horizon. */
export function spaRefractionDegrees(
  geometricElevationDeg: number,
  pressureMbar = 1013.25,
  temperatureC = 15,
): number {
  if (geometricElevationDeg < -(SUN_RADIUS_DEG + STANDARD_REFRACTION_DEG)) return 0;
  return (
    (pressureMbar / 1010) *
    (283 / (273 + temperatureC)) *
    (1.02 / (60 * Math.tan(rad(geometricElevationDeg + 10.3 / (geometricElevationDeg + 5.11)))))
  );
}

/** Full SPA calculation (paper section 3, steps 3.1–3.15). */
export function spaCalculate(
  date: Date,
  latitude: number,
  longitude: number,
  options: SpaOptions = {},
): SpaResult {
  const elevation = options.elevationMeters ?? 0;
  const pressure = options.pressureMbar ?? standardPressureMbar(elevation);
  const temperature = options.temperatureC ?? 15;
  const deltaT = options.deltaTSeconds ?? DEFAULT_DELTA_T_SECONDS;

  // 3.1 Julian day, ephemeris day, centuries and millennium.
  const jd = date.getTime() / 86400000 + 2440587.5;
  const jde = jd + deltaT / 86400;
  const jc = (jd - 2451545) / 36525;
  const jce = (jde - 2451545) / 36525;
  const jme = jce / 10;

  // 3.2 Earth heliocentric longitude, latitude and radius vector.
  const L = limitDegrees(deg(earthValue([L0, L1, L2, L3, L4, L5], jme)));
  const B = deg(earthValue([B0, B1], jme));
  const R = earthValue([R0, R1, R2, R3, R4], jme);

  // 3.3 Geocentric longitude and latitude.
  const theta = limitDegrees(L + 180);
  const beta = -B;

  // 3.4 Nutation in longitude and obliquity.
  const x = [
    297.85036 + 445267.11148 * jce - 0.0019142 * jce * jce + (jce * jce * jce) / 189474,
    357.52772 + 35999.05034 * jce - 0.0001603 * jce * jce - (jce * jce * jce) / 300000,
    134.96298 + 477198.867398 * jce + 0.0086972 * jce * jce + (jce * jce * jce) / 56250,
    93.27191 + 483202.017538 * jce - 0.0036825 * jce * jce + (jce * jce * jce) / 327270,
    125.04452 - 1934.136261 * jce + 0.0020708 * jce * jce + (jce * jce * jce) / 450000,
  ];
  let sumPsi = 0;
  let sumEpsilon = 0;
  for (let i = 0; i < NUTATION_Y.length; i++) {
    const y = NUTATION_Y[i];
    const arg = rad(x[0] * y[0] + x[1] * y[1] + x[2] * y[2] + x[3] * y[3] + x[4] * y[4]);
    const [a, b, c, d] = NUTATION_PE[i];
    sumPsi += (a + b * jce) * Math.sin(arg);
    sumEpsilon += (c + d * jce) * Math.cos(arg);
  }
  const deltaPsi = sumPsi / 36000000;
  const deltaEpsilon = sumEpsilon / 36000000;

  // 3.5 True obliquity of the ecliptic.
  const u = jme / 10;
  const epsilon0 =
    84381.448 +
    u * (-4680.93 + u * (-1.55 + u * (1999.25 + u * (-51.38 + u * (-249.67 +
    u * (-39.05 + u * (7.12 + u * (27.87 + u * (5.79 + u * 2.45)))))))));
  const epsilon = epsilon0 / 3600 + deltaEpsilon;

  // 3.6–3.7 Aberration correction and apparent sun longitude.
  const deltaTau = -20.4898 / (3600 * R);
  const lambda = theta + deltaPsi + deltaTau;

  // 3.8 Apparent sidereal time at Greenwich.
  const nu0 = limitDegrees(
    280.46061837 + 360.98564736629 * (jd - 2451545) + jc * jc * (0.000387933 - jc / 38710000),
  );
  const nu = nu0 + deltaPsi * Math.cos(rad(epsilon));

  // 3.9–3.10 Geocentric right ascension and declination.
  const lambdaR = rad(lambda);
  const epsilonR = rad(epsilon);
  const betaR = rad(beta);
  const alpha = limitDegrees(
    deg(Math.atan2(Math.sin(lambdaR) * Math.cos(epsilonR) - Math.tan(betaR) * Math.sin(epsilonR), Math.cos(lambdaR))),
  );
  const delta = deg(
    Math.asin(Math.sin(betaR) * Math.cos(epsilonR) + Math.cos(betaR) * Math.sin(epsilonR) * Math.sin(lambdaR)),
  );

  // 3.11 Observer local hour angle.
  const H = limitDegrees(nu + longitude - alpha);

  // 3.12 Topocentric right ascension and declination (parallax).
  const xi = rad(8.794 / (3600 * R));
  const phi = rad(latitude);
  const uu = Math.atan(0.99664719 * Math.tan(phi));
  const xx = Math.cos(uu) + (elevation / 6378140) * Math.cos(phi);
  const yy = 0.99664719 * Math.sin(uu) + (elevation / 6378140) * Math.sin(phi);
  const HR = rad(H);
  const deltaR = rad(delta);
  const deltaAlphaR = Math.atan2(
    -xx * Math.sin(xi) * Math.sin(HR),
    Math.cos(deltaR) - xx * Math.sin(xi) * Math.cos(HR),
  );
  const deltaPrimeR = Math.atan2(
    (Math.sin(deltaR) - yy * Math.sin(xi)) * Math.cos(deltaAlphaR),
    Math.cos(deltaR) - xx * Math.sin(xi) * Math.cos(HR),
  );

  // 3.13 Topocentric local hour angle.
  const HPrime = H - deg(deltaAlphaR);
  const HPrimeR = rad(HPrime);

  // 3.14 Topocentric zenith angle.
  const e0 = deg(
    Math.asin(Math.sin(phi) * Math.sin(deltaPrimeR) + Math.cos(phi) * Math.cos(deltaPrimeR) * Math.cos(HPrimeR)),
  );
  const deltaE = spaRefractionDegrees(e0, pressure, temperature);
  const e = e0 + deltaE;
  const zenith = 90 - e;

  // 3.15 Topocentric azimuth, eastward from north.
  const gamma = deg(
    Math.atan2(Math.sin(HPrimeR), Math.cos(HPrimeR) * Math.sin(phi) - Math.tan(deltaPrimeR) * Math.cos(phi)),
  );
  const azimuth = limitDegrees(gamma + 180);

  return {
    jd, jde, jc, jce, jme, L, B, R, theta, beta, deltaPsi, deltaEpsilon, epsilon, lambda, nu,
    alpha, delta, H, deltaPrime: deg(deltaPrimeR), HPrime, e0, deltaE, e, zenith, azimuth,
  };
}

/** Sun position at a UTC instant for an observer at (latitude, longitude). */
export function getSolarPosition(
  date: Date,
  latitude: number,
  longitude: number,
  options: SpaOptions = {},
): SolarPosition {
  const spa = spaCalculate(date, latitude, longitude, options);
  return {
    azimuthDegrees: spa.azimuth,
    altitudeDegrees: spa.e,
    geometricAltitudeDegrees: spa.e0,
    refractionDegrees: spa.deltaE,
    zenithDegrees: spa.zenith,
  };
}

export interface SunTimes {
  solarNoon: Date;
  sunrise: Date;
  sunset: Date;
  /** Start of morning civil twilight (sun 6° below the horizon). */
  dawn: Date;
  /** End of evening civil twilight. */
  dusk: Date;
  /** Evening golden hour starts when the sun is 6° above the horizon. */
  goldenHour: Date;
}

/** Sunrise and sunset: the top of the sun's disc on the horizon with standard refraction. */
const HORIZON_EVENT_DEG = -(SUN_RADIUS_DEG + STANDARD_REFRACTION_DEG);

/**
 * Rise, set and transit for the local solar day containing `date`, found by
 * bisection on the SPA elevation (accurate to about a second). Times are UTC
 * `Date`s; format them in the stadium's time zone for display.
 */
export function getSunTimes(date: Date, latitude: number, longitude: number): SunTimes {
  const elevationAt = (ms: number) => spaCalculate(new Date(ms), latitude, longitude).e0;

  // Mean local noon of the solar day that contains `date`.
  const dayMs = 86400000;
  const localDay = Math.floor(date.getTime() / dayMs + longitude / 360);
  let noon = (localDay + 0.5 - longitude / 360) * dayMs;

  // Refine to the true transit (maximum elevation; the equation of time is
  // within ±17 minutes) with a golden-section search.
  let lo = noon - 30 * 60000;
  let hi = noon + 30 * 60000;
  const g = (Math.sqrt(5) - 1) / 2;
  while (hi - lo > 1000) {
    const a = hi - g * (hi - lo);
    const b = lo + g * (hi - lo);
    if (elevationAt(a) > elevationAt(b)) hi = b;
    else lo = a;
  }
  noon = (lo + hi) / 2;

  const crossing = (from: number, to: number, threshold: number) => {
    let a = from;
    let b = to;
    const rising = elevationAt(b) > elevationAt(a);
    if ((elevationAt(a) - threshold) * (elevationAt(b) - threshold) > 0) return new Date(NaN);
    while (b - a > 1000) {
      const m = (a + b) / 2;
      const above = elevationAt(m) > threshold;
      if (above === rising) b = m;
      else a = m;
    }
    return new Date(Math.round((a + b) / 2));
  };

  const morning = noon - dayMs / 2;
  const evening = noon + dayMs / 2;
  return {
    solarNoon: new Date(Math.round(noon)),
    sunrise: crossing(morning, noon, HORIZON_EVENT_DEG),
    sunset: crossing(noon, evening, HORIZON_EVENT_DEG),
    dawn: crossing(morning, noon, -6),
    dusk: crossing(noon, evening, -6),
    goldenHour: crossing(noon, evening, 6),
  };
}

/**
 * Convert compass azimuth (0 = N) to the historical SunCalc radian convention
 * (0 = south, π/2 = west) so callers that still read `azimuth` in radians keep
 * working.
 */
export function compassDegreesToSunCalcRadians(azimuthDegrees: number): number {
  return ((azimuthDegrees - 180) * Math.PI) / 180;
}
