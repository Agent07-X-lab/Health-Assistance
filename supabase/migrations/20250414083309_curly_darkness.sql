/*
  # Add contact messages table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `subject` (text)
      - `message` (text)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for authenticated users to insert messages
    - Add policy for super admins to view all messages
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'unread',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT contact_messages_status_check 
    CHECK (status IN ('unread', 'read', 'responded'))
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow any authenticated user to insert messages
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only super admins can view messages
CREATE POLICY "Super admins can view messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'super_admin');