# UX Improvements & Shade Score System - Implementation Plan

## Phase 1: Foundation

### Task 1: Shade Score Utility
- [x] 1.1 Create `src/utils/shadeScore.ts` with `ShadeScoreResult` interface
- [x] 1.2 Implement `calculateShadeScore(sunExposure)` — converts 0-100 sun exposure to 1-10 score
- [x] 1.3 Define `SHADE_SCORE_BANDS` constant array (10 bands with label, color, emoji, recommendation)
- [x] 1.4 Implement `calculateStadiumShadeScore()` — averages section exposures
- [x] 1.5 Implement `calculateGameShadeScore()` — averages time samples
- [x] 1.6 Implement `getShadeScoreColor(score)` and `getShadeScoreTextColor(score)` for WCAG AA
- [x] 1.7 Verify TypeScript compiles clean

## Phase 2: Features (parallel)

### Task 2: Find My Shade Wizard
- [x] 2.1 Create `FindMyShade.module.css` — collapsible card, step layout, mobile-first
- [x] 2.2 Create `StepGameTime.tsx` — date input + time select (default: today 1 PM)
- [x] 2.3 Create `StepShadePreference.tsx` — 3 large tappable buttons mapping to UserPreferences.sunPreference
- [x] 2.4 Create `StepBudget.tsx` — 3 price tier buttons (Value / Mid-Range / Premium)
- [x] 2.5 Create `WizardResults.tsx` — calls recommendSeats(), shows top 3 with Shade Score badge
- [x] 2.6 Create `FindMyShadeWizard.tsx` — 4-step state machine, collapsible card container
- [x] 2.7 Wire wizard into `StadiumPageClient.tsx` above diagram section

### Task 3: Interactive Shade Map Overhaul
- [x] 3.1 Create `TimeSlider.tsx` + `TimeSlider.module.css` — range input, 30-min steps, ARIA, debounced onChange
- [x] 3.2 Wire time state into `StadiumPageClient.tsx` — replace hardcoded `setHours(13)` with `gameHour` state
- [x] 3.3 Add Shade Score to tooltips in `SectionPolygon.tsx`
- [x] 3.4 Add sun direction arrow to `StadiumDiagram.tsx` — new `sunAzimuthDegrees` prop
- [x] 3.5 Update `ShadeColorScale.tsx` — 10-band legend using `SHADE_SCORE_BANDS`
- [x] 3.6 Update `SectionPolygon.tsx` colors to use 10-band `getShadeScoreColor()`
- [x] 3.7 Replace diagram hide with loading overlay in `StadiumPageClient.tsx`

### Task 4: Homepage Improvements
- [x] 4.1 Add search bar to `HeroSection.tsx` — venue search with dropdown, popular chips, browse links
- [x] 4.2 Create `TodaysGames.tsx` — horizontal scrollable cards using MLBApiService.getSchedule()
- [x] 4.3 Add TodaysGames + Popular Stadiums grid to `HomePage.tsx`

## Phase 3: Polish

### Task 5: Mobile Refinements
- [x] 5.1 Create `SectionDetailSheet.tsx` — mobile bottom sheet for section tap (reuse MobileFilterSheet pattern)
- [x] 5.2 Wire bottom sheet into `StadiumPageClient.tsx` on mobile section click
- [x] 5.3 Wizard steps are full-width with 48px+ touch targets (built into CSS module)
- [x] 5.4 TimeSlider 44px thumb on mobile (built into CSS module)

### Task 6: Loading States
- [x] 6.1 Add skeleton placeholder for diagram before data loads
- [x] 6.2 Add skeleton for TodaysGames while API loads (built into component)

### Task 7: Accessibility
- [x] 7.1 Enhanced ARIA labels on `SectionPolygon.tsx` — "Section X, Shade Score Y out of 10, Z% shade"
- [x] 7.2 Wizard uses fieldset/legend for step form groups, radio groups for preferences
- [x] 7.3 aria-live region in SeatRecommendationsSection for shade summary
- [x] 7.4 Non-color text labels ("Score: 8") on all Shade Score badges in tooltips and results

## Final
- [x] TypeScript check passes (`npx tsc --noEmit`)
- [x] Production build succeeds (`npm run build`)

---

## Review

### Changes Summary

**New files (11):**
1. `src/utils/shadeScore.ts` — Universal 1-10 Shade Score system with `calculateShadeScore()`, `SHADE_SCORE_BANDS`, color utilities, and WCAG-compliant text colors
2. `src/components/TimeSlider/TimeSlider.tsx` — Range slider for game time (30-min steps), debounced, ARIA slider role, keyboard navigation (Home/End/Arrow)
3. `src/components/TimeSlider/TimeSlider.module.css` — Sunrise-to-sunset gradient track, 44px mobile touch thumb, touch-action: none
4. `src/components/FindMyShade/FindMyShadeWizard.tsx` — 4-step state machine in collapsible card (game time, shade pref, budget, results)
5. `src/components/FindMyShade/StepGameTime.tsx` — Date input + time select with fieldset/legend
6. `src/components/FindMyShade/StepShadePreference.tsx` — 3 tappable buttons (Maximum Shade / Some Shade / Don't Care) with radio group ARIA
7. `src/components/FindMyShade/StepBudget.tsx` — 4 tappable buttons (Value / Mid-Range / Premium / Any)
8. `src/components/FindMyShade/WizardResults.tsx` — Calls SeatRecommendationEngine, shows top 3 with Shade Score badge + "View on Map" button
9. `src/components/FindMyShade/FindMyShade.module.css` — Mobile-first layout, 48px+ touch targets, responsive grid
10. `src/components/TodaysGames/TodaysGames.tsx` — Horizontal scrollable game cards from MLBApiService, Shade Score badges, skeleton loading
11. `src/components/SectionDetailSheet.tsx` — Mobile bottom sheet with swipe-to-close, Shade Score badge, sun exposure bar, best rows

**Modified files (6):**
1. `app/stadium/[stadiumId]/StadiumPageClient.tsx` — Added gameHour state replacing hardcoded 1 PM, TimeSlider above diagram, FindMyShadeWizard, loading overlay instead of hide, diagram skeleton, mobile bottom sheet on section click
2. `src/components/StadiumDiagram/SectionPolygon.tsx` — Switched from 5-band getShadeColor() to 10-band getShadeScoreColor(), added Shade Score badge in tooltip, enhanced ARIA labels with score out of 10
3. `src/components/StadiumDiagram/StadiumDiagram.tsx` — Added sunAzimuthDegrees prop, sun direction arrow with compass label on SVG border
4. `src/components/StadiumDiagram/ShadeColorScale.tsx` — Switched from 5-band SHADE_COLORS to 10-band SHADE_SCORE_BANDS with score numbers
5. `src/components/HeroSection/HeroSection.tsx` — Added search bar with venue filter dropdown, popular stadium chips, browse league links
6. `app/HomePage.tsx` — Added TodaysGames section and Popular Stadiums grid between HowItWorks and WorldCupShowcase
7. `src/components/SeatRecommendationsSection.tsx` — Added aria-live polite region announcing shade analysis summary

### Verification
- `npx tsc --noEmit` — zero TypeScript errors
- `npm run build` — production build succeeds with compression complete
