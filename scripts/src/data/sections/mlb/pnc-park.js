"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pncParkSectionMap = exports.pncParkFeatures = exports.pncParkSections = void 0;
// PNC Park - Pittsburgh Pirates
// Opened: 2001
// Capacity: 38,362
// Orientation: 99° (Home plate to center field)
// Features: Roberto Clemente Bridge, Allegheny River, Pittsburgh skyline view
const generateRows = (startRow, endRow, seatsPerRow, startElevation, depthPerRow, rakeAngle = 12) => {
    const rows = [];
    const rowLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG'];
    const startIdx = rowLetters.indexOf(startRow);
    const endIdx = rowLetters.indexOf(endRow);
    for (let i = startIdx; i <= endIdx; i++) {
        const rowNum = i - startIdx;
        const verticalRise = Math.sin(rakeAngle * Math.PI / 180) * depthPerRow * rowNum;
        rows.push({
            rowNumber: rowLetters[i],
            seats: seatsPerRow - Math.floor(rowNum * 0.3),
            elevation: startElevation + verticalRise,
            depth: rowNum * depthPerRow,
            covered: false
        });
    }
    return rows;
};
exports.pncParkSections = [
    // ========== PREMIUM INFIELD BOX (Behind Home Plate) ==========
    {
        id: 'PIB-14',
        name: 'Premium Infield Box 14',
        level: 'field',
        baseAngle: 91, // PNC Park orientation 99°
        angleSpan: 8,
        rows: generateRows('A', 'P', 20, 2, 2.5, 10),
        vertices3D: [
            { x: -12, y: 48, z: 2 },
            { x: -4, y: 48, z: 2 },
            { x: -4, y: 68, z: 8 },
            { x: -12, y: 68, z: 8 }
        ],
        covered: false,
        distance: 50,
        height: 2,
        rake: 10
    },
    {
        id: 'PIB-15',
        name: 'Premium Infield Box 15',
        level: 'field',
        baseAngle: 99,
        angleSpan: 8,
        rows: generateRows('A', 'P', 20, 2, 2.5, 10),
        vertices3D: [
            { x: -4, y: 48, z: 2 },
            { x: 4, y: 48, z: 2 },
            { x: 4, y: 68, z: 8 },
            { x: -4, y: 68, z: 8 }
        ],
        covered: false,
        distance: 50,
        height: 2,
        rake: 10
    },
    {
        id: 'PIB-16',
        name: 'Premium Infield Box 16',
        level: 'field',
        baseAngle: 107,
        angleSpan: 8,
        rows: generateRows('A', 'P', 20, 2, 2.5, 10),
        vertices3D: [
            { x: 4, y: 48, z: 2 },
            { x: 12, y: 48, z: 2 },
            { x: 12, y: 68, z: 8 },
            { x: 4, y: 68, z: 8 }
        ],
        covered: false,
        distance: 50,
        height: 2,
        rake: 10
    },
    // ========== INFIELD BOX ==========
    {
        id: 'IB-101',
        name: 'Infield Box 101',
        level: 'field',
        baseAngle: 115,
        angleSpan: 9,
        rows: generateRows('A', 'S', 22, 2, 2.5, 11),
        vertices3D: [
            { x: 12, y: 50, z: 2 },
            { x: 21, y: 54, z: 2 },
            { x: 24, y: 76, z: 10 },
            { x: 14, y: 72, z: 10 }
        ],
        covered: false,
        distance: 55,
        height: 2,
        rake: 11
    },
    {
        id: 'IB-102',
        name: 'Infield Box 102',
        level: 'field',
        baseAngle: 124,
        angleSpan: 9,
        rows: generateRows('A', 'S', 22, 2, 2.5, 11),
        vertices3D: [
            { x: 21, y: 54, z: 2 },
            { x: 30, y: 60, z: 2 },
            { x: 34, y: 82, z: 10 },
            { x: 24, y: 76, z: 10 }
        ],
        covered: false,
        distance: 60,
        height: 2,
        rake: 11
    },
    {
        id: 'IB-103',
        name: 'Infield Box 103',
        level: 'field',
        baseAngle: 133,
        angleSpan: 9,
        rows: generateRows('A', 'S', 22, 2, 2.5, 11),
        vertices3D: [
            { x: 30, y: 60, z: 2 },
            { x: 39, y: 68, z: 2 },
            { x: 44, y: 90, z: 10 },
            { x: 34, y: 82, z: 10 }
        ],
        covered: false,
        distance: 65,
        height: 2,
        rake: 11
    },
    {
        id: 'IB-113',
        name: 'Infield Box 113',
        level: 'field',
        baseAngle: 83,
        angleSpan: 9,
        rows: generateRows('A', 'S', 22, 2, 2.5, 11),
        vertices3D: [
            { x: -12, y: 50, z: 2 },
            { x: -21, y: 54, z: 2 },
            { x: -24, y: 76, z: 10 },
            { x: -14, y: 72, z: 10 }
        ],
        covered: false,
        distance: 55,
        height: 2,
        rake: 11
    },
    {
        id: 'IB-112',
        name: 'Infield Box 112',
        level: 'field',
        baseAngle: 74,
        angleSpan: 9,
        rows: generateRows('A', 'S', 22, 2, 2.5, 11),
        vertices3D: [
            { x: -21, y: 54, z: 2 },
            { x: -30, y: 60, z: 2 },
            { x: -34, y: 82, z: 10 },
            { x: -24, y: 76, z: 10 }
        ],
        covered: false,
        distance: 60,
        height: 2,
        rake: 11
    },
    {
        id: 'IB-111',
        name: 'Infield Box 111',
        level: 'field',
        baseAngle: 65,
        angleSpan: 9,
        rows: generateRows('A', 'S', 22, 2, 2.5, 11),
        vertices3D: [
            { x: -30, y: 60, z: 2 },
            { x: -39, y: 68, z: 2 },
            { x: -44, y: 90, z: 10 },
            { x: -34, y: 82, z: 10 }
        ],
        covered: false,
        distance: 65,
        height: 2,
        rake: 11
    },
    // ========== GRANDSTAND ==========
    {
        id: 'GS-201',
        name: 'Grandstand 201',
        level: 'lower',
        baseAngle: 89,
        angleSpan: 10,
        rows: generateRows('A', 'U', 24, 12, 2.6, 13),
        vertices3D: [
            { x: -16, y: 68, z: 12 },
            { x: -6, y: 68, z: 12 },
            { x: -6, y: 96, z: 26 },
            { x: -16, y: 96, z: 26 }
        ],
        covered: false,
        distance: 72,
        height: 12,
        rake: 13
    },
    {
        id: 'GS-202',
        name: 'Grandstand 202',
        level: 'lower',
        baseAngle: 99,
        angleSpan: 10,
        rows: generateRows('A', 'U', 24, 12, 2.6, 13),
        vertices3D: [
            { x: -6, y: 68, z: 12 },
            { x: 4, y: 68, z: 12 },
            { x: 4, y: 96, z: 26 },
            { x: -6, y: 96, z: 26 }
        ],
        covered: false,
        distance: 72,
        height: 12,
        rake: 13
    },
    {
        id: 'GS-203',
        name: 'Grandstand 203',
        level: 'lower',
        baseAngle: 109,
        angleSpan: 10,
        rows: generateRows('A', 'U', 24, 12, 2.6, 13),
        vertices3D: [
            { x: 4, y: 68, z: 12 },
            { x: 14, y: 70, z: 12 },
            { x: 16, y: 98, z: 26 },
            { x: 4, y: 96, z: 26 }
        ],
        covered: false,
        distance: 74,
        height: 12,
        rake: 13
    },
    {
        id: 'GS-213',
        name: 'Grandstand 213',
        level: 'lower',
        baseAngle: 79,
        angleSpan: 10,
        rows: generateRows('A', 'U', 24, 12, 2.6, 13),
        vertices3D: [
            { x: -26, y: 70, z: 12 },
            { x: -16, y: 68, z: 12 },
            { x: -16, y: 96, z: 26 },
            { x: -28, y: 98, z: 26 }
        ],
        covered: false,
        distance: 74,
        height: 12,
        rake: 13
    },
    // ========== OUTFIELD BOX ==========
    {
        id: 'OB-131',
        name: 'Outfield Box 131',
        level: 'field',
        baseAngle: 142,
        angleSpan: 11,
        rows: generateRows('A', 'Q', 22, 5, 2.5, 15),
        vertices3D: [
            { x: 39, y: 68, z: 5 },
            { x: 50, y: 78, z: 5 },
            { x: 55, y: 100, z: 15 },
            { x: 43, y: 90, z: 15 }
        ],
        covered: false,
        distance: 73,
        height: 5,
        rake: 15
    },
    {
        id: 'OB-132',
        name: 'Outfield Box 132',
        level: 'field',
        baseAngle: 153,
        angleSpan: 11,
        rows: generateRows('A', 'Q', 22, 5, 2.5, 15),
        vertices3D: [
            { x: 50, y: 78, z: 5 },
            { x: 60, y: 90, z: 5 },
            { x: 66, y: 113, z: 15 },
            { x: 55, y: 100, z: 15 }
        ],
        covered: false,
        distance: 85,
        height: 5,
        rake: 15
    },
    {
        id: 'OB-133',
        name: 'Outfield Box 133',
        level: 'field',
        baseAngle: 164,
        angleSpan: 11,
        rows: generateRows('A', 'Q', 22, 5, 2.5, 15),
        vertices3D: [
            { x: 60, y: 90, z: 5 },
            { x: 68, y: 104, z: 5 },
            { x: 75, y: 128, z: 15 },
            { x: 66, y: 113, z: 15 }
        ],
        covered: false,
        distance: 97,
        height: 5,
        rake: 15
    },
    {
        id: 'OB-108',
        name: 'Outfield Box 108',
        level: 'field',
        baseAngle: 56,
        angleSpan: 11,
        rows: generateRows('A', 'Q', 22, 5, 2.5, 15),
        vertices3D: [
            { x: -39, y: 68, z: 5 },
            { x: -50, y: 78, z: 5 },
            { x: -55, y: 100, z: 15 },
            { x: -43, y: 90, z: 15 }
        ],
        covered: false,
        distance: 73,
        height: 5,
        rake: 15
    },
    {
        id: 'OB-107',
        name: 'Outfield Box 107',
        level: 'field',
        baseAngle: 45,
        angleSpan: 11,
        rows: generateRows('A', 'Q', 22, 5, 2.5, 15),
        vertices3D: [
            { x: -50, y: 78, z: 5 },
            { x: -60, y: 90, z: 5 },
            { x: -66, y: 113, z: 15 },
            { x: -55, y: 100, z: 15 }
        ],
        covered: false,
        distance: 85,
        height: 5,
        rake: 15
    },
    // ========== ALLEGHENY CLUB LEVEL ==========
    {
        id: 'AC-301',
        name: 'Allegheny Club 301',
        level: 'club',
        baseAngle: 85,
        angleSpan: 10,
        rows: generateRows('A', 'K', 20, 28, 2.8, 12),
        vertices3D: [
            { x: -20, y: 96, z: 28 },
            { x: -10, y: 96, z: 28 },
            { x: -10, y: 116, z: 38 },
            { x: -20, y: 116, z: 38 }
        ],
        covered: true,
        distance: 100,
        height: 28,
        rake: 12
    },
    {
        id: 'AC-302',
        name: 'Allegheny Club 302',
        level: 'club',
        baseAngle: 95,
        angleSpan: 10,
        rows: generateRows('A', 'K', 20, 28, 2.8, 12),
        vertices3D: [
            { x: -10, y: 96, z: 28 },
            { x: 0, y: 96, z: 28 },
            { x: 0, y: 116, z: 38 },
            { x: -10, y: 116, z: 38 }
        ],
        covered: true,
        distance: 100,
        height: 28,
        rake: 12
    },
    {
        id: 'AC-303',
        name: 'Allegheny Club 303',
        level: 'club',
        baseAngle: 105,
        angleSpan: 10,
        rows: generateRows('A', 'K', 20, 28, 2.8, 12),
        vertices3D: [
            { x: 0, y: 96, z: 28 },
            { x: 10, y: 96, z: 28 },
            { x: 10, y: 116, z: 38 },
            { x: 0, y: 116, z: 38 }
        ],
        covered: true,
        distance: 100,
        height: 28,
        rake: 12
    },
    {
        id: 'AC-304',
        name: 'Allegheny Club 304',
        level: 'club',
        baseAngle: 115,
        angleSpan: 10,
        rows: generateRows('A', 'K', 20, 28, 2.8, 12),
        vertices3D: [
            { x: 10, y: 96, z: 28 },
            { x: 20, y: 98, z: 28 },
            { x: 22, y: 118, z: 38 },
            { x: 10, y: 116, z: 38 }
        ],
        covered: true,
        distance: 102,
        height: 28,
        rake: 12
    },
    // ========== UPPER DECK ==========
    {
        id: 'UD-301',
        name: 'Upper Deck 301',
        level: 'upper',
        baseAngle: 75,
        angleSpan: 11,
        rows: generateRows('A', 'X', 28, 38, 3.2, 17),
        vertices3D: [
            { x: -35, y: 116, z: 38 },
            { x: -24, y: 116, z: 38 },
            { x: -26, y: 178, z: 74 },
            { x: -38, y: 178, z: 74 }
        ],
        covered: true,
        distance: 120,
        height: 38,
        rake: 17
    },
    {
        id: 'UD-302',
        name: 'Upper Deck 302',
        level: 'upper',
        baseAngle: 86,
        angleSpan: 11,
        rows: generateRows('A', 'X', 28, 38, 3.2, 17),
        vertices3D: [
            { x: -24, y: 116, z: 38 },
            { x: -13, y: 116, z: 38 },
            { x: -14, y: 178, z: 74 },
            { x: -26, y: 178, z: 74 }
        ],
        covered: true,
        distance: 120,
        height: 38,
        rake: 17
    },
    {
        id: 'UD-303',
        name: 'Upper Deck 303',
        level: 'upper',
        baseAngle: 97,
        angleSpan: 11,
        rows: generateRows('A', 'X', 28, 38, 3.2, 17),
        vertices3D: [
            { x: -13, y: 116, z: 38 },
            { x: -2, y: 116, z: 38 },
            { x: -2, y: 178, z: 74 },
            { x: -14, y: 178, z: 74 }
        ],
        covered: true,
        distance: 120,
        height: 38,
        rake: 17
    },
    {
        id: 'UD-304',
        name: 'Upper Deck 304',
        level: 'upper',
        baseAngle: 108,
        angleSpan: 11,
        rows: generateRows('A', 'X', 28, 38, 3.2, 17),
        vertices3D: [
            { x: -2, y: 116, z: 38 },
            { x: 9, y: 116, z: 38 },
            { x: 10, y: 178, z: 74 },
            { x: -2, y: 178, z: 74 }
        ],
        covered: true,
        distance: 120,
        height: 38,
        rake: 17
    },
    {
        id: 'UD-305',
        name: 'Upper Deck 305',
        level: 'upper',
        baseAngle: 119,
        angleSpan: 11,
        rows: generateRows('A', 'X', 28, 38, 3.2, 17),
        vertices3D: [
            { x: 9, y: 116, z: 38 },
            { x: 20, y: 118, z: 38 },
            { x: 22, y: 180, z: 74 },
            { x: 10, y: 178, z: 74 }
        ],
        covered: true,
        distance: 122,
        height: 38,
        rake: 17
    },
    // ========== BLEACHERS ==========
    {
        id: 'BL-141',
        name: 'Left Field Bleachers 141',
        level: 'field',
        baseAngle: 175,
        angleSpan: 12,
        rows: generateRows('A', 'T', 26, 8, 2.5, 19),
        vertices3D: [
            { x: 68, y: 104, z: 8 },
            { x: 74, y: 120, z: 8 },
            { x: 82, y: 145, z: 23 },
            { x: 75, y: 128, z: 23 }
        ],
        covered: false,
        distance: 112,
        height: 8,
        rake: 19
    },
    {
        id: 'BL-142',
        name: 'Center Field Bleachers 142',
        level: 'field',
        baseAngle: 187,
        angleSpan: 12,
        rows: generateRows('A', 'T', 26, 8, 2.5, 19),
        vertices3D: [
            { x: 74, y: 120, z: 8 },
            { x: 78, y: 138, z: 8 },
            { x: 86, y: 165, z: 23 },
            { x: 82, y: 145, z: 23 }
        ],
        covered: false,
        distance: 129,
        height: 8,
        rake: 19
    },
    {
        id: 'BL-143',
        name: 'Center Field Bleachers 143',
        level: 'field',
        baseAngle: 199,
        angleSpan: 12,
        rows: generateRows('A', 'T', 26, 8, 2.5, 19),
        vertices3D: [
            { x: 78, y: 138, z: 8 },
            { x: 80, y: 156, z: 8 },
            { x: 88, y: 185, z: 23 },
            { x: 86, y: 165, z: 23 }
        ],
        covered: false,
        distance: 147,
        height: 8,
        rake: 19
    },
    // ========== ROBERTO CLEMENTE BRIDGE VIEW ==========
    {
        id: 'BRIDGE-1',
        name: 'Clemente Bridge View 1',
        level: 'standing',
        baseAngle: 210,
        angleSpan: 15,
        rows: [],
        vertices3D: [
            { x: 80, y: 156, z: 10 },
            { x: 78, y: 175, z: 10 },
            { x: 78, y: 195, z: 10 },
            { x: 80, y: 176, z: 10 }
        ],
        covered: false,
        distance: 166,
        height: 10,
        rake: 0
    },
    {
        id: 'BRIDGE-2',
        name: 'Clemente Bridge View 2',
        level: 'standing',
        baseAngle: 225,
        angleSpan: 15,
        rows: [],
        vertices3D: [
            { x: 78, y: 175, z: 10 },
            { x: 72, y: 193, z: 10 },
            { x: 70, y: 213, z: 10 },
            { x: 78, y: 195, z: 10 }
        ],
        covered: false,
        distance: 184,
        height: 10,
        rake: 0
    },
    // ========== PIRATES COVE ==========
    {
        id: 'PIRATES-COVE',
        name: 'Pirates Cove',
        level: 'standing',
        baseAngle: 35,
        angleSpan: 20,
        rows: [],
        vertices3D: [
            { x: -60, y: 90, z: 15 },
            { x: -70, y: 105, z: 15 },
            { x: -72, y: 125, z: 15 },
            { x: -62, y: 110, z: 15 }
        ],
        covered: false,
        distance: 98,
        height: 15,
        rake: 0
    },
    // ========== SUITE LEVEL ==========
    {
        id: 'SUITE-A',
        name: 'Suite Level A',
        level: 'suite',
        baseAngle: 92,
        angleSpan: 8,
        rows: [{ rowNumber: "1", seats: 18, elevation: 35, depth: 0, covered: true }],
        vertices3D: [
            { x: -8, y: 110, z: 35 },
            { x: 0, y: 110, z: 35 },
            { x: 0, y: 130, z: 35 },
            { x: -8, y: 130, z: 35 }
        ],
        covered: true,
        distance: 120,
        height: 35,
        rake: 0
    },
    {
        id: 'SUITE-B',
        name: 'Suite Level B',
        level: 'suite',
        baseAngle: 100,
        angleSpan: 8,
        rows: [{ rowNumber: "1", seats: 18, elevation: 35, depth: 0, covered: true }],
        vertices3D: [
            { x: 0, y: 110, z: 35 },
            { x: 8, y: 110, z: 35 },
            { x: 8, y: 130, z: 35 },
            { x: 0, y: 130, z: 35 }
        ],
        covered: true,
        distance: 120,
        height: 35,
        rake: 0
    }
];
// Stadium features
exports.pncParkFeatures = {
    retractableRoof: false,
    roofHeight: 0,
    roofMaterial: {
        opacity: 0.0,
        reflectivity: 0.0
    }
};
// Export section map for easy lookup
exports.pncParkSectionMap = new Map(exports.pncParkSections.map(section => [section.id, section]));
