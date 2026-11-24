/** @jest-environment jsdom */
import { render } from '@testing-library/react';
import AttributionsPage from '../attributions/page';
import DisclaimerPage from '../disclaimer/page';
import HowItWorksPage from '../how-it-works/page';
import FooterModern from '../../components/FooterModern';

describe.each([
  ['/attributions', AttributionsPage],
  ['/disclaimer', DisclaimerPage],
  ['/how-it-works', HowItWorksPage],
])('the sources on %s', (_path, Page) => {
  const text = () => render(<Page />).container.textContent!.replace(/\s+/g, ' ');

  it('say the NFL schedule is from ESPN', () => {
    expect(text()).toMatch(/ESPN/);
    expect(text()).toMatch(/NFL[^.]*schedule[^.]*ESPN|ESPN[^.]*NFL[^.]*schedule/);
  });

  it('still say the baseball schedules are from MLB', () => {
    expect(text()).toContain('MLB Advanced Media');
  });
});

it('the footer credits ESPN beside the others', () => {
  expect(render(<FooterModern />).container.textContent).toContain(
    '⚾ MLB data: MLB Advanced Media • 🏈 NFL schedule: ESPN • 🌤️ Weather: Open-Meteo • ☀️ Sun: NREL Solar Position Algorithm',
  );
});
