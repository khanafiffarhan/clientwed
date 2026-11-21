"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, Crown, Mail, MapPin, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ErrorState, PageLoader } from "@/components/states";
import { ServiceImage } from "@/components/service-card";
import { StatusBadge } from "@/components/status-badge";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { formatPrice, initials, todayISO } from "@/lib/utils";
import type { AppUser, Service } from "@/lib/constants";

export function ServiceDetails({ id }: { id: string }) {
  const router = useRouter();
  const { data: s, loading, error, refetch } = useApi<Service>(`/services/${encodeURIComponent(id)}`);
  const { data: me } = useApi<AppUser>("/me");
  const [img, setImg] = useState(0);
  const [open, setOpen] = useState(false);

  if (loading) return <PageLoader label="Loading service…" />;
  if (error?.status === 401) { router.replace(`/sign-in?redirect=/services/${id}`); return <PageLoader label="Redirecting to sign in…" />; }
  if (error) {
    const missing = error.status === 400 || error.status === 404;
    return (
      <div className="container max-w-xl py-16">
        <ErrorState message={missing ? "We couldn’t find this service. It may have been removed, or the link may be wrong." : error.message} onRetry={missing ? undefined : refetch} />
        <div className="mt-6 text-center"><Button asChild variant="outline"><Link href="/services">Back to services</Link></Button></div>
      </div>
    );
  }
  if (!s) return null;
  const isOwner = me?.id === s.vendorId;
  const bookable = s.status === "approved" && s.isActive;

  return (
    <div className="container py-10">
      <nav className="mb-6 text-sm text-muted-foreground"><Link href="/services" className="hover:text-foreground">Services</Link> / <span>{s.category}</span></nav>
      <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <div className="aspect-[16/10] overflow-hidden rounded-lg border bg-muted"><ServiceImage src={s.images?.[img]} alt={s.serviceName} /></div>
          {s.images?.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {s.images.map((u, i) => (
                <button key={u} onClick={() => setImg(i)} aria-label={`Show image ${i + 1}`} className={`h-20 w-28 shrink-0 overflow-hidden rounded-md border-2 ${i === img ? "border-brass" : "border-transparent"}`}><ServiceImage src={u} alt="" /></button>
              ))}
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold">About this service</h2>
            <p className="mt-3 max-w-prose whitespace-pre-line leading-relaxed text-muted-foreground">{s.description}</p>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex flex-wrap gap-2"><Badge variant="secondary">{s.category}</Badge>{!bookable && <StatusBadge status={s.status === "approved" ? "inactive" : s.status} />}</div>
            <h1 className="mt-3 text-3xl font-semibold leading-tight">{s.serviceName}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" />{s.location}</p>
            <p className="mt-5 font-display text-4xl font-semibold text-primary">{formatPrice(s.price)}</p>
            <div className="mt-6">
              {!bookable ? (
                <p className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />This service is not open for booking right now.</p>
              ) : isOwner ? (
                <p className="rounded-md bg-muted p-3 text-sm">This is your service. Vendors can’t book their own services.</p>
              ) : me?.role === "admin" ? (
                <p className="rounded-md bg-muted p-3 text-sm">Admin accounts can’t submit booking requests.</p>
              ) : me?.role === "vendor" ? (
                <p className="rounded-md bg-muted p-3 text-sm">Booking requests are sent from customer accounts. Sign in with a customer account to book.</p>
              ) : (
                <Button size="lg" className="w-full" onClick={() => setOpen(true)}><CalendarDays /> Request booking</Button>
              )}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-xl font-semibold">Vendor</h3>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-accent font-semibold">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {s.vendor?.image ? <img src={s.vendor.image} alt="" className="h-full w-full object-cover" /> : initials(s.vendor?.name)}
              </span>
              <div className="min-w-0"><p className="flex items-center gap-2 font-medium">{s.vendor?.name}{s.vendor?.isPremium && <Badge variant="brass" className="gap-1"><Crown className="h-3 w-3" />Premium</Badge>}</p>
                {s.vendor?.email && <p className="flex items-center gap-1.5 truncate text-sm text-muted-foreground"><Mail className="h-3.5 w-3.5" />{s.vendor.email}</p>}</div>
            </div>
          </div>
        </aside>
      </div>
      <BookingDialog open={open} onOpenChange={setOpen} service={s} />
    </div>
  );
}

function BookingDialog({ open, onOpenChange, service }: { open: boolean; onOpenChange: (o: boolean) => void; service: Service }) {
  const router = useRouter();
  const [form, setForm] = useState({ eventDate: "", eventLocation: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.eventDate) er.eventDate = "Choose your event date"; else if (form.eventDate < todayISO()) er.eventDate = "Event date cannot be in the past";
    if (form.eventLocation.trim().length < 3) er.eventLocation = "Enter the event location";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await api("/bookings", { method: "POST", body: { serviceId: service._id, ...form } });
      toast.success("Booking request sent. The vendor will review it shortly.");
      onOpenChange(false); setForm({ eventDate: "", eventLocation: "", message: "" });
      router.push("/dashboard/customer/bookings");
    } catch (err) { toast.error(err instanceof ApiError ? err.message : "Could not send the request"); }
    finally { setBusy(false); }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Request a booking</DialogTitle><DialogDescription>{service.serviceName} · {formatPrice(service.price)}</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="space-y-1.5"><Label htmlFor="eventDate">Event date</Label><Input id="eventDate" type="date" min={todayISO()} value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} aria-invalid={!!errors.eventDate} />{errors.eventDate && <p className="text-xs text-destructive">{errors.eventDate}</p>}</div>
          <div className="space-y-1.5"><Label htmlFor="eventLocation">Event location</Label><Input id="eventLocation" placeholder="Venue or city" value={form.eventLocation} onChange={(e) => setForm({ ...form, eventLocation: e.target.value })} aria-invalid={!!errors.eventLocation} />{errors.eventLocation && <p className="text-xs text-destructive">{errors.eventLocation}</p>}</div>
          <div className="space-y-1.5"><Label htmlFor="message">Additional message (optional)</Label><Textarea id="message" maxLength={1000} placeholder="Guest count, style, anything the vendor should know" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
          <Button type="submit" className="w-full" loading={busy}>Send booking request</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
