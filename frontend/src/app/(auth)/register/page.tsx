"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { register as apiRegister, saveTokens, getMe } from "@/lib/api/auth";
import { useAuthStore } from "@/store/auth";

const schema = z.object({
  event_password: z.string().min(1, "Required"),
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "Letters, numbers, _ and - only"),
  password: z.string().min(8, "At least 8 characters"),
  email: z.union([z.string().email("Invalid email"), z.literal("")]).optional(),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setTokens, setUser } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      const tokens = await apiRegister({
        event_password: data.event_password,
        username: data.username,
        password: data.password,
        email: data.email || undefined,
      });
      saveTokens(tokens);
      setTokens(tokens.access_token, tokens.refresh_token);
      const me = await getMe();
      setUser(me);
      router.push("/gallery");
    } catch (err: any) {
      const msg = err?.response?.data?.detail;
      if (msg === "Invalid event password") setError("Wrong event password. Ask the organizer.");
      else if (msg === "Username already taken") setError("That username is taken. Try another.");
      else setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-purple-100 px-4 py-8">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 animate-slide-up">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Join the wedding</h1>
        <p className="text-center text-sm text-gray-500 mb-6">Enter the event password to create your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event password</label>
            <input
              {...register("event_password")}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Ask the organizer"
            />
            {errors.event_password && <p className="text-xs text-red-500 mt-1">{errors.event_password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              {...register("username")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="your_name"
              autoComplete="username"
            />
            {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              {...register("password")}
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Min. 8 characters"
              autoComplete="new-password"
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-gray-400">(optional)</span></label>
            <input
              {...register("email")}
              type="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-brand-600 font-medium hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
