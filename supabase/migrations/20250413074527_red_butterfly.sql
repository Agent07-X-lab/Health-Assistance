/*
  # Update RLS policies for super admin access
  
  1. Changes
    - Modify the super admin policies to use raw_app_meta_data instead of jwt
    - Add a policy for super admin to insert patients
    - Update the policy check conditions
  
  2. Security
    - Maintain RLS enforcement
    - Ensure proper access control for both regular users and super admins
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Super admin can view all patients" ON patients;
DROP POLICY IF EXISTS "Super admin can update all patients" ON patients;
DROP POLICY IF EXISTS "Super admin can delete patients" ON patients;

-- Create updated super admin policies
CREATE POLICY "Super admin can view all patients" 
ON patients FOR SELECT 
TO authenticated 
USING (
  (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_app_meta_data->>'role' = 'super_admin'
  ))
  OR 
  (auth.uid() = user_id)
);

CREATE POLICY "Super admin can update all patients" 
ON patients FOR UPDATE 
TO authenticated 
USING (
  (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_app_meta_data->>'role' = 'super_admin'
  ))
  OR 
  (auth.uid() = user_id)
);

CREATE POLICY "Super admin can delete patients" 
ON patients FOR DELETE 
TO authenticated 
USING (
  auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_app_meta_data->>'role' = 'super_admin'
  )
);

CREATE POLICY "Super admin can insert patients" 
ON patients FOR INSERT 
TO authenticated 
WITH CHECK (
  (auth.uid() IN (
    SELECT id FROM auth.users 
    WHERE raw_app_meta_data->>'role' = 'super_admin'
  ))
  OR 
  (auth.uid() = user_id)
);