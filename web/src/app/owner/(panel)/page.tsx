import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Homestay } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function OwnerDashboard() {
  const supabase = await createClient();
  // RLS scopes these to the signed-in owner automatically.
  const { data: properties } = await supabase
    .from("homestays")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: pending } = await supabase
    .from("bookings")
    .select("id")
    .eq("status", "requested");

  const list = (properties ?? []) as Homestay[];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-forest">
            Your properties
          </h1>
          <p className="mt-1 text-sm text-muted">
            {list.length} listing{list.length === 1 ? "" : "s"}
            {pending && pending.length > 0
              ? ` · ${pending.length} pending request${pending.length === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
        <Link
          href="/owner/properties/new"
          className="tap inline-flex items-center rounded-full bg-leaf px-4 py-2 font-semibold text-white hover:bg-pine"
        >
          + Add
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-8 text-center ring-1 ring-forest/5">
          <p className="font-serif text-lg text-forest">No properties yet</p>
          <p className="mt-1 text-sm text-muted">
            Add your first stay to start receiving booking requests.
          </p>
          <Link
            href="/owner/properties/new"
            className="tap mt-4 inline-flex rounded-full bg-leaf px-5 py-2.5 font-semibold text-white hover:bg-pine"
          >
            Add a property
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.map((p) => (
            <li key={p.id}>
              <Link
                href={`/owner/properties/${p.id}`}
                className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-forest/5 hover:ring-leaf/30"
              >
                <div>
                  <p className="font-semibold text-forest">{p.name}</p>
                  <p className="text-sm text-muted">
                    {p.type}
                    {p.area ? ` · ${p.area}` : ""}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.is_published
                      ? "bg-mist text-forest"
                      : "bg-sun/20 text-sun"
                  }`}
                >
                  {p.is_published ? "Published" : "Pending review"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
