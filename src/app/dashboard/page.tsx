"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDashboardUser } from "@/components/dashboard/context";
import { PageLoader } from "@/components/states";

export default function DashboardIndex() {
  const { user } = useDashboardUser();
  const router = useRouter();
  useEffect(() => { if (!user.needsRoleSelection) router.replace(`/dashboard/${user.role}`); }, [user, router]);
  return <PageLoader />;
}
