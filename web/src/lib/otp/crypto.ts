const OTP_LENGTH = 6;
const OTP_TTL_MS = 10 * 60 * 1000;

export function generateOtpCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000;
  return n.toString().padStart(OTP_LENGTH, "0");
}

export function otpExpiresAt(): string {
  return new Date(Date.now() + OTP_TTL_MS).toISOString();
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
}

export async function hashOtpCode(code: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(code),
  );
  return toBase64(sig);
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function verifyOtpCode(
  code: string,
  hash: string,
  secret: string,
): Promise<boolean> {
  const expected = await hashOtpCode(code, secret);
  return timingSafeEqual(expected, hash);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

export function getOtpSecret(): string {
  const secret = process.env.OTP_SECRET ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) throw new Error("OTP_SECRET is not configured");
  return secret;
}
