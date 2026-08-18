import type { DetailedSection } from '../../../types/stadium-complete';
import { redSoxPublishedChartPoints } from './chart-points/reconciledLiveParkPoints';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyRedSoxSection } from './sourcedChartClassifiers';

/**
 * All 483 ticket products currently published by the Red Sox-linked Fenway
 * 3-D viewer. Product identities and direct/aliased screen footprints are
 * source-backed; row, elevation, obstruction, and coverage geometry remains
 * modeled and cannot pass the public shade release gate.
 */
export const redsoxSections: DetailedSection[] = buildParkSections(52, chartSeeds(
  redSoxPublishedChartPoints,
  {
    orientation: 52,
    behindHomeIds: ['F39', 'F50'],
    centerFieldIds: ['L36', 'L37'],
    classify: classifyRedSoxSection,
  },
));

export const redsoxSectionMap = new Map(redsoxSections.map((section) => [section.id, section]));
