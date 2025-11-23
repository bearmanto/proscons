-- Add new badges to the badges table if they don't exist
INSERT INTO badges (code, name, description, icon, color) VALUES
('night_owl', 'Night Owl', 'Vote between 1 AM and 4 AM.', 'Moon', 'indigo'),
('early_bird', 'Early Bird', 'Be among the first 10 voters on a question.', 'Sunrise', 'orange'),
('trendsetter', 'Trendsetter', 'Vote for the winning side while it was losing.', 'TrendingUp', 'emerald'),
('contrarian', 'Contrarian', 'Submit a top-voted reason for the minority side.', 'GitCompare', 'rose')
ON CONFLICT (code) DO NOTHING;

-- Update the handle_new_vote function to include new badge logic
CREATE OR REPLACE FUNCTION handle_new_vote()
RETURNS TRIGGER AS $$
DECLARE
  v_count INTEGER;
  v_hour INTEGER;
BEGIN
  -- 1. First Vote Badge
  SELECT count(*) INTO v_count FROM votes WHERE uid = NEW.uid;
  IF v_count = 1 THEN
    INSERT INTO user_badges (uid, badge_code)
    VALUES (NEW.uid, 'first_vote')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 2. Night Owl (Vote between 1AM and 4AM local time - assuming UTC+7 for ID)
  -- Adjust timezone as needed. Here we use the server time + 7 hours for WIB.
  v_hour := EXTRACT(HOUR FROM (NOW() AT TIME ZONE 'UTC' + INTERVAL '7 hours'));
  IF v_hour >= 1 AND v_hour < 4 THEN
    INSERT INTO user_badges (uid, badge_code)
    VALUES (NEW.uid, 'night_owl')
    ON CONFLICT DO NOTHING;
  END IF;

  -- 3. Early Bird (First 10 voters on this question)
  SELECT count(*) INTO v_count FROM votes WHERE question_id = NEW.question_id;
  IF v_count <= 10 THEN
    INSERT INTO user_badges (uid, badge_code)
    VALUES (NEW.uid, 'early_bird')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
