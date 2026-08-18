#!/usr/bin/env node

/**
 * Apply source-backed ticket semantics to unresolved block-map products.
 * Decisions must cite a checksum-locked official MLB page acquisition.
 * Physical zone geometry remains a separate mandatory publication gate.
 *
 * Usage:
 *   node scripts/review3dVenueBlockmapProducts.mjs \
 *     --audit=tmp/lidar/astros-3ddv-blockmap-products.json \
 *     --decisions=tmp/lidar/astros-3ddv-product-semantics-decisions.json \
 *     --output=tmp/lidar/astros-3ddv-product-semantics-review.json
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const auditPath = typeof args.audit === 'string' ? args.audit : null;
const decisionsPath = typeof args.decisions === 'string' ? args.decisions : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!auditPath || !decisionsPath || !outputPath) {
  console.error('Required: --audit=PATH --decisions=PATH --output=PATH');
  process.exit(2);
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const audit = JSON.parse(await readFile(auditPath, 'utf8'));
const decisions = JSON.parse(await readFile(decisionsPath, 'utf8'));
if (audit?.artifactKind !== 'venue-blockmap-product-audit') {
  throw new Error('Audit input is not a venue-blockmap-product-audit artifact');
}
if (decisions?.artifactKind !== 'venue-blockmap-product-semantics-decisions') {
  throw new Error('Decision input is not a venue-blockmap-product-semantics-decisions artifact');
}
if (decisions.stadiumId !== audit.stadiumId) {
  throw new Error(`Decision stadium ${decisions.stadiumId} does not match audit ${audit.stadiumId}`);
}
if (!Array.isArray(decisions.decisions) || decisions.decisions.length === 0) {
  throw new Error('At least one source-backed product decision is required');
}

const supportedClassifications = new Set([
  'HOSPITALITY_ZONE_NO_ASSIGNED_ROW',
  'GENERAL_ADMISSION_NO_ASSIGNED_ROW',
  'STANDING_ROOM_NO_ASSIGNED_ROW',
  'STRUCTURAL_MAP_ELEMENT_NO_ASSIGNED_ROW',
]);
const exactSourceExcerptRequired = Number(decisions.schemaVersion ?? 1) >= 2;
const decisionBySection = new Map();
for (const decision of decisions.decisions) {
  if (!decision?.sectionId || decisionBySection.has(decision.sectionId)) {
    throw new Error(`Missing or duplicate decision section ID ${decision?.sectionId ?? ''}`);
  }
  if (!supportedClassifications.has(decision.classification)) {
    throw new Error(`Unsupported classification ${decision.classification}`);
  }
  if (
    (exactSourceExcerptRequired && !decision.sourceTextExcerpt?.trim())
    || !decision.sourceTextSummary?.trim()
    || !decision.rationale?.trim()
  ) {
    throw new Error(
      `Decision ${decision.sectionId} needs an exact source excerpt, summary, and rationale`,
    );
  }
  const manifestPath = resolve(decision.acquisitionManifestPath);
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest?.artifactKind !== 'official-mlb-page-acquisition') {
    throw new Error(`Decision ${decision.sectionId} does not cite an official MLB page acquisition`);
  }
  const sourceUrl = new URL(manifest.sourceUrl);
  if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'www.mlb.com') {
    throw new Error(`Decision ${decision.sectionId} source is not an official HTTPS MLB page`);
  }
  const acquiredBytes = await readFile(manifest.output);
  const acquiredSha256 = sha256(acquiredBytes);
  if (acquiredSha256 !== manifest.sha256) {
    throw new Error(`Decision ${decision.sectionId} acquired page hash does not match its manifest`);
  }
  if (
    decision.sourceTextExcerpt
    && !acquiredBytes.toString('utf8').includes(decision.sourceTextExcerpt)
  ) {
    throw new Error(
      `Decision ${decision.sectionId} exact source excerpt is absent from the acquired page`,
    );
  }
  const supplementalOfficialPageEvidence = [];
  const supplementalPageItems = decision.supplementalOfficialPageEvidence
    ? Array.isArray(decision.supplementalOfficialPageEvidence)
      ? decision.supplementalOfficialPageEvidence
      : [decision.supplementalOfficialPageEvidence]
    : [];
  for (const supplemental of supplementalPageItems) {
    if (
      !supplemental.acquisitionManifestPath
      || !supplemental.sourceTextExcerpt?.trim()
      || !supplemental.sourceTextSummary?.trim()
    ) {
      throw new Error(
        `Decision ${decision.sectionId} supplemental official page evidence is incomplete`,
      );
    }
    const supplementalManifest = JSON.parse(await readFile(
      resolve(supplemental.acquisitionManifestPath),
      'utf8',
    ));
    if (supplementalManifest.artifactKind !== 'official-mlb-page-acquisition') {
      throw new Error(
        `Decision ${decision.sectionId} supplemental source is not an official MLB page acquisition`,
      );
    }
    const supplementalSourceUrl = new URL(supplementalManifest.sourceUrl);
    if (
      supplementalSourceUrl.protocol !== 'https:'
      || supplementalSourceUrl.hostname !== 'www.mlb.com'
    ) {
      throw new Error(
        `Decision ${decision.sectionId} supplemental source is not an official HTTPS MLB page`,
      );
    }
    const supplementalBytes = await readFile(resolve(supplementalManifest.output));
    if (sha256(supplementalBytes) !== supplementalManifest.sha256) {
      throw new Error(
        `Decision ${decision.sectionId} supplemental official page hash does not match`,
      );
    }
    if (!supplementalBytes.toString('utf8').includes(supplemental.sourceTextExcerpt)) {
      throw new Error(
        `Decision ${decision.sectionId} supplemental exact source excerpt is absent`,
      );
    }
    supplementalOfficialPageEvidence.push({
      sourceUrl: supplementalManifest.sourceUrl,
      resolvedUrl: supplementalManifest.resolvedUrl,
      retrievedOn: supplementalManifest.retrievedOn,
      acquisitionArtifactVersion: supplementalManifest.artifactVersion,
      pageSha256: supplementalManifest.sha256,
      sourceTextExcerpt: supplemental.sourceTextExcerpt,
      sourceTextSummary: supplemental.sourceTextSummary,
    });
  }
  const officialTeamResourceEvidence = [];
  const teamResourceItems = decision.officialTeamResourceEvidence
    ? Array.isArray(decision.officialTeamResourceEvidence)
      ? decision.officialTeamResourceEvidence
      : [decision.officialTeamResourceEvidence]
    : [];
  for (const resourceEvidence of teamResourceItems) {
    if (
      !resourceEvidence.acquisitionManifestPath
      || !resourceEvidence.sourceTextExcerpt?.trim()
      || !resourceEvidence.sourceTextSummary?.trim()
    ) {
      throw new Error(
        `Decision ${decision.sectionId} official team resource evidence is incomplete`,
      );
    }
    const resourceManifest = JSON.parse(await readFile(
      resolve(resourceEvidence.acquisitionManifestPath),
      'utf8',
    ));
    if (resourceManifest.artifactKind !== 'official-team-resource-acquisition') {
      throw new Error(
        `Decision ${decision.sectionId} does not cite an official team resource acquisition`,
      );
    }
    const resourceSourceUrl = new URL(resourceManifest.sourceUrl);
    const allowedResourceHost = resourceSourceUrl.hostname === 'www.mlb.com'
      || resourceSourceUrl.hostname.endsWith('.mlb.com')
      || resourceSourceUrl.hostname.endsWith('.mlbstatic.com')
      || resourceSourceUrl.hostname === 'premium.cleguardians.com';
    if (resourceSourceUrl.protocol !== 'https:' || !allowedResourceHost) {
      throw new Error(
        `Decision ${decision.sectionId} team resource is not approved first-party HTTPS`,
      );
    }
    const resourceBytes = await readFile(resolve(resourceManifest.output));
    if (sha256(resourceBytes) !== resourceManifest.sha256) {
      throw new Error(
        `Decision ${decision.sectionId} official team resource hash does not match`,
      );
    }
    if (!resourceBytes.toString('utf8').includes(resourceEvidence.sourceTextExcerpt)) {
      throw new Error(
        `Decision ${decision.sectionId} team resource exact source excerpt is absent`,
      );
    }
    officialTeamResourceEvidence.push({
      sourceUrl: resourceManifest.sourceUrl,
      resolvedUrl: resourceManifest.resolvedUrl,
      retrievedOn: resourceManifest.retrievedOn,
      acquisitionArtifactVersion: resourceManifest.artifactVersion,
      resourceSha256: resourceManifest.sha256,
      sourceTextExcerpt: resourceEvidence.sourceTextExcerpt,
      sourceTextSummary: resourceEvidence.sourceTextSummary,
    });
  }
  let providerRenderedEvidence = null;
  if (decision.providerRenderedEvidence) {
    const rendered = decision.providerRenderedEvidence;
    if (!rendered.renderedText?.trim() || !rendered.reviewedOn || !rendered.reviewer?.trim()) {
      throw new Error(
        `Decision ${decision.sectionId} rendered evidence needs text, review date, and reviewer`,
      );
    }
    const providerAuditPath = resolve(rendered.auditPath);
    const providerAuditBytes = await readFile(providerAuditPath);
    if (sha256(providerAuditBytes) !== rendered.auditSha256) {
      throw new Error(`Decision ${decision.sectionId} provider audit hash does not match`);
    }
    const providerAudit = JSON.parse(providerAuditBytes.toString('utf8'));
    if (
      providerAudit.artifactKind !== 'venue-product-rendering-audit'
      || providerAudit.sectionId !== decision.sectionId
      || providerAudit.blockmapAuditArtifactVersion !== audit.artifactVersion
      || providerAudit.blockmapAuditSha256 !== sha256(await readFile(auditPath))
    ) {
      throw new Error(
        `Decision ${decision.sectionId} rendered evidence does not match this product audit`,
      );
    }
    if (rendered.renderedText !== providerAudit.visibleText) {
      throw new Error(`Decision ${decision.sectionId} rendered text does not match its audit`);
    }
    const providerUrl = new URL(providerAudit.finalUrl ?? providerAudit.mapUrl);
    if (
      providerUrl.protocol !== 'https:'
      || !providerUrl.hostname.endsWith('3ddigitalvenue.com')
    ) {
      throw new Error(`Decision ${decision.sectionId} provider audit is not a 3D Digital Venue page`);
    }
    const screenshotPath = resolve(rendered.screenshotPath);
    if (resolve(providerAudit.screenshotPath) !== screenshotPath) {
      throw new Error(`Decision ${decision.sectionId} screenshot path is absent from provider audit`);
    }
    const screenshotSha256 = sha256(await readFile(screenshotPath));
    if (
      screenshotSha256 !== rendered.screenshotSha256
      || screenshotSha256 !== providerAudit.screenshotSha256
    ) {
      throw new Error(`Decision ${decision.sectionId} provider screenshot hash does not match`);
    }
    providerRenderedEvidence = {
      mapUrl: providerAudit.mapUrl,
      finalUrl: providerAudit.finalUrl,
      auditSha256: rendered.auditSha256,
      screenshotPath: rendered.screenshotPath,
      screenshotSha256,
      renderedText: rendered.renderedText,
      reviewedOn: rendered.reviewedOn,
      reviewer: rendered.reviewer,
    };
  }
  let providerBlockmapEvidence = null;
  if (decision.providerBlockmapEvidence) {
    const blockmap = decision.providerBlockmapEvidence;
    if (
      !blockmap.auditPath
      || !blockmap.auditSha256
      || !blockmap.providerSectionId
      || !blockmap.mappingRationale?.trim()
      || !blockmap.reviewedOn
      || !blockmap.reviewer?.trim()
    ) {
      throw new Error(
        `Decision ${decision.sectionId} blockmap evidence is incomplete`,
      );
    }
    if (blockmap.providerSectionId !== decision.sectionId) {
      throw new Error(`Decision ${decision.sectionId} cites a different provider section`);
    }
    const providerAuditPath = resolve(blockmap.auditPath);
    const providerAuditBytes = await readFile(providerAuditPath);
    if (sha256(providerAuditBytes) !== blockmap.auditSha256) {
      throw new Error(`Decision ${decision.sectionId} provider blockmap hash does not match`);
    }
    const providerAudit = JSON.parse(providerAuditBytes.toString('utf8'));
    if (
      providerAudit.artifactKind !== 'venue-blockmap-product-audit'
      || providerAudit.artifactVersion !== audit.artifactVersion
    ) {
      throw new Error(`Decision ${decision.sectionId} does not cite the reviewed blockmap audit`);
    }
    const providerProduct = providerAudit.products.find((candidate) =>
      candidate.sectionId === blockmap.providerSectionId);
    if (!providerProduct?.blockmapNodePresent) {
      throw new Error(`Decision ${decision.sectionId} provider node is absent`);
    }
    providerBlockmapEvidence = {
      auditPath: blockmap.auditPath,
      auditSha256: blockmap.auditSha256,
      providerSectionId: blockmap.providerSectionId,
      providerNodeType: providerProduct.providerNodeType,
      blockmapNodeBounds: providerProduct.blockmapNode?.bounds ?? null,
      blockmapPathDataSha256: providerProduct.blockmapNode?.pathDataSha256 ?? null,
      overlappingManifestBackedSectionBounds:
        providerProduct.overlappingManifestBackedSectionBounds ?? [],
      overlappingUnresolvedProductBounds:
        providerProduct.overlappingUnresolvedProductBounds ?? [],
      mappingRationale: blockmap.mappingRationale,
      reviewedOn: blockmap.reviewedOn,
      reviewer: blockmap.reviewer,
    };
  }
  const officialImageEvidence = [];
  const imageEvidenceItems = decision.officialImageEvidence
    ? Array.isArray(decision.officialImageEvidence)
      ? decision.officialImageEvidence
      : [decision.officialImageEvidence]
    : [];
  for (const imageEvidence of imageEvidenceItems) {
    if (
      !imageEvidence.imageManifestPath
      || !imageEvidence.pageAcquisitionManifestPath
      || !imageEvidence.visualObservation?.trim()
      || !imageEvidence.reviewedOn
      || !imageEvidence.reviewer?.trim()
    ) {
      throw new Error(`Decision ${decision.sectionId} official image evidence is incomplete`);
    }
    const imageManifest = JSON.parse(await readFile(
      resolve(imageEvidence.imageManifestPath),
      'utf8',
    ));
    if (imageManifest.artifactKind !== 'official-mlb-image-acquisition') {
      throw new Error(`Decision ${decision.sectionId} does not cite an official MLB image`);
    }
    const imageSourceUrl = new URL(imageManifest.sourceUrl);
    if (
      imageSourceUrl.protocol !== 'https:'
      || imageSourceUrl.hostname !== 'img.mlbstatic.com'
    ) {
      throw new Error(`Decision ${decision.sectionId} image source is not official MLB media`);
    }
    const imageBytes = await readFile(resolve(imageManifest.output));
    if (sha256(imageBytes) !== imageManifest.sha256) {
      throw new Error(`Decision ${decision.sectionId} official image hash does not match`);
    }
    const pageManifest = JSON.parse(await readFile(
      resolve(imageEvidence.pageAcquisitionManifestPath),
      'utf8',
    ));
    if (pageManifest.artifactKind !== 'official-mlb-page-acquisition') {
      throw new Error(`Decision ${decision.sectionId} image page is not an official MLB page`);
    }
    const pageSourceUrl = new URL(pageManifest.sourceUrl);
    if (pageSourceUrl.protocol !== 'https:' || pageSourceUrl.hostname !== 'www.mlb.com') {
      throw new Error(`Decision ${decision.sectionId} image page source is not official MLB`);
    }
    const pageBytes = await readFile(resolve(pageManifest.output));
    if (sha256(pageBytes) !== pageManifest.sha256) {
      throw new Error(`Decision ${decision.sectionId} official image page hash does not match`);
    }
    const pageText = pageBytes.toString('utf8');
    if (
      !pageText.includes(imageManifest.sourceUrl)
      && !pageText.includes(imageManifest.sourceUrl.replace(/^https:/, ''))
    ) {
      throw new Error(`Decision ${decision.sectionId} official page does not cite the image`);
    }
    officialImageEvidence.push({
      imageSourceUrl: imageManifest.sourceUrl,
      imageRetrievedOn: imageManifest.retrievedOn,
      imageSha256: imageManifest.sha256,
      pageSourceUrl: pageManifest.sourceUrl,
      pageRetrievedOn: pageManifest.retrievedOn,
      pageSha256: pageManifest.sha256,
      visualObservation: imageEvidence.visualObservation,
      reviewedOn: imageEvidence.reviewedOn,
      reviewer: imageEvidence.reviewer,
    });
  }
  let inventoryCensusEvidence = null;
  if (decision.inventoryCensusEvidence) {
    const census = decision.inventoryCensusEvidence;
    if (
      !census.inventoryPath
      || !census.inventorySha256
      || !census.assignedSectionId
      || !Number.isInteger(census.expectedSeatCount)
      || census.expectedSeatCount < 1
      || !census.mappingRationale?.trim()
    ) {
      throw new Error(`Decision ${decision.sectionId} inventory census is incomplete`);
    }
    const inventoryBytes = await readFile(resolve(census.inventoryPath));
    if (sha256(inventoryBytes) !== census.inventorySha256) {
      throw new Error(`Decision ${decision.sectionId} inventory census hash does not match`);
    }
    const inventory = JSON.parse(inventoryBytes.toString('utf8'));
    if (
      inventory.artifactKind !== 'venue-metric-seat-inventory'
      || inventory.artifactVersion !== audit.inventoryArtifactVersion
      || inventory.stadiumId !== audit.stadiumId
    ) {
      throw new Error(`Decision ${decision.sectionId} census does not match the reviewed inventory`);
    }
    const assignedSection = inventory.sections.find((candidate) =>
      candidate.sectionId === census.assignedSectionId);
    const uniqueSeatIds = new Set(assignedSection?.seatIds ?? []);
    if (
      assignedSection?.status !== 200
      || uniqueSeatIds.size !== census.expectedSeatCount
    ) {
      throw new Error(`Decision ${decision.sectionId} assigned-seat census does not match`);
    }
    inventoryCensusEvidence = {
      inventoryPath: census.inventoryPath,
      inventorySha256: census.inventorySha256,
      inventoryArtifactVersion: inventory.artifactVersion,
      assignedSectionId: census.assignedSectionId,
      assignedSeatCount: uniqueSeatIds.size,
      assignedRowIds: assignedSection.rowIds ?? [],
      mappingRationale: census.mappingRationale,
    };
  }
  if (
    decision.classification === 'STANDING_ROOM_NO_ASSIGNED_ROW'
    && !providerRenderedEvidence
    && !(
      providerBlockmapEvidence
      && /(?:SRO|STAND)(?:[^A-Z]|$)/i.test(
        providerBlockmapEvidence.providerSectionId,
      )
    )
  ) {
    throw new Error(
      `Decision ${decision.sectionId} standing-room classification needs current provider evidence`,
    );
  }
  decisionBySection.set(decision.sectionId, {
    classification: decision.classification,
    assignedRowApplicable: false,
    sourceTextSummary: decision.sourceTextSummary,
    rationale: decision.rationale,
    evidence: {
      sourceUrl: manifest.sourceUrl,
      resolvedUrl: manifest.resolvedUrl,
      retrievedOn: manifest.retrievedOn,
      acquisitionArtifactVersion: manifest.artifactVersion,
      pageSha256: manifest.sha256,
      ...(decision.sourceTextExcerpt
        ? { sourceTextExcerpt: decision.sourceTextExcerpt }
        : {}),
      ...(providerRenderedEvidence ? { providerRenderedEvidence } : {}),
      ...(providerBlockmapEvidence ? { providerBlockmapEvidence } : {}),
      ...(supplementalOfficialPageEvidence.length > 0
        ? { supplementalOfficialPageEvidence }
        : {}),
      ...(officialTeamResourceEvidence.length > 0
        ? { officialTeamResourceEvidence }
        : {}),
      ...(officialImageEvidence.length > 0 ? { officialImageEvidence } : {}),
      ...(inventoryCensusEvidence ? { inventoryCensusEvidence } : {}),
    },
  });
}

for (const sectionId of decisionBySection.keys()) {
  const product = audit.products.find((candidate) => candidate.sectionId === sectionId);
  if (!product) throw new Error(`Decision references unknown audit product ${sectionId}`);
  if (product.classification !== 'UNRESOLVED_BLOCKMAP_PRODUCT') {
    throw new Error(`Decision ${sectionId} attempts to replace ${product.classification}`);
  }
}

const products = audit.products.map((product) => {
  const decision = decisionBySection.get(product.sectionId);
  return decision ? {
    ...product,
    ...decision,
    note: 'Source-backed ticket semantics establish that this product has no assigned row. Metric zone geometry is still required before publishing shade for it.',
  } : product;
});
const unresolvedProducts = products.filter((product) =>
  product.classification === 'UNRESOLVED_BLOCKMAP_PRODUCT');
const excludedProducts = products.filter((product) =>
  product.assignedRowApplicable === false);
const fingerprintInput = {
  reviewedArtifactVersion: audit.artifactVersion,
  inventoryArtifactVersion: audit.inventoryArtifactVersion,
  products,
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'venue-blockmap-product-semantics-review',
  artifactVersion: `sha256:${sha256(JSON.stringify(fingerprintInput))}`,
  reviewedArtifactVersion: audit.artifactVersion,
  inventoryArtifactVersion: audit.inventoryArtifactVersion,
  stadiumId: audit.stadiumId,
  venueId: audit.venueId,
  reviewedOn: new Date().toISOString(),
  source: audit.source,
  products,
  conclusion: {
    excludedNonAssignedRowProducts: excludedProducts.length,
    unresolvedProducts: unresolvedProducts.length,
    assignedSeatCoverageClaimAllowed: unresolvedProducts.length === 0,
    blockers: [
      ...(unresolvedProducts.length > 0 ? ['UNRESOLVED_BLOCKMAP_PRODUCT_SEMANTICS'] : []),
      ...(excludedProducts.length > 0 ? ['NON_ASSIGNED_ROW_ZONE_GEOMETRY_NOT_EXTRACTED'] : []),
    ],
  },
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId: artifact.stadiumId,
  reviewedArtifactVersion: artifact.reviewedArtifactVersion,
  decisionsApplied: decisionBySection.size,
  conclusion: artifact.conclusion,
}, null, 2));
