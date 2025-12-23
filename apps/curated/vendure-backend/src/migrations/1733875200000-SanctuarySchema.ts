import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Spa-ce Sanctuary Community Platform Schema Migration
 *
 * Creates tables for the AI-enhanced community platform:
 * - sanctuary_member: Member profiles with expertise areas
 * - community_post: Discussion posts, questions, articles
 * - community_comment: Threaded comments on posts
 * - post_like / comment_like: Like tracking
 * - community_event: Events and workshops
 * - event_registration: Event attendance tracking
 *
 * Integrates with SKA (Skincare Knowledge Atoms) for topic suggestions
 */
export class SanctuarySchema1733875200000 implements MigrationInterface {
  name = 'SanctuarySchema1733875200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum types for Sanctuary
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.post_type AS ENUM (
          'discussion',
          'question',
          'article',
          'case_study'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.post_status AS ENUM (
          'draft',
          'published',
          'archived',
          'moderated'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.event_type AS ENUM (
          'workshop',
          'webinar',
          'meetup',
          'conference'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.event_format AS ENUM (
          'virtual',
          'in_person',
          'hybrid'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.event_status AS ENUM (
          'upcoming',
          'ongoing',
          'completed',
          'cancelled'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE jade.registration_status AS ENUM (
          'registered',
          'attended',
          'cancelled'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    // Create sanctuary_member table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.sanctuary_member (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES jade.user(id) ON DELETE CASCADE,
        display_name VARCHAR(100) NOT NULL,
        bio TEXT,
        expertise_areas TEXT[] DEFAULT '{}',
        certifications TEXT[] DEFAULT '{}',
        years_experience INTEGER,
        profile_image_url TEXT,
        is_verified BOOLEAN DEFAULT false,
        reputation_score INTEGER DEFAULT 0,
        joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_active_at TIMESTAMP WITH TIME ZONE,

        CONSTRAINT unique_user_member UNIQUE (user_id)
      );

      CREATE INDEX idx_sanctuary_member_user ON jade.sanctuary_member(user_id);
      CREATE INDEX idx_sanctuary_member_verified ON jade.sanctuary_member(is_verified) WHERE is_verified = true;
      CREATE INDEX idx_sanctuary_member_reputation ON jade.sanctuary_member(reputation_score DESC);
      CREATE INDEX idx_sanctuary_member_expertise ON jade.sanctuary_member USING GIN(expertise_areas);
    `);

    // Create community_post table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.community_post (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        member_id UUID NOT NULL REFERENCES jade.sanctuary_member(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        post_type jade.post_type DEFAULT 'discussion',
        category VARCHAR(100),
        tags TEXT[] DEFAULT '{}',
        ska_atom_ids TEXT[] DEFAULT '{}',
        view_count INTEGER DEFAULT 0,
        like_count INTEGER DEFAULT 0,
        comment_count INTEGER DEFAULT 0,
        is_pinned BOOLEAN DEFAULT false,
        is_featured BOOLEAN DEFAULT false,
        status jade.post_status DEFAULT 'published',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX idx_community_post_member ON jade.community_post(member_id);
      CREATE INDEX idx_community_post_category ON jade.community_post(category);
      CREATE INDEX idx_community_post_type ON jade.community_post(post_type);
      CREATE INDEX idx_community_post_status ON jade.community_post(status);
      CREATE INDEX idx_community_post_created ON jade.community_post(created_at DESC);
      CREATE INDEX idx_community_post_featured ON jade.community_post(is_featured) WHERE is_featured = true;
      CREATE INDEX idx_community_post_pinned ON jade.community_post(is_pinned) WHERE is_pinned = true;
      CREATE INDEX idx_community_post_tags ON jade.community_post USING GIN(tags);
      CREATE INDEX idx_community_post_ska_atoms ON jade.community_post USING GIN(ska_atom_ids);
      CREATE INDEX idx_community_post_fts ON jade.community_post
        USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '')));
    `);

    // Create community_comment table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.community_comment (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES jade.community_post(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES jade.sanctuary_member(id) ON DELETE CASCADE,
        parent_comment_id UUID REFERENCES jade.community_comment(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        like_count INTEGER DEFAULT 0,
        is_accepted_answer BOOLEAN DEFAULT false,
        status jade.post_status DEFAULT 'published',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX idx_community_comment_post ON jade.community_comment(post_id);
      CREATE INDEX idx_community_comment_member ON jade.community_comment(member_id);
      CREATE INDEX idx_community_comment_parent ON jade.community_comment(parent_comment_id);
      CREATE INDEX idx_community_comment_accepted ON jade.community_comment(is_accepted_answer) WHERE is_accepted_answer = true;
      CREATE INDEX idx_community_comment_created ON jade.community_comment(created_at DESC);
    `);

    // Create post_like table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.post_like (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES jade.community_post(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES jade.sanctuary_member(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

        CONSTRAINT unique_post_like UNIQUE (post_id, member_id)
      );

      CREATE INDEX idx_post_like_post ON jade.post_like(post_id);
      CREATE INDEX idx_post_like_member ON jade.post_like(member_id);
    `);

    // Create comment_like table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.comment_like (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        comment_id UUID NOT NULL REFERENCES jade.community_comment(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES jade.sanctuary_member(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

        CONSTRAINT unique_comment_like UNIQUE (comment_id, member_id)
      );

      CREATE INDEX idx_comment_like_comment ON jade.comment_like(comment_id);
      CREATE INDEX idx_comment_like_member ON jade.comment_like(member_id);
    `);

    // Create community_event table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.community_event (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organizer_id UUID NOT NULL REFERENCES jade.sanctuary_member(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_type jade.event_type NOT NULL,
        format jade.event_format DEFAULT 'virtual',
        location TEXT,
        virtual_link TEXT,
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE,
        max_attendees INTEGER,
        registration_deadline TIMESTAMP WITH TIME ZONE,
        price_cents INTEGER DEFAULT 0,
        ska_topic_ids TEXT[] DEFAULT '{}',
        status jade.event_status DEFAULT 'upcoming',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX idx_community_event_organizer ON jade.community_event(organizer_id);
      CREATE INDEX idx_community_event_type ON jade.community_event(event_type);
      CREATE INDEX idx_community_event_format ON jade.community_event(format);
      CREATE INDEX idx_community_event_status ON jade.community_event(status);
      CREATE INDEX idx_community_event_start ON jade.community_event(start_time);
      CREATE INDEX idx_community_event_upcoming ON jade.community_event(start_time)
        WHERE status = 'upcoming';
      CREATE INDEX idx_community_event_ska_topics ON jade.community_event USING GIN(ska_topic_ids);
    `);

    // Create event_registration table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS jade.event_registration (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES jade.community_event(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES jade.sanctuary_member(id) ON DELETE CASCADE,
        status jade.registration_status DEFAULT 'registered',
        registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

        CONSTRAINT unique_event_registration UNIQUE (event_id, member_id)
      );

      CREATE INDEX idx_event_registration_event ON jade.event_registration(event_id);
      CREATE INDEX idx_event_registration_member ON jade.event_registration(member_id);
      CREATE INDEX idx_event_registration_status ON jade.event_registration(status);
    `);

    // Create triggers for updated_at timestamps
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.update_sanctuary_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_community_post_updated
        BEFORE UPDATE ON jade.community_post
        FOR EACH ROW EXECUTE FUNCTION jade.update_sanctuary_timestamp();

      CREATE TRIGGER trigger_community_comment_updated
        BEFORE UPDATE ON jade.community_comment
        FOR EACH ROW EXECUTE FUNCTION jade.update_sanctuary_timestamp();

      CREATE TRIGGER trigger_community_event_updated
        BEFORE UPDATE ON jade.community_event
        FOR EACH ROW EXECUTE FUNCTION jade.update_sanctuary_timestamp();
    `);

    // Create trigger to update post comment_count
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.update_post_comment_count()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE jade.community_post
          SET comment_count = comment_count + 1
          WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
          UPDATE jade.community_post
          SET comment_count = GREATEST(comment_count - 1, 0)
          WHERE id = OLD.post_id;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_update_post_comment_count
        AFTER INSERT OR DELETE ON jade.community_comment
        FOR EACH ROW EXECUTE FUNCTION jade.update_post_comment_count();
    `);

    // Create trigger to update like counts
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION jade.update_post_like_count()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE jade.community_post
          SET like_count = like_count + 1
          WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
          UPDATE jade.community_post
          SET like_count = GREATEST(like_count - 1, 0)
          WHERE id = OLD.post_id;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_update_post_like_count
        AFTER INSERT OR DELETE ON jade.post_like
        FOR EACH ROW EXECUTE FUNCTION jade.update_post_like_count();

      CREATE OR REPLACE FUNCTION jade.update_comment_like_count()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE jade.community_comment
          SET like_count = like_count + 1
          WHERE id = NEW.comment_id;
        ELSIF TG_OP = 'DELETE' THEN
          UPDATE jade.community_comment
          SET like_count = GREATEST(like_count - 1, 0)
          WHERE id = OLD.comment_id;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trigger_update_comment_like_count
        AFTER INSERT OR DELETE ON jade.comment_like
        FOR EACH ROW EXECUTE FUNCTION jade.update_comment_like_count();
    `);

    console.log('✅ Spa-ce Sanctuary schema migration completed successfully');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop triggers
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_comment_like_count ON jade.comment_like;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_post_like_count ON jade.post_like;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_update_post_comment_count ON jade.community_comment;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_community_event_updated ON jade.community_event;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_community_comment_updated ON jade.community_comment;`);
    await queryRunner.query(`DROP TRIGGER IF EXISTS trigger_community_post_updated ON jade.community_post;`);

    // Drop functions
    await queryRunner.query(`DROP FUNCTION IF EXISTS jade.update_comment_like_count();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS jade.update_post_like_count();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS jade.update_post_comment_count();`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS jade.update_sanctuary_timestamp();`);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE IF EXISTS jade.event_registration CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.community_event CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.comment_like CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.post_like CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.community_comment CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.community_post CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS jade.sanctuary_member CASCADE;`);

    // Drop enum types
    await queryRunner.query(`DROP TYPE IF EXISTS jade.registration_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.event_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.event_format;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.event_type;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.post_status;`);
    await queryRunner.query(`DROP TYPE IF EXISTS jade.post_type;`);

    console.log('✅ Spa-ce Sanctuary schema migration rolled back successfully');
  }
}
