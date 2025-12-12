/*
  # Initial Database Setup for Media Discernment Platform

  This migration creates the core database schema for the faith-based media analysis platform.

  ## New Tables

  ### 1. `users` - User accounts and profiles
    - `id` (varchar, primary key) - Unique user identifier
    - `email` (varchar, unique) - User email address
    - `google_id` (varchar, unique) - Google OAuth identifier
    - `first_name` (varchar) - User's first name
    - `last_name` (varchar) - User's last name
    - `profile_image_url` (varchar) - Profile picture URL
    - `whatsapp_number` (varchar) - WhatsApp contact number
    - `marketing_consent` (varchar) - Marketing communication consent (default: 'false')
    - `has_completed_onboarding` (varchar) - Onboarding completion status (default: 'false')
    - `created_at` (timestamp) - Account creation timestamp
    - `updated_at` (timestamp) - Last update timestamp

  ### 2. `sessions` - Authentication session storage
    - `sid` (varchar, primary key) - Session identifier
    - `sess` (jsonb) - Session data
    - `expire` (timestamp) - Session expiration time
    - Index on `expire` for efficient cleanup

  ### 3. `media_analyses` - Media content analysis results
    - `id` (varchar, primary key) - Unique analysis identifier
    - `title` (text) - Media title
    - `media_type` (text) - Type: movie, show, book, or song
    - `tmdb_id` (integer) - TMDB identifier for movies/shows
    - `imdb_rating` (text) - IMDb rating
    - `genre` (text) - Media genre
    - `description` (text) - Media description
    - `poster_url` (text) - Poster/cover image URL
    - `trailer_url` (text) - Trailer video URL
    - `discernment_score` (integer) - Faith-based score (0-100)
    - `faith_analysis` (text) - Detailed faith-based analysis
    - `tags` (text[]) - Categorization tags
    - `verse_text` (text) - Related Bible verse text
    - `verse_reference` (text) - Bible verse reference
    - `alternatives` (text) - JSON string of alternative recommendations
    - `created_at` (timestamp) - Analysis creation timestamp

  ### 4. `saved_analyses` - User bookmarks
    - `id` (varchar, primary key) - Unique save identifier
    - `user_id` (varchar, foreign key) - References users.id
    - `analysis_id` (varchar, foreign key) - References media_analyses.id
    - `saved_at` (timestamp) - Bookmark timestamp
    - Indexes on user_id and analysis_id for fast lookups
    - Cascade delete when user or analysis is deleted

  ### 5. `comments` - User comments on analyses
    - `id` (varchar, primary key) - Unique comment identifier
    - `analysis_id` (varchar, foreign key) - References media_analyses.id
    - `user_id` (varchar, foreign key) - References users.id
    - `content` (text) - Comment text
    - `created_at` (timestamp) - Comment creation timestamp
    - `updated_at` (timestamp) - Last edit timestamp
    - Indexes on analysis_id and user_id
    - Cascade delete when user or analysis is deleted

  ### 6. `reviews` - User ratings and reviews
    - `id` (varchar, primary key) - Unique review identifier
    - `analysis_id` (varchar, foreign key) - References media_analyses.id
    - `user_id` (varchar, foreign key) - References users.id
    - `rating` (integer) - Star rating (1-5)
    - `content` (text) - Review text
    - `created_at` (timestamp) - Review creation timestamp
    - `updated_at` (timestamp) - Last edit timestamp
    - Indexes on analysis_id and user_id
    - Cascade delete when user or analysis is deleted

  ### 7. `discussions` - Community discussion threads
    - `id` (varchar, primary key) - Unique discussion identifier
    - `user_id` (varchar, foreign key) - References users.id
    - `title` (text) - Discussion title
    - `content` (text) - Discussion content
    - `category` (text) - Discussion category (general, prayer, recommendations, etc.)
    - `created_at` (timestamp) - Thread creation timestamp
    - `updated_at` (timestamp) - Last update timestamp
    - Indexes on user_id and category
    - Cascade delete when user is deleted

  ### 8. `discussion_replies` - Replies to discussion threads
    - `id` (varchar, primary key) - Unique reply identifier
    - `discussion_id` (varchar, foreign key) - References discussions.id
    - `user_id` (varchar, foreign key) - References users.id
    - `content` (text) - Reply content
    - `created_at` (timestamp) - Reply creation timestamp
    - `updated_at` (timestamp) - Last edit timestamp
    - Indexes on discussion_id and user_id
    - Cascade delete when discussion or user is deleted

  ## Security
    - Enable RLS on all tables
    - Add policies for authenticated user access
    - Restrict data access based on ownership
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  email VARCHAR UNIQUE,
  google_id VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  whatsapp_number VARCHAR,
  marketing_consent VARCHAR DEFAULT 'false',
  has_completed_onboarding VARCHAR DEFAULT 'false',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid()::VARCHAR = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid()::VARCHAR = id)
  WITH CHECK (auth.uid()::VARCHAR = id);

-- Sessions table (for authentication)
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Note: Sessions table typically doesn't need RLS as it's managed by the auth system

-- Media analyses table
CREATE TABLE IF NOT EXISTS media_analyses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  title TEXT NOT NULL,
  media_type TEXT NOT NULL,
  tmdb_id INTEGER,
  imdb_rating TEXT,
  genre TEXT,
  description TEXT,
  poster_url TEXT,
  trailer_url TEXT,
  discernment_score INTEGER NOT NULL,
  faith_analysis TEXT NOT NULL,
  tags TEXT[],
  verse_text TEXT NOT NULL,
  verse_reference TEXT NOT NULL,
  alternatives TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE media_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view analyses"
  ON media_analyses FOR SELECT
  TO public
  USING (true);

-- Saved analyses table
CREATE TABLE IF NOT EXISTS saved_analyses (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  analysis_id VARCHAR NOT NULL REFERENCES media_analyses(id) ON DELETE CASCADE,
  saved_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_saved ON saved_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_saved ON saved_analyses(analysis_id);

ALTER TABLE saved_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved analyses"
  ON saved_analyses FOR SELECT
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can insert own saved analyses"
  ON saved_analyses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can delete own saved analyses"
  ON saved_analyses FOR DELETE
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  analysis_id VARCHAR NOT NULL REFERENCES media_analyses(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_analysis ON comments(analysis_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view comments"
  ON comments FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id)
  WITH CHECK (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  analysis_id VARCHAR NOT NULL REFERENCES media_analyses(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_analysis ON reviews(analysis_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id)
  WITH CHECK (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id);

-- Discussions table
CREATE TABLE IF NOT EXISTS discussions (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discussions_user ON discussions(user_id);
CREATE INDEX IF NOT EXISTS idx_discussions_category ON discussions(category);

ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view discussions"
  ON discussions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create discussions"
  ON discussions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can update own discussions"
  ON discussions FOR UPDATE
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id)
  WITH CHECK (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can delete own discussions"
  ON discussions FOR DELETE
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id);

-- Discussion replies table
CREATE TABLE IF NOT EXISTS discussion_replies (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::VARCHAR,
  discussion_id VARCHAR NOT NULL REFERENCES discussions(id) ON DELETE CASCADE,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_replies_discussion ON discussion_replies(discussion_id);
CREATE INDEX IF NOT EXISTS idx_replies_user ON discussion_replies(user_id);

ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view replies"
  ON discussion_replies FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON discussion_replies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can update own replies"
  ON discussion_replies FOR UPDATE
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id)
  WITH CHECK (auth.uid()::VARCHAR = user_id);

CREATE POLICY "Users can delete own replies"
  ON discussion_replies FOR DELETE
  TO authenticated
  USING (auth.uid()::VARCHAR = user_id);