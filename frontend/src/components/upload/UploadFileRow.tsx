import type { UploadFile } from "@/types";

interface Props {
  file: UploadFile;
}

const STATUS_LABELS: Record<UploadFile["status"], string> = {
  queued: "Waiting…",
  uploading: "Uploading",
  confirming: "Processing…",
  done: "Done",
  duplicate: "Already exists",
  error: "Failed",
};

const STATUS_COLORS: Record<UploadFile["status"], string> = {
  queued: "text-gray-400",
  uploading: "text-brand-600",
  confirming: "text-yellow-600",
  done: "text-green-600",
  duplicate: "text-orange-500",
  error: "text-red-500",
};

export default function UploadFileRow({ file }: Props) {
  const label = STATUS_LABELS[file.status];
  const color = STATUS_COLORS[file.status];
  const sizeKB = (file.file.size / 1024).toFixed(0);

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">{file.file.name}</p>
        <p className="text-xs text-gray-400">{sizeKB} KB</p>
      </div>

      <div className="text-right shrink-0">
        <p className={`text-xs font-medium ${color}`}>{label}</p>
        {file.status === "uploading" && (
          <p className="text-xs text-gray-400">{file.progress}%</p>
        )}
        {file.errorMessage && (
          <p className="text-xs text-red-400 max-w-[160px] truncate">{file.errorMessage}</p>
        )}
      </div>

      {/* Progress bar */}
      {file.status === "uploading" && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all duration-200"
            style={{ width: `${file.progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
