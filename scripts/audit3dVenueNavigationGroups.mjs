#!/usr/bin/env node

/**
 * Acquire each current 3D Digital Venue navigation-group manifest in a fresh
 * browser context. Some provider manifests are concatenated JSON fragments,
 * so this audit preserves and hashes the raw bytes before extracting only
 * narrow, directly encoded ticket-type and member identifiers.
 *
 * Usage:
 *   node scripts/audit3dVenueNavigationGroups.mjs \
 *     --audit=tmp/lidar/redsox-3ddv-blockmap-products-v2.json \
 *     --output=tmp/lidar/redsox-3ddv-navigation-groups-v1.json
 */

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const auditPath = typeof args.audit === 'string' ? args.audit : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!auditPath || !outputPath) {
  console.error('Required: --audit=PATH --output=PATH');
  process.exit(2);
}

const sha256 = (value) => createHash('sha256').update(value).digest('hex');
const productAuditBytes = await readFile(auditPath);
const productAudit = JSON.parse(productAuditBytes.toString('utf8'));
if (productAudit?.artifactKind !== 'venue-blockmap-product-audit') {
  throw new Error('Input is not a venue-blockmap-product-audit artifact');
}
const groupIds = productAudit.products
  .filter((product) => product.classification === 'NAVIGATION_GROUP_NO_ASSIGNED_ROW')
  .map((product) => product.sourceMapId);
if (groupIds.length === 0) throw new Error('Product audit has no navigation groups');

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const records = [];

const withTimeout = (promise, milliseconds, label) => Promise.race([
  promise,
  new Promise((_, reject) => setTimeout(
    () => reject(new Error(`Timed out after ${milliseconds} ms waiting for ${label}`)),
    milliseconds,
  )),
]);

try {
  for (const groupId of groupIds) {
    const context = await browser.newContext();
    const page = await context.newPage();
    let rootMapManifestUrl = null;
    let resolveRootMap;
    const rootMapReady = new Promise((resolve) => { resolveRootMap = resolve; });
    page.on('response', (response) => {
      const url = response.url();
      if (/\/maps\/(?:blockmap|pricescalemap)\/master_full\.json(?:[?#]|$)/.test(url)) {
        rootMapManifestUrl ??= url;
        resolveRootMap(rootMapManifestUrl);
      }
    });
    try {
      await page.goto(productAudit.source.clubLinkedMapUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 60_000,
      });
      await withTimeout(rootMapReady, 30_000, `root map manifest for ${groupId}`);
      const response = await page.evaluate(async ({ manifestUrl, targetGroupId }) => {
        const parsed = new URL(manifestUrl);
        const markerMatch = parsed.pathname.match(/\/maps\/[^/]+\/master_full\.json$/);
        if (!markerMatch) throw new Error('Unexpected root map resource URL');
        const markerIndex = parsed.pathname.lastIndexOf(markerMatch[0]);
        const mapRoot = `${parsed.origin}${parsed.pathname.slice(0, markerIndex)}/maps`;
        const version = parsed.searchParams.get('v');
        const targetUrl = `${mapRoot}/${encodeURIComponent(targetGroupId)}/master_full.json${version ? `?v=${encodeURIComponent(version)}` : ''}`;
        const result = await fetch(targetUrl, { credentials: 'include' });
        const bytes = new Uint8Array(await result.arrayBuffer());
        return {
          targetUrl,
          status: result.status,
          contentType: result.headers.get('content-type'),
          contentLength: bytes.byteLength,
          lastModified: result.headers.get('last-modified'),
          etag: result.headers.get('etag'),
          bodyBytes: Array.from(bytes),
        };
      }, { manifestUrl: rootMapManifestUrl, targetGroupId: groupId });
      const body = Buffer.from(response.bodyBytes);
      const bodyUtf8 = body.toString('utf8');
      const memberSectionIds = Array.from(new Set(
        Array.from(bodyUtf8.matchAll(/\"i\":\"S_([A-Za-z0-9]+)\"/g), (match) => match[1]),
      ));
      const generalAdmissionMarkers = Array.from(
        bodyUtf8.matchAll(/\"t\":\"general_admission\"/g),
      ).length;
      const generalAdmissionSeatReferences = Array.from(new Set(
        Array.from(
          bodyUtf8.matchAll(/\"(S_[A-Za-z0-9]+-GA-[A-Za-z0-9]+)\"/g),
          (match) => match[1],
        ),
      ));
      records.push({
        groupId,
        rootMapManifestUrl,
        targetUrl: response.targetUrl,
        status: response.status,
        contentType: response.contentType,
        contentLength: response.contentLength,
        lastModified: response.lastModified,
        etag: response.etag,
        bodySha256: sha256(body),
        bodyUtf8,
        rawJsonParseable: (() => {
          try {
            JSON.parse(bodyUtf8);
            return true;
          } catch {
            return false;
          }
        })(),
        extractedSemantics: {
          generalAdmissionMarkers,
          memberSectionIds,
          generalAdmissionSeatReferences,
          usable: response.status === 200
            && generalAdmissionMarkers > 0
            && memberSectionIds.length > 0,
        },
      });
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}

const unresolvedProductIds = new Set(productAudit.products
  .filter((product) => product.classification === 'UNRESOLVED_BLOCKMAP_PRODUCT')
  .map((product) => product.sectionId));
const evidencedMemberIds = Array.from(new Set(records.flatMap((record) =>
  record.extractedSemantics.usable ? record.extractedSemantics.memberSectionIds : [])));
const unknownMemberIds = evidencedMemberIds.filter((sectionId) => !unresolvedProductIds.has(sectionId));
const unevidencedProductIds = Array.from(unresolvedProductIds)
  .filter((sectionId) => !evidencedMemberIds.includes(sectionId));
const fingerprintInput = {
  productAuditArtifactVersion: productAudit.artifactVersion,
  records: records.map((record) => ({
    groupId: record.groupId,
    targetUrl: record.targetUrl,
    status: record.status,
    bodySha256: record.bodySha256,
    extractedSemantics: record.extractedSemantics,
  })),
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'venue-navigation-group-manifest-audit',
  artifactVersion: `sha256:${sha256(JSON.stringify(fingerprintInput))}`,
  auditedOn: new Date().toISOString(),
  productAuditPath: auditPath,
  productAuditSha256: sha256(productAuditBytes),
  productAuditArtifactVersion: productAudit.artifactVersion,
  stadiumId: productAudit.stadiumId,
  venueId: productAudit.venueId,
  source: productAudit.source,
  records,
  conclusion: {
    requestedGroups: groupIds.length,
    usableGroups: records.filter((record) => record.extractedSemantics.usable).length,
    evidencedMemberIds,
    unknownMemberIds,
    unevidencedProductIds,
    allUnresolvedProductsGeneralAdmission:
      unknownMemberIds.length === 0 && unevidencedProductIds.length === 0,
  },
};
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  artifactVersion: artifact.artifactVersion,
  stadiumId: artifact.stadiumId,
  groups: records.map((record) => ({
    groupId: record.groupId,
    status: record.status,
    bodySha256: record.bodySha256,
    rawJsonParseable: record.rawJsonParseable,
    extractedSemantics: record.extractedSemantics,
  })),
  conclusion: artifact.conclusion,
}, null, 2));
