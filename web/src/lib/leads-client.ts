export type LeadPayload = {
  listingId: string;
  listingType: string;
  actionType: "whatsapp" | "call" | "directions" | "enquiry";
  userLocation?: { latitude: number; longitude: number };
};

export async function logLead(payload: LeadPayload): Promise<void> {
  try {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Non-blocking for guests
  }
}
