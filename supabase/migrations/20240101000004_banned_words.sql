-- Create banned_words table
CREATE TABLE IF NOT EXISTS banned_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE banned_words ENABLE ROW LEVEL SECURITY;

-- Policy: Public read access (needed for API check, or we can keep it private and use service role)
-- Let's keep it private and use service role in API to prevent users from scraping the list easily
CREATE POLICY "Admin full access" ON banned_words
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed initial words
INSERT INTO banned_words (word) VALUES
('fuck'), ('shit'), ('bitch'), ('asshole'), ('dick'), ('pussy'), ('whore'), ('slut'), ('bastard'),
('anjing'), ('babi'), ('monyet'), ('bangsat'), ('kontol'), ('memek'), ('jembut'), ('ngentot'), ('tolol'), ('goblok'), ('bodoh'), ('pantek'), ('perek'), ('lonte')
ON CONFLICT (word) DO NOTHING;
