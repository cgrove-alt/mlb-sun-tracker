import type { ParkSectionSeed, SectionCoverage } from './mlb/parkSectionBuilder';
import type { SectionSourceKind } from '../stadiumSectionProvenance';

export type OfficialLevel = ParkSectionSeed['level'];

export interface OfficialBand {
  ids: readonly string[];
  level: OfficialLevel;
  namePrefix?: string;
  /** When true, wrap the official IDs around the full bowl from `orientation`. */
  wrap?: boolean;
  /** Bearings from the venue axis for a horseshoe / published arc (baseball). */
  startOffset?: number;
  endOffset?: number;
  coverage?: SectionCoverage;
}

export interface OfficialNamedPlace {
  id: string;
  name: string;
  level: OfficialLevel;
  /** Offset from the venue axis (HP→CF or football long axis). */
  compassOffset?: number;
  span?: number;
  coverage?: SectionCoverage;
}

export interface OfficialInventory {
  stadiumId: string;
  league: 'MiLB' | 'NFL';
  orientation: number;
  angleConvention: 'baseball-local' | 'compass-from-north';
  sourceKind: SectionSourceKind;
  officialUrl: string;
  geometryUrl?: string;
  supplementalUrls?: readonly string[];
  inventoryNotes?: string;
  bands: readonly OfficialBand[];
  named?: readonly OfficialNamedPlace[];
}
