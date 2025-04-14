/*
  # Add Super User and Role

  1. Changes
    - Create super user account
    - Add unique constraint on email
    - Grant necessary permissions
    - Update RLS policies for super admin access

  2. Security
    - Password is securely hashed
    - RLS policies updated for super admin access
*/

-- First ensure email is unique
ALTER TABLE auth.users
ADD CONSTRAINT users_email_key UNIQUE (email);

-- Create super user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@healthcare.com',
  crypt('HealthAdmin@2025', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"],"role":"super_admin"}',
  '{"name":"System Administrator"}',
  true,
  now(),
  now()
) ON CONFLICT (email) DO UPDATE
SET 
  encrypted_password = crypt('HealthAdmin@2025', gen_salt('bf')),
  raw_app_meta_data = '{"provider":"email","providers":["email"],"role":"super_admin"}',
  is_super_admin = true,
  updated_at = now();

-- Update RLS policies to allow super admin access
CREATE POLICY "Super admin can view all patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'super_admin'
    OR auth.uid() = user_id
  );

CREATE POLICY "Super admin can update all patients"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'super_admin'
    OR auth.uid() = user_id
  );

CREATE POLICY "Super admin can delete patients"
  ON patients
  FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Grant super admin access to environmental data
CREATE POLICY "Super admin can manage environmental data"
  ON environmental_data
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Grant super admin access to specialists
CREATE POLICY "Super admin can manage specialists"
  ON specialists
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'super_admin');