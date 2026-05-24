"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import Navbar from "@/components/layout/Navbar";
import UploadZone from "@/components/upload/UploadZone";

export default function UploadPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();

  useEffect(() => {
    if (!accessToken) router.push("/login");
  }, [accessToken, router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Photos & Videos</h1>
        <UploadZone />
      </main>
    </div>
  );
}
