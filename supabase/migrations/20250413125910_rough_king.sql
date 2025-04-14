/*
  # Fix RLS policies for users table

  1. Changes
    - Enable RLS on users table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for super admins to manage all users
    - Add policy for unauthenticated users to insert during signup

  2. Security
    - Maintains data isolation between users
    - Allows users to manage their own records
    - Gives super admins full control
    - Enables new user registration
*/

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Super admin can manage all users" ON users;
DROP POLICY IF EXISTS "Enable insert for authentication" ON users;

-- Create new policies
CREATE POLICY "Users can read own data"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admin can manage all users"
ON users FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'super_admin'
) WITH CHECK (
  auth.jwt() ->> 'role' = 'super_admin'
);

-- Allow unauthenticated insert during signup
CREATE POLICY "Enable insert for authentication"
ON users FOR INSERT
TO anon
WITH CHECK (true);