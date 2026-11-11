import { yankeesSections } from '../yankees';
import { dodgersSections, DODGERS_AERIAL_CONTROL } from '../dodgers';
import { dodgersChartPoints } from '../chart-points/dodgers';
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
  // A chart that is the ground rotated 30°, squashed and sheared: the fit
  // must recover every point exactly from three or more pinned sections.
  const toGround = (x: number, y: number) => ({ east: 0.8 * x + 0.3 * y + 5, north: -0.4 * x + 0.9 * y - 7 });
  const chart = Array.from({ length: 12 }, (_, i) => ({ id: `S${i}`, x: 100 * Math.cos(i), y: 80 * Math.sin(i * 1.3), width: 4, height: 3 }));
  const control = chart.slice(0, 4).map((p) => {
    const g = toGround(p.x, p.y);
    return { ids: [p.id], bearingDeg: ((Math.atan2(g.east, g.north) * 180) / Math.PI + 360) % 360, distanceM: Math.hypot(g.east, g.north) };
  });

  it('recovers an affine drawing exactly', () => {
    const { mapped, rmsM } = aerialChartFit(chart, control);
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
