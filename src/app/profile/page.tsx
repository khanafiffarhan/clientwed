"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/states";
import { api } from "@/lib/api";

// /profile → role-specific profile settings inside the dashboard
export default function ProfileRedirect() {
  const router = useRouter();
  useEffect(() => {
    api<{ role: string }>("/me").then((u) => router.replace(`/dashboard/${u.role}/profile`)).catch(() => router.replace("/sign-in?redirect=/profile"));
  }, [router]);
  return <PageLoader />;
}
