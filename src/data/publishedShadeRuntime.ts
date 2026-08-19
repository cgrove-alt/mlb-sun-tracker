import { MLB_STADIUMS } from './stadiums';

/**
 * The evidence registry answers whether a park's physical inputs have passed
 * the publication thresholds. This registry answers a different question:
 * whether production has a measured-only calculator that consumes the exact
 * artifact version which passed those thresholds.
 *
 * Keep this list empty until a calculator implementation is registered for a
 * park. Registration is still not sufficient: `bindMeasuredShadeRuntime` must
 * load the hashed measured-geometry artifact named by the evidence record.
 * The legacy 2D and 3D estimators are intentionally not eligible. They
 * generate seats, row rises, and obstructions from defaults and therefore can
 * never satisfy this runtime boundary, even if an evidence record is changed
 * accidentally.
 */
const MEASURED_SHADE_RUNTIME_STADIUM_IDS: ReadonlySet<string> = new Set();

export function hasPublishedMeasuredShadeRuntime(stadiumId: string): boolean {
  return MEASURED_SHADE_RUNTIME_STADIUM_IDS.has(stadiumId);
}

/**
 * Auditable invariant for tests and release scripts. A registered runtime id
 * must correspond to a current MLB stadium, and no duplicate can be hidden by
 * a future array-to-set conversion.
 */
export function auditPublishedMeasuredShadeRuntimeRegistry(): string[] {
  const stadiumIds = new Set(MLB_STADIUMS.map((stadium) => stadium.id));
  return Array.from(MEASURED_SHADE_RUNTIME_STADIUM_IDS)
    .filter((stadiumId) => !stadiumIds.has(stadiumId))
    .map((stadiumId) => `Measured shade runtime references unknown stadium ${stadiumId}`);
}

