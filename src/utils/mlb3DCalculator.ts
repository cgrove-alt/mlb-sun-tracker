// MLB 3D shade calculator
//
// Wraps OptimizedShadeCalculator3D + the stadium 3D model so the row-level
// shade API has a single async entry point when callers opt into 3D
// (`use3d=true`). Returns a flat result shape consumed by
// app/api/stadium/[stadiumId]/rows/shade/route.ts.
//
// Falls back to throwing a typed error when the stadium has no obstruction
// data — the route's catch block surfaces this as a 500, and the route only
// invokes this calculator when `hasSpecificData(stadiumId).hasObstructions`
// is already true, so under normal flow that error is unreachable.

import { MLB_STADIUMS, Stadium } from '../data/stadiums';
import { getStadium3DModel } from '../data/stadium3DGeometry';
import { getStadiumSections, hasSpecificData } from '../data/stadium-data-aggregator';
import {
  OptimizedShadeCalculator3D,
  SectionShadeResult,
  createSunPosition,
} from './shadeCalculation3DOptimized';
import { getSunPosition } from './sunCalculations';

export interface MLBStadiumShade3DOptions {
  useCache?: boolean;
  useWebWorkers?: boolean;
  lodLevel?: 'high' | 'medium' | 'low';
}

export interface MLBStadiumShade3DResult {
  sections: Map<string, SectionShadeResult>;
  sunPosition: { elevation: number; azimuth: number };
  calculationTime: number;
  fromCache: boolean;
}

const calculatorCache = new Map<string, OptimizedShadeCalculator3D>();
const resultCache = new Map<string, MLBStadiumShade3DResult>();

function getOrBuildCalculator(stadium: Stadium): OptimizedShadeCalculator3D {
  const cached = calculatorCache.get(stadium.id);
  if (cached) return cached;

  // getStadium3DModel takes the simpler StadiumSection shape; map the
  // detailed sections down to it so seat geometry is generated consistently
  // by the model builder.
  const detailed = getStadiumSections(stadium.id, 'MLB');
  const simpleSections = detailed.map((s) => ({
    id: s.id,
    name: s.name,
    level: (s.level === 'standing' ? 'lower' : s.level) as
      | 'field'
      | 'lower'
      | 'club'
      | 'upper'
      | 'suite',
    baseAngle: s.baseAngle,
    angleSpan: s.angleSpan,
    covered: s.covered,
    rows: s.rows?.length ?? undefined,
    price: s.price,
  }));

  const model = getStadium3DModel(stadium, simpleSections);
  const calculator = new OptimizedShadeCalculator3D(model, false);
  calculatorCache.set(stadium.id, calculator);
  return calculator;
}

export async function calculateMLBStadiumShade3D(
  stadiumId: string,
  _stadiumName: string,
  latitude: number,
  longitude: number,
  _orientation: number,
  /** UTC instant to compute the sun position for. Callers MUST do the
   *  stadium-local-time → UTC conversion themselves (see
   *  src/utils/stadiumTime.ts). Passing a Date that was constructed via
   *  `setHours()` on Vercel runtime is the bug that this signature change
   *  prevents — the timeStr form has been removed for that reason. */
  targetUtc: Date,
  options: MLBStadiumShade3DOptions = {},
): Promise<MLBStadiumShade3DResult> {
  const { useCache = true, lodLevel = 'medium' } = options;

  const status = hasSpecificData(stadiumId);
  if (!status.hasObstructions) {
    throw new Error(
      `3D shade calculation requires obstruction data; ${stadiumId} has none. Use 2D path instead.`,
    );
  }

  const stadium = MLB_STADIUMS.find((s) => s.id === stadiumId);
  if (!stadium) {
    throw new Error(`Stadium ${stadiumId} not found in MLB_STADIUMS`);
  }

  const targetDate = targetUtc;
  const cacheKey = `${stadiumId}|${targetDate.toISOString()}|${lodLevel}`;
  if (useCache && resultCache.has(cacheKey)) {
    const cached = resultCache.get(cacheKey)!;
    return { ...cached, fromCache: true };
  }

  const start = Date.now();

  const sunPos = getSunPosition(targetDate, latitude, longitude);
  const sunPosition3D = createSunPosition(sunPos.azimuthDegrees, sunPos.altitudeDegrees);

  const calculator = getOrBuildCalculator(stadium);
  const sections = calculator.calculateAllSectionsShade(sunPosition3D);

  const result: MLBStadiumShade3DResult = {
    sections,
    sunPosition: {
      elevation: sunPos.altitudeDegrees,
      azimuth: sunPos.azimuthDegrees,
    },
    calculationTime: Date.now() - start,
    fromCache: false,
  };

  if (useCache) {
    resultCache.set(cacheKey, result);
  }

  return result;
}

export function clearMLB3DCalculatorCache(): void {
  calculatorCache.clear();
  resultCache.clear();
}
