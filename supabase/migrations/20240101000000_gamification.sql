-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- For logged in users
  uid TEXT, -- For anonymous users
  badge_id TEXT NOT NULL,
  awarded_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_id),
  UNIQUE(uid, badge_id)
);

-- Enable RLS
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read badges
CREATE POLICY "Public read access" ON user_badges
  FOR SELECT USING (true);

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_badges() RETURNS TRIGGER AS $$
DECLARE
  v_user_id UUID;
  v_uid TEXT;
  v_count INT;
BEGIN
  -- Determine user context
  IF TG_TABLE_NAME = 'reason_votes' THEN
    v_user_id := NEW.user_id;
    v_uid := NEW.uid;
  ELSIF TG_TABLE_NAME = 'reasons' THEN
    v_user_id := NEW.user_id;
    v_uid := NEW.user_key; -- reasons table uses user_key for anonymous
  END IF;

  -- 1. Pioneer Badge (First Vote)
  IF TG_TABLE_NAME = 'reason_votes' THEN
    -- Check if badge already exists
    IF NOT EXISTS (
      SELECT 1 FROM user_badges 
      WHERE badge_id = 'pioneer' 
      AND (
        (v_user_id IS NOT NULL AND user_id = v_user_id) OR 
        (v_uid IS NOT NULL AND uid = v_uid)
      )
    ) THEN
      -- Award badge
      INSERT INTO user_badges (user_id, uid, badge_id)
      VALUES (v_user_id, v_uid, 'pioneer');
    END IF;
  END IF;

  -- 2. Thinker Badge (10 Votes)
  IF TG_TABLE_NAME = 'reason_votes' THEN
    SELECT COUNT(*) INTO v_count FROM reason_votes
    WHERE (v_user_id IS NOT NULL AND user_id = v_user_id) 
       OR (v_uid IS NOT NULL AND uid = v_uid);
    
    IF v_count >= 10 THEN
       IF NOT EXISTS (
        SELECT 1 FROM user_badges 
        WHERE badge_id = 'thinker' 
        AND (
          (v_user_id IS NOT NULL AND user_id = v_user_id) OR 
          (v_uid IS NOT NULL AND uid = v_uid)
        )
      ) THEN
        INSERT INTO user_badges (user_id, uid, badge_id)
        VALUES (v_user_id, v_uid, 'thinker');
      END IF;
    END IF;
  END IF;

  -- 3. Vocal Badge (5 Reasons)
  IF TG_TABLE_NAME = 'reasons' THEN
    SELECT COUNT(*) INTO v_count FROM reasons
    WHERE (v_user_id IS NOT NULL AND user_id = v_user_id) 
       OR (v_uid IS NOT NULL AND user_key = v_uid);
    
    IF v_count >= 5 THEN
       IF NOT EXISTS (
        SELECT 1 FROM user_badges 
        WHERE badge_id = 'vocal' 
        AND (
          (v_user_id IS NOT NULL AND user_id = v_user_id) OR 
          (v_uid IS NOT NULL AND uid = v_uid)
        )
      ) THEN
        INSERT INTO user_badges (user_id, uid, badge_id)
        VALUES (v_user_id, v_uid, 'vocal');
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
DROP TRIGGER IF EXISTS on_vote_badge ON reason_votes;
CREATE TRIGGER on_vote_badge
  AFTER INSERT ON reason_votes
  FOR EACH ROW
  EXECUTE FUNCTION check_badges();

DROP TRIGGER IF EXISTS on_reason_badge ON reasons;
CREATE TRIGGER on_reason_badge
  AFTER INSERT ON reasons
  FOR EACH ROW
  EXECUTE FUNCTION check_badges();
