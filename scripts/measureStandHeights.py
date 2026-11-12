"""
Measure ballpark stand heights from USGS 3DEP airborne lidar (public domain)
for the stand profiles in src/data/stadiumStructures.ts.

Requirements: Python 3.11+ with numpy, scipy, laspy[lazrs], pyproj, pillow,
and Node (npx tsx) for scripts/lidar/standSections.ts.

  python scripts/measureStandHeights.py fetch <park>    # lidar around home plate -> tmp/lidar/<park>.npz
  python scripts/measureStandHeights.py runs <park>     # seating runs under each section (to set the tier bands)
  python scripts/measureStandHeights.py measure <park>  # per-section and per-tier values -> tmp/lidar/<park>-measured.json
                                                        # and a check picture tmp/lidar/<park>-check.png

Method (all heights in metres above the field until the report, which is in feet):
  1. Field level: the most common height within 35 m of home plate (the
     field surface; scans differ in which points they class as ground).
  2. For each section, a cut from home plate along its bearing finds the
     seating runs (points whose local slope is 5-50 degrees, rising away from
     the field). The section's tier is the run whose front sits in that
     tier's height band (PARKS below, set from the `runs` listing and checked
     on the picture).
  3. A second cut along the section's stand direction (straight back through
     its rows), through the middle of that run, gives:
       - rake: slope of the run's lower envelope (the treads);
       - front row: that line at the middle of the first tread;
       - the deck above: where structure starts over the seats (the lip, as a
         row) and the bottom of its front face (soffit), when the scan sees
         that face;
       - what stands behind: of the scan's top surface behind the lip (or the
         back row), the point that rises highest as seen from the middle
         uncovered row (the one that cuts off the sun first);
       - the stand's roof line (the top of its structure), whose median over
         the park is the far rim, and the distance to what rises highest
         looking the other way across the field (the crossing).
"""
import io, json, math, os, subprocess, sys, urllib.request, datetime
import numpy as np
from scipy import ndimage

FT = 0.3048
EYE = 3.5 * FT
HEAD_SETBACK = 1.25 * FT
DEFAULT_TREAD = 2.75 * FT
EPT = 'https://s3-us-west-2.amazonaws.com/usgs-lidar-public'
HALF = 230.0  # metres either side of home plate

# Per park: the scan, which classes are noise in it, and the height band
# (metres above the field) of each visible tier's front row on the cut from
# home plate. Tiers left out are hidden from the air (under a deck, enclosed).
PARKS = {
    'yankees': {
        'scan': {'ept': 'NY_NewYorkCity'}, 'name': 'USGS 3DEP NY_NewYorkCity (New York City 2014)',
        # Classes 17 and 18 hold the flight-line overlap here (18 is ground), not noise.
        'noise': [7],
        'tiers': {
            # Legends rows start at the field (0-1 ft), the 100s about 6 ft up;
            # the dugouts' floors are 4 ft down.
            'legends': (-0.6, 1.0), 'field': (1.0, 5, 'far'), 'main': (6, 13),
            'terrace': (18, 23.5), 'grandstand': (26, 33, 'near', 15),
            # Bleachers: the club's chart (not pinned to a photo here) draws
            # them bunched toward the foul lines, so the cuts along their
            # bearings land on other stands; not measured.
        },
        'skip': {'427': 'its cut lands just outside the stadium wall (plan view)'},
    },
    'mets': {
        'scan': {'ept': 'NY_NewYorkCity'}, 'name': 'USGS 3DEP NY_NewYorkCity (New York City 2014)',
        'noise': [7],
        'tiers': {
            'fieldBox': (-1.5, 1.0), 'field': (1.0, 4, 'far'), 'sterling': (5, 11), 'excelsior': (12, 17),
            'fourHundred': (18, 23, 'near', 15), 'promenade': (24, 29, 'near', 15),
            'leftOutfield': (0.5, 4), 'rightOutfield': (1.5, 8),
        },
        # The light towers rise above the roof (129 ft) to 182-192 ft; the
        # right-field scoreboard's top (142 ft) stays.
        'lightTowersAbove': 47,
    },
    'redsox': {
        'scan': {'ept': 'MA_CentralEastern_1_2021'}, 'name': 'USGS 3DEP MA_CentralEastern_2021 (Massachusetts 2021)',
        'noise': [7, 18],
        # One slope from the field: Field Boxes, a walkway, Loge Boxes, then
        # the Grandstand under its roof (hidden); the pavilion level sits on
        # that roof. The pavilion clubs and suites are hidden too.
        'tiers': {
            'fieldBox': (-1.5, 0.5), 'logeBox': (0.5, 4, 'far'), 'rightFieldBox': (-0.5, 3),
            'monster': (9, 13),  # only a check of the sourced 37 ft wall
            'roofBox': (13, 19), 'pavilionBox': (13, 19), 'auraPavilion': (13, 19), 'pavilionReserved': (13, 19),
            # Bleachers: the club's chart (not pinned to a photo here) puts
            # them off their stand; their cuts land behind it. Not measured.
        },
        'skip': {'B126': 'its chart position puts its cut outside the park (plan view)'},
        # The eight lattice light towers stand on the roof (82 ft) up to 121-143 ft.
        'lightTowersAbove': 32,
    },
    'cubs': {
        'scan': {'ept': 'USGS_LPC_IL_4County_Cook_2017_LAS_2019'}, 'name': 'USGS 3DEP IL_4County_Cook_2017 (Cook County 2017)',
        'noise': [7, 18],
        # The lower bowl (club boxes, front boxes, the 100s) was rebuilt in
        # 2017-18, after this scan, and is not measured; the Terrace and the
        # 400s are under the upper deck and its roof.
        'tiers': {'upperBox': (12, 17, 'near', 15), 'bleachers': (2, 8, 'near', 15)},
        'skip': {'515': 'its cut crosses the bleachers\' end structure (landings, a platform, a lattice board), not its rows',
                 '536': 'its cut crosses the bleachers\' end platforms, not its rows'},
    },
    'giants': {
        'scan': {'ept': 'CA_SanFrancisco_1_B23'}, 'name': 'USGS 3DEP CA_SanFrancisco_B23 (San Francisco 2023)',
        'noise': [7, 18],
        # The View level is rows A-D, a cross-aisle, then rows 1-18: the band
        # picks rows 1-18. The suites are enclosed under it.
        'tiers': {'lower': (-1, 4), 'club': (7, 12), 'view': (22, 27, 'near', 15), 'bleachers': (1, 4), 'arcade': (3, 7)},
        'skip': {'122': 'its cut runs down a vomitory ramp, which drags the treads\' line below the seats'},
    },
    'phillies': {
        # Not in the AWS copy: one tile from USGS (rockyweb), 163 MB, downloaded to tmp/lidar/raw/.
        'scan': {'laz': ['tmp/lidar/raw/USGS_LPC_PA_17County_D24_18SVK485417.laz']},
        'url': 'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/PA_17County_D24/PA_17Co_5_D24/LAZ/USGS_LPC_PA_17County_D24_18SVK485417.laz',
        'name': 'USGS 3DEP PA_17County_D24 (Pennsylvania 2024-25)',
        'noise': [7, 18],
        # Behind home one slope carries the dugout boxes and the Diamond Club,
        # then the 100s (119-128) start behind a walkway. The suites are
        # enclosed; the wheelchair platforms are single rows of other tiers.
        'tiers': {
            'dugoutBox': (-1.5, 1.0), 'diamond': (-1.5, 1.0), 'homePlate': (2.5, 6, 'far'),
            'field': (-1.5, 1.5), 'fieldCoverUnsourced': (-1.5, 1.5),
            'rightField': (1.5, 5), 'rightField200': (10, 16, 'near', 15), 'rightField300': (17, 24, 'near', 15),
            'leftField': (1, 4), 'leftField200': (8, 13, 'near', 15),
            'twoHundred': (10, 16, 'near', 15), 'threeHundred': (18, 23, 'near', 15), 'terrace': (24, 30, 'near', 15),
            'bleachers': (8, 14),
        },
        # The light towers rise above the roof (133 ft) to 186-195 ft, and the
        # left-field scoreboard is a board 166-195 ft up on one pylon.
        'lightTowersAbove': 43,
    },
    'dodgers': {
        'scan': {'ept': 'CA_LosAngeles_1_B23'}, 'name': 'USGS 3DEP CA_LosAngeles_B23 (LA County 2023)',
        'noise': [7, 18],
        # Club level and suites are under the decks; the Reserve rows behind
        # the Lower Reserve show two rows before their roof.
        'tiers': {
            'dugoutClub': (-2, 3), 'baselineClub': (-2, 3), 'field': (-2, 3, 'far'),
            'loge': (4, 11), 'infieldReserve': (12, 21), 'infieldReserveOpen': (12, 21),
            'lowerReserve': (12, 21), 'topDeck': (24, 34), 'pavilion': (0, 5),
        },
    },
}


def load_sections(park):
    out = subprocess.run(['npx', 'tsx', 'scripts/lidar/standSections.ts', park], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


# ---------------------------------------------------------------- fetch

def home_of(park):
    """Home plate (Web Mercator metres and lat/lon) from the orientation measurement."""
    out = subprocess.run(['npx', 'tsx', '-e', f"""
      import {{ ORIENTATION_MEASUREMENTS }} from './src/data/orientationMeasurements';
      const m = ORIENTATION_MEASUREMENTS.find((x) => x.stadiumId === '{park}')!;
      const R = 6378137, lat0 = m.imageCenter.latitude;
      const x0 = (m.imageCenter.longitude * Math.PI / 180) * R;
      const y0 = R * Math.log(Math.tan(Math.PI / 4 + (lat0 * Math.PI / 180) / 2));
      const half = m.imageHalfWidthMeters / Math.cos(lat0 * Math.PI / 180);
      const px = (2 * half) / m.imageSizePx;
      const x = x0 - half + m.homeCenterPx[0] * px, y = y0 + half - m.homeCenterPx[1] * px;
      console.log(JSON.stringify({{ x, y, lon: (x / R) * 180 / Math.PI, lat: (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * 180 / Math.PI }}));
    """], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def get(url):
    for attempt in range(4):
        try:
            return urllib.request.urlopen(url, timeout=120).read()
        except Exception:
            if attempt == 3:
                raise


def fetch(park):
    import laspy, concurrent.futures
    home = home_of(park)
    k = 1 / math.cos(math.radians(home['lat']))  # Web Mercator metres per ground metre
    scan = PARKS[park]['scan']
    cols = []
    if 'ept' in scan:
        project = scan['ept']
        xmin, xmax, ymin, ymax = home['x'] - HALF * k, home['x'] + HALF * k, home['y'] - HALF * k, home['y'] + HALF * k
        meta = json.loads(get(f'{EPT}/{project}/ept.json'))
        assert meta['srs'].get('horizontal') == '3857', meta['srs']
        b = meta['bounds']
        hierarchy = json.loads(get(f'{EPT}/{project}/ept-hierarchy/0-0-0-0.json'))
        keys, stack = [], ['0-0-0-0']
        while stack:
            key = stack.pop()
            if key not in hierarchy:
                continue
            if hierarchy[key] == -1:
                hierarchy.update(json.loads(get(f'{EPT}/{project}/ept-hierarchy/{key}.json')))
            d, x, y, z = map(int, key.split('-'))
            size = (b[3] - b[0]) / 2 ** d
            x0, y0 = b[0] + x * size, b[1] + y * size
            if x0 > xmax or x0 + size < xmin or y0 > ymax or y0 + size < ymin:
                continue
            if hierarchy[key] > 0:
                keys.append(key)
            stack += [f'{d + 1}-{2 * x + i}-{2 * y + j}-{2 * z + l}' for i in (0, 1) for j in (0, 1) for l in (0, 1)]

        def read(key):
            las = laspy.read(io.BytesIO(get(f'{EPT}/{project}/ept-data/{key}.laz')))
            x, y = np.asarray(las.x), np.asarray(las.y)
            m = (x >= xmin) & (x <= xmax) & (y >= ymin) & (y <= ymax)
            return las, m, (x[m] - home['x']) / k, (y[m] - home['y']) / k

        with concurrent.futures.ThreadPoolExecutor(16) as pool:
            parts = list(pool.map(read, keys))
    else:
        from pyproj import Transformer
        parts = []
        for path in scan['laz']:
            las = laspy.read(path)
            crs = las.header.parse_crs()
            horiz = crs.sub_crs_list[0] if crs.is_compound else crs
            for c in [horiz] + ([crs.sub_crs_list[1]] if crs.is_compound else []):
                assert c.axis_info[0].unit_name in ('metre', 'meter'), c.axis_info
            hx, hy = Transformer.from_crs('EPSG:4326', horiz, always_xy=True).transform(home['lon'], home['lat'])
            x, y = np.asarray(las.x), np.asarray(las.y)
            m = (np.abs(x - hx) <= HALF * 1.01) & (np.abs(y - hy) <= HALF * 1.01)
            mx, my = Transformer.from_crs(horiz, 'EPSG:3857', always_xy=True).transform(x[m], y[m])
            parts.append((las, m, (mx - home['x']) / k, (my - home['y']) / k))
    for las, m, east, north in parts:
        inside = (np.abs(east) <= HALF) & (np.abs(north) <= HALF)
        sel = np.flatnonzero(m)[inside]
        cols.append({'east': east[inside].astype(np.float32), 'north': north[inside].astype(np.float32),
                     'z': np.asarray(las.z)[sel], 'cls': np.asarray(las.classification)[sel],
                     'gps': np.asarray(las.gps_time)[sel]})
    data = {c: np.concatenate([p[c] for p in cols]) for c in cols[0]}
    os.makedirs('tmp/lidar', exist_ok=True)
    np.savez_compressed(f'tmp/lidar/{park}.npz', **data)
    print(f'{park}: {len(data["z"]):,} points, flown {flown(data["gps"])}')


def flown(gps):
    """Dates from adjusted-standard GPS time (seconds since 1980-01-06, minus 1e9)."""
    day = lambda s: (datetime.datetime(1980, 1, 6) + datetime.timedelta(seconds=float(s) + 1e9)).date()
    return f'{day(np.percentile(gps, 0.5))} to {day(np.percentile(gps, 99.5))}'


# ---------------------------------------------------------------- geometry

def load_points(park):
    d = np.load(f'tmp/lidar/{park}.npz')
    keep = ~np.isin(d['cls'], PARKS[park]['noise'])
    E, N, Z = d['east'][keep].astype(float), d['north'][keep].astype(float), d['z'][keep].astype(float)
    near = np.hypot(E, N) < 35
    h, edges = np.histogram(Z[near], bins=np.arange(Z[near].min(), Z[near].max() + 0.05, 0.05))
    mode = edges[np.argmax(h)] + 0.025
    field = float(np.median(Z[near & (np.abs(Z - mode) < 0.15)]))
    Z = Z - field
    above = PARKS[park].get('lightTowersAbove')
    if above is not None:
        # Light towers and boards up on pylons: compact clusters (up to
        # 700 m2 in plan, 2 m cells) standing above the park's roof line;
        # what stands inside them more than 2 m over their lowest fifth is
        # not a wall (light passes under it).
        m = (Z > above) & (np.hypot(E, N) < 180)
        g = np.zeros((180, 180), bool)
        gi = lambda v: np.clip(((v + 180) / 2).astype(int), 0, 179)
        g[gi(N[m]), gi(E[m])] = True
        lab, n = ndimage.label(ndimage.binary_dilation(g))
        sizes = ndimage.sum(np.ones_like(lab), lab, range(n + 1))
        keep = np.ones(len(Z), bool)
        for k in range(1, n + 1):
            if sizes[k] * 4 > 700:
                continue
            inside = (lab[gi(N), gi(E)] == k) & (np.hypot(E, N) < 180)
            keep &= ~(inside & (Z > np.percentile(Z[inside], 20) + 2))
        E, N, Z = E[keep], N[keep], Z[keep]
    return E, N, Z, field, flown(d['gps'])


def cut(P, x0, y0, bearing, s0, s1, half=2.0):
    """Points within `half` metres of the line from (x0, y0) along `bearing`:
    distance along it, offset across it, height."""
    E, N, Z = P
    a = math.radians(bearing)
    ux, uy = math.sin(a), math.cos(a)
    de, dn = E - x0, N - y0
    along = de * ux + dn * uy
    m = (along > s0) & (along < s1)
    across = -de[m] * uy + dn[m] * ux
    m2 = np.abs(across) < half
    return along[m][m2], across[m2], Z[m][m2]


CELL = 0.25
# 1.75 m: longer than a row (so the steps average out to the rake), shorter
# than a walkway between two stands (so a walkway reads as flat and splits them).
WINDOW = 7


def runs_in(s, z):
    """Seating runs in a cut: groups of points whose local slope (from the
    second moments over a 1.75 m window) is 5-50 degrees rising with s.
    Each run gets a line fitted to its lower envelope (the treads)."""
    if len(s) < 20:
        return []
    i = ((s - s.min()) / CELL).astype(int)
    j = ((z - z.min()) / CELL).astype(int)
    shape = (i.max() + 1, j.max() + 1)
    sums = []
    for v in (np.ones_like(s), s, z, s * s, z * z, s * z):
        g = np.zeros(shape)
        np.add.at(g, (i, j), v)
        sums.append(ndimage.uniform_filter(g, WINDOW, mode='constant'))
    n, S, Zs, SS, ZZ, SZ = sums
    with np.errstate(invalid='ignore', divide='ignore'):
        ms, mz = S / n, Zs / n
        css, czz, csz = SS / n - ms * ms, ZZ / n - mz * mz, SZ / n - ms * mz
        theta = np.degrees(0.5 * np.arctan2(2 * csz, css - czz))
        tr, det = css + czz, css * czz - csz * csz
        l1 = tr / 2 + np.sqrt(np.maximum(tr * tr / 4 - det, 0))
        l2 = tr / 2 - np.sqrt(np.maximum(tr * tr / 4 - det, 0))
        lin = 1 - l2 / l1
    count = n * WINDOW * WINDOW
    good = (count > 6) & (theta > 5) & (theta < 50) & (lin > 0.6)
    keep = good[i, j]
    grid = np.zeros(shape, bool)
    grid[i[keep], j[keep]] = True
    lab, nlab = ndimage.label(ndimage.binary_dilation(grid, np.ones((3, 3))), np.ones((3, 3)))
    labels = np.where(keep, lab[i, j], 0)
    runs = []
    for k in range(1, nlab + 1):
        m = labels == k
        if m.sum() < 12:
            continue
        for ps, pz in split_at_steps(s[m], z[m]):
            r = fit_run(ps, pz)
            if r and r['s1'] - r['s0'] >= 2.5 and r['slope'] > math.tan(math.radians(5)):
                runs.append(r)
    runs.sort(key=lambda r: r['z0'])
    return runs


def split_at_steps(ss, zz):
    """Split a run where its treads step up more than 0.9 m within a metre
    (no row of seats rises that much over the one in front: it is another
    stand, or a sunken dugout in front of the seats)."""
    b = np.floor(ss / 0.5)
    ub = np.unique(b)
    lo = np.array([np.percentile(zz[b == u], 10) for u in ub])
    cuts = [k + 1 for k in range(len(ub) - 1)
            if ub[k + 1] - ub[k] <= 2 and lo[k + 1] - lo[k] > 0.9 and (k + 2 >= len(ub) or lo[k + 2] - lo[k] > 0.9)]
    edges = [ub[0]] + [ub[k] for k in cuts] + [ub[-1] + 1]
    return [(ss[(b >= e0) & (b < e1)], zz[(b >= e0) & (b < e1)]) for e0, e1 in zip(edges, edges[1:])]


def fit_run(ss, zz):
    b = np.floor(ss / 0.5)
    lo = np.array([[ss[b == u].mean(), np.percentile(zz[b == u], 10)] for u in np.unique(b)])
    if len(lo) < 3:
        return None
    slope, c = np.polyfit(lo[:, 0], lo[:, 1], 1)
    resid = lo[:, 1] - (c + slope * lo[:, 0])
    ok = np.abs(resid) < 0.4
    if ok.sum() >= 3:
        slope, c = np.polyfit(lo[ok, 0], lo[ok, 1], 1)
    s0, s1 = float(np.percentile(ss, 1)), float(np.percentile(ss, 99))
    at = lambda v, c=c, slope=slope: float(c + slope * v)
    return {'s0': s0, 's1': s1, 'slope': float(slope), 'c': float(c), 'z0': at(s0), 'z1': at(s1), 'at': at, 'ps': ss, 'pz': zz}


def top_profile(s, across, z, s_lo, s_hi, half=2.0):
    """Height of structure per 0.5 m along the cut: the highest point in each
    1 m strip across the cut, then the second lowest of the four strips (a
    structure counts only where it fills three of them: a pole or a net does
    not). A patch narrower than 4.5 m along the cut standing over 6 m above
    the structure around it counts only if it is solid, like a wall or a
    scoreboard: in three strips its face hangs down to that structure with
    no gap over 6 m, and under 15% of its points lie on the surface beneath
    it. Otherwise (a lamp bank on its pole, a lattice light tower the
    scan sees through, a tree crown) it is dropped to the level around it."""
    nb, ns = int(math.ceil((s_hi - s_lo) / 0.5)), int(round(2 * half))
    m = (s >= s_lo) & (s < s_hi) & (np.abs(across) < half)
    bins = ((s[m] - s_lo) / 0.5).astype(int)
    strips = np.clip(((across[m] + half) / 1.0).astype(int), 0, ns - 1)
    zz = z[m]
    top = np.full((nb, ns), -np.inf)
    np.maximum.at(top, (bins, strips), zz)
    # Bottom of the column hanging from each cell's top with no gap over 6 m.
    cell = bins * ns + strips
    order = np.lexsort((zz, cell))
    cs, zs = cell[order], zz[order]
    reach = np.full(nb * ns, np.inf)
    if len(zs):
        gap = np.r_[np.diff(zs) > 6.0, False] & np.r_[cs[1:] == cs[:-1], False]
        last_gap = np.full(nb * ns, -1)
        np.maximum.at(last_gap, cs[gap], np.flatnonzero(gap))
        first = np.searchsorted(cs, np.arange(nb * ns))
        has = np.isfinite(top.ravel())
        idx = np.where(last_gap >= 0, last_gap + 1, first)
        reach[has] = zs[np.minimum(idx[has], len(zs) - 1)]
    reach = reach.reshape(nb, ns)
    prof = np.sort(top, axis=1)[:, 1]
    fin = np.isfinite(prof)
    if fin.sum() >= 2:
        # The profile without anything narrower than 4.5 m along the cut.
        opened = ndimage.grey_opening(np.interp(np.arange(nb), np.flatnonzero(fin), prof[fin]), size=9)
        raised = fin & (prof > opened + 6)
        i = 0
        while i < nb:
            if not raised[i]:
                i += 1
                continue
            j = i
            while j + 1 < nb and raised[j + 1]:
                j += 1
            level = opened[i:j + 1, None]
            hangs = ((top[i:j + 1] > level + 6) & (reach[i:j + 1] <= level + 6)).any(axis=0).sum()
            b_ = np.clip(bins, 0, nb - 1)
            inpatch = (bins >= i) & (bins <= j) & (top[b_, strips] > opened[b_] + 6)
            beneath = inpatch & (np.abs(zz - opened[b_]) < 0.5)
            see_through = inpatch.sum() and beneath.sum() >= max(5, 0.15 * inpatch.sum())
            if hangs < 3 or see_through:
                prof[i:j + 1] = opened[i:j + 1]
            i = j + 1
    return s_lo + 0.25 + 0.5 * np.arange(nb), prof


def governing(ps, pz, hs, hz):
    """The profile point that rises highest as seen from a head at (hs, hz)."""
    m = np.isfinite(pz) & (ps > hs + 0.5)
    if not m.any():
        return None
    ang = np.arctan2(pz[m] - hz, ps[m] - hs)
    k = int(np.argmax(ang))
    return float(ps[m][k]), float(pz[m][k]), float(math.degrees(ang[k]))


# ---------------------------------------------------------------- measure

def tier_run(runs, band):
    """The run whose front sits in the band (lo, hi[, 'near' or 'far'[, least
    rake in degrees, default 5]]); of several, the nearest home plate, or for
    'far' the farthest one in front of the first run above the band (the next
    deck up)."""
    lo, hi = band[:2]
    min_rake = band[3] if len(band) > 3 else 5
    cands = [r for r in runs if lo <= r['z0'] <= hi and r['s0'] < 170 and r['slope'] > math.tan(math.radians(min_rake))]
    if not cands:
        return None
    if band[2:3] == ('far',):
        above = [r['s0'] for r in runs if r['z0'] > hi]
        if above:
            cands = [r for r in cands if r['s0'] < min(above)] or cands
        return max(cands, key=lambda r: r['s0'])
    return min(cands, key=lambda r: r['s0'])


def measure_section(P, sec, band):
    """One section: find its tier's run on the cut from home plate, then
    measure it on a cut along the stand direction through that run."""
    st, rows = sec['stand'], sec['stand']['rows']
    tread = (st.get('treadFt') or 2.75) * FT
    a = math.radians(sec['bearing'])
    s, across, z = cut(P, 0, 0, sec['bearing'], 0, 220)
    radial = tier_run(runs_in(s, z), band)
    if not radial:
        return {'id': sec['id'], 'tier': sec['tier'], 'found': False, 'why': 'no run in band from home'}
    sm = (radial['s0'] + radial['s1']) / 2
    ax, ay = sm * math.sin(a), sm * math.cos(a)
    s, across, z = cut(P, ax, ay, sec['standCompass'], -60, 90)
    all_runs = runs_in(s, z)
    run = tier_run([r for r in all_runs if -35 < r['s0'] < 30], band)
    if not run:
        return {'id': sec['id'], 'tier': sec['tier'], 'found': False, 'why': 'no run in band on the stand cut', 'anchor': [ax, ay, radial['at'](sm)]}
    model_cover = (st.get('overhang') or {}).get('coveredFromRow')
    open_rows = rows if model_cover is None else model_cover - 1
    depth = run['s1'] - run['s0']
    if depth > 1.6 * max(open_rows, 1) * tread + 2:
        return {'id': sec['id'], 'tier': sec['tier'], 'found': False, 'anchor': [ax, ay, run['at'](0)],
                'why': f'run {depth / FT:.0f} ft deep, too deep for {open_rows} open rows (another stand joined to it)'}
    slope = run['slope']
    front = run['at'](run['s0'] + tread / 2)
    rise = tread * slope
    back = run['s0'] + rows * tread
    # A deck over the seats: from the first 0.5 m bin where structure 2.2 m
    # or more above the treads carries on for 3 m (a net or a pole does not).
    over = (s > run['s0'] - 1) & (s < back + 2) & (z > run['c'] + slope * s + 2.2)
    lip = None
    if over.any():
        b0 = run['s0'] - 1
        flag = np.zeros(int((back + 2 - b0) / 0.5) + 7, bool)
        flag[((s[over] - b0) / 0.5).astype(int)] = True
        for k in range(len(flag) - 6):
            if flag[k] and flag[k:k + 6].sum() >= 5:
                lip = b0 + k * 0.5
                break
    lip_row = None if lip is None else max(1, round((lip - run['s0']) / tread) + 1)
    if lip_row is not None and lip_row > rows:
        lip, lip_row = None, None
    soffit = lip_low = None
    if lip is not None:
        # The bottom of the deck's front face, when the scan sees that face.
        # A face hangs from the deck: climb from the lowest point with no gap
        # over 2 m; it is seen if that climb covers at least 1.5 m (railings
        # and seat backs alone, or a roof far above, do not).
        zz = np.sort(z[over & (s >= lip - 0.5) & (s <= lip + 1.0)])
        if len(zz) >= 4:
            lo_ = float(np.percentile(zz, 5))
            lip_low = lo_
            zz = zz[zz >= lo_]
            gaps = np.flatnonzero(np.diff(zz) > 2.0)
            face_top = zz[gaps[0]] if len(gaps) else zz[-1]
            if face_top - lo_ >= 1.5:
                soffit = lo_
    # The front row of a deck of seats starting at that edge, if any.
    above = [r for r in all_runs if lip is not None and lip - 1.5 <= r['s0'] <= lip + 2
             and r['z0'] > run['c'] + slope * r['s0'] + 2.2 and r['slope'] >= math.tan(math.radians(15))]
    above_front = min((r['z0'] for r in above), default=None)
    cover_agrees = (lip_row is None and model_cover is None) or (
        lip_row is not None and model_cover is not None and abs(lip_row - model_cover) <= 2)
    # What stands behind, seen from the middle uncovered row (or row 1).
    k = max(0, (open_rows - 1) // 2)
    hs, hz = run['s0'] + k * tread + HEAD_SETBACK, front + k * rise + EYE
    ps, pz = top_profile(s, across, z, lip if lip is not None else back, back + 60)
    g = governing(ps, pz, hs, hz)
    # The stand's roof line: the top of the structure from its front row to
    # 30 m behind its back row (for the park's far rim).
    rs_, rz_ = top_profile(s, across, z, run['s0'], back + 30)
    roof = float(np.max(rz_[np.isfinite(rz_)])) if np.isfinite(rz_).any() else None
    # The far rim: from that head, the other way across the field.
    sc = math.radians(sec['standCompass'])
    s2, across2, z2 = cut(P, ax + hs * math.sin(sc), ay + hs * math.cos(sc), (sec['standCompass'] + 180) % 360, 0, 330)
    ps2, pz2 = top_profile(s2, across2, z2, 60, 330)
    rim = governing(ps2, pz2, 0, hz)
    ft = lambda v: None if v is None else v / FT
    return {
        'id': sec['id'], 'tier': sec['tier'], 'found': True, 'rows': rows, 'anchor': [ax, ay, run['at'](0)],
        'frontFt': front / FT, 'rakeDeg': math.degrees(math.atan(slope)), 'visibleDepthFt': depth / FT,
        'lipRow': lip_row, 'modelCoveredFrom': model_cover, 'coverAgrees': cover_agrees,
        'soffitFt': ft(soffit) if cover_agrees else None, 'lipSoffitFt': ft(soffit), 'lipLowFt': ft(lip_low),
        'aboveFrontFt': ft(above_front),
        'backFt': None if g is None else g[1] / FT, 'backSetbackFt': None if g is None else (g[0] - back) / FT,
        'rimFt': None if rim is None else rim[1] / FT, 'rimDistFt': None if rim is None else rim[0] / FT,
        'roofFt': ft(roof),
        'cut': {'s0': run['s0'], 's1': run['s1'], 'slope': slope, 'c': run['c'], 'lip': lip, 'back': back,
                'gov': g, 'head': [hs, hz]},
    }


def med(vals):
    v = [x for x in vals if x is not None]
    return float(np.median(v)) if v else None


def measure(park):
    E, N, Z, field, dates = load_points(park)
    P = (E, N, Z)
    data = load_sections(park)
    bands = PARKS[park]['tiers']
    skip = PARKS[park].get('skip', {})
    results = [{'id': sec['id'], 'tier': sec['tier'], 'found': False, 'why': 'skipped: ' + skip[sec['id']]} if sec['id'] in skip
               else measure_section(P, sec, bands[sec['tier']]) for sec in data['sections'] if sec['tier'] in bands]
    tiers = {}
    for key in bands:
        rs = [r for r in results if r['tier'] == key and r['found']]
        n_all = sum(1 for r in results if r['tier'] == key)
        t = {'sections': n_all, 'found': len(rs)}
        t['coverDisagrees'] = sorted({f"{r['id']}: lip row {r['lipRow']}, sourced {r['modelCoveredFrom']}" for r in rs if not r['coverAgrees']})
        t['notFound'] = [f"{r['id']}: {r.get('why')}" for r in results if r['tier'] == key and not r['found']]
        for f in ('frontFt', 'rakeDeg', 'lipRow', 'soffitFt', 'lipSoffitFt', 'lipLowFt', 'backFt', 'backSetbackFt'):
            vals = [r[f] for r in rs if r[f] is not None]
            t[f] = None if not vals else {'median': float(np.median(vals)), 'min': float(min(vals)), 'max': float(max(vals)), 'n': len(vals)}
        tiers[key] = t
    # The far rim (the engine's "upper deck or roof line"): the median of each
    # measured section's own roof line; the crossing: the median distance from
    # a section to what rises highest across the field from it.
    found = [r for r in results if r['found']]
    rim = {'heightFt': med([r['roofFt'] for r in found]), 'distanceFt': med([r['rimDistFt'] for r in found]),
           'acrossFt': med([r['rimFt'] for r in found])}
    out = {'park': park, 'scan': PARKS[park]['name'], 'flown': dates, 'fieldZ': field, 'rim': rim, 'tiers': tiers,
           'sections': [{k: v for k, v in r.items() if k != 'cut'} for r in results]}
    json.dump(out, open(f'tmp/lidar/{park}-measured.json', 'w'), indent=1)
    print(f"{park}: {PARKS[park]['name']}, flown {dates}; field at {field:.2f} m")
    print(f"far rim (roof line) {rim['heightFt']:.0f} ft; crossing {rim['distanceFt']:.0f} ft; highest-rising across the field {rim['acrossFt']:.0f} ft (medians over sections)")
    for key, t in tiers.items():
        cur = data['tiers'][key]['stand']
        def show(f, unit=''):
            v = t[f]
            return '-' if v is None else f"{v['median']:.1f}{unit} [{v['min']:.1f}-{v['max']:.1f}, n{v['n']}]"
        print(f"{key}: {t['found']}/{t['sections']} found")
        print(f"   front {show('frontFt')} (now {cur['frontRowHeightFt']})  rake {show('rakeDeg')} (now {cur['rakeDeg']})")
        oh = cur.get('overhang') or {}
        print(f"   lip row {show('lipRow')} (sourced {oh.get('coveredFromRow')})  soffit {show('soffitFt')} (now {oh.get('soffitHeightFt')}); at the lidar's lip: face bottom {show('lipSoffitFt')}, lowest structure {show('lipLowFt')}")
        if t['coverDisagrees']:
            print(f"   cover disagrees: {len(t['coverDisagrees'])}: " + '; '.join(t['coverDisagrees'][:6]))
        if t['notFound']:
            print(f"   not found: " + '; '.join(t['notFound'][:4]))
        print(f"   back {show('backFt')} setback {show('backSetbackFt')} (now {cur['backHeightFt']} / {cur.get('backSetbackFt', 0)})")
    draw(park, P, data, results)


def draw(park, P, data, results):
    """Check picture: per tier, up to five sections' stand cuts with the
    measured stand drawn over the points (green treads, orange deck edge,
    red: the governing point behind, seen from the blue head)."""
    from PIL import Image, ImageDraw
    secs = {s['id']: s for s in data['sections']}
    S0, S1, Z0, Z1, PX = -45, 75, -3, 60, 6
    W, H = int((S1 - S0) * PX), int((Z1 - Z0) * PX) + 16
    panels = []
    for key in PARKS[park]['tiers']:
        rs = [r for r in results if r['tier'] == key and r['found']]
        for r in rs[:: max(1, len(rs) // 5)][:5]:
            sec, c = secs[r['id']], r['cut']
            ax, ay, az = r['anchor']
            s, across, z = cut(P, ax, ay, sec['standCompass'], S0, S1)
            im = Image.new('RGB', (W, H), 'white')
            dr = ImageDraw.Draw(im)
            X = lambda v: (v - S0) * PX
            Y = lambda v: H - 16 - (v - Z0) * PX
            for zz in range(0, Z1, 10):
                dr.line([0, Y(zz), W, Y(zz)], fill=(228, 228, 228))
                dr.text((2, Y(zz) - 11), f'{zz} m', fill=(150, 150, 150))
            for a_, z_ in zip(s, z):
                dr.point((X(a_), Y(z_)), fill=(90, 90, 90))
            dr.line([X(c['s0']), Y(c['c'] + c['slope'] * c['s0']), X(c['back']), Y(c['c'] + c['slope'] * c['back'])], fill=(0, 170, 0), width=2)
            if c['lip'] is not None and r['lipSoffitFt'] is not None:
                dr.line([X(c['lip']), Y(r['lipSoffitFt'] * FT), X(c['back']), Y(r['lipSoffitFt'] * FT)], fill=(255, 140, 0), width=2)
            elif c['lip'] is not None:
                dr.line([X(c['lip']), 0, X(c['lip']), H], fill=(255, 190, 120))
            hs, hz = c['head']
            dr.ellipse([X(hs) - 3, Y(hz) - 3, X(hs) + 3, Y(hz) + 3], fill=(0, 0, 255))
            if c['gov']:
                gs, gz, _ = c['gov']
                dr.line([X(hs), Y(hz), X(gs), Y(gz)], fill=(220, 0, 0))
                dr.ellipse([X(gs) - 4, Y(gz) - 4, X(gs) + 4, Y(gz) + 4], outline=(220, 0, 0), width=2)
            f = lambda v, d=0: '-' if v is None else f'{v:.{d}f}'
            dr.text((4, H - 14), f"{park} {r['id']} ({key}) faces {sec['standCompass']:.0f}: front {f(r['frontFt'])} ft, rake {f(r['rakeDeg'])}, "
                    f"lip row {f(r['lipRow'])} (sourced {f(r['modelCoveredFrom'])}), soffit {f(r['lipSoffitFt'])}, back {f(r['backFt'])} ft at {f(r['backSetbackFt'])} ft", fill=(0, 0, 0))
            panels.append(im)
    cols = 2
    sheet = Image.new('RGB', (W * cols, H * ((len(panels) + cols - 1) // cols)), 'white')
    for i, p in enumerate(panels):
        sheet.paste(p, ((i % cols) * W, (i // cols) * H))
    sheet.save(f'tmp/lidar/{park}-check.png')
    # Plan view: heights (white = high), each section's measuring point
    # coloured by tier (grey where not found), with its id.
    E, N, Z = P
    cell = 0.5
    ix, iy = ((E + HALF) / cell).astype(int), ((HALF - N) / cell).astype(int)
    size = int(2 * HALF / cell) + 1
    img = np.full((size, size), -np.inf)
    np.maximum.at(img, (np.clip(iy, 0, size - 1), np.clip(ix, 0, size - 1)), Z)
    g = np.clip(np.nan_to_num(img, neginf=0) / max(1.0, np.percentile(Z, 99.5)), 0, 1) * 200
    plan = Image.fromarray(g.astype(np.uint8)).convert('RGB').resize((size * 2, size * 2))
    dp = ImageDraw.Draw(plan)
    colours = [(255, 60, 60), (60, 200, 60), (80, 140, 255), (255, 180, 0), (220, 80, 255), (0, 220, 220), (255, 120, 180), (180, 255, 120), (255, 255, 255), (160, 120, 60), (120, 120, 255), (255, 90, 0)]
    keys = list(PARKS[park]['tiers'])
    for r in results:
        if 'anchor' not in r:
            continue
        x, y = (r['anchor'][0] + HALF) / cell * 2, (HALF - r['anchor'][1]) / cell * 2
        c = colours[keys.index(r['tier']) % len(colours)] if r['found'] else (128, 128, 128)
        dp.ellipse([x - 4, y - 4, x + 4, y + 4], fill=c)
        dp.text((x + 5, y - 6), r['id'], fill=c)
    for i, k in enumerate(keys):
        dp.text((10, 10 + 14 * i), k, fill=colours[i % len(colours)])
    plan.save(f'tmp/lidar/{park}-plan.png')
    print(f'wrote tmp/lidar/{park}-check.png ({len(panels)} cuts)')


def suggest(park):
    """Print each tier's measured values (feet, rounded) and the sections
    that differ from them by more than 10% (at least 3 ft) in the form used
    in stadiumStructures.ts. Soffits only where the scan saw the deck's face
    and the deck's edge agrees with the sourced covered row."""
    d = json.load(open(f'tmp/lidar/{park}-measured.json'))
    r0 = lambda v: None if v is None else int(round(v))
    differs = lambda v, ref: v is not None and ref is not None and abs(v - ref) > max(0.1 * abs(ref), 3)
    print(f"// {d['scan']}, flown {d['flown']}; far rim (roof line) {r0(d['rim']['heightFt'])} ft, crossing {r0(d['rim']['distanceFt'])} ft")
    for key, t in d['tiers'].items():
        rs = [r for r in d['sections'] if r['tier'] == key and r['found']]
        if not rs:
            print(f'{key}: not found')
            continue
        m = lambda f: None if t[f] is None else t[f]['median']
        front, rake, soffit, back, setback = m('frontFt'), m('rakeDeg'), m('soffitFt'), m('backFt'), m('backSetbackFt')
        spread = lambda f: '-' if t[f] is None else f"{t[f]['min']:.0f}-{t[f]['max']:.0f}"
        print(f"{key} ({len(rs)}/{t['sections']}): front {r0(front)} [{spread('frontFt')}], rake {r0(rake)} [{spread('rakeDeg')}], "
              f"soffit {r0(soffit)} [{spread('soffitFt')}], back {r0(back)} at {r0(setback)} [{spread('backFt')}]")
        # Sections that differ, with their values pooled where within 3 ft.
        def clusters(field, ref):
            out, rows_ = {}, sorted((r for r in rs if differs(r[field], ref)), key=lambda r: r[field])
            group = []
            for r in rows_ + [None]:
                if r is None or (group and r[field] - group[0][field] > 3):
                    for g in group:
                        out[g['id']] = group
                    group = []
                if r is not None:
                    group.append(r)
            return out
        fronts, backs = clusters('frontFt', front), clusters('backFt', back)
        soffits = clusters('soffitFt', soffit) if soffit is not None else {}
        pooled = {}
        for r in rs:
            o = []
            if r['id'] in fronts:
                o.append(('frontRowHeightFt', r0(med([g['frontFt'] for g in fronts[r['id']]]))))
            if r['id'] in backs:
                o.append(('backHeightFt', r0(med([g['backFt'] for g in backs[r['id']]]))))
                o.append(('backSetbackFt', r0(med([g['backSetbackFt'] for g in backs[r['id']]]))))
            if r['id'] in soffits:
                o.append(('soffitHeightFt', r0(med([g['soffitFt'] for g in soffits[r['id']]]))))
            if o:
                pooled.setdefault(tuple(o), []).append(r['id'])
        for o, ids in pooled.items():
            vals = ', '.join(f'{k}: {v}' for k, v in o)
            print(f"   ...Object.fromEntries({json.dumps(sorted(ids))}.map((id) => [id, {{ {vals} }}])),".replace('"', "'"))


def cover_report(park):
    """Covered rows from the scan (option A). Per tier, the sections whose
    deck edge is more than 2 rows from the sourced covered row (or covers 3+
    rows the source leaves open). When most measured sections are, the tier
    takes the median edge row; sections more than 2 rows off it get their
    own. The underside at the edge: the bottom of its face where the scan
    sees one; otherwise the lowest structure seen there, or, if that is the
    front row of a deck of seats above (within 2 ft), that row less the
    park's measured deck depth (front row to lowest structure at the edges
    where both show; 9 ft if none do); never less than 9 ft above the first
    covered row's floor. Prints the tier's values and the sections that differ."""
    d = json.load(open(f'tmp/lidar/{park}-measured.json'))
    data = load_sections(park)
    secs = {s['id']: s for s in data['sections']}
    r0 = lambda v: None if v is None else int(round(v))
    # How far a deck's lowest structure at its edge sits below its front row,
    # measured at this park's edges where both show (9 ft if none do).
    drops = [r['aboveFrontFt'] - r['lipLowFt'] for r in d['sections'] if r['found'] and r.get('lipLowFt')
             and r.get('aboveFrontFt') and r['aboveFrontFt'] - r['lipLowFt'] > 2]
    depth = float(np.median(drops)) if drops else 9.0
    print(f"deck depth below its front row: {depth:.1f} ft ({len(drops)} edges)")
    for key in d['tiers']:
        rs = [r for r in d['sections'] if r['tier'] == key and r['found']]
        if not rs:
            continue
        covered = lambda rows, row: 0 if row is None else rows - row + 1
        info = []
        for r in rs:
            st = secs[r['id']]['stand']
            m = (st.get('overhang') or {}).get('coveredFromRow')
            l = r['lipRow']
            off = l is not None and abs(covered(st['rows'], l) - covered(st['rows'], m)) > 2
            under = None
            if l is not None and r['lipSoffitFt'] is not None:
                under = r['lipSoffitFt']
            elif l is not None and r.get('lipLowFt') is not None:
                under = r['lipLowFt']
                if r.get('aboveFrontFt') is not None and under >= r['aboveFrontFt'] - 2:
                    under = r['aboveFrontFt'] - depth
            if under is not None:
                rise = 2.75 * math.tan(math.radians(r['rakeDeg']))
                under = max(under, r['frontFt'] + (l - 1) * rise + 9)
            info.append({'id': r['id'], 'rows': st['rows'], 'm': m, 'l': l, 'off': off, 'under': under,
                         'face': r['lipSoffitFt'], 'low': r.get('lipLowFt'), 'above': r.get('aboveFrontFt')})
        n_off = sum(i['off'] for i in info)
        apply = n_off * 2 > len(info)
        lips = [i['l'] for i in info if i['l'] is not None]
        unders = [i['under'] for i in info if i['under'] is not None]
        tier_row = int(round(float(np.median(lips)))) if apply and lips else None
        tier_under = r0(med(unders)) if unders else None
        fmt = lambda v: '-' if v is None else f'{v:.0f}'
        print(f"{key}: {n_off}/{len(info)} off by >2 rows; tier -> {tier_row if apply else 'keep sourced'}; "
              f"underside {fmt(med(unders))} [{fmt(min(unders) if unders else None)}-{fmt(max(unders) if unders else None)}] "
              f"(lowest {fmt(med([i['low'] for i in info if i['low']]))}, deck above {fmt(med([i['above'] for i in info if i['above']]))}, "
              f"face {fmt(med([i['face'] for i in info if i['face']]))} n{sum(1 for i in info if i['face'])})")
        for i in info:
            own_row = (tier_row is not None and i['l'] is not None and abs(i['l'] - tier_row) > 2) or (tier_row is None and i['off'])
            own_under = i['under'] is not None and tier_under is not None and abs(i['under'] - tier_under) > max(0.1 * tier_under, 3)
            if own_row or (own_under and (tier_row is not None or own_row)):
                print(f"   '{i['id']}': rows {i['rows']}, sourced {i['m']}, edge {i['l']}, underside {fmt(i['under'])}"
                      f" (lowest {fmt(i['low'])}, deck above {fmt(i['above'])}, face {fmt(i['face'])})")


def runs_listing(park):
    P = load_points(park)
    print(f'field {P[3]:.2f} m; flown {P[4]}')
    data = load_sections(park)
    by = {}
    for sec in data['sections']:
        s, across, z = cut(P[:3], 0, 0, sec['bearing'], 0, 220)
        runs = runs_in(s, z)
        desc = '  '.join(f"{r['z0']:5.1f}m@{r['s0']:3.0f}-{r['s1']:3.0f}/{math.degrees(math.atan(r['slope'])):2.0f}" for r in runs)
        by.setdefault(sec['tier'], []).append(f"  {sec['id']:>8} b{sec['bearing']:5.1f}: {desc}")
    for t, lines in by.items():
        print(t)
        print('\n'.join(lines))


if __name__ == '__main__':
    cmd, park = sys.argv[1], sys.argv[2]
    if cmd == 'fetch':
        fetch(park)
    elif cmd == 'runs':
        runs_listing(park)
    elif cmd == 'measure':
        measure(park)
        suggest(park)
    elif cmd == 'cover':
        cover_report(park)
