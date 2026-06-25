"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Photo = {
  id: string;
  homestay_id: string;
  storage_path: string;
  is_cover: boolean | null;
};

const BUCKET = "property-photos";

function publicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`;
}

export default function PhotoManager({
  homestayId,
  initialPhotos,
}: {
  homestayId: string;
  initialPhotos: Photo[];
}) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${homestayId}/${Date.now().toString(36)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false });
    if (upErr) {
      setError(upErr.message);
      setBusy(false);
      return;
    }
    const { data, error: insErr } = await supabase
      .from("homestay_photos")
      .insert({
        homestay_id: homestayId,
        storage_path: path,
        is_cover: photos.length === 0,
        sort_order: photos.length,
      })
      .select("*")
      .single();
    if (insErr) {
      setError(insErr.message);
    } else if (data) {
      setPhotos((p) => [...p, data as Photo]);
    }
    setBusy(false);
    e.target.value = "";
  }

  async function remove(photo: Photo) {
    const supabase = createClient();
    await supabase.storage.from(BUCKET).remove([photo.storage_path]);
    await supabase.from("homestay_photos").delete().eq("id", photo.id);
    setPhotos((p) => p.filter((x) => x.id !== photo.id));
  }

  async function makeCover(photo: Photo) {
    const supabase = createClient();
    await supabase
      .from("homestay_photos")
      .update({ is_cover: false })
      .eq("homestay_id", homestayId);
    await supabase
      .from("homestay_photos")
      .update({ is_cover: true })
      .eq("id", photo.id);
    setPhotos((p) =>
      p.map((x) => ({ ...x, is_cover: x.id === photo.id })),
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative overflow-hidden rounded-xl bg-mist"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicUrl(photo.storage_path)}
              alt=""
              className="aspect-square w-full object-cover"
            />
            {photo.is_cover ? (
              <span className="absolute left-2 top-2 rounded-full bg-leaf px-2 py-0.5 text-xs font-semibold text-white">
                Cover
              </span>
            ) : (
              <button
                onClick={() => makeCover(photo)}
                className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-forest"
              >
                Set cover
              </button>
            )}
            <button
              onClick={() => remove(photo)}
              className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-red-600"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <label className="tap mt-4 inline-flex cursor-pointer items-center rounded-full bg-white px-5 py-2.5 font-semibold text-forest ring-1 ring-forest/15 hover:ring-leaf/40">
        {busy ? "Uploading…" : "+ Add photo"}
        <input
          type="file"
          accept="image/*"
          onChange={onUpload}
          disabled={busy}
          className="hidden"
        />
      </label>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
