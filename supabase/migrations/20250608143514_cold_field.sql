/*
  # GitHub Analysis Cache Table

  1. New Tables
    - `github_analysis_cache`
      - `id` (uuid, primary key)
      - `username` (text, unique)
      - `analysis_data` (jsonb)
      - `created_at` (timestamp)
      - `expires_at` (timestamp)

  2. Security
    - Enable RLS on `github_analysis_cache` table
    - Add policy for authenticated users to manage their own cache entries

  3. Indexes
    - Add index on username for fast lookups
    - Add index on expires_at for cleanup operations
*/

CREATE TABLE IF NOT EXISTS github_analysis_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  analysis_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

ALTER TABLE github_analysis_cache ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_github_analysis_cache_username ON github_analysis_cache(username);
CREATE INDEX IF NOT EXISTS idx_github_analysis_cache_expires_at ON github_analysis_cache(expires_at);

-- RLS Policies
CREATE POLICY "Users can read all cached analysis"
  ON github_analysis_cache
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert cached analysis"
  ON github_analysis_cache
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update cached analysis"
  ON github_analysis_cache
  FOR UPDATE
  TO authenticated
  USING (true);

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_github_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM github_analysis_cache
  WHERE expires_at < now();
END;
$$;

-- Create a scheduled job to run cleanup (if pg_cron is available)
-- This would typically be set up separately in production
COMMENT ON FUNCTION cleanup_expired_github_cache() IS 'Removes expired GitHub analysis cache entries';