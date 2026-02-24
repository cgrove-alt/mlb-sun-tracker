# Multi-Agent Verification Example

## Workflow Pattern: Implementation → Review → Verification → Approval

---

### [ ] Step: Implementation Agent
<!-- chat-id: to-be-assigned -->
<!-- Assigned role: Build the feature -->

**Task**: Implement row-level shadow calculations

**Deliverables**:
1. Code changes to `/src/utils/sunCalculator.ts`
2. Unit tests in `__tests__/`
3. Implementation report

**Acceptance Criteria**:
- [ ] calculateRowShadows() function implemented
- [ ] Unit tests with >90% coverage
- [ ] TypeScript compiles with zero errors
- [ ] Performance: <100ms for 2,460 rows

**Output**: {@artifacts_path}/implementation-agent-report.md

**Verification Checklist for Next Agent**:
```markdown
- File changes documented
- Line counts recorded (before → after)
- Test results included
- Performance benchmarks provided
```

---

### [ ] Step: Code Review Agent
<!-- chat-id: to-be-assigned -->
<!-- Assigned role: Review implementation quality -->

**Task**: Review Implementation Agent's work

**Inputs**:
1. Read {@artifacts_path}/implementation-agent-report.md
2. Review code at `/src/utils/sunCalculator.ts`
3. Review test files

**Review Checklist**:
- [ ] Code follows project style guide
- [ ] No code duplication (DRY principle)
- [ ] Functions have clear single responsibilities
- [ ] Error handling present and appropriate
- [ ] Edge cases covered in tests
- [ ] No security vulnerabilities (SQL injection, XSS, etc.)
- [ ] Performance optimizations applied
- [ ] Comments explain WHY, not WHAT
- [ ] TypeScript types are precise (no `any`)
- [ ] Naming is clear and consistent

**Security Review**:
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] No command injection vulnerabilities
- [ ] Safe parsing of user data

**Output**: {@artifacts_path}/code-review-report.md

**Format**:
```markdown
# Code Review Report - [Feature Name]

## Summary
- Files reviewed: X
- Issues found: Y
- Severity: Low/Medium/High

## ✅ Approved Items
1. [Item] - [Reason]

## ⚠️ Needs Attention
1. [Item] - [Issue] - [Recommendation]

## ❌ Must Fix
1. [Item] - [Critical issue] - [Required action]

## Recommendation
- [ ] Approve - proceed to verification
- [ ] Reject - corrections needed
```

---

### [ ] Step: Verification Agent
<!-- chat-id: to-be-assigned -->
<!-- Assigned role: Run all automated checks -->

**Task**: Verify Implementation + Code Review findings

**Inputs**:
1. Read {@artifacts_path}/implementation-agent-report.md
2. Read {@artifacts_path}/code-review-report.md
3. Access to codebase

**Automated Verification Steps**:

```bash
# 1. TypeScript Compilation
npm run type-check
# Expected: 0 errors

# 2. Linting
npm run lint
# Expected: 0 errors, 0 warnings

# 3. Unit Tests
npm test -- --coverage
# Expected: All passing, >90% coverage

# 4. Build Process
npm run build
# Expected: Success, no errors

# 5. Performance Benchmark
npm run benchmark:row-calculations
# Expected: <100ms for 2,460 rows

# 6. Integration Tests (if applicable)
npm run test:integration
# Expected: All passing
```

**Manual Verification Steps**:
- [ ] All code review issues addressed
- [ ] Acceptance criteria met
- [ ] Documentation updated
- [ ] No regressions introduced

**Output**: {@artifacts_path}/verification-report.md

**Format**:
```markdown
# Verification Report - [Feature Name]

## Automated Checks
- ✅/❌ TypeScript: [result]
- ✅/❌ Linting: [result]
- ✅/❌ Unit Tests: [X/Y passing, Z% coverage]
- ✅/❌ Build: [result]
- ✅/❌ Performance: [Xms, Y% under target]
- ✅/❌ Integration: [result]

## Code Review Status
- Issues found: X
- Issues resolved: Y
- Outstanding: Z

## Acceptance Criteria
- [x] Criterion 1: [evidence]
- [x] Criterion 2: [evidence]

## Decision
- [ ] ✅ APPROVED - Ready for approval agent
- [ ] ⚠️ CONDITIONAL - Minor fixes needed
- [ ] ❌ REJECTED - Major issues, return to implementation

## Evidence
[Attach test output, screenshots, logs]
```

---

### [ ] Step: Approval Agent
<!-- chat-id: to-be-assigned -->
<!-- Assigned role: Final sign-off -->

**Task**: Final approval based on all previous reports

**Inputs**:
1. Read {@artifacts_path}/implementation-agent-report.md
2. Read {@artifacts_path}/code-review-report.md
3. Read {@artifacts_path}/verification-report.md

**Approval Checklist**:
- [ ] Implementation complete per specification
- [ ] Code review approved or issues resolved
- [ ] All automated checks passing
- [ ] Performance benchmarks met
- [ ] No security vulnerabilities
- [ ] Documentation complete
- [ ] Ready for production

**Decision Matrix**:

| Scenario | Action |
|----------|--------|
| All checks ✅ | Approve, mark step [x] complete |
| Minor issues ⚠️ | Conditional approval, create follow-up tasks |
| Critical issues ❌ | Reject, return to implementation agent |

**Output**: {@artifacts_path}/final-approval.md

**Format**:
```markdown
# Final Approval - [Feature Name]

## Approval Status: ✅ APPROVED / ⚠️ CONDITIONAL / ❌ REJECTED

## Summary
- Implementation: [Pass/Fail]
- Code Review: [Pass/Fail]
- Verification: [Pass/Fail]
- Overall: [Approved/Rejected]

## Sign-Off
- Date: [YYYY-MM-DD]
- Agent: Approval Agent
- chat-id: [xxx]

## Next Steps
[If approved]: Proceed to deployment
[If conditional]: Address items in follow-up tasks
[If rejected]: Return to implementation with corrections
```

---

## How to Execute This Workflow

### **Method 1: Human Orchestration (Current Zenflow Pattern)**

1. User starts conversation with Implementation Agent:
   - "Please complete Step: Implementation Agent in plan.md"
   - Agent reads plan, completes task, saves report
   - Agent updates plan.md with [x] and chat-id

2. User starts NEW conversation with Code Review Agent:
   - "Please complete Step: Code Review Agent in plan.md"
   - Agent reads implementation report, reviews code
   - Agent saves code review report
   - Agent updates plan.md with [x] and chat-id

3. User starts NEW conversation with Verification Agent:
   - "Please complete Step: Verification Agent in plan.md"
   - Agent reads all reports, runs tests
   - Agent saves verification report
   - Agent updates plan.md with [x] and chat-id

4. User starts NEW conversation with Approval Agent:
   - "Please complete Step: Approval Agent in plan.md"
   - Agent reads all reports, makes decision
   - Agent saves approval decision
   - Agent updates plan.md with [x] and chat-id

**Advantages**:
- Complete isolation between agents (no interference)
- Each agent has fresh context
- Easy to retry or skip steps
- Human oversight at each stage

**Disadvantages**:
- Requires manual step progression
- Multiple conversations needed

---

### **Method 2: Single Conversation Chain (Faster, Riskier)**

In ONE conversation, execute agents sequentially:

```
User: "Please execute the full verification workflow in plan.md:
1. Act as Implementation Agent
2. Then act as Code Review Agent
3. Then act as Verification Agent
4. Then act as Approval Agent

After each role, save the report and explicitly state 'Moving to next agent role.'"
```

Agent responds:
```
[Implementation Agent]
✅ Implemented feature X
✅ Created report at {@artifacts_path}/implementation-agent-report.md

Moving to next agent role.

[Code Review Agent]
✅ Reviewed code
✅ Found 2 minor issues
✅ Created report at {@artifacts_path}/code-review-report.md

Moving to next agent role.

[Verification Agent]
✅ Ran all tests
✅ All checks passing
✅ Created report at {@artifacts_path}/verification-report.md

Moving to next agent role.

[Approval Agent]
✅ APPROVED - All criteria met
✅ Created report at {@artifacts_path}/final-approval.md
```

**Advantages**:
- Faster execution (one session)
- Continuous workflow

**Disadvantages**:
- Less isolation (context carries over)
- Harder to retry individual steps
- Risk of agent bias (same agent reviewing own work)

---

## Best Practices for Multi-Agent Verification

### **1. Artifact Naming Convention**
```
{@artifacts_path}/
├── {step-name}-report.md          # Main output
├── {step-name}-corrections.md     # If issues found
└── {step-name}-evidence/          # Supporting files
    ├── test-output.txt
    ├── benchmark-results.json
    └── screenshots/
```

### **2. Verification Report Template**
```markdown
# [Agent Name] Report - [Feature]

## Status: ✅/⚠️/❌

## Checks Performed
- [x] Check 1: Result
- [x] Check 2: Result

## Evidence
[Test outputs, logs, screenshots]

## Issues Found
1. [Issue] - Severity: [Low/Med/High]

## Recommendation
- [ ] Approve
- [ ] Conditional (with follow-ups)
- [ ] Reject (requires corrections)

## Next Agent
[If approved]: Proceed to [Next Step]
[If issues]: Return to [Previous Step]
```

### **3. Failure Handling**
```markdown
### [x] Step: Implementation Agent
Status: ❌ FAILED - Corrections needed

### [ ] Step: Corrections Agent
Task: Address issues from verification
Input: {@artifacts_path}/verification-report.md
Output: {@artifacts_path}/corrections-complete.md

### [ ] Step: Re-verification Agent
Task: Re-run verification on corrected code
```

### **4. Parallel Verification (Advanced)**
```markdown
### [ ] Step: Implementation Agent
Output: code changes

    ├─> Step: Security Review Agent
    │   └─> Output: security-report.md
    │
    ├─> Step: Performance Review Agent
    │   └─> Output: performance-report.md
    │
    └─> Step: Code Quality Review Agent
        └─> Output: quality-report.md

### [ ] Step: Aggregation Agent
Inputs: security-report.md, performance-report.md, quality-report.md
Output: combined-review.md
```

---

## Configuration Checklist

To set up multi-agent verification:

- [x] Create `.zenflow/tasks/{task-id}/plan.md` with workflow steps
- [x] Define each agent's role, inputs, outputs, and acceptance criteria
- [x] Update `.claude/CLAUDE.md` with verification protocol
- [ ] Create artifact templates for consistency
- [ ] Define failure/retry procedures
- [ ] Set up chat-id tracking system
- [ ] Document expected execution order

---

## Key Insights from Your Current Setup

Your current `plan.md` already demonstrates this pattern:

```markdown
### [x] Step: Phase 0 - Row Calculation Engine
<!-- chat-id: f2299026-2bbc-4b11-80ce-a7f755ea1db4 -->
Status: 78% complete (7/9 tasks done)

### [x] Step: Phase 1 - Row-Level UI
<!-- chat-id: 6112db13-8bd3-4d16-a19e-7e7870ef34fe -->
Status: COMPLETE (5/5 tasks done) ✅
**Verification**: ✅ Build passes, all integrations wired
```

Each phase is a separate conversation (chat-id), with verification built into each step.

**To enhance verification**, add explicit verification steps:

```markdown
### [x] Step: Phase 0 - Implementation

### [ ] Step: Phase 0 - Verification
Task: Verify Phase 0 implementation
- [ ] All 9 tasks complete
- [ ] Tests passing
- [ ] Performance benchmarks met
Output: {@artifacts_path}/phase-0-verification.md
```

---

## Summary: How Agents Work Together

1. **Communication**: Through shared artifact files (`.md` files in artifacts path)
2. **Orchestration**: Via `plan.md` workflow definition
3. **Tracking**: Using chat-id comments and checkboxes
4. **Verification**: Dedicated verification agent steps that read previous outputs
5. **Execution**: Either human-orchestrated (separate conversations) or sequential (one conversation)

**No direct agent-to-agent communication** - they collaborate through:
- Reading/writing shared files
- Following workflow defined in plan.md
- Human directing which agent runs next

This is elegant because it's:
- ✅ Traceable (chat-ids track who did what)
- ✅ Auditable (all artifacts saved)
- ✅ Debuggable (can inspect each agent's output)
- ✅ Flexible (can retry or skip steps)
