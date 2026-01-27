# Quick Start: Multi-Agent Verification

**No shortcuts. No excuses. Agents verify each other's work.**

---

## The Pattern (3 Steps)

```
1. Implementation Agent  →  Builds feature, saves report
2. Verification Agent    →  Reviews work, runs tests, approves/rejects
3. Next Agent            →  Proceeds only if approved
```

---

## How to Use

### Step 1: Add Verification to plan.md

After any implementation step, add a verification step:

```markdown
### [ ] Step: Build Feature X
<!-- Implementation agent work -->
Output: {@artifacts_path}/feature-x-implementation.md

### [ ] Step: Verify Feature X
<!-- Verification agent work -->

**You are a VERIFICATION AGENT. Do NOT implement. Only verify.**

Run these checks:
```bash
npm run type-check
npm run lint
npm test -- --coverage
npm run build
```

Check:
- [ ] All tests passing
- [ ] Coverage >90%
- [ ] No security issues
- [ ] Performance targets met

Output: {@artifacts_path}/feature-x-verification.md

Recommend: ✅ Approve / ⚠️ Conditional / ❌ Reject
```

### Step 2: Execute Implementation

Start conversation with Implementation Agent:

```
"Please complete the step 'Build Feature X' in plan.md"
```

Agent builds, saves report, updates plan.md with [x].

### Step 3: Execute Verification

Start NEW conversation with Verification Agent:

```
"You are now acting as a VERIFICATION AGENT.
Please complete the step 'Verify Feature X' in plan.md.

DO NOT implement anything. Only verify the previous agent's work.
Be strict. No shortcuts."
```

Agent verifies, creates report, recommends approve/reject.

### Step 4: Decision

Based on verification report:
- **✅ Approved**: Mark step complete, proceed to next
- **⚠️ Conditional**: Note issues, proceed with follow-ups
- **❌ Rejected**: Return to implementation, fix issues

---

## Example: Verifying Phase 0

### Add to plan.md

```markdown
### [x] Step: Phase 0 - Row Calculation Engine
<!-- chat-id: f2299026-2bbc-4b11-80ce-a7f755ea1db4 -->
Status: 78% complete (7/9 tasks done)

### [ ] Step: Phase 0 - Verification
<!-- chat-id: [new conversation] -->

**VERIFICATION AGENT - Independent Review of Phase 0**

Your role: VERIFY ONLY. Do not implement.

Files to review:
- /src/utils/sunCalculator.ts (476 → 759 lines)
- /public/workers/sunCalculations.worker.js (65 → 288 lines)
- /src/hooks/useSunCalculations.ts (141 → 172 lines)
- /app/api/stadium/[id]/rows/shade/route.ts (NEW - 184 lines)

Automated checks:
```bash
npm run type-check    # Must pass
npm run lint          # Must pass
npm test              # Must pass
npm run build         # Must pass
npm test -- --coverage  # Must be >90%
```

Manual checks:
- [ ] No code duplication
- [ ] Error handling present
- [ ] No security vulnerabilities
- [ ] Performance <100ms for 2,460 rows
- [ ] API route validates inputs
- [ ] Worker offloads heavy calculations

Create: {@artifacts_path}/phase-0-verification-report.md

Recommendation: ✅/⚠️/❌
```

### Execute Verification

New conversation:

```
"You are a VERIFICATION AGENT.

Please complete the step 'Phase 0 - Verification' in plan.md.

Your job is to independently verify Phase 0 implementation.
DO NOT implement anything. Only verify and report.
Be strict. Find issues before they become problems.
No shortcuts."
```

### Agent Response

Agent will:
1. Read plan.md
2. Understand Phase 0 scope
3. Run all automated checks
4. Review code manually
5. Check security/performance
6. Create verification report
7. Recommend approve/conditional/reject

### Sample Verification Report

```markdown
# Phase 0 Verification Report

Date: 2026-01-27
Verifier: chat-id-xyz

## Status: ✅ PASS

## Automated Checks
- TypeScript: ✅ 0 errors
- ESLint: ✅ 0 warnings
- Tests: ✅ 521/521 passing, 94% coverage
- Build: ✅ Success in 39.5s

## Manual Review
- Code quality: ✅ Clean, well-structured
- Security: ✅ Input validation present, no vulnerabilities
- Performance: ✅ 24ms for 2,460 rows (76% under target)
- Documentation: ⚠️ JSDoc missing on 3 functions

## Issues Found
1. Missing JSDoc on calculateRowShadow() - Severity: Low
   - Impact: Developer experience
   - Recommendation: Add JSDoc in follow-up task

## Recommendation
⚠️ CONDITIONAL APPROVAL
- Can proceed to Phase 1
- Create follow-up task for JSDoc

## Evidence
[Test output pasted here]
```

---

## Templates

### Quick Verification Template

Copy this into plan.md after any step:

```markdown
### [ ] Step: [Previous Step] - Verification

**VERIFICATION AGENT**

Verify: [what was built]

Checks:
```bash
npm run type-check
npm run lint
npm test -- --coverage
npm run build
```

Review:
- [ ] Quality
- [ ] Security
- [ ] Performance
- [ ] Tests >90%

Output: {@artifacts_path}/[step]-verification-report.md
Decision: ✅/⚠️/❌
```

### Quick Verification Prompt

Start new conversation with this:

```
"You are a VERIFICATION AGENT.

Complete step '[Step Name] - Verification' in plan.md.

DO NOT implement. Only verify previous work.
Run all checks. Be strict. Report findings.
No shortcuts."
```

---

## Key Files

| File | Purpose |
|------|---------|
| `plan.md` | Workflow definition (add verification steps here) |
| `.claude/CLAUDE.md` | Agent behavior rules (already updated) |
| `.zenflow/AGENT-VERIFICATION-TEMPLATE.md` | Detailed templates |
| `.zenflow/MULTI-AGENT-VERIFICATION-EXAMPLE.md` | Complete examples |

---

## Common Patterns

### Pattern 1: Simple Verification

```markdown
Implementation → Verification → Approve/Reject
```

### Pattern 2: Multi-Review

```markdown
Implementation → Security Review → Performance Review → Quality Review → Approval
```

### Pattern 3: Iterative

```markdown
Implementation → Verification → Rejected → Corrections → Re-verification → Approved
```

---

## Checklist: Before Verifying

- [ ] Implementation step marked [x] complete
- [ ] Implementation report exists
- [ ] Using NEW conversation (not same agent)
- [ ] Have verification template ready
- [ ] Can run automated tests

---

## Red Flags (Auto-Reject)

These trigger immediate ❌ REJECT:

- Security vulnerabilities (SQL injection, XSS, secrets)
- Test coverage <90%
- Tests fake (passing but feature broken)
- Performance targets not met
- TypeScript `any` used liberally
- No error handling
- No input validation

---

## Decision Guide

| Scenario | Recommendation |
|----------|----------------|
| All checks ✅, zero issues | ✅ APPROVE |
| Minor issues, can track as follow-ups | ⚠️ CONDITIONAL |
| Any red flag | ❌ REJECT |
| Unsure | ❌ REJECT (be strict) |

---

## Tips for Success

1. **Always use separate conversations** for implementation vs verification (reduces bias)
2. **Follow template strictly** (don't skip checks)
3. **Be strict** (better to catch early)
4. **Document everything** (evidence-based decisions)
5. **No shortcuts** (per .claude/CLAUDE.md)

---

## Summary

**Setup**: Add verification steps to plan.md
**Execute**: New conversation per agent (implementation, then verification)
**Verify**: Run all checks, be strict, report findings
**Decide**: Approve/conditional/reject based on evidence
**Result**: Higher quality, fewer bugs, clear audit trail

**No shortcuts. No excuses. Agents verify each other.**
