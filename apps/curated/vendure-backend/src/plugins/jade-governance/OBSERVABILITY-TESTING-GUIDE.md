# Governance Observability Testing Guide

**Sprint G4.1-G4.4 Validation**
**Created**: December 19, 2025
**Status**: Ready for Testing

---

## Overview

This guide validates the governance observability infrastructure built in Sprint G4 tasks 1-4:

- ✅ **G4.1**: Observability architecture design
- ✅ **G4.2**: Audit log entity & service
- ✅ **G4.3**: Event emitter service
- ✅ **G4.4**: Metrics collection service

---

## 1. Pre-Testing Checklist

### 1.1 Database Migration Required

Create and run migration for the new `governance_audit_log` table:

```bash
# Generate migration
pnpm --filter @jade/vendure-backend migration:generate GovernanceAuditLog

# Review migration file
# Location: apps/vendure-backend/src/migrations/

# Run migration
pnpm --filter @jade/vendure-backend migration:run

# Verify table created
psql jade_marketplace -c "\d jade.governance_audit_log"
```

**Expected Schema**:
```sql
Table "jade.governance_audit_log"
     Column        |           Type
-------------------+-------------------------
 id                | uuid
 eventType         | varchar(100)
 entityType        | varchar(50)
 entityId          | uuid
 action            | varchar(50)
 actorId           | uuid
 actorType         | varchar(20)
 before            | jsonb
 after             | jsonb
 metadata          | jsonb
 ipAddress         | varchar(45)
 userAgent         | text
 sessionId         | varchar(255)
 requestId         | varchar(255)
 sequenceNumber    | bigserial
 timestamp         | timestamptz

Indexes:
    "governance_audit_log_pkey" PRIMARY KEY (id)
    "IDX_event_type_timestamp" (eventType, timestamp)
    "IDX_entity_id_timestamp" (entityId, timestamp)
    "IDX_actor_id_timestamp" (actorId, timestamp)
```

### 1.2 Service Registration

Verify services are exported and injectable:

**Check**: [services/index.ts](./services/index.ts)
```typescript
export * from './governance-audit.service';
export * from './governance-event-emitter.service';
export * from './governance-metrics.service';
```

**Check**: Plugin module imports these services for DI

### 1.3 Entity Registration

Verify audit log entity is exported:

**Check**: [entities/index.ts](./entities/index.ts)
```typescript
export * from './governance-audit-log.entity';
```

---

## 2. Unit Testing

### 2.1 Audit Service Tests

Create test file: `apps/vendure-backend/src/plugins/jade-governance/__tests__/governance-audit.service.test.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceAuditService } from '../services/governance-audit.service';
import { GovernanceAuditLog, GovernanceEventType } from '../entities/governance-audit-log.entity';

describe('GovernanceAuditService', () => {
  let service: GovernanceAuditService;
  let repository: Repository<GovernanceAuditLog>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn(),
      getCount: jest.fn(),
    })),
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceAuditService,
        {
          provide: getRepositoryToken(GovernanceAuditLog),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GovernanceAuditService>(GovernanceAuditService);
    repository = module.get<Repository<GovernanceAuditLog>>(
      getRepositoryToken(GovernanceAuditLog)
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logEvent', () => {
    it('should add event to batch queue', async () => {
      const input = {
        eventType: GovernanceEventType.SYSTEM_REGISTERED,
        entityType: 'AI_SYSTEM' as any,
        entityId: 'test-id',
        action: 'CREATE' as any,
      };

      await service.logEvent(input);

      // Batch queue should contain the event
      expect(service['batchQueue'].length).toBeGreaterThan(0);
    });

    it('should flush batch when size exceeds threshold', async () => {
      const saveSpy = jest.spyOn(repository, 'save');

      // Fill batch queue to trigger flush (100 items)
      for (let i = 0; i < 100; i++) {
        await service.logEvent({
          eventType: GovernanceEventType.SYSTEM_UPDATED,
          entityType: 'AI_SYSTEM' as any,
          entityId: `system-${i}`,
          action: 'UPDATE' as any,
        });
      }

      expect(saveSpy).toHaveBeenCalled();
    });
  });

  describe('queryLogs', () => {
    it('should apply eventTypes filter', async () => {
      const qb = mockRepository.createQueryBuilder();

      await service.queryLogs({
        eventTypes: [GovernanceEventType.INCIDENT_CREATED],
      });

      expect(qb.where).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: expect.any(Object),
        })
      );
    });

    it('should apply date range filter', async () => {
      const startDate = new Date('2025-12-01');
      const endDate = new Date('2025-12-19');

      await service.queryLogs({
        startDate,
        endDate,
      });

      const qb = mockRepository.createQueryBuilder();
      expect(qb.andWhere).toHaveBeenCalled();
    });
  });
});
```

**Run Tests**:
```bash
pnpm --filter @jade/vendure-backend test governance-audit.service
```

### 2.2 Event Emitter Tests

Create test file: `apps/vendure-backend/src/plugins/jade-governance/__tests__/governance-event-emitter.service.test.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GovernanceEventEmitterService } from '../services/governance-event-emitter.service';
import { GovernanceAuditService } from '../services/governance-audit.service';
import { GovernanceEventType } from '../entities/governance-audit-log.entity';

describe('GovernanceEventEmitterService', () => {
  let service: GovernanceEventEmitterService;
  let auditService: GovernanceAuditService;
  let eventEmitter: EventEmitter2;

  const mockAuditService = {
    logEvent: jest.fn(),
    logEventSync: jest.fn(),
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceEventEmitterService,
        { provide: GovernanceAuditService, useValue: mockAuditService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<GovernanceEventEmitterService>(GovernanceEventEmitterService);
    auditService = module.get<GovernanceAuditService>(GovernanceAuditService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should emit event and create audit log', async () => {
    await service.emit(GovernanceEventType.SYSTEM_REGISTERED, {
      entityType: 'AI_SYSTEM' as any,
      entityId: 'test-system',
      action: 'CREATE' as any,
    });

    expect(auditService.logEvent).toHaveBeenCalled();
    expect(eventEmitter.emit).toHaveBeenCalledWith(
      GovernanceEventType.SYSTEM_REGISTERED,
      expect.any(Object)
    );
  });

  it('should call registered handlers', async () => {
    const handler = jest.fn();
    service.on(GovernanceEventType.INCIDENT_CREATED, handler);

    await service.emit(GovernanceEventType.INCIDENT_CREATED, {
      entityType: 'INCIDENT' as any,
      entityId: 'incident-1',
      action: 'CREATE' as any,
    });

    expect(handler).toHaveBeenCalled();
  });

  it('should use synchronous logging for critical events', async () => {
    await service.emitCritical(GovernanceEventType.OVERSIGHT_OVERRIDE_PERFORMED, {
      entityType: 'OVERSIGHT_ACTION' as any,
      entityId: 'override-1',
      action: 'OVERRIDE' as any,
    });

    expect(auditService.logEventSync).toHaveBeenCalled();
  });
});
```

**Run Tests**:
```bash
pnpm --filter @jade/vendure-backend test governance-event-emitter.service
```

### 2.3 Metrics Service Tests

Create test file: `apps/vendure-backend/src/plugins/jade-governance/__tests__/governance-metrics.service.test.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GovernanceMetricsService } from '../services/governance-metrics.service';
import { AISystemRegistry } from '../entities/ai-system-registry.entity';
import { AIIncident } from '../entities/ai-incident.entity';
import { AIComplianceState } from '../entities/ai-compliance-state.entity';
import { HumanOversightAction } from '../entities/human-oversight-action.entity';

describe('GovernanceMetricsService', () => {
  let service: GovernanceMetricsService;

  const mockSystemRepository = {
    find: jest.fn(() => Promise.resolve([
      { id: '1', riskCategory: 'HIGH', isActive: true, complianceStates: [] },
      { id: '2', riskCategory: 'LIMITED', isActive: true, complianceStates: [] },
    ])),
    count: jest.fn(() => Promise.resolve(2)),
  };

  const mockIncidentRepository = {
    find: jest.fn(() => Promise.resolve([
      { id: '1', severity: 'CRITICAL', resolvedAt: null, currentStep: 'ASSESS' },
    ])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernanceMetricsService,
        { provide: getRepositoryToken(AISystemRegistry), useValue: mockSystemRepository },
        { provide: getRepositoryToken(AIIncident), useValue: mockIncidentRepository },
        { provide: getRepositoryToken(AIComplianceState), useValue: { find: jest.fn(() => []) } },
        { provide: getRepositoryToken(HumanOversightAction), useValue: { find: jest.fn(() => []), count: jest.fn(() => 0) } },
      ],
    }).compile();

    service = module.get<GovernanceMetricsService>(GovernanceMetricsService);
  });

  it('should return metrics snapshot', async () => {
    const snapshot = await service.getMetricsSnapshot();

    expect(snapshot).toHaveProperty('systemsTotal');
    expect(snapshot).toHaveProperty('incidentsOpen');
    expect(snapshot).toHaveProperty('averageCompliancePercentage');
    expect(snapshot).toHaveProperty('capturedAt');
  });

  it('should cache metrics for TTL period', async () => {
    const snapshot1 = await service.getMetricsSnapshot();
    const snapshot2 = await service.getMetricsSnapshot();

    // Should return same cached instance
    expect(snapshot1.capturedAt).toEqual(snapshot2.capturedAt);
    expect(mockSystemRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should force refresh when requested', async () => {
    await service.getMetricsSnapshot();
    await service.getMetricsSnapshot(true); // force refresh

    expect(mockSystemRepository.find).toHaveBeenCalledTimes(2);
  });

  it('should return executive summary', async () => {
    const summary = await service.getExecutiveSummary();

    expect(summary).toHaveProperty('systemsAtRisk');
    expect(summary).toHaveProperty('criticalIncidentsOpen');
    expect(summary).toHaveProperty('complianceScore');
    expect(summary).toHaveProperty('topRisks');
  });

  it('should return SKA metrics placeholder', async () => {
    const skaMetrics = await service.getSKAAgenticMetrics();

    expect(skaMetrics.isEnabled).toBe(false);
    expect(skaMetrics.appreciatingAssetCount).toBe(0);
  });
});
```

**Run Tests**:
```bash
pnpm --filter @jade/vendure-backend test governance-metrics.service
```

---

## 3. Integration Testing

### 3.1 End-to-End Event Flow

Create integration test: `apps/vendure-backend/src/plugins/jade-governance/__tests__/integration/event-flow.test.ts`

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GovernanceEventEmitterService } from '../../services/governance-event-emitter.service';
import { GovernanceAuditService } from '../../services/governance-audit.service';
import { GovernanceAuditLog, GovernanceEventType } from '../../entities/governance-audit-log.entity';

describe('Event Flow Integration', () => {
  let module: TestingModule;
  let eventEmitter: GovernanceEventEmitterService;
  let auditService: GovernanceAuditService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST || 'localhost',
          port: parseInt(process.env.DATABASE_PORT || '5432'),
          database: process.env.DATABASE_NAME || 'jade_marketplace_test',
          username: process.env.DATABASE_USER || 'jade_user',
          password: process.env.DATABASE_PASSWORD || 'jade_dev_password',
          schema: 'jade',
          entities: [GovernanceAuditLog],
          synchronize: true, // Test DB only
        }),
        TypeOrmModule.forFeature([GovernanceAuditLog]),
        EventEmitterModule.forRoot(),
      ],
      providers: [GovernanceEventEmitterService, GovernanceAuditService],
    }).compile();

    eventEmitter = module.get<GovernanceEventEmitterService>(GovernanceEventEmitterService);
    auditService = module.get<GovernanceAuditService>(GovernanceAuditService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should emit system registered event and create audit log', async () => {
    const systemId = 'test-system-' + Date.now();

    await eventEmitter.emitSystemRegistered(systemId, {
      systemName: 'Test Recommender',
      riskCategory: 'HIGH',
    });

    // Wait for batch flush
    await new Promise(resolve => setTimeout(resolve, 100));
    await auditService.flushBatch();

    // Query audit log
    const logs = await auditService.queryLogs({
      entityId: systemId,
      eventTypes: [GovernanceEventType.SYSTEM_REGISTERED],
    });

    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].entityId).toBe(systemId);
    expect(logs[0].eventType).toBe(GovernanceEventType.SYSTEM_REGISTERED);
  });

  it('should track incident lifecycle', async () => {
    const incidentId = 'test-incident-' + Date.now();

    // Create incident
    await eventEmitter.emitIncidentCreated(incidentId, {
      severity: 'CRITICAL',
      affectedSystemId: 'system-1',
    });

    // Advance workflow
    await eventEmitter.emitIncidentWorkflowAdvanced(
      incidentId,
      'DETECT',
      'ASSESS'
    );

    await auditService.flushBatch();

    // Query all events for this incident
    const logs = await auditService.queryLogs({
      entityId: incidentId,
    });

    expect(logs.length).toBe(2);
    expect(logs.some(l => l.eventType === GovernanceEventType.INCIDENT_CREATED)).toBe(true);
    expect(logs.some(l => l.eventType === GovernanceEventType.INCIDENT_WORKFLOW_ADVANCED)).toBe(true);
  });
});
```

**Run Integration Tests**:
```bash
# Requires test database
DATABASE_NAME=jade_marketplace_test pnpm --filter @jade/vendure-backend test integration/event-flow
```

---

## 4. Manual Testing Scenarios

### 4.1 Test Audit Logging

**Scenario 1: Register AI System and Verify Audit Trail**

```typescript
// In GraphQL Playground or via API
mutation {
  registerAISystem(input: {
    systemName: "Product Recommender v2"
    systemType: RECOMMENDER
    riskCategory: HIGH
    humanOversightLevel: IN_THE_LOOP
    description: "ML-based product recommendation engine"
    owner: "alice@jade-marketplace.test"
  }) {
    system {
      id
      systemName
    }
    complianceStatesCreated
  }
}
```

**Verify Audit Log**:
```sql
SELECT
  event_type,
  entity_id,
  action,
  metadata->'riskCategory' as risk_category,
  timestamp
FROM jade.governance_audit_log
WHERE event_type = 'system.registered'
ORDER BY timestamp DESC
LIMIT 5;
```

**Expected Result**:
- 1 audit log entry with `event_type = 'system.registered'`
- `metadata` contains `riskCategory: "HIGH"`
- Sequence number assigned

### 4.2 Test Metrics Collection

**Scenario 2: Fetch Governance Metrics**

```graphql
query {
  governanceMetrics {
    systemsTotal
    systemsActive
    systemsByRiskCategory {
      MINIMAL
      LIMITED
      HIGH
      UNACCEPTABLE
    }
    incidentsOpen
    incidentsClosed
    averageCompliancePercentage
    oversightActionsTotal
    overrideRate
    capturedAt
  }
}
```

**Expected Result**:
```json
{
  "data": {
    "governanceMetrics": {
      "systemsTotal": 12,
      "systemsActive": 11,
      "systemsByRiskCategory": {
        "MINIMAL": 3,
        "LIMITED": 5,
        "HIGH": 3,
        "UNACCEPTABLE": 1
      },
      "incidentsOpen": 4,
      "incidentsClosed": 18,
      "averageCompliancePercentage": 87.3,
      "oversightActionsTotal": 156,
      "overrideRate": 0.12,
      "capturedAt": "2025-12-19T..."
    }
  }
}
```

**Verify Caching**:
```graphql
# Run same query again within 1 minute
# Should return same capturedAt timestamp
```

### 4.3 Test Event Emission

**Scenario 3: Create Incident and Track Events**

```graphql
mutation {
  createAIIncident(input: {
    affectedSystemId: "<system-id>"
    severity: CRITICAL
    description: "Recommendation engine returning inappropriate products"
    detectedBy: "automated-monitoring"
    initialImpactAssessment: "Customer complaints increased 300%"
  }) {
    id
    severity
    currentStep
    detectedAt
  }
}
```

**Verify Events Emitted**:
```sql
SELECT
  event_type,
  action,
  metadata,
  timestamp
FROM jade.governance_audit_log
WHERE entity_id = '<incident-id>'
ORDER BY sequence_number;
```

**Expected Events**:
1. `incident.created` (action: CREATE)

**Advance Workflow**:
```graphql
mutation {
  advanceIncidentWorkflow(
    incidentId: "<incident-id>"
  ) {
    id
    currentStep
  }
}
```

**Verify Additional Event**:
```sql
-- Should now see incident.workflow.advanced event
```

### 4.4 Test Batch Processing

**Scenario 4: High-Volume Event Generation**

```bash
# Generate 150 events rapidly
for i in {1..150}; do
  curl -X POST https://localhost:3000/graphql \
    -H "Content-Type: application/json" \
    -d '{
      "query": "mutation { updateSystemMetadata(systemId: \"test-id\", metadata: {iteration: '$i'}) { success } }"
    }'
done
```

**Verify Batch Behavior**:
```sql
-- Check that batches were created (100-record chunks)
SELECT
  DATE_TRUNC('second', timestamp) as batch_time,
  COUNT(*) as events_in_batch
FROM jade.governance_audit_log
WHERE timestamp > NOW() - INTERVAL '5 minutes'
GROUP BY batch_time
ORDER BY batch_time;
```

**Expected Result**:
- First batch: ~100 events (triggered by BATCH_SIZE)
- Second batch: ~50 events (remaining)
- Batches written within 5 seconds of event generation

---

## 5. Validation Checklist

### Database Layer
- [ ] `governance_audit_log` table created with correct schema
- [ ] Indexes created: `IDX_event_type_timestamp`, `IDX_entity_id_timestamp`, `IDX_actor_id_timestamp`
- [ ] Sequence number auto-increments correctly
- [ ] JSONB columns (before, after, metadata) accept valid JSON

### Service Layer
- [ ] `GovernanceAuditService` is injectable
- [ ] Batch queue accumulates events
- [ ] Batch flushes at 100 records
- [ ] Batch flushes after 5 seconds (timer-based)
- [ ] Query filters work (eventTypes, entityId, actorId, dateRange)
- [ ] `GovernanceEventEmitterService` is injectable
- [ ] Events emit to EventEmitter2
- [ ] Audit logs created automatically on emit
- [ ] Critical events use synchronous logging
- [ ] Event handlers execute correctly
- [ ] `GovernanceMetricsService` is injectable
- [ ] Metrics snapshot returns all expected fields
- [ ] Caching works (1-minute TTL)
- [ ] Force refresh bypasses cache
- [ ] Executive summary calculates top risks correctly

### Integration
- [ ] Emitting system registered event creates audit log
- [ ] Emitting incident created event creates audit log
- [ ] Incident workflow advancement tracked
- [ ] Oversight actions logged with actor information
- [ ] Before/after state changes captured correctly
- [ ] Metadata populated with context-specific fields

### Performance
- [ ] Batch processing handles 1000+ events/second
- [ ] Metrics queries return in <500ms (with cache)
- [ ] Metrics queries return in <2s (without cache)
- [ ] Audit log queries with filters return in <1s
- [ ] No memory leaks from event handlers

---

## 6. Known Limitations

### Current Implementation

1. **No Dashboard GraphQL Resolvers** (G4.5)
   - Metrics service exists but not exposed via GraphQL
   - Need to add resolvers to governance.resolver.ts

2. **No Alerting Rules** (G4.6)
   - Event emitter infrastructure exists
   - No automated alert evaluation on events

3. **Limited Audit Trail UI** (G4.7)
   - Audit logs queryable via SQL
   - No GraphQL query for audit trail yet

4. **Manual Service Integration** (G4.8)
   - Event emitter not yet integrated into Sprint G2 services
   - Need to add event emission calls

5. **SKA Metrics Placeholder** (After G4)
   - `getSKAAgenticMetrics()` returns zeros
   - `isEnabled: false` until SKA integration

---

## 7. Next Steps

### Immediate (G4.5-G4.9)

1. **G4.5: Dashboard Queries**
   - Add `governanceMetrics` query to governance.graphql
   - Add `executiveSummary` query
   - Add `metricTrend` query
   - Implement resolvers

2. **G4.6: Alerting Rules**
   - Create alert rule entity
   - Implement rule evaluation engine
   - Trigger alerts on critical events

3. **G4.7: Audit Trail API**
   - Add `auditLogs` query with filters
   - Add pagination support
   - Add export functionality

4. **G4.8: Service Integration**
   - Add event emission to AISystemInventoryService
   - Add event emission to ComplianceAssessmentService
   - Add event emission to IncidentResponseService
   - Add event emission to HumanOversightService

5. **G4.9: Tests**
   - Run all unit tests
   - Run all integration tests
   - Measure code coverage

### Future (SKA Integration)

6. **SKA Phase 1: Package Setup**
   - Run `pnpm install` to link @jade/ska-ontology
   - Validate ontology files
   - Test SPARQL queries

7. **SKA Phase 2: Metrics**
   - Implement `getSKAAgenticMetrics()` with real data
   - Query ska-agentic-extension.ttl for asset counts
   - Set `isEnabled: true`

---

## 8. Troubleshooting

### Problem: Migration Fails

**Symptom**: `pnpm migration:generate` or `pnpm migration:run` fails

**Solutions**:
1. Check database connection: `psql jade_marketplace -c "SELECT 1;"`
2. Verify schema exists: `psql jade_marketplace -c "\dn jade"`
3. Check TypeORM entities are imported in plugin module
4. Review migration file for SQL syntax errors

### Problem: Events Not Creating Audit Logs

**Symptom**: No rows in `governance_audit_log` after emitting events

**Debug Steps**:
1. Check batch queue: `console.log(auditService['batchQueue'].length)`
2. Manually flush batch: `await auditService.flushBatch()`
3. Check for errors in service logs
4. Verify GovernanceAuditService is properly injected

### Problem: Metrics Cache Not Working

**Symptom**: Every metrics query re-fetches data from database

**Debug Steps**:
1. Check cache TTL: `console.log(service['CACHE_TTL_SECONDS'])`
2. Check cache timestamp: `console.log(service['cacheTimestamp'])`
3. Verify `isCacheValid()` logic
4. Check for service instance recreation (should be singleton)

### Problem: Service Not Injectable

**Symptom**: `NestCannotResolveCurrentProviderException`

**Solutions**:
1. Verify service has `@Injectable()` decorator
2. Check service is exported from `services/index.ts`
3. Verify plugin module imports the service
4. Check TypeORM repositories are registered with `@InjectRepository()`

---

## 9. Success Criteria

Sprint G4.1-G4.4 is considered validated when:

- ✅ All database migrations run successfully
- ✅ All unit tests pass (3 service test files)
- ✅ Integration test passes (event flow)
- ✅ Manual testing scenarios work as expected
- ✅ Validation checklist is 100% complete
- ✅ Performance benchmarks met
- ✅ No memory leaks or resource exhaustion

**Current Status**: Ready for testing

---

**Testing Priority**: High
**Estimated Testing Time**: 2-4 hours
**Blockers**: None (all dependencies implemented)
