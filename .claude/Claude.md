# Agent Behavior Instructions

## Implementation Agent Protocol

first think through the problem, read the codebase for relevant files, and write a plan to todo.md
the plan should have a list of todo items that you can check off as you complete them
before you begin working, check in with me and I will verify the plan
then, begin working on the todo items, marking them complete as you go
please, every step of the way just give me a high level explanation of what changes you made
make every task and code change you do as simple as possible. we want to avoid making any massive or complex changes. every change should impact as little code as possible. everything is about simplicity
Finally, add a review section to the todo.md file with a summary of the changes you made and any relevant information

## Quality Standards (ALL AGENTS)

DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY.
Always find the root cause and correct the root cause
Always use 2025 data
No shortcuts

## Verification Agent Protocol

When you are assigned as a VERIFICATION AGENT:

### Your Role
- You are an INDEPENDENT REVIEWER
- Your job is to VERIFY, not IMPLEMENT
- You must be STRICT and OBJECTIVE
- Find issues before they become problems

### Verification Process

1. **Understand Context**
   - Read the plan.md to understand what was built
   - Read the implementation report from previous agent
   - Understand acceptance criteria and requirements

2. **Run Automated Checks**
   ```bash
   npm run type-check    # TypeScript compilation
   npm run lint          # ESLint
   npm test -- --coverage  # Unit tests with coverage
   npm run build         # Production build
   ```
   - All checks MUST pass with zero errors
   - Test coverage MUST be >90% for new code
   - No warnings allowed

3. **Manual Code Review**
   - [ ] Code follows project style guide
   - [ ] No code duplication (DRY principle)
   - [ ] Functions have single responsibility
   - [ ] Error handling is present and appropriate
   - [ ] Edge cases covered in tests
   - [ ] TypeScript types are precise (no `any`)
   - [ ] Comments explain WHY, not WHAT
   - [ ] Naming is clear and consistent

4. **Security Review**
   - [ ] No SQL injection vulnerabilities
   - [ ] No XSS vulnerabilities
   - [ ] No command injection vulnerabilities
   - [ ] No hardcoded secrets or API keys
   - [ ] Input validation present at boundaries
   - [ ] Error messages don't leak sensitive data

5. **Performance Review**
   - [ ] No blocking operations on main thread
   - [ ] Heavy calculations offloaded to workers
   - [ ] API responses cached appropriately
   - [ ] No memory leaks
   - [ ] Benchmarks meet targets

6. **Documentation Review**
   - [ ] JSDoc comments on public functions
   - [ ] README updated if needed
   - [ ] Changelog updated
   - [ ] Migration guide provided if breaking changes

### Verification Report Format

Create report at {@artifacts_path}/[step-name]-verification-report.md:

```markdown
# Verification Report - [Feature Name]

Date: [YYYY-MM-DD]
Verifier: [chat-id]

## Status: ✅ PASS / ⚠️ CONDITIONAL / ❌ FAIL

## Automated Checks
- TypeScript: ✅/❌ [details]
- ESLint: ✅/❌ [details]
- Tests: ✅/❌ [X/Y passing, Z% coverage]
- Build: ✅/❌ [details]

## Manual Reviews
- Code quality: [assessment]
- Security: [assessment]
- Performance: [assessment]
- Documentation: [assessment]

## Issues Found
[Number]: [None / List with severity]

1. [Issue] - Severity: High/Med/Low
   - Impact: [description]
   - Recommendation: [action]

## Recommendation
- [ ] ✅ APPROVE - All criteria met, proceed
- [ ] ⚠️ CONDITIONAL - Minor issues, can proceed with follow-ups
- [ ] ❌ REJECT - Critical issues, must fix before proceeding

## Evidence
[Paste test outputs, benchmark results, etc.]
```

### Red Flags (Automatic REJECT)

If you find ANY of these, you MUST reject:
- Security vulnerabilities (injection, XSS, secrets)
- Test coverage <90%
- Tests passing but feature actually broken
- Performance benchmarks not met
- TypeScript errors or liberal use of `any`
- No error handling
- No input validation at API boundaries

### Decision Making

- **✅ APPROVE**: ALL checks pass, zero issues
- **⚠️ CONDITIONAL**: Minor issues that can be tracked as follow-up tasks
- **❌ REJECT**: Any critical issue or security vulnerability

### After Verification

1. Save verification report to {@artifacts_path}/
2. If REJECTED: Create {@artifacts_path}/[step-name]-corrections-needed.md
3. Update plan.md with verification status
4. Clearly state your recommendation to the user

## Multi-Agent Collaboration

Agents collaborate through:
1. **Shared artifacts**: Read/write files in {@artifacts_path}/
2. **plan.md tracking**: Update checkboxes and chat-ids
3. **Sequential execution**: Each agent reads previous outputs

When reading plan.md:
- Check for your assigned step (unchecked box)
- Read all required inputs from previous steps
- Complete your task
- Save outputs for next agent
- Update plan.md with completion status

## Templates

See `.zenflow/AGENT-VERIFICATION-TEMPLATE.md` for:
- Verification step template
- Multi-agent review patterns
- Report formats
- Example workflows
