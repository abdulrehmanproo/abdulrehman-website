import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export interface ContactMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
}

/**
 * Submit a visitor contact inquiry directly to Supabase
 */
export async function sendContactMessage(payload: ContactMessagePayload) {
  if (!supabase) {
    throw new Error('Supabase client is not configured.');
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .insert([
      {
        name: payload.name,
        email: payload.email,
        subject: payload.subject || 'General Inquiry',
        message: payload.message,
        phone: payload.phone || null,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Record visitor page telemetry
 */
export async function recordPageView(pagePath: string = window.location.pathname) {
  if (!supabase) return;

  try {
    await supabase.from('page_views').insert([
      {
        page_path: pagePath,
        user_agent: navigator.userAgent,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        created_at: new Date().toISOString()
      }
    ]);
  } catch (err) {
    // Ignore analytics telemetry errors silently
  }
}

/**
 * ADMIN: Fetch all contact messages from Supabase
 */
export async function fetchContactMessages() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact messages:', error);
    return [];
  }

  return data || [];
}

/**
 * ADMIN: Delete a contact message
 */
export async function deleteContactMessage(id: string) {
  if (!supabase) return false;

  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting message:', error);
    return false;
  }

  return true;
}

/**
 * ADMIN: Update message status (e.g. 'read', 'replied')
 */
export async function updateMessageStatus(id: string, status: string) {
  if (!supabase) return false;

  const { error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating status:', error);
    return false;
  }

  return true;
}

/**
 * ADMIN: Get page views count
 */
export async function fetchPageViewsCount() {
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true });

  if (error) {
    return 0;
  }

  return count || 0;
}

/**
 * ADMIN: Add a new project
 */
export async function createSupabaseProject(projectData: {
  title: string;
  tagline?: string;
  description: string;
  category?: string;
  tags?: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured?: boolean;
}) {
  if (!supabase) throw new Error('Supabase not configured');

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        ...projectData,
        created_at: new Date().toISOString()
      }
    ])
    .select();

  if (error) throw error;
  return data;
}

/**
 * Fetch all projects from Supabase
 */
export async function fetchSupabaseProjects() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return [];
  return data || [];
}

export interface ShowcaseItem {
  id: string;
  type: 'video' | 'image' | 'link';
  title: string;
  description?: string;
  url: string;
  thumbnail_url?: string;
  file_path?: string;
  created_at?: string;
}

const LOCAL_SHOWCASE_KEY = 'ar_showcase_items';

const DEFAULT_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'demo-img-1',
    type: 'image',
    title: 'Nexskill Web Development Accreditation (2026)',
    description: 'Certified in Full Stack Web Development with High Honors & Distinction.',
    url: '/images/nexskill-certificate.jpg',
    thumbnail_url: '/images/nexskill-certificate.jpg',
    created_at: new Date().toISOString()
  },
  {
    id: 'demo-link-1',
    type: 'link',
    title: 'GitHub Developer Profile & Repositories',
    description: 'Explore live full-stack projects, production web applications, and repositories.',
    url: 'https://github.com/abdulrehmanproo',
    created_at: new Date().toISOString()
  }
];

function sanitizeShowcaseItems(items: ShowcaseItem[]): ShowcaseItem[] {
  return items.map((item) => {
    // Remove avatar photo if it was accidentally set as video thumbnail
    if (item.type === 'video' && (item.thumbnail_url?.includes('profile-clean') || item.url?.includes('profile-clean') || item.thumbnail_url?.includes('placeholder-thumbnail'))) {
      return { ...item, thumbnail_url: undefined };
    }
    return item;
  });
}

/**
 * Fetch all showcase items (Fast Supabase query with instant local caching)
 */
export async function fetchShowcaseItems(): Promise<ShowcaseItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('showcase_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const sanitized = sanitizeShowcaseItems(data as ShowcaseItem[]);
        try {
          localStorage.setItem(LOCAL_SHOWCASE_KEY, JSON.stringify(sanitized));
        } catch (e) {}
        return sanitized;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, checking local cache:', e);
    }
  }

  // Fallback to localStorage
  try {
    const local = localStorage.getItem(LOCAL_SHOWCASE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sanitizeShowcaseItems(parsed);
      }
    }
  } catch (e) {}

  return DEFAULT_SHOWCASE_ITEMS;
}

/**
 * ADMIN: Add a new showcase item (video or picture)
 * Uploads file to Supabase Storage 'media' bucket, stores record in database
 */
export async function createShowcaseItem(
  item: Omit<ShowcaseItem, 'id' | 'created_at'> & { file?: File }
): Promise<ShowcaseItem> {
  const { file, ...itemData } = item;
  let finalUrl = itemData.url || '';
  let finalThumbnail = itemData.thumbnail_url || undefined;
  let storedFilePath: string | undefined = undefined;

  // 1. Upload to Supabase Storage if file is provided
  if (file && supabase) {
    // Sanitize filename and prefix with timestamp for uniqueness
    const safeBase = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `${Date.now()}_${safeBase}`;
    storedFilePath = storagePath;

    const mimeType = file.type || (itemData.type === 'video' ? 'video/mp4' : 'image/jpeg');

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('media')
      .upload(storagePath, file, {
        cacheControl: '31536000', // 1 year cache for fast repeat loads
        upsert: true,
        contentType: mimeType
      });

    if (uploadError) {
      console.error('Supabase Storage upload failed:', uploadError);
      throw new Error(`Upload to storage failed: ${uploadError.message}. Please ensure the SQL script was run in Supabase.`);
    }

    if (uploadData) {
      const { data: urlData } = supabase
        .storage
        .from('media')
        .getPublicUrl(uploadData.path);

      finalUrl = urlData.publicUrl;
      if (itemData.type === 'image') {
        finalThumbnail = urlData.publicUrl;
      }
    }
  }

  if (!finalUrl) {
    throw new Error('No media URL or file provided for upload.');
  }

  const newItem: ShowcaseItem = {
    id: '',
    type: itemData.type,
    title: itemData.title,
    description: itemData.description || undefined,
    url: finalUrl,
    thumbnail_url: finalThumbnail,
    file_path: storedFilePath,
    created_at: new Date().toISOString()
  };

  // 2. Save record to Supabase database table
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('showcase_items')
        .insert([
          {
            title: newItem.title,
            description: newItem.description || null,
            url: newItem.url,
            thumbnail_url: newItem.thumbnail_url || null,
            type: newItem.type,
            file_path: newItem.file_path || null
          }
        ])
        .select();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      if (data && data[0]) {
        newItem.id = data[0].id;
        newItem.created_at = data[0].created_at;
      }
    } catch (e: any) {
      console.error('Supabase insert failed:', e);
      throw e;
    }
  }

  // Fallback ID if offline/local
  if (!newItem.id) {
    newItem.id = 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  }

  // 3. Save to localStorage cache for instant UI reflection
  try {
    const local = localStorage.getItem(LOCAL_SHOWCASE_KEY);
    const existing: ShowcaseItem[] = local ? JSON.parse(local) : [];
    const updated = [newItem, ...existing.filter((i) => i.id !== newItem.id)];
    localStorage.setItem(LOCAL_SHOWCASE_KEY, JSON.stringify(updated));
  } catch (e) {}

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showcase-updated', { detail: newItem }));
    }
  } catch (e) {}

  return newItem;
}

/**
 * ADMIN: Sync all localStorage items to Supabase
 */
export async function syncLocalToSupabase(): Promise<boolean> {
  if (!supabase) return false;

  try {
    const local = localStorage.getItem(LOCAL_SHOWCASE_KEY);
    if (!local) return false;

    const parsed = JSON.parse(local);
    if (!Array.isArray(parsed) || parsed.length === 0) return false;

    const { data: existing } = await supabase
      .from('showcase_items')
      .select('id');

    const existingIds = new Set((existing || []).map((i: any) => i.id));
    const newItems = parsed.filter((i: ShowcaseItem) => !existingIds.has(i.id));

    if (newItems.length === 0) return true;

    const { error } = await supabase
      .from('showcase_items')
      .insert(newItems);

    if (!error) {
      localStorage.removeItem(LOCAL_SHOWCASE_KEY);
      return true;
    }
  } catch (e) {
    console.warn('Sync to Supabase failed:', e);
  }
  return false;
}

/**
 * ADMIN: Delete a showcase item (Removes from both Storage bucket & Database table)
 */
export async function deleteShowcaseItem(id: string, filePathOrUrl?: string): Promise<boolean> {
  if (supabase) {
    try {
      let fileToDelete = filePathOrUrl;

      // If file path not passed, fetch it from the database first
      if (!fileToDelete) {
        const { data } = await supabase
          .from('showcase_items')
          .select('url, file_path')
          .eq('id', id)
          .maybeSingle();

        if (data) {
          fileToDelete = data.file_path || data.url;
        }
      }

      // Delete the file from Supabase Storage bucket 'media'
      if (fileToDelete) {
        let storagePath = fileToDelete;
        if (fileToDelete.includes('/storage/v1/object/public/media/')) {
          storagePath = decodeURIComponent(
            fileToDelete.split('/storage/v1/object/public/media/')[1]?.split('?')[0] || ''
          );
        }

        if (
          storagePath &&
          !storagePath.startsWith('http') &&
          !storagePath.startsWith('data:') &&
          !storagePath.startsWith('blob:') &&
          !storagePath.startsWith('/images/')
        ) {
          const { error: storageDelError } = await supabase.storage
            .from('media')
            .remove([storagePath]);

          if (storageDelError) {
            console.warn('Could not delete storage file:', storageDelError);
          }
        }
      }

      // Delete the record from showcase_items table
      const { error: dbError } = await supabase
        .from('showcase_items')
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Error deleting from database:', dbError);
      }
    } catch (e) {
      console.error('Error during showcase item deletion:', e);
    }
  }

  // Also remove from localStorage cache
  try {
    const local = localStorage.getItem(LOCAL_SHOWCASE_KEY);
    if (local) {
      const existing: ShowcaseItem[] = JSON.parse(local);
      const updated = existing.filter((i) => i.id !== id);
      localStorage.setItem(LOCAL_SHOWCASE_KEY, JSON.stringify(updated));
    }
  } catch (e) {}

  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('showcase-updated', { detail: { id } }));
    }
  } catch (e) {}

  return true;
}
