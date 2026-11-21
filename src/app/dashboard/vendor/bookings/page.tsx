"use client";
import { useState } from "react";
import { Check, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { BookingDetailDialog } from "@/components/dashboard/booking-detail";
import { EmptyState, ErrorState, PageHeader, PageLoader } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";
import type { Booking } from "@/lib/constants";

export default function VendorBookings() {
  const [status, setStatus] = useState("");
  const { data, loading, error, refetch } = useApi<Booking[]>(`/vendor/bookings${status ? `?status=${status}` : ""}`);
  const [view, setView] = useState<Booking | null>(null);
  const [action, setAction] = useState<{ b: Booking; status: "accepted" | "rejected" } | null>(null);
  const [busy, setBusy] = useState(false);

  async function run() {
    if (!action) return; setBusy(true);
    try { await api(`/vendor/bookings/${action.b._id}/status`, { method: "PATCH", body: { status: action.status } }); toast.success(`Request ${action.status}`); setAction(null); await refetch(); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not update the request"); setAction(null); await refetch(); }
    finally { setBusy(false); }
  }
  return (
    <>
      <PageHeader title="Booking requests" text="Accept or reject requests for your services. A decision is final." action={
        <Select aria-label="Filter by status" className="w-44" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option><option value="pending">Pending</option><option value="accepted">Accepted</option><option value="rejected">Rejected</option><option value="cancelled">Cancelled</option>
        </Select>} />
      {loading ? <PageLoader /> : error ? <ErrorState message={error.message} onRetry={refetch} /> : !data?.length ? (
        <EmptyState title="No booking requests" text={status ? "No requests match this status." : "When customers request your services, they’ll show up here."} />
      ) : (
        <Card><Table>
          <THead><TR><TH>Customer</TH><TH>Service</TH><TH>Event date</TH><TH>Location</TH><TH>Status</TH><TH className="text-right">Actions</TH></TR></THead>
          <TBody>
            {data.map((b) => (
              <TR key={b._id}>
                <TD><p className="font-medium">{b.customer?.name}</p><p className="text-xs text-muted-foreground">{b.customer?.email}</p></TD>
                <TD className="max-w-[200px]"><p className="truncate">{b.service?.serviceName || "Removed service"}</p></TD>
                <TD className="whitespace-nowrap">{formatDate(b.eventDate)}</TD>
                <TD className="max-w-[160px]"><p className="truncate" title={b.eventLocation}>{b.eventLocation}</p></TD>
                <TD><StatusBadge status={b.status} /></TD>
                <TD><div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setView(b)} aria-label="View details"><Eye /></Button>
                  {b.status === "pending" && (<>
                    <Button size="sm" onClick={() => setAction({ b, status: "accepted" })}><Check />Accept</Button>
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => setAction({ b, status: "rejected" })}><X />Reject</Button>
                  </>)}
                </div></TD>
              </TR>
            ))}
          </TBody>
        </Table></Card>
      )}
      <BookingDetailDialog booking={view} onClose={() => setView(null)} as="vendor" />
      <ConfirmDialog open={!!action} onOpenChange={(o) => !o && setAction(null)} loading={busy} destructive={action?.status === "rejected"}
        confirmLabel={action?.status === "accepted" ? "Accept request" : "Reject request"} title={`${action?.status === "accepted" ? "Accept" : "Reject"} this request?`}
        description={`${action?.b.customer?.name}’s request for ${formatDate(action?.b.eventDate)} will be marked ${action?.status}. It can’t be processed again afterwards.`} onConfirm={run} />
    </>
  );
}
