"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BrandLogo } from "@/components/hk/BrandLogo";
import type { SiteAsset } from "@/lib/brand";

export default function OwnerLoginClient({ assets }: { assets: SiteAsset[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "auth") {
      setError("Sign-in failed. Please try again.");
    } else if (err === "forbidden") {
      setError("This account does not have admin access. Use an admin account or contact support.");
    }
  }, [searchParams]);

  const nextPath =
    searchParams.get("next")?.startsWith("/") &&
    !searchParams.get("next")?.startsWith("//")
      ? searchParams.get("next")!
      : "/owner/setup";

  async function signInWithGoogle() {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    });
    if (error) {
      setError(error.message);
      setBusy(false);
    }
  }

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
    router.push(nextPath);
    router.refresh();
  }

  const inputCls =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink outline-none focus:border-steel";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-5 py-12">
      <div className="w-full max-w-[400px] rounded-2xl border border-line bg-white p-8 shadow-[0_12px_48px_-16px_rgba(29,58,88,0.14)]">
        <div className="mb-6">
          <BrandLogo assets={assets} background="light" height={72} />
          <p className="mt-2 text-xs font-medium text-muted">Business Console</p>
        </div>

        <h1 className="text-2xl font-bold tracking-[-0.02em] text-primary">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-1 text-sm text-muted">
          Manage your homestay, restaurant or local business on HelloKotagiri.
        </p>

        <button
          type="button"
          disabled={busy}
          onClick={signInWithGoogle}
          className="tap mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-4 py-3.5 text-sm font-semibold text-ink transition hover:border-steel hover:bg-canvas-subtle disabled:opacity-60"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="text-xs font-medium text-muted">or use email</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
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
          {info ? <p className="text-sm text-steel">{info}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="tap w-full rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-canvas transition hover:bg-primary-mid disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setInfo(null);
          }}
          className="tap mt-4 w-full text-sm font-medium text-steel"
        >
          {mode === "signin"
            ? "New partner? Create an account"
            : "Already have an account? Sign in"}
        </button>
      </div>

      <p className="mt-6 text-center text-xs text-muted">
        <Link href="https://hellokotagiri.com" className="text-steel hover:text-primary">
          ← Back to hellokotagiri.com
        </Link>
      </p>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}
