"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api, ApiError } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/utils";

type Status = { paymentStatus: string; amount: number; currency: string; recorded: boolean; premiumActive: boolean; expiresAt: string | null };

/** The redirect itself never grants Premium. This page only reports what the Stripe webhook has already recorded. */
export function PaymentSuccess() {
  const sessionId = useSearchParams().get("session_id");
  const [st, setSt] = useState<Status | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [tries, setTries] = useState(0);

  useEffect(() => {
    if (!sessionId) { setErr("No payment session was found in this link."); return; }
    let alive = true;
    const poll = async (n: number) => {
      try {
        const s = await api<Status>(`/payments/session/${encodeURIComponent(sessionId)}`);
        if (!alive) return;
        setSt(s); setTries(n);
        if (!s.premiumActive && n < 12) setTimeout(() => poll(n + 1), 2000);
      } catch (e) { if (alive) setErr(e instanceof ApiError ? e.message : "Could not verify the payment"); }
    };
    poll(1);
    return () => { alive = false; };
  }, [sessionId]);

  const waiting = !!st && !st.premiumActive && tries < 12;
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center">
        {err ? (<><XCircle className="mx-auto h-12 w-12 text-destructive" /><h1 className="mt-4 text-3xl font-semibold">We couldn’t verify this payment</h1><p className="mt-2 text-sm text-muted-foreground">{err}</p></>)
        : !st ? (<><Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" /><h1 className="mt-4 text-3xl font-semibold">Confirming your payment…</h1></>)
        : st.premiumActive ? (<><CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" /><h1 className="mt-4 text-3xl font-semibold">You’re Premium</h1>
            <p className="mt-2 text-sm text-muted-foreground">Payment of {formatMoney(st.amount, st.currency)} was confirmed by Stripe. Unlimited services and the Premium badge are now active{st.expiresAt ? ` until ${formatDate(st.expiresAt)}` : ""}.</p></>)
        : waiting ? (<><Loader2 className="mx-auto h-10 w-10 animate-spin text-brass" /><h1 className="mt-4 text-3xl font-semibold">Payment received</h1><p className="mt-2 text-sm text-muted-foreground">We’re waiting for Stripe’s confirmation to activate Premium. This usually takes a few seconds.</p></>)
        : (<><Crown className="mx-auto h-12 w-12 text-brass" /><h1 className="mt-4 text-3xl font-semibold">Still confirming</h1><p className="mt-2 text-sm text-muted-foreground">Stripe hasn’t confirmed the payment yet. Premium activates automatically once it does. Check your subscription page in a minute.</p></>)}
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild><Link href="/dashboard/vendor/subscription">View subscription</Link></Button>
          <Button asChild variant="outline"><Link href="/dashboard/vendor">Go to dashboard</Link></Button>
        </div>
      </div>
    </div>
  );
}

export function PaymentCancel() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16">
      <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center">
        <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-semibold">Checkout cancelled</h1>
        <p className="mt-2 text-sm text-muted-foreground">No payment was taken and your plan hasn’t changed. You can upgrade whenever you’re ready.</p>
        <div className="mt-7 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild><Link href="/dashboard/vendor/subscription">Back to plans</Link></Button>
          <Button asChild variant="outline"><Link href="/dashboard/vendor">Dashboard</Link></Button>
        </div>
      </div>
    </div>
  );
}
