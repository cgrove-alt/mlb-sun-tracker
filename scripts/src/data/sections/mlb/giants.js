"use strict";
// Oracle Park - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations
Object.defineProperty(exports, "__esModule", { value: true });
exports.giantsSectionMap = exports.giantsSections = void 0;
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
exports.giantsSections = [
    {
        id: '100',
        name: 'Field Level 100',
        level: 'field',
        baseAngle: 72,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 15, y: 48, z: 0 },
            { x: 11, y: 49, z: 0 },
            { x: 15, y: 66, z: 8 },
            { x: 21, y: 65, z: 8 }
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
        baseAngle: 77,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 11, y: 49, z: 0 },
            { x: 7, y: 50, z: 0 },
            { x: 9, y: 67, z: 8 },
            { x: 15, y: 66, z: 8 }
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
        baseAngle: 82,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 7, y: 50, z: 0 },
            { x: 3, y: 50, z: 0 },
            { x: 4, y: 68, z: 8 },
            { x: 9, y: 67, z: 8 }
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
        baseAngle: 87,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 3, y: 50, z: 0 },
            { x: -2, y: 50, z: 0 },
            { x: -2, y: 68, z: 8 },
            { x: 4, y: 68, z: 8 }
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
        baseAngle: 92,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: -2, y: 50, z: 0 },
            { x: -6, y: 50, z: 0 },
            { x: -8, y: 67, z: 8 },
            { x: -2, y: 68, z: 8 }
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
        baseAngle: 97,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: -6, y: 50, z: 0 },
            { x: -10, y: 49, z: 0 },
            { x: -14, y: 67, z: 8 },
            { x: -8, y: 67, z: 8 }
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
        baseAngle: 107,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -16, y: 53, z: 0 },
            { x: -23, y: 50, z: 0 },
            { x: -36, y: 77, z: 12 },
            { x: -25, y: 81, z: 12 }
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
        baseAngle: 115,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -23, y: 50, z: 0 },
            { x: -30, y: 46, z: 0 },
            { x: -46, y: 71, z: 12 },
            { x: -36, y: 77, z: 12 }
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
        baseAngle: 123,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -30, y: 46, z: 0 },
            { x: -36, y: 42, z: 0 },
            { x: -56, y: 64, z: 12 },
            { x: -46, y: 71, z: 12 }
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
        baseAngle: 131,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -36, y: 42, z: 0 },
            { x: -42, y: 36, z: 0 },
            { x: -64, y: 56, z: 12 },
            { x: -56, y: 64, z: 12 }
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
        baseAngle: 139,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -42, y: 36, z: 0 },
            { x: -46, y: 30, z: 0 },
            { x: -71, y: 46, z: 12 },
            { x: -64, y: 56, z: 12 }
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
        baseAngle: 147,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -46, y: 30, z: 0 },
            { x: -50, y: 23, z: 0 },
            { x: -77, y: 36, z: 12 },
            { x: -71, y: 46, z: 12 }
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
        baseAngle: 67,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 21, y: 51, z: 0 },
            { x: 14, y: 53, z: 0 },
            { x: 22, y: 82, z: 12 },
            { x: 33, y: 78, z: 12 }
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
        baseAngle: 59,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 28, y: 47, z: 0 },
            { x: 21, y: 51, z: 0 },
            { x: 33, y: 78, z: 12 },
            { x: 44, y: 73, z: 12 }
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
        baseAngle: 51,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 35, y: 43, z: 0 },
            { x: 28, y: 47, z: 0 },
            { x: 44, y: 73, z: 12 },
            { x: 53, y: 66, z: 12 }
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
        baseAngle: 43,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 40, y: 38, z: 0 },
            { x: 35, y: 43, z: 0 },
            { x: 53, y: 66, z: 12 },
            { x: 62, y: 58, z: 12 }
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
        baseAngle: 35,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 45, y: 32, z: 0 },
            { x: 40, y: 38, z: 0 },
            { x: 62, y: 58, z: 12 },
            { x: 70, y: 49, z: 12 }
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
        baseAngle: 27,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 49, y: 25, z: 0 },
            { x: 45, y: 32, z: 0 },
            { x: 70, y: 49, z: 12 },
            { x: 76, y: 39, z: 12 }
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
        baseAngle: 52,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 52, y: 67, z: 15 },
            { x: 46, y: 71, z: 15 },
            { x: 68, y: 105, z: 38 },
            { x: 77, y: 99, z: 38 }
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
        baseAngle: 57,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 46, y: 71, z: 15 },
            { x: 40, y: 75, z: 15 },
            { x: 59, y: 110, z: 38 },
            { x: 68, y: 105, z: 38 }
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
        baseAngle: 62,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 40, y: 75, z: 15 },
            { x: 33, y: 78, z: 15 },
            { x: 49, y: 115, z: 38 },
            { x: 59, y: 110, z: 38 }
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
        baseAngle: 67,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 33, y: 78, z: 15 },
            { x: 26, y: 81, z: 15 },
            { x: 39, y: 119, z: 38 },
            { x: 49, y: 115, z: 38 }
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
        baseAngle: 72,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 26, y: 81, z: 15 },
            { x: 19, y: 83, z: 15 },
            { x: 28, y: 122, z: 38 },
            { x: 39, y: 119, z: 38 }
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
        baseAngle: 77,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 19, y: 83, z: 15 },
            { x: 12, y: 84, z: 15 },
            { x: 17, y: 124, z: 38 },
            { x: 28, y: 122, z: 38 }
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
        baseAngle: 82,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 12, y: 84, z: 15 },
            { x: 4, y: 85, z: 15 },
            { x: 7, y: 125, z: 38 },
            { x: 17, y: 124, z: 38 }
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
        baseAngle: 87,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 4, y: 85, z: 15 },
            { x: -3, y: 85, z: 15 },
            { x: -4, y: 125, z: 38 },
            { x: 7, y: 125, z: 38 }
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
        baseAngle: 92,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: -3, y: 85, z: 15 },
            { x: -10, y: 84, z: 15 },
            { x: -15, y: 124, z: 38 },
            { x: -4, y: 125, z: 38 }
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
        baseAngle: 97,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: -10, y: 84, z: 15 },
            { x: -18, y: 83, z: 15 },
            { x: -26, y: 122, z: 38 },
            { x: -15, y: 124, z: 38 }
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
        baseAngle: 102,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: -18, y: 83, z: 15 },
            { x: -25, y: 81, z: 15 },
            { x: -37, y: 120, z: 38 },
            { x: -26, y: 122, z: 38 }
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
        baseAngle: 107,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: -25, y: 81, z: 15 },
            { x: -32, y: 79, z: 15 },
            { x: -47, y: 116, z: 38 },
            { x: -37, y: 120, z: 38 }
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
        baseAngle: 112,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: -32, y: 79, z: 15 },
            { x: -39, y: 76, z: 15 },
            { x: -57, y: 111, z: 38 },
            { x: -47, y: 116, z: 38 }
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
        baseAngle: 117,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: -39, y: 76, z: 15 },
            { x: -45, y: 72, z: 15 },
            { x: -66, y: 106, z: 38 },
            { x: -57, y: 111, z: 38 }
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
        baseAngle: 67,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 49, y: 115, z: 30 },
            { x: 39, y: 119, z: 30 },
            { x: 46, y: 143, z: 45 },
            { x: 59, y: 138, z: 45 }
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
        baseAngle: 72,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 39, y: 119, z: 30 },
            { x: 28, y: 122, z: 30 },
            { x: 34, y: 146, z: 45 },
            { x: 46, y: 143, z: 45 }
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
        baseAngle: 77,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 28, y: 122, z: 30 },
            { x: 17, y: 124, z: 30 },
            { x: 21, y: 149, z: 45 },
            { x: 34, y: 146, z: 45 }
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
        baseAngle: 82,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 17, y: 124, z: 30 },
            { x: 7, y: 125, z: 30 },
            { x: 8, y: 150, z: 45 },
            { x: 21, y: 149, z: 45 }
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
        baseAngle: 87,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 7, y: 125, z: 30 },
            { x: -4, y: 125, z: 30 },
            { x: -5, y: 150, z: 45 },
            { x: 8, y: 150, z: 45 }
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
        baseAngle: 92,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: -4, y: 125, z: 30 },
            { x: -15, y: 124, z: 30 },
            { x: -18, y: 149, z: 45 },
            { x: -5, y: 150, z: 45 }
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
        baseAngle: 97,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: -15, y: 124, z: 30 },
            { x: -26, y: 122, z: 30 },
            { x: -31, y: 147, z: 45 },
            { x: -18, y: 149, z: 45 }
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
        baseAngle: 102,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: -26, y: 122, z: 30 },
            { x: -37, y: 120, z: 30 },
            { x: -44, y: 143, z: 45 },
            { x: -31, y: 147, z: 45 }
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
        baseAngle: 57,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 82, y: 126, z: 40 },
            { x: 70, y: 132, z: 40 },
            { x: 94, y: 177, z: 78 },
            { x: 109, y: 168, z: 78 }
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
        baseAngle: 62,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 70, y: 132, z: 40 },
            { x: 59, y: 138, z: 40 },
            { x: 78, y: 184, z: 78 },
            { x: 94, y: 177, z: 78 }
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
        baseAngle: 67,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 59, y: 138, z: 40 },
            { x: 46, y: 143, z: 40 },
            { x: 62, y: 190, z: 78 },
            { x: 78, y: 184, z: 78 }
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
        baseAngle: 72,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 46, y: 143, z: 40 },
            { x: 34, y: 146, z: 40 },
            { x: 45, y: 195, z: 78 },
            { x: 62, y: 190, z: 78 }
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
        baseAngle: 77,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 34, y: 146, z: 40 },
            { x: 21, y: 149, z: 40 },
            { x: 28, y: 198, z: 78 },
            { x: 45, y: 195, z: 78 }
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
        baseAngle: 82,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 21, y: 149, z: 40 },
            { x: 8, y: 150, z: 40 },
            { x: 10, y: 200, z: 78 },
            { x: 28, y: 198, z: 78 }
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
        baseAngle: 87,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 8, y: 150, z: 40 },
            { x: -5, y: 150, z: 40 },
            { x: -7, y: 200, z: 78 },
            { x: 10, y: 200, z: 78 }
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
        baseAngle: 92,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: -5, y: 150, z: 40 },
            { x: -18, y: 149, z: 40 },
            { x: -24, y: 199, z: 78 },
            { x: -7, y: 200, z: 78 }
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
        baseAngle: 97,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: -18, y: 149, z: 40 },
            { x: -31, y: 147, z: 40 },
            { x: -42, y: 196, z: 78 },
            { x: -24, y: 199, z: 78 }
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
        baseAngle: 102,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: -31, y: 147, z: 40 },
            { x: -44, y: 143, z: 40 },
            { x: -58, y: 191, z: 78 },
            { x: -42, y: 196, z: 78 }
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
        baseAngle: 107,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: -44, y: 143, z: 40 },
            { x: -56, y: 139, z: 40 },
            { x: -75, y: 185, z: 78 },
            { x: -58, y: 191, z: 78 }
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
        baseAngle: 112,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: -56, y: 139, z: 40 },
            { x: -68, y: 134, z: 40 },
            { x: -91, y: 178, z: 78 },
            { x: -75, y: 185, z: 78 }
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
        baseAngle: 157,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -184, y: 78, z: 8 },
            { x: -196, y: 38, z: 8 },
            { x: -240, y: 47, z: 25 },
            { x: -226, y: 96, z: 25 }
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
        baseAngle: 172,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -198, y: 28, z: 8 },
            { x: -200, y: -14, z: 8 },
            { x: -244, y: -17, z: 25 },
            { x: -243, y: 34, z: 25 }
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
        baseAngle: 187,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -199, y: -24, z: 8 },
            { x: -189, y: -65, z: 8 },
            { x: -232, y: -80, z: 25 },
            { x: -243, y: -30, z: 25 }
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
        baseAngle: 202,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -185, y: -75, z: 8 },
            { x: -166, y: -112, z: 8 },
            { x: -203, y: -137, z: 25 },
            { x: -227, y: -92, z: 25 }
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
        baseAngle: 17,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 191, y: 58, z: 8 },
            { x: 175, y: 97, z: 8 },
            { x: 214, y: 119, z: 25 },
            { x: 234, y: 72, z: 25 }
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
        baseAngle: 2,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 200, y: 7, z: 8 },
            { x: 194, y: 48, z: 8 },
            { x: 238, y: 59, z: 25 },
            { x: 245, y: 9, z: 25 }
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
        baseAngle: 347,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 195, y: -45, z: 8 },
            { x: 200, y: -3, z: 8 },
            { x: 245, y: -4, z: 25 },
            { x: 239, y: -55, z: 25 }
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
        baseAngle: 332,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 177, y: -94, z: 8 },
            { x: 192, y: -55, z: 8 },
            { x: 236, y: -68, z: 25 },
            { x: 216, y: -115, z: 25 }
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
        baseAngle: 77,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 31, y: 136, z: 35 },
            { x: 19, y: 139, z: 35 },
            { x: 22, y: 158, z: 35 },
            { x: 36, y: 156, z: 35 }
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
        baseAngle: 82,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 19, y: 139, z: 35 },
            { x: 7, y: 140, z: 35 },
            { x: 8, y: 160, z: 35 },
            { x: 22, y: 158, z: 35 }
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
        baseAngle: 87,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 7, y: 140, z: 35 },
            { x: -5, y: 140, z: 35 },
            { x: -6, y: 160, z: 35 },
            { x: 8, y: 160, z: 35 }
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
        baseAngle: 92,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: -5, y: 140, z: 35 },
            { x: -17, y: 139, z: 35 },
            { x: -19, y: 159, z: 35 },
            { x: -6, y: 160, z: 35 }
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
        baseAngle: 217,
        angleSpan: 20,
        rows: [],
        vertices3D: [
            { x: -196, y: -147, z: 25 },
            { x: -133, y: -205, z: 25 },
            { x: -144, y: -222, z: 25 },
            { x: -212, y: -159, z: 25 }
        ],
        covered: false,
        distance: 255,
        height: 25,
        rake: 0
    }
];
// Export section map for easy lookup
exports.giantsSectionMap = new Map(exports.giantsSections.map(section => [section.id, section]));
