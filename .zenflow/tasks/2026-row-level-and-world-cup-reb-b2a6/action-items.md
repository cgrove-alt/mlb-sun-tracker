# Action Items & Decisions Required
## Before Proceeding to Technical Specification

**Document**: Requirements V2.0
**Date**: January 22, 2026
**Status**: APPROVED - Pending Critical Decisions

---

## ✅ VALIDATED ASSUMPTIONS

### Assumption 2: FIFA Schedule Available
**Status**: ✅ **CONFIRMED**

**Findings** (January 22, 2026):
- FIFA 2026 World Cup full match schedule **IS PUBLISHED**
- Tournament: June 11 - July 19, 2026 (confirmed 139 days from today)
- 104 matches across 16 venues (78 in USA, 13 Mexico, 13 Canada)
- Detailed schedule available at: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026

**Key Details**:
- Opening match: June 11, 2026, 1:00 PM - Mexico vs South Africa (Mexico City)
- USA opening: June 12, 2026, 6:00 PM - USA vs Paraguay (Los Angeles)
- Final: July 19, 2026 - MetLife Stadium (New York/New Jersey)
- Most matches: AT&T Stadium (Dallas) - 9 matches

**Action**: Week 5-6 can proceed with manual entry of 104 matches as planned.

**Sources**:
- [FIFA Official Match Schedule](https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/match-schedule-fixtures-results-teams-stadiums)
- [Updated FIFA Schedule with Kick-off Times](https://inside.fifa.com/media-releases/updated-world-cup-2026-match-schedule-venues-kick-off-times-104-matches)
- [NBC Sports Full Schedule Details](https://www.nbcsports.com/soccer/news/2026-world-cup-schedule-confirmed-dates-times-stadiums-full-details)

---

## 🔲 CRITICAL DECISIONS NEEDED (Stakeholder Approval Required)

### Q1: Approve 10-Week Timeline?
**Decision Required**: ✅/❌

**Proposal**: 10 weeks to April 1, 2026 launch (69 days from today)

**Timeline Breakdown**:
- Week 1-2: Row calculation engine
- Week 2-3: Row UI components
- Week 3-6: World Cup venues (11 existing + 5 new)
- Week 6-7: World Cup UI + match schedule
- Week 7-8: Multi-language support
- Week 8-10: Testing, optimization, launch prep

**Risk**: Aggressive but achievable with focus and parallel tracks

**Alternative**: 12 weeks (84 days) = March 25, 2026 launch
- Pros: More buffer for delays
- Cons: Closer to World Cup start (June 11), less time before ticketing peak

**Recommended Decision**: ✅ **Approve 10-week timeline**
- Reason: World Cup urgency demands fast delivery
- Mitigation: Weekly progress reviews, parallel development tracks

**Stakeholder Decision**: _______________

---

### Q2: Approve Dual-Use Stadium Approach?
**Decision Required**: ✅/❌

**Proposal**: Duplicate NFL stadiums as `*-wc.ts` files

**Example**:
- `metlife-stadium.ts` (NFL configuration)
- `metlife-stadium-wc.ts` (World Cup/soccer configuration)

**Pros**:
- Clean separation of NFL vs World Cup data
- No risk of breaking existing NFL functionality
- Easy to add section mappings (NFL ID → Soccer name)

**Cons**:
- Data duplication (11 stadiums × 2 = 22 entries)
- Maintenance burden (update both when stadium changes)

**Alternative**: Single stadium with `configuration: 'nfl' | 'soccer'` toggle
- Pros: No duplication, single source of truth
- Cons: More complex code, risk of breaking existing NFL pages

**Recommended Decision**: ✅ **Approve duplication approach**
- Reason: Safety first - don't break existing NFL functionality
- Mitigation: Document which stadiums are dual-use, link them in metadata

**Stakeholder Decision**: _______________

---

### Q3: Field Verification Budget?
**Decision Required**: ✅/❌ + Budget Amount

**Question**: Can we attend 3-5 games for field verification?

**Cost Estimate**:
- Tickets: $100-300 per game
- Travel: $200-500 per stadium
- Equipment (light meter): $100 one-time
- Total: ~$500-1000 per stadium
- **Total Budget for 5 stadiums**: $2,500 - $5,000

**Target Stadiums for Verification** (suggested):
1. Yankee Stadium (MLB) - High traffic, easy access
2. Dodger Stadium (MLB) - West coast, different sun patterns
3. MetLife Stadium (NFL/World Cup) - Final venue, critical
4. AT&T Stadium (World Cup) - Most matches (9), indoor/outdoor hybrid
5. Estadio Azteca (World Cup) - International, different climate

**Alternative**: Accept template-based accuracy for V1
- Pros: Zero cost, no travel delays
- Cons: Unknown accuracy (could be ±10-15% error)
- Post-launch: Iterative refinement based on user feedback

**Recommended Decision**: ✅ **Approve $3,000 budget for 3 stadiums**
- Verify: Yankee Stadium, MetLife Stadium, AT&T Stadium
- Defer: Dodger Stadium, Estadio Azteca to post-launch
- Timing: Week 8-9 during testing phase

**Stakeholder Decision**: _______________
**Approved Budget**: $_____________

---

### Q4: Translation Resource?
**Decision Required**: ✅/❌ + Method

**Question**: Professional translator or machine translation (DeepL)?

**Option A: Professional Translation**
- Cost: $0.10-0.20/word
- Estimated word count: 15,000 words (core UI + stadium guides)
- **Total Cost**: $1,500 - $3,000
- Quality: High (native speakers)
- Timeline: 2-3 weeks (may delay Week 7-8)

**Option B: Machine Translation (DeepL) + Native Speaker Review**
- Cost: DeepL API = $25/month + $500 for native speaker review
- **Total Cost**: $525
- Quality: Good (90-95% accuracy with review)
- Timeline: 1 week (faster)

**Option C: Machine Translation Only (No Review)**
- Cost: $25/month
- **Total Cost**: $25
- Quality: Fair (80-85% accuracy, may have errors)
- Timeline: 1 week

**Recommended Decision**: ✅ **Option B - Machine + Review**
- Reason: Best balance of cost, quality, and speed
- Process:
  1. DeepL auto-translate all UI strings (1 day)
  2. Native Spanish speaker review (2 days)
  3. Native French speaker review (2 days)
  4. Developer implement corrections (1 day)
- Total: 6 days (fits Week 7 timeline)

**Stakeholder Decision**: _______________

---

### Q5: Defer Features to Phase 2?
**Decision Required**: ✅/❌

**Proposed Deferred Features** (not in April 1 launch):
1. ❌ 3D stadium visualization (types exist but not building renderer)
2. ❌ Visual seat map with shade overlay (2D interactive map)
3. ❌ Row comparison tool (side-by-side comparison of 3 sections)
4. ❌ Advanced filtering (e.g., "Find best value rows in budget")
5. ❌ User accounts / saved preferences
6. ❌ Real-time weather integration

**Rationale**: Focus on World Cup deadline (69 days)

**MVP Features** (must have for April 1):
- ✅ Row-level sun calculations
- ✅ Row breakdown UI (table view)
- ✅ Basic row filters ("Has rows with >80% shade")
- ✅ All 16 World Cup venues
- ✅ World Cup match schedule
- ✅ Multi-language (EN, ES, FR)

**Risk**: Missing "nice-to-have" features at launch may reduce user engagement

**Mitigation**: Phase 2 roadmap for post-World Cup (August 2026)

**Recommended Decision**: ✅ **Approve deferred features list**
- Reason: Better to launch on time with core features than late with everything
- Commitment: Document Phase 2 roadmap, communicate to users

**Stakeholder Decision**: _______________

---

## 🔲 ADDITIONAL VALIDATION TASKS

### Assumption 3: User Wants Row-Level
**Status**: ⚠️ **NEEDS VALIDATION**

**Evidence Missing**: No user research confirming demand for row-level data

**Recommended Validation**:
1. **Review Support Tickets** (Week 1):
   - Search for "row", "specific row", "front row", "back row"
   - Count: How many users ask about row-specific shade?
   - Timeline: 1 day

2. **User Survey** (Week 1-2):
   - Target: 100 existing users
   - Questions:
     - "Would row-level shade info help you choose better seats?"
     - "How much more would you pay for a shaded row vs sunny row?"
     - "Do you understand the difference between section-level and row-level?"
   - Timeline: 3 days to create, 7 days to collect, 1 day to analyze

3. **Analytics Review** (Week 1):
   - Check existing section-level engagement:
     - Do users expand section details frequently?
     - How long do they spend on section pages?
     - Bounce rate on section vs stadium pages?
   - Timeline: 1 day

**Outcome**:
- If >60% positive response → Proceed with confidence
- If 30-60% → Proceed but add more education/onboarding
- If <30% → Reconsider scope (focus on World Cup only, defer row-level)

**Stakeholder Decision**: _______________

---

### Assumption 4: Current Performance Holds
**Status**: ⚠️ **NEEDS BASELINE MEASUREMENT**

**Claim**: "Calculate 3,000 rows in <100ms" (unverified)

**Recommended Baseline** (Week 1, Day 1):
1. Benchmark current section-level calculation:
   ```bash
   npm run benchmark:sun-calculator
   ```
   - Measure: Yankees Stadium (82 sections) calculation time
   - Record: Current performance baseline
   - Target: Establish acceptable threshold

2. Prototype row-level calculation:
   ```typescript
   // Simple loop test
   const start = performance.now();
   for (let i = 0; i < 3000; i++) {
     calculateRowShadow(mockRow, mockSection, 45, 180);
   }
   const end = performance.now();
   console.log(`3,000 rows: ${end - start}ms`);
   ```
   - If >100ms → Need optimization strategy (Web Worker, caching)
   - If <100ms → Proceed as planned

**Timeline**: Day 1 of Week 1 (before any other work)

**Stakeholder Decision**: _______________

---

## 📋 WEEK 1 CHECKLIST (Jan 23-29, 2026)

**Day 1 (Thursday, Jan 23)**:
- [ ] Stakeholder meeting: Approve Q1-Q5 decisions
- [ ] Performance baseline measurement
- [ ] Create benchmark script for sun calculator

**Day 2 (Friday, Jan 24)**:
- [ ] Review support tickets for row-level demand
- [ ] Start user survey (if approved)
- [ ] Analytics review (section engagement)

**Day 3-4 (Weekend, Jan 25-26)**:
- [ ] Gather data for 5 new World Cup stadiums:
  - Estadio Azteca (Mexico City)
  - Estadio Akron (Guadalajara)
  - Estadio BBVA (Monterrey)
  - BC Place (Vancouver)
  - BMO Field (Toronto)
- [ ] Sources: Stadium websites, SeatGeek, StubHub

**Day 5-7 (Mon-Wed, Jan 27-29)**:
- [ ] Start Phase 0: Row calculation engine development
- [ ] Implement `calculateRowShadow()` function
- [ ] Implement `calculateOverhangShadow()` function
- [ ] Write unit tests

**End of Week 1**:
- [ ] Progress review meeting
- [ ] Adjust Week 2 plan based on learnings

---

## 🎯 DECISION DEADLINE

**All decisions must be made by**: **Friday, January 24, 2026 (2 days)**

**Rationale**: Week 1 work depends on these decisions
- Timeline affects resource allocation
- Budget affects scope (field verification, translation)
- Dual-use approach affects data structure design

**If decisions delayed beyond Jan 24**:
- Risk: Push launch date from April 1 to April 8+ (every week counts)
- Mitigation: Start work on non-controversial items (row calculation algorithm)

---

## ✅ APPROVAL SIGN-OFF

**Stakeholder**: ___________________________
**Date**: ___________________________

**Decisions Approved**:
- [ ] Q1: 10-week timeline
- [ ] Q2: Dual-use stadium approach
- [ ] Q3: Field verification budget ($________)
- [ ] Q4: Translation resource (Option: ___)
- [ ] Q5: Deferred features list

**Additional Notes**:
_______________________________________________
_______________________________________________
_______________________________________________

---

**Next Document**: Technical Specification (create after approval)
