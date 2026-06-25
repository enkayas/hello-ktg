import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AdminListingActions from "@/components/AdminListingActions";
import type { Homestay } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const supabase = await createClient();
  // is_admin() RLS lets admins see every listing.
  const { data } = await supabase
    .from("homestays")
    .select("*")
    .order("is_published", { ascending: true })
    .order("created_at", { ascending: false });
  const all = (data ?? []) as Homestay[];
  const pending = all.filter((h) => !h.is_published);
  const live = all.filter((h) => h.is_published);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-forest">
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

function Section({ title, stays }: { title: string; stays: Homestay[] }) {
  if (stays.length === 0) return null;
  return (
    <section>
      <h2 className="mb-3 font-serif text-lg font-semibold text-forest">
        {title}
      </h2>
      <ul className="space-y-3">
        {stays.map((h) => (
          <li
            key={h.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-forest/5"
          >
            <div>
              <p className="font-semibold text-forest">{h.name}</p>
              <p className="text-sm text-muted">
                {h.type}
                {h.area ? ` · ${h.area}` : ""}
                {h.owner_id ? " · owner-managed" : " · curated"}
              </p>
              <Link
                href={`/stays/${h.slug}`}
                className="text-xs font-semibold text-leaf"
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
