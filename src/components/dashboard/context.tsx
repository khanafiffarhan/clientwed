"use client";
import { createContext, useContext } from "react";
import type { AppUser } from "@/lib/constants";

export const DashboardContext = createContext<{ user: AppUser; refresh: () => void } | null>(null);
export function useDashboardUser() {
  const c = useContext(DashboardContext);
  if (!c) throw new Error("useDashboardUser must be used inside the dashboard layout");
  return c;
}
