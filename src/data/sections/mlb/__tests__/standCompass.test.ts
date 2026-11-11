import { yankeesSections } from '../yankees';
import { dodgersSections, DODGERS_AERIAL_CONTROL } from '../dodgers';
import { dodgersChartPoints } from '../chart-points/dodgers';
import { cubsSections, CUBS_AERIAL_CONTROL } from '../cubs';
import { cubsChartPoints } from '../chart-points/cubs';
import { giantsSections } from '../giants';
import { metsSections, METS_AERIAL_CONTROL } from '../mets';
import { metsChartPoints } from '../chart-points/mets';
import { philliesSections, PHILLIES_AERIAL_CONTROL } from '../phillies';
import { philliesChartPoints } from '../chart-points/phillies';
import { bravesSections, BRAVES_AERIAL_CONTROL } from '../braves';
import { bravesChartPoints } from '../chart-points/braves';
import { cardinalsSections, CARDINALS_AERIAL_CONTROL } from '../cardinals';
import { cardinalsChartPoints } from '../chart-points/cardinals';
import { nationalsSections, NATIONALS_AERIAL_CONTROL } from '../nationals';
import { nationalsChartPoints } from '../chart-points/nationals';
import { oriolesSections, ORIOLES_AERIAL_CONTROL } from '../orioles';
import { oriolesChartPoints } from '../chart-points/orioles';
import { aerialChartFit } from '../parkSectionBuilder';
import { getStadiumOrientation } from '../../../stadiums';

// A stand shades its own seats when the sun is behind it, so the direction a
// stand's back faces is the core input to the shade engine. Along a foul line
// the rows run parallel to the line, so the stand faces square to it: on the
// first-base side that is orientation + 135°, on the third-base side
// orientation − 135°. Behind home plate it faces directly away from center
// field (orientation + 180°).

const diff = (a: number, b: number) => {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
};

describe('Yankee Stadium stand directions', () => {
  const orientation = getStadiumOrientation('yankees');
  const byId = new Map(yankeesSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('gives every section a stand direction', () => {
    expect(yankeesSections.filter((s) => s.standCompass === undefined).map((s) => s.id)).toEqual([]);
  });

  it.each(['011', '012', '013', '014A', '014B'])(
    'first-base field box %s faces square to the first-base line',
    (id) => expect(diff(stand(id), orientation + 135)).toBeLessThan(5),
  );

  it.each(['025', '026', '027A', '027B', '028', '029'])(
    'third-base field box %s faces square to the third-base line',
    (id) => expect(diff(stand(id), orientation - 135)).toBeLessThan(5),
  );

  // Nearer home the field boxes curve toward the plate, so they face between
  // the foul-line direction and straight back.
  it.each(['015A', '016', '017A'])('first-base box %s turns toward home plate', (id) => {
    expect(diff(stand(id), orientation + 135) + diff(stand(id), orientation + 180)).toBeLessThan(46);
  });

  it.each(['023', '024A', '024B'])('third-base box %s turns toward home plate', (id) => {
    expect(diff(stand(id), orientation - 135) + diff(stand(id), orientation + 180)).toBeLessThan(46);
  });

  it('wheelchair platforms take their parent section\'s direction', () => {
    expect(stand('011W')).toBe(stand('011'));
    expect(stand('029W')).toBe(stand('029'));
  });

  it.each(['020', '120A', '120B', '220B', '320B', '420B'])(
    'behind-home section %s faces away from center field',
    (id) => expect(diff(stand(id), orientation + 180)).toBeLessThan(10),
  );

  it('places the behind-home field box directly behind home plate', () => {
    const s = byId.get('020')!;
    const bearingFromHome = (orientation + 90 - s.baseAngle - s.angleSpan / 2 + 720) % 360;
    expect(diff(bearingFromHome, orientation + 180)).toBeLessThan(5);
  });
});

describe('aerial calibration of a club map', () => {
  // A chart that is the ground rotated, squashed and sheared: the fit must
  // recover every point exactly from the pinned sections.
  const toGround = (x: number, y: number) => ({ east: 0.8 * x + 0.3 * y + 5, north: -0.4 * x + 0.9 * y - 7 });
  const chart = Array.from({ length: 12 }, (_, i) => ({ id: `S${i}`, x: 100 * Math.cos(i), y: 80 * Math.sin(i * 1.3), width: 4, height: 3 }));
  const control = chart.slice(0, 4).map((p) => {
    const g = toGround(p.x, p.y);
    return { ids: [p.id], bearingDeg: ((Math.atan2(g.east, g.north) * 180) / Math.PI + 360) % 360, distanceM: Math.hypot(g.east, g.north) };
  });

  it('uses a projective map for a perspective drawing an affine map cannot fit', () => {
    // A rendered 3-D view: the ground seen in strong perspective.
    const persp = (x: number, y: number) => {
      const w = 1 + 0.004 * x - 0.003 * y;
      return { east: (0.8 * x + 0.3 * y + 5) / w, north: (-0.4 * x + 0.9 * y - 7) / w };
    };
    const pinned = chart.slice(0, 6).map((p) => {
      const g = persp(p.x, p.y);
      return { ids: [p.id], bearingDeg: ((Math.atan2(g.east, g.north) * 180) / Math.PI + 360) % 360, distanceM: Math.hypot(g.east, g.north) };
    });
    const { mapped, rmsM, model } = aerialChartFit(chart, pinned);
    expect(model).toBe('projective');
    expect(rmsM).toBeLessThan(1e-6);
    for (const p of mapped) {
      const c = chart.find((q) => q.id === p.id)!;
      expect(p.x).toBeCloseTo(persp(c.x, c.y).east, 5);
      expect(-p.y).toBeCloseTo(persp(c.x, c.y).north, 5);
    }
  });

  it('recovers an affine drawing exactly, with an affine map', () => {
    const { mapped, rmsM, model } = aerialChartFit(chart, control);
    expect(model).toBe('affine');
    expect(rmsM).toBeLessThan(1e-6);
    for (const p of mapped) {
      const g = toGround(chart.find((c) => c.id === p.id)!.x, chart.find((c) => c.id === p.id)!.y);
      expect(p.x).toBeCloseTo(g.east, 6);
      expect(-p.y).toBeCloseTo(g.north, 6);
    }
  });
});

describe('Dodger Stadium stand directions (pinned to the 2022 aerial photo)', () => {
  // Dodger Stadium's stands are not square to the foul lines: foul territory
  // narrows toward the corners. On the photo the third-base stands' front
  // edge runs at 355° (so they face 265°) and the first-base edge at 59°
  // (so they face 149°).
  const byId = new Map(dodgersSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(dodgersChartPoints, DODGERS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('gives every seating section a stand direction', () => {
    expect(dodgersSections.filter((s) => s.standCompass === undefined && s.level !== 'standing').map((s) => s.id)).toEqual([]);
  });

  it.each(['17FD', '21FD', '25FD', '29FD', '33FD', '37FD', '41FD'])('third-base field section %s faces 265°', (id) => {
    expect(diff(stand(id), 265)).toBeLessThan(8);
  });

  it.each(['22FD', '26FD', '30FD', '34FD', '38FD', '42FD'])('first-base field section %s faces 149°', (id) => {
    expect(diff(stand(id), 149)).toBeLessThan(8);
  });

  it.each(['1FD', '2FD', '1DG', '101LG', '102LG', '1RS', '1TD'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('dodgers') + 180)).toBeLessThan(15);
  });

  it.each(['301PL', '309PL', '315PL'])('left-field pavilion %s faces away from home plate (north)', (id) => {
    expect(diff(stand(id), 0)).toBeLessThan(15);
  });

  it.each(['302PR', '310PR', '316PR'])('right-field pavilion %s faces away from home plate (northeast)', (id) => {
    expect(diff(stand(id), 60)).toBeLessThan(15);
  });
});

describe('Wrigley Field stand directions (pinned to the 2019 aerial photo)', () => {
  // On the photo the third-base stands' front edge runs at 359° (facing
  // 269°), the first-base edge at 74° (facing 164°), the left-field wall at
  // about 94° (bleachers facing north) and the right-field wall at about
  // 164° (bleachers facing 74°).
  const byId = new Map(cubsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(cubsChartPoints, CUBS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['5', '9', '13', '105', '205', '305L', '310L', '405L', '410L'])('third-base grandstand %s faces 269°', (id) => {
    expect(diff(stand(id), 269)).toBeLessThan(3);
  });

  it.each(['24', '28', '32', '125', '130', '225', '230', '330R', '430R'])('first-base grandstand %s faces 164°', (id) => {
    expect(diff(stand(id), 164)).toBeLessThan(3);
  });

  it.each(['19', '20', '120', '320R'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('cubs') + 180)).toBeLessThan(20);
  });

  it.each(['505', '507'])('left-field bleacher %s faces north', (id) => {
    expect(diff(stand(id), 4)).toBeLessThan(15);
  });

  it.each(['511', '513', '515'])('right-field bleacher %s faces east-northeast', (id) => {
    expect(diff(stand(id), 74)).toBeLessThan(15);
  });
});

describe('Oracle Park stand directions (from the 2022 aerial photo)', () => {
  // The club's drawing is a schematic, so the straight runs take their
  // facing from the photo: third-base stands' edge 54° (facing 324°),
  // first-base about 122° (facing 212°), left-field wall 136° (bleachers
  // facing 46°), center-field wall north–south and right-field wall 54°
  // (arcade facing 90° and 144°).
  const byId = new Map(giantsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('gives every seating section a stand direction', () => {
    expect(giantsSections.filter((s) => s.standCompass === undefined).map((s) => s.id)).toEqual([]);
  });

  it.each(['127', '131', '135', '228', '232', '330', '336', '50', '61'])('third-base section %s faces 324°', (id) => {
    expect(stand(id)).toBe(324);
  });

  it.each(['101', '104', '204', '208', '304', '310', '5', '12'])('first-base section %s faces 212°', (id) => {
    expect(stand(id)).toBe(212);
  });

  it.each(['115', '116', '117', '215', '216', '315', '317'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('giants') + 180)).toBeLessThan(15);
  });

  it('the curve behind home turns steadily between the two runs', () => {
    const order = ['106', '108', '110', '113', '115', '117', '119', '122', '124'].map(stand);
    for (let i = 1; i < order.length; i++) expect(order[i]).toBeGreaterThanOrEqual(order[i - 1] - 5);
  });
});

describe('Citi Field stand directions (pinned to the 2019 aerial photo)', () => {
  // On the photo the third-base stands' front edge runs at 330° (facing
  // 240°) and the first-base edge at about 50° (facing 140°).
  const byId = new Map(metsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(metsChartPoints, METS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['124', '127', '130', '425', '525'])('third-base section %s faces about 240°', (id) => {
    expect(diff(stand(id), 240)).toBeLessThan(10);
  });

  it.each(['102', '105', '108', '111', '205', '305', '405', '505'])('first-base section %s faces 140°', (id) => {
    expect(stand(id)).toBe(140);
  });

  it.each(['C', 'D', '5', '15'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('mets') + 180)).toBeLessThan(12);
  });
});

describe('Citizens Bank Park stand directions (measured on the 2022 aerial photo)', () => {
  // The infield stands run parallel to the foul lines (backs 144° and 234°),
  // the backstop and the decks behind home are square to home plate, and the
  // outfield stands follow their walls (55° and 325°).
  const byId = new Map(philliesSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(philliesChartPoints, PHILLIES_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['115', '117', '214', '315', '415'])('first-base section %s faces 144°', (id) => {
    expect(stand(id)).toBe(144);
  });

  it.each(['130', '133', '228', '326', '426'])('third-base section %s faces 234°', (id) => {
    expect(stand(id)).toBe(234);
  });

  it.each(['C', '123', '222', '321', '421'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('phillies') + 180)).toBeLessThan(6);
  });

  it.each(['102', '104', '203', '304'])('right-field section %s faces 55°', (id) => {
    expect(stand(id)).toBe(55);
  });

  it.each(['141', '143', '242', '244'])('left-field section %s faces 325°', (id) => {
    expect(stand(id)).toBe(325);
  });

  it('the stands at both foul poles mirror each other about the axis', () => {
    // 108 and 139 sit at the corners; mirrored about the axis (9°), their
    // backs should agree within a few degrees.
    const mirror = (b: number) => (2 * (getStadiumOrientation('phillies') + 180) - b + 360) % 360;
    expect(diff(stand('108'), mirror(stand('139')))).toBeLessThan(3);
    expect(diff(stand('111'), mirror(stand('136')))).toBeLessThan(3);
  });
});

describe('Truist Park stand directions (measured on the 2023 aerial photo)', () => {
  // Every level's long lines run 194–198.5° on the first-base side (backs
  // 286°) and 112–116° on the third-base side (backs 24°). Behind home the
  // rings are arcs centred on home plate, so each section faces its own
  // bearing from home. The outfield stands follow their walls.
  const byId = new Map(bravesSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearingFromHome = (id: string) => {
    const s = byId.get(id)!;
    return ((getStadiumOrientation('braves') + 90 - s.baseAngle - s.angleSpan / 2) % 360 + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(bravesChartPoints, BRAVES_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['14', '19', '114', '216', '317', '415'])('first-base section %s faces 286°', (id) => {
    expect(stand(id)).toBe(286);
  });

  it.each(['33', '37', '135', '238', '335', '435'])('third-base section %s faces 24°', (id) => {
    expect(stand(id)).toBe(24);
  });

  it.each(['25', '26', '125', '126', '226', '326', '426'])('behind-home section %s faces back toward home plate', (id) => {
    expect(diff(stand(id), bearingFromHome(id))).toBeLessThan(4);
    expect(diff(stand(id), getStadiumOrientation('braves') + 180)).toBeLessThan(25);
  });

  it('the outfield stands follow their walls', () => {
    expect(stand('158')).toBe(212); // Chop House, rows along the right-field wall (121.5°)
    expect(stand('148')).toBe(135); // Home Run Porch, rows along the left-center wall (~225°)
  });

  it('sections the club calls level with first and third base sit beside them', () => {
    // Rate Your Seats: 317 and 335 "line up almost directly with the first
    // and third bases" (the bags are 45° either side of the 159° axis).
    expect(diff(bearingFromHome('317'), 263)).toBeLessThan(10);
    expect(diff(bearingFromHome('335'), 48.5)).toBeLessThan(10);
  });
});

describe('Busch Stadium stand directions (measured on the 2022 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 197° and 287°); behind
  // home the rings are arcs centred on home plate; the right-field corner's
  // back edge runs 45°/225° (back 135°).
  const byId = new Map(cardinalsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearingFromHome = (id: string) => {
    const s = byId.get(id)!;
    return ((getStadiumOrientation('cardinals') + 90 - s.baseAngle - s.angleSpan / 2) % 360 + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(cardinalsChartPoints, CARDINALS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['142', '144', '140D', '240', '340', '440'])('first-base section %s faces 197°', (id) => {
    expect(stand(id)).toBe(197);
  });

  it.each(['158', '162', '160D', '265', '360', '365'])('third-base section %s faces 287°', (id) => {
    expect(stand(id)).toBe(287);
  });

  it.each(['5', '151', '251', '351', '451'])('behind-home section %s faces back toward home plate', (id) => {
    expect(diff(stand(id), bearingFromHome(id))).toBeLessThan(4);
    expect(diff(stand(id), getStadiumOrientation('cardinals') + 180)).toBeLessThan(15);
  });

  it('the right-field corner and the outfield stands follow the photo', () => {
    expect(stand('130')).toBe(135);
    expect(stand('193')).toBe(44);
    expect(stand('107')).toBe(92);
  });
});

describe('Nationals Park stand directions (measured on the 2023 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 164° and 254°); behind
  // home the rows are arcs centred ~3 m behind home plate; the right-field
  // pavilion runs 137.8° (back 48°).
  const byId = new Map(nationalsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(nationalsChartPoints, NATIONALS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['128', '132', '219', '225', '320', '418'])('first-base section %s faces 164°', (id) => {
    expect(stand(id)).toBe(164);
  });

  it.each(['112', '115', '203', '207', '305', '405'])('third-base section %s faces 254°', (id) => {
    expect(stand(id)).toBe(254);
  });

  it.each(['C', 'DC122', 'DC123', '213', '313'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('nationals') + 180)).toBeLessThan(12);
  });

  it('the outfield stands follow their walls', () => {
    expect(stand('141')).toBe(48);
    expect(stand('240')).toBe(48);
    expect(stand('104')).toBe(314);
    expect(stand('100')).toBe(5);
  });
});

describe('Camden Yards stand directions (measured on the 2023 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 166° and 256°); behind
  // home the rows are arcs centred ~5 m behind home plate; the right-field
  // corner is angled toward home (back 140°).
  const byId = new Map(oriolesSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(oriolesChartPoints, ORIOLES_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['14', '18', '19', '216', '312'])('first-base section %s faces 166°', (id) => {
    expect(stand(id)).toBe(166);
  });

  it.each(['50', '56', '55', '256', '360'])('third-base section %s faces 256°', (id) => {
    expect(stand(id)).toBe(256);
  });

  // 36 and 38 straddle the axis, each ~10° wide, so they face up to ~15°
  // either side of straight back.
  it.each(['36', '38', 'C35', '332', '334'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('orioles') + 180)).toBeLessThan(15);
  });

  it('the corners and outfield stands follow the photo', () => {
    expect(stand('5')).toBe(140);
    expect(stand('96')).toBe(88);
    expect(stand('90')).toBe(55);
    expect(stand('84')).toBe(2);
  });
});
