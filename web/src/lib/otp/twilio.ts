import { normalizePhone } from "@/lib/otp/phone";

type SendResult = { ok: true } | { ok: false; error: string };

function twilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_WHATSAPP_FROM,
  );
}

export function isOtpDeliveryConfigured(): boolean {
  return twilioConfigured() || process.env.OTP_DEV_MODE === "true";
}

export async function sendWhatsAppOtp(
  phone: string,
  code: string,
): Promise<SendResult> {
  const normalized = normalizePhone(phone);
  if (!normalized) {
    return { ok: false, error: "Invalid phone number" };
  }

  if (!twilioConfigured()) {
    if (process.env.OTP_DEV_MODE === "true") {
      console.info(`[OTP_DEV] WhatsApp code for ${normalized}: ${code}`);
      return { ok: true };
    }
    return {
      ok: false,
      error: "WhatsApp OTP is not configured. Set Twilio credentials or OTP_DEV_MODE=true for testing.",
    };
  }

  const sid = process.env.TWILIO_ACCOUNT_SID!;
  const token = process.env.TWILIO_AUTH_TOKEN!;
  const from = process.env.TWILIO_WHATSAPP_FROM!;
  const to = from.startsWith("whatsapp:")
    ? `whatsapp:+${normalized}`
    : `+${normalized}`;

  const body =
    `Your HelloKotagiri verification code is *${code}*. ` +
    `Valid for 10 minutes. Do not share this code with anyone.`;

  const params = new URLSearchParams({
    From: from,
    To: to,
    Body: body,
  });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!res.ok) {
    const text = await res.text();
    console.error("Twilio WhatsApp OTP failed:", text);
    return { ok: false, error: "Could not send WhatsApp code. Try again shortly." };
  }

  return { ok: true };
}
