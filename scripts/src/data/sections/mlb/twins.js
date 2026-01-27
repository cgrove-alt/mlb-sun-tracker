"use strict";
// Target Field - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations
Object.defineProperty(exports, "__esModule", { value: true });
exports.twinsSectionMap = exports.twinsSections = void 0;
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
exports.twinsSections = [
    {
        id: '100',
        name: 'Field Level 100',
        level: 'field',
        baseAngle: 345,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 48, y: -13, z: 0 },
            { x: 49, y: -9, z: 0 },
            { x: 67, y: -12, z: 8 },
            { x: 66, y: -18, z: 8 }
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
        baseAngle: 350,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 49, y: -9, z: 0 },
            { x: 50, y: -4, z: 0 },
            { x: 68, y: -6, z: 8 },
            { x: 67, y: -12, z: 8 }
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
        baseAngle: 355,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 50, y: -4, z: 0 },
            { x: 50, y: -0, z: 0 },
            { x: 68, y: -0, z: 8 },
            { x: 68, y: -6, z: 8 }
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
        baseAngle: 0,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 50, y: 0, z: 0 },
            { x: 50, y: 4, z: 0 },
            { x: 68, y: 6, z: 8 },
            { x: 68, y: 0, z: 8 }
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
        baseAngle: 5,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 50, y: 4, z: 0 },
            { x: 49, y: 9, z: 0 },
            { x: 67, y: 12, z: 8 },
            { x: 68, y: 6, z: 8 }
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
        baseAngle: 10,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 49, y: 9, z: 0 },
            { x: 48, y: 13, z: 0 },
            { x: 66, y: 18, z: 8 },
            { x: 67, y: 12, z: 8 }
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
        baseAngle: 20,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 52, y: 19, z: 0 },
            { x: 49, y: 26, z: 0 },
            { x: 75, y: 40, z: 12 },
            { x: 80, y: 29, z: 12 }
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
        baseAngle: 28,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 49, y: 26, z: 0 },
            { x: 44, y: 32, z: 0 },
            { x: 69, y: 50, z: 12 },
            { x: 75, y: 40, z: 12 }
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
        baseAngle: 36,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 44, y: 32, z: 0 },
            { x: 40, y: 38, z: 0 },
            { x: 61, y: 59, z: 12 },
            { x: 69, y: 50, z: 12 }
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
        baseAngle: 44,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 40, y: 38, z: 0 },
            { x: 34, y: 43, z: 0 },
            { x: 52, y: 67, z: 12 },
            { x: 61, y: 59, z: 12 }
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
        baseAngle: 52,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 34, y: 43, z: 0 },
            { x: 28, y: 48, z: 0 },
            { x: 43, y: 74, z: 12 },
            { x: 52, y: 67, z: 12 }
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
        baseAngle: 60,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 28, y: 48, z: 0 },
            { x: 21, y: 51, z: 0 },
            { x: 32, y: 79, z: 12 },
            { x: 43, y: 74, z: 12 }
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
        baseAngle: 340,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 52, y: -19, z: 0 },
            { x: 54, y: -11, z: 0 },
            { x: 83, y: -18, z: 12 },
            { x: 80, y: -29, z: 12 }
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
        baseAngle: 332,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 49, y: -26, z: 0 },
            { x: 52, y: -19, z: 0 },
            { x: 80, y: -29, z: 12 },
            { x: 75, y: -40, z: 12 }
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
        baseAngle: 324,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 44, y: -32, z: 0 },
            { x: 49, y: -26, z: 0 },
            { x: 75, y: -40, z: 12 },
            { x: 69, y: -50, z: 12 }
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
        baseAngle: 316,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 40, y: -38, z: 0 },
            { x: 44, y: -32, z: 0 },
            { x: 69, y: -50, z: 12 },
            { x: 61, y: -59, z: 12 }
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
        baseAngle: 308,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 34, y: -43, z: 0 },
            { x: 40, y: -38, z: 0 },
            { x: 61, y: -59, z: 12 },
            { x: 52, y: -67, z: 12 }
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
        baseAngle: 300,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 28, y: -48, z: 0 },
            { x: 34, y: -43, z: 0 },
            { x: 52, y: -67, z: 12 },
            { x: 43, y: -74, z: 12 }
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
        baseAngle: 325,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 70, y: -49, z: 15 },
            { x: 74, y: -43, z: 15 },
            { x: 108, y: -63, z: 38 },
            { x: 102, y: -72, z: 38 }
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
        baseAngle: 330,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 74, y: -43, z: 15 },
            { x: 77, y: -36, z: 15 },
            { x: 113, y: -53, z: 38 },
            { x: 108, y: -63, z: 38 }
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
        baseAngle: 335,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 77, y: -36, z: 15 },
            { x: 80, y: -29, z: 15 },
            { x: 117, y: -43, z: 38 },
            { x: 113, y: -53, z: 38 }
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
        baseAngle: 340,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 80, y: -29, z: 15 },
            { x: 82, y: -22, z: 15 },
            { x: 121, y: -32, z: 38 },
            { x: 117, y: -43, z: 38 }
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
        baseAngle: 345,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 82, y: -22, z: 15 },
            { x: 84, y: -15, z: 15 },
            { x: 123, y: -22, z: 38 },
            { x: 121, y: -32, z: 38 }
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
        baseAngle: 350,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 84, y: -15, z: 15 },
            { x: 85, y: -7, z: 15 },
            { x: 125, y: -11, z: 38 },
            { x: 123, y: -22, z: 38 }
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
        baseAngle: 355,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 85, y: -7, z: 15 },
            { x: 85, y: -0, z: 15 },
            { x: 125, y: -0, z: 38 },
            { x: 125, y: -11, z: 38 }
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
        baseAngle: 0,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 85, y: 0, z: 15 },
            { x: 85, y: 7, z: 15 },
            { x: 125, y: 11, z: 38 },
            { x: 125, y: 0, z: 38 }
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
        baseAngle: 5,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 85, y: 7, z: 15 },
            { x: 84, y: 15, z: 15 },
            { x: 123, y: 22, z: 38 },
            { x: 125, y: 11, z: 38 }
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
        baseAngle: 10,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 84, y: 15, z: 15 },
            { x: 82, y: 22, z: 15 },
            { x: 121, y: 32, z: 38 },
            { x: 123, y: 22, z: 38 }
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
        baseAngle: 15,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 82, y: 22, z: 15 },
            { x: 80, y: 29, z: 15 },
            { x: 117, y: 43, z: 38 },
            { x: 121, y: 32, z: 38 }
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
        baseAngle: 20,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 80, y: 29, z: 15 },
            { x: 77, y: 36, z: 15 },
            { x: 113, y: 53, z: 38 },
            { x: 117, y: 43, z: 38 }
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
        baseAngle: 25,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 77, y: 36, z: 15 },
            { x: 74, y: 42, z: 15 },
            { x: 108, y: 62, z: 38 },
            { x: 113, y: 53, z: 38 }
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
        baseAngle: 30,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 74, y: 42, z: 15 },
            { x: 70, y: 49, z: 15 },
            { x: 102, y: 72, z: 38 },
            { x: 108, y: 62, z: 38 }
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
        baseAngle: 340,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 117, y: -43, z: 30 },
            { x: 121, y: -32, z: 30 },
            { x: 145, y: -39, z: 45 },
            { x: 141, y: -51, z: 45 }
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
        baseAngle: 345,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 121, y: -32, z: 30 },
            { x: 123, y: -22, z: 30 },
            { x: 148, y: -26, z: 45 },
            { x: 145, y: -39, z: 45 }
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
        baseAngle: 350,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 123, y: -22, z: 30 },
            { x: 125, y: -11, z: 30 },
            { x: 149, y: -13, z: 45 },
            { x: 148, y: -26, z: 45 }
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
        baseAngle: 355,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 125, y: -11, z: 30 },
            { x: 125, y: -0, z: 30 },
            { x: 150, y: -0, z: 45 },
            { x: 149, y: -13, z: 45 }
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
        baseAngle: 0,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 125, y: 0, z: 30 },
            { x: 125, y: 11, z: 30 },
            { x: 149, y: 13, z: 45 },
            { x: 150, y: 0, z: 45 }
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
        baseAngle: 5,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 125, y: 11, z: 30 },
            { x: 123, y: 22, z: 30 },
            { x: 148, y: 26, z: 45 },
            { x: 149, y: 13, z: 45 }
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
        baseAngle: 10,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 123, y: 22, z: 30 },
            { x: 121, y: 32, z: 30 },
            { x: 145, y: 39, z: 45 },
            { x: 148, y: 26, z: 45 }
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
        baseAngle: 15,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 121, y: 32, z: 30 },
            { x: 117, y: 43, z: 30 },
            { x: 141, y: 51, z: 45 },
            { x: 145, y: 39, z: 45 }
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
        baseAngle: 330,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 130, y: -75, z: 40 },
            { x: 136, y: -63, z: 40 },
            { x: 181, y: -85, z: 78 },
            { x: 173, y: -100, z: 78 }
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
        baseAngle: 335,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 136, y: -63, z: 40 },
            { x: 141, y: -51, z: 40 },
            { x: 188, y: -68, z: 78 },
            { x: 181, y: -85, z: 78 }
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
        baseAngle: 340,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 141, y: -51, z: 40 },
            { x: 145, y: -39, z: 40 },
            { x: 193, y: -52, z: 78 },
            { x: 188, y: -68, z: 78 }
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
        baseAngle: 345,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 145, y: -39, z: 40 },
            { x: 148, y: -26, z: 40 },
            { x: 197, y: -35, z: 78 },
            { x: 193, y: -52, z: 78 }
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
        baseAngle: 350,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 148, y: -26, z: 40 },
            { x: 149, y: -13, z: 40 },
            { x: 199, y: -17, z: 78 },
            { x: 197, y: -35, z: 78 }
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
        baseAngle: 355,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 149, y: -13, z: 40 },
            { x: 150, y: -0, z: 40 },
            { x: 200, y: -0, z: 78 },
            { x: 199, y: -17, z: 78 }
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
        baseAngle: 0,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 150, y: 0, z: 40 },
            { x: 149, y: 13, z: 40 },
            { x: 199, y: 17, z: 78 },
            { x: 200, y: 0, z: 78 }
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
        baseAngle: 5,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 149, y: 13, z: 40 },
            { x: 148, y: 26, z: 40 },
            { x: 197, y: 35, z: 78 },
            { x: 199, y: 17, z: 78 }
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
        baseAngle: 10,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 148, y: 26, z: 40 },
            { x: 145, y: 39, z: 40 },
            { x: 193, y: 52, z: 78 },
            { x: 197, y: 35, z: 78 }
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
        baseAngle: 15,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 145, y: 39, z: 40 },
            { x: 141, y: 51, z: 40 },
            { x: 188, y: 68, z: 78 },
            { x: 193, y: 52, z: 78 }
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
        baseAngle: 20,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 141, y: 51, z: 40 },
            { x: 136, y: 63, z: 40 },
            { x: 181, y: 85, z: 78 },
            { x: 188, y: 68, z: 78 }
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
        baseAngle: 25,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 136, y: 63, z: 40 },
            { x: 130, y: 75, z: 40 },
            { x: 173, y: 100, z: 78 },
            { x: 181, y: 85, z: 78 }
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
        baseAngle: 70,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 68, y: 188, z: 8 },
            { x: 28, y: 198, z: 8 },
            { x: 34, y: 243, z: 25 },
            { x: 84, y: 230, z: 25 }
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
        baseAngle: 85,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 17, y: 199, z: 8 },
            { x: -24, y: 199, z: 8 },
            { x: -30, y: 243, z: 25 },
            { x: 21, y: 244, z: 25 }
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
        baseAngle: 100,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -35, y: 197, z: 8 },
            { x: -75, y: 185, z: 8 },
            { x: -92, y: 227, z: 25 },
            { x: -43, y: 241, z: 25 }
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
        baseAngle: 115,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -85, y: 181, z: 8 },
            { x: -120, y: 160, z: 8 },
            { x: -147, y: 196, z: 25 },
            { x: -104, y: 222, z: 25 }
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
        baseAngle: 290,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 68, y: -188, z: 8 },
            { x: 106, y: -170, z: 8 },
            { x: 130, y: -208, z: 25 },
            { x: 84, y: -230, z: 25 }
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
        baseAngle: 275,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 17, y: -199, z: 8 },
            { x: 58, y: -191, z: 8 },
            { x: 72, y: -234, z: 25 },
            { x: 21, y: -244, z: 25 }
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
        baseAngle: 260,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -35, y: -197, z: 8 },
            { x: 7, y: -200, z: 8 },
            { x: 9, y: -245, z: 25 },
            { x: -43, y: -241, z: 25 }
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
        baseAngle: 245,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -85, y: -181, z: 8 },
            { x: -45, y: -195, z: 8 },
            { x: -55, y: -239, z: 25 },
            { x: -104, y: -222, z: 25 }
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
        baseAngle: 350,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 138, y: -24, z: 35 },
            { x: 139, y: -12, z: 35 },
            { x: 159, y: -14, z: 35 },
            { x: 158, y: -28, z: 35 }
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
        baseAngle: 355,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 139, y: -12, z: 35 },
            { x: 140, y: -0, z: 35 },
            { x: 160, y: -0, z: 35 },
            { x: 159, y: -14, z: 35 }
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
        baseAngle: 0,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 140, y: 0, z: 35 },
            { x: 139, y: 12, z: 35 },
            { x: 159, y: 14, z: 35 },
            { x: 160, y: 0, z: 35 }
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
        baseAngle: 5,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 139, y: 12, z: 35 },
            { x: 138, y: 24, z: 35 },
            { x: 158, y: 28, z: 35 },
            { x: 159, y: 14, z: 35 }
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
        baseAngle: 130,
        angleSpan: 20,
        rows: [],
        vertices3D: [
            { x: -157, y: 188, z: 25 },
            { x: -212, y: 122, z: 25 },
            { x: -229, y: 132, z: 25 },
            { x: -170, y: 203, z: 25 }
        ],
        covered: false,
        distance: 255,
        height: 25,
        rake: 0
    }
];
// Export section map for easy lookup
exports.twinsSectionMap = new Map(exports.twinsSections.map(section => [section.id, section]));
