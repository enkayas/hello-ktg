import { toWhatsappNumber } from "@/lib/whatsapp";

export function normalizePhone(raw: string): string | null {
  return toWhatsappNumber(raw);
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "****";
  return `···${digits.slice(-4)}`;
}
