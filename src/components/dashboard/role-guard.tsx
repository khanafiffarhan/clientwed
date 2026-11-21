"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Role } from "@/lib/constants";
import { PageLoader } from "@/components/states";
import { useDashboardUser } from "./context";

/** Blocks a dashboard section for other roles (typing another role's URL bounces you back). The API enforces the same rule. */
export function RoleGuard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user } = useDashboardUser();
  const router = useRouter();
  const allowed = user.role === role;
  useEffect(() => { if (!allowed) { toast.error("You don’t have access to that dashboard"); router.replace(`/dashboard/${user.role}`); } }, [allowed, user.role, router]);
  return allowed ? <>{children}</> : <PageLoader label="Redirecting…" />;
}
