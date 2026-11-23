"""
Measure the direction each MiLB park faces (home plate to center field) from
USGS aerial photos, and compare it with the value recorded in
src/data/milbOrientationMeasurements.ts.

Requirements: Python 3.11+ with numpy, scipy and pillow.

  python scripts/measureMilbOrientation.py              # every park
  python scripts/measureMilbOrientation.py <venueId>..  # some parks

Method:
  1. For each park, fetch a north-up Web Mercator photo (which keeps angles
     true) centered on the park's recorded pitcher's mound, from two USGS
     services: NAIP Plus and the imagery basemap. They often show different
     flights, so they check each other.
  2. Build a regulation infield (90 ft bases, the 95 ft skin arc around the
     mound, the home and mound circles, the infield grass and the outfield
     grass in fair ground). Dirt is redder than grass, so the template is +1
     on dirt and -1 on grass against (red - green) / brightness.
  3. Turn it through every direction and slide it up to 15 m around the
     mound. The best normalized match is the direction.
  4. Parks no photo shows (new in 2025, or in Canada) and those where neither
     photo is a clear match are fitted the same way to Sentinel-2 images (10 m
     pixels) from the 2025 season: the median of the dates that match at 0.6
     or better.

On 21 open-air MLB parks (measured on their own in
src/data/orientationMeasurements.ts) NAIP lands within 5 degrees. The 22nd,
Great American Ball Park, scores 0.68 and is wrong, so a photo under 0.76
needs a look. Images are cached in tmp/milb-orientation/ (git-ignored).
"""
import json, math, os, re, statistics, sys, time, urllib.request
import numpy as np
from PIL import Image
from scipy.signal import fftconvolve

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, 'tmp', 'milb-orientation')
DATA = os.path.join(ROOT, 'src', 'data', 'milbOrientationMeasurements.ts')
EARTH_RADIUS = 6378137.0
HALF_M, M_PER_PX = 130.0, 0.5
SIZE_PX = int(2 * HALF_M / M_PER_PX)
REACH_M, SHIFT_M = 78, 15
BASE, SKIN_ARC, HOME_TO_MOUND, CIRCLE, MOUND = 27.43, 28.96, 18.44, 3.96, 2.74  # metres

SOURCES = {
    'naip': 'https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPPlus/ImageServer/exportImage'
            '?bbox={bbox}&bboxSR=3857&imageSR=3857&size={size},{size}&format=png&f=image',
    'usgs': 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/export'
            '?bbox={bbox}&bboxSR=3857&imageSR=3857&size={size},{size}&format=png&f=image',
}
PLANETARY = 'https://planetarycomputer.microsoft.com/api'
SENTINEL = (PLANETARY + '/data/v1/item/bbox/{bbox}/{size}x{size}.png?collection=sentinel-2-l2a&item=%s&assets=visual'
            '&asset_bidx=visual%%7C1%%2C2%%2C3&coord_crs=epsg:3857&dst_crs=epsg:3857&nodata=0&resampling=cubic')


def image(venue, source, template, lat, lon):
    os.makedirs(CACHE, exist_ok=True)
    path = os.path.join(CACHE, f'{venue}-{source}-{lat:.5f},{lon:.5f}.png')
    if not os.path.exists(path):
        x = math.radians(lon) * EARTH_RADIUS
        y = math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) * EARTH_RADIUS
        half = HALF_M / math.cos(math.radians(lat))
        bbox = ','.join(f'{v:.2f}' for v in (x - half, y - half, x + half, y + half))
        url = template.format(bbox=bbox, size=SIZE_PX)
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
    return np.asarray(Image.open(path).convert('RGB')).astype(float)


def infield(direction):
    """The template for one direction: values (zero mean) and weights."""
    reach = int(REACH_M / M_PER_PX)
    row, col = np.mgrid[-reach:reach + 1, -reach:reach + 1].astype(float)
    east, north = col * M_PER_PX, -row * M_PER_PX
    t = math.radians(direction)
    out = east * math.sin(t) + north * math.cos(t) + HOME_TO_MOUND  # home toward center field
    right = east * math.cos(t) - north * math.sin(t)  # toward the first-base side
    first, third = (right + out) / math.sqrt(2), (-right + out) / math.sqrt(2)  # along each foul line
    from_home, from_mound = np.hypot(right, out), np.hypot(right, out - HOME_TO_MOUND)
    grass = (first > 1.2) & (third > 1.2) & (first < BASE - 1.2) & (third < BASE - 1.2)
    for a, b in ((BASE, 0), (BASE, BASE), (0, BASE)):
        grass &= np.hypot(first - a, third - b) >= CIRCLE
    circles = (from_home < CIRCLE) | (from_mound < MOUND)
    skin = (first > -1) & (third > -1) & (from_mound < SKIN_ARC)
    outfield = (first > 1) & (third > 1) & (from_mound >= 30.5) & (from_home < 72)
    value, weight = np.zeros_like(east), np.zeros_like(east)
    for area, v, w in ((skin & ~grass | circles, 1, 1), (grass & ~circles, -1, 1), (outfield, -1, 0.5)):
        value[area], weight[area] = v, w
    value = np.where(weight > 0, value - (value * weight).sum() / weight.sum(), 0)
    return value, weight


def match(redness, direction):
    """Best normalized match over the allowed shifts."""
    value, weight = infield(direction)
    total = weight.sum()
    slide = lambda image, kernel: fftconvolve(image, kernel[::-1, ::-1], mode='valid')
    mean = slide(redness, weight) / total
    variance = np.maximum(slide(redness ** 2, weight) / total - mean ** 2, 1e-7)
    return float((slide(redness, value * weight) / np.sqrt(variance * total * (value ** 2 * weight).sum())).max())


def measure(pixels):
    r, g, b = pixels[..., 0], pixels[..., 1], pixels[..., 2]
    redness = (r - g) / (r + g + b + 30)
    c, half = SIZE_PX // 2, int((REACH_M + SHIFT_M) / M_PER_PX)
    redness = redness[c - half:c + half + 1, c - half:c + half + 1]
    coarse = max(range(0, 360, 10), key=lambda d: match(redness, d))
    scores = {d % 360: match(redness, d) for d in range(coarse - 9, coarse + 10)}
    best = max(scores, key=scores.get)
    return best, scores[best]


def satellite_dates(lat, lon):
    """One clear Sentinel-2 image per date, 2025 season."""
    query = {'collections': ['sentinel-2-l2a'], 'intersects': {'type': 'Point', 'coordinates': [lon, lat]},
             'datetime': '2025-04-15/2025-10-20', 'query': {'eo:cloud_cover': {'lt': 8}}, 'limit': 40}
    req = urllib.request.Request(f'{PLANETARY}/stac/v1/search', data=json.dumps(query).encode(),
                                 headers={'content-type': 'application/json'})
    with urllib.request.urlopen(req, timeout=60) as res:
        items = json.load(res)['features']
    return {item['properties']['datetime'][:10]: item['id'] for item in items}


def main():
    row = re.compile(r"'([a-z0-9-]+)': \{ orientation: (\d+),.*method: '(\w+)', mound: \[([-\d.]+), ([-\d.]+)\]")
    with open(DATA) as f:
        parks = [m.groups() for m in map(row.search, f) if m]
    wanted = sys.argv[1:]
    print('venue | recorded | measured (score)')
    for venue, recorded, method, lat, lon in parks:
        if wanted and venue not in wanted:
            continue
        at = (float(lat), float(lon))
        if method == 'photo':
            fits = {s: measure(image(venue, s, template, *at)) for s, template in SOURCES.items()}
        else:
            fits = {date: measure(image(venue, date, SENTINEL % item, *at))
                    for date, item in satellite_dates(*at).items()}
            good = [direction for direction, score in fits.values() if score >= 0.6]
            print(f'{venue} | {recorded} | median {statistics.median(good):.0f} of {len(good)} dates')
        shown = ' | '.join(f'{name} {direction} ({score:.2f})' for name, (direction, score) in fits.items())
        print(f'{venue} | {recorded} | {shown}', flush=True)


if __name__ == '__main__':
    main()
