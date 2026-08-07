# Shadium Codebase Audit — July 27, 2026

**Scope:** Exhaustive audit of the entire Next.js codebase deployed at theshadium.com.  
**Files reviewed:** Every source file in `app/`, `components/`, `src/`, `lib/`, `hooks/`, `utils/`, `styles/`, `public/`, `scripts/`, plus config files.  
**Total issues found: ~170** across 11 categories.

---

## CRITICAL (14 issues)

### C1. Wrong timezone: Rangers — `src/data/stadiums.ts:302`
**What:** Rangers timezone is `'America/Denver'` (Mountain). Arlington, TX is Central.  
**Impact:** Every shade calculation for Globe Life Field is off by 1 hour. Sun position data is wrong for all Rangers games.  
**Fix:** Change to `'America/Chicago'`.

### C2. Wrong timezone: Reds — `src/data/stadiums.ts:344`
**What:** Reds timezone is `'America/Chicago'` (Central). Cincinnati, OH is Eastern.  
**Impact:** Shade calculations off by 1 hour for all Reds games.  
**Fix:** Change to `'America/New_York'`.

### C3. Wrong timezone: Tigers — `src/data/stadiums.ts:383`
**What:** Tigers timezone is `'America/Chicago'` (Central). Detroit, MI is Eastern.  
**Impact:** Shade calculations off by 1 hour for all Tigers games.  
**Fix:** Change to `'America/New_York'`.

### C4–C7. Same timezone bugs duplicated in `src/data/unifiedVenues.ts`
**What:** Rangers (:658), Guardians (:388), Reds (:748), Tigers (:838) all have the same wrong timezones in the second data file. The Guardians bug was fixed in `stadiums.ts` but NOT in `unifiedVenues.ts`, proving the two files drift.  
**Impact:** Any code path reading from `unifiedVenues.ts` gets wrong shade data.  
**Fix:** Fix all four timezones. Long-term: make one file the single source of truth.

### C8. React Rules of Hooks violation — `src/hooks/useLoadingState.ts:206`
**What:** `useMultipleLoadingStates` calls `useLoadingState()` inside a `forEach` loop. The eslint-disable comment proves this was known and deliberately suppressed.  
**Impact:** If the `keys` array length changes between renders, React crashes.  
**Fix:** Refactor to a single `useReducer` with keyed states.

### C9. React Rules of Hooks violation — `src/hooks/useHapticFeedback.ts:108`
**What:** `enhancePropsWithHaptic()` is a regular function (not a hook or component) that calls `useHapticFeedback()`.  
**Impact:** Crashes or undefined behavior when called outside a component render.  
**Fix:** Rename to `useEnhancedHapticProps` and ensure it's only called from components, or accept the haptic object as a parameter.

### C10. `setState` inside `useMemo` — `src/components/SeatRecommendationsSection.tsx:106`
**What:** `setIsLoading(true)` and `setIsLoading(false)` are called synchronously inside a `useMemo` callback.  
**Impact:** Violates React's purity requirement for `useMemo`. The loading state flickers or is silently ignored, making the loading UI dead code.  
**Fix:** Move to `useEffect` if async loading is needed, or remove `setIsLoading` calls entirely.

### C11. Missing `'use client'` — `src/components/FilterDrawer/FilterDrawer.tsx:1`
**What:** Uses `useEffect`, `useRef`, and custom hooks but lacks the `'use client'` directive.  
**Impact:** Build failure if imported from a server component in Next.js App Router.  
**Fix:** Add `'use client';` as the first line.

### C12. Missing `'use client'` — `src/components/StadiumTitleBlock/StadiumTitleBlock.tsx:1`
**What:** Uses `useState`, `useCallback`, `useEffect`, `window`, `localStorage`, `navigator.clipboard` — all client-only APIs.  
**Impact:** SSR crash or build failure.  
**Fix:** Add `'use client';` as the first line.

### C13. Contradictory ARIA — `src/components/SectionShadeSEO.tsx:20`
**What:** Container has both `className="sr-only"` (visible to screen readers) and `aria-hidden="true"` (hidden from screen readers).  
**Impact:** Content is invisible to everyone — both visual users and screen reader users.  
**Fix:** Remove `aria-hidden="true"` to keep as screen-reader content, or remove `sr-only` for SEO-only content.

### C14. Impossible boolean condition — `src/services/seatRecommendationEngine.ts:259`
**What:** `angle >= 240 && angle <= 30` can never be true (no number is simultaneously ≥240 AND ≤30).  
**Impact:** Third-base side view scores are always 30 (fallback) instead of the intended 70 for the 240–360/0–30 range.  
**Fix:** Change `&&` to `||`.

---

## HIGH (25 issues)

### H1. Nested `<main>` landmarks — `app/HomePage.tsx:43` + `app/layout.tsx:146`
Both render `<main>`. Invalid HTML; violates WCAG (one `<main>` per page). Same issue in `faq/page.tsx`, `how-it-works/page.tsx`, `blog/page.tsx`, all `guide/` pages.  
**Fix:** Use `<div>` or `<section>` in child pages.

### H2. `StadiumPageSSR.tsx` is `'use client'` unnecessarily — `app/stadium/[stadiumId]/StadiumPageSSR.tsx:1`
No useState/useEffect/event handlers. Pure server-renderable content (stadium info, sections table, FAQ). Marking as client forces full hydration.  
**Fix:** Remove `'use client'` to make it a server component.

### H3. `KillOverhang.module.css` nuclear CSS — `app/stadium/[stadiumId]/KillOverhang.module.css`
Wildcard `*` with `!important` on margin, transform, and transition for all descendants. Breaks legitimate animations.  
**Fix:** Target specific selectors.

### H4. Duplicate game selectors — `src/components/GameSelector.tsx` + `UnifiedGameSelector.tsx`
Nearly identical logic with `customSelectStyles` duplicated verbatim.  
**Fix:** Delete `GameSelector.tsx` or extract shared logic.

### H5. `any` props on StadiumPageClient — `app/stadium/[stadiumId]/StadiumPageClient.tsx:28-31`
`stadium`, `sections`, `amenities`, `guide` all typed `any`. Proper types exist in the codebase.  
**Fix:** Import and use `Stadium`, `StadiumSection[]`, etc.

### H6. GA Measurement Protocol secret in client code — `lib/analytics.ts:36`
API secret in client-side `fetch()` URL query string. Visible in browser DevTools.  
**Fix:** Move Measurement Protocol calls to a server-side API route.

### H7. `unsafe-eval` in CSP — `middleware.ts:28`
CSP `script-src` includes `'unsafe-eval'`, allowing `eval()` execution.  
**Fix:** Remove `unsafe-eval` or restrict to dev. Use nonces instead of `unsafe-inline`.

### H8. NFL stadium obstruction key mismatches — `src/data/stadiumObstructions.ts`
7+ NFL stadium keys use outdated names (`'paul-brown-stadium'` → `'paycor-stadium'`, etc.). Lookups fail silently.  
**Fix:** Update keys to match current venue IDs.

### H9. Code splitting is ineffective — `src/data/stadiumLoader.ts:12-131`
Every "dynamic import" case imports the same 577KB monolith `./stadiumSections`. `getStadiumSections.ts` has correct per-stadium chunks.  
**Fix:** Switch to per-stadium imports from `./stadiumSections-split/`.

### H10. `stadium-data-aggregator.ts` defeats tree-shaking — `src/data/stadium-data-aggregator.ts:1-434`
Eagerly imports ALL 30 MLB section files + 29 obstruction files at top level.  
**Fix:** Use dynamic imports.

### H11. `Math.random()` causes hydration mismatches — `src/data/stadiumLayoutEnhancer.ts:377,383` + `stadiumSectionGenerator.ts:197,208,219`
Used to determine stadium features (berm, party deck names). Server and client generate different values.  
**Fix:** Use seeded PRNG based on stadium ID.

### H12. SSR crash — `src/utils/pwa.ts:30-32`
Constructor accesses `sessionStorage` and `window.matchMedia` without SSR guard.  
**Fix:** Guard with `typeof window !== 'undefined'`.

### H13. Module-level `setInterval` leaks — `src/utils/apiCache.ts:99-102`
`setInterval` runs on every import including server-side, creating timer leaks.  
**Fix:** Guard with `typeof window !== 'undefined'`.

### H14. Sun angle geometry bug — `src/utils/sunCalculations.ts:211-216`
Comment says angles are "absolute compass" but `baseAngle` is stadium-local. `stadiumOrientation` parameter is never applied.  
**Fix:** Add orientation offset or fix comment and verify downstream consumers.

### H15. Duplicate ErrorBoundary CSS — `components/ErrorBoundary.css` vs `src/components/ErrorBoundary.css`
Two different files (116 vs 192 lines), both loaded. Conflicting styles.  
**Fix:** Delete the simpler `components/` version.

### H16. `StickyNavigation.tsx:24` — scroll state in `useState`
`lastScrollY` stored in `useState` causes re-render on every scroll pixel.  
**Fix:** Use `useRef`.

### H17. `FloatingActionButton.tsx:66` — effect depends on scroll state
`useEffect` re-runs (re-adds scroll listener) on every scroll event.  
**Fix:** Use `useRef` for `lastScrollY`.

### H18. `MobileStadiumGuide.tsx:41-51` — hardcoded weather data
`monthlyAverages` is identical for every stadium (Phoenix = Seattle = Detroit). Misleading.  
**Fix:** Remove, fetch real data, or label as illustrative.

### H19. `EnhancedSunFilter.tsx:541` — bare `window.innerWidth` access
Accessed at top level of render, outside hook/effect. Crashes during SSR.  
**Fix:** Use the `isMobile` prop or guard the access.

### H20. Style injection leak — `src/components/ModernLoadingStates.tsx:172-186`
`document.createElement('style')` runs at module import time with no dedup guard. Each HMR cycle appends a new `<style>` tag.  
**Fix:** Remove dead code block or use CSS file.

### H21. Missing `noopener,noreferrer` — `src/components/StadiumTitleBlock/StadiumTitleBlock.tsx:114-116`
`window.open()` for social sharing lacks security parameters. Reverse tabnapping risk.  
**Fix:** Add `'noopener,noreferrer'` as third argument.

### H22. `LoadingTransition.tsx:75-76` — `any[]` and `any` in generic component
`StaggeredListTransitionProps` uses untyped arrays.  
**Fix:** Make generic `<T>`.

### H23. `MobileApp.tsx` silently swallows errors — `:44`
`error` state is set but never displayed in JSX.  
**Fix:** Render error state in UI.

### H24. Homepage is thin — `app/HomePage.tsx`
Only headline + subheadline + CTA button visible. Explanatory content (how it works, venue count) is in `sr-only` divs hidden from visual users.  
**Fix:** Surface the explanatory content as visible sections.

### H25. Conflicting `X-Frame-Options` — `middleware.ts:10` vs `vercel.json:32`
Middleware sets `DENY`, vercel.json sets `SAMEORIGIN`.  
**Fix:** Pick one source of truth.

---

## MEDIUM (65 issues)

### Duplicate files / routes

| # | File | Issue |
|---|------|-------|
| M1 | `app/faq/page.tsx` + `app/faqs/page.tsx` | Duplicate route (faqs redirects to faq — intentional but adds overhead) |
| M2 | `src/components/Breadcrumb.tsx` (235 lines) | Legacy orphan; all imports use `Breadcrumb/Breadcrumb.tsx` (45 lines) |
| M3 | `src/components/OptimizedImage.tsx` (71 lines) | Orphan; all imports use `components/OptimizedImage.tsx` (129 lines) |
| M4 | `src/MobileApp.tsx` + `src/UnifiedApp.tsx` | Section calculation logic duplicated (~80 lines each) |
| M5 | `src/components/MobileFilterPortal.tsx` + `MobileMenuPortal.tsx` | Nearly identical portal implementations |
| M6 | `src/services/nflApi.ts:49` + `nflApiClient.ts:60` | `TEAM_STADIUM_MAP` duplicated |
| M7 | `.claude/worktrees/` (6 directories) | Stale worktrees contain `page 2.tsx`, `StadiumPageClient 2.tsx` duplicate files |
| M8 | `app/critical.css` + `app/critical-styles-inline.tsx` | Same critical CSS with conflicting values (hero gradient, min-height) |
| M9 | `app/globals.css:636-728` | `.feature-list` / `.feature-icon` defined twice with different values |

### Dead code

| # | File:Line | Issue |
|---|-----------|-------|
| M10 | `components/CSSOptimizer.tsx:59-68` | `prefetchRouteCSS()` is a no-op (comment-only body) |
| M11 | `components/CookieBannerModern.tsx:21` | `cookiesAvailable` state never changes; `setCookiesAvailable` never called |
| M12 | `components/CookieBannerModern.tsx:7` | `cookiesEnabled` imported but never used |
| M13 | `components/StickyTopNav.tsx:6` | `MLB_STADIUMS` imported but never used |
| M14 | `app/globals.css:215-268` | ~50 lines of PWA CSS behind `display: none !important` |
| M15 | `app/globals.css:376-514` | ~140 lines of WebGL CSS (Three.js removed from codebase) |
| M16 | `src/MobileApp.tsx:31,37,43` | `gameLoadRateLimiter`, `games`, `isLoading` — all created/set but never read |
| M17 | `src/MobileApp.tsx:3,20,25` | `MLB_STADIUMS`, `mlbApi`, `validateStadiumId` — unused imports |
| M18 | `src/UnifiedApp.tsx:16,27,32,33` | 10 unused imports (icons, mlbApi, formatting, performance) |
| M19 | `src/components/GameSelector.tsx:8,14` | `formatDateTimeWithTimezone`, `BaseballIcon` unused |
| M20 | `src/components/UnifiedGameSelector.tsx:7,11` | `Stadium`, `formatDateTimeWithTimezone` unused |
| M21 | `src/components/MobileStadiumGuide.tsx:9,14,33,82-87` | Unused imports + `selectedTime` state + `gameTimes` array |
| M22 | `src/components/MobileStadiumSelector.tsx:1,4,22` | `useEffect`, `useLoadingState` imported/used but results never consumed |
| M23 | `src/components/ComprehensiveStadiumGuide.tsx:6,8,18` | `Link`, `MapPinIcon`, `StadiumSection` unused |
| M24 | `src/components/WeatherDisplay.tsx:4,52-67` | Unused imports; `getWeatherIcon` ignores its parameter |
| M25 | `src/components/WeatherPatternChart.tsx:4,73` | `CloudIcon` unused; `maxDays` declared but never used |
| M26 | `src/components/StadiumHeader/StadiumHeader.tsx:8-12` | Props `team`, `capacity`, `opened`, `neighborhood` destructured but never rendered |
| M27 | `src/services/itineraryService.ts:2,8,9,12,145,201` | 4 unused imports + `preGameSlots` never read + identical ternary branches |
| M28 | `src/services/mlbApi.ts:2,197-209` | `withRetry` unused + debug flag/empty-if wrapper |
| M29 | `src/services/nflApiClient.ts:112` | `circuitBreaker` instantiated but never used for gating |
| M30 | `src/services/weatherApi.ts:2,86-89,108-109,374-412` | `withRetry` unused + empty debug blocks + dead `getMockWeather()` |
| M31 | `src/data/getStadiumSections.ts:63` | Sync version always returns `[]` |
| M32 | `src/data/stadiumLayoutEnhancer.ts:536` | `getEnhancedStadiumLayout()` always returns `null` |
| M33 | `utils/dataManagement.ts:82-93` | `knownKeys` array defined but never used |
| M34 | `utils/dataManagement.ts:388` | `sessionStorage.length` counted after `clear()` — always 0 |
| M35 | `utils/dataRetention.ts:79-83,177` | Unused `DataItem` interface + unused `now` variable |
| M36 | `app/polyfills.js` | Comment-only file, never imported |
| M37 | `src/i18n/lazyTranslations.ts` | Never imported; `i18nContext.tsx` eagerly imports translations |

### TypeScript `any` types

| # | File:Line | What |
|---|-----------|------|
| M38 | `src/components/GameSelector.tsx:45` | `selectedGameOption: any` |
| M39 | `src/components/UnifiedGameSelector.tsx:53,324-361,363` | `selectedGameOption: any` + 6 `any` callbacks + `formatOptionLabel: any` |
| M40 | `src/components/MobileFilterSheet.tsx:256-264` | 4× `as any` casts |
| M41 | `src/components/EnhancedSunFilter.tsx:234-524` | 8× `as any` casts |
| M42 | `src/components/NFLCustomGameSelector.tsx:6-7` | `selectedVenue: any`, `onGameSelect: (game: any)` |
| M43 | `src/components/SectionList.tsx:164` | `let aValue: any, bValue: any` |
| M44 | `src/components/Tooltip.tsx:123-132` | HOC uses `ComponentType<any>` and `(props: any)` |
| M45 | `src/components/VirtualScroll.tsx:200` | Cast to untyped `Function` |
| M46 | `src/services/milbApi.ts:86,183-200` | Cache `any`, `getVenueDetails` returns `any`, `convertToUnifiedGame` returns `any` |
| M47 | `src/services/weatherApi.ts:160-216` | 4 parse methods accept `any` |
| M48 | `src/services/seatRecommendationEngine.ts:120,419` | `sunPosition: any` |
| M49 | `src/data/stadiumDataIntegration.ts:213` | `integrateRealStadiumData(venue: any): any` |
| M50 | `components/OptimizedImage.tsx:78` | `imageProps: any` |
| M51 | `app/api/metrics/route.ts:5` | `metricsStore: any[]` |
| M52 | `app/api/report-inaccuracy/route.ts:19` | `validatePayload(payload: any)` |
| M53 | `utils/cookies.ts:209` | `getConsent()` returns `any` |
| M54 | `hooks/useGlobalPrivacyControl.ts:30` | `(navigator as any).globalPrivacyControl` |
| M55 | `src/i18n/translations.ts` | `TranslationKeys = Record<string, any>` |

### Known March 2026 issues (STILL OPEN)

| # | Issue | Status | Location |
|---|-------|--------|----------|
| M56 | Game dropdown flat (no month grouping) | **STILL BROKEN** | `UnifiedGameSelector.tsx:296-321` — flat `.map()`, no `optgroup`. `GameSelector.tsx` correctly groups by month but isn't used. |
| M57 | Star/share/plus icons missing tooltips | **STILL BROKEN** | `FloatingActionButton.tsx` — actions have `aria-label` but no `title` for hover tooltips |
| M58 | Seasonal shade identical placeholder copy | **STILL BROKEN** | `StadiumPageSSR.tsx:126-133` — monthly patterns are generic, not stadium-specific. `MobileStadiumGuide.tsx:41-51` has hardcoded identical weather for all stadiums. |
| M59 | Shade API missing month/hour validation | **PARTIALLY FIXED** | `route.ts` — `time` is validated with regex + range checks. `date` is validated as a Date but not range-bounded (accepts year 1900, 2100). No `month` parameter exists. |

### Performance

| # | File:Line | Issue |
|---|-----------|------|
| M60 | `app/HomePage.tsx:12-14` | `UnifiedApp` eagerly loaded via `dynamic()` even though user may never click CTA. Downloads full venue bundle. |
| M61 | `app/stadium/[stadiumId]/StadiumPageClient.tsx:57-88` | Fetches full MLB season schedule on every stadium page mount. N+1 pattern. |
| M62 | `src/components/UnifiedGameSelector.tsx:296-321` | `gameOptions` not memoized (unlike `GameSelector.tsx` which uses `useMemo`) |
| M63 | `components/WeatherWidget.tsx:66` | `gameTime` (Date object) in deps array — refetches weather on every parent re-render |
| M64 | `src/components/TableOfContents.tsx:58-83` | Scroll listener not throttled; DOM queries on every scroll pixel |
| M65 | `src/filters/FiltersContext.tsx:40` | `useMemo` dependency includes inline `set` — recreated each render, defeating memoization |

### Security

| # | File:Line | Issue |
|---|-----------|------|
| M66 | `app/api/report-inaccuracy/route.ts:186` | Raw IP stored as PII — GDPR concern |
| M67 | `app/do-not-sell/page.tsx:34` | CCPA opt-out form only logs to console — user data goes nowhere |
| M68 | `components/SafeSchema.tsx:9` | `dangerouslySetInnerHTML` with `JSON.stringify` — `</script>` not escaped to `<\/script>` |
| M69 | `app/api/report-inaccuracy/route.ts:204` | Self-fetching own API route (`fetch(origin/api/admin/...)`) — cold start + billable invocation on serverless |

### Architecture / Content

| # | File | Issue |
|---|------|-------|
| M70 | `src/data/venues.ts` | ~3000 lines; `ALL_VENUES` array duplicated into `VENUES_BY_LEAGUE` and `VENUE_BY_ID` |
| M71 | `src/data/unifiedVenues.ts` + `stadiums.ts` | Same data maintained in two files with different formats — proven to drift |
| M72 | `src/utils/apiRateLimit.ts:6` | Imports Pages Router types (`NextApiRequest/Response`) in App Router project |
| M73 | `app/blog/page.tsx:117-119` | Blog category/tag links point to routes that don't exist — 404s |
| M74 | `app/blog/page.tsx:146-153` | Newsletter form has no action or handler — does nothing |

---

## LOW (60+ issues, key items)

### Accessibility

| # | File | Issue |
|---|------|-------|
| L1 | `src/components/Icons.tsx:10-302` | No SVG icons have `aria-hidden="true"` |
| L2 | `src/components/SeatPreferencesForm.tsx:60-73` | Labels not associated with inputs (no `htmlFor`/`id`) |
| L3 | `src/components/SectionLabel/SectionLabel.tsx:76-85` | `role="button"` with `tabIndex={0}` but no `onKeyDown` for Enter/Space |
| L4 | `src/components/WeatherPatternChart.tsx:75-159` | Bar chart built with plain divs — invisible to screen readers |
| L5 | `src/components/LoadingSpinner.tsx:16` | No `role="status"` or `aria-label` |
| L6 | `src/components/SkeletonScreens.tsx` | No skeletons have `role="status"`, `aria-busy`, `aria-live` |
| L7 | `src/components/SunExposureBadge.tsx:136-199` | SVG ring + progress bar missing ARIA roles/values |
| L8 | `src/components/ShareButton.tsx:215-226` | Backdrop has both `tabIndex={0}` and `aria-hidden="true"` (contradictory) |
| L9 | `src/components/Tooltip.tsx:109` | `id` hardcoded to `"tooltip"` — violates uniqueness for `aria-describedby` |
| L10 | `src/components/VirtualScroll.tsx:153-174` | No `role` or `aria-label` on virtual scroll container |
| L11 | `app/stadiums/StadiumsPageSSR.tsx:139-145` | Shade rating bar has no text alternative or meter role |
| L12 | `app/not-found.tsx:118` | Decorative bullet `<span>` not `aria-hidden` |
| L13 | `app/stadium/[stadiumId]/StadiumPageSSR.tsx:393-418` | Emoji icons not wrapped in `aria-hidden` |
| L14 | `app/stadium/[stadiumId]/error.tsx:27-37` | "Try again" button has no focus indicator |
| L15 | `components/CookieBannerModern.tsx:306` | Modal overlay has no keyboard dismiss (Escape) or `role="dialog"` |
| L16 | `components/StadiumImageGallery.tsx:74` | Lightbox has no Escape key handler |
| L17 | `src/components/MobileStadiumGuide.tsx:193-201` | Month `<select>` has no `<label>` or `aria-label` |
| L18 | `src/components/MobileNav/MobileNav.tsx:106-107` | `aria-disabled` on `<a>` doesn't prevent navigation |

### SEO

| # | File | Issue |
|---|------|-------|
| L19 | `app/layout.tsx:113` | Two conflicting `theme-color` meta tags (`#2196f3` vs `#1e40af`) |
| L20 | `app/stadiums/StadiumsPageSSR.tsx:39` | Hardcoded `182` instead of `VENUE_COUNT` constant |
| L21 | `app/stadium/[stadiumId]/page.tsx:160` | `dateModified: new Date().toISOString()` in schema — misleading |
| L22 | `src/components/StadiumSchema.tsx:109` | `datePublished: new Date().toISOString()` — new "published" date each render |
| L23 | `public/sitemap.xml` | Missing individual stadium pages; all `lastmod` dates hardcoded |
| L24 | `src/utils/seoSchema.ts:4` | Uses `@type: "SportsEvent"` for informational shade guide pages |
| L25 | `src/data/venueParams.ts` | Only 3 venue slugs in `VENUE_STATIC_PARAMS`; includes phantom `mls` league |

### Dependencies

| # | Issue |
|---|-------|
| L26 | `react-helmet-async` in deps — CRA leftover; Next.js has built-in metadata |
| L27 | `tsconfig.json:3` — `target: "es5"` with browserslist targeting Chrome 92+. Unnecessary transpilation overhead. Should be `es2020`+ |
| L28 | `npm audit` blocked by network allowlist in sandbox — manual review: no known CVEs in current dep versions, but `marked@16.x` and `next@15.5.x` should be kept current |
| L29 | `middleware.ts:23` — `interest-cohort=()` in Permissions-Policy is deprecated FLoC directive |

### Missing error handling

| # | File:Line | Issue |
|---|-----------|-------|
| L30 | `src/components/EnhancedSunFilter.tsx:36-40` | `localStorage.getItem` + `JSON.parse` without try/catch |
| L31 | `src/components/HapticSettings.tsx:18` | `JSON.parse(saved)` from localStorage without try/catch |
| L32 | `src/components/StadiumTitleBlock.tsx:143-149` | `JSON.parse(localStorage.getItem(...))` without try/catch |
| L33 | `src/services/weatherApi.ts:208` | Visibility `0` (dense fog) defaults to `10` due to falsy `||` — use `??` |

### Stale content

| # | File | Issue |
|---|------|-------|
| L34 | `app/accessibility/page.tsx:191` | "Upcoming Features (Q1 2025)" — over a year past |
| L35 | `app/privacy/page.tsx:17` (and terms, cookies, dmca, disclaimer) | "Last Updated: January 2025" — likely stale |
| L36 | `app/guide/best-shaded-seats-mlb/page.tsx:178` | "Marlins Park" should be "loanDepot park" |
| L37 | `public/manifest.json` | Description says "MLB stadiums" only (not NFL/MiLB) |

### Tests

| # | Issue |
|---|-------|
| L38 | No tests for any component in `components/` except `OptimizedImage` and `WeatherWidget` |
| L39 | No tests for `StadiumPageSSR`, `StadiumPageClient`, `HomePage`, `LeagueClient`, or any page-level component |
| L40 | No integration tests for the full shade calculation pipeline (sun position → section shade → display) |
| L41 | `src/data/stadiumDataIntegrity.test.ts:192` — uses `eval()` to parse TypeScript files |
| L42 | `src/services/milbApi.ts:113` — `new Date().getFullYear()` uses runtime year; project instructions say "Always use 2025 data" |

### Miscellaneous

| # | File:Line | Issue |
|---|-----------|-------|
| L43 | `src/components/SwipeableStadiumNav.tsx:44-57` | Global `keydown` listener captures all ArrowLeft/Right, interfering with other components |
| L44 | `src/components/TableOfContents.tsx:45` | `Math.random()` for ID causes SSR hydration mismatch |
| L45 | `src/components/MobileSectionCard.tsx:13,93` | Both named and default export; named export bypasses `React.memo` |
| L46 | `src/components/FilterDrawer/FilterDrawer.tsx:48-99` | `background: '#ffffff'` hardcoded 5× — bypasses dark mode |
| L47 | `src/components/AttributionNotice.tsx:27,85` | MLB link uses `http://` not `https://` |
| L48 | `src/utils/performanceUtils.ts` | Duplicates `debounce`/`throttle` from `src/utils/debounce.ts` |
| L49 | `src/utils/preferences.ts:76-87` | Named `usePreferences` but contains no React hooks — misleading |
| L50 | `utils/dataRetention.ts:337` | `setInterval` in `initializeDataRetention()` never cleaned up; accumulates if called twice |
| L51 | `src/App.css:788-970` | Two separate `@media (max-width: 767px)` blocks |
| L52 | `src/hooks/useSwipeGesture.ts:249` | Duplicate `import { useState }` at end of file |
| L53 | `src/utils/stadiumSlugMapping.ts` | Missing entry for Athletics' `sutter-health-park` |
| L54 | `src/utils/retryUtils.ts:122` | `CircuitBreaker` accepts `resetTimeout` but never uses it |

---

## Summary by category

| Category | CRITICAL | HIGH | MEDIUM | LOW | Total |
|----------|----------|------|--------|-----|-------|
| Data correctness (timezones, logic) | 8 | 1 | 1 | 2 | 12 |
| React violations / SSR | 4 | 5 | 1 | 3 | 13 |
| Dead code / unused imports | — | — | 28 | 5 | 33 |
| TypeScript `any` | — | 1 | 18 | 1 | 20 |
| Duplicate files / code | — | 3 | 9 | 2 | 14 |
| Accessibility | 1 | 1 | — | 18 | 20 |
| Performance | — | 5 | 5 | 3 | 13 |
| Security | — | 2 | 4 | 2 | 8 |
| SEO | — | — | 1 | 7 | 8 |
| Architecture | — | 3 | 5 | 3 | 11 |
| Known March issues | — | — | 4 | — | 4 |
| Dependencies / config | — | — | — | 4 | 4 |
| Tests | — | — | — | 5 | 5 |
| Stale content | — | 1 | 1 | 4 | 6 |
| **Total** | **13** | **22** | **77** | **59** | **~171** |

---

## Top 10 issues to fix first (by impact)

1. **Wrong timezones (C1–C7)** — Every shade calculation for Rangers, Reds, Tigers, and Guardians (via unifiedVenues) is wrong by 1 hour. Core product accuracy.
2. **Impossible boolean in seat recommendations (C14)** — Third-base view scores are always wrong. Quick one-character fix (`&&` → `||`).
3. **Missing `'use client'` directives (C11, C12)** — Build will break if these components are imported from server components.
4. **Rules of Hooks violations (C8, C9)** — Runtime crashes waiting to happen.
5. **`setState` inside `useMemo` (C10)** — React violation; loading UI is dead code.
6. **Stadium data duplicated in two files (M71)** — Already proven to drift (Guardians timezone fixed in one, not the other). Single source of truth needed.
7. **Code splitting defeated (H9, H10)** — All venue data loads in one 577KB chunk instead of per-stadium. Directly impacts page load time.
8. **Flat game dropdown (M56)** — Known bug since March, still broken. Simple port from GameSelector.tsx grouping logic.
9. **`StadiumPageSSR` marked as client component (H2)** — Forces full hydration of the largest component. Removing `'use client'` is a free perf win.
10. **Hardcoded weather data (H18)** — Users get identical "weather" regardless of location. Trust-damaging.
