import { api } from "./client";
import type { TokenResponse, User, Language } from "@/types";

export async function register(params: {
  event_password: string;
  username: string;
  password: string;
  email?: string;
  language?: Language;
}): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/register", params);
  return data;
}

export async function login(username: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", { username, password });
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export function saveTokens(tokens: TokenResponse): void {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
}

export function clearTokens(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export async function updateProfile(params: {
  email?: string | null;
  language?: Language;
}): Promise<User> {
  const { data } = await api.put<User>("/auth/profile", params);
  return data;
}

export function isAuthenticated(): boolean {
  return typeof window !== "undefined" && !!localStorage.getItem("access_token");
}
