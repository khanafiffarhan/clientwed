"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { initials, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const links = [{ href: "/", label: "Home" }, { href: "/services", label: "Browse Services" }];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const user = session?.user as any;

  async function logout() {
    clearToken();
    await authClient.signOut();
    toast.success("You have been signed out");
    setOpen(false);
    router.push("/");
    router.refresh();
  }
  const active = (h: string) => (h === "/" ? pathname === "/" : pathname.startsWith(h));

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent", active(l.href) && "bg-accent text-accent-foreground")}>{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {isPending ? <div className="h-9 w-28 animate-pulse rounded-md bg-muted" /> : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-sm font-medium hover:bg-accent" aria-label="Open profile menu">
                  <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary text-xs text-primary-foreground">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {user.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials(user.name)}
                  </span>
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary text-sm text-primary-foreground">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {user.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials(user.name)}
                    </span>
                    <div className="min-w-0"><p className="truncate">{user.name}</p><p className="truncate text-xs font-normal text-muted-foreground">{user.email}</p></div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push("/dashboard")}><LayoutDashboard />Dashboard</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.push("/profile")}><Settings />Profile Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={logout} className="text-destructive focus:text-destructive"><LogOut />Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost"><Link href="/sign-in">Sign In</Link></Button>
              <Button asChild><Link href="/sign-up">Sign Up</Link></Button>
            </>
          )}
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && (
        <div className="border-t bg-background md:hidden">
          <div className="container flex flex-col gap-1 py-3">
            {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={cn("rounded-md px-3 py-2.5 text-sm font-medium", active(l.href) && "bg-accent")}>{l.label}</Link>)}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2"><span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary text-xs text-primary-foreground">{/* eslint-disable-next-line @next/next/no-img-element */}{user.image ? <img src={user.image} alt="" className="h-full w-full object-cover" /> : initials(user.name)}</span><div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div></div>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium">Dashboard</Link>
                <Link href="/profile" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium">Profile Settings</Link>
                <button onClick={logout} className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive">Logout</button>
              </>
            ) : (
              <div className="flex gap-2 pt-1"><Button asChild variant="outline" className="flex-1"><Link href="/sign-in" onClick={() => setOpen(false)}>Sign In</Link></Button><Button asChild className="flex-1"><Link href="/sign-up" onClick={() => setOpen(false)}>Sign Up</Link></Button></div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
