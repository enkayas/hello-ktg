"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toWhatsappNumber, whatsappLink } from "@/lib/whatsapp";
import type { BookingStatus } from "@/lib/types";

export default function BookingActions({
  bookingId,
  guestPhone,
  stayName,
  status,
}: {
  bookingId: string;
  guestPhone: string;
  stayName: string;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setStatus(next: BookingStatus) {
    setBusy(true);
    const supabase = createClient();
    await supabase.from("bookings").update({ status: next }).eq("id", bookingId);

    // Nudge the guest on WhatsApp with the decision.
    const number = toWhatsappNumber(guestPhone);
    if (number) {
      const msg =
        next === "approved"
          ? `Good news! Your stay request for *${stayName}* is confirmed. See you in Kotagiri! 🍃`
          : `Sorry — your request for *${stayName}* can't be accommodated for those dates.`;
      window.open(whatsappLink(number, msg), "_blank");
    }
    setBusy(false);
    router.refresh();
  }

  if (status !== "requested") {
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          status === "approved"
            ? "bg-mist text-forest"
            : "bg-red-50 text-red-600"
        }`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setStatus("approved")}
        disabled={busy}
        className="tap rounded-full bg-leaf px-4 py-1.5 text-sm font-semibold text-white hover:bg-pine disabled:opacity-50"
      >
        Approve
      </button>
      <button
        onClick={() => setStatus("declined")}
        disabled={busy}
        className="tap rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-red-600 ring-1 ring-red-200 disabled:opacity-50"
      >
        Decline
      </button>
    </div>
  );
}
