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

function requireText(value, expected, label) {
  if (!value.includes(expected)) throw new Error(`${label}: missing ${JSON.stringify(expected)}`);
}

const manifestPath = path.resolve(option(
  'manifest',
  'tmp/lidar/marlins-project-team-bim-sources-2026/manifest.json',
));
const outputPath = path.resolve(option(
  'output',
  'tmp/lidar/marlins-project-team-bim-source-review-2026.json',
));
const manifestBytes = await readFile(manifestPath);
const manifest = JSON.parse(manifestBytes.toString('utf8'));
requireEqual(
  manifest.artifactKind,
  'marlins-project-team-bim-source-acquisition',
  'project-team source manifest kind',
);
requireEqual(manifest.sources?.length, 6, 'project-team source count');

const lockedSources = [];
const sourceBytes = new Map();
for (const source of manifest.sources) {
  const resolvedPath = path.resolve(source.localPath);
  const bytes = await readFile(resolvedPath);
  requireEqual(sha256(bytes), source.sha256, `${source.key} checksum`);
  sourceBytes.set(source.key, bytes);
  lockedSources.push({
    key: source.key,
    sourceAuthority: source.sourceAuthority,
    relationshipToProject: source.relationshipToProject,
    mediaType: source.mediaType,
    path: path.relative(process.cwd(), resolvedPath),
    sha256: source.sha256,
    byteLength: bytes.length,
    requestedUrl: source.requestedUrl,
    resolvedUrl: source.resolvedUrl,
  });
}

const aecomHtml = sourceBytes.get('aecom-hunt-loandepot-park-project').toString('utf8');
const canamHtml = sourceBytes.get('canam-marlins-park-project').toString('utf8');
const mossHtml = sourceBytes.get('moss-marlins-park-project').toString('utf8');
requireText(
  aecomHtml,
  'served as construction manager/design assist for LoanDepot Park',
  'AECOM project-team role',
);
requireText(aecomHtml, 'Tekla North America BIM Award, 2011', 'AECOM BIM award');
requireText(aecomHtml, 'composed of 11,000 pieces of steel and 44 transporters', 'AECOM roof system');
requireText(canamHtml, 'Canam built the retractable roof of the new Marlins Park', 'Canam roof role');
requireText(canamHtml, '<p>Miami-Dade County</p>', 'Canam owner identification');
requireText(canamHtml, 'BIM</a> management and virtual construction', 'Canam BIM role');
requireText(canamHtml, 'Detailing</a> and', 'Canam detailing role');
requireText(canamHtml, 'fabrication</a> and erection', 'Canam fabrication and erection role');
requireText(
  canamHtml,
  'href="https://www.canam.com/en/contact-us/"',
  'Canam first-party contact route',
);
requireText(mossHtml, 'Miami Marlins, Miami-Dade County', 'Moss client identification');
requireText(mossHtml, 'Cat 4 Retractable Roof', 'Moss roof scope');

const imageReviews = [
  {
    sourceKey: 'canam-marlins-roof-steel-model-view-1',
    width: 716,
    height: 403,
    reviewedContent: 'Rendered roof-steel construction model over a two-dimensional plan and construction context.',
    depictsStructuralRoofModel: true,
    depictsOpenOrGameRoofPosition: false,
  },
  {
    sourceKey: 'canam-marlins-roof-steel-model-view-2',
    width: 1024,
    height: 683,
    reviewedContent: 'Populous-marked presentation rendering of the completed stadium with the roof open.',
    depictsStructuralRoofModel: false,
    depictsOpenOrGameRoofPosition: true,
  },
  {
    sourceKey: 'canam-marlins-roof-steel-model-view-3',
    width: 1024,
    height: 598,
    reviewedContent: 'Color-coded three-dimensional structural model of the retractable roof steel.',
    depictsStructuralRoofModel: true,
    depictsOpenOrGameRoofPosition: false,
  },
].map((record) => ({
  ...record,
  source: lockedSources.find((source) => source.key === record.sourceKey),
  visualReviewStatus: 'complete',
  containsScaleOrMetricDimensions: false,
  containsSurveyCoordinatesOrDatum: false,
  containsNativeObjectData: false,
}));

const stable = {
  analysisVersion: 'marlins-project-team-bim-source-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    sourceManifest: {
      path: path.relative(process.cwd(), manifestPath),
      sha256: sha256(manifestBytes),
      artifactVersion: manifest.artifactVersion,
    },
    lockedSources,
  },
  sourceFindings: {
    aecomHuntRole: 'Construction manager and design-assist joint-venture member.',
    aecomProjectPageLists2011TeklaBimAward: true,
    canamRole: 'Retractable-roof builder with BIM management, virtual construction, detailing, engineering, fabrication, and erection services.',
    mossRole: 'Construction-manager joint-venture member for Miami Marlins and Miami-Dade County.',
    canamIdentifiesMiamiDadeCountyAsOwner: true,
    canamIdentifiesRoofAsThreeSections: true,
    canamIdentifiesLongestTrussesAs560FeetLongAnd45FeetDeep: true,
    aecomIdentifiesRoofAsElevenThousandSteelPiecesAndFortyFourTransporters: true,
    projectTeamUsedDetailedThreeDimensionalRoofModel: true,
  },
  imageReviews,
  modelCustodyRoute: {
    potentialCustodiansOrTransferSources: [
      'Miami-Dade County as owner',
      'Miami Marlins or Marlins Stadium Developer as client or developer',
      'AECOM Hunt as construction manager and design-assist team member',
      'Moss Construction as construction-manager joint-venture team member',
      'Canam Group or successor records custodian as roof detailer, fabricator, and erector',
    ],
    requestedNativeModelClasses: [
      'Construction-coordination model',
      'Roof structural BIM model',
      'Fabrication and detailing model',
      'Erection model',
      'Model exports and transmittals',
      'Model issue and revision logs',
      'Owner delivery and closeout index',
    ],
    firstPartyCanamContactUrl: 'https://www.canam.com/en/contact-us/',
    currentCanamProjectPageLinksContactRoute: true,
    externalRequestSent: false,
    currentModelPossessionEstablished: false,
    ownerDeliveryEstablished: false,
    modelFileFormatEstablished: false,
    nativeModelPubliclyAvailable: false,
    currentConfigurationEstablished: false,
  },
  geometryBoundary: {
    establishesHistoricalDetailedRoofModelExistence: true,
    establishesProjectTeamModelRoute: true,
    establishesNativeModelCoordinates: false,
    establishesModelDatum: false,
    establishesConstructionAsBuiltModel: false,
    establishesOwnerDeliveredModel: false,
    establishesCurrentMetricRoofVolume: false,
    establishesCurrentRoofUndersides: false,
    establishesGameSpecificRoofConfiguration: false,
    establishesIndependentShadowValidation: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'NATIVE_MODEL_NOT_ACQUIRED',
      'MODEL_CUSTODY_AND_DISPOSITION_NOT_ESTABLISHED',
      'OWNER_DELIVERY_NOT_ESTABLISHED',
      'MODEL_DATUM_AND_COORDINATES_NOT_ESTABLISHED',
      'CONSTRUCTION_AS_BUILT_STATUS_NOT_ESTABLISHED',
      'CURRENT_ROOF_CONFIGURATION_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-project-team-bim-source-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  sourceFindings: artifact.sourceFindings,
  modelCustodyRoute: artifact.modelCustodyRoute,
  geometryBoundary: artifact.geometryBoundary,
  publication: artifact.publication,
}, null, 2));
