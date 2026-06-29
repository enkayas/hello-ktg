import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Homestay } from "@/lib/types";

export const dynamic = "force-dynamic";

type Restaurant = {
  id: string;
  name: string;
  cuisine?: string | null;
  area?: string | null;
  is_published?: boolean | null;
};

export default async function OwnerDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: properties } = await supabase
    .from("homestays")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  const { data: restaurants } = await supabase
    .from("restaurants")
    .select("id, name, cuisine, area, is_published")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });
  const { data: pending } = await supabase
    .from("bookings")
    .select("id")
    .eq("owner_id", user.id)
    .eq("status", "requested");

  const stays = (properties ?? []) as Homestay[];
  const eats = (restaurants ?? []) as Restaurant[];
  const total = stays.length + eats.length;
  const pendingCount = pending?.length ?? 0;

  return (
    <div>
      <div className="rounded-2xl border border-line bg-gradient-to-br from-white to-canvas-subtle p-6 shadow-[0_4px_24px_-8px_rgba(29,58,88,0.08)] md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-steel">
              Partner dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-[-0.02em] text-primary md:text-3xl">
              Your businesses
            </h1>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-primary shadow-sm">
                {total} listing{total === 1 ? "" : "s"}
              </span>
              {pendingCount > 0 ? (
                <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-[#8a5a10]">
                  {pendingCount} pending request{pendingCount === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>
          </div>
          <Link
            href="/owner/properties/new"
            className="tap inline-flex items-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_14px_-4px_rgba(29,58,88,0.4)] hover:bg-primary-mid"
          >
            + Add homestay
          </Link>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Homestays & stays
        </h2>
        {stays.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-line bg-canvas-subtle p-10 text-center shadow-sm">
            <p className="font-semibold text-primary">No homestays yet</p>
            <p className="mt-1 text-sm text-muted">
              Add a homestay to start receiving stay booking requests.
            </p>
            <Link
              href="/owner/properties/new"
              className="tap mt-5 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-mid"
            >
              Add a homestay
            </Link>
          </div>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {stays.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/owner/properties/${p.id}`}
                  className="card-hover flex items-center justify-between rounded-2xl border border-line bg-white p-5 shadow-[0_4px_20px_-8px_rgba(29,58,88,0.1)]"
                >
                  <div>
                    <p className="font-semibold text-primary">{p.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {p.type}
                      {p.area ? ` · ${p.area}` : ""}
                    </p>
                  </div>
                  <StatusBadge published={!!p.is_published} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Restaurants & cafés
        </h2>
        {eats.length === 0 ? (
          <div className="mt-3 rounded-2xl border border-dashed border-line bg-canvas-subtle p-6 text-sm text-muted shadow-sm">
            No restaurants linked to your account yet. Contact{" "}
            <a href="mailto:enkayas@gmail.com" className="font-semibold text-steel hover:text-primary">
              support
            </a>{" "}
            to claim or add a restaurant listing.
          </div>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {eats.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-2xl border border-line bg-white p-5 shadow-[0_4px_20px_-8px_rgba(29,58,88,0.1)]"
              >
                <div>
                  <p className="font-semibold text-primary">{r.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {r.cuisine}
                    {r.area ? ` · ${r.area}` : ""}
                  </p>
                </div>
                <StatusBadge published={!!r.is_published} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
        published
          ? "border border-open/20 bg-open/10 text-open"
          : "border border-accent/30 bg-accent/10 text-[#8a5a10]"
      }`}
    >
      {published ? "Published" : "Pending"}
    </span>
  );
}
