/** @jest-environment node */

import { MLB_STADIUMS } from '../stadiums';
import {
  buildMlbObservationCandidates,
  scoreMlbObservationReviewPriority,
  type MlbGameContent,
  type MlbGameFeed,
} from '../mlbObservationCandidates';

const stadium = MLB_STADIUMS.find((candidate) => candidate.id === 'padres')!;

function feed(): MlbGameFeed {
  return {
    gamePk: 777239,
    gameData: {
      datetime: { dateTime: '2025-07-04T22:40:00Z', dayNight: 'day' },
      venue: {
        id: 2680,
        name: 'Petco Park',
        location: {
          defaultCoordinates: { latitude: 32.707861, longitude: -117.157278 },
          azimuthAngle: 0,
        },
        timeZone: { id: 'America/Los_Angeles' },
      },
      weather: { condition: 'Sunny', temp: '74', wind: '10 mph, L To R' },
    },
    liveData: {
      plays: {
        allPlays: [{
          about: { inning: 3, halfInning: 'top' },
          playEvents: [{
            playId: '580ea49d-b534-3ec8-8fd7-ddf2cbc617ae',
            startTime: '2025-07-04T23:14:21.906Z',
            endTime: '2025-07-04T23:14:36.657Z',
            details: { description: 'In play, run(s)' },
          }],
        }],
      },
    },
  };
}

function content(): MlbGameContent {
  return {
    highlights: {
      highlights: {
        items: [{
          id: 'randy-vasquez-in-play-run-s-to-marcus-semien',
          guid: '580ea49d-b534-3ec8-8fd7-ddf2cbc617ae',
          title: "Marcus Semien's two-run double",
          date: '2025-07-04T23:15:18.582Z',
          duration: '00:00:30',
          playbacks: [
            { name: 'mp4Avc', url: 'https://mlb-cuts-diamond.mlb.com/example.mp4' },
            { name: 'hlsCloud', url: 'https://mlb-cuts-diamond.mlb.com/example.m3u8' },
            { name: 'trickplay', url: 'https://mlb-cuts-diamond.mlb.com/05s.%.jpg' },
            { name: 'untrusted', url: 'https://example.com/not-accepted.mp4' },
          ],
        }],
      },
    },
  };
}

describe('MLB observation candidate builder', () => {
  it('joins a clip GUID to the official play-event time window without promoting it', () => {
    const candidates = buildMlbObservationCandidates(stadium, feed(), content());

    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatchObject({
      candidateId: 'mlb-777239-580ea49d-b534-3ec8-8fd7-ddf2cbc617ae-randy-vasquez-in-play-run-s-to-marcus-semien',
      playId: '580ea49d-b534-3ec8-8fd7-ddf2cbc617ae',
      event: {
        startTime: '2025-07-04T23:14:21.906Z',
        endTime: '2025-07-04T23:14:36.657Z',
        stadiumLocalDate: '2025-07-04',
        eventWindowSeconds: 14.75,
      },
      evidence: {
        timestampMethod: 'mlb-play-guid-event-window',
        independenceKey: 'mlb-play:777239:580ea49d-b534-3ec8-8fd7-ddf2cbc617ae',
      },
      video: {
        assetId: 'randy-vasquez-in-play-run-s-to-marcus-semien',
        assets: {
          mp4Url: 'https://mlb-cuts-diamond.mlb.com/example.mp4',
          hlsUrl: 'https://mlb-cuts-diamond.mlb.com/example.m3u8',
          trickplayPatternUrl: 'https://mlb-cuts-diamond.mlb.com/05s.%.jpg',
        },
      },
      review: {
        status: 'needs-frame-review',
        priority: { score: 1, signals: ['MID_LOW_SOLAR_ALTITUDE'] },
      },
    });
    expect(candidates[0].solarPositionAtMidpoint.altitudeDegrees).toBeGreaterThan(0);
    expect(candidates[0].video.publishedAt).not.toBe(candidates[0].event.midpointTime);
  });

  it('rejects a feed for a different venue', () => {
    const wrongVenue = feed();
    wrongVenue.gameData.venue!.name = 'Dodger Stadium';
    expect(() => buildMlbObservationCandidates(stadium, wrongVenue, content()))
      .toThrow('does not match Petco Park');
  });

  it('ignores unmatched clips and malformed event timestamps', () => {
    const malformed = feed();
    malformed.liveData!.plays!.allPlays![0].playEvents![0].endTime = 'not-a-time';
    expect(buildMlbObservationCandidates(stadium, malformed, content())).toEqual([]);
  });

  it('demotes fully cloudy footage without treating the heuristic as evidence', () => {
    expect(scoreMlbObservationReviewPriority('Three-run homer', 18, 'Cloudy')).toEqual({
      score: 2,
      signals: [
        'LIKELY_BALL_TRACK_TO_STANDS',
        'LOW_SOLAR_ALTITUDE',
        'WEATHER_UNLIKELY_TO_SHOW_DIRECT_SUN_BOUNDARY',
      ],
    });
  });

  it('keeps multiple MLB edits uniquely addressable but not independent', () => {
    const editedContent = content();
    editedContent.highlights!.highlights!.items!.push({
      ...editedContent.highlights!.highlights!.items![0],
      id: 'alternate-camera-edit',
      title: 'Alternate edit of the same play',
    });

    const candidates = buildMlbObservationCandidates(stadium, feed(), editedContent);
    expect(candidates).toHaveLength(2);
    expect(new Set(candidates.map((candidate) => candidate.candidateId)).size).toBe(2);
    expect(new Set(candidates.map((candidate) => candidate.evidence.independenceKey)).size).toBe(1);
  });

  it('does not retain a playback URL from a non-MLB host', () => {
    const untrustedContent = content();
    untrustedContent.highlights!.highlights!.items![0].playbacks = [
      { name: 'mp4Avc', url: 'https://example.com/untrusted.mp4' },
    ];

    const [candidate] = buildMlbObservationCandidates(stadium, feed(), untrustedContent);
    expect(candidate.video.assets.mp4Url).toBeNull();
  });
});
