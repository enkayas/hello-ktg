"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.push("/owner/login");
    router.refresh();
  }
  return (
    <button
      onClick={signOut}
      className="tap text-sm font-medium text-muted hover:text-forest"
    >
      Sign out
    </button>
  );
}
