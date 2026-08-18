#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createWriteStream } from 'node:fs';
import { access, mkdir, rename, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createInflateRaw } from 'node:zlib';

const args = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const match = argument.match(/^--([^=]+)=(.*)$/);
  return match ? [match[1], match[2]] : [argument.replace(/^--/, ''), true];
}));
const archiveUrl = typeof args.url === 'string' ? args.url : null;
const matchText = typeof args.match === 'string' ? args.match : null;
const outputPath = typeof args.output === 'string' ? path.resolve(args.output) : null;
const manifestPath = typeof args.manifest === 'string'
  ? path.resolve(args.manifest)
  : outputPath
    ? `${outputPath}.acquisition.json`
    : null;
if (!archiveUrl || !matchText) {
  console.error('Required: --url=URL --match=TEXT [--output=PATH] [--manifest=PATH]');
  process.exit(2);
}

const signatures = {
  endOfCentralDirectory: 0x06054b50,
  zip64EndOfCentralDirectory: 0x06064b50,
  zip64Locator: 0x07064b50,
  centralDirectory: 0x02014b50,
  localFile: 0x04034b50,
};

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

function uint64(buffer, offset) {
  const value = buffer.readBigUInt64LE(offset);
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error(`ZIP64 value exceeds JavaScript safe integer range: ${value}`);
  }
  return Number(value);
}

function findLastSignature(buffer, signature) {
  for (let offset = buffer.length - 4; offset >= 0; offset -= 1) {
    if (buffer.readUInt32LE(offset) === signature) return offset;
  }
  return -1;
}

async function fetchHead(url) {
  const response = await fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
    headers: { 'user-agent': 'mlb-sun-tracker-remote-zip-entry/1.0' },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for HEAD ${url}`);
  const contentLength = Number(response.headers.get('content-length'));
  if (!Number.isSafeInteger(contentLength) || contentLength <= 0) {
    throw new Error(`Archive content length is absent or invalid: ${contentLength}`);
  }
  if (!/bytes/i.test(response.headers.get('accept-ranges') ?? '')) {
    throw new Error('Archive server does not advertise byte-range support');
  }
  return {
    resolvedUrl: response.url,
    contentLength,
    acceptRanges: response.headers.get('accept-ranges'),
    contentType: response.headers.get('content-type'),
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
  };
}

async function fetchRange(url, start, end) {
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start) {
    throw new Error(`Invalid byte range ${start}-${end}`);
  }
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      range: `bytes=${start}-${end}`,
      'user-agent': 'mlb-sun-tracker-remote-zip-entry/1.0',
    },
  });
  if (response.status !== 206) {
    throw new Error(`Expected HTTP 206 for ${start}-${end}, received ${response.status}`);
  }
  const contentRange = response.headers.get('content-range');
  if (!contentRange?.startsWith(`bytes ${start}-${end}/`)) {
    throw new Error(`Unexpected Content-Range for ${start}-${end}: ${contentRange}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  const expectedLength = end - start + 1;
  if (bytes.length !== expectedLength) {
    throw new Error(`Range ${start}-${end} returned ${bytes.length}, expected ${expectedLength}`);
  }
  return bytes;
}

async function fetchRangeResponse(url, start, end) {
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start) {
    throw new Error(`Invalid byte range ${start}-${end}`);
  }
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {
      range: `bytes=${start}-${end}`,
      'user-agent': 'mlb-sun-tracker-remote-zip-entry/1.0',
    },
  });
  if (response.status !== 206 || !response.body) {
    throw new Error(`Expected streaming HTTP 206 for ${start}-${end}, received ${response.status}`);
  }
  const contentRange = response.headers.get('content-range');
  if (!contentRange?.startsWith(`bytes ${start}-${end}/`)) {
    throw new Error(`Unexpected Content-Range for ${start}-${end}: ${contentRange}`);
  }
  const expectedLength = end - start + 1;
  const contentLength = Number(response.headers.get('content-length'));
  if (contentLength !== expectedLength) {
    throw new Error(`Range response length ${contentLength} does not match ${expectedLength}`);
  }
  return { response, expectedLength };
}

function parseZip64Extra(extra, placeholders) {
  const output = {};
  for (let offset = 0; offset + 4 <= extra.length;) {
    const fieldId = extra.readUInt16LE(offset);
    const fieldSize = extra.readUInt16LE(offset + 2);
    const valueStart = offset + 4;
    const valueEnd = valueStart + fieldSize;
    if (valueEnd > extra.length) throw new Error('Malformed ZIP extra field');
    if (fieldId === 0x0001) {
      let cursor = valueStart;
      for (const key of ['uncompressedSize', 'compressedSize', 'localHeaderOffset']) {
        if (!placeholders[key]) continue;
        if (cursor + 8 > valueEnd) throw new Error(`ZIP64 extra field omits ${key}`);
        output[key] = uint64(extra, cursor);
        cursor += 8;
      }
      return output;
    }
    offset = valueEnd;
  }
  return output;
}

function parseCentralDirectory(buffer, expectedEntries) {
  const entries = [];
  for (let offset = 0; offset < buffer.length;) {
    if (buffer.readUInt32LE(offset) !== signatures.centralDirectory) {
      throw new Error(`Central-directory signature mismatch at byte ${offset}`);
    }
    const compressionMethod = buffer.readUInt16LE(offset + 10);
    const crc32 = buffer.readUInt32LE(offset + 16);
    const compressedSize32 = buffer.readUInt32LE(offset + 20);
    const uncompressedSize32 = buffer.readUInt32LE(offset + 24);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset32 = buffer.readUInt32LE(offset + 42);
    const variableStart = offset + 46;
    const fileNameEnd = variableStart + fileNameLength;
    const extraEnd = fileNameEnd + extraLength;
    const entryEnd = extraEnd + commentLength;
    if (entryEnd > buffer.length) throw new Error('Central-directory entry exceeds buffer');
    const fileName = buffer.subarray(variableStart, fileNameEnd).toString('utf8');
    const zip64 = parseZip64Extra(buffer.subarray(fileNameEnd, extraEnd), {
      uncompressedSize: uncompressedSize32 === 0xffffffff,
      compressedSize: compressedSize32 === 0xffffffff,
      localHeaderOffset: localHeaderOffset32 === 0xffffffff,
    });
    entries.push({
      fileName,
      compressionMethod,
      crc32,
      compressedSize: zip64.compressedSize ?? compressedSize32,
      uncompressedSize: zip64.uncompressedSize ?? uncompressedSize32,
      localHeaderOffset: zip64.localHeaderOffset ?? localHeaderOffset32,
    });
    offset = entryEnd;
  }
  if (entries.length !== expectedEntries) {
    throw new Error(`Parsed ${entries.length} central entries, expected ${expectedEntries}`);
  }
  return entries;
}

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
  }
  return value >>> 0;
});

function updateCrc32(state, buffer) {
  let value = state;
  for (const byte of buffer) value = crcTable[(value ^ byte) & 0xff] ^ (value >>> 8);
  return value >>> 0;
}

const archive = await fetchHead(archiveUrl);
const tailLength = Math.min(1024 * 1024, archive.contentLength);
const tailStart = archive.contentLength - tailLength;
const tail = await fetchRange(archive.resolvedUrl, tailStart, archive.contentLength - 1);
const eocdOffset = findLastSignature(tail, signatures.endOfCentralDirectory);
if (eocdOffset < 0) throw new Error('ZIP end-of-central-directory record was not found');

let entryCount = tail.readUInt16LE(eocdOffset + 10);
let centralDirectorySize = tail.readUInt32LE(eocdOffset + 12);
let centralDirectoryOffset = tail.readUInt32LE(eocdOffset + 16);
const usesZip64 = entryCount === 0xffff
  || centralDirectorySize === 0xffffffff
  || centralDirectoryOffset === 0xffffffff;
if (usesZip64) {
  const locatorOffset = findLastSignature(
    tail.subarray(0, eocdOffset),
    signatures.zip64Locator,
  );
  if (locatorOffset < 0) throw new Error('ZIP64 locator was not found');
  const zip64EndOffset = uint64(tail, locatorOffset + 8);
  const zip64End = await fetchRange(archive.resolvedUrl, zip64EndOffset, zip64EndOffset + 55);
  if (zip64End.readUInt32LE(0) !== signatures.zip64EndOfCentralDirectory) {
    throw new Error('ZIP64 end-of-central-directory signature mismatch');
  }
  entryCount = uint64(zip64End, 32);
  centralDirectorySize = uint64(zip64End, 40);
  centralDirectoryOffset = uint64(zip64End, 48);
}

const centralDirectory = await fetchRange(
  archive.resolvedUrl,
  centralDirectoryOffset,
  centralDirectoryOffset + centralDirectorySize - 1,
);
const entries = parseCentralDirectory(centralDirectory, entryCount);
const normalizedMatch = matchText.toLowerCase();
const matches = entries.filter((entry) => entry.fileName.toLowerCase().includes(normalizedMatch));
if (!outputPath) {
  console.log(JSON.stringify({
    archive,
    zip64: usesZip64,
    entryCount,
    centralDirectorySize,
    matchText,
    matches,
  }, null, 2));
  process.exit(matches.length > 0 ? 0 : 1);
}
if (matches.length !== 1) {
  throw new Error(`Expected exactly one matching archive entry, received ${matches.length}`);
}
const entry = matches[0];
const localHeader = await fetchRange(
  archive.resolvedUrl,
  entry.localHeaderOffset,
  entry.localHeaderOffset + 29,
);
if (localHeader.readUInt32LE(0) !== signatures.localFile) {
  throw new Error('Local-file header signature mismatch');
}
const localFileNameLength = localHeader.readUInt16LE(26);
const localExtraLength = localHeader.readUInt16LE(28);
const dataStart = entry.localHeaderOffset + 30 + localFileNameLength + localExtraLength;
const dataEnd = dataStart + entry.compressedSize - 1;
const { response: entryResponse, expectedLength: expectedCompressedLength } =
  await fetchRangeResponse(
  archive.resolvedUrl,
  dataStart,
  dataEnd,
);
if (![0, 8].includes(entry.compressionMethod)) {
  throw new Error(`Unsupported ZIP compression method ${entry.compressionMethod}`);
}
try {
  await access(outputPath);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
if (await access(outputPath).then(() => true, () => false)) {
  throw new Error(`Output already exists: ${outputPath}`);
}
await mkdir(path.dirname(outputPath), { recursive: true });
const partialPath = `${outputPath}.partial-${process.pid}`;
let compressedByteLength = 0;
let uncompressedByteLength = 0;
let crcState = 0xffffffff;
const outputHash = createHash('sha256');
const compressedCounter = new Transform({
  transform(chunk, encoding, callback) {
    compressedByteLength += chunk.length;
    callback(null, chunk);
  },
});
const outputVerifier = new Transform({
  transform(chunk, encoding, callback) {
    uncompressedByteLength += chunk.length;
    crcState = updateCrc32(crcState, chunk);
    outputHash.update(chunk);
    callback(null, chunk);
  },
});
try {
  const source = Readable.fromWeb(entryResponse.body);
  const destination = createWriteStream(partialPath, { flags: 'wx' });
  if (entry.compressionMethod === 8) {
    await pipeline(source, compressedCounter, createInflateRaw(), outputVerifier, destination);
  } else {
    await pipeline(source, compressedCounter, outputVerifier, destination);
  }
} catch (error) {
  await unlink(partialPath).catch(() => {});
  throw error;
}
if (compressedByteLength !== expectedCompressedLength) {
  await unlink(partialPath).catch(() => {});
  throw new Error(
    `Compressed size ${compressedByteLength} does not match ${expectedCompressedLength}`,
  );
}
if (uncompressedByteLength !== entry.uncompressedSize) {
  await unlink(partialPath).catch(() => {});
  throw new Error(
    `Uncompressed size ${uncompressedByteLength} does not match ${entry.uncompressedSize}`,
  );
}
const actualCrc32 = (crcState ^ 0xffffffff) >>> 0;
if (actualCrc32 !== entry.crc32) {
  await unlink(partialPath).catch(() => {});
  throw new Error(
    `CRC-32 ${actualCrc32.toString(16)} does not match ${entry.crc32.toString(16)}`,
  );
}
const outputSha256 = outputHash.digest('hex');
await rename(partialPath, outputPath);

const stable = {
  analysisVersion: 'remote-zip64-entry-acquisition-v1',
  archive,
  zip64: usesZip64,
  archiveEntryCount: entryCount,
  centralDirectorySize,
  entry,
  dataRange: [dataStart, dataEnd],
  output: {
    path: path.relative(process.cwd(), outputPath),
    byteLength: uncompressedByteLength,
    sha256: outputSha256,
    crc32: actualCrc32.toString(16).padStart(8, '0'),
  },
  publicationEligible: false,
  note: 'This is a checksum-verified source acquisition, not interpreted metric geometry.',
};
const artifact = {
  schemaVersion: 1,
  artifactKind: 'remote-zip-entry-acquisition',
  artifactVersion: `sha256:${sha256(JSON.stringify(canonicalJson(stable)))}`,
  acquiredAt: new Date().toISOString(),
  ...stable,
};
await mkdir(path.dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({
  outputPath,
  manifestPath,
  artifactVersion: artifact.artifactVersion,
  entry,
  output: artifact.output,
}, null, 2));
