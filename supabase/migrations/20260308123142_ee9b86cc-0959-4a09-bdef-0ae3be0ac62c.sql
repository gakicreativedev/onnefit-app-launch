
-- Table to track AI usage per user
CREATE TABLE public.ai_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  usage_type text NOT NULL DEFAULT 'query',
  function_name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for fast monthly lookups
CREATE INDEX idx_ai_usage_user_month ON public.ai_usage (user_id, created_at);

-- Table to store user subscription plans
CREATE TABLE public.user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  plan text NOT NULL DEFAULT 'free',
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS for ai_usage
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_usage_select" ON public.ai_usage
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "ai_usage_insert" ON public.ai_usage
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- RLS for user_subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subscriptions_select" ON public.user_subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "subscriptions_admin" ON public.user_subscriptions
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Function to check AI usage limits (SECURITY DEFINER to bypass RLS)
CREATE OR REPLACE FUNCTION public.check_ai_limit(_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _plan text;
  _limit int;
  _used int;
BEGIN
  -- Get user plan (default free)
  SELECT COALESCE(plan, 'free') INTO _plan
  FROM public.user_subscriptions
  WHERE user_id = _user_id;

  IF _plan IS NULL THEN
    _plan := 'free';
  END IF;

  -- Set limits per plan
  CASE _plan
    WHEN 'free' THEN _limit := 3;
    WHEN 'essential' THEN _limit := 15;
    WHEN 'pro' THEN _limit := 50;
    WHEN 'premium' THEN _limit := -1; -- unlimited
    ELSE _limit := 3;
  END CASE;

  -- Count usage this month
  SELECT COUNT(*) INTO _used
  FROM public.ai_usage
  WHERE user_id = _user_id
    AND created_at >= date_trunc('month', now());

  RETURN jsonb_build_object(
    'plan', _plan,
    'limit', _limit,
    'used', _used,
    'allowed', CASE WHEN _limit = -1 THEN true ELSE _used < _limit END
  );
END;
$$;

-- Auto-create free subscription for new users (add to existing trigger function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'athlete');

  INSERT INTO public.user_subscriptions (user_id, plan)
  VALUES (NEW.id, 'free');

  RETURN NEW;
END;
$$;
