/*
  # Update super admin role in auth.users

  1. Changes
    - Update the super admin user's role in raw_app_meta_data
    - Ensure proper role assignment for access control
*/

-- Update the super admin user's role
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  COALESCE(raw_app_meta_data, '{}'::jsonb),
  '{role}',
  '"super_admin"'
)
WHERE email = 'as4008@srmist.edu.in';