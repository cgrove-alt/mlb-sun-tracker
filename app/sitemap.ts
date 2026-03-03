import { MetadataRoute } from 'next';
import { ALL_UNIFIED_VENUES } from '../src/data/unifiedVenues';
import { ALL_WORLD_CUP_VENUES } from '../src/data/worldcup2026/venues';
import { MLB_STADIUMS } from '../src/data/stadiums';

const BASE_URL = 'https://theshadium.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: 'faq', priority: 0.5, changeFrequency: 'weekly' as const },
    { path: 'privacy', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: 'terms', priority: 0.3, changeFrequency: 'monthly' as const },
    { path: 'seats-shade-finder', priority: 0.7, changeFrequency: 'weekly' as const },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${BASE_URL}/${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // Guide pages
  const guidePages = [
    'guide',
    'guide/best-shaded-seats-mlb',
    'guide/how-to-find-shaded-seats',
    'guide/avoid-sun-baseball-games',
  ];

  for (const page of guidePages) {
    entries.push({
      url: `${BASE_URL}/${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // League pages
  const leaguePages = [
    'league/mlb',
    'league/nfl',
    'league/milb',
    'league/milb/aaa',
    'league/milb/aa',
    'league/milb/a+',
    'league/milb/a',
  ];

  for (const page of leaguePages) {
    entries.push({
      url: `${BASE_URL}/${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  }

  // World Cup pages
  const wcStaticPages = [
    'worldcup2026',
    'worldcup2026/schedule',
    'worldcup2026/compare',
    'worldcup2026/venues',
  ];

  for (const page of wcStaticPages) {
    entries.push({
      url: `${BASE_URL}/${page}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  // All unified venue pages (/venue/[id])
  for (const venue of ALL_UNIFIED_VENUES) {
    const isMLB = venue.league === 'MLB';
    entries.push({
      url: `${BASE_URL}/venue/${venue.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: isMLB ? 0.9 : venue.league === 'NFL' ? 0.8 : 0.7,
    });

    // Sub-pages for each venue
    const subPages = ['shade-guide', 'best-seats', 'weather'];
    for (const sub of subPages) {
      entries.push({
        url: `${BASE_URL}/venue/${venue.id}/${sub}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: isMLB ? 0.7 : 0.6,
      });
    }
  }

  // MLB stadium pages (/stadium/[id]) — legacy URL structure
  for (const stadium of MLB_STADIUMS) {
    entries.push({
      url: `${BASE_URL}/stadium/${stadium.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // World Cup venue pages (/venue/[id] for WC venues in unified + /worldcup2026/venues/[id])
  for (const venue of ALL_WORLD_CUP_VENUES) {
    // /venue/[wc-id] — already covered if in unified venues, but WC venues also have dedicated pages
    entries.push({
      url: `${BASE_URL}/worldcup2026/venues/${venue.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Sub-pages for WC venues under /venue/
    const subPages = ['shade-guide', 'best-seats', 'weather'];
    for (const sub of subPages) {
      entries.push({
        url: `${BASE_URL}/venue/${venue.id}/${sub}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
