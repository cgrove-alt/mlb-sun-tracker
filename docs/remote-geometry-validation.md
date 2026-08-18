# Remote stadium geometry validation

Exact solar position is deterministic from the event instant and stadium
coordinates. The release risk is physical geometry: row surfaces and every
structure that can interrupt the ray between a spectator and the sun.

This workflow does not require an on-site visit.

## Evidence stages

1. **Source located** — a metric lidar cloud, as-built plan, licensed venue
   mesh, or reproducible photogrammetry source covers the park. Discovery alone
   cannot publish shade.
2. **Remotely measured** — the stadium frame, rows, and obstructions have been
   extracted into a versioned artifact with complete coverage and quantified
   horizontal, vertical, and orientation uncertainty.
3. **Observation validated** — predictions pass a holdout of independent,
   time-stamped broadcast frames, venue cameras, or photographs that were not
   used to reconstruct the geometry.

Geometry currency is an independent, mandatory release check. A reconstruction
must be compared with current club/venue records and imagery after extraction;
known post-acquisition changes mark it `stale`, regardless of its measured
accuracy or holdout performance.

The executable release criteria live in `stadiumGeometryEvidence.ts`. Exact
row output requires 100% measurement coverage for its publication scope,
uncertainty no worse than one foot horizontally/vertically and one degree in
orientation, plus at least 30 held-out observations across three dates and a
25-degree solar-altitude span. Median shadow-boundary error must be no more
than one row and p95 error no more than two rows.

## USGS discovery

Run:

```bash
npm run audit-remote-geometry
npm run audit-remote-geometry -- --stadium=padres --json
```

The audit queries the official TNM Access API around each U.S. MLB stadium. It
does not accept a centre-tile hit as whole-park coverage: it groups tiles by the
official `/Projects/<project>/` download hierarchy and computes the exact union
of their axis-aligned bounds over a conservative 700-foot-radius square. At
least one same-project union must cover 99.9% of that footprint. Toronto is
reported separately because USGS does not cover Canada.

The 2026-08-08 audit found a complete-footprint candidate project for all 29
U.S. parks with zero request failures. Many of those complete projects are old;
the result only means the bounding boxes cover the discovery footprint. It is
not proof that the points are current, that every delivered tile contains data,
or that aerial returns captured undersides, rows, and interior deck surfaces.
For example, Angel Stadium's 2023 QL1 project covers only 67.86% of the audit
footprint; the newest complete project returned there is from 2011.

## Candidate heightfield extraction

Install the pinned research dependencies outside the application runtime, then
extract a sparse, stadium-centred surface:

```bash
python3 -m pip install --target /tmp/mlb-sun-lidar-python -r scripts/lidar-requirements.txt
PYTHONPATH=/tmp/mlb-sun-lidar-python:scripts python3 scripts/testLidarResearch.py
PYTHONPATH=/tmp/mlb-sun-lidar-python:scripts python3 scripts/extractUsgsLidarHeightfield.py \
  west.laz candidate-heightfield.json \
  --additional-input=east.laz \
  --stadium-id=dodgers \
  --longitude=-118.2400 \
  --latitude=34.0739 \
  --source-url=https://example.invalid/west.laz \
  --additional-source-url=https://example.invalid/east.laz
```

Every input tile is hashed and its URL and point count are recorded. The
extractor reads linear units from the source CRS and explicitly converts both
horizontal and vertical coordinates to international feet before cropping,
gridding, density, or height calculations. This matters because older USGS
state-plane sources may use U.S. survey feet while recent UTM products commonly
use metres. A deterministic renderer is available with
`scripts/renderLidarHeightfield.py` for the mandatory visual completeness check.
The output is always stamped `candidate-heightfield` and
`publication.eligible=false`. Promotion requires row segmentation, change
detection against current imagery, uncertainty measurement, and the independent
observation holdout.

## Sampling and repeatability audit

The heightfield is a visual discovery artifact. The metric audit separately
measures point occupancy at one-, two-, three-, and six-foot scales, compares
independent flight-line source IDs, segments connected candidate surfaces, and
records every release blocker:

```bash
PYTHONPATH=/tmp/mlb-sun-lidar-python:scripts python3 scripts/analyzeUsgsLidarStadium.py \
  west.laz candidate-metric-analysis.json \
  --additional-input=east.laz \
  --stadium-id=dodgers \
  --longitude=-118.2400 \
  --latitude=34.0739 \
  --center-field-bearing-deg=135 \
  --source-url=https://example.invalid/west.laz \
  --additional-source-url=https://example.invalid/east.laz \
  --metadata-url=https://example.invalid/metadata \
  --acquisition-report-url=https://example.invalid/report.pdf \
  --footprint-vertex=-430,-260 \
  --footprint-vertex=-250,-460 \
  --footprint-vertex=170,-470
```

Pass the complete reviewed footprint (at least three vertices), not the
abbreviated example above. Known post-acquisition change URLs must be supplied
with repeated `--known-current-change-url` arguments. Their presence marks the
artifact stale and adds a hard release blocker.

The unit-correct Petco v2 run retained 298,603 non-noise returns from point-source IDs 403
and 404. One-foot cells had 32.63% sampling coverage and only 3.19% coverage by
both flight lines. Stable, non-edge cells agreed vertically (0.37 ft p95 at the
one-foot grid), but the whole two-source sample had a 29.822 ft p95 range due to
edges and mixed vertical surfaces. Those are useful diagnostics, not row
geometry: neither one-foot sampling nor independent coverage approaches the
required 100%, and the 2014 geometry is stale.

### Dodger Stadium multi-tile pilot

The strongest next open-air candidate required two adjacent official
`CA_LosAngeles_B23` tiles, not merely the centre tile. Their hashes account for
53,028,313 source points, and the visually reviewed stitched heightfield contains
the complete stadium bowl and surrounding obstruction field. LAS GPS timestamps
inside the reviewed footprint span 2023-11-22T06:57:01Z through
2023-12-04T09:16:03Z.

The v2 metric audit retained 2,008,094 non-noise footprint returns. One-foot
sampling coverage is 92.83%, while two-flight-line coverage is 69.06%; two-foot
coverage rises to 99.92% and 99.78%, respectively. Those numbers establish a
useful reconstruction candidate, not exact rows. The official project metadata
specifies 0.35 m nominal point spacing, a 10 cm RMSEz vertical accuracy class,
and relative vertical checks. It does not establish stadium-surface horizontal
accuracy, semantic row segmentation, or complete overhang undersides.

The club also records post-acquisition 2024 relocation of the Top Deck Japanese
stone lantern and refreshed pavilion benches. Even though the club says the
2024-2025 clubhouse work is not noticeable from the seating bowl, that does not
certify every current sun-casting obstruction. The source is therefore marked
stale and every public exact result remains blocked.

### Angel Stadium source and categorical map

The recent `CA_CaliforniaGaps_B23` centre tile was downloaded and rendered, but
the visual shows a truncated eastern bowl and the exact same-project union covers
only 67.86% of the discovery footprint. It is registered as partial source
evidence with zero measured coverage. The Angels' official sun-and-shade PDF is
also retained as categorical context: it labels broad shaded, partial-sun, and
direct-sun areas and explicitly says conditions change with time of day and time
of year. It is not timestamped row-boundary evidence and is never counted as an
independent holdout.

### Citizens Bank Park 2024-2025 source

The official `PA_17County_D24` tile `18SVK485417` covers the complete stadium
footprint. A clean download is 163,167,866 bytes, has SHA-256
`42736a15761cc50c8d513df50a9ff0ae34b1cfb05fc053e2b39a761216907746`, and
decompresses to all 28,721,465 points declared by its LAS header. Point-level
GPS time establishes stadium passes on 2024-12-17 and 2025-04-02 rather than
relying on the broader project collection interval.

The v2 audit retained 3,479,061 non-noise returns inside a conservative
1,200-by-1,100-foot footprint. One-foot sampling coverage is 95.60% and
one-foot two-flight-line coverage is 68.36%. On stable cells with independent
passes, p95 mean-elevation disagreement is 0.295 ft. These results make the
source a strong reconstruction candidate but do not establish semantic rows,
overhang undersides, stadium-frame control, or horizontal extraction accuracy.

The source is also stale for whole-scope 2026 publication. A reproducible query
of the City of Philadelphia's official permit dataset returned 130 records for
the stadium property issued from 2024 through 2026-07-30. Nineteen records have
building, zoning, site, or minor-permit plan-review scopes. Post-scan work
includes replacement of topping slabs and drains at unspecified stadium
locations, bullpen and dugout renovations, a one-story team-store addition,
and a detached permanent tent. The team-store building and zoning records were
completed on 2026-03-26; the permanent-tent permits remain issued and do not
publish the plan that defines its size and location.

The official 2025 Art Commission submission supplies useful design control for
the team-store addition. Its site plan places the work at the southwest stadium
exterior near South 11th Street and Pattison Avenue, and its east elevation
labels the addition top at 33 feet 8.5 inches relative to the package's plan
datum. The package is a proposed design, not a current as-built survey, and it
does not by itself prove that the addition cannot cast a shadow into any ticket
row. Philadelphia also limits copies of building plans to property owners or
their authorized agents. The package is therefore retained as a bounded
obstruction-delta candidate, not promoted to measured current geometry.

Philadelphia's authoritative, continuously updated building-footprint service
also returns one exact-address stadium feature in EPSG:6347. It contains 15
polygon rings, 329 vertices, and base, approximate-height, and maximum-height
attributes. This is stronger provenance for a current exterior footprint
candidate than the public Esri row layer. It still provides no feature-level
capture or edit date, positional-accuracy figure, height-accuracy figure, or
height semantics suitable for ray casting. A planimetric footprint also omits
interior bowl structures and overhang undersides, so it cannot be extruded into
a publication model.

The Phillies' March 2026 release separately documents five new 25-foot LED
towers at the redesigned team-store entrance. Those towers are not resolved by
the Art Commission package. All identified deltas require current metric
position, elevation, and completeness evidence before obstruction currency can
pass.

The checksum-locked delta audit is
`sha256:7a0f9beafa7c141e310e47946bc11203d0688c55c5827268acf1da40049371f1`.
It verifies the official permit index, source PDF, rendered review pages, club
release, and current row-registration artifact before reproducing the blockers.

The strongest row-registration diagnostic was also rerun against the current
May 2026 provider artifact. Its locked 502-row final partition reproduced a
0.0479 m median centroid residual and a 0.5351 m p95 residual, or 1.76 ft. Only
89.64% of held-out centroids fall within one foot. The endpoint diagnostic is
worse at 1.3716 m p95 and has unproved endpoint semantics. The 2019 public
ArcGIS row polygons belong to an Esri community account, not the City or the
Phillies. The item is unlisted, has no description, copyright attribution, or
reported positional accuracy, and predates current work. This test is therefore
a source-consistency result rather than a physical survey. It fails the
one-foot release requirement and is never used as row measurement evidence.

Relevant official records:

- [Philadelphia building and zoning permits dataset](https://catalog.data.gov/dataset/licenses-and-inspections-building-and-zoning-permits)
- [Philadelphia authoritative building-footprint item](https://www.arcgis.com/home/item.html?id=83fd50fdc0704488b58ea76e706ec0d7)
- [2025 Citizens Bank Way Art Commission submission](https://www.phila.gov/media/20250905121054/1-Citizens-Bank-Way-submission.pdf)
- [Philadelphia building-plan copy restrictions](https://www.phila.gov/services/permits-violations-licenses/get-a-copy-of-a-license-permit-or-violation/)
- [Phillies 2026 stadium enhancements](https://www.mlb.com/press-release/press-release-phillies-unveil-enhancements-to-the-fan-experience-at-citizens-bank-park-ahead-of-home-opener-and-midsummer-classic)

### loanDepot Park 2018-2026 source boundary

The Marlins now have a defensible metric stadium frame, but not measured rows
or a current roof volume. The 2018 Miami-Dade and NOAA open-roof LiDAR reports
0.4967 ft horizontal accuracy and 0.39984 ft vertical accuracy at 95% confidence.
The 2021 source reports 3.8 ft absolute horizontal accuracy and 0.31 ft vertical
accuracy. A locked rigid correction uses seven manually reviewed training
controls and six disjoint held-out fixed hard-structure controls to register the
2021 local stadium frame to the 2018 absolute frame. The maximum holdout
residual is 0.4259 ft. Root-sum-square combination gives 0.6543 ft horizontal
uncertainty and 0.0308 degree orientation uncertainty. That accepts the frame
only. It does not accept any row, movable panel, or obstruction volume.

The current provider product exposes 2,037 assigned rows and 17,859 anchors
with complete internal provider-coordinate coverage. Those coordinates are a
venue rendering model. They are not independent physical measurements. The
strongest current world-registration candidate has 2.172 ft p95 plan
uncertainty and no measured row elevations. A two-epoch LiDAR candidate union
finds aerial surface support at 781 provider row locations, or 38.34% of the
assigned-row scope. None of those candidates has passed semantic seating-tread
review, and 1,256 assigned rows remain unresolved. No extrapolation is allowed.

The roof evidence is also partial. The upper center panel's top profile agrees
between the 2018 open parked state and the 2021 closed state with 0.2232 ft p95
profile residual inside the 0.5059 ft combined vertical envelope. A separate
locked 2024 shape test uses 553 training bins and 138 disjoint holdout bins.
The holdout p95 residual is 0.0531 ft. The 2024 source still reports 1.647 ft
horizontal accuracy, and the fitted shifts are nuisance alignment parameters,
not an absolute survey registration. The test supports one-dimensional upper
panel shape persistence through the 2024 acquisition only. It does not measure
absolute panel position, the lower panels in the open state, panel undersides,
track-beam surfaces, fully open stop coordinates, or the 2026 operational
configuration.

The official 2009 Construction Administration Agreement provides a specific
records route. Section 4.3(a) required County and City representatives to
receive schematic, design-development, and construction documents for review.
Section 5.1(f) required complete and accurate project records including Design
Documents, shop drawings, Change Orders, as-built drawings, permits, and
reports. Section 5.1(j) required delivery to County and City representatives at
Final Completion of an as-built Construction Document set revised to show the
as-built stadium and construction changes. These clauses prove required
delivery. They do not prove current possession, a current file index, or lawful
release of security-exempt stadium plans.

A checksum-locked read-only query of the official City iBuild GIS layer adds a
current permit-index snapshot without creating an account. The query returned
163 address-or-folio features, 145 unique plan numbers, 43 features without an
issued date, and 18 duplicated published permit identities. It includes 17
distinct post-2024 plan identifiers. Six building-workflow candidates are
active, approved, or submitted. The layer provides identifiers, broad scope,
and status, but no plan sheets, project descriptions, dimensions, location
within the property, original construction master-permit crosswalk, or final
as-built condition. Those permits are unresolved change candidates. They are
not proof that permanent stadium geometry changed. No records request has been
submitted, no account has been created, and no fee has been paid.

The agreement PDF itself has now received a complete visual review. All 391
pages were covered, with a high-resolution second pass over PDF pages 126
through 152. The file contains two 2009 site-context maps, systems narratives,
a project program and area schedule, construction schedules, budgets, and the
other stadium agreements. It contains no construction drawing index,
seating-bowl plan, row layout or dimension schedule, building section,
building elevation, roof-mechanization drawing, roof underside geometry,
as-built sheet, survey-control coordinates, or current-change drawing. This
closes the possibility that the needed geometry was merely hidden in the
image-only exhibit pages. It does not close the external records route.

The reproducible current-delta audit records five unresolved geometry classes
and zero resolved current metric features. Its full transitive freshness audit
passes across all 12 top-level artifacts and their checksum-locked inputs.
Publication remains blocked by zero measured row coverage, no complete current
obstruction volume, no measured roof undersides, no game-specific panel state,
and no independent shadow-boundary holdout.

Checksum-locked artifact versions are:

- current official-source acquisition: `sha256:4da9ee2aec3c7be188dbda1bfc44bbb70487d6de10dd2d75676b7a77f61c8934`
- rendered-page and HTML source review: `sha256:c9d3249bfaa4b213f53b70f6d86efeb867d4b86cb4df116cb471e1172303b8dc`
- accepted stadium-frame registration: `sha256:09544e44259be4feb1fea12029abd07da267bfda632c9f423030aef2b15588d6`
- provider row artifact: `sha256:8acdc53af396067317110dac35987287192ab749a2e38806ec244d8c77c08c80`
- row-surface candidate union: `sha256:a15ecb3dfa23a3983198bc69ac29d2bdba0d9baf3d7b113fab37fbb2c88afd23`
- provider world-registration candidate: `sha256:7e35f793d4bcae3666f0a4550186106fe5a8d7d097ec411eff53032afa0c0dc8`
- 2021 upper-panel cross-state profile: `sha256:6af766e8a7f3355afa4b5f9327ed454d7a69b6e7b7dd6d4e6a95ea3e533afd35`
- 2024 upper-panel shape holdout: `sha256:e358e6025e7fdaaa8412f52ad089674830847b8b7227595e85d65d3aa27f66ce`
- official City permit-index acquisition: `sha256:ea017af4fca37674107a9424a315c6e610a0c48e4c289feee412a29e588bd30c`
- official City permit-index review: `sha256:ec881e2581e8e42361f62551ea4b8dde4c2f00a3bc6349ccdf619a203cfe0f3f`
- complete CAA image-exhibit review: `sha256:f721f9684931fb46a7edeb9b23cf853ddd45a5c9a9484302d78de368aceb71b1`
- current geometry delta audit: `sha256:5c3fe20a669eb3d09ace779ea17eaef0757b68c42c85e6310054b7ccde0f91ae`
- current input-freshness audit: `sha256:7ffb6f77cd9d078c8290788928a3d78487071262772f7a8a22741ecd69ae2318`

Relevant official records:

- [Miami-Dade Construction Administration Agreement](https://www.miamidade.gov/govaction/legistarfiles/MinMatters/Y2009/091009min.pdf)
- [Miami-Dade legislative matter 090730](https://www.miamidade.gov/govaction/matter.asp?file=true&fileAnalysis=false&matter=090730&yearFolder=Y2009)
- [Miami Marlins roof mechanics](https://www.mlb.com/marlins/ballpark/roof)
- [City of Miami Building Records](https://www.miami.gov/Permits-Construction/Property-Information/Request-Building-Records-Microfilm)
- [City of Miami official iBuild permit GIS layer](https://gis.miami.gov/gis/rest/services/Maps/iBuildPermits/MapServer/0)
- [Florida Statutes section 119.071](https://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0100-0199/0119/Sections/0119.071.html)

### Rate Field 2022-2026 source boundary

Two official Cook County 2022 QL1 LAS tiles cover the declared
1,400-by-1,400-foot Rate Field footprint. They contain 84,069,170 total
returns, with stadium-local GPS time from 2022-04-27T06:07:58.390162Z through
2022-04-27T06:39:59.262316Z. The official Cook County contract reports 3.8 ft
horizontal accuracy at 95% confidence and 0.6 ft fundamental vertical accuracy
at 95% confidence. The horizontal source value is already 2.8 ft above the
one-foot release threshold.

The fail-closed surface audit retained 9,872,093 usable non-noise returns.
One-foot sampling coverage is 99.20%, and one-foot coverage by multiple source
flight lines is 93.21%. High density does not override the reported horizontal
accuracy, and top-down aerial returns do not prove every semantic row edge,
overhang underside, or closed shadow-casting volume.

The official 2025 Cook County ImageServer supplies a 0.5-foot orthophoto in
EPSG:6455. It is useful for current plan context, but the item metadata publishes
no ground-condition date or time, independent checkpoints, or numeric
horizontal positional accuracy. It is also two-dimensional. It cannot supply
row elevations, obstruction heights, or underside geometry.

The current Ticketmaster map provides direct provider coordinates for 3,007
row nodes and 42,300 places with complete internal map-coordinate coverage.
Regulation home-plate, second-base, and mound controls establish an internal
scale of 8.4203066 provider pixels per foot and an internal field axis. The
mound-distance residual is 0.824 ft. Those checks validate provider-plan
consistency only. The provider pixels are not georeferenced physical
measurements and contain no row elevations.

The current-source audit also found post-scan changes. MLB documents new Rate
Field signage and a renovated two-level flagship store. ISFA board records
describe 2026 capital repairs, but the public packets omit the detailed
exhibits, current metric as-builts, and the 2026 facilities assessment. The
public source inventory therefore cannot prove a complete current geometry
state.

ISFA's August 2026 procurement package adds a known future change. It specifies
one home-plate LED display with a minimum active area of 2.1 by 23.5 ft and two
dugout-lip displays, each with a minimum active area of 1.1 by 65.1 ft. The
contractor must design and install primary and secondary steel. The RFP
schedules construction to start after the 2026 season, so these displays are
not treated as installed on the 2026-08-10 assessment date. The required shop,
structural, and final as-built drawings are future deliverables. A later
publication model must reacquire the venue after installation.

Checksum-locked artifact versions are:

- Cook County LiDAR source manifest: `sha256:6fe679e0de1a9b35fb260705ab79d8501d18df9998e4209e59e04d952a577e20`
- current orthophoto acquisition: `sha256:a435822ced024fff1363efda183aa44168fa9010c2f232a6257c3060ce8bd0bf`
- assigned-row provider coordinates: `sha256:7c53e36cf9976ca08b2385e1fc20ed9b54e8e5a0f14b296f24b1b49f67c5aa20`
- provider field controls: `sha256:4b93ec93c9d958afd0aed97125518e0db1fc8ef624d4b1bea2eca0c21f6b8f99`
- current official-source acquisition: `sha256:1158883e1d6e0e4cd650e3f5149abf1f5c7e60ebab748e666f40437ef542d7b6`
- current geometry delta audit: `sha256:763f480bdfd8d09a250a02a51ac0679ba2c62a84f80bbbfce1954ad14d99d474`
- current input-freshness audit: `sha256:abd63a67666be6635b4a1019bbd1349c55ec5a8424c28aa708c986ecf417d170`

Relevant official records:

- [Cook County 2022 LiDAR dataset](https://clearinghouse.isgs.illinois.edu/node/1879)
- [Cook County LiDAR contract](https://opendocs.cookcountyil.gov/procurement/contracts/2103-08021.pdf)
- [Cook County 2025 orthophoto](https://gis.cookcountyil.gov/imagery/rest/services/CookOrtho2025/ImageServer)
- [Rate Field rebrand](https://www.mlb.com/news/rate-and-white-sox-announce-rebrand-of-stadium-now-rate-field)
- [White Sox flagship store](https://www.mlb.com/whitesox/press-release/press-release-white-sox-and-fanatics-announce-long-term-omnichannel-retail-partnership)
- [ISFA board records](https://www.isfauthority.com/board-committee-meetings/)
- [ISFA procurement](https://www.isfauthority.com/procurement-process/)
- [ISFA field-level display RFP](https://www.isfauthority.com/wp-content/uploads/2026/08/RFP-Backstop-and-Dugout-LED-Display-08.07.26.pdf)
- [ISFA field-level display specifications](https://www.isfauthority.com/wp-content/uploads/2026/08/Backstop-and-Dugout-LED-Display-Technical-Specifications-07.31.26.pdf)

### T-Mobile Park 2021-2026 source boundary

Two official `WA_KingCounty_2021_B21` tiles cover the declared T-Mobile Park
footprint. Stadium-local returns span 2021-04-14T00:39:21.868073Z through
2021-04-14T01:07:51.344876Z. The project report gives 0.74 ft horizontal
accuracy at 95% confidence from a modeled error budget and 0.196 ft
projectwide non-vegetated vertical accuracy at 95% confidence. Those source
figures are promising, but they are not a stadium-local registration test.

The footprint audit retained 2,427,088 non-noise returns from three source
flight lines. One-foot sampling coverage is 73.34%, and one-foot coverage by
multiple flight lines is only 28.44%. The visual heightfield shows the field,
bowl, stacked decks, roof rails, and the roof panels in their east-side parked
position. It does not resolve every assigned row, every overhang underside, or
every operational roof position.

The current Ticketmaster provider map exposes 3,367 row nodes and 47,213 place
anchors with complete internal map-coordinate coverage. These remain provider
rendering coordinates, not physical measurements. After correcting the
State Plane US-survey-foot inverse transformation, the combined LiDAR alignment
places home plate at -122.3330016, 47.5910030 and fits a 47.52685-degree
center-field bearing. Its 572-row algorithmic holdout still has a 2.906 ft p95
plan residual. More decisively, separate fits to source flight lines 537, 538,
and 539 disagree by as much as 30.785 ft in position and 3.462 degrees in
bearing. The attractive combined overlay is therefore not stable enough to
pass either the one-foot or one-degree gate.

The 2021 source is also stale. Official Mariners records document the later
conversion of the former press box behind home plate into indoor and exterior
premium seating, a 13,000-square-foot Diamond Club expansion and renovated
exterior seating in the first eight rows behind home plate, and relocation of
the working press box to Terrace Club with a 104-seat capacity reduction. The
current premium inventory confirms that the Diamond Club and indoor-outdoor
Press Club products are in operation.

Current PFD records add two unresolved 2026 scopes. The December 2025 minutes
list seating upgrades and a new main LED board in the 2026 capital plan. A June
2026 provisional review says roughly 25% of seats throughout the ballpark have
been replaced, sometimes one at a time and sometimes by whole section, without
identifying the locations. The same review still labels the 2026 annual plan
in progress as of April. It also schedules lower-bowl seating work and roof
control repowering for 2027. The PFD records a qualitative statement that the
new board looks the same as the old board when it is off. That is useful
external-envelope evidence, but it does not publish panel supports, attachment
coordinates, or an as-built survey.

Checksum-locked audit versions are:

- source bundle: `sha256:924d39a19a16ab89de50c3b408ddd1be7a0b4403d40992a7dc77f968e156d12d`
- corrected combined registration diagnostic: `sha256:47310db532d4232e3804d6d428154a65784d1fe9491dc6e70ad38e93f3926994`
- flight-line registration repeatability audit: `sha256:aaefd472f701dfd929135acac3e59d0ddecf8aebd4df32427accaeced3c89681`
- current-geometry delta: `sha256:8a28ef545daad36fc8f24d626d8ec4137be068db5dcff83876371bff1ee453cc`

Relevant official records:

- [Mariners 2022 premium-project announcement](https://www.mlb.com/mariners/press-release/press-release-mariners-announce-new-premium-fan-amenities-coming-to-t-mobile-par)
- [Mariners 2023 Diamond Club unveiling](https://www.mlb.com/mariners/press-release/press-release-muckleshoot-diamond-club-unveiled-at-t-mobile-park)
- [Current Mariners premium seating inventory](https://www.mlb.com/mariners/tickets/premium)
- [Mariners 2026 main-board announcement](https://www.mlb.com/mariners/press-release/mariners-amazon-team-up-to-bring-world-s-largest-fire-tv-to-t-mobile-park)
- [Washington State Ballpark PFD board records](https://ballpark.org/board-meetings/)

### Oriole Park 2024-2026 source boundary

Two official `MD_4County_D24` LiDAR tiles cover the declared Camden Yards
footprint. The project-level source report gives 1.0732 ft horizontal accuracy
at 95% confidence and 0.2701 ft raw vertical accuracy at 95% confidence. The
horizontal value already exceeds the strict one-foot gate. The stadium audit
retained 1,585,899 non-noise returns from two flight lines, but one-foot
sampling coverage is 80.86% and one-foot two-flight-line coverage is only
31.05%. Raw returns therefore cannot establish complete row surfaces,
overhangs, or a one-foot stadium frame.

The official 2025 Maryland three-inch orthophoto is a useful current plan-view
candidate, not an accuracy statement. Its item records identify delivered
source tile `45088308.tif` in EPSG:6488, an exact 3,000 by 2,000 ft tile extent,
12,000 by 8,000 pixels, and a 0.25 ft native pixel size. The two duplicate
catalogue records have identical native raster properties. The service's
source-raster download endpoint returns an unsupported-operation error, and
the item metadata contain no embedded checkpoints, numeric horizontal
positional accuracy, raw camera imagery, or per-pixel seamline lineage.

Maryland also publishes two official as-flown camera-centre layers. Both
supply exterior orientation, local and UTC time fields, sun altitude, sun
azimuth, and ground sample distance. The 80% front and 80% side overlap layer
over Baltimore's high-rise area yields 25 plausible stadium-covering frames,
whose candidate times span 1,188.70 seconds. The 60% front and 30% side overlap
layer yields four plausible frames spanning 580.80 seconds. Exact camera
calibration, frame footprints, and mosaic pixel-to-frame lineage are not
published, so neither candidate interval meets the 30-second observation-time
gate. The high-overlap records identify March 10 while their layer description
omits March 10; the standard-overlap records identify March 12 while their
description omits March 12. Both conflicts remain explicit.

Baltimore DOT's official Survey Section map is stronger than an anonymous
control layer. It contains 135 Maryland State primary records, 135 Baltimore
projection primary records, 898 secondary controls, and 265 triangulation
points. However, all 898 embedded scan and verification fields are blank. The
map does not machine-label the primary coordinate attributes with datum,
realization, unit, epoch, adjustment, or numeric uncertainty. The Survey
Section says approximately 60,000 point-specific cards are held at 510
Fallsway. A published sample card shows the expected sketch, tie, azimuth,
distance, and coordinate fields but does not state confidence or current
recovery status. Nearby inventory points remain discovery leads until their
current cards and physical monuments are independently matched.

The December 2024 LiDAR is also stale. Maryland Stadium Authority records say
the first renovation phase was complete for 2026 Opening Day. It includes a
larger center-field video board, the new PureWager Pavilion below it, the
Truist Club in the former press-box area, two climate-controlled Club Level
bars, a right-field wall display, and new ribbon boards. The Right Field Flag
Court was under construction on 2026-03-26, and the current Orioles application
still describes it as set to open after the All-Star break. A later phase is
planned after the 2026 season. Official photographs and renderings locate these
change classes, but they publish no as-built coordinates, heights, camera
calibration, or overhang undersides.

Checksum-locked audit versions are:

- assigned-row provider coordinates: `sha256:a73e761b43a6ada7cc1af9032d4146c108ddd569e09db4fdb60ecfff0064e573`
- 2024 LiDAR acquisition: `sha256:6b28182f26dce9e27d87ba126362436a251a4726ad89ff55fa972e36274b95db`
- 2025 standard-overlap as-flown audit: `sha256:5c89fec64d90f06728fe1e319bbd0e9b02ee81fbb3505c0228546e1049b0111b`
- 2025 high-overlap as-flown audit: `sha256:c1b94bc63bd940578e64519fd2d7f06846cf0e55dfd3573e1ada608b842958a8`
- 2025 orthophoto catalogue metadata manifest: `sha256:d4a52f3ad9b0f323f886fedb251991bbb264a459d4d59aa262858fd922ddd9ce`
- Baltimore Survey Section map: `sha256:ca936c3568fed9942b7a0b97ec89df81e29264af44940963d06576b613a9e181`
- 2026 current-geometry delta: `sha256:e08348a287f6b05f028b720262462adbbafa793798351fc7bedd5790a80f699c`
- current input-freshness audit: `sha256:dc1b29ae9a9de7288dc073300a4b8fdca014f996a68a5c8dffd9a45453a015b0`

Relevant official records:

- [Maryland 2025 high-overlap as-flown camera centres](https://mdgeodata.md.gov/imap/rest/services/Imagery/MD_AsFlownPhotoCenters/FeatureServer/0)
- [Maryland 2025 standard-overlap as-flown camera centres](https://mdgeodata.md.gov/imap/rest/services/Imagery/MD_AsFlownPhotoCenters/FeatureServer/1)
- [Maryland three-inch imagery service](https://mdgeodata.md.gov/imagery/rest/services/ThreeInch/MD_ThreeInchImagery/ImageServer)
- [Baltimore DOT Survey Control Points map](https://www.arcgis.com/sharing/rest/content/items/38cdd9174711459eae78c2444a27e3d2)
- [Baltimore DOT Survey Section StoryMap](https://www.arcgis.com/sharing/rest/content/items/419b0282fae34630ba351d94fa7d0af2)
- [Maryland Stadium Authority Oriole Park renovation project](https://mdstad.com/projects/renovation-projects-oriole-park-camden-yards)
- [Maryland Stadium Authority 2026 completion release](https://mdstad.com/press-release/governor-moore-unveils-historic-stadium-upgrades-oriole-park-camden-yards-opening-day)
- [Official Orioles renovation application](https://www.mlb.com/orioles/ballpark/stadium-renovations)

### Daikin Park 2024-2026 source boundary

Four official `TX_Houston_B24` tiles cover the declared 900-by-900-foot
footprint. The stadium audit retained 833,933 non-noise returns, all carrying
the same point-source identifier. Stadium-local GPS times span only
2024-02-18T06:20:33.330459Z through 2024-02-18T06:20:39.066741Z. This is a
5.736-second nighttime record of one state of the retractable roof, moving
glass wall, and train.

The source project reports 1.05 ft horizontal accuracy at 95% confidence and
0.2087 ft raw fundamental vertical accuracy at 95% confidence. The horizontal
value exceeds the one-foot release gate. One-foot footprint sampling coverage
is 72.04%, while one-foot multi-flight-line coverage is zero. No independent
same-surface repeatability can be computed. A heightfield or top-surface mesh
from these returns remains a reconstruction candidate and cannot establish row
treads, overhang undersides, supports, or a watertight obstruction volume.

The current club-linked 3D Digital Venue product exposes 2,304
ticket-addressable assigned rows and 18,513 provider anchors, with complete
coverage inside that assigned-row product scope. Seven non-assigned-row zones
are excluded. The coordinates use an unregistered venue-local rendering frame
whose axis directions are not established. They are provider rendering
coordinates, not physical measurements, and no accepted registration to the
LiDAR or a surveyed world frame exists.

Current official sources also prevent a currency claim. The 2024 LiDAR follows
the main outfield display, ribbon-board, and center-field mezzanine installation
scheduled for Opening Day 2023, but it does not semantically recover their full
supports or undersides. It predates the naming-rights transition effective
2025-01-01 and the Home Run Train refurbishment unveiled 2025-03-27. The train
remains operational during introductions and home-run celebrations, and the
current envelope of its tender additions is not published. The engineer of
record describes a 580-foot-span retractable roof and a 115-foot-tall moving
glass left-field wall, but publishes no current coordinates for every allowed
position of either moving system.

The HCHSA Project Agreement supplies a defensible records path. Section 8.6
says the Project Contractor delivered marked drawings to the Sports Authority.
Defined Project Plans include concept, schematic, design-development, detailed
working, and Final Drawings and Specifications. Defined Project Submission
Matters include design packages, construction documents, change orders, scope
changes, and retractable-roof changes. Those provisions establish record
classes and an original custody chain, not the current geometry itself.

The official media API reports 893 records since 2024 but exposes 874 across
nine retrievable pages, leaving 19 inaccessible records. The 874 accessible
records include 255 PDFs and 198 filename or metadata candidates. No current
metric row plan, marked as-built drawing, roof-position geometry, survey-control
package, CAD, BIM, or point cloud was located in that bounded public index. A
local request draft asks specifically for those existing records without
submitting a form, accepting fees, creating an account, or disclosing personal
information.

The generic TNRIS orthoimagery statement of work does not close the gap. Its
3-inch standard allows 14.69 inches horizontal accuracy at 95% confidence, and
its 6-inch standard allows 29.37 inches. The source bundle contains no
Houston-delivery imagery, metadata, independent checkpoints, or delivery QA
report. A generic standard is not evidence that a particular current image was
delivered or passed at the stadium.

Checksum-locked artifact versions are:

- assigned-row provider coordinates: `sha256:625c1a2882ce5f2ac1667198a7d40e3f4b2b719ffe2160a758fc9d87204cb197`
- current official-source acquisition: `sha256:5f322805a3706bdbc6d7ee2276e48724bffa2f04df8f4234a75774988f5b9f46`
- official HCHSA media index: `sha256:c0367edfb81416af788036002ee5a5597193ba55d80113233fd97cd48d6aabce`
- current geometry delta audit: `sha256:d938ed71a8da16a5d1ec1998de9618cc4d0f4e97f6f57571bbad67ab5ae44f57`
- current input-freshness audit: `sha256:cab171dcaba236727fb91ad5988b324b0022b1dc8ddd51a69dd095a34e667d7a`

Relevant official and project-team records:

- [HCHSA Public Information](https://houstonsports.org/public-information/)
- [HCHSA Texas Public Information Act process](https://houstonsports.org/texas-public-information-act-requests/)
- [HCHSA Project Agreement](https://houstonsports.org/wp-content/uploads/Project_Agreement_Astros.pdf)
- [HCHSA Stadium Lease](https://houstonsports.org/wp-content/uploads/Stadium_Lease_Agreement_Astros.pdf)
- [Astros and Samsung 2023 display work](https://www.mlb.com/press-release/press-release-astros-partner-with-samsung-to-elevate-minute-maid-park-with-state)
- [Astros and Daikin naming-rights announcement](https://www.mlb.com/astros/press-release/release-astros-announce-ballpark-naming-rights-partnership-with-daikin-comfort-technologies)
- [Astros 2025 train refurbishment](https://www.mlb.com/astros/press-release/press-release-popular-astros-train-has-new-look-new-sponsor-in-2025)
- [Walter P Moore Daikin Park project](https://www.walterpmoore.com/projects/daikin-park)
- [TNRIS orthoimagery statement of work](https://cdn.tnris.org/documents/tx_orthoimagery_sow_v9.pdf)

Petco's 2014 cloud is explicitly stale for present-day whole-park publication.
Official Padres records document left-field seating/overhang work for 2015, a
new two-level right-center deck for 2016, the Gallagher Square terrace/deck
rebuild for 2024, and a raised Western Metal rooftop deck with a covered trellis
for 2025. It remains useful as a pipeline-development and historical control
source, but it cannot establish complete current obstruction geometry.

### Current Petco source status

The TNM centre-covering audit found only 2005 and 2014 acquisitions at Petco as
of 2026-08-08. A later publication or reprocessing date does not make an old
acquisition current. San Diego Regional GIS Council records say the region
collected new QL2 lidar in fall 2024 at a target density of four points per
square metre, but its 2026-02-26 minutes still described QA/QC as in progress
and anticipated publication later in 2026 or early 2027. Therefore:

- the new regional scan is the best identified base-geometry candidate, but is
  not treated as available until the actual point cloud and metadata publish;
- official 2015, 2016, 2024, and 2025 change records define mandatory
  change-detection zones even after that scan is obtained; and
- close-range photogrammetry, as-built drawings, or a licensed current venue
  model are still required wherever aerial lidar cannot resolve the undersides
  of overhangs, fascia, aisle/row edges, or retractable/movable elements.

Relevant official records:

- [San Diego Regional GIS Council February 2026 minutes](https://sdrgc.org/Minutes/Docs/20260226Minutes.pdf)
- [Petco 2015 left-field renovation](https://www.mlb.com/news/san-diego-padres-announce-left-field-renovations-for-2015/c-100712862)
- [Petco 2016 right-center social space](https://www.mlb.com/padres/news/padres-to-build-social-space-at-petco-park/c-159008892)
- [Gallagher Square renovation](https://www.mlb.com/press-release/release-padres-gallagher-square-renovation-5-28-23)
- [Western Metal Supply Co. renovation](https://www.mlb.com/padres/press-release/press-release-padres-to-renovate-petco-park-s-western-metal-supply-co-building)

## Observation protocol

- Retain the original URL, timestamp evidence, camera location/section, roof
  state, and weather visibility for every observation.
- Separate reconstruction observations from the holdout before calibration.
- Sample morning/afternoon, low/high solar altitude, both foul-line sides, and
  multiple seating levels.
- Label the observed shadow boundary by row or by a metric control surface.
- Never count duplicated frames from the same camera and instant as independent
  observations.
- Re-run the holdout after any geometry or orientation change. A versioned
  geometry artifact is publishable only with the matching validation result.

Raw holdout records must be passed through `summarizeShadowObservationHoldout`;
the helper rejects duplicate independence keys and timestamps without explicit
UTC offsets, derives solar altitude from the recorded instant and stadium
coordinates, excludes calibration/obscured frames, rejects replays and frames
whose live provenance is unresolved, and computes boundary-error metrics rather
than trusting a hand-entered pass flag.

### Official MLB footage discovery

Official MLB highlight metadata can be joined to the corresponding live-feed
play event by GUID without pretending that a clip's publication timestamp is
its capture time:

```bash
npm run build-mlb-observation-candidates -- \
  --stadium=padres \
  --game=777239 \
  --output=tmp/lidar/petco-observation-candidates.json
```

The Petco pilot used eight 2025 day games and produced 107 source-linked review
candidates representing 105 independent play events across eight stadium-local
dates and a 71.49-degree solar-altitude span. The two alternate video edits have
unique candidate IDs but deliberately share their play-level independence keys.
The manifest records MLB's canonical MP4, HLS, and trick-play assets and
provides a review queue ranked by likely seating views, solar altitude, and
reported weather. This ranking only saves reviewer time; it is not evidence.
Every record remains `publicationEligible=false` until a reviewer confirms the
live, unedited frame; exact timestamp uncertainty; documented camera location;
visible section and row boundary; atmospheric visibility; independence from
reconstruction data; and a matching versioned geometry artifact.

Use the repeatable seven-frame sampler before manual review:

```bash
swift scripts/extractVideoFrames.swift INPUT_VIDEO OUTPUT_DIRECTORY
```

The first reviewed pilot clip, MLB play GUID
`580ea49d-b534-3ec8-8fd7-ddf2cbc617ae`, demonstrates why candidate and
observation must remain separate. Seven frames across the 30.3-second clip show
field action and some background seating, but no unambiguous row-level shadow
boundary. The camera location, section, and frame-to-event time offset also
remain unproved, and one sampled frame is a replay transition. That clip is
therefore rejected from the holdout rather than being counted as weak evidence.

The first two priority-queue clips were also reviewed. The 2025-06-21 Tatis
homer was correctly demoted after MLB's feed reported cloudy conditions and the
frames showed no direct-sun row boundary. The 2025-09-01 Jackson homer produced
a genuinely useful current wide view at 24.46 degrees solar altitude. A
half-second review around that shot clearly shows tier- and field-scale shadow
structure, but the moving 1280x720 broadcast camera does not resolve one
unambiguous seating-row boundary; its exact camera control and frame-to-event
offset are also not established. It remains useful reconstruction context, but
is rejected from the row-error holdout. The next sunny Machado and partly-cloudy
Sheets home-run clips likewise provided current context but no stable,
row-resolved boundary. After five reviewed clips, the accepted holdout count is
still zero.
