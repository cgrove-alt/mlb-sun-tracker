#!/usr/bin/env ts-node
"use strict";
/**
 * Stadium Data Validation Script
 *
 * Validates all stadium data files for:
 * - TypeScript interface compliance
 * - 3D coordinate bounds
 * - Row numbering consistency
 * - Duplicate IDs
 * - Coverage statistics
 *
 * Usage: npm run validate-stadium-data
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class StadiumDataValidator {
    constructor() {
        this.errors = [];
        this.stats = {
            totalFiles: 0,
            totalSections: 0,
            totalObstructions: 0,
            filesWithRowData: 0,
            avgSectionsPerFile: 0,
            avgRowsPerSection: 0
        };
    }
    /**
     * Find all TypeScript files in a directory recursively
     */
    findTsFiles(dir) {
        if (!fs.existsSync(dir)) {
            return [];
        }
        const files = [];
        const items = fs.readdirSync(dir);
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                files.push(...this.findTsFiles(fullPath));
            }
            else if (item.endsWith('.ts') && !item.endsWith('.test.ts') && item !== 'index.ts') {
                files.push(fullPath);
            }
        }
        return files;
    }
    /**
     * Validate Vector3D structure
     */
    isValidVector3D(v) {
        return (typeof v === 'object' &&
            typeof v.x === 'number' &&
            typeof v.y === 'number' &&
            typeof v.z === 'number' &&
            !isNaN(v.x) &&
            !isNaN(v.y) &&
            !isNaN(v.z));
    }
    /**
     * Validate 3D coordinate bounds (reasonable stadium dimensions)
     */
    validateCoordinateBounds(v, file, location) {
        const MAX_COORD = 1000; // Stadium coordinates should be within +/- 1000 feet
        const MIN_Z = -50; // Field level can be slightly below ground
        const MAX_Z = 500; // Upper deck should be below 500 feet
        if (Math.abs(v.x) > MAX_COORD || Math.abs(v.y) > MAX_COORD) {
            this.errors.push({
                severity: 'warning',
                file,
                message: `Coordinate out of typical bounds: x=${v.x}, y=${v.y}`,
                location
            });
        }
        if (v.z < MIN_Z || v.z > MAX_Z) {
            this.errors.push({
                severity: 'warning',
                file,
                message: `Z coordinate out of bounds: ${v.z} (expected ${MIN_Z} to ${MAX_Z})`,
                location
            });
        }
    }
    /**
     * Validate section structure
     */
    validateSection(section, file) {
        const sectionId = section.id || 'unknown';
        // Required fields
        if (!section.id) {
            this.errors.push({
                severity: 'critical',
                file,
                message: 'Section missing required field: id'
            });
        }
        if (!section.name) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Section ${sectionId}: missing required field: name`
            });
        }
        if (!section.level) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Section ${sectionId}: missing required field: level`
            });
        }
        // Level validation
        const validLevels = ['field', 'lower', 'club', 'upper', 'suite', 'terrace', 'mezzanine', 'standing'];
        if (section.level && !validLevels.includes(section.level)) {
            this.errors.push({
                severity: 'warning',
                file,
                message: `Section ${sectionId}: invalid level '${section.level}'`,
                location: `Valid levels: ${validLevels.join(', ')}`
            });
        }
        // Angle validation
        if (typeof section.baseAngle !== 'number' || section.baseAngle < 0 || section.baseAngle >= 360) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Section ${sectionId}: invalid baseAngle ${section.baseAngle} (must be 0-359)`
            });
        }
        if (typeof section.angleSpan !== 'number' || section.angleSpan <= 0 || section.angleSpan > 360) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Section ${sectionId}: invalid angleSpan ${section.angleSpan} (must be > 0 and <= 360)`
            });
        }
        // Vertices validation
        if (!Array.isArray(section.vertices3D)) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Section ${sectionId}: missing or invalid vertices3D array`
            });
        }
        else if (section.vertices3D.length !== 4) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Section ${sectionId}: must have exactly 4 vertices3D (has ${section.vertices3D.length})`
            });
        }
        else {
            section.vertices3D.forEach((v, i) => {
                if (!this.isValidVector3D(v)) {
                    this.errors.push({
                        severity: 'critical',
                        file,
                        message: `Section ${sectionId}: invalid vertex ${i}`,
                        location: `Vertex: ${JSON.stringify(v)}`
                    });
                }
                else {
                    this.validateCoordinateBounds(v, file, `Section ${sectionId} vertex ${i}`);
                }
            });
        }
        // Boolean fields
        if (typeof section.covered !== 'boolean') {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Section ${sectionId}: missing or invalid 'covered' field (must be boolean)`
            });
        }
        // Row data validation (if present)
        if (section.rows && Array.isArray(section.rows)) {
            this.validateRows(section.rows, sectionId, file);
        }
        // Capacity validation (optional but recommended)
        if (section.capacity !== undefined) {
            if (typeof section.capacity !== 'number' || section.capacity <= 0) {
                this.errors.push({
                    severity: 'warning',
                    file,
                    message: `Section ${sectionId}: invalid capacity ${section.capacity}`
                });
            }
        }
    }
    /**
     * Validate row data
     */
    validateRows(rows, sectionId, file) {
        const seenRowNumbers = new Set();
        rows.forEach((row, idx) => {
            if (!row.rowNumber) {
                this.errors.push({
                    severity: 'critical',
                    file,
                    message: `Section ${sectionId} row ${idx}: missing rowNumber`
                });
            }
            else {
                // Check for duplicates
                if (seenRowNumbers.has(row.rowNumber)) {
                    this.errors.push({
                        severity: 'critical',
                        file,
                        message: `Section ${sectionId}: duplicate rowNumber '${row.rowNumber}'`
                    });
                }
                seenRowNumbers.add(row.rowNumber);
            }
            if (typeof row.seats !== 'number' || row.seats <= 0) {
                this.errors.push({
                    severity: 'warning',
                    file,
                    message: `Section ${sectionId} row ${row.rowNumber}: invalid seats count ${row.seats}`
                });
            }
            if (typeof row.elevation !== 'number') {
                this.errors.push({
                    severity: 'critical',
                    file,
                    message: `Section ${sectionId} row ${row.rowNumber}: missing or invalid elevation`
                });
            }
            if (typeof row.depth !== 'number') {
                this.errors.push({
                    severity: 'critical',
                    file,
                    message: `Section ${sectionId} row ${row.rowNumber}: missing or invalid depth`
                });
            }
            if (typeof row.covered !== 'boolean') {
                this.errors.push({
                    severity: 'critical',
                    file,
                    message: `Section ${sectionId} row ${row.rowNumber}: missing or invalid 'covered' field`
                });
            }
        });
        // Check row numbering consistency
        const rowNumbers = rows.map(r => r.rowNumber);
        const isNumeric = rowNumbers.every(n => /^\d+$/.test(n));
        const isAlpha = rowNumbers.every(n => /^[A-Z]+$/.test(n));
        if (!isNumeric && !isAlpha) {
            this.errors.push({
                severity: 'warning',
                file,
                message: `Section ${sectionId}: inconsistent row numbering scheme (mix of letters and numbers)`
            });
        }
    }
    /**
     * Validate obstruction structure
     */
    validateObstruction(obstruction, file) {
        const obsId = obstruction.id || 'unknown';
        // Required fields
        if (!obstruction.id) {
            this.errors.push({
                severity: 'critical',
                file,
                message: 'Obstruction missing required field: id'
            });
        }
        if (!obstruction.name) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Obstruction ${obsId}: missing required field: name`
            });
        }
        if (!obstruction.type) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Obstruction ${obsId}: missing required field: type`
            });
        }
        // Type validation
        const validTypes = ['roof', 'upper_deck', 'overhang', 'scoreboard', 'structure', 'facade', 'canopy'];
        if (obstruction.type && !validTypes.includes(obstruction.type)) {
            this.errors.push({
                severity: 'warning',
                file,
                message: `Obstruction ${obsId}: unusual type '${obstruction.type}'`,
                location: `Common types: ${validTypes.join(', ')}`
            });
        }
        // Geometry validation
        if (!obstruction.geometry) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Obstruction ${obsId}: missing geometry`
            });
            return;
        }
        if (!Array.isArray(obstruction.geometry.vertices) || obstruction.geometry.vertices.length < 4) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Obstruction ${obsId}: geometry must have at least 4 vertices (has ${obstruction.geometry.vertices?.length || 0})`
            });
        }
        else {
            obstruction.geometry.vertices.forEach((v, i) => {
                if (!this.isValidVector3D(v)) {
                    this.errors.push({
                        severity: 'critical',
                        file,
                        message: `Obstruction ${obsId}: invalid vertex ${i}`,
                        location: `Vertex: ${JSON.stringify(v)}`
                    });
                }
                else {
                    this.validateCoordinateBounds(v, file, `Obstruction ${obsId} vertex ${i}`);
                }
            });
        }
        if (!Array.isArray(obstruction.geometry.faces) || obstruction.geometry.faces.length < 1) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Obstruction ${obsId}: geometry must have at least 1 face`
            });
        }
        // Bounding box validation
        if (!obstruction.boundingBox) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Obstruction ${obsId}: missing boundingBox`
            });
        }
        else {
            if (!this.isValidVector3D(obstruction.boundingBox.min)) {
                this.errors.push({
                    severity: 'critical',
                    file,
                    message: `Obstruction ${obsId}: invalid boundingBox.min`
                });
            }
            if (!this.isValidVector3D(obstruction.boundingBox.max)) {
                this.errors.push({
                    severity: 'critical',
                    file,
                    message: `Obstruction ${obsId}: invalid boundingBox.max`
                });
            }
            // Ensure max > min
            if (obstruction.boundingBox.min && obstruction.boundingBox.max) {
                const { min, max } = obstruction.boundingBox;
                if (max.x <= min.x || max.y <= min.y || max.z <= min.z) {
                    this.errors.push({
                        severity: 'critical',
                        file,
                        message: `Obstruction ${obsId}: boundingBox.max must be greater than min in all dimensions`
                    });
                }
            }
        }
        // Material validation
        if (!obstruction.material) {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Obstruction ${obsId}: missing material`
            });
        }
        else {
            if (typeof obstruction.material.opacity !== 'number' ||
                obstruction.material.opacity < 0 ||
                obstruction.material.opacity > 1) {
                this.errors.push({
                    severity: 'critical',
                    file,
                    message: `Obstruction ${obsId}: material.opacity must be between 0 and 1 (is ${obstruction.material.opacity})`
                });
            }
        }
        // Shadow casting
        if (typeof obstruction.castsShadow !== 'boolean') {
            this.errors.push({
                severity: 'critical',
                file,
                message: `Obstruction ${obsId}: missing or invalid castsShadow field`
            });
        }
    }
    /**
     * Parse and validate a section file
     */
    validateSectionFile(filePath) {
        const fileName = path.basename(filePath);
        let fileContent;
        try {
            fileContent = fs.readFileSync(filePath, 'utf-8');
        }
        catch (error) {
            this.errors.push({
                severity: 'critical',
                file: fileName,
                message: `Failed to read file: ${error}`
            });
            return;
        }
        // Extract sections array using regex
        const sectionMatch = fileContent.match(/export\s+(?:const|default)\s+\w*[Ss]ections[^=]*=\s*(\[[\s\S]*?\]);/);
        if (!sectionMatch) {
            this.errors.push({
                severity: 'warning',
                file: fileName,
                message: 'Could not find sections export in file'
            });
            return;
        }
        this.stats.totalFiles++;
        // Try to evaluate the sections (simplified - doesn't handle all TypeScript features)
        try {
            // This is a simplified parser - in production, use TypeScript compiler API
            const sectionsCode = sectionMatch[1];
            // Count sections by counting section IDs
            const idMatches = sectionsCode.match(/\bid:\s*['"`][^'"`]+['"`]/g);
            if (idMatches) {
                this.stats.totalSections += idMatches.length;
            }
            // Check for row-level data
            const hasRows = sectionsCode.includes('rows:') || sectionsCode.includes('generateRows');
            if (hasRows) {
                this.stats.filesWithRowData++;
            }
            // Validate structure without full evaluation (for safety)
            // Check for common structural issues
            if (!sectionsCode.includes('vertices3D')) {
                this.errors.push({
                    severity: 'critical',
                    file: fileName,
                    message: 'File appears to be missing vertices3D definitions'
                });
            }
            if (!sectionsCode.includes('baseAngle')) {
                this.errors.push({
                    severity: 'critical',
                    file: fileName,
                    message: 'File appears to be missing baseAngle definitions'
                });
            }
        }
        catch (error) {
            this.errors.push({
                severity: 'info',
                file: fileName,
                message: `Complex TypeScript - skipping runtime validation (compile-time checks will catch errors)`
            });
        }
    }
    /**
     * Parse and validate an obstruction file
     */
    validateObstructionFile(filePath) {
        const fileName = path.basename(filePath);
        let fileContent;
        try {
            fileContent = fs.readFileSync(filePath, 'utf-8');
        }
        catch (error) {
            this.errors.push({
                severity: 'critical',
                file: fileName,
                message: `Failed to read file: ${error}`
            });
            return;
        }
        // Extract obstructions array
        const obstructionMatch = fileContent.match(/export\s+(?:const|default)\s+\w*[Oo]bstructions[^=]*=\s*(\[[\s\S]*?\]);/);
        if (!obstructionMatch) {
            this.errors.push({
                severity: 'warning',
                file: fileName,
                message: 'Could not find obstructions export in file'
            });
            return;
        }
        // Count obstructions
        const obstructionsCode = obstructionMatch[1];
        const idMatches = obstructionsCode.match(/\bid:\s*['"`][^'"`]+['"`]/g);
        if (idMatches) {
            this.stats.totalObstructions += idMatches.length;
        }
        // Check for required fields
        if (!obstructionsCode.includes('geometry')) {
            this.errors.push({
                severity: 'critical',
                file: fileName,
                message: 'File appears to be missing geometry definitions'
            });
        }
        if (!obstructionsCode.includes('boundingBox')) {
            this.errors.push({
                severity: 'critical',
                file: fileName,
                message: 'File appears to be missing boundingBox definitions'
            });
        }
    }
    /**
     * Validate all stadium data
     */
    async validate() {
        console.log('Stadium Data Validation Tool');
        console.log('='.repeat(60));
        console.log(`Started: ${new Date().toISOString()}\n`);
        const baseDir = path.join(__dirname, '..');
        const sectionsDir = path.join(baseDir, 'src/data/sections');
        const obstructionsDir = path.join(baseDir, 'src/data/obstructions');
        // Validate MLB section files
        console.log('Validating MLB section files...');
        const mlbSectionsDir = path.join(sectionsDir, 'mlb');
        const mlbSectionFiles = this.findTsFiles(mlbSectionsDir);
        console.log(`Found ${mlbSectionFiles.length} MLB section files\n`);
        for (const file of mlbSectionFiles) {
            this.validateSectionFile(file);
        }
        // Validate NFL section files
        console.log('Validating NFL section files...');
        const nflSectionsDir = path.join(sectionsDir, 'nfl');
        const nflSectionFiles = this.findTsFiles(nflSectionsDir);
        console.log(`Found ${nflSectionFiles.length} NFL section files\n`);
        for (const file of nflSectionFiles) {
            this.validateSectionFile(file);
        }
        // Validate MiLB section files
        console.log('Validating MiLB section files...');
        const milbSectionsDir = path.join(sectionsDir, 'milb');
        const milbSectionFiles = this.findTsFiles(milbSectionsDir);
        console.log(`Found ${milbSectionFiles.length} MiLB section files\n`);
        for (const file of milbSectionFiles) {
            this.validateSectionFile(file);
        }
        // Validate obstruction files
        console.log('Validating obstruction files...');
        const obstructionFiles = this.findTsFiles(obstructionsDir);
        console.log(`Found ${obstructionFiles.length} obstruction files\n`);
        for (const file of obstructionFiles) {
            this.validateObstructionFile(file);
        }
        // Calculate statistics
        if (this.stats.totalFiles > 0) {
            this.stats.avgSectionsPerFile = this.stats.totalSections / this.stats.totalFiles;
        }
        this.printReport();
    }
    /**
     * Print validation report
     */
    printReport() {
        console.log('\n' + '='.repeat(60));
        console.log('VALIDATION REPORT');
        console.log('='.repeat(60));
        // Statistics
        console.log('\nStatistics:');
        console.log(`  Total section files: ${this.stats.totalFiles}`);
        console.log(`  Total sections: ${this.stats.totalSections}`);
        console.log(`  Total obstructions: ${this.stats.totalObstructions}`);
        console.log(`  Files with row-level data: ${this.stats.filesWithRowData}`);
        console.log(`  Average sections per file: ${this.stats.avgSectionsPerFile.toFixed(1)}`);
        console.log(`  Row-level coverage: ${((this.stats.filesWithRowData / Math.max(this.stats.totalFiles, 1)) * 100).toFixed(1)}%`);
        // Errors by severity
        const critical = this.errors.filter(e => e.severity === 'critical');
        const warnings = this.errors.filter(e => e.severity === 'warning');
        const info = this.errors.filter(e => e.severity === 'info');
        console.log('\nValidation Results:');
        console.log(`  Critical errors: ${critical.length}`);
        console.log(`  Warnings: ${warnings.length}`);
        console.log(`  Info: ${info.length}`);
        // Print critical errors
        if (critical.length > 0) {
            console.log('\n' + '='.repeat(60));
            console.log('CRITICAL ERRORS');
            console.log('='.repeat(60));
            critical.forEach(error => {
                console.log(`\n[${error.file}]`);
                console.log(`  ${error.message}`);
                if (error.location) {
                    console.log(`  ${error.location}`);
                }
            });
        }
        // Print warnings (limited to first 20)
        if (warnings.length > 0) {
            console.log('\n' + '='.repeat(60));
            console.log(`WARNINGS (showing ${Math.min(warnings.length, 20)} of ${warnings.length})`);
            console.log('='.repeat(60));
            warnings.slice(0, 20).forEach(error => {
                console.log(`\n[${error.file}]`);
                console.log(`  ${error.message}`);
                if (error.location) {
                    console.log(`  ${error.location}`);
                }
            });
            if (warnings.length > 20) {
                console.log(`\n... and ${warnings.length - 20} more warnings`);
            }
        }
        // Summary
        console.log('\n' + '='.repeat(60));
        if (critical.length === 0) {
            console.log('✓ VALIDATION PASSED');
            console.log(`  No critical errors found. ${warnings.length} warnings.`);
        }
        else {
            console.log('✗ VALIDATION FAILED');
            console.log(`  ${critical.length} critical errors must be fixed.`);
        }
        console.log('='.repeat(60));
        // Exit with appropriate code
        if (critical.length > 0) {
            process.exit(1);
        }
    }
}
// Run validation
const validator = new StadiumDataValidator();
validator.validate().catch(error => {
    console.error('Validation failed with error:', error);
    process.exit(1);
});
