"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "@/components/LocaleProvider";
import { toWhatsappNumber, whatsappLink, HOUSE_WHATSAPP } from "@/lib/whatsapp";

type Props = {
  stayName: string;
  hostPhone: string | null;
  unitLabel?: string;
};

export default function BookingForm({ stayName, hostPhone, unitLabel }: Props) {
  const t = useTranslations();
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
      message: unitLabel
        ? `Unit: ${unitLabel}${message ? `\n${message}` : ""}`
        : message,
      status: "new",
    });

    const number = toWhatsappNumber(hostPhone) ?? HOUSE_WHATSAPP;
    const text =
      `Hi! I'd like to request a stay at *${stayName}* via HelloKotagiri.\n\n` +
      (unitLabel ? `Unit: ${unitLabel}\n` : "") +
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
      <div className="rounded-2xl border border-open/20 bg-open/5 p-6 text-center shadow-sm">
        <p className="text-lg font-bold text-primary">{t.booking.sentTitle}</p>
        <p className="mt-1 text-sm text-muted">{t.booking.sentBody}</p>
        <button
          type="button"
          onClick={() => setDone(false)}
          className="tap mt-4 text-sm font-semibold text-steel"
        >
          {t.booking.sendAnother}
        </button>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink shadow-sm outline-none transition focus:border-steel focus:shadow-md";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        name="name"
        required
        placeholder={t.booking.yourName}
        className={inputCls}
      />
      <input
        name="phone"
        required
        inputMode="tel"
        placeholder={t.booking.whatsapp}
        className={inputCls}
      />
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-medium text-muted">
          {t.booking.checkIn}
          <input name="check_in" type="date" required className={`mt-1 ${inputCls}`} />
        </label>
        <label className="text-sm font-medium text-muted">
          {t.booking.checkOut}
          <input name="check_out" type="date" required className={`mt-1 ${inputCls}`} />
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
        placeholder={t.booking.notes}
        className={inputCls}
      />
      <button
        type="submit"
        disabled={submitting}
        className="tap w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(29,58,88,0.35)] hover:bg-primary-mid disabled:opacity-60"
      >
        {submitting ? t.booking.sending : t.booking.submit}
      </button>
      <p className="text-center text-xs text-muted">{t.booking.noPayment}</p>
    </form>
  );
}
