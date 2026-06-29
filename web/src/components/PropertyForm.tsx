"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Homestay } from "@/lib/types";
import { PROPERTY_TYPES } from "@/lib/property-taxonomy";

const TYPES = [...PROPERTY_TYPES];

function mapPropertyTypeToUnit(type: string): string {
  const t = type.toLowerCase();
  if (t.includes("villa")) return "villa";
  if (t.includes("cottage")) return "cottage";
  if (t.includes("camp")) return "tent";
  if (t.includes("resort") || t.includes("hotel")) return "suite";
  return "room";
}
function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") +
    "-" +
    Date.now().toString(36).slice(-4)
  );
}

export default function PropertyForm({
  property,
  redirectTo = "/owner",
}: {
  property?: Homestay;
  redirectTo?: string;
}) {
  const router = useRouter();
  const editing = Boolean(property);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const supabase = createClient();

    const name = String(f.get("name"));
    const amenities = String(f.get("amenities") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name,
      type: String(f.get("type")),
      area: String(f.get("area") || "") || null,
      description: String(f.get("description") || "") || null,
      base_price: f.get("base_price") ? Number(f.get("base_price")) : null,
      max_guests: f.get("max_guests") ? Number(f.get("max_guests")) : null,
      bedrooms: f.get("bedrooms") ? Number(f.get("bedrooms")) : null,
      bathrooms: f.get("bathrooms") ? Number(f.get("bathrooms")) : null,
      host_phone: String(f.get("host_phone") || "") || null,
      amenities,
    };

    if (editing && property) {
      const { error } = await supabase
        .from("homestays")
        .update(payload)
        .eq("id", property.id);
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Not signed in.");
        setBusy(false);
        return;
      }
      // New owner listings start unpublished → admin reviews before going live.
      const { data: created, error } = await supabase
        .from("homestays")
        .insert({
          ...payload,
          slug: slugify(name),
          owner_id: user.id,
          is_published: false,
        })
        .select("id")
        .single();
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      if (created) {
        await supabase.from("property_units").insert({
          homestay_id: created.id,
          name,
          unit_type: mapPropertyTypeToUnit(String(f.get("type"))),
          max_guests: payload.max_guests ?? 2,
          bedrooms: payload.bedrooms,
          bathrooms: payload.bathrooms,
          base_price: payload.base_price,
          sort_order: 0,
        });
      }
    }
    router.push(redirectTo);
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-base outline-none focus:border-leaf";
  const label = "block text-sm font-medium text-ink";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className={label}>Property name</label>
        <input
          name="name"
          required
          defaultValue={property?.name}
          className={`mt-1 ${inputCls}`}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Property type</label>
          <p className="mb-1 text-xs text-muted">
            Resort, homestay, estate — the overall property classification
          </p>
          <select
            name="type"
            defaultValue={property?.type ?? "Homestay"}
            className={`mt-1 ${inputCls}`}
          >
            {TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Area</label>
          <input
            name="area"
            defaultValue={property?.area ?? ""}
            placeholder="e.g. Aravenu"
            className={`mt-1 ${inputCls}`}
          />
        </div>
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea
          name="description"
          rows={4}
          defaultValue={property?.description ?? ""}
          className={`mt-1 ${inputCls}`}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Price / night (₹)</label>
          <input
            name="base_price"
            type="number"
            min={0}
            defaultValue={property?.base_price ?? ""}
            className={`mt-1 ${inputCls}`}
          />
        </div>
        <div>
          <label className={label}>Max guests</label>
          <input
            name="max_guests"
            type="number"
            min={1}
            defaultValue={property?.max_guests ?? 2}
            className={`mt-1 ${inputCls}`}
          />
        </div>
        <div>
          <label className={label}>Bedrooms</label>
          <input
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={property?.bedrooms ?? ""}
            className={`mt-1 ${inputCls}`}
          />
        </div>
        <div>
          <label className={label}>Bathrooms</label>
          <input
            name="bathrooms"
            type="number"
            min={0}
            defaultValue={property?.bathrooms ?? ""}
            className={`mt-1 ${inputCls}`}
          />
        </div>
      </div>
      <div>
        <label className={label}>Amenities (comma separated)</label>
        <input
          name="amenities"
          defaultValue={property?.amenities?.join(", ") ?? ""}
          placeholder="Wifi, Parking, Bonfire, Tea garden"
          className={`mt-1 ${inputCls}`}
        />
      </div>
      <div>
        <label className={label}>WhatsApp number (for bookings)</label>
        <input
          name="host_phone"
          inputMode="tel"
          defaultValue={property?.host_phone ?? ""}
          placeholder="919962541214"
          className={`mt-1 ${inputCls}`}
        />
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="tap w-full rounded-full bg-leaf px-6 py-3.5 font-semibold text-white hover:bg-pine disabled:opacity-60"
      >
        {busy ? "Saving…" : editing ? "Save changes" : "Create property"}
      </button>
      {!editing ? (
        <p className="text-center text-xs text-muted">
          New listings are reviewed by our team before going live.
        </p>
      ) : null}
    </form>
  );
}
