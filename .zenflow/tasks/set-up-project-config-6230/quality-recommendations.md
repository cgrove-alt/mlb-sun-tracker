# Quality Recommendations: Minimizing Coding Errors

## Problem Statement

Without systematic review after every task, bugs accumulate and quality degrades. We need a process that catches errors immediately while maintaining development velocity.

## Root Cause of Coding Errors

1. **Incomplete analysis**: Not reading all relevant files before making decisions
2. **Assumptions over verification**: Guessing instead of checking actual state
3. **Missing edge cases**: Not considering what could go wrong
4. **No validation**: Not testing that changes actually work
5. **Skipped security review**: Not checking for vulnerabilities
6. **Lazy fixes**: Temporary patches instead of root cause solutions

## Solution: Multi-Layer Error Prevention

### Layer 1: Agent Self-Review (MANDATORY)

Every agent must add a **Review Section** to their report.md:

```markdown
## Review Section

### Quality Standards Applied
- [ ] Root cause analysis performed
- [ ] All relevant files read before changes
- [ ] No assumptions - verified actual state
- [ ] No shortcuts taken

### Testing & Validation Plan
[Specific steps to validate this works]

### Known Risks & Mitigations
[What could go wrong and how we handle it]

### Security Review
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No command injection vulnerabilities
- [ ] No hardcoded secrets
- [ ] Input validation at boundaries
- [ ] Error messages don't leak sensitive data

### Code Quality Checklist
- [ ] TypeScript: no `any` types
- [ ] No code duplication
- [ ] Functions have single responsibility
- [ ] Error handling present
- [ ] Edge cases covered
- [ ] Comments explain WHY not WHAT
```

### Layer 2: Automated Verification (BUILT-IN)

The `verification_script` runs automatically after every agent turn:

```json
{
  "verification_script": "npm run lint && npm run type-check && npm run test:unit"
}
```

This catches:
- Linting errors (code style, potential bugs)
- Type errors (TypeScript compilation issues)
- Test failures (broken functionality)

**Speed constraint**: Must complete in <60 seconds to run after every turn.

### Layer 3: Verification Agent (FOR MAJOR CHANGES)

Use `.zenflow/AGENT-VERIFICATION-TEMPLATE.md` workflow for:
- New features
- Refactoring
- Security-sensitive changes
- Performance optimizations
- Breaking changes

The verification agent:
1. Runs all automated checks
2. Performs manual code review
3. Checks security vulnerabilities
4. Validates performance
5. Reviews documentation
6. Creates formal verification report
7. APPROVES/REJECTS with evidence

### Layer 4: Update CLAUDE.md (RECOMMENDED)

Add to your `.claude/CLAUDE.md`:

```markdown
## Quality Standards (ALL AGENTS)

DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY.
Always find the root cause and correct the root cause
No shortcuts

## Mandatory Review Process

After completing ANY implementation:

1. Add Review Section to report.md (use quality-recommendations.md template)
2. Run verification_script and fix all errors
3. Test the changes manually if applicable
4. Consider security implications
5. Document known risks and edge cases

For major changes, request verification agent review before considering task complete.
```

## Implementation Checklist for This Project

### Immediate Actions

- [x] Add review section to current task report
- [x] Validate settings.json configuration is correct
- [x] Document known risks and mitigations
- [ ] Test configuration in a fresh worktree (user should do this)

### Short-term Improvements

- [ ] Update `.claude/CLAUDE.md` with quality standards
- [ ] Add verification agent workflow to common tasks
- [ ] Create pre-commit hook that runs verification_script
- [ ] Set up automatic verification for PRs

### Long-term Process

- [ ] Every task gets review section in report.md
- [ ] Verification agent reviews all major changes
- [ ] Track defect metrics to identify patterns
- [ ] Continuously improve quality checklists

## Example: What This Would Have Caught

**Original Error**: Missing `.claude/settings.local.json` in copy_files

**How review would have caught it**:

1. **Root cause analysis**: Would have checked main repo for gitignored files
2. **Testing plan**: Would have tested if worktree has all needed files
3. **Known risks**: Would have identified "missing config files" as a risk
4. **What could go wrong**: Would have asked "what if Claude settings are missing?"

**Result**: Error caught during self-review instead of in production

## Metrics for Success

Track these to measure quality improvement:

1. **Defect rate**: Bugs found per 100 changes
2. **Review coverage**: % of tasks with review section
3. **Verification pass rate**: % of changes that pass automated checks first try
4. **Rework rate**: % of tasks that need corrections after "complete"
5. **Security issues**: Count of security vulnerabilities found

**Target**: <1% defect rate, 100% review coverage, >95% verification pass rate

## Tools Available

1. **TodoWrite**: Track implementation steps and mark complete
2. **Verification script**: Automated lint/type/test checks
3. **Verification agent**: Independent code reviewer
4. **Plan.md**: Workflow tracking with chat-ids
5. **Report.md**: Implementation documentation + review

## Red Flags That Indicate Lazy Work

🚩 Report says "no issues found" but no evidence provided
🚩 Changes made without reading existing code
🚩 "Should work" without actually testing
🚩 Temporary fixes or workarounds
🚩 Security not considered
🚩 Edge cases not analyzed
🚩 No test coverage for new code
🚩 TypeScript `any` types used liberally
🚩 Copy-paste code duplication
🚩 No error handling

## Summary

**The Rule**: Every task MUST include a review section demonstrating:
- Root cause was found
- No shortcuts were taken
- Testing was planned
- Risks were identified
- Security was considered
- Quality standards were met

**No excuses. No shortcuts. Senior-level quality every time.**
