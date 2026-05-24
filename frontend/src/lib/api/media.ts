import { api } from "./client";
import type {
  GalleryResponse,
  MediaItem,
  MediaType,
  PresignedUploadResponse,
  DuplicateWarning,
  UploadInitResponse,
} from "@/types";

export async function initUpload(params: {
  filename: string;
  file_size: number;
  mime_type: string;
  file_hash: string;
}): Promise<UploadInitResponse> {
  const { data } = await api.post<UploadInitResponse>("/media/upload/init", params);
  return data;
}

export async function uploadToStorage(
  uploadUrl: string,
  uploadFields: Record<string, string>,
  file: File,
  onProgress?: (pct: number) => void
): Promise<void> {
  const formData = new FormData();
  Object.entries(uploadFields).forEach(([k, v]) => formData.append(k, v));
  formData.append("file", file);

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl);

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
      };
    }

    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed: ${xhr.status}`)));
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

/**
 * Upload a file directly to the backend, which proxies it to MinIO.
 * This avoids any MinIO CORS configuration requirements.
 */
export async function uploadFileToBackend(
  mediaId: number,
  file: File,
  onProgress?: (pct: number) => void,
): Promise<MediaItem> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<MediaItem>(`/media/upload/file/${mediaId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return data;
}

export async function confirmUpload(mediaId: number): Promise<MediaItem> {
  const { data } = await api.post<MediaItem>("/media/upload/confirm", { media_id: mediaId });
  return data;
}

export async function getGallery(params: {
  page?: number;
  page_size?: number;
  media_type?: MediaType;
  uploader_id?: number;
}): Promise<GalleryResponse> {
  const { data } = await api.get<GalleryResponse>("/media", { params });
  return data;
}

export async function getMediaItem(id: number): Promise<MediaItem> {
  const { data } = await api.get<MediaItem>(`/media/${id}`);
  return data;
}

export async function deleteMedia(id: number): Promise<void> {
  await api.delete(`/media/${id}`);
}

export function isDuplicateWarning(r: UploadInitResponse): r is DuplicateWarning {
  return (r as DuplicateWarning).is_duplicate === true;
}
