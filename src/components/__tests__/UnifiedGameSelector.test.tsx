/** @jest-environment jsdom */
import { act, fireEvent, render, screen } from '@testing-library/react';
import { UnifiedGameSelector } from '../UnifiedGameSelector';
import { I18nProvider } from '../../i18n/i18nContext';
import { getUnifiedVenueById } from '../../data/unifiedVenues';
import { nflApi } from '../../services/nflApi';

const show = async (className: string) => {
  jest.spyOn(nflApi, 'getUpcomingVenueGames').mockResolvedValue([]);
  localStorage.clear();
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
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 900)); });
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
