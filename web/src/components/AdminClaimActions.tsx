"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Claim = {
  id: string;
  listing_type: "homestay" | "restaurant";
  verification_phone: string;
  status: string;
  homestay_id: string | null;
  restaurant_id: string | null;
  profiles: { full_name: string | null; phone: string | null; email: string | null } | null;
  homestays: { name: string } | null;
  restaurants: { name: string } | null;
};

export default function AdminClaimActions({ claim }: { claim: Claim }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const listingName =
    claim.homestays?.name ?? claim.restaurants?.name ?? "Listing";

  async function review(action: "approve" | "reject") {
    setBusy(true);
    setMessage(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("review_listing_claim", {
      p_claim_id: claim.id,
      p_action: action,
      p_notes: null,
    });
    if (error) {
      setMessage(error.message);
      setBusy(false);
      return;
    }
    const result = data as { status: string; message: string };
    setMessage(result.message);
    setBusy(false);
    router.refresh();
  }

  if (claim.status !== "pending") {
    return (
      <span className="text-xs font-semibold uppercase text-muted">
        {claim.status}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => review("approve")}
          className="tap rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-canvas disabled:opacity-60"
        >
          Approve
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => review("reject")}
          className="tap rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-muted disabled:opacity-60"
        >
          Reject
        </button>
      </div>
      {message ? (
        <p className="max-w-[200px] text-right text-xs text-muted">{message}</p>
      ) : null}
      <p className="max-w-[220px] text-right text-[10px] text-muted">
        {listingName}
      </p>
    </div>
  );
}
