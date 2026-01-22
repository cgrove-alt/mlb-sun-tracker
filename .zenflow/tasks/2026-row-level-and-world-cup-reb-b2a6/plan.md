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

## Implementation Tasks

### Phase 0: Row Calculation Engine (Weeks 1-2)

#### [ ] Task 0.1: Performance Baseline & Setup (Day 1 - Jan 23)
- Measure current build time
- Benchmark section-level calculations
- Create development branch
- **Verification**: Build time <5 min, baseline documented

#### [ ] Task 0.2: Extend SunCalculator - Core Row Method (Days 1-2)
- File: `/src/utils/sunCalculator.ts` (476 → ~600 lines)
- Add RowShadowData interface
- Implement calculateRowShadow()
- Implement calculateOverhangShadow()
- Implement calculateUpperDeckShadowForRow()
- Implement calculateRowShadows()
- **Verification**: Unit tests passing, TypeScript compiles

#### [ ] Task 0.3: Extend Web Worker (Days 3-4)
- File: `/public/workers/sunCalculations.worker.js` (65 → ~200 lines)
- Add CALCULATE_ROW_SHADOWS message type
- Reimplement row calculation logic
- Add helper functions
- **Verification**: Worker processes 30 rows in <10ms

#### [ ] Task 0.4: Update useSunCalculations Hook (Day 5)
- File: `/src/hooks/useSunCalculations.ts` (142 → ~180 lines)
- Add includeRows parameter
- Update worker call
- Add row-level state
- **Verification**: Hook returns row data when includeRows=true

#### [ ] Task 0.5: Create Row Shade API Endpoint (Day 6)
- File: `/app/api/stadium/[id]/rows/shade/route.ts` (NEW - 180 lines)
- Implement GET handler
- Add query parameter validation
- Add caching headers
- **Verification**: API responds in <500ms, caching works

#### [ ] Task 0.6: Performance Benchmark & Validation (Day 7)
- Create benchmark script
- Test Yankees Stadium (2,460 rows)
- Document results
- **Verification**: 2,460 rows calculated in <100ms ✅

#### [ ] Task 0.7: Comprehensive Unit Tests (Days 8-10)
- Create rowShadowCalculator.test.ts
- Create useSunCalculations.test.ts
- Create API route tests
- **Verification**: >90% test coverage

#### [ ] Task 0.8: Integration Testing (Days 11-13)
- E2E row calculation flow
- API integration tests
- Performance under load tests
- **Verification**: All integration tests passing

#### [ ] Task 0.9: Code Review & Refactoring (Day 14)
- Code review checklist
- Refactoring
- Documentation updates
- **Verification**: All tests passing, code reviewed

---

### Phase 1: Row-Level UI (Week 2-3)

#### [ ] Task 1.1: Create RowBreakdownView Component (Days 15-16)
- File: `/src/components/RowBreakdownView.tsx` (NEW - 250 lines)
- Desktop table view
- Mobile list view
- Sort and filter functionality
- **Verification**: Component renders correctly on desktop + mobile

#### [ ] Task 1.2: Update LazySectionCardModern (Day 17)
- File: `/src/components/LazySectionCardModern.tsx` (MODIFY)
- Add row summary display
- Add "View Row Details" button
- Add expandable RowBreakdownView
- **Verification**: Row summary shows, expand/collapse works

#### [ ] Task 1.3: Add Row-Level Filters (Day 18)
- File: `/src/components/RowFilterBar.tsx` (NEW - 120 lines)
- File: `/src/components/EnhancedSunFilter.tsx` (MODIFY)
- Create RowFilterBar component
- Integrate into EnhancedSunFilter
- **Verification**: Filters apply correctly to section list

#### [ ] Task 1.4: Integration (Days 19-20)
- Update stadium pages
- Add section/row level toggle
- Test responsiveness
- **Verification**: Toggle works, no breaking changes

#### [ ] Task 1.5: E2E Testing (Day 21)
- Playwright tests
- Visual regression tests
- Accessibility tests
- **Verification**: All E2E tests passing, zero a11y violations

---

### Phase 2: World Cup Existing Stadiums (Week 3-4)
- Duplicate 11 NFL stadium files to -wc.ts
- Update metadata for soccer
- Create section mappings
- Verify row data
- Test calculations

**Verification**: 11 WC venues load correctly ✅

---

### Phase 3: World Cup New Stadiums (Weeks 4-6)
- Gather data for 5 new stadiums
- Create stadium files
- Populate row data
- Test calculations

**Verification**: 5 new stadiums functional ✅

---

### Phase 4: World Cup UI & Schedule (Weeks 6-7)
- Create World Cup landing page
- Create venue pages
- Import 104 match schedule
- Pre-calculate shade for matches
- Create WC API endpoints

**Verification**: 16 venues display, 104 matches load ✅

---

### Phase 5: Multi-Language (Weeks 7-8)
- Create fr.json (~520 lines)
- Update i18nContext.tsx
- Machine translate + review
- Consolidate translation files
- Test all 4 languages

**Verification**: EN, ES, JA, FR all functional ✅

---

### Phase 6: Testing & Optimization (Weeks 8-9)
- Performance optimization
- Visual regression testing
- Accessibility audit
- Bug fixing (P0/P1)
- Lighthouse audit

**Verification**: Lighthouse ≥90, <2s load ✅

---

### Phase 7: Launch Preparation (Weeks 9-10)
- SEO optimization
- Marketing content
- Analytics setup
- Soft launch (50-100 users)
- Monitor & document

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
