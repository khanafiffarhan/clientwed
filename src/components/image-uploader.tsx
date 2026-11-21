"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/lib/api";
import { Button } from "@/components/ui/button";

export function ImageUploader({ value, onChange, max = 1, label = "Upload image" }: { value: string[]; onChange: (urls: string[]) => void; max?: number; label?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const room = max - value.length;
    if (room <= 0) return toast.error(`You can upload up to ${max} image${max > 1 ? "s" : ""}`);
    setBusy(true);
    const urls: string[] = [];
    for (const f of Array.from(files).slice(0, room)) {
      try { urls.push(await uploadImage(f)); } catch (e: any) { toast.error(e.message || "Image upload failed"); }
    }
    if (urls.length) { onChange([...value, ...urls]); toast.success(urls.length > 1 ? "Images uploaded" : "Image uploaded"); }
    setBusy(false);
    if (ref.current) ref.current.value = "";
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      {value.map((u) => (
        <div key={u} className="relative h-24 w-24 overflow-hidden rounded-md border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={u} alt="Uploaded preview" className="h-full w-full object-cover" />
          <button type="button" aria-label="Remove image" onClick={() => onChange(value.filter((x) => x !== u))} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"><X className="h-3 w-3" /></button>
        </div>
      ))}
      {value.length < max && (
        <>
          <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple={max > 1} hidden onChange={(e) => onFiles(e.target.files)} />
          <Button type="button" variant="outline" className="h-24 w-24 flex-col gap-1 border-dashed text-xs" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" /> : <ImagePlus />}{busy ? "Uploading" : label}
          </Button>
        </>
      )}
    </div>
  );
}
