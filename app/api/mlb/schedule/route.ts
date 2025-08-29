import { NextRequest, NextResponse } from 'next/server';
import { mlbApi } from '../../../../src/services/mlbApi';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const stadiumId = searchParams.get('stadiumId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!stadiumId) {
      return NextResponse.json(
        { error: 'stadiumId is required' },
        { status: 400 }
      );
    }

    // Get all games for the date range
    const allGames = await mlbApi.getSchedule(
      startDate || undefined,
      endDate || undefined
    );

    // Filter to home games for this stadium
    const homeGames = mlbApi.getHomeGamesForStadium(stadiumId, allGames);

    return NextResponse.json({
      games: homeGames,
      count: homeGames.length
    });
  } catch (error) {
    console.error('Error fetching MLB schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule', details: (error as Error).message },
      { status: 500 }
    );
  }
}