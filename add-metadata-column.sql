-- Add metadata column to footer_content table
ALTER TABLE footer_content
ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;

-- If the column already exists and you want to replace it, use this instead:
-- ALTER TABLE footer_content
-- DROP COLUMN IF EXISTS metadata;
-- ALTER TABLE footer_content
-- ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
