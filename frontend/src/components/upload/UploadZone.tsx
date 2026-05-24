"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { sha256File } from "@/lib/hash";
import { initUpload, uploadToStorage, confirmUpload, isDuplicateWarning } from "@/lib/api/media";
import type { UploadFile } from "@/types";
import UploadFileRow from "./UploadFileRow";

const ACCEPTED = {
  "image/jpeg": [],
  "image/png": [],
  "image/webp": [],
  "image/heic": [],
  "video/mp4": [],
  "video/quicktime": [],
  "video/webm": [],
};

export default function UploadZone() {
  const [files, setFiles] = useState<UploadFile[]>([]);

  const updateFile = useCallback((index: number, patch: Partial<UploadFile>) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }, []);

  async function processFile(file: File, index: number) {
    updateFile(index, { status: "uploading", progress: 0 });

    try {
      const hash = await sha256File(file);
      updateFile(index, { hash });

      const initResp = await initUpload({
        filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        file_hash: hash,
      });

      if (isDuplicateWarning(initResp)) {
        updateFile(index, { status: "duplicate", duplicateInfo: initResp });
        return;
      }

      await uploadToStorage(initResp.upload_url, initResp.upload_fields, file, (pct) =>
        updateFile(index, { progress: pct })
      );

      updateFile(index, { status: "confirming", mediaId: initResp.media_id });
      await confirmUpload(initResp.media_id);
      updateFile(index, { status: "done", progress: 100 });
    } catch (err: any) {
      updateFile(index, {
        status: "error",
        errorMessage: err?.response?.data?.detail || "Upload failed",
      });
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const startIdx = files.length;
    const newEntries: UploadFile[] = acceptedFiles.map((f) => ({
      file: f,
      hash: "",
      status: "queued",
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...newEntries]);

    // Process sequentially to avoid hammering the server
    acceptedFiles.reduce((chain, file, i) => {
      return chain.then(() => processFile(file, startIdx + i));
    }, Promise.resolve());
  }, [files.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    multiple: true,
  });

  const done = files.filter((f) => f.status === "done").length;
  const total = files.length;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-brand-500 bg-brand-50"
            : "border-gray-300 hover:border-brand-400 bg-white"
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-3">📷</div>
        <p className="font-medium text-gray-700">
          {isDragActive ? "Drop files here" : "Drag & drop photos or videos here"}
        </p>
        <p className="text-sm text-gray-400 mt-1">or click to select files</p>
        <p className="text-xs text-gray-400 mt-3">JPEG, PNG, HEIC, WebP — max 50MB · MP4, MOV, WebM — max 500MB</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {done > 0 && (
            <p className="text-sm text-gray-500">
              {done} of {total} uploaded
            </p>
          )}
          {files.map((f, idx) => (
            <UploadFileRow key={idx} file={f} />
          ))}
        </div>
      )}
    </div>
  );
}
