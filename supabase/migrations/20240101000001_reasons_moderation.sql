-- Add deleted_at column for soft delete
ALTER TABLE reasons 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- Update RLS policy to only show non-deleted reasons to public
-- (Assuming existing policy is "Public read access")
-- We can either update the policy OR just filter in the API. 
-- Filtering in API is safer for now to avoid breaking existing clients if they rely on RLS 
-- but generally RLS is better. Let's stick to API filtering for simplicity as per plan.
