/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import ComprehensiveStadiumGuide from '../ComprehensiveStadiumGuide';
import { getStadiumGuide } from '../../data/guides';

describe('hand-written shade lists', () => {
  // Nobody checked them against the park: they named the wrong side at many
  // MiLB and NFL venues. The answer at the top of the page comes from the sun.
  it.each(['albuquerque-isotopes', 'lambeau-field'])('are not shown at %s', (id) => {
    const guide = getStadiumGuide(id)!;
    const { container } = render(<ComprehensiveStadiumGuide stadiumId={id} guide={guide} />);
    expect(screen.queryByText('Best Shaded Sections by Time')).toBeNull();
    expect(screen.queryByText('Shade Tips')).toBeNull();
    expect(container.querySelector('.weather-patterns')).not.toBeNull();
    expect(container.querySelector('.weather-patterns .shade-tip')).toBeNull();
  });
});
