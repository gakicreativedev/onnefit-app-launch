-- Fix social bucket: scope uploads to caller's folder
DROP POLICY IF EXISTS "social_upload" ON storage.objects;
CREATE POLICY "social_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'social'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Fix recipe-images bucket: scope uploads to caller's folder
DROP POLICY IF EXISTS "recipe_upload" ON storage.objects;
CREATE POLICY "recipe_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'recipe-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Add DELETE policies scoped to owner's folder
DROP POLICY IF EXISTS "social_delete" ON storage.objects;
CREATE POLICY "social_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'social'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "recipe_delete" ON storage.objects;
CREATE POLICY "recipe_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'recipe-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Add UPDATE policies scoped to owner's folder
DROP POLICY IF EXISTS "social_update" ON storage.objects;
CREATE POLICY "social_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'social'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "recipe_update" ON storage.objects;
CREATE POLICY "recipe_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'recipe-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );