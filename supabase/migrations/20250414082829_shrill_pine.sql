-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for new users" ON public.users;
DROP POLICY IF EXISTS "Enable super admin management" ON public.users;

-- Create new simplified policies
CREATE POLICY "Enable read access for all users"
ON public.users
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable insert for own record"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for own record"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable super admin full access"
ON public.users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.jwt() ->> 'role')::text = 'super_admin'
  )
);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;