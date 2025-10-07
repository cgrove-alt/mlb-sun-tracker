import { NextRequest, NextResponse } from 'next/server';
import { weatherApi } from '../../../../src/services/weatherApi';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ stadiumId: string }> }
) {
  const params = await context.params;
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid latitude or longitude' },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        { error: 'Latitude must be between -90 and 90' },
        { status: 400 }
      );
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Longitude must be between -180 and 180' },
        { status: 400 }
      );
    }

    // Get weather forecast
    const forecast = await weatherApi.getForecast(latitude, longitude);

    // Add cache headers for 10 minutes
    const headers = {
      'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=1200',
      'X-Stadium-Id': params.stadiumId,
    };

    return NextResponse.json(forecast, { headers });
  } catch (error) {
    console.error('Weather API error:', error);

    // Return a more user-friendly error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');

    return NextResponse.json(
      {
        error: isNetworkError
          ? 'Weather service temporarily unavailable'
          : 'Failed to fetch weather data',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        stadiumId: params.stadiumId,
      },
      { status: 500 }
    );
  }
}