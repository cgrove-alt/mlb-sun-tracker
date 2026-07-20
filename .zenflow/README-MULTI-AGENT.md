# Multi-Agent Verification System - Complete Guide

**No shortcuts. No excuses. Agents work together and verify each other's work.**

---

## 📚 Documentation Index

| Document | Purpose | Start Here |
|----------|---------|------------|
| **QUICK-START-MULTI-AGENT.md** | Quick reference, copy-paste templates | ⭐ START HERE |
| **AGENT-WORKFLOW-DIAGRAM.md** | Visual diagrams and flowcharts | 👁️ Visual learners |
| **AGENT-VERIFICATION-TEMPLATE.md** | Detailed templates and examples | 📋 Need templates |
| **MULTI-AGENT-VERIFICATION-EXAMPLE.md** | Full example workflow (Implementation → Review → Verify → Approve) | 🔍 See full example |

---

## 🚀 Quick Start (3 Minutes)

### 1. The Pattern

```
Implementation Agent  →  Verification Agent  →  Decision
      (Conv 1)              (Conv 2)           (Approve/Reject)
```

### 2. Add to plan.md

```markdown
### [ ] Step: Build Feature
Output: {@artifacts_path}/feature-implementation.md

### [ ] Step: Verify Feature
Verification checks, output verification report
```

### 3. Execute

**Conversation 1**: "Build Feature"
**Conversation 2**: "Verify Feature (you are verification agent)"

### 4. Decision

Read verification report → Approve/Conditional/Reject

**Done!** See `QUICK-START-MULTI-AGENT.md` for full details.

---

## 📖 How It Works

### The Core Concept

Zenflow agents collaborate through **shared files** and **workflow orchestration**:

1. **plan.md** defines the workflow (steps, order, requirements)
2. **Agents execute steps** in separate conversations (chat-ids)
3. **Agents communicate** by reading/writing artifact files
4. **Progress tracked** with checkboxes [x] and status updates
5. **Verification agents** review previous agents' work independently

### Why This Works

- ✅ **Traceability**: Each step has a chat-id (who did what)
- ✅ **Quality**: Independent verification catches issues early
- ✅ **Auditability**: All artifacts saved (complete paper trail)
- ✅ **Flexibility**: Can retry/skip steps as needed
- ✅ **Objectivity**: Separate conversations = no bias

### Key Files

```
.claude/CLAUDE.md           → Agent behavior rules
.zenflow/tasks/{id}/plan.md → Workflow orchestration
.zenflow/tasks/{id}/*.md    → Inter-agent artifacts
```

---

## 🔄 Workflow Example

### Phase 0: Implementation

```
User: "Build row calculations"
↓
Implementation Agent (Conversation 1):
- Reads plan.md
- Builds feature
- Saves: implementation-report.md
- Updates: plan.md [x] Step complete
```

### Phase 1: Verification

```
User: "Verify row calculations (you are verification agent)"
↓
Verification Agent (Conversation 2):
- Reads plan.md
- Reads implementation-report.md
- Runs automated checks (tests, lint, build)
- Manual code review (security, quality, performance)
- Saves: verification-report.md
- Recommends: ✅ Approve / ⚠️ Conditional / ❌ Reject
```

### Phase 2: Decision

```
If ✅ APPROVED:
  → Mark step [x] complete
  → Proceed to next step

If ⚠️ CONDITIONAL:
  → Note minor issues
  → Create follow-up tasks
  → Proceed with caution

If ❌ REJECTED:
  → Return to implementation
  → Fix critical issues
  → Re-verify
```

---

## 📋 Templates

### Quick Verification Step

Add this to plan.md after any implementation:

```markdown
### [ ] Step: [Feature] - Verification

**VERIFICATION AGENT**: Verify [feature name]

Checks:
```bash
npm run type-check && npm run lint && npm test && npm run build
```

Review:
- [ ] Quality, Security, Performance, Tests >90%

Output: {@artifacts_path}/[feature]-verification.md
Decision: ✅/⚠️/❌
```

### Quick Verification Prompt

Start new conversation with:

```
"You are a VERIFICATION AGENT.
Complete step '[Feature] - Verification' in plan.md.
DO NOT implement. Only verify.
Run all checks. Be strict. Report findings."
```

---

## ✅ Verification Checklist

Verification agents MUST check:

### Automated
- [ ] TypeScript: `npm run type-check` (0 errors)
- [ ] Linting: `npm run lint` (0 warnings)
- [ ] Tests: `npm test` (all passing, >90% coverage)
- [ ] Build: `npm run build` (success)

### Manual
- [ ] Code quality (no duplication, single responsibility)
- [ ] Security (no injection, XSS, secrets)
- [ ] Performance (benchmarks met)
- [ ] Documentation (JSDoc, README updated)

### Red Flags (Auto-Reject)
- ❌ Security vulnerabilities
- ❌ Test coverage <90%
- ❌ Performance targets not met
- ❌ TypeScript errors or liberal `any`

---

## 🎯 Configuration Files

### 1. `.claude/CLAUDE.md` (Agent Behavior)

**Already Updated!** Contains:
- Implementation agent protocol
- Verification agent protocol
- Quality standards
- Red flags list
- Report formats

### 2. `plan.md` (Workflow Definition)

Add verification steps after implementation:

```markdown
### [x] Step: Implementation
<!-- chat-id: abc123 -->

### [ ] Step: Verification
<!-- chat-id: def456 -->
```

### 3. Artifact Files (Inter-Agent Communication)

```
.zenflow/tasks/{task-id}/
├── phase-0-implementation.md    ← Agent 1 writes
├── phase-0-verification.md      ← Agent 2 reads, then writes
└── phase-0-corrections.md       ← If issues found
```

---

## 💡 Pro Tips

### 1. Always Use Separate Conversations

```
❌ BAD: Same conversation
  Agent builds, then Agent verifies own work (bias)

✅ GOOD: Separate conversations
  Agent A builds (Conv 1), Agent B verifies (Conv 2)
```

### 2. Be Strict

```
❌ "Looks okay, approve"
✅ "All checks passing, no security issues, benchmarks met, approve"
```

### 3. Document Everything

```
❌ "Approved"
✅ "Approved: All tests passing (521/521), coverage 94%,
    performance 24ms (76% under target), no security issues.
    Evidence: [paste test output]"
```

### 4. Use Templates

Don't reinvent the wheel. Use:
- `AGENT-VERIFICATION-TEMPLATE.md` for detailed templates
- `QUICK-START-MULTI-AGENT.md` for quick copy-paste

### 5. Trust the Process

```
It may seem like extra work, but:
- Bugs caught early = cheaper to fix
- Independent review = better quality
- Clear audit trail = easier debugging
```

---

## 🎓 Learn More

| Topic | Document | Lines |
|-------|----------|-------|
| Quick reference | QUICK-START-MULTI-AGENT.md | 200 |
| Visual diagrams | AGENT-WORKFLOW-DIAGRAM.md | 400 |
| Detailed templates | AGENT-VERIFICATION-TEMPLATE.md | 600 |
| Full example | MULTI-AGENT-VERIFICATION-EXAMPLE.md | 800 |

**Total documentation: 2000+ lines covering every scenario.**

---

## 🛠️ Implementation Checklist

Setting up multi-agent verification:

- [x] Read this README
- [ ] Read QUICK-START-MULTI-AGENT.md (5 min)
- [ ] Update plan.md with verification steps (10 min)
- [ ] Test with one feature (30 min)
  - [ ] Implementation conversation
  - [ ] Verification conversation
  - [ ] Review verification report
  - [ ] Make decision
- [ ] Roll out to all features (ongoing)

---

## 📊 Success Metrics

Track these to measure effectiveness:

| Metric | Target | Why |
|--------|--------|-----|
| Bugs caught in verification | >80% | Catch before deployment |
| Test coverage | >90% | Comprehensive testing |
| Time to fix issues | <1 day | Early detection |
| Rejected implementations | 10-20% | Verification is working |
| Re-verification rate | <30% | Quality improving |

---

## 🆘 Troubleshooting

### "Agent keeps implementing instead of verifying"

**Fix**: Start prompt with:
```
"You are a VERIFICATION AGENT. DO NOT IMPLEMENT. Only verify."
```

### "Verification is too slow"

**Fix**: Run checks in parallel:
```bash
npm run type-check & npm run lint & npm test & wait
```

### "Agent approves everything"

**Fix**:
1. Check `.claude/CLAUDE.md` has red flags list
2. Use stricter prompt: "Be strict. No shortcuts."
3. Provide checklist in plan.md

### "Not sure if verification passed"

**Fix**: Require explicit decision in verification report:
```markdown
## Decision: [Must be one of: ✅ APPROVE / ⚠️ CONDITIONAL / ❌ REJECT]
```

---

## 🎯 Real-World Example

See your current `plan.md` for live examples:

```markdown
### [x] Step: Phase 0 - Row Calculation Engine
<!-- chat-id: f2299026-2bbc-4b11-80ce-a7f755ea1db4 -->
Status: 78% complete
**Verification**: ✅ Unit tests passing (24/24)
```

To add independent verification:

```markdown
### [ ] Step: Phase 0 - Independent Verification
<!-- chat-id: [new conversation] -->
[See AGENT-VERIFICATION-TEMPLATE.md for full template]
```

---

## 📝 Summary

### What You Get

- ✅ Higher code quality (independent review)
- ✅ Fewer bugs (caught early)
- ✅ Clear audit trail (who did what, when)
- ✅ Better documentation (every step recorded)
- ✅ Peace of mind (verified by multiple agents)

### How It Works

1. Add verification steps to plan.md
2. Execute implementation in one conversation
3. Execute verification in separate conversation
4. Read verification report
5. Make decision: approve/conditional/reject

### Where to Start

**→ Open `QUICK-START-MULTI-AGENT.md` now**

---

## 🔗 Quick Links

- [Quick Start](QUICK-START-MULTI-AGENT.md) - Start here
- [Visual Diagrams](AGENT-WORKFLOW-DIAGRAM.md) - See the flow
- [Templates](AGENT-VERIFICATION-TEMPLATE.md) - Copy-paste ready
- [Full Example](MULTI-AGENT-VERIFICATION-EXAMPLE.md) - Complete workflow

---

## 📞 Need Help?

1. **Start with**: QUICK-START-MULTI-AGENT.md
2. **If confused**: AGENT-WORKFLOW-DIAGRAM.md (visual)
3. **Need template**: AGENT-VERIFICATION-TEMPLATE.md
4. **Want example**: MULTI-AGENT-VERIFICATION-EXAMPLE.md

**All templates are ready to use. Copy, paste, customize.**

---

**No shortcuts. No excuses. Agents work together and verify each other's work.**

*System configured and ready to use.*
