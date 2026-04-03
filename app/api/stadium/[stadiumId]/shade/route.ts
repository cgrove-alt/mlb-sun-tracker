import { NextRequest, NextResponse } from 'next/server';
import { MLB_STADIUMS } from '../../../../../src/data/stadiums';
import { getStadiumSections } from '../../../../../src/data/stadiumSections';
import { calculateShadePercentage, generateShadeMatrix } from '../../../../../src/utils/stadiumDataServer';

interface RouteParams {
  params: Promise<{
    stadiumId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { stadiumId } = await params;
  
  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const monthParam = searchParams.get('month');
  const hourParam = searchParams.get('hour');
  const month = parseInt(monthParam ?? new Date().getMonth().toString());
  const hour = parseInt(hourParam ?? '13');
  const section = searchParams.get('section');

  // Validate month (0-11) and hour (0-23)
  if (monthParam !== null && (isNaN(month) || month < 0 || month > 11)) {
    return NextResponse.json(
      { error: 'Invalid month: must be an integer between 0 (January) and 11 (December)' },
      { status: 400 }
    );
  }
  if (hourParam !== null && (isNaN(hour) || hour < 0 || hour > 23)) {
    return NextResponse.json(
      { error: 'Invalid hour: must be an integer between 0 and 23' },
      { status: 400 }
    );
  }
  
  // Find stadium
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  
  if (!stadium) {
    return NextResponse.json(
      { error: 'Stadium not found' },
      { status: 404 }
    );
  }
  
  try {
    const sections = getStadiumSections(stadium.id);

    // If specific section requested
    if (section) {
      const sectionData = sections.find(s => s.name === section || s.id === section);

      if (!sectionData) {
        return NextResponse.json(
          { error: 'Section not found' },
          { status: 404 }
        );
      }

      const shadePercentage = calculateShadePercentage(stadium, sectionData, hour, month);

      return NextResponse.json({
        stadium: stadium.name,
        section: sectionData.name,
        shadePercentage,
        hour: `${hour}:00`,
        month,
        covered: sectionData.covered,
        level: sectionData.level,
        recommendation: getShadeRecommendation(shadePercentage)
      });
    }

    // Return shade data for all sections
    const shadeData = sections.map(sectionData => ({
      section: sectionData.name,
      level: sectionData.level,
      covered: sectionData.covered,
      shadePercentage: calculateShadePercentage(stadium, sectionData, hour, month),
      recommendation: getShadeRecommendation(
        calculateShadePercentage(stadium, sectionData, hour, month)
      )
    }));

    // Sort by shade percentage
    shadeData.sort((a, b) => b.shadePercentage - a.shadePercentage);

    return NextResponse.json({
      stadium: stadium.name,
      stadiumId: stadium.id,
      orientation: stadium.orientation,
      hour: `${hour}:00`,
      month,
      totalSections: shadeData.length,
      shadedSections: shadeData.filter(s => s.shadePercentage >= 50).length,
      sections: shadeData
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      }
    });
  } catch (error) {
    console.error('Shade calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shade data' },
      { status: 500 }
    );
  }
}

function getShadeRecommendation(shadePercentage: number): string {
  if (shadePercentage >= 80) return 'Excellent shade coverage';
  if (shadePercentage >= 60) return 'Good shade available';
  if (shadePercentage >= 40) return 'Partial shade';
  if (shadePercentage >= 20) return 'Limited shade';
  return 'Full sun exposure';
}