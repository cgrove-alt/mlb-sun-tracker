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

describe('the MiLB shade answer for one game (the finder)', () => {
  const gameAnswer = (game: Parameters<typeof ShadeAnswer>[0]['milbGame']) => {
    render(<ShadeAnswer venue={sahlen} milbGame={game} />);
    return screen.getByLabelText('Where are the shaded seats at Sahlen Field?').textContent;
  };

  it('is about that game, not the 1:05 PM one', () => {
    const text = gameAnswer({ time: '4:05 PM', date: 'July 20', sides: ['first base side'] });
    expect(text).toContain(
      "For the 4:05 PM game on July 20 at Sahlen Field, the first base side tends to shade first, going by the way the park faces and the sun's path.",
    );
    expect(text).not.toContain('1:05 PM');
    expect(text).not.toContain('sets');
    expect(text).toContain("We don't have a seating map for this park, so we can't say which sections or rows.");
  });

  it('gives the sunset when it falls during the game', () => {
    expect(gameAnswer({ time: '6:35 PM', date: 'July 20', sides: ['first base side', 'seating behind home plate'], sunset: '8:48 PM' }))
      .toContain("tend to shade first, going by the way the park faces and the sun's path. The sun sets at 8:48 PM.");
  });

  it('names no side when the sun is behind the outfield', () => {
    const text = gameAnswer({ time: '6:35 PM', date: 'July 20', sides: [], sunset: '8:48 PM' });
    expect(text).toContain('the sun is behind the outfield for most of the game');
    expect(text).toContain('The sun sets at 8:48 PM.');
  });

  it('says the sun is down when it is down for the whole game', () => {
    const text = gameAnswer({ time: '8:05 PM', date: 'September 14', sides: null });
    expect(text).toContain('For the 8:05 PM game on September 14 at Sahlen Field, the sun is down for the whole game, so every seat is out of the sun.');
    expect(text).not.toContain('shade first');
    expect(text).not.toContain('seating map');
  });
});
