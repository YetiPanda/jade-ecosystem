-- ============================================
-- JADE SKA Evolution: Feedback Tables Migration
-- Version: 1.0.0
-- Feature: 010-ska-mach-evolution
-- Phase: 1 (Foundation Enhancement)
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- LOOP A: Interaction Events (High Volume)
-- ============================================

-- Create interaction_events table with partitioning
CREATE TABLE jade.interaction_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Session identification (anonymized)
    session_hash VARCHAR(64) NOT NULL,
    
    -- Event details
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN (
        'impression', 'click', 'add_to_cart', 'remove_from_cart',
        'purchase', 'dwell', 'search', 'filter', 'compare', 'share'
    )),
    
    -- Related entities (nullable)
    atom_id UUID REFERENCES jade.skincare_atoms(id) ON DELETE SET NULL,
    product_id UUID REFERENCES jade.product_extension(id) ON DELETE SET NULL,
    
    -- Search context
    search_query TEXT,
    
    -- Position and engagement
    position INT CHECK (position >= 0),
    dwell_time_ms INT CHECK (dwell_time_ms >= 0),
    
    -- Device context
    device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'mobile', 'tablet')),
    
    -- Flexible context (JSON)
    context JSONB DEFAULT '{}',
    
    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create partitions for current and next 3 months
CREATE TABLE jade.interaction_events_2025_12 
    PARTITION OF jade.interaction_events
    FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

CREATE TABLE jade.interaction_events_2026_01 
    PARTITION OF jade.interaction_events
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE jade.interaction_events_2026_02 
    PARTITION OF jade.interaction_events
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');

CREATE TABLE jade.interaction_events_2026_03 
    PARTITION OF jade.interaction_events
    FOR VALUES FROM ('2026-03-01') TO ('2026-04-01');

-- Indexes for common query patterns
CREATE INDEX idx_interaction_events_session 
    ON jade.interaction_events(session_hash);
    
CREATE INDEX idx_interaction_events_type_date 
    ON jade.interaction_events(event_type, created_at);
    
CREATE INDEX idx_interaction_events_product_date 
    ON jade.interaction_events(product_id, created_at) 
    WHERE product_id IS NOT NULL;
    
CREATE INDEX idx_interaction_events_atom_date 
    ON jade.interaction_events(atom_id, created_at) 
    WHERE atom_id IS NOT NULL;

-- GIN index for JSON context queries
CREATE INDEX idx_interaction_events_context 
    ON jade.interaction_events USING GIN (context);

-- ============================================
-- LOOP B: Outcome Events (Lower Volume, High Signal)
-- ============================================

CREATE TABLE jade.outcome_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User (authenticated)
    user_id UUID NOT NULL REFERENCES jade.user(id) ON DELETE CASCADE,
    
    -- Product
    product_id UUID NOT NULL REFERENCES jade.product_extension(id) ON DELETE CASCADE,
    
    -- Outcome classification
    outcome_type VARCHAR(50) NOT NULL CHECK (outcome_type IN (
        'improvement', 'neutral', 'irritation', 'breakout',
        'allergic_reaction', 'sensitivity', 'dryness', 'excess_oil'
    )),
    
    -- User profile context
    skin_type VARCHAR(50) CHECK (skin_type IN (
        'oily', 'dry', 'combination', 'normal', 'sensitive'
    )),
    skin_concerns VARCHAR(50)[] DEFAULT '{}',
    
    -- Usage details
    usage_duration_days INT CHECK (usage_duration_days > 0),
    application_frequency VARCHAR(50),
    
    -- Satisfaction metrics
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
    would_repurchase BOOLEAN,
    
    -- Additional context
    notes TEXT,
    photo_evidence_url TEXT,
    
    -- Verification
    verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamp
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for outcome queries
CREATE INDEX idx_outcome_events_user 
    ON jade.outcome_events(user_id);
    
CREATE INDEX idx_outcome_events_product 
    ON jade.outcome_events(product_id);
    
CREATE INDEX idx_outcome_events_type_date 
    ON jade.outcome_events(outcome_type, created_at);
    
CREATE INDEX idx_outcome_events_skin_type 
    ON jade.outcome_events(skin_type) 
    WHERE skin_type IS NOT NULL;

-- Array index for skin concerns
CREATE INDEX idx_outcome_events_concerns 
    ON jade.outcome_events USING GIN (skin_concerns);

-- ============================================
-- LOOP C: Data Corrections (Curator QA)
-- ============================================

CREATE TABLE jade.data_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Curator who submitted
    corrected_by UUID NOT NULL REFERENCES jade.user(id) ON DELETE RESTRICT,
    curator_role VARCHAR(50) NOT NULL CHECK (curator_role IN (
        'esthetician', 'dermatologist', 'cosmetic_chemist', 'regulatory', 'admin'
    )),
    
    -- Entity being corrected
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN (
        'atom', 'product', 'relationship', 'constraint'
    )),
    entity_id UUID NOT NULL,
    
    -- Correction details
    correction_type VARCHAR(50) NOT NULL CHECK (correction_type IN (
        'taxonomy', 'ingredient_list', 'claim', 'relationship',
        'tensor_value', 'constraint', 'source'
    )),
    before_value JSONB NOT NULL,
    after_value JSONB NOT NULL,
    reason TEXT NOT NULL,
    scientific_source TEXT,
    
    -- Impact assessment
    confidence_impact FLOAT CHECK (confidence_impact BETWEEN -1 AND 1),
    
    -- Review status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'superseded'
    )),
    peer_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
    approved_by UUID REFERENCES jade.user(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for correction workflow
CREATE INDEX idx_data_corrections_status 
    ON jade.data_corrections(status) 
    WHERE status = 'pending';
    
CREATE INDEX idx_data_corrections_entity 
    ON jade.data_corrections(entity_type, entity_id);
    
CREATE INDEX idx_data_corrections_curator 
    ON jade.data_corrections(corrected_by);
    
CREATE INDEX idx_data_corrections_date 
    ON jade.data_corrections(created_at);

-- ============================================
-- CONSTRAINT RELATIONS (Five Rings: EARTH gap)
-- ============================================

CREATE TABLE jade.constraint_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source and target atoms
    source_atom_id UUID NOT NULL REFERENCES jade.skincare_atoms(id) ON DELETE CASCADE,
    target_atom_id UUID NOT NULL REFERENCES jade.skincare_atoms(id) ON DELETE CASCADE,
    
    -- Constraint classification
    constraint_type VARCHAR(50) NOT NULL CHECK (constraint_type IN (
        'incompatible_with',      -- Chemical interaction conflict
        'contraindicated_for',    -- Skin type prohibition
        'requires_buffer',        -- Time/sequence requirement
        'enhances_risk_of',       -- Conditional warning
        'cancels_efficacy_of'     -- Neutral but wasteful
    )),
    
    -- Severity level
    severity VARCHAR(20) NOT NULL CHECK (severity IN (
        'critical',   -- Must never combine
        'warning',    -- Use with caution
        'caution'     -- Be aware
    )),
    
    -- Conditional application
    condition TEXT,  -- e.g., "When used on sensitive skin"
    
    -- Scientific basis (required)
    scientific_basis TEXT NOT NULL,
    source_doi TEXT,
    source_url TEXT,
    
    -- Goldilocks override
    goldilocks_override BOOLEAN DEFAULT FALSE,
    goldilocks_condition TEXT,  -- e.g., "If concentration < 0.5%"
    
    -- Audit
    created_by UUID REFERENCES jade.user(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Prevent duplicate constraints
    CONSTRAINT unique_constraint_pair UNIQUE (source_atom_id, target_atom_id, constraint_type)
);

-- Indexes for constraint queries
CREATE INDEX idx_constraint_relations_source 
    ON jade.constraint_relations(source_atom_id);
    
CREATE INDEX idx_constraint_relations_target 
    ON jade.constraint_relations(target_atom_id);
    
CREATE INDEX idx_constraint_relations_type 
    ON jade.constraint_relations(constraint_type);
    
CREATE INDEX idx_constraint_relations_severity 
    ON jade.constraint_relations(severity) 
    WHERE severity = 'critical';

-- ============================================
-- TRIGGER: Auto-update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION jade.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_data_corrections_updated_at
    BEFORE UPDATE ON jade.data_corrections
    FOR EACH ROW
    EXECUTE FUNCTION jade.update_updated_at_column();

CREATE TRIGGER update_constraint_relations_updated_at
    BEFORE UPDATE ON jade.constraint_relations
    FOR EACH ROW
    EXECUTE FUNCTION jade.update_updated_at_column();

-- ============================================
-- VIEWS: Analytics Aggregations
-- ============================================

-- Behavioral signals for ranking (per product)
CREATE OR REPLACE VIEW jade.product_behavioral_signals AS
SELECT 
    product_id,
    COUNT(*) FILTER (WHERE event_type = 'impression') AS impressions,
    COUNT(*) FILTER (WHERE event_type = 'click') AS clicks,
    COUNT(*) FILTER (WHERE event_type = 'add_to_cart') AS add_to_carts,
    COUNT(*) FILTER (WHERE event_type = 'purchase') AS purchases,
    AVG(dwell_time_ms) FILTER (WHERE event_type = 'dwell') AS avg_dwell_ms,
    CASE 
        WHEN COUNT(*) FILTER (WHERE event_type = 'impression') > 0 
        THEN COUNT(*) FILTER (WHERE event_type = 'click')::FLOAT / 
             COUNT(*) FILTER (WHERE event_type = 'impression')
        ELSE 0 
    END AS click_through_rate,
    CASE 
        WHEN COUNT(*) FILTER (WHERE event_type = 'click') > 0 
        THEN COUNT(*) FILTER (WHERE event_type = 'purchase')::FLOAT / 
             COUNT(*) FILTER (WHERE event_type = 'click')
        ELSE 0 
    END AS conversion_rate
FROM jade.interaction_events
WHERE product_id IS NOT NULL
  AND created_at > NOW() - INTERVAL '30 days'
GROUP BY product_id;

-- Outcome signals for calibration
CREATE OR REPLACE VIEW jade.product_outcome_signals AS
SELECT 
    product_id,
    COUNT(*) AS total_outcomes,
    COUNT(*) FILTER (WHERE outcome_type = 'improvement') AS positive_outcomes,
    COUNT(*) FILTER (WHERE outcome_type IN ('irritation', 'breakout', 'allergic_reaction')) AS negative_outcomes,
    AVG(rating) AS avg_rating,
    AVG(CASE WHEN would_repurchase THEN 1 ELSE 0 END) AS repurchase_rate,
    CASE 
        WHEN COUNT(*) > 0 
        THEN COUNT(*) FILTER (WHERE outcome_type = 'improvement')::FLOAT / COUNT(*)
        ELSE NULL 
    END AS positive_outcome_rate
FROM jade.outcome_events
WHERE created_at > NOW() - INTERVAL '90 days'
GROUP BY product_id;

-- ============================================
-- CLEANUP FUNCTIONS (Data Retention)
-- ============================================

-- Cleanup old interaction events (keep 90 days)
CREATE OR REPLACE FUNCTION jade.cleanup_old_interactions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM jade.interaction_events
    WHERE created_at < NOW() - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Anonymize old outcome events (keep 1 year, then anonymize)
CREATE OR REPLACE FUNCTION jade.anonymize_old_outcomes()
RETURNS INTEGER AS $$
DECLARE
    anonymized_count INTEGER;
BEGIN
    UPDATE jade.outcome_events
    SET notes = NULL,
        photo_evidence_url = NULL
    WHERE created_at < NOW() - INTERVAL '1 year'
      AND notes IS NOT NULL;
    GET DIAGNOSTICS anonymized_count = ROW_COUNT;
    RETURN anonymized_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- GRANTS (Role-based access)
-- ============================================

-- Interaction events: Write for all, read for analytics
GRANT INSERT ON jade.interaction_events TO jade_app;
GRANT SELECT ON jade.interaction_events TO jade_analytics;

-- Outcome events: Write for authenticated, read for analytics
GRANT INSERT ON jade.outcome_events TO jade_app;
GRANT SELECT ON jade.outcome_events TO jade_analytics;

-- Data corrections: CRUD for curators, read for analytics
GRANT ALL ON jade.data_corrections TO jade_curator;
GRANT SELECT ON jade.data_corrections TO jade_analytics;

-- Constraint relations: CRUD for admins, read for app
GRANT ALL ON jade.constraint_relations TO jade_admin;
GRANT SELECT ON jade.constraint_relations TO jade_app;

-- Views: Read for app and analytics
GRANT SELECT ON jade.product_behavioral_signals TO jade_app, jade_analytics;
GRANT SELECT ON jade.product_outcome_signals TO jade_app, jade_analytics;

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE jade.interaction_events IS 
    'Loop A: High-volume implicit feedback from user interactions (anonymized)';

COMMENT ON TABLE jade.outcome_events IS 
    'Loop B: Explicit user-reported product outcomes for calibration';

COMMENT ON TABLE jade.data_corrections IS 
    'Loop C: Human-in-the-loop curator corrections for data quality';

COMMENT ON TABLE jade.constraint_relations IS 
    'Safety and compatibility constraints between skincare atoms (Five Rings: EARTH gap)';

COMMENT ON VIEW jade.product_behavioral_signals IS 
    'Aggregated behavioral signals per product for multi-signal ranking (30-day window)';

COMMENT ON VIEW jade.product_outcome_signals IS 
    'Aggregated outcome signals per product for calibration (90-day window)';
