import { NextRequest, NextResponse } from 'next/server';
import { MLB_STADIUMS } from '../../../../../src/data/stadiums';
import { getStadiumSectionsAsync } from '../../../../../src/data/getStadiumSections';
import { calculateShadePercentage, generateShadeMatrix } from '../../../../../src/utils/stadiumDataServer';

interface RouteParams {
  params: Promise<{
    stadiumId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { stadiumId } = await params;

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const month = parseInt(searchParams.get('month') || (new Date().getMonth() + 1).toString());
    const hour = parseInt(searchParams.get('hour') || '13');
    const section = searchParams.get('section');

    // Find stadium
    const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);

    if (!stadium) {
      console.warn(`[shade API] Stadium not found: ${stadiumId}`);
      return NextResponse.json(
        { error: `Stadium not found: ${stadiumId}` },
        { status: 404 }
      );
    }

    const sections = await getStadiumSectionsAsync(stadium.id);

    if (!sections || sections.length === 0) {
      console.warn(`[shade API] No section data for stadium: ${stadiumId}`);
      return NextResponse.json(
        { error: 'No section data available for this stadium' },
        { status: 404 }
      );
    }

    // If specific section requested
    if (section) {
      const sectionData = sections.find(s => s.name === section || s.id === section);

      if (!sectionData) {
        console.warn(`[shade API] Section not found: ${section} in stadium: ${stadiumId}`);
        return NextResponse.json(
          { error: `Section not found: ${section}` },
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
    console.error('[shade API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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