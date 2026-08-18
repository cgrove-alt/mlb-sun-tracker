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
const method = (argument('method') ?? 'GET').toUpperCase();
if (!sourceUrl || !outputArgument || !manifestArgument) {
  throw new Error('Usage: --url=URL --output=FILE --manifest=FILE');
}
const parsed = new URL(sourceUrl);
const allowedHost = parsed.hostname === 'www.mlb.com'
  || parsed.hostname.endsWith('.mlb.com')
  || parsed.hostname.endsWith('.mlbstatic.com')
  || parsed.hostname === 'premium.cleguardians.com';
if (parsed.protocol !== 'https:' || !allowedHost) {
  throw new Error('Only approved first-party team HTTPS resources are accepted');
}
if (!['GET', 'POST'].includes(method)) {
  throw new Error('Only GET and bodyless POST acquisitions are supported');
}
const response = await fetch(sourceUrl, {
  method,
  redirect: 'follow',
  headers: {
    Accept: 'application/json,text/plain,text/html,*/*',
    'User-Agent': 'theshadium-current-structure-audit/1.0',
  },
});
if (!response.ok) throw new Error(`Official team resource returned HTTP ${response.status}`);
const resolved = new URL(response.url);
const resolvedAllowedHost = resolved.hostname === 'www.mlb.com'
  || resolved.hostname.endsWith('.mlb.com')
  || resolved.hostname.endsWith('.mlbstatic.com')
  || resolved.hostname === 'premium.cleguardians.com';
if (resolved.protocol !== 'https:' || !resolvedAllowedHost) {
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
  method,
  resolvedUrl: response.url,
  retrievedOn: new Date().toISOString(),
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
  artifactKind: 'official-team-resource-acquisition',
  artifactVersion: `sha256:${createHash('sha256').update(JSON.stringify(stable)).digest('hex')}`,
  ...stable,
};
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  manifestPath,
  ...stable,
  artifactVersion: artifact.artifactVersion,
}, null, 2));
