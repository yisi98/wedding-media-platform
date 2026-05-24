import UploadZone from "@/components/upload/UploadZone";

export default function UploadPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Upload Photos & Videos</h1>
      <p className="text-sm text-gray-500 mb-6">
        JPEG · PNG · HEIC · WebP (max 50 MB) &nbsp;|&nbsp; MP4 · MOV · WebM (max 500 MB)
      </p>
      <UploadZone />
    </div>
  );
}
