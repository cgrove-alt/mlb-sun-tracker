import { yankeesSections } from '../yankees';
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
