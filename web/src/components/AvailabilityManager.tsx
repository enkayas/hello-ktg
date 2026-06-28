"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Blocked = { id: string; homestay_id: string; date: string };

export default function AvailabilityManager({
  homestayId,
  initialBlocked,
}: {
  homestayId: string;
  initialBlocked: Blocked[];
}) {
  const [blocked, setBlocked] = useState<Blocked[]>(initialBlocked);
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);

  async function block() {
    if (!date) return;
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blocked_dates")
      .insert({ homestay_id: homestayId, date })
      .select("*")
      .single();
    if (!error && data) {
      setBlocked((b) =>
        [...b, data as Blocked].sort((a, c) => a.date.localeCompare(c.date)),
      );
      setDate("");
    }
    setBusy(false);
  }

  async function unblock(b: Blocked) {
    const supabase = createClient();
    await supabase.from("blocked_dates").delete().eq("id", b.id);
    setBlocked((prev) => prev.filter((x) => x.id !== b.id));
  }

  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Block dates when your property is unavailable.
      </p>
      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 rounded-xl border border-forest/15 bg-white px-4 py-3 outline-none focus:border-leaf"
        />
        <button
          onClick={block}
          disabled={busy || !date}
          className="tap rounded-full bg-forest px-5 py-2 font-semibold text-white disabled:opacity-50"
        >
          Block
        </button>
      </div>

      {blocked.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {blocked.map((b) => (
            <li
              key={b.id}
              className="flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-forest/10"
            >
              <span>{b.date}</span>
              <button
                onClick={() => unblock(b)}
                className="font-semibold text-red-600"
                aria-label="Unblock"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted">No blocked dates.</p>
      )}
    </div>
  );
}
