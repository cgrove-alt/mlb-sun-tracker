// Type definitions for stadium sections
// Separated from data to prevent bundling data when only types are needed

export interface StadiumSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  baseAngle: number; // Angle from home plate (0 = behind home, 90 = first base, 180 = center field, 270 = third base)
  angleSpan: number; // How many degrees this section spans
  covered: boolean; // Whether section has overhead coverage
  partialCoverage?: boolean; // Whether section has partial coverage (e.g., back rows only)
  coveredRows?: string; // Which rows are covered (e.g., "M-Z" or "last 5 rows")
  price?: 'value' | 'moderate' | 'premium' | 'luxury';

  // Accurate seating configuration (optional - uses defaults if not specified)
  rows?: number; // Number of rows in this section
  seatsPerRow?: number; // Average seats per row in this section
  rowLabels?: string[]; // Actual row labels (e.g., ['A', 'B', 'C'] or ['1', '2', '3'])

  // Section-specific geometry (in feet from home plate)
  distanceFromField?: number; // Distance from home plate to front row of section
  sectionDepth?: number; // Depth of section front-to-back (defaults to rows * 3ft)
  baseHeight?: number; // Height of front row above field level (overrides level default)
}

export interface StadiumSections {
  stadiumId: string;
  sections: StadiumSection[];
}
