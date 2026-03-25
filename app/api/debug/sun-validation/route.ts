import { NextResponse } from 'next/server';
import { computeSunPosition } from '../../../../src/utils/nrelSolarPosition';
import { MLB_STADIUMS, Stadium } from '../../../../src/data/stadiums';
import { getTimezoneOffset } from '../../../../src/utils/stadiumTimezone';
import SunCalc from 'suncalc';

export async function GET(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const stadiumId = searchParams.get('stadiumId');
  const datetimeStr = searchParams.get('datetime');

  if (!stadiumId || !datetimeStr) {
    return NextResponse.json(
      { error: 'Missing stadiumId or datetime. Example: ?stadiumId=yankees&datetime=2026-06-21T13:00' },
      { status: 400 }
    );
  }

  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) {
    return NextResponse.json(
      { error: `Stadium '${stadiumId}' not found`, available: MLB_STADIUMS.map(s => s.id) },
      { status: 404 }
    );
  }

  // Parse local datetime and convert to UTC using stadium timezone
  const localDate = new Date(datetimeStr);
  if (isNaN(localDate.getTime())) {
    return NextResponse.json({ error: `Invalid datetime: ${datetimeStr}` }, { status: 400 });
  }

  const offset = getTimezoneOffset(localDate, stadium.timezone);
  const utcDate = new Date(localDate.getTime() - offset * 3600000);

  // NREL calculation
  const nrel = computeSunPosition(utcDate, stadium.latitude, stadium.longitude, 0);

  // SunCalc calculation
  const sc = SunCalc.getPosition(utcDate, stadium.latitude, stadium.longitude);
  const scAz = ((sc.azimuth * 180 / Math.PI) + 180) % 360;
  const scEl = sc.altitude * 180 / Math.PI;

  return NextResponse.json({
    stadium: stadium.name,
    stadiumId: stadium.id,
    timezone: stadium.timezone,
    datetime: datetimeStr,
    utcDatetime: utcDate.toISOString(),
    nrel: {
      azimuth: Math.round(nrel.azimuth * 100) / 100,
      altitude: Math.round(nrel.elevation * 100) / 100,
    },
    suncalc: {
      azimuth: Math.round(scAz * 100) / 100,
      altitude: Math.round(scEl * 100) / 100,
    },
    delta: {
      azimuth: Math.round(Math.abs(nrel.azimuth - scAz) * 100) / 100,
      altitude: Math.round(Math.abs(nrel.elevation - scEl) * 100) / 100,
    },
  });
}
