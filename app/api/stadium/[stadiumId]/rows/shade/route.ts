import { NextRequest, NextResponse } from 'next/server';
import { MLB_STADIUMS } from '../../../../../../src/data/stadiums';
import { getStadiumSections } from '../../../../../../src/data/stadium-data-aggregator';
import { calculateRowShadows } from '../../../../../../src/utils/sunCalculator';
import { getSunPosition } from '../../../../../../src/utils/sunCalculations';

interface RouteParams {
  params: Promise<{
    stadiumId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { stadiumId } = await params;

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const dateParam = searchParams.get('date');
  const timeParam = searchParams.get('time');
  const sectionIdParam = searchParams.get('sectionId');

  // Validate date parameter
  const date = dateParam ? new Date(dateParam) : new Date();
  if (isNaN(date.getTime())) {
    return NextResponse.json(
      { error: 'Invalid date parameter. Use ISO 8601 format (YYYY-MM-DD)' },
      { status: 400 }
    );
  }

  // Validate time parameter (24-hour format HH:MM)
  let hour = 13; // Default 1pm
  let minute = 0;
  if (timeParam) {
    const timeMatch = timeParam.match(/^(\d{1,2}):(\d{2})$/);
    if (!timeMatch) {
      return NextResponse.json(
        { error: 'Invalid time parameter. Use 24-hour format (HH:MM)' },
        { status: 400 }
      );
    }
    hour = parseInt(timeMatch[1]);
    minute = parseInt(timeMatch[2]);

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      return NextResponse.json(
        { error: 'Time out of range. Hour must be 0-23, minute must be 0-59' },
        { status: 400 }
      );
    }
  }

  // Find stadium
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);

  if (!stadium) {
    return NextResponse.json(
      { error: 'Stadium not found', stadiumId },
      { status: 404 }
    );
  }

  // Get stadium sections with row data
  const sections = getStadiumSections(stadium.id, 'MLB');

  if (!sections || sections.length === 0) {
    return NextResponse.json(
      { error: 'No sections found for stadium', stadiumId: stadium.id },
      { status: 404 }
    );
  }

  // Calculate sun position
  const targetDate = new Date(date);
  targetDate.setHours(hour, minute, 0, 0);

  const sunPosition = getSunPosition(
    targetDate,
    stadium.latitude,
    stadium.longitude
  );

  try {
    // If specific section requested
    if (sectionIdParam) {
      const section = sections.find(s => s.id === sectionIdParam || s.name === sectionIdParam);

      if (!section) {
        return NextResponse.json(
          { error: 'Section not found', sectionId: sectionIdParam },
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
        date: date.toISOString().split('T')[0],
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        sunPosition: {
          altitude: sunPosition.altitudeDegrees,
          azimuth: sunPosition.azimuthDegrees,
          isDay: sunPosition.altitudeDegrees > 0
        },
        section: rowShadowData
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
      date: date.toISOString().split('T')[0],
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      sunPosition: {
        altitude: sunPosition.altitudeDegrees,
        azimuth: sunPosition.azimuthDegrees,
        isDay: sunPosition.altitudeDegrees > 0
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
      sections: allRowShadows
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
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
