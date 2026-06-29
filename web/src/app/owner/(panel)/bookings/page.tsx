import { createClient } from "@/lib/supabase/server";
import BookingActions from "@/components/BookingActions";
import type { Booking, BookingStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Row = Booking & { homestays: { name: string } | null };

export default async function OwnerBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("bookings")
    .select("*, homestays(name)")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  const rows = (data ?? []) as Row[];

  return (
    <div>
      <div className="rounded-2xl border border-line bg-gradient-to-br from-white to-canvas-subtle p-6 shadow-[0_4px_24px_-8px_rgba(29,58,88,0.08)]">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-primary">
          Booking requests
        </h1>
        <p className="mt-1 text-sm text-muted">
          Approve or decline — the guest is notified on WhatsApp.
        </p>
      </div>

      {rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-canvas-subtle p-10 text-center shadow-sm">
          <p className="text-muted">No booking requests yet.</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {rows.map((b) => (
            <li
              key={b.id}
              className="rounded-2xl border border-line bg-white p-5 shadow-[0_4px_20px_-8px_rgba(29,58,88,0.1)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-primary">
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
                    <p className="mt-1 text-sm text-muted">"{b.notes}"</p>
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
