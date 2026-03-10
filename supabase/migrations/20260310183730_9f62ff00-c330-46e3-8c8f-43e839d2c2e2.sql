
-- Create is_female helper function
CREATE OR REPLACE FUNCTION public.is_female(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = _user_id AND gender = 'female'
  )
$$;

-- Fix 1: Drop open posts_select policy that bypasses women-only gender filter
DROP POLICY IF EXISTS "posts_select" ON public.posts;

-- Create gender-aware SELECT policy for posts
CREATE POLICY "posts_select_gender_filter"
ON public.posts FOR SELECT TO authenticated
USING (
  CASE WHEN women_only = true
    THEN user_id = auth.uid() OR public.is_female(auth.uid())
    ELSE true
  END
);

-- Fix 2: Drop open stories_select policy
DROP POLICY IF EXISTS "stories_select" ON public.stories;

-- Create gender-aware SELECT policy for stories
CREATE POLICY "stories_select_gender_filter"
ON public.stories FOR SELECT TO authenticated
USING (
  CASE WHEN women_only = true
    THEN user_id = auth.uid() OR public.is_female(auth.uid())
    ELSE true
  END
);

-- Fix 3: XP self-award exploit
CREATE TABLE IF NOT EXISTS public.xp_values (
  source text PRIMARY KEY,
  amount integer NOT NULL
);

ALTER TABLE public.xp_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "xp_values_select" ON public.xp_values FOR SELECT TO authenticated USING (true);

INSERT INTO public.xp_values (source, amount) VALUES
  ('workout_completed', 50),
  ('diet_logged', 30),
  ('water_goal', 20),
  ('streak_bonus_3', 25),
  ('streak_bonus_7', 75),
  ('streak_bonus_30', 200)
ON CONFLICT (source) DO UPDATE SET amount = EXCLUDED.amount;

DROP POLICY IF EXISTS "user_xp_insert" ON public.user_xp;
DROP POLICY IF EXISTS "Users can insert own xp" ON public.user_xp;

CREATE OR REPLACE FUNCTION public.award_xp(p_source text, p_description text DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_amount integer;
BEGIN
  SELECT amount INTO v_amount FROM public.xp_values WHERE source = p_source;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid XP source: %', p_source;
  END IF;
  INSERT INTO public.user_xp (user_id, amount, source, description)
  VALUES (auth.uid(), v_amount, p_source, COALESCE(p_description, p_source));
END;
$$;
