"use client";
import { useState } from "react";
import { Check, Crown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ErrorState, PageHeader, PageLoader } from "@/components/states";
import { api, ApiError } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { formatDate } from "@/lib/utils";

export default function Subscription() {
  const { data, loading, error, refetch } = useApi<any>("/vendor/subscription");
  const [busy, setBusy] = useState(false);
  const [cancel, setCancel] = useState(false);

  async function upgrade() {
    setBusy(true);
    try { const { url } = await api<{ url: string }>("/payments/checkout", { method: "POST" }); window.location.href = url; }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not start checkout"); setBusy(false); }
  }
  async function stop() {
    setBusy(true);
    try { await api("/payments/cancel-subscription", { method: "POST" }); toast.success("Premium will end at the close of your billing period"); setCancel(false); await refetch(); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not cancel the subscription"); }
    finally { setBusy(false); }
  }
  if (loading) return <PageLoader />;
  if (error || !data) return <ErrorState message={error?.message || "Could not load your subscription"} onRetry={refetch} />;
  const premium = data.plan === "premium";
  const Feature = ({ t }: { t: string }) => <li className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{t}</li>;
  return (
    <>
      <PageHeader title="Subscription" text="Choose the plan that fits how many services you publish." />
      {premium && (
        <div className="mb-6 rounded-lg border border-brass/40 bg-brass/10 p-4 text-sm">
          <p className="font-medium">You’re on Premium{data.expiresAt ? ` · renews or ends ${formatDate(data.expiresAt)}` : ""}.</p>
          {data.cancelAtPeriodEnd && <p className="mt-1 text-muted-foreground">Cancellation is scheduled. Premium stays active until that date, then your plan returns to Free.</p>}
        </div>
      )}
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <Card className={!premium ? "border-primary" : ""}>
          <CardHeader><div className="flex items-center justify-between"><CardTitle>Free</CardTitle>{!premium && <Badge>Current plan</Badge>}</div><p className="font-display text-4xl font-semibold">$0</p></CardHeader>
          <CardContent><ul className="space-y-2.5"><Feature t="Maximum 3 active services" /><Feature t="Basic vendor dashboard" /><Feature t="Booking request management" /></ul></CardContent>
        </Card>
        <Card className={premium ? "border-brass" : ""}>
          <CardHeader><div className="flex items-center justify-between"><CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-brass" />Premium</CardTitle>{premium && <Badge variant="brass">Current plan</Badge>}</div><p className="font-display text-4xl font-semibold">${data.priceUsd}<span className="text-base font-normal text-muted-foreground"> / month</span></p></CardHeader>
          <CardContent>
            <ul className="mb-6 space-y-2.5"><Feature t="Unlimited active services" /><Feature t="Premium Vendor badge" /><Feature t="Featured first on the home page" /><Feature t="All Free plan features" /></ul>
            {premium ? (data.cancelAtPeriodEnd ? <Button disabled className="w-full">Cancellation scheduled</Button> : <Button variant="outline" className="w-full" onClick={() => setCancel(true)}>Cancel subscription</Button>)
              : <Button variant="brass" className="w-full" onClick={upgrade} loading={busy}>Upgrade to Premium</Button>}
          </CardContent>
        </Card>
      </div>
      <p className="mt-4 max-w-4xl text-xs text-muted-foreground">Payments run on Stripe Checkout (test mode). Premium turns on only after Stripe confirms the payment to our server, not when you return to this site.</p>
      <ConfirmDialog open={cancel} onOpenChange={setCancel} loading={busy} destructive title="Cancel Premium?" confirmLabel="Cancel at period end"
        description="You keep Premium until the end of the current billing period. After that, only your 3 oldest active services stay active." onConfirm={stop} />
    </>
  );
}
