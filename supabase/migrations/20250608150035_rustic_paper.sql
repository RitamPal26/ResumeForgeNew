/*
  # Create API cache table for storing external API responses

  1. New Tables
    - `api_cache`
      - `id` (uuid, primary key)
      - `cache_key` (text, unique) - Unique identifier for cached data
      - `data` (jsonb) - Cached response data
      - `created_at` (timestamp)
      - `expires_at` (timestamp) - When the cache entry expires

  2. Security
    - Enable RLS on `api_cache` table
    - Add policies for authenticated users to manage cache entries

  3. Indexes
    - Index on cache_key for fast lookups
    - Index on expires_at for cleanup operations
*/

CREATE TABLE IF NOT EXISTS api_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key text UNIQUE NOT NULL,
  data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

ALTER TABLE api_cache ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_api_cache_expires_at ON api_cache(expires_at);

-- RLS Policies
CREATE POLICY "Users can read cached data"
  ON api_cache
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert cached data"
  ON api_cache
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update cached data"
  ON api_cache
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete cached data"
  ON api_cache
  FOR DELETE
  TO authenticated
  USING (true);

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION cleanup_expired_api_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM api_cache
  WHERE expires_at < now();
END;
$$;

-- Create a scheduled job to run cleanup (if pg_cron is available)
-- This would typically be set up separately in production
COMMENT ON FUNCTION cleanup_expired_api_cache() IS 'Removes expired API cache entries';