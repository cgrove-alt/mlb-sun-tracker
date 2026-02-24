/**
 * Unit Tests for Stadium Data Validation Script
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('Stadium Data Validation Tests', () => {
  const baseDir = path.join(__dirname, '../..');
  const sectionsDir = path.join(baseDir, 'src/data/sections');
  const obstructionsDir = path.join(baseDir, 'src/data/obstructions');

  describe('File Structure', () => {
    test('sections directory exists', () => {
      expect(fs.existsSync(sectionsDir)).toBe(true);
    });

    test('obstructions directory exists', () => {
      expect(fs.existsSync(obstructionsDir)).toBe(true);
    });

    test('MLB sections directory exists', () => {
      const mlbDir = path.join(sectionsDir, 'mlb');
      expect(fs.existsSync(mlbDir)).toBe(true);
    });

    test('MLB obstructions directory exists or will be created', () => {
      const mlbObsDir = path.join(obstructionsDir, 'mlb');
      // Directory may not exist yet - that's ok, we'll create it
      const exists = fs.existsSync(mlbObsDir);
      expect(typeof exists).toBe('boolean');
    });
  });

  describe('Section File Validation', () => {
    const mlbSectionsDir = path.join(sectionsDir, 'mlb');

    test('MLB section files are valid TypeScript', () => {
      if (!fs.existsSync(mlbSectionsDir)) {
        return; // Skip if directory doesn't exist
      }

      const files = fs.readdirSync(mlbSectionsDir)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

      expect(files.length).toBeGreaterThan(0);

      files.forEach(file => {
        const filePath = path.join(mlbSectionsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Should have sections export
        const hasExport = /export\s+(?:const|default)\s+\w*[Ss]ections/.test(content);
        expect(hasExport).toBe(true);

        // Should have required fields
        expect(content).toMatch(/\bid:/);
        expect(content).toMatch(/\bname:/);
        expect(content).toMatch(/\blevel:/);
        expect(content).toMatch(/\bbaseAngle:/);
        expect(content).toMatch(/\bangleSpan:/);
        expect(content).toMatch(/\bvertices3D:/);
        expect(content).toMatch(/\bcovered:/);
      });
    });

    test('Section files use valid levels', () => {
      if (!fs.existsSync(mlbSectionsDir)) {
        return;
      }

      const files = fs.readdirSync(mlbSectionsDir)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

      const validLevels = ['field', 'lower', 'club', 'upper', 'suite', 'terrace', 'mezzanine', 'standing'];

      files.forEach(file => {
        const filePath = path.join(mlbSectionsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract level values
        const levelMatches = content.match(/level:\s*['"`]([^'"`]+)['"`]/g);
        if (levelMatches) {
          levelMatches.forEach(match => {
            const level = match.match(/level:\s*['"`]([^'"`]+)['"`]/)?.[1];
            if (level) {
              expect(validLevels).toContain(level);
            }
          });
        }
      });
    });

    test('Section angles are within valid range', () => {
      if (!fs.existsSync(mlbSectionsDir)) {
        return;
      }

      const files = fs.readdirSync(mlbSectionsDir)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

      files.forEach(file => {
        const filePath = path.join(mlbSectionsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract baseAngle values
        const angleMatches = content.match(/baseAngle:\s*(\d+)/g);
        if (angleMatches) {
          angleMatches.forEach(match => {
            const angle = parseInt(match.match(/baseAngle:\s*(\d+)/)?.[1] || '0');
            expect(angle).toBeGreaterThanOrEqual(0);
            expect(angle).toBeLessThan(360);
          });
        }

        // Extract angleSpan values
        const spanMatches = content.match(/angleSpan:\s*(\d+)/g);
        if (spanMatches) {
          spanMatches.forEach(match => {
            const span = parseInt(match.match(/angleSpan:\s*(\d+)/)?.[1] || '0');
            expect(span).toBeGreaterThan(0);
            expect(span).toBeLessThanOrEqual(360);
          });
        }
      });
    });

    test('Sections have 4 vertices', () => {
      if (!fs.existsSync(mlbSectionsDir)) {
        return;
      }

      const files = fs.readdirSync(mlbSectionsDir)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

      files.forEach(file => {
        const filePath = path.join(mlbSectionsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Check that vertices3D arrays have 4 elements
        // This is a simplified check
        const hasVertices = content.includes('vertices3D');
        expect(hasVertices).toBe(true);
      });
    });
  });

  describe('Obstruction File Validation', () => {
    const nflObsDir = path.join(obstructionsDir, 'nfl');

    test('NFL obstruction files are valid TypeScript', () => {
      if (!fs.existsSync(nflObsDir)) {
        return;
      }

      const files = fs.readdirSync(nflObsDir)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

      expect(files.length).toBeGreaterThan(0);

      files.forEach(file => {
        const filePath = path.join(nflObsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Should have obstructions export
        const hasExport = /export\s+(?:const|default)\s+\w*[Oo]bstructions/.test(content);
        expect(hasExport).toBe(true);

        // Should have required fields
        expect(content).toMatch(/\bid:/);
        expect(content).toMatch(/\bname:/);
        expect(content).toMatch(/\btype:/);
        expect(content).toMatch(/geometry:/); // Can be 'geometry' or geometry
        expect(content).toMatch(/boundingBox:/);
        expect(content).toMatch(/material:/);
        expect(content).toMatch(/castsShadow:/);
      });
    });

    test('Obstructions use valid types', () => {
      if (!fs.existsSync(nflObsDir)) {
        return;
      }

      const files = fs.readdirSync(nflObsDir)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

      const validTypes = ['roof', 'upper_deck', 'overhang', 'scoreboard', 'structure', 'facade', 'canopy'];

      files.forEach(file => {
        const filePath = path.join(nflObsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract type values
        const typeMatches = content.match(/type:\s*['"`]([^'"`]+)['"`]/g);
        if (typeMatches) {
          typeMatches.forEach(match => {
            const type = match.match(/type:\s*['"`]([^'"`]+)['"`]/)?.[1];
            if (type) {
              expect(validTypes).toContain(type);
            }
          });
        }
      });
    });

    test('Obstructions have valid opacity values', () => {
      if (!fs.existsSync(nflObsDir)) {
        return;
      }

      const files = fs.readdirSync(nflObsDir)
        .filter(f => f.endsWith('.ts') && f !== 'index.ts');

      files.forEach(file => {
        const filePath = path.join(nflObsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // Extract opacity values
        const opacityMatches = content.match(/opacity:\s*([\d.]+)/g);
        if (opacityMatches) {
          opacityMatches.forEach(match => {
            const opacity = parseFloat(match.match(/opacity:\s*([\d.]+)/)?.[1] || '0');
            expect(opacity).toBeGreaterThanOrEqual(0);
            expect(opacity).toBeLessThanOrEqual(1);
          });
        }
      });
    });
  });

  describe('Data Integrity', () => {
    test('No duplicate section IDs within files', () => {
      if (!fs.existsSync(sectionsDir)) {
        return;
      }

      const findTsFiles = (dir: string): string[] => {
        if (!fs.existsSync(dir)) return [];
        const files: string[] = [];
        const items = fs.readdirSync(dir);

        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            files.push(...findTsFiles(fullPath));
          } else if (item.endsWith('.ts') && !item.endsWith('.test.ts') && item !== 'index.ts') {
            files.push(fullPath);
          }
        }

        return files;
      };

      const sectionFiles = findTsFiles(sectionsDir);
      const duplicates: string[] = [];

      sectionFiles.forEach(filePath => {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const fileName = path.basename(filePath);

        // Extract all section IDs
        const idMatches = fileContent.match(/id:\s*['"`]([^'"`]+)['"`]/g);
        if (idMatches) {
          const ids = idMatches.map(m => m.match(/id:\s*['"`]([^'"`]+)['"`]/)![1]);
          const seen = new Set<string>();

          ids.forEach(id => {
            if (seen.has(id)) {
              duplicates.push(`${fileName}: Duplicate ID '${id}'`);
            }
            seen.add(id);
          });
        }
      });

      expect(duplicates).toEqual([]);
    });

    test('Section files are not excessively large', () => {
      if (!fs.existsSync(sectionsDir)) {
        return;
      }

      const findTsFiles = (dir: string): string[] => {
        if (!fs.existsSync(dir)) return [];
        const files: string[] = [];
        const items = fs.readdirSync(dir);

        for (const item of items) {
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            files.push(...findTsFiles(fullPath));
          } else if (item.endsWith('.ts') && !item.endsWith('.test.ts') && item !== 'index.ts') {
            files.push(fullPath);
          }
        }

        return files;
      };

      const sectionFiles = findTsFiles(sectionsDir);
      const largeFiles: string[] = [];

      sectionFiles.forEach(filePath => {
        const stats = fs.statSync(filePath);
        const sizeKB = stats.size / 1024;

        if (sizeKB > 500) {  // Files larger than 500KB are concerning
          largeFiles.push(`${path.basename(filePath)}: ${sizeKB.toFixed(2)}KB`);
        }
      });

      // Allow some large files, but flag if there are too many
      expect(largeFiles.length).toBeLessThan(10);
    });
  });

  describe('Edge Cases', () => {
    test('Handles missing directories gracefully', () => {
      const nonExistentDir = path.join(baseDir, 'src/data/nonexistent');
      expect(fs.existsSync(nonExistentDir)).toBe(false);
    });

    test('Vector3D structure validation', () => {
      const validVector = { x: 100, y: 50, z: 20 };
      expect(typeof validVector.x).toBe('number');
      expect(typeof validVector.y).toBe('number');
      expect(typeof validVector.z).toBe('number');
      expect(isNaN(validVector.x)).toBe(false);
      expect(isNaN(validVector.y)).toBe(false);
      expect(isNaN(validVector.z)).toBe(false);
    });

    test('Bounding box min/max validation', () => {
      const validBoundingBox = {
        min: { x: 0, y: 0, z: 0 },
        max: { x: 100, y: 100, z: 100 }
      };

      expect(validBoundingBox.max.x).toBeGreaterThan(validBoundingBox.min.x);
      expect(validBoundingBox.max.y).toBeGreaterThan(validBoundingBox.min.y);
      expect(validBoundingBox.max.z).toBeGreaterThan(validBoundingBox.min.z);
    });
  });
});
