import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookieless, anonymous client for PUBLIC data (published listings).
// Safe to use at build time (generateStaticParams) and in Server Components —
// it never touches cookies, so it works without an HTTP request context.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}
