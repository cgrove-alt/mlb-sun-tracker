/** @jest-environment jsdom */
import { useState } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { UnifiedGameSelector } from '../UnifiedGameSelector';
import { I18nProvider } from '../../i18n/i18nContext';
import { getUnifiedVenueById } from '../../data/unifiedVenues';
import { mlbApi } from '../../services/mlbApi';
import { milbApi } from '../../services/milbApi';
import { nflApi } from '../../services/nflApi';
import { getVenueIdFromStringId } from '../../data/milbTeamMapping';

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
  gamePk: home, gameDate: '2027-07-20T17:05:00Z', teams: { away: { team: { name: away } }, home: { team: { name: home } } },
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

const Picker = ({ ids }: { ids: string[] }) => {
  const [venue, setVenue] = useState(getUnifiedVenueById(ids[0])!);
  return (
    <I18nProvider>
      <button onClick={() => setVenue(getUnifiedVenueById(ids[1])!)}>the other stadium</button>
      <UnifiedGameSelector selectedVenue={venue} onGameSelect={() => {}} onVenueChange={() => {}} />
    </I18nProvider>
  );
};
const gameBox = () => document.querySelector('.game-select');
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

  it('the game picked at the old stadium leaves the box', async () => {
    request(() => Promise.resolve());
    render(<Picker ids={ids} />);
    await wait(900);
    openList();
    fireEvent.click(screen.getByText(new RegExp(games[0])));
    expect(gameBox()!.textContent).toContain(games[0]);
    fireEvent.click(screen.getByText('the other stadium'));
    await wait(900);
    expect(gameBox()!.textContent).not.toContain(games[0]);
    expect(gameBox()!.textContent).toContain('Choose a game');
  });
});
