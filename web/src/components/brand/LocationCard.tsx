"use client";

import { useState } from "react";
import Button from "./Button";

type Props = {
  title?: string;
  description?: string;
  onEnable?: () => void;
};

export default function LocationCard({
  title = "Discover what's around you",
  description = "Allow location to discover stays, food, viewpoints, cafés, fuel stops and local experiences near you.",
  onEnable,
}: Props) {
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied">(
    "idle",
  );

  function handleEnable() {
    if (!navigator.geolocation) {
      setStatus("denied");
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      () => {
        setStatus("granted");
        onEnable?.();
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="rounded-2xl border border-cloud bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tea/10 text-xl">
            📍
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-primary">
              {title}
            </h3>
            <p className="mt-1 text-sm text-charcoal/70">{description}</p>
            {status === "granted" ? (
              <p className="mt-2 text-sm font-medium text-tea">
                Location enabled — showing nearby picks
              </p>
            ) : null}
            {status === "denied" ? (
              <p className="mt-2 text-sm text-charcoal/60">
                Location unavailable — showing Kotagiri town centre picks
              </p>
            ) : null}
          </div>
        </div>
        {status !== "granted" ? (
          <Button
            variant="primary"
            className="shrink-0"
            onClick={handleEnable}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Locating…" : "Enable Location"}
          </Button>
        ) : (
          <Button href="/near-me" variant="outline" className="shrink-0">
            View Near Me
          </Button>
        )}
      </div>
    </div>
  );
}
