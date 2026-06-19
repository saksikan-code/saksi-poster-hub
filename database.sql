-- =============================================================
-- Saksi Poster Hub — Supabase Database Setup
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================================

-- 1. Create the posters table
CREATE TABLE posters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC NOT NULL,
  category TEXT NOT NULL DEFAULT 'Custom',
  image_url TEXT NOT NULL,
  tag TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable Row Level Security
ALTER TABLE posters ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
-- Anyone can view posters (no auth required)
CREATE POLICY "Anyone can view posters"
  ON posters FOR SELECT
  USING (true);

-- Only authenticated users (admin) can insert
CREATE POLICY "Authenticated users can insert posters"
  ON posters FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update posters"
  ON posters FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete posters"
  ON posters FOR DELETE
  USING (auth.role() = 'authenticated');

-- 4. Enable Realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE posters;

-- 5. Create storage bucket for poster images
-- Run this in Supabase Dashboard > Storage > Create bucket
-- Bucket name: poster-images
-- Public bucket: ON

-- Or run via SQL:
INSERT INTO storage.buckets (id, name, public, avif_autodetection)
VALUES ('poster-images', 'poster-images', true, false)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public can view poster images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'poster-images');

-- Only authenticated users can upload images
CREATE POLICY "Authenticated users can upload poster images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'poster-images'
    AND auth.role() = 'authenticated'
  );

-- Only authenticated users can delete images
CREATE POLICY "Authenticated users can delete poster images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'poster-images'
    AND auth.role() = 'authenticated'
  );

-- 6. (Optional) Seed data — uncomment to add initial posters
-- You'll need to upload images to the storage bucket first.
-- After uploading, get the public URL from Supabase Storage.
--
-- INSERT INTO posters (title, description, price, category, image_url, tag) VALUES
--   ('Murugan Devotional Collage', 'Beautiful devotional collage of Lord Murugan', 1200, 'Devotional', 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/poster-images/murugan.jpeg', 'Bestseller'),
--   ('Vijay — Master', 'High-quality Vijay Master poster', 1500, 'Cinema', 'https://YOUR_PROJECT.supabase.co/storage/v1/object/public/poster-images/vijay-master.jpeg', 'Hot');
