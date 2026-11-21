"use client";
import { Briefcase, Clock, Receipt, Store, UserRound, Users } from "lucide-react";
import { ErrorState, PageHeader, StatCard, StatGridSkeleton } from "@/components/states";
import { useApi } from "@/lib/hooks";
import { formatMoney } from "@/lib/utils";

export default function AdminOverview() {
  const { data, loading, error, refetch } = useApi<any>("/admin/stats");
  return (
    <>
      <PageHeader title="Admin overview" text="Platform activity at a glance." />
      {error ? <ErrorState message={error.message} onRetry={refetch} /> : loading || !data ? <StatGridSkeleton n={6} /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Registered users" value={data.totalUsers} icon={Users} />
          <StatCard label="Vendors" value={data.totalVendors} icon={Store} />
          <StatCard label="Customers" value={data.totalCustomers} icon={UserRound} />
          <StatCard label="Total services" value={data.totalServices} icon={Briefcase} />
          <StatCard label="Pending services" value={data.pendingServices} icon={Clock} hint="Waiting for review" />
          <StatCard label="Transactions" value={data.totalTransactions} icon={Receipt} hint={`${formatMoney(data.revenue)} collected`} />
        </div>
      )}
    </>
  );
}
