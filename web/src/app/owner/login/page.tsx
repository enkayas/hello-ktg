"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function OwnerLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email"));
    const password = String(data.get("password"));
    const supabase = createClient();

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
      // If email confirmation is on, there's no session yet.
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        setInfo("Check your email to confirm your account, then sign in.");
        setMode("signin");
        setBusy(false);
        return;
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        setBusy(false);
        return;
      }
    }
    router.push("/owner");
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-base outline-none focus:border-leaf";

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center px-5 py-10">
      <Link href="/" className="font-serif text-lg font-bold text-forest">
        Travel <span className="text-leaf">Kotagiri</span>
      </Link>
      <h1 className="mt-6 font-serif text-2xl font-semibold text-forest">
        {mode === "signin" ? "Host sign in" : "Create a host account"}
      </h1>
      <p className="mt-1 text-sm text-muted">
        Manage your property, photos, availability and booking requests.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          autoComplete="email"
          className={inputCls}
        />
        <input
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          className={inputCls}
        />
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {info ? <p className="text-sm text-leaf">{info}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="tap w-full rounded-full bg-leaf px-6 py-3.5 font-semibold text-white hover:bg-pine disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
        </button>
      </form>

      <button
        onClick={() => {
          setMode(mode === "signin" ? "signup" : "signin");
          setError(null);
          setInfo(null);
        }}
        className="tap mt-4 text-sm font-medium text-leaf"
      >
        {mode === "signin"
          ? "New host? Create an account"
          : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
