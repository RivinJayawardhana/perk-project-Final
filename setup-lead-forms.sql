-- Create lead_forms table to store form configurations
CREATE TABLE IF NOT EXISTS lead_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perk_id UUID UNIQUE NOT NULL REFERENCES perks(id) ON DELETE CASCADE,
  form_fields JSONB NOT NULL DEFAULT '[]',
  submit_button_text VARCHAR(255) DEFAULT 'Submit',
  success_message TEXT DEFAULT 'Thank you for your interest! We will contact you soon.',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create leads table to store submitted lead data
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  perk_id UUID NOT NULL REFERENCES perks(id) ON DELETE CASCADE,
  lead_form_id UUID REFERENCES lead_forms(id) ON DELETE CASCADE,
  form_data JSONB NOT NULL,
  email_address VARCHAR(255),
  submission_timestamp TIMESTAMP DEFAULT NOW(),
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add lead_form_id column to perks table if it doesn't exist
ALTER TABLE perks ADD COLUMN IF NOT EXISTS lead_form_id UUID REFERENCES lead_forms(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_lead_forms_perk_id ON lead_forms(perk_id);
CREATE INDEX IF NOT EXISTS idx_leads_perk_id ON leads(perk_id);
CREATE INDEX IF NOT EXISTS idx_leads_form_id ON leads(lead_form_id);
CREATE INDEX IF NOT EXISTS idx_leads_submission_timestamp ON leads(submission_timestamp DESC);

-- Enable RLS for lead_forms table
ALTER TABLE lead_forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for lead_forms" ON lead_forms
  USING (true)
  WITH CHECK (true);

-- Enable RLS for leads table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations for leads" ON leads
  USING (true)
  WITH CHECK (true);
