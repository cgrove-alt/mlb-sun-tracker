"""
Measure the direction an NFL field runs from Sentinel-2 satellite images (10 m
pixels), and compare it with the value recorded in
src/data/nflOrientationMeasurements.ts. For a stadium too new for the aerial
photos: the Bills', which opened in 2026.

Requirements: Python 3.11+ with numpy, scipy and pillow.

  python scripts/measureNflSatellite.py              # every field below
  python scripts/measureNflSatellite.py <venueId>..  # some fields

Method:
  1. For each field, fetch the vegetation index of every image of the season
     with under 15% cloud, north-up in Web Mercator (which keeps angles true),
     centered on the field.
  2. Grass is far greener than the stands. Fit a rectangle to it: center,
     direction, length and width, blurred to the satellite's pixels.
  3. Keep the images where the rectangle explains 80% of what is there and is
     at least 100 m long. A field is 110 x 49 m, so a shorter one has a shadow
     or a canopy over it. The median of those is the direction.

It needs a natural-grass field in open air. The others here are the grass
fields whose directions were measured from OpenStreetMap and aerial photos, so
they say how far to trust it. Images are cached in tmp/nfl-orientation/
(git-ignored).
"""
import json, math, os, re, statistics, sys, time, urllib.parse, urllib.request
import numpy as np
from PIL import Image
from scipy import ndimage, optimize

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, 'tmp', 'nfl-orientation')
DATA = os.path.join(ROOT, 'src', 'data', 'nflOrientationMeasurements.ts')
PLANETARY = 'https://planetarycomputer.microsoft.com/api'
EARTH_RADIUS = 6378137.0
HALF_M = 130  # 1 m per pixel
SIZE = 2 * HALF_M
EAST, NORTH = np.meshgrid(np.arange(SIZE) - (SIZE - 1) / 2, (SIZE - 1) / 2 - np.arange(SIZE))

# Field centers: the OpenStreetMap outlines named in the recorded sources, and
# for the Bills the opening in the canopy (way 1577454592).
FIELDS = {
    'highmark-stadium': (2026, 42.77289, -78.79218),
    'lambeau-field': (2025, 44.50133, -88.06222),
    'soldier-field': (2025, 41.86232, -87.61670),
    'acrisure-stadium': (2025, 40.44681, -80.01582),
    'huntington-bank-field': (2025, 41.50603, -81.69958),
    'lincoln-financial-field': (2025, 39.90080, -75.16746),
    'empower-field': (2025, 39.74394, -105.02011),
    'raymond-james-stadium': (2025, 27.97597, -82.50336),
    'everbank-stadium': (2025, 30.32386, -81.63736),
    'levis-stadium': (2025, 37.40318, -121.96980),
    'geha-field-arrowhead': (2025, 39.04893, -94.48400),
    'm-t-bank-stadium': (2025, 39.27797, -76.62270),
    'northwest-stadium': (2025, 38.90767, -76.86450),
    'hard-rock-stadium': (2025, 25.95793, -80.23885),
    'state-farm-stadium': (2025, 33.52592, -112.26125),  # the grass tray, outdoors
}


def images(year, lat, lon):
    """The season's clear images: date and id."""
    query = {'collections': ['sentinel-2-l2a'], 'intersects': {'type': 'Point', 'coordinates': [lon, lat]},
             'datetime': f'{year}-04-01/{year}-10-31', 'query': {'eo:cloud_cover': {'lt': 15}}, 'limit': 100}
    req = urllib.request.Request(f'{PLANETARY}/stac/v1/search', data=json.dumps(query).encode(),
                                 headers={'content-type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as res:
        items = json.load(res)['features']
    return sorted(item['id'] for item in items)


def greenness(item, lat, lon):
    """The vegetation index around the field, -0.2 to 1."""
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f'{item}-{lat:.5f},{lon:.5f}.png')
    if not os.path.exists(path):
        x = math.radians(lon) * EARTH_RADIUS
        y = math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) * EARTH_RADIUS
        half = HALF_M / math.cos(math.radians(lat))
        bbox = ','.join(f'{v:.2f}' for v in (x - half, y - half, x + half, y + half))
        index = urllib.parse.quote('(B08-B04)/(B08+B04)')
        url = (f'{PLANETARY}/data/v1/item/bbox/{bbox}/{SIZE}x{SIZE}.png?collection=sentinel-2-l2a&item={item}'
               f'&assets=B08&assets=B04&expression={index}&asset_as_band=true&rescale=-0.2,1.0'
               '&coord_crs=epsg:3857&dst_crs=epsg:3857&nodata=0&resampling=bilinear')
        for attempt in range(1, 6):
            try:
                with urllib.request.urlopen(url, timeout=60) as res:
                    body = res.read()
                break
            except OSError:
                if attempt == 5:
                    raise
                time.sleep(4 * attempt)
        with open(path, 'wb') as out:
            out.write(body)
        time.sleep(0.3)
    return np.asarray(Image.open(path).convert('LA'))[..., 0] / 255 * 1.2 - 0.2


def rectangle(east, north, direction, length, width):
    turn = math.radians(direction)
    along = (EAST - east) * math.sin(turn) + (NORTH - north) * math.cos(turn)
    across = (EAST - east) * math.cos(turn) - (NORTH - north) * math.sin(turn)
    inside = lambda distance, size: 1 / (1 + np.exp(np.clip((np.abs(distance) - size / 2) / 3, -30, 30)))
    return ndimage.gaussian_filter(inside(along, length) * inside(across, width), 3.5)


def measure(green):
    """(direction 0-180, share explained, length), or None without a field in view."""
    middle = green[HALF_M - 30:HALF_M + 30, HALF_M - 30:HALF_M + 30]
    ring = np.hypot(EAST, NORTH)
    grass, stands = np.percentile(middle, 80), np.percentile(green[(ring > 60) & (ring < 110)], 30)
    labels, _ = ndimage.label(green > (grass + stands) / 2)
    at_center = labels[HALF_M - 10:HALF_M + 10, HALF_M - 10:HALF_M + 10]
    if not at_center.any():
        return None
    field = labels == np.bincount(at_center[at_center > 0]).argmax()
    if not 2500 < field.sum() < 14000:
        return None
    _, axes = np.linalg.eigh(np.cov(EAST[field], NORTH[field]))
    start = math.degrees(math.atan2(axes[0, 1], axes[1, 1]))
    near = ndimage.binary_dilation(field, iterations=14)
    target = np.clip((green - stands) / (grass - stands), 0, 1.2)
    fits = [optimize.least_squares(lambda p: (rectangle(*p) - target)[near], diff_step=1e-2,
                                   x0=[EAST[field].mean(), NORTH[field].mean(), start + turn, 110, 60])
            for turn in (-12, 0, 12)]
    best = min(fits, key=lambda fit: fit.cost)
    return best.x[2] % 180, 1 - best.fun.var() / target[near].var(), best.x[3]


def main():
    with open(DATA) as f:
        recorded = {m[1]: int(m[2]) % 180 for m in re.finditer(r"'([a-z0-9-]+)': \{ orientation: (\d+),", f.read())}
    print('venue | recorded | measured (difference) | images kept, spread')
    for venue in sys.argv[1:] or FIELDS:
        year, lat, lon = FIELDS[venue]
        ids = images(year, lat, lon)
        fits = [fit for fit in (measure(greenness(item, lat, lon)) for item in ids) if fit]
        from_record = [(fit[0] - recorded[venue] + 90) % 180 - 90 for fit in fits if fit[1] > 0.8 and fit[2] >= 100]
        if len(from_record) < 3:
            print(f'{venue} | {recorded[venue]} | not enough clear images ({len(from_record)} of {len(ids)})', flush=True)
            continue
        off = statistics.median(from_record)
        print(f'{venue} | {recorded[venue]} | {(recorded[venue] + off) % 180:.1f} ({off:+.1f}) | '
              f'{len(from_record)} of {len(ids)}, {statistics.pstdev(from_record):.1f}', flush=True)


if __name__ == '__main__':
    main()
