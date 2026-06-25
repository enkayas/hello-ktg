// Normalize an Indian phone number to intl format (no '+') for wa.me links.
// Handles local formats like "08147099516" and "9035081711".
export function toWhatsappNumber(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.replace(/^0+/, "");
  if (digits.length === 10) digits = "91" + digits;
  if (digits.length < 11) return null;
  return digits;
}

export function whatsappLink(phone: string, message: string): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// Fallback host number used across the original site.
export const HOUSE_WHATSAPP = "919962541214";
