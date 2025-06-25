/*
  # Resume Drafts Table

  1. New Tables
    - `resume_drafts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text) - Draft name/title
      - `latex_content` (text) - LaTeX source code
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `resume_drafts` table
    - Add policies for users to manage their own drafts

  3. Indexes
    - Index on user_id for fast lookups
    - Index on updated_at for ordering
*/

CREATE TABLE IF NOT EXISTS resume_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  latex_content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE resume_drafts ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_resume_drafts_user_id ON resume_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_drafts_updated_at ON resume_drafts(updated_at DESC);

-- RLS Policies
CREATE POLICY "Users can view own drafts"
  ON resume_drafts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own drafts"
  ON resume_drafts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own drafts"
  ON resume_drafts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own drafts"
  ON resume_drafts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_resume_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_resume_drafts_updated_at
  BEFORE UPDATE ON resume_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_resume_drafts_updated_at();