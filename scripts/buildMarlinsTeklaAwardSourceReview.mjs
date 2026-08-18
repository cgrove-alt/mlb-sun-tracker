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

async function loadJson(filePath) {
  const bytes = await readFile(filePath);
  return { bytes, value: JSON.parse(bytes) };
}

function requireText(haystack, needle, sourceLabel) {
  if (!haystack.includes(needle)) {
    throw new Error(`Required text not found in ${sourceLabel}: ${needle}`);
  }
}

const acquisitionPath = path.resolve(option(
  'acquisition',
  'tmp/lidar/marlins-tekla-award-sources-2026/manifest.json',
));
const frameReviewPath = path.resolve(option(
  'frame-review',
  'tmp/lidar/marlins-tekla-award-frame-review-2026/manifest.json',
));
const outputPath = path.resolve(option(
  'output',
  'tmp/lidar/marlins-tekla-award-source-review-2026.json',
));

const acquisitionInput = await loadJson(acquisitionPath);
const frameReviewInput = await loadJson(frameReviewPath);
const acquisition = acquisitionInput.value;
const frameReview = frameReviewInput.value;
if (acquisition.artifactKind !== 'marlins-tekla-award-source-acquisition') {
  throw new Error('Unexpected Tekla award acquisition artifact kind');
}
if (frameReview.artifactKind !== 'marlins-tekla-award-frame-review-index') {
  throw new Error('Unexpected Tekla award frame-review artifact kind');
}
if (frameReview.inputs.acquisitionArtifactVersion !== acquisition.artifactVersion) {
  throw new Error('Frame review is not bound to the current acquisition artifact');
}

const sourcesByKey = Object.fromEntries(acquisition.sources.map((source) => [source.key, source]));
const sourceText = {};
for (const [key, source] of Object.entries(sourcesByKey)) {
  const bytes = await readFile(path.resolve(source.localPath));
  if (sha256(bytes) !== source.sha256 || bytes.length !== source.byteLength) {
    throw new Error(`Tekla award source checksum changed: ${key}`);
  }
  sourceText[key] = bytes.toString('utf8');
}

const projectPage = sourceText['archived-tekla-marlins-award-page'];
const rulesPage = sourceText['archived-tekla-award-rules-page'];
const winnersPage = sourceText['archived-tekla-award-winners-page'];
const currentSubmissionPage = sourceText['current-tekla-award-submission-page'];
requireText(projectPage, 'youtube.com/embed/zTkzE1pcr6w', 'archived project page');
requireText(projectPage, 'Retractable Roof of the New Marlins', 'archived project page');
requireText(rulesPage, 'A Tekla BIMsight file (.tbp) of your model', 'archived rules page');
requireText(rulesPage, 'The .db1 and profile database file of the Tekla model', 'archived rules page');
requireText(rulesPage, 'will be required from the winning', 'archived rules page');
requireText(rulesPage, 'publishing the model', 'archived rules page');
requireText(rulesPage, 'Tekla Web Viewer or Tekla BIMsight application', 'archived rules page');
requireText(winnersPage, 'Steel: Retractable Roof of the New Marlins Ballpark, USA by', 'archived winners page');
requireText(winnersPage, 'InteliBuild', 'archived winners page');
requireText(currentSubmissionPage, 'Tekla Structures project/model folder', 'current submission page');
requireText(currentSubmissionPage, 'Tekla.marketing.us@trimble.com', 'current submission page');
requireText(currentSubmissionPage, 'Tekla Structures model (.db1)', 'current submission page');

const cdx = JSON.parse(sourceText['archived-tekla-award-directory-index']);
const cdxRows = cdx.slice(1);
const nonHtmlRows = cdxRows.filter((row) => row[2] !== 'text/html');
if (cdxRows.length !== acquisition.archiveDirectoryIndex.successfulUniqueUrlCount) {
  throw new Error('Archive-directory row count changed');
}
if (nonHtmlRows.length !== acquisition.archiveDirectoryIndex.nonHtmlUrlCount) {
  throw new Error('Archive-directory non-HTML row count changed');
}

const videoPath = path.resolve(acquisition.youtube.video.localPath);
const videoBytes = await readFile(videoPath);
if (
  videoBytes.length !== acquisition.youtube.video.byteLength
  || sha256(videoBytes) !== acquisition.youtube.video.sha256
) {
  throw new Error('Tekla animation checksum changed');
}
const audioPath = path.resolve(acquisition.youtube.audio.localPath);
const audioBytes = await readFile(audioPath);
if (
  audioBytes.length !== acquisition.youtube.audio.byteLength
  || sha256(audioBytes) !== acquisition.youtube.audio.sha256
) {
  throw new Error('Tekla animation audio checksum changed');
}

if (frameReview.sampleCount !== 93 || frameReview.contactSheets.length !== 5) {
  throw new Error('Expected the reviewed 93-sample, five-sheet visual index');
}
for (const sheet of frameReview.contactSheets) {
  const sheetBytes = await readFile(sheet.path);
  if (sha256(sheetBytes) !== sheet.sha256) {
    throw new Error(`Contact sheet checksum changed: ${sheet.sheetIndex}`);
  }
}

const stable = {
  analysisVersion: 'marlins-tekla-award-source-review-v1',
  stadiumId: 'marlins',
  reviewedOn: '2026-08-11',
  inputs: {
    acquisition: {
      path: path.relative(process.cwd(), acquisitionPath),
      sha256: sha256(acquisitionInput.bytes),
      artifactVersion: acquisition.artifactVersion,
    },
    frameReview: {
      path: path.relative(process.cwd(), frameReviewPath),
      sha256: sha256(frameReviewInput.bytes),
      artifactVersion: frameReview.artifactVersion,
    },
  },
  historicalCompetitionEvidence: {
    marlinsSteelCategoryWinner: true,
    winnerName: 'Retractable Roof of the New Marlins Ballpark, USA',
    submitter: 'InteliBuild',
    requiredEntryAlternatives: [
      'Tekla BIMsight .tbp with seven predefined views',
      'Tekla .db1 plus profile database file',
    ],
    winningProjectModelFolderRequiredByRules: true,
    modelUsePermissionIncludedWebViewerOrBimsightPublication: true,
    actualWinningModelReceiptIndependentlyVerified: false,
    actualWinningModelRetentionIn2026Verified: false,
    interpretation: 'The archived first-party rules and winners page establish a documented Tekla custody route. They do not by themselves prove actual receipt, present retention, release authority, or as-built status.',
  },
  publicArchiveSearch: {
    successfulUniqueUrlsUnderAwardDirectory: cdxRows.length,
    nonHtmlUrlsUnderAwardDirectory: nonHtmlRows.length,
    nonHtmlRows,
    referencedEntryFormZipCaptured: false,
    publicTbpCaptured: false,
    publicDb1Captured: false,
    publicNativeModelLocated: false,
    projectPageMedia: [
      'embedded Tekla Software YouTube video zTkzE1pcr6w',
    ],
  },
  animationReview: {
    sourceVideo: {
      path: acquisition.youtube.video.localPath,
      sha256: acquisition.youtube.video.sha256,
      width: acquisition.youtube.video.width,
      height: acquisition.youtube.video.height,
      durationSeconds: acquisition.youtube.metadata.summary.durationSeconds,
      uploadDate: acquisition.youtube.metadata.summary.uploadDate,
    },
    sourceAudio: {
      path: acquisition.youtube.audio.localPath,
      sha256: acquisition.youtube.audio.sha256,
      captionsPublishedByYouTube: false,
      speechContentDetermined: false,
    },
    visualReviewMethod: {
      intervalSeconds: frameReview.sampling.intervalSeconds,
      oneSecondSamplesReviewed: frameReview.sampleCount,
      contactSheetsReviewed: frameReview.contactSheets.length,
      allContactSheetsVisuallyReviewed: true,
    },
    visibleContent: [
      'construction-period aerial stadium photograph',
      'three retractable roof panels and track beams',
      'dense roof trusses, bracing, connections, and wishbone assemblies',
      'close views of underside roof steel and maintenance access elements',
    ],
    notVisibleInReviewedSamples: [
      'stadium coordinate grid or geodetic datum',
      'metric dimensions or model units',
      'Tekla model file name or export controls',
      'complete seating bowl, section, row, or seat geometry',
      'construction as-built certification or survey comparison',
      'current 2026 roof configuration or alteration record',
    ],
    metricGeometryExtractable: false,
    currentGeometryEstablished: false,
    measuredRowGeometryEstablished: false,
  },
  currentCustodyRoute: {
    firstPartyNorthAmericaAwardContact: 'Tekla.marketing.us@trimble.com',
    contactPublishedOnCurrentSubmissionPage: true,
    currentSubmissionPageStillRequiresDb1AndModelFolder: true,
    currentSubmissionPageStillRequiresAlignedIfc: true,
    historicalAssetRetentionEstablished: false,
    releaseAuthorityEstablished: false,
    externalRequestSent: false,
  },
  boundary: {
    documentedHistoricalNativeModelCustodyRoute: true,
    actualHistoricalNativeModelReceiptVerified: false,
    currentNativeModelRetentionVerified: false,
    publiclyDownloadableNativeModelLocated: false,
    coordinateReferenceLocated: false,
    constructionAsBuiltStatusEstablished: false,
    currentGeometryEstablished: false,
    measuredRowGeometryEstablished: false,
    publicationEligible: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'HISTORICAL_NATIVE_MODEL_RECEIPT_NOT_VERIFIED',
      'CURRENT_NATIVE_MODEL_RETENTION_NOT_VERIFIED',
      'PUBLIC_OR_AUTHORIZED_MODEL_RELEASE_NOT_ESTABLISHED',
      'MODEL_COORDINATE_REFERENCE_NOT_LOCATED',
      'CONSTRUCTION_AS_BUILT_STATUS_NOT_ESTABLISHED',
      'CURRENT_GEOMETRY_NOT_ESTABLISHED',
      'MEASURED_ROW_GEOMETRY_NOT_ESTABLISHED',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'marlins-tekla-award-source-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  generatedAt: new Date().toISOString(),
  ...stable,
};
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  historicalCompetitionEvidence: artifact.historicalCompetitionEvidence,
  publicArchiveSearch: artifact.publicArchiveSearch,
  animationReview: artifact.animationReview,
  currentCustodyRoute: artifact.currentCustodyRoute,
  boundary: artifact.boundary,
  publication: artifact.publication,
}, null, 2));
