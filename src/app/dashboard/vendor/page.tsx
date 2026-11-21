"use client";
import Link from "next/link";
import { Briefcase, CalendarCheck, Clock, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, PageHeader, StatCard, StatGridSkeleton } from "@/components/states";
import { useApi } from "@/lib/hooks";
import { useDashboardUser } from "@/components/dashboard/context";

export default function VendorOverview() {
  const { user } = useDashboardUser();
  const { data, loading, error, refetch } = useApi<any>("/vendor/stats");
  return (
    <>
      <PageHeader title={`Hello, ${user.name.split(" ")[0]}`} text="Here’s how your WedPlan business is doing."
        action={<Button asChild><Link href="/dashboard/vendor/services/new">Add a service</Link></Button>} />
      {error ? <ErrorState message={error.message} onRetry={refetch} /> : loading || !data ? <StatGridSkeleton n={5} /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Total services" value={data.totalServices} icon={Briefcase} />
          <StatCard label="Active services" value={data.activeLimit ? `${data.activeServices} / ${data.activeLimit}` : data.activeServices} icon={Zap} hint={data.activeLimit ? "Free plan limit" : "Unlimited on Premium"} />
          <StatCard label="Pending booking requests" value={data.pendingBookings} icon={Clock} />
          <StatCard label="Accepted bookings" value={data.acceptedBookings} icon={CalendarCheck} />
          <StatCard label="Current plan" value={<span className="capitalize">{data.plan}</span>} icon={Crown} hint={data.plan === "free" ? "Upgrade for unlimited services" : "Premium vendor badge active"} />
        </div>
      )}
      {data?.plan === "free" && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border bg-secondary p-5">
          <div><h3 className="text-xl font-semibold">Publish without limits</h3><p className="text-sm text-muted-foreground">Premium removes the 3-service cap and adds a badge customers can see.</p></div>
          <Button asChild variant="brass"><Link href="/dashboard/vendor/subscription">See Premium</Link></Button>
        </div>
      )}
    </>
  );
}
