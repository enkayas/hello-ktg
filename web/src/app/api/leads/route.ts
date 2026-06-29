import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();
    const { error } = await supabase.from("lead_events").insert({
      listing_id: body.listingId ?? null,
      listing_type: body.listingType ?? "unknown",
      action_type: body.actionType ?? "enquiry",
      user_lat: body.userLocation?.latitude ?? null,
      user_lng: body.userLocation?.longitude ?? null,
    });
    if (error) {
      console.warn("lead_events insert failed (table may not exist yet):", error.message);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
