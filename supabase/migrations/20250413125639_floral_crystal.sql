/*
  # Create users table for role management

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - matches Supabase auth user ID
      - `role` (text) - user role ('super_admin' or 'client')
      - `created_at` (timestamp) - record creation timestamp
      - `updated_at` (timestamp) - record update timestamp

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read their own data
    - Add policy for super_admin to manage all users
*/

CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY,
  role text NOT NULL DEFAULT 'client'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT users_role_check CHECK (role IN ('super_admin', 'client'))
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Super admin can manage all users
CREATE POLICY "Super admin can manage all users"
  ON public.users
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'super_admin'::text);

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index on role for faster queries
CREATE INDEX idx_users_role ON public.users(role);

-- Comment on table and columns
COMMENT ON TABLE public.users IS 'Stores user roles and related information';
COMMENT ON COLUMN public.users.id IS 'Primary key, matches Supabase auth user ID';
COMMENT ON COLUMN public.users.role IS 'User role (super_admin or client)';
COMMENT ON COLUMN public.users.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN public.users.updated_at IS 'Timestamp when the record was last updated';