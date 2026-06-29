"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  async function signOut() {
    await createClient().auth.signOut();
    router.push("/owner/login");
    router.refresh();
  }
  return (
    <button
      onClick={signOut}
      className={
        className ??
        "tap text-sm font-medium text-muted hover:text-primary"
      }
    >
      Sign out
    </button>
  );
}
