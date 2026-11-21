"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Briefcase, CalendarCheck, CreditCard, Crown, Home, LayoutDashboard, LogOut, Menu, PlusCircle, Receipt, Settings, ShieldCheck, Users, X, ClipboardList, Store, UserRound } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { api, ApiError, clearToken } from "@/lib/api";
import { useApi } from "@/lib/hooks";
import { cn, initials } from "@/lib/utils";
import type { AppUser, Role } from "@/lib/constants";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ErrorState, PageLoader } from "@/components/states";
import { DashboardContext } from "./context";

const NAV: Record<Role, { href: string; label: string; icon: any; exact?: boolean }[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/vendor/services", label: "My Services", icon: Briefcase, exact: true },
    { href: "/dashboard/vendor/services/new", label: "Add Service", icon: PlusCircle },
    { href: "/dashboard/vendor/bookings", label: "Booking Requests", icon: ClipboardList },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: CreditCard },
    { href: "/dashboard/vendor/profile", label: "Profile Settings", icon: Settings },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/customer/bookings", label: "My Bookings", icon: CalendarCheck },
    { href: "/dashboard/customer/profile", label: "Profile Settings", icon: Settings },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/services", label: "Manage Services", icon: ShieldCheck },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
    { href: "/dashboard/admin/profile", label: "Profile Settings", icon: Settings },
  ],
};

function Sidebar({ user, onNavigate }: { user: AppUser; onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    clearToken(); await authClient.signOut(); toast.success("You have been signed out"); router.push("/"); router.refresh();
  }
  return (
    <div className="flex h-full flex-col bg-primary text-primary-foreground">
      <div className="px-5 py-5"><Logo light /></div>
      <div className="mx-4 mb-4 flex items-center gap-3 rounded-lg bg-white/10 p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brass text-sm font-semibold text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {user.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials(user.name)}
        </span>
        <div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p>
          <p className="flex items-center gap-1 text-xs capitalize text-primary-foreground/70">{user.role === "admin" ? <ShieldCheck className="h-3 w-3" /> : user.role === "vendor" ? <Store className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}{user.role}{user.role === "vendor" && user.subscriptionPlan === "premium" && <Crown className="ml-1 h-3 w-3 text-brass" aria-label="Premium" />}</p></div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Dashboard">
        {NAV[user.role].map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined}
              className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-white text-primary" : "text-primary-foreground/80 hover:bg-white/10 hover:text-white")}>
              <Icon className="h-4 w-4" />{label}
            </Link>
          );
        })}
      </nav>
      <div className="space-y-1 border-t border-white/15 p-3">
        <Link href="/" className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-primary-foreground/80 hover:bg-white/10"><Home className="h-4 w-4" />Back to website</Link>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-primary-foreground/80 hover:bg-white/10"><LogOut className="h-4 w-4" />Logout</button>
      </div>
    </div>
  );
}

function RoleChoice({ onDone }: { onDone: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  async function choose(role: "vendor" | "customer") {
    setBusy(role);
    try { await api("/me/choose-role", { method: "POST", body: { role } }); toast.success(`You’re set up as a ${role}`); onDone(); }
    catch (e) { toast.error(e instanceof ApiError ? e.message : "Could not save your choice"); }
    finally { setBusy(null); }
  }
  return (
    <Dialog open>
      <DialogContent hideClose onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader><DialogTitle>How will you use WedPlan?</DialogTitle><DialogDescription>Choose your account type. You can’t change this later.</DialogDescription></DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="outline" className="h-auto flex-col items-start gap-1 whitespace-normal py-4 text-left" loading={busy === "customer"} onClick={() => choose("customer")}><span className="font-semibold">Customer</span><span className="text-xs font-normal text-muted-foreground">Find and book wedding services</span></Button>
          <Button variant="outline" className="h-auto flex-col items-start gap-1 whitespace-normal py-4 text-left" loading={busy === "vendor"} onClick={() => choose("vendor")}><span className="font-semibold">Vendor</span><span className="text-xs font-normal text-muted-foreground">Publish services and manage requests</span></Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const { data: user, loading, error, refetch } = useApi<AppUser>(session?.user ? "/me" : null);

  useEffect(() => { if (!isPending && !session?.user) router.replace(`/sign-in?redirect=${encodeURIComponent(pathname)}`); }, [isPending, session, router, pathname]);
  useEffect(() => { setMenu(false); }, [pathname]);

  if (isPending || (session?.user && !user && !error)) return <PageLoader label="Loading your dashboard…" />;
  if (!session?.user) return <PageLoader label="Redirecting to sign in…" />;
  if (error?.status === 401) { clearToken(); return <PageLoader label="Redirecting to sign in…" />; }
  if (error || !user) return <div className="container max-w-xl py-16"><ErrorState message={error?.message || "Could not load your account"} onRetry={refetch} /></div>;

  return (
    <DashboardContext.Provider value={{ user, refresh: refetch }}>
      <div className="min-h-screen bg-muted/40 lg:grid lg:grid-cols-[17rem_1fr]">
        <aside className="sticky top-0 hidden h-screen lg:block"><Sidebar user={user} /></aside>
        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
            <Logo /><Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setMenu(true)}><Menu /></Button>
          </header>
          {menu && (
            <div className="fixed inset-0 z-40 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setMenu(false)} />
              <div className="absolute inset-y-0 left-0 w-72 max-w-[85%]"><button aria-label="Close menu" onClick={() => setMenu(false)} className="absolute right-3 top-4 z-10 text-white"><X className="h-5 w-5" /></button><Sidebar user={user} onNavigate={() => setMenu(false)} /></div></div>
          )}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </div>
      {user.needsRoleSelection && <RoleChoice onDone={() => { refetch(); router.replace("/dashboard"); }} />}
    </DashboardContext.Provider>
  );
}
