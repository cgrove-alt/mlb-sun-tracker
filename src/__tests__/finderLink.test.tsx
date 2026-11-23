/** @jest-environment jsdom */
/**
 * A link to the finder names a park and a time. Both finders open it, and the
 * picker shows the park it opened. The weather and the schedule call the
 * network, so they are stubbed; the rest is real.
 */
import { act, render, screen } from '@testing-library/react';
import UnifiedApp from '../UnifiedApp';
import { preferencesStorage } from '../utils/preferences';

jest.mock('../services/weatherApi', () => ({ weatherApi: { getForecast: async () => null } }));
jest.mock('../services/milbApi', () => ({
  ...jest.requireActual('../services/milbApi'),
  milbApi: { getTeamScheduleByLevel: async () => [], getHomeGamesForVenue: () => [] },
}));
jest.mock('../services/nflApi', () => ({
  ...jest.requireActual('../services/nflApi'),
  nflApi: { getUpcomingVenueGames: async () => [] },
}));

const open = async (query: string, width: number) => {
  window.innerWidth = width;
  window.history.replaceState(null, '', `/seats-shade-finder${query}`);
  render(<UnifiedApp />);
  // Both finders work out their answers after a delay.
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 900)); });
};
const picked = (label: string) => screen.getByLabelText(label).closest('[class*="control"]')?.textContent;
const answer = (name: string) => screen.queryByLabelText(`Where are the shaded seats at ${name}?`)?.textContent;

afterEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/');
});

describe.each([['desktop', 1280], ['mobile', 390]])('a finder link on %s', (_device, width) => {
  it('opens the park and the time', async () => {
    await open('?venue=tacoma-rainiers&datetime=2025-07-20T18:35:00-07:00', width);
    expect(answer('Cheney Stadium')).toContain('For the 6:35 PM game on July 20 at Cheney Stadium');
  });

  it('shows the park in the picker, and leaves the saved league alone', async () => {
    await open('?venue=reading-fightin-phils&datetime=2025-07-20T18:35:00-04:00', width);
    expect(picked('Select league')).toContain('Minor League Baseball');
    expect(picked('Select MiLB level')).toContain('Double-A');
    expect(picked('Select MLB stadium')).toContain('Reading Fightin Phils');
    expect(preferencesStorage.get('selectedLeague', 'MLB')).toBe('MLB');
  });

  it('opens the older ?stadium= links too', async () => {
    await open('?stadium=lambeau-field', width);
    expect(picked('Select league')).toContain('National Football League');
  });

  it('opens the park when the time makes no sense', async () => {
    await open('?venue=tacoma-rainiers&datetime=nonsense', width);
    expect(picked('Select MLB stadium')).toContain('Tacoma Rainiers');
    expect(answer('Cheney Stadium')).toBeUndefined();
  });

  it('opens nothing without a park', async () => {
    await open('?venue=no-such-park', width);
    expect(picked('Select league')).toContain('Major League Baseball');
    expect(screen.queryByText(/For the .* game on/)).toBeNull();
  });
});

it('the mobile sun line says how high the sun is', async () => {
  await open('?venue=memphis-redbirds&datetime=2025-07-20T18:35:00-05:00', 390);
  expect(document.querySelector('.sun-status')?.textContent).toBe('Sun is low in the sky');
  expect(document.querySelector('.sun-position')?.textContent).toBe('17.9° · W');
});
