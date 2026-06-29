import { createClient } from "@/lib/supabase/server";
import AdminClaimActions from "@/components/AdminClaimActions";

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
  const { data: claims } = await supabase
    .from("listing_claim_requests")
    .select(
      "*, profiles(full_name, phone, email), homestays(name), restaurants(name)",
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const submissions = (subs ?? []) as Submission[];
  const enquiries = (enqs ?? []) as Enquiry[];
  const pendingClaims = claims ?? [];

  return (
    <div className="space-y-10">
      <div className="rounded-2xl border border-line bg-gradient-to-br from-white to-canvas-subtle p-6 shadow-[0_4px_24px_-8px_rgba(29,58,88,0.08)]">
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-primary">Leads & claims</h1>
        <p className="mt-1 text-sm text-muted">
          Ownership claims, listing submissions, and guest enquiries.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Ownership claims ({pendingClaims.length})
        </h2>
        {pendingClaims.length === 0 ? (
          <p className="text-sm text-muted">No pending claims.</p>
        ) : (
          <ul className="space-y-3">
            {pendingClaims.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-5 shadow-[0_4px_20px_-8px_rgba(29,58,88,0.1)]"
              >
                <div>
                  <p className="font-semibold text-primary">
                    {c.homestays?.name ?? c.restaurants?.name ?? "Listing"}
                  </p>
                  <p className="text-sm text-muted">
                    {c.profiles?.full_name ?? "Partner"} ·{" "}
                    {c.verification_phone}
                    {c.profiles?.email ? ` · ${c.profiles.email}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {c.listing_type} · {c.status}
                    {c.otp_verified ? " · WhatsApp OTP verified" : ""}
                  </p>
                </div>
                <AdminClaimActions claim={c} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Listing submissions ({submissions.length})
        </h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-muted">No submissions yet.</p>
        ) : (
          <ul className="space-y-3">
            {submissions.map((s) => (
              <li
                key={s.id}
                className="rounded-2xl border border-line bg-white p-5 shadow-[0_4px_20px_-8px_rgba(29,58,88,0.1)]"
              >
                <p className="font-semibold text-primary">{s.property_name}</p>
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
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Enquiries ({enquiries.length})
        </h2>
        {enquiries.length === 0 ? (
          <p className="text-sm text-muted">No enquiries yet.</p>
        ) : (
          <ul className="space-y-3">
            {enquiries.map((e) => (
              <li
                key={e.id}
                className="rounded-2xl border border-line bg-white p-5 shadow-[0_4px_20px_-8px_rgba(29,58,88,0.1)]"
              >
                <p className="font-semibold text-primary">
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
