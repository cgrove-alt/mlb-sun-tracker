# Decision Summary
## Technical Specification Approval Checklist

**Project**: 2026 Row-Level & World Cup Rebuild
**Date**: January 22, 2026
**Status**: Awaiting Stakeholder Approval

---

## IMMEDIATE ACTIONS REQUIRED

### 🚨 **CRITICAL** (Must Do TODAY):

- [ ] **Check FIFA 2026 World Cup Schedule**
  - URL: https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026
  - Verify: Is full 104-match schedule published?
  - Document: Match count, format, publication status
  - Impact: Required for Phase 4 (World Cup UI & Schedule)
  - Time: 15 minutes

### ⚠️ **IMPORTANT** (This Week):

- [ ] **Measure Baseline Build Time**
  ```bash
  cd /Users/sygrovefamily/.zenflow/worktrees/2026-row-level-and-world-cup-reb-b2a6
  time npm run build
  ```
  - Document: Build time in seconds
  - Target: <5 minutes (300 seconds)
  - Impact: Validates scalability assumption
  - Time: 5 minutes

- [ ] **Verify Active Branding**
  - Visit: https://theshadium.com (if deployed) or run `npm run dev`
  - Check: Does site show "The Shadium" or "MLB Stadium Sun Tracker"?
  - Document: Which branding is active
  - Impact: Required for branding decision (see below)
  - Time: 5 minutes

### 📋 **REVIEW** (This Week):

- [ ] **Read TRANSLATION-FILES-ANALYSIS.md**
  - Review: Branding inconsistency findings
  - Decision: Which branding to use?
  - Time: 10 minutes

- [ ] **Read spec-corrected.md Executive Summary**
  - Sections: Pages 1-5 (Executive Summary, Context, Approach)
  - Time: 15 minutes

- [ ] **Read CRITICAL-CORRECTIONS.md**
  - Review: 10 corrections from V1.0
  - Time: 10 minutes

---

## DECISION MATRIX

### Critical Decisions (Must Approve Before Implementation):

| # | Decision | Recommended | Alternative | Impact | Status |
|---|----------|-------------|-------------|--------|--------|
| **D1** | **Timeline** | 10 weeks + 4-day buffer | 12 weeks (more buffer) | April 1 launch | [ ] Approved [ ] Adjust |
| **D2** | **Stadium Duplication** | Create `-wc.ts` files | Use configuration toggle | 11 stadiums × 2 | [ ] Approved [ ] Alternative |
| **D3** | **Field Verification** | Defer to post-launch | $1,500-3,000 budget now | Data accuracy | [ ] Approved [ ] Fund |
| **D4** | **Translation Budget** | $300-500 (machine + review) | $2-3k (professional) | French translation | [ ] Approved [ ] Increase |
| **D5** | **Language Count** | 4 languages (EN/ES/JA/FR) | 3 languages (drop JA or FR) | International support | [ ] Approved [ ] Adjust |
| **D6** | **Translation Files** | Delete legacy after verification | Keep as backup | File cleanup | [ ] Approved [ ] Keep |
| **D7** | **Virtual Scrolling** | Defer to Phase 6 testing | Implement in Phase 1 | +1-2 days if needed | [ ] Approved [ ] Implement |
| **D8** | **Build Time Check** | Phase 0 (early warning) | Phase 6 (optimization) | Risk detection | [ ] Approved [ ] Defer |

### Branding Decision (NEW):

| # | Decision | Option 1 | Option 2 | Recommended | Status |
|---|----------|----------|----------|-------------|--------|
| **D9** | **Official Branding** | "The Shadium" ✅ | "MLB Stadium Sun Tracker" | The Shadium | [ ] Option 1 [ ] Option 2 |

**Rationale for "The Shadium"**:
- ✅ Matches domain (theshadium.com)
- ✅ Already active in code
- ✅ Sports-agnostic (supports World Cup)
- ✅ Modern, memorable branding
- ⚠️ May need marketing material updates

**If "MLB Stadium Sun Tracker" chosen**:
- ⚠️ Would require code reversion
- ⚠️ Domain mismatch (theshadium.com vs MLB Stadium Sun Tracker)
- ⚠️ Limits scope to MLB only

---

## DOCUMENT REVIEW CHECKLIST

### Core Documents:

- [ ] **spec-corrected.md** (V2.0 - Official Spec)
  - Sections to review:
    - [ ] Executive Summary (pages 1-2)
    - [ ] Technical Context (pages 3-7)
    - [ ] Implementation Approach (pages 8-10)
    - [ ] Delivery Phases (pages 15-20)
    - [ ] Open Questions (page 35)
  - Time: 45-60 minutes

- [ ] **CRITICAL-CORRECTIONS.md** (V1.0 → V2.0 Changes)
  - All 10 corrections
  - Timeline impact
  - Work scope changes
  - Time: 15 minutes

- [ ] **TRANSLATION-FILES-ANALYSIS.md** (NEW - Branding Issue)
  - Branding inconsistency findings
  - 3 file locations explained
  - Recommendations
  - Time: 15 minutes

### Optional (If Time Permits):

- [ ] **requirements.md** (PRD - Full Requirements)
  - Comprehensive feature requirements
  - Time: 30 minutes

- [ ] **spec.md** (V1.0 - Superseded, Reference Only)
  - Original spec (has inaccuracies)
  - Time: Skip (use spec-corrected.md instead)

---

## APPROVAL CHECKLIST

### Before Proceeding to Implementation:

**Phase 0 Prerequisites**:
- [ ] All 8 critical decisions approved (D1-D8)
- [ ] Branding decision made (D9)
- [ ] FIFA schedule status verified (critical)
- [ ] Baseline build time measured (important)
- [ ] Active branding verified (important)

**Stakeholder Sign-Off**:
- [ ] Technical specification approved (spec-corrected.md)
- [ ] Timeline approved (10 weeks + 4-day buffer)
- [ ] Budget approved ($300-500 translation + optional $1,500-3,000 verification)
- [ ] Language strategy approved (EN/ES/JA/FR)
- [ ] Branding strategy approved (The Shadium or MLB Stadium Sun Tracker)

**Team Alignment**:
- [ ] Weekly progress reviews scheduled (Fridays, 2:00 PM)
- [ ] Communication channels established
- [ ] Kickoff meeting scheduled
- [ ] Responsibilities assigned

---

## BUDGET SUMMARY

### Required Costs:

| Item | Amount | Status |
|------|--------|--------|
| **French Translation** | $300-500 | [ ] Approved |
| - Machine translation (DeepL) | $50 | Included |
| - Native speaker review (core UI ~100 strings) | $250-450 | Included |

### Optional Costs:

| Item | Amount | Status |
|------|--------|--------|
| **Field Verification** (3-5 stadiums) | $1,500-3,000 | [ ] Approved [ ] Defer |
| - Tickets + travel per stadium | $500-1,000 ea | Per stadium |
| - Light meter equipment | $100 | One-time |

### Hidden Costs (Zero):

| Item | V1.0 (Incorrect) | V2.0 (Corrected) | Savings |
|------|------------------|------------------|---------|
| next-intl package | $0 (but time cost) | $0 (not needed) | 4 days timeline |
| Professional translation | $2,000-3,000 | $300-500 | $1,500-2,500 |
| Web worker creation | Time cost | Time cost (less) | 1-2 days timeline |

**Total Required**: $300-500
**Total Optional**: $1,500-3,000
**Total Maximum**: $3,500

---

## RISK REGISTER

### High Priority Risks:

| Risk | Likelihood | Impact | Mitigation | Owner | Status |
|------|------------|--------|------------|-------|--------|
| **FIFA schedule unavailable** | Medium | High | TBD placeholders, update when published | TBD | [ ] Verify TODAY |
| **Build time >5 minutes** | Low | High | Database migration planning | TBD | [ ] Measure Week 1 |
| **Translation files conflict** | Low | Medium | Delete legacy after verification | TBD | [ ] Phase 5 |
| **Branding confusion** | Medium | Medium | Document official branding | TBD | [ ] Decide now |

### Medium Priority Risks:

| Risk | Likelihood | Impact | Mitigation | Owner | Status |
|------|------------|--------|------------|-------|--------|
| Data unavailable (5 new stadiums) | Medium | Medium | Template-based estimation | TBD | [ ] Start Week 4 |
| Performance degradation (row calc) | Medium | Medium | Web Worker, caching, profiling | TBD | [ ] Phase 0 |
| French translation quality | Medium | Low | Native speaker review | TBD | [ ] Phase 5 |
| Virtual scrolling needed | Low | Low | Implement in Phase 6 if needed | TBD | [ ] Phase 6 |

---

## TIMELINE SUMMARY

### Target Launch: April 1, 2026 (69 days from today)

**Phase Breakdown**:
- **Phase 0**: Foundation (Weeks 1-2) - Row calculation engine
- **Phase 1**: Row UI (Weeks 2-3) - User interface components
- **Phase 2**: World Cup Existing (Weeks 3-4) - 11 NFL stadiums
- **Phase 3**: World Cup New (Weeks 4-6) - 5 new stadiums
- **Phase 4**: World Cup UI (Weeks 6-7) - Landing page + schedule
- **Phase 5**: Multi-Language (Weeks 7-8) - **3-4 days** (add French + branding)
- **Phase 6**: Testing (Weeks 8-9) - Optimization + bug fixes
- **Phase 7**: Launch Prep (Weeks 9-10) - Marketing + soft launch

**Total**: 70 days (10 weeks) + 4-day buffer from Phase 5 correction

**Milestones**:
- Week 2: Row calculations operational
- Week 3: Row UI functional
- Week 6: All 16 World Cup venues ready
- Week 7: World Cup landing page live
- Week 8: All 4 languages supported
- Week 10: Launch ready

---

## NEXT STEPS

### After All Decisions Approved:

1. **Kickoff Meeting** (Schedule for this week):
   - Review approved spec
   - Assign responsibilities
   - Set up communication channels
   - Confirm weekly progress reviews

2. **Phase 0 Start** (Target: Monday, January 27, 2026):
   - Extend sunCalculator.ts (row-level methods)
   - Extend sunCalculations.worker.js (row support)
   - Create unit tests
   - Measure baseline build time
   - Performance benchmarks

3. **Weekly Progress Reviews**:
   - Every Friday, 2:00 PM
   - Update plan.md checkboxes
   - Report blockers
   - Adjust timeline if needed

---

## QUESTIONS & CLARIFICATIONS

### If You Have Questions:

**About the Spec**:
- Read spec-corrected.md Section 11 (Open Questions)
- Review CRITICAL-CORRECTIONS.md for V1.0 vs V2.0 changes

**About Branding**:
- Read TRANSLATION-FILES-ANALYSIS.md (comprehensive investigation)
- Check active site to see current branding

**About Timeline**:
- Review spec-corrected.md Section 5 (Delivery Phases)
- Check CRITICAL-CORRECTIONS.md for timeline impact

**About Budget**:
- See Budget Summary above
- Optional field verification can be deferred

---

## APPROVAL SIGNATURES

### Stakeholder Approval:

**Technical Specification** (spec-corrected.md V2.0):
- [ ] Approved
- [ ] Approved with revisions (specify):
  - ___________________________________________
- [ ] Rejected (reason):
  - ___________________________________________

**Timeline** (10 weeks, April 1, 2026 launch):
- [ ] Approved
- [ ] Adjust to: ________ weeks

**Budget** ($300-500 required, $1,500-3,000 optional):
- [ ] Approved: Required only ($300-500)
- [ ] Approved: Required + Optional ($3,500 max)
- [ ] Adjust to: $ ________

**Branding** (Official name):
- [ ] "The Shadium"
- [ ] "MLB Stadium Sun Tracker"
- [ ] Other: ___________________________________________

**Date**: _________________
**Signature**: _________________
**Name**: _________________

---

## SUMMARY

**Total Decisions**: 9 (8 technical + 1 branding)
**Critical Actions**: 3 (FIFA schedule, build time, branding verification)
**Document Review Time**: ~90 minutes
**Budget**: $300-500 required, $1,500-3,000 optional
**Timeline**: 10 weeks (70 days) to April 1, 2026

**Status**: ⏳ **Awaiting Stakeholder Approval**

**Next Action**: Complete IMMEDIATE ACTIONS checklist, then review and approve all 9 decisions.

---

**Document Metadata**:
- Version: 1.0
- Date: January 22, 2026
- Purpose: Streamline approval process
- Related Docs: spec-corrected.md, CRITICAL-CORRECTIONS.md, TRANSLATION-FILES-ANALYSIS.md
