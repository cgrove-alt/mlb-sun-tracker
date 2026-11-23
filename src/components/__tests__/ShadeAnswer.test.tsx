/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { ShadeAnswer } from '../ShadeAnswer';
import { getUnifiedVenueById } from '../../data/unifiedVenues';

const sahlen = getUnifiedVenueById('buffalo-bisons')!;
const answer = (milbShadeSides: string[]) => {
  render(<ShadeAnswer venue={sahlen} milbShadeSides={milbShadeSides} />);
  return screen.getByLabelText('Where are the shaded seats at Sahlen Field?').textContent;
};

describe('the MiLB shade answer', () => {
  it('names one side', () => {
    expect(answer(['first base side'])).toContain(
      "For a 1:05 PM game at Sahlen Field, the first base side tends to shade first, going by the way the park faces and the sun's path.",
    );
  });

  it('names two sides', () => {
    expect(answer(['seating behind home plate', 'first base side'])).toContain(
      'the seating behind home plate and the first base side tend to shade first,',
    );
  });

  it('says so when the sun is behind the outfield', () => {
    const text = answer([]);
    expect(text).toContain('the sun is behind the outfield for most of the game');
    expect(text).not.toContain('shade first');
  });
});
