# Feature: [Feature Name]

## Feature Specification

**Feature Number**: <!-- e.g., Feature 011, Feature 012 -->
**Spec Document**: <!-- Link to spec.md -->
**Phase/Sprint**: <!-- e.g., Phase A - Sprint A.1 -->

## User Story

**As a** [user type]
**I want** [goal]
**So that** [benefit]

## Acceptance Criteria

<!-- Copy from tasks.md or spec.md -->
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Implementation Details

### Architecture Changes

<!-- Describe any architectural changes or new patterns introduced -->

### Database Changes

<!-- List any database schema changes -->
- [ ] New tables created
- [ ] Migrations written
- [ ] Seed data added
- [ ] No database changes

### GraphQL Changes

<!-- List any GraphQL schema changes -->
- [ ] New queries added
- [ ] New mutations added
- [ ] New types/interfaces added
- [ ] No GraphQL changes

### API Changes

<!-- List any API endpoint changes -->
- [ ] New endpoints added
- [ ] Existing endpoints modified
- [ ] Breaking changes (list below)
- [ ] No API changes

**Breaking Changes**:
<!-- If any, describe the breaking changes and migration path -->

### UI/UX Changes

<!-- Describe visual or interaction changes -->
- [ ] New components added
- [ ] Existing components modified
- [ ] New pages/routes added
- [ ] No UI changes

## Dependencies

<!-- List any dependencies this feature has -->
- [ ] Depends on Feature #___
- [ ] Depends on Package ___
- [ ] Requires external service ___
- [ ] No external dependencies

## Testing Strategy

### Unit Tests
<!-- List key unit tests added -->
-
-

### Integration Tests
<!-- List integration tests added -->
-
-

### E2E Tests
<!-- List E2E scenarios covered -->
-
-

### Manual Testing Checklist
- [ ] Happy path tested
- [ ] Error scenarios tested
- [ ] Edge cases tested
- [ ] Responsive design verified (if UI)
- [ ] Cross-browser tested (if UI)
- [ ] Performance tested

## Feature Flags

<!-- If using feature flags -->
- [ ] Feature flag added: `FEATURE_FLAG_[NAME]`
- [ ] Rollout plan documented
- [ ] Rollback plan documented
- [ ] No feature flags needed

## Documentation

- [ ] Updated relevant README.md files
- [ ] Updated API documentation
- [ ] Updated user-facing documentation
- [ ] Added inline code comments
- [ ] Updated CLAUDE.md (if architectural change)

## Deployment Plan

### Pre-Deployment
- [ ] Database migrations prepared
- [ ] Environment variables documented
- [ ] Feature flags configured
- [ ] Rollback plan documented

### Deployment Order
1.
2.
3.

### Post-Deployment Verification
- [ ] Health checks passing
- [ ] Metrics being collected
- [ ] Error rates normal
- [ ] User acceptance testing

## Performance Considerations

<!-- Describe any performance implications -->
- Query performance:
- Bundle size impact:
- Runtime performance:

## Security Considerations

<!-- Describe any security implications -->
- [ ] Authentication/authorization changes reviewed
- [ ] Input validation implemented
- [ ] OWASP top 10 considerations addressed
- [ ] Secrets management reviewed
- [ ] No security concerns

## Monitoring & Observability

<!-- Describe what metrics/logs are added -->
- Metrics added:
- Logs added:
- Alerts configured:

## Screenshots/Demo

<!-- Add screenshots or demo video of the feature -->

## Rollback Plan

<!-- How to rollback if issues arise -->
1.
2.

## Additional Context

<!-- Any additional context for reviewers -->

---

**Specification Compliance**: This PR implements tasks _____ from `specs/[feature]/tasks.md`

**For Reviewers**:
- Verify all acceptance criteria are met
- Check that implementation matches spec.md
- Validate test coverage meets minimum 80% requirement
