"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

// Dashboards have their own layout (sidebar + content), so the public navbar/footer are hidden there.
export function SiteShell({ children }: { children: React.ReactNode }) {
  const dash = usePathname().startsWith("/dashboard");
  return (
    <>
      {!dash && <Navbar />}
      <main className="min-h-[60vh]">{children}</main>
      {!dash && <Footer />}
    </>
  );
}
