"use strict";
/**
 * Generate Validation Reports for MLB Stadiums
 * Creates detailed validation reports for each stadium
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
exports.validateStadium = validateStadium;
exports.generateMarkdownReport = generateMarkdownReport;
exports.main = main;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const stadium_data_aggregator_1 = require("../src/data/stadium-data-aggregator");
// All 30 MLB stadium IDs with names
const MLB_STADIUMS = [
    { id: 'yankees', name: 'Yankee Stadium', city: 'New York, NY' },
    { id: 'red-sox', name: 'Fenway Park', city: 'Boston, MA' },
    { id: 'dodgers', name: 'Dodger Stadium', city: 'Los Angeles, CA' },
    { id: 'cubs', name: 'Wrigley Field', city: 'Chicago, IL' },
    { id: 'giants', name: 'Oracle Park', city: 'San Francisco, CA' },
    { id: 'orioles', name: 'Camden Yards', city: 'Baltimore, MD' },
    { id: 'padres', name: 'Petco Park', city: 'San Diego, CA' },
    { id: 'rockies', name: 'Coors Field', city: 'Denver, CO' },
    { id: 'cardinals', name: 'Busch Stadium', city: 'St. Louis, MO' },
    { id: 'mariners', name: 'T-Mobile Park', city: 'Seattle, WA' },
    { id: 'braves', name: 'Truist Park', city: 'Atlanta, GA' },
    { id: 'astros', name: 'Minute Maid Park', city: 'Houston, TX' },
    { id: 'rangers', name: 'Globe Life Field', city: 'Arlington, TX' },
    { id: 'diamondbacks', name: 'Chase Field', city: 'Phoenix, AZ' },
    { id: 'reds', name: 'Great American Ball Park', city: 'Cincinnati, OH' },
    { id: 'pirates', name: 'PNC Park', city: 'Pittsburgh, PA' },
    { id: 'mets', name: 'Citi Field', city: 'New York, NY' },
    { id: 'nationals', name: 'Nationals Park', city: 'Washington, DC' },
    { id: 'twins', name: 'Target Field', city: 'Minneapolis, MN' },
    { id: 'guardians', name: 'Progressive Field', city: 'Cleveland, OH' },
    { id: 'phillies', name: 'Citizens Bank Park', city: 'Philadelphia, PA' },
    { id: 'white-sox', name: 'Guaranteed Rate Field', city: 'Chicago, IL' },
    { id: 'tigers', name: 'Comerica Park', city: 'Detroit, MI' },
    { id: 'royals', name: 'Kauffman Stadium', city: 'Kansas City, MO' },
    { id: 'brewers', name: 'American Family Field', city: 'Milwaukee, WI' },
    { id: 'blue-jays', name: 'Rogers Centre', city: 'Toronto, ON' },
    { id: 'angels', name: 'Angel Stadium', city: 'Anaheim, CA' },
    { id: 'marlins', name: 'loanDepot Park', city: 'Miami, FL' },
    { id: 'rays', name: 'Tropicana Field', city: 'St. Petersburg, FL' },
    { id: 'athletics', name: 'Oakland Coliseum', city: 'Oakland, CA' },
];
/**
 * Validate a single stadium and generate report
 */
function validateStadium(stadiumId, stadiumName, city) {
    const timestamp = new Date().toISOString();
    const issues = [];
    let data;
    try {
        data = (0, stadium_data_aggregator_1.getStadiumCompleteData)(stadiumId, 'MLB');
    }
    catch (error) {
        return {
            stadiumId,
            stadiumName,
            city,
            timestamp,
            overall: 'FAIL',
            sections: {
                count: 0,
                withRows: 0,
                totalRows: 0,
                rowCoverage: 0,
                meetsRequirement: false
            },
            obstructions: {
                count: 0,
                types: {},
                totalVertices: 0
            },
            issues: [{
                    severity: 'ERROR',
                    category: 'Data Loading',
                    message: `Failed to load stadium data: ${error instanceof Error ? error.message : String(error)}`
                }],
            summary: 'CRITICAL: Stadium data could not be loaded'
        };
    }
    const sections = data.sections || [];
    const obstructions = data.obstructions || [];
    // Validate sections
    const sectionsWithRows = sections.filter(s => s.rows && s.rows.length > 0);
    const totalRows = sectionsWithRows.reduce((sum, s) => sum + (s.rows?.length || 0), 0);
    const rowCoverage = sections.length > 0 ? (sectionsWithRows.length / sections.length) * 100 : 0;
    const meetsRequirement = sections.length >= 60;
    if (sections.length === 0) {
        issues.push({
            severity: 'ERROR',
            category: 'Sections',
            message: 'No sections defined for this stadium'
        });
    }
    else if (sections.length < 20) {
        issues.push({
            severity: 'WARNING',
            category: 'Sections',
            message: `Only ${sections.length} sections defined (minimum 20 recommended)`
        });
    }
    if (!meetsRequirement) {
        issues.push({
            severity: 'INFO',
            category: 'Sections',
            message: `Stadium has ${sections.length}/60 sections (row-level requirement not met)`
        });
    }
    // Validate section data integrity
    sections.forEach((section, idx) => {
        if (!section.id) {
            issues.push({
                severity: 'ERROR',
                category: 'Section Data',
                message: `Section ${idx}: Missing ID`
            });
        }
        if (!section.name) {
            issues.push({
                severity: 'ERROR',
                category: 'Section Data',
                message: `Section ${section.id || idx}: Missing name`
            });
        }
        if (!Array.isArray(section.vertices3D) || section.vertices3D.length !== 4) {
            issues.push({
                severity: 'ERROR',
                category: 'Section Geometry',
                message: `Section ${section.id}: Invalid vertices3D (must have exactly 4)`
            });
        }
        if (section.baseAngle < 0 || section.baseAngle >= 360) {
            issues.push({
                severity: 'ERROR',
                category: 'Section Geometry',
                message: `Section ${section.id}: Invalid baseAngle (${section.baseAngle})`
            });
        }
    });
    // Check for duplicate section IDs
    const sectionIds = sections.map(s => s.id);
    const duplicateIds = sectionIds.filter((id, idx) => sectionIds.indexOf(id) !== idx);
    if (duplicateIds.length > 0) {
        const uniqueDuplicates = Array.from(new Set(duplicateIds));
        issues.push({
            severity: 'ERROR',
            category: 'Section Data',
            message: `Duplicate section IDs: ${uniqueDuplicates.join(', ')}`
        });
    }
    // Validate row data
    sectionsWithRows.forEach(section => {
        section.rows?.forEach(row => {
            if (!row.rowNumber) {
                issues.push({
                    severity: 'ERROR',
                    category: 'Row Data',
                    message: `Section ${section.id}: Row missing rowNumber`
                });
            }
            if (typeof row.elevation !== 'number') {
                issues.push({
                    severity: 'ERROR',
                    category: 'Row Data',
                    message: `Section ${section.id}, row ${row.rowNumber}: Missing elevation`
                });
            }
        });
    });
    // Validate obstructions
    if (obstructions.length === 0) {
        issues.push({
            severity: 'WARNING',
            category: 'Obstructions',
            message: 'No obstructions defined (stadiums should have roof, scoreboards, etc.)'
        });
    }
    const obstructionTypes = {};
    let totalVertices = 0;
    obstructions.forEach(obs => {
        obstructionTypes[obs.type] = (obstructionTypes[obs.type] || 0) + 1;
        totalVertices += obs.geometry?.vertices?.length || 0;
        if (!obs.id || !obs.name || !obs.type) {
            issues.push({
                severity: 'ERROR',
                category: 'Obstruction Data',
                message: `Obstruction missing required fields (id, name, or type)`
            });
        }
        if (!obs.geometry || !obs.geometry.vertices || obs.geometry.vertices.length < 4) {
            issues.push({
                severity: 'ERROR',
                category: 'Obstruction Geometry',
                message: `Obstruction ${obs.id}: Invalid geometry (needs at least 4 vertices)`
            });
        }
        if (!obs.boundingBox) {
            issues.push({
                severity: 'ERROR',
                category: 'Obstruction Geometry',
                message: `Obstruction ${obs.id}: Missing bounding box`
            });
        }
    });
    // Determine overall status
    const hasErrors = issues.some(i => i.severity === 'ERROR');
    const hasWarnings = issues.some(i => i.severity === 'WARNING');
    let overall;
    let summary;
    if (hasErrors) {
        overall = 'FAIL';
        summary = `FAILED: ${issues.filter(i => i.severity === 'ERROR').length} critical error(s) found`;
    }
    else if (hasWarnings) {
        overall = 'PASS_WITH_WARNINGS';
        summary = `PASSED with ${issues.filter(i => i.severity === 'WARNING').length} warning(s)`;
    }
    else {
        overall = 'PASS';
        summary = 'PASSED: All validation checks successful';
    }
    return {
        stadiumId,
        stadiumName,
        city,
        timestamp,
        overall,
        sections: {
            count: sections.length,
            withRows: sectionsWithRows.length,
            totalRows,
            rowCoverage: parseFloat(rowCoverage.toFixed(1)),
            meetsRequirement
        },
        obstructions: {
            count: obstructions.length,
            types: obstructionTypes,
            totalVertices
        },
        issues,
        summary
    };
}
/**
 * Generate markdown report
 */
function generateMarkdownReport(report) {
    const statusEmoji = report.overall === 'PASS' ? '✅' : report.overall === 'PASS_WITH_WARNINGS' ? '⚠️' : '❌';
    let md = `# Validation Report: ${report.stadiumName}\n\n`;
    md += `**Stadium ID:** ${report.stadiumId}  \n`;
    md += `**Location:** ${report.city}  \n`;
    md += `**Generated:** ${new Date(report.timestamp).toLocaleString()}  \n`;
    md += `**Status:** ${statusEmoji} ${report.overall}\n\n`;
    md += `## Summary\n\n`;
    md += `${report.summary}\n\n`;
    md += `## Sections\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Total Sections | ${report.sections.count} |\n`;
    md += `| Sections with Rows | ${report.sections.withRows} |\n`;
    md += `| Total Rows | ${report.sections.totalRows} |\n`;
    md += `| Row Coverage | ${report.sections.rowCoverage}% |\n`;
    md += `| Meets 60+ Requirement | ${report.sections.meetsRequirement ? '✅ Yes' : '❌ No'} |\n\n`;
    md += `## Obstructions\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| Total Obstructions | ${report.obstructions.count} |\n`;
    md += `| Total Vertices | ${report.obstructions.totalVertices} |\n`;
    md += `| Types | ${Object.entries(report.obstructions.types).map(([k, v]) => `${k}: ${v}`).join(', ') || 'None'} |\n\n`;
    if (report.issues.length > 0) {
        md += `## Issues\n\n`;
        const errors = report.issues.filter(i => i.severity === 'ERROR');
        const warnings = report.issues.filter(i => i.severity === 'WARNING');
        const info = report.issues.filter(i => i.severity === 'INFO');
        if (errors.length > 0) {
            md += `### ❌ Errors (${errors.length})\n\n`;
            errors.forEach((issue, idx) => {
                md += `${idx + 1}. **[${issue.category}]** ${issue.message}\n`;
            });
            md += `\n`;
        }
        if (warnings.length > 0) {
            md += `### ⚠️ Warnings (${warnings.length})\n\n`;
            warnings.forEach((issue, idx) => {
                md += `${idx + 1}. **[${issue.category}]** ${issue.message}\n`;
            });
            md += `\n`;
        }
        if (info.length > 0) {
            md += `### ℹ️ Info (${info.length})\n\n`;
            info.forEach((issue, idx) => {
                md += `${idx + 1}. **[${issue.category}]** ${issue.message}\n`;
            });
            md += `\n`;
        }
    }
    else {
        md += `## Issues\n\n`;
        md += `✅ No issues found\n\n`;
    }
    md += `---\n\n`;
    md += `*Generated by MLB Stadium Data Validation System*\n`;
    return md;
}
/**
 * Main execution
 */
function main() {
    console.log('🏟️  MLB Stadium Data Validation Report Generator\n');
    console.log('='.repeat(60));
    const outputDir = path.join(__dirname, '../.zenflow/tasks/world-cup-v2-891f/validation-reports');
    // Create output directory
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(`✅ Created output directory: ${outputDir}\n`);
    }
    const allReports = [];
    // Generate reports for each stadium
    MLB_STADIUMS.forEach(({ id, name, city }, idx) => {
        console.log(`[${idx + 1}/${MLB_STADIUMS.length}] Validating ${name}...`);
        const report = validateStadium(id, name, city);
        allReports.push(report);
        const markdown = generateMarkdownReport(report);
        const filename = path.join(outputDir, `${id}.md`);
        fs.writeFileSync(filename, markdown, 'utf-8');
        const statusIcon = report.overall === 'PASS' ? '✅' : report.overall === 'PASS_WITH_WARNINGS' ? '⚠️' : '❌';
        console.log(`  ${statusIcon} ${report.overall}: ${report.sections.count} sections, ${report.obstructions.count} obstructions`);
    });
    console.log('\n' + '='.repeat(60));
    // Generate summary report
    const summaryReport = generateSummaryReport(allReports);
    const summaryFilename = path.join(outputDir, 'SUMMARY.md');
    fs.writeFileSync(summaryFilename, summaryReport, 'utf-8');
    console.log('\n📊 Summary Statistics:\n');
    const passed = allReports.filter(r => r.overall === 'PASS').length;
    const passedWithWarnings = allReports.filter(r => r.overall === 'PASS_WITH_WARNINGS').length;
    const failed = allReports.filter(r => r.overall === 'FAIL').length;
    console.log(`  ✅ Passed: ${passed}/30`);
    console.log(`  ⚠️  Passed with warnings: ${passedWithWarnings}/30`);
    console.log(`  ❌ Failed: ${failed}/30`);
    const totalSections = allReports.reduce((sum, r) => sum + r.sections.count, 0);
    const totalRows = allReports.reduce((sum, r) => sum + r.sections.totalRows, 0);
    const totalObstructions = allReports.reduce((sum, r) => sum + r.obstructions.count, 0);
    console.log(`\n  Total Sections: ${totalSections}`);
    console.log(`  Total Rows: ${totalRows}`);
    console.log(`  Total Obstructions: ${totalObstructions}`);
    console.log(`\n✅ Reports generated in: ${outputDir}`);
    console.log(`\n🎉 Validation complete!`);
}
/**
 * Generate summary report
 */
function generateSummaryReport(reports) {
    let md = `# MLB Stadium Data Validation Summary\n\n`;
    md += `**Generated:** ${new Date().toLocaleString()}  \n`;
    md += `**Total Stadiums:** 30\n\n`;
    const passed = reports.filter(r => r.overall === 'PASS').length;
    const passedWithWarnings = reports.filter(r => r.overall === 'PASS_WITH_WARNINGS').length;
    const failed = reports.filter(r => r.overall === 'FAIL').length;
    md += `## Overall Status\n\n`;
    md += `| Status | Count | Percentage |\n`;
    md += `|--------|-------|------------|\n`;
    md += `| ✅ Passed | ${passed} | ${((passed / 30) * 100).toFixed(1)}% |\n`;
    md += `| ⚠️ Passed with Warnings | ${passedWithWarnings} | ${((passedWithWarnings / 30) * 100).toFixed(1)}% |\n`;
    md += `| ❌ Failed | ${failed} | ${((failed / 30) * 100).toFixed(1)}% |\n\n`;
    md += `## Stadium Details\n\n`;
    md += `| Stadium | Status | Sections | Rows | Obstructions | Row Coverage |\n`;
    md += `|---------|--------|----------|------|--------------|-------------|\n`;
    reports.forEach(r => {
        const statusIcon = r.overall === 'PASS' ? '✅' : r.overall === 'PASS_WITH_WARNINGS' ? '⚠️' : '❌';
        md += `| [${r.stadiumName}](${r.stadiumId}.md) | ${statusIcon} | ${r.sections.count} | ${r.sections.totalRows} | ${r.obstructions.count} | ${r.sections.rowCoverage}% |\n`;
    });
    md += `\n## Aggregate Statistics\n\n`;
    const totalSections = reports.reduce((sum, r) => sum + r.sections.count, 0);
    const totalRows = reports.reduce((sum, r) => sum + r.sections.totalRows, 0);
    const totalObstructions = reports.reduce((sum, r) => sum + r.obstructions.count, 0);
    const stadiumsWith60Plus = reports.filter(r => r.sections.meetsRequirement).length;
    md += `- **Total Sections:** ${totalSections}\n`;
    md += `- **Total Rows:** ${totalRows}\n`;
    md += `- **Total Obstructions:** ${totalObstructions}\n`;
    md += `- **Stadiums with 60+ sections:** ${stadiumsWith60Plus}/30\n`;
    md += `- **Average sections per stadium:** ${(totalSections / 30).toFixed(1)}\n`;
    md += `- **Average rows per stadium:** ${(totalRows / 30).toFixed(1)}\n\n`;
    md += `---\n\n`;
    md += `*Individual reports available in this directory*\n`;
    return md;
}
// Run if executed directly
if (require.main === module) {
    main();
}
