"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UNIT_TYPES, type UnitTypeValue } from "@/lib/property-taxonomy";
import type { PropertyUnit } from "@/lib/types";

function slugifyUnit(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export default function UnitManager({
  homestayId,
  initialUnits,
}: {
  homestayId: string;
  initialUnits: PropertyUnit[];
}) {
  const [units, setUnits] = useState<PropertyUnit[]>(
    [...initialUnits].sort((a, b) => a.sort_order - b.sort_order),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm outline-none focus:border-steel";
  const label = "block text-xs font-medium text-muted";

  async function saveUnit(e: React.FormEvent<HTMLFormElement>, unitId?: string) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    const payload = {
      name: String(f.get("name")).trim(),
      unit_type: String(f.get("unit_type")) as UnitTypeValue,
      description: String(f.get("description") || "") || null,
      max_guests: Number(f.get("max_guests") || 2),
      bedrooms: f.get("bedrooms") ? Number(f.get("bedrooms")) : null,
      bathrooms: f.get("bathrooms") ? Number(f.get("bathrooms")) : null,
      base_price: f.get("base_price") ? Number(f.get("base_price")) : null,
      is_active: true,
    };

    const supabase = createClient();

    if (unitId) {
      const { data, error: upErr } = await supabase
        .from("property_units")
        .update(payload)
        .eq("id", unitId)
        .select("*")
        .single();
      if (upErr) {
        setError(upErr.message);
        setBusy(false);
        return;
      }
      setUnits((u) => u.map((x) => (x.id === unitId ? (data as PropertyUnit) : x)));
      setEditingId(null);
    } else {
      const { data, error: insErr } = await supabase
        .from("property_units")
        .insert({
          ...payload,
          homestay_id: homestayId,
          sort_order: units.length,
        })
        .select("*")
        .single();
      if (insErr) {
        setError(insErr.message);
        setBusy(false);
        return;
      }
      setUnits((u) => [...u, data as PropertyUnit]);
      (e.target as HTMLFormElement).reset();
    }
    setBusy(false);
  }

  async function removeUnit(id: string) {
    if (!confirm("Remove this unit? Its photos will also be deleted.")) return;
    const supabase = createClient();
    const { error: delErr } = await supabase
      .from("property_units")
      .delete()
      .eq("id", id);
    if (delErr) {
      setError(delErr.message);
      return;
    }
    setUnits((u) => u.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Add each bookable room, cottage, villa or tent. Guests pick a unit when
        booking (like Airbnb room types).
      </p>

      <ul className="space-y-3">
        {units.map((unit) => (
          <li
            key={unit.id}
            className="rounded-2xl border border-line bg-surface p-4"
          >
            {editingId === unit.id ? (
              <form onSubmit={(e) => saveUnit(e, unit.id)} className="space-y-3">
                <UnitFields unit={unit} inputCls={inputCls} label={label} />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="tap rounded-full bg-primary px-4 py-2 text-sm font-semibold text-canvas"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="tap text-sm text-muted"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">{unit.name}</p>
                  <p className="text-sm text-muted capitalize">
                    {unit.unit_type.replace("_", " ")}
                    {unit.base_price
                      ? ` · ₹${unit.base_price.toLocaleString("en-IN")} / night`
                      : ""}
                    {unit.max_guests ? ` · ${unit.max_guests} guests` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(unit.id)}
                    className="tap text-sm font-semibold text-steel"
                  >
                    Edit
                  </button>
                  {units.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeUnit(unit.id)}
                      className="tap text-sm font-semibold text-red-600"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => saveUnit(e)}
        className="rounded-2xl border border-dashed border-line p-4 space-y-3"
      >
        <p className="text-sm font-semibold text-primary">Add another unit</p>
        <UnitFields inputCls={inputCls} label={label} />
        <button
          type="submit"
          disabled={busy}
          className="tap rounded-full border border-primary px-4 py-2 text-sm font-semibold text-primary"
        >
          + Add unit
        </button>
      </form>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

function UnitFields({
  unit,
  inputCls,
  label,
}: {
  unit?: PropertyUnit;
  inputCls: string;
  label: string;
}) {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label}>Unit name</label>
          <input
            name="name"
            required
            defaultValue={unit?.name}
            placeholder="Garden Cottage"
            className={`mt-1 ${inputCls}`}
          />
        </div>
        <div>
          <label className={label}>Unit type</label>
          <select
            name="unit_type"
            defaultValue={unit?.unit_type ?? "room"}
            className={`mt-1 ${inputCls}`}
          >
            {UNIT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.labelEn}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className={label}>Description (optional)</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={unit?.description ?? ""}
          className={`mt-1 ${inputCls}`}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className={label}>Price / night (₹)</label>
          <input
            name="base_price"
            type="number"
            min={0}
            defaultValue={unit?.base_price ?? ""}
            className={`mt-1 ${inputCls}`}
          />
        </div>
        <div>
          <label className={label}>Max guests</label>
          <input
            name="max_guests"
            type="number"
            min={1}
            defaultValue={unit?.max_guests ?? 2}
            className={`mt-1 ${inputCls}`}
          />
        </div>
        <div>
          <label className={label}>Bedrooms</label>
          <input
            name="bedrooms"
            type="number"
            min={0}
            defaultValue={unit?.bedrooms ?? ""}
            className={`mt-1 ${inputCls}`}
          />
        </div>
        <div>
          <label className={label}>Bathrooms</label>
          <input
            name="bathrooms"
            type="number"
            min={0}
            defaultValue={unit?.bathrooms ?? ""}
            className={`mt-1 ${inputCls}`}
          />
        </div>
      </div>
    </>
  );
}
