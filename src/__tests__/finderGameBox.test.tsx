/** @jest-environment jsdom */
/**
 * The box with the chosen game and the answer below it are for the same game,
 * whatever the fan does next. Both finders, with their real picker. The
 * schedules and the weather call the network, so they are stubbed.
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import UnifiedApp from '../UnifiedApp';
import { getUnifiedVenueById } from '../data/unifiedVenues';
import { mlbApi } from '../services/mlbApi';
import { milbApi } from '../services/milbApi';
import { nflApi } from '../services/nflApi';

jest.mock('../services/weatherApi', () => ({ weatherApi: { getForecast: () => new Promise(() => {}) } }));

const football: any = {
  gameId: '777', gameDate: '2025-12-07T18:00:00Z', awayTeam: { name: 'Visitors' }, homeTeam: { name: 'Hosts' },
};
const baseball: any = {
  gamePk: 777, gameDate: '2025-07-20T17:05:00Z', teams: { away: { team: { name: 'Visitors' } }, home: { team: { name: 'Hosts' } } },
};

beforeEach(() => {
  jest.restoreAllMocks();
  // More games than the mobile finder asks the weather for in a minute.
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(nflApi, 'getUpcomingVenueGames').mockResolvedValue([football]);
  jest.spyOn(mlbApi, 'getSchedule').mockResolvedValue([]);
  jest.spyOn(mlbApi, 'getHomeGamesForStadium').mockReturnValue([baseball]);
  jest.spyOn(milbApi, 'getTeamScheduleByLevel').mockResolvedValue({ dates: [] });
  jest.spyOn(milbApi, 'getHomeGamesForVenue').mockReturnValue([baseball]);
});
afterEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});

const box = () => document.querySelector('.game-select [class*="singleValue"]')?.textContent ?? 'empty';
/** What the finder says; for MLB, where it sends the fan. */
const answer = () =>
  document.querySelector('[aria-label^="Where are the shaded seats"]')?.textContent
  ?? screen.queryByText(/shade map$/)?.getAttribute('href')
  ?? 'none';
const shown = () => ({ box: box(), answer: answer() });

const listLoaded = () => waitFor(() => expect(document.querySelector('#game-select')).toBeTruthy(), { timeout: 3000 });
const choose = (input: string, name: RegExp) => {
  fireEvent.keyDown(document.querySelector(input)!, { key: 'ArrowDown' });
  fireEvent.click(screen.getByRole('option', { name }));
};
const chooseStadium = (id: string) => choose('#venue-select', new RegExp(`^${getUnifiedVenueById(id)!.name} -`));
const tab = (name: RegExp) => fireEvent.click(screen.getByRole('tab', { name }));
const fill = (selector: string, value: string) => fireEvent.change(document.querySelector(selector)!, { target: { value } });

const openAndPickGame = async (width: number, id: string) => {
  window.innerWidth = width;
  window.history.replaceState(null, '', `/seats-shade-finder?venue=${id}`);
  render(<UnifiedApp />);
  await listLoaded();
  choose('#game-select', /Visitors @ Hosts/);
};

/** A stadium, another one, and the answer for the game and for 1:00 PM on September 14. */
const LEAGUES: Record<string, [string, string, RegExp, RegExp]> = {
  NFL: ['lambeau-field', 'lumen-field', /^For the 12:00 PM game on December 7 /, /^For the 1:00 PM game on September 14 /],
  MLB: ['yankees', 'redsox', /^\/stadium\/yankees\?game=777$/, /^\/stadium\/yankees$/],
  MiLB: ['buffalo-bisons', 'durham-bulls', /^For the 1:05 PM game on July 20 /, /^For the 1:00 PM game on September 14 /],
};
const GAME = expect.stringContaining('Visitors @ Hosts');
const NOTHING = { box: 'empty', answer: 'none' };

describe.each([['desktop', 1280], ['mobile', 390]])('the game box and the answer on %s', (_device, width) => {
  describe.each(Object.entries(LEAGUES))('%s', (_league, [id, another, forGame, forCustom]) => {
    const BOTH = { box: GAME, answer: expect.stringMatching(forGame) };
    beforeEach(async () => {
      await openAndPickGame(width, id);
      expect(shown()).toEqual(BOTH);
    });

    it('stay when Custom Time is opened and left', async () => {
      tab(/custom time/i);
      tab(/real games/i);
      await listLoaded();
      expect(shown()).toEqual(BOTH);
    });

    it('change when a custom time is applied, and back with the game', async () => {
      tab(/custom time/i);
      fill('#custom-date', '2025-09-14');
      fill('#custom-time', '13:00');
      fireEvent.click(document.querySelector('#custom-panel .apply-custom-btn')!);
      tab(/real games/i);
      await listLoaded();
      expect(shown()).toEqual({ box: 'empty', answer: expect.stringMatching(forCustom) });
      choose('#game-select', /Visitors @ Hosts/);
      expect(shown()).toEqual(BOTH);
    });

    it('both clear when the same stadium is picked again', async () => {
      chooseStadium(id);
      expect(shown()).toEqual(NOTHING);
      choose('#game-select', /Visitors @ Hosts/);
      expect(shown()).toEqual(BOTH);
    });

    it('both clear when another stadium is picked', async () => {
      chooseStadium(another);
      await listLoaded();
      expect(shown()).toEqual(NOTHING);
    });
  });

  it('NFL: change with the date form, when the list has come back empty', async () => {
    const [id, , forGame, forCustom] = LEAGUES.NFL;
    await openAndPickGame(width, id);
    jest.spyOn(nflApi, 'getUpcomingVenueGames').mockResolvedValue([]);
    tab(/custom time/i);
    tab(/real games/i);
    await waitFor(() => expect(document.querySelector('#game-date')).toBeTruthy(), { timeout: 3000 });
    expect(shown()).toEqual({ box: GAME, answer: expect.stringMatching(forGame) });
    fill('#game-date', '2025-09-14');
    fill('#game-time', '13:00');
    fireEvent.click(screen.getByText('Calculate Shade'));
    expect(shown()).toEqual({ box: 'empty', answer: expect.stringMatching(forCustom) });
  });
});
