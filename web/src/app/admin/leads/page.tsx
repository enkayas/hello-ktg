import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Submission = {
  id: string;
  property_name: string;
  owner_name: string;
  phone: string;
  location: string | null;
  property_type: string | null;
  plan: string | null;
  status: string;
  created_at: string;
};

type Enquiry = {
  id: string;
  kind: string;
  target_name: string;
  guest_name: string;
  phone: string | null;
  check_in: string | null;
  check_out: string | null;
  guests: number | null;
  status: string;
  created_at: string;
};

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: subs } = await supabase
    .from("listing_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  const { data: enqs } = await supabase
    .from("enquiries")
    .select("*")
    .order("created_at", { ascending: false });

  const submissions = (subs ?? []) as Submission[];
  const enquiries = (enqs ?? []) as Enquiry[];

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-3 font-serif text-lg font-semibold text-forest">
          Listing submissions ({submissions.length})
        </h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-muted">No submissions yet.</p>
        ) : (
          <ul className="space-y-3">
            {submissions.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl bg-white p-4 ring-1 ring-forest/5"
              >
                <p className="font-semibold text-forest">{s.property_name}</p>
                <p className="text-sm text-muted">
                  {s.owner_name} · {s.phone}
                  {s.location ? ` · ${s.location}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {s.property_type ?? ""} {s.plan ? `· ${s.plan} plan` : ""} ·{" "}
                  {s.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg font-semibold text-forest">
          Enquiries ({enquiries.length})
        </h2>
        {enquiries.length === 0 ? (
          <p className="text-sm text-muted">No enquiries yet.</p>
        ) : (
          <ul className="space-y-3">
            {enquiries.map((e) => (
              <li
                key={e.id}
                className="rounded-2xl bg-white p-4 ring-1 ring-forest/5"
              >
                <p className="font-semibold text-forest">
                  {e.target_name}{" "}
                  <span className="text-xs font-normal text-muted">
                    ({e.kind})
                  </span>
                </p>
                <p className="text-sm text-muted">
                  {e.guest_name}
                  {e.phone ? ` · ${e.phone}` : ""}
                </p>
                {e.check_in ? (
                  <p className="mt-1 text-sm text-ink">
                    {e.check_in} → {e.check_out} · {e.guests} guest
                    {e.guests === 1 ? "" : "s"}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
