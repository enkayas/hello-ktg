import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminListingActions from "@/components/AdminListingActions";
import type { Homestay } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("homestays")
    .select("*")
    .order("is_published", { ascending: true })
    .order("created_at", { ascending: false });
  const { count: leadCount } = await supabase
    .from("lead_events")
    .select("*", { count: "exact", head: true });
  const { data: restaurants } = await supabase.from("restaurants").select("id, is_published");
  const all = (data ?? []) as Homestay[];
  const pending = all.filter((h) => !h.is_published);
  const live = all.filter((h) => h.is_published);
  const featured = all.filter((h) => h.is_featured);
  const eats = restaurants ?? [];
  const eatsPending = eats.filter((r) => !r.is_published).length;
  const eatsLive = eats.filter((r) => r.is_published).length;

  return (
    <div className="space-y-10">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Live stays" value={live.length} />
        <StatCard label="Pending stays" value={pending.length} />
        <StatCard label="Featured" value={featured.length} />
        <StatCard label="Leads logged" value={leadCount ?? 0} />
        <StatCard label="Live restaurants" value={eatsLive} />
        <StatCard label="Pending restaurants" value={eatsPending} />
      </div>
      <div className="rounded-2xl border border-line bg-gradient-to-br from-white to-canvas-subtle p-6 shadow-[0_4px_24px_-8px_rgba(29,58,88,0.08)]">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-primary">
          Listings
        </h1>
        <p className="mt-1 text-sm text-muted">
          {pending.length} awaiting review · {live.length} live
        </p>
      </div>

      <Section title={`Pending review (${pending.length})`} stays={pending} />
      <Section title={`Published (${live.length})`} stays={live} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 font-mono text-3xl font-semibold text-primary">{value}</p>
    </div>
  );
}

function Section({ title, stays }: { title: string; stays: Homestay[] }) {
  if (stays.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
        {title}
      </h2>
      <ul className="space-y-3">
        {stays.map((h) => (
          <li
            key={h.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5 shadow-[0_4px_20px_-8px_rgba(29,58,88,0.1)]"
          >
            <div>
              <p className="font-semibold text-primary">{h.name}</p>
              <p className="text-sm text-muted">
                {h.type}
                {h.area ? ` · ${h.area}` : ""}
                {h.owner_id ? " · owner-managed" : " · curated"}
              </p>
              <Link
                href={`/stays/${h.slug}`}
                className="text-xs font-semibold text-steel hover:text-primary"
              >
                View public page →
              </Link>
            </div>
            <AdminListingActions
              homestayId={h.id}
              isPublished={h.is_published}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
