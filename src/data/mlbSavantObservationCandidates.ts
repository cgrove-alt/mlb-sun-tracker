import { formatInTimeZone } from 'date-fns-tz';
import type { Stadium } from './stadiums';
import { getSunPosition } from '../utils/sunPosition';

interface MlbSavantPlayEvent {
  playId?: string;
  startTime?: string;
  endTime?: string;
  details?: {
    description?: string;
    event?: string;
    eventType?: string;
    isInPlay?: boolean;
  };
}

interface MlbSavantPlay {
  about?: { inning?: number; halfInning?: string };
  result?: { description?: string; event?: string; eventType?: string };
  playEvents?: MlbSavantPlayEvent[];
  hitData?: {
    trajectory?: string;
    hardness?: string;
    location?: string;
    coordinates?: { coordX?: number; coordY?: number };
  };
}

export interface MlbSavantGameFeed {
  gamePk: number;
  gameData: {
    datetime?: { dateTime?: string; dayNight?: string };
    venue?: {
      id?: number;
      name?: string;
      location?: { defaultCoordinates?: { latitude?: number; longitude?: number } };
      timeZone?: { id?: string };
    };
    weather?: { condition?: string; temp?: string; wind?: string };
  };
  liveData?: { plays?: { allPlays?: MlbSavantPlay[] } };
}

export interface MlbSavantObservationSeed {
  candidateId: string;
  stadiumId: string;
  gamePk: number;
  playId: string;
  event: {
    inning: number | null;
    halfInning: string | null;
    description: string | null;
    resultDescription: string | null;
    eventType: string | null;
    startTime: string;
    endTime: string;
    midpointTime: string;
    stadiumLocalDate: string;
    eventWindowSeconds: number;
  };
  hitData: {
    trajectory: string | null;
    hardness: string | null;
    location: string | null;
    coordinates: { coordX: number; coordY: number } | null;
  };
  solarPositionAtMidpoint: {
    altitudeDegrees: number;
    azimuthDegrees: number;
  };
  video: {
    assetId: string;
    title: string;
    pageUrl: string;
    assets: { mp4Url: null };
  };
  evidence: {
    gameFeedUrl: string;
    timestampMethod: 'mlb-play-event-window';
    independenceKey: string;
  };
  conditions: {
    dayNight: string | null;
    weather: string | null;
    temperatureF: number | null;
    wind: string | null;
  };
  review: {
    status: 'needs-frame-review';
    blockers: readonly [
      'LIVE_FRAME_NOT_CONFIRMED',
      'CAMERA_LOCATION_NOT_DOCUMENTED',
      'SECTION_NOT_IDENTIFIED',
      'SHADOW_BOUNDARY_ROW_NOT_LABELED',
      'ATMOSPHERIC_VISIBILITY_NOT_REVIEWED',
      'GEOMETRY_ARTIFACT_NOT_LINKED',
    ];
  };
}

function validInstant(value: string | undefined): value is string {
  return Boolean(value && /(Z|[+-]\d{2}:\d{2})$/.test(value) && !Number.isNaN(Date.parse(value)));
}

function nullableNumber(value: string | undefined): number | null {
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function finiteCoordinate(value: number | undefined): value is number {
  return Number.isFinite(value);
}

export function selectMlbSavantObservationSeeds(
  stadium: Stadium,
  feed: MlbSavantGameFeed,
): MlbSavantObservationSeed[] {
  const venue = feed.gameData.venue;
  const coordinates = venue?.location?.defaultCoordinates;
  if (!venue?.name || venue.name !== stadium.name) {
    throw new Error(`MLB feed venue ${venue?.name ?? '(missing)'} does not match ${stadium.name}`);
  }
  if (
    coordinates?.latitude === undefined
    || coordinates.longitude === undefined
    || Math.abs(coordinates.latitude - stadium.latitude) > 0.02
    || Math.abs(coordinates.longitude - stadium.longitude) > 0.02
  ) {
    throw new Error(`MLB feed venue coordinates do not match ${stadium.name}`);
  }

  const seeds: MlbSavantObservationSeed[] = [];
  const seenPlayIds = new Set<string>();
  for (const play of feed.liveData?.plays?.allPlays ?? []) {
    for (const event of play.playEvents ?? []) {
      if (!event.details?.isInPlay || !event.playId || seenPlayIds.has(event.playId)) continue;
      if (!validInstant(event.startTime) || !validInstant(event.endTime)) continue;
      const startMillis = Date.parse(event.startTime);
      const endMillis = Date.parse(event.endTime);
      if (endMillis < startMillis) continue;
      const midpoint = new Date(startMillis + (endMillis - startMillis) / 2);
      const sun = getSunPosition(midpoint, stadium.latitude, stadium.longitude);
      if (sun.altitudeDegrees <= 0) continue;
      seenPlayIds.add(event.playId);
      const hitCoordinates = play.hitData?.coordinates;
      const normalizedHitCoordinates = finiteCoordinate(hitCoordinates?.coordX)
        && finiteCoordinate(hitCoordinates?.coordY)
        ? { coordX: hitCoordinates.coordX, coordY: hitCoordinates.coordY }
        : null;
      const eventDescription = event.details.description ?? null;
      const resultDescription = play.result?.description ?? null;

      seeds.push({
        candidateId: `savant-${feed.gamePk}-${event.playId}`,
        stadiumId: stadium.id,
        gamePk: feed.gamePk,
        playId: event.playId,
        event: {
          inning: play.about?.inning ?? null,
          halfInning: play.about?.halfInning ?? null,
          description: eventDescription,
          resultDescription,
          eventType: event.details.eventType ?? play.result?.eventType ?? null,
          startTime: event.startTime,
          endTime: event.endTime,
          midpointTime: midpoint.toISOString(),
          stadiumLocalDate: formatInTimeZone(midpoint, stadium.timezone, 'yyyy-MM-dd'),
          eventWindowSeconds: Math.round((endMillis - startMillis) / 10) / 100,
        },
        hitData: {
          trajectory: play.hitData?.trajectory ?? null,
          hardness: play.hitData?.hardness ?? null,
          location: play.hitData?.location ?? null,
          coordinates: normalizedHitCoordinates,
        },
        solarPositionAtMidpoint: {
          altitudeDegrees: Math.round(sun.altitudeDegrees * 100) / 100,
          azimuthDegrees: Math.round(sun.azimuthDegrees * 100) / 100,
        },
        video: {
          assetId: event.playId,
          title: eventDescription ?? resultDescription ?? event.playId,
          pageUrl: `https://baseballsavant.mlb.com/sporty-videos?playId=${event.playId}`,
          assets: { mp4Url: null },
        },
        evidence: {
          gameFeedUrl: `https://statsapi.mlb.com/api/v1.1/game/${feed.gamePk}/feed/live`,
          timestampMethod: 'mlb-play-event-window',
          independenceKey: `mlb-play:${feed.gamePk}:${event.playId}`,
        },
        conditions: {
          dayNight: feed.gameData.datetime?.dayNight ?? null,
          weather: feed.gameData.weather?.condition ?? null,
          temperatureF: nullableNumber(feed.gameData.weather?.temp),
          wind: feed.gameData.weather?.wind ?? null,
        },
        review: {
          status: 'needs-frame-review',
          blockers: [
            'LIVE_FRAME_NOT_CONFIRMED',
            'CAMERA_LOCATION_NOT_DOCUMENTED',
            'SECTION_NOT_IDENTIFIED',
            'SHADOW_BOUNDARY_ROW_NOT_LABELED',
            'ATMOSPHERIC_VISIBILITY_NOT_REVIEWED',
            'GEOMETRY_ARTIFACT_NOT_LINKED',
          ],
        },
      });
    }
  }
  return seeds.sort((left, right) => left.event.midpointTime.localeCompare(right.event.midpointTime));
}

export function parseSavantSportyClipPage(html: string, expectedPlayId: string): string | null {
  const escapedPlayId = expectedPlayId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pagePlayId = html.match(/\b(?:var|const|let)\s+playId\s*=\s*['"]([^'"]+)['"]/i)?.[1];
  if (pagePlayId !== expectedPlayId || !new RegExp(escapedPlayId).test(html)) return null;
  const videoTag = html.match(/<video\b[^>]*\bid=["']sporty["'][^>]*>[\s\S]*?<\/video>/i)?.[0];
  const sourceUrl = videoTag?.match(/<source\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/i)?.[1];
  if (!sourceUrl) return null;
  try {
    const parsed = new URL(sourceUrl);
    if (
      parsed.protocol !== 'https:'
      || parsed.hostname !== 'sporty-clips.mlb.com'
      || !parsed.pathname.endsWith('.mp4')
      || parsed.username
      || parsed.password
    ) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}
