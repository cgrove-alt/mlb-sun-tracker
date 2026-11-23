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

describe('the NFL shade answer for one game (the finder)', () => {
  const lambeau = getUnifiedVenueById('lambeau-field')!;
  const side = {
    shadedSideline: 'west',
    sunnySideline: 'east',
    sunFacingEndZone: 'north',
    shadedEndZone: null,
    sidelineContrast: 0.8,
    clear: true,
  };
  type Game = Parameters<typeof ShadeAnswer>[0]['nflGame'];
  const gameAnswer = (game: Game, venueId = 'lambeau-field') => {
    const venue = getUnifiedVenueById(venueId)!;
    render(<ShadeAnswer venue={venue} nflGame={game} />);
    return screen.getByLabelText(`Where are the shaded seats at ${venue.name}?`).textContent;
  };

  it('names the sideline with the sun at its back, for that game', () => {
    const text = gameAnswer({ time: '12:00 PM', date: 'December 6', side });
    expect(text).toContain(
      'For the 12:00 PM game on December 6 at Lambeau Field, the sun is on the west side of the field, so seats on the west sideline have it at their backs and get shade first',
    );
    expect(text).toContain('The east sideline and the north end zone face the sun.');
    expect(text).not.toContain('1:00 PM kickoff');
    expect(text).not.toContain('September 14');
    expect(text).not.toContain('sets');
    expect(text).toContain('How we work this out');
  });

  it('says neither sideline has an edge when the sun runs along the field', () => {
    const text = gameAnswer({ time: '12:00 PM', date: 'December 6', side: { ...side, clear: false } });
    expect(text).toContain('For the 12:00 PM game on December 6 at Lambeau Field, the sun moves along the length of the field');
    expect(text).toContain('so neither sideline has a clear edge');
    expect(text).not.toContain('get shade first');
  });

  it('names the end zone with the sun at its back, when there is one', () => {
    const game = { time: '12:00 PM', date: 'December 6' };
    expect(gameAnswer({ ...game, side: { ...side, shadedEndZone: 'south' } }))
      .toContain('seats under an overhang. The south end zone has it at its back too. The east sideline and the north end zone face the sun.');
  });

  it('names no end zone otherwise', () => {
    expect(gameAnswer({ time: '12:00 PM', date: 'December 6', side })).not.toContain('at its back');
  });

  it('gives the end zone, not "neither", when the sun runs along the field', () => {
    const text = gameAnswer({ time: '12:00 PM', date: 'December 6', side: { ...side, clear: false, shadedEndZone: 'south' } });
    expect(text).toContain(
      'so neither sideline has a clear edge. Seats in the south end zone have it at their backs and get shade first, and the north end zone faces the sun. Seats under an overhang are the surest shade.',
    );
  });

  it('gives the sunset when it falls during the game', () => {
    expect(gameAnswer({ time: '3:25 PM', date: 'November 16', side, sunset: '4:28 PM' }))
      .toContain('The sun sets at 4:28 PM.');
  });

  it('says the sun is down when it is down for the whole game', () => {
    const text = gameAnswer({ time: '7:20 PM', date: 'November 16', side: null });
    expect(text).toContain('For the 7:20 PM game on November 16 at Lambeau Field, the sun is down for the whole game, so every seat is out of the sun.');
    expect(text).not.toContain('shade first');
  });

  it('opens with the closed roof where there is a retractable one', () => {
    expect(gameAnswer({ time: '1:00 PM', date: 'September 14', side }, 'nrg-stadium'))
      .toContain('With the roof closed, every seat is shaded. With it open: For the 1:00 PM game on September 14');
  });

  it('a fixed roof shades every seat, whatever the game', () => {
    expect(gameAnswer({ time: '1:00 PM', date: 'September 14', side }, 'allegiant-stadium'))
      .toContain('has a fixed roof, so every seat is out of the sun for the whole game');
  });

  it('without a game, says what it says now for a field we could not measure', () => {
    expect(gameAnswer(undefined, 'at-t-stadium')).toContain("can't yet say which sideline shades first");
  });

  it('without a game, still gives the stadium page its own answer', () => {
    render(<ShadeAnswer venue={lambeau} nflSunSides={{ early: side, late: side, nightAfterSunset: true }} />);
    const text = screen.getByLabelText('Where are the shaded seats at Lambeau Field?').textContent;
    expect(text).toContain('For a 1:00 PM kickoff at Lambeau Field, the sun is on the west side of the field');
    expect(text).toContain('Based on the sun');
    expect(text).toContain('September 14, 2025');
  });

  const pageAnswer = (early: object, late: object) => {
    render(<ShadeAnswer venue={lambeau} nflSunSides={{ early: { ...side, ...early }, late: { ...side, ...late }, nightAfterSunset: true }} />);
    return screen.getByLabelText('Where are the shaded seats at Lambeau Field?').textContent;
  };

  it('names the end zone on the stadium page, for each kickoff it has the sun behind', () => {
    const text = pageAnswer({ shadedEndZone: 'south' }, {});
    expect(text).toContain('The south end zone has it at its back too. The east sideline and the north end zone face the sun.');
    expect(text).toContain("For a 4:25 PM kickoff it's the same west sideline, with more of it in shade as the sun drops. Night games");
  });

  it.each([
    ['the same sideline', {}, { shadedEndZone: 'south' },
      'with more of it in shade as the sun drops. The south end zone has it at its back too. Night games'],
    ['a sideline the early kickoff has none of', { clear: false, shadedEndZone: 'south' }, { shadedEndZone: 'south' },
      'For a 4:25 PM kickoff the west sideline shades first. The south end zone has it at its back too. Night games'],
    ['no clear sideline', {}, { clear: false, shadedEndZone: 'south' },
      'For a 4:25 PM kickoff the sun runs along the field, and the south end zone has it at its back. Night games'],
  ])('names it for the late kickoff, with %s', (_case, early, late, words) => {
    expect(pageAnswer(early, late)).toContain(words);
  });
});
