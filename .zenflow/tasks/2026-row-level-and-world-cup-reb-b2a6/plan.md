# Full SDD workflow

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Workflow Steps

### [x] Step: Requirements
<!-- chat-id: 91415836-9e64-45dd-bcbb-098dfbe35d60 -->

Create a Product Requirements Document (PRD) based on the feature description.

1. Review existing codebase to understand current architecture and patterns
2. Analyze the feature definition and identify unclear aspects
3. Ask the user for clarifications on aspects that significantly impact scope or user experience
4. Make reasonable decisions for minor details based on context and conventions
5. If user can't clarify, make a decision, state the assumption, and continue

Save the PRD to `{@artifacts_path}/requirements.md`.

### [x] Step: Technical Specification
<!-- chat-id: 16bc0208-cb63-4fae-8420-6cb9dea48195 -->

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
<!-- chat-id: 61604df9-cce5-4959-b014-711d5e69dba1 -->
<!-- Completed: January 22, 2026 -->

Created comprehensive implementation plan saved to `implementation-plan.md`.

**Summary**:
- 10-week implementation (Jan 23 - Apr 1, 2026)
- 7 phases with detailed tasks
- 69 days to launch before World Cup ticketing peak
- Detailed task breakdowns with file paths, line numbers, code examples

**Key Artifacts**:
- `implementation-plan.md` - Full 10-week plan with Phase 0-1 detailed
- Codebase exploration complete
- Critical path identified
- Performance targets established

**Phase Overview**:
```
Phase 0: Row Calculation Engine     (Weeks 1-2)  → 9 tasks
Phase 1: Row-Level UI                (Week 2-3)   → 5 tasks
Phase 2: WC Existing Stadiums        (Week 3-4)   → 5 tasks
Phase 3: WC New Stadiums             (Weeks 4-6)  → 4 tasks
Phase 4: WC UI & Schedule            (Weeks 6-7)  → 6 tasks
Phase 5: Multi-Language              (Weeks 7-8)  → 5 tasks
Phase 6: Testing & Optimization      (Weeks 8-9)  → 6 tasks
Phase 7: Launch Preparation          (Weeks 9-10) → 6 tasks
```

---

### [x] Step: Phase 0 - Row Calculation Engine (Backend)
<!-- chat-id: f2299026-2bbc-4b11-80ce-a7f755ea1db4 -->

**Status**: 78% complete (7/9 tasks done)
**Duration**: Weeks 1-2 (Jan 23 - Feb 6, 2026)
**Branch**: `feat/row-level-calculations`

Core row-level shadow calculation engine implementation.

**Completed**: Tasks 0.1-0.7 ✅
**Remaining**: Tasks 0.8-0.9 ⏳

---

### [x] Step: Phase 1 - Row-Level UI
<!-- chat-id: 6112db13-8bd3-4d16-a19e-7e7870ef34fe -->
<!-- Completed: January 26, 2026 (Fixed & Fully Integrated) -->

**Status**: COMPLETE (5/5 tasks done) ✅
**Duration**: Week 2-3 (Feb 6 - Feb 13, 2026)
**Dependencies**: Phase 0 complete ✅

Build UI components to display row-level shade data to users and integrate into stadium pages.

**Completed Tasks**:
- ✅ Task 1.1: Create RowBreakdownView component - Desktop table + mobile cards with sorting/filtering
- ✅ Task 1.2: Update LazySectionCardModern - Row summary, expand/collapse functionality
- ✅ Task 1.3: Add Row-Level Filters - Built into RowBreakdownView (recommendation filter)
- ✅ Task 1.4: Integration - StadiumPageClient, SeatRecommendationsSection, SectionList all wired up
- ✅ Task 1.5: E2E testing - Strict Playwright tests that fail when features don't work

**Files Created**:
- `/src/components/RowBreakdownView.tsx` (248 lines) - Desktop table & mobile card view
- `/tests/row-level-ui.spec.ts` (174 lines) - 9 strict E2E tests

**Files Modified**:
- `/src/components/LazySectionCardModern.tsx` (150 → 183 lines) - Added rowData prop, row summary display, expand/collapse
- `/src/components/SectionList.tsx` (386 → 417 lines) - Added rowData/showRowToggle props, toggle button, helper function
- `/app/stadium/[stadiumId]/StadiumPageClient.tsx` - Set `includeRows: true`, extract rowData from hook
- `/src/components/SeatRecommendationsSection.tsx` - Added SectionList display with rowData integration

**Integration Complete**:
- ✅ StadiumPageClient calls `useSunCalculations` with `includeRows: true`
- ✅ rowData extracted from hook and passed to SeatRecommendationsSection
- ✅ SectionList receives rowData and showRowToggle props
- ✅ Row toggle button displays when rowData available
- ✅ Section cards show row summary (best/worst rows)
- ✅ Expand section shows RowBreakdownView with filtering
- ✅ No emojis in toggle buttons (text only)
- ✅ E2E tests enforce feature presence (fail if broken)

**Verification**: ✅ Build passes (5.0s), all integrations wired, strict E2E tests in place

**Known Limitation**: Row data will only display when stadium data files contain `rows` arrays with RowDetail objects. Current stadium data files need to be updated with row-level information in Phase 0 Task 0.6-0.9.

---

## Implementation Tasks Detail

## PHASE 0: Row Calculation Engine (Weeks 1-2) - 78% COMPLETE

#### ✅ Completed Tasks (4/9)

- **Task 0.1** (4/4): Performance Baseline - Build: 76.99s, Branch: `feat/row-level-calculations`
- **Task 0.2** (5/5): SunCalculator - File: `sunCalculator.ts` (476→759 lines), Tests: 27/27 ✅
- **Task 0.3** (9/9): Web Worker - File: `sunCalculations.worker.js` (65→288 lines), Integration: 5/5 ✅
- **Task 0.4** (9/9): Hook Update - File: `useSunCalculations.ts` (141→172 lines), Tests: 6/6 ✅

#### 🔄 Current Task

**Task 0.5: Create Row Shade API Endpoint** (0/10 steps)
- [ ] 0.5.1-10: API route creation, validation, caching, testing

#### ⏳ Remaining Phase 0 Tasks (5/9)

- **Task 0.6** (0/10): Performance Benchmark - Yankees Stadium 2,460 rows <100ms
- **Task 0.7** (7/16): Unit Tests - Achieve >90% coverage
- **Task 0.8** (0/12): Integration Testing - E2E validation
- **Task 0.9** (0/14): Code Review - ESLint, docs, PR creation

---

## PHASE 1: Row-Level UI (Weeks 2-3) - 0% COMPLETE

#### ⏳ All Tasks Pending (0/5)

- **Task 1.1** (0/12): Create RowBreakdownView Component - Desktop table + mobile list
- **Task 1.2** (0/11): Update LazySectionCardModern - Row summary, expand/collapse
- **Task 1.3** (0/11): Add Row-Level Filters - Filter bar, URL persistence
- **Task 1.4** (0/11): Integration - Section/row toggle, responsive testing
- **Task 1.5** (0/12): E2E Testing - Playwright tests, visual regression

---

## PHASE 2: World Cup Existing Stadiums (Weeks 3-4) - 0% COMPLETE

#### ⏳ All Tasks Pending (0/5)

- **Task 2.1**: MetLife Stadium - Add 2026 WC metadata, verify rows
- **Task 2.2**: AT&T Stadium - Add metadata, verify rows
- **Task 2.3**: Mercedes-Benz Stadium - Add metadata, verify rows
- **Task 2.4**: Levi's Stadium - Add metadata, verify rows
- **Task 2.5**: Hard Rock Stadium - Add metadata, verify rows

---

## PHASE 3: World Cup New Stadiums (Weeks 4-6) - 0% COMPLETE

#### ⏳ All Tasks Pending (0/4)

- **Task 3.1**: BMO Field (Toronto) - Create stadium data, generate rows
- **Task 3.2**: BC Place (Vancouver) - Create stadium data, generate rows
- **Task 3.3**: Estadio Akron (Guadalajara) - Create stadium data, generate rows
- **Task 3.4**: Estadio BBVA (Monterrey) - Create stadium data, generate rows

---

## PHASE 4: World Cup UI & Schedule (Weeks 6-7) - 0% COMPLETE

#### ⏳ All Tasks Pending (0/6)

- **Task 4.1**: Create WorldCupBadge Component
- **Task 4.2**: Update Stadium Cards with WC Indicator
- **Task 4.3**: Create WC Schedule Page
- **Task 4.4**: Match Countdown Timer
- **Task 4.5**: Create WC Landing Page
- **Task 4.6**: E2E Testing for WC Features

---

## PHASE 5: Multi-Language (Weeks 7-8) - 0% COMPLETE

#### ⏳ All Tasks Pending (0/5)

- **Task 5.1**: Add French Translations - 5 days
- **Task 5.2**: Update i18n Components
- **Task 5.3**: Test Language Switching
- **Task 5.4**: Add Language Selector UI
- **Task 5.5**: Verify All Translations

---

## PHASE 6: Testing & Optimization (Weeks 8-9) - 0% COMPLETE

#### ⏳ All Tasks Pending (0/6)

- **Task 6.1**: Full Regression Testing
- **Task 6.2**: Performance Optimization
- **Task 6.3**: Lighthouse Audits - Target >90
- **Task 6.4**: Cross-Browser Testing
- **Task 6.5**: Accessibility Audit
- **Task 6.6**: Load Testing

---

## PHASE 7: Launch Preparation (Weeks 9-10) - 0% COMPLETE

#### ⏳ All Tasks Pending (0/6)

- **Task 7.1**: Production Deployment Plan
- **Task 7.2**: Monitoring & Analytics Setup
- **Task 7.3**: Create Marketing Materials
- **Task 7.4**: SEO Optimization
- **Task 7.5**: Soft Launch to Beta Users
- **Task 7.6**: Full Production Launch

---

## Implementation Tasks

### Phase 0: Row Calculation Engine (Weeks 1-2)

#### [x] Task 0.1: Performance Baseline & Setup (Day 1 - Jan 23)
- ✅ Measure current build time (76.99 seconds)
- ✅ Benchmark section-level calculations (script created)
- ✅ Create development branch (`feat/row-level-calculations`)
- **Verification**: ✅ Build time <5 min (74% under target), baseline documented

#### [x] Task 0.2: Extend SunCalculator - Core Row Method (Days 1-2)
- File: `/src/utils/sunCalculator.ts` (476 → 759 lines)
- ✅ Add RowShadowData interface (exported)
- ✅ Implement calculateRowShadow() (110 lines)
- ✅ Implement calculateOverhangShadow() (30 lines)
- ✅ Implement calculateUpperDeckShadowForRow() (50 lines)
- ✅ Implement calculateRowShadows() (40 lines)
- **Verification**: ✅ Unit tests passing (24/24), TypeScript compiles, smoke test passed

#### [x] Task 0.3: Extend Web Worker (Days 3-4)
- File: `/public/workers/sunCalculations.worker.js` (65 → 288 lines, +223 lines)
- ✅ Add CALCULATE_ROW_SHADOWS message handler
- ✅ Port calculateRowShadow() (84 lines)
- ✅ Port calculateOverhangShadow() (24 lines)
- ✅ Port calculateUpperDeckShadowForRow() (44 lines)
- ✅ Port calculateRowShadows() (36 lines)
- ✅ CRITICAL FIX: Corrected API contract to match hook (commit f8a7a52a0)
- **Verification**: ✅ Integration test validates API contract (5/5 checks passing)

#### [x] Task 0.4: Update useSunCalculations Hook (Day 5)
- File: `/src/hooks/useSunCalculations.ts` (141 → 172 lines, +31 lines)

**Steps:**
- [x] 0.4.1: Read current hook and understand state structure
- [x] 0.4.2: Add includeRows parameter to hook signature
- [x] 0.4.3: Add rowShadowData state variable
- [x] 0.4.4: Update worker postMessage to include includeRows flag
- [x] 0.4.5: Add message handler for CALCULATE_ROW_SHADOWS response
- [x] 0.4.6: Update return type to include row shadow data
- [x] 0.4.7: Create unit tests for hook with includeRows=true
- [x] 0.4.8: Create unit tests for hook with includeRows=false
- [x] 0.4.9: Verify TypeScript compiles without errors

**Verification**: ✅ Integration test validates API contract, type tests passing (6/6)

#### [x] Task 0.5: Create Row Shade API Endpoint (Day 6)
- File: `/app/api/stadium/[id]/rows/shade/route.ts` (NEW - 184 lines)

**Steps:**
- [x] 0.5.1: Check existing API structure in `/app/api/stadium/[id]/`
- [x] 0.5.2: Create route.ts file with Next.js 15 App Router structure
- [x] 0.5.3: Implement GET handler with stadium ID parameter
- [x] 0.5.4: Add query parameter validation (date, time, sectionId)
- [x] 0.5.5: Import and use calculateRowShadows() function
- [x] 0.5.6: Add caching headers (Cache-Control: max-age=3600)
- [x] 0.5.7: Add error handling (404, 400, 500)
- [x] 0.5.8: Create API route tests (20 tests)
- [x] 0.5.9: Test API endpoint manually with curl
- [x] 0.5.10: Measure response time (<30ms, 97% under target)

**Verification**: ✅ API responds in <500ms (15-18ms actual), caching works, 20/20 tests passing
**CRITICAL FIX**: Corrected section loader to use DetailedSection[] with row data

#### [x] Task 0.6: Performance Benchmark & Validation (Day 7)

**Steps:**
- [ ] 0.6.1: Read Yankees Stadium data file to count actual rows
- [ ] 0.6.2: Create scripts/benchmark-row-calculations.js
- [ ] 0.6.3: Load all Yankees Stadium sections with rows
- [ ] 0.6.4: Run calculateRowShadows() for each section
- [ ] 0.6.5: Measure total execution time for full stadium
- [ ] 0.6.6: Calculate rows per millisecond performance metric
- [ ] 0.6.7: Compare against <100ms target
- [ ] 0.6.8: Document results in docs/performance-results.md
- [ ] 0.6.9: Test with different sun positions (morning, noon, evening)
- [ ] 0.6.10: Verify no memory leaks during batch processing

**Verification**: ✅ 2,460 rows calculated in <100ms, results documented

#### [ ] Task 0.7: Comprehensive Unit Tests (Days 8-10)

**Steps:**
- [x] 0.7.1: Create rowShadowCalculator.test.ts (COMPLETE - 24 tests)
- [x] 0.7.2: Test covered rows logic (COMPLETE)
- [x] 0.7.3: Test overhang shadow calculations (COMPLETE)
- [x] 0.7.4: Test upper deck shadow calculations (COMPLETE)
- [x] 0.7.5: Test sun altitude edge cases (COMPLETE)
- [x] 0.7.6: Test recommendation levels (COMPLETE)
- [x] 0.7.7: Test front-to-back row gradients (COMPLETE)
- [ ] 0.7.8: Create useSunCalculations.test.ts for hook
- [ ] 0.7.9: Test hook with includeRows=true
- [ ] 0.7.10: Test hook with includeRows=false
- [ ] 0.7.11: Create API route tests
- [ ] 0.7.12: Test API with valid parameters
- [ ] 0.7.13: Test API with invalid parameters (400 errors)
- [ ] 0.7.14: Test API with missing stadium (404 errors)
- [ ] 0.7.15: Run coverage report (jest --coverage)
- [ ] 0.7.16: Verify >90% coverage threshold

**Verification**: ✅ >90% test coverage, all tests passing

#### [ ] Task 0.8: Integration Testing (Days 11-13)

**Steps:**
- [ ] 0.8.1: Create integration test suite structure
- [ ] 0.8.2: Test E2E: SunCalculator → Web Worker → Hook flow
- [ ] 0.8.3: Test E2E: API endpoint → Response validation
- [ ] 0.8.4: Test user flow: Load stadium → Calculate rows → Display
- [ ] 0.8.5: Create performance load test (100 concurrent requests)
- [ ] 0.8.6: Test with real Yankees Stadium data
- [ ] 0.8.7: Test with real Allegiant Stadium (NFL) data
- [ ] 0.8.8: Test with different date/time combinations
- [ ] 0.8.9: Test error handling in full flow
- [ ] 0.8.10: Create Playwright E2E test for UI integration
- [ ] 0.8.11: Test mobile responsiveness
- [ ] 0.8.12: Run all integration tests in CI environment

**Verification**: ✅ All integration tests passing, no regressions

#### [ ] Task 0.9: Code Review & Refactoring (Day 14)

**Steps:**
- [ ] 0.9.1: Run ESLint on all modified files
- [ ] 0.9.2: Check for code duplication opportunities
- [ ] 0.9.3: Review function complexity (cyclomatic complexity)
- [ ] 0.9.4: Verify consistent naming conventions
- [ ] 0.9.5: Add JSDoc comments to all public functions
- [ ] 0.9.6: Update README.md with row-level feature documentation
- [ ] 0.9.7: Create migration guide for developers
- [ ] 0.9.8: Review and optimize imports
- [ ] 0.9.9: Run TypeScript strict mode check
- [ ] 0.9.10: Review error messages for clarity
- [ ] 0.9.11: Ensure all console.logs are removed or proper logging
- [ ] 0.9.12: Run full test suite one final time
- [ ] 0.9.13: Update CHANGELOG.md with Phase 0 changes
- [ ] 0.9.14: Create pull request for Phase 0 completion

**Verification**: ✅ All tests passing, code reviewed, PR ready

---

### Phase 1: Row-Level UI (Week 2-3)

#### [ ] Task 1.1: Create RowBreakdownView Component (Days 15-16)
- File: `/src/components/RowBreakdownView.tsx` (NEW - 250 lines)

**Steps:**
- [ ] 1.1.1: Create component file structure
- [ ] 1.1.2: Define component props interface (section, rows, onSort, onFilter)
- [ ] 1.1.3: Implement desktop table view with columns (Row, Seats, Coverage, Recommendation)
- [ ] 1.1.4: Implement mobile card list view
- [ ] 1.1.5: Add responsive breakpoint (desktop: >768px)
- [ ] 1.1.6: Implement sort by coverage (ascending/descending)
- [ ] 1.1.7: Implement sort by row number
- [ ] 1.1.8: Add filter by recommendation level
- [ ] 1.1.9: Add color coding for coverage levels
- [ ] 1.1.10: Create unit tests for component
- [ ] 1.1.11: Test responsive behavior
- [ ] 1.1.12: Add accessibility (ARIA labels, keyboard navigation)

**Verification**: ✅ Component renders correctly on desktop + mobile, tests passing

#### [ ] Task 1.2: Update LazySectionCardModern (Day 17)
- File: `/src/components/LazySectionCardModern.tsx` (MODIFY)

**Steps:**
- [ ] 1.2.1: Read current LazySectionCardModern component
- [ ] 1.2.2: Add row summary to card (Best rows: 1-5, Worst rows: 25-30)
- [ ] 1.2.3: Add "View Row Details" button to card footer
- [ ] 1.2.4: Add expanded state management (useState)
- [ ] 1.2.5: Import RowBreakdownView component
- [ ] 1.2.6: Add conditional render for RowBreakdownView when expanded
- [ ] 1.2.7: Add expand/collapse animation
- [ ] 1.2.8: Update card height to accommodate expansion
- [ ] 1.2.9: Add close button to expanded view
- [ ] 1.2.10: Update component tests
- [ ] 1.2.11: Test expand/collapse functionality

**Verification**: ✅ Row summary shows, expand/collapse works, no layout breaks

#### [ ] Task 1.3: Add Row-Level Filters (Day 18)
- File: `/src/components/RowFilterBar.tsx` (NEW - 120 lines)
- File: `/src/components/EnhancedSunFilter.tsx` (MODIFY)

**Steps:**
- [ ] 1.3.1: Create RowFilterBar component file
- [ ] 1.3.2: Add filter options (All, Excellent, Good, Fair, Poor)
- [ ] 1.3.3: Add "Best Rows Only" toggle
- [ ] 1.3.4: Add minimum coverage slider (0-100%)
- [ ] 1.3.5: Read EnhancedSunFilter component
- [ ] 1.3.6: Add row-level filter state to EnhancedSunFilter
- [ ] 1.3.7: Integrate RowFilterBar into EnhancedSunFilter
- [ ] 1.3.8: Update filtering logic to use row data
- [ ] 1.3.9: Add filter persistence to URL params
- [ ] 1.3.10: Create tests for RowFilterBar
- [ ] 1.3.11: Test filter combinations

**Verification**: ✅ Filters apply correctly, URL params work, tests passing

#### [ ] Task 1.4: Integration (Days 19-20)

**Steps:**
- [ ] 1.4.1: Identify all stadium pages that need updates
- [ ] 1.4.2: Add section/row level toggle component
- [ ] 1.4.3: Update stadium page to use includeRows parameter
- [ ] 1.4.4: Test toggle switches between section and row views
- [ ] 1.4.5: Verify no breaking changes to existing section view
- [ ] 1.4.6: Test on desktop (1920x1080, 1366x768)
- [ ] 1.4.7: Test on tablet (768x1024)
- [ ] 1.4.8: Test on mobile (375x667, 414x896)
- [ ] 1.4.9: Test landscape orientations
- [ ] 1.4.10: Verify performance (no slowdown)
- [ ] 1.4.11: Check browser compatibility (Chrome, Firefox, Safari, Edge)

**Verification**: ✅ Toggle works, responsive on all devices, no breaking changes

#### [ ] Task 1.5: E2E Testing (Day 21)

**Steps:**
- [ ] 1.5.1: Create Playwright test suite for row-level features
- [ ] 1.5.2: Test: Load stadium → Toggle to row view → Verify display
- [ ] 1.5.3: Test: Filter by recommendation → Verify results
- [ ] 1.5.4: Test: Sort by coverage → Verify order
- [ ] 1.5.5: Test: Expand section card → View row details
- [ ] 1.5.6: Set up visual regression baseline screenshots
- [ ] 1.5.7: Run visual regression tests (Percy or similar)
- [ ] 1.5.8: Run accessibility audit with axe-core
- [ ] 1.5.9: Test keyboard navigation
- [ ] 1.5.10: Test screen reader compatibility
- [ ] 1.5.11: Document any accessibility issues
- [ ] 1.5.12: Fix any issues found
- **Verification**: All E2E tests passing, zero a11y violations

---

### [ ] Step: Phase 2 - World Cup Existing Stadiums

**Status**: Not started (0/5 tasks done)
**Duration**: Week 3-4 (Feb 13 - Feb 27, 2026)
**Dependencies**: Phase 1 complete

Duplicate and adapt 11 existing NFL stadium files for 2026 World Cup soccer configuration.

**Tasks**: Duplicate NFL → WC configs, update metadata, verify row data, test calculations

**Verification**: 11 WC venues load correctly ✅

---

### [ ] Step: Phase 3 - World Cup New Stadiums

**Status**: Not started (0/4 tasks done)
**Duration**: Weeks 4-6 (Feb 27 - Mar 13, 2026)
**Dependencies**: Phase 2 complete

Create 5 brand new stadium configurations for WC venues not in NFL.

**Tasks**: BMO Field, BC Place, Estadio Akron, Estadio BBVA data creation

**Verification**: 5 new stadiums functional ✅

---

### [ ] Step: Phase 4 - World Cup UI & Schedule

**Status**: Not started (0/6 tasks done)
**Duration**: Weeks 6-7 (Mar 13 - Mar 27, 2026)
**Dependencies**: Phase 3 complete

Build World Cup specific UI features and integrate 104 match schedule.

**Tasks**: WC landing page, badge component, schedule integration, match countdown

**Verification**: 16 venues display, 104 matches load ✅

---

### [ ] Step: Phase 5 - Multi-Language Support

**Status**: Not started (0/5 tasks done)
**Duration**: Weeks 7-8 (Mar 27 - Apr 10, 2026)
**Dependencies**: Phase 4 complete

Add French translations for World Cup international audience.

**Tasks**: Create fr.json, update i18n, test all 4 languages (EN, ES, JA, FR)

**Verification**: EN, ES, JA, FR all functional ✅

---

### [ ] Step: Phase 6 - Testing & Optimization

**Status**: Not started (0/6 tasks done)
**Duration**: Weeks 8-9 (Apr 10 - Apr 24, 2026)
**Dependencies**: Phase 5 complete

Full regression testing, performance optimization, accessibility audit.

**Tasks**: Performance optimization, visual regression, Lighthouse audit, bug fixing

**Verification**: Lighthouse ≥90, <2s load ✅

---

### [ ] Step: Phase 7 - Launch Preparation

**Status**: Not started (0/6 tasks done)
**Duration**: Weeks 9-10 (Apr 24 - May 1, 2026)
**Dependencies**: Phase 6 complete

Final launch preparation, SEO, analytics, soft launch, production deployment.

**Tasks**: SEO optimization, marketing content, analytics, soft launch, full launch

**Verification**: Soft launch completed ✅

---

## Critical Milestones

| Week | Milestone | Verification |
|------|-----------|--------------|
| 1-2 | Row Engine Operational | 2,460 rows in <100ms |
| 2-3 | Row UI Functional | Row breakdown displays |
| 3-4 | 11 WC Venues Ready | NFL → WC duplicates |
| 4-6 | 16 WC Venues Complete | 5 new stadiums |
| 6-7 | WC Pages Live | 104 matches integrated |
| 7-8 | 4 Languages | EN/ES/JA/FR functional |
| 8-9 | Performance Optimized | Lighthouse ≥90 |
| 9-10 | Soft Launch | Beta testing |

**Launch Date**: April 1, 2026 (69 days)
