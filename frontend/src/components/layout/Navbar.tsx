"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/store/auth";
import { logout as apiLogout, clearTokens } from "@/lib/api/auth";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();

  async function handleLogout() {
    try { await apiLogout(); } catch {}
    clearTokens();
    logout();
    router.push("/login");
  }

  function navLink(href: string, label: string) {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`text-sm font-medium transition-colors ${
          active ? "text-brand-600" : "text-gray-600 hover:text-brand-600"
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/gallery" className="font-semibold text-brand-600 text-base shrink-0">
          {t("app.name")}
        </Link>

        <div className="flex items-center gap-4 flex-1">
          {navLink("/gallery", t("nav.gallery"))}
          {navLink("/upload", t("nav.upload"))}
          {user?.role === "admin" && navLink("/admin", "Admin")}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <Link
              href="/profile"
              className="text-sm text-gray-400 hidden sm:block hover:text-brand-600 transition-colors"
            >
              @{user.username}
            </Link>
          )}
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-600">
            {t("nav.logout")}
          </button>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}
