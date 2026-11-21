"use client";
import { useState } from "react";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageUploader } from "@/components/image-uploader";
import { PageHeader } from "@/components/states";
import { useDashboardUser } from "./context";

export function ProfileForm() {
  const { user, refresh } = useDashboardUser();
  const { refetch: refetchSession } = authClient.useSession();
  const [f, setF] = useState({ name: user.name, phone: user.phone, bio: user.bio, businessName: user.businessName });
  const [image, setImage] = useState<string[]>(user.image ? [user.image] : []);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (f.name.trim().length < 2) er.name = "Name must be at least 2 characters";
    if (!/^[0-9+()\-\s]*$/.test(f.phone)) er.phone = "Phone can only contain numbers, spaces, + ( ) -";
    setErrors(er);
    if (Object.keys(er).length) return toast.error("Please fix the highlighted fields");
    setBusy(true);
    try {
      await api("/profile", { method: "PATCH", body: { name: f.name, phone: f.phone, bio: f.bio, image: image[0] || "", ...(user.role === "vendor" ? { businessName: f.businessName } : {}) } });
      await Promise.all([refresh(), refetchSession()]);
      toast.success("Profile updated");
    } catch (err) { toast.error(err instanceof ApiError ? err.message : "Could not update your profile"); }
    finally { setBusy(false); }
  }
  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile settings" text="Update how you appear across WedPlan." />
      <Card><CardContent className="p-6">
        <form onSubmit={save} className="space-y-5" noValidate>
          <div className="space-y-1.5"><Label>Profile image</Label><ImageUploader value={image} onChange={setImage} max={1} label="Change photo" /></div>
          <div className="space-y-1.5"><Label htmlFor="name">Full name</Label><Input id="name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-invalid={!!errors.name} />{errors.name && <p className="text-xs text-destructive">{errors.name}</p>}</div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" value={user.email} disabled /></div>
            <div className="space-y-1.5"><Label>Account role</Label><div className="flex h-10 items-center gap-2"><Badge variant="secondary" className="capitalize">{user.role}</Badge><span className="text-xs text-muted-foreground">Can’t be changed</span></div></div>
          </div>
          <div className="space-y-1.5"><Label htmlFor="phone">Phone</Label><Input id="phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} aria-invalid={!!errors.phone} />{errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}</div>
          {user.role === "vendor" && <div className="space-y-1.5"><Label htmlFor="biz">Business name</Label><Input id="biz" value={f.businessName} onChange={(e) => setF({ ...f, businessName: e.target.value })} placeholder="Shown to customers on your services" /></div>}
          <div className="space-y-1.5"><Label htmlFor="bio">About you</Label><Textarea id="bio" maxLength={500} value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} /><p className="text-right text-xs text-muted-foreground">{f.bio.length}/500</p></div>
          <Button type="submit" loading={busy}>Save changes</Button>
        </form>
      </CardContent></Card>
    </div>
  );
}
