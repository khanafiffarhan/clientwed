"use client";
import { authClient } from "./auth-client";

export class ApiError extends Error {
  status: number; code?: string;
  constructor(message: string, status: number, code?: string) { super(message); this.status = status; this.code = code; }
}

let cache: { token: string; exp: number } | null = null;
export const clearToken = () => { cache = null; };

async function getToken(force = false): Promise<string | null> {
  if (!force && cache && cache.exp > Date.now()) return cache.token;
  try {
    const res: any = await authClient.token();
    const token = res?.data?.token;
    if (!token) { cache = null; return null; }
    cache = { token, exp: Date.now() + 20 * 60 * 1000 }; // server JWT lives 30 min
    return token;
  } catch { cache = null; return null; }
}

type Opts = { method?: string; body?: unknown; auth?: boolean; query?: Record<string, string | number | undefined | null> };

export async function api<T = any>(path: string, opts: Opts = {}, retry = true): Promise<T> {
  const { method = "GET", body, auth = true, query } = opts;
  const qs = query ? "?" + new URLSearchParams(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "").map(([k, v]) => [k, String(v)])).toString() : "";
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiError("Please sign in to continue", 401, "NO_TOKEN");
    headers.Authorization = `Bearer ${token}`;
  }
  let res: Response;
  try {
    res = await fetch(`/api${path}${qs}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError("Network error. Check your connection and try again.", 0, "NETWORK");
  }
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && auth && retry) { clearToken(); await getToken(true); return api<T>(path, opts, false); }
  if (res.status === 403 && data?.code === "BLOCKED") {
    clearToken(); await authClient.signOut();
    if (typeof window !== "undefined") window.location.href = "/sign-in?blocked=1";
  }
  if (!res.ok) throw new ApiError(data?.message || "Request failed", res.status, data?.code);
  return data as T;
}

export async function uploadImage(file: File): Promise<string> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new ApiError("Only JPG, PNG, WEBP or GIF images are allowed", 400);
  if (file.size > 4 * 1024 * 1024) throw new ApiError("Image must be 4MB or smaller", 400);
  const fd = new FormData(); fd.append("image", file);
  let res: Response;
  try { res = await fetch("/api/upload", { method: "POST", body: fd }); }
  catch { throw new ApiError("Network error while uploading the image", 0); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data?.message || "Image upload failed", res.status);
  return data.url as string;
}
