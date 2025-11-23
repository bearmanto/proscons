-- Add is_featured column to reasons table
ALTER TABLE reasons 
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Create an index for faster filtering of featured reasons
CREATE INDEX IF NOT EXISTS idx_reasons_is_featured ON reasons(is_featured);
