"use strict";
// SoFi Stadium - Complete Section Data with 3D Geometry
// Inglewood, CA - Opened 2020 - Capacity 70,240 (expandable to 100,240)
// Home to LA Rams and LA Chargers
Object.defineProperty(exports, "__esModule", { value: true });
exports.sofiStadiumFeatures = exports.sofiStadiumSectionMap = exports.sofiStadiumCapacity = exports.sofiStadiumSections = void 0;
// Helper to generate row details for football stadium
function generateRows(startRow, endRow, seatsPerRow, baseElevation, rake, covered = true // SoFi has translucent roof
) {
    const rows = [];
    const rowHeight = 2.8; // feet between rows (wider for football)
    const rowDepth = 3.0; // feet front to back
    // Handle letter rows or numeric rows
    const isLetterRows = typeof startRow === 'string';
    if (isLetterRows) {
        const startCode = startRow.charCodeAt(0);
        const endCode = endRow.charCodeAt(0);
        for (let i = startCode; i <= endCode; i++) {
            const rowNum = i - startCode;
            rows.push({
                rowNumber: String.fromCharCode(i),
                seats: seatsPerRow,
                elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
                depth: rowNum * rowDepth,
                covered: covered,
                overhangHeight: 180 - baseElevation - (rowNum * 0.5) // Distance to ETFE roof
            });
        }
    }
    else {
        for (let i = startRow; i <= endRow; i++) {
            const rowNum = i - startRow;
            rows.push({
                rowNumber: i.toString(),
                seats: seatsPerRow,
                elevation: baseElevation + (rowNum * rowHeight * Math.sin(rake * Math.PI / 180)),
                depth: rowNum * rowDepth,
                covered: covered,
                overhangHeight: 180 - baseElevation - (rowNum * 0.5)
            });
        }
    }
    return rows;
}
// SoFi Stadium Sections
exports.sofiStadiumSections = [
    // ========== FIELD LEVEL (VIP Field Seats) ==========
    {
        id: 'VIP1',
        name: 'VIP Field 1',
        level: 'field',
        baseAngle: 0,
        angleSpan: 15,
        rows: generateRows('A', 'F', 20, 0, 18, true),
        vertices3D: [
            { x: -20, y: 100, z: 0 },
            { x: 0, y: 100, z: 0 },
            { x: 0, y: 120, z: 12 },
            { x: -20, y: 120, z: 12 }
        ],
        covered: true,
        partialCoverage: {
            type: 'full',
            coveredRows: ['A', 'B', 'C', 'D', 'E', 'F'],
            coveragePercentage: 100,
            overhangDepth: 500, // Entire stadium covered
            overhangHeight: 180,
            material: 'glass' // ETFE translucent roof
        },
        price: 'luxury',
        distance: 110,
        height: 0,
        rake: 18,
        seatWidth: 22,
        rowSpacing: 38,
        viewQuality: 'excellent',
        accessibility: {
            wheelchairAccessible: true,
            companionSeats: 4,
            aisleSeats: true,
            tunnelAccess: ['VIP Tunnel North', 'VIP Tunnel South']
        }
    },
    // ========== 100 LEVEL (Lower Bowl) ==========
    {
        id: '101',
        name: 'Section 101',
        level: 'lower',
        baseAngle: 0,
        angleSpan: 11.25,
        rows: generateRows(1, 28, 22, 15, 25, true),
        vertices3D: [
            { x: -30, y: 140, z: 15 },
            { x: -15, y: 140, z: 15 },
            { x: -10, y: 180, z: 55 },
            { x: -25, y: 180, z: 55 }
        ],
        covered: true,
        price: 'premium',
        distance: 150,
        height: 15,
        rake: 25,
        seatWidth: 20,
        rowSpacing: 34,
        viewQuality: 'excellent'
    },
    {
        id: '124',
        name: 'Section 124',
        level: 'lower',
        baseAngle: 90,
        angleSpan: 11.25,
        rows: generateRows(1, 28, 22, 15, 25, true),
        vertices3D: [
            { x: 140, y: 30, z: 15 },
            { x: 140, y: 15, z: 15 },
            { x: 180, y: 10, z: 55 },
            { x: 180, y: 25, z: 55 }
        ],
        covered: true,
        price: 'moderate',
        distance: 150,
        height: 15,
        rake: 25,
        seatWidth: 20,
        rowSpacing: 34,
        viewQuality: 'good'
    },
    {
        id: '143',
        name: 'Section 143',
        level: 'lower',
        baseAngle: 180,
        angleSpan: 11.25,
        rows: generateRows(1, 28, 22, 15, 25, true),
        vertices3D: [
            { x: 30, y: -140, z: 15 },
            { x: 15, y: -140, z: 15 },
            { x: 10, y: -180, z: 55 },
            { x: 25, y: -180, z: 55 }
        ],
        covered: true,
        price: 'moderate',
        distance: 150,
        height: 15,
        rake: 25,
        seatWidth: 20,
        rowSpacing: 34,
        viewQuality: 'good'
    },
    // ========== 200 LEVEL (Club Level) ==========
    {
        id: 'C201',
        name: 'Club 201',
        level: 'club',
        baseAngle: 0,
        angleSpan: 18,
        rows: generateRows('A', 'P', 18, 55, 28, true),
        vertices3D: [
            { x: -25, y: 180, z: 55 },
            { x: -5, y: 180, z: 55 },
            { x: 0, y: 220, z: 85 },
            { x: -20, y: 220, z: 85 }
        ],
        covered: true,
        price: 'luxury',
        distance: 200,
        height: 55,
        rake: 28,
        seatWidth: 21,
        rowSpacing: 36,
        viewQuality: 'excellent',
        accessibility: {
            wheelchairAccessible: true,
            companionSeats: 6,
            aisleSeats: true,
            tunnelAccess: ['Club Entrance North', 'Club Entrance South']
        }
    },
    {
        id: 'C214',
        name: 'Club 214',
        level: 'club',
        baseAngle: 90,
        angleSpan: 18,
        rows: generateRows('A', 'P', 18, 55, 28, true),
        vertices3D: [
            { x: 180, y: 25, z: 55 },
            { x: 180, y: 5, z: 55 },
            { x: 220, y: 0, z: 85 },
            { x: 220, y: 20, z: 85 }
        ],
        covered: true,
        price: 'premium',
        distance: 200,
        height: 55,
        rake: 28,
        seatWidth: 21,
        rowSpacing: 36,
        viewQuality: 'good'
    },
    // ========== 300 LEVEL (Upper Bowl) ==========
    {
        id: '301',
        name: 'Section 301',
        level: 'upper',
        baseAngle: 0,
        angleSpan: 11.25,
        rows: generateRows(1, 35, 24, 85, 32, true),
        vertices3D: [
            { x: -35, y: 220, z: 85 },
            { x: -20, y: 220, z: 85 },
            { x: -15, y: 280, z: 145 },
            { x: -30, y: 280, z: 145 }
        ],
        covered: true,
        price: 'value',
        distance: 250,
        height: 85,
        rake: 32,
        seatWidth: 19,
        rowSpacing: 32,
        viewQuality: 'good'
    },
    {
        id: '324',
        name: 'Section 324',
        level: 'upper',
        baseAngle: 90,
        angleSpan: 11.25,
        rows: generateRows(1, 35, 24, 85, 32, true),
        vertices3D: [
            { x: 220, y: 35, z: 85 },
            { x: 220, y: 20, z: 85 },
            { x: 280, y: 15, z: 145 },
            { x: 280, y: 30, z: 145 }
        ],
        covered: true,
        price: 'value',
        distance: 250,
        height: 85,
        rake: 32,
        seatWidth: 19,
        rowSpacing: 32,
        viewQuality: 'fair'
    },
    // ========== 500 LEVEL (Upper Upper Bowl) ==========
    {
        id: '501',
        name: 'Section 501',
        level: 'upper',
        baseAngle: 0,
        angleSpan: 11.25,
        rows: generateRows(1, 28, 26, 145, 35, true),
        vertices3D: [
            { x: -40, y: 280, z: 145 },
            { x: -25, y: 280, z: 145 },
            { x: -20, y: 340, z: 195 },
            { x: -35, y: 340, z: 195 }
        ],
        covered: true,
        price: 'value',
        distance: 310,
        height: 145,
        rake: 35,
        seatWidth: 18,
        rowSpacing: 30,
        viewQuality: 'fair'
    },
    // ========== SUITE LEVEL (Premium Boxes) ==========
    {
        id: 'SUITE_A1',
        name: 'Suite Level A1',
        level: 'suite',
        baseAngle: 0,
        angleSpan: 9,
        rows: [
            { rowNumber: 'Suite', seats: 20, elevation: 65, depth: 0, covered: true, overhangHeight: 115 }
        ],
        vertices3D: [
            { x: -30, y: 190, z: 65 },
            { x: -20, y: 190, z: 65 },
            { x: -20, y: 210, z: 65 },
            { x: -30, y: 210, z: 65 }
        ],
        covered: true,
        price: 'luxury',
        distance: 200,
        height: 65,
        rake: 0,
        seatWidth: 24,
        rowSpacing: 48,
        viewQuality: 'excellent',
        accessibility: {
            wheelchairAccessible: true,
            companionSeats: 20,
            aisleSeats: false,
            tunnelAccess: ['Suite Entrance']
        }
    },
    // ========== STANDING ROOM ONLY (SRO) ==========
    {
        id: 'SRO_NORTH',
        name: 'North End Zone SRO',
        level: 'standing',
        baseAngle: 0,
        angleSpan: 30,
        rows: [], // Standing room only
        vertices3D: [
            { x: -50, y: 340, z: 195 },
            { x: 50, y: 340, z: 195 },
            { x: 50, y: 360, z: 195 },
            { x: -50, y: 360, z: 195 }
        ],
        covered: true,
        price: 'value',
        distance: 350,
        height: 195,
        rake: 0,
        viewQuality: 'fair'
    },
    // ========== BEACH CLUB (Unique Feature) ==========
    {
        id: 'BEACH',
        name: 'Beach Club',
        level: 'field',
        baseAngle: 135,
        angleSpan: 30,
        rows: [], // Cabana-style seating
        vertices3D: [
            { x: 200, y: -200, z: 10 },
            { x: 250, y: -150, z: 10 },
            { x: 260, y: -160, z: 10 },
            { x: 210, y: -210, z: 10 }
        ],
        covered: true,
        partialCoverage: {
            type: 'full',
            coveredRows: [],
            coveragePercentage: 100,
            overhangDepth: 500,
            overhangHeight: 170,
            material: 'glass'
        },
        price: 'luxury',
        distance: 280,
        height: 10,
        rake: 0,
        viewQuality: 'good',
        accessibility: {
            wheelchairAccessible: true,
            companionSeats: 0,
            aisleSeats: false,
            tunnelAccess: ['Beach Club Entrance']
        }
    }
];
// Calculate total capacity
exports.sofiStadiumCapacity = exports.sofiStadiumSections.reduce((total, section) => {
    const sectionCapacity = section.rows.reduce((sectionTotal, row) => sectionTotal + row.seats, 0);
    return total + sectionCapacity;
}, 0);
// Export section map for quick lookup
exports.sofiStadiumSectionMap = new Map(exports.sofiStadiumSections.map(section => [section.id, section]));
// Stadium-specific features
exports.sofiStadiumFeatures = {
    etfeRoof: {
        type: 'fixed_translucent',
        material: 'ETFE',
        transparency: 0.7,
        height: 180,
        coversEntireStadium: true,
        openAirSides: true // Open on sides for ventilation
    },
    oculus: {
        type: 'video_board',
        shape: 'double_sided_oval',
        length: 120, // yards
        weight: 2200000, // pounds
        position: 'center_hung',
        height: 122, // feet above field
        castsShadow: true // Even though translucent, it blocks some light
    },
    beachClub: {
        location: 'southeast_corner',
        features: ['cabanas', 'pool_deck_vibe'],
        capacity: 250
    },
    standingRoom: {
        locations: ['north_endzone', 'south_endzone'],
        capacity: 3000
    }
};
