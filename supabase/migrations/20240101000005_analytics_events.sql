-- Create events table for privacy-friendly analytics
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Service role only (Server Actions will use supabaseAdmin)
CREATE POLICY "Service role full access" ON events
  TO service_role
  USING (true)
  WITH CHECK (true);
