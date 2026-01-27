# Recommended Additions to .claude/CLAUDE.md

Based on your concern about minimizing coding errors, here are specific additions you should make to your `.claude/CLAUDE.md` file:

## Add This Section After "Quality Standards (ALL AGENTS)"

```markdown
## Mandatory Review Process (ALL IMPLEMENTATION AGENTS)

After completing ANY implementation step, you MUST add a Review Section to the report.md file with:

### Review Section Template

\`\`\`markdown
## Review Section

### Quality Standards Applied

✅ **Root Cause Analysis**: [What did you investigate to understand the problem?]
- List all files read
- List all assumptions validated
- List all edge cases considered

✅ **Correctness Verification**: [How did you verify this is correct?]
- What did you check?
- What evidence do you have it works?

✅ **No Shortcuts Taken**: [What shortcuts did you avoid?]
- What easy path did you NOT take?
- What thorough analysis did you do instead?

### Testing & Validation Plan

**Manual Validation Steps**:
1. [Specific test step 1]
2. [Specific test step 2]
3. [Expected result]

**Automated Validation**:
- [ ] Lint passes: \`npm run lint\`
- [ ] Type check passes: \`npm run type-check\`
- [ ] Tests pass: \`npm run test:unit\`

### Known Risks & Mitigations

⚠️ **Risk 1: [Risk Name]**
- **Issue**: [What could go wrong]
- **Evidence**: [Why you think this might happen]
- **Mitigation**: [How you're handling it]
- **Fallback**: [What to do if mitigation fails]

### Security Review

✅ **Security Checklist**:
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No command injection vulnerabilities
- [ ] No hardcoded secrets or API keys
- [ ] Input validation at system boundaries
- [ ] Error messages don't leak sensitive data
- [ ] File operations use safe paths (no ../ traversal)

### Code Quality

✅ **Quality Checklist**:
- [ ] TypeScript: no \`any\` types (or justified)
- [ ] No code duplication (DRY principle)
- [ ] Functions have single responsibility
- [ ] Error handling present and appropriate
- [ ] Edge cases covered in tests
- [ ] Comments explain WHY, not WHAT
- [ ] Naming is clear and consistent

### What Could Go Wrong

1. **[Scenario 1]**: [What happens and how we'll know]
2. **[Scenario 2]**: [What happens and how we'll know]
3. **[Scenario 3]**: [What happens and how we'll know]
\`\`\`

## Red Flags - Automatic Task Rejection

If user review finds ANY of these, task MUST be redone:

🚨 **Critical Issues** (Fix immediately):
- Security vulnerabilities (injection, XSS, secrets exposed)
- No review section in report.md
- Changes made without reading existing code
- Temporary fixes instead of root cause solutions
- No error handling in critical paths
- TypeScript errors or excessive use of `any`

⚠️ **Major Issues** (Fix before proceeding):
- Test coverage <90% for new code
- Tests passing but feature actually broken
- No input validation at API boundaries
- Missing edge case handling
- Code duplication across files
- No documentation for complex logic

## When to Use Verification Agent

Use the verification agent workflow (see .zenflow/AGENT-VERIFICATION-TEMPLATE.md) for:

1. **New Features**: Anything adding new functionality
2. **Refactoring**: Changes to existing code structure
3. **Security-Sensitive**: Authentication, authorization, data validation
4. **Performance**: Optimizations, caching, database queries
5. **Breaking Changes**: API changes, schema changes
6. **Complex Logic**: Algorithms, calculations, state management

## Quick Reference: Error Prevention Layers

1. **Agent Self-Review**: Review section in report.md (MANDATORY)
2. **Automated Checks**: verification_script runs after every turn
3. **Verification Agent**: Independent review for major changes
4. **User Review**: Final check before merge/deploy

Each layer catches different types of errors. Use all layers for critical changes.
```

## How to Update Your CLAUDE.md

1. Open `.claude/CLAUDE.md` in your editor
2. Find the "Quality Standards (ALL AGENTS)" section
3. Add the new "Mandatory Review Process" section after it
4. Add the "Red Flags" section
5. Add the "When to Use Verification Agent" section
6. Add the "Quick Reference" section
7. Save and commit

## Expected Impact

**Before**: Agents make changes without systematic review, bugs slip through

**After**: Every agent must demonstrate:
- Root cause analysis was done
- Testing was planned
- Risks were identified
- Security was considered
- Quality standards were met

**Result**: Catch 90%+ of bugs during implementation instead of in production

## Testing the New Process

After updating CLAUDE.md, test it by:

1. Creating a small task (e.g., "add a new utility function")
2. Agent should automatically add review section to report.md
3. Review section should have all required elements
4. If agent skips review section, remind them it's MANDATORY per CLAUDE.md

## Maintenance

- Review the review template quarterly
- Add new items based on bugs that slip through
- Track metrics: % of tasks with reviews, defect rate
- Continuously improve the checklist

---

**Remember**: The review section is not bureaucracy - it's your agent thinking out loud about quality. It catches errors at the cheapest point (during implementation) instead of the most expensive point (in production).
