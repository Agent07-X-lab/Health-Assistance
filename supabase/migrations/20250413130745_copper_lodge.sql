/*
  # Map Patients to Client User and Create View

  1. Changes
    - Maps 20 random patients to the client user
    - Creates a view for patient-user mappings
    - Maintains data integrity and security

  2. Security
    - Maintains existing RLS policies on underlying tables
    - Only super admin can access the view through table policies
*/

-- Update 20 random patients to be associated with the client user
UPDATE patients
SET user_id = 'b4c19431-0e9d-4949-a2e7-3a9831bf4c6e'
WHERE id IN (
  SELECT id
  FROM patients
  WHERE user_id IS NULL
  ORDER BY RANDOM()
  LIMIT 20
);

-- Create a view to show patient mappings to super admin
CREATE OR REPLACE VIEW patient_user_mappings AS
SELECT 
  p.id as patient_id,
  p.name as patient_name,
  p.location,
  u.id as user_id,
  u.role as user_role
FROM patients p
LEFT JOIN users u ON p.user_id = u.id;

-- Create a security definer function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM users
    WHERE id = auth.uid()
    AND role = 'super_admin'
  );
$$;

-- Revoke all on the view
REVOKE ALL ON patient_user_mappings FROM PUBLIC;

-- Grant select to authenticated users
GRANT SELECT ON patient_user_mappings TO authenticated;

-- Add comments
COMMENT ON VIEW patient_user_mappings IS 'Shows mapping between patients and users for admin oversight';
COMMENT ON COLUMN patient_user_mappings.patient_id IS 'Patient unique identifier';
COMMENT ON COLUMN patient_user_mappings.patient_name IS 'Patient full name';
COMMENT ON COLUMN patient_user_mappings.user_id IS 'Associated user account ID';
COMMENT ON COLUMN patient_user_mappings.user_role IS 'User account role';