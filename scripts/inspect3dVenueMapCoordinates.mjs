#!/usr/bin/env node

/** Inspect coordinate metadata in current 3D Digital Venue map assets. */

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const mapUrl = typeof args.url === 'string' ? args.url : null;
const sectionId = typeof args.section === 'string' ? args.section : null;
const outputPath = typeof args.output === 'string' ? args.output : null;
if (!mapUrl || !sectionId || !outputPath) {
  throw new Error('Required: --url=URL --section=ID --output=PATH');
}

const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage();
let blockmapManifestUrl = null;
let resolveBlockmap;
const blockmapReady = new Promise((resolve) => { resolveBlockmap = resolve; });

page.on('response', (response) => {
  if (/\/maps\/blockmap\/master_full\.json(?:[?#]|$)/.test(response.url())) {
    blockmapManifestUrl ??= response.url();
    resolveBlockmap(blockmapManifestUrl);
  }
});

function withTimeout(promise, milliseconds, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(
      () => reject(new Error(`Timed out waiting for ${label}`)),
      milliseconds,
    )),
  ]);
}

function hashText(value) {
  return createHash('sha256').update(value).digest('hex');
}

try {
  await page.goto(mapUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await withTimeout(blockmapReady, 30_000, 'blockmap manifest');
  const assets = await page.evaluate(async ({ blockmapUrl, targetSection }) => {
    const parsed = new URL(blockmapUrl);
    const marker = '/maps/blockmap/master_full.json';
    const markerIndex = parsed.pathname.indexOf(marker);
    if (markerIndex < 0) throw new Error('Unexpected blockmap URL');
    const mapRoot = `${parsed.origin}${parsed.pathname.slice(0, markerIndex)}/maps`;
    const version = parsed.searchParams.get('v');
    const suffix = version ? `?v=${encodeURIComponent(version)}` : '';
    const urls = {
      blockmapManifest: `${mapRoot}/blockmap/master_full.json${suffix}`,
      blockmapSvg: `${mapRoot}/blockmap/mainlayer.svg${suffix}`,
      sectionManifest: `${mapRoot}/${encodeURIComponent(`S_${targetSection}`)}/master_full.json${suffix}`,
      sectionSvg: `${mapRoot}/${encodeURIComponent(`S_${targetSection}`)}/mainlayer.svg${suffix}`,
    };
    const entries = await Promise.all(Object.entries(urls).map(async ([key, url]) => {
      const response = await fetch(url, { credentials: 'include' });
      return [key, {
        url,
        status: response.status,
        text: response.ok ? await response.text() : null,
      }];
    }));
    return Object.fromEntries(entries);
  }, { blockmapUrl: blockmapManifestUrl, targetSection: sectionId });

  const blockmapGeometry = await page.evaluate((svgMarkup) => {
    const host = document.createElement('div');
    host.style.position = 'absolute';
    host.style.left = '-100000px';
    host.style.top = '-100000px';
    host.innerHTML = svgMarkup;
    document.body.appendChild(host);
    const svg = host.querySelector('svg');
    if (!svg) throw new Error('Blockmap SVG did not parse');
    const rootAttributes = Object.fromEntries(
      Array.from(svg.attributes, (attribute) => [attribute.name, attribute.value]),
    );
    const elements = Array.from(svg.querySelectorAll(
      'path,polygon,polyline,rect,circle,ellipse,line,text,image,use',
    )).flatMap((element, documentIndex) => {
      if (!(element instanceof SVGGraphicsElement)) return [];
      let bounds;
      try {
        const box = element.getBBox();
        bounds = [box.x, box.y, box.width, box.height];
      } catch {
        return [];
      }
      const id = element.id || null;
      const sectionIdNode = id?.startsWith('S_') ?? false;
      const ancestorSection = element.parentElement?.closest?.('[id^="S_"]')?.id ?? null;
      return [{
        documentIndex,
        tagName: element.tagName,
        id,
        ancestorSection,
        sectionIdNode,
        text: element.textContent?.trim().slice(0, 160) || null,
        href: element.getAttribute('href') ?? element.getAttribute('xlink:href'),
        bounds,
        area: bounds[2] * bounds[3],
      }];
    });
    host.remove();
    const nonSectionElements = elements.filter(
      (element) => !element.sectionIdNode && element.ancestorSection === null,
    );
    return {
      rootAttributes,
      elementCount: elements.length,
      sectionElementCount: elements.filter((element) => element.sectionIdNode).length,
      textElements: nonSectionElements.filter((element) => element.tagName === 'text'),
      identifiedElements: nonSectionElements.filter((element) => element.id !== null),
      largestUnidentifiedElements: nonSectionElements
        .filter((element) => element.id === null)
        .toSorted((left, right) => right.area - left.area)
        .slice(0, 200),
    };
  }, assets.blockmapSvg.text);

  function summarizeManifest(text, targetSection) {
    const manifest = JSON.parse(text);
    const nodes = Array.isArray(manifest.n) ? manifest.n : [];
    const seatNodes = nodes
      .filter((group) => group?.h?.t === 'seat' && Array.isArray(group?.n))
      .flatMap((group) => group.n)
      .filter((node) => Array.isArray(node?.c));
    const targetNodes = nodes
      .flatMap((group) => Array.isArray(group?.n) ? group.n : [])
      .filter((node) => node?.i === `S_${targetSection}` || node?.i === targetSection);
    return {
      keys: Object.keys(manifest),
      specification: manifest.s ?? null,
      configuration: manifest.c ?? null,
      layers: manifest.l ?? null,
      metadata: manifest.m ?? null,
      options: manifest.o ?? null,
      groupHeaders: nodes.map((group) => group?.h ?? null),
      targetNodes,
      seatNodeCount: seatNodes.length,
      seatCoordinateBounds: seatNodes.length > 0 ? [0, 1].map((axis) => ({
        minimum: Math.min(...seatNodes.map((node) => node.c[axis])),
        maximum: Math.max(...seatNodes.map((node) => node.c[axis])),
      })) : null,
      firstSeatNodes: seatNodes.slice(0, 5),
    };
  }

  function summarizeSvg(text, targetSection) {
    const rootMatch = text.match(/<svg\b([^>]*)>/i);
    const idPattern = new RegExp(`<[^>]+\\bid=["']S_${targetSection.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'i');
    const targetMatch = text.match(idPattern);
    return {
      rootTag: rootMatch?.[0] ?? null,
      targetOpeningTag: targetMatch?.[0] ?? null,
      characterCount: text.length,
    };
  }

  const artifact = {
    schemaVersion: 1,
    artifactKind: 'venue-map-coordinate-inspection',
    inspectedOn: new Date().toISOString(),
    mapUrl,
    finalMapUrl: page.url(),
    sectionId,
    assets: Object.fromEntries(Object.entries(assets).map(([key, asset]) => [key, {
      url: asset.url,
      status: asset.status,
      sha256: asset.text === null ? null : hashText(asset.text),
      summary: asset.text === null ? null : key.endsWith('Manifest')
        ? summarizeManifest(asset.text, sectionId)
        : summarizeSvg(asset.text, sectionId),
    }])),
    blockmapGeometry,
    interpretation: {
      georeferenced: false,
      publicationEligible: false,
    },
  };
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({
    outputPath,
    sectionId,
    blockmap: artifact.assets.blockmapManifest.summary,
    sectionMap: artifact.assets.sectionManifest.summary,
    blockmapSvg: artifact.assets.blockmapSvg.summary,
    blockmapGeometry: artifact.blockmapGeometry,
    sectionSvg: artifact.assets.sectionSvg.summary,
  }, null, 2));
} finally {
  await browser.close();
}
