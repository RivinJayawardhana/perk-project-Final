-- Create partner_applications table
CREATE TABLE IF NOT EXISTS partner_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT NOT NULL,
  offer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE partner_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Partner applications are public (SELECT)" ON partner_applications
  FOR SELECT USING (true);

CREATE POLICY "Anyone can submit partner application (INSERT)" ON partner_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view partner applications (SELECT)" ON partner_applications
  FOR SELECT USING (true);
