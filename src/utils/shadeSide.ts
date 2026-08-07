// Shared orientation → shaded-side helper (audit Phase 3/4).
//
// Uses the same compass model as StadiumPageSSR and sectionSunCalculations:
// `orientation` is the compass bearing from home plate to center field.
// Returns the side of the park that falls into shade first for a ~1 PM day
// game, so on-page copy and JSON-LD FAQ answers agree and are orientation-aware
// (e.g. an east-facing park like Yankee Stadium correctly yields the first base
// side, not a naive orientation<180 guess).

const compassOf = (
  orientation: number,
  side: 'firstBase' | 'thirdBase' | 'behindHome' | 'centerField',
): number => {
  const offset =
    side === 'firstBase' ? 90 : side === 'thirdBase' ? -90 : side === 'behindHome' ? 180 : 0;
  return ((orientation + offset) % 360 + 360) % 360;
};

// Approximate midday (1 PM) sun azimuth in NH summer at mid-latitudes: ~S.
const MIDDAY_SUN_AZIMUTH = 180;

// Every caller renders this as "the {phrase} falls into shade first" or
// "Shade first on the {phrase}", so the phrases have to read grammatically
// after a definite article. The bare labels used to be "behind home plate" and
// "outfield (center field)", which produced "the behind home plate falls into
// shade first" on the venue page, the OG image and the JSON-LD FAQ answer for
// every park whose home-plate side shades first.
export function bestShadedSideForDayGame(orientation: number): string {
  const sides = [
    { name: 'first base side', compass: compassOf(orientation, 'firstBase') },
    { name: 'third base side', compass: compassOf(orientation, 'thirdBase') },
    { name: 'seating behind home plate', compass: compassOf(orientation, 'behindHome') },
    { name: 'outfield seating beyond center field', compass: compassOf(orientation, 'centerField') },
  ];
  let best = sides[0];
  let bestDiff = 360;
  for (const s of sides) {
    let d = Math.abs(MIDDAY_SUN_AZIMUTH - s.compass);
    if (d > 180) d = 360 - d;
    if (d < bestDiff) {
      bestDiff = d;
      best = s;
    }
  }
  return best.name;
}
