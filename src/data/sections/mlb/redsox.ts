import type { DetailedSection } from '../../../types/stadium-complete';
import { redSoxPublishedChartPoints } from './chart-points/reconciledLiveParkPoints';
import { buildParkSections, chartSeeds } from './parkSectionBuilder';
import { classifyRedSoxSection } from './sourcedChartClassifiers';
import { getStadiumOrientation } from '../../stadiums';
import { fenwayTier } from '../../stadiumStructures';

const ORIENTATION = getStadiumOrientation('redsox');

/**
 * All 483 ticket products currently published by the Red Sox-linked Fenway
 * 3-D viewer. Product identities and direct/aliased screen footprints are
 * source-backed; row, elevation, obstruction, and coverage geometry remains
 * modeled and cannot pass the public shade release gate.
 */
export const redsoxSections: DetailedSection[] = buildParkSections(ORIENTATION, chartSeeds(
  redSoxPublishedChartPoints,
  {
    orientation: ORIENTATION,
    behindHomeIds: ['F39', 'F50'],
    centerFieldIds: ['L36', 'L37'],
    // The straight runs of Field Boxes along each foul line. On this chart
    // home plate is at the top, first base runs to the left and third base
    // runs down the right-hand side.
    foulLineRows: {
      firstBase: ['F12', 'F14', 'F16', 'F18', 'F20', 'F22', 'F24', 'F26', 'F28', 'F30', 'F32', 'F34'],
      thirdBase: ['F52', 'F54', 'F56', 'F58', 'F60', 'F62', 'F64', 'F66'],
    },
    // Upper (U) and top (T) bleacher sections sit behind the main ones: a
    // separate ring for fitting stand directions.
    tierOf: (id) => `${fenwayTier(id) ?? 'other'}${/^L\d+[UT]$/.test(id) ? ':back' : ''}`,
    classify: classifyRedSoxSection,
  },
));

export const redsoxSectionMap = new Map(redsoxSections.map((section) => [section.id, section]));
