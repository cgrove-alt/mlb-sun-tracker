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
  gamePk: 777, gameDate: '2025-07-20T17:05:00Z', status: {}, teams: { away: { team: { name: 'Visitors' } }, home: { team: { name: 'Hosts' } } },
};

// Earlier in the list, so a list that opens at its start shows up.
const earlierFootball: any = { ...football, gameId: '776', gameDate: '2025-11-30T18:00:00Z', awayTeam: { name: 'Others' } };
const earlierBaseball: any = {
  ...baseball, gamePk: 776, gameDate: '2025-07-13T17:05:00Z', teams: { ...baseball.teams, away: { team: { name: 'Others' } } },
};
/** What the schedules answer with. */
const schedule = (footballGame: any, baseballGame: any) => {
  jest.spyOn(nflApi, 'getUpcomingVenueGames').mockResolvedValue([earlierFootball, footballGame]);
  jest.spyOn(mlbApi, 'getHomeGamesForStadium').mockReturnValue([earlierBaseball, baseballGame]);
  jest.spyOn(milbApi, 'getHomeGamesForVenue').mockReturnValue([earlierBaseball, baseballGame]);
};

beforeEach(() => {
  jest.restoreAllMocks();
  // More games than the mobile finder asks the weather for in a minute.
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(mlbApi, 'getSchedule').mockResolvedValue([]);
  jest.spyOn(milbApi, 'getTeamScheduleByLevel').mockResolvedValue({ dates: [] });
  schedule(football, baseball);
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
/** The games the open list marks as chosen. */
const marked = () => screen.queryAllByRole('option', { selected: true }).map((option) => option.textContent);
/** Opens the game list and leaves it with Tab, which picks the game it opened on. */
const openAndLeaveList = () => {
  const list = document.querySelector('#game-select')!;
  fireEvent.keyDown(list, { key: 'ArrowDown' });
  fireEvent.keyDown(list, { key: 'Tab' });
};
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

    it('stay when the list is opened again and left', () => {
      openAndLeaveList();
      expect(shown()).toEqual(BOTH);
    });

    it.each([['game', '#game-select'], ['stadium', '#venue-select']])('the %s list opens scrolled to what was chosen', async (_list, input) => {
      // A list that shows 300 px, with every option below that.
      jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
        return { bottom: this.getAttribute('role') === 'option' ? 1000 : 300 } as DOMRect;
      });
      jest.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(2000);
      jest.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockReturnValue(900);
      fireEvent.keyDown(document.querySelector(input)!, { key: 'ArrowDown' });
      // At once: the weather, a second on, redraws the finder, which scrolls it too.
      await waitFor(() => expect(screen.getByRole('listbox').scrollTop).toBe(900), { timeout: 200 });
    });

    it('stay when the list is opened again after Custom Time, and left', async () => {
      tab(/custom time/i);
      tab(/real games/i);
      await listLoaded();
      openAndLeaveList();
      expect(shown()).toEqual(BOTH);
    });

    it('keep the time that was picked when the list comes back with another', async () => {
      const picked = shown();
      schedule({ ...football, gameDate: '2025-12-07T21:25:00Z' }, { ...baseball, gameDate: '2025-07-20T23:10:00Z' });
      tab(/custom time/i);
      tab(/real games/i);
      await listLoaded();
      expect(shown()).toEqual(picked);
      // Nor is the other time marked as chosen.
      fireEvent.keyDown(document.querySelector('#game-select')!, { key: 'ArrowDown' });
      expect(marked()).toEqual([]);
    });

    it('match the one game the list marks', () => {
      fireEvent.keyDown(document.querySelector('#game-select')!, { key: 'ArrowDown' });
      expect(marked()).toEqual([box()]);
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
