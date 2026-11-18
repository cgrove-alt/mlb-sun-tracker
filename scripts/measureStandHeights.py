"""
Measure ballpark stand heights from USGS 3DEP airborne lidar (public domain)
for the stand profiles in src/data/stadiumStructures.ts.

Requirements: Python 3.11+ with numpy, scipy, laspy[lazrs], pyproj, pillow,
and Node (npx tsx) for scripts/lidar/standSections.ts.

  python scripts/measureStandHeights.py fetch <park>    # lidar around home plate -> tmp/lidar/<park>.npz
  python scripts/measureStandHeights.py runs <park>     # seating runs under each section (to set the tier bands)
  python scripts/measureStandHeights.py measure <park>  # per-section and per-tier values -> tmp/lidar/<park>-measured.json
                                                        # and a check picture tmp/lidar/<park>-check.png
  python scripts/measureStandHeights.py fallsheet <park>  # the scan around each section whose fall line is off
                                                        # its stand direction -> tmp/lidar/<park>-fall-<n>.png

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
       - the same on four cuts beside it (2 and 4 m to either side): where
         this cut's rake is more than 2 degrees off their median, it isn't
         the stand's (an aisle's steps, a walkway): the section's rake is
         left out, and down an aisle its front row is theirs;
       - the rows' fall line: 13 cuts turned -60 to +60 degrees about the
         middle of the run, and about the points 4 m to either side. A cut at
         an angle t to the fall line reads atan(tan(rake) cos t), so the
         direction most of them agree with is the way the rows climb. Where
         it is firmly more than 15 degrees off the stand direction, this cut
         crosses the rows at an angle: its rake is left out, and where the
         median of the fall lines found (two or more) is more than 15
         degrees off, the stand turns to that median (`suggest`). Where two
         of them, both read within the section, are firmly more than 20
         degrees apart and planes fitted to the treads there agree, its
         rows bend across its width: each third faces its own (`faces`).
         Planes fitted to the treads at the middle and those points give a
         direction of their own; where they agree within 15 degrees, the
         fall line in the middle agrees with them within 8, and both lie
         more than 10 off the stand direction, it is wrong (`treads`);
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
        'skip': {'B126': 'its chart position puts its cut outside the park (plan view)',
                 'B6': 'its cut, along its rows, runs up a field-level walkway into the stand '
                       '(flat at the field for 12 m, then a 7 ft step) and finds the rows behind it; '
                       'the cuts 4 m either side climb its rows from the field'},
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
        # picks rows 1-18, so the profile's first four rows (A-G and row 0,
        # eight, in 315 and 326) lie in front of the run. The suites are
        # enclosed under it.
        'tiers': {'lower': (-1, 4), 'club': (7, 12), 'view': (22, 27, 'near', 15), 'bleachers': (1, 4), 'arcade': (3, 7)},
        'rowsInFront': {'view': 4, '315': 8, '326': 8},
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
    'braves': {
        'scan': {'ept': 'GA_Statewide_B2_2018'}, 'name': 'USGS 3DEP GA_Statewide_B2_2018 (Georgia 2019)',
        'noise': [7, 18],
        'tiers': {
            'clubBoxes': (-1.0, 1.2), 'fieldInfield': (-1.0, 1.2), 'fieldBoxes': (-1.0, 1.2),
            'hundred': (1.5, 4.5, 'far'), 'hundredCoverUnsourced': (1.5, 4.5, 'far'), 'executive': (1.5, 4.5, 'far'),
            'rightCorner': (1.5, 4.5, 'far'), 'leftCorner': (1.5, 4.5, 'far'),
            'homeRunPorch': (1.0, 3.0), 'pen': (3.5, 7.0), 'chopHouse': (3.5, 5.5),
            'twoHundred': (9.5, 14, 'near', 15), 'twoHundredCorner': (9.5, 14, 'near', 15),
            'xfinityClub': (9.5, 14, 'near', 15), 'terrace': (9.5, 14, 'near', 15),
            'threeHundred': (18, 23, 'near', 15), 'vistaHome': (18, 23, 'near', 15), 'threeCorner': (18, 23, 'near', 15),
            'fourHundredOpen': (26, 36, 'near', 15),
        },
        # The roof canopy, ~150 ft up, reaches out over the 200 and 300 levels'
        # back rows and hides the 300 and 400 decks under it. An edge at its
        # height is not the deck over those rows (the scan cannot see that
        # deck under it): the source's row stays, and the canopy counts as
        # what rises behind.
        'canopyFt': 140,
        'skip': {'345': 'its cut runs along the steps, not up them (the stand direction is off in the corner)'},
    },
    'cardinals': {
        'scan': {'ept': 'USGS_LPC_MO_StLouis_2017_LAS_2018'}, 'name': 'USGS 3DEP MO_StLouis_2017 (St. Louis 2017)',
        'noise': [7, 18],
        'tiers': {
            'cardinalsClub': (-1.0, 0.6), 'fieldBoxes': (-1.0, 1.0), 'hundred': (0.5, 5, 'far'), 'bleachers': (1.0, 4.5),
            'loge': (12, 17, 'near', 15), 'clubLevel': (12, 17, 'near', 15),
            'pavilion': (20, 25, 'near', 15), 'pavilionLeft': (20, 25, 'near', 15),
            'terrace': (27, 32, 'near', 15), 'terraceInfield': (27, 32, 'near', 15),
        },
        # Six light towers rise above the roof line (133 ft) to 197 ft.
        'lightTowersAbove': 43,
        'skip': {'2': 'its cut runs under a structure 12 ft up that the photo does not show over the club seats (the cut is off them)',
                 '372': 'its cut runs along the steps, not up them (the stand direction is off in the corner)'},
    },
    'nationals': {
        'scan': {'ept': 'USGS_LPC_MD_VA_Sandy_NCR_2014_LAS_2015'}, 'name': 'USGS 3DEP MD_VA_Sandy_NCR_2014 (Washington 2014)',
        'noise': [7, 18],
        # The 200 level shows only its front edge under the 300 deck; the
        # 400s are under the roof (hidden).
        # The decks over the 100s, right field and the Diamond Club show only
        # their first row from the air: their fronts as measured on their own
        # sections (the 200 level's, the Pavilion's), and the upper deck's
        # over 237-239.
        'deckAboveFt': {'hundred': 37, 'diamondClub': 37, 'rightField': 36, 'pavilion': 62, 'pavilionCoverUnsourced': 62},
        'tiers': {
            'terraClub': (-0.8, 0.6), 'diamondClub': (2, 5), 'hundred': (-0.8, 1.2), 'outfield': (1.5, 5),
            'rightField': (2.5, 5), 'pavilion': (9.5, 12), 'pavilionCoverUnsourced': (9.5, 12),
            'mezzanine': (9, 16, 'near', 15), 'clubLevel': (9, 16, 'near', 15), 'terrace': (9, 16, 'near', 15),
            'gallery': (19, 24, 'near', 15), 'upperGallery': (26, 34, 'near', 15),
        },
        'skip': {'215': 'its cut lands on a roof outside the park (86 m from home plate, beyond the stands), not on the club level'},
    },
    'orioles': {
        # Not in the AWS copy (it has 2014): two tiles from USGS (rockyweb),
        # 54 and 53 MB, downloaded to tmp/lidar/raw/. The 2024 scan shows the
        # left-field wall as moved back in 2022.
        'scan': {'laz': ['tmp/lidar/raw/USGS_LPC_MD_4County_D24_18suj600490.laz', 'tmp/lidar/raw/USGS_LPC_MD_4County_D24_18suj590490.laz']},
        'url': ['https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/MD_4County_D24/MD_4County_2_D24/LAZ/USGS_LPC_MD_4County_D24_18suj600490.laz',
                'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/MD_4County_D24/MD_4County_2_D24/LAZ/USGS_LPC_MD_4County_D24_18suj590490.laz'],
        'name': 'USGS 3DEP MD_4County_D24 (Maryland 2024)',
        'noise': [7, 18],
        # The Terrace (odd 11-87) is under the club level, its first rows
        # showing; behind home (33-43) under the upper deck.
        'tiers': {
            'field': (-0.8, 3.5, 'near'), 'rightCorner': (-0.8, 2.5, 'near'), 'bleachers': (1, 3),
            'terrace': (4, 8.5, 'near', 10), 'terraceHome': (5.5, 8.5, 'near', 10),
            'clubLevel': (10.5, 14, 'near', 12), 'clubOpen': (10.5, 14, 'near', 12),
            'upper': (17.5, 21, 'near', 15), 'upperShort': (17.5, 21, 'near', 15),
        },
        # The light towers rise above the roof line (~121 ft) to ~165 ft.
        'lightTowersAbove': 40,
        'skip': {n: 'its cut runs along the steps, not up them (the stand direction is off in the corner)' for n in ('276', '280', '282', '378')},
    },
    'padres': {
        # Not in the AWS copy (it has 2014): two tiles from USGS (rockyweb),
        # 45 and 53 MB, downloaded to tmp/lidar/raw/.
        'scan': {'laz': ['tmp/lidar/raw/USGS_LPC_CA_SanDiegoCo_D24_11SMS485618.laz', 'tmp/lidar/raw/USGS_LPC_CA_SanDiegoCo_D24_11SMS485619.laz']},
        'url': ['https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/CA_SanDiegoCo_D24/CA_SanDiegoCo_2_D24/LAZ/USGS_LPC_CA_SanDiegoCo_D24_11SMS485618.laz',
                'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/CA_SanDiegoCo_D24/CA_SanDiegoCo_2_D24/LAZ/USGS_LPC_CA_SanDiegoCo_D24_11SMS485619.laz'],
        'name': 'USGS 3DEP CA_SanDiegoCo_D24 (San Diego County 2024)',
        'noise': [7, 18],
        # The upper deck: Upper Box rows from ~20 m, then the rows behind an
        # aisle from ~24 m. The band takes only the front block: a section
        # whose cut misses it would be measured from the wrong first row.
        'tiers': {
            'fieldVip': (-0.8, 1.0, 'near'), 'lexusClub': (2, 4.5, 'near'),
            'hundred': (-0.8, 1.2, 'near'), 'hundredCoverUnsourced': (-0.8, 3.0, 'near'),
            'leftLower': (-0.5, 2.0, 'near'), 'rightLower': (1.5, 4, 'near'),
            'terraceVip': (9, 12.5, 'near', 15), 'terraceInfieldOpen': (9, 12.5, 'near', 15), 'terrace': (9, 12.5, 'near', 15),
            'leftReserved': (6.5, 10, 'near', 15), 'rightUpper': (10.5, 16, 'near', 15),
            'upper': (19, 23, 'near', 15),
        },
        # The light towers rise above the roof line (~134 ft) to 177-217 ft;
        # the downtown towers beyond the outfield stay.
        'lightTowersAbove': 43,
        'skip': {'301': 'its cut picks up a deck edge over row 1 and nothing behind: off the Upper Box (the stand direction is off behind home)',
                 '117': 'its fit runs under the seats (11 ft of them seen)'},
        # Decks that show only their first row over the stands below: their
        # fronts as measured on their own sections (the Terrace level's over
        # the 100s and the Lexus Club, the Upper Box's over the Terrace, right
        # field's upper level over its lower stands).
        'deckAboveFt': {'hundred': 36, 'hundredCoverUnsourced': 36, 'lexusClub': 36, 'terrace': 67, 'terraceInfieldOpen': 66, 'rightLower': 47},
        # Over the upper deck only the roof (133 ft) is an edge: lower
        # "edges" are the Upper Deck's rows behind the aisle, which rise above
        # the Upper Box's line, or a flat structure the seats show under.
        'edgeMinFt': {'upper': 120},
    },
    'angels': {
        # The 2018 SoCal scan (AWS) stops at its project's edge, leaving out
        # home plate's side of the park; the 2023 California gaps tile (from
        # USGS, rockyweb, 10 MB, downloaded to tmp/lidar/raw/) covers a strip
        # from there to ~70 m east of the park's middle. Where it has points,
        # only its points.
        'scan': {'ept': 'USGS_LPC_CA_SoCal_Wildfires_B1_2018_LAS_2019',
                 'laz': ['tmp/lidar/raw/USGS_LPC_CA_CaliforniaGaps_B23_11SMT418740.laz']},
        'url': ['https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/CA_CaliforniaGaps_B23/CA_CaliforniaGaps_2_B23/LAZ/USGS_LPC_CA_CaliforniaGaps_B23_11SMT418740.laz'],
        'name': 'USGS 3DEP CA_CaliforniaGaps_B23 (November 2023) and CA_SoCal_Wildfires_B1_2018 (August 2018)',
        'noise': [7, 18],
        # The Terrace (200s) is under the club level, hidden. The field level
        # steps up ~1 m at an aisle part way back (its front block is the
        # run); the 500s show rows A-C before their roof, and only where a
        # walkway sets them above the 400s. The upper right-field pavilion
        # shows as a deck near the pole (241-244); further out its rows go
        # on from the lower pavilion's.
        'tiers': {
            'field': (-0.5, 1.2, 'near', 5, 4), 'club': (9.5, 11.5, 'near', 5),
            'loge': (16.8, 20.5, 'near', 15), 'view': (23, 25.5, 'near', 10),
            'rightPavilion': (3.0, 5.0, 'near', 10), 'rightPavilionUpper': (10, 12, 'near', 5),
            'leftPavilion': (0.5, 3.2, 'near', 10, 4),
        },
        # The light towers behind both pavilions rise to ~168 ft; the lamp
        # banks on the roof's front edge (~123 ft) only to ~143 ft, over the
        # 500s' front rows, which a lower threshold would take with them.
        'lightTowersAbove': 45,
        'skip': {'241': 'its cut crosses a flat platform at an angle (5° rake), not the pavilion rows',
                 '260': "its place on the seat map cuts the field level's end (101's rows, under the club level), not the pavilion"},
    },
    'rockies': {
        'scan': {'ept': 'CO_DRCOG_2_2020'}, 'name': 'USGS 3DEP CO_DRCOG_2020 (Denver 2020)',
        'noise': [7, 18],
        # The club level (200s) shows only its first rows under the upper
        # level, and none behind home; the upper level's U rows start behind
        # a walkway, ~5 m above its L rows.
        # Behind home and toward third, a 3-4 m piece at the backstop (the
        # wall, or rows the sections do not include) comes before the seats:
        # the field level's run is the first at least 6 m long.
        'tiers': {
            'field': (-0.8, 2.2, 'near', 5, 6), 'fieldHome': (-0.8, 1.5, 'near', 5, 6),
            'rightBleachers': (3.5, 5.5, 'near', 10), 'rightCorner': (-0.8, 2.0, 'near', 8),
            'leftCorner': (-0.8, 2.0, 'near', 8), 'leftStands': (-0.8, 3.0, 'near', 10),
            'club': (9.5, 11.5, 'near', 10), 'rightReserve': (19.5, 21.5, 'near', 15),
            'upperFront': (19.5, 22.5, 'near', 15), 'upperBack': (24, 27.5, 'near', 15),
            'rockpile': (13, 17, 'near', 15),
        },
        # The light towers rise above the roof line (~128 ft).
        'lightTowersAbove': 42,
        # Decks seen only as their edge over the stands below: their fronts as
        # measured on their own sections (the club level's over the 100s and
        # the right-field seats, the upper level's over the club level and
        # the rows behind home).
        'deckAboveFt': {'field': 34, 'rightBleachers': 34, 'club': 67, 'fieldHome': 67},
        'skip': {'L311': 'its cut crosses the rows at an angle (the stand turns at the end of the upper level): a smeared run, 22° against 27° elsewhere'},
    },
    'royals': {
        'scan': {'ept': 'MO_FEMANRCS_1_2020'}, 'name': 'USGS 3DEP MO_FEMANRCS_2020 (Missouri 2020)',
        'noise': [7, 18],
        # The Loge (300s) is under the upper deck, hidden; so are the upper
        # deck's double-letter rows under the roof, except at its ends.
        'tiers': {
            'field': (-0.8, 1.2, 'near', 5), 'outfield': (1.0, 2.6, 'near', 5),
            'plaza': (4.0, 6.6, 'near', 8), 'plazaCorner': (4.0, 6.6, 'near', 8), 'plazaOpen': (4.0, 6.6, 'near', 8),
            'upper': (17.0, 18.8, 'near', 15), 'upperTop': (31, 36, 'near', 15),
        },
        'skip': {n: 'its cut finds only the front rows below a step (the rows behind start ~7 ft higher), at a shallower rake'
                 for n in ('417', '418', '421', '422', '423', '424', '425')},
        # The upper deck seen only as its edge over the Plaza: its front as
        # measured on its own sections.
        'deckAboveFt': {'plaza': 60, 'plazaCorner': 60, 'plazaOpen': 60},
    },
    'reds': {
        'scan': {'ept': 'OH_StatewideP3_6_B21'}, 'name': 'USGS 3DEP OH_StatewideP3_B21 (Ohio Phase 3, 2021-22)',
        'noise': [7, 18],
        # The 400s are ~10 m up in left field (401-406), ~15.5 m on the
        # third-base side (411-419); the View level shows its rows to the
        # roof's edge.
        'tiers': {
            'diamond': (-0.6, 0.6, 'near', 5), 'home': (0.9, 1.8, 'near', 8),
            'first': (-0.6, 1.4, 'near', 5), 'third': (-0.3, 2.8, 'near', 4),
            'thirdCoverUnsourced': (-0.5, 1.0, 'near', 5), 'leftField': (2.0, 3.5, 'near', 10),
            'rightField': (1.0, 2.2, 'near', 12), 'twoHundred': (9.8, 11.2, 'near', 12),
            'club': (9.8, 11.0, 'near', 12), 'clubCoverUnsourced': (9.8, 11.0, 'near', 12),
            'fourHundred': (9.5, 16.5, 'near', 15), 'fourHundredFront': (19.5, 21.5, 'near', 12),
            'upperThird': (25.5, 27.5, 'near', 15), 'upperFirst': (23.5, 27.5, 'near', 15),
        },
        # The light towers behind the stands rise to ~65 m; the roof's edge
        # is ~42 m.
        'lightTowersAbove': 45,
        'skip': {n: 'its cut crosses the rows at an angle (a smeared band, two blocks): the rake and the edge read off it are not the stand\'s'
                 for n in ('401', '402', '403', '404', '405')},
        # Decks seen only as their edge: their fronts as measured on their own
        # sections (the third-base 400s over the 100s there, the club over
        # the first-base 100s, the View level over the third-base 400s).
        'deckAboveFt': {'third': 52, 'thirdCoverUnsourced': 52, 'first': 35, 'fourHundred': 88},
    },
    'pirates': {
        # Not in the AWS copy (it has 2019): two tiles from USGS (rockyweb),
        # 76 and 81 MB, downloaded to tmp/lidar/raw/.
        'scan': {'laz': ['tmp/lidar/raw/USGS_LPC_PA_17County_D24_17TNE584477.laz', 'tmp/lidar/raw/USGS_LPC_PA_17County_D24_17TNE584478.laz']},
        'url': ['https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/PA_17County_D24/PA_17Co_1_D24/LAZ/USGS_LPC_PA_17County_D24_17TNE584477.laz',
                'https://rockyweb.usgs.gov/vdelivery/Datasets/Staged/Elevation/LPC/Projects/PA_17County_D24/PA_17Co_1_D24/LAZ/USGS_LPC_PA_17County_D24_17TNE584478.laz'],
        'name': 'USGS 3DEP PA_17County_D24 (Pennsylvania 2024-25)',
        'noise': [7, 18],
        # The field-level boxes, then a step to the 100s; the club rows and
        # the 300s form the upper deck, the 300s a step above the club's
        # back (in places one run).
        'tiers': {
            'field': (-0.8, 1.0, 'near', 5, 4), 'hundred': (0.9, 2.3, 'near', 7, 5),
            'leftCorner': (-0.5, 1.8, 'near', 6, 5), 'rightField': (1.5, 6.0, 'near', 15),
            'bleachers': (3.8, 5.2, 'near', 10), 'rooftop': (11.0, 13.5, 'near', 10),
            'club': (15.0, 16.6, 'near', 12), 'upper': (20.5, 24.0, 'near', 15), 'upperHome': (20.5, 24.0, 'near', 15),
        },
        # The light towers rise above the roof's edge (~120 ft) to ~200 ft.
        'lightTowersAbove': 40,
        # The club deck seen only as its edge over the 100s: its front as
        # measured on its own sections.
        'deckAboveFt': {'hundred': 53},
    },
    'tigers': {
        'scan': {'ept': 'USGS_LPC_MI_WayneCo_2017_LAS_2018'}, 'name': 'USGS 3DEP MI_WayneCo_2017 (Wayne County 2017)',
        'noise': [7, 18],
        # The Tiger Den and the terraces are under the decks; the upper deck's
        # rows A-F, then 1-20 a step up; the mezzanine's A-F, then 1-22.
        'tiers': {
            'home': (-0.8, 0.8, 'near', 5, 5), 'first': (-0.8, 2.0, 'near', 5, 5), 'third': (-0.8, 1.5, 'near', 5, 5),
            'firstCorner': (-0.5, 2.5, 'near', 5, 5), 'leftCorner': (-0.5, 1.2, 'near', 5, 3),
            'leftField': (1.2, 2.2, 'near', 7, 5), 'rightField': (1.8, 3.6, 'near', 8, 5),
            'mezzanine': (14.0, 15.6, 'near', 10), 'upper': (17.8, 19.4, 'near', 12),
        },
        # The light towers rise above the roof (~120 ft) to ~205 ft.
        'lightTowersAbove': 40,
        # The upper deck seen only as its edge over the lower bowl: its front
        # as measured on its own sections.
        'deckAboveFt': {'first': 61, 'third': 61, 'leftCorner': 61},
        'skip': {n: "its run is the mezzanine's shallow front block (A-F); the rows behind the step read as an edge"
                 for n in ('211', '212')},
    },
    'guardians': {
        # The newest scan (2019) predates the 2023-24 renovation, which took
        # out upper-deck seats in the left-field corner, behind home and in
        # right field and added canopied decks there.
        'scan': {'ept': 'OH_Statewide_Phase1_1_2019'}, 'name': 'USGS 3DEP OH_Statewide_Phase1_2019 (Ohio Phase 1, 2019)',
        'noise': [7, 18],
        # The lower bowl from the field; the club deck (326-348) a deck above
        # its first-base side; the upper deck's boxes (400s, rows A-F), then
        # its reserved seats (500s) a step up where there is one.
        'tiers': {
            'first': (-0.8, 2.0, 'near', 5, 5), 'home': (-0.8, 1.2, 'near', 5, 5), 'third': (-0.8, 1.5, 'near', 5, 5),
            'rightCorner': (-0.8, 4.0, 'near', 5, 5), 'rightField': (1.0, 2.6, 'near', 8, 5), 'leftField': (4.5, 10, 'near', 15, 5),
            'club': (7.5, 9.0, 'near', 10, 5), 'rightFieldClub': (10.5, 12.0, 'near', 12, 3),
            'upperBox': (19.8, 22.6, 'near', 12, 3), 'upper': (24.0, 27.0, 'near', 15, 3),
        },
        # The light towers rise above the roof canopy (~141 ft).
        'lightTowersAbove': 46,
        # The Terrace Club's stepped decks over and behind these (and the
        # left-field corner, 176-179, not measured) were rebuilt after the
        # scan (the North Coast Social Club, 2025).
        'skip': {**{n: 'what is over and behind it, the Terrace Club, was rebuilt in 2024-25'
                    for n in ('167', '169', '170', '171', '172', '174', '175')},
                 '117': "its cut runs over the right-field corner's flat platform, not up its rows"},
    },
    'twins': {
        'scan': {'ept': 'MN_CentralMissRiver_4_B22'}, 'name': 'USGS 3DEP MN_CentralMissRiver_B22 (Minnesota 2022)',
        'noise': [7, 18],
        # The boxes from the field, the 100s a step up behind them, the club
        # deck (A-V) over the 100s' back rows, and the upper deck over the
        # club's.
        'tiers': {
            'box': (-0.8, 1.2, 'near', 5, 4), 'infield': (1.8, 3.6, 'near', 8, 5), 'corner': (-0.8, 3.6, 'near', 5, 5),
            'club': (10.5, 12.2, 'near', 10, 3), 'clubOpen': (10.5, 12.2, 'near', 10, 3), 'clubCoverUnsourced': (10.5, 12.2, 'near', 10, 3),
            # The upper deck: the 200s are its front rows; the 300s behind them
            # are under the canopy, hidden from the air.
            'terrace': (21.0, 23.5, 'near', 15, 3),
            # Left field: the bleachers (mostly under the porch), the 200-level
            # porch, the 300-level porch; right field: the seats over the wall
            # and the 200s above (the cove is under them).
            'bleachers': (1.0, 3.0, 'near', 15, 5), 'porch': (11.0, 13.5, 'near', 20, 3), 'porchUpper': (17.0, 19.5, 'near', 25, 5),
            'rightField': (5.0, 7.5, 'near', 10, 3), 'rightFieldDeck': (11.5, 16.0, 'near', 25, 3),
        },
        # The light rigs rise above the canopy (~148 ft).
        'lightTowersAbove': 47,
    },
    'whitesox': {
        'scan': {'ept': 'USGS_LPC_IL_4County_Cook_2017_LAS_2019'}, 'name': 'USGS 3DEP IL_4County_Cook_2017 (Cook County 2017)',
        'noise': [7, 18],
        # The lower box from the field (higher behind the dugouts and the
        # scout seats), the club's five rows under the upper deck, the upper
        # deck under its roof; open outfield stands.
        'tiers': {
            'lowerBox': (-0.8, 4.0, 'near', 5, 5), 'rightField': (1.0, 3.5, 'near', 10, 5), 'leftField': (1.0, 3.5, 'near', 10, 5),
            'club': (13.8, 16.5, 'near', 8, 2), 'upper': (20.5, 24.5, 'near', 15, 3),
        },
        # The deck above seen only as its edge: its front row as measured on
        # its own sections (the club's over the lower box, the upper deck's
        # over the club).
        'deckAboveFt': {'lowerBox': 48, 'club': 72},
    },
    'athletics': {
        'scan': {'ept': 'USGS_LPC_CA_NoCAL_Wildfires_B5a_2018'}, 'name': 'USGS 3DEP CA_NoCAL_Wildfires_B5a_2018 (Northern California 2018)',
        'noise': [7, 18],
        # One bowl from the field; the club's five rows raised behind
        # 101-106.
        'tiers': {
            'first': (-0.8, 1.2, 'near', 5, 5), 'home': (-0.8, 1.2, 'near', 5, 5), 'third': (-0.8, 1.2, 'near', 5, 5),
            'club': (8.0, 10.5, 'near', 8, 3),
        },
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
    cols, parts, newer_parts = [], [], []
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
    if 'laz' in scan:
        from pyproj import Transformer
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
            newer_parts.append((las, m, (mx - home['x']) / k, (my - home['y']) / k))
    # Tiles with a scan: where the tiles (newer, flown to fill the scan's
    # gaps) have points, only theirs (2 m cells, less one at their edge,
    # where a cell is only partly theirs); the scan fills the rest.
    cell = lambda v: np.clip(((v + HALF) // 2).astype(int), 0, int(HALF))
    newer = np.zeros((int(HALF) + 1, int(HALF) + 1), bool)
    for las, m, east, north in newer_parts:
        newer[cell(east), cell(north)] = True
    newer = ndimage.binary_erosion(newer)
    for older, group in ((True, parts), (False, newer_parts)):
        for las, m, east, north in group:
            inside = (np.abs(east) <= HALF) & (np.abs(north) <= HALF)
            if older and newer_parts:
                inside &= ~newer[cell(east), cell(north)]
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
    rake in degrees, default 5[, least length in metres, default 0]]]); of
    several, the nearest home plate, or for 'far' the farthest one in front of
    the first run above the band (the next deck up)."""
    lo, hi = band[:2]
    min_rake = band[3] if len(band) > 3 else 5
    min_len = band[4] if len(band) > 4 else 0
    cands = [r for r in runs if lo <= r['z0'] <= hi and r['s0'] < 170 and r['slope'] > math.tan(math.radians(min_rake))
             and r['s1'] - r['s0'] >= min_len]
    if not cands:
        return None
    if band[2:3] == ('far',):
        above = [r['s0'] for r in runs if r['z0'] > hi]
        if above:
            cands = [r for r in cands if r['s0'] < min(above)] or cands
        return max(cands, key=lambda r: r['s0'])
    return min(cands, key=lambda r: r['s0'])


FALL_FIRM = 15   # degrees: a stand direction firmly further off the fall line than this is wrong
FALL_SIDE_M = 4  # metres: the fall lines either side are read this far from the middle
FACE_APART = 20  # degrees: fall lines firmly further apart than this split a section into faces


def fall_line(P, x, y, compass, band, tread):
    """The rows' fall line at (x, y), from 13 cuts turned -60 to +60 degrees
    (10 degree steps) off `compass`, each taking its tier's run where it spans
    4 or more rows. A cut at t to the fall line reads tan(rake) = tan(R) cos t.
    For each trial direction d0 (-90 to 90 degrees, 1 degree steps), the cuts
    within 50 degrees of it give R (the median of atan(tan(rake) / cos(d - d0)))
    and agree with it where the model puts them within 1.5 degrees. The fall
    line is the d0 most cuts agree with (then the least error), needing 5 or
    more over 40 degrees or more, so one aisle or walkway can't outvote it.
    On a shallow stand the rake barely changes near the fall line, so several
    d0 may fit as well: `lo` and `hi` are their range. Returns how far the
    fall line is off `compass` (degrees, clockwise), that range and R, or None
    where no direction fits."""
    cuts = []
    for d in range(-60, 61, 10):
        s, _, z = cut(P, x, y, (compass + d) % 360, -60, 90)
        r = tier_run([q for q in runs_in(s, z) if -35 < q['s0'] < 30], band)
        if r and r['s1'] - r['s0'] >= 4 * tread:
            cuts.append((d, math.degrees(math.atan(r['slope']))))
    c = np.array(cuts, float).reshape(-1, 2)
    best, trials = None, []
    for d0 in range(-90, 91):
        near = c[np.abs(c[:, 0] - d0) <= 50]
        if len(near) < 5:
            continue
        cosd = np.cos(np.radians(near[:, 0] - d0))
        R = math.degrees(math.atan(np.median(np.tan(np.radians(near[:, 1])) / cosd)))
        err = np.abs(np.degrees(np.arctan(math.tan(math.radians(R)) * cosd)) - near[:, 1])
        agree = err <= 1.5
        if agree.sum() < 5 or np.ptp(near[agree, 0]) < 40:
            continue
        key = (int(agree.sum()), -float(err[agree].mean()))
        trials.append((d0, key[0]))
        if best is None or key > best[0]:
            best = (key, d0, R)
    if best is None:
        return None
    same = [d0 for d0, k in trials if k == best[0][0]]
    return {'off': best[1], 'lo': min(same), 'hi': max(same), 'rakeDeg': best[2]}


def fall_firm(f):
    """The fall line is firmly more than FALL_FIRM degrees off: every direction that fits as well is."""
    return f is not None and (f['lo'] > FALL_FIRM or f['hi'] < -FALL_FIRM)


def fall_turn(r):
    """Where the stand turns: its fall line is firmly off in the middle of the
    run, and the median of the fall lines found there and 4 m to either side
    (two or more) is more than FALL_FIRM degrees off. A section whose rows
    bend across its width faces the way most of it does; where its fall lines
    lie either side of the stand direction, or only the middle's is found,
    that direction stays. Returns the new stand direction, or None."""
    f, sides = r.get('fall'), r.get('fallSides') or []
    if not fall_firm(f):
        return None
    offs = [f['off']] + [s['off'] for s in sides if s is not None]
    if len(offs) < 2:
        return None
    m = float(np.median(offs))
    return round(r['standCompass'] + m) % 360 if abs(m) > FALL_FIRM else None


def fall_side_points(r):
    """Where the fall lines either side of the middle are read: FALL_SIDE_M
    along the rows from it, as measure_section reads them."""
    ax, ay = r['anchor'][:2]
    sc = math.radians(r['standCompass'])
    return [(ax + off * math.cos(sc), ay - off * math.sin(sc)) for off in (-FALL_SIDE_M, FALL_SIDE_M)]


def tread_plane(P, x, y, compass, half):
    """The treads' uphill direction (compass degrees) from a plane fitted in a
    square of side 2 * half just uphill of (x, y) along `compass`: the lowest
    point per 0.5 m cell, refitted three times on the cells within 0.4 m of
    it. None where the scan is too thin there."""
    E, N, Z = P
    sc = math.radians(compass)
    cx, cy = x + half * math.sin(sc), y + half * math.cos(sc)
    m = (np.abs(E - cx) < half) & (np.abs(N - cy) < half)
    if m.sum() < 30:
        return None
    px, py, pz = E[m] - cx, N[m] - cy, Z[m]
    key = ((px + half) / 0.5).astype(int) * 1000 + ((py + half) / 0.5).astype(int)
    o = np.lexsort((pz, key))
    key, px, py, pz = key[o], px[o], py[o], pz[o]
    first = np.r_[True, key[1:] != key[:-1]]
    px, py, pz = px[first], py[first], pz[first]
    keep = np.ones(len(pz), bool)
    for _ in range(4):
        (gx, gy, _c), *_ = np.linalg.lstsq(np.c_[px[keep], py[keep], np.ones(keep.sum())], pz[keep], rcond=None)
        keep = np.abs(pz - (gx * px + gy * py + _c)) < 0.4
    return math.degrees(math.atan2(gx, gy)) % 360


FACE_PLANE_M = (2.5, 3)  # metres: the half-sizes of the tread planes that must confirm a bend
FACE_PLANE_AGREE = 15    # degrees: each tread plane within this of its face, and turning at least this much


def fall_faces(r, sections, P):
    """Where a section's rows bend across its width: two of its fall lines
    (in the middle and either side) firmly more than FACE_APART degrees apart
    (their ranges of equally good directions that far apart), each read
    within the section (its point nearer the section's middle than any other
    section's in its tier, from `sections`), and the treads confirming it:
    at both of those points, planes fitted to the treads at each size in
    FACE_PLANE_M lie within FACE_PLANE_AGREE degrees of the face and turn
    the same way by at least that much. Returns (its faces, one per third in
    the side readings' order (compass degrees; a third whose reading is
    missing or outside the section takes the middle's), None) or (None, why)."""
    f = r.get('fall')
    if f is None:
        return None, None
    ax, ay = r['anchor'][:2]
    mates = [o['anchor'] for o in sections if o.get('anchor') and o['tier'] == r['tier'] and o['id'] != r['id']]
    own = lambda x, y: all(math.hypot(x - mx, y - my) > FALL_SIDE_M for mx, my, *_ in mates)
    pts = fall_side_points(r)
    sides = [s if s is not None and own(x, y) else None for s, (x, y) in zip(r.get('fallSides') or [None, None], pts)]
    read = [f] + [s for s in sides if s is not None]
    if max(a['lo'] - b['hi'] for a in read for b in read) <= FACE_APART:
        return None, None
    faces = [round(r['standCompass'] + (s or f)['off']) % 360 for s in (sides[0], None, sides[1])]
    turn = lambda a, b: (a - b + 180) % 360 - 180
    i, j = max(((0, 1), (0, 2), (1, 2)), key=lambda ij: abs(turn(faces[ij[1]], faces[ij[0]])))
    at = (pts[0], (ax, ay), pts[1])
    for half in FACE_PLANE_M:
        pi, pj = (tread_plane(P, *at[k], r['standCompass'], half) for k in (i, j))
        if pi is None or pj is None:
            return None, f'no tread plane ({half * 2:g} m)'
        if abs(turn(pi, faces[i])) > FACE_PLANE_AGREE or abs(turn(pj, faces[j])) > FACE_PLANE_AGREE:
            return None, f'treads {round(pi)}/{round(pj)} against faces {faces[i]}/{faces[j]} ({half * 2:g} m)'
        if turn(pj, pi) * turn(faces[j], faces[i]) <= 0 or abs(turn(pj, pi)) < FACE_PLANE_AGREE:
            return None, f'treads turn {turn(pj, pi):+.0f}, faces {turn(faces[j], faces[i]):+d} ({half * 2:g} m)'
    return faces, None


def faces_listing(park):
    """The sections whose rows bend across their width (`fall_faces`), as
    standFaces entries, and the bent readings the treads don't confirm."""
    P = load_points(park)[:3]
    d = json.load(open(f'tmp/lidar/{park}-measured.json'))
    found = [r for r in d['sections'] if r.get('found')]
    res = [(r['id'], *fall_faces(r, d['sections'], P)) for r in found]
    faces = [(i, fs) for i, fs, _ in res if fs]
    if faces:
        print('faces (standFaces):')
        for i, fs in faces:
            print(f"    {{ id: '{i}', facesDeg: {json.dumps(fs)} }},")
    kept = [f'{i} ({why})' for i, fs, why in res if why]
    if kept:
        print(f"bent readings the treads don't confirm (one direction): {'; '.join(kept)}")


TREAD_AGREE = 15  # degrees: tread readings within this of each other give a firm direction
TREAD_OFF = 10    # degrees: a firm tread direction further off the section's than this is wrong


def tread_direction(P, r):
    """The section's climb read on its treads: planes fitted (`tread_plane`)
    in 8 m and 12 m squares at the middle of its run, and in 5 m squares at
    each point its fall lines are read (`fall_side_points`), leaving out any
    more than 60 degrees off its direction (a patch on a structure). Returns
    the median of their offsets from the section's direction (degrees,
    clockwise), their spread and how many there are, or None with fewer
    than three."""
    C = r['standCompass']
    ax, ay = r['anchor'][:2]
    pts = fall_side_points(r)
    reads = [tread_plane(P, ax, ay, C, h) for h in (4, 6)] + [tread_plane(P, x, y, C, 2.5) for x, y in (pts[0], (ax, ay), pts[1])]
    offs = [(p - C + 180) % 360 - 180 for p in reads if p is not None]
    offs = [o for o in offs if abs(o) <= 60]
    if len(offs) < 3:
        return None
    return {'off': float(np.median(offs)), 'spread': max(offs) - min(offs), 'n': len(offs)}


TREAD_FALL_AGREE = 8  # degrees: the fall line in the middle within this of the treads confirms them


def treads_listing(park):
    """The sections whose treads give a firm direction (readings within
    TREAD_AGREE degrees of each other) more than TREAD_OFF degrees off
    theirs. Where the fall line read in the middle agrees with them (within
    TREAD_FALL_AGREE degrees) and is itself more than TREAD_OFF degrees off,
    two methods agree: a standRuns entry facing the mean of the two. Where
    it doesn't, the section is listed and kept."""
    P = load_points(park)[:3]
    d = json.load(open(f'tmp/lidar/{park}-measured.json'))
    both, alone = [], []
    for r in d['sections']:
        if not r.get('found') or r.get('fall') is None:
            continue
        t = tread_direction(P, r)
        if not t or t['spread'] > TREAD_AGREE or abs(t['off']) <= TREAD_OFF:
            continue
        f = r['fall']['off']
        if abs(f - t['off']) <= TREAD_FALL_AGREE and abs(f) > TREAD_OFF:
            both.append((r['id'], round(r['standCompass'] + (t['off'] + f) / 2) % 360, t, f))
        else:
            alone.append(f"{r['id']} (treads {t['off']:+.0f}, fall line {f:+d})")
    print(f'treads and fall line agree, more than {TREAD_OFF} degrees off the section direction (standRuns):')
    for i, to, t, f in both:
        print(f"    {{ ids: ['{i}'], facingDeg: {to} }}, // treads {t['off']:+.0f} ({t['n']} within {t['spread']:.0f}), fall line {f:+d}")
    if alone:
        print(f"treads firmly off, fall line disagreeing or within {TREAD_OFF} (kept): {'; '.join(alone)}")


def measure_section(P, sec, band):
    """One section: find its tier's run on the cut from home plate, then
    measure it on a cut along the stand direction through that run. Rows are
    counted as the profile counts them: where the band's run starts behind
    the profile's first rows (`rowsInFront`), those rows lie in front of it."""
    st, rows = sec['stand'], sec['stand']['rows']
    ahead = sec.get('rowsInFront', 0)
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
    # The rows the scan should see: up to the covered row where a source
    # gives it; a guessed covered row (the tier's cover is unsourced) is what
    # is being measured, so it does not limit them.
    open_rows = (rows if model_cover is None or not sec.get('coverSourced', True) else model_cover - 1) - ahead
    depth = run['s1'] - run['s0']
    if depth > 1.6 * max(open_rows, 1) * tread + 2:
        return {'id': sec['id'], 'tier': sec['tier'], 'found': False, 'anchor': [ax, ay, run['at'](0)],
                'why': f'run {depth / FT:.0f} ft deep, too deep for {open_rows} open rows (another stand joined to it)'}
    slope = run['slope']
    front = run['at'](run['s0'] + tread / 2)
    rise = tread * slope
    back = run['s0'] + (rows - ahead) * tread
    # The same run on four more cuts through the section, 2 and 4 m to either
    # side. Where this cut runs down an aisle's steps or onto a walkway, they
    # show it: the medians of their rake and front row (this cut's with
    # theirs, over the cuts whose run spans 5 or more rows, where 3 or more
    # do) are the stand's.
    sc = math.radians(sec['standCompass'])
    side = []
    for off in (-4, -2, 2, 4):
        s2, _, z2 = cut(P, ax + off * math.cos(sc), ay - off * math.sin(sc), sec['standCompass'], -60, 90)
        r2 = tier_run([r for r in runs_in(s2, z2) if -35 < r['s0'] < 30], band)
        if r2:
            side.append(r2)
    usable = [r for r in [run] + side if r['s1'] - r['s0'] >= 5 * tread]
    rake_across = med([math.degrees(math.atan(r['slope'])) for r in usable]) if len(usable) >= 3 else None
    front_across = med([r['at'](r['s0'] + tread / 2) - ahead * tread * r['slope'] for r in usable]) if len(usable) >= 3 else None
    # The rows' fall line here and 4 m to either side: the stand direction
    # comes from the club's seat map, which averages two faces where a ring
    # bends.
    fall = fall_line(P, ax, ay, sec['standCompass'], band, tread)
    fall_sides = [fall_line(P, ax + off * math.cos(sc), ay - off * math.sin(sc), sec['standCompass'], band, tread)
                  for off in (-FALL_SIDE_M, FALL_SIDE_M)]
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
    lip_row = None if lip is None else max(1, round((lip - run['s0']) / tread) + 1 + ahead)
    if lip_row is not None and lip_row > rows:
        lip, lip_row = None, None
    # A deck over the back rows hides the seats behind its edge from the air:
    # a scanner looks at most ~30° off vertical, so the seats show under it
    # only as far as its height over them times tan 30° (a few metres; more
    # under a high roof). Seats seen further past an edge, or with open sky
    # over some of them, are not under it: it is a bridge, a sign over a few
    # rows, or a structure beside the cut.
    flags = []
    # This cut's rake more than 2 degrees off the stand's: it isn't the
    # stand's. Down an aisle's steps it also starts more than 2 ft low.
    rake_deg = math.degrees(math.atan(slope))
    if rake_across is not None and abs(rake_deg - rake_across) > 2:
        flags.append('rakeOffAcross')
        if front - ahead * rise < front_across - 2 * FT and rake_deg > rake_across + 2:
            flags.append('aisle')
    # A cut firmly off the rows' fall line crosses them at an angle: it reads
    # the rake short (tan by cos t), and so do the cuts beside it.
    if fall_firm(fall):
        flags.append('cutOffFall')
    if lip is not None and run['s1'] > lip + 6:
        past = run['s1'] - lip
        n_bins = int(past / 0.5)
        seen_over = np.unique(((s[over & (s >= lip) & (s < lip + n_bins * 0.5)] - lip) / 0.5).astype(int))
        at_lip = z[over & (s >= lip) & (s <= lip + 1.0)]
        height = float(np.percentile(at_lip, 5)) - (run['c'] + slope * lip) if len(at_lip) else 0.0
        if len(seen_over) < 0.9 * n_bins or past > height * math.tan(math.radians(30)):
            lip, lip_row = None, None
            flags.append('seatsPastEdge')
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
    # A roof high above whose edge comes first, over a deck of seats that
    # starts further back under it (Truist Park's canopy over the 300 level):
    # that deck is the edge over these rows, the lower of the two.
    # A deck has headroom under the roof over its front (the roof's own back
    # truss, sloping up to meet it, does not).
    def headroom(r):
        zz = z[(np.abs(s - r['s0']) <= 0.5) & (z > r['z0'] + 1.5)]
        return float(zz.min()) - r['z0'] if len(zz) else 0.0
    if lip is not None and lip_low is not None:
        under_roof = [r for r in all_runs if lip + 2 < r['s0'] <= back and r['z0'] < lip_low - 2
                      and r['z0'] > run['c'] + slope * r['s0'] + 2.2 and r['slope'] >= math.tan(math.radians(15))
                      and headroom(r) >= 2.2]
        if under_roof:
            deck = min(under_roof, key=lambda r: r['s0'])
            lip, soffit, lip_low, above_front = deck['s0'], None, deck['z0'], deck['z0']
            lip_row = max(1, round((lip - run['s0']) / tread) + 1 + ahead)
            flags.append('deckUnderRoof')
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
    s2, across2, z2 = cut(P, ax + hs * math.sin(sc), ay + hs * math.cos(sc), (sec['standCompass'] + 180) % 360, 0, 330)
    ps2, pz2 = top_profile(s2, across2, z2, 60, 330)
    rim = governing(ps2, pz2, 0, hz)
    ft = lambda v: None if v is None else v / FT
    return {
        'id': sec['id'], 'tier': sec['tier'], 'found': True, 'rows': rows, 'anchor': [ax, ay, run['at'](0)],
        # The profile's front row: where its first rows lie in front of the
        # run (`rowsInFront`), the run's front carried down the slope by them.
        'frontFt': (front - ahead * rise) / FT, 'rakeDeg': rake_deg, 'visibleDepthFt': depth / FT,
        'rakeAcrossDeg': rake_across, 'frontAcrossFt': ft(front_across),
        'standCompass': sec['standCompass'], 'fall': fall, 'fallSides': fall_sides,
        'lipRow': lip_row, 'modelCoveredFrom': model_cover, 'coverAgrees': cover_agrees,
        'soffitFt': ft(soffit) if cover_agrees else None, 'lipSoffitFt': ft(soffit), 'lipLowFt': ft(lip_low),
        'aboveFrontFt': ft(above_front),
        'backFt': None if g is None else g[1] / FT, 'backSetbackFt': None if g is None else (g[0] - back) / FT,
        'rimFt': None if rim is None else rim[1] / FT, 'rimDistFt': None if rim is None else rim[0] / FT,
        'roofFt': ft(roof), 'flags': flags,
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
    ahead = PARKS[park].get('rowsInFront', {})
    results = [{'id': sec['id'], 'tier': sec['tier'], 'found': False, 'why': 'skipped: ' + skip[sec['id']]} if sec['id'] in skip
               else measure_section(P, {**sec, 'coverSourced': data['tiers'][sec['tier']]['coverSourced'],
                                        'rowsInFront': ahead.get(sec['id'], ahead.get(sec['tier'], 0))}, bands[sec['tier']])
               for sec in data['sections'] if sec['tier'] in bands]
    tiers = {}
    for key in bands:
        rs = [r for r in results if r['tier'] == key and r['found']]
        n_all = sum(1 for r in results if r['tier'] == key)
        t = {'sections': n_all, 'found': len(rs)}
        t['coverDisagrees'] = sorted({f"{r['id']}: lip row {r['lipRow']}, sourced {r['modelCoveredFrom']}" for r in rs if not r['coverAgrees']})
        t['notFound'] = [f"{r['id']}: {r.get('why')}" for r in results if r['tier'] == key and not r['found']]
        # A cut that isn't the stand's (`rakeOffAcross`, `aisle`) or crosses
        # the rows at an angle (`cutOffFall`) leaves its rake (and, down an
        # aisle, its front row) out of the tier's.
        off = {'rakeDeg': ('rakeOffAcross', 'cutOffFall'), 'frontFt': ('aisle',)}
        for f in ('frontFt', 'rakeDeg', 'lipRow', 'soffitFt', 'lipSoffitFt', 'lipLowFt', 'backFt', 'backSetbackFt'):
            vals = [r[f] for r in rs if r[f] is not None and not any(g in r['flags'] for g in off.get(f, ()))]
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
    """Print each tier's measured values (feet, rounded) and, in the form
    used in stadiumStructures.ts, the sections whose soffit differs from them
    by more than 10% (at least 3 ft), and every section whose own front row,
    back (height, setback) or rake (where its run spans 9 or more rows)
    differs from the tier's at all, as `withFronts`, `withBacks` and
    `withRakes` maps. Soffits only where the scan saw the deck's face and the
    deck's edge agrees with the sourced covered row."""
    d = json.load(open(f'tmp/lidar/{park}-measured.json'))
    treads = {s['id']: s['stand'].get('treadFt') or 2.75 for s in load_sections(park)['sections']}
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
        soffits = clusters('soffitFt', soffit) if soffit is not None else {}
        pooled = {}
        for r in rs:
            o = []
            if r['id'] in soffits:
                o.append(('soffitHeightFt', r0(med([g['soffitFt'] for g in soffits[r['id']]]))))
            if o:
                pooled.setdefault(tuple(o), []).append(r['id'])
        for o, ids in pooled.items():
            vals = ', '.join(f'{k}: {v}' for k, v in o)
            print(f"   ...Object.fromEntries({json.dumps(sorted(ids))}.map((id) => [id, {{ {vals} }}])),".replace('"', "'"))
        # Every section whose own front row or back differs from the tier's
        # takes its own, unpooled: a foot higher or a few feet nearer moves
        # rows in or out of shade, so a tier's or a group's value is not close
        # enough.
        def paste(title, items):
            if not items:
                return
            print(f'   {title}:')
            line = ''
            for item in items:
                if line and len(line) + len(item) > 100:
                    print(line)
                    line = ''
                line = f'{line} {item}' if line else f'        {item}'
            print(line)
        # A cut down an aisle's steps starts below the seats: that section's
        # front row is the median of the cuts beside it.
        own_front = lambda r: r['frontAcrossFt'] if 'aisle' in r['flags'] else r['frontFt']
        paste('fronts (withFronts)', [f"'{r['id']}': {r0(own_front(r))}," for r in rs
                                      if r['frontFt'] is not None and front is not None and r0(own_front(r)) != r0(front)])
        own = {r['id']: (r0(r['backFt']), r0(r['backSetbackFt'])) for r in rs if r['backFt'] is not None and back is not None}
        paste('backs (withBacks)', [f"'{i}': [{h}, {s}]," for i, (h, s) in own.items() if (h, s) != (r0(back), r0(setback))])
        # A rake is a line fitted to the run's treads, which are steps: over a
        # few rows, where the run starts and ends on a step tips the line.
        # Refitted on only their first n rows, the runs of 12+ rows at six
        # parks (359 sections) come within 2 degrees of their whole run's
        # rake in 44% of sections at 3 rows, 80% at 8 and 90% at 9, with no
        # lean either way. So a section takes its own rake where its run spans
        # 9 or more rows, the cuts beside it agree (within 2 degrees of their
        # median) and its cut runs along the rows' fall line; otherwise it
        # keeps the tier's, the median over its sections, where noise that
        # doesn't lean evens out.
        paste('rakes (withRakes)', [f"'{r['id']}': {r0(r['rakeDeg'])}," for r in rs
                                    if r['rakeDeg'] is not None and rake is not None and r0(r['rakeDeg']) != r0(rake)
                                    and r['visibleDepthFt'] / treads.get(r['id'], 2.75) >= 9
                                    and r.get('rakeAcrossDeg') is not None and 'rakeOffAcross' not in r['flags']
                                    and 'cutOffFall' not in r['flags']])
    # Stand directions: a section whose fall line is firmly off its stand
    # direction turns to the median of its fall lines, where that is more
    # than 15 degrees off (`standRuns` entries, first in the park's list so
    # they win). One whose fall lines lie either side of its direction, or
    # with only the middle's found, keeps it.
    found = [r for r in d['sections'] if r.get('found')]
    turns = {}
    for r in found:
        to = fall_turn(r)
        if to is not None:
            turns.setdefault(to, []).append(r['id'])
    if turns:
        print('stand directions (standRuns, first in the list):')
        for to, ids in sorted(turns.items()):
            print(f"    {{ ids: {json.dumps(ids)}, facingDeg: {to} }},".replace('"', "'"))
    side_txt = lambda s: '-' if s is None else f"{s['off']:+d}"
    bends = [f"{r['id']} {r['fall']['off']:+d} (sides {', '.join(side_txt(s) for s in r['fallSides'])})"
             for r in found if fall_firm(r.get('fall')) and fall_turn(r) is None]
    if bends:
        print(f"firmly off but kept (fall lines either side of it, or only the middle's): {'; '.join(bends)}")


def cover_report(park):
    """Covered rows from the scan (option A). Per tier, the sections whose
    deck edge is more than 2 rows from the sourced covered row (or covers 3+
    rows the source leaves open). When most measured sections are, the tier
    takes the median edge row; sections more than 2 rows off it get their
    own. The underside at the edge: the bottom of its face where the scan
    sees one; otherwise the lowest structure seen there, or, if that is the
    front row of a deck of seats above (within 2 ft), that row less the
    park's measured deck depth (front row to lowest structure at the edges
    where both show; 9 ft if none do); never less than 9 ft above the floor
    of the first covered row the profile gets (the scan's edge, the tier's
    row or the source's). Prints the tier's values and the sections that
    differ, or that the tier's underside would leave under 9 ft. With each
    underside, the deck's front (the top of what a sun from behind meets at
    the edge): the front row of the deck of seats starting there, where it
    stands above the underside (by 2-15 ft); none for a roof, whose top is
    its underside."""
    d = json.load(open(f'tmp/lidar/{park}-measured.json'))
    data = load_sections(park)
    secs = {s['id']: s for s in data['sections']}
    r0 = lambda v: None if v is None else int(round(v))
    # How far a deck's lowest structure at its edge sits below its front row,
    # measured at this park's edges where both show (9 ft if fewer than three
    # do: one edge is not a measurement). More than 15 ft below, the lowest
    # structure is another, lower level's (suites under the deck of seats).
    drops = [r['aboveFrontFt'] - r['lipLowFt'] for r in d['sections'] if r['found'] and r.get('lipLowFt')
             and r.get('aboveFrontFt') and 2 < r['aboveFrontFt'] - r['lipLowFt'] <= 15]
    depth = float(np.median(drops)) if len(drops) >= 3 else 9.0
    # Where the deck above shows only its first row or two (too short to be
    # found as seats), its front row as measured on its own sections.
    deck_above = PARKS[park].get('deckAboveFt', {})
    print(f"deck depth below its front row: {depth:.1f} ft ({len(drops)} edges)")
    rows_out = []
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
            canopy = PARKS[park].get('canopyFt')
            edge_z = r['lipLowFt'] if r.get('lipLowFt') is not None else r.get('roofFt')
            if canopy is not None and l is not None and edge_z is not None and edge_z >= canopy:
                l = None
            edge_min = PARKS[park].get('edgeMinFt', {}).get(key)
            if edge_min is not None and l is not None and (r.get('lipLowFt') is None or r['lipLowFt'] < edge_min):
                l = None
            off = l is not None and abs(covered(st['rows'], l) - covered(st['rows'], m)) > 2
            under = None
            if l is not None and r['lipSoffitFt'] is not None:
                under = r['lipSoffitFt']
            elif l is not None and (r.get('lipLowFt') is not None or r.get('aboveFrontFt') is not None):
                # Too few points under the edge for its lowest structure: the
                # deck of seats seen starting there is the structure.
                under = r['lipLowFt'] if r.get('lipLowFt') is not None else r['aboveFrontFt']
                for above_front in (r.get('aboveFrontFt'), deck_above.get(key)):
                    if above_front is not None and under >= above_front - 2:
                        under = above_front - depth
                        break
            deck_front = None
            if l is not None:
                deck_front = next((f for f in (r.get('aboveFrontFt'), deck_above.get(key)) if f is not None), None)
            info.append({'id': r['id'], 'rows': st['rows'], 'm': m, 'l': l, 'off': off, 'under': under, 'deck_front': deck_front,
                         # The profile's own front row and rake: the floor the engine uses.
                         'front': st['frontRowHeightFt'], 'rise': st.get('treadFt', 2.75) * math.tan(math.radians(st['rakeDeg'])),
                         'face': r['lipSoffitFt'], 'low': r.get('lipLowFt'), 'above': r.get('aboveFrontFt')})
        n_off = sum(i['off'] for i in info)
        apply = n_off * 2 > len(info)
        lips = [i['l'] for i in info if i['l'] is not None]
        tier_row = int(round(float(np.median(lips)))) if apply and lips else None
        for i in info:
            # The row the profile gets: the scan's edge, the tier's, or the
            # source's. The underside is never less than 9 ft above its floor.
            i['own_row'] = (tier_row is not None and i['l'] is not None and abs(i['l'] - tier_row) > 2) or (tier_row is None and i['off'])
            i['row'] = i['l'] if i['own_row'] else (tier_row if tier_row is not None else i['m'])
            i['min'] = None if i['row'] is None else i['front'] + (i['row'] - 1) * i['rise'] + 9
            if i['under'] is not None and i['min'] is not None:
                i['under'] = max(i['under'], i['min'])
            # Not above the underside (a roof), or more than 15 ft above it: the
            # seats found at the edge are another, higher deck's.
            if i['deck_front'] is not None and (i['under'] is None or not i['under'] + 2 <= i['deck_front'] <= i['under'] + 15):
                i['deck_front'] = None
        unders = [i['under'] for i in info if i['under'] is not None]
        tier_under = r0(med(unders)) if unders else None
        fronts = [i['deck_front'] for i in info if i['deck_front'] is not None]
        tier_front = r0(med(fronts)) if fronts else None
        fmt = lambda v: '-' if v is None else f'{v:.0f}'
        print(f"{key}: {n_off}/{len(info)} off by >2 rows; tier -> {tier_row if apply else 'keep sourced'}; "
              f"underside {fmt(med(unders))} [{fmt(min(unders) if unders else None)}-{fmt(max(unders) if unders else None)}], "
              f"deck front {fmt(med(fronts))} [{fmt(min(fronts) if fronts else None)}-{fmt(max(fronts) if fronts else None)}] "
              f"(lowest {fmt(med([i['low'] for i in info if i['low']]))}, deck above {fmt(med([i['above'] for i in info if i['above']]))}, "
              f"face {fmt(med([i['face'] for i in info if i['face']]))} n{sum(1 for i in info if i['face'])})")
        rows_out += [{'tier': key, 'id': i['id'], 'row': i['row'], 'underFt': i['under'], 'deckFrontFt': i['deck_front']} for i in info]
        for i in info:
            differs = i['under'] is not None and tier_under is not None and abs(i['under'] - tier_under) > max(0.1 * tier_under, 3)
            # The tier's underside would sit under 9 ft over this section's covered row.
            too_low = i['min'] is not None and tier_under is not None and i['min'] > tier_under + 0.5
            front_differs = i['deck_front'] is not None and tier_front is not None and abs(i['deck_front'] - tier_front) > 3
            if i['own_row'] or too_low or (differs and tier_row is not None) or front_differs:
                print(f"   '{i['id']}': rows {i['rows']}, sourced {i['m']}, edge {i['l']}, row {i['row']}, underside {fmt(i['under'])}, deck front {fmt(i['deck_front'])}"
                      f" (lowest {fmt(i['low'])}, deck above {fmt(i['above'])}, face {fmt(i['face'])})")
    json.dump(rows_out, open(f'tmp/lidar/{park}-cover.json', 'w'), indent=1)


def fall_sheet(park):
    """Check pictures for the stand directions and faces. For each section
    whose fall line is firmly off its stand direction, or that has faces: the
    scan in a 40 m square around
    the middle of its run, shaded by slope (of the lowest point per 0.3 m
    cell: risers and aisle edges light, treads dark), with its stand direction
    (red) and fall line (cyan; where it turns, the direction it turns to)
    drawn from there, and a thin line across the square to each: the rows,
    the stand's front and the deck edges run along the true one's. A
    section's faces (magenta) are drawn where each is read, with a thin line
    across: the rows there run along it. Twelve to a sheet, north up:
    tmp/lidar/<park>-fall-<n>.png."""
    from PIL import Image, ImageDraw
    E, N, Z, field, dates = load_points(park)
    d = json.load(open(f'tmp/lidar/{park}-measured.json'))
    H, c, px = 20, 0.3, 3
    n = int(2 * H / c)
    T, k = n * px, px / c
    tiles = []
    for r in d['sections']:
        faces = fall_faces(r, d['sections'], (E, N, Z))[0] if r.get('found') else None
        if not r.get('found') or not (fall_firm(r.get('fall')) or faces):
            continue
        ax, ay, _ = r['anchor']
        m = (np.abs(E - ax) < H) & (np.abs(N - ay) < H)
        g = np.full((n, n), np.nan)
        np.fmin.at(g, (((N[m] - ay + H) / c).astype(int).clip(0, n - 1), ((E[m] - ax + H) / c).astype(int).clip(0, n - 1)), Z[m])
        # Empty cells take their nearest neighbour's height.
        g = g[tuple(ndimage.distance_transform_edt(np.isnan(g), return_distances=False, return_indices=True))]
        gy, gx = np.gradient(g, c)
        shade = np.clip(np.hypot(gx, gy) / 1.5, 0, 1)
        im = Image.fromarray((shade[::-1] * 255).astype(np.uint8)).resize((T, T), Image.NEAREST).convert('RGB')
        dr = ImageDraw.Draw(im)
        turn = fall_turn(r)
        fall_to = turn if turn is not None else (r['standCompass'] + r['fall']['off']) % 360
        for b, col in ((r['standCompass'], (255, 60, 60)), (fall_to, (0, 220, 255))):
            a = math.radians(b)
            dr.line([T / 2, T / 2, T / 2 + 15 * k * math.sin(a), T / 2 - 15 * k * math.cos(a)], fill=col, width=3)
            dr.line([T / 2 - 20 * k * math.cos(a), T / 2 - 20 * k * math.sin(a),
                     T / 2 + 20 * k * math.cos(a), T / 2 + 20 * k * math.sin(a)], fill=col, width=1)
        if faces:
            pts = fall_side_points(r)
            for b, (x, y) in zip(faces, (pts[0], (ax, ay), pts[1])):
                a, cx, cy = math.radians(b), T / 2 + (x - ax) * k, T / 2 - (y - ay) * k
                dr.line([cx, cy, cx + 6 * k * math.sin(a), cy - 6 * k * math.cos(a)], fill=(255, 0, 255), width=3)
                dr.line([cx - 8 * k * math.cos(a), cy - 8 * k * math.sin(a),
                         cx + 8 * k * math.cos(a), cy + 8 * k * math.sin(a)], fill=(255, 0, 255), width=1)
        dr.ellipse([T / 2 - 4, T / 2 - 4, T / 2 + 4, T / 2 + 4], fill=(255, 255, 0))
        dr.rectangle([0, 0, T, 14], fill=(0, 0, 0))
        dr.text((3, 2), f"{r['id']} ({r['tier']}): {r['standCompass'] % 360:.0f} -> {fall_to:.0f}, "
                        f"{'turns' if fall_turn(r) is not None else 'stays'}"
                        + (f"; faces {'/'.join(str(b) for b in faces)}" if faces else ''), fill=(255, 255, 0))
        tiles.append(im)
    for i in range(0, len(tiles), 12):
        sheet = Image.new('RGB', (4 * T, 3 * T), 'black')
        for j, im in enumerate(tiles[i:i + 12]):
            sheet.paste(im, ((j % 4) * T, (j // 4) * T))
        sheet.save(f'tmp/lidar/{park}-fall-{i // 12 + 1}.png')
    print(f'{park}: {len(tiles)} sections firmly off their fall line or with faces, {(len(tiles) + 11) // 12} sheets')


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
    elif cmd == 'fallsheet':
        fall_sheet(park)
    elif cmd == 'faces':
        faces_listing(park)
    elif cmd == 'treads':
        treads_listing(park)
