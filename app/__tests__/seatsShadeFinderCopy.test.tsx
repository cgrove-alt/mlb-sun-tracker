/** @jest-environment jsdom */
import { render } from '@testing-library/react';
import SeatsShadeFinderPage from '../seats-shade-finder/page';

jest.mock('../seats-shade-finder/FullFinder', () => ({ __esModule: true, default: () => null }));

const text = () => render(<SeatsShadeFinderPage />).container.textContent!.replace(/\s+/g, ' ');

describe('the finder page', () => {
  it('says MiLB and NFL get a side of the park or field, not sections', () => {
    expect(text()).toContain("We don't have seating maps for NFL stadiums or minor league parks, so there it says which sideline, or side of the park, shades first.");
    expect(text()).toContain('For NFL and minor league games, the finder names a side of the field or park instead.');
  });

  it('says what each schedule covers, and what to do about a game that is not on it or has no time yet', () => {
    expect(text()).toContain("For NFL and minor league games, use the finder: pick yours from the schedule, or set its date and time if it isn't listed or its time is TBD.");
    expect(text()).toContain('Pick your game: choose it from the schedule of home games. The minor league schedules cover the next 30 days, and the NFL ones the next eight regular-season games. If yours isn\'t listed or its time is TBD, enter its date and start time.');
    expect(text()).not.toContain('for MLB parks, choose from the real schedule');
  });

  it('claims a confidence label only where there is one', () => {
    expect(text()).toContain('each MLB answer is labelled High, Medium or Low confidence.');
    expect(text()).not.toContain('each answer is labelled');
  });
});
