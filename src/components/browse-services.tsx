"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input, Select } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceCard, ServiceCardSkeleton } from "@/components/service-card";
import { EmptyState, ErrorState } from "@/components/states";
import { Pagination } from "@/components/pagination";
import { CATEGORY_NAMES, type Paged, type Service } from "@/lib/constants";
import { api, ApiError } from "@/lib/api";
import { useDebounce } from "@/lib/hooks";

export function BrowseServices() {
  const router = useRouter();
  const sp = useSearchParams();
  const [search, setSearch] = useState(sp.get("search") || "");
  const [location, setLocation] = useState(sp.get("location") || "");
  const [category, setCategory] = useState(sp.get("category") || "");
  const [sort, setSort] = useState(sp.get("sort") || "newest");
  const [page, setPage] = useState(Number(sp.get("page")) || 1);
  const dSearch = useDebounce(search), dLocation = useDebounce(location);
  const [res, setRes] = useState<Paged<Service> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  // Reset to page 1 whenever a filter changes
  useEffect(() => { setPage(1); }, [dSearch, dLocation, category, sort]);

  useEffect(() => {
    let alive = true;
    setLoading(true); setError(null);
    api<Paged<Service>>("/services", { auth: false, query: { search: dSearch, location: dLocation, category, sort, page, limit: 9 } })
      .then((d) => alive && setRes(d))
      .catch((e: ApiError) => alive && setError(e.message))
      .finally(() => alive && setLoading(false));
    const q = new URLSearchParams();
    if (dSearch) q.set("search", dSearch); if (dLocation) q.set("location", dLocation);
    if (category) q.set("category", category); if (sort !== "newest") q.set("sort", sort); if (page > 1) q.set("page", String(page));
    router.replace(q.toString() ? `/services?${q}` : "/services", { scroll: false });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dSearch, dLocation, category, sort, page, nonce]);

  const hasFilters = !!(search || location || category || sort !== "newest");
  const clear = () => { setSearch(""); setLocation(""); setCategory(""); setSort("newest"); };

  return (
    <div className="container py-10">
      <div className="mb-8"><h1 className="text-4xl font-semibold sm:text-5xl">Browse wedding services</h1><p className="mt-2 text-muted-foreground">Search, filter and sort approved services from vendors across the country.</p></div>
      <div className="mb-8 grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search services by name" className="pl-9" placeholder="Search by service name" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}</Select>
        <Input aria-label="Filter by location" placeholder="Location (e.g. Dhaka)" value={location} onChange={(e) => setLocation(e.target.value)} />
        <div className="relative"><SlidersHorizontal className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Select aria-label="Sort services" className="pl-9" value={sort} onChange={(e) => setSort(e.target.value)}><option value="newest">Newest first</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></Select></div>
        <Button variant="ghost" onClick={clear} disabled={!hasFilters}><X /> Clear</Button>
      </div>

      {error ? <ErrorState message={error} onRetry={() => setNonce((n) => n + 1)} /> : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <ServiceCardSkeleton key={i} />)}</div>
      ) : !res?.items.length ? (
        <EmptyState title="No services match your search" text="Try a different name, location or category." action={hasFilters ? <Button variant="outline" onClick={clear}>Clear filters</Button> : undefined} />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">{res.total} service{res.total === 1 ? "" : "s"} found</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{res.items.map((s) => <ServiceCard key={s._id} s={s} />)}</div>
          <Pagination page={res.page} limit={res.limit} total={res.total} onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </>
      )}
    </div>
  );
}
