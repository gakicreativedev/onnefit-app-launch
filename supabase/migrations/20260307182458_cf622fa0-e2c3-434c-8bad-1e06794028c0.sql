
-- Fix security definer view
DROP VIEW IF EXISTS public.public_profiles;
CREATE VIEW public.public_profiles WITH (security_invoker = on) AS
SELECT user_id, name, username, avatar_url, goal, is_verified, is_private FROM public.profiles;

-- Social
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT, image_url TEXT, location TEXT, tags TEXT[] DEFAULT '{}',
    women_only BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "posts_select" ON public.posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "posts_insert" ON public.posts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "posts_update" ON public.posts FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "posts_delete" ON public.posts FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(), UNIQUE (post_id, user_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "post_likes_select" ON public.post_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "post_likes_insert" ON public.post_likes FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "post_likes_delete" ON public.post_likes FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "post_comments_select" ON public.post_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "post_comments_insert" ON public.post_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "post_comments_delete" ON public.post_comments FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.post_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(), UNIQUE (post_id, user_id)
);
ALTER TABLE public.post_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "post_bookmarks_select" ON public.post_bookmarks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "post_bookmarks_insert" ON public.post_bookmarks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "post_bookmarks_delete" ON public.post_bookmarks FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'accepted', created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (follower_id, following_id)
);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "follows_select" ON public.follows FOR SELECT TO authenticated USING (true);
CREATE POLICY "follows_insert" ON public.follows FOR INSERT TO authenticated WITH CHECK (follower_id = auth.uid());
CREATE POLICY "follows_update" ON public.follows FOR UPDATE TO authenticated USING (follower_id = auth.uid() OR following_id = auth.uid());
CREATE POLICY "follows_delete" ON public.follows FOR DELETE TO authenticated USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, post_id UUID, content TEXT,
    read BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (actor_id = auth.uid());
CREATE POLICY "notifications_update" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.direct_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL, read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dm_select" ON public.direct_messages FOR SELECT TO authenticated USING (sender_id = auth.uid() OR receiver_id = auth.uid());
CREATE POLICY "dm_insert" ON public.direct_messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());
CREATE POLICY "dm_update" ON public.direct_messages FOR UPDATE TO authenticated USING (receiver_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL, women_only BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "stories_select" ON public.stories FOR SELECT TO authenticated USING (true);
CREATE POLICY "stories_insert" ON public.stories FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "stories_delete" ON public.stories FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.story_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(), UNIQUE (story_id, user_id)
);
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "story_views_select" ON public.story_views FOR SELECT TO authenticated USING (true);
CREATE POLICY "story_views_insert" ON public.story_views FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.story_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    story_id UUID REFERENCES public.stories(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    emoji TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.story_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "story_reactions_select" ON public.story_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "story_reactions_insert" ON public.story_reactions FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "story_reactions_delete" ON public.story_reactions FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.profile_highlights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    label TEXT NOT NULL, icon TEXT DEFAULT '⭐',
    story_ids TEXT[] DEFAULT '{}', sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profile_highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "highlights_select" ON public.profile_highlights FOR SELECT TO authenticated USING (true);
CREATE POLICY "highlights_insert" ON public.profile_highlights FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "highlights_update" ON public.profile_highlights FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "highlights_delete" ON public.profile_highlights FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Gamification
CREATE TABLE IF NOT EXISTS public.user_xp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL, source TEXT NOT NULL, description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_xp_select" ON public.user_xp FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "user_xp_insert" ON public.user_xp FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    current_streak INTEGER DEFAULT 0, longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE, updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "streaks_select" ON public.user_streaks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "streaks_insert" ON public.user_streaks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "streaks_update" ON public.user_streaks FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    badge_type TEXT NOT NULL, badge_name TEXT NOT NULL, badge_icon TEXT,
    metadata JSONB DEFAULT '{}', created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "badges_select" ON public.user_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "badges_insert" ON public.user_badges FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- Diet
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL, total_calories NUMERIC DEFAULT 0,
    is_shared BOOLEAN DEFAULT false, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_plans_select" ON public.meal_plans FOR SELECT TO authenticated USING (user_id = auth.uid() OR is_shared = true);
CREATE POLICY "meal_plans_insert" ON public.meal_plans FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "meal_plans_update" ON public.meal_plans FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "meal_plans_delete" ON public.meal_plans FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_plan_id UUID REFERENCES public.meal_plans(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL, meal_time TEXT, calories NUMERIC DEFAULT 0,
    protein NUMERIC DEFAULT 0, carbs NUMERIC DEFAULT 0, fat NUMERIC DEFAULT 0
);
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meals_select" ON public.meals FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.meal_plans mp WHERE mp.id = meal_plan_id AND (mp.user_id = auth.uid() OR mp.is_shared = true))
);
CREATE POLICY "meals_insert" ON public.meals FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.meal_plans mp WHERE mp.id = meal_plan_id AND mp.user_id = auth.uid())
);
CREATE POLICY "meals_delete" ON public.meals FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.meal_plans mp WHERE mp.id = meal_plan_id AND mp.user_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS public.user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE, workout_completed BOOLEAN DEFAULT false,
    water_intake_ml INTEGER DEFAULT 0, UNIQUE (user_id, date)
);
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity_select" ON public.user_activity FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "activity_insert" ON public.user_activity FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "activity_update" ON public.user_activity FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Recipes
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL, description TEXT, image_url TEXT, prep_time_min INTEGER,
    calories NUMERIC, protein NUMERIC, carbs NUMERIC, fat NUMERIC, category TEXT,
    ingredients JSONB DEFAULT '[]', steps JSONB DEFAULT '[]',
    is_shared BOOLEAN DEFAULT true, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recipes_select" ON public.recipes FOR SELECT TO authenticated USING (true);
CREATE POLICY "recipes_insert" ON public.recipes FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());
CREATE POLICY "recipes_update" ON public.recipes FOR UPDATE TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "recipes_delete" ON public.recipes FOR DELETE TO authenticated USING (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.recipe_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL, UNIQUE (recipe_id, user_id)
);
ALTER TABLE public.recipe_ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ratings_select" ON public.recipe_ratings FOR SELECT TO authenticated USING (true);
CREATE POLICY "ratings_insert" ON public.recipe_ratings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "ratings_update" ON public.recipe_ratings FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.recipe_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.recipe_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recipe_comments_select" ON public.recipe_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "recipe_comments_insert" ON public.recipe_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "recipe_comments_delete" ON public.recipe_comments FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.community_foods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, calories NUMERIC DEFAULT 0, protein NUMERIC DEFAULT 0,
    carbs NUMERIC DEFAULT 0, fat NUMERIC DEFAULT 0, serving_size TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.community_foods ENABLE ROW LEVEL SECURITY;
CREATE POLICY "community_foods_select" ON public.community_foods FOR SELECT TO authenticated USING (true);
CREATE POLICY "community_foods_insert" ON public.community_foods FOR INSERT TO authenticated WITH CHECK (created_by = auth.uid());

-- Workouts
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL, description TEXT, muscle_groups TEXT[], difficulty TEXT,
    duration_minutes INTEGER, is_shared BOOLEAN DEFAULT false,
    day_of_week INTEGER, created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "workouts_select" ON public.workouts FOR SELECT TO authenticated USING (true);
CREATE POLICY "workouts_insert" ON public.workouts FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "workouts_update" ON public.workouts FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "workouts_delete" ON public.workouts FOR DELETE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    exercise_name TEXT NOT NULL, sets INTEGER DEFAULT 3, reps INTEGER DEFAULT 12,
    rest_seconds INTEGER DEFAULT 60, sort_order INTEGER DEFAULT 0, media_url TEXT
);
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "we_select" ON public.workout_exercises FOR SELECT TO authenticated USING (true);
CREATE POLICY "we_insert" ON public.workout_exercises FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "we_update" ON public.workout_exercises FOR UPDATE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "we_delete" ON public.workout_exercises FOR DELETE TO authenticated USING (
    EXISTS (SELECT 1 FROM public.workouts w WHERE w.id = workout_id AND (w.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);

CREATE TABLE IF NOT EXISTS public.workout_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
    workout_name TEXT NOT NULL, completed_at TIMESTAMPTZ DEFAULT now(),
    duration_minutes INTEGER, notes TEXT
);
ALTER TABLE public.workout_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wh_select" ON public.workout_history FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "wh_insert" ON public.workout_history FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "wh_delete" ON public.workout_history FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.exercise_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    history_id UUID REFERENCES public.workout_history(id) ON DELETE CASCADE NOT NULL,
    exercise_name TEXT NOT NULL, set_number INTEGER NOT NULL,
    reps INTEGER NOT NULL, weight_kg NUMERIC DEFAULT 0
);
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "el_select" ON public.exercise_logs FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.workout_history wh WHERE wh.id = history_id AND wh.user_id = auth.uid())
);
CREATE POLICY "el_insert" ON public.exercise_logs FOR INSERT TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM public.workout_history wh WHERE wh.id = history_id AND wh.user_id = auth.uid())
);

CREATE TABLE IF NOT EXISTS public.workout_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(), UNIQUE (user_id, workout_id)
);
ALTER TABLE public.workout_bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wb_select" ON public.workout_bookmarks FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "wb_insert" ON public.workout_bookmarks FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "wb_delete" ON public.workout_bookmarks FOR DELETE TO authenticated USING (user_id = auth.uid());

-- App updates
CREATE TABLE IF NOT EXISTS public.app_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL, content TEXT, version TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.app_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "updates_select" ON public.app_updates FOR SELECT TO authenticated USING (true);
CREATE POLICY "updates_insert" ON public.app_updates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "updates_update" ON public.app_updates FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "updates_delete" ON public.app_updates FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Functions
CREATE OR REPLACE FUNCTION public.are_mutual_followers(user_a UUID, user_b UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.follows WHERE follower_id = user_a AND following_id = user_b AND status = 'accepted')
  AND EXISTS (SELECT 1 FROM public.follows WHERE follower_id = user_b AND following_id = user_a AND status = 'accepted')
$$;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.direct_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('social', 'social', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('progress-photos', 'progress-photos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('recipe-images', 'recipe-images', true) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "avatars_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "avatars_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'avatars');
CREATE POLICY "avatars_update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "social_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'social');
CREATE POLICY "social_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'social');
CREATE POLICY "progress_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "progress_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'progress-photos');
CREATE POLICY "progress_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'progress-photos' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "recipe_upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'recipe-images');
CREATE POLICY "recipe_select" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'recipe-images');
