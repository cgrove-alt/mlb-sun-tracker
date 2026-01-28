import { NextRequest, NextResponse } from 'next/server';
import { MLB_STADIUMS } from '../../../../../../src/data/stadiums';
import { getStadiumSections, hasSpecificData } from '../../../../../../src/data/stadium-data-aggregator';
import { calculateRowShadows } from '../../../../../../src/utils/sunCalculator';
import { getSunPosition } from '../../../../../../src/utils/sunCalculations';
import { calculateMLBStadiumShade3D } from '../../../../../../src/utils/mlb3DCalculator';

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
  const use3D = searchParams.get('use3d') === 'true'; // Enable 3D calculator
  const useCache = searchParams.get('cache') !== 'false'; // Default true

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
    // Check if stadium has 3D data (obstructions)
    const stadiumDataStatus = hasSpecificData(stadium.id);
    const shouldUse3D = use3D && stadiumDataStatus.hasObstructions;

    // If 3D calculator is enabled and stadium has obstruction data
    if (shouldUse3D) {
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

      const result3D = await calculateMLBStadiumShade3D(
        stadium.id,
        stadium.name,
        stadium.latitude,
        stadium.longitude,
        stadium.orientation || 0,
        date,
        timeStr,
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
        date: date.toISOString().split('T')[0],
        time: timeStr,
        sunPosition: {
          altitude: result3D.sunPosition.elevation,
          azimuth: result3D.sunPosition.azimuth,
          isDay: result3D.sunPosition.elevation > 0
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

    // Fallback to 2D calculation (existing logic)
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
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
