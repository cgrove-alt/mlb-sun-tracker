#!/usr/bin/env node

/** Extract regulation-diamond controls from a Ticketmaster seat-map SVG. */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const analysisVersion = 'ticketmaster-regulation-field-controls-v2';
for (const name of ['acquisition', 'output']) {
  if (typeof args[name] !== 'string') throw new Error(`Required: --${name}=PATH`);
}
const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const manifestBytes = await readFile(args.acquisition);
const acquisition = JSON.parse(manifestBytes.toString('utf8'));
if (acquisition.artifactKind !== 'ticketmaster-seat-map-svg-acquisition') {
  throw new Error('Input is not a Ticketmaster SVG acquisition');
}
const svgBytes = await readFile(acquisition.output);
if (sha256(svgBytes) !== acquisition.sha256) {
  throw new Error('Ticketmaster SVG hash does not match its acquisition');
}
const svg = svgBytes.toString('utf8');

const groupStartMatch = /<g\b[^>]*\bid="FIELD"[^>]*>/i.exec(svg);
let fieldMarkup = svg;
if (groupStartMatch) {
  const groupStart = groupStartMatch.index;
  const groupTokens = /<g\b[^>]*>|<\/g>/gi;
  groupTokens.lastIndex = groupStart;
  let depth = 0;
  let groupEnd = -1;
  for (let token = groupTokens.exec(svg); token; token = groupTokens.exec(svg)) {
    if (/^<\/g/i.test(token[0])) depth -= 1;
    else depth += 1;
    if (depth === 0) {
      groupEnd = groupTokens.lastIndex;
      break;
    }
  }
  if (groupEnd < 0) throw new Error('Ticketmaster FIELD group is not balanced');
  fieldMarkup = svg.slice(groupStart, groupEnd);
}
const pathTags = Array.from(fieldMarkup.matchAll(/<path\b[^>]*>/gi)).map((match) => match[0]);
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1] ?? null;
const pathRecords = pathTags.map((tag) => ({
  id: attribute(tag, 'id'),
  fill: attribute(tag, 'fill'),
  d: attribute(tag, 'd'),
})).filter((path) => path.d);
const rectFeatures = Array.from(fieldMarkup.matchAll(/<rect\b[^>]*>/gi)).map((match) => {
  const tag = match[0];
  const id = attribute(tag, 'id');
  const x = Number(attribute(tag, 'x'));
  const y = Number(attribute(tag, 'y'));
  const width = Number(attribute(tag, 'width'));
  const height = Number(attribute(tag, 'height'));
  if (![x, y, width, height].every(Number.isFinite)) return null;
  let points = [
    [x, y],
    [x + width, y],
    [x + width, y + height],
    [x, y + height],
  ];
  const rotation = attribute(tag, 'transform')?.match(
    /rotate\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/i,
  );
  if (rotation) {
    const angle = Number(rotation[1]) * Math.PI / 180;
    const originX = Number(rotation[2]);
    const originY = Number(rotation[3]);
    const cosine = Math.cos(angle);
    const sine = Math.sin(angle);
    points = points.map((point) => {
      const deltaX = point[0] - originX;
      const deltaY = point[1] - originY;
      return [
        originX + deltaX * cosine - deltaY * sine,
        originY + deltaX * sine + deltaY * cosine,
      ];
    });
  }
  const xValues = points.map((point) => point[0]);
  const yValues = points.map((point) => point[1]);
  const minimumX = Math.min(...xValues);
  const maximumX = Math.max(...xValues);
  const minimumY = Math.min(...yValues);
  const maximumY = Math.max(...yValues);
  return {
    pathId: id,
    fill: attribute(tag, 'fill'),
    points,
    centre: [(minimumX + maximumX) / 2, (minimumY + maximumY) / 2],
    bounds: {
      minimumX,
      maximumX,
      minimumY,
      maximumY,
      width: maximumX - minimumX,
      height: maximumY - minimumY,
    },
  };
}).filter(Boolean);

const polygonSubpaths = [];
for (const path of pathRecords) {
  for (const subpath of path.d.split(/(?=M)/).filter(Boolean)) {
    if (/[CQA]/i.test(subpath) || !/[zZ]\s*$/.test(subpath)) continue;
    const points = Array.from(subpath.matchAll(/[ML]\s*(-?\d+(?:\.\d+)?)\s*,?\s*(-?\d+(?:\.\d+)?)/gi))
      .map((match) => [Number(match[1]), Number(match[2])]);
    if (points.length < 4 || points.length > 8) continue;
    const xValues = points.map((point) => point[0]);
    const yValues = points.map((point) => point[1]);
    const minimumX = Math.min(...xValues);
    const maximumX = Math.max(...xValues);
    const minimumY = Math.min(...yValues);
    const maximumY = Math.max(...yValues);
    const width = maximumX - minimumX;
    const height = maximumY - minimumY;
    const aspect = width / height;
    if (width < 8 || width > 80 || height < 8 || height > 80 || aspect < 0.5 || aspect > 2) {
      continue;
    }
    polygonSubpaths.push({
      pathId: path.id,
      fill: path.fill,
      points,
      centre: [(minimumX + maximumX) / 2, (minimumY + maximumY) / 2],
      bounds: { minimumX, maximumX, minimumY, maximumY, width, height },
    });
  }
}

const regulationHomeToSecondFeet = 90 * Math.sqrt(2);
const pathFeature = (path) => {
  const values = Array.from(path.d.matchAll(/-?\d+(?:\.\d+)?/g)).map((match) => Number(match[0]));
  const points = [];
  for (let index = 0; index + 1 < values.length; index += 2) {
    points.push([values[index], values[index + 1]]);
  }
  const xValues = points.map((point) => point[0]);
  const yValues = points.map((point) => point[1]);
  const minimumX = Math.min(...xValues);
  const maximumX = Math.max(...xValues);
  const minimumY = Math.min(...yValues);
  const maximumY = Math.max(...yValues);
  return {
    pathId: path.id,
    fill: path.fill,
    points,
    centre: [(minimumX + maximumX) / 2, (minimumY + maximumY) / 2],
    bounds: {
      minimumX,
      maximumX,
      minimumY,
      maximumY,
      width: maximumX - minimumX,
      height: maximumY - minimumY,
    },
  };
};
const normalizedId = (path) => (path.id ?? path.pathId ?? '').trim().toUpperCase();
const semanticMoundPath = pathRecords.find((path) =>
  ['PITCHER MOUND', 'MOUND'].includes(normalizedId(path)));
const semanticMound = semanticMoundPath ? pathFeature(semanticMoundPath) : null;
const explicitSemanticHomePaths = pathRecords.filter((path) => {
  const id = normalizedId(path);
  return ['HOME PLATE', 'HOME_BASE'].includes(id);
});
const semanticHomePaths = explicitSemanticHomePaths.length > 0
  ? explicitSemanticHomePaths
  : pathRecords.filter((path) => normalizedId(path) === 'PLATE');
const semanticHome = semanticMound && semanticHomePaths.length > 0
  ? semanticHomePaths.map(pathFeature).sort((left, right) =>
    Math.hypot(
      right.centre[0] - semanticMound.centre[0],
      right.centre[1] - semanticMound.centre[1],
    ) - Math.hypot(
      left.centre[0] - semanticMound.centre[0],
      left.centre[1] - semanticMound.centre[1],
    ))[0]
  : null;
const semanticBaseFeatures = [...pathRecords.map(pathFeature), ...rectFeatures].filter((feature) => {
  const id = normalizedId(feature);
  return id.includes('BASE') && !id.includes('HOME') && !id.includes('BASEBALL');
});
let semanticSecond = semanticBaseFeatures.find((feature) =>
  /(^|[^A-Z0-9])(2ND|SECOND)|ND_BASE/.test(normalizedId(feature))) ?? null;
if (!semanticSecond && semanticHome && semanticMound && semanticBaseFeatures.length >= 3) {
  const homeToMound = [
    semanticMound.centre[0] - semanticHome.centre[0],
    semanticMound.centre[1] - semanticHome.centre[1],
  ];
  const length = Math.hypot(...homeToMound);
  const unit = homeToMound.map((value) => value / length);
  semanticSecond = semanticBaseFeatures.map((feature) => {
    const fromHome = [
      feature.centre[0] - semanticHome.centre[0],
      feature.centre[1] - semanticHome.centre[1],
    ];
    return {
      feature,
      along: fromHome[0] * unit[0] + fromHome[1] * unit[1],
      perpendicular: Math.abs(fromHome[0] * unit[1] - fromHome[1] * unit[0]),
    };
  }).filter((candidate) => candidate.along > length)
    .sort((left, right) => left.perpendicular - right.perpendicular)[0]?.feature ?? null;
}
const pairCandidates = [];
for (let leftIndex = 0; leftIndex < polygonSubpaths.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < polygonSubpaths.length; rightIndex += 1) {
    const left = polygonSubpaths[leftIndex];
    const right = polygonSubpaths[rightIndex];
    const deltaX = right.centre[0] - left.centre[0];
    const deltaY = right.centre[1] - left.centre[1];
    const distance = Math.hypot(deltaX, deltaY);
    const scale = distance / regulationHomeToSecondFeet;
    if (Math.abs(deltaX) > 40 || scale < 5 || scale > 15) continue;
    const home = left.centre[1] > right.centre[1] ? left : right;
    const second = home === left ? right : left;
    pairCandidates.push({
      home,
      second,
      distance,
      scale,
      axisOffsetPixels: Math.abs(deltaX),
    });
  }
}
pairCandidates.sort((left, right) =>
  left.axisOffsetPixels - right.axisOffsetPixels
  || Math.abs(left.scale - 8) - Math.abs(right.scale - 8));
const semanticFieldPair = semanticHome && semanticSecond ? {
  home: semanticHome,
  second: semanticSecond,
  distance: Math.hypot(
    semanticSecond.centre[0] - semanticHome.centre[0],
    semanticSecond.centre[1] - semanticHome.centre[1],
  ),
  scale: Math.hypot(
    semanticSecond.centre[0] - semanticHome.centre[0],
    semanticSecond.centre[1] - semanticHome.centre[1],
  ) / regulationHomeToSecondFeet,
  axisOffsetPixels: null,
} : null;
const fieldPair = semanticFieldPair ?? pairCandidates[0];
if (!fieldPair) throw new Error('Could not identify aligned home-plate and second-base controls');
const homeControlPoint = fieldPair.home.points.reduce((selected, point) => {
  const selectedDistance = Math.hypot(
    selected[0] - fieldPair.second.centre[0],
    selected[1] - fieldPair.second.centre[1],
  );
  const pointDistance = Math.hypot(
    point[0] - fieldPair.second.centre[0],
    point[1] - fieldPair.second.centre[1],
  );
  return pointDistance > selectedDistance ? point : selected;
});
const axisVector = [
  fieldPair.second.centre[0] - homeControlPoint[0],
  fieldPair.second.centre[1] - homeControlPoint[1],
];
const axisLength = Math.hypot(...axisVector);
const axisUnit = axisVector.map((value) => value / axisLength);
const providerPixelsPerFoot = axisLength / regulationHomeToSecondFeet;

const curvedPathCandidates = pathRecords.filter((path) => /C/i.test(path.d)).map(pathFeature)
  .filter((path) =>
  path.bounds.width >= 80 && path.bounds.width <= 260
  && path.bounds.height >= 80 && path.bounds.height <= 260);
const evaluateMound = (path) => {
  const fromHome = [
    path.centre[0] - homeControlPoint[0],
    path.centre[1] - homeControlPoint[1],
  ];
  const alongAxisPixels = fromHome[0] * axisUnit[0] + fromHome[1] * axisUnit[1];
  const perpendicularPixels = Math.abs(fromHome[0] * axisUnit[1] - fromHome[1] * axisUnit[0]);
  const distanceFeet = alongAxisPixels / providerPixelsPerFoot;
  return {
    ...path,
    alongAxisPixels,
    perpendicularPixels,
    distanceFeet,
    regulationResidualFeet: Math.abs(distanceFeet - 60.5),
  };
};
const moundCandidates = curvedPathCandidates.map(evaluateMound).filter((path) =>
  path.alongAxisPixels > 0
  && path.alongAxisPixels < axisLength
  && path.perpendicularPixels <= 60
  && path.distanceFeet >= 45
  && path.distanceFeet <= 75)
  .sort((left, right) => left.regulationResidualFeet - right.regulationResidualFeet);
const evaluatedSemanticMound = semanticMound ? evaluateMound(semanticMound) : null;
const mound = evaluatedSemanticMound
  && evaluatedSemanticMound.alongAxisPixels > 0
  && evaluatedSemanticMound.alongAxisPixels < axisLength
  && evaluatedSemanticMound.perpendicularPixels <= 60
  && evaluatedSemanticMound.distanceFeet >= 45
  && evaluatedSemanticMound.distanceFeet <= 75
  ? evaluatedSemanticMound
  : moundCandidates[0];
if (!mound) throw new Error('Could not identify a mound control on the field axis');
const moundValidationPassed = mound.regulationResidualFeet <= 3;
if (!moundValidationPassed) {
  throw new Error(`Mound regulation residual is ${mound.regulationResidualFeet.toFixed(3)} ft`);
}

const controls = {
  homePlateProviderPixels: homeControlPoint,
  secondBaseProviderPixels: fieldPair.second.centre,
  moundCentreProviderPixels: mound.centre,
  homeToSecondProviderPixels: axisLength,
  regulationHomeToSecondFeet,
  providerPixelsPerFoot,
  providerFieldAxisUnitVector: axisUnit,
  providerFieldAxisAngleDegrees: Math.atan2(axisUnit[1], axisUnit[0]) * 180 / Math.PI,
  moundDistanceFeetFromDerivedScale: mound.distanceFeet,
  regulationMoundDistanceFeet: 60.5,
  moundDistanceResidualFeet: mound.regulationResidualFeet,
  moundPerpendicularResidualPixels: mound.perpendicularPixels,
};
const stable = {
  analysisVersion,
  stadiumId: acquisition.stadiumId,
  svgAcquisitionArtifactVersion: acquisition.artifactVersion,
  svgSha256: acquisition.sha256,
  controls,
  selectedSubpaths: {
    homePlate: { ...fieldPair.home, selectedControlPoint: homeControlPoint },
    secondBase: fieldPair.second,
    mound,
  },
  controlSelection: semanticFieldPair
    ? 'provider-semantic-element-ids'
    : 'field-group-small-polygon-topology',
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'ticketmaster-regulation-field-control-candidate',
  analysisVersion,
  artifactVersion: `sha256:${sha256(JSON.stringify(stable))}`,
  extractedOn: new Date().toISOString(),
  inputs: {
    acquisition: {
      path: resolve(args.acquisition),
      sha256: sha256(manifestBytes),
      artifactVersion: acquisition.artifactVersion,
    },
    svg: {
      path: resolve(acquisition.output),
      sha256: acquisition.sha256,
    },
    ...(acquisition.geometryAcquisition?.path
      && acquisition.geometryAcquisition?.sha256
      ? {
        geometryAcquisition: {
          path: resolve(acquisition.geometryAcquisition.path),
          sha256: acquisition.geometryAcquisition.sha256,
          artifactVersion: acquisition.geometryAcquisition.artifactVersion,
        },
      }
      : {}),
  },
  source: {
    acquisitionPath: args.acquisition,
    acquisitionSha256: sha256(manifestBytes),
    svgAcquisitionArtifactVersion: acquisition.artifactVersion,
    svgSha256: acquisition.sha256,
    coordinateFrame: acquisition.coordinateFrame,
  },
  stadiumId: acquisition.stadiumId,
  controls,
  selectedSubpaths: stable.selectedSubpaths,
  controlSelection: stable.controlSelection,
  validation: {
    controlSelection: stable.controlSelection,
    semanticControlIds: semanticFieldPair ? {
      homePlate: semanticHome.pathId,
      secondBase: semanticSecond.pathId,
      mound: semanticMound?.pathId ?? null,
    } : null,
    regulationMoundCheckPassed: moundValidationPassed,
    regulationMoundCheckWithinOneFoot: mound.regulationResidualFeet <= 1,
    maximumMoundResidualFeet: 3,
    candidateSmallClosedFieldPolygons: polygonSubpaths.length,
    candidateAlignedBasePairs: pairCandidates.length,
    candidateCurvedMoundShapes: moundCandidates.length,
  },
  geometryBoundary: {
    establishesProviderMapScale: true,
    establishesProviderFieldAxis: true,
    establishesSurveyedWorldCoordinates: false,
    establishesRowElevations: false,
    note: 'The regulation diamond is a scale and axis control inside the provider plan. It is not a survey control, world registration, or row-elevation measurement.',
  },
  publication: {
    eligible: false,
    blockers: [
      'PROVIDER_PLAN_NOT_REGISTERED_TO_SURVEYED_WORLD_CONTROL',
      'ROW_ELEVATIONS_NOT_MEASURED',
      'OBSTRUCTION_GEOMETRY_NOT_INCLUDED',
      'SOURCE_CURRENCY_NOT_VERIFIED',
      'SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
await mkdir(dirname(args.output), { recursive: true });
await writeFile(args.output, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath: args.output,
  artifactVersion: artifact.artifactVersion,
  stadiumId: artifact.stadiumId,
  controls,
  validation: artifact.validation,
  publication: artifact.publication,
}, null, 2));
