"use strict";
// American Family Field - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations
Object.defineProperty(exports, "__esModule", { value: true });
exports.brewersSectionMap = exports.brewersSections = void 0;
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
exports.brewersSections = [
    {
        id: '100',
        name: 'Field Level 100',
        level: 'field',
        baseAngle: 342,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 48, y: -15, z: 0 },
            { x: 49, y: -11, z: 0 },
            { x: 66, y: -15, z: 8 },
            { x: 65, y: -21, z: 8 }
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
        baseAngle: 347,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 49, y: -11, z: 0 },
            { x: 50, y: -7, z: 0 },
            { x: 67, y: -9, z: 8 },
            { x: 66, y: -15, z: 8 }
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
        baseAngle: 352,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 50, y: -7, z: 0 },
            { x: 50, y: -3, z: 0 },
            { x: 68, y: -4, z: 8 },
            { x: 67, y: -9, z: 8 }
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
        baseAngle: 357,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 50, y: -3, z: 0 },
            { x: 50, y: 2, z: 0 },
            { x: 68, y: 2, z: 8 },
            { x: 68, y: -4, z: 8 }
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
        baseAngle: 2,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 50, y: 2, z: 0 },
            { x: 50, y: 6, z: 0 },
            { x: 67, y: 8, z: 8 },
            { x: 68, y: 2, z: 8 }
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
        baseAngle: 7,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 50, y: 6, z: 0 },
            { x: 49, y: 10, z: 0 },
            { x: 67, y: 14, z: 8 },
            { x: 67, y: 8, z: 8 }
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
        baseAngle: 17,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 53, y: 16, z: 0 },
            { x: 50, y: 23, z: 0 },
            { x: 77, y: 36, z: 12 },
            { x: 81, y: 25, z: 12 }
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
        baseAngle: 25,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 50, y: 23, z: 0 },
            { x: 46, y: 30, z: 0 },
            { x: 71, y: 46, z: 12 },
            { x: 77, y: 36, z: 12 }
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
        baseAngle: 33,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 46, y: 30, z: 0 },
            { x: 42, y: 36, z: 0 },
            { x: 64, y: 56, z: 12 },
            { x: 71, y: 46, z: 12 }
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
        baseAngle: 41,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 42, y: 36, z: 0 },
            { x: 36, y: 42, z: 0 },
            { x: 56, y: 64, z: 12 },
            { x: 64, y: 56, z: 12 }
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
        baseAngle: 49,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 36, y: 42, z: 0 },
            { x: 30, y: 46, z: 0 },
            { x: 46, y: 71, z: 12 },
            { x: 56, y: 64, z: 12 }
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
        baseAngle: 57,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 30, y: 46, z: 0 },
            { x: 23, y: 50, z: 0 },
            { x: 36, y: 77, z: 12 },
            { x: 46, y: 71, z: 12 }
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
        baseAngle: 337,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 51, y: -21, z: 0 },
            { x: 53, y: -14, z: 0 },
            { x: 82, y: -22, z: 12 },
            { x: 78, y: -33, z: 12 }
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
        baseAngle: 329,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 47, y: -28, z: 0 },
            { x: 51, y: -21, z: 0 },
            { x: 78, y: -33, z: 12 },
            { x: 73, y: -44, z: 12 }
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
        baseAngle: 321,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 43, y: -35, z: 0 },
            { x: 47, y: -28, z: 0 },
            { x: 73, y: -44, z: 12 },
            { x: 66, y: -53, z: 12 }
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
        baseAngle: 313,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 38, y: -40, z: 0 },
            { x: 43, y: -35, z: 0 },
            { x: 66, y: -53, z: 12 },
            { x: 58, y: -62, z: 12 }
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
        baseAngle: 305,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 32, y: -45, z: 0 },
            { x: 38, y: -40, z: 0 },
            { x: 58, y: -62, z: 12 },
            { x: 49, y: -70, z: 12 }
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
        baseAngle: 297,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 25, y: -49, z: 0 },
            { x: 32, y: -45, z: 0 },
            { x: 49, y: -70, z: 12 },
            { x: 39, y: -76, z: 12 }
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
        baseAngle: 322,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 67, y: -52, z: 15 },
            { x: 71, y: -46, z: 15 },
            { x: 105, y: -68, z: 38 },
            { x: 99, y: -77, z: 38 }
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
        baseAngle: 327,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 71, y: -46, z: 15 },
            { x: 75, y: -40, z: 15 },
            { x: 110, y: -59, z: 38 },
            { x: 105, y: -68, z: 38 }
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
        baseAngle: 332,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 75, y: -40, z: 15 },
            { x: 78, y: -33, z: 15 },
            { x: 115, y: -49, z: 38 },
            { x: 110, y: -59, z: 38 }
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
        baseAngle: 337,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 78, y: -33, z: 15 },
            { x: 81, y: -26, z: 15 },
            { x: 119, y: -39, z: 38 },
            { x: 115, y: -49, z: 38 }
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
        baseAngle: 342,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 81, y: -26, z: 15 },
            { x: 83, y: -19, z: 15 },
            { x: 122, y: -28, z: 38 },
            { x: 119, y: -39, z: 38 }
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
        baseAngle: 347,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 83, y: -19, z: 15 },
            { x: 84, y: -12, z: 15 },
            { x: 124, y: -17, z: 38 },
            { x: 122, y: -28, z: 38 }
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
        baseAngle: 352,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 84, y: -12, z: 15 },
            { x: 85, y: -4, z: 15 },
            { x: 125, y: -7, z: 38 },
            { x: 124, y: -17, z: 38 }
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
        baseAngle: 357,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 85, y: -4, z: 15 },
            { x: 85, y: 3, z: 15 },
            { x: 125, y: 4, z: 38 },
            { x: 125, y: -7, z: 38 }
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
        baseAngle: 2,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 85, y: 3, z: 15 },
            { x: 84, y: 10, z: 15 },
            { x: 124, y: 15, z: 38 },
            { x: 125, y: 4, z: 38 }
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
        baseAngle: 7,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 84, y: 10, z: 15 },
            { x: 83, y: 18, z: 15 },
            { x: 122, y: 26, z: 38 },
            { x: 124, y: 15, z: 38 }
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
        baseAngle: 12,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 83, y: 18, z: 15 },
            { x: 81, y: 25, z: 15 },
            { x: 120, y: 37, z: 38 },
            { x: 122, y: 26, z: 38 }
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
        baseAngle: 17,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 81, y: 25, z: 15 },
            { x: 79, y: 32, z: 15 },
            { x: 116, y: 47, z: 38 },
            { x: 120, y: 37, z: 38 }
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
        baseAngle: 22,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 79, y: 32, z: 15 },
            { x: 76, y: 39, z: 15 },
            { x: 111, y: 57, z: 38 },
            { x: 116, y: 47, z: 38 }
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
        baseAngle: 27,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 76, y: 39, z: 15 },
            { x: 72, y: 45, z: 15 },
            { x: 106, y: 66, z: 38 },
            { x: 111, y: 57, z: 38 }
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
        baseAngle: 337,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 115, y: -49, z: 30 },
            { x: 119, y: -39, z: 30 },
            { x: 143, y: -46, z: 45 },
            { x: 138, y: -59, z: 45 }
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
        baseAngle: 342,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 119, y: -39, z: 30 },
            { x: 122, y: -28, z: 30 },
            { x: 146, y: -34, z: 45 },
            { x: 143, y: -46, z: 45 }
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
        baseAngle: 347,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 122, y: -28, z: 30 },
            { x: 124, y: -17, z: 30 },
            { x: 149, y: -21, z: 45 },
            { x: 146, y: -34, z: 45 }
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
        baseAngle: 352,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 124, y: -17, z: 30 },
            { x: 125, y: -7, z: 30 },
            { x: 150, y: -8, z: 45 },
            { x: 149, y: -21, z: 45 }
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
        baseAngle: 357,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 125, y: -7, z: 30 },
            { x: 125, y: 4, z: 30 },
            { x: 150, y: 5, z: 45 },
            { x: 150, y: -8, z: 45 }
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
        baseAngle: 2,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 125, y: 4, z: 30 },
            { x: 124, y: 15, z: 30 },
            { x: 149, y: 18, z: 45 },
            { x: 150, y: 5, z: 45 }
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
        baseAngle: 7,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 124, y: 15, z: 30 },
            { x: 122, y: 26, z: 30 },
            { x: 147, y: 31, z: 45 },
            { x: 149, y: 18, z: 45 }
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
        baseAngle: 12,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 122, y: 26, z: 30 },
            { x: 120, y: 37, z: 30 },
            { x: 143, y: 44, z: 45 },
            { x: 147, y: 31, z: 45 }
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
        baseAngle: 327,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 126, y: -82, z: 40 },
            { x: 132, y: -70, z: 40 },
            { x: 177, y: -94, z: 78 },
            { x: 168, y: -109, z: 78 }
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
        baseAngle: 332,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 132, y: -70, z: 40 },
            { x: 138, y: -59, z: 40 },
            { x: 184, y: -78, z: 78 },
            { x: 177, y: -94, z: 78 }
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
        baseAngle: 337,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 138, y: -59, z: 40 },
            { x: 143, y: -46, z: 40 },
            { x: 190, y: -62, z: 78 },
            { x: 184, y: -78, z: 78 }
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
        baseAngle: 342,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 143, y: -46, z: 40 },
            { x: 146, y: -34, z: 40 },
            { x: 195, y: -45, z: 78 },
            { x: 190, y: -62, z: 78 }
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
        baseAngle: 347,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 146, y: -34, z: 40 },
            { x: 149, y: -21, z: 40 },
            { x: 198, y: -28, z: 78 },
            { x: 195, y: -45, z: 78 }
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
        baseAngle: 352,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 149, y: -21, z: 40 },
            { x: 150, y: -8, z: 40 },
            { x: 200, y: -10, z: 78 },
            { x: 198, y: -28, z: 78 }
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
        baseAngle: 357,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 150, y: -8, z: 40 },
            { x: 150, y: 5, z: 40 },
            { x: 200, y: 7, z: 78 },
            { x: 200, y: -10, z: 78 }
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
        baseAngle: 2,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 150, y: 5, z: 40 },
            { x: 149, y: 18, z: 40 },
            { x: 199, y: 24, z: 78 },
            { x: 200, y: 7, z: 78 }
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
        baseAngle: 7,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 149, y: 18, z: 40 },
            { x: 147, y: 31, z: 40 },
            { x: 196, y: 42, z: 78 },
            { x: 199, y: 24, z: 78 }
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
        baseAngle: 12,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 147, y: 31, z: 40 },
            { x: 143, y: 44, z: 40 },
            { x: 191, y: 58, z: 78 },
            { x: 196, y: 42, z: 78 }
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
        baseAngle: 17,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 143, y: 44, z: 40 },
            { x: 139, y: 56, z: 40 },
            { x: 185, y: 75, z: 78 },
            { x: 191, y: 58, z: 78 }
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
        baseAngle: 22,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 139, y: 56, z: 40 },
            { x: 134, y: 68, z: 40 },
            { x: 178, y: 91, z: 78 },
            { x: 185, y: 75, z: 78 }
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
        baseAngle: 67,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 78, y: 184, z: 8 },
            { x: 38, y: 196, z: 8 },
            { x: 47, y: 240, z: 25 },
            { x: 96, y: 226, z: 25 }
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
        baseAngle: 82,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 28, y: 198, z: 8 },
            { x: -14, y: 200, z: 8 },
            { x: -17, y: 244, z: 25 },
            { x: 34, y: 243, z: 25 }
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
        baseAngle: 97,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -24, y: 199, z: 8 },
            { x: -65, y: 189, z: 8 },
            { x: -80, y: 232, z: 25 },
            { x: -30, y: 243, z: 25 }
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
        baseAngle: 112,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -75, y: 185, z: 8 },
            { x: -112, y: 166, z: 8 },
            { x: -137, y: 203, z: 25 },
            { x: -92, y: 227, z: 25 }
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
        baseAngle: 287,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 58, y: -191, z: 8 },
            { x: 97, y: -175, z: 8 },
            { x: 119, y: -214, z: 25 },
            { x: 72, y: -234, z: 25 }
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
        baseAngle: 272,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 7, y: -200, z: 8 },
            { x: 48, y: -194, z: 8 },
            { x: 59, y: -238, z: 25 },
            { x: 9, y: -245, z: 25 }
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
        baseAngle: 257,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -45, y: -195, z: 8 },
            { x: -3, y: -200, z: 8 },
            { x: -4, y: -245, z: 25 },
            { x: -55, y: -239, z: 25 }
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
        baseAngle: 242,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -94, y: -177, z: 8 },
            { x: -55, y: -192, z: 8 },
            { x: -68, y: -236, z: 25 },
            { x: -115, y: -216, z: 25 }
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
        baseAngle: 347,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 136, y: -31, z: 35 },
            { x: 139, y: -19, z: 35 },
            { x: 158, y: -22, z: 35 },
            { x: 156, y: -36, z: 35 }
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
        baseAngle: 352,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 139, y: -19, z: 35 },
            { x: 140, y: -7, z: 35 },
            { x: 160, y: -8, z: 35 },
            { x: 158, y: -22, z: 35 }
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
        baseAngle: 357,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 140, y: -7, z: 35 },
            { x: 140, y: 5, z: 35 },
            { x: 160, y: 6, z: 35 },
            { x: 160, y: -8, z: 35 }
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
        baseAngle: 2,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 140, y: 5, z: 35 },
            { x: 139, y: 17, z: 35 },
            { x: 159, y: 19, z: 35 },
            { x: 160, y: 6, z: 35 }
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
        baseAngle: 127,
        angleSpan: 20,
        rows: [],
        vertices3D: [
            { x: -147, y: 196, z: 25 },
            { x: -205, y: 133, z: 25 },
            { x: -222, y: 144, z: 25 },
            { x: -159, y: 212, z: 25 }
        ],
        covered: false,
        distance: 255,
        height: 25,
        rake: 0
    }
];
// Export section map for easy lookup
exports.brewersSectionMap = new Map(exports.brewersSections.map(section => [section.id, section]));
