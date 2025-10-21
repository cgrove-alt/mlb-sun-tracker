// Complete Stadium Data Structure with 3D Geometry and Detailed Sections
// Used for accurate sun exposure calculations across all stadium types

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface RowDetail {
  rowNumber: string;
  seats: number;
  elevation: number; // Height above field level in feet
  depth: number; // Distance from front of section in feet
  covered: boolean;
  overhangHeight?: number; // Height of overhang above row if covered
  seatPositions?: Vector3D[]; // Individual seat coordinates
}

export interface CoverageDetail {
  type: 'full' | 'partial' | 'retractable';
  coveredRows: string[]; // Which rows are covered
  coveragePercentage: number; // 0-100
  overhangDepth?: number; // How far the overhang extends in feet
  overhangHeight?: number; // Height of overhang above seats
  material?: 'solid' | 'mesh' | 'glass' | 'fabric';
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  companionSeats: number;
  aisleSeats: boolean;
  tunnelAccess: string[]; // Which tunnels provide access
}

export interface DetailedSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite' | 'standing';
  baseAngle: number; // Angle from home plate (0-360)
  angleSpan: number; // How many degrees this section spans
  rows: RowDetail[];
  vertices3D: Vector3D[]; // 3D boundary vertices
  covered: boolean;
  partialCoverage?: CoverageDetail;
  accessibility?: AccessibilityInfo;
  price?: 'value' | 'moderate' | 'premium' | 'luxury';
  
  // Additional detail
  distance: number; // Distance from home plate in feet
  height: number; // Height above field level
  rake: number; // Seating rake angle in degrees
  seatWidth?: number; // Average seat width in inches
  rowSpacing?: number; // Space between rows in inches
  
  // View quality
  viewQuality?: 'excellent' | 'good' | 'fair' | 'obstructed';
  obstructedSeats?: string[]; // List of seats with obstructed views
}

export interface MaterialProperties {
  opacity: number; // 0-1, where 1 is fully opaque
  reflectivity: number; // 0-1, how much light is reflected
  color?: string; // Hex color for rendering
  texture?: string; // Texture type
}

export interface Mesh3D {
  vertices: Vector3D[];
  faces: number[][]; // Indices into vertices array
  normals?: Vector3D[]; // Surface normals for lighting
  uvs?: number[][]; // Texture coordinates
}

export interface Obstruction3D {
  id: string;
  name: string;
  type: 'roof' | 'upper_deck' | 'overhang' | 'scoreboard' | 'structure' | 'facade' | 'canopy' | 'tree';
  geometry: Mesh3D;
  boundingBox: {
    min: Vector3D;
    max: Vector3D;
  };
  material: MaterialProperties;
  castsShadow: boolean;
  seasonal?: boolean; // For retractable roofs or seasonal structures
  movable?: boolean; // For retractable elements
  positions?: { // Different positions for movable elements
    open?: Mesh3D;
    closed?: Mesh3D;
    partial?: Mesh3D[];
  };
}

export interface UniqueFeature {
  id: string;
  name: string;
  description: string;
  location: Vector3D;
  affectsSunExposure: boolean;
  geometry?: Mesh3D;
  sections?: string[]; // Which sections are affected
}

export interface StadiumGeometry3D {
  fieldLevel: number; // Elevation of field in feet
  homePlate: Vector3D; // Home plate position
  orientation: number; // Degrees from north
  dimensions: {
    leftField: number;
    centerField: number; 
    rightField: number;
    foulTerritory: number;
  };
  seatingBowl: Mesh3D; // Overall bowl geometry
  roof?: {
    type: 'open' | 'retractable' | 'fixed';
    geometry?: Mesh3D;
    openPercentage?: number; // For partial roofs
  };
}

export interface StadiumComplete {
  // Basic info
  id: string;
  name: string;
  team: string;
  league: 'MLB' | 'MiLB' | 'NFL';
  city: string;
  state: string;
  
  // Location data
  latitude: number;
  longitude: number;
  elevation: number; // Feet above sea level
  timezone: string;
  
  // Detailed sections with full 3D data
  sections: DetailedSection[];
  
  // 3D obstruction models
  obstructions: Obstruction3D[];
  
  // Stadium 3D geometry
  geometry: StadiumGeometry3D;
  
  // Unique features
  features?: UniqueFeature[];
  
  // Metadata
  capacity: number;
  opened: number; // Year opened
  renovated?: number[]; // Years of major renovations
  surface: 'grass' | 'turf' | 'hybrid';
  
  // Sun exposure factors
  climateZone?: 'hot-dry' | 'hot-humid' | 'temperate' | 'cold';
  typicalCloudCover?: number; // 0-100 percentage
  treeCoverage?: boolean; // External trees affecting shade
}

// Helper type for section generation
export interface SectionTemplate {
  level: DetailedSection['level'];
  rowCount: number;
  seatsPerRow: number;
  rake: number;
  baseHeight: number;
  covered: boolean;
  priceCategory: DetailedSection['price'];
}

// Stadium-specific configuration
export interface StadiumConfig {
  id: string;
  sectionTemplates: Record<string, SectionTemplate>;
  customSections?: DetailedSection[];
  obstructionPresets?: Obstruction3D[];
}

// Validation result
export interface ValidationResult {
  stadiumId: string;
  valid: boolean;
  errors: string[];
  warnings: string[];
  coverage: {
    sections: number;
    obstructions: number;
    geometryComplete: boolean;
  };
}