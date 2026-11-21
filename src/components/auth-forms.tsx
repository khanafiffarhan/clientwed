"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Eye, EyeOff, Store, UserRound, X } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { clearToken } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/image-uploader";
import { cn } from "@/lib/utils";

const safeRedirect = (r: string | null) => (r && r.startsWith("/") && !r.startsWith("//") ? r : "/dashboard");

function GoogleIcon() {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.4z"/><path fill="#34A853" d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.3 1.1-3.9 1.1-3 0-5.5-2-6.4-4.7H1.8v3A11.5 11.5 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.6 13.7a6.9 6.9 0 0 1 0-4.4v-3H1.8a11.5 11.5 0 0 0 0 10.4l3.8-3z"/><path fill="#EA4335" d="M12 5.4c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.8 6.3l3.8 3C6.5 7.4 9 5.4 12 5.4z"/></svg>;
}
function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center py-12">
      <div className="w-full max-w-md rounded-xl border bg-card p-7 shadow-sm sm:p-9">
        <h1 className="text-4xl font-semibold">{title}</h1><p className="mt-1 text-sm text-muted-foreground">{subtitle}</p><div className="mt-7">{children}</div>
      </div>
    </div>
  );
}
function PasswordInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative"><Input {...props} type={show ? "text" : "password"} className="pr-10" />
      <button type="button" aria-label={show ? "Hide password" : "Show password"} onClick={() => setShow(!show)} className="absolute right-3 top-2.5 text-muted-foreground">{show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
  );
}
function useRedirectIfSignedIn(to: string) {
  const router = useRouter();
  const { data } = authClient.useSession();
  useEffect(() => { if (data?.user) router.replace(to); }, [data, router, to]);
}
const Divider = () => <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or<span className="h-px flex-1 bg-border" /></div>;

export function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = safeRedirect(sp.get("redirect"));
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false); const [gBusy, setGBusy] = useState(false);
  useRedirectIfSignedIn(redirect);
  useEffect(() => { if (sp.get("blocked")) toast.error("Your account has been blocked. Contact support."); }, [sp]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) return toast.error("Enter your email and password");
    setBusy(true); clearToken();
    const { error } = await authClient.signIn.email({ email: email.trim(), password });
    setBusy(false);
    if (error) return toast.error(error.message || "Invalid email or password");
    toast.success("Welcome back!");
    router.push(redirect); router.refresh();
  }
  async function google() {
    setGBusy(true); clearToken();
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: redirect });
    if (error) { toast.error(error.message || "Google sign-in failed"); setGBusy(false); }
  }
  return (
    <Shell title="Welcome back" subtitle="Sign in to manage your bookings or services.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></div>
        <div className="space-y-1.5"><Label htmlFor="password">Password</Label><PasswordInput id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" loading={busy}>Sign in</Button>
      </form>
      <Divider />
      <Button variant="outline" className="w-full" onClick={google} loading={gBusy}><GoogleIcon /> Continue with Google</Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to WedPlan? <Link href={`/sign-up${sp.get("redirect") ? `?redirect=${encodeURIComponent(redirect)}` : ""}`} className="font-medium text-primary underline-offset-4 hover:underline">Create an account</Link></p>
    </Shell>
  );
}

const rules = [
  { t: "At least 6 characters", ok: (p: string) => p.length >= 6 },
  { t: "One uppercase letter", ok: (p: string) => /[A-Z]/.test(p) },
  { t: "One lowercase letter", ok: (p: string) => /[a-z]/.test(p) },
];

export function SignUpForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const redirect = safeRedirect(sp.get("redirect"));
  const [f, setF] = useState({ name: "", email: "", password: "", role: "customer" as "customer" | "vendor" });
  const [image, setImage] = useState<string[]>([]);
  const [busy, setBusy] = useState(false); const [gBusy, setGBusy] = useState(false);
  useRedirectIfSignedIn(redirect);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.name.trim().length < 2) return toast.error("Enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("Enter a valid email address");
    if (!rules.every((r) => r.ok(f.password))) return toast.error("Password must be 6+ characters with an uppercase and a lowercase letter");
    setBusy(true); clearToken();
    const { error } = await authClient.signUp.email({ name: f.name.trim(), email: f.email.trim(), password: f.password, image: image[0], role: f.role } as any);
    setBusy(false);
    if (error) return toast.error(error.message || "Could not create your account");
    toast.success("Account created. Welcome to WedPlan!");
    router.push(redirect); router.refresh();
  }
  async function google() {
    setGBusy(true);
    const { error } = await authClient.signIn.social({ provider: "google", callbackURL: redirect, newUserCallbackURL: "/dashboard" });
    if (error) { toast.error(error.message || "Google sign-up failed"); setGBusy(false); }
  }
  return (
    <Shell title="Create your account" subtitle="Plan your wedding, or grow your wedding business.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" autoComplete="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" autoComplete="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></div>
        <div className="space-y-1.5"><Label htmlFor="password">Password</Label><PasswordInput id="password" autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
          <ul className="grid gap-1 pt-1 text-xs">{rules.map((r) => { const ok = r.ok(f.password); return <li key={r.t} className={cn("flex items-center gap-1.5", ok ? "text-emerald-700" : "text-muted-foreground")}>{ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}{r.t}</li>; })}</ul></div>
        <fieldset className="space-y-1.5"><legend className="mb-1.5 text-sm font-medium">I am a</legend>
          <div className="grid grid-cols-2 gap-3">
            {([["customer", "Customer", "Book services", UserRound], ["vendor", "Vendor", "Offer services", Store]] as const).map(([v, l, d, Icon]) => (
              <label key={v} className={cn("flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-colors", f.role === v ? "border-primary bg-secondary" : "hover:bg-muted")}>
                <input type="radio" name="role" value={v} checked={f.role === v} onChange={() => setF({ ...f, role: v })} className="sr-only" />
                <Icon className="h-5 w-5 text-primary" /><span><span className="block text-sm font-medium">{l}</span><span className="block text-xs text-muted-foreground">{d}</span></span>
              </label>
            ))}
          </div></fieldset>
        <div className="space-y-1.5"><Label>Profile image (optional)</Label><ImageUploader value={image} onChange={setImage} max={1} label="Add photo" /></div>
        <Button type="submit" className="w-full" loading={busy}>Create account</Button>
      </form>
      <Divider />
      <Button variant="outline" className="w-full" onClick={google} loading={gBusy}><GoogleIcon /> Sign up with Google</Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link href="/sign-in" className="font-medium text-primary underline-offset-4 hover:underline">Sign in</Link></p>
    </Shell>
  );
}
