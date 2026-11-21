import { Suspense } from "react";
import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth-forms";
export const metadata: Metadata = { title: "Sign Up" };
export default function Page() { return <Suspense><SignUpForm /></Suspense>; }
