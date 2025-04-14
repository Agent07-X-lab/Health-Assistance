/*
  # Update RLS policies for super admin access

  1. Changes
    - Update patients table policies to include super admin access
    - Update related tables' policies (predictions, appointments, prescriptions)
    - Fix function calls to use auth.uid() instead of uid()

  2. Security
    - Enable RLS on all tables
    - Add policies for both regular users and super admins
    - Maintain data isolation between users
*/

-- Update patients table policies to allow super admin access
DROP POLICY IF EXISTS "Enable read access for users" ON patients;
DROP POLICY IF EXISTS "Enable insert access for users" ON patients;
DROP POLICY IF EXISTS "Enable update access for users" ON patients;
DROP POLICY IF EXISTS "Enable delete access for users" ON patients;

-- Create new policies that include super admin access
CREATE POLICY "Enable read access for users and super admin"
  ON patients
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Enable insert access for users and super admin"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Enable update access for users and super admin"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'super_admin'
  )
  WITH CHECK (
    auth.uid() = user_id OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'super_admin'
  );

CREATE POLICY "Enable delete access for users and super admin"
  ON patients
  FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'super_admin'
  );

-- Update related tables to allow super admin access
DROP POLICY IF EXISTS "Users can view their patients' predictions" ON patient_predictions;
CREATE POLICY "Users and super admin can view patient predictions"
  ON patient_predictions
  FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    ) OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Users can view their appointments" ON appointments;
CREATE POLICY "Users and super admin can view appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    ) OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'super_admin'
  );

DROP POLICY IF EXISTS "Users can view their prescriptions" ON prescriptions;
CREATE POLICY "Users and super admin can view prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients WHERE user_id = auth.uid()
    ) OR
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'super_admin'
  );