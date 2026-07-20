import SunCalc from 'suncalc';

// Leaf module: sun position only. Deliberately imports NOTHING from the app's
// data layer so that first-load client components (the MLB shade diagram in
// StadiumPageSSR → InteractiveSeatingBowl) can compute the sun's position
// without dragging in `sunCalculations.ts`'s static `venueSections` import
// (~0.73 MB). `sunCalculations.ts` re-exports these for existing callers.

export interface SunPosition {
  azimuth: number; // Sun azimuth in radians (SunCalc convention)
  altitude: number; // Sun altitude in radians
  azimuthDegrees: number; // Compass degrees: 0=N, 90=E, 180=S, 270=W
  altitudeDegrees: number; // Degrees above the horizon
}

export function getSunPosition(
  date: Date,
  latitude: number,
  longitude: number,
): SunPosition {
  const sunPos = SunCalc.getPosition(date, latitude, longitude);

  // SunCalc's azimuth: 0=S, π/2=W, π=N, 3π/2=E. Convert to compass 0=N…270=W.
  const azimuthDegrees = ((sunPos.azimuth * 180 / Math.PI) + 180) % 360;
  const altitudeDegrees = sunPos.altitude * 180 / Math.PI;

  return {
    azimuth: sunPos.azimuth,
    altitude: sunPos.altitude,
    azimuthDegrees,
    altitudeDegrees,
  };
}
