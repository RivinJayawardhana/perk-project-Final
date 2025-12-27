-- Create submission_logs table for rate limiting
CREATE TABLE IF NOT EXISTS submission_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for efficient rate limiting queries
CREATE INDEX IF NOT EXISTS idx_submission_logs_ip_endpoint_created 
ON submission_logs(ip, endpoint, created_at DESC);

-- Enable RLS
ALTER TABLE submission_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage submission_logs
CREATE POLICY "Service role can insert submission logs"
  ON submission_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can select submission logs"
  ON submission_logs FOR SELECT
  USING (true);

-- Optional: Create cleanup policy to delete logs older than 2 days
CREATE OR REPLACE FUNCTION cleanup_old_submission_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM submission_logs
  WHERE created_at < now() - interval '2 days';
END;
$$ LANGUAGE plpgsql;
