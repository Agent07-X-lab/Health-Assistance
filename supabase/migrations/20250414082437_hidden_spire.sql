-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for users own data" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.users;
DROP POLICY IF EXISTS "Enable super admin management" ON public.users;

-- Create new policies for users table
CREATE POLICY "Enable read access for users"
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for new users"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

CREATE POLICY "Enable super admin management"
ON public.users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

-- Create default client users if they don't exist
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data
)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'client' || i || '@healthcare.com',
  crypt('Client@123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"],"role":"client"}'::jsonb
FROM generate_series(1, 5) i
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'client' || i || '@healthcare.com'
);

-- Insert corresponding records in public.users table
INSERT INTO public.users (id, role)
SELECT id, (raw_app_meta_data->>'role')::text
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE users.id = auth.users.id
)
AND raw_app_meta_data->>'role' = 'client';