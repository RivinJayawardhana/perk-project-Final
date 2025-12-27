-- Add slug column to subcategories (if it doesn't exist)
ALTER TABLE subcategories ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
CREATE UNIQUE INDEX IF NOT EXISTS idx_subcategories_slug ON subcategories(slug);

-- Fix Subcategories RLS Policies
DROP POLICY IF EXISTS "Subcategories are public" ON subcategories;

-- Create Subcategories policies - Full CRUD
CREATE POLICY "Subcategories are public (SELECT)" ON subcategories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create subcategories (INSERT)" ON subcategories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update subcategories (UPDATE)" ON subcategories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete subcategories (DELETE)" ON subcategories
  FOR DELETE USING (true);
