/** @jest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react';
import NFLCustomGameSelector from '../NFLCustomGameSelector';
import { getUnifiedVenueById } from '../../data/unifiedVenues';

const picked = jest.fn();
const field = (id: string) => document.querySelector<HTMLInputElement>(`#${id}`)!;
const type = (id: string, value: string) => fireEvent.change(field(id), { target: { value } });
const button = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Calculate Shade' });

beforeEach(() => {
  picked.mockReset();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  render(
    <NFLCustomGameSelector
      selectedVenue={getUnifiedVenueById('lambeau-field')}
      onGameSelect={picked}
      initialDate="2026-12-20"
      initialTime="13:00"
    />,
  );
});
afterEach(() => jest.restoreAllMocks());

describe('the NFL date form', () => {
  it('gives the kickoff in the stadium\'s own time', () => {
    expect(screen.getByText(/Sunday, December 20, 2026 at 13:00/)).toBeTruthy();
    fireEvent.click(button());
    expect(picked).toHaveBeenCalledWith(null, new Date('2026-12-20T19:00:00Z'));
  });

  it.each([
    ['a cleared date', 'game-date', '', '2026-12-20'],
    ['a cleared time', 'game-time', '', '13:00'],
    ['a year of five digits', 'game-date', '20266-12-20', '2026-12-20'],
  ])('waits for the rest after %s', (_case, id, value, complete) => {
    type(id, value);
    expect(field('game-date')).toBeTruthy();
    expect(screen.queryByText('Selected:')).toBeNull();
    expect(button().disabled).toBe(true);
    type(id, complete);
    expect(screen.getByText(/Sunday, December 20, 2026 at 13:00/)).toBeTruthy();
    fireEvent.click(button());
    expect(picked).toHaveBeenCalledWith(null, new Date('2026-12-20T19:00:00Z'));
  });
});
