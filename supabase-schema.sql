-- Create perks table
CREATE TABLE perks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  discount TEXT,
  expiry DATE,
  location TEXT DEFAULT 'Global',
  status TEXT DEFAULT 'Active',
  image_url TEXT,
  logo_url TEXT,
  deal_type TEXT,
  best_for TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create subcategories table
CREATE TABLE subcategories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create journal_posts table
CREATE TABLE journal_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  author TEXT,
  slug TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create page_content table for dynamic pages
CREATE TABLE page_content (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_name TEXT NOT NULL UNIQUE,
  content TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_perks_category ON perks(category);
CREATE INDEX idx_perks_created_at ON perks(created_at DESC);
CREATE INDEX idx_journal_slug ON journal_posts(slug);
CREATE INDEX idx_subcategories_category ON subcategories(category_id);

-- Enable RLS (Row Level Security)
ALTER TABLE perks ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- Perks policies
CREATE POLICY "Perks are public (SELECT)" ON perks
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create perks (INSERT)" ON perks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update perks (UPDATE)" ON perks
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete perks (DELETE)" ON perks
  FOR DELETE USING (true);

-- Categories policies
CREATE POLICY "Categories are public (SELECT)" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create categories (INSERT)" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update categories (UPDATE)" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete categories (DELETE)" ON categories
  FOR DELETE USING (true);

-- Subcategories policies
CREATE POLICY "Subcategories are public (SELECT)" ON subcategories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create subcategories (INSERT)" ON subcategories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update subcategories (UPDATE)" ON subcategories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete subcategories (DELETE)" ON subcategories
  FOR DELETE USING (true);

-- Journal posts policies
CREATE POLICY "Journal posts are public (SELECT)" ON journal_posts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create journal posts (INSERT)" ON journal_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update journal posts (UPDATE)" ON journal_posts
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete journal posts (DELETE)" ON journal_posts
  FOR DELETE USING (true);

-- Contact submissions policies
CREATE POLICY "Anyone can submit contact form (INSERT)" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Contact submissions are readable (SELECT)" ON contact_submissions
  FOR SELECT USING (true);

-- Page content policies
CREATE POLICY "Page content is public (SELECT)" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update page content (UPDATE)" ON page_content
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can create page content (INSERT)" ON page_content
  FOR INSERT WITH CHECK (true);
