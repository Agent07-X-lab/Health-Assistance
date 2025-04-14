/*
  # Create users table for role management

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth user ID
      - `role` (text) - user role (super_admin or client)
      - `created_at` (timestamptz) - record creation timestamp
      - `updated_at` (timestamptz) - record update timestamp

  2. Constraints
    - Primary key on `id`
    - Check constraint to ensure role is either 'super_admin' or 'client'
    - Default value of 'client' for role

  3. Indexes
    - Index on role column for faster lookups

  4. Security
    - Enable RLS
    - Policy for super_admin to manage all users
    - Policy for users to read their own data
*/

-- Drop existing policies if they exist
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Super admin can manage all users" ON public.users;
  DROP POLICY IF EXISTS "Users can read own data" ON public.users;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('super_admin', 'client')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on role column
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Super admin can manage all users"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'super_admin');

-- Create trigger for updating updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comments
COMMENT ON TABLE users IS 'Stores user roles and related information';
COMMENT ON COLUMN users.id IS 'Primary key, matches Supabase auth user ID';
COMMENT ON COLUMN users.role IS 'User role (super_admin or client)';
COMMENT ON COLUMN users.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN users.updated_at IS 'Timestamp when the record was last updated';