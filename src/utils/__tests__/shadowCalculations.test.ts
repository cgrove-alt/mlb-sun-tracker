/**
 * Shadow Calculation Tests with Real-World Validation
 * Tests ray-casting algorithm accuracy against known shadow patterns
 */

import { 
  calculateSectionShadow, 
  calculateAllShadows,
  calculateShadowProgression,
  findBestShadedSections,
  calculateGameAverageSunExposure
} from '../advancedShadowCalculator';
import { DetailedSection, Obstruction3D, Vector3D } from '../../types/stadium-complete';
import { SunPosition } from '../sunCalculations';

// Mock stadium section for testing
const createMockSection = (id: string, covered: boolean = false): DetailedSection => ({
  id,
  name: `Section ${id}`,
  level: 'lower',
  baseAngle: 180,
  angleSpan: 30,
  radius: 100,
  elevation: 10,
  rows: [],
  capacity: 500,
  hasRailing: true,
  hasOverhang: false,
  covered,
  vertices3D: [
    { x: -10, y: 10, z: 90 },
    { x: 10, y: 10, z: 90 },
    { x: 10, y: 20, z: 110 },
    { x: -10, y: 20, z: 110 }
  ]
});

// Mock obstruction for testing
const createMockObstruction = (id: string, min: Vector3D, max: Vector3D): Obstruction3D => ({
  id,
  name: `Obstruction ${id}`,
  type: 'overhang',
  geometry: {
    vertices: [
      { x: min.x, y: min.y, z: min.z },
      { x: max.x, y: min.y, z: min.z },
      { x: max.x, y: max.y, z: min.z },
      { x: min.x, y: max.y, z: min.z },
      { x: min.x, y: min.y, z: max.z },
      { x: max.x, y: min.y, z: max.z },
      { x: max.x, y: max.y, z: max.z },
      { x: min.x, y: max.y, z: max.z }
    ],
    faces: [
      [0, 1, 2, 3],
      [4, 7, 6, 5],
      [0, 4, 5, 1],
      [2, 6, 7, 3],
      [0, 3, 7, 4],
      [1, 5, 6, 2]
    ]
  },
  boundingBox: { min, max },
  material: { opacity: 1.0, reflectivity: 0.3, color: '#808080' },
  castsShadow: true
});

describe('Shadow Calculation Tests', () => {
  describe('Basic Shadow Detection', () => {
    test('Covered sections always in shadow', () => {
      const coveredSection = createMockSection('100', true);
      const sunPosition: SunPosition = {
        azimuth: Math.PI,
        altitude: Math.PI / 4,
        azimuthDegrees: 180,
        altitudeDegrees: 45
      };
      
      const result = calculateSectionShadow(coveredSection, sunPosition, []);
      
      expect(result.shadowPercentage).toBe(100);
      expect(result.sunExposure).toBe(0);
      expect(result.partialShade).toBe(false);
      expect(result.obstructionsCasting).toContain('roof');
    });

    test('Night time - all sections in shadow', () => {
      const section = createMockSection('101');
      const nightSunPosition: SunPosition = {
        azimuth: 0,
        altitude: -Math.PI / 6,
        azimuthDegrees: 0,
        altitudeDegrees: -30  // Below horizon
      };
      
      const result = calculateSectionShadow(section, nightSunPosition, []);
      
      expect(result.shadowPercentage).toBe(100);
      expect(result.sunExposure).toBe(0);
      expect(result.obstructionsCasting).toEqual([]);
    });

    test('Full sun exposure with no obstructions', () => {
      const section = createMockSection('102');
      const sunPosition: SunPosition = {
        azimuth: Math.PI,
        altitude: Math.PI / 3,
        azimuthDegrees: 180,
        altitudeDegrees: 60
      };
      
      const result = calculateSectionShadow(section, sunPosition, []);
      
      expect(result.shadowPercentage).toBe(0);
      expect(result.sunExposure).toBe(100);
      expect(result.partialShade).toBe(false);
      expect(result.obstructionsCasting).toEqual([]);
    });
  });

  describe('Obstruction Shadow Casting', () => {
    test('Overhang creates partial shadow', () => {
      const section = createMockSection('103');
      const overhang = createMockObstruction(
        'overhang_1',
        { x: -15, y: 25, z: 85 },
        { x: 15, y: 30, z: 95 }
      );
      
      const sunPosition: SunPosition = {
        azimuth: Math.PI,
        altitude: Math.PI / 4,
        azimuthDegrees: 180,
        altitudeDegrees: 45
      };
      
      const result = calculateSectionShadow(section, sunPosition, [overhang]);
      
      expect(result.shadowPercentage).toBeGreaterThan(0);
      expect(result.shadowPercentage).toBeLessThan(100);
      expect(result.partialShade).toBe(true);
      expect(result.obstructionsCasting).toContain('overhang_1');
    });

    test('Multiple obstructions compound shadow', () => {
      const section = createMockSection('104');
      const overhang = createMockObstruction(
        'overhang_1',
        { x: -15, y: 25, z: 85 },
        { x: 15, y: 30, z: 95 }
      );
      const scoreboard = createMockObstruction(
        'scoreboard_1',
        { x: -5, y: 50, z: 100 },
        { x: 5, y: 80, z: 105 }
      );
      
      const sunPosition: SunPosition = {
        azimuth: Math.PI,
        altitude: Math.PI / 6,
        azimuthDegrees: 180,
        altitudeDegrees: 30
      };
      
      const result = calculateSectionShadow(section, sunPosition, [overhang, scoreboard]);
      
      expect(result.shadowPercentage).toBeGreaterThan(0);
      expect(result.obstructionsCasting.length).toBeGreaterThanOrEqual(1);
      expect(result.obstructionsCasting.length).toBeLessThanOrEqual(2);
    });

    test('Non-shadow-casting obstruction ignored', () => {
      const section = createMockSection('105');
      const transparentObstruction: Obstruction3D = {
        ...createMockObstruction('transparent_1', { x: -15, y: 25, z: 85 }, { x: 15, y: 30, z: 95 }),
        castsShadow: false
      };
      
      const sunPosition: SunPosition = {
        azimuth: Math.PI,
        altitude: Math.PI / 4,
        azimuthDegrees: 180,
        altitudeDegrees: 45
      };
      
      const result = calculateSectionShadow(section, sunPosition, [transparentObstruction]);
      
      expect(result.shadowPercentage).toBe(0);
      expect(result.sunExposure).toBe(100);
      expect(result.obstructionsCasting).toEqual([]);
    });
  });

  describe('Shadow Progression Over Time', () => {
    test('Shadow changes throughout the day', () => {
      const sections = [
        createMockSection('201'),
        createMockSection('202'),
        createMockSection('203')
      ];
      
      const obstructions = [
        createMockObstruction('overhang', { x: -20, y: 30, z: 80 }, { x: 20, y: 35, z: 100 })
      ];
      
      const sunPositions = [
        { // Morning
          time: new Date('2025-07-04T09:00:00'),
          position: { azimuth: Math.PI / 2, altitude: Math.PI / 6, azimuthDegrees: 90, altitudeDegrees: 30 } as SunPosition
        },
        { // Noon
          time: new Date('2025-07-04T12:00:00'),
          position: { azimuth: Math.PI, altitude: Math.PI / 3, azimuthDegrees: 180, altitudeDegrees: 60 } as SunPosition
        },
        { // Afternoon
          time: new Date('2025-07-04T15:00:00'),
          position: { azimuth: 3 * Math.PI / 2, altitude: Math.PI / 4, azimuthDegrees: 270, altitudeDegrees: 45 } as SunPosition
        }
      ];
      
      const progression = calculateShadowProgression(sections, obstructions, sunPositions);
      
      // Each section should have 3 time points
      expect(progression.size).toBe(3);
      progression.forEach((values, sectionId) => {
        expect(values.length).toBe(3);
        // Values should change over time (not all the same)
        const uniqueValues = new Set(values);
        expect(uniqueValues.size).toBeGreaterThan(1);
      });
    });

    test('Weather multiplier affects sun exposure', () => {
      const sections = [createMockSection('204')];
      const sunPositions = [{
        time: new Date('2025-07-04T12:00:00'),
        position: { azimuth: Math.PI, altitude: Math.PI / 3, azimuthDegrees: 180, altitudeDegrees: 60 } as SunPosition
      }];
      
      const clearWeather = calculateShadowProgression(sections, [], sunPositions, 1.0);
      const cloudyWeather = calculateShadowProgression(sections, [], sunPositions, 0.5);
      const overcastWeather = calculateShadowProgression(sections, [], sunPositions, 0.2);
      
      const clearExposure = clearWeather.get('204')![0];
      const cloudyExposure = cloudyWeather.get('204')![0];
      const overcastExposure = overcastWeather.get('204')![0];
      
      expect(clearExposure).toBe(100);
      expect(cloudyExposure).toBe(50);
      expect(overcastExposure).toBe(20);
    });
  });

  describe('Best Shaded Sections Finder', () => {
    test('Identifies fully shaded sections', () => {
      const shadows = new Map([
        ['301', { sectionId: '301', shadowPercentage: 100, sunExposure: 0, partialShade: false, obstructionsCasting: ['roof'] }],
        ['302', { sectionId: '302', shadowPercentage: 75, sunExposure: 25, partialShade: true, obstructionsCasting: ['overhang'] }],
        ['303', { sectionId: '303', shadowPercentage: 50, sunExposure: 50, partialShade: true, obstructionsCasting: [] }],
        ['304', { sectionId: '304', shadowPercentage: 25, sunExposure: 75, partialShade: true, obstructionsCasting: [] }],
        ['305', { sectionId: '305', shadowPercentage: 0, sunExposure: 100, partialShade: false, obstructionsCasting: [] }]
      ]);
      
      const bestShaded = findBestShadedSections(shadows, 50);
      
      expect(bestShaded).toEqual(['301', '302', '303']);
      expect(bestShaded[0]).toBe('301');  // Most shaded first
    });

    test('Respects minimum shadow threshold', () => {
      const shadows = new Map([
        ['401', { sectionId: '401', shadowPercentage: 80, sunExposure: 20, partialShade: false, obstructionsCasting: ['roof'] }],
        ['402', { sectionId: '402', shadowPercentage: 60, sunExposure: 40, partialShade: true, obstructionsCasting: ['overhang'] }],
        ['403', { sectionId: '403', shadowPercentage: 40, sunExposure: 60, partialShade: true, obstructionsCasting: [] }]
      ]);
      
      const shaded70 = findBestShadedSections(shadows, 70);
      const shaded50 = findBestShadedSections(shadows, 50);
      const shaded30 = findBestShadedSections(shadows, 30);
      
      expect(shaded70).toEqual(['401']);
      expect(shaded50).toEqual(['401', '402']);
      expect(shaded30).toEqual(['401', '402', '403']);
    });
  });

  describe('Game Average Sun Exposure', () => {
    test('Calculates average for 3-hour game', () => {
      const progression = [100, 90, 80, 70, 60, 50, 40, 30, 20];  // 9 time points
      const average = calculateGameAverageSunExposure('501', progression, 3);
      
      // Should average first 9 points (3 hours worth)
      const expected = (100 + 90 + 80 + 70 + 60 + 50 + 40 + 30 + 20) / 9;
      expect(average).toBe(Math.round(expected));
    });

    test('Handles empty progression', () => {
      const average = calculateGameAverageSunExposure('502', [], 3);
      expect(average).toBe(0);
    });

    test('Handles short progression', () => {
      const progression = [100, 50];
      const average = calculateGameAverageSunExposure('503', progression, 3);
      expect(average).toBe(75);
    });
  });

  describe('Ray-Casting Algorithm Performance', () => {
    test('Single section calculation under 10ms', () => {
      const section = createMockSection('601');
      const obstructions = [
        createMockObstruction('obs1', { x: -20, y: 30, z: 80 }, { x: 20, y: 35, z: 100 }),
        createMockObstruction('obs2', { x: -30, y: 40, z: 90 }, { x: 30, y: 45, z: 110 }),
        createMockObstruction('obs3', { x: -10, y: 50, z: 70 }, { x: 10, y: 55, z: 120 })
      ];
      const sunPosition: SunPosition = {
        azimuth: Math.PI,
        altitude: Math.PI / 4,
        azimuthDegrees: 180,
        altitudeDegrees: 45
      };
      
      const start = performance.now();
      calculateSectionShadow(section, sunPosition, obstructions);
      const elapsed = performance.now() - start;
      
      expect(elapsed).toBeLessThan(10);
    });

    test('Full stadium calculation under 100ms', () => {
      const sections: DetailedSection[] = [];
      for (let i = 0; i < 50; i++) {
        sections.push(createMockSection(`section_${i}`));
      }
      
      const obstructions: Obstruction3D[] = [];
      for (let i = 0; i < 10; i++) {
        obstructions.push(
          createMockObstruction(
            `obs_${i}`,
            { x: -50 + i * 10, y: 30 + i * 5, z: 80 + i * 3 },
            { x: -40 + i * 10, y: 35 + i * 5, z: 90 + i * 3 }
          )
        );
      }
      
      const sunPosition: SunPosition = {
        azimuth: Math.PI,
        altitude: Math.PI / 4,
        azimuthDegrees: 180,
        altitudeDegrees: 45
      };
      
      const start = performance.now();
      calculateAllShadows(sections, sunPosition, obstructions);
      const elapsed = performance.now() - start;
      
      expect(elapsed).toBeLessThan(100);
    });
  });

  describe('Real-World Shadow Patterns', () => {
    test('Yankee Stadium - known shadow at 1 PM summer', () => {
      // Based on real observations: Upper deck creates shadow on lower sections
      const lowerSection = createMockSection('field_level');
      lowerSection.vertices3D = [
        { x: -30, y: 5, z: 50 },
        { x: 30, y: 5, z: 50 },
        { x: 30, y: 15, z: 80 },
        { x: -30, y: 15, z: 80 }
      ];
      
      const upperDeck = createMockObstruction(
        'upper_deck',
        { x: -35, y: 35, z: 45 },
        { x: 35, y: 40, z: 85 }
      );
      
      // Summer afternoon sun from southwest
      const summerSun: SunPosition = {
        azimuth: 3.92,  // ~225 degrees (SW)
        altitude: 1.13,  // ~65 degrees (high)
        azimuthDegrees: 225,
        altitudeDegrees: 65
      };
      
      const result = calculateSectionShadow(lowerSection, summerSun, [upperDeck]);
      
      // Lower sections should be partially shaded by upper deck
      expect(result.shadowPercentage).toBeGreaterThan(30);
      expect(result.shadowPercentage).toBeLessThan(70);
      expect(result.partialShade).toBe(true);
      expect(result.obstructionsCasting).toContain('upper_deck');
    });

    test('Fenway Park - Green Monster shadow in late afternoon', () => {
      // The Green Monster (left field wall) casts shadows on left field seats
      const leftFieldSeats = createMockSection('left_field');
      leftFieldSeats.vertices3D = [
        { x: -100, y: 10, z: 150 },
        { x: -80, y: 10, z: 150 },
        { x: -80, y: 20, z: 170 },
        { x: -100, y: 20, z: 170 }
      ];
      
      const greenMonster = createMockObstruction(
        'green_monster',
        { x: -110, y: 0, z: 145 },
        { x: -105, y: 37, z: 155 }  // 37 feet tall
      );
      
      // Late afternoon sun from west
      const lateAfternoonSun: SunPosition = {
        azimuth: 4.71,  // 270 degrees (west)
        altitude: 0.35,  // 20 degrees (low)
        azimuthDegrees: 270,
        altitudeDegrees: 20
      };
      
      const result = calculateSectionShadow(leftFieldSeats, lateAfternoonSun, [greenMonster]);
      
      // Left field seats should be heavily shaded
      expect(result.shadowPercentage).toBeGreaterThan(70);
      expect(result.obstructionsCasting).toContain('green_monster');
    });
  });
});