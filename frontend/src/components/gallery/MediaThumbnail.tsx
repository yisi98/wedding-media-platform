"use client";
import { useState } from "react";
import Image from "next/image";
import type { MediaItem } from "@/types";

interface Props {
  item: MediaItem;
  onClick: () => void;
}

export default function MediaThumbnail({ item, onClick }: Props) {
  const [loaded, setLoaded] = useState(false);
  const isVideo = item.media_type === "video";

  return (
    <button
      onClick={onClick}
      className="relative aspect-square overflow-hidden bg-gray-100 rounded-sm hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-brand-500"
      aria-label={item.original_filename}
    >
      {/* Skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {item.thumbnail_url ? (
        <Image
          src={item.thumbnail_url}
          alt={item.original_filename}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
          className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          unoptimized
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-xs">{isVideo ? "Video" : "Image"}</span>
        </div>
      )}

      {/* Video play overlay */}
      {isVideo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full w-10 h-10 flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}
