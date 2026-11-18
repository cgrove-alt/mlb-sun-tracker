import { yankeesSections } from '../yankees';
import { marinersSections, MARINERS_AERIAL_CONTROL } from '../mariners';
import { marinersChartPoints } from '../chart-points/mariners';
import { brewersSections, BREWERS_AERIAL_CONTROL } from '../brewers';
import { brewersChartPoints } from '../chart-points/brewers';
import { marlinsSections, MARLINS_AERIAL_CONTROL } from '../marlins';
import { marlinsChartPoints } from '../chart-points/marlins';
import { astrosSections, ASTROS_AERIAL_CONTROL } from '../astros';
import { astrosChartPoints } from '../chart-points/astros';
import { diamondbacksSections, DIAMONDBACKS_AERIAL_CONTROL } from '../diamondbacks';
import { diamondbacksChartPoints } from '../chart-points/diamondbacks';
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
import { padresSections, PADRES_AERIAL_CONTROL } from '../padres';
import { padresChartPoints } from '../chart-points/padres';
import { angelsSections, ANGELS_AERIAL_CONTROL } from '../angels';
import { angelsChartPoints } from '../chart-points/angels';
import { rockiesSections, ROCKIES_AERIAL_CONTROL } from '../rockies';
import { rockiesChartPoints } from '../chart-points/rockies';
import { royalsSections, ROYALS_AERIAL_CONTROL } from '../royals';
import { royalsChartPoints } from '../chart-points/royals';
import { redsSections, REDS_AERIAL_CONTROL } from '../reds';
import { redsChartPoints } from '../chart-points/reds';
import { piratesSections, PIRATES_AERIAL_CONTROL } from '../pirates';
import { piratesChartPoints } from '../chart-points/pirates';
import { tigersSections, TIGERS_AERIAL_CONTROL } from '../tigers';
import { tigersChartPoints } from '../chart-points/tigers';
import { guardiansSections, GUARDIANS_AERIAL_CONTROL } from '../guardians';
import { guardiansChartPoints } from '../chart-points/guardians';
import { twinsSections, TWINS_AERIAL_CONTROL } from '../twins';
import { twinsChartPoints } from '../chart-points/twins';
import { whitesoxSections, WHITESOX_AERIAL_CONTROL } from '../whitesox';
import { whitesoxChartPoints } from '../chart-points/whitesox';
import { athleticsSections, ATHLETICS_AERIAL_CONTROL } from '../athletics';
import { athleticsChartPoints } from '../chart-points/athletics';
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

  it.each(['302PR', '310PR'])('right-field pavilion %s faces away from home plate (northeast)', (id) => {
    expect(diff(stand(id), 60)).toBeLessThan(15);
  });

  it('the pavilion\'s end, 316PR, faces its own rows on the lidar', () => {
    // The median of its rows' fall lines (middle and 4 m to either side).
    expect(stand('316PR')).toBe(43);
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

  it.each(['104', '204', '208', '304', '310', '5', '12'])('first-base section %s faces 212°', (id) => {
    expect(stand(id)).toBe(212);
  });

  it('the first-base corner, 101, faces its own rows on the lidar', () => {
    // Planes fitted to its treads and the fall line in its middle agree its
    // rows climb toward 188°, 24° off the run along the first-base stands'
    // edge: at the corner its rows turn from that edge.
    expect(stand('101')).toBe(188);
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

  it.each(['124', '127', '130', '425'])('third-base section %s faces about 240°', (id) => {
    expect(diff(stand(id), 240)).toBeLessThan(10);
  });

  it('the promenade past 524 faces its own rows on the lidar, not the lower stands\' edge', () => {
    // The scan's rows there run north-south (its fall line, at the middle of
    // the section and 4 m to either side): 524–527 face 264–272°.
    expect(stand('525')).toBe(272);
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

  it.each(['130', '228', '326', '426'])('third-base section %s faces 234°', (id) => {
    expect(stand(id)).toBe(234);
  });

  it('third-base section 133 faces its own rows on the lidar', () => {
    // Planes fitted to its treads and the fall line in its middle agree its
    // rows climb toward 255°, 21° off the run's 234°.
    expect(stand('133')).toBe(255);
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
    expect(stand('149')).toBe(135); // Home Run Porch, rows along the left-center wall (~225°)
  });

  it('the Home Run Porch\'s 148 faces its own rows on the lidar', () => {
    // Planes fitted to its treads and the fall line in its middle agree its
    // rows climb toward 121°, 14° off the run along the left-center wall.
    expect(stand('148')).toBe(121);
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

  it.each(['158', '160D', '360', '365'])('third-base section %s faces 287°', (id) => {
    expect(stand(id)).toBe(287);
  });

  it('the left-field loge faces its own rows on the lidar', () => {
    // The photo's level lines are 4–38 m back from the line; past them the
    // loge's rows (265–269, and 162–168 below) run about 50° on the scan.
    expect(stand('265')).toBe(320);
    expect(stand('162')).toBe(317);
  });

  it.each(['5', '151', '251', '351', '451'])('behind-home section %s faces back toward home plate', (id) => {
    expect(diff(stand(id), bearingFromHome(id))).toBeLessThan(4);
    expect(diff(stand(id), getStadiumOrientation('cardinals') + 180)).toBeLessThan(15);
  });

  it('the right-field corner and the outfield stands follow the photo', () => {
    // The corner's back edge, read in shadow, gives 135° (127, 132, 133);
    // the rows of 128–131 run nearer north-south on the lidar (105–108°).
    expect(stand('133')).toBe(135);
    expect(stand('130')).toBe(106);
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

  it.each(['112', '115', '203', '207', '307', '405'])('third-base section %s faces 254°', (id) => {
    expect(stand(id)).toBe(254);
  });

  it('the Gallery\'s 305 faces its own rows on the lidar', () => {
    // Planes fitted to its treads and the fall line in its middle agree its
    // rows climb toward 266°, 12° off the level lines along the line, as
    // 304's (271°) and 306's (269°) beside it do: the Gallery turns there.
    expect(stand('305')).toBe(266);
  });

  it.each(['C', 'DC122', 'DC123', '213', '313'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('nationals') + 180)).toBeLessThan(12);
  });

  it('the outfield stands follow their walls', () => {
    expect(stand('141')).toBe(48);
    // The upper pavilion's rows run north-south on the lidar (88°), not
    // along the wall below it.
    expect(stand('240')).toBe(88);
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

describe('Petco Park stand directions (measured on the 2022 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 135° and 225°), then
  // the stands turn to run along the outfield lines (90° and 270°); behind
  // home the rows are an arc centred on home plate.
  const byId = new Map(padresSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(padresChartPoints, PADRES_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['111', '209', '317'])('first-base section %s faces 135°', (id) => expect(stand(id)).toBe(135));
  it.each(['112', '210', '318'])('third-base section %s faces 225°', (id) => expect(stand(id)).toBe(225));
  it.each(['219'])('right-field-line section %s faces 90°', (id) => expect(stand(id)).toBe(90));
  // Where the stands turn from the lines to the outfield, the rows of 119,
  // 121 and 325, and of 220, run at 16–30° to north-south on the lidar.
  it.each([['121', 110], ['325', 110], ['220', 254]] as const)('section %s faces its own rows on the lidar', (id, deg) => expect(stand(id)).toBe(deg));
  it.each(['122', '326'])('left-field-line section %s faces 270°', (id) => expect(stand(id)).toBe(270));

  it.each(['101', 'F', 'G', '300', '302'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('padres') + 180)).toBeLessThan(10);
  });

  it('the outfield stands follow their walls', () => {
    expect(stand('128')).toBe(298);
    expect(stand('133')).toBe(45);
  });

  it('the left-field box\'s 130 and 134 face their own rows on the lidar', () => {
    // Planes fitted to their treads and the fall line in their middle agree
    // their rows climb toward 311–313°, 13–15° off the run along the wall.
    expect(stand('130')).toBe(313);
    expect(stand('134')).toBe(311);
  });
});

describe('Angel Stadium stand directions (measured on the 2022 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 179° and 269°); the
  // corners turn toward the outfield stands (299° and 130°); the right-field
  // pavilion faces 73°.
  const byId = new Map(angelsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(angelsChartPoints, ANGELS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('numbers the 100s from the left-field corner (101) to the right-field corner (135)', () => {
    const bearing = (id: string) => ((getStadiumOrientation('angels') + 90 - byId.get(id)!.baseAngle - byId.get(id)!.angleSpan / 2) % 360 + 360) % 360;
    expect(diff(bearing('110'), 314)).toBeLessThan(20); // third-base side (the 3B line runs 359°)
    expect(diff(bearing('126'), 134)).toBeLessThan(20); // first-base side (the 1B line runs 89°)
  });

  it.each(['108', '111', '207', '310', '405', '505'])('third-base section %s faces 269°', (id) => expect(stand(id)).toBe(269));
  it.each(['126', '129', '226', '340', '428', '533'])('first-base section %s faces 179°', (id) => expect(stand(id)).toBe(179));

  it.each(['118', '216', '520'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('angels') + 180)).toBeLessThan(10);
  });

  it('the corners and outfield stands follow the photo', () => {
    expect(stand('101')).toBe(299);
    expect(stand('134')).toBe(130);
    expect(stand('238')).toBe(73);
    expect(stand('258')).toBe(1);
  });
});

describe('Coors Field stand directions (measured on the 2019 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 139° and 229°); the
  // outfield stands follow their walls (330° and 48°).
  const byId = new Map(rockiesSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(rockiesChartPoints, ROCKIES_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['120', '123', '219', 'L319'])('first-base section %s faces 139°', (id) => expect(stand(id)).toBe(139));
  it.each(['138', '142', '238', 'L340'])('third-base section %s faces 229°', (id) => expect(stand(id)).toBe(229));

  it.each(['130', '131', 'L330'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('rockies') + 180)).toBeLessThan(12);
  });

  it('the outfield stands follow their walls', () => {
    expect(stand('107')).toBe(48);
    expect(stand('205')).toBe(48);
  });

  it('the left-field stands face their own rows on the lidar', () => {
    // Planes fitted to the treads and the fall line in the middle agree that
    // 152–156's rows climb toward 314°, 16° off the wall's 330°.
    expect(stand('155')).toBe(314);
  });
});

describe('Kauffman Stadium stand directions (measured on the 2022 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 182° and 271°).
  const byId = new Map(royalsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(royalsChartPoints, ROYALS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['118', '214', '309', '411'])('third-base section %s faces 271°', (id) => expect(stand(id)).toBe(271));
  it.each(['138', '240', '322', '433', '433R'])('first-base section %s faces 182°', (id) => expect(stand(id)).toBe(182));
  // Planes fitted to their treads and the fall line in their middle agree
  // these two climb 16–17° off the runs: the lower bowl turns toward the
  // corners (112 and 114 to 288°, 142–147 to 161–166°).
  it('third-base section 112 faces its own rows on the lidar', () => expect(stand('112')).toBe(288));
  it('first-base section 142 faces its own rows on the lidar', () => expect(stand('142')).toBe(166));

  it.each(['127', '128', '225', '230', '314', '420', '420R'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('royals') + 180)).toBeLessThan(15);
  });
});

describe('Great American Ball Park stand directions (measured on the 2023 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 256° and 347°);
  // behind home the rows are arcs centred on home plate.
  const byId = new Map(redsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(redsChartPoints, REDS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['130', '134', '303', '533'])('first-base section %s faces 256°', (id) => expect(stand(id)).toBe(256));
  it.each(['118', '514'])('third-base section %s faces 347°', (id) => expect(stand(id)).toBe(347));
  // The photo's level lines are the lower bowl's; on the lidar the 400s'
  // rows and walls on the third-base side (411–415) run about 100°.
  it('third-base section 414 faces its own rows on the lidar', () => expect(stand('414')).toBe(14));

  it('third-base section 112 faces its own rows on the lidar', () => {
    // Planes fitted to its treads and the fall line in its middle agree its
    // rows climb toward 14°, 27° off the line's 347° (as 108–111's rows,
    // along their fall lines, turn from it).
    expect(stand('112')).toBe(14);
  });

  it.each(['124', '225', '525'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('reds') + 180)).toBeLessThan(10);
  });

  it('the outfield stands follow their walls', () => {
    expect(stand('103')).toBe(85);
    expect(stand('143')).toBe(160);
  });
});

describe('PNC Park stand directions (measured on the 2022 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 253° and 338°);
  // behind home the rows are arcs centred on home plate.
  const byId = new Map(piratesSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(piratesChartPoints, PIRATES_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it.each(['7', '108', '205', '305'])('first-base section %s faces 253°', (id) => expect(stand(id)).toBe(253));
  it.each(['25', '127', '223', '325'])('third-base section %s faces 338°', (id) => expect(stand(id)).toBe(338));

  it.each(['16', '116'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('pirates') + 180)).toBeLessThan(10);
  });

  it('the outfield stands follow their walls', () => {
    expect(stand('143')).toBe(170);
    expect(stand('236')).toBe(78);
  });
});

describe('Comerica Park stand directions (measured on the 2022 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 286° and 17°); behind
  // home the rows are arcs centred ~4 m behind the plate.
  const byId = new Map(tigersSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('tigers') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(tigersChartPoints, TIGERS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts 127 and 128 either side of the aisle on the axis, as the photo shows', () => {
    const axis = (getStadiumOrientation('tigers') + 180) % 360;
    expect(diff(bearing('127'), axis - 5.5)).toBeLessThan(2);
    expect(diff(bearing('128'), axis + 5.5)).toBeLessThan(2);
  });

  it.each(['118', '122', '214', 'TD121', '116A'])('first-base section %s faces 286°', (id) => expect(stand(id)).toBe(286));
  it.each(['133', '138', '137A', '340', 'TD134'])('third-base section %s faces 17°', (id) => expect(stand(id)).toBe(17));

  it.each(['127', '128', 'TD127A', '328'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('tigers') + 180)).toBeLessThan(10);
  });

  it('the corners and outfield stands follow the photo', () => {
    expect(stand('113')).toBe(238);
    expect(stand('142')).toBe(65);
    expect(stand('104')).toBe(197);
    expect(stand('148')).toBe(102);
  });
});

describe('Progressive Field stand directions (measured on the 2023 aerial photo)', () => {
  // Rows run ~6° inside both foul lines (backs 129° and 231°); behind home
  // the rows are arcs centred on home plate.
  const byId = new Map(guardiansSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('guardians') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(guardiansChartPoints, GUARDIANS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts 150–157 on the wedges between the aisles seen behind home', () => {
    // Aisles every ~11.2° from 134.5° to 224.4°, one on the axis (179.5°).
    const wedges: Record<string, number> = { '150': 140.1, '151': 151.25, '152': 162.5, '153': 173.9, '154': 185.4, '155': 196.9, '156': 207.75, '157': 218.7 };
    for (const [id, middle] of Object.entries(wedges)) expect(diff(bearing(id), middle)).toBeLessThan(4);
  });

  it.each(['134', '144', '336', '541'])('first-base section %s faces 129°', (id) => expect(stand(id)).toBe(129));
  it.each(['162', '170', '470', '564'])('third-base section %s faces 231°', (id) => expect(stand(id)).toBe(231));

  it.each(['153', '154', '453'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('guardians') + 180)).toBeLessThan(10);
  });

  it('the corners and outfield stands follow the photo', () => {
    expect(stand('111')).toBe(56);
    expect(stand('309')).toBe(56);
    expect(stand('117')).toBe(140);
    expect(stand('178')).toBe(221);
    expect(stand('183')).toBe(328);
  });
});

describe('Target Field stand directions (measured on the 2021 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 226° and 316°);
  // behind home the rows are arcs centred near home plate.
  const byId = new Map(twinsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('twins') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(twinsChartPoints, TWINS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts 111–117 on the wedges between the aisles seen behind home', () => {
    // Aisles at 229°, 243.5°, 254.3°, 265.5°, 273.5°, 284.5°, 296° and 310°.
    const wedges: Record<string, number> = { '111': 236.25, '112': 248.9, '113': 259.9, '114': 269.5, '115': 279, '116': 290.25, '117': 303 };
    for (const [id, middle] of Object.entries(wedges)) expect(diff(bearing(id), middle)).toBeLessThan(4);
  });

  it.each(['3', '108', 'B', '208', '308'])('first-base section %s faces 226°', (id) => expect(stand(id)).toBe(226));
  it.each(['13', '120', 'P', '222', '322'])('third-base section %s faces 316°', (id) => expect(stand(id)).toBe(316));

  it.each(['114', 'H', '214', '314'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('twins') + 180)).toBeLessThan(10);
  });

  it('the corners and outfield stands follow the photo', () => {
    expect(stand('102')).toBe(205);
    expect(stand('125')).toBe(340);
    expect(stand('130')).toBe(52);
    expect(stand('134')).toBe(130);
  });
});

describe('Rate Field stand directions (measured on the 2019 aerial photo)', () => {
  // Level lines run parallel to both foul lines (backs 263° and 355°);
  // behind home the aisles radiate from home plate.
  const byId = new Map(whitesoxSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('whitesox') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(whitesoxChartPoints, WHITESOX_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts 133–136 on the wedges between the aisles seen behind home', () => {
    // Aisles at 313.5°, 324.5°, 336° and 348°; the straight starts at ~1°.
    const wedges: Record<string, number> = { '133': 319, '134': 330.25, '135': 342, '136': 354.5 };
    for (const [id, middle] of Object.entries(wedges)) expect(diff(bearing(id), middle)).toBeLessThan(4);
  });

  it.each(['112', '124', '316', '520'])('first-base section %s faces 263°', (id) => expect(stand(id)).toBe(263));
  it.each(['140', '150', '342', '546'])('third-base section %s faces 355°', (id) => expect(stand(id)).toBe(355));

  it.each(['132', '531'])('behind-home section %s faces away from center field', (id) => {
    expect(diff(stand(id), getStadiumOrientation('whitesox') + 180)).toBeLessThan(10);
  });

  it('the corners and outfield stands follow the photo', () => {
    expect(stand('108')).toBe(187);
    expect(stand('155')).toBe(36);
    expect(stand('102')).toBe(164);
    expect(stand('161')).toBe(89);
  });
});

describe('Sutter Health Park stand directions (measured on the 2022 aerial photo)', () => {
  // Both straights converge on their foul lines (backs 171° and 280°);
  // behind home the aisles radiate from home plate.
  const byId = new Map(athleticsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('athletics') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(athleticsChartPoints, ATHLETICS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts 108–116 on the wedges between the aisles seen behind home', () => {
    // Aisles at 163°, 176.5°, 190°, 203.5°, 217.5°, 235.5°, 249.5°, 263°, 276.5° and 290°.
    const wedges: Record<string, number> = { '108': 169.75, '109': 183.25, '110': 196.75, '111': 210.5, '112': 226.5, '113': 242.5, '114': 256.25, '115': 269.75, '116': 283.25 };
    for (const [id, middle] of Object.entries(wedges)) expect(diff(bearing(id), middle)).toBeLessThan(3);
  });

  it.each(['101', '104', '107', '203'])('first-base section %s faces 171°', (id) => expect(stand(id)).toBe(171));
  it.each(['117', '120', '123'])('third-base section %s faces 280°', (id) => expect(stand(id)).toBe(280));

  it.each(['112', '110', '114'])('behind-home section %s faces its bearing from home', (id) => {
    expect(diff(stand(id), bearing(id))).toBeLessThan(4);
  });
});

describe('Chase Field stand directions (measured on the 2017 aerial photo, roof open)', () => {
  // Both straights are turned ~4° toward home (backs 131° and 228°); behind
  // home the rows are arcs on the plate; the outfield stands sit behind
  // straight walls (backs 51° and 316°).
  const byId = new Map(diamondbacksSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('diamondbacks') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(diamondbacksChartPoints, DIAMONDBACKS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts J and 122 on the axis behind home, between the aisles at 171° and 189°', () => {
    expect(diff(bearing('J'), 180)).toBeLessThan(3);
    expect(diff(bearing('122'), 180)).toBeLessThan(3);
  });

  it('puts the outfield stands where the photo shows them', () => {
    for (const id of ['101', '102', '103']) expect(bearing(id)).toBeGreaterThan(12);
    for (const id of ['101', '102', '103']) expect(bearing(id)).toBeLessThan(46);
    for (const id of ['141', '142', '143', '144']) expect(bearing(id)).toBeGreaterThan(314);
    for (const id of ['141', '142', '143', '144']) expect(bearing(id)).toBeLessThan(347);
  });

  it.each(['A', 'F', '113', '115', '205', '308'])('first-base section %s faces 131°', (id) => expect(stand(id)).toBe(131));
  it.each(['M', 'Q', '128', '132', '213', '326'])('third-base section %s faces 228°', (id) => expect(stand(id)).toBe(228));
  it.each(['J', '122', '120', '124', '316'])('behind-home section %s faces its bearing from home', (id) => {
    expect(diff(stand(id), bearing(id))).toBeLessThan(4);
  });
  it.each([['101', 51], ['104', 51], ['142', 316], ['144', 316]])('outfield section %s faces %i°', (id, deg) => expect(stand(id as string)).toBe(deg));
});

describe('Daikin Park stand directions (measured on the 2012 and 2014 aerial photos, roof open)', () => {
  // Both straights lean toward home (backs 113° and 214°); behind home the
  // direction turns evenly between them; the outfield stands sit behind
  // straight walls (backs 292° and 41°).
  const byId = new Map(astrosSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('astros') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photos within 5 m', () => {
    expect(aerialChartFit(astrosChartPoints, ASTROS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts the Crawford Boxes behind the left-field wall and 150–156 behind the right-field wall', () => {
    for (const id of ['100', '102', '104']) expect(bearing(id)).toBeGreaterThan(285);
    for (const id of ['100', '102', '104']) expect(bearing(id)).toBeLessThan(320);
    for (const id of ['150', '153', '156']) expect(bearing(id)).toBeLessThan(40);
  });

  it.each(['124', '127', '131', '225', '325', '428'])('first-base section %s faces 113°', (id) => expect(stand(id)).toBe(113));
  it.each(['109', '112', '114', '209', '310', '410'])('third-base section %s faces 214°', (id) => expect(stand(id)).toBe(214));
  it.each(['119', '120', '219', '419'])('behind-home section %s faces between the two straights', (id) => {
    expect(stand(id)).toBeGreaterThan(113);
    expect(stand(id)).toBeLessThan(214);
  });
  it.each([['101', 292], ['104', 292], ['152', 41], ['254', 41]])('outfield section %s faces %i°', (id, deg) => expect(stand(id as string)).toBe(deg));
});

describe('loanDepot park stand directions (measured on the 2013 aerial photo, roof open)', () => {
  // The third-base straight's back faces 357°, the first-base one its mirror
  // image (261°); behind home the aisles stand evenly round the plate; left
  // field sits behind a north–south wall (back 90°).
  const byId = new Map(marlinsSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('marlins') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(marlinsChartPoints, MARLINS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts 14 and 15 either side of the axis behind home', () => {
    expect(diff(bearing('SEC14'), 309)).toBeLessThan(12);
    expect(diff(bearing('SEC15'), 309)).toBeLessThan(12);
    expect(bearing('SEC14')).toBeLessThan(309);
    expect(bearing('SEC15')).toBeGreaterThan(309);
  });

  it('puts the right-field stands behind the right-field wall', () => {
    for (const id of ['SEC34', 'SEC36', 'SEC38', 'SEC40']) expect(diff(bearing(id), 160)).toBeLessThan(22);
  });

  it.each(['SEC20', 'SEC23', 'SEC26', 'SEC222', 'SEC325'])('third-base section %s faces 357°', (id) => expect(stand(id)).toBe(357));
  it.each(['SEC3', 'SEC7', 'SEC206', 'SEC305'])('first-base section %s faces 261°', (id) => expect(stand(id)).toBe(261));
  it.each(['SEC14', 'SEC15', 'SEC16', 'SEC315'])('behind-home section %s faces its bearing from home', (id) => {
    expect(diff(stand(id), bearing(id))).toBeLessThan(4);
  });
  it.each(['SEC29', 'SEC31'])('left-field section %s faces 90°', (id) => expect(stand(id)).toBe(90));
});

describe('American Family Field stand directions (measured on the 2020 aerial photo, roof open)', () => {
  // The first-base straight's back faces 258°, the third-base one its
  // mirror image (2°); behind home the aisles stand evenly round the plate.
  const byId = new Map(brewersSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('brewers') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photo within 5 m', () => {
    expect(aerialChartFit(brewersChartPoints, BREWERS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts 117 and 118 either side of the aisle behind home', () => {
    expect(diff(bearing('117'), 297.5)).toBeLessThan(5);
    expect(diff(bearing('118'), 317.4)).toBeLessThan(5);
  });

  it.each(['109', '112', '210', '312', '415'])('first-base section %s faces 258°', (id) => expect(stand(id)).toBe(258));
  it.each(['124', '128', '226', '340', '430'])('third-base section %s faces 2°', (id) => expect(stand(id)).toBe(2));
  it.each(['116', '117', '118', '119'])('behind-home section %s faces its bearing from home', (id) => {
    expect(diff(stand(id), bearing(id))).toBeLessThan(4);
  });
});

describe('T-Mobile Park stand directions (measured on the 2013 and 2017 aerial photos, roof open)', () => {
  // Straights: backs 272° (third base) and 181° (first base); both corners
  // turn ~18.5° toward the outfield (290° and 163°); behind home each
  // section faces its bearing.
  const byId = new Map(marinersSections.map((s) => [s.id, s]));
  const stand = (id: string) => {
    const value = byId.get(id)?.standCompass;
    if (value === undefined) throw new Error(`No stand direction for ${id}`);
    return value;
  };
  const bearing = (id: string) => {
    const s = byId.get(id)!;
    return (((getStadiumOrientation('mariners') + 90 - s.baseAngle - s.angleSpan / 2) % 360) + 360) % 360;
  };

  it('pins the club map to the photos within 5 m', () => {
    expect(aerialChartFit(marinersChartPoints, MARINERS_AERIAL_CONTROL).rmsM).toBeLessThan(5);
  });

  it('puts the right-field stands (102–110) between the right-field wall and the parked roof', () => {
    for (const id of ['102', '106', '110']) expect(bearing(id)).toBeGreaterThan(55);
    for (const id of ['102', '106', '110']) expect(bearing(id)).toBeLessThan(101);
  });

  it.each(['135', '137', '139', '237'])('third-base section %s faces 272°', (id) => expect(stand(id)).toBe(272));
  it.each(['122', '124', '125'])('first-base section %s faces 181°', (id) => expect(stand(id)).toBe(181));
  it.each(['143', '146'])('left-field corner section %s faces 290°', (id) => expect(stand(id)).toBe(290));
  it.each(['115', '117'])('right-field corner section %s faces 163°', (id) => expect(stand(id)).toBe(163));
  it.each(['127', '129', '131'])('behind-home section %s faces its bearing from home', (id) => {
    expect(diff(stand(id), bearing(id))).toBeLessThan(4);
  });
});
