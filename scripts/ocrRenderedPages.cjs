#!/usr/bin/env node

const fs = require('node:fs/promises');
const path = require('node:path');
const { createWorker } = require('tesseract.js');

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(2);
}

function parseOptions(argv) {
  const options = {
    inputDir: null,
    output: null,
    prefix: 'page-',
    cachePath: '/tmp/tesseract-cache',
    workers: 2,
  };
  for (let index = 2; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === '--input-dir') options.inputDir = argv[++index];
    else if (argument === '--output') options.output = argv[++index];
    else if (argument === '--prefix') options.prefix = argv[++index];
    else if (argument === '--cache-path') options.cachePath = argv[++index];
    else if (argument === '--workers') options.workers = Number(argv[++index]);
    else fail(`Unknown argument: ${argument}`);
  }
  if (!options.inputDir || !options.output) {
    fail('Usage: ocrRenderedPages.cjs --input-dir DIR --output FILE [--prefix page-] [--workers 2] [--cache-path DIR]');
  }
  if (!Number.isInteger(options.workers) || options.workers < 1 || options.workers > 8) {
    fail('--workers must be an integer from 1 through 8');
  }
  return options;
}

function numericPage(filename, prefix) {
  if (!filename.startsWith(prefix)) return null;
  const match = filename.slice(prefix.length).match(/^(\d+)\.(?:png|jpe?g|tiff?)$/i);
  return match ? Number(match[1]) : null;
}

async function main() {
  const options = parseOptions(process.argv);
  const names = await fs.readdir(options.inputDir);
  const pages = names
    .map((filename) => ({ filename, page: numericPage(filename, options.prefix) }))
    .filter(({ page }) => page !== null)
    .sort((left, right) => left.page - right.page);
  if (pages.length === 0) fail(`No rendered pages found in ${options.inputDir}`);
  for (let index = 0; index < pages.length; index += 1) {
    if (pages[index].page !== index + 1) {
      fail(`Expected page ${index + 1}, found page ${pages[index].page}`);
    }
  }

  const results = new Array(pages.length);
  let nextIndex = 0;
  let completed = 0;
  const runWorker = async (workerNumber) => {
    const worker = await createWorker('eng', 1, { cachePath: options.cachePath });
    try {
      while (true) {
        const index = nextIndex++;
        if (index >= pages.length) break;
        const inputPath = path.join(options.inputDir, pages[index].filename);
        const recognition = await worker.recognize(inputPath);
        results[index] = recognition.data.text.trimEnd();
        completed += 1;
        process.stdout.write(`OCR worker ${workerNumber}: page ${index + 1}/${pages.length}, completed ${completed}\n`);
      }
    } finally {
      await worker.terminate();
    }
  };

  await Promise.all(Array.from({ length: options.workers }, (_, index) => runWorker(index + 1)));
  const document = results
    .map((text, index) => `=== PAGE ${index + 1} ===\n${text}\n`)
    .join('\n');
  await fs.writeFile(options.output, document, 'utf8');
  process.stdout.write(`Wrote ${pages.length} OCR pages to ${options.output}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exit(1);
});
