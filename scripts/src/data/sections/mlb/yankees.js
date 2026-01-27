"use strict";
// Yankee Stadium - Comprehensive Section Data
// Auto-generated with accurate 3D geometry for sun calculations
Object.defineProperty(exports, "__esModule", { value: true });
exports.yankeesSectionMap = exports.yankeesSections = void 0;
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
exports.yankeesSections = [
    {
        id: '100',
        name: 'Field Level 100',
        level: 'field',
        baseAngle: 40,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 38, y: 32, z: 0 },
            { x: 35, y: 35, z: 0 },
            { x: 48, y: 48, z: 8 },
            { x: 52, y: 44, z: 8 }
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
        baseAngle: 45,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 35, y: 35, z: 0 },
            { x: 32, y: 38, z: 0 },
            { x: 44, y: 52, z: 8 },
            { x: 48, y: 48, z: 8 }
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
        baseAngle: 50,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 32, y: 38, z: 0 },
            { x: 29, y: 41, z: 0 },
            { x: 39, y: 56, z: 8 },
            { x: 44, y: 52, z: 8 }
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
        baseAngle: 55,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 29, y: 41, z: 0 },
            { x: 25, y: 43, z: 0 },
            { x: 34, y: 59, z: 8 },
            { x: 39, y: 56, z: 8 }
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
        baseAngle: 60,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 25, y: 43, z: 0 },
            { x: 21, y: 45, z: 0 },
            { x: 29, y: 62, z: 8 },
            { x: 34, y: 59, z: 8 }
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
        baseAngle: 65,
        angleSpan: 5,
        rows: generateRows('A', 'N', 18, 0, 18, false),
        vertices3D: [
            { x: 21, y: 45, z: 0 },
            { x: 17, y: 47, z: 0 },
            { x: 23, y: 64, z: 8 },
            { x: 29, y: 62, z: 8 }
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
        baseAngle: 75,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 14, y: 53, z: 0 },
            { x: 7, y: 55, z: 0 },
            { x: 10, y: 84, z: 12 },
            { x: 22, y: 82, z: 12 }
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
        baseAngle: 83,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 7, y: 55, z: 0 },
            { x: -1, y: 55, z: 0 },
            { x: -1, y: 85, z: 12 },
            { x: 10, y: 84, z: 12 }
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
        baseAngle: 91,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -1, y: 55, z: 0 },
            { x: -9, y: 54, z: 0 },
            { x: -13, y: 84, z: 12 },
            { x: -1, y: 85, z: 12 }
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
        baseAngle: 99,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: -9, y: 54, z: 0 },
            { x: -16, y: 53, z: 0 },
            { x: -25, y: 81, z: 12 },
            { x: -13, y: 84, z: 12 }
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
        id: '115',
        name: 'Field Level 115',
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
        id: '116',
        name: 'Field Level 116',
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
        id: '117',
        name: 'Field Level 117',
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
        id: '118',
        name: 'Field Level 118',
        level: 'field',
        baseAngle: 19,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 52, y: 18, z: 0 },
            { x: 49, y: 25, z: 0 },
            { x: 76, y: 39, z: 12 },
            { x: 80, y: 28, z: 12 }
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
        baseAngle: 11,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 54, y: 10, z: 0 },
            { x: 52, y: 18, z: 0 },
            { x: 80, y: 28, z: 12 },
            { x: 83, y: 16, z: 12 }
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
        baseAngle: 3,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 55, y: 3, z: 0 },
            { x: 54, y: 10, z: 0 },
            { x: 83, y: 16, z: 12 },
            { x: 85, y: 4, z: 12 }
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
        baseAngle: 355,
        angleSpan: 8,
        rows: generateRows('A', 'V', 22, 0, 20, false),
        vertices3D: [
            { x: 55, y: -5, z: 0 },
            { x: 55, y: 3, z: 0 },
            { x: 85, y: 4, z: 12 },
            { x: 85, y: -7, z: 12 }
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
        id: '131',
        name: 'Lower Level 131',
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
        id: '132',
        name: 'Lower Level 132',
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
        id: '133',
        name: 'Lower Level 133',
        level: 'lower',
        baseAngle: 35,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 70, y: 49, z: 15 },
            { x: 65, y: 55, z: 15 },
            { x: 96, y: 80, z: 38 },
            { x: 102, y: 72, z: 38 }
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
        baseAngle: 40,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 65, y: 55, z: 15 },
            { x: 60, y: 60, z: 15 },
            { x: 88, y: 88, z: 38 },
            { x: 96, y: 80, z: 38 }
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
        baseAngle: 45,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 60, y: 60, z: 15 },
            { x: 55, y: 65, z: 15 },
            { x: 80, y: 96, z: 38 },
            { x: 88, y: 88, z: 38 }
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
        baseAngle: 50,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 55, y: 65, z: 15 },
            { x: 49, y: 70, z: 15 },
            { x: 72, y: 102, z: 38 },
            { x: 80, y: 96, z: 38 }
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
        baseAngle: 55,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 49, y: 70, z: 15 },
            { x: 43, y: 74, z: 15 },
            { x: 63, y: 108, z: 38 },
            { x: 72, y: 102, z: 38 }
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
        baseAngle: 60,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 43, y: 74, z: 15 },
            { x: 36, y: 77, z: 15 },
            { x: 53, y: 113, z: 38 },
            { x: 63, y: 108, z: 38 }
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
        baseAngle: 65,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 36, y: 77, z: 15 },
            { x: 29, y: 80, z: 15 },
            { x: 43, y: 117, z: 38 },
            { x: 53, y: 113, z: 38 }
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
        baseAngle: 70,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 29, y: 80, z: 15 },
            { x: 22, y: 82, z: 15 },
            { x: 32, y: 121, z: 38 },
            { x: 43, y: 117, z: 38 }
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
        baseAngle: 75,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 22, y: 82, z: 15 },
            { x: 15, y: 84, z: 15 },
            { x: 22, y: 123, z: 38 },
            { x: 32, y: 121, z: 38 }
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
        baseAngle: 80,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 15, y: 84, z: 15 },
            { x: 7, y: 85, z: 15 },
            { x: 11, y: 125, z: 38 },
            { x: 22, y: 123, z: 38 }
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
        baseAngle: 85,
        angleSpan: 5,
        rows: generateRows('1', '32', 24, 15, 24, false),
        vertices3D: [
            { x: 7, y: 85, z: 15 },
            { x: 0, y: 85, z: 15 },
            { x: 0, y: 125, z: 38 },
            { x: 11, y: 125, z: 38 }
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
        baseAngle: 35,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 102, y: 72, z: 30 },
            { x: 96, y: 80, z: 30 },
            { x: 115, y: 96, z: 45 },
            { x: 123, y: 86, z: 45 }
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
        baseAngle: 40,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 96, y: 80, z: 30 },
            { x: 88, y: 88, z: 30 },
            { x: 106, y: 106, z: 45 },
            { x: 115, y: 96, z: 45 }
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
        baseAngle: 45,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 88, y: 88, z: 30 },
            { x: 80, y: 96, z: 30 },
            { x: 96, y: 115, z: 45 },
            { x: 106, y: 106, z: 45 }
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
        baseAngle: 50,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 80, y: 96, z: 30 },
            { x: 72, y: 102, z: 30 },
            { x: 86, y: 123, z: 45 },
            { x: 96, y: 115, z: 45 }
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
        baseAngle: 55,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 72, y: 102, z: 30 },
            { x: 63, y: 108, z: 30 },
            { x: 75, y: 130, z: 45 },
            { x: 86, y: 123, z: 45 }
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
        baseAngle: 60,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 63, y: 108, z: 30 },
            { x: 53, y: 113, z: 30 },
            { x: 63, y: 136, z: 45 },
            { x: 75, y: 130, z: 45 }
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
        baseAngle: 65,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 53, y: 113, z: 30 },
            { x: 43, y: 117, z: 30 },
            { x: 51, y: 141, z: 45 },
            { x: 63, y: 136, z: 45 }
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
        baseAngle: 70,
        angleSpan: 5,
        rows: generateRows('A', 'L', 20, 30, 26, true),
        vertices3D: [
            { x: 43, y: 117, z: 30 },
            { x: 32, y: 121, z: 30 },
            { x: 39, y: 145, z: 45 },
            { x: 51, y: 141, z: 45 }
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
        id: '401',
        name: 'Upper Level 401',
        level: 'upper',
        baseAngle: 30,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 130, y: 75, z: 40 },
            { x: 123, y: 86, z: 40 },
            { x: 164, y: 115, z: 78 },
            { x: 173, y: 100, z: 78 }
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
        baseAngle: 35,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 123, y: 86, z: 40 },
            { x: 115, y: 96, z: 40 },
            { x: 153, y: 129, z: 78 },
            { x: 164, y: 115, z: 78 }
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
        baseAngle: 40,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 115, y: 96, z: 40 },
            { x: 106, y: 106, z: 40 },
            { x: 141, y: 141, z: 78 },
            { x: 153, y: 129, z: 78 }
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
        baseAngle: 45,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 106, y: 106, z: 40 },
            { x: 96, y: 115, z: 40 },
            { x: 129, y: 153, z: 78 },
            { x: 141, y: 141, z: 78 }
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
        baseAngle: 50,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 96, y: 115, z: 40 },
            { x: 86, y: 123, z: 40 },
            { x: 115, y: 164, z: 78 },
            { x: 129, y: 153, z: 78 }
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
        baseAngle: 55,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 86, y: 123, z: 40 },
            { x: 75, y: 130, z: 40 },
            { x: 100, y: 173, z: 78 },
            { x: 115, y: 164, z: 78 }
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
        baseAngle: 60,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 75, y: 130, z: 40 },
            { x: 63, y: 136, z: 40 },
            { x: 85, y: 181, z: 78 },
            { x: 100, y: 173, z: 78 }
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
        baseAngle: 65,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 63, y: 136, z: 40 },
            { x: 51, y: 141, z: 40 },
            { x: 68, y: 188, z: 78 },
            { x: 85, y: 181, z: 78 }
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
        baseAngle: 70,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, true),
        vertices3D: [
            { x: 51, y: 141, z: 40 },
            { x: 39, y: 145, z: 40 },
            { x: 52, y: 193, z: 78 },
            { x: 68, y: 188, z: 78 }
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
        baseAngle: 75,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 39, y: 145, z: 40 },
            { x: 26, y: 148, z: 40 },
            { x: 35, y: 197, z: 78 },
            { x: 52, y: 193, z: 78 }
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
        baseAngle: 80,
        angleSpan: 5,
        rows: generateRows('1', '35', 26, 40, 28, false),
        vertices3D: [
            { x: 26, y: 148, z: 40 },
            { x: 13, y: 149, z: 40 },
            { x: 17, y: 199, z: 78 },
            { x: 35, y: 197, z: 78 }
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
        baseAngle: 125,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -115, y: 164, z: 8 },
            { x: -146, y: 136, z: 8 },
            { x: -179, y: 167, z: 25 },
            { x: -141, y: 201, z: 25 }
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
        baseAngle: 140,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -153, y: 129, z: 8 },
            { x: -177, y: 94, z: 8 },
            { x: -216, y: 115, z: 25 },
            { x: -188, y: 157, z: 25 }
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
        baseAngle: 155,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -181, y: 85, z: 8 },
            { x: -195, y: 45, z: 8 },
            { x: -239, y: 55, z: 25 },
            { x: -222, y: 104, z: 25 }
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
        baseAngle: 170,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: -197, y: 35, z: 8 },
            { x: -200, y: -7, z: 8 },
            { x: -245, y: -9, z: 25 },
            { x: -241, y: 43, z: 25 }
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
        baseAngle: 345,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 193, y: -52, z: 8 },
            { x: 200, y: -10, z: 8 },
            { x: 245, y: -13, z: 25 },
            { x: 237, y: -63, z: 25 }
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
        baseAngle: 330,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 173, y: -100, z: 8 },
            { x: 190, y: -62, z: 8 },
            { x: 233, y: -76, z: 25 },
            { x: 212, y: -123, z: 25 }
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
        baseAngle: 315,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 141, y: -141, z: 8 },
            { x: 168, y: -109, z: 8 },
            { x: 205, y: -133, z: 25 },
            { x: 173, y: -173, z: 25 }
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
        baseAngle: 300,
        angleSpan: 12,
        rows: generateRows('A', 'T', 24, 8, 20, false),
        vertices3D: [
            { x: 100, y: -173, z: 8 },
            { x: 134, y: -149, z: 8 },
            { x: 164, y: -182, z: 25 },
            { x: 123, y: -212, z: 25 }
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
        baseAngle: 45,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 99, y: 99, z: 35 },
            { x: 90, y: 107, z: 35 },
            { x: 103, y: 123, z: 35 },
            { x: 113, y: 113, z: 35 }
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
        baseAngle: 50,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 90, y: 107, z: 35 },
            { x: 80, y: 115, z: 35 },
            { x: 92, y: 131, z: 35 },
            { x: 103, y: 123, z: 35 }
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
        baseAngle: 55,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 80, y: 115, z: 35 },
            { x: 70, y: 121, z: 35 },
            { x: 80, y: 139, z: 35 },
            { x: 92, y: 131, z: 35 }
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
        baseAngle: 60,
        angleSpan: 5,
        rows: generateRows('1', '1', 20, 35, 0, true),
        vertices3D: [
            { x: 70, y: 121, z: 35 },
            { x: 59, y: 127, z: 35 },
            { x: 68, y: 145, z: 35 },
            { x: 80, y: 139, z: 35 }
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
        baseAngle: 185,
        angleSpan: 20,
        rows: [],
        vertices3D: [
            { x: -244, y: -21, z: 25 },
            { x: -222, y: -104, z: 25 },
            { x: -240, y: -112, z: 25 },
            { x: -264, y: -23, z: 25 }
        ],
        covered: false,
        distance: 255,
        height: 25,
        rake: 0
    }
];
// Export section map for easy lookup
exports.yankeesSectionMap = new Map(exports.yankeesSections.map(section => [section.id, section]));
