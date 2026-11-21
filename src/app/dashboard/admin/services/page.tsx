"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, ExternalLink, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Pagination } from "@/components/pagination";
import { EmptyState, ErrorState, PageHeader, PageLoader } from "@/components/states";
import { ServiceImage } from "@/components/service-card";
import { StatusBadge } from "@/components/status-badge";
import { api, ApiError } from "@/lib/api";
import { useApi, useDebounce } from "@/lib/hooks";
import { CATEGORY_NAMES, type Paged, type Service } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export default function ManageServices() {
  const [search, setSearch] = useState(""); const [status, setStatus] = useState(""); const [category, setCategory] = useState(""); const [page, setPage] = useState(1);
  const dSearch = useDebounce(search);
  useEffect(() => setPage(1), [dSearch, status, category]);
  const qs = new URLSearchParams({ page: String(page), limit: "10", ...(dSearch && { search: dSearch }), ...(status && { status }), ...(category && { category }) }).toString();
  const { data, loading, error, refetch } = useApi<Paged<Service>>(`/admin/services?${qs}`);
  const [del, setDel] = useState<Service | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function setState(s: Service, st: string) {
    setBusy(s._id);
    try { await api(`/admin/services/${s._id}/status`, { method: "PATCH", body: { status: st } }); toast.success(`Service ${st}`); await refetch(); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not update the service"); }
    finally { setBusy(null); }
  }
  async function remove() {
    if (!del) return; setBusy(del._id);
    try { await api(`/admin/services/${del._id}`, { method: "DELETE" }); toast.success("Service deleted"); setDel(null); await refetch(); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not delete the service"); }
    finally { setBusy(null); }
  }
  return (
    <>
      <PageHeader title="Manage services" text="Review submissions. Only approved and active services are public." />
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_11rem_14rem]">
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search services" className="pl-9" placeholder="Search by service name" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></Select>
        <Select aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">All categories</option>{CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}</Select>
      </div>
      {loading ? <PageLoader /> : error ? <ErrorState message={error.message} onRetry={refetch} /> : !data?.items.length ? <EmptyState title="No services found" text="Try a different search or filter." /> : (
        <>
          <Card><Table>
            <THead><TR><TH>Service</TH><TH>Vendor</TH><TH>Price</TH><TH>Status</TH><TH>Change status</TH><TH className="text-right">Actions</TH></TR></THead>
            <TBody>{data.items.map((s) => (
              <TR key={s._id}>
                <TD><div className="flex items-center gap-3"><div className="h-12 w-16 shrink-0 overflow-hidden rounded bg-muted"><ServiceImage src={s.images?.[0]} alt="" /></div><div className="min-w-0"><p className="max-w-[220px] truncate font-medium">{s.serviceName}</p><p className="text-xs text-muted-foreground">{s.category} · {s.location}</p></div></div></TD>
                <TD>{s.vendor?.name}</TD>
                <TD>{formatPrice(s.price)}</TD>
                <TD><div className="flex flex-col items-start gap-1"><StatusBadge status={s.status} />{!s.isActive && <StatusBadge status="inactive" />}</div></TD>
                <TD><Select aria-label={`Change status of ${s.serviceName}`} className="h-9 w-36" value={s.status} disabled={busy === s._id} onChange={(e) => setState(s, e.target.value)}><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option></Select></TD>
                <TD><div className="flex justify-end gap-1.5">
                  {s.status === "pending" && (<><Button size="sm" onClick={() => setState(s, "approved")} loading={busy === s._id}><Check />Approve</Button><Button size="sm" variant="outline" onClick={() => setState(s, "rejected")} disabled={busy === s._id}><X />Reject</Button></>)}
                  <Button asChild size="icon" variant="ghost" aria-label="Open service"><Link href={`/services/${s._id}`}><ExternalLink className="h-4 w-4" /></Link></Button>
                  <Button size="icon" variant="ghost" className="text-destructive" aria-label="Delete service" onClick={() => setDel(s)}><Trash2 className="h-4 w-4" /></Button>
                </div></TD>
              </TR>
            ))}</TBody>
          </Table></Card>
          <Pagination page={data.page} limit={data.limit} total={data.total} onPage={setPage} />
        </>
      )}
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} destructive confirmLabel="Delete service" loading={!!del && busy === del._id}
        title="Delete this service?" description={`“${del?.serviceName}” will be removed permanently and its pending booking requests will be cancelled.`} onConfirm={remove} />
    </>
  );
}
