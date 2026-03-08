
-- 1. Create exercises table for the exercise library
CREATE TABLE public.exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text,
  muscle_groups text[] DEFAULT '{}',
  image_url text,
  description text,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercises_select" ON public.exercises FOR SELECT USING (true);
CREATE POLICY "exercises_admin_insert" ON public.exercises FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "exercises_admin_update" ON public.exercises FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "exercises_admin_delete" ON public.exercises FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 2. Add is_official column to groups
ALTER TABLE public.groups ADD COLUMN IF NOT EXISTS is_official boolean DEFAULT false;

-- 3. Admin can delete any post
CREATE POLICY "posts_admin_delete" ON public.posts FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 4. Admin can manage all groups
CREATE POLICY "groups_admin_select" ON public.groups FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "groups_admin_update" ON public.groups FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "groups_admin_delete" ON public.groups FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- 5. Create exercise-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('exercise-images', 'exercise-images', true) ON CONFLICT DO NOTHING;

CREATE POLICY "exercise_images_select" ON storage.objects FOR SELECT USING (bucket_id = 'exercise-images');
CREATE POLICY "exercise_images_admin_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'exercise-images' AND has_role(auth.uid(), 'admin'));
CREATE POLICY "exercise_images_admin_delete" ON storage.objects FOR DELETE USING (bucket_id = 'exercise-images' AND has_role(auth.uid(), 'admin'));
