import { NextRequest, NextResponse } from 'next/server';
import { MLB_STADIUMS } from '../../../../../../src/data/stadiums';
import { getStadiumSections } from '../../../../../../src/data/stadium-data-aggregator';
import {
  gameWindowOffsets,
  type SunSample,
} from '../../../../../../src/utils/sunCalculator';
import { getSunPosition } from '../../../../../../src/utils/sunCalculations';
import { requireFiniteOrientation } from '../../../../../../src/utils/bowlGeometry';
import {
  bindMeasuredShadeRuntime,
  calculateMeasuredGameWindowShade,
  calculateMeasuredVenueShade,
  type MeasuredRoofState,
} from '../../../../../../src/utils/measuredShadeRuntime';
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
  'roofState',
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
  const use3D = searchParams.get('use3d') === 'true';
  const _useCache = searchParams.get('cache') !== 'false';
  void _useCache;

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
  const orientation = requireFiniteOrientation(stadium.orientation, stadium.id);
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

  // Passing evidence is necessary but not sufficient. The legacy 2D/3D
  // estimators synthesize seats and obstructions from defaults and must stay
  // unreachable. The measured runtime is the only calculator allowed after
  // this point, and only when its hashed artifact is bound.
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

  const bound = bindMeasuredShadeRuntime(stadium.id);
  if (!bound.ok) {
    return NextResponse.json(
      {
        error: 'Measured shade geometry artifact is not bound for this stadium.',
        code: bound.code,
        blockers: bound.blockers,
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

  const roofStateParam = searchParams.get('roofState');
  let roofState: MeasuredRoofState;
  if (bound.artifact.roof.type === 'retractable') {
    if (roofStateParam !== 'open' && roofStateParam !== 'closed') {
      return NextResponse.json(
        {
          error: 'Retractable-roof parks require roofState=open or roofState=closed. Percents are not published for an unknown roof position.',
          code: 'ROOF_STATE_REQUIRED',
        },
        { status: 400 },
      );
    }
    roofState = roofStateParam;
  } else if (bound.artifact.roof.type === 'fixed') {
    roofState = 'closed';
  } else {
    roofState = 'open';
  }

  try {
    if (useWindow) {
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

      const sectionWindows = calculateMeasuredGameWindowShade(bound.artifact, sunSamples, {
        roofState,
        sectionId: sectionIdParam ?? undefined,
      });

      if (sectionIdParam) {
        const sectionWindow = sectionWindows[0];
        if (!sectionWindow) {
          return NextResponse.json(
            { error: 'Section not found', code: 'SECTION_NOT_FOUND', sectionId: sectionIdParam },
            { status: 404 },
          );
        }
        return NextResponse.json({
          stadium: { id: stadium.id, name: stadium.name, orientation: orientation },
          date: calendarDate,
          time: windowMeta.startTime,
          window: windowMeta,
          section: sectionWindow,
          calculation: { method: 'measured-window' },
        }, {
          headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
        });
      }

      const countBy = (p: string) => sectionWindows.filter((s) => s.progression === p).length;
      return NextResponse.json({
        stadium: { id: stadium.id, name: stadium.name, orientation },
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
          averageCoverage: sectionWindows.length
            ? Math.round(sectionWindows.reduce((sum, s) => sum + s.averageCoverage, 0) / sectionWindows.length)
            : 0,
        },
        sections: sectionWindows,
        calculation: { method: 'measured-window' },
      }, {
        headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
      });
    }

    if (sectionIdParam) {
      const rowShadowData = calculateMeasuredVenueShade(bound.artifact, sunPosition, {
        roofState,
        sectionId: sectionIdParam,
      })[0];
      if (!rowShadowData) {
        return NextResponse.json(
          { error: 'Section not found', code: 'SECTION_NOT_FOUND', sectionId: sectionIdParam },
          { status: 404 },
        );
      }
      return NextResponse.json({
        stadium: { id: stadium.id, name: stadium.name, orientation },
        date: calendarDate,
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        sunPosition: {
          altitude: sunPosition.altitudeDegrees,
          azimuth: sunPosition.azimuthDegrees,
          isDay: sunPosition.altitudeDegrees > 0,
          utc: targetDate.toISOString(),
        },
        section: rowShadowData,
        calculation: { method: 'measured-raycast' },
      }, {
        headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
      });
    }

    const allRowShadows = calculateMeasuredVenueShade(bound.artifact, sunPosition, { roofState });
    const totalRows = allRowShadows.reduce((sum, s) => sum + s.rows.length, 0);
    const excellentRows = allRowShadows.reduce((sum, s) =>
      sum + s.rows.filter((r) => r.recommendation === 'excellent').length, 0);
    const goodRows = allRowShadows.reduce((sum, s) =>
      sum + s.rows.filter((r) => r.recommendation === 'good').length, 0);

    return NextResponse.json({
      stadium: { id: stadium.id, name: stadium.name, orientation },
      date: calendarDate,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      sunPosition: {
        altitude: sunPosition.altitudeDegrees,
        azimuth: sunPosition.azimuthDegrees,
        isDay: sunPosition.altitudeDegrees > 0,
        utc: targetDate.toISOString(),
      },
      summary: {
        totalSections: allRowShadows.length,
        totalRows,
        excellentShadeRows: excellentRows,
        goodShadeRows: goodRows,
        averageCoverage: allRowShadows.length
          ? Math.round(allRowShadows.reduce((sum, s) => sum + s.averageCoverage, 0) / allRowShadows.length)
          : 0,
      },
      sections: allRowShadows,
      calculation: { method: 'measured-raycast' },
    }, {
      headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' },
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
