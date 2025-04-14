/*
  # Update user role to super admin

  1. Changes
    - Update the role for as4008@srmist.edu.in to super_admin in raw_user_meta_data
    - Safely update existing user without recreating the account
*/

-- Update the user's role to super_admin
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"super_admin"'
)
WHERE email = 'as4008@srmist.edu.in';

-- Update the app metadata to include the role
UPDATE auth.users 
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"super_admin"'
)
WHERE email = 'as4008@srmist.edu.in';