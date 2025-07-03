-- Enable Row Level Security
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert expenses
CREATE POLICY "Allow authenticated users to insert expenses" ON expenses 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to read their own expenses
CREATE POLICY "Allow users to read their own expenses" ON expenses 
FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own expenses
CREATE POLICY "Allow users to update their own expenses" ON expenses 
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own expenses
CREATE POLICY "Allow users to delete their own expenses" ON expenses 
FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- Storage bucket policies
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT TO authenticated 
WITH CHECK (
    bucket_id = 'expense-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to read their own files
CREATE POLICY "Allow users to read their own files" ON storage.objects
FOR SELECT TO authenticated 
USING (
    bucket_id = 'expense-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to update their own files
CREATE POLICY "Allow users to update their own files" ON storage.objects
FOR UPDATE TO authenticated 
USING (
    bucket_id = 'expense-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
    bucket_id = 'expense-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create policy to allow users to delete their own files
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE TO authenticated 
USING (
    bucket_id = 'expense-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
);

--All policies are permissive by default, meaning they allow access unless explicitly restricted.
-- This file contains policies for the Supabase project, allowing various actions on the database and storage.

create policy "Allow authenticated uploads"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow public read access"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'expense-documents'::text));


create policy "Allow users to delete their own files"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow users to read their own files"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Allow users to update their own files"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])))
with check (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Authenticated users can upload files"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'attachments'::text) AND (auth.role() = 'authenticated'::text)));


create policy "Enable delete for authenticated users"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Enable download for authenticated users"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Enable update for authenticated users"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])))
with check (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


create policy "Enable upload for authenticated users"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'expense-documents'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));


-- Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Permitir que cada usuario vea solo su propio perfil
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Permitir que cada usuario actualice solo su propio perfil
CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Permitir que el usuario autenticado inserte su propio perfil
CREATE POLICY "Allow insert own profile"
ON profiles
FOR INSERT
USING (auth.uid() = id);