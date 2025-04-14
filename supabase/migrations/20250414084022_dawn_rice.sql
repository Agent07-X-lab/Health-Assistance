-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for users own data" ON public.patients;
DROP POLICY IF EXISTS "Enable insert for own data" ON public.patients;
DROP POLICY IF EXISTS "Enable update for own data" ON public.patients;
DROP POLICY IF EXISTS "Enable delete for own data" ON public.patients;

-- Create new policies with proper role checks
CREATE POLICY "Enable read access for users own data"
ON public.patients
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

CREATE POLICY "Enable insert for own data"
ON public.patients
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

CREATE POLICY "Enable update for own data"
ON public.patients
FOR UPDATE
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

CREATE POLICY "Enable delete for own data"
ON public.patients
FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND raw_app_meta_data->>'role' = 'super_admin'
  )
);

-- Create client1 user if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'client1@healthcare.com'
  ) THEN
    -- Insert into auth.users
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
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'client1@healthcare.com',
      crypt('Client1@123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"],"role":"client"}'::jsonb
    );

    -- Insert into public.users
    INSERT INTO public.users (id, role)
    SELECT id, 'client'
    FROM auth.users
    WHERE email = 'client1@healthcare.com';

    -- Assign 20 random patients to client1
    WITH client1_user AS (
      SELECT id FROM auth.users WHERE email = 'client1@healthcare.com'
    )
    UPDATE patients
    SET user_id = (SELECT id FROM client1_user)
    WHERE id IN (
      SELECT id
      FROM patients
      WHERE user_id IS NULL
      ORDER BY RANDOM()
      LIMIT 20
    );
  END IF;
END $$;