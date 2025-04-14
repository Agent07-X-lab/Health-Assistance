/*
  # Add New User

  1. Changes
    - Add new user with email as4008@srmist.edu.in
    - Set password to 12345678
    - Ensure email confirmation is set

  2. Security
    - Password is properly hashed using bcrypt
    - User gets standard authenticated role
*/

-- Add new user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'as4008@srmist.edu.in',
  crypt('12345678', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"SRM Student"}',
  now(),
  now()
) ON CONFLICT (email) DO UPDATE
SET 
  encrypted_password = crypt('12345678', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now();