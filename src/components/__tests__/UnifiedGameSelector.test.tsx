/** @jest-environment jsdom */
import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { UnifiedGameSelector } from '../UnifiedGameSelector';
import { I18nProvider } from '../../i18n/i18nContext';
import { getUnifiedVenueById } from '../../data/unifiedVenues';
import { mlbApi, upcomingScheduleRange } from '../../services/mlbApi';
import { milbApi } from '../../services/milbApi';
import { nflApi } from '../../services/nflApi';
import { getVenueIdFromStringId } from '../../data/milbTeamMapping';

jest.mock('../../services/mlbApi', () => {
  const actual = jest.requireActual('../../services/mlbApi');
  return { ...actual, upcomingScheduleRange: jest.fn(actual.upcomingScheduleRange) };
});

beforeEach(() => {
  jest.restoreAllMocks();
  localStorage.clear();
});
const wait = (ms: number) => act(async () => { await new Promise((resolve) => setTimeout(resolve, ms)); });

const show = async (className: string) => {
  jest.spyOn(nflApi, 'getUpcomingVenueGames').mockResolvedValue([]);
  render(
    <I18nProvider>
      <div className={className}>
        <UnifiedGameSelector
          selectedVenue={getUnifiedVenueById('lambeau-field')!}
          selectedGame={null}
          onGameSelect={() => {}}
          onVenueChange={() => {}}
        />
      </div>
    </I18nProvider>,
  );
  await wait(900);
};

describe.each([['desktop', 'App'], ['mobile', 'mobile-app']])('the game picker on %s', (_device, className) => {
  it('NFL: switches between the schedule and a date of your own', async () => {
    await show(className);
    fireEvent.click(screen.getByRole('tab', { name: /custom time/i }));
    expect(screen.getByRole('tabpanel').id).toBe('custom-panel');
    fireEvent.click(screen.getByRole('tab', { name: /real games/i }));
    expect(screen.getByRole('tabpanel').id).toBe('games-panel');
  });
});

const nflGame = (away: string, home: string): any => ({
  gameId: home, gameDate: '2026-12-20T18:00Z', awayTeam: { name: away }, homeTeam: { name: home },
});
const baseballGame = (away: string, home: string): any => ({
  gamePk: home, gameDate: '2027-07-20T17:05:00Z', status: {}, teams: { away: { team: { name: away } }, home: { team: { name: home } } },
});

/** Two stadiums in one league, and the league's schedule request. */
const LEAGUES = {
  NFL: {
    ids: ['lambeau-field', 'lumen-field'],
    games: ['Dolphins @ Packers', 'Rams @ Seahawks'],
    request: (answer: (first: boolean) => Promise<unknown>) =>
      jest.spyOn(nflApi, 'getUpcomingVenueGames').mockImplementation(async (id) => {
        const first = id === 'lambeau-field';
        await answer(first);
        return [first ? nflGame('Dolphins', 'Packers') : nflGame('Rams', 'Seahawks')];
      }),
  },
  MLB: {
    ids: ['yankees', 'redsox'],
    games: ['Rays @ Yankees', 'Orioles @ Red Sox'],
    request: (answer: (first: boolean) => Promise<unknown>) => {
      let asked = 0;
      jest.spyOn(mlbApi, 'getSchedule').mockImplementation(async () => {
        await answer(++asked === 1);
        return [];
      });
      jest.spyOn(mlbApi, 'getHomeGamesForStadium').mockImplementation((id) =>
        [id === 'yankees' ? baseballGame('Rays', 'Yankees') : baseballGame('Orioles', 'Red Sox')]);
    },
  },
  MiLB: {
    ids: ['buffalo-bisons', 'durham-bulls'],
    games: ['Mets @ Bisons', 'Knights @ Bulls'],
    request: (answer: (first: boolean) => Promise<unknown>) => {
      let asked = 0;
      jest.spyOn(milbApi, 'getTeamScheduleByLevel').mockImplementation(async () => {
        await answer(++asked === 1);
        return { dates: [] };
      });
      jest.spyOn(milbApi, 'getHomeGamesForVenue').mockImplementation((id) =>
        [id === getVenueIdFromStringId('buffalo-bisons') ? baseballGame('Mets', 'Bisons') : baseballGame('Knights', 'Bulls')]);
    },
  },
};

const Picker = ({ ids, language }: { ids: string[]; language?: 'en' | 'es' | 'ja' }) => {
  const [venue, setVenue] = useState(getUnifiedVenueById(ids[0])!);
  return (
    <I18nProvider initialLanguage={language}>
      <button onClick={() => setVenue(getUnifiedVenueById(ids[1])!)}>the other stadium</button>
      <UnifiedGameSelector selectedVenue={venue} selectedGame={null} onGameSelect={() => {}} onVenueChange={() => {}} />
    </I18nProvider>
  );
};
const openList = () => fireEvent.keyDown(document.querySelector('#game-select')!, { key: 'ArrowDown' });

describe.each(Object.entries(LEAGUES))('while the %s schedule loads', (_league, { ids, request }) => {
  const nothingYet = () => {
    expect(screen.queryByText(/unavailable|No upcoming/)).toBeNull();
    expect(document.querySelector('.game-selector-skeleton')).toBeTruthy();
  };

  it("doesn't say there's none, at the first stadium or the next", async () => {
    request(() => new Promise(() => {}));
    render(<Picker ids={ids} />);
    nothingYet();
    await wait(100); // the request goes out after 200 ms
    nothingYet();
    await wait(300);
    nothingYet();
    fireEvent.click(screen.getByText('the other stadium'));
    nothingYet();
    await wait(100);
    nothingYet();
  });

  it('says so once it knows', async () => {
    request(() => Promise.reject(new Error('down')));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<Picker ids={ids} />);
    await wait(900);
    expect(screen.getByText(/unavailable|Unable to load/)).toBeTruthy();
    expect(document.querySelector('.game-selector-skeleton')).toBeNull();
  });
});

// The UTC date is tomorrow from 8:00 PM Eastern (5:00 PM Pacific), and tonight's
// game isn't on it. `upcomingScheduleRange` gives the fan's own date.
it("MiLB: asks for games from the fan's own date, 30 days on", async () => {
  jest.mocked(upcomingScheduleRange).mockReturnValueOnce({ startDate: 'the fan\'s today', endDate: '30 days on' });
  const asked = jest.spyOn(milbApi, 'getTeamScheduleByLevel').mockResolvedValue({ dates: [] });
  render(<Picker ids={['buffalo-bisons', 'durham-bulls']} />);
  await wait(400);
  expect(asked.mock.calls[0].slice(1, 3)).toEqual(['the fan\'s today', '30 days on']);
  expect(upcomingScheduleRange).toHaveBeenLastCalledWith(expect.any(Date), 30);
});

describe('what the NFL date form says', () => {
  const UNAVAILABLE = 'NFL schedule data is currently unavailable. Please select a date and time for shade calculations.';
  const NONE_LISTED = 'No upcoming games are listed for this stadium. Please select a date and time for shade calculations.';

  it('when the schedule failed to load', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    LEAGUES.NFL.request(() => Promise.reject(new Error('down')));
    render(<Picker ids={LEAGUES.NFL.ids} />);
    await wait(900);
    expect(screen.getByText(UNAVAILABLE)).toBeTruthy();
    expect(screen.queryByText(NONE_LISTED)).toBeNull();
  });

  it('when it loaded and lists no games', async () => {
    jest.spyOn(nflApi, 'getUpcomingVenueGames').mockResolvedValue([]);
    render(<Picker ids={LEAGUES.NFL.ids} />);
    await wait(900);
    expect(screen.getByText(NONE_LISTED)).toBeTruthy();
    expect(screen.queryByText(UNAVAILABLE)).toBeNull();
  });
});

describe.each(Object.entries(LEAGUES))('changing stadium in %s', (_league, { ids, games, request }) => {
  /** Change stadium while the first one's schedule is still on its way; it arrives last. */
  const changeWhileLoading = async (arrive: (first: { resolve: () => void; reject: (error: Error) => void }) => void) => {
    let first: any;
    request((isFirst) => (isFirst ? new Promise<void>((resolve, reject) => { first = { resolve, reject }; }) : Promise.resolve()));
    render(<Picker ids={ids} />);
    await wait(300);
    fireEvent.click(screen.getByText('the other stadium'));
    await wait(900);
    await act(async () => { arrive(first); });
    await wait(100);
  };

  it("a late schedule doesn't land on the new stadium", async () => {
    await changeWhileLoading((first) => first.resolve());
    openList();
    expect(screen.getByText(new RegExp(games[1]))).toBeTruthy();
    expect(screen.queryByText(new RegExp(games[0]))).toBeNull();
  });

  it("a late failure doesn't either", async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await changeWhileLoading((first) => first.reject(new Error('slow and failed')));
    expect(screen.queryByText(/unavailable|Unable to load/)).toBeNull();
    openList();
    expect(screen.getByText(new RegExp(games[1]))).toBeTruthy();
  });
});

// 9:30 PM in Los Angeles on July 31, which is August 1 from New York east.
it("a game is under the month it's played in at the park", async () => {
  jest.spyOn(mlbApi, 'getSchedule').mockResolvedValue([]);
  jest.spyOn(mlbApi, 'getHomeGamesForStadium').mockReturnValue([
    { ...baseballGame('Giants', 'Dodgers'), gameDate: '2025-08-01T04:30:00Z' },
  ]);
  render(<Picker ids={['dodgers', 'padres']} />);
  await wait(900);
  openList();
  expect(screen.getByRole('option').textContent).toContain('Jul 31, 9:30 PM');
  expect(screen.getByText('July')).toBeTruthy();
});

it('keeping the chosen game is not choosing it again', async () => {
  const chosen = baseballGame('Rays', 'Yankees');
  const another = { ...chosen, gamePk: 'another', gameDate: '2027-07-21T17:05:00Z' };
  jest.spyOn(mlbApi, 'getSchedule').mockResolvedValue([]);
  jest.spyOn(mlbApi, 'getHomeGamesForStadium').mockReturnValue([chosen, another]);
  const onGameSelect = jest.fn();
  render(
    <I18nProvider>
      <UnifiedGameSelector
        selectedVenue={getUnifiedVenueById('yankees')!}
        selectedGame={chosen}
        onGameSelect={onGameSelect}
        onVenueChange={() => {}}
      />
    </I18nProvider>,
  );
  await wait(900);
  openList();
  fireEvent.keyDown(document.querySelector('#game-select')!, { key: 'Tab' });
  expect(onGameSelect).not.toHaveBeenCalled();
  openList();
  fireEvent.click(screen.getByRole('option', { name: /Jul 21/ }));
  expect(onGameSelect.mock.calls).toEqual([[another, new Date(another.gameDate)]]);
});

// The placeholders MLB gives: 3:33 AM at the park, and in the minors five minutes
// after the first game of a doubleheader.
it.each([
  ['MLB', 'yankees', '2025-07-20T07:33:00Z'],
  ['MiLB', 'buffalo-bisons', '2025-07-20T17:10:00Z'],
] as const)("%s: a game with no start time yet is listed without one, and can't be chosen", async (league, id, gameDate) => {
  LEAGUES[league].request(() => Promise.resolve());
  const games = [{ ...baseballGame('Rays', 'Hosts'), gameDate, status: { startTimeTBD: true } }, baseballGame('Mets', 'Hosts')];
  jest.spyOn(mlbApi, 'getHomeGamesForStadium').mockReturnValue(games);
  jest.spyOn(milbApi, 'getHomeGamesForVenue').mockReturnValue(games);
  const onGameSelect = jest.fn();
  render(
    <I18nProvider>
      <UnifiedGameSelector
        selectedVenue={getUnifiedVenueById(id)!}
        selectedGame={null}
        onGameSelect={onGameSelect}
        onVenueChange={() => {}}
      />
    </I18nProvider>,
  );
  await wait(900);
  openList();
  expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
    'Jul 20, time TBD - Rays @ Hosts',
    'Jul 20, 1:05 PM EDT - Mets @ Hosts',
  ]);
  fireEvent.click(screen.getByRole('option', { name: /Rays/ }));
  fireEvent.keyDown(document.querySelector('#game-select')!, { key: 'Tab' });
  expect(onGameSelect).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('option', { name: /Mets/ }));
  expect(onGameSelect.mock.calls).toEqual([[games[1], new Date(games[1].gameDate)]]);
});

describe.each([
  ['MLB', 'yankees'],
  ['MiLB', 'buffalo-bisons'],
] as const)('%s: the box', (league, id) => {
  const TIMED = baseballGame('Mets', 'Hosts');
  const TBD = { ...baseballGame('Rays', 'Hosts'), status: { startTimeTBD: true } };
  const HINT = 'Try selecting "Custom Time" to analyze any date and time.';
  const NONE_FOR_STADIUM = 'No upcoming home games found for this stadium.';

  const list = async (games: unknown[], language?: 'en' | 'es' | 'ja') => {
    LEAGUES[league].request(() => Promise.resolve());
    jest.spyOn(mlbApi, 'getHomeGamesForStadium').mockReturnValue(games as any);
    jest.spyOn(milbApi, 'getHomeGamesForVenue').mockReturnValue(games as any);
    render(<Picker ids={[id, id]} language={language} />);
    await wait(900);
  };

  it.each([
    ['en', 'No start times set yet'],
    ['es', 'Aún no hay horas de inicio'],
    ['ja', '試合開始時間は未定です'],
  ] as const)('says so when no listed game has a start time (%s)', async (language, text) => {
    await list([TBD, { ...TBD, gamePk: 'another' }], language);
    expect(document.querySelector('.game-select')!.textContent).toContain(text);
  });

  it('then offers Custom Time, and still lists the games', async () => {
    await list([TBD, { ...TBD, gamePk: 'another' }]);
    expect(screen.queryByText('Choose a game...')).toBeNull();
    expect(screen.queryByText(NONE_FOR_STADIUM)).toBeNull();
    expect(screen.getByText(/Found 2 upcoming home games/)).toBeTruthy();
    openList();
    expect(screen.getAllByRole('option', { name: /time TBD/ })).toHaveLength(2);
    fireEvent.click(screen.getByText(HINT).parentElement!.querySelector('button')!);
    expect(screen.getByRole('tabpanel').id).toBe('custom-panel');
  });

  it('asks for a game when one has a start time', async () => {
    await list([TBD, TIMED]);
    expect(screen.getByText('Choose a game...')).toBeTruthy();
    expect(screen.queryByText(HINT)).toBeNull();
  });

  it('says none are listed when none are', async () => {
    await list([]);
    expect(screen.getByText('No upcoming games found')).toBeTruthy();
    expect(screen.getByText(NONE_FOR_STADIUM)).toBeTruthy();
    expect(screen.getByText(HINT)).toBeTruthy();
  });
});

it('the open stadium list keeps its place when the finder redraws', async () => {
  const onVenueChange = jest.fn();
  const picker = () => (
    <I18nProvider>
      <UnifiedGameSelector
        selectedVenue={getUnifiedVenueById('yankees')!}
        selectedGame={null}
        onGameSelect={() => {}}
        onVenueChange={onVenueChange}
      />
    </I18nProvider>
  );
  jest.spyOn(mlbApi, 'getSchedule').mockResolvedValue([]);
  const { rerender } = render(picker());
  await wait(900);
  const list = document.querySelector('#venue-select')!;
  fireEvent.keyDown(list, { key: 'ArrowDown' });
  rerender(picker());
  fireEvent.keyDown(list, { key: 'Tab' });
  expect(onVenueChange.mock.calls.map(([venue]) => venue.id)).toEqual(['yankees']);
});
