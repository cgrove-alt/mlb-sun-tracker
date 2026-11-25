# The Shadium rebuild: give fans an answer (plan, 2026-11-10)

**Goal:** a fan picks a Yankees game and sees a correct shade answer for any
section in under 3 taps on a phone. All tests pass, there are no 404s, and
mobile Lighthouse is 90+.

**Status (2026-11-10):** the new engine is live on the branch for every MLB
park: homepage dropdowns → game → colored real seat map, and the same map on
every stadium page with share links. Yankees and Fenway have sourced
profiles; the other 28 parks use a generic profile (labelled early
estimates). Nothing is pushed or deployed.
Baseline: `npx jest` passes 1,097 tests in 42 suites. The live build
(`x-build-id 19406fab65da`) matches `main`.

---

## 1. What I confirmed in the code

Every item in the audit was checked against the code. Where possible it was
also checked against the live site.

### Priority 1: give an answer

| Audit item | Confirmed | Evidence / root cause |
|---|---|---|
| Every MLB section shows "paused" / "Unverified / Not rated" | ✅ | `canPublishSeatLevelShade()` (`src/data/stadiumShadeConfidence.ts:90`) is false for all 30 parks. It requires lidar geometry plus a 30-observation holdout that no park has. It is checked in 6 places, and the row API returns HTTP 409. |
| "444-row" table | ✅ | Yankees has 222 sections, and the page renders each one twice: a desktop table and mobile cards, hidden only by CSS (`StadiumPageSSR.tsx:348-410`). The live page has 444 "Unverified" rows in 640 KB of HTML. |

### Priority 2: the shade engine

| Audit item | Confirmed | Evidence / root cause |
|---|---|---|
| Sun position needs NREL SPA or equivalent | ✅ already OK | `src/utils/solarPosition.ts` is a NOAA/Meeus port. Against the NREL SPA paper's own test case it gives azimuth 194.3426° (SPA: 194.34024°) and zenith 50.1086° (SPA: 50.11162°). Yankee Stadium, 2025-07-15 at 1:05 PM: 182.3° / 70.6°. Only tests are missing. |
| Uses 1, 4, 7 PM, not real first pitch | ✅ | `StadiumPageSSR.tsx:155-161` hard-codes 1:00, 4:00 and 7:00 PM. The homepage uses real game times, but MLB results are gated off. |
| Yankee Stadium at 55° | ✅ | `src/data/stadiums.ts:419`. Earlier sources said 75° (ballparks.com) and 64° (OSM). The value was deliberately left at 55° on 2026-06-23 (`stadiumOrientationProvenance.ts:158`). Only the Marlins entry is actually measured (±1°); the other 29 are ±8–18°. Each park's section file also hard-codes the orientation, e.g. `redsox.ts`: `buildParkSections(52, …)`. |
| Geometry ignores roof, overhangs, press box | ✅ | All 30 parks share one generic height and depth per seating level (`bowlGeometry.ts` `BOWL_DEFAULTS`). There is no per-park roof, overhang or press-box data. |
| Orientation alone gets Fenway wrong | ✅ (cause found) | The "day-game shaded side" used in page copy, blog checks, JSON-LD and the share image picks the stand nearest a fixed 180° sun (`shadeSide.ts`). It ignores game time and sun height, so it never answers "third base" for any of the 30 parks. Real shade arrives as the sun drops toward the west, which favors behind-home and the third-base side at NE-facing parks like Fenway. |
| NFL afternoon advice says east sideline | ✅ | Hand-written strings in `src/data/guides/nflStadiumGuides.ts` (e.g. lines 35, 497, 725, 957, 1189, 1423, 1646, 2529, 3557, 4323). The morning advice is mirrored wrong too. |
| Baseball terms on NFL pages | ✅ | `ShadeAnswer` ("seating behind home plate"), the JSON-LD FAQ, the OG image, `StadiumTitleBlock` (orientation fact, "Third base side"), the "First Pitch" label, and the `MobileFilterSheet` chips. None depend on league. |
| NFL venues at 0° | ✅ | 14 of 32 in `src/data/unifiedVenues.ts` (also in `nflStadiums.ts` and `nfl-venues-generated.json`). |
| Extra: NFL guide lookups | ✅ new | A fuzzy lookup makes the Giants page render the **Jets** guide (`guides/index.ts:63-75`). The Chiefs page shows "Stadium Guide Not Available". |

### Priority 3: content

| Audit item | Confirmed | Evidence / root cause |
|---|---|---|
| Yankees blog says third-base side | ✅ | `complete-guide-shaded-seats-yankee-stadium.mdx` L24 and L53. It also mislabels 305-315 as the third-base side, when they are on the RF/1B side. |
| Fenway "Green Monster shade" | ✅ | Title and L19-28, L139, L255. The wall faces the afternoon sun, so its shadow falls on Lansdowne St. It also uses stale names: EMC Club, State Street Pavilion, Yawkey Way. |
| Dodger "300 level" | ✅ | The only 300s are the outfield pavilions (301-316). The upper decks are RS and TD. |
| Citi "Promenade Club 323–335" | ✅ | The 300s are the Excelsior club tier. Promenade is the 400s/500s. |
| Other posts | ⚠️ | All 31 posts are published, and there is no draft flag. 9 stadium posts disagree with *today's* engine, but today's engine is itself wrong (see above), so every post gets re-checked after Phase 2. The Steinbrenner post cites the wrong orientation (316° vs 60°). |
| Minute Maid Park → Daikin Park | ✅ | About 25 places: `stadiums.ts:43`, `unifiedVenues.ts:78`, the site-wide nav (`StickyTopNav.tsx:38`), the guide, blog post and slug, sitemap and locales. There is no redirect for the slug. Other stale names: "Oakland Coliseum" guide, "Guaranteed Rate" (locales and blog slug), "Arrowhead Stadium" guide id. |

### Priority 4: UX

| Audit item | Confirmed | Evidence / root cause |
|---|---|---|
| Schedule 400 / "Unable to load games" | ✅ root cause | Both MLB loaders set the end date to `new Date(year, 9, 31)` (`UnifiedGameSelector.tsx:137`, `StadiumPageClient.tsx:79`). After Oct 31 the end date falls before the start date, and MLB's API answers 400 "endDate must be after startDate" (reproduced with curl). |
| Raw i18n keys | ✅ | `gameSelector.apply` and `gameSelector.applyCustomDateTime` are missing from en, es and ja, and `t()` returns the raw key. These are the only missing keys. |
| Empty Date/Time labels after apply | ❓ | Not reproducible from reading the code. I'll reproduce it in the browser before fixing. |
| Team → game → map flow | ✅ missing | It takes 5 taps on mobile to reach "Section results paused". A seat map exists (`InteractiveSeatingBowl`) but is gated off. There is no MLB section search, and no share link: `ShareButton` is unused and `MobileApp` ignores URL params. |
| Jargon | ✅ | "withheld", "self-shade", "holdout", "Geometry confidence", "Publication gate" and "paused" appear in about 20 user-visible places (homepage, FAQ, guides, stadium page, `ShadeConfidenceNotice`, JSON-LD). |

### Priority 5: technical

| Audit item | Confirmed | Evidence / root cause |
|---|---|---|
| ~55 broken links | ✅ (actually **97**) | 93 `/blog/tag/*` and 4 `/blog/category/*` URLs all 404 live, because no route exists. 3 blog hero images are missing (`public/images/` doesn't exist), and the BlogPosting JSON-LD points at them too. `/og-image.png` is missing and is listed in `sitemap-images.xml`. |
| Sitemap MiLB 404s, fake lastmod | ✅ | `scripts/generate-sitemap.js:66-74` hard-codes `/league/milb/{aaa,aa,a+,a}`, and all four 404. Every non-blog URL uses the build date as lastmod. |
| Mobile speed | ✅ | 8–10 render-blocking stylesheets. Stale inline critical CSS: purple/orange hero, `header{height:64px}`. `app/critical.css` is dead. `CSSOptimizer` does nothing useful. The hero styles are styled-jsx and missing from the server HTML, so the page restyles after hydration. The hidden finder app mounts on load. GA4 loads `afterInteractive` with an early preconnect, and its ID is hard-coded twice (there is no GTM container). The stadium page sends 416 KB of client payload, because sections and guide are passed to a client component and the list is rendered twice. |
| MLB badge contrast | ✅ | `#6b7280` on `#f3f4f6` = 4.39:1, which fails 4.5:1 (`StadiumTitleBlock.module.css:276`). The search badges are 3.68–4.23:1. |
| Skip links | ✅ | The `#search-controls` target doesn't exist, and `#main-navigation` isn't focusable. |
| Canonicals | ✅ | Missing on /privacy, /terms, /contact and /cookies, plus /attributions, /disclaimer and /dmca. `/faqs` uses a temporary (307) redirect. |
| Giants/Jets same meta description | ✅ | `app/stadium/[stadiumId]/page.tsx:93` builds it from the venue name, which is "MetLife Stadium" for both. |
| Keep SSR, JSON-LD, one H1 | ✅ | All three are present today. I'll add tests so they stay that way. |

---

## 2. Approach (the key decisions)

1. **One engine answer.** Build on the existing `calculateGameWindowShade`,
   which already samples every 30 min across 180 min. Add park-specific
   structure data and a confidence label. No second model. Page copy, blog
   checks, FAQ and the share image all derive from this same answer instead of
   the 1 PM shortcut.
2. **Shaded / Partial / Sun** per section at each half hour: 75% or more of
   rows shaded = Shaded, 25% or less = Sun, anything between = Partial.
3. **Confidence (High / Medium / Low) as a robustness test.** Recompute with
   the orientation moved by its measured ± error and the structure heights
   moved by ±25%. If the answer never changes, it is High (when the structure
   data is sourced) or Medium (when it is a default). If it flips, it is Low.
   Retractable roofs get "shaded if the roof is closed".
4. **Lead sentence** such as "Section 214: shade from about the 3rd inning."
   This uses the 2025 average 9-inning game of 2:38, about 17.6 min per inning.
5. **Orientation re-measured** for all 30 MLB parks and the 14 NFL 0° venues.
   The bearing comes from the home plate → second base line on public
   orthoimagery (the same method that gave the Marlins ±1°). Pixel points,
   image source and date are recorded. `stadiums.ts` becomes the only place an
   orientation is typed: the section files and `unifiedVenues.ts` read it, and
   a test enforces that.
6. **Geometry per park.** A small structure profile per park, for each seating
   level and compass range:
   - which rows sit under a roof or overhang, and the lip height;
   - the height of whatever rises behind (upper decks, press box, roof).
   Every value cites a source: official seating charts that mark covered seats,
   club pages, photos, or the lidar we already have. Where no source exists,
   the generic default is used and confidence drops.
7. **Reference checks, 5+ per MLB park:**
   - 1 sun position against NOAA's published calculator;
   - 1 orientation against the new measurement;
   - 3 or more sourced shade observations, such as club shade maps,
     time-stamped photos or published guides, each with a URL.
   Tests fail when the engine disagrees.
8. **Flow:**
   - The homepage becomes a server-rendered team grid.
   - Tapping a team (tap 1) opens `/stadium/yankees`, which lists the upcoming
     home games.
   - Tapping a game (tap 2) shows the color-coded seat map with a time slider,
     a section search box, and a short "best shaded sections" list.
   - `/stadium/yankees?game=<gamePk>&section=<id>` is the shareable link.
9. **No data deleted.** The gate's evidence files stay in the repo, just no
   longer wired in. "Unpublish" means `draft: true` plus a 301 redirect, never
   deleting a file. Anything I think should be deleted, I'll list and ask
   about first.

---

## 3. Todo (about one commit per checkbox)

### Phase 0: setup
- [x] 0.1 New branch from `main` (`fix/shade-answer-rebuild`).

### Phase 1: give an answer (P1)
- [x] 1.1 `src/utils/gameShade.ts` + `src/utils/parkShade.ts` (any park; a
      generic per-level profile where a park has none):
      returns every section's 7 half-hour states, its confidence and its lead
      sentence, built on `calculateGameWindowShade`. Tests: dome, night game,
      retractable roof, the sentence text.
- [x] 1.2 Remove the publication gate from the stadium page, the stadium
      client, both homepage apps, `StadiumSchema`, `stadiumDataServer`. Done
      for every page; the unused StadiumPageClient, StadiumSchema and
      stadiumDataServer are deleted.
- [ ] 1.2b Follow-up: the public row API (`/api/stadium/[id]/rows/shade`)
      still returns 409. Nothing on the site calls it; moving it onto the new
      engine means rewriting its ~940 lines of tests, so it is its own step.
- [x] 1.3 Stadium page shows the answer for a chosen game: the lead sentence
      plus a "best shaded sections" short list.

### Phase 2: all-new sun and shade calculations (P2)
- [ ] 2.0 Collect the feedback you received: each example (park, date, time,
      section, what was wrong) becomes a failing test before any fix.
- [x] 2.1 New sun-position module: a full NREL SPA implementation, replacing
      the NOAA port (and SunCalc for sunrise/sunset, now uninstalled). Tests:
      - the SPA paper's own published test case, to 0.001°;
      - Yankees 2025-07 1:05 PM ≈ 182° / 70°;
      - one NOAA calculator value per park as an independent cross-check.
      Result: every intermediate value of the paper's example matches to its
      printed precision (Earth longitude to 2e-11°); Yankees 2025-07-15
      1:05 PM = 182.3° / 70.6°; SPA and NOAA agree within 0.01° on the sky
      at all 30 parks; 2025 solstice sunrise/sunset match published times.
- [x] 2.1b New shade calculation written from scratch on the new sun
      position (`src/utils/shadeEngine.ts`, `src/utils/gameShade.ts`).
      Old models are not retired yet; that happens when the UI switches over. Each half hour, for every row, it decides whether the
      sightline to the sun is blocked by the structure behind the seat, the
      overhang above it, or the roof. One function, one set of tests. The old
      models (`sectionSunCalculations`, `getUnifiedVenueShade`, the
      `shadeSide.ts` shortcut, the 3-D estimator) are retired, not patched.
- [x] 2.2 Real first pitch everywhere: the 1/4/7 PM buckets are gone; games
      come from MLB's schedule, and "Another date and time" accepts any
      minute. When MLB hasn't set any start times yet, the finder opens on the
      first home game's date at 1:05 PM and says so.
- [ ] 2.3 Orientation:
      - [x] write the measurement script (`scripts/measureOrientation.ts`,
            records in `src/data/orientationMeasurements.ts`);
      - [ ] re-measure the 30 MLB parks and update the provenance.
            Done: Yankee Stadium = 75° ±1° (was 55°, 20° low), from USGS
            NAIP 2019-08-30 imagery, four methods agreeing within 0.8°.
            Remaining: the other 29 parks.
      - [x] make `stadiums.ts` the only place orientation is typed: all 29
            section maps now call `getStadiumOrientation()`. The four
            static-chart parks (Blue Jays, Padres, Athletics, Giants) still
            store absolute compass bearings per section; convert those to
            axis-relative offsets when their parks are re-measured.
      - [x] add a consistency test across all files. It immediately caught
            a real drift: the Marlins' measured 129.036° was in
            `stadiums.ts` but `unifiedVenues.ts` still said 135° (fixed).
- [ ] 2.3b Fix how section positions are read from the club seat maps.
      - [x] Yankee Stadium. The old method took the home → center-field axis
            from two anchor sections that sit off-center, tilting every
            Yankees section about 16°. The axis now comes from straight-line
            fits through the field boxes along each foul line (robust to
            within ~1° whichever rows are used). Home plate is placed on that
            axis.
      - [x] New per-section `standCompass`: the direction each stand's back
            faces, fitted from its 4 nearest ring-mates (markers such as
            wheelchair platforms copy their parent). This is what decides
            whether the sun is behind a stand. Along a foul line it differs
            from the bearing from home plate by 45° or more (box 015A: 216°
            vs the old 121°).
      - Correction to an earlier note: the "13% squash" came from fitting
            through the curved part of the field-box rows. Using only the
            straight runs gives 1.008, so the Yankees map is not squashed.
      - [x] Fenway: calibrated from the Field Box runs; upper/top bleacher
            sections fitted as their own ring; isolated sections (Pavilion
            Reserved) face straight away from the field.
      - [ ] The other 27 chart-built parks: add foul-line rows and check
            each park's arrows.
- [x] 2.4 Structure-profile data model (`src/data/stadiumStructures.ts`):
      per tier, rows, heights, rake, the deck over the back rows and the
      structure behind; per-section overrides; each value marked sourced or
      estimated. Confidence = the answer must survive orientation ± its error
      and the structure moved ±50% where estimated (±10–20% where measured).
- [x] 2.5 Yankees and Fenway profiles plus their reference checks, which prove
      the method.
      - Yankees: 33 checks against published observations on real 2025
        games pass, plus sun-position and orientation checks. Heights are
        estimated except the canopy (NYC footprint record).
      - Fenway: orientation measured at 44° ±1° (was 52°; chalk foul lines
        visible in 2023 imagery). Map calibrated from the Field Box runs;
        club-map row counts used. 61 checks pass: covered Grandstand shaded,
        Grandstand 1–6 late sun, third-base Loge/Field Boxes shade before
        first-base, bleachers and Monster seats sunny, Right Field Boxes
        among the last to shade, Pavilion Box covered rows shaded.
      - Known disagreements, labelled Low/Medium instead of High: Yankees
        Terrace 310–319 (ShadedSeats: shade gradually from a 1:35 start);
        Fenway behind-home Loge upper rows (Rate Your Seats: shaded at a
        1 PM start; model: from mid-game). Both point to estimated deck
        heights; measured heights (lidar) are the fix.
      - Yankees: first-base side shades first for a July 1:05 PM game.
      - Fenway: third-base side and behind home shade first. I'll check this
        against published sources first.
- [ ] 2.6 The other 28 parks' profiles plus 5+ reference checks each, in
      batches of about 5 parks (one commit per batch).
- [x] 2.7 Replace `bestShadedSideForDayGame` copy (page, FAQ JSON-LD, OG
      image) with the engine's answer for a typical 1:05 PM and 7:05 PM start.
      Done: MLB pages and their FAQ JSON-LD no longer use it. Left: the OG
      image and the NFL guide's ShadeAnswer (with 2.8).
      **Done** (checked in §25): the MLB share image and the NFL answers no
      longer use it. It is left only for MiLB, which has no section map, in
      plain words.
- [x] 2.8 NFL:
      - measure the 14 venues at 0°;
      - derive sideline advice from the engine (west stands shade in the
        afternoon) and remove the inverted hand-written strings;
      - football wording (sideline, end zone, kickoff);
      - fix the Giants→Jets and Chiefs guide lookups.
      Done:
      - Every field re-measured, not just the 0° ones
        (`src/data/nflOrientationMeasurements.ts`): OSM field outlines
        checked on USGS aerial photos with the axis drawn on top, plus the
        turf's own axis where it shows (agrees within 5°). 26 measured; most
        old values were wrong (Lambeau 45° → N–S, Cleveland 287° → NE–SW,
        M&T Bank 22° → WNW–ESE, Highmark 50° → WNW–ESE). Four of the 0°
        entries were right (Empower, Raymond James, Lumen, NRG).
      - Not measured: AT&T and Lucas Oil (roof closed in the only aerial
        photo, no field in OSM). Their pages say so and show no direction.
        Fixed roofs keep their old values (they don't affect shade).
      - Sideline advice comes from the sun's path (`src/utils/nflSunSide.ts`)
        for 1:00 and 4:25 PM kickoffs on Sept 14, 2025; every field's shaded
        side is on the sun side (west, southwest or south).
      - Hand-written NFL shade lists are hidden (the data is kept).
      - Guides keyed by venue id; no fuzzy lookup.
      - Left: `nfl-venues-generated.json` is a stale intermediate with
        pre-2025 ids (updated for consistency, not used at runtime); the
        duplicate Ravens guide `mt-bank-stadium` is unreachable (not
        deleted: your call).

### Phase 3: content accuracy (P3)
- [x] 3.1 `draft` frontmatter support. A draft post is left out of the index
      and sitemap, and its URL 301-redirects to the stadium page.
      Done (`draft: true` + `redirectTo` in frontmatter; next.config.js
      builds the 301s; renamed slugs resolve straight to the final page).
- [x] 3.2 Script that checks every post's shade claims against the fixed
      engine and prints a table. It runs in tests so the posts can't drift
      again.
      Done as `app/__tests__/blogShadeClaims.test.ts`: each claim's sentence
      must appear in the post word for word, and the engine must give that
      answer for the 2025 game the post names (35 checks, including the sun
      positions quoted).
- [x] 3.3 Fix the Yankees, Fenway (new title, no Monster shade, current club
      names), Dodger and Citi posts, plus every other mismatch the script
      finds, the general day-game post and the Steinbrenner orientation.
      Unpublish only what can't be fixed (I'll list those first).
      Decided with you (2026-11-10): unpublish every post that can't be
      verified yet, and write new posts as each park gets its structure
      profile. Done:
      - 29 posts unpublished (files kept): 28 stadium posts 301 to their
        stadium page, the general day-game post to the homepage.
      - New Yankee Stadium post (same URL) and new Fenway Park post
        (`/blog/shaded-seats-fenway-park`; the old Green Monster slug 301s
        to it), written from the engine for real 2025 games, with
        estimates labeled as estimates.
      - Found on the way: an inline critical-CSS rule gave every `<header>`
        a fixed 64 px height (meant for the sticky bar, which is a `<nav>`),
        so on phones the post title overlapped the content below. Removed.
      - Left: a new post for each of the other 28 parks once its profile
        and reference checks are done (2.6).
- [x] 3.4 (Also: MLB's 2026 team data names Dodger Stadium "UNIQLO Field
      at Dodger Stadium". Confirm and update with the other names.)
      Minute Maid Park → Daikin Park everywhere, with a 301 for the blog
      slug. Also fix the Guaranteed Rate slug, the Oakland Coliseum guide, the
      Arrowhead guide id and the locale names.
      Done: Daikin Park, Rate Field and Athletics renamed, both blog slugs
      301 to the new ones. Dodger Stadium kept: the 2026 deal names the
      field, and we use 2025 data. The Arrowhead guide is now keyed
      `geha-field-arrowhead` (see 2.8). Left: the Oakland Coliseum guide text
      (not shown anywhere), and MiLB names: Oklahoma City Dodgers are the
      Oklahoma City Comets in 2025; the Knoxville Smokies and Columbus
      Clingstones (both new parks in 2025) have no guide.

### Phase 4: UX, mobile first (P4)
- [x] 4.1 Schedule 400: use a rolling window (today → +180 days) in both
      loaders, with a test dated in the offseason.
- [x] 4.1b Found while checking 4.1 against live data: a team's "home"
      list included spring training (16 Yankees games in Tampa) and would
      include neutral-site series. Home games are now the games played at
      the park's own MLB venue ID. Live check: 22 Yankees games, first is
      opening day, Mar 25, 2027 at 1:35 PM vs Toronto.
- [x] 4.2 Add the two i18n keys, plus a test that every `t()` key exists in
      en, es and ja.
- [x] 4.3 Reproduce the empty Date/Time labels in the browser. Checked on a
      production build: after Apply, both inputs keep their values and the
      breadcrumb shows "Nov 10, 2026 at 1:47 PM EST". The "empty" labels
      come from reading the page as text, where a native date/time input's
      value isn't part of the text. Not a display bug; the control is
      replaced by the dropdown flow in 4.4 anyway.
- [x] 4.4 Homepage per the approved mockup: a "Stadium" dropdown, then a
      "Game" dropdown. The next home game is picked automatically, so a phone
      gets an answer in 2 taps. Server-rendered, light hero.
- [x] 4.5 Game view:
      - the real seating layout from each park's club map, colored
        Shaded/Partial/Sun, with a half-hour time slider labelled by inning;
      - "Find your section" search, "Most shade this game" list, share;
      - night games and "Time TBD" games get their own plain-language message;
      - replace the double-rendered 222-row table.
- [x] 4.6 Share link (`/stadium/{id}?game=&section=`) with a copy button;
      the stadium page keeps it in the address bar. The old MobileApp now
      links MLB picks to the stadium page instead.
- [x] 4.6b Found while testing: on a phone the cookie banner covers half the
      screen on first visit, on top of the finder. Done: buttons share one
      row and the heading shows from the sm breakpoint up. iPhone SE 383 →
      203 px (67% → 36% of the screen); iPhone 13 58% → 31%.
- [x] 4.7 Rewrite the copy for fans: remove "withheld", "self-shade",
      "holdout", "geometry confidence", "publication gate" and "paused" from
      every page, the FAQ, guides and JSON-LD. Done: homepage, finder page,
      every MLB stadium page and its JSON-LD, the old apps. Left: /faq,
      /guide pages, /disclaimer, HomepageSchema, /how-it-works.
      **Done in §25**, with the site-wide description, footer, schema and
      share image, /stadiums, the league pages, the blog, the stadium pages'
      monthly sun note and the MiLB and NFL notes.

### Phase 5: technical (P5)
- [x] 5.1 Blog links:
      - add `/blog/category/[category]` pages for the 2 real categories;
      - remove the 93 tag links and the 2 empty "Popular Topics";
      - point the 3 hero images at the existing per-post generated OG image;
      - fix `/og-image.png`.
      Done (tags are plain text now; test in app/__tests__/blogLinks.test.ts).
- [x] 5.2 Sitemap: drop the 4 MiLB level URLs and use real lastmod dates
      (each source file's last git commit).
      Done. Vercel builds from a shallow clone, where git dates are wrong, so
      there the generator reuses the dates in the committed sitemaps
      (checked: a shallow clone reproduces them byte for byte). So: run
      `npm run generate-sitemap` locally and commit the sitemaps when a
      page changes. Also added the blog category pages and pointed the image
      sitemap at /opengraph-image.
- [x] 5.3 Speed:
      - [x] fix the inline critical CSS: removed its copy of the hero
            styles (different from the real ones) and the old hidden-app
            rules. Its base rules stay: they set the body text color and
            cancel a 64 px body padding, so removing them shifts the layout.
      - [ ] cut render-blocking sheets: not done. Pages load 8–9 CSS files
            that Next.js splits from the global imports; Lighthouse estimates
            ~0.6 s. Every page already scores 91+ without it; the options
            (Next's experimental `inlineCss`, or merging the global sheets)
            are bigger changes than the gain justifies right now.
      - [x] remove dead CSS and `CSSOptimizer` (it downloaded every
            stylesheet twice); deleted 4 stylesheets nothing imports.
      - [x] hero styles in a CSS module so they're in the server HTML.
      - [x] stop mounting the hidden app on load (the homepage no longer
            has it);
      - [x] GA4: dropped the unused preconnect and the duplicate ID. Kept
            `afterInteractive` instead of lazy: GA starts after the page has
            painted, so it doesn't move LCP (TBT stays under 50 ms), and
            loading it later would drop page views from short visits.
      - [x] stop sending sections and guide to the client (the MLB stadium
            page is 146 KB in development, was 640 KB live).
      - [x] fixed a dev-only bug found on the way: next.config.js forced
            year-long immutable caching on dev chunks, so pages never
            hydrated locally.
      - [x] Found while measuring (the real causes of the slow phone LCP):
            - every page's content faded in from opacity 0 (and the stadium
              title block had its own fade); browsers don't count invisible
              content as painted;
            - a `loading.tsx` on the prebuilt stadium and league routes made
              React ship the content hidden and reveal it up to 300 ms after
              the skeleton painted.
      - [x] Found while checking GA: an opted-out visitor's first page view
            went out as "analytics granted" (the banner's opt-out arrived
            after GA's first hit), every in-app navigation was counted twice,
            and the banner re-sent `config` on every load (a third page
            view). GA now starts from the saved choice; test in
            `components/__tests__/gaConsent.test.ts`.
- [x] 5.4 Accessibility: badge contrast at least 4.5:1, and fix the skip-link
      targets and focus.
      Done: one native "Skip to main content" link (first Tab shows it,
      Enter moves focus into the page). Badges, `.prose` links (an undefined
      color variable), link hover/visited overriding button text, NFL tip
      text, share buttons, legal-page blues, privacy button. Tables stay
      tables on phones and their scroll wrappers take focus. Removed the
      blog Newsletter box (its form had no action or handler). axe (WCAG 2
      A/AA) shows no violations at phone size on 30 pages.
- [x] 5.5 Canonicals on the 7 pages, a permanent `/faqs` redirect, and
      distinct Giants and Jets meta descriptions. Done: non-MLB descriptions
      name the team, so the two MetLife pages differ; canonicals on all 7
      (and a test that every static page has one); `/faqs` is a 301.
- [x] 5.6 Tests that guard the strengths: one H1, JSON-LD present, server
      rendering. Done as `tests/seo-local.spec.ts` (raw server HTML of 9
      pages: one H1 with the expected text, JSON-LD that parses, the
      canonical, no hidden streaming placeholder). `npm run test:seo:local`,
      and it runs in the Playwright CI job.

### Phase 6: verify
- [x] 6.1 `npx jest` (60 suites, 1,518 tests), `npm run type-check`,
      `npm run lint` (0 errors), `npm run build`: all pass. The build was
      failing at lint on an eslint-disable for a rule the config doesn't
      load; fixed.
- [x] 6.2 Crawl of the local production build: 403 URLs (all 221 sitemap
      URLs plus every link and asset on those pages), 0 broken, no redirect
      chains. Found and fixed one dead link the crawl can't see (it's a
      hash): the menu's "Shade Finder Tool" pointed at a removed section.
- [x] 6.3 Lighthouse mobile, 3 runs each (local production build): `/`
      93–96, `/stadium/yankees` 91–92, Yankees post 92–96, Fenway post
      92–96. Accessibility, best practices and SEO 100 on all four.
- [x] 6.4 Phone viewport: pick Yankee Stadium (1 tap) and the next game's
      answer shows ("Best bet: Section 107 … shaded the whole game"); tap a
      section (2) for its answer and half-hour strip. The share link
      (`/stadium/yankees?game=852989&section=432A`) reopens the same game,
      section and answer. Fixed on the way: the strip's times were clipped
      ("1:35 PN") on a 375 px phone.
- [x] 6.5 Review section below, including anything I couldn't verify.

---

## 4. Decisions (2026-11-10)

1. **Sun calculations: all new.** You've had feedback that the calculations
   are wrong, so the sun position and the shade calculation are both rebuilt
   (2.1 and 2.1b). Note for the record: the current sun position matches the
   NREL SPA reference case within 0.003°, so the error is most likely in the
   shade step (which seats the sun reaches), not in the sun position itself.
   The new tests will show which. Geometry sources: official club seating and
   shade maps, time-stamped photos, published shade guides and the lidar
   already in the repo. Yankees and Fenway go first, for review before the
   other 28.
2. **Blog tags: remove** the 93 tag links (5.1).
3. **Homepage: mockup first.** First mockup (team grid → game list) was
   changed at your request to: a stadium dropdown, then a game dropdown, the
   real stadium shape (Yankee Stadium drawn from the club map's 221
   sections), and a new look (navy header, blue for shade, amber for sun).
   Waiting for your OK on mockup v2 before 4.4–4.6 start. Real-data note: MLB lists not-yet-set
   start times as "3:33 AM" (`startTimeTBD`), so the game list must show
   "Time TBD" for those.
4. **Shipping:** commits stay on the branch. Pushing, a PR and a production
   deploy happen only when you say so.

---

## 5. Review (2026-11-11)

44 commits on `fix/shade-answer-rebuild`, nothing pushed.

### What changed
- **P1, an answer:** the publication gate is gone. Every MLB stadium page
  and the homepage have a stadium → game picker. It shows each section as
  Shaded / Partial / Sun every half hour from first pitch, with a
  High/Medium/Low confidence label, a plain lead sentence and a share link.
- **P2, the engine:**
  - sun position is now NREL SPA, using the real first pitch;
  - a new row-level shade engine (seat → structure behind, deck above,
    roof);
  - Yankee Stadium (75°, was 55°) and Fenway (44°, was 52°) are re-measured,
    with profiles and reference checks (Yankees July 1:05 PM = 182.3° /
    70.6°, first-base side shades first);
  - every NFL field direction is re-measured, and the sideline advice comes
    from the sun's path with football wording.
- **P3, content:** 29 unverified posts are unpublished and 301 to their
  stadium page. The Yankees and Fenway posts are rewritten from the engine,
  with every claim pinned by a test. Current venue names (Daikin Park, Rate
  Field).
- **P4, UX:**
  - schedule window fixed;
  - i18n keys added and guarded;
  - home-only games;
  - cookie banner down to a third of a phone screen;
  - menu link to the finder fixed;
  - timeline labels no longer clipped.
- **P5, technical:**
  - the 97 broken blog links are gone;
  - the sitemap lists only real pages with real lastmod dates;
  - canonicals on every static page, `/faqs` is a 301;
  - contrast and skip-link fixes;
  - distinct Giants/Jets descriptions;
  - speed, from the real causes: page fade-in, styles injected only after
    JavaScript, double-downloaded CSS, hidden streaming placeholders;
  - analytics consent and double counting fixed;
  - SEO guard tests.

### Verification (local production build)
| Check | Result |
|---|---|
| Unit tests / type check / lint / build | 60 suites, 1,518 tests pass; tsc clean; 0 lint errors; build passes |
| Playwright (SEO, a11y, overflow) | 17 pass |
| Crawl | 403 URLs incl. all 221 sitemap URLs: 0 broken, no redirect chains |
| Lighthouse mobile (before → after) | `/` 76–93 → 93–96; Yankees 80–81 → 91–92; posts 95 → 92–96; a11y 100 on all |
| axe, phone size | 0 violations on 15 pages; skip link is the first Tab stop |
| Phone run | Yankees answer in 1 tap, a section's answer in 2; share link round-trips |

### Not done
- 1.2b: the public row API still returns 409 (nothing on the site calls it).
- 2.0: your feedback examples, to turn into failing tests.
- 2.3 / 2.3b / 2.6: the other 28 MLB parks still need measured
  orientations, seat-map calibration and structure profiles with 5+
  reference checks each. Their answers today use a generic profile, and
  their posts stay unpublished until then.
- 2.7: the MiLB stadium pages still use the old fixed-sun "best side" text.
- 4.7: plain-language copy on /faq, /guide pages, /disclaimer,
  HomepageSchema and /how-it-works.
- 5.3: render-blocking CSS (8–9 files, ~0.6 s estimated); scores are 91+
  without it.
- Data, all against "always use 2025 data":
  - the Rays show Tropicana Field (their 2025 home was Steinbrenner Field);
  - Oklahoma City Dodgers → Comets;
  - no guides for the Knoxville Smokies or the Columbus Clingstones.
- Not deleted (your call): the unreachable duplicate Ravens guide.
  `nfl-venues-generated.json` is a stale intermediate.

### Could not verify
- The live site: nothing is deployed, so the scores are local
  (`next start`, Lighthouse's simulated slow 4G and slow CPU), not Vercel's
  CDN.
- A physical phone: only emulated phone viewports.
- Clipboard copy of the share link: the test browser blocks the clipboard,
  so only the fallback (the link shown on screen) was checked.
- Side effect: the local production builds send real hits to the GA
  property, so some localhost page views from these checks are in it
  (filter by hostname).

---

## 6. Plan: the other 28 parks (2026-11-11)

Goal: every MLB park gets what Yankee Stadium and Fenway have: a measured
orientation, a calibrated seat map, a sourced structure profile and 5+
checks against published observations on real 2025 games. Today these
parks use a generic stand shape per seating level, so most answers are
Medium or Low confidence and their blog posts stay unpublished.

### Step 0: fix found while reading
- [x] 6.0 18 section files pass the orientation to `buildParkSections` as a
      typed number (Angels `50`, Astros `340`, …) next to
      `getStadiumOrientation()`. They match `stadiums.ts` today, but a
      re-measured park would keep the old angle for part of its seat map, and
      the consistency test doesn't look at these files. Pass `ORIENTATION`
      everywhere and make the test fail on a typed number.
      **Done** (found in §25): every section file passes `ORIENTATION`, and
      `orientationConsistency.test.ts` fails on a typed number.

### Per park (the Yankees/Fenway recipe)
1. Orientation from USGS aerial imagery (`scripts/measureOrientation.ts`),
   with at least two methods that agree. Record it in
   `orientationMeasurements.ts`; update `stadiums.ts`, `unifiedVenues.ts`
   and the provenance file.
2. Seat map: fit the axis from the straight runs of field boxes along each
   foul line, then check the stand directions.
3. Structure profile in `stadiumStructures.ts`, with each value marked
   sourced or estimated:
   - tiers and row counts from the club map;
   - which rows are covered (shaded-seat guides, section pages, the club's
     ballpark guide);
   - heights, published where they exist, otherwise estimated with the
     reasoning written down.
4. Reference checks: `<park>ShadeReference.test.ts`, 5+ checks from
   published observations, each on a real 2025 home game. A disagreement
   gets investigated. If it can't be resolved, the section gets a lower
   confidence label, never a fudged number.
5. Check the stadium page on a phone. One commit per park.

### Batches (I check in with you after batch 1)
- [x] 6.1 Batch 1: Dodgers, Cubs, Giants, Mets, Phillies.
      - [x] 6.0 done (also: unifiedVenues' repeated seatingGeometry angles
            now kept in step for measured parks; 23 others still disagree).
      - [x] Dodger Stadium: 27° (was 25°). Its seat map was turned ~35°
            toward left field (the "center field" anchors were at the LF
            pavilion). New: pin a club map to the aerial photo with control
            sections (bearing/distance from home); the builder fits the
            simplest map within 5 m RMS (affine, else projective). 112
            reference checks.
      - [x] Wrigley Field: 38° (was 30°). Club map also badly anchored, and
            drawn not to scale (foul-side stands 90° apart vs 75°): new
            `standRuns` take straight-run facings from the photo. The upper
            deck covers the 100s from ~row 11 (measured on the photo). 131
            checks.
      - [x] Oracle Park: 86° (was 87°). Its seat map is a schematic drawing,
            so stand directions come from the photo by section. 49 checks.
            Not reproduced: RYS's "127–135 shaded early, sunniest later".
      - [x] Citi Field: 14° (was 35°, 21° off). Control points on the photo
            plus one first-base run. 64 checks. Its drawn outer rings on the
            third-base side look skewed (picture only).
      - [x] Citizens Bank Park: 9° (was 18°): home → mound 9.1°, mirror axis
            9.0°, and a new third check, a circle fitted to the infield
            dirt's edge (8.84°; gives 14.35° at Citi, recorded 14°). The
            club's drawing turns the third-base side and both outfield stands
            ~20° too far, so every stand direction comes from the photo
            (aisles, dugouts, walls, deck edges); which upper sections share
            a straight run comes from the club's drawing. Rows now come from
            the club's own seat-map data (also fixes the rows shown on the
            page); covered rows from RYS. "V" sections are wheelchair
            platforms: their own tier, never the best bet. 48 checks. Not
            reproduced: Hall of Fame Club "out of the sun by the 3rd inning"
            holds in September but takes until ~5th in July/August (estimated
            heights); RYS's "about half shaded at first pitch" in right field
            (model 10–40%).
      - Open: Diamond Club D is in the club's data but missing from our
            seat map (inventory, not shade). The one-fit seat map pushes upper
            decks outward on the drawing (3D chart), as at Citi.
      - Method notes for the next parks: survey helpers live in tmp/
            (naipFetch, gridCrop, overlayFit, standDirs, parkExplore,
            rowDetail, fitReport, dirtArc, wallTrace, profile, rankPark,
            drawMap). Check every seat map against its photo before
            profiling; group stand fits by ring (tierOf). 3D Digital Venue
            parks publish a master.json with every section's rows and seats:
            use it for row counts.
- [x] 6.2 Batch 2: Braves, Cardinals, Nationals, Orioles, Padres.
      - [x] Orientations, all measured on NAIP with 3+ methods: Truist 159°
            (was 135°, 24° low), Busch 62° ±1.5° (was 60°; softer photo),
            Nationals 29° (was 30°), Camden 31° (was 30°; foul poles exactly
            90° apart), Petco 0° (confirmed). New 'slight-blue-cast' grass
            rule for Nationals; the consistency test compares compass bearings.
      - [x] Truist Park: club drawing (a perspective view) pinned with 8
            controls (1.6 m RMS), sections counted between aisles on the photo.
            Stand directions from level lines on the photo: first-base side
            286° (8° short of square: foul territory narrows), third-base 24°,
            arcs behind home centred on home plate, corner fans, outfield walls.
            Rows and covered rows from RYS section pages. 117 checks. Not
            reproduced: 215–218 rows 3+ "good shade" in a 1:35 PM game (true at
            4:10), 212 "in the shade" (cover unsourced), 220 rows 5+ late
            afternoon (only from the 6th inning). 2019 USGS lidar exists.
      - [x] Busch Stadium: club drawing pinned with 9 controls (1.6 m RMS),
            sections counted on an arc 35 m from home (151 on the axis) and
            along lines 35 m back from each foul line. Stands square to both
            lines (197°/287°), arcs centred on home behind it, the shadowed
            right-field corner read with the contrast raised (faces 135°).
            Rows from RYS (lettered rows on the D boxes) and the club's data
            (Cardinals Club rows A–C); covered rows converted to positions.
            Suites rated as at the other parks (needed for the 60% coverage
            rule; party patios and clubs stay unrated). 60 checks. Not
            reproduced: 341–347 shade in late-afternoon games (likely the bowl
            curving behind home, which the cross-section can't see); 3B side
            best at 3:05 PM (only 2025 such game, in March, comes out even).
      - [x] Nationals Park: club drawing pinned with 8 controls (2.6 m RMS).
            First fit missed by 7–8 m until the photo showed each straight
            block starts with a narrow section (118 / 127) after the
            cross-walk. Stands square to both lines (164°/254°); rows behind
            home are arcs centred 3 m behind the plate (curve facings computed
            from that centre). The 300s' back obstacle is the Upper Gallery
            roof's edge just behind them (seen on the photo), which makes them
            shade from the back rows late in the game as RYS says. Rows and
            covered rows from RYS (lettered rows incl. AA–WW). 75 checks. Not
            reproduced: club 206–216 "always shaded" and 217–221 shaded at
            first pitch (RYS's own covered rows are G+ only).
      - [x] Camden Yards: club drawing pinned with 10 controls (2.2 m RMS).
            RYS places the dugouts (22–26, 48–52); on the photo they start
            level with home, so 28–46 are ~10° wedges on the curve (axis on
            36/38). Sections behind a dugout start behind it (their middles
            ~24 m out, not ~20: fixing that took the misses from 5–7 m to
            2–3 m). Stands square to both lines (166°/256°), arcs behind home
            centred 5 m back, right-field corner angled to home (140°),
            bleachers and left-field stands from their rows. The Terrace
            behind home is C31–C43 on the club's map (RYS's 31–43). 101
            checks. Not reproduced: 242–264 "entirely shaded by the middle
            innings, last five rows all game" (RYS covers rows 8–9 only; holds
            in September by the middle innings).
      - [x] Petco Park: replaced the evenly spread placeholder arcs with the
            club's own seat map (every label read off its 2026 drawing, 108
            sections; suites and group areas keep their places from the
            suite and hospitality maps). The drawing is a plan but not to
            scale behind home, so it is pinned with photo controls (4.3 m
            RMS); the first-base side is in shadow on the photo, and the
            foul-territory wall traced on both sides is symmetric within
            ~1 m, so 111/117 mirror the measured 110/116. Stands: 135°/225°
            along the lines, turning to 90°/270° along the outfield lines,
            arc centred on home behind it, outfield corners 298°/45°. Rows
            and covered rows from RYS. 30 checks. Not reproduced: Lexus Club
            "most shaded by first pitch" (RYS covers rows 9+; model ~half),
            300–305 row 10 shade "in a few innings", and 305's row 21 at
            the last sample.
      - Open: section 222 is not on the club's 2026 drawing (the Cutwater
            Agave Club is in its place) but stays in the inventory (RYS still
            lists it); left unrated. Ask before removing it. Also
            `giantsSourcedSeeds` in sourcedStaticParkSeeds.ts is unused since
            batch 1.
      - [x] Fix: "Most shade this game" no longer lists a section that is in
            the sun on average (it took the best of each seating area, even
            a sunny outfield stand).
      - Review (2026-11-11): 7 commits, all local. 2,571 tests pass, tsc
            clean, each page checked at 375 px (no sideways scroll, map and
            best bet render). Orientation fixed at Truist (135° → 159°, 24°
            off); the other four moved 0–2°. Seat maps pinned to the photo
            at 1.6–4.3 m RMS; every stand direction measured on the photo.
            Reference checks: Truist 117, Busch 60, Nationals 75, Camden 101,
            Petco 30. Disagreements are written into each test header (none
            tuned away); they cluster where Rate Your Seats describes more
            shade than its own covered-row data supports, which points at the
            estimated deck heights. Low-confidence share 34–43%, as batch 1.
            Method notes: Rate Your Seats section pages give rows and covered
            rows for every park (tmp/rysSections.py); count front and back
            blocks, letters (A–Z, AA–WW) and skip drink rails and wheelchair
            rows. A dugout section's middle sits ~24 m out, not ~20. Where a
            side is in shadow, brighten the photo before reading it.
- [x] 6.3 Batch 3: Angels, Rockies, Royals, Reds, Pirates.
      - [x] Orientations, measured on NAIP with 4–6 methods each (incl. foul
            lines 30–95 m out): Angel Stadium 44° (was 50°), Coors 5° (was
            0°), Kauffman 47° (was 48°), Great American 122° (was 115°), PNC
            116° ±1.5° (was 120°).
      - [x] Angel Stadium: the club's drawing pinned with 7 counted sections
            (1.9 m RMS). Rate Your Seats' own sentences put 104–113 on the
            third-base side: the first fit had the numbering mirrored (an
            affine fit absorbs a reflection, so check sides against a
            source). Stands 269°/179°, arcs behind home centred ~5 m back,
            corners 299°/130° (the right-field corner's first fit caught its
            aisles; the row texture gives 38–42°), outfield pavilions 73°/1°.
            The upper decks stack forward, so the structure behind the 100s
            is the View level's roof (edge ~44 m from the first-base line on
            the photo, ~11 m behind the 100s' last row): with it the
            third-base 100s go from sun to shade over a 1 PM game, as RYS
            says. 97 checks.
      - [x] Coors Field: the club's drawing (turned 45°) pinned with 7 counted
            sections (1.1 m RMS): an aisle sits on the axis, so 130/131
            straddle it. Stands 139°/229°, arcs centred ~4 m behind home,
            outfield stands 330°/48°, corners from their radial aisles
            (286°/96°). RYS's "C-W" is a companion/wheelchair row, not
            letters; the 300s' L/U sections are the rows in front of and
            behind the walkway. Behind home RYS says rows 28–36+ of 128–133
            are "shaded", not covered; the photo shows a shadow band over
            those rows, so they get the deck's edge with cover unsourced
            (tried both ways). 22 checks. Not reproduced: the third-base
            club all shaded by 3 PM, the front of 105–109 shaded at first
            pitch.
      - [x] Kauffman Stadium: soft photo (0.6 m source); the club's drawing
            pinned with 5 sections counted along the baselines (3.1 m RMS).
            Stands parallel to both lines (182°/271°), arcs ~5 m behind
            home. The 3D drawing places the upper rings ~45° off (the Loge's
            middle at 180°), so the 200s/300s/400s are mapped by order onto
            the lower bowl's shape (each ring's middle behind home) — an
            approximation, noted in the file. The 400s' single- and
            double-letter rows are separate sections on the map. Behind the
            lower bowl the photo shows the upper deck's edge ~10 m behind
            the 100s. 89 checks. Not reproduced: rows M–V of 409–427
            "safely in the shade after 3:00" (only near the end of a 3:10
            game at an estimated 30° rake).
      - [x] Great American Ball Park: the club's drawing pinned with 5
            sections (3.5 m RMS): behind home the five short sections behind
            the Diamond Seats (122–126) are centred on the axis; along the
            first-base line the aisles give 127–134, and the third-base side
            mirrors them within ~1 m. Stands 256°/347°, arcs centred on home,
            outfield stands 85°/160°. The roof's edge sits over the
            first-base 100s' last rows and ~17 m behind the third-base ones
            on the photo. 59 checks, none failing. RYS's shade page places
            108–112 in right field; its section pages and the club's map put
            them on the third-base side.
      - [x] PNC Park: the club's drawing pinned with 5 counted field-level
            sections (2.2 m RMS, which also confirms the numbering): an aisle
            sits ~2.5° from the axis between 16 and 17; ~7.5 m sections along
            each line. Stands 253°/338°, arcs centred on home, right field
            170°, left-field bleachers/rooftop 78°. 23 checks. Not
            reproduced: the upper half of 301–312 "always shaded" (RYS covers
            rows R+; the model ~half at a 1:35 PM start).
      - Review (2026-11-11): 7 commits, all local. 2,941 tests pass, tsc
            clean, each page checked at 375 px. Orientations: Great American
            115° → 122° and Angel Stadium 50° → 44° are the big fixes; the
            other three moved 1–5°. Seat maps pinned at 1.1–3.5 m RMS.
            Reference checks: Angel 97, Coors 22, Kauffman 89, Great American
            59, PNC 23. Lessons: an affine fit can absorb a mirrored
            numbering (check sides against a source); the decks above stack
            forward, so what stands behind a lower bowl is often the upper
            deck's roof edge, measured on the photo square to each line;
            row-texture direction separates rows from aisles where a ridge
            fit catches aisles. Kauffman's upper rings are mapped by order
            (photo too soft); worth redoing with a sharper flight.
- [x] 6.4 Batch 4: Tigers, Guardians, Twins, White Sox, Athletics (Sutter
      Health Park).
      - [x] Orientations, measured on NAIP with 5–7 methods each: Sutter
            Health Park 47° ±1.5° (was 20°, 27° off), Rate Field 129° ±2°
            (was 120°; the only flight has the first-base stands' shadow over
            home, so home is read from the sunlit edges of its circle),
            Comerica 151° (was 145°), Progressive 0° ±1.5° (was 356°),
            Target 91° (was 90°).
      - [x] Comerica Park: resampling each baseline stand square to its line
            (new tmp/rectify.ts) shows both bowls mirror each other: aisles
            2/11/20/29 m from home behind each dugout (RYS rows 7–35 there),
            then 35.5/45/55/68/81 m. The club's 3-D drawing needs a
            projective fit once the outfield stands are pinned (2.5 m RMS
            with the right-field bleachers and the left-field pavilion behind
            the bullpens; affine could not hold both). The fit puts 125–130
            on the photo's wedges behind home without being told. Stands
            286°/17°, curve centred ~4 m behind home, corners 238°/65°,
            bleachers 197°, pavilion 102°. Rows and covered rows from RYS
            (Tiger Den and terraces A–H, covered from C). 51 checks; RYS's
            "afternoon games" advice holds on the 5:10 PM start, and at
            1:40 PM the model agrees midday shade is scarce. Not reproduced:
            row C of TD126–127 for the first half hour of a 1:40 PM game; the
            pavilion "most sun" (the third-base side ties). Open: the map
            draws each section as its 3-D footprint box, which overlaps
            heavily here (display only).
      - [x] Progressive Field: the rows run ~6° inside both foul lines
            (39.4° and 320.8°, facing 129°/231°) as the foul ground narrows.
            Resampled along its rows, each side has an aisle every 6.5 m,
            one per section (148→125 and 159→175; RYS's rows start at F
            behind the dugouts, at A from 138/165 where the dugouts end);
            behind home they radiate from the plate every ~11.2°, one on the
            axis between 153 and 154 (symmetric RYS rows). Shadowed side
            read on a lifted copy (new tmp/polar.ts unrolls the curve).
            Projective fit 2.2 m RMS with the right- and left-field stands
            pinned; 150–157 land within 3° of their wedges. Corners 140°/221°,
            right field 56° (its 300s and 400s too), left field 328°.
            50 checks; the covered right-field 300s face the afternoon sun,
            so only their back rows are checked as shaded (RYS calls them as
            sunny as the seats below). Sections whose rows start a few rows
            up (326 at D, 348 at C, 176–177 at Y) get their front row's
            height. RYS's noon advice names 257–267, not on today's map.
      - [x] Target Field: the boxes (1–17) and 100s counted on the photo:
            boxes every ~9.5 m along each line (the three behind each dugout
            are RYS's rows-5–13 sections), behind home aisles at 229.5–310°
            with one on the axis between 8 and 9; the 100s' aisles put 114
            (a narrow section) on the axis. Affine fit 3.5 m RMS with the
            left-field bleachers and the right-field seats pinned as whole
            stands (the builder takes affine within 5 m). Stands 226°/316°,
            arcs on home, corners 205°/340° from their aisles; the canopy's
            front edge (new tmp/edgeRays.ts) follows the same shape, so the
            upper rings use the same runs with their own corner bounds.
            Outfield 52° (left) and 130° (right). 52 checks. RYS's "1 PM"
            advice for the first-base 100s (rows 10+) and club A–D holds in
            September, not July (sun ~67° up); not reproduced: third-base
            rows 15–16 by the end, K–R's lower rows by mid-game, 316–327
            "ending in the sun" (the sun swings behind them), bleacher row 5,
            club E "shaded most day games".
      - [x] Rate Field: the hand-typed compass table (keyed to the old 120°)
            is replaced by the club's own 2026 seat map: every section's
            outlined box found by flood fill on the drawing (new
            tmp/regions.ts), 132 sections as before (334 keeps its ticketed
            id 334A). Photo (2019, first-base side in shadow, read on a
            brightened copy): an aisle every ~5.6 m along each line; RYS's
            rows start at 5 in the six sections behind each dugout and the
            photo's dugouts span the first six, so 127 and 137 start each
            straight; behind home four sections each side of 132 between
            aisles that radiate from the plate. Affine fit 3.4 m RMS with the
            outfield stands pinned whole. Stands 263°/355°, corners from
            their aisles (36°/68° in left, mirrored 226°/187° in right),
            outfield 164° and 89°. Upper-deck names now follow RYS (Upper Box
            522–542). 37 checks. Not reproduced: RYS's 2:30 PM late-July
            photo (all but the first 15 rows of the first-base 100s shaded;
            the model gets there an hour later) and "most" first-base lower
            rows shaded at a 3:05 PM first pitch.
      - [x] Sutter Health Park: the placeholder arcs (101–123 spread evenly,
            201–206 called suites) are replaced by the club's own 2025 seat
            map (the same 29 ids; 201–206 are a five-row club behind
            101–106). The drawing is a plan to scale: turned to the measured
            47° it lands on the photo's aisle wedges behind home within ~1.5°
            and along both lines within ~2 m, so the fit is affine at 0.3 m
            RMS. Both straights converge on their foul lines (rows at 81°
            and 10.4°, facing 171°/280°); arcs on home behind it. Rate Your
            Seats has no pages for this park: rows are counted on the club's
            drawing (agrees with fans' seat photos), shade claims come from
            shadedseats.com. The suite/press-box edge stands ~2 m behind the
            last row behind home (its shadow falls on the back rows on the
            photo) and ~1.5 m on the third-base side, ending before 123. 20
            checks pass. Not reproduced: 109–113's back quarter shaded by
            2–3 PM, and 109–111 in the evening (the low sun comes in
            sideways past the press box, which a cross-section can't see).
      - [x] Fix: the Athletics' history entry described the Oakland
            Coliseum, so the page said "Built 1966"; now Sutter Health Park
            (2000, ex-Raley Field). The unrendered Coliseum guide in
            mlbStadiumGuidesFinal.ts is still there (open item).
      - Review (2026-11-12): 8 commits, all local. 3,231 tests pass, tsc
            clean, each page checked at 375 px. Orientations: Sutter Health
            Park 20° → 47° and Rate Field 120° → 129° are the big fixes;
            Comerica 145° → 151°, Progressive 356° → 0°, Target 90° → 91°.
            Seat maps pinned at 0.3–3.5 m RMS; two hand-made maps (Rate
            Field's compass table, Sutter Health Park's placeholder arcs) are
            replaced by the clubs' own seat maps with the same section ids.
            Reference checks: Comerica 51, Progressive 50, Target 52, Rate
            Field 37, Sutter Health Park 20. Disagreements are written into
            each test header, none tuned away; as before most are timing (a
            source's shade arriving an hour or so earlier than the model's
            estimated deck heights give) and one is a model limit (low sun
            from the side past a structure that is not behind the section).
            Low-confidence share at a July 1:05 PM game: Progressive 16%,
            Target 33%, Comerica 53%, Rate Field 53%, Sutter Health Park 55%
            (high sun, many sections near a boundary; Rate Field's club and
            Sutter's first-base overhang have unsourced cover, tried both
            ways). Lessons: a 3-D club drawing needs its outfield stands
            pinned too, and then a projective fit (Comerica, Progressive);
            a plan drawing can be checked straight against the photo's aisle
            wedges (Sutter); where a source gives no rows, the club's drawing
            can (Sutter, checked against fans' seat photos); straightening
            each stand along its own rows (tmp/rectify.ts) makes aisles
            countable even in shadow. Open: the Coliseum guide data for the
            Athletics (unrendered); the 3-D drawings' footprint boxes overlap
            on Comerica's drawn map (display only).
- [ ] 6.5 Batch 5, retractable roofs (answers assume the roof is open, as
      today): Diamondbacks, Rangers, Astros, Marlins, Brewers, Mariners,
      Blue Jays. Five of seven profiled; two blocked on imagery (below).
      - [x] Orientations. The newest USGS photo shows the roof closed at
            most of these parks, so the script can now fetch any NAIP year
            from the Planetary Computer archive (and, for Toronto, a city
            MapServer). Chase Field 0° (confirmed), Daikin Park 345° (was
            340°), loanDepot park 129°, American Family Field 130° (was
            135°), T-Mobile Park 48° (was 45°), Rogers Centre 345° (was 0°,
            15° off; City of Toronto's 2012 photo, the one public image with
            the roof open; the script reads artificial turf by its dirt
            cutouts).
      - [x] Chase Field: seat map pinned at 1.9 m (nine field boxes on the
            aisles); the parked roof panels, the fixed roof behind home and
            the suite deck measured on four open-roof flights give each
            section's covered rows. 23 checks.
      - [x] Daikin Park: stands in shadow on recent flights, so aisles read
            on the 2012 and 2014 ones; 1.1 m; roof edges on four flights.
            31 checks.
      - [x] loanDepot park: 2013 flight (roof fully open); the hidden
            first-base side pinned as the mirror of the measured third-base
            side; 2.6 m. 16 checks.
      - [x] American Family Field: 2020 flight; the folded panels' edges on
            three flights; 1.3 m. 15 checks.
      - [x] T-Mobile Park: aisles from the 2013 and 2017 flights, the
            outfield pinned from 2011 (3-D drawing, projective, 2.8 m); the
            parked roof's edge over the right-field stands and the upper
            canopy measured. 12 checks.
      - [ ] Globe Life Field: no public photo shows the field. NAIP 2020
            and 2022, every City of Arlington, Fort Worth and Esri capture
            2020–2026 show the roof closed; 2018 is construction. Its
            coordinates pointed at the old ballpark next door (fixed). The
            one untested public source is the 2024 Texas NAIP (USDA's
            server doesn't answer from here; TxGIO serves it only as a
            county download). Orientation stays the published estimate.
      - [ ] Rogers Centre: sections now come from the club's 2026 seat map
            (adds the field-level clubs 1–5 and 16–32; drops suites 330–334,
            not on the map). Not pinned or profiled: the 2012 photo
            predates the 2024 rebuild of the 100 level, and every Toronto
            and Ontario photo since 2013 shows the roof closed.
- Rays: Tropicana Field has a fixed roof, so every seat is shaded and
  there is nothing to profile. (Their 2025 home was Steinbrenner Field.)

### Known hard cases
- Rogers Centre is in Canada, which USGS imagery doesn't cover: use
  Toronto's open-data aerial photos or OpenStreetMap, with a wider ±.
- Retractable roofs may be closed in the aerial photo, as at two NFL
  fields. Then I'll use other imagery or OpenStreetMap, with a wider ±.
- Giants, Padres, Athletics, Blue Jays and White Sox seat maps come from
  hand-typed compass tables rather than the club's 3-D map, so they need
  converting before they can be calibrated.
- Heights: like Yankees and Fenway, estimated unless a public source gives
  them. USGS lidar exists for several parks and can turn an estimate into
  a measurement. I'll use it where a reference check disagrees and the
  height is the likely cause.

### Batch 5 review (2026-11-12)
Ten commits, local only. What changed: six orientations measured (two
large fixes: Rogers Centre 0° → 345°, American Family Field 135° → 130°);
five parks profiled with the roof open (Chase Field, Daikin Park, loanDepot
park, American Family Field, T-Mobile Park), each with its seat map pinned
to an open-roof photo (1.1–2.8 m), photo-measured stand directions, the
parked roof's edges measured on several flights, and 97 reference checks
on real 2025 games; Globe Life Field's coordinates fixed; Rogers Centre's
section list rebuilt from the club's 2026 map. 3,431 tests pass, tsc is
clean, each page checked at 375 px.
Not reproduced (in each test header): Chase Field's first-base 300s (the
parked panels reach over them) and 106–109 ("well-covered" vs
"particularly exposed"); Daikin Park's 152–155 rows 12–17 and 131–134 as
the very sunniest; loanDepot's right-field "decent for day games" and late
shade down the third-base line; American Family Field's third-base upper
deck "under cover" (the panel is ~110 ft above it); T-Mobile's first-base
100s by 4 PM, the bleachers at first pitch, and 306–310 by 3 PM. Two of
these are a model limit already seen at Sutter Health Park: a low sun from
the side past a structure that is not behind the section.
Low-confidence share at a 1:10 PM game (April / July): loanDepot 27% /
23%, American Family 18% / 33%, Daikin 33% / 47%, Chase Field 45% / 49%,
T-Mobile 70% / 75% (its view-level canopy has unsourced cover, tried both
ways). Lessons: at retractable-roof parks the newest photo is often
closed; older NAIP years (Planetary Computer) usually have one open; the
stands are often in the roof's shadow, so different flights light
different sides. Open: Globe Life Field and Rogers Centre (imagery); the
unused hand-typed `blueJaysSourcedSeeds` (with `giantsSourcedSeeds` and
`athleticsSourcedSeeds`) can be removed with your OK; ShadeFinder shows
loanDepot's map ids ("Section SEC39") rather than "Section 39".

### Done means
Each park shows as profiled, has its measured orientation and 5+ passing
reference checks, and its page is checked on a phone. All tests pass. New
blog posts for these parks come after, as their own step.

## 7. Plan: measured heights from lidar (2026-11-12)

Why: 264 of the 265 profiled tiers in `stadiumStructures.ts` have estimated heights.
The confidence check moves estimates ±25% (measured ±10%), which is behind
most Low labels (18–75% of sections at a 1:10 PM game). A pilot on Dodger
Stadium shows the estimates are also off: the loge's front row is ~23 ft up
(estimated 36 ft) and the top deck's back ~125 ft (estimated 165 ft).

### Source
USGS 3DEP airborne lidar (public domain), the newest scan of each park:
- Fast route: USGS's own copy on AWS (`usgs-lidar-public`, Entwine format),
  which fetches only the park (6M points for Dodger Stadium in 17 s).
- Slow route: the 2023–24 scans not on AWS come as whole tiles from USGS's
  rockyweb server (~20–75 KB/s, one connection; it refuses parallel ones).
  About 920 MB, downloaded in the background while other parks are done:
  Phillies 163 MB, Pirates 157 MB, Orioles 107 MB, Padres 98 MB (2024),
  Astros 213 MB (2024), Marlins 183 MB (2023).
- Points are cropped to 460 m around home plate and kept in `tmp/`
  (git-ignored); the raw tiles are deleted after cropping.

| Park | Scan (flown) | Park | Scan (flown) |
|---|---|---|---|
| Dodgers | LA 2023 (Nov–Dec 2023) | Giants | SF 2023 (Apr 2023) |
| Phillies, Pirates | PA 17-County (2024–25) | Orioles | MD 4-County (2024) |
| Padres | San Diego Co. (2024) | Marlins | Miami-Dade (2023) |
| Astros | Houston (2024) | Twins | Central Miss. River (May 2022) |
| Reds | Ohio Phase 3 (Dec 2021–Apr 2022) | Red Sox | MA Central-Eastern (Mar–Apr 2021) |
| Mariners | King Co. (Apr 2021) | Diamondbacks | Maricopa-Pinal (Oct–Nov 2020) |
| Rockies | Denver DRCOG (May–Jun 2020) | Royals | MO FEMA-NRCS (2020) |
| Guardians | Ohio Phase 1 (Nov 2019–Mar 2020) | Braves | Georgia B2 (Jan–Apr 2019) |
| Cubs, White Sox | Cook Co. (Apr–May 2017) | Tigers | Wayne Co. (Apr 2017) |
| Cardinals | St. Louis (Feb 2017) | Athletics (Sutter) | Central Valley (Dec 2017) |
| Brewers | SEWRPC (Mar–Apr 2015) | Yankees, Mets | New York City (Mar–Apr 2014) |
| Nationals | Sandy NCR (2014) | Angels | CA Gaps 2023 (partial; checked first) |

A stand rebuilt after its scan keeps its estimate, with the reason written
down (for example Wrigley's 2018 field boxes, Progressive Field's 2023–25
work). Rogers Centre (not USGS), Globe Life Field (scan predates it) and
Tropicana Field (fixed roof) are out of scope.

### Method (one reproducible script, `scripts/measureStandHeights.py`)
1. Field level: median ground return within 35 m of home plate.
2. For each section, a cross-section from home along its bearing finds the
   stacked seating runs. The section's tier is picked by its order from the
   field (a short list per park, checked on a picture), not by its pinned
   centre: the pilot shows the club drawings' upper decks can sit 10–20 m
   off radially.
3. A second cross-section along the section's stand direction through that
   run measures:
   - the front row's height and the rake (from the treads);
   - the bottom edge of the deck above, where the scan hits its front face;
   - what stands behind (height and setback);
   - the far rim, once per park.
4. A tier's value is the median over its sections. A section that differs
   by more than 10% (or 3 ft) gets its own value.
5. The values replace the estimates, each with a note naming the scan, its
   dates and the spread. `heightsSourced` becomes true only for a tier whose
   heights are all measured. A tier hidden under a deck keeps its own floor
   estimated and stays false, with the reason written down.
6. Covered rows stay as their sources give them. Where the lidar's deck edge
   disagrees by more than two rows, I note it and ask you before changing
   anything.

### Checks per park
- All tests run.
- A reference check that changes result is investigated against its
  cross-section and recorded in the test header, never tuned away.
- The Low-confidence share is recorded before and after.
- One commit per park.

### Order
- Same batches as the profiles: Yankees and Fenway with batch 1 (Dodgers,
  Cubs, Giants, Mets, Phillies), then batches 2–5.
- I check in with you after batch 1.

- [x] 7.1 Batch 1 lidar heights: Yankees, Fenway, Dodgers, Cubs, Giants, Mets, Phillies
      (2026-11-12, 11 commits from e5bca2555 to 97a7402f9; all 3436 tests pass).
      Measured front rows (ft, was estimated):
      | Park | Lower | Middle | Upper | Far rim |
      |---|---|---|---|---|
      | Dodgers | Field 1 (7), Loge 22 (36) | Reserve 56–57 (92) | Top Deck 97 (126) | 120 (165) |
      | Yankees | Legends 0 (2), 100s 6 (4) | Main 29 (31), Terrace 72 (69) | 400s 95 (96) | 134 (132) |
      | Fenway | Field Box -1 (2), Loge 4 (10) | — | Pavilion 52–53 (55–60) | 82 (70) |
      | Wrigley | not measured (rebuilt 2017–18) | — | 300s 48 (40); roof underside 87 (57) | 95 (72) |
      | Oracle | 100s 0 (3) | Club 32 (48) | View 74 (80); roof 124 (115) | 125 (125) |
      | Citi | 100s 4 (8) | Sterling 25 (50), Excelsior 46 (62) | 400s 69 (86), Promenade 85 (100) | 129 (138) |
      | CBP | 100s 0 (3) | 200s 44 (50) | 300s 69 (80), Terrace 90 (96) | 133 (132) |
      Rakes are mostly lower: lower bowls 9–13° (estimated 14–20°).
      Not measured, with the reason in the data: Wrigley's lower bowl (rebuilt
      after the 2017 scan); the Yankee and Fenway bleachers (the club charts
      put them off their stands); Citi's left-field seats (1 of 6 found);
      enclosed suites and decks hidden under other decks (re-estimated from
      the measured decks around them).
      Low-confidence share at a 1:10 PM game, April / July, before → after:
      Yankees 50/32 → 61/55, Fenway 45/22 → 33/28, Dodgers 35/20 → 48/45,
      Cubs 34/31 → 37/37, Giants 35/19 → 40/23, Mets 58/49 → 55/51,
      Phillies 39/39 → 49/45. The rises come from cover marked unsettled
      (below) and from tiers whose underside is estimated being perturbed
      ±50% as a whole, measured heights included.
      Reference checks changed and recorded (none tuned): Fenway B125–135
      (the Grandstand roof's edge over Loge row 9 explains RYS's shaded upper
      rows), Oracle View 333/336 (measured canopy 20 ft above the heads;
      checked from row 18), CBP Hall of Fame Club 225/227/228. Blog posts:
      the Yankee and Fenway July/April claims rewritten to the new answers.
      Method found along the way: lamp banks, lattice light towers and a
      scoreboard on a pylon are not walls; a deck's underside only counts
      when its face is seen; the far rim is the roof line (the engine's
      definition), not the median of what rises across the field.
      Open for you: the cover question and the confidence split (see
      "Batch 1 review" below).
- [x] 7.2 Batch 2 lidar heights: Braves, Cardinals, Nationals, Orioles, Padres
      (2026-11-12, 5 commits from a8cba78fc to c16d327d8; option A covers and
      the 9-ft rule applied in the same commit; all 3481 tests pass; the five
      stadium pages checked on the dev server, no console errors).
      Measured front rows (ft, was estimated):
      | Park | Lower | Middle | Upper | Roof / far rim |
      |---|---|---|---|---|
      | Truist (2019) | field 0–2 (3–6), 100s 10 (15) | 200s 36 (48) | 300s 68 (82); 400s hidden | canopy 150 (137) |
      | Busch (2017) | field 0 (2–3), 100s 4 (12) | 200s 48 (50) | Pavilion 75 (74), Terrace 97 (98) | 133 (118) |
      | Nationals (2014) | 100s 1 (3) | 200s 37 (58) | 300s 73 (84); 400s hidden | 140 (132) |
      | Camden (2024) | field 1 (3), Terrace home 23 (30) | club 40 (52) | upper 63 (70) | 119 (110) |
      | Petco (2024) | field and 100s 0 (3–4) | Terrace 36 (38) | Upper Box 67 (75) | 133 (118) |
      Low-confidence share at a 1:10 PM game, April / July, before → after:
      Truist 54/43 → 44/43, Busch 36/27 → 27/31, Nationals 43/31 → 33/27,
      Camden 43/31 → 14/16, Petco 33/28 → 29/29.
      Covered rows from the scan (option A), the larger moves: Busch's club
      level from row 4 (9) and loge from 5 (none given); Nationals' 100s
      from 36 (about RR) and 200 level from 2 (7–12); Camden's club level
      from 5 (8); Petco's Lexus Club from 4 (9), Terrace from 4 (7–11) and
      seven 100s sections from 17–26 (22–32). Some go the other way: Busch 135 and 162–167, where the
      seats show in the open up to an edge further back than the source's
      row.
      Reference checks: now hold — Truist 220 rows 5+ and the 400s, Busch
      341–347, Camden's third-base club, Petco's Lexus Club at first pitch
      and 300–305's rows above 20; narrowed with the measured reason
      in each test header — Truist 110–122 row 7, 1–42 and behind home;
      Busch 135/162–167, the club level, the Pavilion, the third-base lead,
      152–154 in March; Nationals' Gallery and outfield.
      Method added (none of it changes a batch 1 park, checked by re-running
      their cover reports):
      - Where a roof's edge comes first over a deck of seats starting
        further back under it, that deck is the edge (the lower one).
      - Seats seen well past an edge are not under it (a bridge, a frame).
      - Truist: the canopy's edge never replaces a sourced covered row (the
        deck under it is unseen); it counts as what rises behind.
      - A park's deck depth needs at least three edges (else 9 ft).
      - Where the deck above shows only its first row from the air, its
        front as measured on its own sections stands in for it.
      - A guessed (unsourced) covered row no longer limits how many rows the
        scan may see.
      - Corner sections whose cuts run along the steps are skipped.
      - Petco's upper deck: only the roof counts as an edge (lower "edges"
        are the Upper Deck's rows behind the aisle); the band takes the
        Upper Box only, so no section is measured from the wrong first row.
      - Two-block sections (Petco's 100s): the cross-aisle counts as rows in
        the scan's distance, as it does in the engine's even row spacing.
      - Nationals' Gallery: where the roof's edge is over only the last row
        or two (under option A's three-row mark) those rows are covered
        too, or the edge, as what rises behind just in front of the last
        row, would leave the rows under it with nothing behind.
      Caveat: a roof is treated as the top of a wall behind the seats; on
      the ground light may come in under its open back (Busch's 152–154 in
      March read shadier than Rate Your Seats says).
- [x] 7.3 Batch 3 lidar heights: Angels, Rockies, Royals, Reds, Pirates
      (2026-11-12, 5 commits from 5a6c39c4f to 897bece5c; option A covers and
      the 9-ft rule applied in the same commit; all 3490 tests pass; the five
      stadium pages checked on the dev server, no console errors).
      Scans: Angels 2023 California gaps tile (home plate's side, which the
      2018 SoCal scan leaves out) with the 2018 scan for the rest (they agree
      to 2 cm on the ground); Coors 2020, Kauffman 2020, Great American 2022
      (no later scans cover them); PNC 2024 (two rockyweb tiles, cropped and
      deleted).
      Measured front rows (ft, was estimated):
      | Park | Lower | Middle | Upper | Roof / far rim |
      |---|---|---|---|---|
      | Angel Stadium | field 2 (4); Terrace hidden | club 35 (48) | 400s 60 (64), 500s 80 (84) | 123 (118) |
      | Coors Field | field 0 (4), RF seats 15 (8) | club 34 (48) | L 67 (70), U 85 (84), Rockpile 51 (10) | 128 (100) |
      | Kauffman | field 3 (3), Plaza 16 (20–24) | Loge hidden | upper 60 (74); AA–ZZ hidden | 151 (130) |
      | Great American | field -1–1 (3), Diamond -1 (2) | club 35 (44), 200s 35 (36) | 400s 52 / LF 33 (48), 420s 68 (52), View 84–88 (76–80) | 138 (112) |
      | PNC Park | field -1 (3), 100s 5 (14) | club 53 (52) | 300s 76 (66), rooftop 39 (40) | 120 (100) |
      Low-confidence share at a 1:10 PM game, April / July, before → after:
      Angels 41/37 → 31/23, Coors 48/39 → 25/27, Kauffman 34/5 → 22/16 (the
      July rise is Kauffman's hidden double-letter rows, still estimated),
      Great American 34/21 → 9/6, PNC 25/13 → 7/11.
      Covered rows from the scan (option A), the larger moves: Coors' 100s
      from 26 (28–37), club from 5 (8), U rows from 6 (10); Angels' 500s from
      A (D) and the corners' 100s from 22 (none); Kauffman's Plaza from 6
      (LL/NN), the upper deck's last rows in five sections; Great American's
      club from 4 (G), third-base 400s from 14 (Q), View level from 7 and 11
      (L, O); PNC's 100s from 17 (W) and 300s from 6 (R). Settled where only
      an estimate stood: Coors behind home, Angels' club (from E) and left
      pavilion (open), Great American 113–120, 200s and 306–307, PNC 313–319.
      A tier fix found on the way: Coors 301–309 were in the Rockpile's
      profile (front 10 ft); they are the Reserve Level Outfield, rows 1–5,
      open (Rate Your Seats), now their own tier at 68 ft.
      Reference checks: now hold — Coors' third-base club by 3 PM, PNC's
      upper half of 301–312 "always shaded" (three games); partly — Kauffman's
      rows M–V of 409–417 from about 3:40 (claim: after 3:00). Recorded as not
      reproduced, each with its measured reason in the test header — Coors
      133's rows 28+, Angels 104–113 at first pitch (the club deck is over
      their row 22), Kauffman's double-letter ends and 248, Great American's
      third-base 400s (the View level's edge is over their row 14), PNC's
      club "rarely in the shade" (the first-base club is shaded in the last
      hour, as the later-innings check says).
      Method added (re-checked against the committed parks: one value
      affected, Cardinals 269, which it reproduces):
      - Fetch combines a scan with newer tiles flown to fill its gaps: where
        a tile has points, only its points.
      - A band can ask for a least run length (Coors: a 3–4 m piece at the
        backstop was taken as the stand).
      - An edge that shows a deck's front row but too few points beneath
        uses that row less the deck depth.
      - The light-tower filter's height sits between a roof's lamp banks
        (which stand over seats) and the pylon towers (Angels).
      - Hidden tiers (Angels' Terrace, Kauffman's Loge and double-letter
        rows) are re-estimated from the measured tiers around them.
      - Where nothing rises behind a stand, its own top (Rockpile, 521, PNC
        142/144).
      - Skipped, with reasons: cuts across the rows at an angle (Coors L311,
        Angels 241, Great American 401–405, whose front comes from the cut
        from home plate), a seat map place off the stand (Angels 260), the
        front rows below a step (Kauffman 417–425).
      Open for you:
      1. Engine: with the sun behind a stand, a deck stops it only below its
         underside, not up to the top of its front face (Coors 133: underside
         27 ft, face top ~39 ft). Taking the face top would shade the rows
         just in front of every deck edge more, at all 30 parks.
      2. Tool: an underside seen more than a metre behind a deck's edge is
         not used (Great American's 400s: seen at 83–88 ft, the rule gives
         78). Using it would change some committed undersides; it barely
         moves the one claim checked (25% → 24%).
      3. Kauffman's double-letter rows: the roof is seen over them from AA
         (source: MM); they are hidden, so the source's row stays by the
         approved rule.
      Caveat: row depth stays 2.75 ft; the scans are too sparse to read rows
      (Angels: ~5 points a metre), and where it matters (Angels 104–113) it
      moves the covered row by 2–3.
- [x] 7.4 Batch 4 lidar heights: Tigers, Guardians, Twins, White Sox,
      Athletics (2026-11-13, 6 commits from c7589f583 to 95ef50cac: one per
      park plus one tool fix; option A covers, the 9-ft rule and deck fronts
      in the same commits; all 3536 tests pass; the five stadium pages
      checked on the dev server, each with its answer, no console errors).
      Scans: Comerica 2017, Progressive 2019 (the newest; predates the
      2023–25 renovation), Target Field 2022, Rate Field 2017, Sutter Health
      Park 2019. Checked for changes since: Progressive's Terrace Club was
      rebuilt (2025), so what is over and behind 167–175 and the left-field
      corner is not measured; Rate Field's 500 level gained two view bars
      (2023), and the sections the chart now gives fewer rows start that many
      rows up the measured deck; nothing structural at Target or Sutter.
      Measured front rows (ft, was estimated):
      | Park | Lower | Middle | Upper | Roof / far rim |
      |---|---|---|---|---|
      | Comerica | field -1–2 (3), LF 6 (10), RF 10 (6) | mezzanine 50 (50) | upper 62 (60) | 118 (108) |
      | Progressive | field 0–3 (3), RF 6 | club 28 (36), RF 300s 38 (32) | 400s 71 (70), 500s 87 (82) | 139 (125) |
      | Target Field | boxes 1 (3), 100s 9 (12) | club 38 (34) | 200s 73 (52); 300s hidden, carried to 83 | 148 (110) |
      | Rate Field | field 0 (3) | club 48 (45) | upper 72 (68) | 130 (112) |
      | Sutter Health | field 0 (4) | club 31 (36) | — | 56 (58) |
      Low-confidence share at a 1:10 PM game, April / July, before → after:
      Comerica 26/23 → 28/25, Progressive 31/13 → 22/24, Target 46/35 →
      27/23, Rate Field 50/54 → 58/56, Sutter 76/59 → 93/45. The rises are
      tiers whose underside is not a seen face, swung ±50% (Comerica's
      first-base bowl, Progressive's third-base and club, Rate Field's
      third-base lower box): the open confidence split. Sutter's April rise
      is its five-row club, now in the measured club building's shadow.
      Covered rows from the scan, the larger moves: Progressive's 500s from
      D (P), right-field 300s from 2 (M), 142–148 from 13 (19); Target's
      club from 6 (9), six infield 100s from 14 (17); Rate Field's lower box
      from 26 (30–31); Sutter's third-base back rows (none given).
      Reference checks: now reproduced and tested — Target's club A–D and E,
      third-base rows 15–16 by the end, bleacher rows 3–5 by the middle
      innings; Rate Field's late-July 2:30 PM photo and 3:05 starts; Sutter's
      evening third-base shade. Recorded as not reproduced, each with its
      measured reason — Comerica's midday lower bowl, Progressive's right-
      field 300s and "little match" canopy, Target's F–J starting sunny,
      Sutter's "behind home before the sides".
      Tool (c17e1dbea; re-checked against every park where each rule fires:
      no committed value changes):
      - An edge with seats seen past it is kept under a high roof when the
        structure stays overhead and the seats show no further in than its
        height times tan 30° (Progressive's canopy).
      - A deck under a roof needs headroom over its front (a roof's back
        truss is not one).
      - The park's deck depth counts drops of 2–15 ft only (a suite level
        under a deck of seats is not its depth).
      - suggest() lists a section's back when its setback is more than
        10 ft off the tier's (c7589f583).
      Written down, not decks: Target's corner cable line (101–104,
      124–126), the walkway over 225–226 and a lamp-bank frame over 239–240
      (left out like light towers); Progressive's canopy "deck front" (its
      own curved edge).
      Open for you:
      1. `heightsSourced` and roofs seen only from above: the approved rule
         says measured only where the underside is a seen face. Batch 4
         follows it (Comerica's upper deck and mezzanine, Progressive's
         500s stay estimated), as Citizens Bank Park did; batches 1 and 3
         counted a roof's top as measured at Busch, Camden, Angels, Coors
         (2), Great American (2) and PNC (2), and several measured tiers
         carry a section whose underside is the 9-ft rule (Nationals,
         Camden, Petco, Fenway, Citi). Settling the confidence split would
         settle these; otherwise flip them to the rule.
      2. The setback gap: before c7589f583 suggest() did not list a section
         whose back stands more than 10 ft from the tier's setback, so 279
         measured sections at the 17 committed parks still carry the tier's
         value (Royals 113–133 ~90 ft vs 66, Padres 112–122 ~-35 vs 2, Cubs
         501–514). Fixing them is per-section data plus each park's checks.
      Caveat: Sutter's chart gives 119–121 29–32 rows, but their seats end
      where the suite building begins (19 ft up, ~25 rows on the measured
      slope); option A covers the chart's back rows under it.
- [x] 7.5 Batch 5 (retractable roofs: measure the parked roof only where the scan shows it open)
      With each underside, the deck's front (`deckFrontFt`, §9) from the
      cover report, at tier level, and per section where a section is under
      another deck.
      **Done in §23:** the Mariners (phase A) and Astros (phase B) measured;
      the other retractable parks have no open-roof scan.

### Batch 1 review (2026-11-12)
Correction to the plan above: the confidence check moves estimated
structure ±50% (measured ±10%), not ±25%; the data file's header now says
so.

**Decision needed 1: covered rows.** In every park the scan shows a deck or
roof edge over rows that Rate Your Seats does not count as covered, usually
high above them (the guide counts rows under a low ceiling):
- Dodgers: Loge (Reserve deck over row 8, 47 ft up; sourced row 13),
  Infield Reserve 15/16/19/20 (Top Deck over row 12; sourced none).
- Yankees: Main (Terrace deck over row 8–9; sourced 14), Grandstand
  (canopy edge over row 2; sourced 6).
- Fenway: Loge Box (Grandstand roof edge over row 9; sourced none),
  Pavilion Reserved (over row 6–9; none).
- Wrigley: 300s (roof edge over row 1–2, underside 87 ft; sourced 7).
- Oracle: Club (View level over row 5; sourced 10).
- Citi: 100s (Sterling deck over row 14–15; sourced 27).
- CBP: 100s (row 27–28; 36), 200s (row 3; 7), right-field 300s (11; 14),
  left-field seats (16; 20), Terrace Deck (6; 9).
Rows behind such an edge currently get no shade from it when the sun is
behind (the model keeps the sourced cover), which is wrong on the ground:
that is what Fenway's B125 and CBP's Hall of Fame Club checks show. Until
decided, those tiers' cover is marked unsettled (answers can't show High).
Option A: take the scan's edge as the first covered row, with the measured
underside where the scan sees it (estimated where not). Option B: keep the
sources and the unsettled label.

**Decision needed 2: confidence for mixed tiers.** A tier counts as
measured only when every height is, and a deck's underside is rarely seen
from the air, so most measured tiers are still swung ±50% as if guessed.
A per-value flag (e.g. `soffitSourced`) would let measured fronts, rakes and
backs move ±10% while the estimated underside moves ±50%.

Tools: `scripts/measureStandHeights.py` (fetch, runs, measure; writes a
check picture and a plan view per park) and `scripts/lidar/standSections.ts`.
Scans are kept cropped in tmp/lidar/<park>.npz; the one raw tile is deleted.

### 7.1b Plan: option A, covered rows from the scan (approved 2026-11-12)
- A tier whose sections mostly put the deck's edge more than 2 rows from
  the sourced covered row (or over 3+ rows the source leaves open) takes
  the scan's edge: the median row. Sections more than 2 rows off that get
  their own. Where the scan sees no edge but the source covers rows, the
  source stays (a sparse scan can miss an edge). Where the source calls a
  section open and its row count is only a default, the source also stays:
  a short section can end before the deck edge the scan sees.
- The underside at every edge the scan sees (also where the covered row
  already agreed, since "9 ft above the first covered row's floor" put
  some undersides far below the measured deck above): the bottom of its
  face where the scan sees one; otherwise the lowest structure the scan
  sees at the edge, or, when that is the front row of a deck of seats above
  (within 2 ft), that row less the park's measured deck depth (front row to
  lowest structure, at the edges where both show; 9 ft where none do);
  never less than 9 ft above the floor of the first covered row the profile
  gets, on the profile's own front row and rake. Tier value = median,
  sections more than 10% (3 ft) off, or that the tier's value would leave
  under 9 ft, get their own. Where two decks cover one tier, split it by
  deck. Exceptions written down: Oracle's View level (its rows A–D come
  before row 1, so its edge agrees), Fenway's Monster seats (the "edge" is
  light-tower lattice, not a deck).
- Those tiers' cover becomes sourced (by the scan); `heightsSourced` turns
  true where the underside is a seen face.
- Reference checks and blog claims whose answers change are investigated
  and rewritten to the engine, never tuned.
- One commit per park; tests, Low share before and after.
- [x] Dodgers   - [x] Yankees   - [x] Fenway   - [x] Wrigley
- [x] Oracle    - [x] Citi      - [x] Phillies
- [x] Every lidar-measured underside at least 9 ft over its first covered
      row, kept by a test (found at CBP, see the review)

### 7.1b Review: option A (2026-11-12)
What changed: in all seven lidar parks the first covered row now comes from
the scan where it differs from Rate Your Seats by more than two rows, with
the underside measured where the scan sees it. Nine commits, one per park
plus two fixes; nothing pushed.

Low-confidence share at a 1:10 PM game (April / July), before → after:
- Dodgers 48% / 45% → 24% / 24%
- Yankees 61% / 55% → 32% / 30%
- Fenway 33% / 28% → 26% / 21%
- Wrigley 37% / 37% → 21% / 21%
- Oracle 40% / 23% → 23% / 6%
- Citi 55% / 51% → 39% / 39%
- CBP 49% / 45% → 27% / 23%

Rules refined along the way (all in the plan above):
- Deck depth measured per park (8.8–11 ft) instead of a 6-ft guess.
- Citi's 100s are covered by two decks (Sterling behind home, Excelsior
  down the lines): split by deck, or the first-base 100s got the low
  Sterling deck and too much shade.
- Cuts that don't run along the rows are skipped, and the wrong values they
  had given removed: Oracle 122 (down a vomitory ramp), Wrigley 515 and 536
  (across end platforms). Wrigley 513 and Yankee corners 103/104/135/136
  stay open (rows end before the edge the scan sees).
- The 9-ft underside rule was checked at the scan's edge, not at the row
  each profile got, so 13 entries at four parks and 4 at CBP (a few from
  before option A) had less, as little as 5 ft. Fixed in the script,
  raised in the data, and `deckClearance.test.ts` now keeps every
  lidar-measured profile to it. This also fixed CBP's "right field 201–211
  in the sun by the final out".

Reference checks and blog claims (investigated, never tuned):
- Now reproduced: CBP Hall of Fame Club 225–232 out of the sun by the 3rd
  inning (July and September; it had failed in July), Fenway's Loge upper
  rows shaded at a 1 PM start.
- Narrowed, with the measured reason in the test header: Dodgers 52FD,
  10RS and the pavilion's front rows; CBP 108–110 (the 200 level reaches
  their back rows, the front 20 rows stay in the sun) and 134–136 (less
  back-row shade than the neighbours, not much less).
- Blog posts rewritten to the engine: Yankees (upper deck shaded almost
  everywhere from first pitch; Main level's back rows under the Terrace),
  Fenway (Loge). CBP's post is an unpublished draft.

Still open:
- The confidence split (`soffitSourced`) from Batch 1 is not decided.
- Outside the lidar-measured tiers, many estimated undersides are under
  9 ft over their first covered row: suites at 6 ft in about a dozen
  parks, and some under 2 ft (the Reds' 400s and third-base 100s, the
  Royals' and Rockies' upper decks, the Padres' right-field upper deck);
  Wrigley's Terrace is at 5 ft. Not touched here (plan in §8).

## 8. Plan: every deck at least 9 ft over its first covered row (2026-11-12)
The rule from §7.1b, now applied at every park: a deck's underside is at
least 9 ft above the floor of the first row under it (to the nearest foot,
on the profile the engine uses). 1,139 sections at 20 parks have less.

Causes, from the code:
- Estimates written before the rule (e.g. Wrigley's Terrace, 5 ft).
- One underside shared by sections whose covered rows differ: the cover
  helpers (`gabpCover`, `coorsCover`, `petcoCover`, `pncCover`,
  `comericaCover`, …) and shared constants give one value to a whole tier,
  so sections covered further back get a floor almost at the deck (GABP
  403/404: 0.3 ft; Brewers' Loge: the deck 3.5 ft below row 17's floor).
- Suites: "one row of seats under the suite ceiling", the ceiling 6 ft
  above the floor at 12 parks (8 ft at 3).

### Part A: everything but suites (about 380 sections, 16 parks)
Raise each to 9 ft over its own first covered row, no more. Where a helper
or constant gives one value to sections that need different ones, split it
by what each needs. Comments updated. Simulated effect at a July 1:10 PM
game: about 40 sections move by more than 5% (rows in front of a higher
deck edge get a little more shade, covered rows a little more low sun).
- Angels: left pavilion 256–260, 32 → 34 ft
- Astros: club, 62 → 64; right field 152–155, 35 → 36
- Brewers: Loge 206–215 and 222–236, 55 → 68 (`AMFAM_DECK`, Loge only)
- Cubs: Terrace, 32 → 36
- Guardians: first 128–148, 32 → 33; club, 58 → 59; upper, 114 → 115
- Mariners: main (club deck), 45 → 46
- Nationals: 100s 115/130–132, 54 → 55–58; club level, 72 → 74
- Orioles: bleachers 92/94, 30 → 35; club level, 66 → 69
- Padres: left lower 126–132, 22 → 23; right lower 129/137, 32 → 33;
  left reserved 226/228/230, 48 → 50–52; right upper 227/229/231, 58 → 63–65
- Pirates: upper 307/331–333, 98 → 102
- Reds: 400s, 74 → 77/80/83 (by covered row); third 110–112, 36 → 40/44;
  first 132–135, 36 → 39; home 122–126, 22 → 24; left field, 22 → 26
- Rockies: upper deck roof, 98 → 105/106; right bleachers, 22 → 26/27;
  field 116/117, 46 → 49
- Royals: upper deck roof, 128 → 136
- Tigers: upper, 98 → 100; mezzanine 211–218, 87 → 88; and 104–107,
  115, 143, 144 by 1 ft each
- Twins: club, 48 → 51; infield, 34 → 37
- White Sox: lower box 109/110/130–134, 42 → 44

### Part B: suites (759 sections, 15 parks): decision needed
The engine puts the deck above's edge right over the suite seats' front.
On the ground the deck above reaches well past them (CBP: the 300 level's
front is over the 200 level's 3rd row, ~27 ft ahead of the suites; that is
why the scan can't see them). The 6-ft ceiling has been standing in for
that reach. Options:
1. (Recommended) Model the reach: one new optional value,
   `overhang.reachFt` (how far the deck's edge reaches past the first
   covered row's front; one line in `rowLight`). Suites get a 9-ft ceiling
   and a reach worked out per park from the tier in front of them (the
   deck's sourced covered row there), or measured where the lidar has it.
   Suites end up shaded except under a low sun in front.
2. 9-ft ceiling, edge left over the seats: simplest, but suites facing the
   sun get much sunnier (Reds' suites lose about half their shade at a July
   1:10 PM game), which is likely wrong.
3. Leave suites out for now: Part A only, suites recorded as an exception.

### Then
- `deckClearance.test.ts` covers every park and tier (suites per Part B).
- Reference checks and blog claims re-run; any that change are
  investigated and recorded, never tuned. Low share before and after.
- Commits: Part A with the wider test; Part B on its own.

- [x] Part A   - [x] Part B (option 1, approved 2026-11-12)
- [x] Test covers every park   - [x] Review

### §8 Review (2026-11-12)
What changed: every deck or roof in the model now leaves at least 9 ft
above the floor of the first row under it, at all 30 parks (generic
profiles included), and `deckClearance.test.ts` keeps it that way. Two
commits, nothing pushed.
- Part A (b7c53a0f3): about 380 sections at 16 parks raised to 9 ft over
  their own first covered row, no more. The cause was mostly one value per
  tier from a cover helper while each section's covered rows start at its
  own row; helpers and constants serving different needs were split. No
  reference check or blog claim changed. Low share moved only where a deck
  had sat at the covered rows' heads, so they read as certain under every
  variation: Rockies 42% → 48%, Royals 27% → 34% (April), Nationals 27% →
  31% (July).
- Part B (476277c78): the engine's overhang gains `reachFt`, how far the
  deck's front edge reaches past the first covered row (default 0, varied
  ±50% with the setbacks where estimated). Suites get a 9-ft ceiling and
  the deck reaching past them: by the covered depth of the level in front
  at ten parks (Angels 11 ft, Cardinals 19, Nationals 11, Orioles 6,
  Phillies 22, Red Sox 11, Reds 22, Rockies 17, Royals 28, Tigers 17);
  elsewhere, and in the generic profile, their median, 17 ft
  (`SUITE_DECK_REACH_FT`). At a July 1:10 PM game every park's suites are
  now fully shaded (Tigers' were 41%); at 7:10 PM 87–100%. Low share at
  1:10 PM falls at most suite parks (Tigers 56% → 26%, Reds 54% → 34%,
  Pirates 44% → 25%, Giants 23% → 9% in April); at 7:10 PM a third of the
  Orioles', Red Sox and Rockies suites turn Low, where whether the evening
  sun reaches in depends on the estimated reach.

Checked in the browser later (with batch 2, on the dev server, which loads
no analytics; only a local production build sends real hits): stadium
pages render with no console errors.
Still open: the suites' floor heights and seven parks' reach are
estimates with no source; the confidence split (`soffitSourced`) from
Batch 1 is undecided.

## 9. Plan: a deck stops a sun from behind up to the top of its front (2026-11-12)
Found at Coors 133 (batch 3). For the rows in front of a deck's edge, with
the sun behind the stand, `rowLight` blocks the ray at the edge only below
the deck's underside. A ray passing the edge between the underside and the
top of the deck's front hits that front on the ground, but the engine lets
it through. Coors 133: underside 27 ft, the club level's front 36–38 ft;
its rows just in front of the edge read sunny until mid-afternoon.

Fix, as small as it can be:
1. Engine: the stand profile gets one optional value, `deckFrontFt`, the
   height of the top of the covering deck's front at its edge (default: the
   underside, so nothing changes where it is not given). In `rowLight` the
   edge obstacle for a sun behind uses it (one line, plus the type and its
   comment). It sits on the stand, not inside `overhang`, so a section that
   sets its own covered row keeps its tier's deck front; a section under a
   different deck sets its own.
2. Confidence: it moves with the heights, as the underside does (±10%
   measured, ±50% estimated), in `perturbStructure`.
3. Tool: the cover report prints each tier's deck front: the deck above's
   front row as measured (or the park's `deckAboveFt`). For a roof whose
   top already stands in for its underside there is nothing to add.
4. Data: at the 17 measured parks, the covered tiers whose cover is a deck
   of seats get `deckFrontFt` from the report (its front row as measured;
   the railing above it is not guessed at). Roofs unchanged. The 13 parks
   still estimated are unchanged; each gets it with its lidar batch (added
   to the batch steps).
5. Tests: an engine test (a sun behind passing between a deck's underside
   and its front is blocked for the row in front of the edge, and not
   without `deckFrontFt`); `deckClearance.test.ts` also checks every deck
   front is at or above its underside and within 15 ft of it, which catches
   a section left with another deck's front.
6. Reference checks and blog claims re-run; any that change are
   investigated and recorded, never tuned (Coors 133's rows 28+ should now
   hold). Low share before and after.
7. Commits: the engine, tool and tests first (no data yet, so no answer
   changes); then the data, with the recorded checks.

Simulated effect (approximate: deck front taken as underside + 9 ft for
decks of seats, roofs unchanged): about 150 of the 2,552 covered sections
at the 17 measured parks gain more than 5 points of shade at a July 1:10 PM
game, most at Busch (32), Wrigley (23), Nationals (20), Yankees and Dodger
Stadium (12 each). Only rows in front of a deck's edge with the sun behind
change, and only toward shade.

Not in this change, still open: an underside seen more than a metre behind
a deck's edge (Great American's 400s), Kauffman's double-letter rows, the
confidence split.

- [x] 1 Engine   - [x] 2 Confidence   - [x] 3 Tool   - [x] 4 Data
- [x] 5 Tests   - [x] 6 Checks and Low share   - [x] 7 Commits   - [x] Review

### §9 Review (2026-11-13)
What changed: with the sun behind a stand, a deck now stops it for the
rows in front of its edge up to the top of its front, not only below its
underside. Two commits, nothing pushed; all 3522 tests pass.
- Engine, tool and tests (c9a48b1b7): `deckFrontFt` on the stand profile
  (default: the underside, so a park without it is unchanged), used in
  `rowLight` for a sun from behind and varied with the heights for
  confidence. The cover report prints each tier's and section's deck front
  (the front row of the deck of seats at the edge, 2–15 ft above the
  underside; none for a roof) and writes them to `tmp/lidar/<park>-cover.json`.
  Tests: the engine case; every deck front 0–15 ft above its underside.
- Data: 54 tiers at 16 of the 17 measured parks get the measured front of
  the deck over them; sections under another deck get their own (Fenway
  B88/B89 39 ft, Nationals 108 71, Coors 128 38 and 133 36, Nationals
  238/239 62, Petco 202 69) or none where another structure covers them
  with no front measured (Fenway's loge boxes at the ends and behind home,
  Nationals 143, Phillies 134, Great American 401–405). Wrigley has no
  measured deck of seats over its lower rows (rebuilt since the scan). Left
  out: Citi's field level (its underside, 37 ft, belongs to a deck above
  the Sterling level whose 25-ft front the scan finds at the edge), Citi's
  Sterling level, Busch's bleachers and Coors' Reserve Level Outfield
  (almost no section gains).
- Reference checks: Coors 133's rows 28 and up shaded during most day games
  now holds (tested again). Recorded figures that moved, rewritten: Busch's
  club level at first pitch 85% → 89%, its 100s 30%/29% → 32%/31%; Phillies
  134–136's back rows 85% → 88%; Kauffman 248 55–75% → 55–80%; Petco's
  Lexus Club 85–89% → 86–92%. No other check or blog claim changed.
- Low share at a 1:10 PM game, April / July, before → after: Yankees 32/30
  → 28/27, Red Sox 25/20 → 24/19, Busch 27/31 → 24/28, Coors 25/27 →
  24/22, Angels 31/23 → 31/25, Dodgers 21/21 → 22/22, Truist 44/43 →
  49/43; the rest within a point. Truist's April rise is its 100s
  (110–122): the 200 level's measured front now decides their rows in
  front of its edge, but the tier is varied ±50% because its underside is
  the "front row less 9 ft" rule — what the open confidence split would
  separate.
Still open: an underside seen more than a metre behind a deck's edge (Great
American's 400s), Kauffman's double-letter rows, the confidence split.

## 10. Plan: each section's measured back setback (2026-11-14)

**The bug.** Until c7589f583 the lidar tool's suggestions gave a section its
own back only when the back's *height* differed from its tier's (by >10%
and >3 ft). A section whose back stands at the tier's height but much
nearer or farther (or in front of its last row rather than behind) was not
listed, so it kept the tier's setback. The tool lists it now; the parks
measured before still carry the tier's value.

**Audit** (`tmp/lidar/backAudit.ts`: every found section's measured back
against its profile; "changes" = sections where the measured back changes
at least one half-hour answer at a 1:10 PM game on 2025-04-15 or
2025-07-15):

| Park | Setback >10 ft off | changes | | Park | Setback >10 ft off | changes |
|---|---|---|---|---|---|---|
| Red Sox | 36 | 32 | | Phillies | 16 | 4 |
| Royals | 33 | 24 | | Pirates | 15 | 1 |
| Cardinals | 29 | 13 | | Braves | 14 | 2 |
| Yankees | 24 | 18 | | Dodgers | 11 | 3 |
| Nationals | 20 | 9 | | Rockies | 11 | 3 |
| Padres | 20 | 8 | | Giants | 10 | 4 |
| Angels | 9 | 3 | | Mets | 8 | 4 |
| Orioles | 8 | 3 | | Reds | 8 | 1 |
| Cubs | 7 | 0 | | Comerica | 1 (117) | 1 |

280 sections, 133 with an answer that changes. Comerica 117 is my batch 4
slip (grouped with 116's setback by hand). Also 15 back *heights* off the
measurement, which the old tool did list: most are written down on purpose
(Target 239–240's lamp-bank frame; "its own top" at PNC 142/144, Great
American 521, the Rockpile; Fenway's Monster seats); Nationals 100 and
215, Cardinals 131, Mets 135, Orioles C43, Reds 301 and Target 334 have no
reason written.

**Plan** (one commit per park, the same procedure as the batches):
- [x] 10.1 A small helper in stadiumStructures.ts that merges measured
      backs `{ id: [heightFt, setbackFt] }` into a tier's sections without
      dropping a section's other values (its cover, front). Each park then
      gets one short map per tier instead of hand-merged entries.
- [x] 10.2 Per park, in the order above (most answers changed first):
      - read each affected tier's comment: a back left on purpose stays,
        with its reason; otherwise the section takes its measured back
        (height and setback, rounded to the foot);
      - the seven unexplained heights get their measured value or a
        written reason;
      - the tier comment says per-section backs come from the lidar;
      - reference checks and blog claims whose answers change are
        investigated and recorded, never tuned;
      - full suite, type check, Low share before → after;
      - commit.
- [x] 10.3 Re-run the audit: nothing left without a written reason.
- [x] 10.4 Notes and review here; the changed parks' pages checked on the
      dev server.

Not in this change: the `heightsSourced` / roof-top question and the
confidence split (§7.4, open for you).

### §10 Review (2026-11-14)

**What changed.** Every measured section whose back stands more than 10 ft
nearer or farther than its tier's (or whose height is >10% and >3 ft off)
now carries its own measured back, through a small merge helper
(`withBacks`) that keeps the section's other values. 20 commits at 19
parks, one per park (Kauffman has a follow-up; Target 334, one of the
unexplained heights, its own). The audit now flags
only backs left on purpose, each with its reason in the code: Truist pen
153 (the frame the scan sees the seats through), PNC 142/144 and Great
American 521 (nothing behind rises above their own top), Fenway M8 (the
light towers' lattice), the Rockpile, Target 239/240 (the lamp-bank
frame).

**The seven unexplained heights:** Nationals 100 takes its measured 51 ft;
Cardinals 131 its back seen from its open rows (74 ft, 18 ft in front of
its last row; the 49 ft was measured from row 9 before the scan covered it
from row 8); Orioles C43 the upper deck's rows rising over its covered
rows (71 ft); Reds 301 the 400s' lower front over that end section (62
ft); Target 334 its own 87 ft; Mets 135 its own 69 ft. Nationals 215's
cut lands on a roof outside the park, 86 m from home plate (see below).

**Root causes found on the way** (each fixed in its park's commit):
- *Giants View level: setbacks 11 ft too far forward.* The band finds rows
  1–18; the profile's 22 rows start at row A. The tool put the last row at
  "row 1 + 22 rows", 4 rows too far back; the batch converted the covered
  rows by hand but not the backs. The tool now takes `rowsInFront` (4; 8
  in 315/326) and counts lip rows, open rows and the last row from the
  profile's first row. Re-measured: −18 ft (was −29), right over the
  covered rows from row 12 instead of over four open rows. Low share
  9/6 → 8/1.
- *Nationals club level: "measured" from a roof outside the park.* Its one
  found section, 215, gave the tier's front (38 ft) and rake (26°); the
  cut is a roof ridge beside the street. Re-estimated from the 200 level
  around it (37 ft, the Mezzanine's 18°), the suites re-derived, and the
  tool skips 215.
- *Wrigley 511 lost its sourced 14 rows* when the lidar commit rewrote the
  bleachers' overrides (it ran as 21 rows since). Restored and re-measured
  on them (the scoreboard 25 ft behind its last row).
- *Leftover "open" flags from before option A:* Yankees 215 and Giants 215
  were marked open because their rows stop before the source's covered
  row; when option A moved their tier's cover to the scan's row, the flag
  stayed, though the scan sees the deck over them like their neighbours.
  Both are covered with their tier now.
- *A back over the last one or two open rows.* Where the scan's edge is
  over only the last row or two (under option A's three-row mark) the
  measured back stands over rows that stay open, and the engine never
  counts a back over a row. Nationals' Gallery settled this in batch 3 by
  covering those rows; Kauffman 405/407/411/413/433, Truist 231 and Coors
  L345 follow it (Kauffman's first commit had moved the back instead; the
  follow-up makes it consistent).

**Reference checks and posts** (investigated, recorded, not tuned): the
Fenway post's two claims are rewritten to the engine (most Field Box seats
in the sun through the 4th inning, 78% at the 6th; Loge 146, whose eight
rows end short of the roof, in the sun at first pitch). Busch 154 now
reproduces "only a few rows shaded at first pitch" (44%) and is tested
again; Kauffman rows M–V of 409–413 are shaded from 3:10 ("safely in the
shade after 3:00"); Truist 212 shades from about the 4th inning (closer to
"in the shade for a day game"). Header figures updated where they moved
(Busch, Nationals, Truist, Comerica); Nationals' Gallery range was already
stale (42–75%, not 60–75%) and is corrected.

**Low share at a 1:10 PM game, April / July, before → after:** Red Sox
24/19 → 28/22; Royals 22/16 → 21/14; Cardinals 24/28 → 25/28; Yankees
28/27 → 31/31; Nationals 33/27 → 33/26; Padres 29/29 →
31/29; Angels 31/25 =; Orioles 14/16 → 14/15; Cubs 21/21 =; Phillies 21/19 =;
Pirates 7/11 =; Braves 49/43 → 48/42; Dodgers 22/22 =; Rockies 24/22 →
25/23; Giants 9/6 → 8/1; Mets 39/38 =; Reds 9/6 → 8/5; Tigers 28/25 =;
Twins 27/23 =. The rises (Fenway, Yankees, Petco) are sections whose
measured back is nearer, so the shade line now crosses them mid-game; at
Yankee Stadium the seven sections behind home now see the Terrace's front
(their old setback put it in front of their first row), and the Main
tier's heights are estimated (±50%).

**Checks:** full suite 3537/3537, type check clean after every park; the
19 changed parks' pages and the Fenway post render on the dev server with
no console or server errors (the post shows the new sentences).

**Measurement files patched by the tool's own output** (tmp/lidar, not
committed): nationals 215 (skipped), cubs 511 (re-measured on 14 rows),
giants View sections (re-measured with `rowsInFront`; 333 with the cover
it was first measured with, the circularity noted in batch 4).

**Open for you:**
1. *Backs over open rows elsewhere.* 253 sections' profiles still put the
   back over one of their own open rows, nearly all from a tier median
   applied to a section of a different depth, on sections never measured
   or within the 10-ft threshold (e.g. Kauffman's plaza ends 206–252,
   whose 47 ft at −13 is the average of two unlike sections, 248 and 250;
   Fenway's Roof Boxes; Camden's club ends). The engine never counts such
   a back for those rows. Counting it as overhead would change 77 sections'
   answers at the test games, but it would also make phantom roofs out of
   the misapplied medians. My recommendation is the data fix: carry a
   tier's back as a position from its deck's row (or front row), not from
   the last row, so a median carries across section depths. That's a
   change to every tier's back, so it's your call.
2. *Mets 135's cover:* its cut shows its treads open to the sky up to row
   14 (a deck 42 ft up starts there), against the source's row 7; the tier
   is estimated (one section of six measured), so it is left as sourced.
3. Still open from §7.4: the `heightsSourced` / roof-top question and the
   confidence split (behind most of the Low-share rises above).

---

## §11 Backs over open rows (plan, 2026-11-15)

**The problem.** 253 sections at 21 parks have a back that stands over one
or more of their own open rows. The engine never counts it for those rows.
If it did, 77 sections' answers would change at the test games (1:10 PM,
2025-04-15 and 2025-07-15).

**My §10 recommendation is withdrawn.** I tested it on the scan: 895
measured sections whose depth or cover differs from their tier's default.
Anchoring a tier's back to the covered row or the front row predicts the
measured back no better than today's last-row anchor:

| Sections | Last row (today) | Covered row | Front row |
|---|---|---|---|
| Covered, other depth (316) | 5 ft | 4 ft | 5 ft |
| Covered, cover moved by option A (117) | 3 ft | 8 ft | 3 ft |
| Open, other depth (384) | 8 ft | – | 11 ft |

(Median error against the scan.) So the anchor is not the cause, and
changing every tier's back would not fix it.

**Root cause: the engine.** `backSetbackFt` is documented as how far
*behind* the last row the back stands. The lidar measured negative values,
meaning the structure stands *over* the rows:
- Truist Park's canopy over the 300 level's rows 6–9;
- a deck's front a row or two ahead of the source's covered row (White Sox,
  Dodgers top deck, Guardians club, Cardinals terrace);
- a roof or deck reaching 3–6 ft over the last row (Camden's open club
  sections, Fenway's Roof Boxes, Reds 143, Twins 237–240).

The engine only counts an obstacle that is behind a row's head and above
it. A row under the back is treated as having nothing above it. Here the
answer jumps: a back 2 ft *in front of* the last row's head leaves that row
in the sun whenever the sun is behind, while the same back 2 ft *behind* it
shades the row at nearly every sun angle.

**Fix: one condition in `rowLight`.** With the sun behind, a row whose head
is under the back (at or behind its position, below its top) is in shade,
as under a deck. A sun in front is handled as today: a back over the rows
does not block it.

**But first, the backs that aren't really there.** Some backs stand over
open rows only because a tier value was carried to a section it doesn't
fit. The engine fix would turn those into roofs that don't exist, so they
are fixed first:
- **P1. Short sections whose back lands at or in front of their own first
  row (14):** Mets 102, 108, 133, 316, 320; Nationals 139; Padres B, 313,
  329; Phillies 101; Red Sox R43; Rockies 201–203. They take their tier's
  setback, measured on deeper sections.
- **P2. Tier defaults made of unlike sections (27):**
  - Royals' Plaza ends (206–208, 247, 249, 251, 252): 47 ft at −13 is the
    average of 248 (under the deck's end) and 250 (open).
  - Mets field (20 line sections, 101–131): the default back is the
    behind-home deck, 6 rows in front of the default cover row 21. The
    measured line sections (128, 130, 132) put it at or behind their deck's
    edge.
- **P3. Measured sections where the tier's back and their own stand over
  open rows that differ by 3+ rows (7):** Braves 238 and 345, Cardinals 250
  and 258, Padres 322, Phillies 107, Pirates 311. This is option A's
  3-row mark, added to §10's 10-ft rule. Twins 240 stays on its tier's
  back: its own is the lamp-bank frame, left out on purpose.
- **P4. The other unmeasured sections whose back is over open rows (53, in
  about 18 tiers):** each checked against its measured neighbours.
- **P5. Sections whose own measured back is over open rows (10):** Braves
  140, Cubs 513, Dodgers 145LG, Mets 120, Phillies 147, Pirates 238, Reds
  143, Tigers 113, Yankees 104 and 135. Each is confirmed on its cut to be
  a deck, roof or canopy, not an open frame like the light towers or the
  lamp bank.
  - Yankees 104 and 135: the sources call them open and their row counts
    are unpublished (20 is a default). Their scan puts the Main deck over
    rows 12–20, but the recorded choice was "stay as sourced". I'll look
    for their real row counts first.
- **Real, left as they are (143):** measured sections on their tier's back
  where the tier's back and their own scan's stand over the same open rows
  within 2 rows.

Each fix uses the section's own cut where the scan has one, otherwise its
neighbours' measured structure. Reasons go in the code, as in §10.

### Steps
- [x] 1. Audit script listing P1–P5 with each section's cut and its
      neighbours (tmp/lidar, not committed).
- [x] 2. Mets: field default from the line sections; 102, 108, 133, 316,
      320 (one commit).
- [x] 3. Royals Plaza ends, each from its own cut or its open/covered
      neighbour (one commit).
- [x] 4. The other P1 short sections, one commit per park (Nationals,
      Padres, Phillies, Red Sox, Rockies).
- [x] 5. P3's 7 sections take their own backs, one commit per park.
- [x] 6. P4 and P5 checks; fix any that don't fit (per park).
- [x] 7. Engine: the one condition, the `backSetbackFt` doc (a negative
      value stands over the rows), and unit tests. The tests cover:
      - the last row gives the same answer with the back 2 ft in front of
        or behind its head;
      - a canopy over open rows shades them with the sun behind;
      - a sun in front is unchanged.

      One commit.
- [x] 8. Re-run everything:
      - full suite and type check;
      - reference tests, where changes are investigated and recorded, never
        tuned;
      - Low share;
      - the back-over-rows audit, which should list only real structures;
      - the changed parks' pages on the dev server.
- [x] 9. Review section here.

**Expect:** Braves' 300 level, Camden's club, Fenway's Roof Boxes and
Pavilion Reserved 20, and a few last rows elsewhere get more shade
with the sun behind. The confidence check scales setbacks ±20–50%, so some
labels may change too.

**Not in this plan (noticed):** 343 measured sections that use their tier's
back, within §10's 10-ft rule, would give different answers with their own
measured back, both today and after this fix. Whether every measured
section should simply use its own back is a separate decision.

### §11 Review (2026-11-15)

**What changed.** The engine now counts a back that reaches out over a row:
with the sun behind, a row whose head is under it is in shade, as under a
deck (`rowLight`, one condition; the `backSetbackFt` doc says a negative
value stands over the rows). Unit tests: the last row answers the same with
the back 2 ft either side of its head, a canopy over open rows shades them,
a sun in front is unchanged; the first two fail on the old engine. Before
that, 17 commits at 13 parks removed every back that stood over rows only
because a value didn't fit the section. 18 commits, one per park, the
engine last.

**How the sections were measured.** The lidar tool cuts each section along
its stand direction through the point where its line from home plate finds
the tier's rows. In corners and at stand ends that line misses, so many of
these sections were "not found". Cutting through a point on the section's
bearing instead, with the same measurement code (`measure_section`), finds
them; it reproduces the file's values exactly where both work (Royals 248,
250). New measurements are written to the tmp/lidar files (not committed;
pre-change copies in the scratchpad).

**Root causes found, by kind:**
- *A tier median of unlike sections.*
  - Citi field level: the suites deck behind home (25 ft) and the 69-ft
    structure down the lines gave 47 ft at −48, 6 rows ahead of the line
    sections' deck. The default is now the line sections' measurement
    (128, 130, 132: 69 ft, 18 ft in front of the last row). 106 keeps its
    own; 121 takes its measured neighbours' suites deck, as for its cover.
  - Kauffman Plaza ends: 47 ft at −13 was the average of 248 (under the
    upper deck's end) and 250 (open). Cut one by one:
    - the upper deck's end, its edge angled across them, is over 206 from
      row 11, 207 and 248 from row 9, 208 and 247 from row 8, and 249 from
      row 14. Those are 3+ rows the source leaves open, so they take them
      (option A, like 248);
    - 250–252 are open with a 33-ft roof right behind, now the default.
- *A setback measured on deeper sections, applied to short ones.* Each now
  takes its own cut where the scan has one:
  - Petco B (36 at −15) and 313 (the aisle step, 75 ft, right behind; 329,
    one row, shows the same step);
  - Phillies 101 (the 200 level ends there: 72 ft, 121 ft behind);
  - Coors 201–203 (68 at −11/−12).

  Otherwise it takes the measured relation from its neighbours:
  - Nationals 139 (the pavilion's front 12 ft behind the front row, as in
    140);
  - Mets 102 (at its last row: its deck covers its last three rows);
  - Mets 133 (its cut: 49 ft behind its five front rows);
  - Mets 316/320/326 (the 400 level's front over the same row as the
    12-row sections);
  - Truist 315 (the canopy over rows 6–9 as its neighbours, from its front
    rows: −14);
  - Fenway R43 (R41's 66-ft top, 18 ft behind its one front row; copying
    R41's setback would have made a 13-ft wall of it);
  - Comerica 101 (rows E–T end before the balcony; it takes 102's wall right
    behind).
- *Rows 3+ apart from the section's own measurement* (option A's mark),
  so they take their own: Truist 238, Busch 250/258, Petco 322, Phillies 107,
  PNC 311.
- *A hand-averaged value:* Phillies 147/148 shared the mean of their two
  measured backs; each takes its own.
- *Backs over rows the source says are open*, kept open as sourced:
  - Yankees 104/135: "no roof or overhang", and their rows are published
    after all (Rate Your Seats: 18 and 14, now used). The Main deck's front
    is taken right behind their last row.
  - Wrigley 513: the bleacher rows are ~2.1 ft deep (511's 14 in 30 ft), so
    the scan's "row 15" at the profile's 2.75 ft is about its last row; the
    back building stands right behind it.
- *A stale cut in a measurement file:* Truist 345 is skipped by the tool
  (its cut runs along the steps), but braves-measured.json still had it;
  corrected, so it keeps the tier's back.

**Audit after** (`tmp/lidar/overRows.ts`): no short-section backs left.
Twins 240 is the only measured section whose rows differ by 3+ (its own
back is the lamp-bank frame, left out on purpose). 14 own backs over open
rows are confirmed on their cuts:
- decks: Braves 140, Dodgers 145LG, Mets 120, Tigers 113, and Mets
  316/320/326, Coors 201/203, Phillies 107, Truist 238 from this plan;
- a solid board: Pirates 238 (99–110 ft over its last row);
- a 28-m-wide structure: Reds 143 (81–92 ft over its last row).

52 unmeasured sections' backs agree with their measured neighbours within
2 rows (`tmp/lidar/p4Neighbours.ts`):
- the 300-level canopy at Truist, including the corner 344–347;
- the PNC Grandstand and 100s (129 lines up with its neighbours at the
  back);
- the Orioles club ends, the White Sox upper deck (aligned at the back:
  covers 12 rows from the last), and others.

142 measured sections on their tier's back are within 2 rows of their own.

**Answers at the test games** (1:10 PM, 2025-04-15 and 2025-07-15, half-hour
statuses) changed in 73 sections:
- Truist 300 level 13 (shade with the sun behind under the canopy);
- Mets 16, Orioles club ends 14, Fenway 9 (Roof Boxes and Pavilion Reserved
  20);
- Royals Plaza ends 5, Padres 4, Coors 4, Phillies 3, Tigers 2;
- one each at Busch, PNC and the Reds.

**Low share, April / July, before → after:**

| Park | Before | After |
|---|---|---|
| Braves | 48/42 | 46/40 |
| Cardinals | 25/28 | 25/30 |
| Dodgers | 22/22 | 23/29 |
| Mets | 39/38 | 40/41 |
| Nationals | 33/26 | 33/26 (one fewer) |
| Padres | 31/29 | 32/29 |
| Phillies | 21/19 | 22/20 |
| Pirates | 7/11 | 7/13 |
| Red Sox | 28/22 | 26/22 |
| Royals | 21/14 | 19/14 |
| Tigers | 28/25 | 27/25 |
| Twins | 27/23 | 28/25 |
| Yankees | 31/31 | 31/31 (one more) |

**Why the labels moved (root cause found, not changed).** With the data held
fixed, the engine change alone causes 92 confidence drops and 25 rises.
87 of the 92 come from one confidence variant. It scales each back's
setback by ±20% (measured) or ±50% (estimated). For a back over the rows
that slides it across 2–8 rows, apart from the deck edge it belongs to
(Dodgers loge: the deck's front at −40 becomes −48, over open rows 6–7,
while the deck's edge stays at row 8). Before the fix the engine ignored
those rows, so the variant did nothing there. A fix would move a back over
the rows by its measurement error (about a row), or together with its
deck's edge. That's a change to the confidence model, so it's yours to
decide.

**Reference checks and posts** (investigated, recorded, not tuned):
- Kauffman: "the right-field corner gets the worst of the late sun" now
  holds for 147–148 and 250–252; 247 and 249 join 248 as not reproduced
  (the scan puts the upper deck over their back rows: 74%, 69% and 42% of
  their seats shaded over the July 12 game).
- Fenway post: the Roof Boxes under the press box (R23–R37) are partly
  shaded through the 9th inning (High confidence; the old Medium came from
  the jump), and R39–R43 are in the sun all game. The sentence is rewritten
  to the engine.

**Checks:** full suite 3540/3540; type check clean. On the dev server, the
13 changed parks' pages and the Fenway post return 200 with no console or
server errors; R25's panel shows partial 1:35–4:05 and sun at 4:35 (High),
and the post shows the new sentence.

**Open for you:**
1. The confidence variant for backs over the rows (above): Dodgers' July
   Low share 22% → 29% comes from it.
2. 335 measured sections on their tier's back would answer differently
   with their own (was 343): whether every measured section takes its own.
3. Found on the R25 panel: the section sentence says "partly shaded, with
   sun on some rows all game" when a section starts partial and ends in
   sun (`shadeSentence` never checks the later half-hours). It was there
   before §11.
4. Covers the scan disputes on sections not measured before: Mets 108's cut
   puts the Excelsior's front over its row ~3 (source row 30, model 7).
   Still open from earlier: the `heightsSourced` / roof-top question and
   the confidence split.

---

## §12 Confidence for backs over the rows (plan, 2026-11-15)

**The problem.** The confidence check moves every back nearer and farther
by ±20% (measured) or ±50% (estimated) of its distance from the last row.
1,441 sections have a back over their rows, and 1,365 of them have a deck
there. That back is part of the deck: three in four stand within 2 rows of
the deck's edge (its front, or the deck above). Moving it by a share of its
distance from the last row slides it 2–8 rows. For 1,027 sections the far
move puts it in front of the deck's edge, over open rows, while the edge
itself stays put: a deck whose front sticks out past its own edge. Since
§11 the engine counts a back over a row's head, so that impossible shape
shades open rows in the variant and lowers the label. Example: Dodgers
loge. The reserve deck's front stands over row 8, half a row behind the
deck's edge. The variant moves it to row 5, over open rows 5–7.

**Fix: for a back over a deck's rows, scale its distance from the deck's
edge.** In `perturbStructure`, such a back keeps its place relative to the
deck's edge. Only its distance from that edge is moved ±20/50%, the rule
the check already uses for how far a deck reaches out. A back at the deck's
edge stays there, as a wall right behind the last row stays there today.
Nothing else changes:
- backs behind the stand;
- backs over the rows with no deck (a canopy or press box: there the back
  *is* the edge, and its reach from the last row stays scaled, like a
  deck's reach);
- heights, the error sizes, and every answer.

**Considered and rejected:**
- Moving a back over the rows by ±1 row: a second error model for backs
  over the rows only. A back 1 ft in front of the last row would move
  2.75 ft while one 1 ft behind it moves 0.2 ft. It lowers 74 labels
  (e.g. the Twins terrace's roof, 1 ft over the last row).
- Not moving it at all: too small where the back stands well behind the
  deck's edge.

**What it changes.** Measured at three 2025 test games (1:10 PM on April
15 and July 15, 4:10 PM on July 15), 15,654 labels, each park's own
orientation error. A script worked it out. A trial edit of the real code
gave the same labels (10,436 of 10,436 checked) and was reverted.
- Answers: none. Only the confidence check changes.
- Labels: 214 rise, none fall. Low share overall goes from 27.4% to 26.9%
  (27.3% on the engine before §11).
- Of the 107 drops the §11 engine change caused, 94 go away. The 13 that
  stay are all edges with no deck under them: Fenway R23–R35 at 4:10 PM,
  Nationals 107 and 315, Padres 203, Phillies 211, Twins 240. How many rows
  such an edge covers does depend on how far it reaches, so their lower
  label is real.
- Low share, July 1:10 PM (engine before §11 / now / with the fix):

  | Park | Before §11 | Now | Fix |
  |---|---|---|---|
  | Dodgers | 22% | 29% | 20% |
  | Yankees | 31% | 31% | 25% |
  | Twins | 23% | 25% | 20% |
  | Pirates | 11% | 13% | 11% |
  | Cardinals | 28% | 30% | 28% |
  | Mets | 39% | 41% | 39% |
  | Phillies | 19% | 20% | 18% |
  | Rockies | 23% | 23% | 21% |

  Yankees and Dodgers end up below their pre-§11 share. The old engine had
  part of the same problem: the moved back blocked open rows at an angle.
- Tests: with the trial edit the full suite passes (3540/3540), including
  Yankees' "Terrace 310–319 not High". No label stated in the Fenway or
  Yankees post changes at its game.

**Steps**
1. [x] Add a unit test first: a made-up stand whose deck's front stands
   half a row behind the deck's edge, with the sun behind, is High
   confidence. It must fail on today's code.
2. [x] Make the change in `perturbStructure` (src/utils/gameShade.ts) and
   its doc. The confidence notes at the top of gameShade.ts and
   stadiumStructures.ts say how a back over a deck's rows is moved.
3. [x] Re-check:
   - full suite and type check;
   - the label tallies above, on the real code;
   - the labels the posts state;
   - the Dodgers and Yankees pages on the dev server.
4. [x] Commit (one change), then write the review here.

Not in this change: the error sizes themselves, and which tiers count as
measured (the confidence split and `heightsSourced` questions).

### §12 Review (2026-11-16)

**What changed** (commit 0acc17b28):
- `perturbStructure` (src/utils/gameShade.ts) now moves the back's
  setback through a new `movedSetback`. For a back over the rows of a
  stand with a deck, its distance from the deck's edge is scaled ±20/50%,
  with the edge itself moved by the deck's scaled reach. Every other back
  is scaled from the last row, as before.
- The confidence notes at the top of gameShade.ts and stadiumStructures.ts
  say so.
- New test: src/utils/__tests__/gameShadeConfidence.test.ts. A made-up
  stand shaped like Dodger Stadium's loge at a 2025-07-15 1:10 PM game in
  Los Angeles: High with the fix, Low without (checked before the change).

**Results** (the real code, three 2025 test games, 15,654 labels, each
park's own orientation error):
- No answer changes.
- 214 labels rise, none fall, the same labels the planning script
  predicted (0 differences).
- Low share 27.4% → 26.9%. Per park as in the plan's table (Dodgers July
  1:10 PM 29% → 20%, Yankees 31% → 25%, Twins 25% → 20%).
- Of the 107 drops §11 caused, 13 remain. All are edges with no deck under
  them, where the edge's reach does decide which rows it covers.

**Checks:**
- Full suite 3541/3541 (3540 + the new test); type check clean.
- Posts: the blog claims test passes, and no label stated in the Fenway or
  Yankees post changes at its game.
- On the dev server, at a custom 2025-07-15 1:10 PM game:
  - Dodgers 124LG reads High (was Low);
  - Yankees 226 reads Medium (was Low);
  - no console or server errors.

**Found on the way (not this change):** Dodgers 124LG's sentence says
"shaded until about the 2nd inning, then sun", but after 1:40 PM it is
partial, never sun. That is the same `shadeSentence` function the
sentence-bug session is fixing on its own branch
(claude/objective-einstein-5df341), so the case was sent to it. That
session also numbers its plan §12 in its copy of this file; it was asked
to use §13.

**Still open for you:**
- The confidence split / `heightsSourced` question.
- The 335 measured sections on their tier's back.
- Mets 108's cover.

---

## §13 Section sentences that skip what comes next (plan, 2026-11-16)

**The problem.** Two wrong sentences for one fan-facing answer:
- Fenway R25, 2025-07-13 1:35 PM: partial 1:35–4:05, sun at 4:35. It reads
  "partly shaded, with sun on some rows all game."
- Dodgers 124LG, 2025-07-15 1:10 PM: shaded at 1:10, partial from 1:40
  on, never sun. It reads "shaded until about the 2nd inning, then sun."

**Root cause (one, in `shadeSentence`, `src/utils/gameShade.ts`).** When
a section starts shaded or partly shaded, the sentence never reads the
half-hour where that changes. It assumes what comes next:
- starts shaded: always "then sun", even when the next status is partial;
- starts partial (no shaded half-hour): always "all game", even when sun
  comes later.

The other branches (sun first, then shade or partial) already name the
half-hour and status they describe, so they stay as they are.

**How many, today.** All 30 parks at five 2025 test games (2025-07-15
1:10, 4:10 and 7:10 PM; 2025-04-15 and 2025-09-15 1:10 PM), counted by
pattern:
- start partial, later sun, no shade (Fenway R25's pattern): 801 wrong
  "all game" sentences. 1,607 really are partial all game, unchanged.
- start shaded, then partial (Dodgers 124LG's pattern): 1,153 wrong
  "then sun" sentences. In 934 of them the sun never comes; in the rest
  it comes later than the sentence says.

**Fix: read the half-hour where it changes.** Two branches change; the
sentence order and every other branch stay as they are.
- Shaded first: "shaded until about {inning}, then partial shade." when
  the next status is partial; "…then sun." when it is sun, as today.
- Partial first: when no half-hour is sun, keep "…all game". Otherwise:
  "partly shaded until about {inning}, then sun."
- When `inningAt` gives nothing (after the 9th), keep the shaded branch's
  fallback ("shaded until late in the game.") and use the same for partial
  ("partly shaded until late in the game.").

R25's sun comes 180 minutes in, past the 9th inning. It will read
"Section R25: partly shaded until late in the game." That matches the
Fenway post ("partly shaded through the 9th inning"). 124LG will read
"Section 124LG: shaded until about the 2nd inning, then partial shade."

**Not in this change.** The sentence names one change. 2,408
section-games change twice or more:
- 1,867 go sun → partial → shaded and read "shade from about {inning}";
- 171 go shaded → sun → shaded again after sunset at a 7:10 PM game;
- 370 follow other patterns.

After the fix, these sentences are true about the change they name but
say nothing about the other one. Whether the sentence should name a second
change is a wording decision for you.

- [x] Add `src/utils/__tests__/shadeSentence.test.ts`. No direct tests
      exist yet. It checks:
      - shaded then partial names partial shade;
      - shaded then sun still says sun;
      - partial then sun names the inning;
      - partial until past the 9th falls back to "late in the game";
      - partial all game is unchanged.
      Confirm the new cases fail on today's code.
- [x] Change the two branches in `shadeSentence`.
- [x] Quotes of the old sentences: none found. The blog claims test checks
      statuses, not sentences, and both posts already match the engine.
      Re-check after the change.
- [x] `npx jest` (full suite), then `npx tsc --noEmit -p .`.
- [x] Dev server: Fenway R25 (2025-07-13 1:35 PM) and Dodgers 124LG
      (2025-07-15 1:10 PM) panels.
- [x] Review here, one commit, no push.

## §13 Review

**What changed:** two branches of `shadeSentence` in
`src/utils/gameShade.ts`, plus one new test file. The sentence order and
every other branch are unchanged.
- **Starts shaded:** reads the status at the half-hour where full shade
  ends. It says "then partial shade." when that is partial and "then sun."
  when it is sun.
- **Starts partial, never shaded:** looks for the first sun half-hour.
  - None: keeps "partly shaded, with sun on some rows all game."
  - Otherwise: "partly shaded until about {inning}, then sun.", or "partly
    shaded until late in the game." after the 9th inning, the same fallback
    as the shaded branch.
- **`src/utils/__tests__/shadeSentence.test.ts`:** five cases. The three new
  behaviours failed on the old code; the two unchanged ones passed.

**Answers now:**
- Fenway R25, 2025-07-13 1:35 PM (partial 1:35–4:05, sun 4:35, High):
  "Section R25: partly shaded until late in the game."
- Dodgers 124LG, 2025-07-15 1:10 PM (shaded 1:10, partial after, High):
  "Section 124LG: shaded until about the 2nd inning, then partial shade."

**Checks:**
- New tests: they failed 3 of 5 before the fix and pass 5 of 5 after.
- Full suite: 3546/3546 pass. Type check is clean.
- All 30 parks at the five 2025 test games, 29,770 sentences. Two rules
  checked, 0 sentences break them:
  - "all game" appears only when every half-hour is partial (1,607);
  - every "then …" names the status right after the first change.
- Partial then sun: 801, as counted in the plan. 651 now name an inning,
  150 read "late in the game".
- Old wording: no test, post or page quotes it. `ShadeFinder` cuts the
  sentence after its ": ", and that format is unchanged.
- On the dev server, R25's and 124LG's panels show the new sentences, with
  no console or server errors.

**Branch:** this worktree's branch was fast-forwarded to
`fix/shade-answer-rebuild` (3aa381c14) first, since `main` has no
`gameShade.ts`. The commit sits on top of §12.

**Still open for you:** the 2,408 section-games that change twice or more.
Their sentences name one change only, for example "shade from about the
9th inning" for sun → partial → shaded.

---

## §14 Every measured section on its own back (plan, 2026-11-16)

Branch `fix/section-backs`, from `main` after PR #87.

**The problem.** Two shortcuts in the lidar tool's `suggest()`
(scripts/measureStandHeights.py) keep measured sections on a back that
isn't theirs:
- A section gets its own back only when it is far from its tier's
  (height off by >10% and >3 ft, or setback by >10 ft). 1,711 measured
  sections use their tier's back, and 1,310 of them measure differently.
- The sections it does list are pooled when their heights are within 3 ft,
  and each one takes the group's median height *and* setback. So 143 of the
  663 written backs are a group's value, not the section's own. For
  example, Fenway F43, F49, H43 and H49 are written 25 ft behind the last
  row, but each measures 34.

**The measurements are also out of date.** They were taken 12–15 Nov.
Since then option A (§7.1b) moved the covered rows of 756 measured
sections, and §10–§11 changed more. The tool measures the back from the
middle *open* row. Where the cover moved, that row moved too, and from the
new row a different structure can rise highest. I re-measured all 22 parks
on today's profiles (in tmp/lidar; the old files are kept in the
scratchpad):
- 181 backs moved by a foot or more, 149 of them where the cover moved.
  Fenway's Loge Boxes B125–B134 went from 87 ft at −15 to 96–100 ft at −19.
- Where the middle open row moved toward the field, some backs switched
  from the deck's edge to the structure behind it. Twins club: 76 ft at
  −18 → 148 ft at 0. Phillies field: 70 at −8 → 132 at 35.
- The tool no longer finds 69 sections it found before:
  - 57: with fewer open rows, the run of seats it sees under a high deck is
    rejected as "too deep";
  - 12: the tool finds no run of seats where it expects that tier.

  These sections keep the backs they have now.

**What it changes.** Every measured section on its own re-measured back,
checked at the five 2025 test games:
- 512 sections' answers change (1,530 half-hour steps): 263 get more
  shade, 249 less. That about-even split fits removing noise rather than a
  bias.
- Most changes by park: Yankees 76, Red Sox 75, Dodgers 41, Mets 40,
  Angels 37, Cardinals 32, Phillies 30.
- 24 tier backs that are their tier's median move to the new median (most
  by 1–3 ft; Twins club, Phillies field, Guardians third, Nationals right
  field and pavilion, Padres Lexus club, Giants lower and Cubs bleachers by
  more). A tier's back now matters only for sections the scan doesn't find.

**Rejected: measuring the back behind the deck's edge.** For 765 of the
1,418 sections with a deck edge in the scan, the back the tool finds is
that edge, which the profile also has as the deck's front. I tried
measuring behind it instead (a scratch copy of the tool, all 22 parks).
- Result: 118 sections' answers changed, every one to less shade, and 78
  tier backs moved (against 38).
- Why: the edge isn't a duplicate. It carries each section's own edge,
  while the profile's deck front is the tier's.
- What stands behind the edge never added shade at the test games.
- Decision: keep the tool's definition.

**Fix.**
1. Tool: `suggest()` lists every found section whose own back (height and
   setback, rounded to the foot) differs from its tier's. Each section gets
   its own value, with no thresholds and no pooling. Front rows and
   undersides keep their rules.
2. Per park, one commit each, following the §10 procedure:
   - every measured section takes its own back through `withBacks`;
   - a tier whose back is its median takes the new median;
   - backs set apart on purpose keep their reasons, each re-read against
     the new cut. The tiers are Braves 100s (cover unsourced), Cardinals
     pavilion left, Dodgers pavilion, Giants View, Guardians left field,
     Mets field and left outfield, Nationals mezzanine, Padres 100s,
     Phillies field (cover unsourced), Fenway Monster, the Rockpile, Royals
     plaza (open), Twins right-field deck and White Sox left field. The
     sections are Truist 153, Fenway M1 and M8, Twins 239–240, PNC
     142/144, Great American 521, Nationals 215, Yankees 104/135 and Cubs
     513;
   - 92 backs get a look at their cut, as in §10, for open frames (light
     towers, lamp banks) and roofs outside the park: the 45 sections whose
     own back is far from their tier's, and the 47 written backs that moved
     far;
   - tier comments: update the numbers that change, and replace "sections
     more than 10% (at least 3 ft) off get their own" with "each measured
     section takes its own";
   - reference checks and blog claims whose answers change are
     investigated and recorded, never tuned;
   - full suite, type check, Low share before → after.
3. Re-run the audit: every measured section is on its own back, except
   the listed ones.
4. Review here, and check the changed parks' pages on the dev server.

**Not in this plan (noticed):**
- Front rows have the same 3-ft rule. 875 measured sections' own front
  row differs from their tier's, and 264 of them would answer differently.
  The same fix would apply; it can come next.
- The tool's "too deep" check counts the model's open rows. Under a high
  deck the scan also sees seats past its edge, so 57 sections are no
  longer measured.
- Still open: the confidence split / `heightsSourced`, and Mets 108's
  cover.

### Steps
- [x] 1. Tool rule (one commit, plus one that wraps its output to paste).
- [x] 2. 22 parks, one commit each, most changed answers first: Yankees,
      Red Sox, Dodgers, Mets, Angels, Cardinals, Phillies, Orioles, Twins,
      Guardians, Rockies, Royals, White Sox, Nationals, Reds, Braves,
      Giants, Athletics, Padres, Pirates, Tigers, Cubs.
- [x] 3. Audit re-run; full checks.
- [x] 4. Review section here.

### §14 Review (2026-11-16)

**What changed:**
- **Tool:** `suggest()` lists every found section whose own back (height
  and setback, rounded to the foot) differs from its tier's. There are no
  thresholds and no pooling, and it prints a `withBacks` map ready to
  paste. Front rows and undersides keep their rules.
- **Data:** 22 commits, one per park.
  - All 2,363 measured sections now use their own re-measured back.
  - 11 more keep a back set on purpose, each with its reason in the code:
    Yankees 104 and 135, Fenway M1 and M8, Truist 153, Cubs 513, PNC 142
    and 144, the Rockpile, and Twins 239–240.
  - Inline back values and old pooled maps for measured sections are
    gone. Only the section's other values (cover, front row) remain.
  - Rate Field's `RATE_LOWER_BACK` table is removed.
- **Tier backs:** where the tier's back was its median, it takes the new
  median, for example Twins club 76 → 148 ft and the third-base side at
  Progressive 72 → 139 ft. The work turned up three cases the plan didn't
  cover, each written in its tier's comment:
  - *The tool can't find sections it measured before* (Camden's terrace
    behind home, Nationals right field and pavilion, GABP's View level
    on the third-base side, Petco's upper level, Wrigley's upper deck).
    The tier keeps the median of the sections measured before, because
    those sections keep their backs.
  - *A tier splits into two kinds of back.* Its separate medians of
    height and setback then pair into a back no section has. Oracle's
    lower level (69 ft, 5 ft in front) and Petco's 100s (68 ft, 19 ft
    behind) take their larger group's median instead. Petco's Lexus Club
    is an even split, so it keeps the Terrace's front, and its F and G
    (never cut, between E and H) take what E–J all measure.
  - *The median is none of the sections' backs* (Busch left-field
    pavilion, Progressive left field, Rate Field left field). The tier
    keeps the back of the sections it stands for.
- **Posts:** each one changes where the engine does, and its claims test
  follows (`app/__tests__/blogShadeClaims.test.ts`).
  - *Yankees:* Terrace 308 is partly shaded until about the 7th, under a
    bank of lights on the canopy. 312–315 get shade from the 4th on July
    12. The field 100s are about one in three shaded by the 9th. A
    quarter of the Terrace is shaded at first pitch on April 13.
  - *Fenway:* R33's own back stands 2 ft over its last row, not 4, so it
    gets sun from about the 9th.

**Why the backs moved (from the cuts):**
- *Covers changed after measuring.* Option A moved the covered rows of
  756 sections after the backs were measured. The back is seen from the
  middle open row, so where the cover moved forward, a higher structure
  further back can rise highest. Twins club and Phillies field moved from
  a deck's front to the canopy or roof, and Fenway's Loge Boxes behind
  home to the press box block.
- *Lamp banks.* The 137–142 ft backs at Yankee Stadium, Angel Stadium and
  Truist are lamp banks on the canopy's or roof's edge. Following §10
  (Comerica, Truist 8), these count as the back.
- *Checked on the cut:* every large move, drawn from the scan (Yankees
  Terrace, Fenway Loge, Dodgers 52FD, Mets 106/114/116, Angels 305/306,
  Phillies 108/114/129/138, Twins D/G/N, Guardians 158/162/182/184).

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 503 sections (1,441 half-hour steps).
- 265 labels go up and 240 down. The Low share goes from 26.9% to 26.8%.
- Sections changed by park: Yankees 74, Red Sox 73, Dodgers 41, Mets 41,
  Angels 37, Cardinals 32, Phillies 31, Orioles 24, Guardians 20, Twins
  18, Royals 15, White Sox 14, Nationals 12, Reds 12, Rockies 12, Giants
  11, Athletics 10, Braves 10, Padres 8, Pirates 7, Tigers 1, Cubs 0.

**Checks:**
- Audit (`tmp/lidar/ownBackCheck.ts`): 2,363 measured sections are on
  their own back. The other 11 are the exceptions above.
- The full suite passes, 3,551 of 3,551. The type check is clean, and
  eslint is clean on the changed files.
  - The first baseline run had the Comerica suite fail to run under load
    (it passes alone). A second full run passed.
- Reference checks: one moved, and it is recorded, not tuned. Target 118's
  canopy edge measures 4 ft over its last row, so row 10 falls in shadow
  in the last half-hour. The check now tests the lower rows through the
  9th, and its header records the rest.
- On the dev server, the Yankees and Fenway posts show the new sentences.
  The Yankees stadium page renders with no console or server errors.

**Noticed, not changed:**
- *Front rows have the same 3-ft rule:* 264 sections would answer
  differently with their own measured front row.
- *The tool's "too deep" check* counts the model's open rows. Under a
  high deck the scan also sees seats past its edge, so 57 sections (and
  12 that no longer land in their tier's band) are no longer measured.
  They keep their backs.
- *The tool takes tier medians field by field,* which can pair two kinds
  of back (Oracle, Petco). Taking the median section instead would fix
  this at the source.
- *GABP 104 and 105* take a light tower as their back, while Fenway's
  lattice light towers are left out. The two choices don't match.
- Still open: the confidence split / `heightsSourced`, and Mets 108's
  cover.

---

## §15 Every measured section on its own front row (plan, 2026-11-16)

Branch `fix/section-fronts`, from `main` after PR #88.

**The problem.** It is the same shortcut §14 fixed for backs. The lidar
tool's `suggest()` gives a section its own front-row height only when it
is more than 10% (and 3 ft) off its tier's. The sections it does list are
pooled within 3 ft, and each takes its group's median. The front row sets
the height of every row behind it, so it sets the angle from each head to
whatever stands behind. Today, on the measurements re-taken in §14:
- 869 measured sections' own front row differs from what the profile
  uses (rounded to the foot):
  - 855 use the tier's front;
  - 14 have a written front that differs from their own measurement.
- Most differ by about a foot (median 1, 90th percentile 3, largest 9),
  but 263 sections' answers change at the five 2025 test games: 122
  shadier, 141 sunnier. Once the exceptions below keep their written
  fronts, that is 246 (362 half-hour steps).

**Where the scan's front row isn't the section's.** The tool measures the
front of the run of seats it finds. In four places that isn't the profile's
front row, and the code already says so:
- *Rows in front of the run* (Oracle's View level: rows A–D, eight rows
  in 315 and 326). The profile's front row is the run's carried down the
  slope. The tool will report it that way (the run's front less those
  rows' rise). Then 12 of the 22 differ.
- *Sections that start rows up the slope*, behind other seats the cut
  runs through:
  - Rate Field's lower box (`RATE_FIRST_ROW`, behind the scout seats);
  - Rate Field's upper-deck sections the 2023 view bars shortened;
  - Sutter's 106, 107, 117 and 118 (behind the dugouts).

  Their written fronts come from their first row's number on the
  measured slope, and they stay (35 sections).
- *Cuts that start past an aisle* (Rate Field 507, 509, 522, 526, 538,
  542, 554): they keep the tier's front.
- *Tiers whose front is carried from another* (Citizens Bank's Diamond
  Club, from the dugout boxes' slope): it stays.

**A deck can't go through the heads.** Many undersides are estimates
whose lower bound is 9 ft above the first covered row's floor (§8,
`deckClearance.test.ts`), worked out from the tier's front. With their own
front 1–3 ft higher, 36 sections would sit under 9 ft:
- Yankee Stadium field level (16), Dodgers field (5), Oracle lower (5),
  Angel Stadium field (3), GABP 400 level (5) and one each at Coors and
  Citizens Bank.

All 36 undersides are estimates, so each rises to that bound over the
section's own floor. An underside the scan measured would need its cut
checked instead (none so far). Where a section's own front is lower, its
underside stays where it is: a deck doesn't move with the seats under it.

**Fix.**
1. Tool:
   - `suggest()` lists every found section whose own front row (rounded)
     differs from its tier's, unpooled, as a ready-to-paste map, as it
     does for backs;
   - `measure()` reports the front row as the profile counts it where
     rows lie in front of the run (`rowsInFront`);
   - Oracle is re-measured (its backs don't change).
2. A small `withFronts` helper beside `withBacks`. Per park, one commit
   each:
   - every measured section takes its own front row, except the four
     kinds above, each with its reason in the code;
   - a tier whose front is its median takes the new median (8 differ,
     each re-read: Sutter's first and third, the Dodgers pavilion, Mets
     left outfield (estimated), the Nationals pavilion, the Petco
     terrace, Citizens Bank's Diamond Club and its 100s without a
     sourced cover);
   - the 36 undersides rise to the §8 bound;
   - the 14 other sections more than 3 ft off are checked on their cuts:
     PNC's 300s (eight), Cardinals 271, Guardians 468, Mets 537,
     Phillies 318, PNC 339, Reds 526;
   - comments: "a section more than 10% (at least 3 ft) off gets its
     own" becomes "every measured section takes its own front row";
   - reference checks and post claims are investigated and recorded,
     never tuned; full suite, type check, Low share.
3. Re-run the audit (`tmp/lidar/frontAudit.ts`); full checks; review here.

**Not in this plan (noticed):**
- *Rake has the same rule.* 1,245 measured sections' own rake differs
  (166 by more than 3°), and 197 would answer differently. Rake errors
  from a cut along steps or past an aisle are larger, so it needs its own
  look.
- Still open from §14: the tool's "too deep" check, tier medians taken
  field by field, GABP 104/105's light tower, the confidence split, and
  Mets 108's cover.

### Steps
- [x] 1. Tool rule and the `rowsInFront` front; re-measure Oracle.
- [x] 2. `withFronts` helper (with the first park's commit).
- [x] 3. 22 parks, one commit each.
- [x] 4. Audit re-run; full checks; review.

### §15 Review (2026-11-16)

**What changed:**
- **Tool:** `suggest()` lists every found section whose own front row
  (rounded) differs from its tier's, unpooled, as a `withFronts` map.
  `measure()` reports the front row as the profile counts it where rows
  lie in front of the run (`rowsInFront`). Oracle was re-measured, and
  only its 22 View fronts moved; no back changed.
- **Data:** a `withFronts` helper beside `withBacks`, and 22 commits, one
  per park.
  - 2,327 measured sections take their own front row.
  - 47 keep a front set on purpose, each with its reason in the code:
    - Rate Field lower box (25, `RATE_FIRST_ROW`): rows start up the
      slope behind a dugout or the scout seats, and the cut runs from the
      slope's front;
    - Rate Field upper deck: seven cut past an aisle, plus the six the
      2023 view bars shortened;
    - Citizens Bank's Diamond Club (5): its front is carried from the
      dugout boxes' slope;
    - Citi 537 (its cut crosses the stand's end at an angle), Progressive
      468 (its run starts a row up), Citizens Bank 318 (a run part way
      up) and GABP 526 (past the walkway).
  - Written fronts the map now covers are gone. Several were pooled and
    stale: Yankees 134, Busch 131, Camden 74 and 82, Progressive 146,
    148 and 185, Truist 137, Comerica 137 and Kauffman 126.
- **Where it went differently from the plan:**
  - *Sutter's 105–107 and 117–119 take their own front (3–4 ft).* The
    plan kept the written values for 106, 107, 117 and 118. But a dugout,
    not seats, stands in front of them, so the scan's run starts at their
    first row. Their tier comments already quoted those heights, so
    `sutterFront` (a guess from row counts) is gone.
  - *PNC's eight Grandstand sections at ~71 ft take their own.* On their
    cuts the seats run on with no step up from the club's walkway, and
    their covered rows (9–10) were counted from that same start.
  - *Busch 271 takes 52 ft:* its rows start behind a flat platform at
    that height.
- **Tier fronts:**
  - Two move to their median: the Dodgers pavilion (8 → 9) and the Petco
    terrace (36 → 37), neither of which had a reason written.
  - These stay, with reasons:
    - Sutter's first- and third-base tiers stay at field level, because
      their medians mix two kinds of section;
    - Mets left outfield keeps its estimate;
    - the Nationals pavilion keeps the median of the six measured before;
    - Citizens Bank's Diamond Club and its 100s without a sourced cover
      (which share `CBP_FIELD`) keep their fronts.
- **Undersides (§8):** 35 estimated undersides rise to 9 ft over the
  section's own first covered row: Yankee Stadium field level 16,
  Dodgers 5, Oracle 5, GABP 400s 5, Angels 2, Coors 1 and Citizens Bank
  207. The plan counted 36: Angels 118's covered row is past its last
  row. None of them was measured, and none rises above its deck's front.
- **Post:** the Yankees line now reads "By the 9th, about three in ten
  are fully shaded" (12 of 41), and its claims test follows.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 246 sections (357 half-hour steps).
- 96 labels go up and 92 down. The Low share stays at 26.8%.
- Sections changed by park: Red Sox 36, Mets 26, Dodgers 24, Yankees 16,
  Padres 16, Rockies 15, Phillies 14, Orioles 12, Pirates 12, Cardinals
  10, Braves 8, Reds 8, Royals 8, Athletics 7, Twins 7, Giants 6,
  Guardians 6, Angels 5, Nationals 5, Tigers 3, White Sox 2, Cubs 0.
- Progressive's labels fall 27 with no answer change. At their own
  front rows its first-base 100s and upper boxes sit nearer a
  shaded/partial boundary.

**Checks:**
- Audit (`tmp/lidar/ownFrontCheck.ts`): 2,327 measured sections are on
  their own front row; the other 47 are the exceptions above. No
  underside is under 9 ft. The back audit is unchanged (2,363 sections,
  11 exceptions).
- The full suite passes, 3,551 of 3,551, and every reference check
  passes unchanged.
  - One full run lost the Chase suite to a Jest worker crash (SIGSEGV).
    It passes alone, and the next full run passed.
- The type check and eslint are clean.
- On the dev server, the Yankees post shows its new line, and the Rate
  Field page has no console or server errors.

**Noticed, not changed:**
- *Rake has the same rule:* 197 sections would answer differently with
  their own.
- *The tool's run can start past an aisle or a row up.* The over-3-ft
  check caught four such cases. Smaller ones may sit among the 1–3 ft
  differences taken here.
- Still open from §14: the "too deep" check, tier medians taken field by
  field, GABP 104/105's light tower, the confidence split, and Mets
  108's cover.

---

## §16 Every measured section on its own rake (plan, 2026-11-16)

Branch `fix/section-rakes`, from `main` after PR #89.

**The problem.** The rake sets how far each row rises over the one in
front: row *n* sits at the front row plus (*n* − 1) treads × tan(rake). Since
§15 every measured section starts on its own front row, the front of the
line the tool fits to its treads. But every section still climbs at its
tier's rake, the median of the tier's sections. So the rows drift off the
measured treads, more with each row back. A 3° difference over 20 rows is
about 3 ft at the back row, and that moves heads toward or away from the
deck above and the stand behind. Today:
- 1,245 of 2,374 measured sections' own rake (rounded) differs from the
  rake they get, 166 of them by more than 3°.
- If every one took its own, 204 sections' answers would change at the
  five 2025 test games (338 half-hour steps).

**A rake needs rows; a front row doesn't.** The tool fits a line to the
bottom of the scan's points along the cut, and the treads are steps. Over
a few rows, where the run starts and ends on a step tips the line a lot.
To measure how much, I took the 359 sections at six parks whose runs span
12 or more rows (Yankees, Dodgers, Red Sox, Cardinals, Pirates, Braves),
refitted each on only its first *n* rows, and compared that with the whole
run's rake (`tmp/lidar/rakeTrunc.py`):

| Rows fitted | Median error | 9 in 10 within | Within 2° |
|---|---|---|---|
| 3 | 2.6° | 14.5° | 44% |
| 5 | 1.4° | 6.8° | 61% |
| 7 | 1.0° | 3.8° | 69% |
| 8 | 0.8° | 2.8° | 80% |
| 9 | 0.6° | 2.1° | 90% |
| 10 | 0.4° | 1.6° | 94% |

The errors don't lean either way (the mean signed error is under 0.4°),
so this is noise from a short fit. The front rows are not really
shallower. The audit of today's data shows the same pattern:
- sections whose run spans 3–5 rows differ from their tier's rake by a
  median of 1.5°, and 57 of 231 by more than 3°;
- runs of 12 or more rows differ by a median of 0.4°, and only 18 of 948
  by more than 3°.

**The rule.** A section takes its own rake where its run spans 9 or more
rows, the least run whose rake is within 2° 9 times in 10.
- That is 1,325 sections, 578 of them off their tier's (41 by more than
  3°). Before the checks below, 100 sections' answers change (168 steps).
- A shorter run keeps the tier's rake. The tier's rake stays the median
  over all its measured sections: noise that doesn't lean evens out in a
  median. A median over the 9-row runs alone would rest on one or two
  sections in many tiers.
- 53 of the 185 measured tiers have no run of 9 rows, so nothing in them
  changes.

**Checks.**
- *Own rakes more than 3° off their tier's (41) are checked on their cut
  pictures,* as the fronts were. If the cut runs along an aisle's steps,
  past a walkway, at an angle to the rows, or into another stand, the
  section keeps the tier's rake, with the reason in the code.
  - Some look real because their neighbours agree: Cardinals 134–136
    (7–8° against 12°), Pirates 131–132 (8° against 13°), Dodgers 44RS
    and 48RS (25° against 29°) and Red Sox B157–B160 (20° against 16°).
  - Others stand alone: Braves 243 (24° → 18°, 18 steps), Yankees 234W
    (19° → 12°, 8 steps), Phillies 306 and 330, Pirates 139, Padres 227
    and Reds 146 (each 10–16° shallower).
  - First looks at three of these: Pirates 139's run is a low stand of its
    own under a deck, and Braves 243's and Yankees 234W's fitted lines
    follow their treads. Each gets a closer look.
- *A deck can't go through the heads (§8).* With their own rakes, 11
  undersides would sit under 9 ft above their first covered row, by
  0.1–1.8 ft:
  - Guardians 107, 108 and 129;
  - Twins 108, 112 and 115;
  - Reds 129, 130 and 417;
  - Yankees 109 and Cardinals 272.

  As in §15, an estimated underside rises to that bound. If the scan
  measured it, the rake, the covered row or the underside is wrong, so
  its cut is checked instead.
- *Values worked out from the tier's rake.* These are written as a row's
  number on a slope:
  - Rate Field's lower-box fronts (`RATE_FIRST_ROW`; 108, 110, 130–133,
    154 and 156 take their own rake);
  - the shortened upper-deck sections' fronts;
  - Citizens Bank's Diamond Club fronts (its rows from the dugout boxes'
    slope);
  - Sutter 123's back.

  Where such a section takes its own rake, the value is worked out with
  that rake, because its rows lie on that slope. For example, Diamond
  Club A and G go from 1 ft to 2 ft.
- *Tiers whose rake isn't their measured median* are re-read. As in §15,
  one with no reason written takes its median.
  - Red Sox Green Monster seats: set at 10° with no reason given; their
    three sections measure 28–35°, but over 3–4 rows.
  - Citi Excelsior: 25° "as before"; four sections measure 8–17°, over
    3–5 rows.
  - Citi left outfield: estimated 22°; its one section measures 18°.
  - Nationals pavilion: 20° against 23°, over four 9+ row runs.
  - Nationals mezzanine: 18° against 20° (one section).
  - GABP's upper third-base tier: 29° against 31°.
- The other §15 exceptions (cuts that start in the wrong place) are short
  runs, apart from Rate Field 540 (+1°) and GABP 526 (no change). They
  follow the rule above.

**Fix.**
1. Tool: `suggest()` lists every found section whose run spans 9 or more
   rows and whose own rake (rounded) differs from its tier's, as a
   ready-to-paste `withRakes` map. The rows come from the run's depth over
   the profile's tread, which `cover_report()` already reads. A comment
   gives the reason and the refit numbers. No re-measure is needed.
2. A small `withRakes` helper beside `withFronts` and `withBacks`. Then one
   commit per park (22), covering:
   - the own rakes, except any the cut checks above rule out;
   - the values re-worked from them;
   - the undersides raised by §8;
   - the tier re-reads;
   - comments: "every measured section takes its own front row and back"
     gains "and, where the scan saw 9 or more rows, its own rake";
   - reference checks and post claims, investigated and recorded, never
     tuned; the full suite, the type check and the Low share.
3. Re-run the audit (`tmp/lidar/rakeAudit.ts`); full checks; review here.

**Not in this plan (noticed):**
- *Rows under a deck aren't seen.* A covered section's rake comes from its
  open rows (and a few rows past the deck's edge) and is carried back
  under the deck. That doesn't change here.
- Still open: the "too deep" check, tier medians taken field by field,
  GABP 104/105's light tower, the confidence split, Mets 108's cover,
  and small run-start errors among the 1–3 ft front differences.

### Steps
- [x] 1. Tool: `suggest()` lists own rakes from runs of 9+ rows.
- [x] 1b. Tool: each cut checked against four beside it (added during the
  work, below).
- [x] 2. `withRakes` helper (with the first park's commit).
- [x] 3. 22 parks, one commit each.
- [x] 4. Audit re-run; full checks; review.

### §16 Review (2026-11-16)

**What changed:**
- **Tool (`scripts/measureStandHeights.py`):**
  - `suggest()` lists a `withRakes` map. It holds every found section that
    meets three conditions:
    - its run spans 9 or more rows;
    - its cut agrees with the cuts beside it;
    - its own rake (rounded) differs from its tier's.
  - `measure()` takes the same run on four more cuts through each section,
    2 and 4 m to either side. It reports the median rake and front row
    over the cuts whose run spans 5+ rows (`rakeAcrossDeg`,
    `frontAcrossFt`), where 3 or more do. It flags two kinds of cut:
    - `rakeOffAcross`: the section's own cut is more than 2° off that
      median;
    - `aisle`: the cut also starts more than 2 ft low and is steeper, the
      signature of an aisle's steps.
  - Tier medians leave those rakes (and aisle fronts) out. An aisle
    section's front row is the median of the cuts beside it.
  - All 22 parks were re-measured. Every earlier value came back exactly
    (0 mismatches).
- **Data:** a `withRakes` helper and 22 commits, one per park.
  - Of 2,374 measured sections, 1,317 have runs spanning 9+ rows. 1,287
    of those take their own rake (540 differ from their tier's). The other
    30 keep the tier's, because the cuts beside them disagree or there are
    too few of them.
  - **Tiers take their new median** (14), mostly because the cuts left out
    moved it:
    - Yankees Legends 10° → 9°;
    - Angels right pavilion 17° → 18°;
    - Truist field boxes 11° → 12°;
    - Truist executive 17° → 14° and 8 ft → 10 ft (half its cuts were
      aisles);
    - Cardinals Club 10° → 14°;
    - Oracle arcade 12° → 10°;
    - Citi Sterling 18° → 17°;
    - Petco field VIP 12° → 10° and left reserved 21° → 18°;
    - PNC left corner 11° → 10° and club 27° → 28°;
    - GABP 400 front 30° → 31°;
    - Target boxes 11° → 12°;
    - Fenway's Green Monster seats 10° → 34°. No reason was given for
      10°. All eight cuts through and beside the three measured sections
      read 26–36°, with both halves of each run equally steep.
  - **Tiers that keep their value, with the reason written:**
    - Petco right upper 27°: its median would rest on 227, whose run
      starts on a walkway.
    - Citi Excelsior 25°: only 3–5 rows show under the 400 level, too few
      to give a rake.
    - Nationals pavilion 20° and mezzanine 18°, GABP upper third 29° and
      the Petco terrace 22°: the median of the sections measured before,
      some of which the tool no longer finds.
  - **Aisle cuts (9 sections).** The five-cut check found cuts that run
    down an aisle's steps. Their run starts about 3 ft low and climbs at
    about 30° before the rows' own slope. They also gave §15 wrong fronts.
    Each now takes the front row of the cuts beside it and the tier's
    rake:
    - Truist 8 (−1 → 1 ft), 123 (7 → 9), 124, 126, 135 and 137 (6–7 → 10);
    - Orioles 68 (4 → 6);
    - Citizens Bank 119 (11 → 13);
    - Kauffman 144 (−1 → 3).
  - **Values worked out from a rake:**
    - Rate Field's lower box: its own rakes are a named map, and its
      sections that start up the slope are carried up it at their own
      rake (108, 110, 130, 131, 154 and 156 move a fraction of a foot).
    - Citizens Bank Diamond Club A and G: at their own 13°, row 5 is 2 ft
      (was 1).
    - Sutter 123 and Rate Field 540 don't change.
  - **Undersides (§8).** 11 estimated undersides rise to 9 ft over their
    first covered row's floor. They are exactly the 11 the plan listed:
    - Yankees 109 (24 ft);
    - Busch 272 (70);
    - Progressive 129 (20), 107 and 108 (30);
    - GABP 129 and 130 (26) and 417 (80);
    - Target 108, 112 and 115 (30).
- **Posts:**
  - *Yankees:* on July 12, "only three (312, 313 and 315 …) before the
    6th". 314, at its own 32°, is now shaded from about the 6th.
  - *Fenway:* the Monster seats get no shade at 1:35 PM games in July. At
    a 4:10 PM game, from about the 9th inning, the rows behind shade the
    front rows of M2. At 34° those rows step up about 1.9 ft, and the sun
    is 11–16° up behind them.
  - The claims tests follow both posts.

**Where it went differently from the plan:**
- *The check on own rakes.* The plan was to judge the 41 rakes more than
  3° off their tier from cut pictures. Pictures turned out too coarse for
  that, so the tool now compares every section's cut with four parallel
  cuts. The same rule applies to every own rake, not just the 41: of
  those 41, 30 pass (Padres 227 has too few cuts beside it). Applied to all, the rule left out 28 sections whose
  own rake differs from the one they use (plus 2 whose own matches).
- *Aisle cuts and §15's fronts.* Nine sections took wrong fronts from
  aisle cuts in §15. They are corrected here, from the cuts beside them.
- *Tier medians.* They now leave out cuts that aren't the stand's. That
  corrects Truist's executive tier. With the medians re-taken, 12 more
  tiers move by 1–4° (the Monster seats' change is a re-read, not this).

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 120 sections (202 half-hour steps).
- 56 confidence labels go up and 37 down. The Low share stays at 26.8%.
- Sections changed by park: Dodgers 20, Red Sox 20, Mets 11, Reds 11,
  Braves 6, Cardinals 6, Pirates 6, Yankees 6, Giants 5, Phillies 5,
  Orioles 4, Rockies 4, Tigers 4, Twins 3, White Sox 3, Nationals 2,
  Padres 2, Angels 1, Royals 1; Athletics, Cubs and Guardians 0.

**Checks:**
- `tmp/lidar/rakeMaps.ts`: no section is left off its own rake, and 28
  differing ones are left out by the rule.
- The front audit: 2,326 on their own front, 48 set on purpose. That is
  §15's 47 plus Diamond Club A, now carried at its own 13°.
- The back audit is unchanged (2,363, 11 exceptions), and no underside is
  under 9 ft.
- The full suite passes, 3,553 of 3,553. The type check and eslint are
  clean.
- On the dev server both posts show their new lines and the Truist page
  loads, with no console or server errors.
- **Not run:** the production build and Playwright (CI runs them).

**Noticed, not changed:**
- *Sections whose cut is off those beside it keep their tier's rake.* The
  median of the cuts beside them would often be closer: Citizens Bank 306
  reads 21° beside it against the tier's 29°, and 330 reads 22° against 31°.
  Taking that median, where the side cuts are long enough, is a follow-up.
  *(Wrong, §17: every cut through 306 and 330 crosses their rows at 40–47°;
  along their rows they read 29° and 31°, their tiers' rakes.)*
- *Small tiers' medians can rest on one or two sections.* The Cardinals
  Club's 14° comes from one 7-row run; the cuts beside its two sections
  give 11–12°.
- *Truist 122 is a borderline aisle.* Its front is exactly 2 ft below the
  cuts beside it, so it keeps its own 6 ft.
- *42 more fronts are over 2 ft off their five-cut median without the
  aisle signature.* Some are §15's exceptions; others are real variation
  across a section, or side cuts that leave it.
- Still open: the "too deep" check, tier medians taken field by field,
  GABP 104/105's light tower, the confidence split, Mets 108's cover, and
  rows under decks that the scan can't see.

## §17 Stand directions from the lidar (plan, 2026-11-17)

Asked: plan the side-cut rakes. That is §16's note that a section whose cut
is off the cuts beside it should take their median instead of its tier's
rake. Working it out showed that note was wrong for the cases that matter.
What sits underneath them is a bigger error: some sections' stand directions
are wrong. Branch `fix/stand-directions`, from `main` after PR #90.

**The side-cut rakes don't hold up.** As a rule, the side-cut rake would be
the median of the cuts beside the section whose runs span 9+ rows and aren't
too deep for its rows, where two or more agree within 2°. It would apply where
the own cut is too short or off the cuts beside it.
- It would give 79 sections a new rake and change answers for 10.
- But the biggest movers read shallower than their neighbours:

  | Section | Cuts beside it | Its tier | Its neighbours, on their own rake |
  |---|---|---|---|
  | Phillies 306 | 21° | 29° | 305 and 307: 27–29° |
  | Phillies 330 | 22° | 31° | 329 and 331: 31° |
  | Yankees 207 | 11° | 19° | 205–209: 17–18° |
  | Orioles 68 | 7° | 14° | 66 and 70: 13–14° |
  | Reds 421 | 21° | 31° | 422 and 423: 30–32° |

  Every parallel cut through these sections reads equally shallow and spans
  more rows than the section has. That is the mark of cuts that cross the
  rows at an angle, so the median of the cuts beside them would move them the
  wrong way.
- The aisle cases it would rightly fix (the Braves executive tier, Phillies
  119) already match their tier.

**The root cause: the stand direction.**
- The tool cuts each section along its stand direction (`standCompass`).
  That direction comes from the club's seat map. Each section faces square to
  a line fitted through it and its four nearest ring-mates
  (`standCompasses()` in `parkSectionBuilder.ts`), or along a stand run
  measured on an aerial photo (`standRuns`).
- Where a ring bends, that line averages two faces. A cut at an angle *t* to
  the rows' fall line reads a rake of atan(tan *R* · cos *t*), and spans
  1/cos *t* more rows.

**Finding the fall line.** At each section's anchor, the tool took 13 cuts,
turned −60° to +60° in 10° steps (`tmp/lidar/fallSweep.py`). A fit finds the
direction and rake that the most cuts agree with to within 1.5°, needing 5
of them over 40° or more, so one aisle or walkway can't outvote it
(`tmp/lidar/fallFit.py`). Two checks:
- *It matches the physics.* Each §16 own rake equals its fall-line rake
  times the cosine of how far its cut is off. The median error is 0.3°, and
  9 in 10 are within 1.0°.
- *A second method agrees.* A plane fitted to the tread surface in a 10 m
  patch (`tmp/lidar/planeFit.py`) doesn't use the cuts at all:

  | Section | Plane fit | Cut fit |
  |---|---|---|
  | Reds 108–114 | +27° to +28° | +20° to +27° |
  | Phillies 306 | +45° | +40° |
  | Yankees 207 | +53° | +52° |
  | Phillies 330 | −34° | −46° |
  | Controls on straight runs (Phillies 132, 307, 331) | 0° to +3° | −3° to +2° |

**The result.**
- 2,221 of the 2,374 measured sections fit.
- 291 are firmly more than 15° off their stand direction: every direction
  that fits as well as the best is. 79 of them are more than 30° off.
- By park: Yankees 37, Mets 35, Dodgers 32, Cardinals 29, Red Sox 26, then
  16 or fewer at each other park.
- Off by 10° or less can't be told from noise: on a shallow stand the rake
  barely changes near the fall line.

**Why it matters, twice over.**
- *The engine uses this direction for the sun.* It sets whether the sun is
  behind the stand and how steeply its rays cross the rows. Turning those
  291 sections to their fall lines changes answers for 236 of them at the
  five 2025 test games (1,573 half-hour steps). That is far more than any
  change so far (`tmp/lidar/fallWhatIf.ts`).
- *§16 took own rakes from these cuts.* 171 of its 1,287 own rakes come
  from cuts firmly off the fall line. 59 of them are more than 2° off their
  fall-line rake, and most go back to near their tier's:

  | Section | Rake now | Fall-line rake |
  |---|---|---|
  | Phillies 430 | 25° | 32° |
  | Yankees 234W | 12° | 19° |
  | Phillies 126 | 7° | 13° |
  | Braves 243 | 18° | 24° |
  | Cardinals 134–136 | 7–8° | 13° |
  | Pirates 131–132 | 8° | 13° |
  | Dodgers 44RS and 48RS | 25° | 31° |

  §16 accepted several of these because their neighbours agreed. The
  neighbours share the same wrong direction.
- Fronts barely depend on the direction. Backs, covered rows (which stretch
  by 1/cos *t*) and the five-cut check all do.

**A caution: bends.** At a bend, the fall line changes within a section, and
the one at the anchor may not be the section's.
- The scan around Reds 110 shows the stand's front edge bending right at its
  anchor. On one side the rows run at 78°: that is the third-base line in
  `reds.ts`, measured on a NAIP photo, facing 347°. On the other side they
  run at about 102°, facing about 12°.
- Reds 108–114 fit at +20° to +28°, against that photo-measured run.
- So a section is turned only where its whole width agrees.

**The rule.** A measured section is turned to face its fall line where all
three hold:
1. the fall line is firmly more than 15° off its stand direction;
2. the fall line found at the cuts 4 m to either side agrees with it to
   within 10° (the section is one face, not a bend);
3. its picture (the scan's relief, `tmp/lidar/rowPicture.py`) shows the
   rows square to it. Every section whose answers change gets one, checked
   on a contact sheet per park.

Any other section keeps its current direction. Sections that straddle a bend
are listed.

**Fix.**
1. *Tool.*
   - `measure()` finds each found section's fall line: the 13 turned cuts at
     its anchor and at 4 m to either side, with the fit above. It reports
     how far the fall line is off, the range of directions that fit as well,
     the fall-line rake, and whether the sides agree.
   - `suggest()` lists the sections the rule turns as `standRuns` entries,
     `{ ids, facingDeg }`, for the park's section file. Most measured parks
     already use these for photo-measured runs.
   - It also draws one picture per section.
2. *One commit per park.*
   - The stand directions, then re-export (`standSections.ts`) and
     re-measure, so every cut runs along the new direction.
   - Then the maps from `suggest()`, as in §14–16: own rakes, fronts,
     backs and covered rows, where the re-measure changes them.
   - The §8 undersides.
   - Reference checks and post claims, investigated and recorded, never
     tuned. The full suite, the type check and the Low share.
   - Where a turn conflicts with a photo-measured run (the Reds' third-base
     side), the photo and the scan are compared and the reason written.
3. *Side-cut rakes: not done.* After the re-measure, any section whose own
   cut is still off the cuts beside it and more than 2° off its tier is
   listed, with what its picture shows.
4. *The audits re-run* (own rakes, fronts, backs, §8); a review here. It
   also corrects §16's note on Phillies 306 and 330, whose tier rakes were
   right.

**Not in this plan (noticed):**
- *The eight parks without a lidar measurement keep their seat-map
  directions.* The same averaging at bends applies there. Most have roofs.
- *Fitting directions on the seat map itself* (fewer ring-mates at a bend)
  could catch some of this without the scan. The scan measures it directly,
  so it comes first.

### Steps
- [x] 1. Tool: fall line at the anchor and 4 m either side; `standRuns`
  suggestions; pictures.
- [x] 2. 22 parks, one commit each: directions, re-measure, maps (19
  parks have turns; the Athletics, Cubs and Guardians have no change).
- [x] 3. Side-cut rakes: list what's left.
- [x] 4. Audits; full checks; review.

### §17 Review (2026-11-17)

**What changed:**
- **Tool (`scripts/measureStandHeights.py`).**
  - `measure()` finds each section's fall line: 13 cuts turned −60° to
    +60° about the middle of its run, and about the points 4 m to either
    side, with the consensus fit (`fall_line()`).
  - A cut firmly more than 15° off the fall line is flagged `cutOffFall`.
    Its rake leaves the tier median and the own-rake list.
  - `suggest()` lists the turns as `standRuns` entries, plus the sections
    left on bends. `fallsheet` draws each such section's scan, with both
    directions and a row line square to each.
  - Every earlier measured value came back exactly at all 22 parks.
- **Directions.** 154 sections at 19 parks face their rows' fall line,
  through `standRuns` id entries at the top of each park's list:
  - Yankees 26, Dodgers 20, Cardinals 17, Mets 16;
  - Reds 11, Red Sox 10, Pirates 8;
  - Padres, Royals and Tigers 6 each, Braves and White Sox 5 each,
    Orioles 3 (with 312 kept, below);
  - Angels, Nationals and Twins 3 each, Giants, Phillies and Rockies 2
    each.

  136 sections on bends keep the map's direction. Of those, 41 had no fall
  line on one side.
- **Re-measured along the new directions**, through the §14–16 maps:
  - rakes, fronts and backs;
  - covered rows, by the tool's rule;
  - the §8 undersides;
  - the tier medians, which also leave the cuts across the rows out.
- **Tiers that take a new median:**
  - Cardinals loge 21° → 25°;
  - Mets field boxes 12 → 14, Sterling 17 → 18, 400s 26 → 28, Promenade
    30 → 32;
  - Dodgers Lower Reserve 29 → 30 and Infield Reserve 27 → 30;
  - Reds 400s 25 → 27 and third-base field level 11 → 12;
  - Yankees Main 19 → 20;
  - Petco 100s 10 → 11, right lower 12 → 14, upper 29 → 30;
  - White Sox upper 33 → 34;
  - Red Sox pavilion reserved 35 → 36;
  - Twins right field 16 → 18;
  - Orioles right corner 12 → 13;
  - Tigers mezzanine 24 → 25;
  - Cardinals field boxes 7 → 9;
  - Dodgers Dugout Club 7 → 8;
  - Braves right-field corner 23 → 24;
  - Angels pavilion upper 23 → 24;
  - and some fronts and backs, each with its comment.

  Tiers with a written reason keep their value:
  - Giants lower back, Petco 100s back (both re-checked, unchanged);
  - Petco terrace 22° and right upper 27°;
  - Royals plaza ends;
  - Twins corner cover (a cable line);
  - Nationals Gallery;
  - Comerica left corner (the bowl's shared 10°).
- **Values worked out from a rake follow:**
  - Rate Field's shortened upper sections that start 5 rows up: 80 → 81 ft;
  - the Reds 400s' undersides: 78 → 80 ft, and 69–71 ft over 401–405;
  - four Busch loge undersides: 70–71 ft;
  - the Yankees field level's underside 23 → 24 ft (its median front is
    6.51 ft, was 6.48), and 107's 18 → 19 ft.
- **Covered rows the angled cuts had stretched go back:**
  - to their tier's row: Phillies 306 (15 → 11) and 430 (9 → 6); Pirates
    131 and 132 (26/25 → 17); Giants 102 (34 → 29); Yankees 207 and 234W
    (12 → 8);
  - to their source's row: Dodgers 52FD (to the source's T, its 20th);
    Petco 129 (25 → 21); Busch 129 and 134.
- **Covered rows the scan finds anew along the rows** (more than 2 rows
  off the source): Busch 131 (11), 163 and 167 (22); Dodgers 53FD (17);
  Mets 511 (8); Nationals 304 (12); Padres 118 (23) and 120 (26); Reds 109
  (22); Comerica 116 (31), 140 and 141 (32), 144 (16).
- **Tests and posts:**
  - Stand-direction test: six sections move from photo-measured runs to
    their rows on the scan (Mets 525, Busch 265 and 130, Nationals 240,
    Petco 121, Reds 414), each with the reason.
  - Dodgers reference: 52FD rejoins the field level's first-pitch-sun
    check, and 53FD takes its place, with the note.
  - Yankees post: 232 and 233 are partly shaded until about the 7th, then
    shaded; 234W until about the 9th; 309W is the 300s' exception
    (partly, then shaded); 333W is in sun at Medium confidence.
- **Headers:** 19 parks' headers state the fall-line rule.

**Where it went differently from the plan:**
- *Bend sections' rakes.* A section on a bend keeps the map's direction,
  but its cut still crosses the rows. So `cutOffFall` also takes its rake
  out of the own-rake list and the tier medians, and it takes its tier's:
  - Braves 243 18 → 24, Cardinals 135–136 8 → 12, Phillies 126 7 → 13.
- *A turn has to hold.* Orioles 312 fitted 19° off. Re-measured at 147°,
  its fall line pointed firmly back to 166°, so it keeps the map's 166°
  (and its test).
- *Two more checks on the direction.*
  - A riser check (`tmp/lidar/riserNormal.py`) takes the direction square
    to the rows' step faces, so a stand that rises along its rows can't
    lean it. It agreed with the fall line, including at the Reds' third
    base.
  - The pictures gained a row line square to each direction. All 154
    turns hold up on them. Fenway B5 is marginal: its tunnels give
    163–165°, against 159° turned and 172° before.
- *Source against scan on covered rows.* Three sections keep their
  source's row against a scan row more than 2 off, because a check on
  that section's own rows agrees with the source:
  - Busch 130 (17, not 8);
  - Petco 121 (23, not 26);
  - Comerica 145 (open, not row 18).

  In each the deck's end runs across the rows at a corner. Dodgers 53FD
  takes the scan's row: its source's claim covers all field sections, so
  it gets the exemption 52FD had.
- *Pirates 139* takes its own 22°, though its run along the fall line
  spans 7 rows. It is a low stand of its own, not the river stand whose
  31° the tier gives. The angled cut's 15° is 22° at that angle.
- *Rate Field 508 and 509* join the "cut past an aisle" group that keeps
  the tier's front: their roof edge, counted from row 1, is at row 7. 507
  leaves it.
- *Braves 8* is not measured along its fall line (its run joins the stand
  behind). It keeps its front from the cuts beside it and takes its tier's
  back.
- *A mistake caught in the audit.* Mets 537's deliberate front (§15) was
  overwritten when its tier's median moved, and is restored.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 166 sections (871 half-hour steps).
- 110 confidence labels go up and 107 down.
- The Low share is 26.7% (was 26.8%).
- By park: Cardinals 28, Mets 27, Yankees 27, Dodgers 12, Padres 12,
  Tigers 11, Reds 10, Pirates 9, Red Sox 8, Royals 4, Phillies 3, Twins 3,
  White Sox 3, Angels 2, Braves 2, Giants 2, Nationals 1, Orioles 1,
  Rockies 1.
- The plan's 236 sections assumed all 291 firmly-off sections would turn;
  154 did.

**Checks:**
- *Rakes:* every measured section is on the rule's rake but Pirates 139,
  set on purpose (`tmp/lidar/rakeCheck17.ts`).
- *Fronts:* 2,325 on their own and 48 set on purpose (508 joins, 507
  leaves, 537 restored).
- *Backs:* unchanged, with the same 11 exceptions. No underside is under
  9 ft.
- *Tests:* the full suite passes, 3,559 of 3,559. The first full run lost
  one suite to a crash while lint, the type check and a snapshot ran
  alongside; the re-run passed whole. The type check and eslint are clean.
- *Dev server:* the Yankees post shows both new lines, and the Yankees
  page loads, with no console or server errors.
- **Not run:** the production build and Playwright (CI runs them).

**Noticed, not changed:**
- *Bend sections keep fronts, backs and covers from cuts that cross their
  rows* (136 sections); only their rakes go to the tier's. Measuring a bend
  section on each of its faces is a follow-up.
- *Direction precision.* On shallow stands the fit resolves only about
  10°. Turned sections re-measure within ±10° of their fall line, and the
  pictures put B5's error at about 5°.
- *Corners where a deck's edge runs across the rows* (Busch 127–133, Petco
  118–121, Comerica 144–145, Dodgers 52–53FD): the covered row changes
  across the section, and the engine takes one.
- *Small tiers' medians:*
  - Angels pavilion upper's back is the mean of two different structures
    (71 ft, 23 ft back);
  - the Braves corner rests on 210 alone, the Dodgers Infield Reserve on
    two sections.
- *Photo runs the scan contradicts:*
  - the Reds' third-base 347° (wrong for the upper decks and 108–115);
  - the Busch third-base and right-field corner runs;
  - Camden's first-base 166° (312 ambiguous).

  The sections the scan didn't turn still use them.
- *Side-cut rakes:* four sections remain off the cuts beside them and
  more than 2° off their rake. None calls for one:
  - Angels 119 and Nationals 100: their side cuts are short or disagree;
  - Phillies 330: on a bend, its tier's 31° right;
  - Rockies L344: its side cuts run past the section.
- *Not done:*
  - the Athletics', Cubs' and Guardians' headers (no data changed);
  - the eight parks without lidar;
  - the seat map's own fit at bends.

## §18 Bend sections (plan, 2026-11-17)

Asked: plan the bend sections. Branch `fix/bend-sections`, from `main`
after PR #91.

**The problem.**
- §17 turned a section to its rows' fall line only where the fall lines
  in its middle and 4 m to either side agreed within 10°.
- 136 sections had their middle firmly off the map's direction but didn't
  pass that test. They keep the map's direction, and their rake went to
  the tier's.
- Their fronts, backs and covered rows still come from a cut that crosses
  their rows.
- More importantly, for many of them the map's direction isn't even
  between their faces. Every part of the section faces well away from it,
  the same way.

**How their fall lines sit** (middle and the two sides, where found):

| Pattern | Sections | Example |
|---|---|---|
| All off the same way by more than 15° | 46 (21 with one side missing) | Braves 243: +46, +29, +49 |
| Off the same way, one side within 15° | 39 (9 with one side missing) | |
| Either side of the map's direction | 47 (7 with one side missing) | Cardinals 135: −50, −50, +13 |
| Only the middle found | 4 | |

The map's direction is a fair compromise only where the fall lines lie
either side of it. Even then, the middle often outvotes one side; Cardinals
135 faces 147°, not 197°, over two-thirds of its width.

**The rule.** A section on a bend faces the median of its fall lines
(middle and 4 m to either side, as found) where:
- at least two of them were found;
- the median is more than 15° off the map's direction;
- it holds when re-measured: along the new direction, the median of the
  fall lines is within 15°;
- its picture, with a row line square to each direction, shows the rows
  run along the new one.

This replaces §17's "the sides agree within 10°". A section that passed
that test passes this one with the same direction to within a few
degrees, so §17's turns stand. Once a bend section is turned, its cut
runs along the median face. Where its middle is still firmly off the new
direction, the cut still crosses that face, so `cutOffFall` keeps its rake
on the tier's.

**The numbers.**
- 95 sections at 21 parks turn: Mets 14, Cardinals 11, Red Sox 11,
  Yankees 9, Dodgers 7, Pirates 6, and 1–4 at fifteen others.
- 41 keep the map's direction: 37 whose fall lines lie either side of it
  (median within 15°), and the 4 with only the middle found.
- Turning alone changes answers for 77 of the 95 at the five 2025 test
  games (494 half-hour steps; `tmp/lidar/bendWhatIf.ts`).
- Re-measuring along the new direction then moves their own fronts,
  backs, covered rows and (where the cut now runs along the rows) rakes,
  and the tier medians, as §17's turns did. That number comes with the
  work.

**What one direction can't fix.** In 28 of the 95, one face is more than
20° off the median. The section's rows bend that much across its width,
and the engine takes one direction per section. The median puts it on the
direction most of the section faces.

**Fix.**
1. *Tool.* `fall_turn()` takes the median of the fall lines found (two or
   more), where it is more than 15° off, in place of "the sides agree
   within 10°". `suggest()` lists the turns, and the sections kept with
   why (fall lines either side, or only the middle found).
2. *Re-measure and check.*
   - Re-measure the parks with turns.
   - Draw every turn's picture and check it.
   - Put the turns in `standRuns`, re-measure along them, and drop any
     turn whose median isn't within 15° afterwards.
3. *One commit per park.*
   - The turns, then the maps from the re-measure: rakes, fronts, backs,
     covered rows and the tier medians, as in §17.
   - The §8 undersides, the reference checks and post claims
     (investigated, not tuned), and photo-measured runs it contradicts,
     with the reason written.
   - **Guard from §17's slip (Mets 537):** a deliberate exception keeps
     its value when its tier's value moves. Only lines for turned
     sections and tiers are edited, never one because its text changed.
4. *The audits, full checks and a review here.*

**Not in this plan (noticed):**
- *Splitting a strongly bent section into its faces in the engine* (shade
  per face, weighted by seats): the honest fix for the 28 above, but an
  engine change.
- The eight parks without lidar, and fitting the seat map's own
  directions at bends.

### Steps
- [x] 1. Tool: the median rule; the kept list.
- [x] 2. Re-measure; pictures; turns; re-measure along them; stability.
- [x] 3. Parks, one commit each: directions, maps, checks.
- [x] 4. Audits; full checks; review.

### §18 Review (2026-11-17)

**What changed:**
- **Tool (`scripts/measureStandHeights.py`).** `fall_turn()` turns a
  section to the median of the fall lines found (middle and 4 m to either
  side, two or more) where that median is more than 15° off, in place of
  §17's "the sides agree within 10°". `suggest()` lists the sections kept
  (fall lines either side, or only the middle's found). Fenway B6 joins
  the `skip` list (below).
- **Directions.** 79 sections at 21 parks turn, as `standRuns` entries:
  - Cardinals 11, Red Sox 11, Mets 10, Yankees 9, Pirates 6;
  - Braves and Padres 4 each;
  - Angels, Dodgers, Phillies and Rockies 3 each;
  - Orioles and Tigers 2 each;
  - Cubs, Giants, Guardians, Nationals, Reds, Royals, Twins and White
    Sox 1 each.
- **Of the plan's 95, 16 keep the map's direction:**
  - 8 on the picture check, where the rows don't run square to the
    median: Dodgers 2DG, 34BL and 41BL, Phillies 140, Reds 303, Twins
    140, White Sox 108 and 322;
  - 6 that didn't hold when re-measured (the median of their fall lines
    still more than 15° off): Angels 127, Dodgers 10DG, Mets 213 and 409,
    Reds 22, Rockies 309;
  - Mets D, whose rows centre on the plate behind home (the
    stand-direction test's photo run);
  - Mets 534: two fall lines on a 4.5-row run at the stand's end, and
    Rate Your Seats' shade on its rows 10 and up at a July 1:10 PM game
    needs the map's direction.
- **Re-measured along the new directions**, through the §14–17 maps:
  rakes, fronts, backs, covered rows and the §8 undersides, one commit
  per park. A guard (`tmp/lidar/changes18.py`) edits only turned
  sections and sections with no deliberate line before, so §15–17
  exceptions keep their values (the Mets 537 lesson).
- **Tier values that move:**
  - rakes: Pirates left corner 10° → 12°, Cardinals 100s 12 → 13, Mets
    400s 28 → 29, Mets field boxes 14 → 13, Braves right-field corner
    24 → 23;
  - fronts: Angels pavilion upper 38 → 36 ft, Dodgers pavilion 9 → 8,
    Orioles right corner 3 → 2, Pirates left corner 2 → 1;
  - backs: Tigers left-field pavilion 54 ft 1 ft in front → 62 ft 6 ft in
    front; Yankees terrace 133 → 137 ft and field level 133 → 134; Cubs
    bleachers 57 ft 19 ft back → 54 ft 12 ft back; Angels pavilion upper
    71 → 75 ft; Padres right upper 73 ft 81 back → 75 ft 73 back; and
    1–9 ft setback moves at the Pirates (left corner, upper), Fenway
    field boxes, Reds third base, Nationals Terra Club, Padres 100s and
    terrace, Dodgers and Cardinals loges.

  Tiers that keep their value, with the reason written: Busch 100s back
  34 ft and field boxes 111 ft (the median rests on turned corner
  sections; Rate Your Seats' March check on 157 and 158 holds at 34);
  Braves corner back (the canopy); Fenway right-field boxes (82 ft: the
  median of the four measured, 68 ft, is neither roof); Camden right
  corner and Petco 100s backs (two structures); Petco right upper's rake
  27° (227's 24° along its rows spans five rows).
- **Covered rows along the rows:**
  - back to the source's or tier's row: Yankees 133 (17 → 14) and 234
    (5 → 8), Comerica 345 (15 → 21);
  - the scan's row, more than 2 off the source: Reds 111 (31), Camden 74
    (14), Coors L345 (16), Mets 523, 503 and 511 (8);
  - kept as sourced, where a section-specific reference agrees or the
    deck's end runs across the rows: Comerica 146 (open, like 145), Petco
    227 (23), Phillies 126, Giants 143 (open), Yankees 135 (open; along
    its rows the deck's edge is over its last row, as sourced).
- **Fenway B6 is no longer measured.** Along its rows its cut runs up a
  field-level walkway into the stand and finds the rows behind it (6 ft
  front row, 13°); the cuts 4 m either side climb its rows from the
  field. It takes its tier's values, as Giants 122 (a vomitory ramp)
  does.
- **Tests and posts:**
  - Comerica's upper-deck reference ("decent shade in the last rows of
    most sections") records 345 with 343: 345 faces 66° at the left-field
    corner (fall line, tread plane and risers 59–69°), into the afternoon
    sun.
  - Stand-direction test: Busch 162, Petco 325 and 220, Dodgers 316PR on
    their rows on the scan.
  - Fenway post: Loge Box 154 and 155 are fully shaded by the 6th inning,
    not the 4th.
  - Yankees post: 305 is partly shaded until about the 6th, 305W through
    the 9th, 332B in the sun until about the 9th; 234 partly shaded
    through the 9th, then shaded (Medium, was Low); five in six terrace
    sections shaded by the end of the April 13 game (was three in four).
- **Headers:** 19 parks' headers give the median rule; tier notes that
  still said "straddles a bend" for turned sections, or gave values from
  before, now match their profiles.

**Where it went differently from the plan:**
- *16 of 95 turns dropped* (above), so 79 went in.
- *Three covered rows slipped through at first:* Reds 111, Camden 74 and
  Coors L345 kept the row the cut across their rows had read. The cover
  report compares against the profile's row, which for these was that
  scan row, not the source's. A check of every turned section against its
  true source found them; each is its own commit.
- *A walkway into a stand* (Fenway B6) fooled the aisle flag, which only
  catches a cut that starts low. 37 sections across the parks have a
  middle-cut front more than 2 ft off the cuts beside it; most are set on
  purpose from §15. Of the turned ones, Royals 128 is caught by the flag
  (its cut runs down an aisle's steps) and Cardinals 136D keeps its front
  on purpose; B6 was the new case.
- *Stale tier notes:* the Angels pavilion upper, Dodgers pavilion and
  Mets notes went in with values from before their medians moved; fixed
  in the docs commit.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 80 sections (360 half-hour steps).
- 55 confidence labels go up and 39 down.
- The Low share is 26.6% (was 26.7%).
- By park: Cardinals 17, Red Sox 13, Yankees 12, Mets 11, Braves 4,
  Dodgers 3, Padres 3, Phillies 3, Angels 2, Pirates 2, Rockies 2, and 1
  each at the Cubs, Nationals, Orioles, Reds, Royals, Tigers, Twins and
  White Sox.

**Checks:**
- *Rakes:* every measured section is on the rule's rake but Pirates 139,
  set on purpose (2,371 of 2,372).
- *Fronts:* 2,323 on their own, 49 set on purpose (Braves 211 and
  Cardinals 136D join; Phillies 318 leaves). No underside is under 9 ft.
- *Backs:* 2,361 on their own, 11 set on purpose; the tier backs kept
  above are the only new tier exceptions.
- *Tests:* the full suite passes, 3,566 of 3,566. The first full run lost
  one suite to a worker crash while a snapshot ran alongside; the re-run
  passed whole. The type check and eslint are clean.
- *Dev server:* both posts show their new lines, and the Yankees and Red
  Sox pages load, with no console or server errors.
- **Not run:** the production build and Playwright (CI runs them).

**Noticed, not changed:**
- *Strongly bent sections:* in 28 of the plan's 95, one face is more than
  20° off the median. The engine takes one direction per section;
  splitting a section into its faces is an engine change.
- *Cover report:* it compares the scan's row with the profile's, which is
  sometimes itself a scan row. Comparing with the source's would catch
  slips like the three above automatically.
- *Middle cuts that start high:* the aisle flag could also catch a cut
  whose front is more than 2 ft above the cuts beside it, but most such
  sections are set on purpose already, so it would need checking park by
  park.
- *Comerica 343:* the map gives 17°, but the tread plane reads 21–27°,
  the fall line 30° and the risers 39–40°. Its middle isn't firmly off,
  so it stays.
- *Not done:* the eight parks without lidar, and fitting the seat map's
  own directions at bends.

## §19 Strongly bent sections (plan, 2026-11-17)

Asked: plan the strongly bent sections. Branch `fix/bent-faces`, from
`main` after PR #92.

**The problem.**
- The engine gives each section one stand direction (`standCompass`).
  `computeGameShade()` runs the row engine once in that direction. A
  section's shaded share is the share of its rows in shade, and its
  status comes from that share.
- Where a section's rows bend across its width, no one direction is
  right for all of its seats. §18 faced such a section the way most of
  it climbs, or left the map's direction where its fall lines lie
  either side. The seats on the other face are then answered for a
  direction they don't face.

**Which sections.** Each measured section has a fall line read in its
middle and 4 m to either side, each with a range of equally good
directions (`lo`..`hi`). A section is strongly bent where two of these
ranges are more than 20° apart:
- 114 sections meet that on the three readings.
- In 41 of them a side reading lies outside the section: the point 4 m
  across is nearer another section's centre than its own (sections run
  about 6–8 m apart in those rings). There the bend may be the
  neighbour's face, not this section's.
- **73 sections at 18 parks are bent within their own width**:
  - Braves 11, Cardinals 8, Phillies 8;
  - Reds 6, Twins 6;
  - Dodgers 5, Mets 5, White Sox 5;
  - Pirates 4, Rockies 4;
  - Padres, Red Sox and Tigers 2 each;
  - Angels, Cubs, Orioles, Royals and Yankees 1 each.

  11 of them turned in §18 (for example Cardinals 271: −7°, +2°, +64°),
  and the rest kept the map's direction (for example Phillies 322: −1°,
  −6°, +40°).

**What it changes.** Shade worked out for each face of these 73 (each
third of the section facing its own fall line; a third with no reading
of its own takes the middle's) and averaged over the thirds, at the five
2025 test games, against the one direction now
(`scratchpad/faceWhatIf.ts`):
- answers change for 45 sections (158 of 2,555 half-hour steps);
- 121 steps become partly shaded (one face in shade, another in sun),
  and 37 move from partly shaded to sun or shade;
- no step flips between sun and shade.

The largest changes: Phillies 219 and 322 (13 steps each), White Sox 556
(10), Braves 128 (8).

**The rule.** A measured section is split into faces where:
- two of its fall lines are firmly more than 20° apart (their ranges
  don't come within 20°);
- both readings lie within the section (each reading's point is nearer
  this section's centre than any other in its tier);
- its picture, with a row line for each face, shows the rows bend as
  the faces say.

Its faces are its thirds, left to right, each facing the fall line read
in it, and a third with no reading of its own takes the middle's. The
stand profile (rows, heights, cover, back) stays the section's, measured
along its direction, and all faces share it.

**Fix.**
1. *Engine (`src/utils/gameShade.ts`, the section type).* A section may
   carry `standFaces`: three compass directions, equal shares. Its
   shaded share is the mean over the faces of the share of rows in
   shade, and its status comes from that. The confidence test moves
   every face the same way (orientation ± its error, the structure as
   now). A section without faces runs exactly as now. Unit tests:
   - three equal faces give the one-direction answer;
   - a shaded face and a sunny face give partly shaded.
2. *Section builder (`parkSectionBuilder.ts`).* A `standFaces` list in a
   park's config (`{ id, facesDeg: [left, middle, right] }`), passed to
   the section, next to `standRuns`.
3. *Tool (`scripts/measureStandHeights.py`).* `suggest()` lists the
   faces by the rule above, and `fallsheet` draws a row line for each
   face.
4. *Pictures:* check every listed section, and drop any whose rows
   don't bend as its faces say.
5. *One commit per park:* the faces in its section file, then the
   reference checks and post claims (investigated, not tuned).
   Reference tests that read rows directly in one direction (for
   example Comerica's upper deck, with 345 in the list) use the
   section's faces.
6. *Checks:* the full suite, the type check, eslint, the snapshot
   against today's, and a review here.

**Not in this plan (noticed):**
- *The 41 bends read partly outside their section.* Reading their fall
  lines at a third of their width either side needs each section's
  width in the tool, and the turn rule uses today's 4 m readings, so it
  is a change of its own.
- *Profiles per face:* backs, covers and fronts measured along each
  face. Each face keeps the section's profile here.
- *Eight sections off the same way on every reading* with no firm
  middle or only one reading (Mets 213, 534 and 537, Orioles 312, Reds
  22, Red Sox AP12, Royals 209, Tigers 328): §18 kept them, most for a
  stated reason.
- *The row-level API* uses a separate, older calculator, which this
  doesn't touch.

### Steps
- [x] 1. Engine and builder: `standFaces`, with unit tests.
- [x] 2. Tool: list faces; draw them; check every picture.
- [x] 3. Parks, one commit each: faces, reference checks, posts.
- [x] 4. Checks; snapshot; review.

### §19 Review (2026-11-17)

**What changed:**
- **Engine (`src/utils/gameShade.ts`, `DetailedSection.standFaces`).**
  - A section may carry faces: compass bearings, equal shares of it.
  - Each face gets its own shade from the row engine, and the section's
    shaded share is their mean.
  - The confidence test turns every face by the orientation's error and
    moves the structure as before.
  - A section without faces runs exactly as before: before any faces
    went in, a snapshot of every park showed 0 answers changed.
  - Unit tests (`gameShadeFaces.test.ts`): three equal faces give the
    one-direction answer; a shaded face and a sunny one give partly
    shaded.
- **Builder (`parkSectionBuilder.ts`).** `standFaces: [{ id, facesDeg }]`
  in a park's chart config, next to `standRuns`. An id that isn't on the
  chart is an error.
- **Tool (`scripts/measureStandHeights.py faces <park>`).** It lists a
  park's bent sections as `standFaces` entries. A section qualifies
  where:
  - two of its fall lines are firmly more than 20° apart;
  - both are read within the section;
  - planes fitted to the treads at both points, in 5 m and 6 m squares,
    each lie within 15° of their face and turn the same way by at least
    15°.

  The bent readings the treads don't confirm are listed with the reason.
  `fallsheet` draws each face where it is read.
- **Faces** on 9 sections at 6 parks, one commit per park:
  - Busch 132 (116/116/145);
  - Petco 220 (235/254/271);
  - Citizens Bank 210 (101/97/147), 219 (154/154/198), 224
    (187/187/218) and 305 (54/53/101);
  - Coors L315 (119/125/142);
  - Target Field 140 (140/163/163);
  - Yankees 321 (269/269/294).

  In the pictures, Petco 220, Target Field 140 and Citizens Bank 305 sit
  where two stands meet at an angle. The rest sit where their rings turn
  or curve. A data test (`standFaces.test.ts`) checks the six parks
  carry exactly these faces, each within 60° of the section's direction.

**Where it went differently from the plan:**
- *Most of the bends weren't real.* The plan counted 73 sections bent
  within their width. The tool counts 72: Phillies 146 drops, because a
  side reading lies nearer an unmeasured neighbour.
  - Checking the pictures by eye wasn't reliable at that scale. So the
    tool checks each bend against planes fitted to the treads at the two
    points.
  - With 5 m squares 16 pass, with 6 m squares 13, and 9 at both. Faces
    go only where both agree, as the turn rule needs a firm reading.
  - In the other 63, the fall line at one point picks up an aisle, a
    walkway or a structure's edge, or the treads turn far less than the
    faces say. Many sit on smoothly curved rings, like the Braves'
    executive sections 124 and 125, where the treads turn 10–17° over
    those 8 m, not the 29–35° the faces say.
- *The riser check* (§17's) couldn't serve here. In 5 m squares its
  directions snap to the scan's grid (0°, 90°, 180°, 270°).
- *Faces come from a separate `faces` command*, not `suggest()`, since
  the tread check needs the scan.
- *The plan's estimate* (45 sections, 158 steps) assumed every bent
  reading was right; with 9 confirmed, far fewer answers change.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 4 sections (22 half-hour steps): Citizens Bank
  219, 224 and 305, and Yankees 321. Busch 132's labels change only.
- Labels: 2 up, 1 down. The Low share stays 26.6%.
- The biggest change: Citizens Bank 219 (on the map's 144° before; its
  faces are 154/154/198) is shaded longer at the 1:10 PM games, until
  about the 9th inning in April (the 4th before).
- Yankees 321 now gets its shade over a half hour or two: partly shaded
  in the 9th at the July game, before full shade.
- No reference check or post claim changes.

**Checks:**
- The full suite passes, 3,583 of 3,583. The type check and eslint are
  clean.
- On the dev server the Citizens Bank Park page loads with no console or
  server errors.
- **Not run:** the production build and Playwright (CI runs them).

**Noticed, not changed:**
- *§18's turns use the same side readings.* The median rule takes the
  fall lines 4 m to either side, and here 63 of 72 bent readings failed
  the tread check. §18's turns also had to hold when re-measured and
  pass a picture check, but checking them against the tread planes at
  their three points would show whether any rest on a misread side.
- *Bends confirmed at one size only:* Braves 229, Cardinals 249, Mets
  412 and 512, Orioles 8, and Citizens Bank 140 and 322 at 5 m; Angels
  350, Coors 309 and L331, and White Sox 556 at 6 m. They keep one
  direction.
- *The 41 bends read partly outside their section*, and per-face
  profiles, as in the plan.

## §20 §18's turns against the treads (plan, 2026-11-17)

Asked: plan checking the §18 turns against the treads. Branch
`fix/turn-treads`, from `main` after PR #93.

**The problem.**
- §18 turned 79 sections to the median of the fall lines read in their
  middle and 4 m to either side.
- §19 found that fall lines read off to the side often pick up an aisle,
  a walkway or a structure's edge: 63 of 72 bent readings failed a check
  on the treads.
- §18's turns were checked for stability (re-measured fall lines) and on
  pictures, but not against the treads. §17's were checked against a
  tread plane.

**What the treads say.** For each turn, planes fitted to the treads
(the tool's `tread_plane`):
- 8 m and 12 m squares at the middle (§17's sizes);
- 5 m squares at each of the three points where the fall lines were
  read;
- leaving out any reading more than 60° from both the map's and the
  turned direction (a patch on a structure).

The median of those readings, against the turn (78 turns; Fenway B6
isn't measured):
- **59 confirmed:** within 10° of the turn.
- **7 where the readings agree within 12° and lie 11–14° from the
  turn:**
  - Twins 202: map 205°, turn 187°, treads 201°;
  - Royals 128: 216°, 238°, 226°;
  - Busch 163D: 287°, 307°, 319°;
  - Fenway F71 and FBC71: 279°, 299°, 310°;
  - Mets 16: 221°, 189°, 200°;
  - Mets 411: 192°, 157°, 169°.
- **12 whose readings spread 20–64°**, with no firm direction of their
  own. These are curves and bends, or a patch catching a structure.
  - 7 turn further the same way: Angels 243, Busch 136D, 137D and 271,
    Camden 8, PNC 30 and 32.
  - 2 lie between the map and the turn: Busch 231 and Fenway B155.
  - 2 lean back toward the map: Busch 229 and PNC 135.
  - Dodgers 316PR has only two clean readings.

  None of these gives a firm direction to face instead, and reverting
  to the map would put most of them further from their treads.

**The rule.** A §18 turn stands unless its tread readings (as above)
agree within 15° and their median is more than 10° from the turn (the
fall-line fit resolves about 10°). Then the section faces the treads'
median. That applies to the 7 above.

**What it changes.** Facing the treads' direction alone changes answers
for all 7 at the five 2025 test games (24 half-hour steps;
`scratchpad/treadWhatIf.ts`). Re-measuring along the new directions then
moves their own rakes, fronts, backs and covered rows, and the tier
medians, as in §18.

**Fix.**
1. *Tool (`scripts/measureStandHeights.py`).*
   - `tread_direction()`: the five readings, their median and spread.
   - A `treads <park>` command lists the sections whose treads firmly
     disagree with their direction, as `standRuns` entries.
2. *Directions:* in each section file, the 7 move from their §18 entry to
   the treads' median.
   - Re-measure the five parks along the new directions.
   - Check that the treads still agree there (within 10°), and check each
     picture.
3. *One commit per park* (Busch, Citi, Fenway, Kauffman, Target Field):
   - the maps through the §18 guard;
   - covered rows against the true source (the §18 lesson);
   - the §8 undersides;
   - reference checks and post claims (investigated, not tuned).
4. *Checks:* audits, the full suite, the type check, eslint, the
   snapshot, and a review here.

**Not in this plan (noticed):**
- *The same check on every other measured section*
  (`scratchpad/allTreads.py`). This is the larger finding.
  - Of 2,156 measured sections, 1,623 have tread readings that agree
    within 15°.
  - 340 of those beyond §18's 7 have a median more than 10° off their
    direction: 338 on the map's direction, and 2 of §17's turns (Comerica
    215 and 116, at 10°).
  - 125 are more than 15° off, all on the map's direction. They never
    turned because their fall line isn't firm in the middle. Most are at
    the Yankees (25), Red Sox (21), Mets (14) and Royals (12), for
    example Busch 164 at +34°.
  - Some rings sit about 10° off as a whole (the Angels' club and 400
    level), which is either the map's fit for that ring or a bias to rule
    out first.
  - It's an audit of where most sections' directions come from, to be
    checked against the photo runs in the stand-direction test before
    any change: a plan of its own.
- *The 12 turns with scattered treads* keep their §18 direction. Some
  may be bent sections that §19's faces rule didn't confirm.

### Steps
- [x] 1. Tool: `tread_direction()` and the `treads` listing.
- [x] 2. Directions; re-measure; tread and picture checks.
- [x] 3. Parks, one commit each: maps, covers, checks.
- [x] 4. Audits; full checks; snapshot; review.

### §20 Review (2026-11-17)

**What changed:**
- **Tool (`scripts/measureStandHeights.py`).**
  - `tread_direction()` reads a section's climb on its treads: planes in
    8 m and 12 m squares at the middle, and 5 m squares at each
    fall-line point. It leaves out any reading more than 60° off the
    section's direction and returns the median, the spread and the
    count.
  - `treads <park>` lists the sections whose readings agree within 15°
    and lie more than 10° off their direction, as `standRuns` entries.
- **Directions.** The 7 move from their §18 entries to a block of their
  own at the top of each park's list:
  - Busch 163D: 307° → 319°;
  - Citi 16: 189° → 200°, and 411: 157° → 169°;
  - Fenway F71 and FBC71: 299° → 310°;
  - Kauffman 128: 238° → 226°;
  - Target Field 202: 187° → 201°.

  Re-measured along them, every one's treads agree within 4°, and no
  middle is firmly off its fall line.
- **Maps** follow, through the §18 guard, one commit per park:
  - 163D's back (116 ft, 96 ft back) and its tier's rake;
  - 16's and 411's backs;
  - F71 and FBC71: their tier's rake, front row 2 ft below the field,
    pavilion roof 53 ft back;
  - 128's back (150 ft, 70 ft back, as before §18);
  - 202's back (3 ft behind).

  The covered rows don't move.
- **Knock-ons:**
  - *Busch 162* now reads its back from the open rows its sourced
    covered row (19, since §18) leaves: 75 ft, 4 ft behind its last row.
    This is the same effect §17 and §18 accepted.
  - *Fenway's Field Box back median* is 47 ft again (§18 took it to 45;
    F71 now reads 53). The 12 entries §18 added at 47 go, and F49 and
    H49 keep 45 as their own. Of the three unmeasured field boxes, F67
    and F82 each change at one test game.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 7 sections (20 half-hour steps): Citi 16, Fenway
  F71, FBC71, F67 and F82, Kauffman 128, and Target Field 202. Citi 411
  changes one label only.
- Labels: 3 up, 3 down. The Low share stays 26.6%.
- Target Field 202 is shaded all game at the July 4:10 PM game (High),
  where it was in the sun from about the 7th.
- Kauffman 128's shade comes earlier at the 1:10 PM games, for example
  in September partly from about the 4th inning and shaded from the
  6th.
- No reference check or post claim changes.

**Checks:**
- *Audits:* rakes, fronts and backs are exactly as before §20 (2,371 on
  the rule's rake but Pirates 139; 2,323 own fronts and 49 set on
  purpose; 2,361 own backs and 11 set on purpose). No underside is
  under 9 ft.
- *Tests:* the full suite passes, 3,583 of 3,583. In the first full run
  one suite didn't start (a worker crash: its 6 tests were missing, and
  it passes alone); the re-run passed whole. The type check and eslint
  are clean.
- **Not run:** the production build and Playwright (CI runs them). No
  post changed, so no dev-server check.

**Noticed, not changed:**
- *The 125 sections on the map's direction that read more than 15° off
  on their treads*, and 213 more at 10–15° (above). This is the next
  audit; check it against the stand-direction test's photo runs first.

## §21 Tread audit of all sections (plan, 2026-11-17)

Asked: plan the tread audit of all sections. Branches `fix/tread-audit-a`
and then `fix/tread-audit-b`, from `main` after PR #94.

**The problem.**
- Most sections face the direction fitted on the club's seat map: square
  to a line through each section and its four nearest ring-mates.
- §17 turned a section only where its middle fall line was *firmly* more
  than 15° off: every equally good reading had to be. The fall-line fit
  resolves only about 10°, so that rule leaves a section on the map's
  direction when it is 10–15° off, or more than 15° off but not firmly.
- §20 added a second measurement: planes fitted to the treads.

**Is the tread reading trustworthy?** Checked against the stand-direction
test's photo runs (57 runs, 276 sections; front edges measured on aerial
photos):
- *On the 114 photo-run sections with firm treads* (five readings within
  15° of each other), the treads agree with the photo to a median of 4°.
  92 are within 10°, and the signed mean is +1°, so there's no overall
  bias.
- *Where they disagree by more than 10° (22 sections)*, the fall line
  read in the middle sides with the treads in 19 and with the photo in
  none. There the photo's edge isn't square to the rows: Camden 14, 18
  and 312 read 154–156° on both lidar methods, against the photo's 166°.
  This is the pattern §17 found for six photo runs.
- *Rings aren't off as a whole.* Within a ring, sections are off both
  ways (Fenway's field boxes 13 one way and 27 the other), so it's the
  map's fit section by section, mostly at bends, not a rotation to fix
  ring by ring.

**The rule.** A section faces the mean of its two lidar readings where:
- its tread readings agree within 15°;
- the fall line read in its middle is within 8° of the treads' median;
- both are more than 10° off its direction.

That gives 300 sections at 20 parks, all on the map's direction:
- Fenway 55, Kauffman 30, Yankees 29, Great American 27, Camden 24,
  Dodgers 24, White Sox 15, Angels 15, Busch 14, Coors 12, Nationals
  10;
- Citi and Target Field 9 each, Petco 6, Oracle and Citizens Bank 5
  each, PNC 4, Comerica 3, Athletics and Truist 2 each.
- 19 of them are on photo runs.
- 40 more have firm treads more than 10° off but a fall line that
  doesn't agree; they stay.

**What it changes** (direction alone, at the five 2025 test games;
`scratchpad/treadWhatIf.ts`):
- **A: the 80 more than 15° off.** Answers change for 66 (338
  half-hour steps).
- **B: the 220 at 10–15° off.** Answers change for 196 (729 steps).

Re-measuring along the new directions then moves their own rakes,
fronts, backs and covered rows, and the tier medians, as in §17 and §18.

**Fix**, in two phases (A, then B), each its own PR:
1. *Tool.* `treads` adds the fall line's agreement and lists the
   qualifying sections as `standRuns` entries facing the mean of the two
   readings.
2. *Directions,* in a block of their own at the top of each park's
   `standRuns`.
   - Re-measure each park along them.
   - Check both methods then agree within 10° of the new direction, and
     drop any turn that doesn't hold.
   - Photo-run sections move to scan assertions in the stand-direction
     test, each with the reason, as §17 did.
3. *One commit per park:*
   - the maps through the §18 guard;
   - covered rows against the true source (the §18 lesson);
   - the §8 undersides;
   - reference checks and post claims (investigated, not tuned).
4. *Checks:* audits, the full suite, the type check, eslint, the
   snapshot, the dev server for any post that changes, and a review here.

**Not in this plan (noticed):**
- *The 40 with firm treads but a disagreeing fall line*, and sections
  whose treads scatter: one direction can't be read for them.
- *The eight parks without lidar,* whose directions still come from
  the map alone.

### Steps
- [x] A1. Tool: the two-method listing.
- [x] A2. Directions for the 80; re-measure; stability; photo runs.
- [x] A3. Parks, one commit each: maps, covers, checks.
- [x] A4. Checks; snapshot; review. (PR: when asked.)
- [x] B. The 220 at 10–15°, the same way, as a second PR
  (`fix/tread-audit-b`, from `main` after PR #95):
  - [x] B1. Baseline from `main`: re-measure the 22 lidar parks, audits,
        snapshot; the listing's turns not in phase A (`tmp/lidar/s21b`).
        Found: the listing never checked the fall line's own offset, so
        "220" counted 157 sections whose fall line is within 10°. With the
        rule as written (both more than 10° off), phase B is 65 sections
        at 16 parks. Also found: Great American 136 kept a back read
        before phase A moved its covered row (fixed first).
  - [x] B2. Directions; re-measure; drop any turn that doesn't hold; photo
        runs.
  - [x] B3. Parks, one commit each: maps, covers, checks.
  - [x] B4. Checks; snapshot; review. (PR: when asked.)

### §21 Review, phase A (2026-11-18)

**What changed:**
- **Tool (`scripts/measureStandHeights.py treads`).** It lists the
  sections where the treads (five readings within 15°) and the fall line
  in the middle (within 8° of them) agree, both more than 10° off, as
  `standRuns` entries facing their mean. Sections whose treads are firm
  but whose fall line disagrees are named and kept.
- **Directions.** The tool lists 304 sections at 10° and over (the plan
  counted 300 from rounded values); 82 are more than 15° off. Three of
  those didn't hold when re-measured along the new direction, and keep
  the map's:
  - Dodgers 10DG (its fall line then 40° off, as in §18);
  - Mets 212 (18° off);
  - Yankees 106 (its rows not found along it).

  So **79 sections at 14 parks** turn, in a block of their own at the
  top of each park's `standRuns`: Yankees 18, Fenway 17, Kauffman 8,
  Dodgers 7, Great American 7, Busch, Coors and Rate Field 4 each,
  Citizens Bank 3, Oracle and Citi 2 each, and Comerica, PNC and Target
  Field 1 each. Re-measured along them, every one's treads and fall line
  lie within 10°.
- **Maps,** through the §18 guard, one commit per park: rakes, fronts and
  backs re-measured. The guard now also drops an own rake equal to its
  tier's, and own values the medians made redundant go (the Yankees'
  field-level fronts of 6 ft, for example).
- **Tier medians that move:**
  - Target Field club rake 21° → 22°;
  - Yankees field front 7 → 6 ft;
  - backs: Yankees field 134 ft 46 back → 139 ft 43 back, Terrace 137 →
    139 ft; Coors left stands 42 ft 43 back → 47 ft 34 back; PNC left
    corner 66 ft 57 back → 65 ft 66 back; Rate Field right field 35 ft
    25 back → 37 ft 42 back; Great American first base 33 → 29 ft back,
    third base 40 → 33, View level −30 → −31; Comerica third base −9 →
    −11; Kauffman plaza corner −38 → −39.

  Kept with their reasons: Rate Field left field (the bleachers' back,
  as 160 measures it), Citizens Bank's three-section field tier (shared
  profile), Fenway's right-field boxes.
- **Covered rows against the true source:**
  - Dodgers 15FD 22 → 19 (the source's T);
  - Citizens Bank 133 31 → 28 (the 100 level's) and 113 34 → 33;
  - Great American 112 33 → 31, 136 20 → 24, 137 30 → 29;
  - Fenway B111 6 → 8, under the lower structure behind home, as B105
    and B150;
  - Yankees 216 11 → 8 (the tier's).
- **Tests and posts:**
  - Stand-direction test: six sections move from photo runs to their
    lidar direction, each with the reason: Oracle 101, Citizens Bank
    133, Coors 155, Great American 112, Kauffman 112 and 142.
  - Kauffman reference: Rate Your Seats' "every 100-level section in the
    sun until 3:00" holds for the sections. Along 142's rows the upper
    deck's front, 7 ft behind its last row, shades its last two of 23
    rows from 1:10 to 2:10 PM; the check now names it and keeps the rest
    of the 100 level unshaded.
  - Yankees post:
    - 309 is in the sun at Low confidence;
    - the terrace sections shaded before the 6th are 312, 313 and 314
      (Low for 314);
    - on July 10 more than nine in ten of the 100s and 200s are shaded
      by the 2nd inning.

**Where it went differently from the plan:**
- *The session broke overnight* and the scratchpad was cleared, losing
  the pre-turn baselines. They were rebuilt by re-measuring the 14 parks
  with the turns set aside (the tool is deterministic). The rebuilt
  audits matched §20's exactly. This work's state now lives in
  `tmp/lidar/s21`, which isn't cleared.
- *Kauffman 142's reference exception* wasn't foreseen.
- *Fenway B111* didn't take the tier's row, as a plain row check would
  have given: the structure over it is the lower one behind home (35–36
  ft), not the Grandstand roof the tier describes.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 71 sections (309 half-hour steps): Yankees 23,
  Fenway 15, Dodgers 7, Great American 7, Kauffman 6, Busch 4, and 1–2
  at the rest.
- Labels: 43 up, 51 down. The Low share is 26.7% (26.6%).

**Checks:**
- *Audits:* exactly as before (2,371 on the rule's rake but Pirates
  139; 2,323 own fronts and 49 set on purpose; 2,361 own backs and 11
  set on purpose; no underside under 9 ft). The three kept tier backs'
  medians moved slightly.
- *Tests:* the full suite passes, 3,586 of 3,586. The type check and
  eslint are clean.
- *Dev server:* the Yankees post shows its three new lines, and the
  Yankees page loads, with no console or server errors.
- **Not run:** the production build and Playwright (CI runs them).

**Next:** phase B, the 220 sections 10–15° off, the same way.

### §21 Review, phase B (2026-11-18)

**Found first, from a fresh baseline** (all 22 lidar parks re-measured
from `main`; the rake and front audits and the snapshot matched phase
A's final exactly):
- *Great American 136* kept a back read before phase A moved its covered
  row (20 → 24). Re-measured, rows 1–23 see the club's front, 69 ft up,
  28 ft in front of the last row, as 127, 129 and 130 do. Fixed in its
  own commit; the back audit is back to phase A's.
- *The tool's listing* never checked the fall line's own offset, though
  the rule needs both readings more than 10° off. The plan's "220"
  counted 157 sections whose fall line is 10° or less off. Fixed; phase B
  is the 65 that meet the rule as written (phase A, all more than 15°
  off, was not affected).
- *The lidar-turn blocks* said "off the direction fitted on the map";
  some were photo runs. Reworded in all 19 files.

**What changed:**
- **Directions.** Of the 65, six did not hold when re-measured (Busch
  141, Camden 312, Great American 435, Fenway PR16, Kauffman 212, Target
  Field 226) and keep theirs. **59 sections at 16 parks** turn 11–15°:
  Kauffman 9, Camden and Fenway 6, Angels and Dodgers 5, Nationals and
  Coors 4, Petco, Rate Field and Yankees 3, Busch, Citi, PNC, Great
  American and Target Field 2, Truist 1.
- **Maps,** through the §18 guard, one commit per park. White Sox 117's
  own rake sat in a shared constant (`RATE_LOWER_RAKE`) the editor can't
  reach; dropped by hand.
- **Tier medians that move:** Truist porch front 7 → 6 ft; Dodgers Lower
  Reserve rake 30 → 31°, Top Deck back 27 → 29 ft in front; Citi
  Promenade back 18 → 19 in front; Camden right corner rake 13 → 14°,
  front 2 → 1 ft, club ends rake 22 → 23°, back 3 → 4 in front; Petco
  left box front 3 → 4 ft, rake 10 → 11°, back 12 → 14 in front; PNC
  upper back 120 → 121 ft; Coors left stands back 47 → 38 ft (only 151,
  unmeasured, uses it); Target porch back 97@1 → 96@-1; Rate right field
  37@42 → 39@44; Yankees Terrace back 11 → 12 ft behind.
- **Kept, with the reason written:**
  - Nationals outfield back 46 ft (the median, 64, mixes the structure
    over 103's and 104's back rows with what rises behind 101, 102 and
    105, where 105's cut now crosses a light tower);
  - Kauffman upper back 156@12 (the median, 2 ft back, is the full
    sections'; 12 of the 15 unmeasured sections it serves are 5–15 rows,
    and taking it would shade 438 98% of a July 1:10 PM game);
  - Nationals Gallery rake 31° (§17's choice at a 31.5° median, now
    31.54°; I first moved it to 32 because the audit's count changed
    from n19 to n20, then put it back).
- **Covers and undersides:** PNC 322 takes the scan's row 9 (re-measured
  after: its back holds); Dodgers 51FD's underside 22 ft (§8, its front
  row rose 2 ft).
- **Tests and posts:**
  - Stand-direction test: Truist 148, Nationals 305 and Petco 130/134
    assert their lidar directions with the reason; the photo checks move
    to 149, 307 and 128.
  - Kauffman reference header: the note on the upper deck's edges said
    22% shaded; it was already 45% before phase B, now 41%, with the
    roof covering five sections' back rows and not behind 436 and 437.
  - Yankees post: only 313 and 314 are shaded before the 6th on July 12
    (Low confidence); 312 is now partly shaded from the 4th.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 66 sections (281 half-hour steps); labels: 41 up,
  45 down. The Low share stays 26.7%.
- *The snapshot script was wrong:* it stored each step by its status's
  first letter, so "sun" and "shaded" were both `s` and a change between
  them was not seen. Fixed (o, ~, #); every earlier count from it,
  including phase A's 71 sections and 309 steps, is an undercount.

**Checks:**
- *Audits:* the same as the baseline but the two kept tier backs above
  (2,371 on the rule's rake; 2,323 own fronts, 49 set on purpose; 2,361
  own backs, 11 set on purpose; no underside under 9 ft).
- *Tests:* see the end of this review. The type check and eslint are
  clean.
- *Dev server:* the Yankees post shows its new July 12 line, with no
  console or server errors.
- *Commits:* my first per-park staging patched with no context and put
  some lines in the wrong place (Busch's front rows inside the next
  tier's comment). The 15 park commits were rebuilt by copying each
  park's segment of `stadiumStructures.ts` whole into the index, and the
  index parsed after each.

**Great American's reference check (decided: restated to the source).**
"[RYS] the first-base side gets the sun at its back first" asked for the
first-base 100s to be more than 90% shaded 1 hour into the July 12 4:10
PM game. Along 132's rows
(241°) its first five of 42 rows are still in the sun then, and the mean
falls to 89.8%. It was 90.5% before phase B, and the other ten sections
alone average 89.99%: the shadow is crossing their front rows (0–8 in
the sun) right then, and all are shaded by 5:40 but 136's first four
rows. Rate Your Seats' words are comparative ("seats on the first base
side of the field are the first to get shade"), with "good shade
starting near Row DD in Section 127" down to 137; the 90% is the test's.
The check now asserts both: the first-base 100s are more shaded than the
third-base ones at every half-hour step (90% against 11% an hour in),
and rows from DD (the row before the source's EE) back are shaded all
game in 127–137 (137 from the second step, where the scan's club front
is over its row 29, not the source's 19). Both hold with or without the
turns.

**Noticed, not changed:**
- A tier's back setback is taken from the tier's full-row profile, so an
  unmeasured short section (rows from the map) gets the edge as if its
  last row were the full section's. An engine change across many parks.
- The 157 sections whose treads are firmly 10–15° off but whose fall
  line is within 10°: one method alone, so they stay.

**Final checks:** the full suite passes, 3,599 of 3,599 (11 new: the
restated Great American checks); the type check and eslint are clean.

## §22 Short sections' backs (plan, 2026-11-18)

Asked: plan the short-section setback fix (noticed in §21 phase B).
Branch `fix/short-section-setback`, from `main` after PR #96.

**The problem.**
- The engine puts a section's back `rows × tread + backSetbackFt` from
  its front row (`shadeEngine.ts`). A section with no back of its own
  takes its tier's setback, but its own row count from the club's map
  (`rowsFromMap`).
- Where a tier's sections share a front line and the short ones end
  sooner, the structure doesn't move with the last row, but the model's
  back does:
  - Kauffman's 8-row 438 and 439 get the roof's edge 12 ft behind their
    last row; the measured 11–12-row sections have it 17–25 ft behind.
  - Coors' 25-row L311 and L313 get the roof's edge 30 ft *behind*
    their last row; the tier's measured 25-row sections have it 25 ft
    *in front*.
- Measured sections are not affected: the tool measures each back from
  the section's own last row (through `standFor`, as the engine).
- Not every tier is like this. Sections can also share the back line
  and start rows up (Rate Field's shortened upper sections), and then
  the setback is the shared quantity, which is what the engine does now.

**Which tiers: the measured sections say.** For each tier, take its
measured sections whose back is the tier's structure (height within 6
ft of the tier's). Compare the spread (IQR) of their setbacks with the
spread of the back's distance from their front row (`tmp/lidar/s22`):
- **12 tiers are firmly front-aligned.** Each has 4+ sections across 2+
  row counts, and the distance from the front row has an IQR within 5 ft
  that is 5+ ft tighter than the setbacks':
  - Angels field;
  - Athletics behind home;
  - Busch 100s, loge, club level and Pavilion;
  - Camden upper deck;
  - Citizens Bank 200s and behind home;
  - Coors club and upper level;
  - Kauffman upper deck.
- 20 tiers show the opposite (back-aligned), and the rest can't tell
  (too few sections, or one row count).

**The rule.** In a front-aligned tier, a section with no back of its
own keeps the tier's structure where it is, at the same distance from
its front row:
`setback = tier's setback + (tier's rows − its rows) × tread`.
The tier's setback becomes the median, over its measured sections, of
that distance less the tier's rows.

**Scope.** 383 sections take their tier's setback with a different row
count:
- **Changed by this fix:** 52 sections the scan doesn't measure, in 10 of
  the 12 tiers; 49 of their backs move (three already sit where the rule
  puts them). Athletics behind home and Busch's Pavilion have none to
  change, so they aren't flagged.
- **Kept at their measured values:** the measured sections in those tiers
  that take the tier's value today (27). The flag shifts them by the
  same rule. Where that no longer gives their measured back, the audit
  lists them and they take it as their own entry.
- **Unchanged:**
  - 217 more unmeasured sections at lidar parks, in back-aligned tiers or
    tiers without firm evidence;
  - 114 sections at the eight parks without lidar.

**What it changes** (what-if, `tmp/lidar/s22/whatif.ts`): at the five
2025 test games, 26 sections at 5 parks change their answers (62
section-games, 109 half-hour steps, 30 confidence labels). Examples:
- Kauffman's 418–426 and 438–439 get the edge 14–41 ft behind (12);
- Busch's 169–172, 15 or 12 rows, get the roof 57–66 ft behind (34);
- Coors L311 and L313 get the roof's edge 25 ft in front (30 behind);
- Angels' 101, 134 and 135 (27–28 rows) get the roof 29–32 ft behind,
  and the 21-row 120 48 ft behind (41).

**Fix** (one PR):
1. *Engine.* An optional tier flag, `backFromFront` (on `TierStructure`).
   `standFor` shifts the setback by the row difference for a section
   with no setback of its own (one line). A unit test covers it.
2. *Tool.* `scripts/lidar/standSections.ts` exports the flag. For
   flagged tiers, `measureStandHeights.py` takes the tier's setback
   median as the distance from the front row, converted to the tier's
   rows, so the back audit compares like with like.
3. *Data, one commit per park:*
   - flag the 10 tiers and re-take their setback medians;
   - give the measured sections that relied on the tier's value their
     own back, through the §18 guard;
   - say it in the tier comments.
4. *Checks:*
   - the audits, the reference checks and post claims (investigated,
     not tuned);
   - the full suite, the type check and eslint;
   - the snapshot, and a review here.

**Not in this plan:** the eight parks without lidar, tiers without firm
evidence, and the back-aligned tiers, which already behave correctly.

### Steps
- [x] C1. Engine flag and `standFor` line, with a unit test.
- [x] C2. Tool: export the flag; flagged tiers' setback median from the
      front.
- [x] C3. Data, one commit per park (Angels, Busch, Camden, Citizens
      Bank, Coors, Kauffman): flag, medians, own backs, comments.
- [x] C4. Checks; snapshot; review. (PR: when asked.)

### §22 Review (2026-11-18)

**What changed:**
- **Engine.** `TierStructure.backFromFront`. In a flagged tier, a
  section with no setback of its own keeps the tier's back at the same
  distance from its front row: `standFor` adds (the tier's rows − its
  rows) × tread to the tier's setback, which is for the tier's
  `stand.rows`. Unit tests cover shorter and longer sections, the
  tier's own row count, a section's own back and unflagged tiers.
- **Tool.** `standSections.ts` exports the flag. For flagged tiers,
  `measureStandHeights.py` takes the setback median from each back's
  distance to its front row, less the tier's rows. Re-measuring the six
  parks changed no section's values, only the flagged tiers' medians.
- **Data: 9 tiers flagged at 6 parks, each taking its median from the
  front row** (for its rows):
  - Angels field: 35 ft behind (41);
  - Busch: 100s 26 ft behind (34), loge 15 ft in front (17), club level
    31 ft in front (26);
  - Camden upper: 32 ft in front (24);
  - Citizens Bank 200s: 22 ft in front (14);
  - Coors: upper level 19 ft behind (30); club level unchanged (23 in
    front);
  - Kauffman upper: 157 ft, 5 ft in front (156 ft, 12 behind).

  The unmeasured sections of other lengths then get backs that match
  their measured neighbours of the same length. Measured sections that
  relied on the tier's value mostly land on their own; six that don't
  keep it as their own entry: Busch 229 and 232, Citizens Bank 206–209.
- **Two kept exceptions resolved:** the Busch 100s' 34 ft and the
  Kauffman upper deck's 12 ft. Both had been kept because the setback's
  median mixed section lengths, which is exactly what this fixes.
- **Reference checks and notes:**
  - *Busch:* the March check on 152–158 now finds 156 half shaded at
    first pitch. It is not measured and takes the roof 26 ft behind its
    last row, as 152 (also 26 rows) measures. It is recorded with 152 and
    153, under the same reason (the sun under the line of the roof over
    the 400s), not tuned. The note's numbers were stale and are
    corrected.
  - *Kauffman:* the upper deck's edges are 34% shaded over the July 1:10
    PM game (41%); 438 is in the sun all game, as Rate Your Seats has the
    edges.

**Where it went differently from the plan:**
- *Citizens Bank's field level behind home isn't flagged.* Its comment
  says 122 and 125 start at row 24: the short sections share the back
  line. The from-front test passed on five scattered values (−28 to +17
  ft). It keeps its value; 128 is unchanged.
- *Two sections whose tier's structure was never theirs* take their
  measured twin's values instead of being shifted:
  - Citizens Bank 211 is open, as 210: the 300 level's front 2 ft behind
    its last row, not over its rows.
  - Busch 270 is in the loge's 265–272: covered from row 12 and the roof
    over the 400s 3 ft behind, as 268.
- *Sections with the tier's own row count also move,* where they take
  the tier's value, because the old median mixed lengths: Busch 144,
  Camden 308 and 380–388, Coors' 9-row L312, L317, L325 and L336, and
  Busch's 10-row loge sections. The new values match their measured
  neighbours (Coors' 9-row L329 and L332 measure the new 19 ft).
- *The back audit (`tmp/lidar/ownBackCheck.ts`) now rounds the model's
  setback*, since the shifted ones are fractional (rows × 2.75 ft). On
  `main`'s data this changes nothing.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 36 sections (186 half-hour steps): Kauffman 14,
  Busch 12, Camden 6, Coors 6, Angels 2, Citizens Bank 1.
- Labels: 19 up, 34 down. The Low share stays 26.7%.

**Checks:**
- *Audits:* identical to the baseline but for the two resolved kept
  lines (2,371 on the rule's rake; 2,323 own fronts, 49 set on purpose;
  2,361 own backs, 11 set on purpose; no underside under 9 ft).
- *Tests:* 3,602 of 3,602 (3 new). The type check and eslint are
  clean.

**Not changed:** the 114 sections at the eight parks without lidar, and
the tiers with no firm evidence either way. A tier whose measured
sections later show alignment can take the flag the same way.

## §23 The parks without lidar (plan, 2026-11-18)

Asked: plan the parks without lidar. Branches `fix/lidar-retractable-a`
and then `fix/lidar-retractable-b`, from `main` after PR #97.

**The eight parks** (`tmp/lidar/s23`):

| Park | Profile today | Lidar |
|---|---|---|
| Mariners (T-Mobile Park) | estimated heights | King County 2021, on AWS: roof **open** |
| Diamondbacks (Chase Field) | estimated | Maricopa–Pinal 2020, on AWS: roof **closed** (corrected below) |
| Brewers (American Family Field) | estimated | SEWRPC (flown April 2015), on AWS: roof open, its panels over the club and terrace |
| Astros (Daikin Park) | estimated | Houston 2024, rockyweb tiles (~300 MB) |
| Marlins (loanDepot park) | estimated | Miami-Dade 2023, one rockyweb tile (183 MB) |
| Rangers (Globe Life Field) | generic shape | none: Dallas–Pecos 2018–19 predates its 2020 opening; Texas's 2022 collection doesn't reach Arlington |
| Blue Jays (Rogers Centre) | generic shape | not USGS: Ontario's GTA 2023 predates the 2024 rebuild of the 100 level |
| Rays (Tropicana Field) | generic, fixed roof | nothing to measure: every seat is roofed |

"Roof open": the points within 25 m of the infield sit at the height of
the ground outside the stadium, not 40–70 m above it (`roof.py`; see the
correction in D1). The §7 plan named these five scans and left batch 5
(7.5) undone.

**Why it matters.** The five open-roof parks are profiled with estimated
heights, which the confidence check moves ±50% (measured: ±10%). Their
Low share at the three §12 day games is 24–67%:
- Mariners 67%, partly because the view-level canopy's covered rows are
  unsourced, so it is tried both ways;
- Diamondbacks 51%, Astros 47%, Marlins 28%, Brewers 24%.

Across the 22 lidar parks it is 24%. These 651 sections also carry five
posts and five reference test files (97 checks).

**What's particular to a retractable roof:**
- The engine keeps modelling the roof open, as today.
- The parked roof stacks over some stands. From above the scan sees its
  panels, not the seats under them, so those sections aren't found and
  keep their estimates (written down). The panels' edge is what the
  cover report sees over the rows in front: the parked roof's edge,
  which each profile already places from photos. The scan gives its
  height, and its underside where a face is seen (a thin roof's top
  otherwise, as at Citi and Dodger Stadium).
- A stand rebuilt after its scan keeps its estimate, with the reason
  (as Wrigley's 2018 boxes). Each park gets a quick check, the Brewers'
  2017 scan above all.

**Fix**, per park, the same way as the other 22. In the tool:
`PARKS` entries (scan, tier bands from the runs picture, skips), then
fetch, runs, measure, cover, fall sheets. Then through the existing
rules and their checks:
- own front rows, rakes and backs (§14–16);
- fall-line turns (§17–18) and faces where the treads confirm (§19);
- the two-method tread turns (§21);
- covered rows against the true source, and the §8 undersides;
- `backFromFront` where a tier's measured sections show it (§22);
- the far rim and crossing.

Reference checks and post claims are investigated, not tuned.

Two phases, each its own PR:
- **A: Mariners, Diamondbacks, Brewers** (on AWS, roof open).
- **B: Astros and Marlins**: download the tiles in the background
  during A, check the roof first, and measure only if it is open (else
  say so and keep the estimates).

**Not in this plan (noticed):**
- *Globe Life Field:* no scan of the open ballpark exists. It keeps the
  generic shape.
- *Rogers Centre:* Ontario's GTA 2023 lidar might show the 200 and 500
  levels, which weren't rebuilt, if its roof was open. But the park has
  no profile or pinned seat map yet (no open-roof photo since 2012).
  That is a project of its own.
- *Tropicana Field:* a dome. (The Rays' 2025 home was Steinbrenner
  Field; the site shows their 2026 home, as decided in July.)

### Steps
- [x] D1. A: tool entries and fetch for the three parks; runs pictures,
      bands. B's downloads: rockyweb answers HTTP 429 (rate limit); retry
      before B.
      **Correction:** my roof check compared the infield points with their
      own lowest, and a closed roof is as flat as a field. Against the
      ground outside the stadium: Mariners −0.7 m (open), Brewers −1.9 m
      (open), Diamondbacks **+62 m: closed**. Chase Field's stands are
      hidden in this scan, the only one, so the Diamondbacks keep their
      estimates.
      **Brewers:** the scan (2015, ~1M points) sees 12 of 26 field-level
      sections, 10 of 36 loge, no bleachers; the open roof's panels stand
      over the club and terrace levels. Over the field level its "edge" is
      a panel 258 ft up, not the loge deck (~20 ft) that covers those rows,
      hidden under it, so covers can't be measured. Asked whether to do
      the Brewers partly (fronts, rakes, backs of 22 sections) or not:
      **left estimated** (the user's call).
- [x] D2. A: measure, apply, checks, one commit per park. Only the
      Mariners: Low share at the three day games 67% → 4%.
- [x] D3. A: audits, suite, snapshot, review. (PR: when asked.)
- [x] D4. B: roof check; then as D1–D3 for the Astros and Marlins.
      **Roof check (2026-11-19):** both planned scans were flown in
      February 2024 with the roof closed (infield +67 m and +78 m above
      the ground outside, all roof). The other scans listed or on AWS:
      - *Marlins:* none. Miami-Dade 2007 predates the park, and Florida
        Southeast 2018 has no points over it. **They keep their estimates.**
      - *Astros:* Texas coast 2018 (`TX_Coastal_B1_2018`, AWS), flown
        9–21 March 2018 with the roof open on all three days (infield
        99–100% ground). All 143 mapped sections cross seating runs.
        **Measure from it** (the user's call, 2026-11-19). Stands rebuilt
        since keep their estimates, with the reason: the 2019–21
        right-field work (seats removed for the Ultra Club in the upper
        deck, a standing staircase down to the 250s). No source numbers
        the sections, so find them in the scan against today's map.
        **Correction:** neither scan shows today's corner (the parked
        panels over it in 2018, the closed roof in 2024), so the map and
        the sources decide: 250, at the Ultra Club Patio's bearing, its
        rows now from 11. See the review.

### §23 Phase A review (2026-11-18)

**What changed:** one park, T-Mobile Park (Mariners), in one commit on
`fix/lidar-retractable-a`. The profile takes the King County 2021 lidar
(flown with the roof open) in place of its estimates, through the same
tool and rules as the other 22 parks:
- **Directions:** 9 two-method turns, 8 fall-line turns (16–31° off the
  map's), and 328 in three faces. 346's turn was dropped because its
  fall line can't be read along it. Re-measured along them, all hold.
- **Heights, with the estimates in brackets:**
  - main level: front 0 ft (3), 12° (20); right field 6–7 ft;
  - club level: front 36 ft (38), 20° (25);
  - view level: front 68 ft (75), 29° (30);
  - bleachers: front 35 ft (10), 32° (20).

  Every measured section takes its own front, rake and back.
- **Covers:**
  - The club deck's front (35 ft) is over main row 30; the source says
    "rows 35 and higher".
  - The view level's front (68 ft) is over club row 1. The source gives
    the best shade from row 10.
  - The view level's canopy is over row 11, 133 ft up underneath. It
    had been unsourced and tried both ways.
  - The parked roof's edge, at its lowest 134–146 ft (estimated 180), is
    over 104, 106, 191–193 and 306–308.
- **Far rim and crossing:** 142 ft and 510 ft (estimated 125 and 500).
- **Two estimates the scan corrected:**
  - Sections labelled from row 9 or 17 had been raised 5–9 ft. They
    measure at the field, so only right field (rows from 23) keeps a
    raised front.
  - The tool read a deck over row 8 of the left-center bleachers. It is
    a narrow, broken band of fixtures 73–79 ft up, so the bleachers stay
    open, as Rate Your Seats has them.

**Where it went differently from the plan:**
- *Chase Field (Diamondbacks):* the only scan has the roof closed. My
  first roof check was wrong; see D1. The Diamondbacks keep their
  estimates.
- *American Family Field (Brewers):* left estimated. The 2015 scan sees
  only 22 of 142 sections, and covers can't be measured under the open
  roof's panels. Its measurement is kept aside
  (`tmp/lidar/s23/brewers-measured.json`) so the audits leave it out;
  the tool has no Brewers entry.
- *Sections that the covers leave too few open rows to find* keep what
  they measured before covers (the Phillies 121 precedent):
  - 103, 104, 106, 191–193, 211, 233–249 and 306–308;
  - on the club level the back is the exception. Seen from row 1, which
    is the rule when every row is covered, it is the view level's front,
    69 ft and 28 ft in front of the last row. The six sections still
    found measure it that way, and the rest take it. Before the cover was
    known it read 75 ft, seen from the middle row.
- *Two data errors were found in review and fixed.* Neither changes an
  answer (snapshot: 0 steps), and both were folded into the Mariners
  commit, which was not pushed yet.
  - **Deck fronts (caught by the full suite's deck check):** 102 and
    104–110, under the parked roof, had inherited the club deck's 35 ft
    front. The engine takes the higher of front and underside. They now
    stand at their underside, the convention for an unmeasured front, as
    at Fenway, Citizens Bank and Nationals Park.
  - **Backs (caught by checking the kept values against the last
    pre-cover run):** 104, 106, 193 and 306–308 had taken their tier's
    back (the view canopy or the bleacher slab), not the parked roof they
    measured behind them (204–221 ft). The what-if showed 0 of 650
    section-games change, since every row is covered. They now keep their
    own, as the rule says and as 103, 191 and 192 already did. 105, 109
    and 110 take the roof from the photos.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 129 of the 130 Mariners sections (1,179 half-hour
  steps; 129's stay) and nowhere else.
- Labels: 441 up, 12 down.
- Mariners' Low share at the three day games: 67% → 4%; High: 21% →
  66%. Site-wide Low share: 26.7% → 25.2%.

**Checks:**
- *Audits:* identical to §22's final but for the 84 Mariners sections in
  the final measurement, all on their own values: 2,455 on the rule's
  rake; 2,407 own fronts, 49 set on purpose; 2,445 own backs, 11 set on
  purpose; no underside under 9 ft. Every value kept from before the
  covers matches the last pre-cover run (`mariners-measure3.out`), except
  the club's backs, as above.
- *Reference checks:* T-Mobile's 12 pass. The header notes were
  refreshed (the 100 level at 4:10 PM; right-center bleachers 18–65% at
  1:10 PM, under the roof's edge; 306–310 64% at 3:10 PM), and the
  post's claims pass.
- *Tests:* 3,602 of 3,602. The type check and eslint are clean.

**Not changed:** the Diamondbacks and Brewers (estimated, as above); the
Astros and Marlins (phase B: retry the rockyweb downloads, which
returned HTTP 429, then check the roof against the ground outside);
Globe Life Field, Rogers Centre and Tropicana Field (see the plan).

### §23 Phase B review (2026-11-19)

**What changed:** one park, Daikin Park (Astros), in one commit on
`fix/lidar-retractable-b`. The profile takes the Texas coast 2018 lidar
(`TX_Coastal_B1_2018`, AWS; flown 9–21 March 2018 with the roof open) in
place of its estimates, through the same tool and rules as the other 23
parks. Houston's 2024 scan has the roof closed; using the older scan was
the user's call.
- **Directions:** 5 two-method turns (100, 105, 106, 206, 233) and 3
  fall-line turns (107, 205, 307), 14–60° off the map's. Re-measured
  along them, all hold (307 reads +17° in its middle, +2° on its one
  readable side, so it stays).
- **Heights, with the estimates in brackets:**
  - field level: front at the field, −1 ft (3), 11° (20);
  - boxes: −1 ft (2), 7° (12);
  - Crawford Boxes: 15 ft (21), 18° (20);
  - right-field stands: 4 ft (10), 17° (20); the 250s: 31 ft (38), 26° (25);
  - club level: 33 ft (50), 21° (25);
  - mezzanine: 67 ft (66), 30° (25);
  - upper deck: hidden under the roof (only 407 found), so it keeps its
    estimates.
- **Covers:**
  - The club deck's front, 33 ft up, is over field row 27 (18–30), 24 ft
    underneath (estimated: row 35, 48 ft). The mezzanine's front, 66 ft,
    is over club row 2 (the source's 5), 57 ft underneath (64).
  - The mezzanine and the upper deck are one slope, with no deck between:
    the mezzanine's cover is the roof, 148 ft underneath (estimated: an
    upper deck at 78 ft).
  - The 250s' front, 31 ft, is over the right-field stands' row 8 (the
    source's 18). The parked panels are over the 250s from row 1, 246 ft
    at their top (estimated: a deck at 60 ft over row 6).
  - The deck behind the Crawford Boxes is over 102's rows 8–10, 43 ft up.
- **Far rim and crossing:** 147 ft and 408 ft (estimated 200 and 500).

**Where it went differently from the plan:**
- *Marlins (loanDepot park):* no open-roof scan exists (D4), so they keep
  their estimates.
- *Which scan:* the planned Houston 2024 tiles have the roof closed; Texas
  coast 2018 has it open (D4). The Miami tile is in US survey feet, which
  the tool's tile reader would need to read, but the Marlins aren't
  measured, so the tool is unchanged for it.
- *Rebuilt after the scan:* the right field's second deck and the corner
  of its upper deck, for the Ultra Club and its standing staircase
  (2019–21). 250 is skipped and keeps its estimates: its rows now start
  at 11, at the Ultra Club Patio's bearing on today's map.
- *Written down:*
  - 100: over its rows runs the roof's left-field runway, a girder 2–4 m
    wide and 133 ft up. It is not a deck (as the Mariners' fixtures band),
    and it was also read as 100's back, so 100 is skipped and takes the
    tier's values. It measured within 1 ft and 1° of the tier's front and
    rake (16 ft, 18°).
  - 103 and 104: where the Crawford Boxes meet the field level and the
    street (~7 m above the field), the tool can't isolate their rows, so
    they aren't measured. A wider band found 104 at 24 ft on cuts running
    mostly over the field level's slope, and was taken back.
  - 108: its rows, 27–40, are the back of 107 and 109's stand (it sits
    further out on the map), so it stands at row 27's height, 13 ft. The
    sections labelled from rows 5 and 12 measure at the field, so their
    raised fronts went.
  - 224: the roof's edge, 130 ft up, comes a row before the mezzanine's
    front, which covers its rows from row 2 as at 223 and 225. It takes
    the tier's cover.
  - 132, 133 and 153: the parked panels' edge comes first over them, over
    a deck of seats. The tool's deck-under-roof rule takes the lower deck
    but didn't fire. For 132 and 133, the panels' points at their edge are
    too few for the lowest point the rule needs; that is a tool bug,
    affecting sections at 18 other parks too (follow-up). For 153, the
    250s' rows don't show under the panels at all. So 132 and 133 take
    the club deck (the tier's row 27, as the rule gives) and 153 the
    source's row 18. Across their width the panels' edge crosses 132 and
    133 at ~70° to their rows (the panels from row 1 on their right-field
    side, the club deck from row 19–27 on the other); the engine gives one
    cover per section.
  - 118 and 120: the scan sees no edge over their rows, so the source's
    rows stand, as the approved rule (§7.1b) says. The cover report's code
    would give them the tier's row instead; the rule was followed.
- *Sections lost after covers* (21 club sections, 253–255) keep their
  pre-cover measurements. 8 of the 9 club sections still found read the
  same back from row 1 as before covers, so the Mariners' club exception
  doesn't apply.
- *`backFromFront`:* no tier qualifies. The field level reads
  back-aligned; the club and mezzanine have too few sections carrying
  the tier's back.

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 120 of the 143 Astros sections (1,190 half-hour
  steps) and nowhere else.
- Labels: 253 up, 29 down.
- Astros' Low share at the three day games: 47% → 14%; High: 35% → 58%.
  Site-wide Low share: 25.2% → 24.3%.

**Checks:**
- *Audits:* identical to phase A's but for the Astros. All 51 sections in
  the final measurement are on their own values: 2,506 on the rule's
  rake; 2,458 own fronts, 49 set on purpose; 2,496 own backs, 11 set on
  purpose; no underside under 9 ft. The upper deck's tier lines remain
  (estimates, 1 of 28 measured).
- *Reference checks:* Daikin's 37 pass. Rewritten to the measurement, with
  the reasons in the test header:
  - left field and 129–134 "among the worst for sun" now means sunnier
    than the park's median section; 102's rows 8–10 are under the deck
    behind it;
  - "the sun shines on the first-base side" now means every row in front
    of the club deck's edge is in the sun;
  - "all the shade along the third-base line" now covers 108–116; 105–107
    turn toward the left-field corner, and their front rows get the sun.
  - New checks: 122–126 rows 35 and up, and 154–155 rows 12 and up, are
    shaded (Rate Your Seats), since the lidar, not those lines, now sets
    their covers.
  - The Daikin post is a draft (unpublished 2026-11-10), so no post claims
    are checked.
- *Tests:* 3,608 of 3,608. One earlier run's worker crashed (SIGSEGV) on a
  hook test, which passes alone and in the next full run. The type check
  and eslint are clean.
- *Dev server:* `/stadium/astros` renders with no console errors. Section
  124 at the 3:10 PM opener: "shade arrives by the end of the game".

**Not changed:** the Marlins (no open-roof scan); the Diamondbacks and
Brewers (phase A); Globe Life Field, Rogers Centre and Tropicana Field
(see the plan).

## §24 The deck-under-roof rule under a sparse roof edge (plan, 2026-11-19)

Asked: fix the tool's deck-under-roof rule, which phase B of §23 found
skipped at Daikin 132 and 133, then re-measure the parks it can change.
Branch `fix/lidar-deck-under-roof`, from `fix/lidar-retractable-b` (not
merged yet), because 132 and 133 were set by hand there for this bug.

**The bug.** Where a roof high above has its edge first over a stand, and
a deck of seats starts further back under it, `measure_section` takes that
deck as the edge over the rows (Truist's canopy over its 300 level). Its
test needs the roof's lowest point at the edge, `lip_low`: the 5th
percentile of the points over the treads from 0.5 m in front of the edge
to 1 m past it, when there are 4 or more. Under a sparsely scanned edge
there are fewer, `lip_low` is None, and the rule is skipped without a
word: the high roof's edge becomes the section's cover.

**Root cause:** the test reads a 1.5 m window, narrower than the 3 m that
defines the edge (5 of 6 half-metre bins with structure over the treads).
So the edge can be found where the test's window has too few points.

**Fix, in one place:** where `lip_low` is None, the test takes the roof's
lowest point (the same 5th percentile) from the points over the first 3 m
past the edge. Those points define the edge, so they are always there.
`lipLowFt` is reported as before, since the cover report reads it, so
nothing changes where the rule doesn't fire.

**Tried first, read-only** (nothing written), on the 59 sections at 18
parks (Daikin and 17 others) whose stored measurement has an edge but no
lowest point:
- **Daikin 132 and 133 change.** The parked panels' edge comes first
  (157 and 183 ft at its lowest over those 3 m, from 5 and 8 points; 2
  in the narrow window). The club deck starts 23 and 19 m behind it,
  33 ft up, with 143 ft of headroom under the panels. Their edge becomes
  the club deck's front, row 28 (it was rows 1 and 5). What stands behind
  is read from there:
  - 132: 176 ft, 35 ft in front of the last row (was 181 ft at −73: the
    panels just behind row 13);
  - 133: 176 ft at −34 (was 180 ft at −63).
- **The other 57 don't change.** At 47 no deck of seats starts behind the
  edge within the section's rows. At the other 10 one does, but with
  nothing over its front, or (Daikin 131) higher than the edge itself. So among the stored measurements
  the fix changes only 132 and 133.

**Daikin against phase B's hand values.** Phase B's pre-cover report
(`tmp/lidar/s23/astros-cover1.out`) gave the field level row 27, but 132
and 133 their own rows 1 and 5. With their edge at 28, within two rows of
the tier's, the report gives them the tier's row 27 and its underside,
24 ft (the deck's front less the 9 ft depth). That is what phase B set by
hand. Their backs follow the tool (§14: each measured section takes its
own), as above.

### Steps
- [x] E1. Fix the rule in `scripts/measureStandHeights.py`, with its
      comment. Commit (03bbb0e7a).
- [x] E2. Re-measure with the fixed tool, after copying the stored outputs
      to `tmp/lidar/s24/before/`: all 24 parks with a stored measurement,
      not only those 18, so that a section the stored files don't show
      can't be missed. Compare every value of every section. Expected:
      only Daikin 132 and 133 differ. Anything else is traced (old tool on
      that park) before going on.
- [x] E3. Daikin: confirm from the new measurement that the cover report
      gives 132 and 133 row 27 and a 24 ft underside, also against phase
      B's pre-cover covers. Apply their backs and update the comments that
      call them hand-set. One commit. Any other park changed in E2: one
      commit each, by §7.1b option A and §8's undersides; sections lost
      after covers keep their pre-cover values.
- [x] E4. Checks:
      - audits `rakeCheck17`, `ownFrontCheck` and `ownBackCheck` against
        `tmp/lidar/s23/b/final-*.txt`;
      - snapshot against `tmp/lidar/s23/snap-b2.json`;
      - jest, tsc, eslint;
      - Daikin's reference checks, investigated and never tuned.

      From this worktree `tmp/lidar` links to the main checkout's, and
      the audits import `../../src` from their real path, which would check
      the main checkout's code. So they run as copies in this worktree's
      `tmp/s24/`.
- [x] E5. Review here.

**Not in this plan:**
- Daikin 153: the panels' edge has its lowest point (175 ft), and the
  250s' rows don't show under it, so it is not this bug.
- Filling `lipLowFt` itself from the wider window. That would move the
  cover report's undersides at the 57 sections, which is a question of its
  own.

### §24 Review (2026-11-19)

**What changed:** two commits on `fix/lidar-deck-under-roof`.
- **The tool (03bbb0e7a).** Where too few points show at the roof's edge
  for its lowest point, the deck-under-roof test takes it from the first
  3 m past the edge, the points that define the edge. `lipLowFt` is
  reported as before.
- **Daikin Park (59724e54f).** 132 and 133's backs, and the field level's
  comment on them:
  - 132: 181 ft at −73 → 176 ft at −35;
  - 133: 180 ft at −63 → 176 ft at −34.

**Re-measure:** all 24 parks with a stored measurement, every value of
every section and tier compared with the stored ones (kept in
`tmp/lidar/s24/before/`).
- **Only Daikin 132 and 133 differ.** Their edge moves from the panels'
  (rows 1 and 5) to the club deck's front (row 28, 33 ft), flagged
  `deckUnderRoof`, and their backs move as above.
- The field level's medians are unchanged, apart from its lowest
  structure at the edge (33 ft either way, now over 20 sections, not 18).
  Only its ranges move: edge rows from 18, backs to 176 ft.
- The other 23 parks are identical, including the 57 sections the plan
  expected to stay put.

**Sections whose cover changes:**
- *In the tool:* only 132 and 133, from the parked panels' edge to the
  club deck.
- *In the profile:* none. Phase B had already given them the club deck by
  hand, and the cover report now gives the same on its own:
  - on the new measurement: row 27, 24 ft underneath (23.5 and 23.7) and
    the deck's front at 33 ft, the tier's values, so they are no longer
    listed apart;
  - against phase B's pre-cover rows (the source's 35): the field level
    gets row 27. It lists apart exactly the sections in
    `DAIKIN_FIELD_COVER` (111, 113, 114, 116, 119, 125, 126 and 131), and
    132 and 133 take the tier's row and underside.

  No covers changed, so no section was lost after covers, and none keeps
  pre-cover values for this.

The rule now fires at 7 Daikin sections (122, 132, 133, 154, 155, 231
and 233), 3 at Truist Park (233, 235, 237) and 2 at T-Mobile Park (107,
108).

**Why the backs moved.** What stands behind is read from the edge on.
With the panels' edge as the cover (the bug), the highest point seen from
row 13 was the panels just behind it. With the club deck as the cover, it
is the panels above the deck's edge. That is how the rule reads every
section where it fires (§14: each measured section takes its own back).

**Results, at the five 2025 test games across all 30 parks:**
- Answers change for 132 and 133 only, in 8 half-hour steps, all at the
  1:10 PM starts. Their first one or two half-hours go from wholly shaded
  to partly shaded.
- Labels: 4 up, 0 down. Low share unchanged at 24.3%.
- Daikin's April 13 1:10 PM game: 132 goes from 48% to 38% of the game
  shaded, and 133 from 45% to 38%. The park's median section is 81%.

**A limit, already written down in phase B:** the engine gives one cover
per section. The panels 150–187 ft over 132 and 133's open rows (1–26)
are not modelled. The old back, wrongly read from their edge, had stood in
for them over the front rows. That is why those rows now get more sun at
1:10 PM.

**Checks:**
- *Audits:* identical to phase B's final (`tmp/lidar/s23/b/final-*.txt`):
  - 2,506 sections on the rule's rake;
  - 2,458 on their own front, 49 set on purpose;
  - 2,496 on their own back, 11 set on purpose;
  - no underside under 9 ft.

  They run from copies in the worktree's `tmp/s24/`. Through the
  `tmp/lidar` link they load the main checkout's `src`: checked by
  resolving `src/data/stadiums` from each place.
- *Snapshot:* against `snap-b2.json`, as in the results above.
- *Reference checks:* Daikin's 37 pass. The header's statements hold:
  - 129–134 stay sunnier than the park's median at 1:10 PM;
  - the 3:10 PM first-pitch figures are unchanged (131–134 and 122–129
    both 31% shaded; 134 16%).
- *Tests:* 3,608 of 3,608.
- *Type check and eslint:* tsc is clean. eslint gives no errors; its 39
  warnings in `src` are all in other files, and `stadiumStructures.ts`
  lints clean.
- *Dev server:* `/stadium/astros` renders with no console errors. Section
  132 at a 1:10 PM game: "partly shaded, with sun on some rows all game".

**Not changed:** Daikin 153 (not this bug), and `lipLowFt` from the wider
window (see the plan).

## §25 Copy that still says seat-level shade is withheld (plan, 2026-11-19)

Asked: plan the copy fix. Branch `fix/copy-withheld`, from `main` after
PR #100. This finishes 4.7.

**The problem.** In August the site paused seat-level answers (audit
Phase 10), and its copy said so. Since then every MLB park has a
section-by-section shade map, 24 of them on stands measured from lidar.
The pages around the map still describe the pause. On the live site
(fetched 2026-11-19):
- *Every page:* the default meta description ("Review stadium solar
  context and data confidence before relying on any seat-level shade
  claim", `app/layout.tsx`), the footer line (`FooterModern`) and the
  site's share image ("solar context with confidence disclosed").
- */faq:* 4 answers say exact sections and rows are withheld, and 2 more
  lean on "validated stadium geometry". The page's FAQ JSON-LD, which
  search engines read, carries the same answers.
- *Homepage:* 3 FAQ JSON-LD answers say the same (`HomepageSchema`), one
  that Yankee Stadium's shaded rows aren't published.
- */how-it-works:*
  - it names the NOAA calculator (NREL's SPA replaced it in 2.1);
  - it says MLB rows are "modeled rather than surveyed";
  - it says results are "not currently published" (the "release gate").
- */disclaimer:* "Exact MLB seat-level shade outputs are currently
  withheld".
- */guide/best-shaded-seats-mlb:* titled "MLB Shade Data Trust Guide":
  "Exact section and row rankings are paused", "publication gate",
  "holdout".
- */guide/how-to-find-shaded-seats:* three lines say results are withheld.
- */guide, /stadiums, /league/(mlb|milb|nfl)*, and the blog posts'
  closing line: "solar context", "data confidence", "measurement status".
- *Every MLB stadium page, under the map:* each of "How High the Sun
  Gets"'s 7 months ends "This is verified solar-position context only;
  translating it into exact section or row shade requires measured stadium
  geometry" (`seasonalShade.ts`).
- *MiLB pages:* "the orientation model indicates the {side} is more likely
  to self-shade first. Exact sections, rows, and transition times are not
  published until metric geometry has been measured and independently
  validated" (`ShadeAnswer`).
- *MiLB and NFL pages:* "Seating layout is approximate. Individual section
  placement and metric shade geometry are modeled and have not passed
  independent observation validation" (`fidelityNote`).

For MiLB and NFL the gist is still true, since they have no section map.
Only the wording is internal.

**What the copy will say.** Each fact was checked in the code:
- *MLB:*
  - Pick a game and see every section in sun or shade, in half-hour
    steps labelled by inning.
  - Each section's answer carries High, Medium or Low confidence.
  - Rows under a deck or roof show as shaded.
- *How it's worked out:*
  - The sun's position comes from NREL's Solar Position Algorithm.
  - At 24 parks the stands' heights and rake, and the decks and roofs
    over them, are measured from USGS lidar scans. A few decks the scans
    can't see are estimated.
  - At Chase Field, American Family Field and loanDepot park there's no
    scan with the roof open, so the stands are estimated from aerial
    photos.
  - Globe Life Field and Rogers Centre use a generic stand shape.
  - Tropicana Field has a fixed roof.
  - The confidence label says whether the answer holds if the park's
    direction or the stands' heights are off by their known error.
  - The answers are checked against published reports from real games.
- *Retractable roofs:* the map shows the roof open; with it closed,
  every seat is shaded.
- *MiLB:* there's no section map, only which side tends to shade first
  at a day game, from the way the park faces. *NFL:* already plain
  (which sideline).

**Fix.** Copy only, with no logic changes and each page's layout kept.
Plain words throughout, with no "withheld", "self-shade", "holdout",
"publication gate", "paused", "solar context", "data confidence" or
"measurement status". One commit per area.

### Steps
- [x] E1. Site-wide: the default meta description, the footer line and the
      site's share-image subtitle.
- [x] E2. /faq and the homepage's FAQ JSON-LD: rewrite the answers that
      describe the pause.
- [x] E3. /how-it-works: the sun (NREL SPA), the stands (as above) and the
      limits:
      - the roof is shown open;
      - estimated parks lean to Low and Medium;
      - weather: say where it's used, after checking whether the MLB map
        uses it.
- [x] E4. /disclaimer: replace the withheld sentence with what the answers
      rest on, and that they're estimates.
- [x] E5. Guides:
      - best-shaded-seats-mlb, same URL, retitled to its keywords ("Best
        Shaded Seats at MLB Ballparks"): how to find them with each park's
        map, keeping its climate and start-time sections;
      - how-to-find-shaded-seats;
      - the guide index.
- [x] E6. /stadiums, the league pages and the blog's closing line.
- [x] E7. Stadium pages: drop the "verified solar-position context only…"
      sentence from the monthly sun heights.
- [x] E8. MiLB and NFL: `ShadeAnswer`'s MiLB answer and `fidelityNote` in
      plain words, with their unit test (`stadiumDataFidelity.test.ts`
      matches the old wording).
- [x] E9. Checks:
      - on the dev server, every route above with none of the old phrases;
      - the FAQ JSON-LD parses;
      - unit tests, type check, eslint, and the SEO and a11y specs;
      - a look at /faq, /how-it-works, a guide, an MLB, a MiLB and an NFL
        page.

      Then the review, and tick 4.7 (and 2.7, whose last use of the
      side-of-park answer is MiLB's). (PR: when asked.)

**Not in this plan (noticed):**
- *Files nothing imports, with the same copy:*
  - `ShadeConfidenceNotice`;
  - `MobileStadiumGuide`, with `StadiumShadeQuestions` and
    `SectionShadeSEO`;
  - `src/utils/seoSchema.ts`;
  - `ShareButton`.

  Also `tests/trust-boundary-local.spec.ts`, which tests that removed
  notice (CI doesn't run it). Deleting these is a cleanup of its own.
- *The row API (1.2b)* still answers `publicationState: 'withheld'`. That's
  an API field, not copy, and nothing on the site calls it.
- *Other FAQ answers not about the pause* (favorites, live weather,
  offline) are left as they are. Weather and favorites belong to the full
  finder used for MiLB and NFL.
- *Stale ticks:* 6.0 is done (every section file passes `ORIENTATION`), as
  is 7.5 (§23). Ticked with this review.

### §25 Review (2026-11-20)

**What changed:** copy only, in 10 commits on `fix/copy-withheld`. No
logic, data or layout changed.
- *Site-wide* (E1):
  - the default meta, Open Graph and Twitter descriptions;
  - the footer line;
  - the share image's subtitle;
  - the WebApplication JSON-LD on every page (`components/SafeSchema.tsx`).
    The plan missed it, and the sweep found it ("Data-confidence
    disclosures", "Source-backed section inventories").

  Each now says what the site gives: every MLB section, for any game, plus
  guides for MiLB and NFL venues.
- */faq* (7 answers) and the homepage's FAQ JSON-LD (5 answers and the
  Organization line), E2:
  - what the map shows (every section, inning by inning, and the sections
    with the most shade);
  - how it's worked out (NREL's SPA; at most MLB parks, stands measured
    from USGS lidar);
  - what High, Medium and Low mean.
- */how-it-works* (E3): the SPA instead of NOAA, and the stands:
  - 24 parks measured from lidar, a few decks estimated;
  - Chase, American Family Field and loanDepot estimated from aerial
    photos;
  - Globe Life Field and Rogers Centre generic;
  - Tropicana Field fixed.

  Also the confidence rule as `gameShade.ts` applies it: High when no
  half hour changes with the direction ± its error or the stands ±10%
  (±50% estimated), Medium for 1–2 half hours, Low for more. Then the 27
  parks with reference checks, and that the MLB map is clear-sky (weather
  belongs to the full finder). The limits: the roof shown open, estimated
  parks leaning Medium and Low, and one answer per row.
- */disclaimer* (E4): the answers are estimates resting on the sun's
  position and measured or estimated stands; the label is a guide, not a
  guarantee.
- *Guides* (E5):
  - best-shaded-seats-mlb, at the same URL, is now "Best Shaded Seats at
    MLB Ballparks": where the shade is, using a park's map, by start time,
    buying tickets. Its climate section is kept.
  - how-to-find-shaded-seats, avoid-sun-baseball-games and the guide index
    lose the withheld and "evidence" wording.
  - Also fixed, in the same block: "4 PM: Sun sets during game" (sunset is
    near 8 PM in summer).
- */stadiums, the league pages, the blog's closing line* (E6). The league
  line differs by league: every section for MLB, which side for MiLB,
  which sideline (where measured) for NFL.
- *Stadium pages* (E7): the 7 monthly sun heights lose their "requires
  measured stadium geometry" sentence.
- *MiLB and NFL* (E8): the MiLB answer ("the {side} tends to shade first,
  going by the way the park faces; no seating map") and the approximate
  layout note, with the unit test that matched the old wording.

**Checks:**
- *Sweep:* 47 routes on the dev server, 0 hits. The routes are all 30 MLB
  parks, the FAQ, how-it-works, the disclaimer, the three guides and the
  index, /stadiums, the three league pages, /blog and a post, the finder,
  one MiLB and one NFL page. The phrases: withheld or withhold,
  self-shade, holdout, publication or release gate, paused, solar or sun
  context, data confidence, measurement status, boundary or confidence,
  source-backed, independent validation, requires measured, metric
  geometry, not currently published, evidence, orientation model.
- *JSON-LD:* all 195 blocks on those pages parse, 34 of them FAQPage.
- *Tests:* 3,608 of 3,608. The type check is clean. eslint gives no
  errors; its 22 warnings in the touched files are all on lines this
  didn't change.
- *Playwright:*
  - a11y spec: 6 of 6.
  - SEO spec: all 9 fail on the dev server, at its last check, a streamed
    `<div hidden id="S:`. The dev server always streams; CI runs the spec on
    a production build. On every page, the H1, the JSON-LD parse and the
    canonical before that check pass.
- *Pages:* /how-it-works, the MLB guide, /faq, the Astros page (months end
  at "the season high") and Isotopes Park (the MiLB answer and note) all
  render with no console errors.

**Not changed (see the plan):**
- the five unimported components and the old trust-boundary spec;
- the row API's `publicationState`;
- the FAQ's other answers (favorites, weather, offline).

On the MiLB page the answer and the layout note now both say no sections
can be named; the note shows on NFL pages too, so it stays.

## §26 Copy §25 missed: the guide's old title and the NOAA credit (plan, 2026-11-23)

Asked: plan the fix for two things still live after PR #101 merged, found
by fetching the live pages (build 9cf9df9926f2). Branch
`fix/copy-leftovers`, from `main` at 9cf9df992.

**What's wrong:**
1. §25 (E5) retitled the MLB guide "Best Shaded Seats at MLB Ballparks",
   but two links to it still say "MLB Shade Data Trust Guide".
2. The site credits NOAA's Solar Calculator (Meeus) for the sun's
   position. Since 2.1 every sun position and sunrise/sunset comes from
   NREL's SPA (`src/utils/solarPosition.ts`, reached through
   `sunPosition.ts` and `sunCalculations.ts`). NOAA's calculator is only
   the tests' cross-check (`src/utils/testReference/noaaSolarReference.ts`).

**Why §25's sweep missed them:** it searched for the withheld era's
phrases. It didn't search for what §25 renamed (the guide's title) or
what 2.1 replaced (NOAA). This plan's search covers both: `Data Trust`,
`Trust Guide`, `NOAA`, `Meeus`, `solcalc` and `esrl`, in `app/`,
`components/`, `src/`, `lib/` and `public/`.

**Every hit, and what happens to it:**
- *Shipped and wrong (fixed below):*
  - `app/faq/page.tsx:223` and `app/guide/avoid-sun-baseball-games/page.tsx:251`:
    the link text;
  - `components/FooterModern.tsx:84`: the footer on every page;
  - `app/attributions/page.tsx`: the solar box, its citation, and step 1
    of "How We Calculate Shade";
  - `app/disclaimer/page.tsx:223–232`: the NOAA box among the third-party
    sources;
  - `src/components/AttributionNotice.tsx`: the `nrel`/`noaa` case and
    the `all` case. Its one caller (WeatherDisplay) passes `weather`, so
    these show nowhere today, but the next caller would show them;
  - `public/llms.txt:5`: the summary AI crawlers read.
- *Right as is:*
  - how-it-works line 34, which names NOAA's calculator as the cross-check;
  - `stadiumGeometryEvidence.ts`: lidar from NOAA's Office for Coastal
    Management, a different NOAA;
  - the test-only reference;
  - `compassDegreesToSunCalcRadians`, a name for an angle convention.
- *A code comment that's wrong:* `src/utils/sunCalculations.ts:45` says
  "NOAA refraction"; it's SPA's (Eq. 42).
- *Files nothing imports:* `src/components/MobileHeader.tsx` ("MLB Data
  Trust Guide") and `src/components/AttributionFooter.tsx` (NOAA). Left as
  they are, like §25's five.

**Other wrong lines in the same places.** Fixing only the name would leave
false sentences beside it:
- `public/llms.txt`:
  - line 5 also says shade uses cloud-cover weather, but the MLB map
    shows a clear sky (how-it-works §4);
  - line 10 says every venue has a section-by-section table (Covered /
    partial back-rows / Exposed). No page shows that now, and MiLB and
    NFL pages can't name sections.
- `app/attributions/page.tsx`:
  - the intro, "none is presented as proof of unmeasured seat geometry",
    is the withheld era's wording;
  - Stadium Data says roofs come from "architectural documentation" and
    orientation from "satellite imagery". The heights at 24 parks come
    from USGS 3DEP lidar (all 24 in `scripts/measureStandHeights.py`),
    and the page doesn't credit it. Orientations come from USDA NAIP
    photos, and Toronto's for Rogers Centre (`orientationMeasurements.ts`);
  - in How We Calculate Shade, step 3 says sun exposure is adjusted for
    cloud cover and rain chance (the MLB map isn't), and step 5, "Comfort
    Scoring", isn't part of the shade answer.

**The fix (one commit each):**
- [x] F1 Link text, both links: "MLB Shade Data Trust Guide" → "Best
      Shaded Seats at MLB Ballparks".
- [x] F2 Footer: "☀️ Sun: NOAA Solar Calculator" → "☀️ Sun: NREL Solar
      Position Algorithm".
- [x] F3 /attributions:
      - Intro: "The Shadium combines the sun's position with the measured
        shape of each park's stands, the real game schedule and the
        weather. These are the sources behind each."
      - Solar box, titled "NREL Solar Position Algorithm": "Sun position is
        computed with the Solar Position Algorithm (SPA) of the U.S.
        National Renewable Energy Laboratory, including atmospheric
        refraction, so evening shade uses the sun as it appears in the
        sky. We check it against the worked example in NREL's paper and
        against NOAA's Solar Calculator at every park."
        - Citation: "Reda, I. and Andreas, A. Solar Position Algorithm for
          Solar Radiation Applications. NREL/TP-560-34302, revised
          January 2008."
        - Links: the paper | NOAA Solar Calculator (the cross-check).
      - Stadium Data, as a lead line and a list: "Where each park's seats
        are, and the shape of the stands around them, come from public
        sources:"
        - coordinates and dimensions from official venue specifications
          (kept);
        - section positions from each club's published seating chart;
        - stand heights, decks and roofs at 24 MLB parks measured from
          USGS 3D Elevation Program lidar (public domain);
        - each park's direction measured from USDA NAIP aerial photos,
          and City of Toronto photos for Rogers Centre.
      - How We Calculate Shade, for MLB parks, linking /how-it-works:
        1. Sun position: NREL's SPA for the date, time and park.
        2. Shadows: the shadows the stands, the deck above and the roof
           throw over each section's rows.
        3. Through the game: every half hour from first pitch.
        4. Confidence: each section's answer is High, Medium or Low, by
           whether it holds if the park's direction or the stands'
           heights are a little off.
        5. Weather: the MLB map shows a clear sky; the full finder for
           MiLB and NFL venues shows Open-Meteo's forecast.
- [x] F4 /disclaimer: the NOAA box becomes "NREL Solar Position
      Algorithm": "Sun position from the Solar Position Algorithm of the
      U.S. National Renewable Energy Laboratory (Reda and Andreas,
      NREL/TP-560-34302)", with the paper's URL.
- [x] F5 `AttributionNotice`:
      - the `nrel` case credits NREL's SPA and links the paper;
      - `noaa` comes out of the type, since no caller passes it (tsc
        checks);
      - the `all` case's sun line says NREL.
- [x] F6 `public/llms.txt`:
      - Line 5: "The Shadium works out shade from the sun's position
        (NREL's Solar Position Algorithm), the shape of each park's
        stands, decks and roofs (measured from USGS lidar at 24 MLB
        parks), and the real first-pitch time from MLB's schedule. The
        MLB map shows a clear sky; the full finder for MiLB and NFL venues
        shows the forecast from Open-Meteo." The how-it-works link stays.
      - Line 10 becomes two lines:
        - "MLB ballpark pages show every section in sun or shade for any
          game, inning by inning, with the sections that get the most
          shade, a High, Medium or Low confidence label, and how high the
          sun gets each month."
        - "MiLB and NFL pages are sun and shade guides: which side or
          sideline tends to shade first, going by the way the venue faces,
          plus seating, food and travel notes."
- [x] F7 `sunCalculations.ts:45` comment: "NOAA refraction" → "SPA
      refraction".
- [x] F8 Check:
      - re-run the search: only the "right as is" hits and the two unused
        files are left;
      - jest, tsc, eslint;
      - on the dev server: /faq, the avoid-sun guide, /attributions,
        /disclaimer and the footer;
      - after merge, the live pages.

**Seen, not in scope:** on MiLB pages the hand-written guide block "Best
Shaded Sections by Time" can differ from the page's own answer. At Isotopes
Park, it says "first base side, upper deck" for afternoon games, but the
answer says "the seating behind home plate tends to shade first". That's
venue guide data for 120 parks, a task of its own.

## §26 Review (2026-11-23)

**What changed:** seven commits after the plan's, on `fix/copy-leftovers`.
Copy and one code comment only, no logic.
- *F1 (ebcf0b734):* the links on /faq and the avoid-sun guide say "Best
  Shaded Seats at MLB Ballparks".
- *F2 (81206febd):* the footer on every page says "☀️ Sun: NREL Solar
  Position Algorithm".
- *F3 (6e46822de):* /attributions has a new intro and an NREL box
  (citation, the paper's link, and NOAA's calculator as the cross-check).
  Its Stadium Data list credits USGS 3DEP lidar and NAIP/Toronto photos,
  and How We Calculate Shade lists five steps that match how-it-works.
- *F4 (69d183350):* /disclaimer's NOAA box became an NREL box.
- *F5 (d8f8e84e2):* `AttributionNotice`'s `nrel` and `all` cases credit
  NREL; `noaa` left the type (its one caller passes `weather`).
- *F6 (dd9a25c20):* `llms.txt` line 5 gives the real method; line 10
  became one line for MLB pages and one for MiLB and NFL.
- *F7 (6072a39a8):* the comment in `sunCalculations.ts` names SPA's
  refraction.

**Checks:**
- *Search:* only the "right as is" hits are left (how-it-works and
  /attributions naming NOAA's calculator as the cross-check, the test-only
  reference, the NOAA lidar evidence, the SunCalc angle names), plus the
  two files nothing imports.
- *Dev server:* on `/`, /faq, the avoid-sun guide, /attributions,
  /disclaimer, /how-it-works, /seats-shade-finder, /stadium/yankees and
  /llms.txt (all 200), none of the old phrases show. The new ones show where
  expected (the footer on every route). /attributions looks right, with no
  console errors.
- *Tests:* jest 3,608 of 3,608; tsc clean.
- *Lint:* eslint gives no errors. Its 19 warnings in the changed files
  are all on lines this branch didn't touch.
- *Not yet:* the live pages, after merge.

**Corrected before the PR.** Checking my own new claims against the data
found four that were too broad, so the plan's wording above is not what
shipped:
- /attributions said "each park's direction" is measured from photos.
  `orientationMeasurements.ts` has 28 of the 30: Globe Life Field's is a
  published estimate and Tropicana Field's fixed roof needs none. It now
  says "the direction 28 of the 30 parks face".
- Its intro said "the measured shape of each park's stands", and its
  Stadium Data lead line spoke of every park. The stands are measured at
  24 MLB parks, and MiLB and NFL parks have no stands model, so both now
  say that.
- `llms.txt` gave the method for every venue; it's MLB's, so it now says
  "for MLB ballparks" and "24 of the 30 parks".
- `llms.txt` said all MiLB and NFL pages are guides. A survey of the 152
  on the dev server found 2 MiLB pages with no guide and no side answer
  (Columbus Clingstones and Knoxville Smokies: "Stadium Guide Not
  Available"). It now says "nearly all". Those two pages are their own
  task.
- That line briefly said "where we know the way the venue faces". The §27
  findings (branch `claude/festive-haslett-850afa`) show most stored MiLB
  directions are wrong, so the clause is dropped (asked, 2026-11-23).

**Not changed:** `MobileHeader.tsx` and `AttributionFooter.tsx` (nothing
imports them); the MiLB guide blocks (above).

## §27 MiLB pages: the guide's shade advice and the side answer (plan, 2026-11-23)

Asked: does the hand-written shade advice on MiLB pages disagree with the
side answer at the top of the same page, and which is right? Branch
`claude/festive-haslett-850afa`, from `main` at 9cf9df992. (§26 is on
`fix/copy-leftovers`, not merged yet. Both add a section at this spot, so
the second to merge gets a small conflict here.) Nothing but this file has
changed.

**In short:** they disagree outright at 41 parks, and neither can be
trusted. The guide's lists are boilerplate. The answer's idea is right, but
almost every park direction it uses is wrong, by a median of 75°, and it
keeps the sun due south all game. NFL pages had the same two faults, fixed
in November (83879ea95, d9edd394f). This plan makes the same fix for MiLB.

### Findings

**1. Where the guide's advice comes from.**
- `shadeGuide.bestShadedSections` and `.shadeTips` in
  `src/data/guides/{aaa,aa,aPlus,singleA}StadiumGuides.ts`, shown by
  `ComprehensiveStadiumGuide.tsx`, lines 149–188.
- 118 of the 120 MiLB parks have it. Columbus Clingstones and Knoxville
  Smokies have no guide.
- NFL pages hide it (line 51). MLB pages don't use this component.
- It's boilerplate. 29 different lists cover the 118 parks, and the 3 most
  common cover 83. 69 parks say "First base upper deck". Nothing in it
  depends on the park's direction.

**2. Guide against answer, all 120 parks** (afternoon list against the side
named at the top):

| | Parks |
|---|---|
| Disagree: the answer's side isn't in the list | 41 |
| Agree in part: it's one of two sides in the list | 55 |
| Agree | 17 |
| Can't be compared (section numbers only) | 5 |
| No guide | 2 |

The "Shade tips" name a side for the afternoon at 29 parks, and at 22 of
them it isn't the answer's side. Every park is listed at the end.

**3. Is the answer right?** It is worked out from two inputs
(`src/utils/shadeSide.ts`), and both are wrong.

*The park's direction.* All 120 arrived in one commit (683a545fe,
2025-08-01) with no source. 35 parks have exactly 340° and 20 have exactly
315°. I measured them:
- Method: fit a regulation infield (90 ft bases, 95 ft skin arc) to a USGS
  aerial photo. 98 parks on the USGS imagery layer, 18 on newer or
  re-centered NAIP photos, and 2 (Salt Lake, Vancouver) from OpenStreetMap
  outlines. Every fit was looked at with the direction drawn on the photo.
- Not measured: Knoxville and Columbus. The photos are older than the 2025
  parks.
- Check on MLB: 21 of 22 open-air parks land within 6° of their measured
  direction. The miss (GABP) had the lowest match score, 0.68, and every
  hit was at least 0.76. Five MiLB fits score below 0.76 (0.69–0.74); those
  were kept only because the direction is plain in the photo.
- Check on MiLB: the Stats API gives a direction for only 3 of these parks,
  and the fit is within 1° of all 3.

  | Park | Ours | Stats API | Photo |
  |---|---|---|---|
  | Buffalo | 65° | 157° | 157° |
  | Sacramento | 340° | 46° | 47° |
  | Dunedin | 335° | 138° | 139° |

- Result: of the 118 measured, 10 of ours are within 15°, 88 are more than
  45° off and 46 more than 90°. Sutter Health Park has both: our Athletics
  page has it at 47° (measured), and our River Cats page at 340°.

*The sun.* The rule puts it due south all game. At the 1,864 day games
MiLB teams played at home in 2025, the sun's bearing (NREL SPA, median) was:

| First pitch | 75 minutes in | 150 minutes in |
|---|---|---|
| 177° | 217° | 244° |

South is right only at first pitch, when the sun is so high that few rows
are shaded.

*How often the named side is right.* ✓ means the sun's mean direction over
a 1:05 PM game (the usual 2025 day start, 6 Sundays) is within 60° of that
side, so the sun is behind it; ✗ means over 120°, so it faces the sun;
– is in between. 118 parks:

| | ✓ | – | ✗ |
|---|---|---|---|
| Today: our directions, sun due south | 57 | 45 | 16 |
| Our directions, the sun's path | 37 | 48 | 33 |
| Measured directions, sun due south | 75 | 43 | 0 |
| Measured directions, the sun's path | 116 | 2 | 0 |

Neither fix works alone. The last row is judged by the sun's path too, so
it can't be called proof. The independent check is our own engine, at the
27 MLB parks with stand profiles (1:05 PM, uncovered field and lower seats):

| Rule | Names the shadiest infield side |
|---|---|
| Sun due south (today's) | 12 of 27 |
| The sun's path, one side | 18 of 27 |
| The sun's path, every side within 60° | 22 of 27 |

Most misses are home plate against the third-base side at parks facing
northeast, which depends on the stands.

**4. Is the guide right?** At the 113 parks where it names a side, the sun
is behind every side it names at 29 and behind none of them at 25. At 20 it
names a side that faces the sun. Where the two disagree (41), the answer's
side is ✓ at 11 and the guide names a ✓ side at 27, partly because it often
names two. At 5 neither is ✓. So neither can be kept as the right one.

**5. Other places the same data shows.**
- The direction: "Faces …" in the MiLB title block, and the MiLB section
  list in /seats-shade-finder (`getUnifiedVenueShade`). Both are as wrong
  as the answer.
- Side claims outside the hidden block, on MiLB pages: "Sun in right field
  afternoon" and the like in Things to Avoid (110 parks); seating tips with
  a SHADE badge naming a base line or sections (109 parks; most say "Third
  base line: Check weather forecast…"); Pro Tips (5 parks); a game-day tip
  (Oklahoma City); and monthly tips naming a base (5 entries).
- NFL: 5 pages still show side claims outside the block, and all 5 agree
  with the page's own answer. No NFL change needed.

### Plan (waiting for your go-ahead)

- [x] G1. Record the measured directions: `milbOrientationMeasurements.ts`
      (value, ± error, method, source, as `nflOrientationMeasurements.ts`
      does) and the measuring script, so it can be re-run. Knoxville and
      Columbus: look for a 2025 photo; if there's none, mark "not measured".
- [x] G2. Put the values in `unifiedVenues.ts` (and its `seatingGeometry`
      copies) and `milbStadiums.ts`, with a test that keeps all three in
      step (as `nflOrientationConsistency.test.ts`). This also fixes the
      title block. (The plan said the finder too; see the review.)
- [x] G3. Replace the due-south rule in `shadeSide.ts` with the sun's path
      (SPA, 1:05 PM, 3 hours, the 6 dates above), worked out on the server
      as the NFL answer is. Name each infield side within 60°: one side at
      95 parks, two at 21. At Hillsboro and Vancouver, and where the
      direction isn't measured, say no side has a clear edge / we can't say
      yet. Tests first, from the photos (Buffalo first base, Albuquerque
      behind home plate).
- [x] G4. Remove the "Best Shaded Sections by Time", "Shade Tips" and
      monthly shade-tip markup from `ComprehensiveStadiumGuide`. Only MiLB
      and NFL pages render it, and NFL already hides it, so the
      `handWrittenShadeHidden` flag goes too.
- [x] G5. Delete the other MiLB side claims (finding 5) from the four guide
      files, with a test that no visible MiLB guide text ties a side of the
      park to sun or shade.
- [x] G6. Checks: unit tests, type check, eslint; all 120 pages on the dev
      server against the expected answer; a look at Isotopes Park, Sahlen
      Field, Sutter Health Park and Knoxville. Then the review.

One PR, one commit per step. G4 and G5 alone would end the contradiction
but leave a wrong answer at about half the parks, so I'd not ship them
without G1–G3.

**For you to decide:**
1. Go ahead with G1–G6?
2. G3: name two sides where the sun is behind both (my pick: 22 of 27 on
   the MLB check, against 18), or always one?

**Not in this plan (noticed):**
- *Coordinates:* 65 MiLB parks are stored more than 1 km from the Stats
  API's, 17 of them more than 5 km and the worst 12.9 km. The sun barely
  changes, but the pages' JSON-LD `geo` is wrong. (The API has errors too:
  its Dunedin is an old park in Clearwater.)
- *2025 teams and parks:* Down East isn't a 2025 team (Spartanburg replaced
  it). Oklahoma City, Bowie and Rome have their old team names, and some
  parks their old names. Tampa's 2025 home games were on a back field,
  because the Rays used Steinbrenner Field.
- *The finder's MiLB sections* are a generated template, not a seating map.

The scripts, per-park results and marked photos are in the shared notes
folder, `milb-shade-advice/`.

### Every park

Home plate to center field. "Stored" is the old value and "Measured" the one
now in the data (G1). ✓ – ✗ as above, for the measured direction. "Now names"
is the new answer.

**Disagree (41)**

| Park | Stored | Measured | Old answer | Guide, afternoon | Now names |
|---|---|---|---|---|---|
| albuquerque-isotopes | 5° | 45° | Home ✓ | 1B – | Home |
| augusta-greenjackets | 225° | 140° | 3B ✗ | 1B ✓ + Home – | 1B |
| binghamton-rumble-ponies | 315° | 32° | 3B – | 1B – + Home ✓ | Home |
| bowling-green-hot-rods | 315° | 50° | 3B – | 1B – + Home ✓ | Home |
| brooklyn-cyclones | 195° | 127° | Outfield – | 1B ✓ + Home – | 1B |
| buffalo-bisons | 65° | 157° | 1B ✓ | 3B ✗ | 1B |
| charlotte-knights | 45° | 82° | 1B ✓ | 3B ✗ | Home + 1B |
| durham-bulls | 90° | 73° | 1B – | 3B – | Home |
| el-paso-chihuahuas | 340° | 34° | Home ✓ | 1B – | Home |
| fort-wayne-tincaps | 50° | 35° | 1B – | Home ✓ | Home |
| fresno-grizzlies | 315° | 100° | 3B ✗ | Home ✓ | 1B + Home |
| frisco-roughriders | 50° | 46° | 1B – | Home ✓ | Home |
| gwinnett-stripers | 340° | 118° | Home – | 1B ✓ | 1B |
| harrisburg-senators | 250° | 175° | 3B ✗ | 1B ✓ + Home ✗ | 1B |
| hillsboro-hops | 315° | 192° | 3B – | 1B – + Home ✗ | none clear |
| jacksonville-jumbo-shrimp | 350° | 68° | Home ✓ | 1B – | Home |
| lake-elsinore-storm | 315° | 62° | 3B – | 1B – + Home ✓ | Home |
| lansing-lugnuts | 315° | 1° | 3B – | Home ✓ | Home |
| louisville-bats | 225° | 15° | 3B – | 1B – | Home |
| lynchburg-hillcats | 315° | 8° | 3B ✓ | 1B ✗ + Home ✓ | Home + 3B |
| memphis-redbirds | 340° | 68° | Home ✓ | 1B – | Home |
| nashville-sounds | 30° | 150° | Home – | 1B ✓ | 1B |
| norfolk-tides | 325° | 135° | Home – | 1B ✓ | 1B |
| omaha-storm-chasers | 310° | 47° | 3B – | 1B – | Home |
| pensacola-blue-wahoos | 225° | 124° | 3B ✗ | 1B ✓ + Home – | 1B |
| portland-sea-dogs | 315° | 14° | 3B ✓ | 1B ✗ + Home ✓ | Home + 3B |
| quad-cities-river-bandits | 160° | 133° | Outfield – | 1B ✓ + Home – | 1B |
| rancho-cucamonga-quakes | 315° | 45° | 3B – | 1B – + Home ✓ | Home |
| reading-fightin-phils | 50° | 39° | 1B – | Home ✓ | Home |
| rochester-red-wings | 315° | 68° | 3B – | 1B – | Home |
| sacramento-river-cats | 340° | 45° | Home ✓ | 3B – | Home |
| san-antonio-missions | 315° | 134° | 3B ✗ | Home – | 1B |
| scranton-railriders | 20° | 44° | Home ✓ | 1B – | Home |
| somerset-patriots | 315° | 125° | 3B ✗ | 1B ✓ + Home – | 1B |
| springfield-cardinals | 310° | 46° | 3B – | Home ✓ | Home |
| st-paul-saints | 180° | 102° | Outfield – | 1B ✓ | 1B |
| syracuse-mets | 315° | 1° | 3B ✓ | 1B ✗ | Home + 3B |
| tampa-tarpons | 60° | 62° | 1B – | Home ✓ | Home |
| visalia-rawhide | 315° | 142° | 3B ✗ | 1B ✓ + Home – | 1B |
| west-michigan-whitecaps | 315° | 17° | 3B – | Home ✓ | Home |
| wisconsin-timber-rattlers | 315° | 47° | 3B – | 1B – + Home ✓ | Home |

**Agree in part (55)**

| Park | Stored | Measured | Old answer | Guide, afternoon | Now names |
|---|---|---|---|---|---|
| aberdeen-ironbirds | 340° | 102° | Home ✓ | 1B ✓ + Home ✓ | 1B + Home |
| akron-rubberducks | 45° | 354° | 1B ✗ | 1B ✗ + Home ✓ | Home + 3B |
| altoona-curve | 20° | 172° | Home ✗ | 1B ✓ + Home ✗ | 1B |
| amarillo-sod-poodles | 25° | 54° | Home ✓ | 1B – + Home ✓ | Home |
| arkansas-travelers | 340° | 146° | Home – | 1B ✓ + Home – | 1B |
| asheville-tourists | 90° | 143° | 1B ✓ | 1B ✓ + Home – | 1B |
| beloit-sky-carp | 340° | 42° | Home ✓ | 1B – + Home ✓ | Home |
| biloxi-shuckers | 20° | 135° | Home – | 1B ✓ + Home – | 1B |
| carolina-mudcats | 340° | 47° | Home ✓ | 1B – + Home ✓ | Home |
| cedar-rapids-kernels | 70° | 44° | 1B – | 1B – + Home ✓ | Home |
| charleston-riverdogs | 10° | 193° | Home ✗ | 1B ✓ + Home ✗ | 1B |
| chattanooga-lookouts | 115° | 340° | 1B ✗ | 1B ✗ + Home ✓ | 3B + Home |
| corpus-christi-hooks | 340° | 44° | Home ✓ | 1B – + Home ✓ | Home |
| dayton-dragons | 55° | 79° | 1B ✓ | 1B ✓ + Home ✓ | 1B + Home |
| daytona-tortugas | 70° | 352° | 1B ✗ | 1B ✗ + Home – | 3B |
| delmarva-shorebirds | 90° | 90° | 1B ✓ | 1B ✓ + Home ✓ | Home + 1B |
| down-east-wood-ducks | 40° | 46° | Home ✓ | 1B – + Home ✓ | Home |
| erie-seawolves | 340° | 17° | Home ✓ | 1B – + Home ✓ | Home |
| eugene-emeralds | 340° | 131° | Home – | 1B ✓ + Home – | 1B |
| everett-aquasox | 340° | 64° | Home ✓ | 1B – + Home ✓ | Home |
| fayetteville-woodpeckers | 10° | 43° | Home ✓ | 1B – + Home ✓ | Home |
| fredericksburg-nationals | 340° | 67° | Home ✓ | 1B – + Home ✓ | Home |
| great-lakes-loons | 340° | 91° | Home – | 1B ✓ + Home – | 1B |
| greensboro-grasshoppers | 340° | 53° | Home ✓ | 1B – + Home ✓ | Home |
| greenville-drive | 340° | 27° | Home ✓ | 1B – + Home ✓ | Home |
| hartford-yard-goats | 350° | 103° | Home ✓ | 1B ✓ + Home ✓ | 1B + Home |
| hickory-crawdads | 40° | 35° | Home ✓ | 1B – + Home ✓ | Home |
| hudson-valley-renegades | 350° | 84° | Home ✓ | 1B ✓ + Home ✓ | Home + 1B |
| indianapolis-indians | 315° | 55° | 3B – | 3B – | Home |
| inland-empire-66ers | 340° | 45° | Home ✓ | 1B – + Home ✓ | Home |
| jersey-shore-blueclaws | 10° | 58° | Home ✓ | 1B – + Home ✓ | Home |
| jupiter-hammerheads | 335° | 59° | Home ✓ | 1B – + Home ✓ | Home |
| kannapolis-cannon-ballers | 340° | 42° | Home ✓ | 1B – + Home ✓ | Home |
| lake-county-captains | 340° | 45° | Home ✓ | 1B – + Home ✓ | Home |
| midland-rockhounds | 340° | 120° | Home – | 1B ✓ + Home – | 1B |
| modesto-nuts | 40° | 179° | Home ✗ | 1B ✓ + Home ✗ | 1B |
| montgomery-biscuits | 340° | 14° | Home ✓ | 1B ✗ + Home ✓ | 3B + Home |
| myrtle-beach-pelicans | 340° | 154° | Home – | 1B ✓ + Home – | 1B |
| new-hampshire-fisher-cats | 55° | 38° | 1B – | 1B – + Home ✓ | Home |
| northwest-arkansas-naturals | 340° | 57° | Home ✓ | 1B – + Home ✓ | Home |
| palm-beach-cardinals | 335° | 59° | Home ✓ | 1B – + Home ✓ | Home |
| peoria-chiefs | 65° | 50° | 1B – | 1B – + Home ✓ | Home |
| rocket-city-trash-pandas | 340° | 121° | Home – | 1B ✓ + Home – | 1B |
| rome-braves | 340° | 19° | Home ✓ | 1B – + Home ✓ | Home |
| salem-red-sox | 25° | 158° | Home – | 1B ✓ + Home – | 1B |
| san-jose-giants | 50° | 196° | 1B ✓ | 1B ✓ + Home ✗ | 1B |
| south-bend-cubs | 90° | 44° | 1B – | 1B – + Home ✓ | Home |
| spokane-indians | 330° | 136° | Home – | 1B ✓ + Home – | 1B |
| st-lucie-mets | 335° | 17° | Home ✓ | 1B ✗ + Home ✓ | Home + 3B |
| stockton-ports | 50° | 121° | 1B ✓ | 1B ✓ + Home – | 1B |
| tri-city-dust-devils | 340° | 181° | Home ✗ | 1B ✓ + Home ✗ | 1B |
| tulsa-drillers | 340° | 158° | Home – | 1B ✓ + Home – | 1B |
| vancouver-canadians | 45° | 213° | 1B – | 1B – + Home ✗ | none clear |
| wilmington-blue-rocks | 340° | 13° | Home ✓ | 1B ✗ + Home ✓ | Home + 3B |
| winston-salem-dash | 20° | 59° | Home ✓ | 1B – + Home ✓ | Home |

**Agree (17)**

| Park | Stored | Measured | Old answer | Guide, afternoon | Now names |
|---|---|---|---|---|---|
| birmingham-barons | 350° | 104° | Home ✓ | Home ✓ | Home + 1B |
| bowie-baysox | 350° | 25° | Home ✓ | Home ✓ | Home |
| bradenton-marauders | 0° | 44° | Home ✓ | Home ✓ | Home |
| clearwater-threshers | 350° | 45° | Home ✓ | Home ✓ | Home |
| columbia-fireflies | 340° | 118° | Home – | Home – | 1B |
| columbus-clippers | 315° | 133° | 3B ✗ | 3B ✗ | 1B |
| dunedin-blue-jays | 335° | 139° | Home – | Home – | 1B |
| fort-myers-mighty-mussels | 335° | 27° | Home ✓ | Home ✓ | Home |
| iowa-cubs | 60° | 36° | 1B – | 1B – | Home |
| lakeland-flying-tigers | 340° | 38° | Home ✓ | Home ✓ | Home |
| las-vegas-aviators | 315° | 43° | 3B – | 3B – | Home |
| lehigh-valley-ironpigs | 90° | 50° | 1B – | 1B – | Home |
| richmond-flying-squirrels | 350° | 104° | Home ✓ | Home ✓ | 1B + Home |
| salt-lake-bees | 315° | 99° | 3B ✗ | 3B ✗ | 1B |
| toledo-mud-hens | 90° | 86° | 1B ✓ | 1B ✓ | 1B + Home |
| wichita-wind-surge | 10° | 43° | Home ✓ | Home ✓ | Home |
| worcester-red-sox | 45° | 49° | 1B – | 1B – | Home |

**Can't compare (5)**

| Park | Stored | Measured | Old answer | Guide, afternoon | Now names |
|---|---|---|---|---|---|
| oklahoma-city-dodgers | 5° | 54° | Home ✓ | Sections 109-115, Club Level | Home |
| reno-aces | 340° | 25° | Home ✓ | Sections 112-118, Club Level | Home |
| round-rock-express | 340° | 43° | Home ✓ | Sections 113-119, Suites | Home |
| sugar-land-space-cowboys | 340° | 126° | Home – | Sections 110-116, Club seats | 1B |
| tacoma-rainiers | 340° | 31° | Home ✓ | Sections 11-17, Press Level | Home |

**No guide (2)**

| Park | Stored | Measured | Old answer | Guide, afternoon | Now names |
|---|---|---|---|---|---|
| columbus-clingstones | 340° | 88° | Home ✓ | (none) | 1B + Home |
| knoxville-smokies | 85° | 142° | 1B ✓ | (none) | 1B |

### §27 Review (2026-11-23)

**What changed:** 5 commits on `claude/festive-haslett-850afa`.
- *Directions* (G1, G2): all 120 parks are measured and in the data, with
  the script (`scripts/measureMilbOrientation.py`), the record of each
  (`milbOrientationMeasurements.ts`) and a test that keeps the data files in
  step. Against the old values: a median of 74° off, 88 more than 45° off,
  10 within 15°.
- *The answer* (G3): `dayGameShadeSides` in `shadeSide.ts` replaces the
  due-south rule. It names one side at 99 parks, two at 19, and says no side
  has a clear edge at 2 (Hillsboro, Vancouver). The old side isn't among the
  new ones at 62 parks.
- *The guide* (G4, G5): the "Best Shaded Sections by Time", "Shade Tips" and
  monthly shade tips are gone from MiLB and NFL pages, with the flag that hid
  them for NFL. 231 other side claims are deleted from the four MiLB guide
  files. Roofs ("Covered Sections 200-208") and levels ("Club Level") stay:
  they don't depend on the direction.

**Better than the plan's measuring.** G1 re-measured every park centered on
its own mound, at twice the detail, on two photos:
- The two photos agree to a median of 1° (5° at most) at the 97 parks where
  both match well. On 21 MLB parks the NAIP fit is within 5°.
- 2025 Sentinel-2 images (10 m pixels, the same fit) agree at all 108 of the
  photo-measured parks where they give a fit.
- Knoxville and Columbus are measured after all, from Sentinel-2 (142° and
  88°), so no park is left out. Salt Lake and Vancouver use it too, and
  agree with their OpenStreetMap outlines.
- It caught one mistake: Montgomery is 14°, not the 55° in the plan. That
  was a weak match (0.73) I had wrongly accepted by eye. Every photo fit was
  looked at again at its final value. The other parks moved 5° or less.

With the final directions the plan's table reads (120 parks):

| | ✓ | – | ✗ |
|---|---|---|---|
| Before: old directions, sun due south | 58 | 46 | 16 |
| Old directions, the sun's path | 36 | 50 | 34 |
| Measured directions, sun due south | 80 | 40 | 0 |
| Now: measured directions, the sun's path | 118 | 2 | 0 |

**Checks:**
- *Tests:* 3,860 of 3,860, 252 of them new: the directions, the sides, the
  answer's wording, the removed lists and the guide text. Each of the five
  files failed before its change. The type check is clean; eslint gives no errors (its 1
  warning is on an old line). The production build passes.
- *All 120 pages* on the dev server: 118 show the side worked out separately
  in Python, and none shows an old phrase. Knoxville and Columbus show no
  answer, as before (below).
- *Pages looked at:* Isotopes Park (behind home plate, faces NE), Sahlen
  Field (first base, SSE), Sutter Health Park (behind home plate, NE, like
  the Athletics' page), Regions Field (two sides), Ron Tonkin Field (none
  clear) and Lambeau Field (unchanged). No console or server errors.

**Added after the review** (asked, 2026-11-23): /attributions credits the
aerial photos and the Copernicus Sentinel images behind the MiLB directions.
Checked against the record: 102 values are from NAIP photos, 12 from the USGS
layer, and 6 from Sentinel-2, all 2025 images: Knoxville, Columbus, Salt Lake
and Vancouver, and Nashville and Fresno, where neither photo is a clear match.
Those last two were recorded as `photo`, ±5°, by the one-off writer that made
the file, so a re-run measured something else (found by the session that asked
for the credit). They're `satellite`, ±8°, now, with a test that each value is
the one its method gives (120 cases). No value changed. The ±8° is measured:
where four clear dates agree within 12°, their median is within 8° of the
known direction at 85 of 86 parks (9 MLB, 77 MiLB), and 8.5° off at worst. All
the 2025 dates give 151° for Nashville (recorded 150°) and 99° for Fresno
(100°).

**Corrections to the plan:**
- G2 doesn't fix the finder, whose MiLB section layouts are wrong for a
  reason of their own. (Corrected 2026-11-23: this first said every MiLB
  section is 90° off. That is so at 35 parks. At 82, the sections were laid
  out from the old wrong directions, and 3 can't be placed. §28, on
  `claude/admiring-austin-0ae2e0`, has the findings.) What G2 does to it:
  - At the 82, the old direction canceled out before, so the first section
    sat at about 115° at every one of them. Now it turns with the
    correction. Neither means anything.
  - At the 35, every section is now 90° off. 29 of them were further off
    before and 6 were closer, 2 of those (Daytona, St. Paul) nearly right by
    luck, 12° off.
- The game-day tip was Oklahoma City's, not Las Vegas's.
- G5 also found 3 "…for day games" entries in Things to Avoid.

**Not changed (noticed):**
- The finder's MiLB sections, above (§28 has a plan).
- The two pages with no guide (Knoxville, Columbus) return before the answer
  block, so they show no answer or title.
- The Salt Lake guide describes Smith's Ballpark; the Bees' 2025 park is The
  Ballpark at America First Square.
- /how-it-works, which the answer links to, says nothing about how the MiLB
  or NFL side is worked out.
- `StadiumGuide.css` keeps the removed lists' rules (the unimported
  `MobileStadiumGuide` uses them).

## §28 MiLB sections in the finder (plan, 2026-11-23)

Asked: is every MiLB section in `/seats-shade-finder` 90° off, are the
layouts real seating maps, and what should be done? Branch
`claude/admiring-austin-0ae2e0`, from §27's branch (1695d3a52). Nothing but
this file has changed.

**In short:** no one angle fixes it. The layouts use two frames that run
opposite ways, and 82 of the 120 were laid out from the old, wrong park
directions. They aren't seating maps either: 10 of the 12 parks I could
check have sections ours lacks. I recommend the finder stop listing MiLB
sections and name a side for the game the fan picked.

### Findings

**1. Which way the angles run, park by park** (2,231 sections):

| | Parks | Sections | What the angles count from |
|---|---|---|---|
| A | 32 | 794 | Behind home (0), then first base 90, center 180, third base 270 |
| B | 82 | 1,261 | The old stored direction: the first section starts 30° before it |
| ? | 3 | 52 | Near the old direction, but not exactly 30° before: can't be placed |
| T | 3 | 124 | No layout; the `generateBaseballSections` template, as A |

- *A* is the 29 AAA layouts plus Daytona, Fort Myers and Lakeland. The
  numbered bowl is centered on 0 (within 12°) whatever the park's stored
  direction was. 36 areas at 22 parks have a name that gives a side (Home
  Plate Club, Left Field Pavilion and so on), and all 36 sit on that side.
  Here and in T, and nowhere else, "90° off" is right (§27's review first
  said it of every park, and has since been corrected).
- *B* is AA, A+ and A. The first section listed (101 at 69 parks, 1, 100 or
  A at the rest) is at *exactly* the old direction minus 30° at all 82, over
  24 different stored directions from 0° to 350°. Each next one is 10° on at
  75 of them, 8–15° at the rest. 25 of these parks had 340°, so they start
  at 310° and could pass for A; the other 57 show the rule.
- Those directions were wrong by a median of 74°, so the B angles never
  described the park. The seats are laid out around the way the park
  *faces*, which is center field, so this only makes sense as the way each
  section faces.
- *B also runs the other way round from A.* Only 5 B parks have a side in a
  name (Portland, Greenville, Richmond, Wichita, West Michigan), and all 5
  put left field at the high-angle end; A puts right field there. The other
  77 B parks name no side, so which way their numbers run can't be told.
- *Can't be placed:* Akron, Altoona and Binghamton (the frame), and the 77 B
  parks above (the direction). Reno and Sugar Land fit both rules; as AAA
  I count them as A.
- *The template* has its Left Field and Right Field GA swapped, and its
  "Reserved" rows run into the outfield.

**2. How the data reaches the page.** The finder is the only place these
sections show. Nothing else that imports them is reachable from a page.

| | Desktop (`UnifiedApp`) | Mobile (`MobileApp`, up to 768 px) |
|---|---|---|
| Sections | `getVenueSections`, else the template | the same |
| Shade | `getUnifiedVenueShade`, at first pitch only | `SunCalculator`, 3 hours |
| Direction | `sectionCompassAngle` | `sectionCompassAngle` |
| Label | `101` | `Section sec-101`, `Section lower-1b-1` |

So the two finders don't agree with each other. Over six 2025 Sundays at
1:05 PM the same section differs by a median of 8 points and up to 56, and
391 of the 2,231 are sunny (50% or more) in one and shaded in the other.

*NFL* goes through the same two functions with its own sections
(`VENUE_SECTIONS`, `NFL_SECTIONS`), so changing `sectionCompassAngle` would
also move MLB and NFL. Anything done for MiLB has to stay behind
`league === 'MiLB'`. NFL has its own version of this fault (see "Not in this
plan").

**3. How wrong today's answers are.** 35 parks (A and T) can be judged by
their own labels. Over the same six Sundays, the shadiest infield side in the
mobile finder is one of the page's sides at 5 of them.

**4. Are they seating maps? No.**
- They came in a run of commits on 2025-08-04 and 05 (7a4fa0f50 to
  33fe8efde) with no source. The scripts are in `dev-scripts/`: one renames
  "Section 105" to "105", and another then counts three-digit names as real.
- Templates: 117 layouts use 49 lists of section numbers. 17 parks share one
  (101–108, 201–205), 14 share another, 11 and 10 two more. Nine parks have
  lower sections lying on top of each other (46 pairs).
- 74 parks put section 201 straight above 101, the same width. 100 parks
  have an "upper" level, 69 of them holding under 8,000. The lower bowl
  covers a median of 80° in B, where a real one runs from pole to pole.
- 650 sections (29%) are marked covered, so they read 0% sun at any hour,
  and no source says they have a roof.
- 153 berm and general-admission areas are rated as a lower bowl with a
  45 ft stand behind it (`BOWL_DEFAULTS` in `bowlGeometry.ts`, "a generic
  MLB seating bowl").
- Against published lists, 12 parks where I found any:

  | Park | Published | Ours |
  |---|---|---|
  | Greenville | 101–120; home 107–109; Pesky's Porch 116–120 | 100–107, 200–204 |
  | Birmingham | 106–110 home; 111–113 first base dugout; up to 119 | 101–110, 201–206 |
  | Indianapolis | 103–125, 201–219; home 110–113; third base 107 | 101–122 |
  | Dayton | 104–116, 201–210 | 101–108, 201–206 |
  | Toledo | 101–122; 119 beyond left field | 100–115, 200–209 |
  | Las Vegas | 100–127; club 209–214 | 101–117 |
  | Portland | 101–114 | 101–110, 201–206 |
  | Tulsa | 101–105, 109, 112, 114, 116 | 101–110, 201–205 |
  | Beloit | 105, 107, 108, 109 | 101–107, 201–204 |
  | Delmarva | 111 | 101–107, 201–205 |
  | Gwinnett | 101, 106, 109, 111, 113 | 101–115 (no conflict) |
  | Buffalo | 100 behind home; 201 | 100–124, 201–212 (no conflict) |

  Greenville, Birmingham and Dayton are the teams' own pages; the rest are
  ticket guides and fans' seat photos. I read them through web-search
  extracts, because the pages refuse automated reading, so this is enough to
  show the lists differ but not to correct them.

**5. Would converting the angles help?**
- *Subtracting 90°* helps A and T: the shadiest side is then one of the
  page's sides at 29 of 35. It does nothing for the other 85.
- *Converting each group its own way* still misses. Ten sections at three
  parks (Greenville 107; Birmingham 106–110; Indianapolis 107, 110, 112,
  113) have a published position. Today they're 105–170° off (median 140°).
  Converted, they're 25–122° off (median 56°), because the numbers
  themselves are invented. At Greenville the real numbers rise toward right
  field, and ours toward the Green Monster in left.
- *Real maps* for 120 parks, plus the height of the stands behind each
  section, is what §6 to §24 did for 30 MLB parks.

So a conversion would make made-up sections look more certain. The page
already tells fans "this guide can't say which sections or rows are shaded";
the finder says the opposite, with a percentage, and the finder page adds
"each answer is labelled High, Medium or Low confidence", which no MiLB or
NFL answer is.

**6. The page's answer isn't enough by itself.** It is for a 1:05 PM game.
The finder knows the fan's game, and 77% of 2025 MiLB games were at night.
At the 8,126 games played in 2025 at the 118 parks the finder has a schedule
for:
- the sun was up for some of the game at all but 13 of them;
- the sides are the same as the page's 1:05 PM answer at 1,715 (21%);
- the leading side isn't in the page's answer at all at 4,315 (53%).

The same rule, run for the game's own hours, holds up. On the 27 MLB parks
with stand profiles, the sides it names include the shadiest infield side (or
one within 2 points) at 22 at 1:05 PM (as §27), 27 at 4:05, 5:05, 6:05 and
6:40, and 26 at 7:05. At
6:40 PM the sides differ by more than 10 points at 20 parks; the rule names
the shadiest at all 20 and the sunniest at none.

### Plan (waiting for your go-ahead)

- [x] H1. `shadeSide.ts`: take the loop out of `dayGameShadeSides` as
      `shadeSides(venue, starts)`, leaving out samples when the sun is down.
      `dayGameShadeSides` calls it with its six Sundays, so no page changes.
      Tests first: an evening game, a game after sunset, and all 120 day
      answers the same as before.
- [x] H2. `ShadeAnswer`: an optional game time. With it, the MiLB sentence is
      about that game ("For the 6:35 PM game on July 12 at Sahlen Field, the
      … tends to shade first"), plus "The sun sets at …", or "the sun is down
      for the whole game". It keeps "We don't have a seating map for this
      park". Without it, unchanged (test).
- [x] H3. `UnifiedApp` and `MobileApp`: for MiLB, show H2's answer instead of
      the section list, its filters and its explanation, as they already do
      for MLB. Tests: a MiLB venue shows the answer and no sections; NFL
      still lists the same sections with the same numbers; MLB unchanged.
- [x] H4. Delete what nothing uses then (own commit): the MiLB branch of
      `getVenueSections`, `milbVenueLayouts.ts`, `milbVenueLayoutsLower.ts`,
      `venueLayoutIntegration.ts`, `generateBaseballSections.ts` (4,400
      lines, 349 KB of source, all in the finder's download today), the
      unreachable modules tied to them (`data/index.ts`, `venueCorrections`,
      `stadiumDataIntegration`, `stadiumLayoutEnhancer`,
      `allRealStadiumLayouts`), and `scripts/verifyLayouts.ts`.
      `auditCoverageContradictions.ts` loses its MiLB line.
- [x] H5. `/seats-shade-finder` copy: MLB and NFL by section, MiLB by side,
      and no confidence label where there is none.
- [x] H6. Checks: unit tests, type check, eslint, build; every MiLB park in
      both finders against a separate calculation (day, evening, after
      sunset); NFL's list before and after, byte for byte; a look at Buffalo,
      Hillsboro and Lambeau. Then the review.

One PR, one commit per step. H4 could wait, but it's what stops the layouts
being used again.

**For you to decide:**
1. Go ahead with H1–H6? (I'd say yes.)
2. NFL's list has a fault of the same kind (below). Leave it for its own plan
   (my pick: it needs its own checks), or include it here?

**Not in this plan (noticed):**
- *NFL:* the field's direction is its long axis, but the sections' labels
  put an end zone at 0, so the finder turns every one by 90°. By their own
  `sideType`, 0 of 580 end-zone sections are placed at an end zone, and 0 of
  580 sideline sections on a sideline. 29 of the 32 stadiums share one
  60-section list (Hard Rock and Lambeau have their own; the Chargers have
  none, so the finder shows nothing). `fieldSunSide` in `nflSunSide.ts` already takes a date and a
  kickoff, so the same remedy would work.
- The desktop NFL list rates only kickoff, though its tooltip says the
  percentage is for the whole game; the mobile one covers 3 hours.
- Down East and Palm Beach aren't in `milbTeamMapping.ts`, so picking them
  from the schedule gives "Venue configuration error".
- Unreachable already: `milbStadiumSections.ts`, `unifiedStadiumShade.ts`,
  `optimizedSunCalculations.ts`, `stadiumSectionGenerator.ts`,
  `realStadiumSections.ts`, `realStadiumLayouts/`, and
  `SmartItinerariesPage` with its service. H4 doesn't cover these.

The scripts and data are in the shared notes folder, `milb-finder/`.

### Every park

- **A** (32): Albuquerque, Buffalo, Charlotte, Columbus Clippers, Daytona,
  Durham, El Paso, Fort Myers, Fresno, Gwinnett, Indianapolis, Iowa,
  Jacksonville, Lakeland, Las Vegas, Lehigh Valley, Louisville, Memphis,
  Nashville, Norfolk, Oklahoma City, Omaha, Reno, Rochester, Round Rock,
  Salt Lake, Scranton, St. Paul, Sugar Land, Syracuse, Tacoma, Toledo.
- **?** (3): Akron, Altoona, Binghamton.
- **T** (3): Rome, Sacramento, Worcester.
- **B** (82): every other park. The first section starts at the old stored
  direction minus 30°, in full:

  | Old | Starts | Parks |
  |---|---|---|
  | 0° | 330° | bradenton-marauders |
  | 10° | 340° | charleston-riverdogs, fayetteville-woodpeckers, jersey-shore-blueclaws, wichita-wind-surge |
  | 20° | 350° | biloxi-shuckers, winston-salem-dash |
  | 25° | 355° | amarillo-sod-poodles, salem-red-sox |
  | 40° | 10° | down-east-wood-ducks, hickory-crawdads, modesto-nuts |
  | 45° | 15° | vancouver-canadians |
  | 50° | 20° | fort-wayne-tincaps, frisco-roughriders, reading-fightin-phils, san-jose-giants, stockton-ports |
  | 55° | 25° | dayton-dragons, new-hampshire-fisher-cats |
  | 60° | 30° | tampa-tarpons |
  | 65° | 35° | peoria-chiefs |
  | 70° | 40° | cedar-rapids-kernels |
  | 85° | 55° | knoxville-smokies |
  | 90° | 60° | asheville-tourists, delmarva-shorebirds, south-bend-cubs |
  | 115° | 85° | chattanooga-lookouts |
  | 160° | 130° | quad-cities-river-bandits |
  | 195° | 165° | brooklyn-cyclones |
  | 225° | 195° | augusta-greenjackets, pensacola-blue-wahoos |
  | 250° | 220° | harrisburg-senators |
  | 310° | 280° | springfield-cardinals |
  | 315° | 285° | bowling-green-hot-rods, hillsboro-hops, lake-elsinore-storm, lansing-lugnuts, lynchburg-hillcats, portland-sea-dogs, rancho-cucamonga-quakes, san-antonio-missions, somerset-patriots, visalia-rawhide, west-michigan-whitecaps, wisconsin-timber-rattlers |
  | 330° | 300° | spokane-indians |
  | 335° | 305° | dunedin-blue-jays, jupiter-hammerheads, palm-beach-cardinals, st-lucie-mets |
  | 340° | 310° | aberdeen-ironbirds, arkansas-travelers, beloit-sky-carp, carolina-mudcats, columbia-fireflies, columbus-clingstones, corpus-christi-hooks, erie-seawolves, eugene-emeralds, everett-aquasox, fredericksburg-nationals, great-lakes-loons, greensboro-grasshoppers, greenville-drive, inland-empire-66ers, kannapolis-cannon-ballers, lake-county-captains, midland-rockhounds, montgomery-biscuits, myrtle-beach-pelicans, northwest-arkansas-naturals, rocket-city-trash-pandas, tri-city-dust-devils, tulsa-drillers, wilmington-blue-rocks |
  | 350° | 320° | birmingham-barons, bowie-baysox, clearwater-threshers, hartford-yard-goats, hudson-valley-renegades, richmond-flying-squirrels |

### §28 Review (2026-11-23)

Go-ahead: "go ahead with the finder plan", and later "Yes, delete them" for
H4, both passed on by the session that started this group. NFL wasn't asked
for, so it's left. `main` (§27, PR #103) was merged in first: the finder's
data is identical, so no number above moved.

**What changed:** 6 commits on `claude/admiring-austin-0ae2e0`.
- *The rule* (H1): `shadeSides(venue, starts)` in `shadeSide.ts` is the loop
  from `dayGameShadeSides`, leaving out the time after sunset. `gameShade`
  adds the time, date and sunset in the park's time zone.
- *The answer* (H2): `ShadeAnswer` takes one game. "For the 6:35 PM game on
  July 20 at Sahlen Field, the first base side and the seating behind home
  plate tend to shade first … The sun sets at 8:48 PM." The sunset is given
  only if it falls during the game. A game after sunset says so instead.
- *The finders* (H3): both show that answer for a MiLB game, with no
  section list, filters or percentages. NFL keeps its list, MLB its link.
- *Copy* (H5): `/seats-shade-finder` says MiLB gets a side of the park and
  that MLB answers carry a confidence label. The finder's empty state said
  "see which sections" for MiLB too, and no longer does.
- *The layouts* (H4): the ten files in the plan are gone, with the MiLB part
  of `getVenueSections` and the audit script's MiLB line. That is 5,661
  lines, not the 4,400 the plan gave: 4,366 in the four main files, and the
  rest in the modules tied to them. Checked again before deleting: nothing
  that stays imported any of them (app, tests, scripts, dynamic imports).
  The finder chunk that held them was 499 KB (84 KB gzipped); the one with
  the section lists left is 230 KB (60 KB).

**Checks:**
- *Tests:* 4,005 of 4,005, 25 of them new. Each was seen to fail before its
  change, except the NFL and MLB ones (in `finderMilb.test.tsx` and
  `venueSections.test.ts`), which guard what must not change. The type check
  is clean; eslint gives no errors (its warnings are on old lines). The
  production build passes.
- *Every MiLB park:* 720 answers (120 parks, both finders, 1:05 PM and
  6:35 PM on July 20 and 9:05 PM on September 14, 2025) against a separate
  calculation in Python (the NOAA equations, not this code): all 720 have the
  right sides, sunset and times, and none shows a section. At 6:35 PM one
  side is named at 89 parks and two at 31.
- *Nothing else moved:* the 120 day answers on the pages, and everything both
  finders work out for the 32 NFL stadiums at two kickoffs, are byte for byte
  the same before and after, H4 included.
- *In a browser* (dev server): Sahlen Field at 6:35 PM and 8:35 PM, Ron
  Tonkin Field at 1:05 PM (no side clear), Lambeau Field (12 sections, as
  before), Yankee Stadium (its link); and Sahlen Field on mobile through the
  real selector. No server errors.

**Noticed (not changed):**
- NFL's schedule can't load in the finder: the site's Content Security Policy
  doesn't allow `site.api.espn.com`. A custom time still works.
- On phones a site-wide rule pads every link (`app-utilities.css`,
  `mobile.css`), so the period after "How we work this out" strays. The MiLB
  pages have the same.

## §29 NFL sections in the finder (plan, 2026-11-23)

Asked: plan the fix for the finder's NFL section list, which §28 left for its
own plan. Branch `fix/nfl-finder-sections`, from §28's branch (6445cee8f,
PR #104, not merged yet), because it extends §28's code. Nothing but this
file has changed.

**In short:** the list is wrong at every stadium and can't be corrected from
what we have. The NFL page's answer (which sideline has the sun at its back)
is sound, and it already takes a date and a kickoff. So the finder should
give that answer for the game the fan picked, as §28 does for MiLB.

### Findings

**1. Where the list's angles point.** Every section has a label: end zone,
home sideline, visitor sideline or corner. The finder turns `baseAngle` into
a compass bearing with `sectionCompassAngle` (orientation + 90 − center),
which fits baseball, where 0 is first base. These lists put an end zone at
0, and a field's `orientation` is its long axis, so every one of them is 90°
off. Counted over all 32 stadiums (1,818 sections):
- 0 of 580 end-zone sections are placed at an end zone;
- 0 of 580 sideline sections are placed on a sideline.

This is §28's fault again, at all 32 and not at 35.

**2. It isn't a seating map.**
- 29 of the 32 stadiums share one list of 60 sections (101–136 and 301–324,
  no overhang anywhere). Hard Rock Stadium has 66 of its own and Lambeau
  Field 12. The Chargers have none, so the finder shows nothing there.
- Turning them 90° would put the labels right, but not the numbers. Nothing
  says which end zone is at 0, or which way round the numbers run, so we
  can't say which side of the field "Section 110" is on.

**3. What fans are told today.** For the 2025 regular season (ESPN's
schedule: 265 home games without a neutral site, 216 of them where the roof
opens):
- The sun is up at kickoff at 171. At 110 of those the list's shadiest
  section is labelled end zone, at 36 a corner, at 14 a sideline and at 11
  it has no label (Lambeau).
- At 148 of the games with a measured direction and a list, putting each
  section where its own label says reverses which is shadier, the sidelines
  or the end zones, at 82.

**4. The page's answer, for a fan's own game.** For the 200 games at the 24
stadiums with an opening roof and a measured direction:
- The sun is up for some of the game at 159 and down for all of it at 41.
- The answer for the game is the page's own text for that kickoff window at
  152 of the 159. It never names the other sideline. At 7 the edge is clear
  for the game but not for the page's date, or the reverse.
- 49 home games are under a fixed roof (shaded) and 16 at AT&T Stadium and
  Lucas Oil Stadium, whose direction we couldn't measure (the answer says
  so).

So a game-specific answer changes little, but the page's answer isn't what
the finder shows: the finder is showing the list.

**5. The other list.** The mobile finder runs the same sections through
`SunCalculator`. I haven't measured it separately. It uses
`sectionCompassAngle` too (§28, finding 2).

**6. Faults in the NFL schedule** (found on the way; see "To decide"):
- *It never loads on the live site.* The site's security policy
  (`middleware.ts:54`, `connect-src`) doesn't allow `site.api.espn.com`
  (§28 noted this). In a browser, at Lambeau Field, it took over two minutes
  of failed retries before the typed-date form appeared. That form is right:
  it turns the stadium's clock into UTC.
- *A picked game would get the wrong time.* `nflApiClient.ts:136` keeps only
  the UTC date, and the picker reads it with `new Date(...)`, which is
  midnight UTC: 8:00 PM Eastern the day before for a 1:00 PM kickoff. Of the
  171 games with the sun up at kickoff, the finder's time has it down at
  140. It would also show the wrong day at 170 of the 216. The kickoff
  clock beside it is in the fan's own time zone.
- *The Ravens have the wrong id.* The two team tables say
  `mt-bank-stadium`; the venue is `m-t-bank-stadium`, so their home games
  match no venue. `nflStadiumGuides.ts` has a guide under both ids.

### Plan (waiting for your go-ahead)

- [x] N1. `nflSunSide.ts`: take the loop out of `fieldSunSide` as
      `fieldSunSideAt(venue, start)`, which gives null when the sun is down
      for the whole game (today it throws). `fieldSunSide(venue, date,
      kickoff)` calls it, so no page changes. Add `nflGameShade(venue,
      start)` (time, date, side, sunset), as §28's `gameShade`. Tests first:
      a night game, a game the sun sets on, and all 24 stadiums' answers the
      same as before.
- [x] N2. `ShadeAnswer`: an optional `nflGame`. With it, the sentence is
      about that game ("For the 12:00 PM game on December 6 at Lambeau
      Field, the sun is on the west side of the field, so seats on the west
      sideline have it at their backs and get shade first"), plus the sunset
      if it falls during the game, or "the sun is down for the whole game".
      Unclear, unmeasured and fixed-roof stadiums keep the words the pages
      use. Without it, unchanged (test).
- [x] N3. `UnifiedApp` and `MobileApp`: for NFL, show N2's answer instead of
      the section list, its filters and its explanation, as they do for MLB
      and MiLB. After this no league shows the list. Tests (extending
      `finderMilb.test.tsx`): NFL shows the answer and no sections; MiLB and
      MLB as before; a fixed roof and an unmeasured stadium each say so.
- [x] N4. `/seats-shade-finder` and the empty-state copy: MLB by section;
      MiLB and NFL by side of the field or park; no section, filter or
      percentage is promised for NFL.
- [ ] N5. Delete what nothing uses then (own commit, after N3). Today only the
      two finders use these, 1,530 lines in all: `SectionList` (399),
      `SectionFilters` (320), `MobileFilterSheet` (302), `getUnifiedVenueShade`
      (251, and the part of `shadeDirection.test.ts` that tests it),
      `SunExposureExplanation` (166) and `MobileSectionCard` (92). These might
      go too, 1,468 more lines, but other code uses them: `EnhancedSunFilter`
      (697, `preferences.ts`), `venueSections` (420, `sunCalculations.ts` and
      the audit script) and `nflSections` (351, `venueSections` and a script).
      I'd check every import again after merging and ask before deleting any
      file.
- [x] N6. Checks: unit tests, type check, eslint, build; all 32 stadiums in
      both finders at 1:00 PM, 4:25 PM and night against a separate
      calculation in Python; MLB and MiLB answers byte for byte as before;
      NFL pages unchanged; a look at Lambeau (open), Lumen, AT&T
      (unmeasured), Allegiant (fixed) and the Chargers. Then the review.

One PR, one commit per step. N5 could wait.

**For you to decide:**
1. Go ahead with N1–N4 and N6, and N5 now or later?
2. The schedule faults (finding 6). Fix them in their own plan (my pick:
   loading the schedule means allowing ESPN in the site's security policy,
   which should be its own decision), in this one, or not at all? Typed dates
   work right without them.

**Not in this plan (noticed):**
- NFL's schedule (finding 6), unless you choose otherwise.
- A `?venue=` link opened the finder with the League box still showing Major
  League Baseball (seen at Lambeau Field, on the dev server). Fixed in §31.

## §29 Review (2026-11-23)

Approved as planned: N1–N4 and N6, with N5 held for a decision on each
deletion and the schedule left for its own plan. Commits on
`fix/nfl-finder-sections`, with `main` (bb77e58af, #104) merged in.

**What changed**
- *N1 (ef1c5c81c):* `fieldSunSideAt(venue, start)` is the loop from
  `fieldSunSide`, and is null when the sun is down for the whole game.
  `nflGameShade` adds the kickoff, date and sunset in the stadium's time. The
  part that gives those is now one helper, `gameClock.ts`, which MiLB's
  `gameShade` uses too.
- *N2 (696695558):* `ShadeAnswer` takes `nflGame`. The page's own sentence is
  one function, so both use the same words.
- *N3 (a236c4fa8):* both finders show that answer for NFL, and no league shows
  a section list, its filters or percentages. The code the list needed came
  out of `UnifiedApp.tsx` and `MobileApp.tsx`; the files are still there (N5).
- *N4 (ce91e6ded):* `/seats-shade-finder` says MiLB and NFL get a side, and
  the "Choose from…" line covers all three leagues.

**Checks**
- *Every stadium:* 576 answers (32 stadiums, both finders, 1:00, 4:25 and 8:20
  PM on three 2025 dates) match a separate calculation in Python (the NOAA
  equations, none of this code): 266 clear, 8 unclear, 158 with the sun down,
  108 under a fixed roof, 36 not measured. None shows a section list.
- *Nothing else moved:* the 96 page answers (32 stadiums, three dates), the
  480 MiLB game answers, and the text of the 32 NFL pages' answers against the
  live site are all the same as before.
- *In a browser:* Lambeau Field, Lumen Field (sunset 4:18 PM), AT&T Stadium
  (not measured), Allegiant Stadium and the Chargers' SoFi Stadium (fixed
  roofs) on desktop; after §31 was merged in, Lambeau Field and Sahlen Field
  through a link on a phone-size window, and AT&T Stadium's league box.
- *Tests:* 4,027 of 4,027; the type check and the production build pass;
  eslint gives no errors (its 9 warnings are the page's old ones and one old
  hook warning). **One thing I couldn't explain:** in my first two full runs
  `stadiumShadeConfidence.test.ts` failed to run at all. Nothing in it
  changed, it passes alone, and eight later full runs (two with the dev
  server under load) passed. I found no process kill in the system log. CI
  runs it on a fresh machine.

**After merging `fix/finder-leftovers`** (asked, 2026-11-23; its section is §31)
- The three conflicts: `MobileApp.tsx` and `UnifiedApp.tsx` (this branch had
  removed the section code its changes sat in; the typed sun position is kept)
  and this file.
- 4,038 of 4,038 tests (100 suites), the type check clean, eslint 0 errors;
  576 of 576 NFL answers; the MiLB and NFL page answers identical to before.

**Not done**
- N5 (the deletions). Another session's plan (§30 on
  `claude/agitated-sanderson-94f055`) counts 19 unreachable files (4,970
  lines) after N3, where this one found 6. The deletion is left to that plan.
- §30 also found two things in this answer: it never names the end zone with
  the sun at its back, and AT&T and Lucas Oil say "can't yet say" after
  sunset. Both are in its plan.
- The schedule (finding 6), in its own plan. Until then, a fan types the
  date and time. The finder waits two minutes or more for the schedule to
  fail before it offers that.
- The homepage still links "Shaded sections at MetLife Stadium (NFL)", and
  that page gives a sideline.

## §30 NFL in the finder: checks on §29, and what it leaves (plan, 2026-11-23)

Asked: investigate the NFL section list in `/seats-shade-finder`, weigh
correcting its angles against naming a sideline, and plan the fix. Branch
`claude/agitated-sanderson-94f055`, from `main` at bb77e58af. Nothing but
this file has changed.

**Overlap:** while I worked, the main session planned and built that same fix
on `fix/nfl-finder-sections` (its §29, N1–N4 and N6; merged since as PR #105,
with §31). I don't plan the list again: findings 1–5 are separate checks on
that choice, and the plan is what it leaves.

**In short:** naming a sideline is right, and correcting the angles would
have made the answers worse. §29's answer is the same as mine at all 212
games of 2025 it applies to. Three things are left: the schedule (allowing
ESPN in the security policy, by itself, would put 210 of 263 games on the
wrong day), the end zone that shades best, and the unused files.

### Findings

**1. Rotation: confirmed.** 1,818 sections at 31 stadiums.
- The template: 0 of 580 end-zone sections are at an end zone (they're
  65–85° from one) and 0 of 580 sideline sections on a sideline (5–25° from
  an end zone). Hard Rock's, by the labels in `nflSections.ts`: 0 of 24 and
  0 of 42.
- Lambeau's 12 areas are named by compass side, and are 35–145° from it:
  "East" is placed northwest and "West" southeast. "Northwest 6" has the same
  angle as "North 3".
- *Cause:* three frames. `sectionCompassAngle` is baseball's (0 = first
  base). The lists put an end zone at 0, and the type's own comment says
  "from north". `getUnifiedVenueShade` says baseball's rotation "applies to
  the generated football layouts", which was never so.

**2. Are the lists real? No.**
- They came in one commit (ca680f7ae, 2025-08-01, "real sections") with no
  source. 29 stadiums share the template.
- Hard Rock and Lambeau are in both `VENUE_SECTIONS` and `NFL_SECTIONS`. The
  first wins, so 12 club sections at Hard Rock and a 60-section Lambeau list
  are never shown.
- SoFi's own list (78) is under `sofi-stadium`, which is no venue's id. The
  Rams get the template, and the Chargers nothing.
- The template stops at 136 and 324 and has no 200s, 400s or 500s. Published:

  | Stadium | Published (side) | Ours |
  |---|---|---|
  | Lambeau | 100–138; odd numbers east (visitors 117, 119, 121), even west (Packers 118, 120, 122) | "Lower East 1" and so on |
  | Hard Rock | 144–148 Dolphins (south), 117–121 visitors (north) | 101–136, 301–330 |
  | Arrowhead | 116–122 Chiefs (west); 101, 102, 136 visitors (east) | 101, 102, 136 as an end zone |
  | Empower | 104–106 Broncos (west), 122–124 visitors (east); 500s | all six as corners; no 500s |
  | Soldier | 101–155, 202–256, 427–447 | 101–136, 301–324 |
  | MetLife | 111–115 Giants (east), 137–140 visitors (west); 201–250 | no 137 up, no 200s |
  | Levi's | 111–119 visitors (east), 135–141 49ers (west) | no 137 up |
  | Lumen | 100–151; 133–137 Seahawks (west), 108–110 visitors (east) | 101–136 |
  | Gillette | 101–143; 101–115 east, 125–138 west | 101–136 |
  | Paycor | 132–148 east, 231–249 | 101–136, no 200s |
  | Bank of America | 107–115 east, 126–136 west; 507–547 | no 500s |

**3. Correct the angles, or name a sideline?** 178 of our sections, at 14
stadiums, have a published side:

| | On that side (within 45°) | Median error |
|---|---|---|
| Today | 47 | 95° |
| Turned 90° back, so every label is right | 24 | 125° |
| The best of four ways round, chosen per stadium | 98 | |

So the labels would come right and the answers worse: the numbers themselves
aren't the stadium's (one way round is best at 9 stadiums and another at 5,
and choosing the best at each still misses 80 sections). The sideline needs
only the field's direction and the sun.

**4. Does the sideline rule hold?** Yes.
- *The same answer, three ways:* on the 212 home games of 2025 (ESPN, with
  playoffs, without neutral sites) at the 24 stadiums without a fixed roof
  and with a measured direction, `fieldSunSide`, the NOAA equations in
  Python, and `nflGameShade` on §29's branch agree at 212. The branch gives a
  sunset at exactly the 32 games it falls in.
- *Against the site's own bowl model* (24 stadiums, six Sundays, lower and
  upper decks): the sideline it names is the less sunny one at 141 of 141 at
  1:00, 137 of 137 at 4:05 and 129 of 129 at 4:25. At 8:20 the sun is down at
  all 144.
- *Against published advice* (two ticket guides, mostly): it names a sideline
  at 22 of the 23 fields at 1:00 PM, and the guides' shaded side is the same
  at all 22 (at Lincoln Financial one page says the reverse). EverBank, where
  it names none, is said to have few shaded seats early on. At 4:25 it names
  22, and 21 agree; for Huntington the guide names the west end zone.

| 2025 home games | Fixed roof | Not measured | Sideline named | No edge | Sun down |
|---|---|---|---|---|---|
| Early (178) | 34 | 7 | 132 | 5 | 0 |
| Late (49) | 11 | 5 | 26 | 1 | 6 |
| Night (50) | 4 | 4 | 2 | 0 | 40 |

- *Retractable (measured):* NRG, Mercedes-Benz and State Farm agree with the
  guides for an open roof.
- *Not measured:* AT&T and Lucas Oil. The list used 340° and 0° all the same,
  and AT&T is published as running southwest–northeast, so 340° was wrong
  there. On §29's branch a game after sunset there (4 of 16 in 2025) still
  gets "we can't yet say which sideline", though the sun is down.
- *Last light:* at 8 games the sun is up for under 30 minutes (1 minute at
  Gillette, January 4). The sentence names a sideline and then the sunset.
  MiLB's does the same.
- **A gap, on the pages too:** it never names the *end zone* with the sun at
  its back. At 35 of the 137 early games the model has that end zone more
  than 5 points shadier than the sideline it names. At 5 of the 6 "neither
  sideline has a clear edge" games it beats the better sideline by 11–28
  points, and the fan is told only about overhangs. The guides name an
  end zone too at Lambeau, NRG, State Farm, Bank of America, EverBank and
  Huntington. MiLB's test (within 60° of the sun's mean direction) would name
  it at 97 of the 166 games with sun, all 35 among them. It's as shady as the
  sideline there (median difference 0), and never 20 points sunnier.

**5. Desktop against mobile** (real code, the 26 stadiums without a fixed roof,
six 2025 Sundays):

| Kickoff | Median difference | Most | Sunny in one, shaded in the other |
|---|---|---|---|
| 1:00 PM | 8 points | 45 | 1,165 of 9,108 (13%) |
| 4:25 PM | 24 points | 100 | 3,178 of 9,108 (35%) |
| 8:20 PM | 0 | 0 | 0 |

- **Mobile rates domes as open air.** Seen at Allegiant, 1:00 PM: "Section
  101 … 89% … Sun for ~160 min", up to 100%; desktop says all 60 are shaded.
  On September 14 at 1:00 PM, 229 of the 300 sections at the five domes with
  a list read 50% or more. `SunCalculator` reads `roofType`, and
  `convertToLegacyStadium` passes `roof`.
- Both go with §29's N3. They are live until it merges.

**6. The schedule** (§29's finding 6, checked separately, and more):
- *Where:* `middleware.ts:54`. Production sends the same policy (both hosts,
  bare URL, build bb77e58af533). `public/_headers` and `_headers` have
  their own, and Vercel reads neither. In a browser the form took 132 seconds.
- *The policy alone makes it worse.* With ESPN's 2025 games through our
  parser, 210 of 263 land on the wrong day. 195 are answered with the sun
  down, and it was up at kickoff at 214. Dolphins, Sunday 1:00 PM: listed as
  "Sep 13, 8:00 PM EDT" and answered for Saturday night. Cause:
  `nflApiClient.ts:136` keeps the UTC date only, and the picker reads that as
  midnight UTC.
- *The year is ignored.* ESPN's scoreboard takes `dates=`, not `season=`:
  asked for 2025, it gave 2026.
- *Neutral sites:* a game abroad gets the home team's stadium (7 in 2025, 9
  in 2026), and a game with no time yet would show as midnight.
- *`User-Agent`:* Chromium drops the header. ESPN refuses the preflight for
  it (403), so Firefox and Safari, which send it, should fail. Not tested.
- *Ravens:* `mt-bank-stadium` in both tables, so they match no venue.
- *No way to type a date once it loads:* the games/custom switch is shown for
  MLB and MiLB only.
- *One request would do:* `teams/{id}/schedule?season=` gives a team's season
  in 14 KB and obeys the year. Now it's up to 18 requests of 14 KB, one after
  another. A browser can read it (200, `access-control-allow-origin: *`).
  ESPN refuses headless browsers, so automated tests need saved responses.
- *The Bills:* ESPN calls the stadium we measured "Highmark Stadium (Old)".
  Their 8 games of 2026 are in the new one, which we don't have.

### Plan (waiting for your go-ahead)

After `fix/nfl-finder-sections` and `fix/finder-leftovers` merge (they change
the same files); they have since. P1–P3 went first, in a PR of their own.

- [x] P1. `nflApiClient.ts`, `nflApi.ts`: one request for the stadium's team.
      Keep ESPN's own instant in `gameDate`, as MLB games do, so the picker
      and the finder read the real kickoff unchanged. Drop the header, fix
      the Ravens' id, leave out neutral sites and games with no time yet.
      Tests first, on saved ESPN responses: Sunday 1:00, Sunday night, a game
      in London, the Ravens, a fan in another time zone.
- [x] P2. `middleware.ts`: add `https://site.api.espn.com` to `connect-src`.
      Never before P1. Test: the header allows exactly the hosts the app
      calls.
- [x] P3. `UnifiedGameSelector`: show the games/custom switch for NFL (two
      conditions).
- [x] P4. `nflSunSide.ts`, `ShadeAnswer`: name the end zone with the sun at
      its back by MiLB's test ("The south end zone has it at its back too";
      with no clear sideline, the end zone instead of "neither"). It's the
      pages' sentence as well, so 24 NFL pages change. Tests first.
- [x] P5. AT&T and Lucas Oil: a game after sunset says the sun is down.
- [x] P6. Deletions (§29's N5, which lists 6 files and 1,530 lines): on that
      branch 19 files, 4,970 lines with their CSS and helpers, can't be
      reached from any page. `venueSections.ts` and `nflSections.ts` (772
      more) go once `sunCalculations.ts` drops a fallback no page uses. Own
      commit. Check every import, test and script again first.
- [x] P7. Checks: unit tests, type check, eslint, build; every team's 2025
      and 2026 home games through P1 against ESPN's own times; the 24 pages'
      answers before and after P4; Chrome, and Safari if you can try it. Then
      the review.

**For you to decide:**
1. The schedule: P1–P3 (my pick), or drop it and show the date form at once.
   Dropping it is the smallest change and needs no outside feed; but the
   answer depends on the kickoff, so a listed game beats a typed one. A third
   way, our own API route, needs no policy change, but ESPN refuses some
   automated clients and I haven't tested it from Vercel.
2. The end zone (P4): do it on the pages and in the finder (my pick), or
   leave it.
3. P6: delete, now or later?
4. The Bills' 2026 games: leave them out of the list until the new stadium is
   measured, as its own task (my pick), or list them with the old one's
   direction.

**Not in this plan (noticed):**
- `nflOrientationMeasurements.ts` calls OSM way 972013095 the new Bills
  stadium. It was mapped on 2021-08-10, before building began (2023), at
  124 × 63 m (7°), so it may be a practice field.
- The weather box gave a 2025 date what looks like today's weather ("For game
  time: Sep 14 … 32°F" at Lambeau), and says "Sun exposure reduced to 30% due
  to weather" in a dome. Seen on the dev server, not traced.
- "Every seat is shaded" may be too strong where the roof or an end lets light
  through (AT&T's end-zone glass is known for it). Not checked.
- ESPN calls NRG Stadium "Reliant Stadium" in 2026.

Scripts and data are in the shared notes folder, `nfl-finder/`. The published
positions and advice came through web-search extracts, so they show the lists
are wrong but aren't good enough to correct them. Mostly
[Shaded Seats](https://www.shadedseats.com/nissan-stadium-seats-in-sun-shade/)
and [RateYourSeats](https://www.rateyourseats.com/lambeau-field/seating/sections/119),
with [TickPick](https://tpblog.tickpick.com/?p=18379) for benches,
[Visit Denver](https://visitdenver.com/blog/post/ultimate-guide-empower-field-at-mile-high/)
and the [Dallas Morning News](https://dallasnews.com/sports/cowboys/2024/11/12/why-is-there-a-sun-issue-at-att-stadium-see-what-experts-have-said-about-cowboys-home)
for AT&T.

### §30 Review, P1–P3 (2026-11-23)

Go-ahead: "go ahead with P1–P5", then "leave the Bills' 2026 games out"
(question 4) and "have the NFL session open a PR for P1–P3", passed on by the
session that started this one. P6 (deletions) isn't approved. P4 and P5 needed
`nflGameShade`, which reached `main` (PR #105) after P1–P3 were done; they're
for the next PR. `main` at 977a45f37 is merged in here.

**What changed:** 4 commits, one per step and one for the Bills.
- *P1 (b6318163e):* `fetchVenueSchedule` asks ESPN once for the stadium's own
  team and season, and keeps ESPN's kickoff as it is. Neutral sites and games
  with no time yet are left out, no header is sent, and the Ravens' id is
  right in both tables. The week-by-week loader and the four `nflApi` methods
  that depended on it or on the old clock (no callers) are gone.
- *P2 (d210126b7):* `connect-src` names `https://site.api.espn.com`. A test
  pins the whole list, so it can't widen unnoticed.
- *P3 (86aa04f9b):* the games/custom switch shows for NFL, on both finders.
- *Bills (6a1988214):* only games at what ESPN calls "Highmark Stadium (Old)"
  are listed. It goes by the building, so it holds for later seasons, and if
  ESPN renames it the fan gets the date form.

**Checks:**
- *Tests:* 4,051 of 4,051, 46 of them new, all seen to fail first but one (the
  Bills' 2025 games, which guards what must not change). The
  schedule tests also pass in Tokyo, Los Angeles and UTC. The type check is
  clean, eslint gives no errors (one old warning), and the production build
  passes.
- *Every team, live:* 504 games over 64 team-seasons. 2025: all 265 non-neutral
  games in ESPN's weekly feed, which P1 doesn't use, none missing, none extra,
  no time different. 2026: all 239; with the Bills' rule 232, the 7 gone all
  theirs (the eighth has no time yet), and every other team as before. Their 9
  home games of 2025 still list.
- *In a browser (dev server):* Lambeau's games load in one request of 0.1 s
  (it was 132 s to give up). "Dec 20, 12:00 PM CST - Dolphins @ Packers" is
  rated with the sun at 22.1°, due south. On mobile the Ravens list theirs.
  At Highmark the date form comes up at once, and it and the Custom Time tab
  both work: 1:00 PM on December 20, 2026 and September 28, 2025 give the sun
  at 22.9° and 44.9°, as the NOAA equations do.
- *With `main` merged in (§29, §31):* the one conflict was this file. 4,084 of
  4,084 tests (§31's 4,038 and these 46), and the live schedule check the same.
  In a browser the two halves meet: "Dec 20, 12:00 PM CST - Dolphins @
  Packers" gives "For the 12:00 PM game on December 20 at Lambeau Field, the
  sun is on the west side of the field …", the 7:20 PM game on December 13
  says the sun is down, and on a phone-size window the Ravens' games and a
  typed date at Highmark get their answers.

**Open:**
- *Bills:* a date typed in the finder, and their page, still answer for the
  old stadium. Measuring the new one is its own task.
- Not tested: Safari and Firefox, and the built site in a browser.
- Playoff games aren't listed, as before (`seasontype=2`).

### §30, before P1–P3 go out: the picker and the copy (2026-11-24)

Asked: "Yes, fix first", passed on by the main session, which reviewed P1–P3
and found these four. All four were in `main` already; NFL lists never loaded before, so P1 and P2
bring the first two out there.

- [x] Q1 (f48c2dbea). *A late schedule.* `loadGames` never checked that its
      venue was still the selected one, so a slow answer listed the old
      stadium's games at the new one, and a slow failure showed its error
      there. Each load now has a number, a change of venue takes the next one,
      and a load that isn't the latest is dropped: answer, error and "loading"
      alike. One guard, all three leagues.
- [x] Q2 (00d614aea). *The old game in the box.* The effect returned its
      cleanup before the line that clears the choice. The line moves up.
- [x] Q3 (2ad761e9c). *Copy.* Both finders say "Pick a game from the schedule,
      or set a date and time if yours isn't listed", for every league. The
      finder page says what each schedule covers (30 days for the minor
      leagues, eight games for the NFL) and what to do without one.
- [x] Q4 (53032dcf1). *Sources.* `/how-it-works`, `/attributions`, `/disclaimer`
      and `SECURITY_CHECKLIST.md` name ESPN for the NFL schedule.

**Checks:**
- *Tests first:* 9 for the picker (a late answer, a late failure and the old
  game, in each league) and 10 for the copy, all seen to fail; 3 more guard
  the baseball sources. 4,106 of 4,106 in all; the schedule and picker tests
  also in Tokyo, Los Angeles and UTC. Types and the production build pass;
  eslint 0 errors, and its 14 warnings are all on `main`. The live schedule
  check is unchanged (497 games, 64 team-seasons).
- *In a browser (dev server):* with Lambeau's answer held back 5 s and Lumen
  picked meanwhile, Lumen lists its own three games, and the first gives
  Lumen's answer. Going on to M&T with that game chosen, the box reads "Choose
  a game" and no answer shows. The finder's new copy and `/attributions` too.
- *With P4 and P5 (`claude/nfl-end-zone`):* both branches now change the two
  finders and `finderMilb.test.tsx`, on other lines. They still merge without
  a conflict, and together pass 4,121 of 4,121.

**Not asked for, left as it is** (the reviews' list): a game leaves the list at
kickoff; the moved-stadium rule covers only the Bills; picking the same stadium
again clears the answer but not the box. The other places that name a source
need no ESPN: nothing imports `AttributionFooter`, `AttributionNotice` credits
MLB for MLB's data, and `llms.txt`'s line is about MLB ballparks.

**The date form, after that** (asked: "have the NFL session fix both date form
bugs", passed on):
- [x] Q5 (f5480360a). *The crash.* The form formatted its date and time on every
      render, and a cleared one isn't a date (`RangeError`). It was the same for
      a cleared time and for a year of five digits. Now the "Selected" line and
      the button wait until the two make a date.
- [x] Q6 (4cdc820c6). *The flash.* A stadium's request starts 200 ms after it's
      picked, and nothing counted that as loading. It wasn't only the NFL: MLB
      and MiLB flashed "No upcoming games found" the same way. One cause, one
      fix: before its first load a venue is still loading (`isInitialLoad`,
      which the loading hook already keeps).
- *Checks:* 10 new tests, 6 seen to fail (3 in the form; the flash in each
  league) and 4 that guard what must stay. In a browser (dev server), recording
  every change of the page: Lambeau and Lumen go from the skeleton to their
  games, Highmark from the skeleton to the form, and Buffalo on a phone-size
  window from the skeleton to "none" (its season is over). In the form a
  cleared date and a cleared time leave it standing with the button off, and
  filling them in again gives the answer. 4,116 of 4,116 in all; the schedule,
  picker and form tests also in Tokyo, Los Angeles and UTC; types and the build
  pass; eslint as above. With P4 and P5: no conflict, 4,131 of 4,131.
- [x] Q7 (639ef7fce). *The wording* (asked: "Yes, fix it too"). The form said the
      schedule was unavailable when it had loaded and listed no games.
      `getVenueSchedule` made an empty list an error, so both came to the form
      the same way. An empty list is now an answer. A failed load still says
      "NFL schedule data is currently unavailable."; an empty one says "No
      upcoming games are listed for this stadium.", which is true at Highmark
      too. 4 more tests (4,120 in all; 4,135 with P4 and P5): the sentence in
      each case and at Highmark with ESPN's own answer, and the service's two.
      4 were seen to fail, and the failure's own two guard it. Seen in a
      browser: Highmark (none) and, with ESPN answering 404, Lambeau on a
      phone-size window (unavailable). Highmark now asks ESPN for next season
      as well, as any stadium does with nothing left this one.
- [x] Q8 (9538da0ba). *The footer* (asked: "have the NFL session add ESPN to the
      footer too"). `FooterModern`, the only footer the layout renders, says
      "🏈 NFL schedule: ESPN" after the MLB credit. Test first. On a phone
      (375 px) the line takes three rows inside its margins, at 320 px it still
      fits, and at 1280 px it takes two.
- *Noticed:* for about a frame (13 ms on the dev server) after a change of
  stadium the old list is still there. It was before, too.

### §30 Review, P6 (2026-11-24)

Go-ahead: "go ahead with P6", typed in this session. P1–P5 and Q1–Q8 are merged
(PR #106 and #107) and live. Branch `claude/nfl-cleanup`, from `main` at
e7662874c. Not pushed.

**What went:** 18 of the 21 files, 5,405 lines, plus the lists' own test.
- *baea2b320:* 16 files no page could reach and nothing else imported: the
  section list, its filters, its mobile cards, their styles and their helpers
  (4,633 lines). `shadeDirection.test.ts` loses the model that went with them.
- *d5c6f5913:* `venueSections.ts` and `nflSections.ts` (772 lines) and
  `venueSections.test.ts`. `sunCalculations.ts` loses the fallback to them, as
  the plan said; so does `optimizedSunCalculations.ts`, which nothing imports
  but the type check reads. `auditCoverageContradictions.ts` checks MLB only
  (it found nothing before and after), and `syncNFLVenues.ts` loses a warning.

**What stayed, after checking every import:**
- `Tooltip` (two files, 280 lines): `ShareButton` still imports it.
- `keyboardActivation.ts` (57 lines): `MobileStadiumGuide` and `SectionLabel`
  still import it, and it has a test of its own.
- No page can reach those three components either, but they weren't in the
  plan.

**Checks:**
- *What a fan sees:* the 32 NFL pages, 120 MiLB pages, 240 MiLB game answers
  and all 576 NFL finder answers are byte for byte the same before and after.
- *Tests:* 4,133 of 4,133 (4,136 less the three for what went). Types, eslint
  (0 errors) and the production build pass. The client's JavaScript is the same
  size: the build already left these files out, so this changes the source only.
- *In a browser (dev server):* Lumen's games and answer, and Yankee Stadium's
  page. No server errors. The row-shade API withholds its data (409), as the
  live site's does.

**Noticed (not changed):** two one-off scripts are about a deleted file.
`fixNFLSectionIds.ts` edits `nflSections.ts`, so it now fails if run, and
`importVenues.ts` would write `venueSections.ts` again. Nothing runs either.

## §31 Three leftovers from checking §28 (plan, 2026-11-23)

Asked: fix the three things noticed while checking PR #104. Branch
`fix/finder-leftovers`, from `main` at bb77e58af.

1. *`scripts/remove-debug-logs.js` lists a deleted file*
   (`milbVenueLayouts.ts`, H4). `StadiumVisualizationSection.tsx` on the same
   list is gone too.
2. *The mobile finder's sun line* reads "Sun is Sun is high in the sky"
   whatever the sun's height. `MobileApp` passes `getSunDescription` the
   height, but it takes the whole sun position, so every comparison is with
   `undefined` and it falls through to "high". It also writes "Sun is" before
   text that starts with it. The state is typed `any`, so the compiler
   couldn't catch it.
3. *A finder link* (`?venue=`, `?datetime=`) opens the park on desktop, not on
   phones: only `UnifiedApp` reads it. And the picker keeps its own league and
   ignores the park it's given, so on desktop it says "Major League Baseball"
   over a minor league park. Nothing on the site makes these links now
   (`ShareButton` isn't imported anywhere), so this is for old and hand-typed
   ones.

### Steps
- [x] I1. Drop both missing files from the script's list.
- [x] I2. Pass the sun position, drop the extra "Sun is", and type the state
      so the compiler checks the call. Test first.
- [x] I3. Move the link reading to one function that both finders use, and
      have the picker show the league (and MiLB level) of the park it's given,
      without changing the fan's saved league. Tests first.
- [x] I4. Checks: unit tests, type check, eslint; both finders in a browser,
      with and without a link, MiLB, NFL and MLB. Then the review.

### §31 Review (2026-11-23)

**What changed:** 3 commits on `fix/finder-leftovers`, one per fix.
- *Script* (I1): both files that no longer exist are off its list.
- *Sun line* (I2): phones read "Sun is low in the sky · 17.9° W" for a 6:35 PM
  game in Memphis, and "high" at 75°. With the state typed, the compiler
  rejects the old call.
- *Links* (I3): `readFinderLink` (`utils/finderLink.ts`) replaces the copy in
  `UnifiedApp`, and both finders use it. The picker shows the league, level
  and park it's given. The fan's saved league stays.

**Checks:**
- *Tests:* 4,016 of 4,016, 11 of them new (`finderLink.test.tsx`: desktop and
  mobile). 6 of the 9 first written failed before the fixes, the sun line for
  its own reason once the links worked. The type check is clean; eslint gives
  the same 6 warnings on these files as before.
- *In a browser, on the dev server:* Memphis, Reading (AA), Lambeau and Yankee
  Stadium links, on phones or desktop; switching leagues by hand after a link
  clears the park; with no link the saved league shows. No server errors.

**Not changed (noticed):** `ShareButton`, which made these links, isn't
imported anywhere, so nothing on the site makes them now. A link's time isn't
copied into the picker's Custom Time boxes.

(Merged into `fix/nfl-finder-sections` 2026-11-23, asked. It was §29 on
`fix/finder-leftovers`; another branch's plan is §30, so it's §31 here. Its
conflicts were in `MobileApp.tsx`, `UnifiedApp.tsx` and this file.)

## §32 The NFL answer: the end zone, and the sun down (§30's P4 and P5, 2026-11-23)

Asked: "go ahead with P1–P5", then "have the NFL session start P4 and P5",
passed on by the session that started this one. The plan and its findings are
§30, on `claude/agitated-sanderson-94f055` (P1–P3, not merged yet). Branch
`claude/nfl-end-zone`, from `main` at 977a45f37. Not pushed.

**The plan against `main`:** it still fits. PR #105 left the answer's rule and
words as they were, and both finders use them.

- [x] P4 (d8feee306). `fieldSunSideAt` also gives the end zone with the sun at
      its back: within 60° of the sun's mean direction, MiLB's test. The
      sentence adds "The south end zone has the sun at its back too", and where
      neither sideline has a clear edge it names the end zone instead. The
      pages' 4:25 PM sentence does the same.
- [x] P5 (49016b5a8). At AT&T and Lucas Oil a game after sunset says the sun is
      down, in both finders. By day they still say we can't yet say.
- [x] P7, the checks that cover them.
- [x] The wording (c880772c9, 2026-11-24; asked: "have the NFL session fix the
      wording nit"). "The south end zone has it at its back too" is now "has
      the sun at its back too": in the 4:25 PM sentence "it" had nothing to
      refer to. The tests changed first (4 failed). It's on 19 of the 20
      changed pages (not EverBank) and in 126 of the 576 finder answers, and
      nothing else in any page or answer moved. "The sun runs along the field,
      and … has it at its back" stays, because there "it" is the sun.

**Which answers change:**
- *Pages:* 20 of the 24 with a sideline, not all 24 as §30 said. Paycor,
  Nissan, State Farm and Levi's don't: the sun is too square to the field at
  1:00 and 4:25 PM on September 14. 12 name it at 1:00 only (at EverBank in
  place of "neither"), 6 at 4:25 only, and Huntington and Mercedes-Benz at both.
- *Games of 2025:* an end zone is named at 97 of the 166 with sun at measured
  fields, and at all 6 where no sideline has an edge.
- *Nothing else:* the other 12 NFL pages, the 120 MiLB pages and 240 MiLB game
  answers are the same, word for word.

**Checks:**
- *Tests:* 4,053 of 4,053, 15 of them new, 14 seen to fail first (the other
  guards the sentence without an end zone). Types, eslint (0 errors, one old
  warning) and the production build pass.
- *Every stadium, both real finders:* 576 answers (32 stadiums, desktop and
  mobile, three 2025 dates, three kickoffs) against a separate calculation in
  Python (the NOAA equations): all match, sunset times included. Desktop and
  mobile agree at all of them. Before and after: 428 the same, 126 with only
  the end-zone sentence added, 10 with the end zone in place of "neither", 12
  at AT&T and Lucas Oil that now say the sun is down.
- *The end zone itself:* at 260 answers (the 2025 games and the pages' two
  kickoffs) the Python names the same one. By the site's bowl model, all 119
  named are less sunny than the end zone that faces the sun, in the lower and
  the upper deck, and none is sunnier than the sunny sideline.
- *In a browser (dev server):* EverBank's page, AT&T at 7:15 PM on November 3,
  and Lumen Field on a phone-size window.
- *With P1–P3:* the two branches merge without a conflict, and together pass
  4,099 of 4,099.

**Known limits:**
- *Bank of America at 4:25 PM* is the nearest call on the pages: the northwest
  end zone is 59.8° from the sun's mean direction, so it's just named. The
  ticket guide calls its south end zone the shaded one, which is right for an
  early game, where the rule names none (as at State Farm). Of the six end
  zones the guides name, the rule names four.
- It says which way the sun is, not how tall the stand behind an end zone is.
  The same is true of the sidelines.
- The share image still gives only the sideline ("the sun runs along the
  field" at EverBank), which is still right.

## §33 The Bills' new stadium (plan, 2026-11-24)

Asked: plan the fix for the Bills' answers, which are still for the stadium
they left. Branch `fix/bills-stadium`, from `main` at e7662874c (PR #107).
(When the plan was written, nothing but this file had changed.)

**In short:** the new field can be measured, and it isn't the old one's
direction: 168°, against 123°. I'd move the Bills to it rather than only say
they've moved.

### Findings

**1. The new stadium.** It opened on June 23, 2026, and its first
regular-season game was on September 17 (Bills 41–31 Lions). 60,108 seats and
standing room; Kentucky bluegrass; a canopy all the way round, over 64% of the
bowl; 10 Bills Plaza, Orchard Park; 42.77306, -78.79222. (New York State, June
23, 2026, for the seats, grass and canopy; ESPN has the same seats and "more
than 60%"; Wikipedia for the games, address and coordinates, and
OpenStreetMap puts the stadium within 10 m.) In the September 2026 satellite
images the old one's site is mostly bare ground.

**2. The field's direction: 168.0°.**
- *Satellite:* a rectangle fitted to the grass in Sentinel-2 images (10 m
  pixels), on each of the 13 clear images from May to mid-September 2026:
  167.7–168.5°, spread 0.2°. From October the canopy shades the south end and
  it still gives 167.6–168.6° (8 images).
- *The method, on known fields:* at 13 grass fields (12 stadiums and State
  Farm's tray) the median of its 2025 dates is within 1.2° of the recorded
  direction. Hard Rock, the 14th I tried, has a canopy that leaves too little
  grass in view.
- *OpenStreetMap,* mapped on November 10: the opening in the canopy (way
  1577454592) runs 167.5°.
- The record for the old one says way 972013095 is the new stadium. It isn't:
  it runs 7°, was mapped in 2021, and is about 680 m away.

**3. What's wrong today.**
- *Answers:* the new stadium has no southwest sideline, and that's the one
  named at all 38 Sunday kickoffs (1:00 and 4:25) from September 6 to January
  10.

  | Page | Today (123°) | New stadium (168°) |
  |---|---|---|
  | 1:00 PM | southwest sideline | west sideline, and the south end zone |
  | 4:25 PM | southwest sideline, and the northwest end zone | west sideline |

  The new page names the same sides for any direction from 163° to 173°.
- *Night games* say the sun is down either way. The two games left with a time
  (November 26 and December 19) are both at night, so this matters for the
  page, for typed dates, for January 10 (no time yet), and from next season.
- *The finder* lists none of the Bills' games, so as not to give them the old
  direction.
- *The page* also has the old building's facts: "Built 1973", 71,608 seats,
  "home to the Bills since 1973", its clubs, section numbers (300–345), parking
  lots and prices, address and history. None cites a source.

**4. "Always use 2025 data."** No 2025 game was played in the new stadium, so
this needs your exception: its direction and facts are from 2026. The sun's
path stays September 14, 2025, as on every NFL page.

### Plan (approved 2026-11-24, with both decisions below)

- [x] B1 (18dc52941). `scripts/measureNflSatellite.py`: the fit, so the 168° and the 13
      fields can be run again (as `measureMilbOrientation.py` does for MiLB).
- [x] B2 (31e1e35e5). `nflOrientationMeasurements.ts`, `nflStadiums.ts`,
      `unifiedVenues.ts`: 168° (±3°), a `satellite` method, the new
      coordinates, 60,108 seats, 2026, grass, and the five angles that follow
      from the direction. The id and the address `/stadium/highmark-stadium`
      stay. Test first: both kickoffs' sentences.
- [x] B3 (f48de2609). `nflApiClient.ts`: drop the Bills rule, so their games list again.
      The list only has games still to come, and those are all at the new one.
      Tests: ESPN's own 2026 answer gives the seven games with a time, and the
      two to come.
- [x] B4 (26eb7cb2a). `nflStadiumGuides.ts`: facts with a source (opened, seats, grass,
      canopy, address, first game) replace the old building's. What's left
      without one (clubs, section numbers, food, parking, gates) comes out.
- [x] B5 (0a0c139b7). `ComprehensiveStadiumGuide.tsx`: a block with nothing in it shows no
      heading. Today nine NFL pages show "Best Value", "Hidden Gems" and
      "Things to Avoid" with nothing under them; B4 would add more.
- [x] B6 (5a4a28161). `/attributions`: where the NFL directions come from. The satellite
      one needs "contains modified Copernicus Sentinel data 2026", and
      OpenStreetMap, which most of the others use, isn't credited now.
- [x] B7. Checks: unit tests, types, eslint, build; the Bills' answers against
      a separate calculation; the other 31 NFL pages' answers, the 120 MiLB
      pages' answers and the MLB data unchanged; the finder and the page in a
      browser. Then the review, with the live checks of PRs #101–#107, which
      earlier reviews don't have.

**For you to decide:**
1. The stadium: move to the new one (my pick, B1–B7; it's the exception in
   finding 4), or only say the Bills have moved and give no sideline. The
   second is smaller and keeps to 2025 data, but the page would have no answer,
   and we can measure it.
2. B4's deletions: the old building's clubs, sections, food, parking and gates.
   I'd delete them. The other choice is to leave them and change only the facts
   above, which keeps section numbers that aren't the new stadium's.

**Not in this plan:**
- The Jaguars (Orlando in 2027) and the Titans (new stadium in 2027). With B3
  no rule is left for a team that moves, so that needs its own before ESPN
  publishes 2027.
- The canopy: the sentence already says "upper rows and seats under an
  overhang", and Hard Rock's, whose canopy is larger, is the same.
- At 4:25 PM the sun is square across the field, so which end zone "faces the
  sun" hardly matters, but the finder names one. True of every north–south
  field.
- `sections/nfl/highmark-stadium.ts`, `obstructions/nfl/…`, `venues.ts` and
  `venues.json` have the old stadium too, and no page uses them (P6).

### §33 Review (2026-11-24)

**What changed:** the Bills' page and the finder answer for the new stadium. Six
commits, one per step, and `main` at 5c9c15d2f (PR #108) merged in.
- *B1 (18dc52941):* `scripts/measureNflSatellite.py` gives 168.0° (16 images,
  spread 0.2°). On the 13 other fields it's within about 1° of the record (worst
  Northwest, +1.0°). It says so when it can't: Hard Rock, 1 clear image of 4.
- *B2 (31e1e35e5):* 168° ± 3°, the coordinates, seats, year and grass.
- *B3 (f48de2609):* the Bills' games list again: the Chiefs on November 26 and
  the Bears on December 19. The saved 2025 answer went with the rule.
- *B4 (26eb7cb2a):* the guide has the new building's facts. Its clubs, section
  numbers, food, parking lots, gate times and old history are gone; the town's
  weather, transport and the team's traditions stay.
- *B5 (0a0c139b7):* a block with nothing in it shows no heading. It took "Best
  Value", "Hidden Gems" and "Things to Avoid" off nine NFL pages, and changed
  nothing else in 152 pages.
- *B6 (5a4a28161):* `/attributions` credits OpenStreetMap, NAIP and Copernicus
  for the NFL directions.

**Checks:**
- *Tests:* 4,138 of 4,138 in 105 suites. Seen to fail first: the Bills' answers
  and facts (4), their list (2), the empty blocks (2) and the credit (1). The
  four that pinned the old rule went. Types and the production build pass;
  eslint: 0 errors, and one warning on a line this didn't write. All on
  5a4a28161; after it came only the script and one comment.
- *A separate calculation* (Python, the NOAA equations, none of the site's
  code): all 288 NFL answers match, the Bills' nine among them.
- *Nothing else moved,* against `main`: the other 31 NFL pages' answers, the
  other 279 NFL game answers, all 240 MiLB answers, and the data of the other
  181 venues.
- *In a browser (dev server):* the Bills' page (west sideline, the south end
  zone at 1:00, "Built 2026", 60,108, "Field runs SSE–NNW", and nothing of the
  old building); the finder lists the two games, and the Chiefs game says the
  sun is down; on a phone-size window January 10 at 1:00 PM gives the west
  sideline; `/attributions` fits.
- *Not tested:* Safari and Firefox. The 168° has no aerial photo behind it yet;
  when NAIP flies New York again it should be checked.

**Left:** as in "Not in this plan". `stadiumObstructions.ts` still has the old
stadium's overhang too; I found no page that uses it.

**Live checks the earlier reviews don't have:** PR #105: build 977a45f37fca on
plain URLs, the finder's new copy, and all 32 NFL pages' answers as before.
PRs #106 and #107: build e7662874c655 on 39 pages at plain URLs; all 32 NFL
pages' answers as tested; the finder's copy, the three source pages, the
footer and the security policy. The live finder wasn't opened in a browser
(it would count as a visit in Analytics).

## §34 Three leftovers from checking P6 (plan, 2026-11-24)

Asked: clean up the three leftovers from checking PR #108. Branch
`fix/cleanup-leftovers`, from `main` at 193d31d4d. No page uses any of them.

1. *`scripts/fixNFLSectionIds.ts`* renames ids in `nflSections.ts`, which P6
   deleted, so it fails if run. It has no other purpose.
2. *`scripts/importVenues.ts`* writes `venueSections.ts`, which P6 deleted, so
   running it would bring the made-up sections back. It also writes
   `venues.ts` and `venueParams.ts`.
3. *`bowlGeometry.ts`'s header* names `getUnifiedVenueShade` as if it were
   still there.

Plan:
- [x] R1. Delete `fixNFLSectionIds.ts`.
- [x] R2. `importVenues.ts`: drop the part that makes sections. Run it into a
      scratch folder before and after: the other two files must be the same.
- [x] R3. The header says the function has since been deleted.
- [x] R4. Types, eslint, tests and the build.

### §34 Review (2026-11-24)

- *R1:* the script is gone (31 lines). Nothing named it but this file.
- *R2:* `importVenues.ts` no longer makes sections (155 lines out, none in).
  Run into a scratch folder before and after, `venues.ts` and `venueParams.ts`
  are the same but for the date they carry, and `venueSections.ts` isn't
  written.
- *R3:* the header says `getUnifiedVenueShade` has since been deleted. The
  history it tells is still true, so it stays.
- *R4:* types and eslint clean, 4,138 of 4,138 tests, and the build passes. All
  150 stadium-page answers are the same as the live site's (`main` at 193d31d4d).

**Noticed (not changed):** nothing imports `src/data/venues.ts` or
`venueParams.ts`, the two files `importVenues.ts` still writes. A comment in
`ComprehensiveStadiumGuide.tsx` names `venueSections` among the data that
page avoids loading.

## §35 Games that leave the finder's list at kickoff (plan, 2026-11-24)

Asked: plan the fix for NFL games that leave the finder's list at kickoff.
Branch `fix/finder-kickoff`, from `main` at 193d31d4d (PR #109). (When
the plan was written, nothing but this file had changed. §34 is PR #110.)

**In short:** it's one filter for the NFL. MiLB has the same fault and a second
one that drops games before they start; I'd fix all three together.

### Findings

**1. NFL.** `getUpcomingVenueGames` keeps games whose kickoff is now or later
(`nflApi.ts`). With ESPN's 2025 answer for the Jaguars, the 1:00 PM game on
September 7 is first in the list at 1:00:00 and gone at 1:00:01; the next is
September 21. A fan in their seat gets a game two weeks off, or types the date.
During the last home game of a season the list moves to next season's, which
ESPN hasn't published, so the fan gets the date form.

**2. MiLB, at first pitch.** `getHomeGamesForVenue` keeps only games MLB calls
`Preview` (`milbApi.ts`), so a `Live` one goes. MLB's own list drops only the
finished and cancelled (`F`, `C`).

**3. MiLB, before first pitch.** The picker asks for games from today's *UTC*
date, which is tomorrow from 8:00 PM Eastern and 5:00 PM Pacific
(`UnifiedGameSelector.tsx`). At 5:05 PM in Reno on July 18, 2025 it asks from
July 19, and that night's game isn't in the list. Of the 8,258 MiLB games played
in 2025, 1,754 (21%) started after that, and any other game still going at that
hour goes as well. The MLB list had the same fault, and `upcomingScheduleRange`
fixed it with the fan's own date; MiLB wasn't moved to it.

**4. Same stadium again** (from checking PR #106): picking the stadium that's
already chosen clears the answer but leaves the game in the box. The picker
clears its choice when the stadium *changes*, and this one hasn't.

**How long to keep a game.** The answer covers three hours from kickoff
(`GAME_MINUTES`), so I'd keep an NFL game for those three hours. The other way
is ESPN's own status (`pre`, `in`, `post`): it would follow overtime and delays,
but the list is kept for an hour, so it's stale when it matters, and the saved
answers the tests use don't have it. For MiLB, MLB's status is already what's
filtered on, so there it's only which states count.

### Plan (approved 2026-11-24, K1–K4)

- [x] K1 (eaa4a20b8). `nflApi.ts`: keep a game until three hours after kickoff. Tests first,
      on ESPN's 2025 answer: a minute before, at, an hour after, and three hours
      and a minute after kickoff; and the last home game while it's on.
- [x] K2 (96e76bc81). `milbApi.ts`: drop only what's `Final` (finished, postponed or
      cancelled: all 8,680 of 2025 end as that), so a game in progress stays.
      `UnifiedGameSelector.tsx`: ask from the fan's own date, with
      `upcomingScheduleRange(now, 30)`. Tests first: `Preview`, `Live`,
      `Final`; and 5:05 PM Pacific and 8:05 PM Eastern.
- [x] K3 (4d5e62a58). `UnifiedGameSelector.tsx`: choosing a stadium clears the game box,
      the same one included (one line). Test first, in all three leagues.
- [x] K4. Checks: unit tests, types, eslint, build; every team's 2025 home games
      through K1 at kickoff and three hours on, and MiLB's 2025 games through K2
      by the hour; the schedule tests in Tokyo, Los Angeles and UTC; the finder
      in a browser with the clock set. Every page's answer unchanged (none of
      this touches one). Then the review.

**For you to decide:** K2 and K3 go beyond what you asked. I'd do them now: K2
is the same fault in the same list (its season is over until April, so it can
wait), and K3 is one line in the same file. Or K1 alone.

**Not in this plan:** the list's label still says "upcoming" with a game in
progress in it, as MLB's does. An open page doesn't reload its list.

### §35 Review (2026-11-24)

**What changed:** three commits, and `main` at 894310f2b (PR #110) merged in;
this file was the only conflict, and both sections are kept.
- *K1 (eaa4a20b8):* an NFL game stays in the list for the three hours its
  answer covers, the last home game of a season included.
- *K2 (96e76bc81):* a MiLB game stays until MLB calls it `Final`, and the list
  starts from the fan's own date.
- *K3 (4d5e62a58):* choosing a stadium clears the game box, the same one too.

**Checks:**
- *Tests:* 4,151 of 4,151 in 106 suites; 13 new. Seen to fail first: K1's four
  that cover a game in progress, K2's two and K3's three; the other four guard
  what must not change. The schedule, picker and form tests also in Tokyo, Los
  Angeles and UTC. Types and the production build pass; eslint: 0 errors, and
  one warning that `main` has too.
- *Every 2025 NFL home game* (265, from ESPN's own answers for the 32 teams):
  first in its list a minute before, at, and 1, 90 and 180 minutes after
  kickoff; at 181 it's gone and the next is first.
- *Every 2025 MiLB game* at the 118 parks with an MLB id, played on its own
  date (8,123): asked for and kept an hour before first pitch and 90 minutes
  after. The old way kept 7,170 and none.
- *In a browser (dev server), the page's clock set:* at 12:30 PM on December 20
  Lambeau lists Dolphins @ Packers first and answers for it, and Lambeau again
  empties the box and the answer. At 8:05 PM on July 18, 2025, Sahlen Field asks
  MLB from July 18.
- *No page's answer changes:* the three commits touch only the finder's lists.
- *Not tested:* Safari and Firefox, and a MiLB game in progress in a browser
  (the season is over).

**Left:** as in "Not in this plan". Found on the way: two parks have no MLB id
in `milbTeamMapping.ts` (Grainger Stadium, and Roger Dean Chevrolet Stadium for
the Palm Beach Cardinals), so by the code their lists say "venue not recognized".

## §36 The game box and the answer disagree after a tab change (plan, 2026-11-24)

Asked: "fix the tab bug too" (found while checking PR #111). Branch
`claude/game-box`, from `main` at ae4ba6463 (PR #111).

### Findings

**The bug.** Pick a game, open Custom Time, come back without applying
anything: the box says "Choose a game..." and the answer for the game is still
there. All three leagues, desktop and mobile; older than PR #106.

**The cause.** The picker keeps its own copy of the chosen game
(`selectedGameOption`), next to the finder's (`selectedGame`), which is what the
answer uses. Two copies have to be cleared together by hand: the picker does it
in four places, and the tab change is one that shouldn't. It's the third bug
from this: PR #106 fixed the box that kept a game after a change of stadium, and
PR #111 the same stadium picked again.

**What's right.** Opening a tab changes nothing until Apply, so the game stays in
the box with its answer. Once a custom time is applied, the answer is for that
time and the box is empty.

### Plan

- [x] G1 (551fed99e). Tests first, in the whole finder with its real picker (desktop and
      mobile, three leagues): the tabs with nothing applied; a custom time
      applied; the same stadium; another stadium. And the NFL date form after the
      list comes back empty. The two picker tests for the box move here: what the
      box shows is the finder's to say.
- [x] G2 (551fed99e). The box shows the finder's game: `UnifiedGameSelector` takes
      `selectedGame`, both finders pass theirs, and the picker's copy goes, with
      the four places that clear it and the one that sets it.
- [x] G3. Checks: tests, types, eslint, build, and the finder in a browser. Then
      the review.

**The smaller patch I'd leave:** clear the copy only when the stadium changes,
and also on Apply and in the date form. Fewer lines, but two copies still, and
seven places to keep in step.

### §36 Review (2026-11-24)

**What changed:** one commit (551fed99e). The picker's box shows the game the finder
holds (`selectedGame`), so whatever changes the answer changes the box. The
picker's own copy is gone, with the four places that cleared it, PR #111's line
for the same stadium among them. The code that names a game in the list moved
out of the list so the box can use it too; it reads the same.

**What a fan sees:** Custom Time opened and left keeps the game and its answer.
Applied, the answer is for that time and the box is empty. Everything else is as
before.

**Checks:**
- *Tests:* 4,171 of 4,171 in 107 suites: 26 new in the whole finder, and six
  picker tests for the box moved into them. Seen to fail first: the six for the
  tabs and the two for the date form, each with an empty box and the game's
  answer; the other 18 guard what worked. They also catch half of the smaller
  patch, the copy cleared only when the stadium changes (eight fail), and a
  finder that forgets to clear its game (six fail).
- *Types, build, eslint:* pass, with the two warnings `main` has.
- *In a browser (dev server):* Lambeau on desktop (tabs with nothing applied, a
  custom time applied, another game, the same stadium) and Yankee Stadium at
  phone size (tabs with nothing applied); no console errors.
- *No page's answer changes:* only the finder's box is touched.
- *Not tested:* Safari and Firefox, and MiLB in a browser (its season is over).

**PR #111 since its review:** merged as ae4ba6463 and live; `main`'s Playwright
run passed (17 of 17). On the live site, Lambeau picked again empties the box and
the answer, on desktop and at phone size. Its changes to the NFL and MiLB lists
weren't checked live.

## §37 The game list reopens at the first game (plan, 2026-11-24)

Asked: "Yes, fix it" (found while checking PR #112). Branch
`fix/reopened-game-list`, from `main` at 30003d767 (PR #112).

### Findings

**The bug.** Pick any game but the first, open the list again: it starts at the
first game, not the chosen one. Tab or Enter then swaps the chosen game for the
first, and the answer with it, and the arrow keys start from the top. On the live
site, Lambeau's January 4 game became December 13. All three leagues, desktop and
mobile; new in PR #112.

**The cause.** react-select opens a list on the chosen option by looking for the
same object in it (`indexOf` in `openMenu`). Until PR #112 the box's value was the
list's own entry. Since then it's a new one, built on every render, so it's never
found.

**What's right.** The list opens on the chosen game. The box still shows the game
the answer is for: if the list comes back with the game at another time, the box
keeps the time that was chosen, so the match is on what the box shows and not on
the game's number alone.

### Plan

- [x] R1 (d846105e1). Tests first, in `finderGameBox.test.tsx` (desktop and mobile, three
      leagues), with an earlier game in the list: the list opened again and left
      with Tab; the same after the tabs; the list come back with the game moved.
- [x] R2 (d846105e1). The box's value is the list's own entry when the list has the game as it
      was chosen, and is built only when it doesn't.
- [x] R3. Checks: tests, types, eslint, build, and the finder in a browser. Then
      the review.

### §37 Review (2026-11-24)

**What changed:** one commit (d846105e1). The box's value is the list's own entry for
the chosen game when the list has that game as it was chosen, and an entry built
for the box when it doesn't. Nothing else in the picker moved.

**What a fan sees:** the game list opens on the chosen game again, so Tab and
Enter keep it and the arrow keys go on from it. Same as before PR #112, and now
after Custom Time is opened and left as well. The box still shows the game the
answer is for.

**Checks:**
- *Tests:* 4,189 of 4,189 in 107 suites; 18 new. Twelve were seen to fail first,
  with the box and the answer moved to the earlier game. The other six guard
  against matching on the game's number alone: tried, and all six fail, with the
  new time in the box and the answer for the old one.
- *Types, build, eslint:* pass, with the one warning `main` has in the picker.
- *In a browser (dev server):* Lambeau on desktop (Tab, the arrow keys, after the
  tabs) and Yankee Stadium's 31 games on desktop and at phone size (Tab). The
  Yankees list, opened again on desktop with its last game chosen, scrolls to it:
  1,059 px before PR #112, 0 in PR #112, 1,059 now.
- *Console:* one error, from the browser tool's own script; it isn't in the app.
- *No page's answer changes:* only the finder's box is touched.
- *Not tested:* Safari and Firefox, and MiLB in a browser (its season is over).

**Noticed, not changed:** at phone size the list opens on the chosen game but
doesn't scroll to it. It didn't before PR #112 either.

## §38 Five things from reviewing PR #112 and PR #113 (plan, 2026-11-24)

Asked: "Yes, plan all five", then "Approve all seven" (L6 and L7 too). Branch `fix/finder-list`, from `main` at ce0beb45c
(PR #113). Both PRs are sound; four of the five are older than them.

### Findings

**1. MLB lists games that won't be played.** `getHomeGamesForStadium` drops the
status codes F and C. MLB has 88 codes for a game that's over, postponed or
cancelled; F is one of them and C isn't any. MLB's `abstractGameState` is `Final`
for all 88, and PR #111 already uses it for MiLB.
- 2025: 35 regular-season entries would stay, 30 postponed and 5 ended early.
- The makeup of all 30 has the same game number and the same park, and comes
  second. The park's page looks a game up by its number (`ShadeFinder.tsx`), so,
  by the code, on the day of a rainout it opens on the postponed game, and
  choosing the makeup shows the postponed one's time.
- The same function feeds the finder, the park's page and `/api/mlb/schedule`.

**2. The list doesn't scroll to the chosen game.** Worse than the review said: on
desktop too, and in the stadium list. Opened by a click, Yankee Stadium's 31
games stay at 0 (chosen game at 1,059 px on desktop, 2,213 px at phone size), and
the stadium list at 0 (908 px). §37's 1,059 px was seen after something had
redrawn the box.
- *Cause:* react-select scrolls when it updates, but draws the list through a
  portal (`menuPortalTarget`), which puts it on the page one render later. The
  scroll stays owed, so the next update of any kind does it, which can move the
  list under a fan who is reading it.
- *The portal stays:* it's there so the phone keyboard doesn't hide the list
  (ee0f65036, c1c8de881).

**3. Month headings use the fan's time zone**, the labels the park's. Of 2,343 MLB
games of 2025, none is under the wrong month in New York or Los Angeles, 23 in
London, 68 in Tokyo.

**4. Keeping the chosen game counts as a new pick.** react-select calls `onChange`
for the option already chosen, so the pick is tracked again and the weather asked
for again.

**5. A game whose time changed is marked chosen at its new time**, while the box
and the answer have the old one. react-select compares the game's number; §37
compares the label too. New in PR #112.

### Plan

Tests first, seen to fail, then the fix; one commit each.

- [x] L1 (5c5e165b2). `mlbApi.ts`: keep a game unless its `abstractGameState` is `Final`, and
      name that field in `MLBGame`. Tests: the codes of 2025 (F, DR, DI, DS, FR,
      FO) and Game Over go; Scheduled, Delayed Start, In Progress and Suspended
      stay; a postponed game and its makeup leave the makeup.
- [x] L2 (e9556f06f). `UnifiedGameSelector.tsx`: when the stadium or the game list opens,
      update it once more on the next frame, so react-select does the scroll it
      owes. Tried in the browser by hand: 1,059 on desktop by click and by key,
      2,213 at phone size, and the page itself doesn't move. The league and level
      lists fit without scrolling. Test: the list's scroll is set on opening.
- [x] L3 (7b63bdbb3). `UnifiedGameSelector.tsx`: group by the park's date, with
      `utcToStadiumLocal` (already in `stadiumTime.ts`). Test: a 9:30 PM game in
      Los Angeles on July 31, 2025 is under July.
- [x] L4 (499c2f428). `UnifiedGameSelector.tsx`: do nothing when the option is the chosen one.
      Test: Tab on the chosen game tracks nothing; another game is tracked once.
- [x] L5 (cdc96ee4f). `UnifiedGameSelector.tsx`: `isOptionSelected` is the box's own entry.
      Test: the moved game's entry isn't marked; the chosen game's is.
- [x] L8. Checks: all tests, types, eslint, build; every 2025 MLB game through L1
      and L3 in four time zones; the finder in a browser at both sizes (clicks and
      keys), and a park's page. Then the review.

**Left as is:** when the chosen game has left the list or moved, the list opens on
its first game and Tab picks it, as it does when nothing is chosen. The box
keeping the time that was chosen is §37's decision.

### Found while planning, not in the five (approved too)

- [x] L6 (f7657dffb). **Games with no start time yet are listed at 3:33 AM.** MLB's
      `startTimeTBD` marks `gameDate` as a placeholder, nearly always 3:33 AM at
      the park; the finder doesn't look at it. On the dev server Yankee Stadium lists
      "Mar 31, 3:33 AM EDT", and, by the code, choosing it says the sun is down.
      In MLB's schedule today that's 179 of the 797 regular-season games through
      May 23: 9 parks, and every listed game at 7 (Dodger Stadium, Fenway, Oracle,
      Progressive, Rate, Rogers Centre, Wrigley). Triple-A 2025 has 87 marked of
      2,302. The park's page says "time TBD" and the NFL list leaves such games
      out. *Fix:* the label says "time TBD" and the entry can't be chosen, so a
      fan sees their game and why; Custom Time still works.
- [x] L7 (183fb258f). **The stadium list loses its place.** Its options are built again on
      every render, so anything that redraws the finder with the list open (by the
      code, the weather arriving) moves the highlight to the first stadium, and
      Enter or Tab would pick it. Seen by changing the game behind the open list:
      Yankee Stadium to American Family Field. *Fix:* build them once per league
      and level, as the game list does.

### §38 Review (2026-11-24)

**What changed:** seven commits, one for each. The code is in
`UnifiedGameSelector.tsx`, `mlbApi.ts`, `milbApi.ts` (a type) and
`selectStyles.ts` (gray for an entry that can't be chosen).

**What a fan sees:**
- MLB's lists, the park's page among them, have only games to come or being
  played. On the day of a rainout the makeup is the makeup.
- The game and stadium lists open at what was chosen, and stay there.
- A game is under its month at the park, wherever the fan is.
- Keeping the chosen game does nothing, and only it is marked as chosen.
- A game with no start time says "time TBD" and can't be chosen.

**The plan was wrong about L6 in the minors.** There the mark is nearly always a
doubleheader's second game, not 3:33 AM: 332 of the 347 marked in 2025, at all
four levels. Its placeholder is five minutes after the first game (293 of the 300
played), and the game starts when the first ends: Rochester's on April 3, 2025 was
listed for 1:10 PM and began at 3:41. So the finder gave it the first game's
answer. "time TBD" is right for it too, but a fan at a second game has to use
Custom Time.

**Checks:**
- *Tests:* 4,228 of 4,228 in 107 suites; 39 new. Seen to fail first: 26 of them
  (L1 9, L2 12, L3 1, L4 1, L6 2, L7 1) and six older ones that L5 extends. The
  other 13 guard what must stay. The list, picker and finder tests also pass in
  Tokyo, Los Angeles, London and UTC.
- *One run lost a suite:* in the first of four full runs one suite didn't run and
  50 tests were missing, with no test failing. Its message wasn't kept. Only two
  suites have 50 tests, both checks of a park's shade that nothing here touches.
  Three more full runs passed, one of them under a build and other load.
- *Types, build, eslint:* pass, with the one warning `main` has in the picker.
- *Every 2025 MLB game, in four time zones:* of the season that's over the list
  keeps none (35 before). As games to come, all 2,343 are listed and under their
  month (23 wrong in London and 68 in Tokyo before). For all 30 postponements the
  list has the makeup alone; the old rule put the postponed game first.
- *Every 2025 MiLB game* played at a park with an MLB id: 8,200, all under their
  month, 299 marked "time TBD".
- *In a browser (dev server):* Yankee Stadium on desktop (1,059 px by click and by
  key; stadium list 908 px, and its place kept when the game changes behind it)
  and at phone size (2,213 px by click and by key; stadium list 1,314 px; the page
  doesn't move). Tab keeps the game. "Mar 31, time TBD" is gray and can't be
  clicked. Wrigley's 27 games are all "time TBD". Lambeau is as before. On the
  home page, with MLB's April 5-6, 2025 entries for Fenway given to it, the only
  game is April 6's. Console: two notes about vibration, from a click made by
  script.
- *The answer for a given game and time is untouched:* only which games are listed,
  and how.
- *Not tested:* Safari and Firefox, a real phone, and MiLB in a browser (its
  season is over).

**Left as is:**
- Opening the stadium list and leaving it with Tab chooses the same stadium again,
  which clears the game (PR #111's rule for picking it again).
- With every game "time TBD", the finder still says "Pick a game from the
  schedule, or set a date and time if yours isn't listed".
- `GameSelector.tsx` has the old month headings and no "time TBD"; no page uses it.

## §39 The finder's wording where no game has a start time (plan, 2026-11-25)

Asked: "fix the finder wording for time TBD parks", then "Build all three", then
"Center it, then PR" (W5). Branch `fix/tbd-wording`, from `main` at 1de38f24c (PR #114).

### Findings

In MLB's schedule today 183 of the 806 regular-season games of the next 180 days
have no start time, and at seven parks that's every one: Dodger Stadium, Fenway,
Oracle, Progressive, Rate, Rogers Centre and Wrigley. Since PR #114 they're listed
as "time TBD" and can't be chosen. Seen at Wrigley on the dev server, the same on
desktop and at phone size:

**1. The box says "Choose a game...", and there's none to choose.** Nothing says why.

**2. The sentence below says "Pick a game from the schedule, or set a date and time
if yours isn't listed".** The first half can't be done, and the second leaves a fan
out: their game is listed. That's also so of a single game with no time, as one of
Yankee Stadium's 31.

**3. `/seats-shade-finder` says the same in two places:** "set its date and time if
it isn't listed" and "If yours isn't listed, enter its date and start time". In the
minors that leaves out a doubleheader's second game.

### Plan

Tests first, seen to fail, then the fix; one commit each.

- [x] W1 (913c60905). `UnifiedApp.tsx` and `MobileApp.tsx`: "If your game isn't listed or its
      time is TBD, set a date and time". True at every park, so nothing has to know
      which one this is. The lines above it already say "Select a Game or Time" and
      "Choose a game time". Test: the one that pins the sentence, in three leagues
      at both sizes.
- [x] W2 (1677037f6). `UnifiedGameSelector.tsx`: when none of the listed games can be chosen, the
      box says "No start times set yet", and below it is what a park with no games
      already shows: 'Try selecting "Custom Time" to analyze any date and time.' and
      its button. One new string in English, Spanish and Japanese. Whether a game can
      be chosen is read from the list's own entries, so there's no second rule for
      it. Tests: all TBD; one with a time; none listed.
- [x] W3 (2d3fcbbe5). `app/seats-shade-finder/page.tsx`: both sentences add "or its time is TBD".
      Test: the one that pins them.
- [x] W4. Checks: all tests, types, eslint, build; Wrigley, Yankee Stadium and Lambeau
      in a browser at both sizes. Then the review.
- [x] W5 (699295bba). `GameSelector.css`: `.no-games p` gets `margin: 8px auto`, so the
      hint is centered on a wide screen. Found while checking W2.

**The smaller patch I'd leave:** W1 alone. Two lines, but the box still says to
choose a game.

**Left as is:** "27 games loaded" and "Found 27 upcoming home games" are true, and the
list still opens to show the dates. Custom Time starts on today's date or the last
one used, not the first game's; that's more than wording.

### §39 Review (2026-11-25)

**What changed:** four commits, one for each. The code is in
`UnifiedGameSelector.tsx`; the rest is wording, in both finders, the finder page and
one new string in three languages, and one line of CSS.

**What a fan sees:**
- At a park where no listed game has a start time, the box says "No start times set
  yet", with the Custom Time hint and button below it. The list still opens, to show
  the dates.
- At every park: "If your game isn't listed or its time is TBD, set a date and time".
- `/seats-shade-finder` says so too.

**Checks:**
- *Tests:* 4,240 of 4,240 in 107 suites; 12 new. Seen to fail first: 8 of them, and
  the 7 older ones that pin the sentences. The other 4 guard a park with one game that
  has a time, and one with none listed. The picker, finder and schedule tests also
  pass in Tokyo, Los Angeles, London and UTC.
- *Types, build, eslint:* pass; the 10 warnings in these files are `main`'s. All of it
  was run again with W5, with the same results.
- *Today's schedule, through the site's own list for all 30 parks:* at 7 every listed
  game is TBD (184 games), at 6 one is, at 17 none.
- *In a browser (dev server), desktop and phone size:* Wrigley has the new box, hint
  and sentence, and the button opens Custom Time. Yankee Stadium and Lambeau still say
  "Choose a game..." with no hint. On desktop, Wrigley lists its 27 games in gray, and
  Sahlen Field (none listed) is as before. At phone size 1:20 PM on April 9, 2027 gets
  an answer at Wrigley and going back to the list keeps it, and the box fits in
  English, Spanish and Japanese.
  Console: notes about vibration, from clicks made by script.
- *The answer for a given game and time is untouched:* only wording, and the hint.
- *Not tested:* Safari and Firefox, a real phone, MiLB games with no time in a browser
  (the season is over). The Spanish and Japanese are mine, not a speaker's.

**W5, the hint off center:** `.no-games p` set `margin: 8px 0`, and every `p` is at most
65 characters wide (`typography-system.css`), so on a wide screen the hint was left of
its centered button. Older; until now only a park with no games showed it. Measured on
the dev server: at 1,280 px the text's center was at 466 px and is at 640, the same as
its block and button, at Wrigley and for both of Sahlen Field's lines. Centered at 1,920
too. At 800 and 375 px the paragraph fills its block, so nothing moves. No unit test:
jsdom doesn't lay pages out.

**Found on the way, not changed:** in the "Select a Game or Time" panel the ball icon is
at the left, not centered over the text (176 px off at 1,280). Older, and another cause:
Tailwind makes every `svg` a block, and centering text doesn't move a block. *Fix:* one
line in `EmptyStates.css`.

**Merged and live:** PR #115 as 03790f2d4, all four checks passed. Production deployment
8062629638, and nine pages answer as build 03790f2d48c4. In the live scripts the new
sentence is there for both finders, with the box's three strings and the new CSS rule,
and the old sentence and rule are gone. `/seats-shade-finder` has W3's wording.

## §40 The off-center ball icon (plan, 2026-11-25)

Asked: "fix the off-center ball icon", then "Build all four". Branch
`fix/empty-state-icon`, from `main` at 03790f2d4 (PR #115).

### Findings

**The cause:** Tailwind's base styles (added 2025-09-02) make every `svg` a block. The
finder's icons are older and were placed as text is: centered with `text-align`, or in a
line of text. Neither works on a block. It's the only rule on the page that sets the
icon's `display`. I looked for the same thing on the home page, the finder, three stadium
pages, the stadium list, a league page, the blog and a post. It shows in four places:

**1. The panel's icon, in both finders.** 176 px left of its text at 1,280 px, 112 px at
phone size. Both the ball ("Select a Game or Time") and the stadium ("Select a Stadium").

**2. The error page's icon,** placed the same way: 185 px off (measured on the page's
markup with the site's styles; no error was forced).

**3. "Sun Information" on desktop:** the sun or moon is on a line of its own above
"Sun is at medium height at 55.2° elevation".

**4. "Typical Game Day Schedule" on stadium guides:** each clock is on a line of its own
above "Gates Open: ...".

### Plan

CSS only; one commit each. No unit tests: jsdom doesn't lay pages out, so each is
measured in a browser before and after. All but the error page's were tried with
injected styles.

- [x] I1 (asked; b7299a3d5). `EmptyStates.css`: `.empty-state-icon` gets `display: flex;
      justify-content: center`. Tried: centered to the pixel at 1,280 (464 to 640) and
      at 375 (75 to 187.5), and the panel keeps its height.
- [x] I2 (7cf2e921a). `ErrorBoundary.css`: `.error-icon` gets the same two lines.
- [x] I3 (b3fce17cf). `globals.css`: `.sun-position svg { display: inline; }`, and `StadiumGuide.css`:
      `.schedule svg { display: inline; }`. Tried: the icon is on its text's line, and the
      line is 26 px tall, not 46 and 42.
- [x] I4. Checks: all tests, types, build; the four places in a browser at both sizes.
      Then the review.

**The smaller patch:** I1 alone, which is all that was asked.

**Not planned:** undoing Tailwind's rule for every `svg`. It's one line, but it reaches
every icon on the site, and most are placed right for a block.

**Also seen, another cause:** on stadium guides, paragraphs and list items are centered as
65-character columns under headings at the left (`.stadium-guide p, .stadium-guide li` in
`globals.css`), so at 1,280 px the text starts about 220 px right of its heading.

### §40 Review (2026-11-25)

**What changed:** three commits, ten lines of CSS and two blank ones. No code.

**What a fan sees:** the ball and stadium icons centered over the panel's text, on desktop
and phone; the error page's icon centered; the sun or moon beside its sentence, and each
clock beside its time.

**Checks:**
- *Tests:* 4,240 of 4,240 in 107 suites, none new (jsdom doesn't lay pages out). *Types
  and build* pass, and the built stylesheets have all four rules.
- *Measured on the dev server before and after:* the ball and stadium icons' centers were
  at 464 px, with the text's at 640, and are at 640; at phone size 75 and 187.5, now
  187.5. The error page's: 414 and 640, now 640; at phone size 56 and 187.5, now 187.5.
  The sun's and moon's line was 46 px tall and is 26, the schedule's 42 and is 26, at
  Lambeau and Sahlen Field.
- *At phone size the schedule's lines* were 67, 42 and 67 px and are 51 each: the clock's
  width wraps "First Pitch: Varies by game" onto a second line.
- *As before:* the height of the ball panel and the error page at both sizes and of the
  stadium panel at 1,280; the phone's sun banner, which has the same class on its text.
- *The error page* was shown by setting its state on the dev server. It's 226 px off, not
  the 185 in the plan: that was a copy of its markup with a shorter sentence.
- *Not tested:* Safari and Firefox, a real phone.

**Found on the way, not changed:** the error page's message is off center too. Another
cause: `GameSelector.css` has a rule for the picker's own `.error-message` (text at the
left, a retry button at the right), and it reaches the error page's.

## §41 Text that doesn't line up with its headings (plan, 2026-11-25)

Asked: find why the guide's text and lists don't start where their headings do on
wide screens, then "All four (A1–A4)". Found while checking PR #116 (§40, still open).
Branch `fix/guide-text-alignment`, from `main` at 03790f2d4. The numbers marked
"tried" come from changing the rules in the browser.

### Findings

**1. Each paragraph and list item is its own centered column.** Two rules cap them
at 65 characters and center what's left over; headings have no cap, so they stay at
the left: `app/globals.css:1314` (`.stadium-guide p, .stadium-guide li`) and
`StadiumGuide.css:266` (`.stadium-guide section > p`, `ul`, `ol`).
- At 1,280 px on `/stadium/buffalo-bisons`: headings at 81 px, paragraphs at 296,
  list items at 306. The same on `/stadium/lambeau-field` and at 1,920 px.
- It's on the 152 MiLB and NFL pages. `/stadium/cubs` isn't reached: MLB pages don't
  use this guide, and their text is capped at 65 characters and starts at its heading.
- *Was it intended?* Centering was: both came with a1892eacd (2025-09-12), with "Wider
  containers should have centered text blocks". The guide was then to be a centered
  960 px column, but its other rule makes it 1,200 px, so the text is centered in
  a card while its headings aren't. At 960 px they wouldn't line up either.

**2. The same commit's block for `/guide/*`, which reaches `/faq` too** (`globals.css:1322`,
from 1,024 px up). Centering was intended here too, but what it does is:
- `/guide/how-to-find-shaded-seats`: the sentence under the title is 52 px right of it;
  8 on `avoid-sun-baseball-games`, 3 on `best-shaded-seats-mlb`.
- `/faq`: every link in "Quick Navigation" and "Related Resources" is centered by
  itself, so they start at different places (362, 390, 396 px; 435, 451, 453).
- Its 65-character cap changes nothing: every `p` has one (`typography-system.css:122`)
  and no list item there is that wide. `.stadium-guide-wrapper` is on no page.
- The one place it helps is the box at the bottom of `/guide`, whose text is meant to be
  centered. Without it that's 4 px off.

**3. On phones, another cause.** `StadiumGuide.css:309` adds 16 px of padding to a
paragraph directly in a section, so the Overview and Neighborhood text start at 89 px
under headings at 73, and the answer box's at 80 where its box has 64. Other
paragraphs line up. Same commit. `/guide/*`, `/faq` and `/stadium/cubs` line up at
phone size.

**4. The error page's message is 75 px left of center** (565 px, title 640, in
`/seats-shade-finder` with the page's own markup put in by hand). `.error-message` in
`GameSelector.css:304` is for the picker's error row, and makes the message a row too.
- *The one-line fix isn't enough:* limited to the picker, that rule stops covering a
  third one, `app-utilities.css:724`, and the message is gray on a pink strip (tried).
- *Cause:* two components use one class name. Giving the error page its own name puts
  the message at 640 px with no strip (tried).

### Plan

One commit each. Nothing to test in jsdom, which doesn't lay pages out; each is
measured in the browser before and after, at 1,280 and 375 px.

- [x] A1 (88470ee89). *Finding 1.* `globals.css`: drop the two margin lines of `.stadium-guide p,
      .stadium-guide li`; the cap stays. `StadiumGuide.css:266`: delete the rule (the one
      above caps paragraphs, and no `ul` or `ol` is directly in a section).
      Tried: paragraphs at 81 px, list items at 101 (their list's own 20 px indent, as
      on MLB pages); nothing changes width or height; 800 px doesn't change.
- [x] A2 (0f9708411). *Finding 2.* `globals.css`: delete the 1,024 px block, and give `.guide-cta p`
      `margin: 0 auto 2rem`. Tried: the sentences and links line up; `/guide` and phones
      don't change.
- [x] A3 (71e25cc6c). *Finding 3.* `StadiumGuide.css:309`: take the three `.stadium-guide section >`
      lines out of the phone rule. Tried: 89 to 73 px and 80 to 64; the page is 102 px
      shorter.
- [x] A4 (755a13be5). *Finding 4.* `ErrorBoundary.tsx` and `ErrorBoundary.css`: rename
      `error-message` to `error-boundary-message` (three lines). Changes that come with
      it: the message is gray and 21 px, as its file says, not red and 16 (contrast 4.4,
      was 3.5; AA asks 4.5), and the picker's error row loses a 24 px bottom margin
      that came from the error page.
- [x] A5. Checks: all tests, types, eslint, build (in a scratch copy); Sahlen, Lambeau,
      Wrigley, the four guide pages and the FAQ at both sizes. Then the review.

**The other choice for A1:** move the headings to the text instead, by capping each
section's whole column. The weather, tips and parking grids use the full width, so
they'd no longer match, and MLB pages already have text at the left.

**Found on the way, not planned:** most lists have no bullets (14 of Sahlen Field's 16, and
the guide pages'), as Tailwind's base styles take them off; the CSS still colors them
(`section li::marker`). Each list is only an indent.

**When PR #116 merges:** both add a section here, so one of the two will need this file
merged by hand. They don't touch the same CSS lines (a trial merge conflicts in this
file alone).

### §41 Review (2026-11-25)

**What changed:** four commits, one for each: 5 lines added and 29 removed, all CSS but
one class name.

**What a fan sees:**
- On the 152 MiLB and NFL pages, text starts under its heading on wide screens, and on
  phones the Overview, Neighborhood and answer text do too.
- On the guide pages the opening sentence is under its title, and on the FAQ the links
  of a list start at one place.
- The error page's message is centered, gray, and larger on a wide screen.

**Checks:**
- *All 152 guides*, each one's own markup put in the page and measured, before and after:

  | Width | Paragraphs off their heading | List items from their heading | Guides that changed height |
  |---|---|---|---|
  | 1,280 | 1,218 of 3,352, by 191 to 256 px; now none | 225 or 203 px; now 20 or 24 | none |
  | 800 | 2, by 36 px; now none | 20 or 24 px, as before | none |
  | 375 | 300, by 16 px; now none | 16 or 24 px, as before | none taller; up to 179 px shorter |

  Not counted as off, and not changed in how they're drawn: 73 parking tips in a bordered
  box, and the answer box, whose text is now 64 px from the edge at 375 (was 80) in a box
  that starts at 40. At 1,920 and 700 px, checked after only, it's the same. No page
  scrolls sideways at any width.
- *Guide pages and FAQ:* at 1,280 the sentences that were 52, 8 and 3 px off are at 0; the
  FAQ's links start at 348 (its second column at 605) and 316 px, 24 px in; the centered
  boxes are still centered, `/guide`'s among them. At 375 nothing moved.
- *`/stadium/cubs`:* as before at both sizes.
- *A real error in the finder*, made by giving it a broken stadium: the message's center
  goes from 551 px to 640, its title's, at 1,280, and is its title's at 375.
- *The picker's error row*, with MLB's schedule blocked: same color, size and place at
  both sizes; 24 px less space under it, as the plan says, and at 1,280 its line is 24 px
  high, not 25.6.
- *Tests:* 4,240 of 4,240 in 107 suites; none new, as jsdom doesn't lay pages out. *Types,
  eslint (the one file of code), build (scratch copy):* pass. The built CSS has the new
  rules and none of the old. Console: of 25 errors the last 10 were read, and all are the
  ones made for these checks.
- *Not tested:* Safari and Firefox, a real phone.

**The plan's 75 px isn't the only number:** it's for the trial's sentence. The message sat at
the left of its row, so a shorter one is further off: 89 px for the real error's.

**Left as is:** the message's contrast, 4.4 where AA asks 4.5 (3.5 before); the lists'
missing bullets; and, in `StadiumGuide.css`, rules for classes no page has.

**PR #116 (§40) merged first:** `main` at 3bd70b12f is merged in here, and this file was the
only conflict; both sections are whole. Checked on the merged tree: 4,240 of 4,240 tests
in 107 suites, types and build. At Lambeau and Sahlen Field the clocks are on their
text's line and the lists and text where §41 has them, and the error page's icon and
message are both centered (640 at 1,280 px, 187.5 at phone size).

**Merged and live:** PR #117 as ad6825ed8, all four checks passed. Production deployment
8066485028, with no manual promote, and nine pages answer as build ad6825ed8b31. The live
styles have A1 to A4's rules and none of the old ones, and the finder's script has the
new class name.

## §42 The missing list bullets (plan, 2026-11-25)

Asked: "restore the missing list bullets", then "All three". Branch `fix/list-bullets`,
from `main` at ad6825ed8 (PR #117).

### Findings

**The cause:** Tailwind's base styles (abe2e76f2, 2025-09-02) set `list-style: none` on every
`ul` and `ol`. The site's own rules, from 2025-08-07, indent the lists and color their
markers (`section ul, section ol` and `section li::marker` in `globals.css`) and left the
bullets and numbers to the browser. So the indent and the color are still there, with
nothing in them.

**Where:** I checked every list on every type of page and on all 182 stadium pages. These
have no marker, and no rule of ours takes it off:

| Pages | Lists |
|---|---|
| Stadium guides (150 of the 152 MiLB and NFL pages) | 1,914, with 6,097 items |
| MLB pages, "Recommended Gear" | 30 |
| The three `/guide` articles | 27, two of them numbered |
| Eight legal pages | 77, four of them in closed tabs of `/privacy-rights` |
| League pages, "Shade Tips" | 6 |
| Two blog posts (Yankee Stadium and Fenway Park) | 4 |
| `/how-it-works` | 1, which has no indent either |

**Meant to be plain, so left so:** menus, cards and rows of links on the home page, the
FAQ, the MLB pages and the blog (each has its own `none`); the footer's links, which have
only Tailwind's; and the 150 game day schedules, whose clocks stand where bullets would.
**Already right:** the 190 lists of club perks, and the finder's four steps, which have
their own numbers.

**League pages:** their items start with a typed "•", so they'd have two.

### Plan

One commit each. No unit tests for L1's and L2's rules: jsdom doesn't lay pages out.
All were tried with injected styles, on 13 pages at 1,280 px and 11 at 375: no text moved,
no list or page changed height and nothing scrolls sideways. Only L3's text moves, 20 px
right. The typed bullets weren't taken off in the trial, and the league pages' are
doubled in it.

- [x] L1 (cc4d9856b). `globals.css`: `section ul, section ol` gets `list-style: revert`, which gives back the
      browser's own bullets and numbers. With it, so that nothing is doubled:
      `.schedule ul { list-style: none; }` in `StadiumGuide.css`, and the typed "•" comes off
      five lines of `app/league/[leagueId]/page.tsx`. Lists with a `none` of their own keep
      it, as their rules are stronger.
- [x] L2 (e893441ea). `blog-post.css`: `.post-content ul, .post-content ol` gets the same line. A post's
      text isn't in a `section`.
- [x] L3 (72cc8d714). `/how-it-works`: its list gets `list-disc pl-5`. It isn't in a `section` either.
- [x] L4. Checks: all tests, types, eslint, build; every page above in a browser before and
      after at both sizes, and all 152 guides. Then the review.

**The smaller patch:** L1 alone. It's 2,054 of the 2,059 lists.

**Not planned:** undoing Tailwind's rule for every list. The footer's links and others with
no rule of their own would get bullets.

### §42 Review (2026-11-25)

**What changed:** three commits, one for each: 12 lines added and 6 removed outside this
file. CSS, five typed bullets and one list's classes.

**What a fan sees:** bullets on the lists in the stadium guides, the `/guide` articles, the
legal and league pages, two blog posts, `/how-it-works` and the MLB pages' "Recommended
Gear", and numbers on two lists in the `/guide` articles. They're navy where the list is in
a section, as the site's rule always said, and the text's color elsewhere.

**Checks:**
- *Every page, before and after,* at 1,280 and 375 px on the dev server in Chromium: all 182
  stadium pages and 25 others (a 26th address is an unpublished post that goes to the
  Cardinals' page). 2,055 lists got their markers and none lost one; with the four in the
  closed tabs of `/privacy-rights`, opened and checked by hand, that's the plan's 2,059.
  The 150 schedules, the menus and the footer are as before, no list has two bullets, and
  nothing scrolls sideways.
- *Nothing moved* but these: `/how-it-works`' list, 20 px right at both sizes, and on phones
  the league pages, which are 26 px shorter. One line fits without its typed bullet. The
  plan said no height changed, but its trial still had the typed ones.
- *Dark mode,* at Lambeau: the guide stays light, and its bullets are as in light mode.
- *Tests:* 4,240 of 4,240 in 107 suites, none new. *Types, eslint (the two files of code)
  and build* pass, and the built stylesheets have the rules.
- *Not tested:* Safari and Firefox, a real phone.

**Left as is:** the league pages' items are spaced unevenly (`space-y-1` against the site's
own margin for items). Older, and another cause.

---
---

# Previous audit (2026-08-07), kept for history

## theshadium.com — Sun/Shade Accuracy Audit (2026-08-07)

## Verdict

**Historical audit finding:** the site told users to sit on the sunny side. Three of the four production
shade models have the sun/shade sides **exactly inverted**. All 900 existing
tests pass, because no test ever compared model output against the physical rule
using realistic section data.

## Ground truth (the rule everything must obey)

A grandstand shades its own seats. The stands on the **same compass side as the
sun** are in their own shadow (**shaded**); the stands **across the bowl from the
sun** take the light in the face (**sunny**).

This is not my invention — it is the convention already documented in
`src/utils/sectionSunCalculations.ts` (header), used by `src/utils/shadeSide.ts`
and `app/stadium/[stadiumId]/StadiumPageSSR.tsx`, and confirmed by the sourced
sun-pattern notes already sitting in `src/data/stadiums.ts`:

- Rogers Centre (orientation 0°/N): *"3rd base side is the shade side, 1st base
  side is sunny."* 3B compass = 270° (W) = where the afternoon sun is. ✔
- Guaranteed Rate / Progressive / Busch notes all read *"3B shade side"* for
  parks whose 3B side faces west. ✔
- Matches Wrigley (3B shaded, 1B bakes), Fenway (3B grandstand shaded, CF/RF
  bleachers roast), Oracle Park (1B side shaded in the afternoon).

## Measured evidence

Probe: all 30 MLB parks × 1 PM / 4 PM / 7 PM on 2025-07-15 (87 daylight samples).
For each, compare the section whose compass bearing equals the sun azimuth
(**must be shadier**) against the section 180° opposite (**must be sunnier**).

| # | Model | File | Powers | Correct |
|---|-------|------|--------|---------|
| A | `getSectionSunExposure` | `src/utils/sectionSunCalculations.ts` | stadium-page shade diagram | **30/87** |
| B | `SunCalculator` *as UnifiedApp calls it* | `src/utils/sunCalculator.ts` | homepage MLB section list, MobileApp | **31/87** |
| B′ | `SunCalculator` given correct compass angles | " | " | **1/87** |
| C | `calculateRowShadows`, rows **with** overhang | `src/utils/sunCalculator.ts` | `/api/stadium/*/rows/shade` | **0/87** |
| C | `calculateRowShadows`, rows without overhang | " | " | 29/87 |
| D | `getUnifiedVenueShade` | `src/utils/getUnifiedVenueShade.ts` | homepage shade % + "most shaded first" sort, **all 180+ venues** | **0/87** |

B and B′ differ because UnifiedApp/MobileApp also pass the wrong angle — the two
bugs partially cancel into noise. A scores 30/87 because it is directionally
right but goes flat at high sun (see H-1); it never actually points the wrong way.

## Root cause

There is no single tested primitive for "which side of the bowl is in shade."
Four independent implementations each re-derived it from scratch; three inverted
the sign. Comments in `sunCalculator.ts` and `getUnifiedVenueShade.ts` even
*mislabel* the branches ("Section faces away from sun" on the branch where the
seats face into the sun), which is how the inversion survived review.

The test suite locked in the defect rather than catching it:
`src/utils/__tests__/shadeSanity.test.ts` asserts the correct physical ordering,
but only for sections built with `overhangHeight: 0` — a configuration that does
not exist in the real data (6,877 of 30,551 real MLB rows carry an overhang). On
those synthetic sections model C is right; on every real section it is inverted.

---

## Todo

**Status:** Trust patch complete. The directional physics defect is fixed, and
public seat-level outputs remain withheld until measured stadium geometry
passes an independent validation gate. All 30 MLB section inventories are now
reconciled against current official charts or club-linked venue maps.

### Phase 1 — one source of truth
- [x] 1.1 Add `src/utils/bowlGeometry.ts`: the single documented primitive —
      `sectionCompassAngle()` (moved from `sectionSunCalculations`) plus
      `sunIncidence(sunAz, sectionCompass) → { sunBehindFactor, sunFacingFactor }`,
      continuous, no branch at 90°, with the physics derivation in the header.
- [x] 1.2 Add `src/utils/__tests__/bowlGeometry.test.ts` — sign, continuity,
      symmetry, wrap-around.

### Phase 2 — fix the three inverted models (user-facing, highest impact)
- [x] 2.1 `getUnifiedVenueShade.ts`: swap the inverted branches, rebuild on the
      Phase-1 primitive. (Homepage shade % for every venue.)
- [x] 2.2 `sunCalculator.ts#calculateSectionShadow`: swap the inverted branch;
      delete the false "angles are already absolute compass" comment on
      `getSectionAngle`.
- [x] 2.3 `UnifiedApp.tsx:224` + `MobileApp.tsx:193`: stop passing raw
      stadium-local `baseAngle` as a compass `angle`; use `sectionCompassAngle`.
      Also fix the two different, both-wrong `side` derivations.
- [x] 2.4 `sunCalculator.ts#calculateRowShadows`: swap which regime the overhang
      term belongs to — the deep shade case is *sun behind the section*; the
      *sun-in-your-face* case is back-rows-only under the lip. Keep the
      continuous blend (no 90° discontinuity).

### Phase 3 — the model that points the right way but says nothing
- [x] 3.1 `sectionSunCalculations.ts#getSectionSunExposure`: azimuth
      discrimination currently vanishes at sun altitude ≥ 45°, so at 1 PM and
      4 PM the stadium-page diagram is orientation-blind — every open section
      reads identical. Rebuild on the Phase-1 primitive so azimuth still
      separates sides at high sun, damped but non-zero.
- [x] 3.2 Remove the discontinuity at exactly 90° (adjacent sections currently
      jump ~3× across an invisible seam).

### Phase 4 — row-level data degeneracy
- [x] 4.1 `calculateRowShadows` divides by `Math.max(row.depth, 0.001)`. 647 real
      rows have an overhang and `depth: 0`, so they are pinned to 100% coverage
      whatever the sun does. Treat missing depth as unknown and fall back to the
      section-level answer instead of fabricating full shade.
- [x] 4.2 Audit the 2,310 rows with `depth: 0` — they are valid front-row
      offsets, not missing data. Derive distance behind the overhang lip from
      the section's row set and fall back to section geometry when no positive
      deck depth exists.

### Phase 5 — 3D path (public API `?use3d=true`)
- [x] 5.1 `shadeCalculation3DOptimized.ts#getSunRayDirection` returns the
      direction light *travels* (downward). The occlusion ray is cast from the
      seat along it, i.e. into the ground — a roof above a seat can never
      occlude. Negate it (cast toward the sun).
- [x] 5.2 `estimateSectionShadeQuick`: mixes stadium-local `baseAngle` with
      `sunAz − orientation`, never wraps `angleDiff` to [0,180], and inverts the
      branch. Rebuild on the Phase-1 primitive.

### Phase 6 — unsourced fudge factors
- [x] 6.1 `getUnifiedVenueShade` stacks additive bonuses on top of the physical
      term: upper deck +25/+30, `opened > 2000` +5, retractable +15, and a
      "third base side" +15 applied at **every** park regardless of orientation.
      These can move a section two tiers on no evidence. Remove or ground them.
- [x] 6.2 Weather multiplier conflates UV intensity with geometric shade —
      clouds do not move the shadow line. Separate the two concepts.

### Phase 7 — tests that would have caught this
- [x] 7.1 Replace the synthetic `overhangHeight: 0` sanity sections with **real**
      sections from `getStadiumSections`, all 30 parks × 1 PM/4 PM/7 PM,
      asserting sun-side-shadier for every production entry point.
- [x] 7.2 Pin the published sun-pattern claims from `stadiums.ts` (Rogers Centre
      3B-shade, Chase Field sunrise-over-RF, etc.) as regression tests.
- [x] 7.3 Cross-model consistency test: all four paths must agree on which half
      of the bowl is shaded, for every park and hour.
- [x] 7.4 Re-run the probe; require 87/87 on every model before calling it done.

### Phase 8 — verify
- [x] 8.1 Full `npx jest` green.
- [x] 8.2 `npm run type-check` + `npm run lint` clean (lint has pre-existing
      warnings, zero errors).
- [x] 8.3 Spot-check the rendered site (homepage + Rate Field, Fenway Park,
      and Oracle Park) against the
      published shade guidance for those parks.

### Phase 9 — source the remaining 27 MLB section maps
- [x] 9.1 Replace every generated 65-section team file. The replacements now use
      screen-space placement from club-linked public maps: 20 exact polygon
      charts, three virtual-venue hotspot maps, and four static club charts.
- [x] 9.2 Calibrate each screen map from named behind-home and center-field
      anchors to the park's recorded compass orientation; derive modeled section
      placement from each SVG footprint. These are not surveyed coordinates.
- [x] 9.3 Keep the evidence boundary explicit: section identity and chart order
      are source-backed; screen placement (where available), per-row elevation,
      rake, depth, overhangs, and obstructions remain modeled.
- [x] 9.4 Unify `getStadiumSectionsAsync` with the detailed aggregator so the
      rendered stadium page, homepage, row API, 3-D calculator and audits no
      longer read two drifting MLB datasets.
- [x] 9.5 Add provenance for all 30 parks and inventory/geometry/page-loader
      regression tests for all 27 replacements.

### Phase 10 — trust patch: fail closed at the measurement boundary
- [x] 10.1 Replace the blanket `real` fidelity label with `source-backed` section
      inventory and separate confidence fields for placement, row geometry,
      obstruction geometry, observation validation, and roof state.
- [x] 10.2 Keep the release gate fail-closed until metric geometry and
      independent time-stamped shadow observations pass.
- [x] 10.3 Return HTTP 409 from the public row/3-D shade API for unvalidated
      parks; include conservative status and field-level confidence metadata.
- [x] 10.4 Withhold section percentages, row rankings, legacy shade tips, and
      the interactive color model on the stadium page and desktop/mobile finder.
- [x] 10.5 Publish only `verified-shaded`, `verified-sun`, `uncertain`, or
      `roof-state-dependent` states, with permanent-roof/nighttime conclusions
      kept separate from unvalidated row geometry.
- [x] 10.6 Replace public copy and structured-data overclaims with prominent
      measurement notices and conservative planning guidance.
- [x] 10.7 Run the full suite, strict audits, production build, API probes, and
      rendered desktop/mobile browser checks before declaring the patch complete.

### Phase 11 — live Internet source reconciliation
- [x] 11.1 Re-scrape the live club-linked viewers. De-duplicate the Twins'
      responsive SVG copies (162 products, not 324) and preserve official
      labels plus published row/seat manifest counts where available.
- [x] 11.2 Add read-only extractors for IOMEDIA hotspot maps and Sportsdigita
      JSON5/SVG paths. Integrate Atlanta (273), Arizona (149), Seattle (169),
      and Colorado (190) without inferring roofs or overhangs from map pixels.
- [x] 11.3 Render and visually inspect Toronto's official 2026 PDF, then replace
      the incomplete 124-entry model with all 252 published numbered products,
      including the 300/400 suite levels.
- [x] 11.4 Reconcile the Athletics, Giants, and Padres static charts; remove
      invented/obsolete IDs and restore published premium and suite levels.
- [x] 11.5 Preserve source mismatches as evidence before replacement: Fenway's
      viewer has 483 ticket products, 401 direct product polygons, 82 Field Box
      subdivision aliases, and 15 non-ticket overlays; Yankee Stadium has 222
      live products versus 184 obsolete legacy entries.
- [x] 11.6 Add an explicit inventory reconciliation status to provenance, expose
      it in the trust notice/API metadata, and require `reconciled` inventory in
      addition to measured geometry and observation validation before exact
      shade can ever be published.
- [x] 11.7 Replace Fenway with all 483 live products, Yankee Stadium with all
      222 live zero-padded/accessibility products, and Rate Field with the 132
      numbered/named products on its current chart. Do not infer coverage from
      their screen polygons.
- [x] 11.8 Reconcile Petco Park's numbered sections with the stable suite types
      on the official suite site and the small suite/party codes printed on its
      static chart. Do not confuse event-specific suite availability with a
      permanent section inventory.
- [x] 11.9 Replace the literal on-site/survey-only boundary with an evidence
      gate that accepts remote metric reconstruction while preserving quantified
      uncertainty and independent shadow-observation requirements.

### Phase 12 — remote metric geometry acquisition
- [x] 12.1 Add executable evidence stages and conservative release thresholds:
      complete metric coverage, no more than one foot horizontal/vertical and
      one degree orientation uncertainty, plus a 30-observation holdout across
      three dates and a 25-degree solar-altitude span. The strict stadium audit
      now rejects broken source references, unsupported measured stages,
      missing artifact versions, and invalid holdout claims.
- [x] 12.2 Add a reproducible USGS TNM lidar discovery audit. On 2026-08-07 it
      found centre-covering tiles for all 29 U.S. MLB parks with zero request
      failures. The 2026-08-08 correction now groups tiles by the official
      project URL and requires a same-project union to cover at least 99.9% of a
      conservative 700-foot footprint; all 29 U.S. parks have at least one
      complete-footprint candidate, though many complete acquisitions are old.
      Toronto is correctly routed outside USGS jurisdiction.
- [x] 12.3 Download and inspect Petco's official 2014 USGS point cloud. The
      8,278,730-point source resolves the bowl/decks; a reproducible extractor
      produced a provenance-stamped 61,283-cell candidate heightfield and kept
      `publication.eligible=false`.
- [x] 12.4 Register the City of Toronto's licensed citywide 3-D massing dataset
      as an exterior/roof candidate for Rogers Centre, preserve the city's
      precision/fitness disclaimer, and do not pretend it exposes the closed
      building's interior rows.
- [x] 12.5a Add a reproducible Petco surface audit using the real flight-line
      IDs. The unit-correct v2 298,603-return footprint has 32.63% one-foot sampling coverage,
      3.19% two-flight-line coverage at that scale, and explicitly candidate-
      only connected surface components.
- [x] 12.5b Audit official post-2014 changes and add geometry currency as an
      independent hard release gate. Petco's 2014 source is marked stale after
      documented 2015 left-field, 2016 right-center, 2024 Gallagher Square, and
      2025 Western Metal work.
- [x] 12.5c Build an official MLB highlight-to-play candidate pipeline with
      stadium-local dates, solar positions, independent source keys, explicit
      review blockers, and repeatable frame sampling. The eight-game Petco
      pilot produced 107 candidates covering 105 independent play events across
      eight local dates, now with official media assets and a weather-aware
      review queue. Alternate edits share an independence key. Five clips were
      correctly rejected; the best current wide shot shows tier-scale shadows
      but cannot resolve an unambiguous row boundary or camera/time control.
- [ ] 12.5d Acquire current metric coverage for the changed Petco structures,
      independently control the stadium frame, produce reviewed semantic
      row/obstruction meshes, and pass the timestamped broadcast/photo holdout.
- [ ] 12.6 Repeat the measured-artifact and holdout pipeline park by park,
      prioritizing recent high-density lidar candidates and open-air venues.
- [x] 12.6a Make discovery and extraction multi-tile and unit-safe. The audit
      rejects centre-only/partial projects, while both lidar scripts hash every
      tile, validate matching CRS/units, and convert metres or U.S. survey feet
      explicitly before any stadium-centred calculation.
- [x] 12.6b Run the next open-air pilots without promotion. Angel Stadium's 2023
      QL1 project covers only 67.86% of the audit footprint and its rendered
      eastern bowl is truncated. Dodger Stadium's complete two-tile 2023 source
      has 92.83% one-foot sampling and 69.06% two-flight-line coverage, but no
      stadium-surface horizontal control, semantic row/obstruction mesh, current
      whole-scope geometry, or observation holdout. Both remain fail-closed.
- [x] 12.6c Audit the official 2024-2025 Philadelphia QL1 tile without promotion.
      The clean 163,167,866-byte source decompresses to all 28,721,465 declared
      points and the stadium footprint contains 3,479,061 non-noise returns from
      2024-12-17 and 2025-04-02 passes. It achieves 95.60% one-foot sampling and
      68.36% one-foot two-flight-line coverage, with 0.295 ft p95 stable-surface
      flight-line disagreement. The source is still stale for exact publication
      because the club documented an expanded team-store footprint and five new
      25-foot LED towers for 2026. Semantic rows, current obstruction deltas, and
      an independent shadow holdout also remain unproved.

---

## Review

### What changed

- Added `bowlGeometry.ts` as the one coordinate/physics source for compass
  conversion, continuous sun incidence, shadow reach, rim occlusion, structural
  shade, and direct-sun percentage.
- Refit the homepage, mobile, venue diagram, row API, and optimized 3D paths to
  that primitive. Stadium orientation is no longer discarded by passing a
  local `baseAngle` as an absolute compass angle.
- Corrected the 3D ray direction and coordinate frame, normalized obstruction
  bounding boxes, and combined ray-cast obstructions with the bowl's own
  structural self-shading.
- Replaced invented venue bonuses with geometry and separated geometric shade
  from weather-damped effective sunlight.
- Added all-park, real-production-data direction tests, published-guidance
  regressions, cross-model agreement checks, and route-level sign coverage.

### Verification

| Check | Result |
|---|---|
| `npm test -- --runInBand` | ✅ 1,037 / 1,037, 36 suites |
| Row shade route trust gate | ✅ 2-D + 3-D withheld; no section payload; 409 is `no-store` at production runtime |
| `npm run type-check` | ✅ exit 0 |
| `npm run lint` | ✅ exit 0; existing warnings only |
| `npm run validate-stadium-data` | ✅ 6,727 MLB sections; no hard data errors |
| `npm run build` | ✅ 460 static pages generated |
| `npm run test:local` | ✅ 10 / 10 accessibility, mobile-overflow, console, asset, and trust-boundary checks |
| Browser smoke check | ✅ desktop/mobile stadium + finder trust states; no console errors |

### Remaining precision boundary

All 30 MLB parks now carry source-backed, reconciled section identities. Screen
placement, row, overhang, and obstruction geometry remains modeled unless a
remote evidence entry says otherwise. The strict audit reports
`source-backed=30`, `approximate=0`, and no duplicate section files.
The public charts do **not** provide metric elevation, rake, row depth or
roof/overhang meshes. USGS lidar and municipal 3-D data now provide a remote
acquisition route, but source discovery is not measurement validation. Those
calculator inputs stay withheld until extraction uncertainty and independent
observations pass `src/data/stadiumGeometryEvidence.ts`.
