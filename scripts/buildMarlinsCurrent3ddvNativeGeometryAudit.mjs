#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

function option(name, fallback) {
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
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(
      `${label}: expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}`,
    );
  }
}

function requireIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label}: required text was not found`);
  }
}

async function readLockedFile(inputPath, encoding = null) {
  const resolvedPath = path.resolve(inputPath);
  const bytes = await readFile(resolvedPath);
  return {
    path: path.relative(process.cwd(), resolvedPath),
    sha256: sha256(bytes),
    bytes,
    text: encoding ? bytes.toString(encoding) : null,
  };
}

async function readLockedJson(inputPath) {
  const input = await readLockedFile(inputPath, 'utf8');
  return {
    ...input,
    value: JSON.parse(input.text),
  };
}

function parseHeaders(value) {
  return Object.fromEntries(
    value
      .split(/\r?\n/)
      .filter((line) => line.includes(':'))
      .map((line) => {
        const separator = line.indexOf(':');
        return [
          line.slice(0, separator).trim().toLowerCase(),
          line.slice(separator + 1).trim(),
        ];
      }),
  );
}

function uniqueByUrl(records) {
  const byUrl = new Map();
  for (const record of records) {
    const current = byUrl.get(record.url);
    if (!current || record.jsonSummary || record.jsonShape) {
      byUrl.set(record.url, record);
    }
  }
  return [...byUrl.values()];
}

const sourceDirectory = option(
  'source-dir',
  'tmp/lidar/marlins-current-3ddv-viewer-source-audit-2026',
);
const paths = {
  viewerHtml: option('viewer-html', `${sourceDirectory}/venues-marlins.html`),
  viewerHeaders: option('viewer-headers', `${sourceDirectory}/venues-marlins.headers.txt`),
  siteBundle: option('site-bundle', `${sourceDirectory}/main.js`),
  siteMaster: option('site-master', `${sourceDirectory}/master.json`),
  siteMasterHeaders: option('site-master-headers', `${sourceDirectory}/master.headers.txt`),
  dvmManager: option('dvm-manager', `${sourceDirectory}/dvm-core-stable.js`),
  dvmManagerHeaders: option(
    'dvm-manager-headers',
    `${sourceDirectory}/dvm-core-stable.js.headers.txt`,
  ),
  dvm3dModule: option('dvm-3d-module', `${sourceDirectory}/dvm-3d-viewer.js`),
  dvm3dModuleHeaders: option(
    'dvm-3d-module-headers',
    `${sourceDirectory}/dvm-3d-viewer.headers.txt`,
  ),
  viewer3dRuntime: option('viewer3d-runtime', `${sourceDirectory}/viewer3d-stable.js`),
  viewer3dRuntimeHeaders: option(
    'viewer3d-runtime-headers',
    `${sourceDirectory}/viewer3d-stable.headers.txt`,
  ),
  section4ResourceTrace: option(
    'section4-resource-trace',
    'tmp/lidar/marlins-current-3ddv-viewer-resource-audit-sec4-rowJ-v1.json',
  ),
  section4PanoramaManifest: option(
    'section4-panorama-manifest',
    'tmp/lidar/marlins-current-3ddv-sec4-panoramas-v1/manifest.json',
  ),
  output: option(
    'output',
    'tmp/lidar/marlins-current-3ddv-native-geometry-audit-v1-2026.json',
  ),
};

const [
  viewerHtml,
  viewerHeaders,
  siteBundle,
  siteMaster,
  siteMasterHeaders,
  dvmManager,
  dvmManagerHeaders,
  dvm3dModule,
  dvm3dModuleHeaders,
  viewer3dRuntime,
  viewer3dRuntimeHeaders,
  section4ResourceTrace,
  section4PanoramaManifest,
] = await Promise.all([
  readLockedFile(paths.viewerHtml, 'utf8'),
  readLockedFile(paths.viewerHeaders, 'utf8'),
  readLockedFile(paths.siteBundle, 'utf8'),
  readLockedJson(paths.siteMaster),
  readLockedFile(paths.siteMasterHeaders, 'utf8'),
  readLockedFile(paths.dvmManager, 'utf8'),
  readLockedFile(paths.dvmManagerHeaders, 'utf8'),
  readLockedFile(paths.dvm3dModule, 'utf8'),
  readLockedFile(paths.dvm3dModuleHeaders, 'utf8'),
  readLockedFile(paths.viewer3dRuntime, 'utf8'),
  readLockedFile(paths.viewer3dRuntimeHeaders, 'utf8'),
  readLockedJson(paths.section4ResourceTrace),
  readLockedJson(paths.section4PanoramaManifest),
]);

requireIncludes(
  viewerHtml.text,
  'main.56a84ae06fd34a1e.js',
  'current viewer HTML application bundle',
);
requireIncludes(
  siteBundle.text,
  'this.bucketRoot="/sitesbuilder"',
  'site bundle public configuration root',
);
requireIncludes(
  siteBundle.text,
  '"/latest/master.json"',
  'site bundle public configuration filename',
);
requireEqual(
  siteMaster.value.mapConfig?.venue_id,
  'nam-us-10182-marlins',
  'site configuration venue identifier',
);
requireEqual(siteMaster.value.mapConfig?.map_id, 'blockmap', 'site configuration map');
requireIncludes(dvmManager.text, '@3ddv/dvm-module-manager v1.16.6', 'DVM manager version');
requireIncludes(
  dvmManager.text,
  'modules/3d_viewer',
  'DVM manager 3D viewer module route',
);
requireIncludes(
  dvm3dModule.text,
  '@3ddv/dvm-module-manager v1.16.6',
  'DVM 3D module manager version',
);
requireIncludes(
  dvm3dModule.text,
  '3d_viewer/v1/lib/{version}/viewer3d',
  'DVM 3D runtime route',
);
requireIncludes(
  viewer3dRuntime.text,
  '@3ddv/dvm-3d-viewer v1.6.18',
  '3D runtime version',
);
requireIncludes(viewer3dRuntime.text, 'case"mesh"', '3D runtime mesh support');
requireIncludes(viewer3dRuntime.text, 'space3d', '3D runtime space resource support');
requireIncludes(viewer3dRuntime.text, 'extra_type', '3D runtime extra resource support');
requireIncludes(viewer3dRuntime.text, 'DEPTH', '3D runtime depth support');

requireEqual(
  section4ResourceTrace.value.finalUrl,
  'https://preview.3ddigitalvenue.com/marlins',
  'Section 4 trace final URL',
);
requireEqual(
  section4ResourceTrace.value.auditedOn,
  '2026-08-11T10:09:40.511Z',
  'Section 4 trace date',
);
requireEqual(
  section4PanoramaManifest.value.artifactKind,
  'public-venue-panorama-geometry-research-input',
  'Section 4 panorama manifest kind',
);
requireEqual(
  section4PanoramaManifest.value.viewerVersion,
  '1.6.18',
  'Section 4 panorama viewer version',
);
requireEqual(
  section4PanoramaManifest.value.panoramaSet,
  'v1.2',
  'Section 4 panorama set',
);

const responseRecords = uniqueByUrl([
  ...(section4ResourceTrace.value.responses ?? []),
  ...(section4ResourceTrace.value.afterSearchResponses ?? []),
]);
const venueResponseRecords = responseRecords.filter((record) =>
  record.url.includes('nam-us-10182'),
);
const section4ConfigRecords = venueResponseRecords.filter((record) =>
  /\/viewer3d\/panos\/v1\.2\/S_SEC4-[^/]+\/config\.json(?:\?|$)/.test(record.url),
);
const section4TextureRecords = venueResponseRecords.filter((record) =>
  /\/viewer3d\/panos\/v1\.2\/S_SEC4-[^/]+\/spherical\/(?:hres|lres)\/pano\.jpg(?:\?|$)/
    .test(record.url),
);
const nativeGeometryPattern = /(?:mesh|depth|normal|space3d|\.(?:glb|gltf|obj|bin|fbx|dae)(?:\?|$))/i;
const nativeGeometryRecords = venueResponseRecords.filter((record) =>
  nativeGeometryPattern.test(record.url),
);

requireEqual(responseRecords.length, 157, 'unique Section 4 trace response count');
requireEqual(venueResponseRecords.length, 140, 'unique Marlins venue response count');
requireEqual(section4ConfigRecords.length, 127, 'unique Section 4 panorama config count');
requireEqual(section4TextureRecords.length, 2, 'unique Section 4 texture response count');
requireEqual(nativeGeometryRecords.length, 0, 'native geometry response count');

const expectedLegacyConfigKeys = ['p', 'pid', 'rc', 'rp', 'rs', 't', 'v'];
for (const record of section4ConfigRecords) {
  requireEqual(record.status, 200, `Section 4 config status for ${record.url}`);
  const config = record.jsonSummary?.value;
  requireEqual(Object.keys(config ?? {}).sort(), expectedLegacyConfigKeys, 'legacy config keys');
  requireEqual(config.t, 's', `legacy panorama type for ${config.pid}`);
  requireEqual(config.v, '2.0.0', `legacy panorama schema for ${config.pid}`);
  requireEqual(typeof config.pid, 'string', 'legacy panorama identifier type');
}

requireEqual(
  section4PanoramaManifest.value.images.length,
  5,
  'locked Section 4 metric panorama count',
);
for (const image of section4PanoramaManifest.value.images) {
  requireEqual(Object.keys(image.config).sort(), expectedLegacyConfigKeys, 'locked config keys');
  requireEqual(image.config.t, 's', `locked panorama type for ${image.config.pid}`);
  requireEqual(image.config.v, '2.0.0', `locked panorama schema for ${image.config.pid}`);
}

const sourceHeaders = {
  viewerHtml: parseHeaders(viewerHeaders.text),
  siteMaster: parseHeaders(siteMasterHeaders.text),
  dvmManager: parseHeaders(dvmManagerHeaders.text),
  dvm3dModule: parseHeaders(dvm3dModuleHeaders.text),
  viewer3dRuntime: parseHeaders(viewer3dRuntimeHeaders.text),
};
for (const [label, headers] of Object.entries(sourceHeaders)) {
  requireEqual(headers.date?.includes('11 Aug 2026'), true, `${label} response date`);
}

const lockedInput = (input, extra = {}) => ({
  path: input.path,
  sha256: input.sha256,
  ...extra,
});

const stable = {
  analysisVersion: 'marlins-current-3ddv-native-geometry-audit-v1',
  artifactKind: 'marlins-current-3ddv-native-geometry-audit',
  stadiumId: 'marlins',
  auditedOn: '2026-08-11',
  inputs: {
    viewerHtml: lockedInput(viewerHtml, {
      responseDate: sourceHeaders.viewerHtml.date,
      lastModified: sourceHeaders.viewerHtml['last-modified'],
      etag: sourceHeaders.viewerHtml.etag,
    }),
    viewerHeaders: lockedInput(viewerHeaders),
    siteBundle: lockedInput(siteBundle),
    siteMaster: lockedInput(siteMaster, {
      responseDate: sourceHeaders.siteMaster.date,
      lastModified: sourceHeaders.siteMaster['last-modified'],
      etag: sourceHeaders.siteMaster.etag,
    }),
    siteMasterHeaders: lockedInput(siteMasterHeaders),
    dvmManager: lockedInput(dvmManager, {
      responseDate: sourceHeaders.dvmManager.date,
      lastModified: sourceHeaders.dvmManager['last-modified'],
      etag: sourceHeaders.dvmManager.etag,
    }),
    dvmManagerHeaders: lockedInput(dvmManagerHeaders),
    dvm3dModule: lockedInput(dvm3dModule, {
      responseDate: sourceHeaders.dvm3dModule.date,
      lastModified: sourceHeaders.dvm3dModule['last-modified'],
      etag: sourceHeaders.dvm3dModule.etag,
    }),
    dvm3dModuleHeaders: lockedInput(dvm3dModuleHeaders),
    viewer3dRuntime: lockedInput(viewer3dRuntime, {
      responseDate: sourceHeaders.viewer3dRuntime.date,
      lastModified: sourceHeaders.viewer3dRuntime['last-modified'],
      etag: sourceHeaders.viewer3dRuntime.etag,
    }),
    viewer3dRuntimeHeaders: lockedInput(viewer3dRuntimeHeaders),
    section4ResourceTrace: lockedInput(section4ResourceTrace),
    section4PanoramaManifest: lockedInput(section4PanoramaManifest, {
      artifactVersion: section4PanoramaManifest.value.artifactVersion,
    }),
  },
  softwareVersions: {
    dvmModuleManager: '1.16.6',
    viewer3d: '1.6.18',
    venuePanoramaSchema: '2.0.0',
    venuePanoramaSet: 'v1.2',
  },
  rendererCapabilities: {
    supportsNativeMeshResourcesInGeneral: true,
    supportsSpace3dResourcesInGeneral: true,
    supportsDepthResourcesInGeneral: true,
    supportsNormalResourcesInGeneral: true,
    evidenceScope: 'runtime-capability-only',
  },
  marlinsVenueTrace: {
    traceAuditedOn: section4ResourceTrace.value.auditedOn,
    uniqueResponseCount: responseRecords.length,
    uniqueVenueResponseCount: venueResponseRecords.length,
    uniqueSection4PanoramaConfigCount: section4ConfigRecords.length,
    uniqueSection4SphericalTextureCount: section4TextureRecords.length,
    uniqueNativeGeometryResponseCount: nativeGeometryRecords.length,
    panoramaConfigKeys: expectedLegacyConfigKeys,
    panoramaTypeValues: ['s'],
    panoramaSchemaVersions: ['2.0.0'],
    requestedResourceKinds: [
      'venue-token',
      'viewer-config',
      'map-json',
      'map-svg',
      'panorama-camera-config-json',
      'spherical-panorama-jpeg',
    ],
    absentResourceKinds: [
      'depth-map',
      'normal-map',
      'native-mesh',
      'space3d-scene',
      'glb',
      'gltf',
      'obj',
      'binary-geometry',
    ],
  },
  finding: {
    status: 'current-marlins-viewer-native-obstruction-geometry-not-exposed',
    evidence: (
      'The current viewer runtime has general code paths for native mesh, space3d, depth, '
      + 'and normal resources. The current Marlins Section 4 trace instead returned 127 '
      + 'legacy panorama configs whose complete key set contains only version, camera '
      + 'position, camera rotations, spherical texture type, and panorama identifier. '
      + 'The live trace requested two spherical JPEG texture resources and zero native '
      + 'geometry, depth, normal, mesh, or space3d resources. Runtime capability does not '
      + 'establish that a venue-specific asset exists.'
    ),
  },
  geometryBoundary: {
    rendererSupportsNativeMeshResourcesInGeneral: true,
    marlinsVenueRequestedNativeMesh: false,
    marlinsVenueRequestedDepthMap: false,
    marlinsVenueRequestedNormalMap: false,
    marlinsVenueRequestedSpace3dScene: false,
    marlinsPanoramaConfigsExposeOnlyCameraPoseAndSphericalTexture: true,
    establishesCurrentNativeObstructionMesh: false,
    establishesCurrentMetricObstructionGeometry: false,
    establishesCompleteOverhangUndersides: false,
  },
  publication: {
    eligible: false,
    blockers: [
      'CURRENT_MARLINS_NATIVE_OBSTRUCTION_MESH_NOT_EXPOSED',
      'CURRENT_MARLINS_PANORAMA_DEPTH_NOT_EXPOSED',
      'CURRENT_METRIC_OVERHANG_UNDERSIDES_NOT_ESTABLISHED',
      'FULL_STADIUM_CURRENT_OBSTRUCTION_SCOPE_NOT_COMPLETE',
      'INDEPENDENT_SHADOW_HOLDOUT_NOT_PASSED',
    ],
  },
};

const artifact = {
  ...stable,
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
};

const outputPath = path.resolve(paths.output);
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');

console.log(JSON.stringify({
  output: path.relative(process.cwd(), outputPath),
  artifactVersion: artifact.artifactVersion,
  uniqueVenueResponseCount: artifact.marlinsVenueTrace.uniqueVenueResponseCount,
  uniqueSection4PanoramaConfigCount:
    artifact.marlinsVenueTrace.uniqueSection4PanoramaConfigCount,
  uniqueNativeGeometryResponseCount:
    artifact.marlinsVenueTrace.uniqueNativeGeometryResponseCount,
  publicationEligible: artifact.publication.eligible,
}, null, 2));
