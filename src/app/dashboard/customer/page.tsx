"use client";
import Link from "next/link";
import { CalendarCheck, Clock, ClipboardList, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorState, PageHeader, StatCard, StatGridSkeleton } from "@/components/states";
import { useApi } from "@/lib/hooks";
import { useDashboardUser } from "@/components/dashboard/context";

export default function CustomerOverview() {
  const { user } = useDashboardUser();
  const { data, loading, error, refetch } = useApi<any>("/bookings/stats");
  return (
    <>
      <PageHeader title={`Hello, ${user.name.split(" ")[0]}`} text="A quick look at your booking requests." action={<Button asChild><Link href="/services">Browse services</Link></Button>} />
      {error ? <ErrorState message={error.message} onRetry={refetch} /> : loading || !data ? <StatGridSkeleton /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total booking requests" value={data.total} icon={ClipboardList} />
          <StatCard label="Pending bookings" value={data.pending} icon={Clock} />
          <StatCard label="Accepted bookings" value={data.accepted} icon={CalendarCheck} />
          <StatCard label="Rejected bookings" value={data.rejected} icon={XCircle} />
        </div>
      )}
    </>
  );
}
