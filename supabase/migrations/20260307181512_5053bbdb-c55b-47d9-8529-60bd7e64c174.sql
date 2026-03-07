
-- Create body_measurements table
CREATE TABLE IF NOT EXISTS public.body_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC,
    body_fat_pct NUMERIC,
    waist_cm NUMERIC,
    hip_cm NUMERIC,
    chest_cm NUMERIC,
    arm_left_cm NUMERIC,
    arm_right_cm NUMERIC,
    thigh_left_cm NUMERIC,
    thigh_right_cm NUMERIC,
    neck_cm NUMERIC,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own measurements"
ON public.body_measurements FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own measurements"
ON public.body_measurements FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own measurements"
ON public.body_measurements FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create progress_photos table
CREATE TABLE IF NOT EXISTS public.progress_photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    photo_url TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'front',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own photos"
ON public.progress_photos FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own photos"
ON public.progress_photos FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own photos"
ON public.progress_photos FOR DELETE
TO authenticated
USING (user_id = auth.uid());
