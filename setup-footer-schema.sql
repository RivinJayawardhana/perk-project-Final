-- Create footer_content table
CREATE TABLE IF NOT EXISTS footer_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  social_links JSONB DEFAULT NULL,
  footer_links JSONB DEFAULT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE footer_content ENABLE ROW LEVEL SECURITY;

-- Create policies for footer_content
CREATE POLICY "Footer content is public (SELECT)" ON footer_content
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create footer content (INSERT)" ON footer_content
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update footer content (UPDATE)" ON footer_content
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete footer content (DELETE)" ON footer_content
  FOR DELETE USING (true);
