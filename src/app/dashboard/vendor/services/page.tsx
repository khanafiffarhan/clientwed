"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { EmptyState, ErrorState, PageHeader, PageLoader } from "@/components/states";
import { ServiceImage } from "@/components/service-card";
import { StatusBadge } from "@/components/status-badge";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Service } from "@/lib/constants";

export default function MyServices() {
  const { data, loading, error, refetch } = useApi<Service[]>("/vendor/services");
  const [del, setDel] = useState<Service | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function toggle(s: Service) {
    setBusy(s._id);
    try { await api(`/vendor/services/${s._id}/availability`, { method: "PATCH", body: { isActive: !s.isActive } }); toast.success(s.isActive ? "Service paused" : "Service is available again"); await refetch(); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not update availability"); }
    finally { setBusy(null); }
  }
  async function remove() {
    if (!del) return; setBusy(del._id);
    try { await api(`/vendor/services/${del._id}`, { method: "DELETE" }); toast.success("Service deleted"); setDel(null); await refetch(); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not delete the service"); }
    finally { setBusy(null); }
  }
  return (
    <>
      <PageHeader title="My services" text="Approval status and availability for everything you’ve published." action={<Button asChild><Link href="/dashboard/vendor/services/new"><Plus />Add service</Link></Button>} />
      {loading ? <PageLoader /> : error ? <ErrorState message={error.message} onRetry={refetch} /> : !data?.length ? (
        <EmptyState title="You haven’t added a service yet" text="Publish your first service and it will go to an admin for approval." action={<Button asChild><Link href="/dashboard/vendor/services/new">Add service</Link></Button>} />
      ) : (
        <div className="grid gap-4">
          {data.map((s) => (
            <Card key={s._id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-md bg-muted sm:h-24 sm:w-36"><ServiceImage src={s.images?.[0]} alt={s.serviceName} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-display text-xl font-semibold">{s.serviceName}</h3><StatusBadge status={s.status} /><StatusBadge status={s.isActive ? "active" : "inactive"} /></div>
                <p className="mt-1 text-sm text-muted-foreground">{s.category} · {s.location} · {formatPrice(s.price)} · Added {formatDate(s.createdAt)}</p>
                {s.status === "rejected" && <p className="mt-1 text-xs text-destructive">Rejected by an admin. Customers can’t see it. Edit and resubmit to request another review.</p>}
                {s.status === "pending" && <p className="mt-1 text-xs text-muted-foreground">Waiting for admin approval.</p>}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => toggle(s)} loading={busy === s._id}>{s.isActive ? <><EyeOff />Pause</> : <><Eye />Activate</>}</Button>
                <Button asChild variant="outline" size="sm"><Link href={`/dashboard/vendor/services/${s._id}/edit`}><Pencil />Edit</Link></Button>
                <Button variant="outline" size="sm" className="text-destructive" onClick={() => setDel(s)}><Trash2 />Delete</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog open={!!del} onOpenChange={(o) => !o && setDel(null)} destructive confirmLabel="Delete service" loading={!!del && busy === del._id}
        title="Delete this service?" description={`“${del?.serviceName}” will be removed permanently and any pending booking requests for it will be cancelled.`} onConfirm={remove} />
    </>
  );
}
