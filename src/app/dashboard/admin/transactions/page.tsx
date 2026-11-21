"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Pagination } from "@/components/pagination";
import { EmptyState, ErrorState, PageHeader, PageLoader } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { useApi } from "@/lib/hooks";
import { formatDate, formatMoney, initials } from "@/lib/utils";
import type { Paged } from "@/lib/constants";

export default function Transactions() {
  const [status, setStatus] = useState(""); const [page, setPage] = useState(1);
  useEffect(() => setPage(1), [status]);
  const { data, loading, error, refetch } = useApi<Paged<any>>(`/admin/transactions?page=${page}&limit=10${status ? `&status=${status}` : ""}`);
  return (
    <>
      <PageHeader title="Transactions" text="Read-only record of subscription payments confirmed by Stripe." action={
        <Select aria-label="Filter by payment status" className="w-40" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All payments</option><option value="paid">Paid</option><option value="failed">Failed</option></Select>} />
      {loading ? <PageLoader /> : error ? <ErrorState message={error.message} onRetry={refetch} /> : !data?.items.length ? <EmptyState title="No transactions yet" text="Payments appear here after a vendor upgrades to Premium." /> : (
        <>
          <Card><Table>
            <THead><TR><TH>Vendor</TH><TH>Plan</TH><TH>Amount</TH><TH>Status</TH><TH>Date</TH></TR></THead>
            <TBody>{data.items.map((t) => (
              <TR key={t._id}>
                <TD><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-semibold">{/* eslint-disable-next-line @next/next/no-img-element */}{t.vendor?.image ? <img src={t.vendor.image} alt="" className="h-full w-full object-cover" /> : initials(t.vendor?.name)}</span><div className="min-w-0"><p className="truncate font-medium">{t.vendor?.name || "Deleted vendor"}</p><p className="truncate text-xs text-muted-foreground">{t.vendor?.email}</p></div></div></TD>
                <TD className="capitalize">{t.plan}</TD>
                <TD className="font-medium">{formatMoney(t.amount, t.currency)}</TD>
                <TD><StatusBadge status={t.status} /></TD>
                <TD className="whitespace-nowrap">{formatDate(t.createdAt)}</TD>
              </TR>
            ))}</TBody>
          </Table></Card>
          <Pagination page={data.page} limit={data.limit} total={data.total} onPage={setPage} />
        </>
      )}
    </>
  );
}
