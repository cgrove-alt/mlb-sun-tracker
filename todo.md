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
- [ ] 2.7 Replace `bestShadedSideForDayGame` copy (page, FAQ JSON-LD, OG
      image) with the engine's answer for a typical 1:05 PM and 7:05 PM start.
      Done: MLB pages and their FAQ JSON-LD no longer use it. Left: the OG
      image and the NFL guide's ShadeAnswer (with 2.8).
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
- [ ] 4.7 Rewrite the copy for fans: remove "withheld", "self-shade",
      "holdout", "geometry confidence", "publication gate" and "paused" from
      every page, the FAQ, guides and JSON-LD. Done: homepage, finder page,
      every MLB stadium page and its JSON-LD, the old apps. Left: /faq,
      /guide pages, /disclaimer, HomepageSchema, /how-it-works.

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
- [ ] 6.0 18 section files pass the orientation to `buildParkSections` as a
      typed number (Angels `50`, Astros `340`, …) next to
      `getStadiumOrientation()`. They match `stadiums.ts` today, but a
      re-measured park would keep the old angle for part of its seat map, and
      the consistency test doesn't look at these files. Pass `ORIENTATION`
      everywhere and make the test fail on a typed number.

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
- [ ] 7.3 Batch 3
- [ ] 7.4 Batch 4
- [ ] 7.5 Batch 5 (retractable roofs: measure the parked roof only where the scan shows it open)

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
