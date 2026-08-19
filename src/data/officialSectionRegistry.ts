import { NFL_OFFICIAL_INVENTORIES } from './sections/nfl/officialInventories';
import { MILB_OFFICIAL_INVENTORIES } from './sections/milb/officialInventories';
import { buildOfficialSections } from './sections/buildOfficialSections';
import type { OfficialInventory } from './sections/officialTypes';
import type { DetailedSection } from '../types/stadium-complete';

const cache = new Map<string, DetailedSection[]>();

export function getOfficialInventory(stadiumId: string): OfficialInventory | undefined {
  return NFL_OFFICIAL_INVENTORIES[stadiumId] ?? MILB_OFFICIAL_INVENTORIES[stadiumId];
}

export function hasOfficialInventory(stadiumId: string): boolean {
  return Boolean(getOfficialInventory(stadiumId));
}

export function getOfficialDetailedSections(stadiumId: string): DetailedSection[] | null {
  const cached = cache.get(stadiumId);
  if (cached) return cached;
  const inventory = getOfficialInventory(stadiumId);
  if (!inventory) return null;
  const sections = buildOfficialSections(inventory);
  cache.set(stadiumId, sections);
  return sections;
}

export const OFFICIAL_NFL_SECTION_IDS: readonly string[] = Object.keys(NFL_OFFICIAL_INVENTORIES);
export const OFFICIAL_MILB_SECTION_IDS: readonly string[] = Object.keys(MILB_OFFICIAL_INVENTORIES);
