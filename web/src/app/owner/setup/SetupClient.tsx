"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import ClaimVerifyModal from "@/components/ClaimVerifyModal";
import PhoneOtpStep from "@/components/PhoneOtpStep";

type ClaimableHomestay = {
  id: string;
  name: string;
  type: string;
  area: string | null;
};

type ClaimableRestaurant = {
  id: string;
  name: string;
  cuisine: string | null;
  area: string | null;
};

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  phone_verified_at?: string | null;
} | null;

type Props = {
  needsProfile: boolean;
  profile: Profile;
  claimableHomestays: ClaimableHomestay[];
  claimableRestaurants: ClaimableRestaurant[];
};

export default function SetupClient({
  needsProfile: initialNeedsProfile,
  profile,
  claimableHomestays,
  claimableRestaurants,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"profile" | "property">(
    initialNeedsProfile ? "profile" : "property",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"stays" | "restaurants">("stays");
  const [claimTarget, setClaimTarget] = useState<{
    listingType: "homestay" | "restaurant";
    id: string;
    name: string;
  } | null>(null);

  const profilePhone = profile?.phone ?? profile?.whatsapp ?? "";

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phoneInput, setPhoneInput] = useState(
    profile?.phone ?? profile?.whatsapp ?? "",
  );
  const [profileOtpChallengeId, setProfileOtpChallengeId] = useState<
    string | null
  >(null);

  const filteredStays = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return claimableHomestays;
    return claimableHomestays.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.area?.toLowerCase().includes(q) ||
        h.type.toLowerCase().includes(q),
    );
  }, [claimableHomestays, query]);

  const filteredRestaurants = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return claimableRestaurants;
    return claimableRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.area?.toLowerCase().includes(q) ||
        r.cuisine?.toLowerCase().includes(q),
    );
  }, [claimableRestaurants, query]);

  async function completeProfile(challengeId: string) {
    setError(null);
    setBusy(true);

    const supabase = createClient();
    const { data, error: rpcError } = await supabase.rpc("complete_verified_profile", {
      p_otp_challenge_id: challengeId,
      p_full_name: fullName.trim(),
      p_phone: phoneInput.replace(/\D/g, ""),
    });

    if (rpcError) {
      setError(rpcError.message);
      setBusy(false);
      return;
    }

    const result = data as { status: string; message: string };
    if (result.status !== "ok") {
      setError(result.message);
      setBusy(false);
      return;
    }

    setBusy(false);
    setStep("property");
    router.refresh();
  }

  function openClaim(
    listingType: "homestay" | "restaurant",
    id: string,
    name: string,
  ) {
    setError(null);
    setClaimTarget({ listingType, id, name });
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink outline-none focus:border-steel";
  const label = "block text-sm font-medium text-ink";

  if (step === "profile") {
    return (
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          Step 1 of 2
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-primary">
          Create your partner profile
        </h1>
        <p className="mt-2 text-sm text-muted">
          Like Airbnb, we verify your WhatsApp before you can manage a listing.
          Enter your details, then confirm the code we send to your phone.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className={label}>Your full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              disabled={Boolean(profileOtpChallengeId)}
              className={`mt-1 ${inputCls}`}
            />
          </div>
          <div>
            <label className={label}>Mobile number (WhatsApp)</label>
            <input
              required
              inputMode="tel"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="919962541214"
              disabled={Boolean(profileOtpChallengeId)}
              className={`mt-1 ${inputCls}`}
            />
            <p className="mt-1 text-xs text-muted">
              International format, no + sign. Must be a WhatsApp number you control.
            </p>
          </div>

          {fullName.trim() && phoneInput.replace(/\D/g, "").length >= 10 ? (
            <PhoneOtpStep
              phone={phoneInput}
              purpose="profile"
              disabled={busy}
              onVerified={(id) => {
                setProfileOtpChallengeId(id);
                void completeProfile(id);
              }}
            />
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {busy ? (
            <p className="text-sm text-muted">Saving verified profile…</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">
        Step 2 of 2
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em] text-primary">
        Link your business
      </h1>
      <p className="mt-2 text-sm text-muted">
        Find your existing HelloKotagiri listing and verify ownership with the
        property&apos;s registered WhatsApp number. You can only claim listings
        linked to your profile phone.
      </p>

      <div className="mt-6 flex gap-2">
        <TabButton active={tab === "stays"} onClick={() => setTab("stays")}>
          Homestays ({claimableHomestays.length})
        </TabButton>
        <TabButton
          active={tab === "restaurants"}
          onClick={() => setTab("restaurants")}
        >
          Restaurants ({claimableRestaurants.length})
        </TabButton>
      </div>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or area…"
        className={`mt-4 ${inputCls}`}
      />

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <ul className="mt-4 max-h-[340px] space-y-2 overflow-y-auto">
        {tab === "stays" ? (
          filteredStays.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
              No matching homestays found.
            </li>
          ) : (
            filteredStays.map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
              >
                <div>
                  <p className="font-semibold text-primary">{h.name}</p>
                  <p className="text-sm text-muted">
                    {h.type}
                    {h.area ? ` · ${h.area}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => openClaim("homestay", h.id, h.name)}
                  className="tap shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-canvas hover:bg-primary-mid disabled:opacity-60"
                >
                  Claim
                </button>
              </li>
            ))
          )
        ) : filteredRestaurants.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-line p-6 text-center text-sm text-muted">
            No matching restaurants found.
          </li>
        ) : (
          filteredRestaurants.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-surface p-4"
            >
              <div>
                <p className="font-semibold text-primary">{r.name}</p>
                <p className="text-sm text-muted">
                  {r.cuisine}
                  {r.area ? ` · ${r.area}` : ""}
                </p>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => openClaim("restaurant", r.id, r.name)}
                className="tap shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-canvas hover:bg-primary-mid disabled:opacity-60"
              >
                Claim
              </button>
            </li>
          ))
        )}
      </ul>

      <div className="mt-8 rounded-2xl border border-line bg-surface/80 p-6">
        <p className="font-semibold text-primary">Not listed yet?</p>
        <p className="mt-1 text-sm text-muted">
          Register a new homestay or cottage. Our team reviews it before it goes
          live on the site.
        </p>
        <Link
          href="/owner/setup/properties/new"
          className="tap mt-4 inline-flex rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary hover:bg-canvas"
        >
          Add a new homestay
        </Link>
      </div>

      <ClaimVerifyModal
        target={claimTarget}
        profilePhone={phoneInput || profilePhone}
        onClose={() => setClaimTarget(null)}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tap rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-primary text-canvas"
          : "border border-line bg-surface text-muted hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}
