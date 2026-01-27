# Full SDD workflow

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Workflow Steps

### [x] Step: Requirements
<!-- chat-id: 58fff5c2-3eea-4b84-8488-a142e5111f5d -->

Create a Product Requirements Document (PRD) based on the feature description.

1. Review existing codebase to understand current architecture and patterns
2. Analyze the feature definition and identify unclear aspects
3. Ask the user for clarifications on aspects that significantly impact scope or user experience
4. Make reasonable decisions for minor details based on context and conventions
5. If user can't clarify, make a decision, state the assumption, and continue

Save the PRD to `{@artifacts_path}/requirements.md`.

### [x] Step: Technical Specification
<!-- chat-id: 5790bfb8-093e-4c26-a4ae-9bbb6304f62f -->

Create a technical specification based on the PRD in `{@artifacts_path}/requirements.md`.

1. Review existing codebase architecture and identify reusable components
2. Define the implementation approach

Save to `{@artifacts_path}/spec.md` with:
- Technical context (language, dependencies)
- Implementation approach referencing existing code patterns
- Source code structure changes
- Data model / API / interface changes
- Delivery phases (incremental, testable milestones)
- Verification approach using project lint/test commands

### [x] Step: Planning
<!-- chat-id: b15adb04-f5cb-4600-90d8-9ff6618d4f8a -->

Created detailed implementation plan in `{@artifacts_path}/implementation-plan.md`.

The plan breaks down the work into 37 concrete implementation steps across 4 phases:
- Phase 1: MLB Row-Level Data Foundation (7 steps, 4 weeks)
- Phase 2: UX/UI Modernization (8 steps, 3 weeks)
- Phase 3: World Cup Feature Completion (7 steps, 2 weeks)
- Phase 4: MiLB Improvements & Polish (9 steps, 3 weeks)

Each step includes specific tasks, verification criteria, and file changes.

---

## Implementation Steps (Ready for Execution)

**IMPORTANT:** The implementation steps below should be executed by separate agents in future sessions. Do NOT proceed with implementation in this session.

### Phase 1: MLB Row-Level Data Foundation

### [x] Step 1.1: Setup Data Infrastructure & Validation Tools
<!-- chat-id: 4254e537-ff97-420a-b8de-b902943d2f95 -->
**Duration:** 3 days | **Priority:** P0

Create validation tooling and CI/CD infrastructure for stadium data quality.

**Tasks:**
- Create validation script (`scripts/validate-stadium-data.ts`)
- Build validation test suite
- Set up CI/CD validation pipeline
- Create obstruction file template

**Verification:**
- [x] `npm run validate-stadium-data` command works
- [x] All validation tests pass
- [x] CI/CD pipeline validates data on PR
- [x] Template file with documentation exists

**Details:** See `implementation-plan.md` Step 1.1

---

### [ ] Step 1.2: MLB Stadium Data Research & Collection Plan
**Duration:** 2 days | **Priority:** P0

Document data sources and create collection methodology for 30 MLB stadiums.

**Tasks:**
- Document data sources for all 30 stadiums
- Prioritize stadiums into 3 tiers
- Create methodology document
- Create data collection template

**Verification:**
- [ ] Data source list compiled
- [ ] Stadium priority tiers defined
- [ ] Methodology documented
- [ ] Collection template created

**Details:** See `implementation-plan.md` Step 1.2

---

### [ ] Step 1.3: Tier 1 MLB Stadiums - Row-Level Data
**Duration:** 5 days | **Priority:** P0

Collect and validate row-level data for top 10 MLB stadiums.

**Stadiums:** Yankee Stadium, Fenway Park, Dodger Stadium, Wrigley Field, Oracle Park, Camden Yards, Petco Park, Coors Field, Busch Stadium, T-Mobile Park

**Verification per stadium:**
- [ ] 60+ sections with row-level data
- [ ] 3D vertices defined
- [ ] Obstruction file created
- [ ] Passes validation (zero critical errors)

**Details:** See `implementation-plan.md` Step 1.3

---

### [ ] Step 1.4: Tier 2 MLB Stadiums - Row-Level Data
**Duration:** 5 days | **Priority:** P0

Collect row-level data for next 10 MLB stadiums.

**Stadiums:** Truist Park, Minute Maid Park, Globe Life Field, Chase Field, Great American Ball Park, PNC Park, Citi Field, Nationals Park, Target Field, Progressive Field

**Details:** See `implementation-plan.md` Step 1.4

---

### [ ] Step 1.5: Tier 3 MLB Stadiums - Row-Level Data
**Duration:** 5 days | **Priority:** P0

Complete row-level data for remaining 10 MLB stadiums.

**Stadiums:** Citizens Bank Park, Guaranteed Rate Field, Comerica Park, Kauffman Stadium, American Family Field, Rogers Centre, Angel Stadium, LoanDepot Park, Tropicana Field, Oakland Coliseum

**Details:** See `implementation-plan.md` Step 1.5

---

### [ ] Step 1.6: Enable 3D Shade Calculator for MLB
**Duration:** 2 days | **Priority:** P0

Enable OptimizedShadeCalculator3D for all MLB stadiums with web workers and caching.

**Tasks:**
- Update stadium loading logic
- Enable 3D calculator for MLB
- Configure web worker pool
- Implement IndexedDB caching

**Verification:**
- [ ] All 30 MLB stadiums use 3D calculator
- [ ] Calculations complete <2 seconds
- [ ] Web workers parallelizing
- [ ] Caching reduces repeat time >80%

**Details:** See `implementation-plan.md` Step 1.6

---

### [ ] Step 1.7: MLB Data Integration Tests
**Duration:** 2 days | **Priority:** P1

Create comprehensive test suite for MLB data integrity and performance.

**Verification:**
- [ ] All integration tests pass
- [ ] 30/30 stadiums load without errors
- [ ] Average calculation time <2s
- [ ] Bundle size increase <20%

**Details:** See `implementation-plan.md` Step 1.7

---

### Phase 2: UX/UI Modernization

### [ ] Step 2.1: Stadium Diagram Component (2D Interactive Map)
**Duration:** 3 days | **Priority:** P0

Build interactive SVG stadium diagram with shade visualization.

**Verification:**
- [ ] Diagram renders on all screen sizes
- [ ] Selection works (click/tap/keyboard)
- [ ] WCAG 2.1 AA compliant
- [ ] Renders <500ms for 100-section stadium

**Details:** See `implementation-plan.md` Step 2.1

---

### [ ] Step 2.2: Enhanced Section Cards with Row Details
**Duration:** 3 days | **Priority:** P0

Redesign section cards and add expandable row-level breakdown.

**Verification:**
- [ ] Section cards visually improved
- [ ] Row details expand smoothly
- [ ] Inning-by-inning timeline works
- [ ] Mobile touch targets ≥44px

**Details:** See `implementation-plan.md` Step 2.2

---

### [ ] Step 2.3: Section Comparison Feature
**Duration:** 2 days | **Priority:** P1

Add ability to compare 2-4 sections side-by-side.

**Verification:**
- [ ] Can select 2-4 sections
- [ ] Desktop side-by-side view clear
- [ ] Mobile swipe gestures smooth
- [ ] URL params enable sharing

**Details:** See `implementation-plan.md` Step 2.3

---

### [ ] Step 2.4: Filter Presets & Enhanced Filtering
**Duration:** 2 days | **Priority:** P1

Add one-click filter presets and improve mobile filter drawer.

**Verification:**
- [ ] All 4 presets work correctly
- [ ] Mobile drawer smooth
- [ ] Filters persist in URL

**Details:** See `implementation-plan.md` Step 2.4

---

### [ ] Step 2.5: Integrate Stadium Diagram into Stadium Detail Page
**Duration:** 1 day | **Priority:** P0

Add diagram to stadium pages with bidirectional selection sync.

**Verification:**
- [ ] Diagram integrated on all stadium pages
- [ ] Bidirectional selection works
- [ ] Responsive layout

**Details:** See `implementation-plan.md` Step 2.5

---

### [ ] Step 2.6: Homepage Redesign
**Duration:** 2 days | **Priority:** P1

Modernize homepage with improved hero, World Cup showcase, and how-it-works section.

**Verification:**
- [ ] Hero section engaging
- [ ] World Cup section prominent
- [ ] Mobile-optimized

**Details:** See `implementation-plan.md` Step 2.6

---

### [ ] Step 2.7: Mobile UX Polish
**Duration:** 2 days | **Priority:** P1

Optimize touch targets, animations, and mobile-specific features.

**Verification:**
- [ ] All touch targets ≥44px
- [ ] Filter drawer fast
- [ ] No scroll lag with 100+ sections

**Details:** See `implementation-plan.md` Step 2.7

---

### [ ] Step 2.8: Performance Optimization & Core Web Vitals
**Duration:** 2 days | **Priority:** P0

Optimize bundle size and achieve Core Web Vitals targets.

**Verification:**
- [ ] Initial bundle <300 KB gzipped
- [ ] LCP <2.5s, FID <100ms, CLS <0.1
- [ ] Lighthouse Performance >90

**Details:** See `implementation-plan.md` Step 2.8

---

### Phase 3: World Cup Feature Completion

### [ ] Step 3.1: World Cup Match Schedule Data
**Duration:** 2 days | **Priority:** P0

Create complete match data for all 104 World Cup 2026 matches.

**Verification:**
- [ ] 104 matches with complete data
- [ ] All venues correctly linked
- [ ] Timezone conversions accurate

**Details:** See `implementation-plan.md` Step 3.1

---

### [ ] Step 3.2: Match Schedule Page UI
**Duration:** 3 days | **Priority:** P0

Build match schedule grid with filtering and shade finder integration.

**Verification:**
- [ ] All 104 matches displayed
- [ ] Filters work correctly
- [ ] Links pre-fill venue/time

**Details:** See `implementation-plan.md` Step 3.2

---

### [ ] Step 3.3: Individual World Cup Venue Pages
**Duration:** 2 days | **Priority:** P1

Create detail pages for all 16 World Cup venues.

**Verification:**
- [ ] 16 venue pages created
- [ ] Matches correctly displayed
- [ ] SEO metadata present

**Details:** See `implementation-plan.md` Step 3.3

---

### [ ] Step 3.4: Venue Comparison Tool
**Duration:** 2 days | **Priority:** P1

Build tool to compare 2-4 World Cup venues side-by-side.

**Verification:**
- [ ] Can compare 2-4 venues
- [ ] Comparison data accurate
- [ ] Mobile experience smooth

**Details:** See `implementation-plan.md` Step 3.4

---

### [ ] Step 3.5: Country-Specific Features & Branding
**Duration:** 1 day | **Priority:** P2

Add country filters and regional climate messaging.

**Verification:**
- [ ] Country filters work
- [ ] Climate messaging displays
- [ ] Venues grouped by country

**Details:** See `implementation-plan.md` Step 3.5

---

### [ ] Step 3.6: World Cup Landing Page Enhancement
**Duration:** 1 day | **Priority:** P1

Enhance World Cup landing page with countdown and engaging content.

**Verification:**
- [ ] Landing page engaging
- [ ] Countdown prominent
- [ ] SEO optimized

**Details:** See `implementation-plan.md` Step 3.6

---

### [ ] Step 3.7: World Cup SEO & Marketing Preparation
**Duration:** 1 day | **Priority:** P1

Optimize SEO and prepare marketing assets for World Cup launch.

**Verification:**
- [ ] All pages have SEO metadata
- [ ] Sitemap includes World Cup pages
- [ ] Marketing assets ready

**Details:** See `implementation-plan.md` Step 3.7

---

### Phase 4: MiLB Improvements & Final Polish

### [ ] Step 4.1: Identify & Prioritize Top 30 MiLB Venues
**Duration:** 1 day | **Priority:** P1

Research and prioritize MiLB venues by attendance and importance.

**Details:** See `implementation-plan.md` Step 4.1

---

### [ ] Step 4.2: Top 30 MiLB Venues - Row-Level Data Collection
**Duration:** 8 days | **Priority:** P1

Collect row-level data for top 30 MiLB stadiums.

**Verification:**
- [ ] 30/30 MiLB venues with row-level data
- [ ] All pass validation

**Details:** See `implementation-plan.md` Step 4.2

---

### [ ] Step 4.3: Data Freshness Tracking System
**Duration:** 2 days | **Priority:** P1

Add timestamps to data files and create freshness monitoring.

**Verification:**
- [ ] All data files have timestamps
- [ ] Freshness displayed on UI

**Details:** See `implementation-plan.md` Step 4.3

---

### [ ] Step 4.4: User Feedback "Report Inaccuracy" Feature
**Duration:** 2 days | **Priority:** P1

Build user feedback form and API endpoint.

**Verification:**
- [ ] Form validates correctly
- [ ] Submissions saved to Airtable

**Details:** See `implementation-plan.md` Step 4.4

---

### [ ] Step 4.5: Analytics Dashboard for Data Quality
**Duration:** 2 days | **Priority:** P2

Create admin dashboard to monitor data quality metrics.

**Details:** See `implementation-plan.md` Step 4.5

---

### [ ] Step 4.6: Comprehensive Testing Suite
**Duration:** 3 days | **Priority:** P0

Expand test coverage to 90%+ with unit, integration, E2E, visual, and a11y tests.

**Verification:**
- [ ] Unit test coverage >90%
- [ ] All E2E tests pass
- [ ] Accessibility tests pass (zero violations)

**Details:** See `implementation-plan.md` Step 4.6

---

### [ ] Step 4.7: Performance Optimization & Final Polish
**Duration:** 2 days | **Priority:** P0

Final bundle optimization and Core Web Vitals verification.

**Verification:**
- [ ] Lighthouse scores meet targets
- [ ] All Core Web Vitals "Good"

**Details:** See `implementation-plan.md` Step 4.7

---

### [ ] Step 4.8: Bug Fixes & Final QA
**Duration:** 3 days | **Priority:** P0

Manual testing on real devices and fix all P0/P1 bugs.

**Verification:**
- [ ] All critical flows work on all devices
- [ ] Zero P0/P1 bugs

**Details:** See `implementation-plan.md` Step 4.8

---

### [ ] Step 4.9: Documentation & Deployment Prep
**Duration:** 1 day | **Priority:** P1

Update documentation and prepare for production deployment.

**Verification:**
- [ ] README up to date
- [ ] CHANGELOG complete
- [ ] Deployment guide clear

**Details:** See `implementation-plan.md` Step 4.9

---

## Implementation Summary

**Total:** 37 implementation steps across 4 phases (12 weeks)

**Key Metrics:**
- 30/30 MLB stadiums with row-level data
- 30/120 MiLB stadiums with row-level data (25%)
- 16/16 World Cup venues (already complete)
- 90%+ test coverage
- Core Web Vitals: All "Good"
- Performance: <300 KB initial bundle, <2.5s LCP

**Next Action:** Begin with Phase 1, Step 1.1 in a new implementation session.
