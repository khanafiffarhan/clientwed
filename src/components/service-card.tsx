import Link from "next/link";
import { MapPin, Crown, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, initials } from "@/lib/utils";
import type { Service } from "@/lib/constants";

export function ServiceImage({ src, alt, className = "" }: { src?: string; alt: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  if (src) return <img src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  return <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-petal to-accent text-brass"><ImageOff className="h-8 w-8" aria-label="No image" /></div>;
}

export function ServiceCard({ s }: { s: Service }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ServiceImage src={s.images?.[0]} alt={s.serviceName} className="transition-transform duration-500 group-hover:scale-105" />
        <Badge variant="secondary" className="absolute left-3 top-3 bg-background/90">{s.category}</Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold leading-snug">{s.serviceName}</h3>
          <p className="shrink-0 font-display text-xl font-semibold text-primary">{formatPrice(s.price)}</p>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{s.location}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-semibold">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {s.vendor?.image ? <img src={s.vendor.image} alt="" className="h-full w-full object-cover" /> : initials(s.vendor?.name)}
          </span>
          <span className="truncate">{s.vendor?.name || "Vendor"}</span>
          {s.vendor?.isPremium && <Badge variant="brass" className="gap-1"><Crown className="h-3 w-3" />Premium</Badge>}
        </div>
        <Button asChild className="mt-auto w-full"><Link href={`/services/${s._id}`}>View details</Link></Button>
      </div>
    </article>
  );
}

export const ServiceCardSkeleton = () => (
  <div className="overflow-hidden rounded-lg border bg-card">
    <div className="aspect-[4/3] animate-pulse bg-muted" />
    <div className="space-y-3 p-5"><div className="h-5 w-3/4 animate-pulse rounded bg-muted" /><div className="h-4 w-1/2 animate-pulse rounded bg-muted" /><div className="h-10 animate-pulse rounded bg-muted" /></div>
  </div>
);
