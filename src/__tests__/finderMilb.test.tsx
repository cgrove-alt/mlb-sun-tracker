/** @jest-environment jsdom */
/**
 * The finder has no seating map for a MiLB park, so it names a side of the
 * park for the game. NFL and MLB keep what they had. The game selector and the
 * weather call the network, so they are stubbed; the rest is real.
 */
import { act, fireEvent, render, screen } from '@testing-library/react';
import UnifiedApp from '../UnifiedApp';
import { getUnifiedVenueById } from '../data/unifiedVenues';

// 6:35 PM in Buffalo on July 20, 2025.
const GAME = new Date('2025-07-20T22:35:00Z');

jest.mock('../components/UnifiedGameSelector', () => ({
  UnifiedGameSelector: ({ onVenueChange, onGameSelect }: any) => (
    <>
      {['buffalo-bisons', 'lambeau-field', 'yankees'].map((id) => (
        <button key={id} onClick={() => onVenueChange(getUnifiedVenueById(id))}>{id}</button>
      ))}
      <button onClick={() => onGameSelect(null, GAME)}>pick game</button>
    </>
  ),
}));
jest.mock('../services/weatherApi', () => ({ weatherApi: { getForecast: async () => null } }));

const pickGame = async (venueId: string, width: number) => {
  window.innerWidth = width;
  render(<UnifiedApp />);
  fireEvent.click(screen.getByText(venueId));
  fireEvent.click(screen.getByText('pick game'));
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

  it('NFL: still lists its sections', async () => {
    await pickGame('lambeau-field', width);
    expect(sectionList()).not.toBeNull();
    expect(answer('Lambeau Field')).toBeNull();
    if (device === 'mobile') expect(sectionList()!.textContent).toBe('12 Sections Found');
  });

  it('MLB: still links to the park page', async () => {
    await pickGame('yankees', width);
    expect(screen.getByText(/See the Yankee Stadium shade map/)).toBeTruthy();
    expect(sectionList()).toBeNull();
    expect(answer('Yankee Stadium')).toBeNull();
  });
});
