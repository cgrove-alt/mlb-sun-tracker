import { ALL_UNIFIED_VENUES, UnifiedVenue } from '../data/unifiedVenues';

// Match a blog post to the venue it's about (audit Phase 6), so each post can
// link to that venue's /stadium/ guide. Matches the post's tags/slug against
// each venue's id and slugified name (e.g. "Yankee Stadium" -> "yankee-stadium"
// matches the tag "yankee-stadium" and the slug "...-yankee-stadium").

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Precompute each venue's search keys once. Keys shorter than 4 chars are
// dropped to avoid spurious substring hits.
const VENUE_KEYS: Array<{ venue: UnifiedVenue; keys: string[] }> = ALL_UNIFIED_VENUES.map((venue) => ({
  venue,
  // id, slugified venue name, and slugified team — the latter catches posts
  // tagged/slugged by team (e.g. "baltimore-orioles" -> Oriole Park at Camden Yards).
  keys: Array.from(
    new Set([venue.id.toLowerCase(), slugify(venue.name), slugify(venue.team)]),
  ).filter((k) => k.length >= 4),
}));

export function findVenueForPost(post: { slug: string; tags?: string[] }): UnifiedVenue | null {
  const tags = (post.tags || []).map((t) => t.toLowerCase());
  const slug = post.slug.toLowerCase();

  let best: { venue: UnifiedVenue; score: number } | null = null;
  for (const { venue, keys } of VENUE_KEYS) {
    for (const key of keys) {
      // Exact tag match, or a whole-segment match inside the slug (so "mets"
      // matches "...-mets-..." but not "helmets").
      const inSlug = new RegExp(`(^|-)${key}(-|$)`).test(slug);
      if (tags.includes(key) || inSlug) {
        // Prefer the most specific (longest) matching key.
        if (!best || key.length > best.score) best = { venue, score: key.length };
      }
    }
  }
  return best ? best.venue : null;
}
