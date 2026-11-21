"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Select, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploader } from "@/components/image-uploader";
import { CATEGORY_NAMES, type Service } from "@/lib/constants";

type F = { serviceName: string; category: string; description: string; price: string; location: string; images: string[] };

export function ServiceForm({ initial }: { initial?: Service }) {
  const router = useRouter();
  const [f, setF] = useState<F>({
    serviceName: initial?.serviceName || "", category: initial?.category || "", description: initial?.description || "",
    price: initial ? String(initial.price) : "", location: initial?.location || "", images: initial?.images || [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof F, v: any) => setF((p) => ({ ...p, [k]: v }));

  function validate() {
    const e: Record<string, string> = {};
    if (f.serviceName.trim().length < 3) e.serviceName = "Service name must be at least 3 characters";
    if (!f.category) e.category = "Select a category";
    if (f.description.trim().length < 20) e.description = "Description must be at least 20 characters";
    if (!(Number(f.price) > 0)) e.price = "Enter a price greater than 0";
    if (f.location.trim().length < 2) e.location = "Location is required";
    if (!f.images.length) e.images = "Upload at least one image";
    setErrors(e); return !Object.keys(e).length;
  }
  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return toast.error("Please fix the highlighted fields");
    setBusy(true);
    try {
      const body = { ...f, price: Number(f.price) };
      if (initial) await api(`/vendor/services/${initial._id}`, { method: "PUT", body });
      else await api("/vendor/services", { method: "POST", body });
      toast.success(initial ? "Service updated and sent for review" : "Service submitted for admin approval");
      router.push("/dashboard/vendor/services");
    } catch (err) { toast.error(err instanceof ApiError ? err.message : "Could not save the service"); }
    finally { setBusy(false); }
  }
  const Err = ({ k }: { k: string }) => (errors[k] ? <p className="text-xs text-destructive">{errors[k]}</p> : null);
  return (
    <Card className="max-w-3xl"><CardContent className="p-6">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div className="space-y-1.5"><Label htmlFor="serviceName">Service name</Label><Input id="serviceName" value={f.serviceName} onChange={(e) => set("serviceName", e.target.value)} aria-invalid={!!errors.serviceName} /><Err k="serviceName" /></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor="category">Service category</Label><Select id="category" value={f.category} onChange={(e) => set("category", e.target.value)} aria-invalid={!!errors.category}><option value="">Select a category</option>{CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}</Select><Err k="category" /></div>
          <div className="space-y-1.5"><Label htmlFor="price">Price (USD)</Label><Input id="price" type="number" min="1" step="1" value={f.price} onChange={(e) => set("price", e.target.value)} aria-invalid={!!errors.price} /><Err k="price" /></div>
        </div>
        <div className="space-y-1.5"><Label htmlFor="location">Location</Label><Input id="location" placeholder="City or area you serve" value={f.location} onChange={(e) => set("location", e.target.value)} aria-invalid={!!errors.location} /><Err k="location" /></div>
        <div className="space-y-1.5"><Label htmlFor="description">Description</Label><Textarea id="description" className="min-h-[140px]" maxLength={2000} value={f.description} onChange={(e) => set("description", e.target.value)} aria-invalid={!!errors.description} /><Err k="description" /></div>
        <div className="space-y-1.5"><Label>Service images (up to 6)</Label><ImageUploader value={f.images} onChange={(v) => set("images", v)} max={6} label="Add image" /><Err k="images" /></div>
        <p className="text-sm text-muted-foreground">New and edited services are reviewed by an admin before customers can see them.</p>
        <div className="flex gap-3"><Button type="submit" loading={busy}>{initial ? "Save changes" : "Submit service"}</Button><Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button></div>
      </form>
    </CardContent></Card>
  );
}
