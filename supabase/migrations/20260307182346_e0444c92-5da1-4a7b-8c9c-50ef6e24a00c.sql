
-- Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT,
    username TEXT UNIQUE,
    age INTEGER,
    date_of_birth DATE,
    gender TEXT,
    height_cm NUMERIC,
    weight_kg NUMERIC,
    activity_level TEXT DEFAULT 'moderate',
    goal TEXT DEFAULT 'maintain',
    bmr NUMERIC,
    calorie_target NUMERIC,
    onboarding_completed BOOLEAN DEFAULT false,
    avatar_url TEXT,
    injuries TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    dietary_restrictions TEXT[] DEFAULT '{}',
    bio TEXT,
    username_changed_at JSONB DEFAULT '[]',
    is_verified BOOLEAN DEFAULT false,
    is_private BOOLEAN DEFAULT false,
    theme_color TEXT DEFAULT 'blue',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE VIEW public.public_profiles AS
SELECT user_id, name, username, avatar_url, goal, is_verified, is_private FROM public.profiles;

-- User roles (table MUST exist before has_role function)
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_roles_admin" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Fix group RLS warnings
DROP POLICY IF EXISTS "System can manage rankings" ON public.group_rankings;
CREATE POLICY "group_rankings_insert" ON public.group_rankings FOR INSERT TO authenticated WITH CHECK (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "group_rankings_update" ON public.group_rankings FOR UPDATE TO authenticated USING (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "group_rankings_delete" ON public.group_rankings FOR DELETE TO authenticated USING (public.is_group_member(group_id, auth.uid()));

DROP POLICY IF EXISTS "Members can invite" ON public.group_invites;
CREATE POLICY "group_invites_insert" ON public.group_invites FOR INSERT TO authenticated WITH CHECK (public.is_group_member(group_id, auth.uid()));
