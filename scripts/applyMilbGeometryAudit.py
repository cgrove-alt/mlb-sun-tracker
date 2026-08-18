#!/usr/bin/env python3
"""Apply the 2026-08-18 MiLB coordinate + HP→CF audit to the TypeScript sources."""
from __future__ import annotations

import json
import math
import re
from pathlib import Path

ROOT = Path("/workspace")
COORDS = json.loads(Path("/tmp/milb_resolved_coords.json").read_text())
STADIUMS = ROOT / "src/data/milbStadiums.ts"
PROV = ROOT / "src/data/milbOrientationProvenance.ts"
GETTER = ROOT / "src/data/stadiumOrientationProvenance.ts"

REVIEWED = "2026-08-18"

# Visual HP→CF from north-up Esri tiles (compass overlay), plus published locks.
# Keys are stadium ids. Values are (orientation, precision, confidence, method, sources, notes).
VISUAL = {
    # AAA — published locks first
    "buffalo-bisons": (158, 12, "verified", "published-source",
        ["andrewclem.com Sahlen Field: CF orientation = SSE",
         "Esri World Imagery 2026-08-18: HP NW, CF SSE ~157°"],
        "CORRECTED from 65° (ENE). 65° was a ~90° foul-line/HP-CF error. Clem SSE + satellite agree."),
    "durham-bulls": (150, 12, "verified", "published-source",
        ["andrewclem.com Durham Bulls Athletic Park: CF orientation = SSE",
         "Esri World Imagery 2026-08-18: HP NW, CF SSE ~145–155°"],
        "CORRECTED from 90° (due E). 90° was the 1B-line, not HP→CF."),
    "norfolk-tides": (138, 12, "verified", "published-source",
        ["MiLB.com Harbor Park feature: diamond faces southeast onto the Elizabeth River",
         "Esri World Imagery 2026-08-18: HP NW, CF SE ~138°; river south/southeast of CF"],
        "CORRECTED from 325°. Published SE + satellite agree."),
    "nashville-sounds": (150, 12, "verified", "published-source",
        ["charliesballparks.com First Horizon Park: 'faces south-southeast'",
         "Wikipedia First Horizon Park: seating bowl views Nashville skyline to the south",
         "Esri World Imagery 2026-08-18: HP NW, CF SE ~145°"],
        "CORRECTED from 30°. Skyline-south + SSE sources + satellite agree."),
    "columbus-clippers": (45, 12, "verified", "satellite-visual",
        ["Esri World Imagery 2026-08-18: HUNTINGTON PARK roof text; HP SW, CF NE ~45°",
         "OSM way 41703332 baseball pitch grandstand-nearest-HP 224.9° — 180° swap of 45°"],
        "CORRECTED from 315° default. Roof-labeled satellite + OSM axis (HP/CF swapped on OSM) agree on NE."),
    "indianapolis-indians": (40, 15, "estimated", "satellite-visual",
        ["Esri World Imagery 2026-08-18: HP SSW, CF NNE ~36–50°"],
        "CORRECTED from 315° default. Single-source visual; JW Marriott north of CF."),
    "gwinnett-stripers": (52, 15, "estimated", "satellite-visual",
        ["Esri World Imagery 2026-08-18 at Gwinnett Field 34.04096,-83.99379 (not the airport pin): HP SW, CF NE ~52°",
         "OSM way 316553291 directed 219.7° is the 180° swap of ~40°"],
        "CORRECTED from 340° default. File lat/lon pointed at Briscoe Field airport ~7 km south."),
    "charlotte-knights": (49, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~49°"], "CORRECTED from 45° — confirmed NE."),
    "iowa-cubs": (39, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~39°"], "REFINED from 60°."),
    "jacksonville-jumbo-shrimp": (43, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~43°"], "CORRECTED from 350° default."),
    "lehigh-valley-ironpigs": (37, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~37°"], "CORRECTED from 90°."),
    "louisville-bats": (49, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~49°"], "CORRECTED from 225°."),
    "memphis-redbirds": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 340° default."),
    "omaha-storm-chasers": (135, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~135°"], "CORRECTED from 310°."),
    "rochester-red-wings": (47, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~47°"], "CORRECTED from 315° default."),
    "scranton-railriders": (52, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~52°"], "Confirmed NE vs 20° file."),
    "st-paul-saints": (65, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF ENE ~65°"], "CORRECTED from 180°."),
    "syracuse-mets": (0, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP S, CF due N ~0°"], "CORRECTED from 315° default. 0° is a measured N axis, not an unset default."),
    "toledo-mud-hens": (58, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~58°"], "CORRECTED from 90°."),
    "worcester-red-sox": (50, 15, "estimated", "satellite-visual",
        ["Nominatim Polar Park leisure=stadium 42.25727,-71.79996",
         "Esri World Imagery 2026-08-18: HP SW, CF NE ~45–55°"],
        "Prior 42.2672,-71.7978 was DCU Center downtown, not Polar Park. Orientation kept NE (~50°)."),
    "albuquerque-isotopes": (69, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 at corrected Isotopes Park pin: HP SW, CF ENE ~69°"], "CORRECTED from 5°. File lat/lon was ~3 km SE of the diamond."),
    "el-paso-chihuahuas": (70, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP WSW, CF ENE ~70°"], "CORRECTED from 340° default."),
    "las-vegas-aviators": (80, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP WSW, CF ENE ~80°"], "CORRECTED from 315° default."),
    "oklahoma-city-dodgers": (70, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 Chickasaw Bricktown: HP SW, CF NE ~70°"], "CORRECTED from 5°. MLB venueId 2521 still resolves to Knights Stadium — coords from Wikipedia."),
    "reno-aces": (58, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~58°"], "CORRECTED from 340° default."),
    "round-rock-express": (60, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~60°"], "CORRECTED from 340° default."),
    "sacramento-river-cats": (20, 15, "estimated", "published-source",
        ["Same physical park as MLB Athletics / Sutter Health Park (stadiums.ts orientation 20°, 2026-05-13 Esri + OSM PCA 27.5°)",
         "2026-08-18 MiLB visual ~50–60° and OSM directed 58.9° disagree with the Athletics 20° row by ~35°"],
        "Kept lockstep with stadiums.ts Athletics 20°. Do not invent a midpoint. Joint GIS remeasure of Sutter Health Park is outstanding. File was 340°."),
    "salt-lake-bees": (64, 15, "estimated", "satellite-visual",
        ["Wikipedia / Nominatim The Ballpark at America First Square 40.5497,-112.0225",
         "Esri World Imagery 2026-08-18: HP WSW, CF ENE ~64°"],
        "NEW 2025 Daybreak park. MLB API venueId still points at Smith's Ballpark downtown."),
    "sugar-land-space-cowboys": (108, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP WNW, CF ESE ~108°"], "CORRECTED from 340° default."),
    "tacoma-rainiers": (60, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~60°"], "CORRECTED from 340° default."),

    # AA
    "akron-rubberducks": (42, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~42°"], "Confirmed NE."),
    "altoona-curve": (157, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SSE ~157°"], "CORRECTED from 20°."),
    "binghamton-rumble-ponies": (42, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~42°"], "CORRECTED from 315° default."),
    "bowie-baysox": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 350° default."),
    "erie-seawolves": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 340° default."),
    "harrisburg-senators": (143, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~143°"], "CORRECTED from 250°."),
    "hartford-yard-goats": (87, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~87°"], "CORRECTED from 350° default."),
    "new-hampshire-fisher-cats": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "Confirmed NE vs 55° file."),
    "portland-sea-dogs": (34, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SSW, CF NNE ~34°"], "CORRECTED from 315° default."),
    "reading-fightin-phils": (55, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~55°"], "Confirmed NE."),
    "richmond-flying-squirrels": (98, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~98°"], "CORRECTED from 350° default."),
    "somerset-patriots": (90, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~90°"], "CORRECTED from 315° default."),
    "birmingham-barons": (58, 15, "estimated", "satellite-visual",
        ["Esri World Imagery 2026-08-18: HP SW, CF NE ~58°",
         "OSM way 293307866 directed 93° (due E) — 35° from the visual; Wikipedia 'east' is the loose octant"],
        "CORRECTED from 350° default. Visual NE used; OSM/published-east disagree by ~35°, so estimated not verified."),
    "biloxi-shuckers": (96, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~96°"], "CORRECTED from 20°."),
    "chattanooga-lookouts": (323, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SE, CF NW ~323°"], "CORRECTED from 115°. Hillside park faces the river/downtown to the NW."),
    "columbus-clingstones": (135, 15, "estimated", "satellite-visual",
        ["Wikipedia Synovus Park / Golden Park 32.45235,-84.99154",
         "Esri World Imagery 2026-08-18: HP NW, CF SE ~135°"],
        "NEW 2025 home (ex-Mississippi Braves). MLB API venueId still Trustmark Park, Pearl MS."),
    "montgomery-biscuits": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 340° default."),
    "pensacola-blue-wahoos": (135, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~135°"], "CORRECTED from 225°."),
    "rocket-city-trash-pandas": (65, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 at Toyota Field Madison AL: HP SW, CF ENE ~65°"], "CORRECTED from 340°. File pin was ~13 km east of the diamond."),
    "knoxville-smokies": (135, 15, "estimated", "satellite-visual",
        ["Wikipedia / Nominatim Covenant Health Park 35.97221,-83.91438",
         "Esri World Imagery 2026-08-18: HP NW, CF SE ~135°"],
        "NEW 2025 downtown Knoxville park. MLB API still 2011 Smokies Stadium in Kodak."),
    "amarillo-sod-poodles": (53, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~53°"], "REFINED from 25°."),
    "arkansas-travelers": (139, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~139°"], "CORRECTED from 340° default."),
    "corpus-christi-hooks": (35, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SSW, CF NNE ~35°"], "CORRECTED from 340° default."),
    "frisco-roughriders": (83, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~83°"], "CORRECTED from 50°."),
    "midland-rockhounds": (49, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~49°"], "CORRECTED from 340° default."),
    "northwest-arkansas-naturals": (50, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~50°"], "CORRECTED from 340° default."),
    "san-antonio-missions": (103, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF ESE ~103°"], "CORRECTED from 315° default. File pin was ~13 km east of Nelson Wolff."),
    "springfield-cardinals": (41, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~41°"], "CORRECTED from 310°."),
    "tulsa-drillers": (131, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~131°"], "CORRECTED from 340° default."),
    "wichita-wind-surge": (49, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~49°"], "REFINED from 10°."),

    # A+
    "aberdeen-ironbirds": (90, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~90°"], "CORRECTED from 340° default."),
    "asheville-tourists": (105, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 HomeTrust / McCormick Field: HP W, CF ESE ~105°"], "CORRECTED from 90°."),
    "bowling-green-hot-rods": (48, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~48°"], "CORRECTED from 315° default."),
    "brooklyn-cyclones": (135, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~135°"], "CORRECTED from 195°."),
    "greensboro-grasshoppers": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 340° default."),
    "greenville-drive": (56, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~56°"], "CORRECTED from 340° default."),
    "hickory-crawdads": (42, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~42°"], "Confirmed NE."),
    "hudson-valley-renegades": (127, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~127°"], "CORRECTED from 350° default."),
    "jersey-shore-blueclaws": (68, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF ENE ~68°"], "CORRECTED from 10°."),
    "rome-braves": (0, 15, "estimated", "satellite-visual",
        ["Wikipedia AdventHealth Stadium 34.28583,-85.16722",
         "Esri World Imagery 2026-08-18: HP S, CF due N ~0°"],
        "CORRECTED from 340° default. File pin was ~4 km SW. 0° is a measured N axis. Team rebranded Rome Emperors; id kept."),
    "wilmington-blue-rocks": (355, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SSE, CF NNW ~355°"], "CORRECTED from 340° default. Near-north measured axis."),
    "winston-salem-dash": (49, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~49°"], "REFINED from 20°."),
    "beloit-sky-carp": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 340° default."),
    "cedar-rapids-kernels": (54, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~54°"], "REFINED from 70°."),
    "dayton-dragons": (87, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~87°"], "CORRECTED from 55°."),
    "fort-wayne-tincaps": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "Confirmed NE."),
    "great-lakes-loons": (90, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~90°"], "CORRECTED from 340° default."),
    "lake-county-captains": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 340° default."),
    "lansing-lugnuts": (0, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP S, CF due N ~0°"], "CORRECTED from 315° default. 0° is a measured N axis, not an unset default."),
    "peoria-chiefs": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 65°."),
    "quad-cities-river-bandits": (130, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~130°"], "REFINED from 160°."),
    "south-bend-cubs": (48, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~48°"], "REFINED from 90°."),
    "west-michigan-whitecaps": (50, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~50°"], "CORRECTED from 315° default."),
    "wisconsin-timber-rattlers": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 315° default."),
    "eugene-emeralds": (133, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~133°"], "CORRECTED from 340° default."),
    "everett-aquasox": (65, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 Funko Field: HP SW, CF ENE ~65°"], "CORRECTED from 340° default."),
    "hillsboro-hops": (164, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NNW, CF SSE ~164°"], "CORRECTED from 315° default."),
    "spokane-indians": (90, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~90°"], "CORRECTED from 330°."),
    "tri-city-dust-devils": (180, 15, "estimated", "satellite-visual",
        ["Nominatim Gesa Stadium 46.26632,-119.17192",
         "Esri World Imagery 2026-08-18: HP N, CF due S ~180°"],
        "CORRECTED from 340° default. API pin was 450 m north of the bowl. 180° is a measured S axis."),
    "vancouver-canadians": (225, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 Nat Bailey: HP NE, CF SW ~225°"], "CORRECTED from 45°. Unusual SW axis; single-source visual."),

    # A
    "fresno-grizzlies": (135, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~135°"], "CORRECTED from 315° default."),
    "inland-empire-66ers": (58, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~58°"], "CORRECTED from 340° default."),
    "lake-elsinore-storm": (44, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~44°"], "CORRECTED from 315° default."),
    "modesto-nuts": (158, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SSE ~158°"], "CORRECTED from 40°."),
    "rancho-cucamonga-quakes": (68, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF ENE ~68°"], "CORRECTED from 315° default."),
    "san-jose-giants": (152, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SSE ~152°"], "CORRECTED from 50°."),
    "stockton-ports": (135, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~135°"], "CORRECTED from 50°."),
    "visalia-rawhide": (105, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF ESE ~105°"], "CORRECTED from 315° default."),
    "augusta-greenjackets": (94, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~94°"], "CORRECTED from 225°."),
    "carolina-mudcats": (86, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~86°"], "CORRECTED from 340° default."),
    "charleston-riverdogs": (62, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF ENE ~62°"], "REFINED from 10°."),
    "columbia-fireflies": (68, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF ENE ~68°"], "CORRECTED from 340° default."),
    "delmarva-shorebirds": (117, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP WNW, CF ESE ~117°"], "CORRECTED from 90°."),
    "down-east-wood-ducks": (90, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP W, CF E ~90°"], "CORRECTED from 40°."),
    "fayetteville-woodpeckers": (38, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~38°"], "REFINED from 10°."),
    "fredericksburg-nationals": (48, 15, "estimated", "satellite-visual",
        ["Nominatim Virginia Credit Union Stadium 38.31827,-77.50898",
         "Esri World Imagery 2026-08-18: HP SW, CF NE ~45–50°"],
        "CORRECTED from 340° default. API pin was 300 m west (stadium sat on the tile edge)."),
    "kannapolis-cannon-ballers": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 340° default."),
    "lynchburg-hillcats": (340, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SSE, CF NNW ~340°"], "Satellite-visual NNW. 340° here is measured, not the copy-paste default."),
    "myrtle-beach-pelicans": (135, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SE ~135°"], "CORRECTED from 340° default."),
    "salem-red-sox": (150, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP NW, CF SSE ~150°"], "CORRECTED from 25°."),
    "bradenton-marauders": (55, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~55°"], "CORRECTED from 0° unset-looking value."),
    "clearwater-threshers": (48, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~48°"], "CORRECTED from 350° default."),
    "daytona-tortugas": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 70°."),
    "dunedin-blue-jays": (70, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF ENE ~70°"], "CORRECTED from 335°."),
    "fort-myers-mighty-mussels": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 Hammond Stadium: HP SW, CF NE ~45°"], "CORRECTED from 335°. File pin was ~8 km east of the complex."),
    "jupiter-hammerheads": (60, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 Roger Dean Chevrolet Stadium: HP SW, CF ENE ~60°"], "CORRECTED from 335°. Shared with Palm Beach Cardinals."),
    "lakeland-flying-tigers": (45, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18: HP SW, CF NE ~45°"], "CORRECTED from 340° default."),
    "palm-beach-cardinals": (60, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 Roger Dean Chevrolet Stadium: HP SW, CF ENE ~60°"], "Same physical field as jupiter-hammerheads."),
    "st-lucie-mets": (50, 15, "estimated", "satellite-visual", ["Esri World Imagery 2026-08-18 Clover Park: HP SW, CF NE ~50°"], "CORRECTED from 335°. File pin was ~12 km SE of the diamond."),
    "tampa-tarpons": (60, 15, "estimated", "published-source",
        ["2025 Rays temporary-home orientation in stadiums.ts history / milbStadiums.ts 60°",
         "Esri World Imagery 2026-08-18 visual ~80° (20° from the authored 60°)"],
        "Kept 60° (Rays 2025 measurement) rather than averaging with the 80° visual. Estimated until GIS."),
}

NAME_UPDATES = {
    "gwinnett-stripers": ("Gwinnett Field", None),
    "rome-braves": (None, "Rome Emperors"),
    "oklahoma-city-dodgers": (None, "Oklahoma City Comets"),
}


def r5(x: float) -> float:
    return round(float(x) + 0.0, 5)


def js_str(s: str) -> str:
    return json.dumps(s, ensure_ascii=False)


def apply_stadiums() -> None:
    text = STADIUMS.read_text()
    by_id = {r["id"]: r for r in COORDS}
    missing = [i for i in by_id if i not in VISUAL]
    extra = [i for i in VISUAL if i not in by_id]
    if missing or extra:
        raise SystemExit(f"id mismatch missing={missing} extra={extra}")

    def patch_block(mid: str, block: str) -> str:
        rec = by_id[mid]
        ori, *_ = VISUAL[mid]
        lat, lon = r5(rec["lat"]), r5(rec["lon"])
        block = re.sub(r"latitude: -?[\d.]+", f"latitude: {lat}", block, count=1)
        block = re.sub(r"longitude: -?[\d.]+", f"longitude: {lon}", block, count=1)
        block = re.sub(r"orientation: -?[\d.]+", f"orientation: {ori}", block, count=1)
        name, team = NAME_UPDATES.get(mid, (None, None))
        if name:
            block = re.sub(r"name: '[^']+'", f"name: '{name}'", block, count=1)
        if team:
            block = re.sub(r"team: '[^']+'", f"team: '{team}'", block, count=1)
        return block

    # Split on stadium object starts that have id:
    parts = re.split(r"(?=\n  \{\n    id: ')", text)
    out = []
    seen = set()
    for part in parts:
        m = re.search(r"id: '([^']+)'", part)
        if m and m.group(1) in by_id:
            # only patch the first object in this chunk
            # find the matching closing of this object — objects are indented with 2 spaces
            end = part.find("\n  },")
            consume = 5
            if end == -1:
                end = part.find("\n  }")
                consume = 4
            if end == -1:
                out.append(part)
                continue
            head, tail = part[: end + consume], part[end + consume :]
            out.append(patch_block(m.group(1), head) + tail)
            seen.add(m.group(1))
        else:
            out.append(part)
    unseen = set(by_id) - seen
    if unseen:
        raise SystemExit(f"failed to patch {sorted(unseen)}")
    STADIUMS.write_text("".join(out))
    print(f"patched {len(seen)} stadiums in {STADIUMS}")


def write_provenance() -> None:
    rows = []
    for rec in COORDS:
        ori, prec, conf, method, sources, notes = VISUAL[rec["id"]]
        coord_note = rec.get("coordNote") or rec.get("coordSource")
        sources = list(sources) + [f"Coordinates: {coord_note} ({rec['lat']:.5f},{rec['lon']:.5f})"]
        rows.append({
            "stadiumId": rec["id"],
            "orientation": ori,
            "confidence": conf,
            "precisionDeg": prec,
            "method": method,
            "sources": sources,
            "notes": notes,
            "lastReviewed": REVIEWED,
        })

    lines = [
        "/**",
        " * MiLB Home-Plate→Center-Field Provenance",
        " *",
        " * Baseball `orientation` is the directed compass bearing from home plate",
        " * to center field (0 = north). This is the baseball counterpart of",
        " * `nflOrientationProvenance.ts`. Shade-side FAQ / OG copy uses it;",
        " * MiLB section shade % stays unpublished until real per-venue section",
        " * layouts exist (see SHADE-DIAGRAM-BACKLOG item 3).",
        " *",
        " * 2026-08-18 pass:",
        " *   1. Re-pinned every park to MLB Stats API / Wikipedia / Nominatim",
        " *      coordinates of the CURRENT 2026 home (not leftover venueIds).",
        " *   2. Read HP→CF from north-up Esri World Imagery tiles.",
        " *   3. Locked a handful of parks against published CF-orientation",
        " *      claims (Clem SSE, Harbor Park SE, First Horizon SSE).",
        " *   4. OSM baseball-pitch PCA / grandstand-nearest-HP was used only as",
        " *      a swap check — never shipped as the directed bearing on its own.",
        " *",
        " * Confidence rules match stadiumOrientationProvenance.ts:",
        " *   verified   — ≥2 independent sources agree within ~12°",
        " *   estimated  — a single satellite-visual or a known same-park lockstep",
        " *   unverified — no usable imagery / sources disagree with no winner",
        " *",
        " * Shared site: Roger Dean (jupiter-hammerheads + palm-beach-cardinals).",
        " */",
        "",
        "import type { OrientationProvenance } from './stadiumOrientationProvenance';",
        "",
        f"const REVIEWED = '{REVIEWED}';",
        "",
        "export const MILB_ORIENTATION_PROVENANCE: OrientationProvenance[] = [",
    ]
    for row in rows:
        srcs = ",\n      ".join(js_str(s) for s in row["sources"])
        lines.append("  {")
        lines.append(f"    stadiumId: {js_str(row['stadiumId'])},")
        lines.append(f"    orientation: {row['orientation']},")
        lines.append(f"    confidence: {js_str(row['confidence'])},")
        lines.append(f"    precisionDeg: {row['precisionDeg']},")
        lines.append(f"    method: {js_str(row['method'])},")
        lines.append(f"    sources: [")
        lines.append(f"      {srcs},")
        lines.append(f"    ],")
        lines.append(f"    notes: {js_str(row['notes'])},")
        lines.append(f"    lastReviewed: REVIEWED,")
        lines.append("  },")
    lines.append("];")
    lines.append("")
    PROV.write_text("\n".join(lines) + "\n")
    print(f"wrote {len(rows)} rows to {PROV}")


def patch_getter() -> None:
    text = GETTER.read_text()
    if "MILB_ORIENTATION_PROVENANCE" in text:
        print("getter already imports MiLB provenance")
        return
    text = text.replace(
        "import { NFL_ORIENTATION_PROVENANCE } from './nflOrientationProvenance';",
        "import { NFL_ORIENTATION_PROVENANCE } from './nflOrientationProvenance';\n"
        "import { MILB_ORIENTATION_PROVENANCE } from './milbOrientationProvenance';",
    )
    old = """export function getOrientationProvenance(stadiumId: string): OrientationProvenance | undefined {
  return MLB_ORIENTATION_PROVENANCE.find(p => p.stadiumId === stadiumId)
    ?? NFL_ORIENTATION_PROVENANCE.find(p => p.stadiumId === stadiumId);
}"""
    new = """export function getOrientationProvenance(stadiumId: string): OrientationProvenance | undefined {
  return MLB_ORIENTATION_PROVENANCE.find(p => p.stadiumId === stadiumId)
    ?? NFL_ORIENTATION_PROVENANCE.find(p => p.stadiumId === stadiumId)
    ?? MILB_ORIENTATION_PROVENANCE.find(p => p.stadiumId === stadiumId);
}"""
    if old not in text:
        raise SystemExit("getter function text not found")
    GETTER.write_text(text.replace(old, new))
    print("patched getOrientationProvenance to include MiLB")


def main() -> None:
    apply_stadiums()
    write_provenance()
    patch_getter()
    # sanity
    text = STADIUMS.read_text()
    for rec in COORDS:
        ori = VISUAL[rec["id"]][0]
        if f"id: '{rec['id']}'" not in text:
            raise SystemExit(f"missing id {rec['id']}")
        # unique orientation near id — just count
    print("done")


if __name__ == "__main__":
    main()
