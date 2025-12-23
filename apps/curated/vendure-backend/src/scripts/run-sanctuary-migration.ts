/**
 * Run Sanctuary Schema Migration
 *
 * Creates the Spa-ce Sanctuary community tables
 * Run with: npx ts-node src/scripts/run-sanctuary-migration.ts
 */

import { config } from 'dotenv';
config();

import { AppDataSource } from '../config/database';

async function runMigration(): Promise<void> {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  JADE - Running Spa-ce Sanctuary Schema Migration');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✓ Database connected');
    }

    // Create enum types
    console.log('\n📦 Creating enum types...');

    await AppDataSource.query(`
      DO $$ BEGIN
        CREATE TYPE jade.post_type AS ENUM (
          'discussion', 'question', 'article', 'case_study'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await AppDataSource.query(`
      DO $$ BEGIN
        CREATE TYPE jade.post_status AS ENUM (
          'draft', 'published', 'archived', 'moderated'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await AppDataSource.query(`
      DO $$ BEGIN
        CREATE TYPE jade.event_type AS ENUM (
          'workshop', 'webinar', 'meetup', 'conference'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await AppDataSource.query(`
      DO $$ BEGIN
        CREATE TYPE jade.event_format AS ENUM (
          'virtual', 'in_person', 'hybrid'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await AppDataSource.query(`
      DO $$ BEGIN
        CREATE TYPE jade.event_status AS ENUM (
          'upcoming', 'ongoing', 'completed', 'cancelled'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);

    await AppDataSource.query(`
      DO $$ BEGIN
        CREATE TYPE jade.registration_status AS ENUM (
          'registered', 'attended', 'cancelled'
        );
      EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    `);
    console.log('✓ Enum types created');

    // Create sanctuary_member table
    console.log('\n📦 Creating sanctuary_member table...');
    await AppDataSource.query(`
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

      CREATE INDEX IF NOT EXISTS idx_sanctuary_member_user ON jade.sanctuary_member(user_id);
      CREATE INDEX IF NOT EXISTS idx_sanctuary_member_verified ON jade.sanctuary_member(is_verified) WHERE is_verified = true;
      CREATE INDEX IF NOT EXISTS idx_sanctuary_member_reputation ON jade.sanctuary_member(reputation_score DESC);
    `);
    console.log('✓ sanctuary_member table created');

    // Create community_post table
    console.log('\n📦 Creating community_post table...');
    await AppDataSource.query(`
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

      CREATE INDEX IF NOT EXISTS idx_community_post_member ON jade.community_post(member_id);
      CREATE INDEX IF NOT EXISTS idx_community_post_category ON jade.community_post(category);
      CREATE INDEX IF NOT EXISTS idx_community_post_type ON jade.community_post(post_type);
      CREATE INDEX IF NOT EXISTS idx_community_post_status ON jade.community_post(status);
      CREATE INDEX IF NOT EXISTS idx_community_post_created ON jade.community_post(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_community_post_featured ON jade.community_post(is_featured) WHERE is_featured = true;
      CREATE INDEX IF NOT EXISTS idx_community_post_tags ON jade.community_post USING GIN(tags);
      CREATE INDEX IF NOT EXISTS idx_community_post_ska_atoms ON jade.community_post USING GIN(ska_atom_ids);
    `);
    console.log('✓ community_post table created');

    // Create community_comment table
    console.log('\n📦 Creating community_comment table...');
    await AppDataSource.query(`
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

      CREATE INDEX IF NOT EXISTS idx_community_comment_post ON jade.community_comment(post_id);
      CREATE INDEX IF NOT EXISTS idx_community_comment_member ON jade.community_comment(member_id);
      CREATE INDEX IF NOT EXISTS idx_community_comment_parent ON jade.community_comment(parent_comment_id);
      CREATE INDEX IF NOT EXISTS idx_community_comment_accepted ON jade.community_comment(is_accepted_answer) WHERE is_accepted_answer = true;
    `);
    console.log('✓ community_comment table created');

    // Create like tables
    console.log('\n📦 Creating like tables...');
    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS jade.post_like (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        post_id UUID NOT NULL REFERENCES jade.community_post(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES jade.sanctuary_member(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT unique_post_like UNIQUE (post_id, member_id)
      );

      CREATE INDEX IF NOT EXISTS idx_post_like_post ON jade.post_like(post_id);
      CREATE INDEX IF NOT EXISTS idx_post_like_member ON jade.post_like(member_id);

      CREATE TABLE IF NOT EXISTS jade.comment_like (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        comment_id UUID NOT NULL REFERENCES jade.community_comment(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES jade.sanctuary_member(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT unique_comment_like UNIQUE (comment_id, member_id)
      );

      CREATE INDEX IF NOT EXISTS idx_comment_like_comment ON jade.comment_like(comment_id);
      CREATE INDEX IF NOT EXISTS idx_comment_like_member ON jade.comment_like(member_id);
    `);
    console.log('✓ Like tables created');

    // Create community_event table
    console.log('\n📦 Creating community_event table...');
    await AppDataSource.query(`
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

      CREATE INDEX IF NOT EXISTS idx_community_event_organizer ON jade.community_event(organizer_id);
      CREATE INDEX IF NOT EXISTS idx_community_event_type ON jade.community_event(event_type);
      CREATE INDEX IF NOT EXISTS idx_community_event_status ON jade.community_event(status);
      CREATE INDEX IF NOT EXISTS idx_community_event_start ON jade.community_event(start_time);
    `);
    console.log('✓ community_event table created');

    // Create event_registration table
    console.log('\n📦 Creating event_registration table...');
    await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS jade.event_registration (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES jade.community_event(id) ON DELETE CASCADE,
        member_id UUID NOT NULL REFERENCES jade.sanctuary_member(id) ON DELETE CASCADE,
        status jade.registration_status DEFAULT 'registered',
        registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT unique_event_registration UNIQUE (event_id, member_id)
      );

      CREATE INDEX IF NOT EXISTS idx_event_registration_event ON jade.event_registration(event_id);
      CREATE INDEX IF NOT EXISTS idx_event_registration_member ON jade.event_registration(member_id);
    `);
    console.log('✓ event_registration table created');

    // Create triggers
    console.log('\n📦 Creating triggers...');
    await AppDataSource.query(`
      -- Timestamp update trigger
      CREATE OR REPLACE FUNCTION jade.update_sanctuary_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_community_post_updated ON jade.community_post;
      CREATE TRIGGER trigger_community_post_updated
        BEFORE UPDATE ON jade.community_post
        FOR EACH ROW EXECUTE FUNCTION jade.update_sanctuary_timestamp();

      DROP TRIGGER IF EXISTS trigger_community_comment_updated ON jade.community_comment;
      CREATE TRIGGER trigger_community_comment_updated
        BEFORE UPDATE ON jade.community_comment
        FOR EACH ROW EXECUTE FUNCTION jade.update_sanctuary_timestamp();

      DROP TRIGGER IF EXISTS trigger_community_event_updated ON jade.community_event;
      CREATE TRIGGER trigger_community_event_updated
        BEFORE UPDATE ON jade.community_event
        FOR EACH ROW EXECUTE FUNCTION jade.update_sanctuary_timestamp();
    `);

    await AppDataSource.query(`
      -- Comment count trigger
      CREATE OR REPLACE FUNCTION jade.update_post_comment_count()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE jade.community_post SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
          UPDATE jade.community_post SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_update_post_comment_count ON jade.community_comment;
      CREATE TRIGGER trigger_update_post_comment_count
        AFTER INSERT OR DELETE ON jade.community_comment
        FOR EACH ROW EXECUTE FUNCTION jade.update_post_comment_count();
    `);

    await AppDataSource.query(`
      -- Like count triggers
      CREATE OR REPLACE FUNCTION jade.update_post_like_count()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE jade.community_post SET like_count = like_count + 1 WHERE id = NEW.post_id;
        ELSIF TG_OP = 'DELETE' THEN
          UPDATE jade.community_post SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_update_post_like_count ON jade.post_like;
      CREATE TRIGGER trigger_update_post_like_count
        AFTER INSERT OR DELETE ON jade.post_like
        FOR EACH ROW EXECUTE FUNCTION jade.update_post_like_count();

      CREATE OR REPLACE FUNCTION jade.update_comment_like_count()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'INSERT' THEN
          UPDATE jade.community_comment SET like_count = like_count + 1 WHERE id = NEW.comment_id;
        ELSIF TG_OP = 'DELETE' THEN
          UPDATE jade.community_comment SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      DROP TRIGGER IF EXISTS trigger_update_comment_like_count ON jade.comment_like;
      CREATE TRIGGER trigger_update_comment_like_count
        AFTER INSERT OR DELETE ON jade.comment_like
        FOR EACH ROW EXECUTE FUNCTION jade.update_comment_like_count();
    `);
    console.log('✓ Triggers created');

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('  ✅ Spa-ce Sanctuary schema migration complete!');
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('✗ Migration failed:', error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

runMigration().catch(console.error);
