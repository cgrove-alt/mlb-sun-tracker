import { milbApi, type MiLBGame } from '../milbApi';

const game = (gamePk: number, abstractGameState: MiLBGame['status']['abstractGameState'], detailedState: string, venue = 5) =>
  ({ gamePk, gameDate: `2025-07-18T23:0${gamePk}:00Z`, venue: { id: venue }, status: { abstractGameState, codedGameState: '', detailedState } }) as MiLBGame;

describe("a MiLB park's games", () => {
  const listed = (...games: MiLBGame[]) =>
    milbApi.getHomeGamesForVenue(5, { dates: [{ date: '2025-07-18', games }] } as any).map(({ gamePk }) => gamePk);

  it('include the one being played', () => {
    expect(listed(game(2, 'Preview', 'Scheduled'), game(1, 'Live', 'In Progress'))).toEqual([1, 2]);
  });

  it('leave out the ones that are over, postponed or cancelled, and other parks', () => {
    expect(listed(game(1, 'Final', 'Final'), game(2, 'Final', 'Postponed'), game(3, 'Final', 'Cancelled'), game(4, 'Preview', 'Scheduled', 6)))
      .toEqual([]);
  });
});
