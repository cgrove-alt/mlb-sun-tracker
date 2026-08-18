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
if (parsed.protocol !== 'https:' || parsed.hostname !== 'www.phila.gov') {
  throw new Error('Only official www.phila.gov HTTPS resources are accepted');
}
const response = await fetch(sourceUrl, {
  redirect: 'follow',
  headers: {
    Accept: 'application/pdf,text/plain,text/html,*/*',
    'User-Agent': 'theshadium-current-geometry-audit/1.0',
  },
});
if (!response.ok) throw new Error(`Official Philadelphia resource returned HTTP ${response.status}`);
const resolved = new URL(response.url);
if (resolved.protocol !== 'https:' || resolved.hostname !== 'www.phila.gov') {
  throw new Error(`Unexpected resource redirect: ${response.url}`);
}
const bytes = Buffer.from(await response.arrayBuffer());
const sha256 = createHash('sha256').update(bytes).digest('hex');
const output = path.resolve(outputArgument);
const manifestPath = path.resolve(manifestArgument);
await mkdir(path.dirname(output), { recursive: true });
await writeFile(output, bytes);
const stable = {
  sourceUrl,
  resolvedUrl: response.url,
  output,
  byteLength: bytes.length,
  sha256,
  responseHeaders: {
    date: response.headers.get('date'),
    lastModified: response.headers.get('last-modified'),
    etag: response.headers.get('etag'),
    contentType: response.headers.get('content-type'),
  },
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'official-philadelphia-resource-acquisition',
  artifactVersion: `sha256:${createHash('sha256')
    .update(JSON.stringify(stable))
    .digest('hex')}`,
  retrievedOn: new Date().toISOString(),
  ...stable,
};
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ manifestPath, ...stable, artifactVersion: artifact.artifactVersion }, null, 2));
