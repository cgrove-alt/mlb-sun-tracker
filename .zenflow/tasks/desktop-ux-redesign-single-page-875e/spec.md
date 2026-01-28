# Technical Specification: Desktop UX Redesign - Single Page App Layout

## Task Difficulty: HARD

This task requires significant architectural changes affecting multiple interconnected components, new component creation, complex state synchronization, and careful performance optimization.

---

## 1. Technical Context

### Stack
- **Framework**: Next.js 15.5.7 (App Router)
- **UI Library**: React 18.2.0
- **Language**: TypeScript 5.0 (strict mode)
- **Styling**: Tailwind CSS 3.4.17 + CSS Modules
- **Components**: react-select for dropdowns, lucide-react for icons
- **State**: React useState/useEffect, URL query params, localStorage preferences

### Key Dependencies
- `react-select` - Dropdown components
- `react-window` - Virtual scrolling for large lists
- `tailwindcss` - Utility-first CSS
- `date-fns` - Date manipulation

---

## 2. Current Problems Analysis

| Problem | Current Behavior | Root Cause | Impact |
|---------|-----------------|------------|--------|
| "Find Your Shade" scrolls | Button scrolls to `#app-section` | HeroSection.tsx lines 35-44 use `scrollIntoView` | Bad UX, feels indirect |
| Venue selector shows card grid | VenueSelector renders card grid layout | Design choice in VenueSelector.tsx | Overwhelming, not professional |
| League/Stadium/Game buried | Selection in UnifiedGameSelector | No top-level league navigation | Discovery problem |
| Filters cramped | SectionFilters in 400px sidebar context | Desktop layout constraints | Hard to use on desktop |
| Section cards not expandable | LazySectionCardModern has no clear expand UI | Missing visual affordance | Users don't know they can expand |
| Only 50 venues preloaded | VenueDataProvider.tsx line 9-11 filters to 50 | Performance optimization | MiLB/World Cup venues hidden |

---

## 3. Solution Architecture

### 3.1 New Desktop Layout Structure

```
┌──────────────────────────────────────────────────────────────────┐
│ StickyTopNav (existing)                                          │
├──────────────────────────────────────────────────────────────────┤
│ LeagueTabs: [ MLB | MiLB | NFL | World Cup 2026 ]               │
├──────────────────────────────────────────────────────────────────┤
│ StadiumGameSelector (full-width dropdown bar)                    │
│ [ Stadium ▼ ]  [ Game/Date ▼ ]  [ Time ▼ ]                      │
├──────────────────────────────────────────────────────────────────┤
│ HorizontalFilterPills                                            │
│ [ Sun: All ▼ ] [ Level: All ▼ ] [ Price: All ▼ ] [ Clear ]      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┐  ┌────────────────────────────────┐│
│  │                         │  │                                ││
│  │   StadiumDiagram        │  │   SectionCardsGrid             ││
│  │   (40% width)           │  │   (60% width)                  ││
│  │                         │  │                                ││
│  │   Interactive SVG       │  │   Section cards with           ││
│  │   Click = select        │  │   clear expand indicators      ││
│  │   Sync with cards       │  │   Sync with diagram            ││
│  │                         │  │                                ││
│  └─────────────────────────┘  └────────────────────────────────┘│
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 3.2 Component Hierarchy

```
DesktopShadeApp (NEW - main container)
├── LeagueTabs (NEW)
├── StadiumGameBar (NEW - combines venue + game selection)
├── HorizontalFilterPills (NEW)
└── MainContent (NEW)
    ├── StadiumDiagramPanel (wraps existing StadiumDiagram)
    └── SectionCardsPanel (wraps existing SectionList)
```

---

## 4. Implementation Approach

### 4.1 Reusable Components (Existing)

| Component | Location | Reuse Strategy |
|-----------|----------|----------------|
| `StadiumDiagram` | `src/components/StadiumDiagram/` | Wrap in panel, add selection sync |
| `SectionList` | `src/components/SectionList.tsx` | Modify to support bidirectional sync |
| `LazySectionCardModern` | `src/components/LazySectionCardModern.tsx` | Add expand indicator styling |
| `SectionFilters` | `src/components/SectionFilters/` | Extract filter logic for pills |
| `UnifiedGameSelector` | `src/components/UnifiedGameSelector.tsx` | Extract venue/game logic |
| `unifiedVenues.ts` | `src/data/unifiedVenues.ts` | Use ALL_UNIFIED_VENUES directly |

### 4.2 New Components to Create

| Component | Purpose | Location |
|-----------|---------|----------|
| `DesktopShadeApp` | Main container for desktop layout | `src/components/DesktopShadeApp/` |
| `LeagueTabs` | Top-level league navigation | `src/components/LeagueTabs/` |
| `StadiumGameBar` | Full-width stadium/game selector | `src/components/StadiumGameBar/` |
| `HorizontalFilterPills` | Horizontal filter UI | `src/components/HorizontalFilterPills/` |
| `MainContentLayout` | Side-by-side diagram + cards | `src/components/MainContentLayout/` |

### 4.3 Files to Modify

| File | Changes |
|------|---------|
| `app/HomePage.tsx` | Replace VenueDataProvider with DesktopShadeApp for desktop |
| `components/VenueSelector.tsx` | Update to use new flow or deprecate |
| `src/components/HeroSection/HeroSection.tsx` | Update "Find Your Shade" to open selector directly |
| `src/components/LazySectionCardModern.tsx` | Add clear expand/collapse indicator |
| `src/components/SectionList.tsx` | Add `onSectionSelect` callback for sync |
| `src/components/StadiumDiagram/StadiumDiagram.tsx` | Ensure selection prop works bidirectionally |

---

## 5. Data Flow Changes

### 5.1 Venue Loading (Fix 50 venue limit)

**Current Flow:**
```
VenueDataProvider → filter to 50 → VenueSelector
```

**New Flow:**
```
DesktopShadeApp:
  - Load ALL_UNIFIED_VENUES (6500+)
  - Filter by selected league tab
  - Use react-select with async search for venue dropdown
  - Virtual scroll for long lists
```

### 5.2 Selection Synchronization

**Bidirectional Sync Pattern:**
```typescript
// DesktopShadeApp state
const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

// Pass to StadiumDiagram
<StadiumDiagram
  selectedSectionId={selectedSectionId}
  onSectionSelect={setSelectedSectionId}
/>

// Pass to SectionCards
<SectionCardsGrid
  highlightedSectionId={selectedSectionId}
  onSectionSelect={setSelectedSectionId}
/>
```

---

## 6. Source Code Structure Changes

### 6.1 New Directory Structure

```
src/components/
├── DesktopShadeApp/
│   ├── DesktopShadeApp.tsx          # Main container
│   ├── DesktopShadeApp.module.css   # Styles
│   └── index.ts                     # Export
├── LeagueTabs/
│   ├── LeagueTabs.tsx               # Tab navigation
│   ├── LeagueTabs.module.css        # Styles
│   └── index.ts
├── StadiumGameBar/
│   ├── StadiumGameBar.tsx           # Full-width selector bar
│   ├── StadiumGameBar.module.css
│   └── index.ts
├── HorizontalFilterPills/
│   ├── HorizontalFilterPills.tsx    # Filter pills
│   ├── HorizontalFilterPills.module.css
│   └── index.ts
└── MainContentLayout/
    ├── MainContentLayout.tsx        # Side-by-side layout
    ├── MainContentLayout.module.css
    └── index.ts
```

### 6.2 Type Definitions

```typescript
// src/types/desktop-app.ts

export type LeagueId = 'MLB' | 'MiLB' | 'NFL' | 'WorldCup';

export interface DesktopAppState {
  selectedLeague: LeagueId;
  selectedVenue: UnifiedVenue | null;
  selectedGame: MLBGame | MiLBGame | NFLGame | WorldCupGame | null;
  gameDateTime: Date | null;
  selectedSectionId: string | null;
  filters: FilterState;
}

export interface FilterState {
  maxSunExposure?: number;
  sectionTypes: string[];
  priceRanges: string[];
}
```

---

## 7. API / Interface Changes

### 7.1 Component Props Changes

**SectionList.tsx** - Add new props:
```typescript
interface SectionListProps {
  // ... existing props
  highlightedSectionId?: string;        // NEW: section to highlight
  onSectionSelect?: (id: string) => void; // NEW: callback when section selected
  compactMode?: boolean;                 // NEW: for side-by-side layout
}
```

**StadiumDiagram.tsx** - Already supports:
```typescript
interface StadiumDiagramProps {
  selectedSectionId?: string;           // Already exists
  onSectionSelect?: (id: string) => void; // Already exists
}
```

**LazySectionCardModern.tsx** - Add expand indicator:
```typescript
interface SectionCardProps {
  // ... existing props
  showExpandIndicator?: boolean;        // NEW: show expand/collapse arrow
  isHighlighted?: boolean;              // NEW: visual highlight from diagram
}
```

---

## 8. Verification Approach

### 8.1 Automated Tests

```bash
# Run existing tests to ensure no regressions
npm run test

# Run type check
npm run type-check

# Run lint
npm run lint

# Run build
npm run build
```

### 8.2 Manual Verification Checklist

- [ ] League tabs switch between MLB, MiLB, NFL, World Cup
- [ ] All 250+ venues accessible via dropdown search
- [ ] Stadium diagram and section cards sync bidirectionally
- [ ] Horizontal filter pills work correctly
- [ ] Section cards have clear expand/collapse indicators
- [ ] "Find Your Shade" opens selector directly (no scroll)
- [ ] Mobile breakpoint (768px) shows MobileApp
- [ ] Performance acceptable with 250+ venues

### 8.3 Performance Benchmarks

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load | < 3s | Chrome DevTools |
| League Tab Switch | < 500ms | Chrome DevTools |
| Venue Search | < 100ms | React Profiler |
| Section Selection | < 50ms | React Profiler |

---

## 9. Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Performance with 6500 venues | Medium | High | Use react-select async, virtual scroll |
| Breaking mobile experience | Low | High | Keep MobileApp separate, test thoroughly |
| Complex state sync bugs | Medium | Medium | Simple unidirectional data flow |
| Regression in existing features | Low | High | Comprehensive testing |

---

## 10. Implementation Phases

### Phase 1: Core Desktop Layout Component
- Create DesktopShadeApp container
- Create LeagueTabs component
- Basic layout structure without functionality
- **Files**: New components in src/components/

### Phase 2: Horizontal Filter System
- Create HorizontalFilterPills component
- Extract filter logic from SectionFilters
- Connect to existing filter context
- **Files**: HorizontalFilterPills/, modify SectionList

### Phase 3: Enhanced Section Cards
- Add expand/collapse indicators to cards
- Add highlight prop for sync
- Improve card styling for desktop
- **Files**: LazySectionCardModern.tsx

### Phase 4: Stadium Diagram Integration
- Create MainContentLayout (40/60 split)
- Implement bidirectional selection sync
- Style diagram panel for desktop
- **Files**: MainContentLayout/, StadiumDiagram

### Phase 5: Navigation & Entry Point
- Create StadiumGameBar (full-width selector)
- Update HeroSection to open selector directly
- Load all 250+ venues
- Update HomePage integration
- **Files**: StadiumGameBar/, HeroSection, HomePage

### Phase 6: Polish & Responsive
- Fine-tune responsive breakpoints
- Performance optimization
- Accessibility review
- Final testing
- **Files**: Various CSS modules

---

## 11. Dependencies Between Phases

```
Phase 1 (Layout)
    ↓
Phase 2 (Filters) ← Can start parallel with Phase 3
    ↓
Phase 3 (Cards) ← Can start parallel with Phase 2
    ↓
Phase 4 (Diagram Integration) ← Needs Phase 1, 3
    ↓
Phase 5 (Navigation) ← Needs Phase 1
    ↓
Phase 6 (Polish) ← Needs all above
```

---

## 12. Out of Scope

- Mobile UX changes (keep existing MobileApp)
- Backend API changes
- New venue data collection
- Multi-language updates
- SEO changes beyond page structure
