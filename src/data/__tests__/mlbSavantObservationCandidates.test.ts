import { MLB_STADIUMS } from '../stadiums';
import {
  parseSavantSportyClipPage,
  selectMlbSavantObservationSeeds,
  type MlbSavantGameFeed,
} from '../mlbSavantObservationCandidates';

const stadium = MLB_STADIUMS.find((candidate) => candidate.id === 'marlins')!;

function feed(): MlbSavantGameFeed {
  return {
    gamePk: 123,
    gameData: {
      datetime: { dayNight: 'day' },
      venue: {
        name: stadium.name,
        location: { defaultCoordinates: { latitude: stadium.latitude, longitude: stadium.longitude } },
      },
      weather: { condition: 'Sunny', temp: '82', wind: '8 mph, Out To RF' },
    },
    liveData: {
      plays: {
        allPlays: [{
          about: { inning: 2, halfInning: 'top' },
          result: { description: 'A flyout.', eventType: 'field_out' },
          hitData: {
            trajectory: 'fly_ball',
            hardness: 'medium',
            location: '8',
            coordinates: { coordX: 127.3, coordY: 31.2 },
          },
          playEvents: [{
            playId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
            startTime: '2025-04-12T18:00:00.000Z',
            endTime: '2025-04-12T18:00:04.000Z',
            details: { isInPlay: true, description: 'In play, out(s)', eventType: 'field_out' },
          }, {
            playId: 'ignored-pitch',
            startTime: '2025-04-12T17:59:50.000Z',
            endTime: '2025-04-12T17:59:51.000Z',
            details: { isInPlay: false },
          }],
        }],
      },
    },
  };
}

describe('selectMlbSavantObservationSeeds', () => {
  it('selects daylight balls in play with timestamp and hit provenance', () => {
    const [seed] = selectMlbSavantObservationSeeds(stadium, feed());
    expect(seed).toMatchObject({
      candidateId: 'savant-123-aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      playId: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      hitData: { trajectory: 'fly_ball', location: '8', coordinates: { coordX: 127.3, coordY: 31.2 } },
      evidence: {
        timestampMethod: 'mlb-play-event-window',
        independenceKey: 'mlb-play:123:aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      },
      review: { status: 'needs-frame-review' },
    });
    expect(seed.video.assets.mp4Url).toBeNull();
    expect(seed.solarPositionAtMidpoint.altitudeDegrees).toBeGreaterThan(0);
  });

  it('fails on a mismatched venue', () => {
    const wrong = feed();
    wrong.gameData.venue!.name = 'Wrong Park';
    expect(() => selectMlbSavantObservationSeeds(stadium, wrong)).toThrow('does not match');
  });
});

describe('parseSavantSportyClipPage', () => {
  const playId = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';
  it('accepts the expected play and official clip host', () => {
    const html = `<script>var playId = '${playId}';</script><video id="sporty"><source src="https://sporty-clips.mlb.com/example.mp4" type="video/mp4"></video>`;
    expect(parseSavantSportyClipPage(html, playId)).toBe('https://sporty-clips.mlb.com/example.mp4');
  });

  it('rejects mismatched plays and non-MLB clip hosts', () => {
    const wrongPlay = '<script>var playId = "wrong";</script><video id="sporty"><source src="https://sporty-clips.mlb.com/example.mp4"></video>';
    const wrongHost = `<script>var playId = '${playId}';</script><video id="sporty"><source src="https://example.com/example.mp4"></video>`;
    expect(parseSavantSportyClipPage(wrongPlay, playId)).toBeNull();
    expect(parseSavantSportyClipPage(wrongHost, playId)).toBeNull();
  });
});
