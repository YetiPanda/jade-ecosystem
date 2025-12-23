# HOTFIX: [Critical Issue Description]

## 🚨 Critical Issue

**Severity**: CRITICAL
**Issue Number**: #___
**Production Incident**: <!-- Link to incident report if available -->
**Detected**: <!-- Date/time detected -->
**Impact Start**: <!-- When impact started -->

### Business Impact
<!-- Describe the business impact -->
- [ ] Complete service outage
- [ ] Partial service degradation
- [ ] Data corruption
- [ ] Security vulnerability
- [ ] Revenue impact
- [ ] Customer-facing issue

**Affected Users**: <!-- Number or percentage -->
**Revenue Impact**: <!-- If applicable -->

## Problem Summary

### What's Broken
<!-- Brief, clear description of the critical issue -->

### User Impact
<!-- How are users affected right now -->

### Immediate Symptoms
<!-- What users/systems are experiencing -->
-
-

## Root Cause

<!-- Quick root cause analysis -->

**What Failed**:

**Why It Failed**:

**Why Existing Safeguards Didn't Catch It**:

## The Fix

### Solution Implemented
<!-- Clear description of what this hotfix does -->

### Why This Approach
<!-- Why this fix vs. alternatives -->
- Speed: <!-- Can be deployed immediately -->
- Safety: <!-- Minimal risk of new issues -->
- Scope: <!-- Minimal code changes -->

### Code Changes
**Files Changed**:
-

**Lines Modified**: ~___

### Risk Assessment
- [ ] Low risk - Isolated change
- [ ] Medium risk - Touches critical path
- [ ] High risk - Requires careful monitoring

## Testing Performed

### Pre-Merge Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual reproduction test
- [ ] Staging environment verification
- [ ] Performance impact verified
- [ ] Security review completed (if security issue)

### Production Readiness
- [ ] Tested on production-like data
- [ ] Verified no side effects
- [ ] Confirmed backward compatibility
- [ ] Rollback plan tested

## Deployment Plan

### Pre-Deployment
- [ ] Incident commander notified
- [ ] On-call team alerted
- [ ] Rollback plan confirmed
- [ ] Monitoring dashboards ready
- [ ] Communication plan ready

### Deployment Steps
1. Merge this PR
2. Tag release: `hotfix-v[version]`
3. Deploy to production
4. Monitor metrics for 30 minutes
5. Confirm issue resolved

### Estimated Downtime
<!-- If any -->
- [ ] Zero downtime deployment
- [ ] Estimated downtime: ___ minutes

### Rollback Plan
**If issues arise**:
1. Revert to previous release: `v[previous]`
2. Redeploy via: ___
3. Estimated rollback time: ___ minutes

## Monitoring & Verification

### Success Metrics
<!-- How to verify the fix worked -->
- [ ] Error rate drops to < ___
- [ ] Success rate returns to > ___
- [ ] User reports stop
- [ ] Monitoring alerts clear

### Dashboards to Watch
- [ ] Dashboard: ___
- [ ] Alert: ___
- [ ] Metric: ___

### Verification Timeline
- [ ] Immediate: Errors stop appearing
- [ ] 15 min: Success rate normalizes
- [ ] 1 hour: No new reports
- [ ] 24 hours: Confirmed stable

## Communication

### Internal Notifications
- [ ] Engineering team notified
- [ ] Product team notified
- [ ] Support team notified
- [ ] Leadership notified

### Customer Communication
- [ ] Status page updated
- [ ] Customer email sent
- [ ] In-app notification
- [ ] No customer communication needed

### Post-Deployment Updates
- [ ] Incident marked as resolved
- [ ] Status page updated
- [ ] Post-mortem scheduled

## Post-Hotfix Actions

### Immediate (This Sprint)
- [ ] Add regression tests
- [ ] Update monitoring/alerts
- [ ] Document incident
- [ ] Update runbooks

### Short-term (Next Sprint)
- [ ] Root cause analysis
- [ ] Permanent fix (if this is temporary)
- [ ] Process improvements
- [ ] Architectural review

### Long-term
- [ ] Post-mortem completed
- [ ] Prevention measures implemented
- [ ] Team learnings documented
- [ ] Similar code patterns reviewed

## Technical Debt

<!-- If this hotfix introduces technical debt -->
- [ ] This is a permanent fix
- [ ] This is a temporary workaround

**If Temporary**:
- Follow-up issue created: #___
- Permanent fix planned for: ___
- Technical debt documented in: ___

## Approval & Sign-off

### Required Approvals
- [ ] Code review: @___
- [ ] Technical lead approval: @___
- [ ] Incident commander approval: @___
- [ ] Security review (if security issue): @___

### Deployment Authorization
**Authorized by**: @___
**Authorization time**: ___

## Checklist

- [ ] Root cause identified
- [ ] Fix verified in staging
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Team notifications sent
- [ ] Post-deployment tasks documented
- [ ] This PR follows hotfix branch naming: `hotfix/[issue]`
- [ ] This PR targets `main` branch
- [ ] Post-mortem issue created

## Additional Context

<!-- Any other critical information -->

---

## For Reviewers

**URGENT**: This is a production hotfix. Please review immediately.

**Review Focus**:
- Does this fix the critical issue?
- Are there any obvious risks?
- Is the rollback plan clear?
- Are monitoring steps adequate?

**Approval Guidelines**:
- For critical outages: Single reviewer + incident commander
- For security issues: Security team + technical lead
- For data corruption: Data team + technical lead
