"use client";
import { useEffect, useState } from "react";
import { Ban, Eye, Search, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Pagination } from "@/components/pagination";
import { EmptyState, ErrorState, PageHeader, PageLoader } from "@/components/states";
import { StatusBadge } from "@/components/status-badge";
import { api, ApiError } from "@/lib/api";
import { useApi, useDebounce } from "@/lib/hooks";
import { formatDate, initials } from "@/lib/utils";
import type { AppUser, Paged } from "@/lib/constants";

export default function ManageUsers() {
  const [search, setSearch] = useState(""); const [role, setRole] = useState(""); const [page, setPage] = useState(1);
  const dSearch = useDebounce(search);
  useEffect(() => setPage(1), [dSearch, role]);
  const qs = new URLSearchParams({ page: String(page), limit: "10", ...(dSearch && { search: dSearch }), ...(role && { role }) }).toString();
  const { data, loading, error, refetch } = useApi<Paged<AppUser>>(`/admin/users?${qs}`);
  const [detail, setDetail] = useState<string | null>(null);
  const { data: d, loading: dl } = useApi<any>(detail ? `/admin/users/${detail}` : null);
  const [target, setTarget] = useState<AppUser | null>(null);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    if (!target) return; setBusy(true);
    try { await api(`/admin/users/${target.id}/block`, { method: "PATCH", body: { blocked: !target.isBlocked } }); toast.success(target.isBlocked ? "User unblocked" : "User blocked"); setTarget(null); await refetch(); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not update the user"); }
    finally { setBusy(false); }
  }
  return (
    <>
      <PageHeader title="Manage users" text="Search accounts, review details and block or unblock access." />
      <div className="mb-5 grid gap-3 sm:grid-cols-[1fr_12rem]">
        <div className="relative"><Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search users" className="pl-9" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <Select aria-label="Filter by role" value={role} onChange={(e) => setRole(e.target.value)}><option value="">All roles</option><option value="customer">Customers</option><option value="vendor">Vendors</option><option value="admin">Admins</option></Select>
      </div>
      {loading ? <PageLoader /> : error ? <ErrorState message={error.message} onRetry={refetch} /> : !data?.items.length ? <EmptyState title="No users found" text="Try another name, email or role." /> : (
        <>
          <Card><Table>
            <THead><TR><TH>User</TH><TH>Role</TH><TH>Joined</TH><TH>Status</TH><TH className="text-right">Actions</TH></TR></THead>
            <TBody>{data.items.map((u) => (
              <TR key={u.id}>
                <TD><div className="flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent text-xs font-semibold">{/* eslint-disable-next-line @next/next/no-img-element */}{u.image ? <img src={u.image} alt="" className="h-full w-full object-cover" /> : initials(u.name)}</span><div className="min-w-0"><p className="truncate font-medium">{u.name}</p><p className="truncate text-xs text-muted-foreground">{u.email}</p></div></div></TD>
                <TD><Badge variant="secondary" className="capitalize">{u.role}</Badge></TD>
                <TD className="whitespace-nowrap">{formatDate(u.createdAt)}</TD>
                <TD><StatusBadge status={u.isBlocked ? "blocked" : "active"} /></TD>
                <TD><div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" aria-label="View user details" onClick={() => setDetail(u.id)}><Eye /></Button>
                  {u.role === "admin" ? <Button size="sm" variant="ghost" disabled><ShieldCheck />Protected</Button>
                    : <Button size="sm" variant="outline" className={u.isBlocked ? "" : "text-destructive"} onClick={() => setTarget(u)}><Ban />{u.isBlocked ? "Unblock" : "Block"}</Button>}
                </div></TD>
              </TR>
            ))}</TBody>
          </Table></Card>
          <Pagination page={data.page} limit={data.limit} total={data.total} onPage={setPage} />
        </>
      )}
      <Dialog open={!!detail} onOpenChange={(o) => !o && setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>User details</DialogTitle><DialogDescription>Account information and activity</DialogDescription></DialogHeader>
          {dl || !d ? <PageLoader /> : (
            <dl className="grid gap-2.5 text-sm">
              {[["Name", d.name], ["Email", d.email], ["Role", d.role], ["Phone", d.phone || "—"], ["Business", d.businessName || "—"], ["Plan", d.role === "vendor" ? d.subscriptionPlan : "—"], ["Services", d.stats.services], ["Bookings", d.stats.bookings], ["Joined", formatDate(d.createdAt)], ["Status", d.isBlocked ? "Blocked" : "Active"]].map(([k, v]) => (
                <div key={k as string} className="flex justify-between gap-4 border-b pb-2 last:border-0"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{String(v)}</dd></div>
              ))}
            </dl>
          )}
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)} loading={busy} destructive={!target?.isBlocked}
        confirmLabel={target?.isBlocked ? "Unblock user" : "Block user"} title={`${target?.isBlocked ? "Unblock" : "Block"} ${target?.name}?`}
        description={target?.isBlocked ? "They’ll be able to sign in and use the platform again." : "They’ll be signed out and can’t use protected features until unblocked."} onConfirm={toggle} />
    </>
  );
}
