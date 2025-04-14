/*
  # Add Client Users and Sample Data

  1. Changes
    - Create client users with proper roles
    - Add sample patients for each client
    - Update view for patient-user mappings
    
  2. Security
    - Maintain existing RLS policies
    - Ensure proper data isolation between clients
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

-- Create view for patient-user mappings
CREATE OR REPLACE VIEW patient_user_mappings AS
SELECT 
  p.id as patient_id,
  p.name as patient_name,
  p.location,
  u.id as user_id,
  u.email as user_email,
  (u.raw_app_meta_data->>'role')::text as user_role
FROM patients p
LEFT JOIN auth.users u ON p.user_id = u.id;

-- Add RLS policy for the view
DROP POLICY IF EXISTS "Enable read access for super admin" ON patient_user_mappings;
CREATE POLICY "Enable read access for super admin"
ON patient_user_mappings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_app_meta_data->>'role')::text = 'super_admin'
  )
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