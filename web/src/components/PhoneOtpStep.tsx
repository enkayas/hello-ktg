"use client";

import { useEffect, useState } from "react";

type Props = {
  phone: string;
  purpose: "profile" | "claim";
  listingType?: "homestay" | "restaurant";
  listingId?: string;
  onVerified: (challengeId: string) => void;
  disabled?: boolean;
};

export default function PhoneOtpStep({
  phone,
  purpose,
  listingType,
  listingId,
  onVerified,
  disabled,
}: Props) {
  const [challengeId, setChallengeId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function sendCode() {
    setError(null);
    setInfo(null);
    setDevCode(null);
    setBusy(true);

    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purpose,
        phone,
        listingType,
        listingId,
      }),
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error ?? "Could not send code");
      return;
    }

    setChallengeId(data.challengeId);
    setCooldown(60);
    setInfo(`We sent a 6-digit code to WhatsApp ending ${data.maskedPhone ?? ""}.`);
    if (data.devCode) setDevCode(data.devCode);
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!challengeId) return;
    setError(null);
    setBusy(true);

    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challengeId, code, phone }),
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setError(data.error ?? "Verification failed");
      return;
    }

    onVerified(data.challengeId);
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink outline-none focus:border-steel";

  return (
    <div className="space-y-4">
      {!challengeId ? (
        <button
          type="button"
          disabled={disabled || busy || !phone}
          onClick={sendCode}
          className="tap w-full rounded-full border border-primary px-6 py-3.5 text-sm font-semibold text-primary hover:bg-canvas disabled:opacity-60"
        >
          {busy ? "Sending…" : "Send code to WhatsApp"}
        </button>
      ) : (
        <form onSubmit={verifyCode} className="space-y-3">
          <label className="block text-sm font-medium text-ink">
            Enter 6-digit code
          </label>
          <input
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            required
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            className={inputCls}
            autoComplete="one-time-code"
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {info ? <p className="text-sm text-muted">{info}</p> : null}
          {devCode ? (
            <p className="rounded-lg bg-accent/15 px-3 py-2 text-xs text-[#8a5a10]">
              Dev mode code: <strong>{devCode}</strong>
            </p>
          ) : null}
          <button
            type="submit"
            disabled={busy || code.length < 6}
            className="tap w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-canvas hover:bg-primary-mid disabled:opacity-60"
          >
            {busy ? "Verifying…" : "Verify code"}
          </button>
          <button
            type="button"
            disabled={busy || cooldown > 0}
            onClick={sendCode}
            className="tap w-full text-sm font-medium text-steel disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
          </button>
        </form>
      )}
    </div>
  );
}
