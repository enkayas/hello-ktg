"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import PhoneOtpStep from "@/components/PhoneOtpStep";

type ClaimTarget = {
  listingType: "homestay" | "restaurant";
  id: string;
  name: string;
};

type Props = {
  target: ClaimTarget | null;
  profilePhone: string;
  onClose: () => void;
};

type ClaimResult = {
  status: "approved" | "pending" | "error";
  message: string;
};

export default function ClaimVerifyModal({
  target,
  profilePhone,
  onClose,
}: Props) {
  const router = useRouter();
  const [phone] = useState(profilePhone);
  const [otpChallengeId, setOtpChallengeId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ClaimResult | null>(null);

  async function submitClaimWithId(challengeId: string) {
    if (!target) return;
    setOtpChallengeId(challengeId);
    setBusy(true);
    setResult(null);

    const supabase = createClient();
    const { data, error } = await supabase.rpc("submit_listing_claim", {
      p_listing_type: target.listingType,
      p_listing_id: target.id,
      p_verification_phone: phone,
      p_otp_challenge_id: challengeId,
    });

    if (error) {
      setResult({ status: "error", message: error.message });
      setBusy(false);
      return;
    }

    const payload = data as ClaimResult;
    setResult(payload);
    setBusy(false);

    if (payload.status === "approved") {
      router.push("/owner");
      router.refresh();
    }
  }

  function onOtpVerified(challengeId: string) {
    void submitClaimWithId(challengeId);
  }

  async function submitClaim() {
    if (!otpChallengeId) return;
    await submitClaimWithId(otpChallengeId);
  }

  if (!target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/40 p-4 sm:items-center">
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-xl"
        role="dialog"
        aria-labelledby="claim-title"
      >
        <h2 id="claim-title" className="text-lg font-bold text-primary">
          Verify ownership
        </h2>
        <p className="mt-2 text-sm text-muted">
          To claim <span className="font-semibold text-ink">{target.name}</span>,
          we&apos;ll send a one-time code to your verified WhatsApp (
          {phone ? `···${phone.replace(/\D/g, "").slice(-4)}` : ""}). This proves
          you control the number on file for this property — similar to how Airbnb
          verifies hosts before publishing.
        </p>

        {result ? (
          <div
            className={`mt-4 rounded-xl p-4 text-sm ${
              result.status === "error"
                ? "bg-red-50 text-red-700"
                : result.status === "pending"
                  ? "bg-accent/15 text-[#8a5a10]"
                  : "bg-canvas text-primary"
            }`}
          >
            {result.message}
          </div>
        ) : null}

        {result?.status !== "approved" && result?.status !== "pending" && !busy && !otpChallengeId ? (
          <div className="mt-5">
            <PhoneOtpStep
              phone={phone}
              purpose="claim"
              listingType={target.listingType}
              listingId={target.id}
              onVerified={onOtpVerified}
            />
          </div>
        ) : null}

        {busy && !result ? (
          <p className="mt-4 text-sm text-muted">Linking property…</p>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="tap mt-4 w-full text-sm font-medium text-steel"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
