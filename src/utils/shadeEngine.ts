/**
 * Row-level shade engine.
 *
 * One question per row: is the straight line from a seated fan's head to the
 * sun blocked by the ballpark? It is answered in the vertical plane through
 * the seat that runs straight back through its stand (the "cross-section"),
 * which is how grandstand shading is worked out by hand:
 *
 *   - Sun BEHIND the stand (within 90° of the direction the stand's back
 *     faces): the ray from the head climbs back over the rows behind. It is
 *     blocked by the stand itself rising behind the fan, by whatever sits on
 *     top of the stand (concourse wall, upper deck, press box), or by the
 *     underside of a deck overhead.
 *   - Sun IN FRONT (the fan faces it): the ray climbs out over the field. Only
 *     the lip of a deck overhead can block it, or, when the sun is low, the
 *     far side of the stadium.
 *
 * In that plane the sun's elevation is steeper than its true elevation by a
 * factor 1 / |cos ψ|, where ψ is the angle between the sun's azimuth and the
 * stand's back direction: sun low and off to one side still clears a stand
 * whose rows it runs along. This is the standard "shadow angle" method.
 *
 * Inputs are a stand profile (rows, heights, overhang, what is behind) and
 * the sun's position from the NREL SPA (solarPosition.ts). Nothing here knows
 * about any particular park; park data lives in src/data/stadiumStructures.ts.
 */

const DEG = Math.PI / 180;

/** Seated eye height above the row's tread, feet. */
export const EYE_HEIGHT_FT = 3.5;
/** A seated fan's head sits this far back from the front edge of the row, feet. */
export const HEAD_SETBACK_FT = 1.25;
/** Seat-back top above the row's tread, feet (the stand behind a fan). */
export const SEAT_BACK_FT = 2.8;
/** Typical row depth (tread), feet. */
export const DEFAULT_TREAD_FT = 2.75;

export interface StandProfile {
  /** Number of rows in the section. */
  rows: number;
  /** Height of the front row's tread above the field, feet. */
  frontRowHeightFt: number;
  /** Rake: angle of the seating slope, degrees. */
  rakeDeg: number;
  /** Row depth, feet. */
  treadFt?: number;
  /**
   * A deck or roof above the back of the section: rows from `coveredFromRow`
   * (1 = front row) to the back are under it. `soffitHeightFt` is the height
   * of its underside above the field.
   */
  overhang?: { coveredFromRow: number; soffitHeightFt: number };
  /** Height above the field of the top of whatever stands right behind the last row. */
  backHeightFt: number;
}

export interface ParkEnvelope {
  roof: 'open' | 'retractable' | 'fixed';
  /** Height of the stadium's far rim (upper deck or roof line), feet above the field. */
  farRimHeightFt: number;
  /** Typical horizontal distance from a seat to the stands across the field, feet. */
  fieldCrossingFt: number;
}

export interface SunAngles {
  azimuthDeg: number;
  /** Apparent elevation (with refraction). */
  altitudeDeg: number;
}

export type RowLight = 'sun' | 'shade';

const angleBetween = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

/**
 * Whether each row of a section (front row first) is in direct sun.
 * `standCompassDeg` is the compass direction the stand's back faces.
 */
export function rowLight(
  stand: StandProfile,
  standCompassDeg: number,
  park: ParkEnvelope,
  sun: SunAngles,
): RowLight[] {
  const rows = Math.max(1, Math.round(stand.rows));
  if (park.roof === 'fixed' || sun.altitudeDeg <= 0) return Array(rows).fill('shade');

  const tread = stand.treadFt ?? DEFAULT_TREAD_FT;
  const rise = tread * Math.tan(stand.rakeDeg * DEG);
  const psi = angleBetween(sun.azimuthDeg, standCompassDeg) * DEG;
  const cosPsi = Math.cos(psi);
  const tanSun = Math.tan(sun.altitudeDeg * DEG);
  // Slope of the ray in the cross-section; huge when the sun runs along the rows.
  const tanPlane = tanSun / Math.max(Math.abs(cosPsi), 1e-9);
  const sunBehind = cosPsi > 0;

  const coveredFrom = stand.overhang ? Math.max(1, stand.overhang.coveredFromRow) : Infinity;
  // The deck's front edge sits over the front of the first covered row.
  const lipU = (coveredFrom - 1) * tread;
  const backU = rows * tread;
  const lastRowZ = stand.frontRowHeightFt + (rows - 1) * rise;

  return Array.from({ length: rows }, (_, index): RowLight => {
    const u = index * tread + HEAD_SETBACK_FT;
    const headZ = stand.frontRowHeightFt + index * rise + EYE_HEIGHT_FT;
    const covered = index + 1 >= coveredFrom;

    if (sunBehind) {
      // Under a deck that runs back over the seat: the ray hits its underside.
      if (covered) return 'shade';
      const obstacles: Array<[number, number]> = [
        // The stand itself: the last row's seat backs.
        [backU - tread + HEAD_SETBACK_FT - u, lastRowZ + SEAT_BACK_FT - headZ],
        // Whatever stands on top of the back of the stand.
        [backU - u, stand.backHeightFt - headZ],
      ];
      if (stand.overhang) obstacles.push([lipU - u, stand.overhang.soffitHeightFt - headZ]);
      const blocked = obstacles.some(([du, dz]) => du > 0 && dz > 0 && dz / du > tanPlane);
      return blocked ? 'shade' : 'sun';
    }

    // Sun in front. Under a deck, the ray rises toward the deck's front edge
    // (`toLip` ahead). If it has climbed past the underside by then, it hit
    // the deck: shade. If it is still below, it leaves under the lip: a low
    // sun shines in under the roof.
    if (covered && stand.overhang) {
      const toLip = u - lipU;
      const clearance = stand.overhang.soffitHeightFt - headZ;
      if (clearance <= 0 || toLip * tanPlane >= clearance) return 'shade';
    }
    const rimRise = park.farRimHeightFt - headZ;
    if (rimRise > 0 && tanSun < rimRise / park.fieldCrossingFt) return 'shade';
    return 'sun';
  });
}

/** Fraction of a section's rows in shade, 0–1. */
export function shadedFraction(light: readonly RowLight[]): number {
  if (light.length === 0) return 1;
  return light.filter((l) => l === 'shade').length / light.length;
}

export type ShadeStatus = 'shaded' | 'partial' | 'sun';

/** 75% or more of rows shaded is Shaded, 25% or less is Sun, otherwise Partial. */
export function statusFor(fraction: number): ShadeStatus {
  if (fraction >= 0.75) return 'shaded';
  if (fraction <= 0.25) return 'sun';
  return 'partial';
}
