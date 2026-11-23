import { nflApi } from '../nflApi';
import { nflApiClient } from '../nflApiClient';
import { ALL_UNIFIED_VENUES } from '../../data/unifiedVenues';
import { formatGameTimeInStadiumTZ } from '../../utils/dateTimeUtils';
// ESPN's own answers (2026-11-23), cut down to the fields we read.
import { jaguars2025, ravens2026 } from './fixtures/espnTeamSchedules.json';
import { bills2025, bills2026 } from './fixtures/espnBills.json';

const NOW = new Date('2025-09-01T12:00:00Z');
const espn = jest.fn();

beforeEach(() => {
  jest.useFakeTimers({ now: NOW, doNotFake: ['setTimeout'] });
  nflApiClient.clearCache();
  espn.mockReset();
  global.fetch = espn;
});
afterEach(() => jest.useRealTimers());

const answer = (schedule: unknown) =>
  espn.mockImplementation(async () => ({ ok: true, status: 200, json: async () => schedule }));

/** The time the picker shows for a game, as `UnifiedGameSelector` works it out. */
const label = (gameDate: string, timezone: string) =>
  formatGameTimeInStadiumTZ(new Date(gameDate), timezone, true);

describe("an NFL stadium's home games", () => {
  it("asks ESPN once, for the stadium's team and season", async () => {
    answer(jaguars2025);
    await nflApiClient.fetchVenueSchedule('everbank-stadium', 2025);
    expect(espn.mock.calls.map(([url]) => url)).toEqual([
      'https://site.api.espn.com/apis/site/v2/sports/football/nfl/teams/30/schedule?season=2025&seasontype=2',
    ]);
  });

  it('sends no header of its own: ESPN refuses the preflight a browser makes for one', async () => {
    answer(jaguars2025);
    await nflApiClient.fetchVenueSchedule('everbank-stadium', 2025);
    expect(espn.mock.calls[0][1]?.headers).toBeUndefined();
  });

  it('keeps the kickoff, so the picker shows the real day and time', async () => {
    answer(jaguars2025);
    const games = await nflApiClient.fetchVenueSchedule('everbank-stadium', 2025);
    const shown = (awayTeam: string) =>
      label(games.find((game) => game.awayTeam.name === awayTeam)!.gameDate, 'America/New_York');
    expect(shown('Panthers')).toBe('Sep 7, 1:00 PM EDT');
    expect(shown('Chiefs')).toBe('Oct 6, 8:15 PM EDT'); // Monday night: already Tuesday in UTC
    expect(shown('Colts')).toBe('Dec 7, 1:00 PM EST');
  });

  it('leaves out road games and the game in London', async () => {
    answer(jaguars2025);
    const games = await nflApiClient.fetchVenueSchedule('everbank-stadium', 2025);
    expect(games.map((game) => `${game.awayTeam.name} @ ${game.homeTeam.name}`)).toEqual([
      'Panthers @ Jaguars', 'Texans @ Jaguars', 'Chiefs @ Jaguars', 'Seahawks @ Jaguars',
      'Chargers @ Jaguars', 'Colts @ Jaguars', 'Jets @ Jaguars', 'Titans @ Jaguars',
    ]);
  });

  it('leaves out a game with no time set yet', async () => {
    answer(ravens2026);
    const games = await nflApiClient.fetchVenueSchedule('m-t-bank-stadium', 2026);
    expect(games).toHaveLength(7);
    expect(games.some((game) => game.gameDate.startsWith('2027-01-10'))).toBe(false);
  });

  it('gives the upcoming ones, the next first', async () => {
    jest.setSystemTime(new Date('2025-10-08T12:00:00Z'));
    answer(jaguars2025);
    const games = await nflApi.getUpcomingVenueGames('everbank-stadium');
    expect(games.map((game) => game.awayTeam.name)).toEqual(['Seahawks', 'Chargers', 'Colts', 'Jets', 'Titans']);
    expect(espn).toHaveBeenCalledTimes(1);
  });

  it('fails when ESPN has none, so the fan gets the date form', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    answer({ events: [] });
    await expect(nflApi.getUpcomingVenueGames('everbank-stadium')).rejects.toThrow('NFL schedule data is currently unavailable');
    expect(espn).toHaveBeenCalledTimes(1);
  });

  it.each(ALL_UNIFIED_VENUES.filter((venue) => venue.league === 'NFL').map((venue) => venue.id))(
    '%s has a team to ask for', async (venueId) => {
      answer({ events: [] });
      await nflApiClient.fetchVenueSchedule(venueId, 2025).catch(() => {});
      expect(espn).toHaveBeenCalledTimes(1);
      expect(espn.mock.calls[0][0]).toMatch(/\/teams\/\d+\/schedule\?season=2025&seasontype=2$/);
    });
});

// The Bills moved in 2026. We measured the stadium they left.
describe('the Bills', () => {
  it('list their games at the stadium we measured', async () => {
    answer(bills2025);
    const games = await nflApiClient.fetchVenueSchedule('highmark-stadium', 2025);
    expect(games).toHaveLength(9);
    expect(label(games[0].gameDate, 'America/New_York')).toBe('Sep 7, 8:20 PM EDT');
  });

  it('list none of the games at their new one', async () => {
    answer(bills2026);
    expect(await nflApiClient.fetchVenueSchedule('highmark-stadium', 2026)).toEqual([]);
  });

  it('give the fan the date form instead', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.setSystemTime(new Date('2026-11-23T12:00:00Z'));
    answer(bills2026);
    await expect(nflApi.getUpcomingVenueGames('highmark-stadium')).rejects.toThrow('NFL schedule data is currently unavailable');
  });
});
