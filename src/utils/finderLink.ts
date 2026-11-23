import { ALL_UNIFIED_VENUES, type UnifiedVenue } from '../data/unifiedVenues';

/** The park and the time a finder link names: `?venue=` (older links: `?stadium=`) and `?datetime=`. */
export function readFinderLink(search: string): { venue?: UnifiedVenue; dateTime?: Date } {
  const params = new URLSearchParams(search);
  const id = params.get('venue') || params.get('stadium');
  const dateTime = new Date(params.get('datetime') ?? '');
  return {
    venue: ALL_UNIFIED_VENUES.find((venue) => venue.id === id),
    dateTime: Number.isNaN(dateTime.getTime()) ? undefined : dateTime,
  };
}
