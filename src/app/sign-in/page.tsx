import { Suspense } from "react";
import type { Metadata } from "next";
import { SignInForm } from "@/components/auth-forms";
export const metadata: Metadata = { title: "Sign In" };
export default function Page() { return <Suspense><SignInForm /></Suspense>; }
