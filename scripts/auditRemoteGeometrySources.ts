import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { MLB_STADIUMS } from '../src/data/stadiums';
import {
  searchBboxAroundPoint,
  summarizeLidarCoverage,
  type LidarCoverageSummary,
  type TnmLidarResponse,
} from '../src/data/remoteGeometrySourceAudit';

const TNM_PRODUCTS_URL = 'https://tnmaccess.nationalmap.gov/api/v1/products';
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_RESULTS = 100;

interface StadiumAuditResult {
  stadiumId: string;
  stadiumName: string;
  latitude: number;
  longitude: number;
  provider: 'USGS 3DEP' | 'not-applicable';
  status: 'candidate-found' | 'no-complete-footprint-coverage' | 'not-usgs-jurisdiction' | 'request-failed';
  coverage: LidarCoverageSummary | null;
  requestUrl?: string;
  responseSha256?: string;
  error?: string;
}

function parseStadiumFilter(): string | null {
  const argument = process.argv.find((value) => value.startsWith('--stadium='));
  return argument?.split('=')[1] ?? null;
}

function parseOutputPath(): string | null {
  const argument = process.argv.find((value) => value.startsWith('--output='));
  return argument?.slice('--output='.length) || null;
}

function requestUrl(longitude: number, latitude: number): string {
  const params = new URLSearchParams({
    bbox: searchBboxAroundPoint(longitude, latitude).join(','),
    datasets: 'Lidar Point Cloud (LPC)',
    prodFormats: 'LAS,LAZ',
    max: String(MAX_RESULTS),
    outputFormat: 'JSON',
  });
  return `${TNM_PRODUCTS_URL}?${params.toString()}`;
}

async function fetchJsonWithRetry(url: string): Promise<TnmLidarResponse> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json', 'User-Agent': 'theshadium-remote-geometry-audit/1.0' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error(`USGS request failed with HTTP ${response.status}`);
      const payload = await response.json() as Partial<TnmLidarResponse> & {
        error?: unknown;
        toastMessage?: unknown;
      };
      if (!Array.isArray(payload.items) || !Number.isFinite(payload.total)) {
        const serviceMessage = typeof payload.toastMessage === 'string'
          ? payload.toastMessage
          : typeof payload.error === 'string'
            ? payload.error
            : 'response omitted items or total';
        throw new Error(`USGS returned malformed JSON: ${serviceMessage}`);
      }
      return payload as TnmLidarResponse;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
    } finally {
      clearTimeout(timeout);
    }
  }
  throw lastError;
}

async function auditStadium(stadium: (typeof MLB_STADIUMS)[number]): Promise<StadiumAuditResult> {
  if (stadium.state === 'ON') {
    return {
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      latitude: stadium.latitude,
      longitude: stadium.longitude,
      provider: 'not-applicable',
      status: 'not-usgs-jurisdiction',
      coverage: null,
    };
  }

  try {
    const sourceRequestUrl = requestUrl(stadium.longitude, stadium.latitude);
    const response = await fetchJsonWithRetry(sourceRequestUrl);
    const coverage = summarizeLidarCoverage(response, stadium.longitude, stadium.latitude);
    return {
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      latitude: stadium.latitude,
      longitude: stadium.longitude,
      provider: 'USGS 3DEP',
      requestUrl: sourceRequestUrl,
      responseSha256: createHash('sha256').update(JSON.stringify(response)).digest('hex'),
      status: coverage.completeFootprintCandidateAvailable
        ? 'candidate-found'
        : 'no-complete-footprint-coverage',
      coverage,
    };
  } catch (error) {
    return {
      stadiumId: stadium.id,
      stadiumName: stadium.name,
      latitude: stadium.latitude,
      longitude: stadium.longitude,
      provider: 'USGS 3DEP',
      status: 'request-failed',
      coverage: null,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function mapWithConcurrency<T, R>(
  values: readonly T[],
  concurrency: number,
  worker: (value: T) => Promise<R>,
): Promise<R[]> {
  const output = new Array<R>(values.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (cursor < values.length) {
      const index = cursor;
      cursor += 1;
      output[index] = await worker(values[index]);
    }
  }));
  return output;
}

async function main(): Promise<void> {
  const stadiumFilter = parseStadiumFilter();
  const outputPath = parseOutputPath();
  const stadiums = stadiumFilter
    ? MLB_STADIUMS.filter((stadium) => stadium.id === stadiumFilter)
    : MLB_STADIUMS;
  if (stadiums.length === 0) throw new Error(`Unknown stadium filter: ${stadiumFilter}`);

  const results = await mapWithConcurrency(stadiums, 3, auditStadium);
  if (outputPath) {
    const fingerprintInput = { provider: 'USGS 3DEP', results };
    const artifact = {
      schemaVersion: 1,
      artifactKind: 'mlb-remote-lidar-source-audit',
      artifactVersion: `sha256:${createHash('sha256')
        .update(JSON.stringify(fingerprintInput))
        .digest('hex')}`,
      auditedOn: new Date().toISOString(),
      results,
      summary: {
        stadiums: results.length,
        completeFootprintCandidates: results.filter((result) =>
          result.status === 'candidate-found').length,
        requestFailures: results.filter((result) => result.status === 'request-failed').length,
      },
      publication: {
        eligible: false,
        blockers: [
          'POINT_CLOUDS_NOT_ACQUIRED',
          'SEMANTIC_GEOMETRY_NOT_EXTRACTED',
          'SOURCE_CURRENCY_NOT_VERIFIED',
          'SHADOW_HOLDOUT_NOT_PASSED',
        ],
      },
    };
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(artifact, null, 2)}\n`, 'utf8');
    console.log(JSON.stringify({
      outputPath,
      artifactVersion: artifact.artifactVersion,
      summary: artifact.summary,
      publication: artifact.publication,
    }, null, 2));
    if (artifact.summary.requestFailures > 0) process.exitCode = 1;
    return;
  }
  if (process.argv.includes('--json')) {
    console.log(JSON.stringify({ auditedOn: new Date().toISOString(), results }, null, 2));
    return;
  }

  console.table(results.map((result) => ({
    stadium: result.stadiumId,
    status: result.status,
    centerTiles: result.coverage?.centerCoveringProductCount ?? 0,
    newestCenterPublication: result.coverage?.newestPublicationDate ?? '',
    newestCompleteProject: result.coverage?.newestCompleteFootprintProject
      ? `${result.coverage.newestCompleteFootprintProject.publicationDate ?? 'date-unknown'} ${result.coverage.newestCompleteFootprintProject.projectName}`
      : '',
    bestFootprintCoverage: result.coverage?.projectFootprintCoverage[0]
      ? `${result.coverage.projectFootprintCoverage[0].coveragePercent}% ${result.coverage.projectFootprintCoverage[0].projectName}`
      : '',
  })));
  const candidates = results.filter((result) => result.status === 'candidate-found').length;
  const failures = results.filter((result) => result.status === 'request-failed').length;
  console.log(`Remote lidar candidates: ${candidates}/${results.length}; request failures: ${failures}`);
  if (failures > 0) process.exitCode = 1;
}

void main();
