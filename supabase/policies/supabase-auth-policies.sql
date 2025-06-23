-- First, enable RLS on the expenses table
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Add user_id column if it doesn't exist
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON expenses;
DROP POLICY IF EXISTS "Allow anonymous reads" ON expenses;
DROP POLICY IF EXISTS "Allow anonymous updates" ON expenses;
DROP POLICY IF EXISTS "Allow anonymous deletes" ON expenses;

-- Create new authenticated policies
CREATE POLICY "Enable insert for authenticated users only" ON expenses 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read for users based on user_id" ON expenses 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON expenses 
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON expenses 
FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- Storage policies
DROP POLICY IF EXISTS "Allow anonymous uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous downloads" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous storage updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow anonymous storage deletes" ON storage.objects;

-- Create new storage policies
CREATE POLICY "Enable upload for authenticated users" ON storage.objects
FOR INSERT TO authenticated 
WITH CHECK (
    bucket_id = 'expense-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Enable download for authenticated users" ON storage.objects
FOR SELECT TO authenticated 
USING (
    bucket_id = 'expense-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Enable update for authenticated users" ON storage.objects
FOR UPDATE TO authenticated 
USING (bucket_id = 'expense-documents' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'expense-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Enable delete for authenticated users" ON storage.objects
FOR DELETE TO authenticated 
USING (bucket_id = 'expense-documents' AND auth.uid()::text = (storage.foldername(name))[1]);