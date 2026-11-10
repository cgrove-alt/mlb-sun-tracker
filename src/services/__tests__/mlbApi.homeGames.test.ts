import { mlbApi, MLB_STADIUM_VENUE_IDS, type MLBGame } from '../mlbApi';
import { MLB_STADIUMS } from '../../data/stadiums';

const game = (gamePk: number, venueId: number, venueName: string, gameType: string, statusCode = 'S'): MLBGame => ({
  gamePk,
  gameDate: '2027-03-25T17:35:00Z',
  status: { statusCode, detailedState: 'Scheduled' },
  teams: { away: { team: { id: 141, name: 'Toronto Blue Jays' } }, home: { team: { id: 147, name: 'New York Yankees' } } },
  venue: { id: venueId, name: venueName },
  gameType,
  scheduledInnings: 9,
});

describe('getHomeGamesForStadium', () => {
  it('keeps only games played at the park itself', () => {
    const games = [
      game(1, 2523, 'George M. Steinbrenner Field', 'S'), // spring training in Tampa
      game(2, 3313, 'Yankee Stadium', 'R'),
      game(3, 5100, 'London Stadium', 'R'), // neutral-site "home" game
      game(4, 3313, 'Yankee Stadium', 'R', 'C'), // cancelled
      game(5, 3313, 'Yankee Stadium', 'R', 'F'), // already played
    ];
    expect(mlbApi.getHomeGamesForStadium('yankees', games).map((g) => g.gamePk)).toEqual([2]);
  });

  it('has a venue ID for every MLB stadium', () => {
    for (const stadium of MLB_STADIUMS) expect(MLB_STADIUM_VENUE_IDS[stadium.id]).toBeGreaterThan(0);
  });

  it('returns nothing for an unknown stadium', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(mlbApi.getHomeGamesForStadium('nowhere', [game(1, 3313, 'Yankee Stadium', 'R')])).toEqual([]);
  });
});
