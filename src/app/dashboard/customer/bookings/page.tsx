"use client";
import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Eye, MapPin, Store } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { BookingDetailDialog } from "@/components/dashboard/booking-detail";
import { EmptyState, ErrorState, PageHeader, PageLoader } from "@/components/states";
import { ServiceImage } from "@/components/service-card";
import { StatusBadge } from "@/components/status-badge";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";
import type { Booking } from "@/lib/constants";

export default function MyBookings() {
  const { data, loading, error, refetch } = useApi<Booking[]>("/bookings/mine");
  const [view, setView] = useState<Booking | null>(null);
  const [cancel, setCancel] = useState<Booking | null>(null);
  const [busy, setBusy] = useState(false);

  async function doCancel() {
    if (!cancel) return; setBusy(true);
    try { await api(`/bookings/${cancel._id}/cancel`, { method: "PATCH" }); toast.success("Booking request cancelled"); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not cancel the booking"); }
    finally { setBusy(false); setCancel(null); await refetch(); }
  }
  return (
    <>
      <PageHeader title="My bookings" text="Every request you’ve sent, and where it stands." />
      {loading ? <PageLoader /> : error ? <ErrorState message={error.message} onRetry={refetch} /> : !data?.length ? (
        <EmptyState title="No bookings yet" text="Find a service you like and send your first request." action={<Button asChild><Link href="/services">Browse services</Link></Button>} />
      ) : (
        <div className="grid gap-4">
          {data.map((b) => (
            <Card key={b._id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="h-32 w-full shrink-0 overflow-hidden rounded-md bg-muted sm:h-24 sm:w-36"><ServiceImage src={b.service?.images?.[0]} alt={b.service?.serviceName || "Service"} /></div>
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-display text-xl font-semibold">{b.service?.serviceName || "Service no longer available"}</h3><StatusBadge status={b.status} /></div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><Store className="h-3.5 w-3.5" />{b.vendor?.name || "Vendor"}</p>
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />Event {formatDate(b.eventDate)}</span><span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{b.eventLocation}</span></p>
                <p className="text-xs text-muted-foreground">Requested {formatDate(b.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setView(b)}><Eye />Details</Button>
                {b.status === "pending" && <Button variant="outline" size="sm" className="text-destructive" onClick={() => setCancel(b)}>Cancel</Button>}
              </div>
            </Card>
          ))}
        </div>
      )}
      <BookingDetailDialog booking={view} onClose={() => setView(null)} as="customer" />
      <ConfirmDialog open={!!cancel} onOpenChange={(o) => !o && setCancel(null)} destructive loading={busy} confirmLabel="Cancel request"
        title="Cancel this booking request?" description="The vendor will no longer see it as pending. You can send a new request later." onConfirm={doCancel} />
    </>
  );
}
