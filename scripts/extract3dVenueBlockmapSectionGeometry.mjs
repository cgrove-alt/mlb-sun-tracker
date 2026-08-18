#!/usr/bin/env node

/** Extract checksum-locked section footprints from a captured block-map SVG. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const svgPath = typeof args.svg === 'string' ? args.svg : null;
const metricRowsPath = typeof args['metric-rows'] === 'string' ? args['metric-rows'] : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!svgPath || !metricRowsPath || !outputPath) {
  throw new Error('Required: --svg=PATH --metric-rows=PATH --output=PATH');
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const svgBytes = await readFile(svgPath);
const svgMarkup = svgBytes.toString('utf8');
const metricRowsBytes = await readFile(metricRowsPath);
const metricRows = JSON.parse(metricRowsBytes.toString('utf8'));
if (metricRows?.artifactKind !== 'venue-local-metric-row-anchors') {
  throw new Error('Metric rows input is not a venue-local-metric-row-anchors artifact');
}
const requestedSectionIds = Array.from(new Set(metricRows.rows.map((row) => row.sectionId)))
  .sort((left, right) => left.localeCompare(right));

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
try {
  const result = await page.evaluate(({ markup, sectionIds }) => {
    const host = document.createElement('div');
    host.style.position = 'fixed';
    host.style.left = '-100000px';
    host.style.top = '-100000px';
    host.innerHTML = markup;
    document.body.appendChild(host);
    const svg = host.querySelector('svg');
    if (!(svg instanceof SVGSVGElement)) throw new Error('SVG did not parse');
    const viewBox = svg.viewBox.baseVal;
    const polygonCentroid = (points) => {
      let twiceArea = 0;
      let weightedX = 0;
      let weightedY = 0;
      for (let index = 0; index < points.length - 1; index += 1) {
        const left = points[index];
        const right = points[index + 1];
        const cross = left[0] * right[1] - right[0] * left[1];
        twiceArea += cross;
        weightedX += (left[0] + right[0]) * cross;
        weightedY += (left[1] + right[1]) * cross;
      }
      if (Math.abs(twiceArea) < 1e-9) {
        const mean = points.slice(0, -1).reduce(
          (sum, point) => [sum[0] + point[0], sum[1] + point[1]],
          [0, 0],
        );
        return [mean[0] / (points.length - 1), mean[1] / (points.length - 1)];
      }
      return [weightedX / (3 * twiceArea), weightedY / (3 * twiceArea)];
    };
    const sections = sectionIds.map((sectionId) => {
      const element = svg.getElementById(`S_${sectionId}`);
      if (!(element instanceof SVGGeometryElement)) {
        return { sectionId, found: false };
      }
      const bounds = element.getBBox();
      const pathLength = element.getTotalLength();
      const sampleCount = 512;
      const sampledBoundary = Array.from({ length: sampleCount + 1 }, (_, index) => {
        const point = element.getPointAtLength(pathLength * index / sampleCount);
        return [point.x, point.y];
      });
      const pathData = element.getAttribute('d') ?? '';
      return {
        sectionId,
        found: true,
        tagName: element.tagName,
        dataType: element.getAttribute('data-type'),
        bounds: [bounds.x, bounds.y, bounds.width, bounds.height],
        pathLength,
        pathData,
        centroid: polygonCentroid(sampledBoundary),
        sampledBoundary,
      };
    });
    host.remove();
    return {
      viewBox: [viewBox.x, viewBox.y, viewBox.width, viewBox.height],
      sections,
    };
  }, { markup: svgMarkup, sectionIds: requestedSectionIds });

  const sections = result.sections.map((section) => {
    const pathData = section.pathData ?? null;
    const { pathData: omitted, ...record } = section;
    return {
      ...record,
      pathDataSha256: pathData ? sha256(pathData) : null,
    };
  });
  const stable = {
    inputs: {
      svg: {
        path: svgPath,
        byteLength: svgBytes.length,
        sha256: sha256(svgBytes),
      },
      metricRows: {
        path: metricRowsPath,
        sha256: sha256(metricRowsBytes),
        artifactVersion: metricRows.artifactVersion,
      },
    },
    svg: {
      path: svgPath,
      byteLength: svgBytes.length,
      sha256: sha256(svgBytes),
    },
    metricRows: {
      path: metricRowsPath,
      sha256: sha256(metricRowsBytes),
      artifactVersion: metricRows.artifactVersion,
    },
    stadiumId: metricRows.stadiumId,
    venueId: metricRows.venueId,
    coordinateSystem: {
      kind: 'provider-blockmap-svg',
      viewBox: result.viewBox,
      sampledPointsPerClosedBoundary: 513,
    },
    completeness: {
      requestedSections: requestedSectionIds.length,
      extractedSections: sections.filter((section) => section.found).length,
      missingSections: sections.filter((section) => !section.found)
        .map((section) => section.sectionId),
    },
    sections,
  };
  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-blockmap-section-geometry',
    artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
    ...stable,
    publication: {
      eligible: false,
      blockers: [
        'PROVIDER_BLOCKMAP_IS_NOT_SURVEY_CONTROL',
        'PROVIDER_ORIGIN_NOT_INDEPENDENTLY_VALIDATED',
        'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
      ],
    },
  };
  await mkdir(dirname(resolve(outputPath)), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`);
  console.log(JSON.stringify({
    output: resolve(outputPath),
    artifactVersion: artifact.artifactVersion,
    completeness: artifact.completeness,
  }, null, 2));
} finally {
  await browser.close();
}
