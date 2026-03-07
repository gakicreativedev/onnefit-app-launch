-- Restrict profiles SELECT: only owner can read full profile
-- Other users should use the public_profiles view
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Admins can also read all profiles
CREATE POLICY "profiles_select_admin"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
