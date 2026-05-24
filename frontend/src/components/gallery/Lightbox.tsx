"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import type { MediaItem } from "@/types";

interface Props {
  items: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ items, initialIndex, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const item = items[index];

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(items.length - 1, i + 1)), [items.length]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Touch / swipe support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Only handle horizontal swipes (ignore vertical scrolls)
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  }

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center select-none"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2 rounded-full hover:bg-white/10"
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Prev */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-2 sm:left-4 text-white/70 hover:text-white z-10 p-3 rounded-full hover:bg-white/10"
          aria-label="Previous"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Media content */}
      <div className="max-w-[90vw] max-h-[90vh] relative" onClick={(e) => e.stopPropagation()}>
        {item.media_type === "image" && item.original_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.original_url}
            alt={item.original_filename}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded"
            draggable={false}
          />
        )}
        {item.media_type === "video" && item.original_url && (
          <video
            src={item.original_url}
            controls
            autoPlay
            playsInline
            className="max-w-[90vw] max-h-[85vh] rounded"
          />
        )}
        {!item.original_url && (
          <div className="flex items-center justify-center w-64 h-64 bg-gray-800 rounded text-gray-400">
            <p>Media not available</p>
          </div>
        )}
      </div>

      {/* Next */}
      {index < items.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-2 sm:right-4 text-white/70 hover:text-white z-10 p-3 rounded-full hover:bg-white/10"
          aria-label="Next"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Footer: counter + uploader + download */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4 sm:px-6">
        <div>
          <span className="text-white/60 text-sm">{index + 1} / {items.length}</span>
          {item.uploader_username && (
            <span className="ml-2 text-white/40 text-xs">@{item.uploader_username}</span>
          )}
        </div>
        {item.original_url && (
          <a
            href={item.original_url}
            download={item.original_filename}
            onClick={(e) => e.stopPropagation()}
            className="text-white/60 hover:text-white text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </a>
        )}
      </div>
    </div>
  );
}
