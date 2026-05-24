"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { getGallery, deleteMedia } from "@/lib/api/media";
import type { MediaItem } from "@/types";

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const PAGE_SIZE = 50;

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/gallery");
  }, [user, router]);

  async function load(p: number) {
    setLoading(true);
    try {
      const resp = await getGallery({ page: p, page_size: PAGE_SIZE });
      setItems(resp.items);
      setTotal(resp.total);
      setPage(p);
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(id: number) {
    if (!confirm("Delete this media permanently?")) return;
    setDeleting(id);
    try {
      await deleteMedia(id);
      setItems((prev) => prev.filter((m) => m.id !== id));
      setTotal((t) => t - 1);
    } catch (e: any) {
      alert(e?.response?.data?.detail || "Delete failed");
    }
    setDeleting(null);
  }

  if (user?.role !== "admin") return null;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin — Content Moderation</h1>
        <span className="text-sm text-gray-400">{total} total items</span>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <p className="text-center py-12 text-gray-400">No media uploaded yet.</p>
      )}

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white border border-gray-100 rounded-lg p-3 hover:border-gray-200"
          >
            {/* Thumbnail */}
            <div className="w-14 h-14 shrink-0 bg-gray-100 rounded overflow-hidden relative">
              {item.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.thumbnail_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                  {item.media_type === "video" ? "▶" : "📷"}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.original_filename}</p>
              <p className="text-xs text-gray-400">
                @{item.uploader_username ?? "unknown"} &middot;{" "}
                {(item.file_size / (1024 * 1024)).toFixed(1)} MB &middot;{" "}
                {item.media_type} &middot; {item.status} &middot;{" "}
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {item.original_url && (
                <a
                  href={item.original_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline"
                >
                  View
                </a>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deleting === item.id}
                className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded disabled:opacity-50"
              >
                {deleting === item.id ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => load(page - 1)}
            disabled={page === 1 || loading}
            className="px-3 py-1.5 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
          >
            ← Prev
          </button>
          <span className="px-3 py-1.5 text-sm text-gray-500">
            Page {page} / {totalPages}
          </span>
          <button
            onClick={() => load(page + 1)}
            disabled={page === totalPages || loading}
            className="px-3 py-1.5 text-sm border rounded disabled:opacity-40 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
