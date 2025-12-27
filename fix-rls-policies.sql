-- Drop old policies that don't allow writes
DROP POLICY IF EXISTS "Perks are public" ON perks;
DROP POLICY IF EXISTS "Categories are public" ON categories;
DROP POLICY IF EXISTS "Subcategories are public" ON subcategories;
DROP POLICY IF EXISTS "Journal posts are public" ON journal_posts;
DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;
DROP POLICY IF EXISTS "Page content is public" ON page_content;

-- Perks policies - Full CRUD
CREATE POLICY "Perks are public (SELECT)" ON perks
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create perks (INSERT)" ON perks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update perks (UPDATE)" ON perks
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete perks (DELETE)" ON perks
  FOR DELETE USING (true);

-- Categories policies - Full CRUD
CREATE POLICY "Categories are public (SELECT)" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create categories (INSERT)" ON categories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update categories (UPDATE)" ON categories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete categories (DELETE)" ON categories
  FOR DELETE USING (true);

-- Subcategories policies - Full CRUD
CREATE POLICY "Subcategories are public (SELECT)" ON subcategories
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create subcategories (INSERT)" ON subcategories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update subcategories (UPDATE)" ON subcategories
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete subcategories (DELETE)" ON subcategories
  FOR DELETE USING (true);

-- Journal posts policies - Full CRUD
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

-- Page content policies - Full CRUD
CREATE POLICY "Page content is public (SELECT)" ON page_content
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update page content (UPDATE)" ON page_content
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can create page content (INSERT)" ON page_content
  FOR INSERT WITH CHECK (true);
