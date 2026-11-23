import { getStadiumGuide } from '..';
import { ALL_UNIFIED_VENUES } from '../../unifiedVenues';

const SIDE = /(first|third)[ -]base|(left|right|center) field|outfield|bleacher|behind home|box seats \d|sections? \d/i;
const SUN = /shade|shadow|\bsun\b|sunny|day games?\b/i;
/** A roof is shade whichever way the park faces. */
const ROOF = /covered/i;

const guides = ALL_UNIFIED_VENUES
  .filter((venue) => venue.league === 'MiLB')
  .flatMap((venue) => {
    const guide = getStadiumGuide(venue.id);
    return guide ? [[venue.id, guide] as const] : [];
  });

describe('MiLB guide text', () => {
  it('covers the parks that have a guide', () => expect(guides).toHaveLength(118));

  // Which side shades depends on the way the park faces and the sun's path;
  // the answer at the top of the page works it out. These guides didn't.
  it.each(guides)('%s: no shown text ties a side of the park to sun or shade', (_id, guide) => {
    const shown = [
      guide.overview.description,
      ...guide.overview.highlights,
      ...guide.overview.uniqueFeatures,
      ...guide.seatingGuide.premiumSeating.clubs.flatMap((club) => [club.name, club.access, ...club.perks]),
      // The category shows as a badge, so a "shade" tip ties its section to shade.
      ...guide.seatingGuide.tips.map((tip) => `${tip.section}: ${tip.tip} (${tip.category})`),
      ...guide.seatingGuide.budgetOptions,
      ...guide.gameDay.tips.map((tip) => `${tip.title}: ${tip.description} (${tip.category})`),
      ...guide.proTips.insiderTips,
      ...guide.proTips.bestValue,
      ...guide.proTips.hiddenGems,
      ...guide.proTips.avoidThese,
    ];
    expect(shown.filter((text) => SIDE.test(text) && SUN.test(text) && !ROOF.test(text))).toEqual([]);
  });
});
