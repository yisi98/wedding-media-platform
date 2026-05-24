import type { MediaItem } from "@/types";
import MediaThumbnail from "./MediaThumbnail";

interface Props {
  items: MediaItem[];
  onItemClick: (index: number) => void;
}

export default function MediaGrid({ items, onItemClick }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
      {items.map((item, idx) => (
        <MediaThumbnail key={item.id} item={item} onClick={() => onItemClick(idx)} />
      ))}
    </div>
  );
}
