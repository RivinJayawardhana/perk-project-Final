-- Add location and status columns to perks table if they don't exist
ALTER TABLE perks ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'Global';
ALTER TABLE perks ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Active';
