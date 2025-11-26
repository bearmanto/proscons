-- Add parent_id for nested arguments
ALTER TABLE reasons 
ADD COLUMN parent_id UUID REFERENCES reasons(id),
ADD COLUMN impact INTEGER DEFAULT 1 CHECK (impact >= 1 AND impact <= 5);

-- Create index for parent_id to speed up tree lookups
CREATE INDEX idx_reasons_parent_id ON reasons(parent_id);

-- Update RLS policies if necessary (existing policies should cover new columns for read/write if they are row-based)
-- But we might want to ensure that a reason's side matches the parent's side logic?
-- For Kialo, usually:
-- If Parent is PRO, a PRO child supports it, a CON child opposes it.
-- This logic is application-level usually.

-- Add a function to get the full tree (optional, but helpful for deep nesting)
-- For now, we'll fetch recursively or just fetch all for a question and build tree in JS.
