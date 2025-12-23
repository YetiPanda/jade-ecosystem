# Bug Fix: [Brief Description]

## Bug Report

**Issue Number**: Closes #___
**Severity**: <!-- Critical / High / Medium / Low -->
**Environment**: <!-- Production / Staging / Development -->

## Problem Description

### Expected Behavior
<!-- What should happen -->

### Actual Behavior
<!-- What is actually happening -->

### Steps to Reproduce
1.
2.
3.

### Error Messages/Screenshots
<!-- Include any error messages or screenshots -->
```
[Paste error messages here]
```

## Root Cause Analysis

<!-- Explain why the bug occurred -->

### What Went Wrong
<!-- Technical explanation of the root cause -->

### Why It Wasn't Caught
<!-- Why existing tests didn't catch this -->
- [ ] Missing test coverage
- [ ] Edge case not considered
- [ ] Integration issue
- [ ] External dependency issue
- [ ] Race condition
- [ ] Other: ___

## Solution

### Approach Taken
<!-- Explain the fix implemented -->

### Alternatives Considered
<!-- List other approaches considered and why they weren't chosen -->
1.
2.

### Code Changes
<!-- Summary of code changes -->
**Files Modified**:
-
-

**Key Changes**:
-
-

## Testing

### Reproduction Test
- [ ] Created test that reproduces the bug
- [ ] Test fails on main branch
- [ ] Test passes with this fix

### Regression Tests
- [ ] Added regression tests
- [ ] Verified related functionality still works
- [ ] Checked for similar bugs elsewhere

### Manual Testing
- [ ] Tested exact reproduction steps
- [ ] Tested edge cases
- [ ] Tested related features
- [ ] Verified in affected environment

## Impact Assessment

### Affected Users
<!-- Who is impacted by this bug -->
- [ ] All users
- [ ] Specific user segment: ___
- [ ] Specific feature users
- [ ] Admin users only

### Affected Applications
- [ ] Curated Marketplace
- [ ] Aura Spa Dashboard
- [ ] Sanctuary Community
- [ ] Vendor Portal
- [ ] Backend services

### Data Integrity
- [ ] No data corruption
- [ ] Data migration/cleanup required (details below)
- [ ] Data validation added

**Data Cleanup Required**:
<!-- If applicable, describe data cleanup steps -->

## Backward Compatibility

- [ ] Fully backward compatible
- [ ] Breaking changes (requires coordination)
- [ ] Database migration required
- [ ] API version bump required

**If Breaking**: <!-- Describe migration path -->

## Prevention Measures

<!-- How to prevent similar bugs in the future -->

### Tests Added
- [ ] Unit tests for this scenario
- [ ] Integration tests for this scenario
- [ ] E2E tests for this scenario

### Code Improvements
- [ ] Added input validation
- [ ] Added error handling
- [ ] Added logging
- [ ] Added type safety
- [ ] Added documentation

### Process Improvements
- [ ] Added to testing checklist
- [ ] Updated code review guidelines
- [ ] Added to architectural decision records
- [ ] Other: ___

## Monitoring

<!-- How to verify fix in production -->

### Metrics to Watch
- [ ] Error rate for: ___
- [ ] Success rate for: ___
- [ ] Performance metric: ___
- [ ] User-reported issues

### Verification Plan
1. Deploy to staging
2. Verify metrics return to normal
3. Monitor for 24 hours
4. Deploy to production

## Deployment Considerations

### Priority
- [ ] Hotfix (deploy immediately)
- [ ] High priority (deploy next release)
- [ ] Normal priority (include in regular release)

### Deployment Steps
1.
2.
3.

### Rollback Plan
<!-- How to rollback if fix causes issues -->

## Checklist

- [ ] Root cause identified and explained
- [ ] Fix implements minimal changes necessary
- [ ] Regression tests added
- [ ] Related code reviewed for similar issues
- [ ] Documentation updated
- [ ] Error handling improved
- [ ] Logging added for future debugging
- [ ] Code review completed
- [ ] QA approval obtained (if applicable)

## Additional Context

<!-- Any additional information for reviewers -->

---

**For Reviewers**:
- Verify the fix addresses the root cause, not just symptoms
- Check that tests prevent regression
- Validate impact assessment is accurate
