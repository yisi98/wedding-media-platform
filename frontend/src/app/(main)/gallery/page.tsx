"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getGallery } from "@/lib/api/media";
import { useAuthStore } from "@/store/auth";
import type { MediaItem, MediaType } from "@/types";
import MediaGrid from "@/components/gallery/MediaGrid";
import Lightbox from "@/components/gallery/Lightbox";
import Navbar from "@/components/layout/Navbar";

export default function GalleryPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [filter, setFilter] = useState<MediaType | undefined>(undefined);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken) router.push("/login");
  }, [accessToken, router]);

  const loadPage = useCallback(async (p: number, reset = false) => {
    setLoading(true);
    try {
      const resp = await getGallery({ page: p, page_size: 30, media_type: filter });
      setItems((prev) => (reset ? resp.items : [...prev, ...resp.items]));
      setTotal(resp.total);
      setHasNext(resp.has_next);
      setPage(p);
    } catch {}
    setLoading(false);
  }, [filter]);

  // Initial load + filter changes
  useEffect(() => {
    loadPage(1, true);
  }, [loadPage]);

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNext && !loading) {
          loadPage(page + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNext, loading, page, loadPage]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-6">
          {(["all", "image", "video"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f === "all" ? undefined : f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                (f === "all" ? !filter : filter === f)
                  ? "bg-brand-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "All" : f === "image" ? "Photos" : "Videos"}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400">{total} items</span>
        </div>

        {items.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No photos yet. Be the first to upload!</p>
          </div>
        )}

        <MediaGrid items={items} onItemClick={(idx) => setLightboxIndex(idx)} />

        {/* Infinite scroll sentinel */}
        <div ref={sentinelRef} className="h-10" />

        {loading && (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
