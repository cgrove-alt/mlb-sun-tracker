// app/api/shade/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MLB_STADIUMS } from '@/src/data/stadiums';
import { getStadiumSectionsAsync } from '@/src/data/getStadiumSections';
import { createStadiumDate } from '@/src/utils/stadiumTimezone';
import { computeSunPosition } from '@/src/utils/nrelSolarPosition';
import { calculateSectionExposure, exposureToShadeScore, exposureToStatus, type SunPosition } from '@/src/lib/shadeEngine';

export async function GET(request: NextRequest) {
  const p = request.nextUrl.searchParams;
  const stadiumId = p.get('stadiumId') ?? '';
  const date = p.get('date') ?? '';
  const time = p.get('time') ?? '13:00';
  const duration = Math.min(parseFloat(p.get('duration') ?? '3'), 6);
  const roofState = (p.get('roofState') ?? 'open') as 'open' | 'closed';

  if (!stadiumId || !date) {
    return NextResponse.json({ error: 'stadiumId and date are required' }, { status: 400 });
  }

  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) {
    return NextResponse.json({ error: `Stadium not found: ${stadiumId}` }, { status: 404 });
  }

  const sections = await getStadiumSectionsAsync(stadiumId);
  if (!sections || sections.length === 0) {
    return NextResponse.json({ error: 'No section data available' }, { status: 404 });
  }

  // Build UTC start time
  const [hh, mm] = time.split(':').map(Number);
  const localTimeStr = `${date} ${String(hh).padStart(2, '0')}:${String(mm ?? 0).padStart(2, '0')}:00`;
  const startUtc = createStadiumDate(localTimeStr, stadium.timezone);

  // Compute sun position at first pitch
  const rawFirstPitch = computeSunPosition(startUtc, stadium.latitude, stadium.longitude, 0);
  const sunAtFirstPitch: SunPosition = { altitude: rawFirstPitch.elevation, azimuth: rawFirstPitch.azimuth };

  // Generate 15-min snapshots
  const numSnapshots = Math.ceil(duration * 4) + 1;
  const snapshots = Array.from({ length: numSnapshots }, (_, i) => {
    const offsetMs = i * 15 * 60 * 1000;
    const snapDate = new Date(startUtc.getTime() + offsetMs);
    const raw = computeSunPosition(snapDate, stadium.latitude, stadium.longitude, 0);
    return {
      offsetMinutes: i * 15,
      sunPos: { altitude: raw.elevation, azimuth: raw.azimuth } as SunPosition,
    };
  });

  // If roof is closed, all sections get 0% sun
  const roofClosed = roofState === 'closed' || stadium.roof === 'fixed';

  const sectionResults = sections.map(section => {
    const timeline = snapshots.map(s => ({
      offsetMinutes: s.offsetMinutes,
      sunExposurePct: roofClosed ? 0 : calculateSectionExposure(section, s.sunPos),
    }));
    const avgExposure = timeline.reduce((sum, t) => sum + t.sunExposurePct, 0) / timeline.length;
    const atFirstPitch = roofClosed ? 0 : calculateSectionExposure(section, sunAtFirstPitch);
    return {
      sectionId: section.id,
      name: section.name,
      level: section.level,
      covered: section.covered,
      avgExposure: Math.round(avgExposure),
      shadeScore: exposureToShadeScore(avgExposure),
      overallStatus: exposureToStatus(avgExposure),
      atFirstPitch,
      atFirstPitchShadeScore: exposureToShadeScore(atFirstPitch),
      timeline,
    };
  });

  const response = {
    stadiumId,
    stadiumName: stadium.name,
    date,
    localTime: time,
    timezone: stadium.timezone,
    roofState,
    sunAtFirstPitch,
    sections: sectionResults,
    computedAt: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
