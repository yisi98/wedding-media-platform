"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { logout as apiLogout, clearTokens } from "@/lib/api/auth";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    try {
      await apiLogout();
    } catch {}
    clearTokens();
    logout();
    router.push("/login");
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/gallery" className="font-semibold text-brand-600 text-lg">
          Wedding Photos
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <>
              <Link href="/upload" className="text-sm font-medium text-gray-700 hover:text-brand-600">
                Upload
              </Link>
              <span className="text-sm text-gray-500 hidden sm:block">@{user.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-600"
              >
                Logout
              </button>
            </>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
