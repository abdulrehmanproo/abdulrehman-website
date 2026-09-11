import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Trash2,
  CheckCircle,
  Plus,
  BarChart3,
  Shield,
  LogOut,
  RefreshCw,
  Sparkles,
  Video,
  Image as ImageIcon,
  UploadCloud,
  FileVideo,
  AlertTriangle,
  Maximize2,
  Check,
  Loader2
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useClerk } from '@clerk/clerk-react';
import {
  fetchPageViewsCount,
  fetchShowcaseItems,
  createShowcaseItem,
  deleteShowcaseItem,
  isSupabaseConfigured,
  ShowcaseItem
} from '../lib/supabaseClient';

export const AdminDashboardModal: React.FC = () => {
  const { isAdmin, isAdminModalOpen, closeAdminModal, openAdminPage } = useAdmin();
  const { signOut } = useClerk();

  const [activeTab, setActiveTab] = useState<'media' | 'telemetry'>('media');
  const [pageViews, setPageViews] = useState<number>(0);
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Media Form State — PC upload only
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Local File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [mediaSaving, setMediaSaving] = useState(false);
  const [mediaSuccess, setMediaSuccess] = useState(false);
  const [mediaError, setMediaError] = useState('');

  const [filterType, setFilterType] = useState<'all' | 'video' | 'image'>('all');

  const handleLogout = async () => {
    closeAdminModal();
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const loadAdminData = async () => {
    setIsLoading(false);
    try {
      const [views, showcase] = await Promise.all([
        fetchPageViewsCount(),
        fetchShowcaseItems()
      ]);
      setPageViews(views);
      setShowcaseItems(showcase);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  useEffect(() => {
    if (isAdminModalOpen && isAdmin) {
      loadAdminData();
    }
    const handleUpdate = () => {
      if (isAdminModalOpen && isAdmin) loadAdminData();
    };
    window.addEventListener('showcase-updated', handleUpdate);
    return () => window.removeEventListener('showcase-updated', handleUpdate);
  }, [isAdminModalOpen, isAdmin]);

  // Guard: only show for admin, and only when open
  if (!isAdminModalOpen || !isAdmin) return null;

  const processFile = (file: File) => {
    if (mediaType === 'video' && !file.type.startsWith('video/')) {
      setMediaError('Please select a valid video file (MP4, WebM, MOV, OGG).');
      return;
    }
    if (mediaType === 'image' && !file.type.startsWith('image/')) {
      setMediaError('Please select a valid image file (JPG, PNG, WebP, GIF).');
      return;
    }

    setMediaError('');
    setSelectedFile(file);

    if (!title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(nameWithoutExt);
    }

    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setMediaSaving(true);
    setMediaError('');

    if (!selectedFile) {
      setMediaError('Please select a file from your computer to upload.');
      setMediaSaving(false);
      return;
    }

    const thumbnailUrl = mediaType === 'image' ? filePreview : undefined;

    if (!title.trim()) {
      setMediaError('Please provide a title for this item.');
      setMediaSaving(false);
      return;
    }

    try {
      const created = await createShowcaseItem({
        type: mediaType,
        title: title.trim(),
        url: filePreview || '',
        description: description.trim() || undefined,
        thumbnail_url: thumbnailUrl,
        file: selectedFile
      });

      setShowcaseItems([created, ...showcaseItems.filter((i) => i.id !== created.id)]);
      setMediaSuccess(true);
      setTitle('');
      setDescription('');
      clearSelectedFile();
      setTimeout(() => setMediaSuccess(false), 3500);
    } catch (err: any) {
      setMediaError(err?.message || 'Failed to post media item');
    } finally {
      setMediaSaving(false);
    }
  };

  const handleDeleteMedia = async (id: string, filePathOrUrl?: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    const ok = await deleteShowcaseItem(id, filePathOrUrl);
    if (ok) {
      setShowcaseItems(showcaseItems.filter((i) => i.id !== id));
    }
  };

  const filteredItems = filterType === 'all'
    ? showcaseItems
    : showcaseItems.filter((i) => i.type === filterType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[880px] rounded-3xl bg-[#13161f] border border-[#00f0ff]/30 shadow-[0_0_60px_rgba(0,240,255,0.2)] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#0b0e15]/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#e1e2ec] font-display">
                Admin Panel
              </h2>
              <p className="font-mono text-xs text-[#849495]">Manage videos, pictures &amp; telemetry</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                closeAdminModal();
                openAdminPage();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#002022] transition-all text-xs font-mono font-bold cursor-pointer"
              title="Open full dedicated Admin Page"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Page</span>
            </button>

            <button
              onClick={loadAdminData}
              disabled={isLoading}
              title="Refresh Data"
              className="p-2 rounded-lg bg-[#191b23] border border-white/[0.08] text-[#b9cacb] hover:text-[#00f0ff] hover:bg-[#272a32] transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#00f0ff]' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-mono cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>

            <button
              onClick={closeAdminModal}
              className="p-2 rounded-lg text-[#849495] hover:text-[#e1e2ec] hover:bg-white/[0.08] transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-white/[0.08] bg-[#0b0e15]/40 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 py-3 px-4 font-mono text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-[#00f0ff] text-[#00f0ff] font-bold'
                : 'border-transparent text-[#b9cacb] hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Post &amp; Delete Media</span>
            <span className="px-2 py-0.5 rounded-full bg-[#191b23] text-[10px] border border-white/[0.08]">
              {showcaseItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 py-3 px-4 font-mono text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'border-[#00f0ff] text-[#00f0ff] font-bold'
                : 'border-transparent text-[#b9cacb] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Telemetry</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'media' && (
            <div className="flex flex-col gap-8">
              {/* Add Media Form */}
              <div className="p-6 rounded-2xl bg-[#191b23] border border-white/[0.08] flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-[#e1e2ec] font-display flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                    <span>Post New Media (Video or Picture)</span>
                  </h3>
                  <p className="text-xs text-[#849495] font-mono">
                    Upload directly from your computer. Items appear immediately in the Showcase section.
                  </p>
                </div>

                {mediaSuccess && (
                  <div className="p-3.5 rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] font-mono text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>Media item successfully published to your website!</span>
                  </div>
                )}

                {mediaError && (
                  <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-400 font-mono text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{mediaError}</span>
                  </div>
                )}

                <form onSubmit={handleCreateMedia} className="flex flex-col gap-4">
                  {/* Select Type: Video vs Picture */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMediaType('video');
                        clearSelectedFile();
                      }}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                        mediaType === 'video'
                          ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff]'
                          : 'bg-[#0b0e15] border-white/[0.08] text-[#b9cacb] hover:text-white'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                      <span>Post Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMediaType('image');
                        clearSelectedFile();
                      }}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer ${
                        mediaType === 'image'
                          ? 'bg-[#d0bcff]/15 border-[#d0bcff] text-[#d0bcff]'
                          : 'bg-[#0b0e15] border-white/[0.08] text-[#b9cacb] hover:text-white'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Post Picture</span>
                    </button>
                  </div>

                  {/* Direct File Picker (no URL option) */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={mediaType === 'video' ? 'video/mp4,video/webm,video/ogg,video/quicktime' : 'image/jpeg,image/png,image/webp,image/gif'}
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {!selectedFile ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full p-6 sm:p-8 rounded-xl border-2 border-dashed border-white/[0.15] bg-[#0b0e15]/60 hover:border-[#00f0ff]/50 hover:bg-[#0b0e15] flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                          {mediaType === 'video' ? <FileVideo className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
                        </div>
                        <p className="text-sm font-bold text-[#e1e2ec]">
                          Click to select {mediaType === 'video' ? 'a video file' : 'a picture'} from your computer
                        </p>
                        <p className="font-mono text-xs text-[#849495]">
                          Supports {mediaType === 'video' ? 'MP4, WebM, MOV, OGG' : 'JPG, PNG, WebP, GIF'} (up to 100 MB)
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-[#0b0e15] border border-[#00f0ff]/40 flex items-center gap-4">
                        <div className="w-24 h-16 rounded-lg overflow-hidden bg-black/60 border border-white/[0.08] flex items-center justify-center shrink-0">
                          {mediaType === 'video' && filePreview ? (
                            <video src={filePreview} className="w-full h-full object-contain" />
                          ) : mediaType === 'image' && filePreview ? (
                            <img src={filePreview} alt="Preview" className="w-full h-full object-contain" />
                          ) : null}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-[#e1e2ec] break-all">{selectedFile.name}</p>
                          <p className="font-mono text-xs text-[#849495]">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={clearSelectedFile}
                          className="text-red-400 hover:text-red-300 text-xs font-mono px-3 py-1 rounded bg-red-500/10 border border-red-500/30"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-[#b9cacb]">Title *</label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={mediaType === 'video' ? 'e.g. Next.js SaaS Tutorial' : 'e.g. UI Dashboard Mockup'}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b0e15] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-xs text-[#b9cacb]">Description / Caption</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief note about this media..."
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0b0e15] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#00f0ff]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={mediaSaving || !filePreview}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00f0ff] text-[#002022] font-semibold font-mono text-xs hover:bg-[#dbfcff] transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] cursor-pointer disabled:opacity-50"
                    >
                      {mediaSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>{`Publish ${mediaType.toUpperCase()}`}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Manage / Delete Existing Media */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <h4 className="text-base font-bold text-[#e1e2ec] font-display">
                    Currently Published Items ({showcaseItems.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    {(['all', 'video', 'image'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilterType(cat)}
                        className={`px-2.5 py-1 rounded text-xs font-mono uppercase transition-colors ${
                          filterType === cat
                            ? 'bg-[#00f0ff] text-[#002022] font-bold'
                            : 'bg-[#0b0e15] text-[#849495] hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl bg-[#191b23] border border-white/[0.08] flex flex-col justify-between gap-3 group hover:border-[#00f0ff]/30 transition-all"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#0b0e15] text-[#00f0ff] uppercase font-bold border border-white/[0.06]">
                            {item.type}
                          </span>
                          <button
                            onClick={() => handleDeleteMedia(item.id, item.file_path || item.url)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                            title="Delete this media"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {item.type === 'video' ? (
                          <div className="w-full h-32 rounded-lg overflow-hidden bg-black/40 relative flex items-center justify-center">
                            <video
                              src={item.url}
                              muted
                              playsInline
                              preload="metadata"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
                              <Video className="w-6 h-6 text-[#00f0ff]" />
                            </div>
                          </div>
                        ) : (item.thumbnail_url || item.url) ? (
                          <div className="w-full h-32 rounded-lg overflow-hidden bg-black/40">
                            <img
                              src={item.thumbnail_url || item.url}
                              alt={item.title}
                              loading="lazy"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : null}

                        <h5 className="text-sm font-bold text-[#e1e2ec] line-clamp-1">{item.title}</h5>
                        {item.description && (
                          <p className="text-xs text-[#849495] line-clamp-2">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Telemetry Tab */}
          {activeTab === 'telemetry' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#191b23] border border-white/[0.08] flex flex-col gap-2">
                  <span className="font-mono text-xs text-[#849495]">Total Page Views</span>
                  <span className="text-3xl font-bold text-[#00f0ff] font-display">{pageViews}</span>
                </div>
                <div className="p-5 rounded-2xl bg-[#191b23] border border-white/[0.08] flex flex-col gap-2">
                  <span className="font-mono text-xs text-[#849495]">Database Status</span>
                  <span className="text-xl font-bold text-emerald-400 font-display flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Fallback'}</span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
