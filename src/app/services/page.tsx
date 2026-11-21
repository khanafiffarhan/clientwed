import { Suspense } from "react";
import type { Metadata } from "next";
import { BrowseServices } from "@/components/browse-services";
import { PageLoader } from "@/components/states";

export const metadata: Metadata = { title: "Browse Services" };
export default function Page() {
  return <Suspense fallback={<PageLoader label="Loading services…" />}><BrowseServices /></Suspense>;
}
