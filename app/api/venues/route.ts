import { NextResponse } from 'next/server';
import { ALL_UNIFIED_VENUES } from '../../../src/data/unifiedVenues';

export const dynamic = 'force-static'; // Static generation

export async function GET() {
  return NextResponse.json(ALL_UNIFIED_VENUES, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
