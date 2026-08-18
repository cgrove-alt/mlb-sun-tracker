#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

function argument(name) {
  const prefix = `--${name}=`;
  const value = process.argv.find((item) => item.startsWith(prefix));
  return value ? value.slice(prefix.length) : undefined;
}

const sourceUrl = argument('url');
const outputArgument = argument('output');
const manifestArgument = argument('manifest');
if (!sourceUrl || !outputArgument || !manifestArgument) {
  throw new Error('Usage: --url=URL --output=FILE --manifest=FILE');
}
const parsed = new URL(sourceUrl);
if (parsed.protocol !== 'https:' || parsed.hostname !== 'www.mlb.com') {
  throw new Error('Only HTTPS pages from www.mlb.com are accepted');
}
const response = await fetch(sourceUrl, {
  redirect: 'follow',
  headers: {
    Accept: 'text/html',
    'User-Agent': 'theshadium-current-structure-audit/1.0',
  },
});
if (!response.ok) throw new Error(`Official MLB page returned HTTP ${response.status}`);
const resolved = new URL(response.url);
if (resolved.protocol !== 'https:' || resolved.hostname !== 'www.mlb.com') {
  throw new Error(`Unexpected page redirect: ${response.url}`);
}
const html = await response.text();
const bytes = Buffer.from(html, 'utf8');
const sha256 = createHash('sha256').update(bytes).digest('hex');
const output = path.resolve(outputArgument);
const manifestPath = path.resolve(manifestArgument);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, bytes);
const stable = {
  sourceUrl,
  resolvedUrl: response.url,
  retrievedOn: new Date().toISOString(),
  output,
  byteLength: bytes.length,
  sha256,
  responseHeaders: {
    date: response.headers.get('date'),
    lastModified: response.headers.get('last-modified'),
    etag: response.headers.get('etag'),
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'official-mlb-page-acquisition',
  artifactVersion: `sha256:${createHash('sha256').update(JSON.stringify(stable)).digest('hex')}`,
  ...stable,
};
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ manifestPath, ...stable, artifactVersion: artifact.artifactVersion }, null, 2));
