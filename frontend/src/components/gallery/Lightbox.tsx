"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10 p-2"
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
          className="absolute left-4 text-white/70 hover:text-white z-10 p-3"
          aria-label="Previous"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Media */}
      <div
        className="max-w-[90vw] max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {item.media_type === "image" ? (
          item.original_url ? (
            <img
              src={item.original_url}
              alt={item.original_filename}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded"
            />
          ) : null
        ) : (
          item.original_url ? (
            <video
              src={item.original_url}
              controls
              autoPlay
              className="max-w-[90vw] max-h-[90vh] rounded"
            />
          ) : null
        )}
      </div>

      {/* Next */}
      {index < items.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 text-white/70 hover:text-white z-10 p-3"
          aria-label="Next"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Counter + download */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-6">
        <span className="text-white/60 text-sm">
          {index + 1} / {items.length}
        </span>
        {item.original_url && (
          <a
            href={item.original_url}
            download={item.original_filename}
            onClick={(e) => e.stopPropagation()}
            className="text-white/60 hover:text-white text-sm underline"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
}
