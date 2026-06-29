import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOtpSecret, verifyOtpCode } from "@/lib/otp/crypto";
import { normalizePhone } from "@/lib/otp/phone";

export const runtime = "nodejs";

type Body = {
  challengeId: string;
  code: string;
  phone: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const phone = normalizePhone(body.phone);
  if (!phone || !body.challengeId || !body.code) {
    return NextResponse.json({ error: "Missing verification details" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: challenge, error } = await admin
    .from("phone_otp_challenges")
    .select("*")
    .eq("id", body.challengeId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !challenge) {
    return NextResponse.json({ error: "Verification session not found" }, { status: 404 });
  }

  if (challenge.consumed_at) {
    return NextResponse.json({ error: "Code already used" }, { status: 400 });
  }

  if (challenge.verified_at) {
    return NextResponse.json({ challengeId: challenge.id, verified: true });
  }

  if (new Date(challenge.expires_at).getTime() < Date.now()) {
    return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
  }

  if (challenge.attempts >= challenge.max_attempts) {
    return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 429 });
  }

  const challengeDigits = challenge.phone.replace(/\D/g, "");
  if (challengeDigits.slice(-10) !== phone.slice(-10)) {
    return NextResponse.json({ error: "Phone mismatch" }, { status: 400 });
  }

  const secret = getOtpSecret();
  const valid = await verifyOtpCode(body.code.trim(), challenge.code_hash, secret);

  await admin
    .from("phone_otp_challenges")
    .update({ attempts: challenge.attempts + 1 })
    .eq("id", challenge.id);

  if (!valid) {
    return NextResponse.json({ error: "Incorrect code. Try again." }, { status: 400 });
  }

  const { error: verifyError } = await admin
    .from("phone_otp_challenges")
    .update({ verified_at: new Date().toISOString() })
    .eq("id", challenge.id);

  if (verifyError) {
    return NextResponse.json({ error: "Could not verify code" }, { status: 500 });
  }

  return NextResponse.json({ challengeId: challenge.id, verified: true });
}
