const POINTS = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];

/** Nearest of the 16 compass points, e.g. 75 → 'ENE'. Works for any angle. */
export function compassPoint(degrees: number): string {
  const d = ((degrees % 360) + 360) % 360;
  return POINTS[Math.round(d / 22.5) % 16];
}
