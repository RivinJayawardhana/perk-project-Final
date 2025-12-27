-- Add deal_url column to perks table if it doesn't exist
ALTER TABLE perks ADD COLUMN IF NOT EXISTS deal_url TEXT;
