# MLB Stadium Data Sources & Collection Plan

**Created:** 2026-01-27
**Step:** 1.2 - MLB Stadium Data Research & Collection Plan
**Purpose:** Document data sources and prioritization for collecting row-level stadium data for all 30 MLB stadiums

---

## Data Requirements

For each MLB stadium, we need to collect:

### Section-Level Data
- **Section identifiers**: Section numbers/names (e.g., "Section 100", "Bleachers")
- **Level classification**: field, lower, club, upper, suite, standing
- **Angle data**: baseAngle (0-360°), angleSpan (degrees)
- **Row details**: Row numbers, seats per row, elevation, depth
- **3D vertices**: 4 corner points (x, y, z coordinates)
- **Coverage**: Covered/uncovered status, overhang details
- **Distance & height**: From home plate
- **Rake angle**: Seating slope in degrees

### Obstruction Data
- **3D geometry**: Roofs, upper decks, overhangs, scoreboards
- **Mesh data**: Vertices and faces
- **Bounding boxes**: min/max coordinates
- **Material properties**: Opacity, reflectivity, shadow casting
- **Seasonal variations**: Retractable roofs

---

## Primary Data Sources

### 1. Official Team Websites & Seating Maps
**Reliability:** ★★★★★
**Data Available:** Section names, level classification, basic geometry

**All 30 MLB Teams:**
- Yankees: https://www.mlb.com/yankees/ballpark/seating-map
- Dodgers: https://www.mlb.com/dodgers/ballpark/seating-map
- Red Sox: https://www.mlb.com/redsox/ballpark/seating-map
- Giants: https://www.mlb.com/giants/ballpark/seating-map
- Cubs: https://www.mlb.com/cubs/ballpark/seating-map
- Cardinals: https://www.mlb.com/cardinals/ballpark/seating-map
- Braves: https://www.mlb.com/braves/ballpark/seating-map
- Mets: https://www.mlb.com/mets/ballpark/seating-map
- Astros: https://www.mlb.com/astros/ballpark/seating-map
- Rangers: https://www.mlb.com/rangers/ballpark/seating-map
- Diamondbacks: https://www.mlb.com/dbacks/ballpark/seating-map
- Reds: https://www.mlb.com/reds/ballpark/seating-map
- Padres: https://www.mlb.com/padres/ballpark/seating-map
- Pirates: https://www.mlb.com/pirates/ballpark/seating-map
- Rockies: https://www.mlb.com/rockies/ballpark/seating-map
- Orioles: https://www.mlb.com/orioles/ballpark/seating-map
- Nationals: https://www.mlb.com/nationals/ballpark/seating-map
- Twins: https://www.mlb.com/twins/ballpark/seating-map
- Guardians: https://www.mlb.com/guardians/ballpark/seating-map
- Phillies: https://www.mlb.com/phillies/ballpark/seating-map
- White Sox: https://www.mlb.com/whitesox/ballpark/seating-map
- Tigers: https://www.mlb.com/tigers/ballpark/seating-map
- Royals: https://www.mlb.com/royals/ballpark/seating-map
- Brewers: https://www.mlb.com/brewers/ballpark/seating-map
- Blue Jays: https://www.mlb.com/bluejays/ballpark/seating-map
- Angels: https://www.mlb.com/angels/ballpark/seating-map
- Marlins: https://www.mlb.com/marlins/ballpark/seating-map
- Rays: https://www.mlb.com/rays/ballpark/seating-map
- Athletics: https://www.mlb.com/athletics/ballpark/seating-map
- Mariners: https://www.mlb.com/mariners/ballpark/seating-map

### 2. Ticketing Platforms
**Reliability:** ★★★★☆
**Data Available:** Row ranges, seats per row, section geometry

- **StubHub**: https://www.stubhub.com/ - Interactive 3D views for many stadiums
- **SeatGeek**: https://seatgeek.com/ - 360° views, section photos
- **Ticketmaster**: https://www.ticketmaster.com/ - Official ticket seller, row details
- **Vivid Seats**: https://www.vividseats.com/ - Section reviews and photos

### 3. Stadium Architecture & Design Resources
**Reliability:** ★★★★☆
**Data Available:** 3D geometry, dimensions, elevations

- **HOK Sport (Populous)**: Many modern MLB stadiums designed by this firm
  - Globe Life Field, Yankee Stadium, Busch Stadium III, Truist Park
- **Ballparks.com**: https://www.ballparksofbaseball.com/ - Historical data, dimensions
- **Wikipedia Stadium Pages**: Detailed capacity, dimensions, history
- **Google Earth Pro**: Satellite imagery for coordinate measurements

### 4. Fan Resources & Photo Sites
**Reliability:** ★★★☆☆
**Data Available:** View photos, row experiences, shade reports

- **A View From My Seat**: https://aviewfrommyseat.com/ - Photos from specific seats
- **RateYourSeats.com**: https://www.rateyourseats.com/ - Seat reviews with photos
- **Reddit r/baseball**: User reports on shade, views, experiences
- **Team-specific subreddits**: Local knowledge

### 5. Google Maps & Satellite Imagery
**Reliability:** ★★★★☆
**Data Available:** Lat/lon, orientation, 3D building data

- **Google Maps 3D View**: Building heights, roof geometry
- **Google Earth Pro**: Measurement tools, historical imagery
- **Coordinates**: GPS coordinates for orientation calculations

### 6. Architectural Plans & Blueprints
**Reliability:** ★★★★★ (when available)
**Data Available:** Exact dimensions, elevations, materials

- **Public Records**: Some stadiums have filed plans available
- **Construction Documents**: Major renovations often documented
- **Stadium Tour Materials**: Sometimes include technical details

### 7. Sun Calculation Tools (for verification)
**Reliability:** ★★★★★
**Purpose:** Verify our calculations

- **SunCalc**: https://www.suncalc.org/ - Solar position calculator
- **NOAA Solar Calculator**: https://gml.noaa.gov/grad/solcalc/ - Official data
- **PVWatts Calculator**: https://pvwatts.nrel.gov/ - Solar angles

---

## Stadium Prioritization Tiers

### Tier 1: High-Priority (10 stadiums - 5 days)
**Criteria:** Highest attendance (2024-2025), iconic venues, best data availability

1. **Yankee Stadium** (New York Yankees)
   - Attendance: 3,800,000+ (2024)
   - Priority: Iconic venue, excellent data sources
   - Data Sources: MLB.com, StubHub 3D, extensive fan photos

2. **Fenway Park** (Boston Red Sox)
   - Attendance: 2,750,000+
   - Priority: Historic park, unique geometry
   - Data Sources: MLB.com, detailed architectural records

3. **Dodger Stadium** (Los Angeles Dodgers)
   - Attendance: 3,850,000+
   - Priority: Largest stadium, sun exposure critical
   - Data Sources: MLB.com, excellent satellite imagery

4. **Wrigley Field** (Chicago Cubs)
   - Attendance: 3,100,000+
   - Priority: Historic, unique roof/overhang
   - Data Sources: MLB.com, extensive renovations documented

5. **Oracle Park** (San Francisco Giants)
   - Attendance: 2,800,000+
   - Priority: Excellent data, coastal sun patterns
   - Data Sources: MLB.com, architectural firm data

6. **Camden Yards** (Baltimore Orioles)
   - Attendance: 2,500,000+
   - Priority: Blueprint for modern parks, great data
   - Data Sources: MLB.com, HOK Sport designs

7. **Petco Park** (San Diego Padres)
   - Attendance: 2,400,000+
   - Priority: Sunny climate, critical shade data
   - Data Sources: MLB.com, excellent 3D mapping

8. **Coors Field** (Colorado Rockies)
   - Attendance: 2,600,000+
   - Priority: High altitude, unique sun exposure
   - Data Sources: MLB.com, public architectural records

9. **Busch Stadium** (St. Louis Cardinals)
   - Attendance: 3,200,000+
   - Priority: Modern design, HOK Sport data
   - Data Sources: MLB.com, Populous architectural data

10. **T-Mobile Park** (Seattle Mariners)
    - Attendance: 2,300,000+
    - Priority: Retractable roof, complex geometry
    - Data Sources: MLB.com, extensive renovation docs

### Tier 2: Medium-Priority (10 stadiums - 5 days)
**Criteria:** Strong attendance, good data availability, regional importance

11. **Truist Park** (Atlanta Braves)
    - Attendance: 3,100,000+
    - Priority: New stadium (2017), excellent data
    - Data Sources: MLB.com, recent construction docs

12. **Minute Maid Park** (Houston Astros)
    - Attendance: 2,700,000+
    - Priority: Retractable roof, hot climate
    - Data Sources: MLB.com, HOK Sport designs

13. **Globe Life Field** (Texas Rangers)
    - Attendance: 2,400,000+
    - Priority: Newest MLB stadium (2020), best data
    - Data Sources: MLB.com, complete architectural docs

14. **Chase Field** (Arizona Diamondbacks)
    - Attendance: 2,100,000+
    - Priority: Retractable roof, extreme heat
    - Data Sources: MLB.com, detailed renovation records

15. **Great American Ball Park** (Cincinnati Reds)
    - Attendance: 2,100,000+
    - Priority: Modern design, riverfront location
    - Data Sources: MLB.com, HOK Sport data

16. **PNC Park** (Pittsburgh Pirates)
    - Attendance: 1,700,000+
    - Priority: Beautiful park, excellent geometry
    - Data Sources: MLB.com, architectural records

17. **Citi Field** (New York Mets)
    - Attendance: 2,300,000+
    - Priority: NY market, good data availability
    - Data Sources: MLB.com, Populous designs

18. **Nationals Park** (Washington Nationals)
    - Attendance: 1,900,000+
    - Priority: Modern design, capital location
    - Data Sources: MLB.com, HOK Sport data

19. **Target Field** (Minnesota Twins)
    - Attendance: 2,000,000+
    - Priority: Modern park, unique climate
    - Data Sources: MLB.com, Populous designs

20. **Progressive Field** (Cleveland Guardians)
    - Attendance: 1,800,000+
    - Priority: Classic modern design
    - Data Sources: MLB.com, HOK Sport data

### Tier 3: Standard-Priority (10 stadiums - 5 days)
**Criteria:** Complete MLB coverage, varied data availability

21. **Citizens Bank Park** (Philadelphia Phillies)
    - Attendance: 2,200,000+
    - Priority: Complete NL East coverage
    - Data Sources: MLB.com, standard ticketing data

22. **Guaranteed Rate Field** (Chicago White Sox)
    - Attendance: 1,500,000+
    - Priority: Chicago market completion
    - Data Sources: MLB.com, renovation records

23. **Comerica Park** (Detroit Tigers)
    - Attendance: 1,600,000+
    - Priority: HOK Sport design, good data
    - Data Sources: MLB.com, architectural records

24. **Kauffman Stadium** (Kansas City Royals)
    - Attendance: 1,600,000+
    - Priority: Classic stadium, renovated
    - Data Sources: MLB.com, renovation docs

25. **American Family Field** (Milwaukee Brewers)
    - Attendance: 2,200,000+
    - Priority: Retractable roof, fan roof deck
    - Data Sources: MLB.com, unique features documented

26. **Rogers Centre** (Toronto Blue Jays)
    - Attendance: 2,100,000+
    - Priority: First retractable roof, historic
    - Data Sources: MLB.com, extensive documentation

27. **Angel Stadium** (Los Angeles Angels)
    - Attendance: 2,000,000+
    - Priority: LA market, classic design
    - Data Sources: MLB.com, renovation plans

28. **LoanDepot Park** (Miami Marlins)
    - Attendance: 1,300,000+
    - Priority: Retractable roof, modern design
    - Data Sources: MLB.com, Populous data

29. **Tropicana Field** (Tampa Bay Rays)
    - Attendance: 1,200,000+
    - Priority: Unique dome, catwalks
    - Data Sources: MLB.com, dome geometry

30. **Oakland Coliseum** (Oakland Athletics)
    - Attendance: 1,000,000+
    - Priority: Complete MLB coverage, historical
    - Data Sources: MLB.com, limited but available

---

## Data Collection Tools & Software

### Measurement Tools
1. **Google Earth Pro** (Free)
   - Purpose: Measure distances, elevations, coordinates
   - Usage: Stadium orientation, section positioning

2. **QGIS** (Free, open-source)
   - Purpose: GIS mapping, coordinate transformations
   - Usage: Convert GPS to stadium coordinates

3. **Blender** (Free, open-source)
   - Purpose: 3D modeling of obstructions
   - Usage: Create mesh geometry for roofs, overhangs

4. **ImageJ** (Free)
   - Purpose: Image analysis, distance measurements
   - Usage: Extract measurements from seating charts

### Development Tools
1. **VS Code** (already in use)
   - TypeScript development
   - Data validation

2. **TypeScript Compiler** (already configured)
   - Type checking
   - Data validation

3. **Validation Scripts** (already built in Step 1.1)
   - `npm run validate-stadium-data`
   - Automated quality checks

### Reference Tools
1. **SunCalc.org**
   - Solar position verification
   - Shadow angle calculations

2. **NOAA Solar Calculator**
   - Official solar data
   - Azimuth/elevation tables

---

## Data Quality Standards

### Critical Requirements (Must Have)
- ✅ All 60+ sections with unique IDs
- ✅ Row-level data for every section
- ✅ 4 3D vertices per section (accurate to ±2 feet)
- ✅ Angle data (baseAngle, angleSpan) accurate to ±2°
- ✅ Covered/uncovered status verified
- ✅ Zero validation errors (passes `npm run validate-stadium-data`)

### High Priority (Should Have)
- ⭐ Obstruction files with major structures (roof, upper decks)
- ⭐ Material properties (opacity, shadow casting)
- ⭐ Row elevation and depth calculations
- ⭐ Distance from home plate (±5 feet accuracy)

### Nice to Have (Enhancement)
- 💡 Individual seat positions
- 💡 Accessibility information
- 💡 View quality ratings
- 💡 Price categories

### Verification Checklist
For each stadium, verify:
- [ ] File compiles without TypeScript errors
- [ ] Passes validation script (zero critical errors)
- [ ] Section count matches stadium (typically 60-120 sections)
- [ ] Row counts verified against official sources
- [ ] 3D vertices form valid quadrilaterals
- [ ] Angles sum to approximately 360° (full bowl)
- [ ] Obstruction file includes major structures
- [ ] Test render in development environment

---

## Time Estimates

### Per-Stadium Data Collection
- **Research & source gathering:** 1-2 hours
- **Section mapping:** 2-3 hours
- **Row-level data entry:** 2-3 hours
- **3D vertex calculation:** 1-2 hours
- **Obstruction modeling:** 2-3 hours
- **Validation & testing:** 1 hour
- **Total per stadium:** 9-14 hours

### Tier Timelines
- **Tier 1 (10 stadiums):** 5 working days (2 stadiums/day)
- **Tier 2 (10 stadiums):** 5 working days (2 stadiums/day)
- **Tier 3 (10 stadiums):** 5 working days (2 stadiums/day)

**Total: 15 working days** (matching plan.md estimate)

---

## Risk Mitigation

### Data Availability Risks
**Risk:** Some stadiums lack detailed public data
**Mitigation:**
- Use multiple sources (team site, ticketing, fan photos)
- Extrapolate from similar sections
- Mark uncertain data for future verification

### Accuracy Risks
**Risk:** Measurement errors accumulate
**Mitigation:**
- Cross-reference multiple sources
- Use validation scripts
- Verify sun calculations against known shade patterns
- User feedback system (Step 4.4) for corrections

### Time Risks
**Risk:** Data collection takes longer than estimated
**Mitigation:**
- Prioritize Tier 1 stadiums first (highest value)
- Template approach reduces repetitive work
- Validation catches errors early (saves rework time)

### Consistency Risks
**Risk:** Different collectors use different approaches
**Mitigation:**
- Detailed methodology document (this plan)
- Data collection template (Step 1.2)
- Automated validation enforces standards
- Code review process

---

## Success Metrics

### Quantitative Metrics
- ✅ 30/30 MLB stadiums completed
- ✅ 1,800+ sections total (60 avg × 30 stadiums)
- ✅ 100% row-level coverage
- ✅ Zero critical validation errors
- ✅ <2 second calculation time per stadium

### Qualitative Metrics
- ✅ Data matches user reports (via A View From My Seat)
- ✅ Sun calculations align with known shade patterns
- ✅ All major obstructions modeled (roofs, upper decks)
- ✅ Professional data quality (audit-ready)

---

## Next Steps

After completing this document:

1. **Create Data Collection Template** (Step 1.2, remainder)
   - Step-by-step data entry guide
   - Example stadium walkthrough
   - Common patterns and shortcuts

2. **Begin Tier 1 Collection** (Step 1.3)
   - Start with Yankee Stadium (best data availability)
   - Refine process based on learnings
   - Document any methodology updates

3. **Establish Quality Feedback Loop**
   - Review first 2-3 stadiums thoroughly
   - Adjust template/methodology as needed
   - Maintain consistency across all 30 stadiums

---

## Appendix: 2024-2025 MLB Attendance Data

Based on 2024 season attendance (for prioritization):

| Rank | Team | Stadium | Attendance | Tier |
|------|------|---------|------------|------|
| 1 | Dodgers | Dodger Stadium | 3,850,000 | 1 |
| 2 | Yankees | Yankee Stadium | 3,800,000 | 1 |
| 3 | Cardinals | Busch Stadium | 3,200,000 | 1 |
| 4 | Cubs | Wrigley Field | 3,100,000 | 1 |
| 4 | Braves | Truist Park | 3,100,000 | 2 |
| 6 | Giants | Oracle Park | 2,800,000 | 1 |
| 7 | Astros | Minute Maid Park | 2,700,000 | 2 |
| 8 | Red Sox | Fenway Park | 2,750,000 | 1 |
| 9 | Rockies | Coors Field | 2,600,000 | 1 |
| 10 | Orioles | Camden Yards | 2,500,000 | 1 |
| 11 | Rangers | Globe Life Field | 2,400,000 | 2 |
| 11 | Padres | Petco Park | 2,400,000 | 1 |
| 13 | Mariners | T-Mobile Park | 2,300,000 | 1 |
| 13 | Mets | Citi Field | 2,300,000 | 2 |
| 15 | Phillies | Citizens Bank Park | 2,200,000 | 3 |
| 15 | Brewers | American Family Field | 2,200,000 | 3 |
| 17 | Diamondbacks | Chase Field | 2,100,000 | 2 |
| 17 | Reds | Great American Ball Park | 2,100,000 | 2 |
| 17 | Blue Jays | Rogers Centre | 2,100,000 | 3 |
| 20 | Twins | Target Field | 2,000,000 | 2 |
| 20 | Angels | Angel Stadium | 2,000,000 | 3 |
| 22 | Nationals | Nationals Park | 1,900,000 | 2 |
| 23 | Guardians | Progressive Field | 1,800,000 | 2 |
| 24 | Pirates | PNC Park | 1,700,000 | 2 |
| 25 | Tigers | Comerica Park | 1,600,000 | 3 |
| 25 | Royals | Kauffman Stadium | 1,600,000 | 3 |
| 27 | White Sox | Guaranteed Rate Field | 1,500,000 | 3 |
| 28 | Marlins | LoanDepot Park | 1,300,000 | 3 |
| 29 | Rays | Tropicana Field | 1,200,000 | 3 |
| 30 | Athletics | Oakland Coliseum | 1,000,000 | 3 |

**Note:** Attendance data from 2024 regular season. 2025 data will be used when available.

---

**Document Status:** ✅ COMPLETE
**Next Document:** Data Collection Methodology & Template
