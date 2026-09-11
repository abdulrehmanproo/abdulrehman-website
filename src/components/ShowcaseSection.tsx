import React, { useState, useEffect } from 'react';
import {
  Play,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  Layers,
  Video,
  Eye,
  X
} from 'lucide-react';
import { fetchShowcaseItems, ShowcaseItem } from '../lib/supabaseClient';
import { useAdmin } from '../context/AdminContext';

export const ShowcaseSection: React.FC = () => {
  const { isAdmin, openAdminModal } = useAdmin();
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'video' | 'image' | 'link'>('all');
  const [activePreview, setActivePreview] = useState<ShowcaseItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      try {
        const data = await fetchShowcaseItems();
        if (isMounted) {
          setItems(data);
          setIsLoading(false);
        }
      } catch (e) {
        if (isMounted) setIsLoading(false);
      }
    };
    loadItems();
    window.addEventListener('storage', loadItems);
    window.addEventListener('showcase-updated', loadItems);
    return () => {
      isMounted = false;
      window.removeEventListener('storage', loadItems);
      window.removeEventListener('showcase-updated', loadItems);
    };
  }, []);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(i => i.type === filter);

  return (
    <section id="showcase" className="w-full flex flex-col gap-10 pt-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.06] pb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
              [ MEDIA &amp; BROADCASTS ]
            </span>
            <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e1e2ec] font-display tracking-tight">
            Featured Media &amp; Showcase
          </h2>
          <p className="text-sm sm:text-base text-[#b9cacb] max-w-xl">
            Live video tutorials, development reels, certificates, and curated technical links published directly by Abdul Rehman.
          </p>
        </div>

        {/* Filter Pills & Admin Manage Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          {(['all', 'video', 'image', 'link'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#00f0ff] text-[#002022] font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                  : 'bg-[#191b23] text-[#b9cacb] hover:bg-[#272a32] hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat + 's'}
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={openAdminModal}
              className="ml-auto md:ml-2 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#00f0ff]/15 border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#002022] transition-all text-xs font-mono font-bold cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Add / Delete Media</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl bg-[#272a32]/60 border border-white/[0.06] flex flex-col gap-4 animate-pulse"
            >
              <div className="w-full h-48 rounded-xl bg-white/[0.05]" />
              <div className="h-5 w-3/4 rounded-md bg-white/[0.08]" />
              <div className="h-4 w-full rounded-md bg-white/[0.04]" />
              <div className="h-10 w-full rounded-lg bg-white/[0.06] mt-2" />
            </div>
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="w-full py-16 px-6 rounded-2xl bg-[#191b23]/40 border border-white/[0.06] flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#e1e2ec] font-display">No Items Found</h3>
          <p className="text-xs text-[#849495] font-mono max-w-sm">
            There are currently no items under the {filter === 'all' ? 'showcase' : filter} filter.
          </p>
        </div>
      ) : (
        /* Grid of Showcase Items */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const isVideo = item.type === 'video';
            const isImage = item.type === 'image';
            const isLink = item.type === 'link';

            return (
              <div
                key={item.id}
                className="group p-5 rounded-2xl bg-[#272a32] border border-white/[0.08] hover:border-[#00f0ff]/40 shadow-lg transition-all duration-300 flex flex-col justify-between gap-4 hover:-translate-y-1"
              >
              <div className="flex flex-col gap-3">
                {/* Media Thumbnail / Preview Banner */}
                <div
                  onClick={() => (isVideo || isImage) && setActivePreview(item)}
                  className={`relative w-full h-48 rounded-xl overflow-hidden bg-[#0b0e15] border border-white/[0.06] flex items-center justify-center ${
                    (isVideo || isImage) ? 'cursor-pointer' : ''
                  }`}
                >
                  {isVideo ? (
                    <video
                      src={item.url}
                      muted
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : item.thumbnail_url || (isImage && item.url) ? (
                    <img
                      src={item.thumbnail_url || item.url}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-[#849495]">
                      {isVideo && <Video className="w-10 h-10 text-[#00f0ff]" />}
                      {isImage && <ImageIcon className="w-10 h-10 text-[#d0bcff]" />}
                      {isLink && <ExternalLink className="w-10 h-10 text-[#00f0ff]" />}
                    </div>
                  )}

                  {/* Media Overlay Badge */}
                  <div className="absolute top-2.5 right-2.5">
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-[#0b0e15]/85 border border-white/[0.1] text-[#00f0ff] uppercase font-semibold backdrop-blur-md flex items-center gap-1">
                      {isVideo && <Play className="w-2.5 h-2.5 fill-current" />}
                      {isImage && <ImageIcon className="w-2.5 h-2.5" />}
                      {isLink && <ExternalLink className="w-2.5 h-2.5" />}
                      <span>{item.type}</span>
                    </span>
                  </div>

                  {/* Play / View Overlay Hover button */}
                  {(isVideo || isImage) && (
                    <div className="absolute inset-0 bg-[#0b0e15]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="w-12 h-12 rounded-full bg-[#00f0ff] text-[#002022] flex items-center justify-center shadow-[0_0_20px_#00f0ff] transform group-hover:scale-110 transition-transform">
                        {isVideo ? <Play className="w-5 h-5 fill-current ml-0.5" /> : <Eye className="w-5 h-5" />}
                      </div>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-[#e1e2ec] font-display line-clamp-1 group-hover:text-[#00f0ff] transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-[#b9cacb] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#191b23] border border-white/[0.08] text-[#e1e2ec] hover:bg-[#00f0ff] hover:text-[#002022] transition-all text-xs font-mono font-semibold cursor-pointer"
              >
                <span>{isVideo ? 'Watch Video' : isImage ? 'View Full Image' : 'Visit Link'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal Preview for Images or Videos */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-2xl bg-[#191b23] border border-[#00f0ff]/30 p-5 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="text-base font-bold text-[#e1e2ec] font-display line-clamp-1">
                {activePreview.title}
              </h3>
              <button
                onClick={() => setActivePreview(null)}
                className="p-1.5 rounded-lg text-[#849495] hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full max-h-[60vh] overflow-hidden rounded-xl bg-[#0b0e15] flex items-center justify-center">
              {activePreview.type === 'image' ? (
                <img
                  src={activePreview.url}
                  alt={activePreview.title}
                  className="max-h-[60vh] w-auto object-contain rounded-lg"
                />
              ) : activePreview.type === 'video' ? (
                <video
                  src={activePreview.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[60vh] w-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="w-full p-8 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
                    <Video className="w-8 h-8" />
                  </div>
                  <p className="text-sm text-[#e1e2ec] max-w-md">
                    {activePreview.description || 'Watch this video on its native streaming platform:'}
                  </p>
                  <a
                    href={activePreview.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00f0ff] text-[#002022] font-mono font-bold text-xs hover:bg-[#dbfcff] transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Open Streaming Link</span>
                  </a>
                </div>
              )}
            </div>

            {activePreview.description && (
              <p className="text-xs text-[#b9cacb] font-mono">
                {activePreview.description}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
