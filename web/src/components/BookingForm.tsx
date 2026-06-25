"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toWhatsappNumber, whatsappLink, HOUSE_WHATSAPP } from "@/lib/whatsapp";

type Props = {
  stayName: string;
  hostPhone: string | null;
};

export default function BookingForm({ stayName, hostPhone }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    const guest_name = String(data.get("name") || "");
    const phone = String(data.get("phone") || "");
    const check_in = String(data.get("check_in") || "");
    const check_out = String(data.get("check_out") || "");
    const guests = Number(data.get("guests") || 2);
    const message = String(data.get("notes") || "");

    // Persist the request as an enquiry (RLS allows anonymous insert).
    const supabase = createClient();
    await supabase.from("enquiries").insert({
      kind: "stay",
      target_name: stayName,
      guest_name,
      phone,
      check_in: check_in || null,
      check_out: check_out || null,
      guests,
      party_size: guests,
      message,
      status: "new",
    });

    // Open WhatsApp to the host with a pre-filled request.
    const number = toWhatsappNumber(hostPhone) ?? HOUSE_WHATSAPP;
    const text =
      `Hi! I'd like to request a stay at *${stayName}* via Travel Kotagiri.\n\n` +
      `Name: ${guest_name}\nCheck-in: ${check_in}\nCheck-out: ${check_out}\n` +
      `Guests: ${guests}` +
      (message ? `\nNotes: ${message}` : "");
    window.open(whatsappLink(number, text), "_blank");

    setDone(true);
    setSubmitting(false);
    form.reset();
  }

  if (done) {
    return (
      <div className="rounded-2xl bg-mist p-5 text-center">
        <p className="font-serif text-lg font-semibold text-forest">
          Request sent 🎉
        </p>
        <p className="mt-1 text-sm text-muted">
          We opened WhatsApp so you can confirm with the host. They&apos;ll reply
          to approve your dates.
        </p>
        <button
          onClick={() => setDone(false)}
          className="tap mt-4 text-sm font-semibold text-leaf"
        >
          Send another request
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-base outline-none focus:border-leaf";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input name="name" required placeholder="Your name" className={inputCls} />
      <input
        name="phone"
        required
        inputMode="tel"
        placeholder="WhatsApp number (with country code)"
        className={inputCls}
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm text-muted">
          Check-in
          <input name="check_in" type="date" required className={inputCls} />
        </label>
        <label className="text-sm text-muted">
          Check-out
          <input name="check_out" type="date" required className={inputCls} />
        </label>
      </div>
      <input
        name="guests"
        type="number"
        min={1}
        defaultValue={2}
        required
        className={inputCls}
      />
      <textarea
        name="notes"
        rows={3}
        placeholder="Anything the host should know?"
        className={inputCls}
      />
      <button
        type="submit"
        disabled={submitting}
        className="tap w-full rounded-full bg-leaf px-6 py-3.5 font-semibold text-white hover:bg-pine disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Request to book via WhatsApp"}
      </button>
      <p className="text-center text-xs text-muted">
        No payment now — the host confirms your dates first.
      </p>
    </form>
  );
}
