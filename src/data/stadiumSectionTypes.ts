// Type definitions for stadium sections
// Separated from data to prevent bundling data when only types are needed

export interface StadiumSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  baseAngle: number; // Angle from home plate (0 = behind home, 90 = first base, 180 = center field, 270 = third base)
  angleSpan: number; // How many degrees this section spans
  rows?: number; // Number of rows in section
  covered: boolean; // Whether section has overhead coverage
  partialCoverage?: boolean; // Whether section has partial coverage (e.g., back rows only)
  coveredRows?: string; // Which rows are covered (e.g., "M-Z" or "last 5 rows")
  price?: 'value' | 'moderate' | 'premium' | 'luxury';
  lastUpdated?: string; // ISO 8601 timestamp of last section data update
}

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
  lastUpdated?: string; // ISO 8601 timestamp of last data update
}
