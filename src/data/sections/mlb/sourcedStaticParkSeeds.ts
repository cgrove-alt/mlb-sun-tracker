import type { ParkSectionSeed, SectionCoverage } from './parkSectionBuilder';
import { band, range } from './parkSectionBuilder';

type Level = ParkSectionSeed['level'];

interface ArcOptions {
  coverage?: SectionCoverage;
  namePrefix?: string;
  startOffset?: number;
  endOffset?: number;
  rowCount?: number;
  distance?: number;
  height?: number;
}

/**
 * Turn a published, ordered run from a static club seat map into its bowl arc.
 * MLB clubs conventionally number these runs from the right-field end, around
 * home plate, to the left-field end. Offsets are bearings from the park's
 * verified home-to-centre-field orientation.
 */
function arc(
  orientation: number,
  ids: readonly string[],
  level: Level,
  options: ArcOptions = {},
): ParkSectionSeed[] {
  return band({
    ids,
    level,
    compassStart: orientation + (options.startOffset ?? 62),
    compassEnd: orientation + (options.endOffset ?? 298),
    coverage: options.coverage,
    namePrefix: options.namePrefix,
    rowCount: options.rowCount,
    distance: options.distance,
    height: options.height,
  });
}

const letters = (start: string, end: string): string[] => {
  const output: string[] = [];
  for (let code = start.charCodeAt(0); code <= end.charCodeAt(0); code += 1) {
    output.push(String.fromCharCode(code));
  }
  return output;
};

function codedBand(
  codePrefix: string,
  codes: readonly string[],
  namePrefix: string,
  level: Level,
  compassStart: number,
  compassEnd: number,
): ParkSectionSeed[] {
  return band({
    ids: codes.map((code) => `${codePrefix}${code}`),
    level,
    compassStart,
    compassEnd,
    price: 'luxury',
  }).map((seed, index) => ({
    ...seed,
    name: `${namePrefix} ${codes[index]}`,
  }));
}

function namedPlace(
  id: string,
  name: string,
  level: Level,
  compass: number,
  span = 8,
): ParkSectionSeed {
  return { id, name, level, compass, span };
}

const athleticsOrientation = 20;
export const athleticsSourcedSeeds: readonly ParkSectionSeed[] = [
  ...arc(athleticsOrientation, range(101, 123), 'lower', { namePrefix: 'Reserved Bowl', startOffset: 74, endOffset: 286 }),
  ...arc(athleticsOrientation, range(201, 206), 'suite', { namePrefix: 'Luxury Suite', startOffset: 74, endOffset: 112 }),
];

const blueJaysOrientation = 0;
export const blueJaysSourcedSeeds: readonly ParkSectionSeed[] = [
  ...arc(blueJaysOrientation, [...range(101, 103), ...range(108, 148)], 'lower', { namePrefix: '100 Level' }),
  ...arc(blueJaysOrientation, [...range(204, 207), ...range(210, 244)], 'club', { namePrefix: '200 Level' }),
  ...arc(blueJaysOrientation, range(300, 356), 'suite', { namePrefix: '300 Level Suite' }),
  ...arc(blueJaysOrientation, [...range(410, 475), ...range(486, 498)], 'suite', { namePrefix: 'Executive Suite' }),
  ...arc(blueJaysOrientation, range(508, 540), 'upper', { namePrefix: '500 Level' }),
];

const giantsOrientation = 87;
export const giantsSourcedSeeds: readonly ParkSectionSeed[] = [
  ...arc(giantsOrientation, range(101, 152), 'lower', { namePrefix: 'Field / Promenade Level' }),
  ...arc(giantsOrientation, [...range(202, 205), ...range(207, 234)], 'club', { namePrefix: 'Club Level' }),
  ...arc(giantsOrientation, range(1, 61), 'suite', { namePrefix: 'Suite Level', startOffset: 105, endOffset: 255 }),
  ...arc(giantsOrientation, range(302, 336, [303, 306, 309, 316, 322, 329]), 'upper', { namePrefix: 'View Level' }),
];

const padresOrientation = 0;
export const padresSourcedSeeds: readonly ParkSectionSeed[] = [
  // Current 2026 seating chart: 136 and 224 are not published; 313 is.
  ...arc(padresOrientation, range(101, 137, [136]), 'lower', { namePrefix: 'Field Level' }),
  ...band({ ids: letters('A', 'L'), level: 'field', compassStart: 154, compassEnd: 206, namePrefix: 'Field VIP' }),
  ...arc(padresOrientation, [...range(201, 231, [224]), '233', '235'], 'club', { namePrefix: 'Terrace Level' }),
  ...arc(padresOrientation, [...range(300, 313), ...range(315, 329)], 'upper', { namePrefix: 'Upper Level' }),

  // The club's dedicated 2026 suite map publishes these permanent codes.
  ...codedBand('PCS', ['8', '6', '4', '2', '1', '3', '5', '7', '9', '11', '13', '15'], 'Premier Club Suite', 'suite', 220, 140),
  ...codedBand('TI', ['14', '12', '10', '8', '6', '4', '2', '1', '3', '5', '7', '9', '11'], 'Terrace Infield Suite', 'suite', 252, 108),
  ...codedBand('TR', ['24', '22', '20', '18', '16', '13', '15', '17', '19', '21', '23', '25'], 'Terrace Reserved Suite', 'suite', 276, 84),
  ...codedBand('TP', ['34', '32', '30', '28', '26', '27', '29', '31', '33', '35'], 'Terrace Pavilion Suite', 'suite', 302, 58),
  ...codedBand('TL', ['6', '4', '2', '1', '3', '5'], 'Tower Loft Suite', 'suite', 236, 124),
  ...codedBand('GLS', ['1', '2', '3'], 'Garden Level Suite', 'suite', 194, 166),
  ...codedBand('WMS-', [...letters('A', 'G').map((letter) => `4${letter}`), ...letters('A', 'E').map((letter) => `3${letter}`)], 'Western Metal Suite', 'suite', 306, 294),
  namedPlace('VIP-PATIO', 'VIP Patio Suite', 'suite', 222),
  namedPlace('ENTERTAINMENT-SUITE', 'Entertainment Suite', 'suite', 292),
  namedPlace('SOUTHWEST-ON-DECK-SUITE', 'Southwest Airlines On-Deck Suite', 'suite', 248),
  namedPlace('FOUL-POLE-SUITE', 'Foul Pole Suite', 'suite', 300),
  namedPlace('TERRACE-LUXURY-BOX', 'Terrace Luxury Box', 'suite', 228),

  // The official 2026 hospitality map and club page publish eleven stable
  // group products. Barkyard is a separate, year-round five-area product.
  namedPlace('WESTERN-METAL-ROOFTOP', 'Western Metal Building Rooftop', 'standing', 286, 14),
  namedPlace('ESTRELLA-JALISCO-LANDING', 'Estrella Jalisco Landing', 'standing', 326, 18),
  namedPlace('TOYOTA-BEACH', 'Toyota Beach', 'standing', 18, 16),
  namedPlace('CITY-CRUISES-HOME-RUN-DECK', 'City Cruises Home Run Deck', 'standing', 34, 14),
  namedPlace('BAJA-CALIFORNIA-PORCH', 'Baja California Porch', 'standing', 282, 12),
  namedPlace('SKYLINE-PATIO', 'Skyline Patio', 'standing', 230, 10),
  namedPlace('SUNSET-PATIO', 'Sunset Patio', 'standing', 130, 10),
  namedPlace('THE-RAIL', 'The Rail', 'standing', 298, 8),
  namedPlace('PICNIC-TERRACE', 'Picnic Terrace', 'standing', 348, 10),
  namedPlace('THE-POINT', 'The Point', 'standing', 316, 10),
  namedPlace('KONA-PATIO', 'Kona Patio', 'standing', 68, 10),
  namedPlace('BARKYARD', 'The Barkyard', 'standing', 344, 12),
];
