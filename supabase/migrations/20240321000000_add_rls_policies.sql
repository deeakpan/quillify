-- Enable RLS on books table
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies on books table
DROP POLICY IF EXISTS "Allow all operations on books" ON books;

-- Create completely public policy for books table
CREATE POLICY "Public Access" ON books
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
    ('cover', 'cover', true),
    ('file', 'file', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage buckets
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might conflict
DROP POLICY IF EXISTS "Allow public read access on cover bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to cover bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on file bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to file bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on cover bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations on file bucket" ON storage.objects;

-- Create completely public policies for both buckets
CREATE POLICY "Public Access" ON storage.objects
    FOR ALL
    USING (true)
    WITH CHECK (true); 