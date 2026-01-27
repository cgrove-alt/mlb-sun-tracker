# Agent Verification Template

Copy this template into your `plan.md` to add verification steps to any workflow.

---

## Template: Add Verification to Any Step

```markdown
### [ ] Step: [Your Implementation Step]
<!-- chat-id: xxx -->

[Your implementation instructions...]

**Deliverable**: {@artifacts_path}/[step-name]-implementation.md

---

### [ ] Step: [Your Implementation Step] - Verification
<!-- chat-id: yyy -->

**Verification Agent Task:**

**Inputs**:
1. {@artifacts_path}/[step-name]-implementation.md
2. Codebase changes

**Automated Checks**:
```bash
# Run these commands:
npm run type-check        # TypeScript
npm run lint              # ESLint
npm test -- --coverage    # Tests
npm run build             # Build
```

**Manual Checks**:
- [ ] Code follows style guide (.claude/CLAUDE.md rules)
- [ ] No code duplication
- [ ] Error handling present
- [ ] Security: No vulnerabilities
- [ ] Performance: Benchmarks met
- [ ] Tests: >90% coverage
- [ ] Documentation: Complete

**Decision**:
- If all checks ✅ → Mark step [x] complete, proceed
- If issues found → Create {@artifacts_path}/[step-name]-corrections.md

**Deliverable**: {@artifacts_path}/[step-name]-verification.md

**Verification Report Format**:
```markdown
# Verification Report - [Step Name]

## Status: ✅ PASS / ⚠️ CONDITIONAL / ❌ FAIL

## Automated Checks
- TypeScript: [result]
- ESLint: [result]
- Tests: [X/Y passing, Z% coverage]
- Build: [result]

## Manual Checks
- Code quality: [notes]
- Security: [notes]
- Performance: [notes]

## Issues Found
1. [None / List issues]

## Recommendation
[Approve / Request corrections / Reject]

## Evidence
[Paste test output, benchmarks, etc.]
```
```

---

## Quick Start: Add Verification to Existing Workflow

### Example: Adding Verification to Phase 0

**Current (in your plan.md):**
```markdown
### [x] Step: Phase 0 - Row Calculation Engine
<!-- chat-id: f2299026-2bbc-4b11-80ce-a7f755ea1db4 -->
Status: 78% complete (7/9 tasks done)
```

**Enhanced with Verification:**
```markdown
### [x] Step: Phase 0 - Row Calculation Engine
<!-- chat-id: f2299026-2bbc-4b11-80ce-a7f755ea1db4 -->
Status: 78% complete (7/9 tasks done)

### [ ] Step: Phase 0 - Independent Verification
<!-- chat-id: [assign in new conversation] -->

**Verification Agent - Review Phase 0 Implementation**

**Context**: Phase 0 completed row calculation engine with 7/9 tasks done.

**Your Task**: Act as an independent verification agent. DO NOT implement anything. Only verify.

**Instructions**:
1. Read the Phase 0 section in plan.md to understand what was built
2. Examine the code changes:
   - /src/utils/sunCalculator.ts (476 → 759 lines)
   - /public/workers/sunCalculations.worker.js (65 → 288 lines)
   - /src/hooks/useSunCalculations.ts (141 → 172 lines)
   - /app/api/stadium/[id]/rows/shade/route.ts (NEW - 184 lines)

**Verification Checklist**:
```bash
# 1. Run automated checks
npm run type-check
npm run lint
npm test
npm run build

# 2. Check test coverage
npm test -- --coverage
# Verify: >90% coverage for row calculation files

# 3. Performance benchmark
node scripts/benchmark-row-calculations.js
# Verify: <100ms for 2,460 rows

# 4. API endpoint test
curl http://localhost:3000/api/stadium/yankee-stadium/rows/shade?date=2025-07-04&time=19:00
# Verify: Response <500ms, valid JSON
```

**Code Quality Checks**:
- [ ] No code duplication between sunCalculator.ts and worker
- [ ] Error handling in API route
- [ ] TypeScript types are precise (no `any`)
- [ ] Functions have single responsibility
- [ ] Comments explain WHY, not WHAT

**Security Checks**:
- [ ] API route validates input parameters
- [ ] No SQL injection vectors
- [ ] No hardcoded secrets
- [ ] Proper error messages (no sensitive data leaked)

**Performance Checks**:
- [ ] Worker offloads heavy calculations
- [ ] API route has caching headers
- [ ] No memory leaks in batch processing
- [ ] <100ms for 2,460 rows

**Acceptance Criteria** (from Task 0.1-0.9):
- [ ] Task 0.1: Baseline documented ✅
- [ ] Task 0.2: SunCalculator extended ✅
- [ ] Task 0.3: Web worker updated ✅
- [ ] Task 0.4: Hook updated ✅
- [ ] Task 0.5: API endpoint created ✅
- [ ] Task 0.6: Performance benchmark ⏳
- [ ] Task 0.7: Unit tests >90% coverage ⏳
- [ ] Task 0.8: Integration tests ⏳
- [ ] Task 0.9: Code review ⏳

**Deliverables**:
1. {@artifacts_path}/phase-0-verification-report.md
2. If issues found: {@artifacts_path}/phase-0-corrections-needed.md

**Verification Report Template**:
```markdown
# Phase 0 Verification Report

Date: [YYYY-MM-DD]
Verifier: [Agent chat-id]

## Executive Summary
Phase 0 Status: [% complete]
Verification Status: ✅ PASS / ⚠️ CONDITIONAL / ❌ FAIL

## Automated Checks
- TypeScript: ✅/❌ [X errors]
- ESLint: ✅/❌ [X warnings]
- Unit Tests: ✅/❌ [X/Y passing]
- Test Coverage: ✅/❌ [X%]
- Build: ✅/❌ [success/fail]
- Performance: ✅/❌ [Xms for Y rows]

## Code Quality
- Duplication: [assessment]
- Error handling: [assessment]
- TypeScript usage: [assessment]
- Function design: [assessment]
- Comments: [assessment]

## Security
- Input validation: [assessment]
- Injection vectors: [assessment]
- Secret management: [assessment]
- Error messages: [assessment]

## Performance
- Worker efficiency: [assessment]
- API response time: [assessment]
- Memory usage: [assessment]
- Benchmark results: [X ms]

## Acceptance Criteria
- [X/9] tasks complete
- [List incomplete tasks]

## Issues Found
1. [Issue description] - Severity: [High/Med/Low]
   - Impact: [description]
   - Recommendation: [action]

2. [Issue description] - Severity: [High/Med/Low]
   - Impact: [description]
   - Recommendation: [action]

## Recommendation
- [ ] ✅ APPROVE - All criteria met, proceed to Phase 1
- [ ] ⚠️ CONDITIONAL - Minor issues, can proceed with follow-up tasks
- [ ] ❌ REJECT - Critical issues, must fix before Phase 1

## Evidence
[Attach test output]
```

**Next Steps**:
- If ✅ APPROVED: Mark Phase 0 as [x] complete, proceed to Phase 1
- If ⚠️ CONDITIONAL: Create follow-up tasks, proceed with caution
- If ❌ REJECTED: Return to implementation, address critical issues
```

---

## Usage Instructions

### For Human Orchestrator (You):

1. **After completing any major step**, create a new conversation
2. Copy the verification template above
3. Customize for your specific step
4. Paste into the new conversation with instruction:

   ```
   "You are now acting as an independent VERIFICATION AGENT.
   Your role is to verify the work done in the previous step.
   DO NOT implement anything. Only verify and report findings.

   Follow the verification checklist below:"

   [Paste customized template]
   ```

5. Agent will:
   - Run all checks
   - Create verification report
   - Recommend approve/conditional/reject

6. Based on report:
   - **Approve**: Mark step [x] complete, proceed
   - **Conditional**: Note issues, proceed with follow-ups
   - **Reject**: Return to implementation agent

### For Agent:

When you see "Verification Agent" in your instructions:

1. **Your role is VERIFICATION ONLY** - Do not implement, only verify
2. Run all automated checks listed
3. Perform manual code review
4. Document findings objectively
5. Make clear recommendation: Approve / Conditional / Reject
6. Create verification report at {@artifacts_path}/
7. Update plan.md with findings

**Key Principle**: Be strict. No shortcuts. Find the root cause of any issues.

---

## Advanced: Multi-Agent Review

For critical features, use 3 independent agents:

```markdown
### [x] Step: Feature X - Implementation
Output: Code changes

### [ ] Step: Feature X - Security Review
Agent Focus: Security vulnerabilities only
Output: {@artifacts_path}/feature-x-security-review.md

### [ ] Step: Feature X - Performance Review
Agent Focus: Performance benchmarks only
Output: {@artifacts_path}/feature-x-performance-review.md

### [ ] Step: Feature X - Quality Review
Agent Focus: Code quality only
Output: {@artifacts_path}/feature-x-quality-review.md

### [ ] Step: Feature X - Approval
Inputs: All 3 reviews above
Output: {@artifacts_path}/feature-x-final-approval.md
```

Each agent reviews in parallel, then approval agent synthesizes findings.

---

## Checklist: Before Starting Verification

- [ ] Implementation step is marked [x] complete
- [ ] Implementation report exists at {@artifacts_path}/
- [ ] You understand what was supposed to be built (read spec/requirements)
- [ ] You have fresh context (new conversation preferred)
- [ ] You are NOT the same agent that did implementation (bias risk)
- [ ] You have access to run commands (npm test, etc.)
- [ ] You have the verification template ready

---

## Red Flags to Watch For

During verification, these are automatic ❌ REJECT triggers:

- **Security**: SQL injection, XSS, command injection, hardcoded secrets
- **Tests**: <90% coverage, tests not testing correctly, tests passing but feature broken
- **Performance**: Benchmarks not met, memory leaks, blocking main thread
- **Quality**: Massive functions (>100 lines), high cyclomatic complexity (>10), duplicated code
- **Types**: Liberal use of `any`, missing error handling, no input validation

---

## Summary: The Verification Pattern

```
Implementation Agent → Verification Agent → Approval/Rejection

├─ If Approved: Proceed to next step
├─ If Conditional: Proceed with follow-up tasks
└─ If Rejected: Return to implementation with corrections
```

**Key Success Factors**:
1. ✅ Use separate conversations for implementation vs verification (reduce bias)
2. ✅ Follow template strictly (don't skip checks)
3. ✅ Document everything (evidence-based decisions)
4. ✅ Be strict (better to catch issues early)
5. ✅ No shortcuts, no excuses (per .claude/CLAUDE.md)

**This template ensures**:
- Every major change is independently reviewed
- Quality standards are enforced
- Issues are caught before they compound
- Clear audit trail exists
- No lazy work passes through
