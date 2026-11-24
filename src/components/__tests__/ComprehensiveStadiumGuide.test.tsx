/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import ComprehensiveStadiumGuide from '../ComprehensiveStadiumGuide';
import { getStadiumGuide } from '../../data/guides';
import { ALL_UNIFIED_VENUES } from '../../data/unifiedVenues';

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

describe('a block with nothing in it', () => {
  it('shows no heading', () => {
    const guide = getStadiumGuide('lambeau-field')!;
    const bare = {
      ...guide,
      seatingGuide: { ...guide.seatingGuide, premiumSeating: { clubs: [], suites: { levels: [], amenities: [] } }, tips: [], budgetOptions: [] },
      concessions: { signature: [], local: [] },
      parking: { ...guide.parking, lots: [] },
      gameDay: { ...guide.gameDay, typicalSchedule: { ...guide.gameDay.typicalSchedule, gatesOpen: '' } },
      proTips: { insiderTips: guide.proTips.insiderTips, avoidThese: [], hiddenGems: [], photoSpots: [], bestValue: [] },
    };
    const { container } = render(<ComprehensiveStadiumGuide stadiumId="lambeau-field" guide={bare} />);
    const headings = Array.from(container.querySelectorAll('h2, h3'), (heading) => heading.textContent);
    for (const gone of ['Seating Guide', 'Premium Seating Options', 'Seating Tips', 'Budget-Friendly Options', 'Food & Drink',
      'Signature Items', 'Local Favorites', 'Beer & Beverages', 'Parking Options', 'Best Value', 'Hidden Gems', 'Things to Avoid']) {
      expect(headings).not.toContain(gone);
    }
    expect(headings).toEqual(expect.arrayContaining(['Overview', 'Getting There', 'Insider Tips', 'Pro Tips']));
    expect(container.textContent).not.toContain('Gates Open');
  });

  it('is on no page', () => {
    for (const { id, league } of ALL_UNIFIED_VENUES) {
      const guide = league !== 'MLB' && getStadiumGuide(id);
      if (!guide) continue;
      const { container, unmount } = render(<ComprehensiveStadiumGuide stadiumId={id} guide={guide} />);
      const empty = Array.from(container.querySelectorAll('ul, .tips-grid, .parking-lots, .weather-grid, .timeline-events'))
        .filter((block) => block.children.length === 0).map((block) => block.parentElement!.querySelector('h3')?.textContent);
      expect([id, empty]).toEqual([id, []]);
      unmount();
    }
  });
});
