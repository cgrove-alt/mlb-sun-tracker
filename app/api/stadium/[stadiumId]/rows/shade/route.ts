import { NextRequest, NextResponse } from 'next/server';
import { MLB_STADIUMS } from '../../../../../../src/data/stadiums';
import { getStadiumSections, hasSpecificData } from '../../../../../../src/data/stadium-data-aggregator';
import {
  calculateRowShadows,
  calculateGameWindowShade,
  gameWindowOffsets,
  type SunSample,
} from '../../../../../../src/utils/sunCalculator';
import { getSunPosition } from '../../../../../../src/utils/sunCalculations';
import { calculateMLBStadiumShade3D } from '../../../../../../src/utils/mlb3DCalculator';
import {
  calendarDateAndTimeToUTC,
  formatStadiumLocal,
  isIsoDateOnly,
  stadiumLocalDateAndTimeToUTC,
} from '../../../../../../src/utils/stadiumTime';
import {
  canPublishSeatLevelShade,
  getStadiumShadeConfidence,
  publicShadeStatus,
} from '../../../../../../src/data/stadiumShadeConfidence';
import { hasPublishedMeasuredShadeRuntime } from '../../../../../../src/data/publishedShadeRuntime';

interface RouteParams {
  params: Promise<{
    stadiumId: string;
  }>;
}

// Every query parameter this endpoint understands. Anything else is rejected
// rather than ignored: a request like `?month=99&hour=abc` used to return a
// perfectly healthy 200 computed from the *default* date and time, so a caller
// with a typo'd or made-up parameter silently got data for the wrong moment and
// had no way to tell. Failing loudly is the only way that surfaces.
const ALLOWED_PARAMS = new Set([
  'date',
  'time',
  'sectionId',
  'use3d',
  'cache',
  'window',
  'step',
]);

// Sun-position maths stays well-behaved far outside these bounds, but a request
// for a 19th- or 30th-century ballgame is a caller bug, not a real query.
const MIN_YEAR = 1990;
const MAX_YEAR = 2050;

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { stadiumId } = await params;

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;

  // Reject unknown parameters before doing any work.
  const unknownParams = Array.from(new Set(
    Array.from(searchParams.keys()).filter(k => !ALLOWED_PARAMS.has(k))
  ));
  if (unknownParams.length > 0) {
    return NextResponse.json(
      {
        error: `Unknown query parameter(s): ${unknownParams.join(', ')}`,
        code: 'UNKNOWN_PARAMETER',
        unknownParams,
        allowedParams: Array.from(ALLOWED_PARAMS),
      },
      { status: 400 }
    );
  }
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const sectionIdParam = searchParams.get('sectionId');
  const use3D = searchParams.get('use3d') === 'true'; // Enable 3D calculator
  const useCache = searchParams.get('cache') !== 'false'; // Default true

  // Opt-in whole-game-window mode. When `window` is present, shade is sampled
  // across the game (first pitch → first pitch + window minutes) instead of a
  // single instant. Absent → byte-identical single-instant behavior.
  const windowParam = searchParams.get('window');
  const stepParam = searchParams.get('step');
  const useWindow = windowParam !== null;
  let windowMinutes = 180; // ~2h40 pitch-clock game + margin
  let stepMinutes = 30;
  if (useWindow) {
    // Out-of-range values are deliberately CLAMPED (window→0-300, step→15-60);
    // that is the documented contract. But a non-numeric value is a caller
    // error, not a value to clamp — it used to fall through to the default and
    // return a window the caller never asked for.
    if (windowParam !== '') {
      const w = Number(windowParam);
      if (!Number.isFinite(w)) {
        return NextResponse.json(
          { error: 'Invalid window parameter. Must be a number of minutes (0-300)', code: 'INVALID_WINDOW' },
          { status: 400 }
        );
      }
      windowMinutes = Math.min(300, Math.max(0, Math.trunc(w)));
    }
    if (stepParam !== null && stepParam !== '') {
      const st = Number(stepParam);
      if (!Number.isFinite(st)) {
        return NextResponse.json(
          { error: 'Invalid step parameter. Must be a number of minutes (15-60)', code: 'INVALID_STEP' },
          { status: 400 }
        );
      }
      stepMinutes = Math.min(60, Math.max(15, Math.trunc(st)));
    }
  }

  // Validate time parameter (24-hour format HH:MM) before the date, so a
  // request with both wrong can still get a precise error for whichever we
  // check first. Time is independent of timezone.
  let hour = 13; // Default 1pm
  let minute = 0;
  if (timeParam) {
    const timeMatch = timeParam.match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) {
      return NextResponse.json(
        { error: 'Invalid time parameter. Use 24-hour format (HH:MM)', code: 'INVALID_TIME' },
        { status: 400 }
      );
    }
    hour = parseInt(timeMatch[1], 10);
    minute = parseInt(timeMatch[2], 10);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return NextResponse.json(
        { error: 'Time out of range. Hour must be 0-23, minute must be 0-59', code: 'TIME_OUT_OF_RANGE' },
        { status: 400 }
      );
    }
  }

  // Find stadium before converting the date: YYYY-MM-DD is a calendar date in
  // the stadium's timezone, not a UTC midnight instant. Parsing it with
  // `new Date('YYYY-MM-DD')` is UTC midnight, which is the previous evening
  // in every US park and silently shifted every dated query by 24 hours.
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);

  if (!stadium) {
    return NextResponse.json(
      { error: 'Stadium not found', code: 'STADIUM_NOT_FOUND', stadiumId },
      { status: 404 }
    );
  }

  const stadiumTimezone = stadium.timezone || 'UTC';
  let calendarDate: string;
  let targetDate: Date;

  if (dateParam) {
    if (!isIsoDateOnly(dateParam)) {
      return NextResponse.json(
        { error: 'Invalid date parameter. Use ISO 8601 format (YYYY-MM-DD)', code: 'INVALID_DATE' },
        { status: 400 }
      );
    }
    const year = parseInt(dateParam.slice(0, 4), 10);
    if (year < MIN_YEAR || year > MAX_YEAR) {
      return NextResponse.json(
        {
          error: `Date out of range. Year must be between ${MIN_YEAR} and ${MAX_YEAR}`,
          code: 'DATE_OUT_OF_RANGE',
          year,
        },
        { status: 400 }
      );
    }
    calendarDate = dateParam;
    targetDate = calendarDateAndTimeToUTC(dateParam, hour, minute, stadiumTimezone);
  } else {
    // No date → "today at this stadium" at the requested (or default) clock.
    targetDate = stadiumLocalDateAndTimeToUTC(new Date(), hour, minute, stadiumTimezone);
    calendarDate = formatStadiumLocal(targetDate, stadiumTimezone, 'yyyy-MM-dd');
  }

  const sunPosition = getSunPosition(
    targetDate,
    stadium.latitude,
    stadium.longitude
  );

  // Hard publication boundary: this endpoint emits row rankings and exact
  // percentages. Published seating charts establish section identity, not the
  // metric row/overhang/obstruction geometry those outputs require. Withhold
  // the entire result until remote measurement and independent observations
  // pass the explicit publication gate;
  // never let a precise-looking synthetic result escape through either 2D or
  // 3D mode.
  // A permanent roof is a physical constant. Publish 100% shade without
  // inventing per-row geometry from the unvalidated bowl model.
  if (stadium.roof === 'fixed') {
    const sections = await getStadiumSections(stadium.id, 'MLB');
    const shaded = (sections ?? []).map((section) => ({
      sectionId: section.id,
      sectionName: section.name,
      rows: [],
      averageCoverage: 100,
      bestRows: [] as string[],
      worstRows: [] as string[],
    }));
    return NextResponse.json({
      stadium: { id: stadium.id, name: stadium.name, orientation: stadium.orientation },
      date: calendarDate,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      sunPosition: {
        altitude: sunPosition.altitudeDegrees,
        azimuth: sunPosition.azimuthDegrees,
        isDay: sunPosition.altitudeDegrees > 0,
        utc: targetDate.toISOString(),
      },
      shadeStatus: publicShadeStatus({
        stadiumId: stadium.id,
        roof: stadium.roof,
        sunAboveHorizon: sunPosition.altitudeDegrees > 0,
      }),
      summary: {
        totalSections: shaded.length,
        totalRows: 0,
        excellentShadeRows: 0,
        goodShadeRows: 0,
        averageCoverage: 100,
        reason: 'fixed-roof',
      },
      sections: shaded,
      calculation: { method: 'fixed-roof' },
      publicationState: 'published',
    }, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
    });
  }

  if (!canPublishSeatLevelShade(stadium.id)) {
    const code = use3D ? 'UNVALIDATED_3D_GEOMETRY' : 'UNVALIDATED_SEAT_GEOMETRY';
    return NextResponse.json(
      {
        error: use3D
          ? 'Measured 3D shade geometry is not available for this stadium.'
          : 'Measured seat-level shade geometry is not available for this stadium.',
        code,
        stadium: { id: stadium.id, name: stadium.name },
        shadeStatus: publicShadeStatus({
          stadiumId: stadium.id,
          roof: stadium.roof,
          sunAboveHorizon: sunPosition.altitudeDegrees > 0,
        }),
        confidence: getStadiumShadeConfidence(stadium.id),
        publicationState: 'withheld',
      },
      { status: 409, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // Passing evidence is necessary but not sufficient. The legacy calculators
  // below synthesize physical seats and obstructions from defaults. Keep them
  // unreachable in production until this park has a separate measured-only
  // runtime implementation bound to the validated geometry artifact. This
  // second latch prevents a future evidence promotion from silently exposing
  // precise-looking output from the old estimators.
  if (!hasPublishedMeasuredShadeRuntime(stadium.id)) {
    return NextResponse.json(
      {
        error: 'Validated geometry is not connected to a measured shade runtime for this stadium.',
        code: 'MEASURED_SHADE_RUNTIME_UNAVAILABLE',
        stadium: { id: stadium.id, name: stadium.name },
        shadeStatus: publicShadeStatus({
          stadiumId: stadium.id,
          roof: stadium.roof,
          sunAboveHorizon: sunPosition.altitudeDegrees > 0,
        }),
        confidence: getStadiumShadeConfidence(stadium.id),
        publicationState: 'withheld',
      },
      { status: 409, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  // Get stadium sections with row data only after the publication gate passes.
  // This also makes the fail-closed path independent of the synthetic fixtures.
  const sections = await getStadiumSections(stadium.id, 'MLB');

  if (!sections || sections.length === 0) {
    return NextResponse.json(
      { error: 'No sections found for stadium', code: 'NO_SECTIONS_FOUND', stadiumId: stadium.id },
      { status: 404 }
    );
  }

  try {
    // Check if stadium has 3D data (obstructions)
    const stadiumDataStatus = hasSpecificData(stadium.id);
    const shouldUse3D = use3D && stadiumDataStatus.hasObstructions;

    // If 3D calculator is enabled and stadium has obstruction data
    if (shouldUse3D) {
      const result3D = await calculateMLBStadiumShade3D(
        stadium.id,
        stadium.name,
        stadium.latitude,
        stadium.longitude,
        stadium.orientation || 0,
        targetDate,
        {
          useCache,
          useWebWorkers: false, // Disable web workers in server environment
          lodLevel: 'medium'
        }
      );

      // Convert 3D results to match existing API format
      const sections3D = Array.from(result3D.sections.values()).map(sectionResult => {
        // Group seats by row
        const rowMap = new Map<number, any[]>();
        sectionResult.seatResults.forEach(seat => {
          const seatId = seat.seatId;
          const rowMatch = seatId.match(/-R(\d+)-/);
          if (rowMatch) {
            const rowNum = parseInt(rowMatch[1]);
            if (!rowMap.has(rowNum)) {
              rowMap.set(rowNum, []);
            }
            rowMap.get(rowNum)!.push(seat);
          }
        });

        // Convert to row shadow format
        const rows = Array.from(rowMap.entries()).map(([rowNum, seats]) => {
          const shadedSeats = seats.filter(s => s.inShade).length;
          const coverage = (shadedSeats / seats.length) * 100;

          return {
            rowNumber: rowNum.toString(),
            seats: seats.length,
            elevation: 0, // Would need to extract from seat position
            depth: 0,
            coverage,
            sunExposure: 100 - coverage,
            inShadow: coverage > 50,
            shadowSources: {
              roof: coverage * 0.6,
              upperDeck: coverage * 0.3,
              overhang: coverage * 0.1,
              bowl: 0
            },
            recommendation: coverage > 80 ? 'excellent' : coverage > 60 ? 'good' : coverage > 40 ? 'fair' : 'poor'
          };
        });

        rows.sort((a, b) => parseInt(a.rowNumber) - parseInt(b.rowNumber));

        const avgCoverage = rows.reduce((sum, r) => sum + r.coverage, 0) / rows.length;
        const sortedByCoverage = [...rows].sort((a, b) => b.coverage - a.coverage);

        return {
          sectionId: sectionResult.sectionId,
          sectionName: sectionResult.sectionId,
          rows,
          averageCoverage: avgCoverage,
          bestRows: sortedByCoverage.slice(0, 5).map(r => r.rowNumber),
          worstRows: sortedByCoverage.slice(-5).reverse().map(r => r.rowNumber)
        };
      });

      const totalRows = sections3D.reduce((sum, s) => sum + s.rows.length, 0);
      const excellentRows = sections3D.reduce((sum, s) =>
        sum + s.rows.filter(r => r.recommendation === 'excellent').length, 0
      );
      const goodRows = sections3D.reduce((sum, s) =>
        sum + s.rows.filter(r => r.recommendation === 'good').length, 0
      );

      return NextResponse.json({
        stadium: {
          id: stadium.id,
          name: stadium.name,
          orientation: stadium.orientation
        },
        date: calendarDate,
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        sunPosition: {
          altitude: result3D.sunPosition.elevation,
          azimuth: result3D.sunPosition.azimuth,
          isDay: result3D.sunPosition.elevation > 0,
          utc: targetDate.toISOString(),
        },
        summary: {
          totalSections: sections3D.length,
          totalRows,
          excellentShadeRows: excellentRows,
          goodShadeRows: goodRows,
          averageCoverage: Math.round(
            sections3D.reduce((sum, s) => sum + s.averageCoverage, 0) / sections3D.length
          )
        },
        sections: sections3D,
        calculation: {
          method: '3D',
          calculationTime: result3D.calculationTime,
          fromCache: result3D.fromCache
        }
      }, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        }
      });
    }

    // Whole-game-window mode (opt-in, 2D only). Samples the sun across the
    // game and aggregates shade migration per section/row. The 3D path above
    // stays single-instant (windowed ray-casting is out of scope).
    if (useWindow) {
      // Sun position depends on the absolute instant, so each sample is just
      // first-pitch UTC plus elapsed real minutes — no per-sample timezone
      // conversion needed (and DST-safe, since we add real elapsed time).
      const offsets = gameWindowOffsets(windowMinutes, stepMinutes);
      const sunSamples: SunSample[] = offsets.map((m) => {
        const sampleDate = new Date(targetDate.getTime() + m * 60_000);
        const sp = getSunPosition(sampleDate, stadium.latitude, stadium.longitude);
        return {
          minutesFromStart: m,
          altitudeDegrees: sp.altitudeDegrees,
          azimuthDegrees: sp.azimuthDegrees,
        };
      });

      const windowMeta = {
        startTime: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        windowMinutes,
        stepMinutes,
        samples: offsets.length,
      };

      if (sectionIdParam) {
        const section = sections.find(s => s.id === sectionIdParam || s.name === sectionIdParam);
        if (!section) {
          return NextResponse.json(
            { error: 'Section not found', code: 'SECTION_NOT_FOUND', sectionId: sectionIdParam },
            { status: 404 }
          );
        }
        const sectionWindow = calculateGameWindowShade(section, sunSamples, stadium.orientation || 0);
        return NextResponse.json({
          stadium: { id: stadium.id, name: stadium.name, orientation: stadium.orientation },
          date: calendarDate,
          time: windowMeta.startTime,
          window: windowMeta,
          section: sectionWindow,
          calculation: { method: '2D-window' },
        }, {
          headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
        });
      }

      const sectionWindows = sections.map(section =>
        calculateGameWindowShade(section, sunSamples, stadium.orientation || 0)
      );
      const countBy = (p: string) =>
        sectionWindows.filter(s => s.progression === p).length;

      return NextResponse.json({
        stadium: { id: stadium.id, name: stadium.name, orientation: stadium.orientation },
        date: calendarDate,
        time: windowMeta.startTime,
        window: windowMeta,
        summary: {
          totalSections: sectionWindows.length,
          totalRows: sectionWindows.reduce((sum, s) => sum + s.rows.length, 0),
          shadedAllSections: countBy('shaded-all'),
          sunToShadeSections: countBy('sun-to-shade'),
          shadeToSunSections: countBy('shade-to-sun'),
          sunnyAllSections: countBy('sunny-all'),
          averageCoverage: Math.round(
            sectionWindows.reduce((sum, s) => sum + s.averageCoverage, 0) / sectionWindows.length
          ),
        },
        sections: sectionWindows,
        calculation: { method: '2D-window' },
      }, {
        headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
      });
    }

    // Fallback to 2D calculation (existing logic)
    // If specific section requested
    if (sectionIdParam) {
      const section = sections.find(s => s.id === sectionIdParam || s.name === sectionIdParam);

      if (!section) {
        return NextResponse.json(
          { error: 'Section not found', code: 'SECTION_NOT_FOUND', sectionId: sectionIdParam },
          { status: 404 }
        );
      }

      // Calculate row shadows for single section
      const rowShadowData = calculateRowShadows(
        section,
        sunPosition.altitudeDegrees,
        sunPosition.azimuthDegrees,
        stadium.orientation || 0
      );

      return NextResponse.json({
        stadium: {
          id: stadium.id,
          name: stadium.name,
          orientation: stadium.orientation
        },
        date: calendarDate,
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        sunPosition: {
          altitude: sunPosition.altitudeDegrees,
          azimuth: sunPosition.azimuthDegrees,
          isDay: sunPosition.altitudeDegrees > 0,
          utc: targetDate.toISOString(),
        },
        section: rowShadowData,
        calculation: {
          method: '2D'
        }
      }, {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        }
      });
    }

    // Calculate row shadows for all sections
    const allRowShadows = sections.map(section =>
      calculateRowShadows(
        section,
        sunPosition.altitudeDegrees,
        sunPosition.azimuthDegrees,
        stadium.orientation || 0
      )
    );

    // Calculate summary statistics
    const totalRows = allRowShadows.reduce((sum, s) => sum + s.rows.length, 0);
    const excellentRows = allRowShadows.reduce((sum, s) =>
      sum + s.rows.filter(r => r.recommendation === 'excellent').length, 0
    );
    const goodRows = allRowShadows.reduce((sum, s) =>
      sum + s.rows.filter(r => r.recommendation === 'good').length, 0
    );

    return NextResponse.json({
      stadium: {
        id: stadium.id,
        name: stadium.name,
        orientation: stadium.orientation
      },
      date: calendarDate,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      sunPosition: {
        altitude: sunPosition.altitudeDegrees,
        azimuth: sunPosition.azimuthDegrees,
        isDay: sunPosition.altitudeDegrees > 0,
        utc: targetDate.toISOString(),
      },
      summary: {
        totalSections: sections.length,
        totalRows,
        excellentShadeRows: excellentRows,
        goodShadeRows: goodRows,
        averageCoverage: Math.round(
          allRowShadows.reduce((sum, s) => sum + s.averageCoverage, 0) / allRowShadows.length
        )
      },
      sections: allRowShadows,
      calculation: {
        method: '2D'
      }
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      }
    });

  } catch (error) {
    console.error('Error calculating row shadows:', error);
    return NextResponse.json(
      {
        error: 'Internal server error calculating row shadows',
        code: 'CALCULATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
