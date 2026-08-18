import {
  compassDegreesToSunCalcRadians,
  getSolarPosition,
} from './solarPosition';

// Leaf module: sun position only. Deliberately imports NOTHING from the app's
// data layer so that first-load client components (the MLB shade diagram in
// StadiumPageSSR → InteractiveSeatingBowl) can compute the sun's position
// without dragging in `sunCalculations.ts`'s static `venueSections` import
// (~0.73 MB). `sunCalculations.ts` re-exports these for existing callers.

export interface SunPosition {
  azimuth: number; // radians, SunCalc convention (0 = south) — legacy field
  altitude: number; // apparent altitude in radians
  azimuthDegrees: number; // Compass degrees: 0=N, 90=E, 180=S, 270=W
  altitudeDegrees: number; // Apparent degrees above the horizon (with refraction)
  geometricAltitudeDegrees: number; // Unrefracted geometric altitude
}

export function getSunPosition(
  date: Date,
  latitude: number,
  longitude: number,
): SunPosition {
  const solar = getSolarPosition(date, latitude, longitude);

  return {
    azimuth: compassDegreesToSunCalcRadians(solar.azimuthDegrees),
    altitude: (solar.altitudeDegrees * Math.PI) / 180,
    azimuthDegrees: solar.azimuthDegrees,
    altitudeDegrees: solar.altitudeDegrees,
    geometricAltitudeDegrees: solar.geometricAltitudeDegrees,
  };
}
