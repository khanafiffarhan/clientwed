"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "./api";

/** Fetch helper with loading / error / refetch. Pass `null` as path to skip. */
export function useApi<T = any>(path: string | null, opts: { auth?: boolean } = {}) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<ApiError | null>(null);
  const seq = useRef(0);

  const load = useCallback(async (silent = false) => {
    if (!path) return;
    const id = ++seq.current;
    if (!silent) setLoading(true);
    setError(null);
    try {
      const d = await api<T>(path, { auth: opts.auth ?? true });
      if (id === seq.current) setData(d);
    } catch (e) {
      if (id === seq.current) setError(e instanceof ApiError ? e : new ApiError("Something went wrong", 500));
    } finally {
      if (id === seq.current) setLoading(false);
    }
  }, [path, opts.auth]);

  useEffect(() => { if (path) load(); else { setLoading(false); setData(null); } }, [path, load]);
  return { data, loading, error, refetch: () => load(true), setData };
}

export function useDebounce<T>(value: T, delay = 400) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return v;
}
