/*
  # Add Client Users and Patient Mappings

  1. Changes
    - Create client users with proper roles
    - Create secure view for patient-user mappings
    - Distribute patients among clients
    
  2. Security
    - Ensure proper data isolation
    - Maintain data integrity
*/

-- Create client users
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

-- Drop existing view if it exists
DROP VIEW IF EXISTS patient_user_mappings;

-- Create secure view for patient-user mappings
CREATE OR REPLACE VIEW patient_user_mappings AS
SELECT 
  p.id as patient_id,
  p.name as patient_name,
  p.location,
  u.id as user_id,
  u.email as user_email,
  (u.raw_app_meta_data->>'role')::text as user_role
FROM patients p
LEFT JOIN auth.users u ON p.user_id = u.id
WHERE EXISTS (
  SELECT 1 FROM auth.users au
  WHERE au.id = auth.uid()
  AND (au.raw_app_meta_data->>'role')::text = 'super_admin'
);

-- Distribute patients among clients
DO $$
DECLARE
  client_user RECORD;
  patient_count INTEGER;
BEGIN
  FOR client_user IN 
    SELECT id FROM auth.users 
    WHERE raw_app_meta_data->>'role' = 'client'
  LOOP
    -- Get count of unassigned patients
    SELECT COUNT(*) INTO patient_count
    FROM patients
    WHERE user_id IS NULL;

    -- Assign 4 patients to each client
    IF patient_count >= 4 THEN
      UPDATE patients
      SET user_id = client_user.id
      WHERE id IN (
        SELECT id
        FROM patients
        WHERE user_id IS NULL
        LIMIT 4
      );
    END IF;
  END LOOP;
END $$;