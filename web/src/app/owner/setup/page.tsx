import { createClient } from "@/lib/supabase/server";
import { getOwnerOnboardingStatus } from "@/lib/owner-onboarding";
import SetupClient from "./SetupClient";

export const dynamic = "force-dynamic";

export default async function OwnerSetupPage() {
  const status = await getOwnerOnboardingStatus();
  const supabase = await createClient();

  const [{ data: homestays }, { data: restaurants }] = await Promise.all([
    supabase
      .from("homestays")
      .select("id, name, type, area")
      .is("owner_id", null)
      .eq("is_published", true)
      .order("name"),
    supabase
      .from("restaurants")
      .select("id, name, cuisine, area")
      .is("owner_id", null)
      .eq("is_published", true)
      .order("name"),
  ]);

  return (
    <SetupClient
      needsProfile={status.needsProfile}
      profile={status.profile}
      claimableHomestays={homestays ?? []}
      claimableRestaurants={restaurants ?? []}
    />
  );
}
