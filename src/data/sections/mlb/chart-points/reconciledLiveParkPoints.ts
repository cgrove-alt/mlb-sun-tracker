import type { ChartSectionPoint } from '../parkSectionBuilder';
import { redSoxChartPoints } from './redsox';

/**
 * The Fenway viewer exposes 483 ticket products, while its top SVG layer has
 * 416 selectable shapes. Fifteen of those shapes are navigation/interior
 * overlays rather than ticket products. The remaining 82 ticket products are
 * named subdivisions of an exactly corresponding Field Box footprint.
 *
 * Preserve every published product ID. For subdivisions without a separate
 * top-layer polygon, reuse the matching Field Box screen footprint and label
 * the coordinate as an alias. This reconciles identity without pretending the
 * public viewer supplied a surveyed boundary.
 */
const FENWAY_NON_PRODUCT_MAP_IDS = new Set([
  'D1',
  'D2',
  'D3',
  'D4',
  'FBC2',
  'FBC3',
  'FBC4',
  'H',
  'Boardroom(INT)E',
  'PressRoom(INT)E',
  'PavilionClub(INT)E',
  'RoyalBar(INT)E',
  'RoyalClub(INT)E',
  'DellClub(INT)E',
  'DugoutClub(INT)E',
]);

const pointById = new Map(redSoxChartPoints.map((point) => [point.id, point]));

function numericRun(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

function aliasFieldBox(
  id: string,
  fieldBoxNumber: number,
  name: string,
): ChartSectionPoint {
  const source = pointById.get(`F${fieldBoxNumber}`);
  if (!source) throw new Error(`Fenway source footprint F${fieldBoxNumber} is missing`);
  return { ...source, id, name };
}

const dugoutBoxNumbers = [
  ...numericRun(13, 20),
  ...numericRun(29, 38),
  ...numericRun(51, 61),
  ...numericRun(72, 79),
];

const fieldBoxClubNumbers = [
  ...numericRun(29, 38),
  ...numericRun(51, 61),
  ...numericRun(69, 80),
];

const fenwaySubdivisionAliases: readonly ChartSectionPoint[] = [
  ...dugoutBoxNumbers.map((number) => aliasFieldBox(`D${number}`, number, `Dugout Box ${number}`)),
  ...numericRun(39, 50).map((number) => aliasFieldBox(`H${number}`, number, `Dugout Box ${number}`)),
  ...fieldBoxClubNumbers.map((number) => aliasFieldBox(`FBC${number}`, number, `Field Box Club ${number}`)),
];

export const redSoxPublishedChartPoints: readonly ChartSectionPoint[] = [
  ...redSoxChartPoints.filter((point) => !FENWAY_NON_PRODUCT_MAP_IDS.has(point.id)),
  ...fenwaySubdivisionAliases,
];

if (redSoxPublishedChartPoints.length !== 483) {
  throw new Error(`Expected 483 Fenway ticket products, found ${redSoxPublishedChartPoints.length}`);
}

