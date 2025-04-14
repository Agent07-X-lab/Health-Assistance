/*
  # Set up test user authentication

  1. Updates
    - Set password and authentication details for test user
*/

-- Update the test user's authentication details
UPDATE auth.users
SET 
    encrypted_password = crypt('test123', gen_salt('bf')),
    email_confirmed_at = now(),
    last_sign_in_at = now(),
    raw_app_meta_data = '{"provider":"email","providers":["email"]}',
    raw_user_meta_data = '{}',
    is_super_admin = false,
    updated_at = now(),
    phone = null,
    phone_confirmed_at = null,
    confirmation_token = '',
    recovery_token = '',
    email_change_token_new = '',
    email_change = '',
    email_change_token_current = '',
    banned_until = null,
    reauthentication_token = '',
    is_sso_user = false,
    deleted_at = null
WHERE id = 'd7bed83c-44a0-4a4f-8467-719dad509183';