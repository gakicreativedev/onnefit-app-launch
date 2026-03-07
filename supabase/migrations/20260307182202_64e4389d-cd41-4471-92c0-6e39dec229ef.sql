
-- Create group_members table FIRST (before the function that references it)
CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Security definer function to check membership without RLS recursion
CREATE OR REPLACE FUNCTION public.is_group_member(_group_id UUID, _user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.group_members WHERE group_id = _group_id AND user_id = _user_id)
$$;

-- Now create groups table
CREATE TABLE IF NOT EXISTS public.groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_public BOOLEAN DEFAULT true,
    invite_code TEXT DEFAULT substr(md5(random()::text), 1, 8),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    max_members INTEGER,
    group_type TEXT DEFAULT 'club',
    start_date DATE,
    end_date DATE,
    start_of_week INTEGER DEFAULT 1,
    score_rules JSONB DEFAULT '{"type": "per_workout", "value": 1}',
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public groups" ON public.groups FOR SELECT TO authenticated USING (is_public = true OR created_by = auth.uid() OR public.is_group_member(id, auth.uid()));
CREATE POLICY "Users can create groups" ON public.groups FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "Creators can update groups" ON public.groups FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Creators can delete groups" ON public.groups FOR DELETE TO authenticated USING (created_by = auth.uid());

-- Add FK to group_members now that groups exists
ALTER TABLE public.group_members ADD CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;

-- RLS policies for group_members
CREATE POLICY "Members can view group members" ON public.group_members FOR SELECT TO authenticated USING (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Members can update membership" ON public.group_members FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.is_group_member(group_id, auth.uid()));
CREATE POLICY "Members can leave groups" ON public.group_members FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Group invites
CREATE TABLE IF NOT EXISTS public.group_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    invited_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    invited_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (group_id, invited_user_id)
);

ALTER TABLE public.group_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own invites" ON public.group_invites FOR SELECT TO authenticated USING (invited_user_id = auth.uid() OR invited_by = auth.uid());
CREATE POLICY "Members can invite" ON public.group_invites FOR INSERT TO authenticated WITH CHECK (true);

-- Group messages
CREATE TABLE IF NOT EXISTS public.group_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view messages" ON public.group_messages FOR SELECT TO authenticated USING (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "Members can send messages" ON public.group_messages FOR INSERT TO authenticated WITH CHECK (public.is_group_member(group_id, auth.uid()));

-- Group activities
CREATE TABLE IF NOT EXISTS public.group_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT,
    photo_url TEXT,
    image_url TEXT,
    description TEXT,
    distance_km NUMERIC,
    duration_min NUMERIC,
    calories NUMERIC,
    steps INTEGER,
    custom_rule_label TEXT,
    points_awarded NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.group_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view activities" ON public.group_activities FOR SELECT TO authenticated USING (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "Members can submit activities" ON public.group_activities FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.is_group_member(group_id, auth.uid()));

-- Group activity reactions
CREATE TABLE IF NOT EXISTS public.group_activity_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES public.group_activities(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (activity_id, user_id, emoji)
);

ALTER TABLE public.group_activity_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view reactions" ON public.group_activity_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own reactions" ON public.group_activity_reactions FOR ALL TO authenticated USING (user_id = auth.uid());

-- Group activity comments
CREATE TABLE IF NOT EXISTS public.group_activity_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES public.group_activities(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.group_activity_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view activity comments" ON public.group_activity_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own activity comments" ON public.group_activity_comments FOR ALL TO authenticated USING (user_id = auth.uid());

-- Group rankings
CREATE TABLE IF NOT EXISTS public.group_rankings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    period_type TEXT NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    days_trained INTEGER DEFAULT 0,
    days_diet_logged INTEGER DEFAULT 0,
    streak_best INTEGER DEFAULT 0,
    water_goal_days INTEGER DEFAULT 0,
    total_score NUMERIC DEFAULT 0,
    rank_position INTEGER DEFAULT 0,
    calculated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.group_rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view rankings" ON public.group_rankings FOR SELECT TO authenticated USING (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "System can manage rankings" ON public.group_rankings FOR ALL TO authenticated USING (true);

-- Group goals
CREATE TABLE IF NOT EXISTS public.group_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    target_value NUMERIC NOT NULL,
    metric_type TEXT NOT NULL,
    deadline DATE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.group_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view goals" ON public.group_goals FOR SELECT TO authenticated USING (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "Members can manage goals" ON public.group_goals FOR ALL TO authenticated USING (public.is_group_member(group_id, auth.uid()));

-- Group resources
CREATE TABLE IF NOT EXISTS public.group_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    description TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.group_resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view resources" ON public.group_resources FOR SELECT TO authenticated USING (public.is_group_member(group_id, auth.uid()));
CREATE POLICY "Members can manage resources" ON public.group_resources FOR ALL TO authenticated USING (public.is_group_member(group_id, auth.uid()));

-- Enable realtime for group messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_messages;
