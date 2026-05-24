export type UserRole = "guest" | "admin";
export type Language = "en" | "zh" | "ru";
export type MediaType = "image" | "video";
export type MediaStatus = "pending" | "processing" | "ready" | "failed";

export interface User {
  id: number;
  username: string;
  email: string | null;
  role: UserRole;
  language: Language;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface MediaItem {
  id: number;
  filename: string;
  original_filename: string;
  media_type: MediaType;
  status: MediaStatus;
  file_size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  original_url: string | null;
  uploader_id: number | null;
  uploader_username: string | null;
  created_at: string;
}

export interface GalleryResponse {
  items: MediaItem[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

export interface DuplicateWarning {
  is_duplicate: true;
  existing_media_id: number;
  existing_media_url: string;
}

export interface PresignedUploadResponse {
  upload_url: string;
  upload_fields: Record<string, string>;
  media_id: number;
  expires_in: number;
}

export type UploadInitResponse = DuplicateWarning | PresignedUploadResponse;

export interface UploadFile {
  file: File;
  hash: string;
  status: "queued" | "uploading" | "confirming" | "done" | "duplicate" | "error";
  progress: number;
  mediaId?: number;
  errorMessage?: string;
  duplicateInfo?: DuplicateWarning;
}
