"use strict";
// Globe Life Field - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations
Object.defineProperty(exports, "__esModule", { value: true });
exports.rangersSectionMap = exports.rangersSections = void 0;
// Helper function to generate rows
function generateRows(startRow, endRow, seatsPerRow, baseElevation, rake, covered = false) {
    const rows = [];
    const rowHeight = 2.5;
    const rowDepth = 2.8;
    const isLetterRows = typeof startRow === 'string';
    if (isLetterRows) {
        const startCode = startRow.charCodeAt(0);
        const endCode = endRow.charCodeAt(0);
        for (let i = startCode; i <= endCode; i++) {
            const rowNum = i - startCode;
            rows.push({
                rowNumber: String.fromCharCode(i),
                seats: seatsPerRow - Math.floor(rowNum * 0.2),
                elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
                depth: rowNum * rowDepth,
                covered: covered,
                overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
            });
        }
    }
    else {
        for (let i = startRow; i <= endRow; i++) {
            const rowNum = i - startRow;
            rows.push({
                rowNumber: i.toString(),
                seats: seatsPerRow - Math.floor(rowNum * 0.2),
                elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
                depth: rowNum * rowDepth,
                covered: covered,
                overhangHeight: covered ? 30 - (rowNum * 0.3) : undefined
            });
        }
    }
    return rows;
}
exports.rangersSections = [
    {
        id: '100',
        name: 'Field Level 100',
        level: 'field',
        baseAngle: 31,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 43, y: 26, z: 0 },
            { x: 40, y: 29, z: 0 },
            { x: 55, y: 40, z: 8 },
            { x: 58, y: 35, z: 8 }
        ],
        covered: false,
        distance: 55,
        height: 0,
        rake: 18
    },
    {
        id: '101',
        name: 'Field Level 101',
        level: 'field',
        baseAngle: 36,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 40, y: 29, z: 0 },
            { x: 38, y: 33, z: 0 },
            { x: 51, y: 45, z: 8 },
            { x: 55, y: 40, z: 8 }
        ],
        covered: false,
        distance: 55,
        height: 0,
        rake: 18
    },
    {
        id: '102',
        name: 'Field Level 102',
        level: 'field',
        baseAngle: 41,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 38, y: 33, z: 0 },
            { x: 35, y: 36, z: 0 },
            { x: 47, y: 49, z: 8 },
            { x: 51, y: 45, z: 8 }
        ],
        covered: false,
        distance: 55,
        height: 0,
        rake: 18
    },
    {
        id: '103',
        name: 'Field Level 103',
        level: 'field',
        baseAngle: 46,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 35, y: 36, z: 0 },
            { x: 31, y: 39, z: 0 },
            { x: 43, y: 53, z: 8 },
            { x: 47, y: 49, z: 8 }
        ],
        covered: false,
        distance: 55,
        height: 0,
        rake: 18
    },
    {
        id: '104',
        name: 'Field Level 104',
        level: 'field',
        baseAngle: 51,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 31, y: 39, z: 0 },
            { x: 28, y: 41, z: 0 },
            { x: 38, y: 56, z: 8 },
            { x: 43, y: 53, z: 8 }
        ],
        covered: false,
        distance: 55,
        height: 0,
        rake: 18
    },
    {
        id: '105',
        name: 'Field Level 105',
        level: 'field',
        baseAngle: 56,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 28, y: 41, z: 0 },
            { x: 24, y: 44, z: 0 },
            { x: 33, y: 59, z: 8 },
            { x: 38, y: 56, z: 8 }
        ],
        covered: false,
        distance: 55,
        height: 0,
        rake: 18
    },
    {
        id: '110',
        name: 'Field Level 110',
        level: 'field',
        baseAngle: 66,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 22, y: 50, z: 0 },
            { x: 15, y: 53, z: 0 },
            { x: 23, y: 82, z: 12 },
            { x: 35, y: 78, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '111',
        name: 'Field Level 111',
        level: 'field',
        baseAngle: 74,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 15, y: 53, z: 0 },
            { x: 8, y: 54, z: 0 },
            { x: 12, y: 84, z: 12 },
            { x: 23, y: 82, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '112',
        name: 'Field Level 112',
        level: 'field',
        baseAngle: 82,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 8, y: 54, z: 0 },
            { x: 0, y: 55, z: 0 },
            { x: 0, y: 85, z: 12 },
            { x: 12, y: 84, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '113',
        name: 'Field Level 113',
        level: 'field',
        baseAngle: 90,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 0, y: 55, z: 0 },
            { x: -8, y: 54, z: 0 },
            { x: -12, y: 84, z: 12 },
            { x: 0, y: 85, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '114',
        name: 'Field Level 114',
        level: 'field',
        baseAngle: 98,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -8, y: 54, z: 0 },
            { x: -15, y: 53, z: 0 },
            { x: -23, y: 82, z: 12 },
            { x: -12, y: 84, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '115',
        name: 'Field Level 115',
        level: 'field',
        baseAngle: 106,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -15, y: 53, z: 0 },
            { x: -22, y: 50, z: 0 },
            { x: -35, y: 78, z: 12 },
            { x: -23, y: 82, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '116',
        name: 'Field Level 116',
        level: 'field',
        baseAngle: 26,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 49, y: 24, z: 0 },
            { x: 46, y: 31, z: 0 },
            { x: 70, y: 48, z: 12 },
            { x: 76, y: 37, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '117',
        name: 'Field Level 117',
        level: 'field',
        baseAngle: 18,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 52, y: 17, z: 0 },
            { x: 49, y: 24, z: 0 },
            { x: 76, y: 37, z: 12 },
            { x: 81, y: 26, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '118',
        name: 'Field Level 118',
        level: 'field',
        baseAngle: 10,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 54, y: 10, z: 0 },
            { x: 52, y: 17, z: 0 },
            { x: 81, y: 26, z: 12 },
            { x: 84, y: 15, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '119',
        name: 'Field Level 119',
        level: 'field',
        baseAngle: 2,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 55, y: 2, z: 0 },
            { x: 54, y: 10, z: 0 },
            { x: 84, y: 15, z: 12 },
            { x: 85, y: 3, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '120',
        name: 'Field Level 120',
        level: 'field',
        baseAngle: 354,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 55, y: -6, z: 0 },
            { x: 55, y: 2, z: 0 },
            { x: 85, y: 3, z: 12 },
            { x: 85, y: -9, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '121',
        name: 'Field Level 121',
        level: 'field',
        baseAngle: 346,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 53, y: -13, z: 0 },
            { x: 55, y: -6, z: 0 },
            { x: 85, y: -9, z: 12 },
            { x: 82, y: -21, z: 12 }
        ],
        covered: false,
        distance: 65,
        height: 0,
        rake: 20
    },
    {
        id: '130',
        name: 'Lower Level 130',
        level: 'lower',
        baseAngle: 11,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 83, y: 16, z: 15 },
            { x: 82, y: 23, z: 15 },
            { x: 120, y: 34, z: 38 },
            { x: 123, y: 24, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '131',
        name: 'Lower Level 131',
        level: 'lower',
        baseAngle: 16,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 82, y: 23, z: 15 },
            { x: 79, y: 30, z: 15 },
            { x: 117, y: 45, z: 38 },
            { x: 120, y: 34, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '132',
        name: 'Lower Level 132',
        level: 'lower',
        baseAngle: 21,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 79, y: 30, z: 15 },
            { x: 76, y: 37, z: 15 },
            { x: 112, y: 55, z: 38 },
            { x: 117, y: 45, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '133',
        name: 'Lower Level 133',
        level: 'lower',
        baseAngle: 26,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 76, y: 37, z: 15 },
            { x: 73, y: 44, z: 15 },
            { x: 107, y: 64, z: 38 },
            { x: 112, y: 55, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '134',
        name: 'Lower Level 134',
        level: 'lower',
        baseAngle: 31,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 73, y: 44, z: 15 },
            { x: 69, y: 50, z: 15 },
            { x: 101, y: 73, z: 38 },
            { x: 107, y: 64, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '135',
        name: 'Lower Level 135',
        level: 'lower',
        baseAngle: 36,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 69, y: 50, z: 15 },
            { x: 64, y: 56, z: 15 },
            { x: 94, y: 82, z: 38 },
            { x: 101, y: 73, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '136',
        name: 'Lower Level 136',
        level: 'lower',
        baseAngle: 41,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 64, y: 56, z: 15 },
            { x: 59, y: 61, z: 15 },
            { x: 87, y: 90, z: 38 },
            { x: 94, y: 82, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '137',
        name: 'Lower Level 137',
        level: 'lower',
        baseAngle: 46,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 59, y: 61, z: 15 },
            { x: 53, y: 66, z: 15 },
            { x: 79, y: 97, z: 38 },
            { x: 87, y: 90, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '138',
        name: 'Lower Level 138',
        level: 'lower',
        baseAngle: 51,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 53, y: 66, z: 15 },
            { x: 48, y: 70, z: 15 },
            { x: 70, y: 104, z: 38 },
            { x: 79, y: 97, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '139',
        name: 'Lower Level 139',
        level: 'lower',
        baseAngle: 56,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 48, y: 70, z: 15 },
            { x: 41, y: 74, z: 15 },
            { x: 61, y: 109, z: 38 },
            { x: 70, y: 104, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '140',
        name: 'Lower Level 140',
        level: 'lower',
        baseAngle: 61,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 41, y: 74, z: 15 },
            { x: 35, y: 78, z: 15 },
            { x: 51, y: 114, z: 38 },
            { x: 61, y: 109, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '141',
        name: 'Lower Level 141',
        level: 'lower',
        baseAngle: 66,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 35, y: 78, z: 15 },
            { x: 28, y: 80, z: 15 },
            { x: 41, y: 118, z: 38 },
            { x: 51, y: 114, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '142',
        name: 'Lower Level 142',
        level: 'lower',
        baseAngle: 71,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 28, y: 80, z: 15 },
            { x: 21, y: 82, z: 15 },
            { x: 30, y: 121, z: 38 },
            { x: 41, y: 118, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: '143',
        name: 'Lower Level 143',
        level: 'lower',
        baseAngle: 76,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 21, y: 82, z: 15 },
            { x: 13, y: 84, z: 15 },
            { x: 20, y: 123, z: 38 },
            { x: 30, y: 121, z: 38 }
        ],
        covered: false,
        distance: 95,
        height: 15,
        rake: 24
    },
    {
        id: 'CL-300',
        name: 'Club Level 300',
        level: 'club',
        baseAngle: 26,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 112, y: 55, z: 30 },
            { x: 107, y: 64, z: 30 },
            { x: 129, y: 77, z: 45 },
            { x: 135, y: 66, z: 45 }
        ],
        covered: true,
        distance: 135,
        height: 30,
        rake: 26
    },
    {
        id: 'CL-301',
        name: 'Club Level 301',
        level: 'club',
        baseAngle: 31,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 107, y: 64, z: 30 },
            { x: 101, y: 73, z: 30 },
            { x: 121, y: 88, z: 45 },
            { x: 129, y: 77, z: 45 }
        ],
        covered: true,
        distance: 135,
        height: 30,
        rake: 26
    },
    {
        id: 'CL-302',
        name: 'Club Level 302',
        level: 'club',
        baseAngle: 36,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 101, y: 73, z: 30 },
            { x: 94, y: 82, z: 30 },
            { x: 113, y: 98, z: 45 },
            { x: 121, y: 88, z: 45 }
        ],
        covered: true,
        distance: 135,
        height: 30,
        rake: 26
    },
    {
        id: 'CL-303',
        name: 'Club Level 303',
        level: 'club',
        baseAngle: 41,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 94, y: 82, z: 30 },
            { x: 87, y: 90, z: 30 },
            { x: 104, y: 108, z: 45 },
            { x: 113, y: 98, z: 45 }
        ],
        covered: true,
        distance: 135,
        height: 30,
        rake: 26
    },
    {
        id: 'CL-304',
        name: 'Club Level 304',
        level: 'club',
        baseAngle: 46,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 87, y: 90, z: 30 },
            { x: 79, y: 97, z: 30 },
            { x: 94, y: 117, z: 45 },
            { x: 104, y: 108, z: 45 }
        ],
        covered: true,
        distance: 135,
        height: 30,
        rake: 26
    },
    {
        id: 'CL-305',
        name: 'Club Level 305',
        level: 'club',
        baseAngle: 51,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 79, y: 97, z: 30 },
            { x: 70, y: 104, z: 30 },
            { x: 84, y: 124, z: 45 },
            { x: 94, y: 117, z: 45 }
        ],
        covered: true,
        distance: 135,
        height: 30,
        rake: 26
    },
    {
        id: 'CL-306',
        name: 'Club Level 306',
        level: 'club',
        baseAngle: 56,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 70, y: 104, z: 30 },
            { x: 61, y: 109, z: 30 },
            { x: 73, y: 131, z: 45 },
            { x: 84, y: 124, z: 45 }
        ],
        covered: true,
        distance: 135,
        height: 30,
        rake: 26
    },
    {
        id: 'CL-307',
        name: 'Club Level 307',
        level: 'club',
        baseAngle: 61,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 61, y: 109, z: 30 },
            { x: 51, y: 114, z: 30 },
            { x: 61, y: 137, z: 45 },
            { x: 73, y: 131, z: 45 }
        ],
        covered: true,
        distance: 135,
        height: 30,
        rake: 26
    },
    {
        id: '400',
        name: 'Upper Level 400',
        level: 'upper',
        baseAngle: 16,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 144, y: 41, z: 40 },
            { x: 140, y: 54, z: 40 },
            { x: 187, y: 72, z: 78 },
            { x: 192, y: 55, z: 78 }
        ],
        covered: false,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '401',
        name: 'Upper Level 401',
        level: 'upper',
        baseAngle: 21,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 140, y: 54, z: 40 },
            { x: 135, y: 66, z: 40 },
            { x: 180, y: 88, z: 78 },
            { x: 187, y: 72, z: 78 }
        ],
        covered: false,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '402',
        name: 'Upper Level 402',
        level: 'upper',
        baseAngle: 26,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 135, y: 66, z: 40 },
            { x: 129, y: 77, z: 40 },
            { x: 171, y: 103, z: 78 },
            { x: 180, y: 88, z: 78 }
        ],
        covered: true,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '403',
        name: 'Upper Level 403',
        level: 'upper',
        baseAngle: 31,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 129, y: 77, z: 40 },
            { x: 121, y: 88, z: 40 },
            { x: 162, y: 118, z: 78 },
            { x: 171, y: 103, z: 78 }
        ],
        covered: true,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '404',
        name: 'Upper Level 404',
        level: 'upper',
        baseAngle: 36,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 121, y: 88, z: 40 },
            { x: 113, y: 98, z: 40 },
            { x: 151, y: 131, z: 78 },
            { x: 162, y: 118, z: 78 }
        ],
        covered: true,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '405',
        name: 'Upper Level 405',
        level: 'upper',
        baseAngle: 41,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 113, y: 98, z: 40 },
            { x: 104, y: 108, z: 40 },
            { x: 139, y: 144, z: 78 },
            { x: 151, y: 131, z: 78 }
        ],
        covered: true,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '406',
        name: 'Upper Level 406',
        level: 'upper',
        baseAngle: 46,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 104, y: 108, z: 40 },
            { x: 94, y: 117, z: 40 },
            { x: 126, y: 155, z: 78 },
            { x: 139, y: 144, z: 78 }
        ],
        covered: true,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '407',
        name: 'Upper Level 407',
        level: 'upper',
        baseAngle: 51,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 94, y: 117, z: 40 },
            { x: 84, y: 124, z: 40 },
            { x: 112, y: 166, z: 78 },
            { x: 126, y: 155, z: 78 }
        ],
        covered: true,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '408',
        name: 'Upper Level 408',
        level: 'upper',
        baseAngle: 56,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 84, y: 124, z: 40 },
            { x: 73, y: 131, z: 40 },
            { x: 97, y: 175, z: 78 },
            { x: 112, y: 166, z: 78 }
        ],
        covered: true,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '409',
        name: 'Upper Level 409',
        level: 'upper',
        baseAngle: 61,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 73, y: 131, z: 40 },
            { x: 61, y: 137, z: 40 },
            { x: 81, y: 183, z: 78 },
            { x: 97, y: 175, z: 78 }
        ],
        covered: true,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '410',
        name: 'Upper Level 410',
        level: 'upper',
        baseAngle: 66,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 61, y: 137, z: 40 },
            { x: 49, y: 142, z: 40 },
            { x: 65, y: 189, z: 78 },
            { x: 81, y: 183, z: 78 }
        ],
        covered: false,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: '411',
        name: 'Upper Level 411',
        level: 'upper',
        baseAngle: 71,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 49, y: 142, z: 40 },
            { x: 36, y: 146, z: 40 },
            { x: 48, y: 194, z: 78 },
            { x: 65, y: 189, z: 78 }
        ],
        covered: false,
        distance: 175,
        height: 40,
        rake: 28
    },
    {
        id: 'BL-140',
        name: 'Bleachers 140',
        level: 'field',
        baseAngle: 116,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -88, y: 180, z: 8 },
            { x: -123, y: 158, z: 8 },
            { x: -151, y: 193, z: 25 },
            { x: -107, y: 220, z: 25 }
        ],
        covered: false,
        distance: 220,
        height: 8,
        rake: 20
    },
    {
        id: 'BL-141',
        name: 'Bleachers 141',
        level: 'field',
        baseAngle: 131,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -131, y: 151, z: 8 },
            { x: -160, y: 120, z: 8 },
            { x: -196, y: 147, z: 25 },
            { x: -161, y: 185, z: 25 }
        ],
        covered: false,
        distance: 220,
        height: 8,
        rake: 20
    },
    {
        id: 'BL-142',
        name: 'Bleachers 142',
        level: 'field',
        baseAngle: 146,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -166, y: 112, z: 8 },
            { x: -185, y: 75, z: 8 },
            { x: -227, y: 92, z: 25 },
            { x: -203, y: 137, z: 25 }
        ],
        covered: false,
        distance: 220,
        height: 8,
        rake: 20
    },
    {
        id: 'BL-143',
        name: 'Bleachers 143',
        level: 'field',
        baseAngle: 161,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -189, y: 65, z: 8 },
            { x: -199, y: 24, z: 8 },
            { x: -243, y: 30, z: 25 },
            { x: -232, y: 80, z: 25 }
        ],
        covered: false,
        distance: 220,
        height: 8,
        rake: 20
    },
    {
        id: 'BL-144',
        name: 'Bleachers 144',
        level: 'field',
        baseAngle: 336,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 183, y: -81, z: 8 },
            { x: 196, y: -42, z: 8 },
            { x: 240, y: -51, z: 25 },
            { x: 224, y: -100, z: 25 }
        ],
        covered: false,
        distance: 220,
        height: 8,
        rake: 20
    },
    {
        id: 'BL-145',
        name: 'Bleachers 145',
        level: 'field',
        baseAngle: 321,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 155, y: -126, z: 8 },
            { x: 178, y: -91, z: 8 },
            { x: 218, y: -111, z: 25 },
            { x: 190, y: -154, z: 25 }
        ],
        covered: false,
        distance: 220,
        height: 8,
        rake: 20
    },
    {
        id: 'BL-146',
        name: 'Bleachers 146',
        level: 'field',
        baseAngle: 306,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 118, y: -162, z: 8 },
            { x: 149, y: -134, z: 8 },
            { x: 182, y: -164, z: 25 },
            { x: 144, y: -198, z: 25 }
        ],
        covered: false,
        distance: 220,
        height: 8,
        rake: 20
    },
    {
        id: 'BL-147',
        name: 'Bleachers 147',
        level: 'field',
        baseAngle: 291,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 72, y: -187, z: 8 },
            { x: 109, y: -168, z: 8 },
            { x: 133, y: -205, z: 25 },
            { x: 88, y: -229, z: 25 }
        ],
        covered: false,
        distance: 220,
        height: 8,
        rake: 20
    },
    {
        id: 'SUITE-1',
        name: 'Suite 1',
        level: 'suite',
        baseAngle: 36,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 113, y: 82, z: 35 },
            { x: 106, y: 92, z: 35 },
            { x: 121, y: 105, z: 35 },
            { x: 129, y: 94, z: 35 }
        ],
        covered: true,
        distance: 150,
        height: 35,
        rake: 0
    },
    {
        id: 'SUITE-2',
        name: 'Suite 2',
        level: 'suite',
        baseAngle: 41,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 106, y: 92, z: 35 },
            { x: 97, y: 101, z: 35 },
            { x: 111, y: 115, z: 35 },
            { x: 121, y: 105, z: 35 }
        ],
        covered: true,
        distance: 150,
        height: 35,
        rake: 0
    },
    {
        id: 'SUITE-3',
        name: 'Suite 3',
        level: 'suite',
        baseAngle: 46,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 97, y: 101, z: 35 },
            { x: 88, y: 109, z: 35 },
            { x: 101, y: 124, z: 35 },
            { x: 111, y: 115, z: 35 }
        ],
        covered: true,
        distance: 150,
        height: 35,
        rake: 0
    },
    {
        id: 'SUITE-4',
        name: 'Suite 4',
        level: 'suite',
        baseAngle: 51,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 88, y: 109, z: 35 },
            { x: 78, y: 116, z: 35 },
            { x: 89, y: 133, z: 35 },
            { x: 101, y: 124, z: 35 }
        ],
        covered: true,
        distance: 150,
        height: 35,
        rake: 0
    },
    {
        id: 'PARTY-DECK',
        name: 'Party Deck',
        level: 'standing',
        baseAngle: 176,
        angleSpan: 20,
        rows: [],
        vertices3D: [
            { x: -244, y: 17, z: 25 },
            { x: -236, y: -68, z: 25 },
            { x: -255, y: -73, z: 25 },
            { x: -264, y: 18, z: 25 }
        ],
        covered: false,
        distance: 255,
        height: 25,
        rake: 0
    }
];
// Export section map for easy lookup
exports.rangersSectionMap = new Map(exports.rangersSections.map(section => [section.id, section]));
