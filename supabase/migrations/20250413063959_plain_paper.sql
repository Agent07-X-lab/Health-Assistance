/*
  # Update User Password

  Updates the password for user Aditya161499@gmail.com to ensure it matches exactly "Aditya14?"

  1. Changes
    - Updates encrypted_password for specific user
    - Ensures password matches exactly "Aditya14?"

  2. Security
    - Uses proper password encryption with bcrypt
*/

UPDATE auth.users
SET encrypted_password = crypt('Aditya14?', gen_salt('bf'))
WHERE email = 'Aditya161499@gmail.com';