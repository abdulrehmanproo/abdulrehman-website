import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  ArrowLeft,
  Video,
  Image as ImageIcon,
  UploadCloud,
  FileVideo,
  Trash2,
  CheckCircle,
  BarChart3,
  ExternalLink,
  Sparkles,
  RefreshCw,
  LogOut,
  AlertTriangle,
  Play,
  Layers,
  Database,
  Eye,
  Check
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useClerk } from '@clerk/clerk-react';
import {
  fetchShowcaseItems,
  createShowcaseItem,
  deleteShowcaseItem,
  fetchPageViewsCount,
  isSupabaseConfigured,
  ShowcaseItem
} from '../lib/supabaseClient';

interface AdminPageProps {
  onBackToPortfolio: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToPortfolio }) => {
  const { isAdmin, adminEmail } = useAdmin();
  const { signOut } = useClerk();

  // Tabs: ONLY Media & Telemetry (Add Project & Client Inquiries removed as requested)
  const [activeTab, setActiveTab] = useState<'media' | 'telemetry'>('media');

  // Media state
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Local File Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Showcase Items
  const [showcaseItems, setShowcaseItems] = useState<ShowcaseItem[]>([]);
  const [pageViews, setPageViews] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filter for published items
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image'>('all');

  const loadData = async () => {
    try {
      const [items, views] = await Promise.all([
        fetchShowcaseItems(),
        fetchPageViewsCount()
      ]);
      setShowcaseItems(items);
      setPageViews(views);
    } catch (e) {
      console.error('Error loading admin data:', e);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('showcase-updated', loadData);
    return () => window.removeEventListener('showcase-updated', loadData);
  }, []);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (mediaType === 'video' && !file.type.startsWith('video/')) {
      setErrorMsg('Please select a valid video file (MP4, WebM, MOV, OGG).');
      return;
    }
    if (mediaType === 'image' && !file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP, GIF).');
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);

    if (!title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(nameWithoutExt);
    }

    const objectUrl = URL.createObjectURL(file);
    setFilePreview(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePostMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!selectedFile) {
      setErrorMsg('Please select a file from your computer to upload.');
      return;
    }

    const objectUrl = filePreview;
    const thumbnailUrl = mediaType === 'image' ? objectUrl : undefined;

    if (!title.trim()) {
      setErrorMsg('Please provide a title for this item.');
      return;
    }

    setIsSaving(true);
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
      setSuccessMsg(`Successfully published ${mediaType.toUpperCase()} directly to your website!`);
      setTitle('');
      setDescription('');
      clearSelectedFile();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to post media item.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteItem = async (id: string, filePathOrUrl?: string) => {
    if (!confirm('Are you sure you want to permanently delete this media item from your website?')) {
      return;
    }
    const ok = await deleteShowcaseItem(id, filePathOrUrl);
    if (ok) {
      setShowcaseItems(showcaseItems.filter((i) => i.id !== id));
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      onBackToPortfolio();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const filteredItems = filterType === 'all'
    ? showcaseItems
    : showcaseItems.filter((i) => i.type === filterType);

  // Only show admin page to actual admin
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0e1118] text-[#e1e2ec] font-body-md flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#13161f]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Left: Branding & Status */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={onBackToPortfolio}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#191b23] border border-white/[0.08] text-[#b9cacb] hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-all font-mono text-xs cursor-pointer group"
              title="Return to Portfolio Homepage"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Portfolio</span>
            </button>

            <div className="h-6 w-px bg-white/[0.08] hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-[#e1e2ec] font-display tracking-tight">
                  Admin Panel
                </h1>
                <p className="font-mono text-xs text-[#849495]">Manage videos, pictures &amp; telemetry</p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#191b23] border border-white/[0.08] text-[#b9cacb] hover:text-[#00f0ff] hover:bg-[#272a32] transition-colors font-mono text-xs cursor-pointer"
              title="Refresh Items"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#00f0ff]' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all font-mono text-xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-[#10131b] border-b border-white/[0.06] px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 py-4 px-3 font-mono text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'media'
                ? 'border-[#00f0ff] text-[#00f0ff]'
                : 'border-transparent text-[#b9cacb] hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Post &amp; Manage Media (Videos &amp; Pictures)</span>
            <span className="px-2 py-0.5 rounded-full bg-[#191b23] text-[10px] text-[#00f0ff] border border-[#00f0ff]/30">
              {showcaseItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex items-center gap-2 py-4 px-3 font-mono text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'telemetry'
                ? 'border-[#00f0ff] text-[#00f0ff]'
                : 'border-transparent text-[#b9cacb] hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Telemetry &amp; Visitor Stats</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-10">
        {/* TAB 1: MEDIA UPLOADER & MANAGER */}
        {activeTab === 'media' && (
          <div className="flex flex-col gap-10">
            {/* 1. Direct Media Upload Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#13161f] border border-[#00f0ff]/30 shadow-[0_0_50px_rgba(0,240,255,0.1)] flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col gap-1.5 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
                    [ DIRECT MEDIA BROADCASTER ]
                  </span>
                  <Sparkles className="w-4 h-4 text-[#00f0ff]" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#e1e2ec] font-display">
                  Post Video or Picture to Website
                </h2>
                <p className="text-xs sm:text-sm text-[#849495] font-mono">
                  Select a video or picture directly from your computer. It will go live immediately in your Showcase section.
                </p>
              </div>

              {successMsg && (
                <div className="p-4 rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-[#00f0ff] font-mono text-xs flex items-center gap-2.5 animate-in fade-in">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/50 text-red-400 font-mono text-xs flex items-center gap-2.5 animate-in fade-in">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handlePostMedia} className="flex flex-col gap-6 relative z-10">
                {/* Format Toggle: Video vs Picture */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('video');
                      clearSelectedFile();
                    }}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border text-sm font-mono font-bold transition-all cursor-pointer ${
                      mediaType === 'video'
                        ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                        : 'bg-[#191b23] border-white/[0.08] text-[#b9cacb] hover:text-white'
                    }`}
                  >
                    <Video className="w-5 h-5" />
                    <span>Post Video</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('image');
                      clearSelectedFile();
                    }}
                    className={`flex items-center justify-center gap-3 p-4 rounded-2xl border text-sm font-mono font-bold transition-all cursor-pointer ${
                      mediaType === 'image'
                        ? 'bg-[#d0bcff]/15 border-[#d0bcff] text-[#d0bcff] shadow-[0_0_20px_rgba(208,188,255,0.2)]'
                        : 'bg-[#191b23] border-white/[0.08] text-[#b9cacb] hover:text-white'
                    }`}
                  >
                    <ImageIcon className="w-5 h-5" />
                    <span>Post Picture</span>
                  </button>
                </div>

                {/* FILE UPLOAD ZONE (Direct from PC only) */}
                <div className="flex flex-col gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="media-file-input"
                    accept={mediaType === 'video' ? 'video/mp4,video/webm,video/ogg,video/quicktime' : 'image/jpeg,image/png,image/webp,image/gif'}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full p-8 sm:p-12 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-[#00f0ff] bg-[#00f0ff]/10 scale-[1.01]'
                          : 'border-white/[0.15] bg-[#191b23]/60 hover:border-[#00f0ff]/50 hover:bg-[#191b23]'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                        {mediaType === 'video' ? <FileVideo className="w-8 h-8" /> : <UploadCloud className="w-8 h-8" />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-base font-bold text-[#e1e2ec]">
                          Click to browse or drag &amp; drop {mediaType === 'video' ? 'a video file' : 'a picture'} from your computer
                        </p>
                        <p className="font-mono text-xs text-[#849495]">
                          Supports {mediaType === 'video' ? 'MP4, WebM, MOV, OGG' : 'JPG, PNG, WebP, GIF'} (up to 100 MB)
                        </p>
                      </div>
                      <span className="px-4 py-2 rounded-xl bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 font-mono text-xs font-semibold hover:bg-[#00f0ff] hover:text-[#002022] transition-colors">
                        Select {mediaType === 'video' ? 'Video' : 'Picture'} from PC
                      </span>
                    </div>
                  ) : (
                    /* File Preview Card */
                    <div className="p-4 sm:p-6 rounded-2xl bg-[#191b23] border border-[#00f0ff]/40 flex flex-col md:flex-row items-center gap-6">
                      {/* Visual Preview */}
                      <div className="w-full md:w-64 h-44 rounded-xl overflow-hidden bg-black/60 border border-white/[0.08] flex items-center justify-center shrink-0">
                        {mediaType === 'video' && filePreview ? (
                          <video
                            src={filePreview}
                            controls
                            className="w-full h-full object-contain"
                          />
                        ) : mediaType === 'image' && filePreview ? (
                          <img
                            src={filePreview}
                            alt="Upload preview"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="font-mono text-xs text-[#849495]">Preview loading...</div>
                        )}
                      </div>

                      {/* File Details */}
                      <div className="flex-1 flex flex-col justify-between gap-3 w-full">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-xs text-[#00f0ff] uppercase font-semibold">
                            Ready to Publish
                          </span>
                          <h4 className="text-base font-bold text-[#e1e2ec] break-all">
                            {selectedFile.name}
                          </h4>
                          <p className="font-mono text-xs text-[#849495]">
                            Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Type: {selectedFile.type}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono transition-colors"
                          >
                            Choose Different File
                          </button>
                          <button
                            type="button"
                            onClick={clearSelectedFile}
                            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white text-xs font-mono transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-[#b9cacb]">Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder={mediaType === 'video' ? 'e.g. Full Stack Dashboard Walkthrough' : 'e.g. Nextskill Certificate / Project UI'}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e15] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-mono text-xs text-[#b9cacb]">Caption / Description (Optional)</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Brief note or technology highlight..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0b0e15] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                {/* Submit Action */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSaving || !filePreview}
                    className="inline-flex items-center gap-2.5 px-8 py-3 rounded-xl bg-[#00f0ff] text-[#002022] font-bold font-mono text-xs hover:bg-[#dbfcff] transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : `Publish ${mediaType.toUpperCase()} to Website`}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Currently Published Media List (with Delete functionality) */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <h3 className="text-xl font-bold text-[#e1e2ec] font-display">
                    Currently Published Items ({showcaseItems.length})
                  </h3>
                  <p className="font-mono text-xs text-[#849495]">
                    Click the red delete button to permanently remove any video or picture from the portfolio
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex items-center gap-2">
                  {(['all', 'video', 'image'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterType(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-all cursor-pointer ${
                        filterType === cat
                          ? 'bg-[#00f0ff] text-[#002022] font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                          : 'bg-[#191b23] text-[#b9cacb] hover:text-white border border-white/[0.06]'
                      }`}
                    >
                      {cat === 'all' ? 'All' : cat + 's'}
                    </button>
                  ))}
                </div>
              </div>

              {filteredItems.length === 0 ? (
                <div className="p-12 rounded-2xl bg-[#13161f] border border-white/[0.06] text-center flex flex-col items-center justify-center gap-3 text-[#849495]">
                  <Video className="w-12 h-12 text-[#849495]/40" />
                  <p className="font-mono text-sm">No items found under this filter.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => {
                    const isVid = item.type === 'video';
                    const isImg = item.type === 'image';

                    return (
                      <div
                        key={item.id}
                        className="p-5 rounded-2xl bg-[#13161f] border border-white/[0.08] hover:border-[#00f0ff]/40 flex flex-col justify-between gap-4 transition-all group"
                      >
                        <div className="flex flex-col gap-3">
                          {/* Media Thumbnail or Player */}
                          <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/60 border border-white/[0.06] flex items-center justify-center">
                            {isVid ? (
                              <video
                                src={item.url}
                                controls
                                preload="metadata"
                                className="w-full h-full object-contain"
                              />
                            ) : item.thumbnail_url || (isImg && item.url) ? (
                              <img
                                src={item.thumbnail_url || item.url}
                                alt={item.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-[#849495]">
                                {isVid ? <Video className="w-8 h-8 text-[#00f0ff]" /> : <ImageIcon className="w-8 h-8 text-[#d0bcff]" />}
                              </div>
                            )}

                            <span className="absolute top-2 right-2 font-mono text-[10px] px-2 py-0.5 rounded-full bg-black/80 text-[#00f0ff] uppercase font-bold border border-white/[0.1]">
                              {item.type}
                            </span>
                          </div>

                          <div className="flex flex-col gap-1">
                            <h4 className="text-base font-bold text-[#e1e2ec] font-display line-clamp-1 group-hover:text-[#00f0ff] transition-colors">
                              {item.title}
                            </h4>
                            {item.description && (
                              <p className="text-xs text-[#849495] line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
                          <span className="font-mono text-[10px] text-[#849495]">
                            {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Active'}
                          </span>

                          <button
                            onClick={() => handleDeleteItem(item.id, item.file_path || item.url)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-mono cursor-pointer"
                            title="Delete this item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: TELEMETRY (User requested to keep this) */}
        {activeTab === 'telemetry' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold text-[#e1e2ec] font-display flex items-center gap-2.5">
                <BarChart3 className="w-6 h-6 text-[#00f0ff]" />
                <span>Telemetry &amp; Visitor Telemetry</span>
              </h2>
              <p className="text-sm text-[#849495] font-mono">
                Real-time telemetry and database connection health
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-[#13161f] border border-white/[0.08] flex flex-col gap-2">
                <span className="font-mono text-xs text-[#849495] uppercase">Total Page Views</span>
                <span className="text-4xl font-black text-[#00f0ff] font-display">
                  {pageViews.toLocaleString()}
                </span>
                <span className="font-mono text-[10px] text-[#00f0ff]/80">Recorded via Supabase Telemetry</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#13161f] border border-white/[0.08] flex flex-col gap-2">
                <span className="font-mono text-xs text-[#849495] uppercase">Database Sync</span>
                <span className="text-2xl font-bold text-emerald-400 flex items-center gap-2 font-display">
                  <Check className="w-5 h-5" />
                  <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Fallback'}</span>
                </span>
                <span className="font-mono text-[10px] text-[#849495]">Supabase Backend</span>
              </div>

              <div className="p-6 rounded-2xl bg-[#13161f] border border-white/[0.08] flex flex-col gap-2">
                <span className="font-mono text-xs text-[#849495] uppercase">Published Media</span>
                <span className="text-4xl font-black text-[#d0bcff] font-display">
                  {showcaseItems.length}
                </span>
                <span className="font-mono text-[10px] text-[#849495]">Videos &amp; Pictures on portfolio</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#13161f] border border-white/[0.08] flex flex-col gap-3">
              <h3 className="text-base font-bold text-[#e1e2ec] font-display">
                Database Diagnostic Information
              </h3>
              <div className="p-4 rounded-xl bg-[#0b0e15] border border-white/[0.06] font-mono text-xs space-y-2 text-[#b9cacb]">
                <p>Status: <span className="text-emerald-400 font-bold">Operational</span></p>
                <p>Features active: <span className="text-[#e1e2ec]">Media Uploader (PC), Telemetry, Deletion Engine</span></p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
