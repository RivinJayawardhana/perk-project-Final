-- Step 1: Create storage bucket for perk images
-- Go to Supabase Dashboard > Storage > Create New Bucket
-- Bucket Name: perk-images
-- Public/Private: Public
-- File size limit: 50MB

-- Step 2: Copy this SQL and run it in Supabase SQL Editor

-- Create RLS policies for public perk-images bucket
CREATE POLICY "Anyone can view perk images" ON storage.objects
  FOR SELECT USING (bucket_id = 'perk-images');

CREATE POLICY "Anyone can upload to perk-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'perk-images');

CREATE POLICY "Anyone can update perk-images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'perk-images');

CREATE POLICY "Anyone can delete perk-images" ON storage.objects
  FOR DELETE USING (bucket_id = 'perk-images');

-- Verify bucket exists
SELECT * FROM storage.buckets WHERE name = 'perk-images';
