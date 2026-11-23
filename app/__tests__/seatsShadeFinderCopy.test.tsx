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

  it('claims a confidence label only where there is one', () => {
    expect(text()).toContain('each MLB answer is labelled High, Medium or Low confidence.');
    expect(text()).not.toContain('each answer is labelled');
  });
});
