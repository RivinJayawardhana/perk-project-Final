-- Add subcategory column to perks table
ALTER TABLE public.perks ADD COLUMN subcategory text null;

-- Add comment to describe the column
COMMENT ON COLUMN public.perks.subcategory IS 'UUID reference to subcategory or subcategory name';
