import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";

export type OwnerOnboardingStatus = {
  complete: boolean;
  needsProfile: boolean;
  needsProperty: boolean;
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;
  profile: Awaited<ReturnType<typeof getCurrentProfile>>;
};

export function isProfileComplete(profile: {
  full_name?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  phone_verified_at?: string | null;
} | null): boolean {
  if (!profile) return false;
  const hasName = Boolean(profile.full_name?.trim());
  const hasContact = Boolean(
    profile.phone?.trim() || profile.whatsapp?.trim(),
  );
  const phoneVerified = Boolean(profile.phone_verified_at);
  return hasName && hasContact && phoneVerified;
}

export async function getOwnerOnboardingStatus(): Promise<
  OwnerOnboardingStatus | { complete: false; needsProfile: true; needsProperty: true; user: null; profile: null }
> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      complete: false,
      needsProfile: true,
      needsProperty: true,
      user: null,
      profile: null,
    };
  }

  const profile = await getCurrentProfile();
  if (profile?.role === "admin") {
    return {
      complete: true,
      needsProfile: false,
      needsProperty: false,
      user,
      profile,
    };
  }

  const needsProfile = !isProfileComplete(profile);
  const supabase = await createClient();

  const { count: stayCount } = await supabase
    .from("homestays")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id);
  const { count: restCount } = await supabase
    .from("restaurants")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id);

  const needsProperty = (stayCount ?? 0) + (restCount ?? 0) === 0;
  const complete = !needsProfile && !needsProperty;

  return { complete, needsProfile, needsProperty, user, profile };
}
