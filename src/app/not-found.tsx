import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-semibold text-brass">404</p>
      <h1 className="mt-2 text-3xl font-semibold">This page doesn’t exist</h1>
      <p className="mt-2 max-w-md text-muted-foreground">The link may be broken or the page may have moved. Head back home or browse wedding services.</p>
      <div className="mt-6 flex gap-3"><Button asChild><Link href="/">Go home</Link></Button><Button asChild variant="outline"><Link href="/services">Browse services</Link></Button></div>
    </div>
  );
}
