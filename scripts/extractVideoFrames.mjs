#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { chromium } from 'playwright';

function usage() {
  throw new Error('Usage: node scripts/extractVideoFrames.mjs INPUT_VIDEO OUTPUT_DIRECTORY [SECONDS ...]');
}

async function sha256(filePath) {
  const data = await readFile(filePath);
  return createHash('sha256').update(data).digest('hex');
}

const [, , inputArgument, outputArgument, ...remainingArguments] = process.argv;
if (!inputArgument || !outputArgument) usage();
const manifestArgument = remainingArguments.find((value) => value.startsWith('--manifest='));
const manifestPath = manifestArgument
  ? path.resolve(manifestArgument.slice('--manifest='.length))
  : null;
const secondsArguments = remainingArguments.filter((value) => !value.startsWith('--manifest='));

const input = path.resolve(inputArgument);
const outputDirectory = path.resolve(outputArgument);
await mkdir(outputDirectory, { recursive: true });
const inputStats = await stat(input);
const server = createServer((request, response) => {
  if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end('<!doctype html><html><body style="margin:0;background:black"><video muted playsinline preload="auto" src="/video"></video></body></html>');
    return;
  }
  if (request.url !== '/video') {
    response.writeHead(404);
    response.end();
    return;
  }
  const range = request.headers.range;
  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (!match) {
      response.writeHead(416);
      response.end();
      return;
    }
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : inputStats.size - 1;
    if (start < 0 || end < start || end >= inputStats.size) {
      response.writeHead(416, { 'Content-Range': `bytes */${inputStats.size}` });
      response.end();
      return;
    }
    response.writeHead(206, {
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Range': `bytes ${start}-${end}/${inputStats.size}`,
      'Content-Type': 'video/mp4',
    });
    createReadStream(input, { start, end }).pipe(response);
    return;
  }
  response.writeHead(200, {
    'Accept-Ranges': 'bytes',
    'Content-Length': inputStats.size,
    'Content-Type': 'video/mp4',
  });
  createReadStream(input).pipe(response);
});
await new Promise((resolve, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', resolve);
});
const serverAddress = server.address();
if (!serverAddress || typeof serverAddress === 'string') {
  throw new Error('Could not start loopback video server');
}
const executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  headless: true,
  executablePath,
  args: ['--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'],
});

try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto(`http://127.0.0.1:${serverAddress.port}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => {
    const video = document.querySelector('video');
    return video && Number.isFinite(video.duration) && video.duration > 0 && video.videoWidth > 0;
  }, null, { timeout: 30_000 });
  const metadata = await page.locator('video').evaluate((video) => ({
    durationSeconds: video.duration,
    width: video.videoWidth,
    height: video.videoHeight,
  }));
  await page.setViewportSize({ width: metadata.width, height: metadata.height });
  await page.locator('video').evaluate((video, dimensions) => {
    video.style.width = `${dimensions.width}px`;
    video.style.height = `${dimensions.height}px`;
    video.pause();
  }, metadata);
  const defaultFractions = [0.05, 0.20, 0.35, 0.50, 0.65, 0.80, 0.95];
  const requestedSeconds = secondsArguments.length > 0
    ? [...new Set(secondsArguments.map(Number))].sort((left, right) => left - right)
    : defaultFractions.map((fraction) => metadata.durationSeconds * fraction);
  if (requestedSeconds.some((seconds) => !Number.isFinite(seconds) || seconds < 0 || seconds > metadata.durationSeconds)) {
    throw new Error(`Frame seconds must be within 0 and ${metadata.durationSeconds}`);
  }

  const frames = [];
  for (let index = 0; index < requestedSeconds.length; index += 1) {
    const requested = requestedSeconds[index];
    const actualSeconds = await page.locator('video').evaluate(async (video, seconds) => {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Video seek timed out')), 15_000);
        const finish = () => {
          clearTimeout(timeout);
          resolve();
        };
        video.addEventListener('seeked', finish, { once: true });
        video.currentTime = seconds;
        if (Math.abs(video.currentTime - seconds) < 0.001 && video.readyState >= 2) finish();
      });
      return video.currentTime;
    }, requested);
    const fileName = `frame-${String(index + 1).padStart(2, '0')}-${actualSeconds.toFixed(2).padStart(6, '0')}s.png`;
    const output = path.join(outputDirectory, fileName);
    await page.locator('video').screenshot({ path: output, type: 'png' });
    frames.push({
      fraction: requested / metadata.durationSeconds,
      requestedSeconds: requested,
      actualSeconds,
      file: output,
      sha256: await sha256(output),
    });
  }
  const serialized = `${JSON.stringify({
    schemaVersion: 1,
    input,
    inputSha256: await sha256(input),
    durationSeconds: metadata.durationSeconds,
    frameSizePixels: [metadata.width, metadata.height],
    frames,
  }, null, 2)}\n`;
  if (manifestPath) {
    await mkdir(path.dirname(manifestPath), { recursive: true });
    await writeFile(manifestPath, serialized, 'utf8');
  }
  process.stdout.write(serialized);
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
