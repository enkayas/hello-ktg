"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminListingActions({
  homestayId,
  isPublished,
}: {
  homestayId: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function setPublished(next: boolean) {
    setBusy(true);
    await createClient()
      .from("homestays")
      .update({ is_published: next })
      .eq("id", homestayId);
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {isPublished ? (
        <button
          onClick={() => setPublished(false)}
          disabled={busy}
          className="tap rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-forest ring-1 ring-forest/15 disabled:opacity-50"
        >
          Unpublish
        </button>
      ) : (
        <button
          onClick={() => setPublished(true)}
          disabled={busy}
          className="tap rounded-full bg-leaf px-4 py-1.5 text-sm font-semibold text-white hover:bg-pine disabled:opacity-50"
        >
          Approve &amp; publish
        </button>
      )}
    </div>
  );
}
