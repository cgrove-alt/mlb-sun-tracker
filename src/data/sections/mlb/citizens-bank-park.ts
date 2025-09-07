import { DetailedSection, RowDetail, Vector3D } from '../../../types/stadium-complete';

// Citizens Bank Park - Philadelphia Phillies
// Opened: 2004
// Capacity: 42,792
// Orientation: 59° (Home plate to center field)
// Famous features: Ashburn Alley, Liberty Bell, Phanatic Phun Zone

const generateRows = (startRow: string, endRow: string, seatsPerRow: number, startElevation: number, depthPerRow: number, rakeAngle: number = 12): RowDetail[] => {
  const rows: RowDetail[] = [];
  const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG'];
  
  const startIdx = rowLetters.indexOf(startRow);
  const endIdx = rowLetters.indexOf(endRow);
  
  for (let i = startIdx; i <= endIdx; i++) {
    const rowNum = i - startIdx;
    const verticalRise = Math.sin(rakeAngle * Math.PI / 180) * depthPerRow * rowNum;
    
    rows.push({
      rowNumber: rowLetters[i],
      seats: seatsPerRow - Math.floor(rowNum * 0.3), // Slight reduction in upper rows
      elevation: startElevation + verticalRise,
      depth: rowNum * depthPerRow,

    });
  }
  
  return rows;
  }
export const citizensBankParkSections: DetailedSection[] = [
  // Field Level - Behind Home Plate
  {
    id: 'diamond-club',
    name: 'Diamond Club',
    level: 'field',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'T', 25, 2, 2.5, 10),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: 30, y: 2, z: 10 },
      { x: 35, y: 50, z: 60 },
      { x: -35, y: 50, z: 60 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Field Level - First Base Line
  {
    id: 'field-box-1b',
    name: 'Field Box - First Base',
    level: 'field',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'X', 22, 2, 2.5, 11),
    vertices3D: [
      { x: 30, y: 2, z: 10 },
      { x: 120, y: 2, z: 30 },
      { x: 125, y: 60, z: 85 },
      { x: 35, y: 60, z: 65 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Field Level - Third Base Line
  {
    id: 'field-box-3b',
    name: 'Field Box - Third Base',
    level: 'field',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'X', 22, 2, 2.5, 11),
    vertices3D: [
      { x: -30, y: 2, z: 10 },
      { x: -120, y: 2, z: 30 },
      { x: -125, y: 60, z: 85 },
      { x: -35, y: 60, z: 65 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Arcade Level - Behind Home
  {
    id: 'arcade-behind-home',
    name: 'Arcade - Behind Home',
    level: 'club',
    baseAngle: 0,
    angleSpan: 30,
    rows: generateRows('A', 'U', 20, 65, 3, 14),
    vertices3D: [
      { x: -40, y: 65, z: 70 },
      { x: 40, y: 65, z: 70 },
      { x: 45, y: 125, z: 130 },
      { x: -45, y: 125, z: 130 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Pavilion Level - First Base
  {
    id: 'pavilion-1b',
    name: 'Pavilion - First Base',
    level: 'upper',
    baseAngle: 45,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 24, 75, 3, 15),
    vertices3D: [
      { x: 45, y: 75, z: 80 },
      { x: 130, y: 75, z: 100 },
      { x: 135, y: 145, z: 170 },
      { x: 50, y: 145, z: 150 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Pavilion Level - Third Base
  {
    id: 'pavilion-3b',
    name: 'Pavilion - Third Base',
    level: 'upper',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'Y', 24, 75, 3, 15),
    vertices3D: [
      { x: -45, y: 75, z: 80 },
      { x: -130, y: 75, z: 100 },
      { x: -135, y: 145, z: 170 },
      { x: -50, y: 145, z: 150 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Hall of Fame Club
  {
    id: 'hall-of-fame-club',
    name: 'Hall of Fame Club',
    level: 'club',
    baseAngle: 315,
    angleSpan: 30,
    rows: generateRows('A', 'P', 30, 85, 3.5, 12),
    vertices3D: [
      { x: -50, y: 85, z: 90 },
      { x: -140, y: 85, z: 110 },
      { x: -145, y: 140, z: 165 },
      { x: -55, y: 140, z: 145 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Scoreboard Porch
  {
    id: 'scoreboard-porch',
    name: 'Scoreboard Porch',
    level: 'field',
    baseAngle: 225,
    angleSpan: 30,
    rows: generateRows('A', 'M', 18, 25, 2.5, 20),
    vertices3D: [
      { x: -150, y: 25, z: 280 },
      { x: -120, y: 25, z: 320 },
      { x: -125, y: 55, z: 350 },
      { x: -155, y: 55, z: 310 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Ashburn Alley (Right Field)
  {
    id: 'ashburn-alley',
    name: 'Ashburn Alley',
    level: 'standing',
    baseAngle: 90,
    angleSpan: 30,
    rows: [
      { rowNumber: "1", seats: 100, elevation: 12, depth: 0, covered: false }
    ],
    vertices3D: [
      { x: 120, y: 12, z: 280 },
      { x: 150, y: 12, z: 320 },
      { x: 150, y: 12, z: 340 },
      { x: 120, y: 12, z: 300 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Liberty Bell Pavilion
  {
    id: 'liberty-bell',
    name: 'Liberty Bell Pavilion',
    level: 'field',
    baseAngle: 180,
    angleSpan: 40,
    rows: generateRows('A', 'K', 16, 15, 2.5, 18),
    vertices3D: [
      { x: -40, y: 15, z: 400 },
      { x: 40, y: 15, z: 400 },
      { x: 40, y: 40, z: 418 },
      { x: -40, y: 40, z: 418 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  },
  // Upper Deck - Home Plate
  {
    id: 'upper-deck-home',
    name: 'Upper Deck - Home Plate',
    level: 'upper',
    baseAngle: 0,
    angleSpan: 40,
    rows: generateRows('A', 'Z', 24, 120, 3.5, 16),
    vertices3D: [
      { x: -45, y: 120, z: 125 },
      { x: 45, y: 120, z: 125 },
      { x: 50, y: 208, z: 213 },
      { x: -50, y: 208, z: 213 }
    ] as Vector3D[],
    covered: false,
    distance: 50,
    height: 20,
    rake: 25
  }
];

// Stadium configuration
export const citizensBankParkConfig = {
  stadiumName: 'Citizens Bank Park',
  team: 'Philadelphia Phillies',
  location: 'Philadelphia, Pennsylvania',
  capacity: 42792,
  yearBuilt: 2004,
  orientation: 59,
  dimensions: {
    leftField: 329,
    center: 401,
    rightField: 330
  }
  }

// Export section map for easy lookup
export const citizensBankParkSectionMap = new Map(
  citizensBankParkSections.map(section => [section.id, section])
);
