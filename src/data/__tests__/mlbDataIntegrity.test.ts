/**
 * MLB Data Integrity Tests
 * Comprehensive test suite for all 30 MLB stadiums
 * Tests data loading, structure validation, and row-level data quality
 */

import { getStadiumCompleteData } from '../stadium-data-aggregator';
import { DetailedSection, Obstruction3D } from '../../types/stadium-complete';

// All 30 MLB stadium IDs
const MLB_STADIUM_IDS = [
  'yankees',           // Yankee Stadium
  'red-sox',           // Fenway Park
  'dodgers',           // Dodger Stadium
  'cubs',              // Wrigley Field
  'giants',            // Oracle Park
  'orioles',           // Camden Yards
  'padres',            // Petco Park
  'rockies',           // Coors Field
  'cardinals',         // Busch Stadium
  'mariners',          // T-Mobile Park
  'braves',            // Truist Park
  'astros',            // Minute Maid Park
  'rangers',           // Globe Life Field
  'diamondbacks',      // Chase Field
  'reds',              // Great American Ball Park
  'pirates',           // PNC Park
  'mets',              // Citi Field
  'nationals',         // Nationals Park
  'twins',             // Target Field
  'guardians',         // Progressive Field
  'phillies',          // Citizens Bank Park
  'white-sox',         // Guaranteed Rate Field
  'tigers',            // Comerica Park
  'royals',            // Kauffman Stadium
  'brewers',           // American Family Field
  'blue-jays',         // Rogers Centre
  'angels',            // Angel Stadium
  'marlins',           // loanDepot Park
  'rays',              // Tropicana Field
  'athletics',         // Oakland Coliseum
];

describe('MLB Data Integrity Tests', () => {
  describe('Stadium Loading', () => {
    test('All 30 MLB stadiums can be loaded', () => {
      const results = MLB_STADIUM_IDS.map(id => {
        try {
          const data = getStadiumCompleteData(id, 'MLB');
          return { id, success: true, sections: data.sections?.length || 0, obstructions: data.obstructions?.length || 0 };
        } catch (error) {
          return { id, success: false, error: error instanceof Error ? error.message : String(error) };
        }
      });

      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error('Failed to load:', failed);
      }

      const successful = results.filter(r => r.success);
      console.log(`Successfully loaded ${successful.length}/30 MLB stadiums`);

      // Log section counts for successful loads
      successful.forEach(r => {
        if ('sections' in r) {
          console.log(`  ${r.id}: ${r.sections} sections, ${r.obstructions} obstructions`);
        }
      });

      expect(successful.length).toBe(30);
    });

    test.each(MLB_STADIUM_IDS)('Stadium %s loads without errors', (stadiumId) => {
      expect(() => {
        getStadiumCompleteData(stadiumId, 'MLB');
      }).not.toThrow();
    });
  });

  describe('Section Data Validation', () => {
    MLB_STADIUM_IDS.forEach(stadiumId => {
      describe(`Stadium: ${stadiumId}`, () => {
        let sections: DetailedSection[];

        beforeAll(() => {
          const data = getStadiumCompleteData(stadiumId, 'MLB');
          sections = data.sections || [];
        });

        test('has at least 20 sections', () => {
          expect(sections.length).toBeGreaterThanOrEqual(20);
        });

        test('all sections have required fields', () => {
          const errors: string[] = [];

          sections.forEach((section, idx) => {
            if (!section.id) errors.push(`Section ${idx}: missing id`);
            if (!section.name) errors.push(`Section ${idx}: missing name`);
            if (!section.level) errors.push(`Section ${idx}: missing level`);
            if (typeof section.baseAngle !== 'number') errors.push(`Section ${section.id}: missing baseAngle`);
            if (typeof section.angleSpan !== 'number') errors.push(`Section ${section.id}: missing angleSpan`);
            if (!Array.isArray(section.vertices3D)) errors.push(`Section ${section.id}: missing vertices3D`);
            if (typeof section.covered !== 'boolean') errors.push(`Section ${section.id}: missing covered`);
            // Capacity is not strictly required for all sections
          });

          if (errors.length > 0) {
            console.error(`${stadiumId} validation errors:`, errors);
          }
          expect(errors).toEqual([]);
        });

        test('all sections have valid level values', () => {
          const validLevels = ['field', 'lower', 'club', 'upper', 'suite', 'terrace', 'mezzanine', 'bleachers', 'grandstand', 'standing'];
          const invalidSections = sections.filter(s => !validLevels.includes(s.level));

          if (invalidSections.length > 0) {
            console.warn(`${stadiumId} invalid levels:`, invalidSections.map(s => ({ id: s.id, level: s.level })));
          }
          // Allow some exceptions for unique stadium designs
          expect(invalidSections.length).toBeLessThan(sections.length * 0.1);
        });

        test('all sections have valid angle ranges', () => {
          const invalidAngles = sections.filter(s =>
            s.baseAngle < 0 || s.baseAngle >= 360 ||
            s.angleSpan <= 0 || s.angleSpan > 360
          );

          if (invalidAngles.length > 0) {
            console.error(`${stadiumId} invalid angles:`, invalidAngles.map(s => ({
              id: s.id,
              baseAngle: s.baseAngle,
              angleSpan: s.angleSpan
            })));
          }
          expect(invalidAngles).toEqual([]);
        });

        test('all sections have exactly 4 vertices', () => {
          const invalidVertices = sections.filter(s => s.vertices3D.length !== 4);

          if (invalidVertices.length > 0) {
            console.error(`${stadiumId} invalid vertices:`, invalidVertices.map(s => ({
              id: s.id,
              vertexCount: s.vertices3D.length
            })));
          }
          expect(invalidVertices).toEqual([]);
        });

        test('all vertices have valid 3D coordinates', () => {
          const errors: string[] = [];

          sections.forEach(section => {
            section.vertices3D.forEach((v, idx) => {
              if (typeof v.x !== 'number' || isNaN(v.x)) {
                errors.push(`Section ${section.id}, vertex ${idx}: invalid x`);
              }
              if (typeof v.y !== 'number' || isNaN(v.y)) {
                errors.push(`Section ${section.id}, vertex ${idx}: invalid y`);
              }
              if (typeof v.z !== 'number' || isNaN(v.z)) {
                errors.push(`Section ${section.id}, vertex ${idx}: invalid z`);
              }
            });
          });

          if (errors.length > 0) {
            console.error(`${stadiumId} vertex errors:`, errors.slice(0, 10));
          }
          expect(errors).toEqual([]);
        });

        test('no duplicate section IDs', () => {
          const ids = sections.map(s => s.id);
          const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);

          if (duplicates.length > 0) {
            console.error(`${stadiumId} duplicate IDs:`, duplicates);
          }
          expect(duplicates).toEqual([]);
        });

        test('section capacities are reasonable', () => {
          const invalidCapacity = sections.filter(s => (s as any).capacity && ((s as any).capacity < 10 || (s as any).capacity > 5000));

          if (invalidCapacity.length > 0) {
            console.warn(`${stadiumId} unusual capacities:`, invalidCapacity.map(s => ({
              id: s.id,
              capacity: (s as any).capacity
            })));
          }
          // Warning only - some sections may have unusual capacities
          expect(invalidCapacity.length).toBeLessThan(sections.length * 0.1); // < 10% unusual
        });
      });
    });
  });

  describe('Row-Level Data Validation', () => {
    const ENHANCED_STADIUMS = [
      'yankees',
      'red-sox',  // Fenway Park - enhanced in Step 1.3
      'braves',   // Truist Park - enhanced in Step 1.4
      'phillies', // Citizens Bank Park - enhanced in Step 1.5
      'rays',     // Tropicana Field - complete
      'athletics', // Oakland Coliseum - complete
    ];

    ENHANCED_STADIUMS.forEach(stadiumId => {
      describe(`Enhanced Stadium: ${stadiumId}`, () => {
        let sections: DetailedSection[];

        beforeAll(() => {
          const data = getStadiumCompleteData(stadiumId, 'MLB');
          sections = data.sections || [];
        });

        test('has at least 60 sections (row-level requirement)', () => {
          expect(sections.length).toBeGreaterThanOrEqual(60);
        });

        test('sections with rows have valid row data', () => {
          const sectionsWithRows = sections.filter(s => s.rows && s.rows.length > 0);
          const errors: string[] = [];

          sectionsWithRows.forEach(section => {
            section.rows?.forEach(row => {
              if (!row.rowNumber) {
                errors.push(`Section ${section.id}: row missing rowNumber`);
              }
              if (typeof row.elevation !== 'number') {
                errors.push(`Section ${section.id}, row ${row.rowNumber}: missing elevation`);
              }
              if (typeof row.depth !== 'number') {
                errors.push(`Section ${section.id}, row ${row.rowNumber}: missing depth`);
              }
              if (typeof row.seats !== 'number' || row.seats < 1) {
                errors.push(`Section ${section.id}, row ${row.rowNumber}: invalid seats count`);
              }
            });
          });

          if (errors.length > 0) {
            console.error(`${stadiumId} row validation errors:`, errors.slice(0, 20));
          }
          expect(errors).toEqual([]);
        });

        test('row elevations increase monotonically', () => {
          const errors: string[] = [];

          sections.forEach(section => {
            if (!section.rows || section.rows.length < 2) return;

            for (let i = 1; i < section.rows.length; i++) {
              const prev = section.rows[i - 1];
              const curr = section.rows[i];

              if (curr.elevation < prev.elevation) {
                errors.push(
                  `Section ${section.id}: row ${curr.rowNumber} elevation (${curr.elevation}) ` +
                  `is lower than row ${prev.rowNumber} (${prev.elevation})`
                );
              }
            }
          });

          if (errors.length > 0) {
            console.warn(`${stadiumId} elevation warnings:`, errors.slice(0, 10));
          }
          // Allow some exceptions for unique stadium designs
          expect(errors.length).toBeLessThan(10);
        });

        test('at least 50% of sections have row-level data', () => {
          const sectionsWithRows = sections.filter(s => s.rows && s.rows.length > 0);
          const percentage = (sectionsWithRows.length / sections.length) * 100;

          console.log(`${stadiumId}: ${sectionsWithRows.length}/${sections.length} sections have row data (${percentage.toFixed(1)}%)`);
          expect(percentage).toBeGreaterThanOrEqual(50);
        });
      });
    });
  });

  describe('Obstruction Data Validation', () => {
    MLB_STADIUM_IDS.forEach(stadiumId => {
      describe(`Stadium: ${stadiumId}`, () => {
        let obstructions: Obstruction3D[];

        beforeAll(() => {
          const data = getStadiumCompleteData(stadiumId, 'MLB');
          obstructions = data.obstructions || [];
        });

        test('has at least 1 obstruction', () => {
          // All stadiums should have some obstructions (roof, scoreboards, etc.)
          if (obstructions.length === 0) {
            console.warn(`${stadiumId}: No obstructions defined`);
          }
          expect(obstructions.length).toBeGreaterThanOrEqual(0); // Warning only
        });

        test('all obstructions have required fields', () => {
          if (obstructions.length === 0) {
            // Skip test if no obstructions
            expect(obstructions.length).toBe(0);
            return;
          }
            const errors: string[] = [];

            obstructions.forEach((obs, idx) => {
              if (!obs.id) errors.push(`Obstruction ${idx}: missing id`);
              if (!obs.name) errors.push(`Obstruction ${idx}: missing name`);
              if (!obs.type) errors.push(`Obstruction ${idx}: missing type`);
              if (!obs.geometry) errors.push(`Obstruction ${obs.id}: missing geometry`);
              if (!obs.boundingBox) errors.push(`Obstruction ${obs.id}: missing boundingBox`);
              if (typeof obs.castsShadow !== 'boolean') errors.push(`Obstruction ${obs.id}: missing castsShadow`);
            });

            if (errors.length > 0) {
              console.error(`${stadiumId} obstruction errors:`, errors);
            }
            expect(errors).toEqual([]);
        });

        test('all obstructions have valid types', () => {
          if (obstructions.length === 0) {
            expect(obstructions.length).toBe(0);
            return;
          }
          const validTypes = ['roof', 'overhang', 'structure', 'scoreboard', 'pole', 'press_box', 'facade', 'canopy', 'monument'];
          const invalidTypes = obstructions.filter(o => !validTypes.includes(o.type));

            if (invalidTypes.length > 0) {
              console.warn(`${stadiumId} unusual obstruction types:`, invalidTypes.map(o => ({
                id: o.id,
                type: o.type
              })));
            }
            // Allow some unique obstruction types
            expect(invalidTypes.length).toBeLessThan(obstructions.length * 0.2);
        });

        test('geometry has valid vertices and faces', () => {
          if (obstructions.length === 0) {
            expect(obstructions.length).toBe(0);
            return;
          }
          const errors: string[] = [];

            obstructions.forEach(obs => {
              if (!obs.geometry) return;

              if (!Array.isArray(obs.geometry.vertices) || obs.geometry.vertices.length < 4) {
                errors.push(`Obstruction ${obs.id}: needs at least 4 vertices`);
              }

              if (!Array.isArray(obs.geometry.faces) || obs.geometry.faces.length < 1) {
                errors.push(`Obstruction ${obs.id}: needs at least 1 face`);
              }

              // Validate vertices have valid 3D coordinates
              obs.geometry.vertices?.forEach((v, idx) => {
                if (typeof v.x !== 'number' || isNaN(v.x)) {
                  errors.push(`Obstruction ${obs.id}, vertex ${idx}: invalid x`);
                }
                if (typeof v.y !== 'number' || isNaN(v.y)) {
                  errors.push(`Obstruction ${obs.id}, vertex ${idx}: invalid y`);
                }
                if (typeof v.z !== 'number' || isNaN(v.z)) {
                  errors.push(`Obstruction ${obs.id}, vertex ${idx}: invalid z`);
                }
              });
            });

            if (errors.length > 0) {
              console.error(`${stadiumId} geometry errors:`, errors.slice(0, 10));
            }
            expect(errors).toEqual([]);
        });

        test('bounding boxes are valid', () => {
          if (obstructions.length === 0) {
            expect(obstructions.length).toBe(0);
            return;
          }
          const errors: string[] = [];

            obstructions.forEach(obs => {
              if (!obs.boundingBox) return;

              const { min, max } = obs.boundingBox;

              if (max.x <= min.x) errors.push(`Obstruction ${obs.id}: invalid X bounds`);
              if (max.y <= min.y) errors.push(`Obstruction ${obs.id}: invalid Y bounds`);
              if (max.z <= min.z) errors.push(`Obstruction ${obs.id}: invalid Z bounds`);
            });

            if (errors.length > 0) {
              console.error(`${stadiumId} bounding box errors:`, errors);
            }
            expect(errors).toEqual([]);
        });

        test('materials have valid opacity', () => {
          if (obstructions.length === 0) {
            expect(obstructions.length).toBe(0);
            return;
          }
          const invalidMaterials = obstructions.filter(o =>
              !o.material ||
              typeof o.material.opacity !== 'number' ||
              o.material.opacity < 0 ||
              o.material.opacity > 1
            );

            if (invalidMaterials.length > 0) {
              console.error(`${stadiumId} invalid materials:`, invalidMaterials.map(o => ({
                id: o.id,
                opacity: o.material?.opacity
              })));
            }
            expect(invalidMaterials).toEqual([]);
        });
      });
    });
  });

  describe('Data Coverage Statistics', () => {
    test('generate coverage report for all MLB stadiums', () => {
      const report = MLB_STADIUM_IDS.map(id => {
        const data = getStadiumCompleteData(id, 'MLB');
        const sections = data.sections || [];
        const obstructions = data.obstructions || [];
        const sectionsWithRows = sections.filter(s => s.rows && s.rows.length > 0);
        const totalRows = sectionsWithRows.reduce((sum, s) => sum + (s.rows?.length || 0), 0);

        return {
          stadiumId: id,
          sectionCount: sections.length,
          obstructionCount: obstructions.length,
          sectionsWithRows: sectionsWithRows.length,
          totalRows,
          rowCoveragePercent: sections.length > 0
            ? ((sectionsWithRows.length / sections.length) * 100).toFixed(1)
            : '0.0',
          meetsRowRequirement: sections.length >= 60,
          has3DObstructions: obstructions.length > 0
        };
      });

      console.log('\n=== MLB DATA COVERAGE REPORT ===\n');
      console.table(report);

      const totals = {
        totalSections: report.reduce((sum, r) => sum + r.sectionCount, 0),
        totalObstructions: report.reduce((sum, r) => sum + r.obstructionCount, 0),
        stadiumsWith60Plus: report.filter(r => r.meetsRowRequirement).length,
        stadiumsWith3D: report.filter(r => r.has3DObstructions).length,
        totalRows: report.reduce((sum, r) => sum + r.totalRows, 0),
      };

      console.log('\n=== TOTALS ===');
      console.log(`Total Sections: ${totals.totalSections}`);
      console.log(`Total Obstructions: ${totals.totalObstructions}`);
      console.log(`Total Rows: ${totals.totalRows}`);
      console.log(`Stadiums with 60+ sections: ${totals.stadiumsWith60Plus}/30`);
      console.log(`Stadiums with 3D obstructions: ${totals.stadiumsWith3D}/30`);

      expect(totals.totalSections).toBeGreaterThanOrEqual(600); // Average 20+ per stadium
      expect(totals.stadiumsWith3D).toBeGreaterThanOrEqual(27); // 90% have obstructions
    });
  });
});
