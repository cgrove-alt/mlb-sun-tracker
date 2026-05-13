// Type definitions for stadium sections
// Separated from data to prevent bundling data when only types are needed

export interface StadiumSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  // Stadium-local angle (NOT a compass bearing), measured CCW from +x in
  // stadium-local coordinates where +x = first base direction and +y =
  // center field direction. So:
  //   0   = first base
  //   90  = center field
  //   180 = third base
  //   270 = behind home plate
  // To compare against an absolute compass sun azimuth, convert via:
  //   compass = (stadium.orientation + 90 - baseAngle) mod 360
  // (where stadium.orientation is the compass bearing from home plate to
  // center field). See src/utils/sectionSunCalculations.ts for details.
  baseAngle: number;
  angleSpan: number; // How many degrees this section spans
  rows?: number; // Number of rows in section
  covered: boolean; // Whether section has overhead coverage
  partialCoverage?: boolean; // Whether section has partial coverage (e.g., back rows only)
  coveredRows?: string; // Which rows are covered (e.g., "M-Z" or "last 5 rows")
  price?: 'value' | 'moderate' | 'premium' | 'luxury';
}

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}
