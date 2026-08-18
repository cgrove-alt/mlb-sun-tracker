#!/usr/bin/env node

/**
 * Render the club-linked 2025 Rockies map with Sections 207 and 307 marked.
 *
 * This is a semantic tier-identity review. The viewer diagram is schematic and
 * must not be used as surveyed plan or vertical geometry.
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import JSON5 from 'json5';
import sharp from 'sharp';

function argument(name, fallback) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function artifactVersion(value) {
  return `sha256:${sha256(JSON.stringify(value))}`;
}

function sourceRecord(manifest, sourcePath) {
  const records = manifest.sources.filter((record) => record.sourcePath === sourcePath);
  if (records.length !== 1) throw new Error(`Expected one ${sourcePath} source record`);
  return records[0];
}

async function readLockedSource(manifest, sourcePath) {
  const record = sourceRecord(manifest, sourcePath);
  const bytes = await readFile(record.localPath);
  if (sha256(bytes) !== record.sha256) throw new Error(`${sourcePath} checksum mismatch`);
  return { record, bytes };
}

function relativeMovePathBounds(pathData) {
  const commands = pathData.match(/[A-Za-z]/g) ?? [];
  if (commands.length !== 2 || commands[0] !== 'm' || commands[1].toLowerCase() !== 'z') {
    throw new Error(`Unsupported non-polygon path syntax: ${pathData}`);
  }
  const values = Array.from(pathData.matchAll(/-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?/gi))
    .map((match) => Number(match[0]));
  if (values.length < 6 || values.length % 2 !== 0 || values.some((value) => !Number.isFinite(value))) {
    throw new Error(`Invalid polygon coordinate sequence: ${pathData}`);
  }
  let x = values[0];
  let y = values[1];
  const points = [[x, y]];
  for (let index = 2; index < values.length; index += 2) {
    x += values[index];
    y += values[index + 1];
    points.push([x, y]);
  }
  return {
    minimumX: Math.min(...points.map((point) => point[0])),
    maximumX: Math.max(...points.map((point) => point[0])),
    minimumY: Math.min(...points.map((point) => point[1])),
    maximumY: Math.max(...points.map((point) => point[1])),
    pointCount: points.length,
  };
}

function extractMapSize(mainSource) {
  const seatsPageEnd = mainSource.indexOf('name: "Suites & Party Facilities"');
  if (seatsPageEnd < 0) throw new Error('Unable to isolate the seats-page map settings');
  const seatsPage = mainSource.slice(0, seatsPageEnd);
  const value = (name) => {
    const matches = Array.from(seatsPage.matchAll(new RegExp(`${name}:\\s*([0-9.]+)`, 'g')));
    if (!matches.length) throw new Error(`Expected at least one seats-page ${name} value`);
    return Number(matches.at(-1)[1]);
  };
  return {
    diagramWidth: value('diagramWidth'),
    diagramHeight: value('diagramHeight'),
    viewerOffsetX: value('viewerOffsetX'),
    viewerOffsetY: value('viewerOffsetY'),
    viewerWidth: value('viewerWidth'),
    viewerHeight: value('viewerHeight'),
  };
}

const sourceManifestPath = path.resolve(argument(
  'source-manifest',
  'tmp/lidar/rockies-current-official-seat-viewer-sources-v4/manifest.json',
));
const outputDirectory = path.resolve(argument(
  'output',
  'tmp/lidar/rockies-current-official-map-tier-identity-review-v1',
));

const manifestBytes = await readFile(sourceManifestPath);
const manifest = JSON.parse(manifestBytes.toString('utf8'));
if (manifest.artifactKind !== 'club-linked-viewer-source-research-input') {
  throw new Error('Source manifest has the wrong artifact kind');
}
const mapSource = await readLockedSource(manifest, 'venue/rockies/images/map-bg.png');
const seatsSource = await readLockedSource(manifest, 'venue/rockies/map/seats.json');
const mainSource = await readLockedSource(manifest, 'venue/rockies/js/main.js');
const mapMetadata = await sharp(mapSource.bytes).metadata();
if (!mapMetadata.width || !mapMetadata.height) throw new Error('Map image has no dimensions');
const seats = JSON5.parse(seatsSource.bytes.toString('utf8'));
const mapSize = extractMapSize(mainSource.bytes.toString('utf8'));

const sections = {};
for (const sectionId of ['207', '307']) {
  const section = seats.sections?.[sectionId];
  if (!section || section.subsections?.length !== 1) {
    throw new Error(`Section ${sectionId} does not have exactly one mapped subsection`);
  }
  const subsection = seats.subsections?.[section.subsections[0]];
  if (!subsection || String(subsection.section) !== sectionId || typeof subsection.path !== 'string') {
    throw new Error(`Section ${sectionId} subsection metadata is incomplete`);
  }
  sections[sectionId] = {
    subsectionId: subsection.id,
    title: subsection.section_title,
    path: subsection.path,
    mapCoordinateBounds: relativeMovePathBounds(subsection.path),
  };
}

const xScale = mapMetadata.width / mapSize.viewerWidth;
const yScale = mapMetadata.height / mapSize.viewerHeight;
const overlaySvg = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${mapMetadata.width}" height="${mapMetadata.height}" viewBox="0 0 ${mapMetadata.width} ${mapMetadata.height}">
  <g transform="scale(${xScale} ${yScale})">
    <g transform="translate(${-mapSize.viewerOffsetX} ${-mapSize.viewerOffsetY})">
      <path d="${sections['207'].path}" fill="#ff2d55" fill-opacity="0.62" stroke="#ffffff" stroke-width="1.2"/>
      <path d="${sections['307'].path}" fill="#00a8ff" fill-opacity="0.62" stroke="#ffffff" stroke-width="1.2"/>
    </g>
  </g>
  <rect x="12" y="12" width="310" height="76" rx="8" fill="#ffffff" fill-opacity="0.94" stroke="#111111"/>
  <rect x="26" y="28" width="22" height="16" fill="#ff2d55"/><text x="58" y="42" font-family="Arial, sans-serif" font-size="18" fill="#111111">Section 207, Rightfield Mezzanine</text>
  <rect x="26" y="56" width="22" height="16" fill="#00a8ff"/><text x="58" y="70" font-family="Arial, sans-serif" font-size="18" fill="#111111">Section 307, Lower Rightfield Reserved</text>
</svg>`);

await mkdir(outputDirectory, { recursive: true });
const outputImagePath = path.join(outputDirectory, 'sections-207-307-official-map-review.png');
const outputBytes = await sharp(mapSource.bytes)
  .composite([{ input: overlaySvg, top: 0, left: 0 }])
  .png()
  .toBuffer();
await writeFile(outputImagePath, outputBytes);

const mapBoundsToPixels = (bounds) => ({
  minimumX: (bounds.minimumX - mapSize.viewerOffsetX) * xScale,
  maximumX: (bounds.maximumX - mapSize.viewerOffsetX) * xScale,
  minimumY: (bounds.minimumY - mapSize.viewerOffsetY) * yScale,
  maximumY: (bounds.maximumY - mapSize.viewerOffsetY) * yScale,
});
const stable = {
  analysisVersion: 'rockies-official-map-tier-identity-review-v1',
  inputs: {
    sourceManifest: {
      path: sourceManifestPath,
      sha256: sha256(manifestBytes),
      artifactVersion: manifest.artifactVersion,
    },
    mapImage: mapSource.record,
    seatsMap: seatsSource.record,
    viewerMainSource: mainSource.record,
  },
  stadiumId: 'rockies',
  sourceCurrency: {
    mapImageLastModified: mapSource.record.lastModified,
    seatsMapLastModified: seatsSource.record.lastModified,
    viewerSourceLastModified: mainSource.record.lastModified,
  },
  viewerCoordinateTransform: {
    ...mapSize,
    naturalImageWidth: mapMetadata.width,
    naturalImageHeight: mapMetadata.height,
    xScale,
    yScale,
  },
  sections: Object.fromEntries(Object.entries(sections).map(([sectionId, section]) => [
    sectionId,
    {
      ...section,
      naturalImagePixelBounds: mapBoundsToPixels(section.mapCoordinateBounds),
    },
  ])),
  semanticFinding: {
    section207And307AreDistinctMappedTiers: true,
    section207Title: sections['207'].title,
    section307Title: sections['307'].title,
    note: 'The club-linked viewer labels separate adjacent tier polygons. The diagram does not encode their true plan overlap, elevation, or structural relationship.',
  },
  output: {
    path: outputImagePath,
    sha256: sha256(outputBytes),
    width: mapMetadata.width,
    height: mapMetadata.height,
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'rockies-official-map-tier-identity-review',
  artifactVersion: artifactVersion(stable),
  ...stable,
  geometryBoundary: {
    establishesCurrentClubLinkedTierLabels: true,
    establishesDistinctDiagramPolygonsForSections207And307: true,
    establishesSurveyedPlanGeometry: false,
    establishesVerticalGeometry: false,
    establishesCantileverOrOverhangExtent: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'OFFICIAL_VIEWER_MAP_IS_SCHEMATIC_NOT_SURVEYED',
      'TRUE_TIER_PLAN_OVERLAP_NOT_ENCODED',
      'VERTICAL_GEOMETRY_NOT_ENCODED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const outputManifestPath = path.join(outputDirectory, 'manifest.json');
await writeFile(outputManifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({
  outputManifestPath,
  artifactVersion: artifact.artifactVersion,
  outputImagePath,
  section207And307AreDistinctMappedTiers: true,
  publicationEligible: false,
}, null, 2)}\n`);
