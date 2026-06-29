import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateOtpCode, getOtpSecret, hashOtpCode, otpExpiresAt } from "@/lib/otp/crypto";
import { normalizePhone } from "@/lib/otp/phone";
import { isOtpDeliveryConfigured, sendWhatsAppOtp } from "@/lib/otp/twilio";

export const runtime = "nodejs";

type Body = {
  purpose: "profile" | "claim";
  phone: string;
  listingType?: "homestay" | "restaurant";
  listingId?: string;
};

export async function POST(request: Request) {
  if (!isOtpDeliveryConfigured()) {
    return NextResponse.json(
      { error: "WhatsApp verification is not configured on the server." },
      { status: 503 },
    );
  }

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
  if (!phone) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: recent } = await admin
    .from("phone_otp_challenges")
    .select("created_at")
    .eq("user_id", user.id)
    .eq("purpose", body.purpose)
    .eq("phone", phone)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recent?.created_at) {
    const elapsed = Date.now() - new Date(recent.created_at).getTime();
    if (elapsed < 60_000) {
      return NextResponse.json(
        { error: "Please wait a minute before requesting another code." },
        { status: 429 },
      );
    }
  }

  if (body.purpose === "claim") {
    if (!body.listingType || !body.listingId) {
      return NextResponse.json({ error: "Listing required for claim OTP" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("phone, whatsapp, phone_verified_at")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.phone_verified_at) {
      return NextResponse.json(
        { error: "Verify your partner profile phone first." },
        { status: 400 },
      );
    }

    const profilePhone = profile.phone ?? profile.whatsapp ?? "";
    const profileDigits = profilePhone.replace(/\D/g, "");
    if (profileDigits.slice(-10) !== phone.slice(-10)) {
      return NextResponse.json(
        { error: "Use the WhatsApp number on your verified partner profile." },
        { status: 400 },
      );
    }

    const table = body.listingType === "homestay" ? "homestays" : "restaurants";
    const { data: listing } = await admin
      .from(table)
      .select("host_phone, name")
      .eq("id", body.listingId)
      .is("owner_id", null)
      .eq("is_published", true)
      .maybeSingle();

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.host_phone) {
      const hostDigits = listing.host_phone.replace(/\D/g, "");
      if (hostDigits.slice(-10) !== phone.slice(-10)) {
        return NextResponse.json(
          {
            error:
              "This number does not match our records for that property. Contact support if it changed.",
          },
          { status: 400 },
        );
      }
    }
  }

  const code = generateOtpCode();
  const secret = getOtpSecret();
  const codeHash = await hashOtpCode(code, secret);

  const row: Record<string, unknown> = {
    user_id: user.id,
    purpose: body.purpose,
    phone,
    code_hash: codeHash,
    expires_at: otpExpiresAt(),
  };

  if (body.purpose === "claim" && body.listingType && body.listingId) {
    row.listing_type = body.listingType;
    if (body.listingType === "homestay") {
      row.homestay_id = body.listingId;
    } else {
      row.restaurant_id = body.listingId;
    }
  }

  const { data: challenge, error: insertError } = await admin
    .from("phone_otp_challenges")
    .insert(row)
    .select("id")
    .single();

  if (insertError || !challenge) {
    console.error(insertError);
    return NextResponse.json({ error: "Could not start verification" }, { status: 500 });
  }

  const sent = await sendWhatsAppOtp(phone, code);
  if (!sent.ok) {
    return NextResponse.json({ error: sent.error }, { status: 502 });
  }

  const payload: Record<string, unknown> = {
    challengeId: challenge.id,
    expiresIn: 600,
    maskedPhone: `···${phone.slice(-4)}`,
  };

  if (process.env.OTP_DEV_MODE === "true") {
    payload.devCode = code;
  }

  return NextResponse.json(payload);
}
