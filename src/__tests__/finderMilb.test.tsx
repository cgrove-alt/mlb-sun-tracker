/** @jest-environment jsdom */
/**
 * The finder has no seating map for a MiLB park or an NFL stadium, so it names
 * a side of the park or field for the game. MLB keeps its link. The game
 * selector and the weather call the network, so they are stubbed; the rest is
 * real.
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import UnifiedApp from '../UnifiedApp';
import { getUnifiedVenueById } from '../data/unifiedVenues';

// 6:35 PM in Buffalo on July 20, 2025.
const GAME = new Date('2025-07-20T22:35:00Z');
// 7:15 PM in Arlington, Texas, on November 3, 2025.
const NIGHT_GAME = new Date('2025-11-04T01:15:00Z');

jest.mock('../components/UnifiedGameSelector', () => ({
  UnifiedGameSelector: ({ onVenueChange, onGameSelect }: any) => (
    <>
      {['buffalo-bisons', 'lambeau-field', 'at-t-stadium', 'lucas-oil-stadium', 'ford-field', 'sofi-stadium-chargers', 'yankees'].map((id) => (
        <button key={id} onClick={() => onVenueChange(getUnifiedVenueById(id))}>{id}</button>
      ))}
      <button onClick={() => onGameSelect(null, GAME)}>pick game</button>
      <button onClick={() => onGameSelect(null, NIGHT_GAME)}>pick night game</button>
    </>
  ),
}));
jest.mock('../services/weatherApi', () => ({ weatherApi: { getForecast: async () => null } }));

const pickGame = async (venueId: string, width: number, button = 'pick game') => {
  window.innerWidth = width;
  render(<UnifiedApp />);
  fireEvent.click(screen.getByText(venueId));
  fireEvent.click(screen.getByText(button));
  // Both finders work out their sections after a delay.
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 900)); });
};
const answer = (name: string) => screen.queryByLabelText(`Where are the shaded seats at ${name}?`);

describe.each([['desktop', 1280], ['mobile', 390]])('the finder on %s', (device, width) => {
  const sectionList = () => device === 'desktop'
    ? screen.queryByRole('region', { name: 'Stadium sections list' })
    : screen.queryByText(/Sections Found$/);

  it('MiLB: names the side for that game and lists no sections', async () => {
    await pickGame('buffalo-bisons', width);
    expect(answer('Sahlen Field')?.textContent).toContain(
      'For the 6:35 PM game on July 20 at Sahlen Field, the first base side and the seating behind home plate tend to shade first',
    );
    expect(sectionList()).toBeNull();
    expect(screen.queryByText('No sections match your filters')).toBeNull();
    expect(screen.queryByText('What does sun exposure mean for fans?')).toBeNull();
  });

  it('MiLB, before a game is picked: promises no sections', () => {
    window.innerWidth = width;
    render(<UnifiedApp />);
    fireEvent.click(screen.getByText('buffalo-bisons'));
    expect(screen.getByText('Choose a game time to see where the sun and shade will be.')).toBeTruthy();
    expect(screen.queryByText(/which sections/)).toBeNull();
  });

  const noSections = () => {
    expect(sectionList()).toBeNull();
    expect(screen.queryByText(/Sections Found/)).toBeNull();
    expect(screen.queryByText('No sections match your filters')).toBeNull();
    expect(screen.queryByText('What does sun exposure mean for fans?')).toBeNull();
  };

  it('NFL, before a game is picked: promises no sections', () => {
    window.innerWidth = width;
    render(<UnifiedApp />);
    fireEvent.click(screen.getByText('lambeau-field'));
    expect(screen.queryByText(/which sections/)).toBeNull();
  });

  it('NFL: names the sideline for that game and lists no sections', async () => {
    await pickGame('lambeau-field', width);
    const text = answer('Lambeau Field')?.textContent;
    expect(text).toContain('For the 5:35 PM game on July 20 at Lambeau Field, the sun is on the west side of the field');
    expect(text).toContain('seats on the west sideline have it at their backs and get shade first');
    noSections();
  });

  it('NFL: says so when the direction was never measured', async () => {
    await pickGame('at-t-stadium', width);
    expect(answer('AT&T Stadium')?.textContent).toContain("can't yet say which sideline shades first");
    noSections();
  });

  it.each([
    ['at-t-stadium', '7:15 PM'],
    ['lucas-oil-stadium', '8:15 PM'],
  ])('NFL: says the sun is down, even where the direction was never measured (%s)', async (id, time) => {
    await pickGame(id, width, 'pick night game');
    const { name } = getUnifiedVenueById(id)!;
    expect(answer(name)?.textContent).toContain(
      `For the ${time} game on November 3 at ${name}, the sun is down for the whole game, so every seat is out of the sun.`,
    );
    expect(answer(name)?.textContent).not.toContain("can't yet say");
  });

  it.each(['ford-field', 'sofi-stadium-chargers'])('NFL: says every seat is shaded under a fixed roof (%s)', async (id) => {
    await pickGame(id, width);
    expect(answer(getUnifiedVenueById(id)!.name)?.textContent).toContain('has a fixed roof, so every seat is out of the sun');
    noSections();
  });

  it.each(['buffalo-bisons', 'lambeau-field', 'yankees'])('before a game is picked, says where to find it or what to do without (%s)', (id) => {
    window.innerWidth = width;
    render(<UnifiedApp />);
    fireEvent.click(screen.getByText(id));
    expect(screen.getByText("Pick a game from the schedule, or set a date and time if yours isn't listed")).toBeTruthy();
  });

  it('MLB: still links to the park page', async () => {
    await pickGame('yankees', width);
    expect(screen.getByText(/See the Yankee Stadium shade map/)).toBeTruthy();
    expect(sectionList()).toBeNull();
    expect(answer('Yankee Stadium')).toBeNull();
  });
});
