#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback = null) {
  const prefix = `--${name}=`;
  return process.argv.find((value) => value.startsWith(prefix))?.slice(prefix.length)
    ?? fallback;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function canonicalJson(value) {
  if (Array.isArray(value)) return value.map(canonicalJson);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value).sort().map((key) => [key, canonicalJson(value[key])]),
    );
  }
  return value;
}

function requireEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`);
  }
}

function requireText(haystack, needle, sourceLabel) {
  if (!haystack.includes(needle)) {
    throw new Error(`Required text not found in ${sourceLabel}: ${needle}`);
  }
}

async function loadJson(filePath) {
  const bytes = await readFile(filePath);
  return { bytes, value: JSON.parse(bytes.toString('utf8')) };
}

const acquisitionPath = path.resolve(option(
  'acquisition',
  'tmp/lidar/marlins-intelibuild-archive-sources-2026/manifest.json',
));
const outputPath = path.resolve(option(
  'output',
  'tmp/lidar/marlins-intelibuild-archive-source-review-2026.json',
));

const acquisitionInput = await loadJson(acquisitionPath);
const acquisition = acquisitionInput.value;
requireEqual(
  acquisition.artifactKind,
  'marlins-intelibuild-archive-source-acquisition',
  'InteliBuild acquisition artifact kind',
);
requireEqual(
  acquisition.analysisVersion,
  'marlins-intelibuild-archive-source-acquisition-v1',
  'InteliBuild acquisition analysis version',
);

const sourcesByKey = Object.fromEntries(acquisition.sources.map((source) => [source.key, source]));
const sourceText = {};
for (const [key, source] of Object.entries(sourcesByKey)) {
  const bytes = await readFile(path.resolve(source.localPath));
  requireEqual(bytes.length, source.byteLength, `${key} byte length`);
  requireEqual(sha256(bytes), source.sha256, `${key} checksum`);
  sourceText[key] = bytes.toString('utf8');
}

const projectPage = sourceText['archived-intelibuild-miami-ballpark-project'];
const northAmericaAwardPage = sourceText['archived-intelibuild-north-america-award-news'];
const globalFinalistPage = sourceText['archived-intelibuild-global-award-finalist-news'];
const teklaGlobalPage = sourceText['archived-tekla-global-award-marlins-page'];

for (const [needle, label] of [
  ['Completion: 2011', 'completion year'],
  ['Owner: Miami-Dade County', 'owner'],
  ['Architectural Firm: Populous', 'architect'],
  ['Engineering Firm: Walter P Moore', 'engineer'],
  ['Construction Manager: Hunt/Moss', 'construction manager'],
  ['Design-assist', 'design-assist service'],
  ['Drawings by InteliBuild', 'drawing service'],
  ['Fabrication', 'fabrication service'],
  ['Erection', 'erection service'],
  ['Project management', 'project-management service'],
  ['This contract includes design-assist, detailing, BIM and project management services, the fabrication and erection of steel components and the installation of the opening mechanism for the retractable roof.', 'contract scope'],
  ['3D model of the Marlins Stadium', '3D-model image label'],
]) requireText(projectPage, needle, `archived project page ${label}`);

for (const [needle, label] of [
  ['InteliBuild produced the', 'model producer'],
  ['central BIM model', 'central BIM model'],
  ['shared by the steel contractor, the erector and the steel deck supplier', 'model sharing'],
  ['prefabricated concrete components such as the rails along which the roof sections travel', 'roof-rail scope'],
  ['Simulations were integrated in the BIM model in order to eliminate any possibility of clashes between the three roof sections', 'three-panel clash simulation'],
  ['a team of 40 drafters', 'drafting team'],
  ['produced 7,100 drawings depicting the exact dimension and location of the 7,200 tons of steel components', 'drawing and component scope'],
]) requireText(northAmericaAwardPage, needle, `archived North America award page ${label}`);

requireText(
  globalFinalistPage,
  'Steel Project category',
  'archived global-finalist page regional category',
);
requireText(
  globalFinalistPage,
  'for its modeling of the retractable roof',
  'archived global-finalist page model scope',
);
requireText(
  globalFinalistPage,
  '3D model illustrating two of the three sections of the retractable roof',
  'archived global-finalist page image caption',
);
requireText(
  teklaGlobalPage,
  'approximately 530 feet at each lower panel and 566 feet at the upper panel',
  'archived Tekla global page roof span description',
);
requireText(
  teklaGlobalPage,
  'http://www.youtube.com/watch?v=zTkzE1pcr6w',
  'archived Tekla global page video',
);

const referencedProjectImagePaths = [...new Set(
  [...projectPage.matchAll(/["'](\/upload\/images\/projets\/[^"']+)["']/g)]
    .map((match) => match[1]),
)].sort();
requireEqual(referencedProjectImagePaths.length, 9, 'unique project image reference count');

const expectedSearchedExtensions = ['tbp', 'db1', 'ifc', 'zip', 'dwg', 'dxf', 'dgn', 'pdf'];
requireEqual(
  JSON.stringify(acquisition.searchedExtensions),
  JSON.stringify(expectedSearchedExtensions),
  'searched public archive extensions',
);
for (const extension of expectedSearchedExtensions) {
  const index = JSON.parse(sourceText[`archived-intelibuild-${extension}-index`]);
  requireEqual(Math.max(0, index.length - 1), 0, `public .${extension} URL count`);
  requireEqual(
    acquisition.extensionIndexes[extension].successfulUniqueUrlCount,
    0,
    `acquisition public .${extension} URL count`,
  );
}
for (const hostname of ['www', 'bare']) {
  const index = JSON.parse(sourceText[`archived-intelibuild-project-images-${hostname}-index`]);
  requireEqual(
    Math.max(0, index.length - 1),
    0,
    `${hostname} project-image directory capture count`,
  );
  requireEqual(
    acquisition.projectImageDirectoryIndexes[hostname].successfulUniqueUrlCount,
    0,
    `acquisition ${hostname} project-image directory capture count`,
  );
}
const globalDirectoryIndex = JSON.parse(sourceText['archived-tekla-global-award-directory-index']);
const globalDirectoryRows = globalDirectoryIndex.slice(1);
const globalDirectoryNonHtmlRows = globalDirectoryRows.filter((row) => row[2] !== 'text/html');
requireEqual(globalDirectoryRows.length, 55, 'official global-award directory URL count');
requireEqual(globalDirectoryNonHtmlRows.length, 0, 'official global-award non-HTML URL count');
requireEqual(
  acquisition.globalAwardDirectoryIndex.successfulUniqueUrlCount,
  globalDirectoryRows.length,
  'acquisition global-award directory URL count',
);
requireEqual(
  acquisition.globalAwardDirectoryIndex.nonHtmlUrlCount,
  globalDirectoryNonHtmlRows.length,
  'acquisition global-award non-HTML URL count',
);

const stable = {
  analysisVersion: 'marlins-intelibuild-archive-source-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    acquisition: {
      path: path.relative(process.cwd(), acquisitionPath),
      sha256: sha256(acquisitionInput.bytes),
      artifactVersion: acquisition.artifactVersion,
    },
  },
  historicalProjectEvidence: {
    projectCompletionYear: 2011,
    owner: 'Miami-Dade County',
    architect: 'Populous',
    engineer: 'Walter P Moore',
    constructionManager: 'Hunt/Moss',
    projectBy: 'Structal-Heavy Steel Construction, a Canam Group business unit',
    documentedServices: [
      'design-assist',
      'drawings by InteliBuild',
      'fabrication',
      'erection',
      'project management',
    ],
    documentedContractScope: [
      'design-assist',
      'detailing',
      'BIM',
      'project management',
      'steel fabrication',
      'steel erection',
      'installation of the retractable-roof opening mechanism',
    ],
    referencedProjectImagePaths,
    referencedProjectImageCount: referencedProjectImagePaths.length,
    referencedProjectImagesRetrieved: false,
    referencedThreeDimensionalModelImage: '/upload/images/projets/toit marlins.jpg',
  },
  centralBimEvidence: {
    inteliBuildProducedCentralBimModel: true,
    documentedModelConsumers: [
      'steel contractor',
      'erector',
      'steel deck supplier',
    ],
    prefabricatedConcreteRoofRailsIncluded: true,
    threeRoofPanelClashSimulationsIntegrated: true,
    draftingPeriod: 'October 2009 through April 2011',
    documentedDrafterCount: 40,
    documentedDrawingCount: 7100,
    documentedSteelTonnage: 7200,
    drawingsDescribedAsDepictingExactComponentDimensionAndLocation: true,
    regionalSteelCategoryModelingAwardEstablished: true,
    globalAwardFinalistEstablished: true,
    interpretation: 'First-party InteliBuild pages establish a central coordination model with roof-rail and three-panel simulation scope and identify several historical model users. They do not establish a survey datum, an as-built or record-model status, present custody, release authority, or current geometry.',
  },
  publicArchiveSearch: {
    inteliBuildSuccessfulTbpUrls: 0,
    inteliBuildSuccessfulDb1Urls: 0,
    inteliBuildSuccessfulIfcUrls: 0,
    inteliBuildSuccessfulZipUrls: 0,
    inteliBuildSuccessfulDwgUrls: 0,
    inteliBuildSuccessfulDxfUrls: 0,
    inteliBuildSuccessfulDgnUrls: 0,
    inteliBuildSuccessfulMarlinsPdfUrls: 0,
    inteliBuildSuccessfulWwwProjectImageUrls: 0,
    inteliBuildSuccessfulBareProjectImageUrls: 0,
    officialGlobalAwardSuccessfulUrls: globalDirectoryRows.length,
    officialGlobalAwardNonHtmlUrls: globalDirectoryNonHtmlRows.length,
    publicNativeModelLocated: false,
    publicMetricDrawingPackageLocated: false,
    referencedFirstPartyProjectImagesRetrieved: false,
  },
  currentCustodyRoute: {
    historicalPotentialModelCustodiansOrUsers: [
      'InteliBuild',
      'Structal-Heavy Steel Construction',
      'Canam Group',
      'steel contractor',
      'erector',
      'steel deck supplier',
      'Hunt/Moss',
      'Tekla',
    ],
    establishesCentralModelWasSharedAcrossProjectTrades: true,
    establishesCurrentCanamOrSuccessorRetention: false,
    establishesCurrentThirdPartyRetention: false,
    establishesOwnerDelivery: false,
    establishesReleaseAuthority: false,
    externalRequestSent: false,
  },
  geometryBoundary: {
    establishesHistoricalCentralRoofBimExistence: true,
    establishesHistoricalPrecastRoofRailModelScope: true,
    establishesHistoricalThreePanelClashSimulationScope: true,
    establishesNativeModelCoordinates: false,
    establishesSurveyDatum: false,
    establishesConstructionAsBuiltModel: false,
    establishesCurrentNativeModelRetention: false,
    establishesCurrentGeometry: false,
    establishesMeasuredRowGeometry: false,
    establishesCompleteShadowObstructionGeometry: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'NATIVE_INTELIBUILD_CENTRAL_BIM_NOT_ACQUIRED',
      'PUBLIC_INTELIBUILD_METRIC_DRAWING_PACKAGE_NOT_LOCATED',
      'REFERENCED_INTELIBUILD_PROJECT_IMAGES_NOT_CAPTURED',
      'CURRENT_INTELIBUILD_OR_SUCCESSOR_RETENTION_NOT_VERIFIED',
      'MODEL_DATUM_AND_COORDINATES_NOT_ESTABLISHED',
      'CONSTRUCTION_AS_BUILT_MODEL_STATUS_NOT_ESTABLISHED',
      'CURRENT_GEOMETRY_NOT_ESTABLISHED',
      'MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED',
      'COMPLETE_SHADOW_OBSTRUCTION_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-intelibuild-archive-source-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  historicalProjectEvidence: artifact.historicalProjectEvidence,
  centralBimEvidence: artifact.centralBimEvidence,
  publicArchiveSearch: artifact.publicArchiveSearch,
  currentCustodyRoute: artifact.currentCustodyRoute,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
