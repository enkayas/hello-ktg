import { createClient } from "@/lib/supabase/server";
import BookingActions from "@/components/BookingActions";
import type { Booking, BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Row = Booking & { homestays: { name: string } | null };

export default async function OwnerBookingsPage() {
  const supabase = await createClient();
  // RLS scopes bookings to the signed-in owner.
  const { data } = await supabase
    .from("bookings")
    .select("*, homestays(name)")
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-forest">
        Booking requests
      </h1>
      <p className="mt-1 text-sm text-muted">
        Approve or decline — the guest is notified on WhatsApp.
      </p>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-8 text-center ring-1 ring-forest/5">
          <p className="text-muted">No booking requests yet.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((b) => (
            <li
              key={b.id}
              className="rounded-2xl bg-white p-4 ring-1 ring-forest/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-forest">
                    {b.homestays?.name ?? "Stay"}
                  </p>
                  <p className="text-sm text-muted">
                    {b.guest_name} · {b.guests} guest
                    {b.guests === 1 ? "" : "s"}
                  </p>
                  <p className="mt-1 text-sm text-ink">
                    {b.check_in} → {b.check_out}
                  </p>
                  {b.notes ? (
                    <p className="mt-1 text-sm text-muted">“{b.notes}”</p>
                  ) : null}
                </div>
                <BookingActions
                  bookingId={b.id}
                  guestPhone={b.guest_phone}
                  stayName={b.homestays?.name ?? "your stay"}
                  status={b.status as BookingStatus}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
