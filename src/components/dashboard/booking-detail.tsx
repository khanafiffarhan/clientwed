"use client";
import { CalendarDays, Mail, MapPin, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Booking } from "@/lib/constants";

export function BookingDetailDialog({ booking, onClose, as }: { booking: Booking | null; onClose: () => void; as: "customer" | "vendor" }) {
  const other = as === "customer" ? booking?.vendor : booking?.customer;
  return (
    <Dialog open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {booking && (
          <>
            <DialogHeader><DialogTitle>{booking.service?.serviceName || "Service no longer available"}</DialogTitle><DialogDescription className="flex items-center gap-2">{booking.service?.category}<StatusBadge status={booking.status} /></DialogDescription></DialogHeader>
            <dl className="grid gap-3 text-sm">
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brass" /><dt className="text-muted-foreground">Event date</dt><dd className="ml-auto font-medium">{formatDate(booking.eventDate)}</dd></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brass" /><dt className="text-muted-foreground">Event location</dt><dd className="ml-auto text-right font-medium">{booking.eventLocation}</dd></div>
              {booking.service?.price != null && <div className="flex items-center gap-2"><span className="w-4 text-center text-brass">$</span><dt className="text-muted-foreground">Service price</dt><dd className="ml-auto font-medium">{formatPrice(booking.service.price)}</dd></div>}
              <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brass" /><dt className="text-muted-foreground">Requested on</dt><dd className="ml-auto font-medium">{formatDate(booking.createdAt)}</dd></div>
            </dl>
            <div className="rounded-md bg-muted p-4 text-sm">
              <p className="mb-1 font-medium capitalize">{as === "customer" ? "Vendor" : "Customer"}</p>
              <p>{other?.name || "Unknown"}</p>
              {other?.email && <p className="flex items-center gap-1.5 text-muted-foreground"><Mail className="h-3.5 w-3.5" />{other.email}</p>}
              {other?.phone && <p className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3.5 w-3.5" />{other.phone}</p>}
            </div>
            <div className="text-sm"><p className="mb-1 font-medium">Message</p><p className="whitespace-pre-line text-muted-foreground">{booking.message || "No message was added."}</p></div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
