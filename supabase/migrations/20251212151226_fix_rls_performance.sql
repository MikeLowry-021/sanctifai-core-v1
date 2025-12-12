/*
  # Fix RLS Performance Issues

  This migration optimizes Row Level Security policies for better performance at scale.

  ## Changes

  1. **Performance Optimization**
     - Replace `auth.uid()` with `(select auth.uid())` in all policies
     - This prevents re-evaluation of auth.uid() for each row
     - Dramatically improves query performance at scale

  2. **Sessions Table Security**
     - Enable RLS on sessions table
     - Add policy for session management

  ## Affected Tables
     - users
     - saved_analyses
     - comments
     - reviews
     - discussions
     - discussion_replies
     - sessions
*/

-- Drop existing policies and recreate with optimized queries

-- Users table policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING ((select auth.uid())::VARCHAR = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = id)
  WITH CHECK ((select auth.uid())::VARCHAR = id);

-- Saved analyses policies
DROP POLICY IF EXISTS "Users can view own saved analyses" ON saved_analyses;
DROP POLICY IF EXISTS "Users can insert own saved analyses" ON saved_analyses;
DROP POLICY IF EXISTS "Users can delete own saved analyses" ON saved_analyses;

CREATE POLICY "Users can view own saved analyses"
  ON saved_analyses FOR SELECT
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can insert own saved analyses"
  ON saved_analyses FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can delete own saved analyses"
  ON saved_analyses FOR DELETE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id);

-- Comments policies
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
DROP POLICY IF EXISTS "Users can delete own comments" ON comments;

CREATE POLICY "Authenticated users can insert comments"
  ON comments FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id)
  WITH CHECK ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id);

-- Reviews policies
DROP POLICY IF EXISTS "Authenticated users can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

CREATE POLICY "Authenticated users can insert reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id)
  WITH CHECK ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id);

-- Discussions policies
DROP POLICY IF EXISTS "Authenticated users can create discussions" ON discussions;
DROP POLICY IF EXISTS "Users can update own discussions" ON discussions;
DROP POLICY IF EXISTS "Users can delete own discussions" ON discussions;

CREATE POLICY "Authenticated users can create discussions"
  ON discussions FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can update own discussions"
  ON discussions FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id)
  WITH CHECK ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can delete own discussions"
  ON discussions FOR DELETE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id);

-- Discussion replies policies
DROP POLICY IF EXISTS "Authenticated users can create replies" ON discussion_replies;
DROP POLICY IF EXISTS "Users can update own replies" ON discussion_replies;
DROP POLICY IF EXISTS "Users can delete own replies" ON discussion_replies;

CREATE POLICY "Authenticated users can create replies"
  ON discussion_replies FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can update own replies"
  ON discussion_replies FOR UPDATE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id)
  WITH CHECK ((select auth.uid())::VARCHAR = user_id);

CREATE POLICY "Users can delete own replies"
  ON discussion_replies FOR DELETE
  TO authenticated
  USING ((select auth.uid())::VARCHAR = user_id);

-- Sessions table - Enable RLS and add policy for system access
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Sessions should be accessible by the system/auth service
-- The application uses express-session which manages sessions server-side
-- RLS is enabled but we allow the service role to manage all sessions
CREATE POLICY "Service role can manage all sessions"
  ON sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);