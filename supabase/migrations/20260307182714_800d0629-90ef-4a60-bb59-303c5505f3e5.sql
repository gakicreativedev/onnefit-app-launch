-- Create trigger function to auto-create profile on signup
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

  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Insert profile for existing user if missing
INSERT INTO public.profiles (user_id, name)
VALUES ('bbd5fdfb-f97c-4bcc-a55b-1d60e9708699', 'Admin')
ON CONFLICT (user_id) DO NOTHING;

-- Insert admin role for existing user
INSERT INTO public.user_roles (user_id, role)
VALUES ('bbd5fdfb-f97c-4bcc-a55b-1d60e9708699', 'admin')
ON CONFLICT DO NOTHING;