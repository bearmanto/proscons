-- Add description and scheduling columns to questions
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS starts_at TIMESTAMPTZ DEFAULT NULL,
ADD COLUMN IF NOT EXISTS ends_at TIMESTAMPTZ DEFAULT NULL;

-- Index for efficient querying of active questions
CREATE INDEX IF NOT EXISTS idx_questions_active_schedule 
ON questions (is_active, starts_at, ends_at);
