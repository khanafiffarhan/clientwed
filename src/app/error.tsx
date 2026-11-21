"use client";
import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">An unexpected error occurred. Try again, and if it keeps happening, come back in a few minutes.</p>
      <Button className="mt-6" onClick={reset}>Try again</Button>
    </div>
  );
}
