"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { login, saveTokens, getMe } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const schema = z.object({
  username: z.string().min(1, "Required"),
  password: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { setTokens, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const tokens = await login(data.username, data.password);
      saveTokens(tokens);
      setTokens(tokens.access_token, tokens.refresh_token);
      const me = await getMe();
      setUser(me);
      router.push("/gallery");
    } catch (err: any) {
      const msg = err?.response?.data?.detail;
      if (msg === "Invalid credentials") setError(t("errors.invalidCredentials"));
      else if (msg === "Account disabled") setError(t("errors.unknown"));
      else setError(t("errors.unknown"));
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-purple-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 animate-slide-up">
        <div className="flex justify-end mb-2">
          <LanguageSwitcher />
        </div>
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{t("app.name")}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.username")}</label>
            <input
              {...register("username")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              autoComplete="username"
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("auth.password")}</label>
            <input
              {...register("password")}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              autoComplete="current-password"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">{error}</div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? t("auth.loggingIn") : t("auth.login")}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-brand-600 font-medium hover:underline">
            {t("auth.registerHere")}
          </Link>
        </p>
      </div>
    </div>
  );
}
