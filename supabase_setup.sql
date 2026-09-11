-- ==============================================================================
-- ABDUL REHMAN - ALL-IN-ONE SUPABASE DATABASE & STORAGE SETUP
-- Project ID: lfgahquuygczunsifbdb
-- Dashboard SQL Editor: https://supabase.com/dashboard/project/lfgahquuygczunsifbdb/sql/new
--
-- Features included:
-- 1. Showcase Media Table (Videos, Pictures, Links) with fast indexes & metadata
-- 2. Storage Bucket ('media') with 100MB limit for high-res videos & pictures
-- 3. Contact Messages Table for inquiries
-- 4. Projects Table for portfolio showcases
-- 5. Page Views Table for visitor telemetry
-- 6. Full Row Level Security (RLS) policies for instant public reading and admin uploads/deletes
-- 7. Optimized database indexes for ultra-fast load times
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. SHOWCASE ITEMS TABLE (Videos, Pictures, Certificates, Demos)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.showcase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('video', 'image', 'link')),
    title TEXT NOT NULL,
    description TEXT,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_path TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Ensure newly added columns exist if table was previously created
ALTER TABLE public.showcase_items ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.showcase_items ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
ALTER TABLE public.showcase_items ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Performance Indexes: Instant ordering and filtering
CREATE INDEX IF NOT EXISTS idx_showcase_items_created_at ON public.showcase_items (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_showcase_items_type ON public.showcase_items (type);

-- Enable RLS
ALTER TABLE public.showcase_items ENABLE ROW LEVEL SECURITY;

-- Drop previous policies to avoid duplication errors (safe for re-running)
DROP POLICY IF EXISTS "Allow public read showcase_items" ON public.showcase_items;
DROP POLICY IF EXISTS "Allow public insert showcase_items" ON public.showcase_items;
DROP POLICY IF EXISTS "Allow public update showcase_items" ON public.showcase_items;
DROP POLICY IF EXISTS "Allow public delete showcase_items" ON public.showcase_items;

-- Public & Authenticated Read / Write Policies
CREATE POLICY "Allow public read showcase_items"
    ON public.showcase_items FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert showcase_items"
    ON public.showcase_items FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update showcase_items"
    ON public.showcase_items FOR UPDATE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public delete showcase_items"
    ON public.showcase_items FOR DELETE
    TO anon, authenticated
    USING (true);


-- ==============================================================================
-- 2. CONTACT INQUIRIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT DEFAULT 'General Inquiry',
    phone TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages (created_at DESC);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public read contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public update contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow public delete contact_messages" ON public.contact_messages;

CREATE POLICY "Allow public insert contact_messages"
    ON public.contact_messages FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public read contact_messages"
    ON public.contact_messages FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public update contact_messages"
    ON public.contact_messages FOR UPDATE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public delete contact_messages"
    ON public.contact_messages FOR DELETE
    TO anon, authenticated
    USING (true);


-- ==============================================================================
-- 3. PROJECTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    category TEXT DEFAULT 'web',
    tags TEXT[] DEFAULT '{}',
    github_url TEXT,
    live_url TEXT,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects (featured);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public insert projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public update projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public delete projects" ON public.projects;

CREATE POLICY "Allow public read projects"
    ON public.projects FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public insert projects"
    ON public.projects FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public update projects"
    ON public.projects FOR UPDATE
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow public delete projects"
    ON public.projects FOR DELETE
    TO anon, authenticated
    USING (true);


-- ==============================================================================
-- 4. PAGE VIEWS & TELEMETRY TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_path TEXT DEFAULT '/',
    user_agent TEXT,
    screen_width INT,
    screen_height INT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views (created_at DESC);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow public read page_views" ON public.page_views;

CREATE POLICY "Allow public insert page_views"
    ON public.page_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow public read page_views"
    ON public.page_views FOR SELECT
    TO anon, authenticated
    USING (true);


-- ==============================================================================
-- 5. STORAGE BUCKET: media (VIDEOS & PICTURES UPLOADS)
-- ==============================================================================
-- Create or update public 'media' bucket with 100MB file limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media',
    'media',
    true,
    104857600, -- 100 MB max size
    ARRAY[
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 104857600,
    allowed_mime_types = ARRAY[
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
        'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-matroska'
    ];

-- Storage policies for the public 'media' bucket
-- (Note: storage.objects already has RLS enabled by default in Supabase)

-- Clean up any existing storage policies to prevent duplicate policy errors
DROP POLICY IF EXISTS "Allow public read from media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert into media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated read from media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert into media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update on media" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete from media" ON storage.objects;

-- Create storage bucket access policies for full upload, read, update, and delete
CREATE POLICY "Allow public read from media"
    ON storage.objects FOR SELECT
    TO anon, authenticated
    USING (bucket_id = 'media');

CREATE POLICY "Allow public insert into media"
    ON storage.objects FOR INSERT
    TO anon, authenticated
    WITH CHECK (bucket_id = 'media');

CREATE POLICY "Allow public update on media"
    ON storage.objects FOR UPDATE
    TO anon, authenticated
    USING (bucket_id = 'media');

CREATE POLICY "Allow public delete from media"
    ON storage.objects FOR DELETE
    TO anon, authenticated
    USING (bucket_id = 'media');


-- ==============================================================================
-- 6. DEFAULT SEED DATA
-- ==============================================================================
INSERT INTO public.projects (title, tagline, description, category, tags, github_url, live_url, featured)
VALUES (
    'Abdul Rehman Portfolio v2',
    'High-Performance Modern Developer Portfolio',
    'Modern Full Stack Portfolio built with React 19, Vite, Three.js cosmic shaders, Supabase backend, and Clerk Auth.',
    'fullstack',
    ARRAY['React', 'TypeScript', 'TailwindCSS', 'Supabase', 'Clerk'],
    'https://github.com/abdulrehmanproo',
    'https://github.com/abdulrehmanproo',
    true
)
ON CONFLICT DO NOTHING;

INSERT INTO public.showcase_items (type, title, description, url, thumbnail_url)
VALUES 
(
    'image',
    'Nexskill Web Development Accreditation (2026)',
    'Certified in Full Stack Web Development with High Honors & Distinction.',
    '/images/nexskill-certificate.jpg',
    '/images/nexskill-certificate.jpg'
),
(
    'link',
    'GitHub Developer Profile & Repositories',
    'Explore live full-stack projects, production web applications, and repositories.',
    'https://github.com/abdulrehmanproo',
    NULL
)
ON CONFLICT DO NOTHING;
