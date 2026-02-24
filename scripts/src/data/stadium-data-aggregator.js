"use strict";
// Stadium Data Aggregator
// Central system for loading stadium-specific sections and obstructions
Object.defineProperty(exports, "__esModule", { value: true });
exports.OBSTRUCTION_REGISTRY = exports.SECTION_REGISTRY = void 0;
exports.getStadiumCompleteData = getStadiumCompleteData;
exports.getStadiumSections = getStadiumSections;
exports.getStadiumObstructions = getStadiumObstructions;
exports.hasSpecificData = hasSpecificData;
exports.getCoverageStats = getCoverageStats;
// Import MLB sections
const yankees_1 = require("./sections/mlb/yankees");
const fenway_park_1 = require("./sections/mlb/fenway-park");
const dodgers_1 = require("./sections/mlb/dodgers");
const wrigley_field_1 = require("./sections/mlb/wrigley-field");
const mets_1 = require("./sections/mlb/mets");
const oracle_park_1 = require("./sections/mlb/oracle-park");
const padres_1 = require("./sections/mlb/padres");
const orioles_1 = require("./sections/mlb/orioles");
const pnc_park_1 = require("./sections/mlb/pnc-park");
const astros_1 = require("./sections/mlb/astros");
const truist_park_1 = require("./sections/mlb/truist-park");
const rockies_1 = require("./sections/mlb/rockies");
const twins_1 = require("./sections/mlb/twins");
const great_american_ballpark_1 = require("./sections/mlb/great-american-ballpark");
const guardians_1 = require("./sections/mlb/guardians");
const phillies_1 = require("./sections/mlb/phillies");
const nationals_1 = require("./sections/mlb/nationals");
const rangers_1 = require("./sections/mlb/rangers");
const angels_1 = require("./sections/mlb/angels");
const brewers_1 = require("./sections/mlb/brewers");
const busch_stadium_1 = require("./sections/mlb/busch-stadium");
const diamondbacks_1 = require("./sections/mlb/diamondbacks");
const tigers_1 = require("./sections/mlb/tigers");
const george_m_steinbrenner_field_1 = require("./sections/mlb/george-m-steinbrenner-field");
const whitesox_1 = require("./sections/mlb/whitesox");
const royals_1 = require("./sections/mlb/royals");
const marlins_1 = require("./sections/mlb/marlins");
const bluejays_1 = require("./sections/mlb/bluejays");
const athletics_1 = require("./sections/mlb/athletics");
const mariners_1 = require("./sections/mlb/mariners");
const rays_1 = require("./sections/mlb/rays");
const cubs_1 = require("./sections/mlb/cubs");
const giants_1 = require("./sections/mlb/giants");
const redsox_1 = require("./sections/mlb/redsox");
const reds_1 = require("./sections/mlb/reds");
const cardinals_1 = require("./sections/mlb/cardinals");
const braves_1 = require("./sections/mlb/braves");
const pirates_1 = require("./sections/mlb/pirates");
// Import MiLB sections
const las_vegas_aviators_1 = require("./sections/milb/aaa/las-vegas-aviators");
// Import other MiLB stadiums as they're created...
// Import NFL sections
const sofi_stadium_1 = require("./sections/nfl/sofi-stadium");
// Import other NFL stadiums as they're created...
// Import obstructions
const yankees_obstructions_1 = require("./obstructions/mlb/yankees-obstructions");
const redsox_obstructions_1 = require("./obstructions/mlb/redsox-obstructions");
const dodgers_obstructions_1 = require("./obstructions/mlb/dodgers-obstructions");
const cubs_obstructions_1 = require("./obstructions/mlb/cubs-obstructions");
const mets_obstructions_1 = require("./obstructions/mlb/mets-obstructions");
const giants_obstructions_1 = require("./obstructions/mlb/giants-obstructions");
const padres_obstructions_1 = require("./obstructions/mlb/padres-obstructions");
const orioles_obstructions_1 = require("./obstructions/mlb/orioles-obstructions");
const pirates_obstructions_1 = require("./obstructions/mlb/pirates-obstructions");
const astros_obstructions_1 = require("./obstructions/mlb/astros-obstructions");
const braves_obstructions_1 = require("./obstructions/mlb/braves-obstructions");
const rockies_obstructions_1 = require("./obstructions/mlb/rockies-obstructions");
const twins_obstructions_1 = require("./obstructions/mlb/twins-obstructions");
const reds_obstructions_1 = require("./obstructions/mlb/reds-obstructions");
const guardians_obstructions_1 = require("./obstructions/mlb/guardians-obstructions");
const phillies_obstructions_1 = require("./obstructions/mlb/phillies-obstructions");
const nationals_obstructions_1 = require("./obstructions/mlb/nationals-obstructions");
const rangers_obstructions_1 = require("./obstructions/mlb/rangers-obstructions");
const angels_obstructions_1 = require("./obstructions/mlb/angels-obstructions");
const brewers_obstructions_1 = require("./obstructions/mlb/brewers-obstructions");
const cardinals_obstructions_1 = require("./obstructions/mlb/cardinals-obstructions");
const diamondbacks_obstructions_1 = require("./obstructions/mlb/diamondbacks-obstructions");
const tigers_obstructions_1 = require("./obstructions/mlb/tigers-obstructions");
const whitesox_obstructions_1 = require("./obstructions/mlb/whitesox-obstructions");
const royals_obstructions_1 = require("./obstructions/mlb/royals-obstructions");
const marlins_obstructions_1 = require("./obstructions/mlb/marlins-obstructions");
const bluejays_obstructions_1 = require("./obstructions/mlb/bluejays-obstructions");
const athletics_obstructions_1 = require("./obstructions/mlb/athletics-obstructions");
const mariners_obstructions_1 = require("./obstructions/mlb/mariners-obstructions");
const rays_obstructions_1 = require("./obstructions/mlb/rays-obstructions");
// Section data registry
const SECTION_REGISTRY = {
    // MLB
    'yankees': yankees_1.yankeesSections,
    'red-sox': redsox_1.redsoxSections || fenway_park_1.fenwayParkSections,
    'dodgers': dodgers_1.dodgersSections,
    'cubs': cubs_1.cubsSections || wrigley_field_1.wrigleyFieldSections,
    'mets': mets_1.metsSections,
    'giants': giants_1.giantsSections || oracle_park_1.oracleParkSections,
    'padres': padres_1.padresSections,
    'orioles': orioles_1.oriolesSections,
    'pirates': pirates_1.piratesSections || pnc_park_1.pncParkSections,
    'astros': astros_1.astrosSections,
    'braves': braves_1.bravesSections || truist_park_1.truistParkSections,
    'rockies': rockies_1.rockiesSections,
    'twins': twins_1.twinsSections,
    'reds': reds_1.redsSections || great_american_ballpark_1.greatAmericanBallparkSections,
    'guardians': guardians_1.guardiansSections,
    'phillies': phillies_1.philliesSections,
    'nationals': nationals_1.nationalsSections,
    'rangers': rangers_1.rangersSections,
    'angels': angels_1.angelsSections,
    'brewers': brewers_1.brewersSections,
    'cardinals': cardinals_1.cardinalsSections || busch_stadium_1.buschstadiumSections,
    'diamondbacks': diamondbacks_1.diamondbacksSections,
    'tigers': tigers_1.tigersSections,
    'rays': rays_1.raysSections || george_m_steinbrenner_field_1.georgeMSteinbrennerFieldSections,
    'white-sox': whitesox_1.whitesoxSections,
    'royals': royals_1.royalsSections,
    'marlins': marlins_1.marlinsSections,
    'blue-jays': bluejays_1.bluejaysSections,
    'athletics': athletics_1.athleticsSections,
    'mariners': mariners_1.marinersSections,
    // MiLB
    'las-vegas-aviators': las_vegas_aviators_1.lasvegasaviatorsSections,
    // NFL
    'sofi-stadium': sofi_stadium_1.sofiStadiumSections,
    // Add more as they're created...
};
exports.SECTION_REGISTRY = SECTION_REGISTRY;
// Obstruction data registry
const OBSTRUCTION_REGISTRY = {
    // MLB
    'yankees': yankees_obstructions_1.yankeeStadiumObstructions,
    'red-sox': redsox_obstructions_1.redsoxObstructions,
    'dodgers': dodgers_obstructions_1.dodgersObstructions,
    'cubs': cubs_obstructions_1.cubsObstructions,
    'mets': mets_obstructions_1.metsObstructions,
    'giants': giants_obstructions_1.giantsObstructions,
    'padres': padres_obstructions_1.padresObstructions,
    'orioles': orioles_obstructions_1.oriolesObstructions,
    'pirates': pirates_obstructions_1.piratesObstructions,
    'astros': astros_obstructions_1.astrosObstructions,
    'braves': braves_obstructions_1.bravesObstructions,
    'rockies': rockies_obstructions_1.rockiesObstructions,
    'twins': twins_obstructions_1.twinsObstructions,
    'reds': reds_obstructions_1.redsObstructions,
    'guardians': guardians_obstructions_1.guardiansObstructions,
    'phillies': phillies_obstructions_1.philliesObstructions,
    'nationals': nationals_obstructions_1.nationalsObstructions,
    'rangers': rangers_obstructions_1.rangersObstructions,
    'angels': angels_obstructions_1.angelsObstructions,
    'brewers': brewers_obstructions_1.brewersObstructions,
    'cardinals': cardinals_obstructions_1.cardinalsObstructions,
    'diamondbacks': diamondbacks_obstructions_1.diamondbacksObstructions,
    'tigers': tigers_obstructions_1.tigersObstructions,
    'white-sox': whitesox_obstructions_1.whitesoxObstructions,
    'royals': royals_obstructions_1.royalsObstructions,
    'marlins': marlins_obstructions_1.marlinsObstructions,
    'blue-jays': bluejays_obstructions_1.bluejaysObstructions,
    'athletics': athletics_obstructions_1.athleticsObstructions,
    'mariners': mariners_obstructions_1.marinersObstructions,
    'rays': rays_obstructions_1.raysObstructions,
    // MiLB - to be added
    // NFL - to be added
};
exports.OBSTRUCTION_REGISTRY = OBSTRUCTION_REGISTRY;
// Generate generic sections for stadiums without specific data
function generateGenericSections(stadiumId, league) {
    const sections = [];
    // Base configuration per league
    const config = league === 'NFL' ? {
        levels: ['field', 'lower', 'club', 'upper'],
        sectionsPerLevel: [4, 32, 16, 32],
        seatsPerSection: [200, 600, 400, 500]
    } : league === 'MLB' ? {
        levels: ['field', 'lower', 'upper'],
        sectionsPerLevel: [8, 20, 16],
        seatsPerSection: [150, 400, 350]
    } : {
        levels: ['field', 'lower'],
        sectionsPerLevel: [6, 12],
        seatsPerSection: [100, 250]
    };
    let sectionId = 100;
    config.levels.forEach((level, levelIndex) => {
        const numSections = config.sectionsPerLevel[levelIndex];
        const angleStep = 360 / numSections;
        const seatsPerSection = config.seatsPerSection[levelIndex];
        for (let i = 0; i < numSections; i++) {
            sections.push({
                id: `${sectionId + i}`,
                name: `Section ${sectionId + i}`,
                level: level,
                baseAngle: i * angleStep,
                angleSpan: angleStep,
                rows: generateGenericRows(level, seatsPerSection),
                vertices3D: generateGenericVertices(i * angleStep, angleStep, level),
                covered: false,
                price: level === 'field' ? 'premium' : level === 'upper' ? 'value' : 'moderate',
                distance: level === 'field' ? 100 : level === 'upper' ? 250 : 150,
                height: level === 'field' ? 0 : level === 'upper' ? 80 : 30,
                rake: level === 'upper' ? 32 : 25,
                viewQuality: level === 'field' ? 'excellent' : level === 'upper' ? 'fair' : 'good'
            });
        }
        sectionId += 100;
    });
    return sections;
}
function generateGenericRows(level, totalSeats) {
    const rowCount = level === 'field' ? 10 : level === 'upper' ? 30 : 20;
    const seatsPerRow = Math.floor(totalSeats / rowCount);
    const baseElevation = level === 'field' ? 0 : level === 'upper' ? 80 : 30;
    return Array.from({ length: rowCount }, (_, i) => ({
        rowNumber: (i + 1).toString(),
        seats: seatsPerRow,
        elevation: baseElevation + (i * 2.5),
        depth: i * 2.8,
        covered: false
    }));
}
function generateGenericVertices(baseAngle, angleSpan, level) {
    const radius = level === 'field' ? 100 : level === 'upper' ? 250 : 150;
    const height = level === 'field' ? 0 : level === 'upper' ? 80 : 30;
    const toRad = (deg) => deg * Math.PI / 180;
    return [
        {
            x: radius * Math.cos(toRad(baseAngle)),
            y: radius * Math.sin(toRad(baseAngle)),
            z: height
        },
        {
            x: radius * Math.cos(toRad(baseAngle + angleSpan)),
            y: radius * Math.sin(toRad(baseAngle + angleSpan)),
            z: height
        },
        {
            x: (radius + 50) * Math.cos(toRad(baseAngle + angleSpan)),
            y: (radius + 50) * Math.sin(toRad(baseAngle + angleSpan)),
            z: height + 30
        },
        {
            x: (radius + 50) * Math.cos(toRad(baseAngle)),
            y: (radius + 50) * Math.sin(toRad(baseAngle)),
            z: height + 30
        }
    ];
}
// Generate generic obstructions
function generateGenericObstructions(league) {
    const obstructions = [];
    // Upper deck overhang (common to most stadiums)
    obstructions.push({
        id: 'upper_deck_overhang',
        name: 'Upper Deck Overhang',
        type: 'overhang',
        geometry: {
            vertices: [
                { x: -100, y: 100, z: 60 },
                { x: 100, y: 100, z: 60 },
                { x: 100, y: 140, z: 60 },
                { x: -100, y: 140, z: 60 },
                { x: -100, y: 100, z: 65 },
                { x: 100, y: 100, z: 65 },
                { x: 100, y: 140, z: 65 },
                { x: -100, y: 140, z: 65 }
            ],
            faces: [
                [0, 1, 2, 3],
                [4, 7, 6, 5],
                [0, 4, 5, 1],
                [2, 6, 7, 3]
            ]
        },
        boundingBox: {
            min: { x: -100, y: 100, z: 60 },
            max: { x: 100, y: 140, z: 65 }
        },
        material: {
            opacity: 1.0,
            reflectivity: 0.2,
            color: '#808080'
        },
        castsShadow: true
    });
    // Add scoreboard for baseball stadiums
    if (league === 'MLB' || league === 'MiLB') {
        obstructions.push({
            id: 'scoreboard',
            name: 'Scoreboard',
            type: 'scoreboard',
            geometry: {
                vertices: [
                    { x: -20, y: 380, z: 20 },
                    { x: 20, y: 380, z: 20 },
                    { x: 20, y: 382, z: 20 },
                    { x: -20, y: 382, z: 20 },
                    { x: -20, y: 380, z: 50 },
                    { x: 20, y: 380, z: 50 },
                    { x: 20, y: 382, z: 50 },
                    { x: -20, y: 382, z: 50 }
                ],
                faces: [
                    [0, 1, 2, 3],
                    [4, 7, 6, 5],
                    [0, 4, 5, 1]
                ]
            },
            boundingBox: {
                min: { x: -20, y: 380, z: 20 },
                max: { x: 20, y: 382, z: 50 }
            },
            material: {
                opacity: 1.0,
                reflectivity: 0.5,
                color: '#000000'
            },
            castsShadow: true
        });
    }
    // Add video board for NFL stadiums
    if (league === 'NFL') {
        obstructions.push({
            id: 'video_board',
            name: 'Video Board',
            type: 'scoreboard',
            geometry: {
                vertices: [
                    { x: -40, y: -40, z: 100 },
                    { x: 40, y: -40, z: 100 },
                    { x: 40, y: 40, z: 100 },
                    { x: -40, y: 40, z: 100 },
                    { x: -40, y: -40, z: 120 },
                    { x: 40, y: -40, z: 120 },
                    { x: 40, y: 40, z: 120 },
                    { x: -40, y: 40, z: 120 }
                ],
                faces: [
                    [0, 1, 2, 3],
                    [4, 7, 6, 5]
                ]
            },
            boundingBox: {
                min: { x: -40, y: -40, z: 100 },
                max: { x: 40, y: 40, z: 120 }
            },
            material: {
                opacity: 1.0,
                reflectivity: 0.7,
                color: '#000000'
            },
            castsShadow: true
        });
    }
    return obstructions;
}
// Main function to get complete stadium data
function getStadiumCompleteData(stadiumId, league) {
    // Try to get specific sections
    const sections = SECTION_REGISTRY[stadiumId] || generateGenericSections(stadiumId, league);
    // Try to get specific obstructions
    const obstructions = OBSTRUCTION_REGISTRY[stadiumId] || generateGenericObstructions(league);
    return { sections, obstructions };
}
// Get sections only
function getStadiumSections(stadiumId, league) {
    return SECTION_REGISTRY[stadiumId] || generateGenericSections(stadiumId, league);
}
// Get obstructions only
function getStadiumObstructions(stadiumId, league) {
    return OBSTRUCTION_REGISTRY[stadiumId] || generateGenericObstructions(league);
}
// Check if stadium has specific data
function hasSpecificData(stadiumId) {
    return {
        hasSections: !!SECTION_REGISTRY[stadiumId],
        hasObstructions: !!OBSTRUCTION_REGISTRY[stadiumId]
    };
}
// Get coverage statistics
function getCoverageStats() {
    const totalStadiums = 187; // 31 MLB + 122 MiLB + 34 NFL
    const stadiumsWithSections = Object.keys(SECTION_REGISTRY).length;
    const stadiumsWithObstructions = Object.keys(OBSTRUCTION_REGISTRY).length;
    return {
        totalStadiums,
        stadiumsWithSections,
        stadiumsWithObstructions,
        coveragePercentage: ((stadiumsWithSections + stadiumsWithObstructions) / (totalStadiums * 2)) * 100
    };
}
