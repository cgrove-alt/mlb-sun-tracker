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
- [ ] 7.5 Batch 5 (retractable roofs: measure the parked roof only where the scan shows it open)
      With each underside, the deck's front (`deckFrontFt`, §9) from the
      cover report, at tier level, and per section where a section is under
      another deck.

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
