-- Create journals table
CREATE TABLE IF NOT EXISTS journals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image_url VARCHAR(255),
  author VARCHAR(255) DEFAULT 'Admin',
  category VARCHAR(255),
  tags TEXT[], -- Array of tags
  status VARCHAR(50) DEFAULT 'draft', -- 'draft' or 'published'
  is_featured BOOLEAN DEFAULT FALSE,
  publish_date TIMESTAMP,
  meta_title VARCHAR(255),
  meta_description VARCHAR(255),
  keywords VARCHAR(255),
  og_image_url VARCHAR(255),
  canonical_url VARCHAR(255),
  read_time VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_journals_slug ON journals(slug);
CREATE INDEX IF NOT EXISTS idx_journals_status ON journals(status);
CREATE INDEX IF NOT EXISTS idx_journals_publish_date ON journals(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_journals_category ON journals(category);

-- Enable RLS
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for journals" ON journals
  USING (true)
  WITH CHECK (true);
