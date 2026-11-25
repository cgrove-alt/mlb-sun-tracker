import { mlbApi, MLB_STADIUM_VENUE_IDS, type MLBGame } from '../mlbApi';
import { MLB_STADIUMS } from '../../data/stadiums';

const game = (gamePk: number, venueId: number, venueName: string, gameType: string, abstractGameState: MLBGame['status']['abstractGameState'] = 'Preview'): MLBGame => ({
  gamePk,
  gameDate: '2027-03-25T17:35:00Z',
  status: { abstractGameState, statusCode: '', detailedState: '' },
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
    ];
    expect(mlbApi.getHomeGamesForStadium('yankees', games).map((g) => g.gamePk)).toEqual([2]);
  });

  // Each as MLB lists it, from https://statsapi.mlb.com/api/v1/gameStatus.
  it.each([
    ['S', 'Scheduled', 'Preview'],
    ['PR', 'Delayed Start', 'Preview'],
    ['PW', 'Warmup', 'Live'],
    ['I', 'In Progress', 'Live'],
    ['IR', 'Delayed', 'Live'],
    ['UR', 'Suspended', 'Live'],
  ] as const)('keeps a game to come or being played (%s, %s)', (statusCode, detailedState, abstractGameState) => {
    const kept = { ...game(1, 3313, 'Yankee Stadium', 'R'), status: { statusCode, detailedState, abstractGameState } };
    expect(mlbApi.getHomeGamesForStadium('yankees', [kept])).toEqual([kept]);
  });
  it.each([
    ['F', 'Final'],
    ['O', 'Game Over'],
    ['FR', 'Completed Early'],
    ['FO', 'Completed Early'],
    ['FT', 'Final'],
    ['DR', 'Postponed'],
    ['DI', 'Postponed'],
    ['DS', 'Postponed'],
    ['CR', 'Cancelled'],
  ])("drops one that's over or won't be played (%s, %s)", (statusCode, detailedState) => {
    const over = { ...game(1, 3313, 'Yankee Stadium', 'R'), status: { statusCode, detailedState, abstractGameState: 'Final' as const } };
    expect(mlbApi.getHomeGamesForStadium('yankees', [over])).toEqual([]);
  });

  // Fenway, April 5 2025: rained out, and made up the next day under the same number.
  it('leaves the makeup of a postponed game, not the game', () => {
    const postponed: MLBGame = {
      ...game(778443, 3, 'Fenway Park', 'R'), gameDate: '2025-04-05T20:10:00Z',
      status: { statusCode: 'DR', detailedState: 'Postponed', abstractGameState: 'Final' },
    };
    const makeup: MLBGame = {
      ...postponed, gameDate: '2025-04-06T17:35:00Z',
      status: { statusCode: 'S', detailedState: 'Scheduled', abstractGameState: 'Preview' },
    };
    expect(mlbApi.getHomeGamesForStadium('redsox', [postponed, makeup])).toEqual([makeup]);
  });

  it('has a venue ID for every MLB stadium', () => {
    for (const stadium of MLB_STADIUMS) expect(MLB_STADIUM_VENUE_IDS[stadium.id]).toBeGreaterThan(0);
  });

  it('returns nothing for an unknown stadium', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(mlbApi.getHomeGamesForStadium('nowhere', [game(1, 3313, 'Yankee Stadium', 'R')])).toEqual([]);
  });
});

describe('getUpcomingHomeGames', () => {
  it('asks for one team, keeps regular-season games at the park, soonest first', async () => {
    const spy = jest.spyOn(mlbApi, 'getTeamSchedule').mockResolvedValue([
      { ...game(3, 3313, 'Yankee Stadium', 'R'), gameDate: '2027-04-10T17:35:00Z' },
      { ...game(1, 2523, 'George M. Steinbrenner Field', 'S'), gameDate: '2027-02-20T18:05:00Z' },
      { ...game(2, 3313, 'Yankee Stadium', 'R'), gameDate: '2027-03-25T17:35:00Z' },
      { ...game(4, 3313, 'Yankee Stadium', 'E'), gameDate: '2027-03-23T17:05:00Z' },
    ]);
    const games = await mlbApi.getUpcomingHomeGames('yankees', new Date(2026, 10, 10));
    expect(spy).toHaveBeenCalledWith(147, '2026-11-10', expect.any(String));
    expect(games.map((g) => g.gamePk)).toEqual([2, 3]);
    spy.mockRestore();
  });
});
