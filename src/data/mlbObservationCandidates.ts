import type { Stadium } from './stadiums';
import { getSunPosition } from '../utils/sunPosition';
import { formatInTimeZone } from 'date-fns-tz';

interface MlbPlayEvent {
  playId?: string;
  startTime?: string;
  endTime?: string;
  details?: { description?: string };
}

interface MlbPlay {
  about?: { inning?: number; halfInning?: string };
  playEvents?: MlbPlayEvent[];
}

export interface MlbGameFeed {
  gamePk: number;
  gameData: {
    datetime?: { dateTime?: string; dayNight?: string };
    venue?: {
      id?: number;
      name?: string;
      location?: {
        defaultCoordinates?: { latitude?: number; longitude?: number };
        azimuthAngle?: number;
      };
      timeZone?: { id?: string };
    };
    weather?: { condition?: string; temp?: string; wind?: string };
  };
  liveData?: { plays?: { allPlays?: MlbPlay[] } };
}

interface MlbHighlight {
  id?: string;
  guid?: string;
  title?: string;
  date?: string;
  duration?: string;
  playbacks?: Array<{
    name?: string;
    url?: string;
    width?: string;
    height?: string;
  }>;
}

export interface MlbGameContent {
  highlights?: { highlights?: { items?: MlbHighlight[] } };
}

export interface MlbObservationCandidate {
  candidateId: string;
  stadiumId: string;
  gamePk: number;
  playId: string;
  event: {
    inning: number | null;
    halfInning: string | null;
    description: string | null;
    startTime: string;
    endTime: string;
    midpointTime: string;
    stadiumLocalDate: string;
    eventWindowSeconds: number;
  };
  solarPositionAtMidpoint: {
    altitudeDegrees: number;
    azimuthDegrees: number;
  };
  video: {
    assetId: string;
    title: string;
    pageUrl: string;
    publishedAt: string | null;
    duration: string | null;
    assets: {
      mp4Url: string | null;
      hlsUrl: string | null;
      trickplayPatternUrl: string | null;
    };
  };
  evidence: {
    gameFeedUrl: string;
    gameContentUrl: string;
    timestampMethod: 'mlb-play-guid-event-window';
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
    priority: {
      score: number;
      signals: readonly string[];
    };
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

function officialPlaybackUrl(
  highlight: MlbHighlight,
  names: readonly string[],
): string | null {
  const playback = highlight.playbacks?.find((candidate) =>
    candidate.name && names.includes(candidate.name) && candidate.url,
  );
  if (!playback?.url) return null;
  try {
    const parsed = new URL(playback.url);
    if (parsed.protocol !== 'https:' || !/(^|\.)mlb\.com$/i.test(parsed.hostname)) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Review-order heuristic only. It can reduce manual effort, but never changes
 * evidence status or publication eligibility.
 */
export function scoreMlbObservationReviewPriority(
  title: string,
  solarAltitudeDegrees: number,
  weather: string | null = null,
): { score: number; signals: string[] } {
  const normalized = title.toLowerCase();
  let score = 0;
  const signals: string[] = [];
  const add = (points: number, signal: string): void => {
    score += points;
    signals.push(signal);
  };

  if (/\b(home run|homer|homers)\b/.test(normalized)) add(4, 'LIKELY_BALL_TRACK_TO_STANDS');
  if (/\bfan\b|\bstands?\b|\bbleachers?\b/.test(normalized)) add(4, 'LIKELY_SEATING_CLOSEUP');
  if (/\b(catch|catches|caught)\b/.test(normalized)) add(1, 'POSSIBLE_WIDE_FIELD_VIEW');
  if (/\b(foul|sacrifice fly|sac fly)\b/.test(normalized)) add(1, 'POSSIBLE_BALL_TRACK');
  if (/\b(strikeout|strikes out|called out on strikes|groundout|forceout)\b/.test(normalized)) {
    add(-2, 'LIKELY_FIELD_ONLY');
  }
  if (solarAltitudeDegrees <= 25) add(2, 'LOW_SOLAR_ALTITUDE');
  else if (solarAltitudeDegrees <= 45) add(1, 'MID_LOW_SOLAR_ALTITUDE');
  const normalizedWeather = weather?.toLowerCase() ?? '';
  if (/^(cloudy|overcast|rain|drizzle|fog)/.test(normalizedWeather)) {
    add(-4, 'WEATHER_UNLIKELY_TO_SHOW_DIRECT_SUN_BOUNDARY');
  } else if (/partly cloudy|scattered clouds/.test(normalizedWeather)) {
    add(0, 'VARIABLE_CLOUD_COVER_REQUIRES_REVIEW');
  }

  return { score, signals };
}

/**
 * Join official MLB highlight GUIDs to official play-event timestamps.
 *
 * This only produces review candidates. A highlight can contain replays or
 * edits outside the matched event window, so no candidate is a shadow
 * observation until a reviewer confirms a live frame and labels its section
 * and boundary row.
 */
export function buildMlbObservationCandidates(
  stadium: Stadium,
  feed: MlbGameFeed,
  content: MlbGameContent,
): MlbObservationCandidate[] {
  const venue = feed.gameData.venue;
  const venueCoordinates = venue?.location?.defaultCoordinates;
  if (!venue?.name || venue.name !== stadium.name) {
    throw new Error(`MLB feed venue ${venue?.name ?? '(missing)'} does not match ${stadium.name}`);
  }
  if (
    venueCoordinates?.latitude === undefined ||
    venueCoordinates.longitude === undefined ||
    Math.abs(venueCoordinates.latitude - stadium.latitude) > 0.02 ||
    Math.abs(venueCoordinates.longitude - stadium.longitude) > 0.02
  ) {
    throw new Error(`MLB feed venue coordinates do not match ${stadium.name}`);
  }

  const events = new Map<string, MlbPlayEvent & { inning: number | null; halfInning: string | null }>();
  for (const play of feed.liveData?.plays?.allPlays ?? []) {
    for (const event of play.playEvents ?? []) {
      if (!event.playId || !validInstant(event.startTime) || !validInstant(event.endTime)) continue;
      if (Date.parse(event.endTime) < Date.parse(event.startTime)) continue;
      events.set(event.playId, {
        ...event,
        inning: play.about?.inning ?? null,
        halfInning: play.about?.halfInning ?? null,
      });
    }
  }

  const candidates: MlbObservationCandidate[] = [];
  for (const highlight of content.highlights?.highlights?.items ?? []) {
    if (!highlight.guid || !highlight.id || !highlight.title) continue;
    const event = events.get(highlight.guid);
    if (!event || !event.startTime || !event.endTime) continue;
    const startMillis = Date.parse(event.startTime);
    const endMillis = Date.parse(event.endTime);
    const midpointMillis = startMillis + (endMillis - startMillis) / 2;
    const midpoint = new Date(midpointMillis);
    const sun = getSunPosition(midpoint, stadium.latitude, stadium.longitude);
    if (sun.altitudeDegrees <= 0) continue;
    const priority = scoreMlbObservationReviewPriority(
      highlight.title,
      sun.altitudeDegrees,
      feed.gameData.weather?.condition ?? null,
    );

    candidates.push({
      candidateId: `mlb-${feed.gamePk}-${highlight.guid}-${highlight.id}`,
      stadiumId: stadium.id,
      gamePk: feed.gamePk,
      playId: highlight.guid,
      event: {
        inning: event.inning,
        halfInning: event.halfInning,
        description: event.details?.description ?? null,
        startTime: event.startTime,
        endTime: event.endTime,
        midpointTime: midpoint.toISOString(),
        stadiumLocalDate: formatInTimeZone(midpoint, stadium.timezone, 'yyyy-MM-dd'),
        eventWindowSeconds: Math.round((endMillis - startMillis) / 10) / 100,
      },
      solarPositionAtMidpoint: {
        altitudeDegrees: Math.round(sun.altitudeDegrees * 100) / 100,
        azimuthDegrees: Math.round(sun.azimuthDegrees * 100) / 100,
      },
      video: {
        assetId: highlight.id,
        title: highlight.title,
        pageUrl: `https://www.mlb.com/video/${highlight.id}`,
        publishedAt: validInstant(highlight.date) ? highlight.date : null,
        duration: highlight.duration ?? null,
        assets: {
          mp4Url: officialPlaybackUrl(highlight, ['mp4Avc', 'highBit']),
          hlsUrl: officialPlaybackUrl(highlight, ['hlsCloud', 'HTTP_CLOUD_WIRED', 'HTTP_CLOUD_WIRED_60']),
          trickplayPatternUrl: officialPlaybackUrl(highlight, ['trickplay']),
        },
      },
      evidence: {
        gameFeedUrl: `https://statsapi.mlb.com/api/v1.1/game/${feed.gamePk}/feed/live`,
        gameContentUrl: `https://statsapi.mlb.com/api/v1/game/${feed.gamePk}/content`,
        timestampMethod: 'mlb-play-guid-event-window',
        independenceKey: `mlb-play:${feed.gamePk}:${highlight.guid}`,
      },
      conditions: {
        dayNight: feed.gameData.datetime?.dayNight ?? null,
        weather: feed.gameData.weather?.condition ?? null,
        temperatureF: nullableNumber(feed.gameData.weather?.temp),
        wind: feed.gameData.weather?.wind ?? null,
      },
      review: {
        status: 'needs-frame-review',
        priority,
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

  return candidates.sort((left, right) => left.event.midpointTime.localeCompare(right.event.midpointTime));
}
