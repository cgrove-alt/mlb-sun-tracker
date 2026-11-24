import { nflApi } from '../nflApi';
import { nflApiClient } from '../nflApiClient';
import { ALL_UNIFIED_VENUES } from '../../data/unifiedVenues';
import { formatGameTimeInStadiumTZ } from '../../utils/dateTimeUtils';
// ESPN's own answers (2026-11-23), cut down to the fields we read.
import { jaguars2025, ravens2026 } from './fixtures/espnTeamSchedules.json';
import { bills2026 } from './fixtures/espnBills.json';

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

  it('gives none when ESPN lists none, this season or next', async () => {
    answer({ events: [] });
    expect(await nflApi.getUpcomingVenueGames('everbank-stadium')).toEqual([]);
    expect(espn.mock.calls.map(([url]) => url.match(/season=(\d+)/)[1])).toEqual(['2025', '2026']);
  });

  it('fails when ESPN does', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    espn.mockImplementation(async () => ({ ok: false, status: 404, statusText: 'Not Found' }));
    await expect(nflApi.getUpcomingVenueGames('everbank-stadium')).rejects.toThrow('NFL schedule data is currently unavailable');
  });

  it.each(ALL_UNIFIED_VENUES.filter((venue) => venue.league === 'NFL').map((venue) => venue.id))(
    '%s has a team to ask for', async (venueId) => {
      answer({ events: [] });
      await nflApiClient.fetchVenueSchedule(venueId, 2025).catch(() => {});
      expect(espn).toHaveBeenCalledTimes(1);
      expect(espn.mock.calls[0][0]).toMatch(/\/teams\/\d+\/schedule\?season=2025&seasontype=2$/);
    });
});

// They moved across the street in 2026. ESPN's answer, on 2026-11-23.
describe('the Bills', () => {
  it('list their games at the new stadium', async () => {
    answer(bills2026);
    const games = await nflApiClient.fetchVenueSchedule('highmark-stadium', 2026);
    expect(games).toHaveLength(7); // the eighth has no time yet
    expect(label(games[0].gameDate, 'America/New_York')).toBe('Sep 17, 8:15 PM EDT');
  });

  it('give the ones still to come', async () => {
    jest.setSystemTime(new Date('2026-11-24T12:00:00Z'));
    answer(bills2026);
    const games = await nflApi.getUpcomingVenueGames('highmark-stadium');
    expect(games.map((game) => `${label(game.gameDate, 'America/New_York')} ${game.awayTeam.name}`))
      .toEqual(['Nov 26, 8:20 PM EST Chiefs', 'Dec 19, 8:20 PM EST Bears']);
  });
});
