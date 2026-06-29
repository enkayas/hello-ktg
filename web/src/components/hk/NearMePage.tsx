"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Crosshair, Loader2, MapPin } from "lucide-react";
import FilterChips, { toggleFilter } from "./FilterChips";
import { NearCard } from "./Cards";
import { nearFilters, nearItems } from "@/data/handoff";
import type { NearItem } from "@/data/handoff/types";
import {
  BASE_LOCATIONS,
  DEFAULT_BASE,
  formatDistanceKm,
  getBaseById,
  haversineKm,
  type Coordinates,
} from "@/lib/geo";

const CAT_CHIPS = ["Food", "Stays", "Viewpoints", "Cafés"] as const;
const RADIUS_OPTIONS = [
  { km: 1, label: "1 km" },
  { km: 5, label: "5 km" },
  { km: 15, label: "15 km" },
  { km: 30, label: "30 km" },
] as const;

type NearItemWithDist = NearItem & { computedDist: string; distanceKm: number };

type LocationState =
  | { status: "idle"; reference: Coordinates; label: string }
  | { status: "detecting"; reference: Coordinates; label: string }
  | { status: "gps"; reference: Coordinates; label: string }
  | { status: "denied"; reference: Coordinates; label: string; baseId: string };

export function NearMeContent() {
  const [active, setActive] = useState<Record<string, boolean>>({});
  const [radiusKm, setRadiusKm] = useState(30);
  const [location, setLocation] = useState<LocationState>({
    status: "idle",
    reference: {
      latitude: DEFAULT_BASE.latitude,
      longitude: DEFAULT_BASE.longitude,
    },
    label: DEFAULT_BASE.label,
  });

  const enableLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({
        status: "denied",
        reference: {
          latitude: DEFAULT_BASE.latitude,
          longitude: DEFAULT_BASE.longitude,
        },
        label: DEFAULT_BASE.label,
        baseId: DEFAULT_BASE.id,
      });
      return;
    }

    setLocation((prev) => ({
      ...prev,
      status: "detecting",
      label: "Detecting location…",
    }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          status: "gps",
          reference: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          label: "Location detected",
        });
      },
      () => {
        setLocation({
          status: "denied",
          reference: {
            latitude: DEFAULT_BASE.latitude,
            longitude: DEFAULT_BASE.longitude,
          },
          label: DEFAULT_BASE.label,
          baseId: DEFAULT_BASE.id,
        });
      },
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
    );
  }, []);

  const selectBase = useCallback((baseId: string) => {
    const base = getBaseById(baseId);
    setLocation({
      status: "denied",
      reference: { latitude: base.latitude, longitude: base.longitude },
      label: base.label,
      baseId: base.id,
    });
  }, []);

  const sortedItems = useMemo((): NearItemWithDist[] => {
    const ref = location.reference;
    const withDist: NearItemWithDist[] = nearItems.map((item) => {
      const km = haversineKm(ref, {
        latitude: item.latitude,
        longitude: item.longitude,
      });
      return {
        ...item,
        distanceKm: km,
        computedDist: formatDistanceKm(km),
      };
    });
    return withDist.sort((a, b) => a.distanceKm - b.distanceKm);
  }, [location.reference]);

  const filtered = useMemo(() => {
    const activeCats = CAT_CHIPS.filter((c) => active[c]);
    const onlyOpen = !!active["Open Now"];
    let results = sortedItems.filter((r) => r.distanceKm <= radiusKm);
    if (activeCats.length) {
      results = results.filter((r) => activeCats.includes(r.cat));
    }
    if (onlyOpen) results = results.filter((r) => r.open);
    return results;
  }, [active, sortedItems, radiusKm]);

  const isGps = location.status === "gps";
  const isDetecting = location.status === "detecting";
  const showBasePicker = location.status === "denied";

  return (
    <>
      <section className="page-hero-light">
        <div className="mx-auto max-w-[1240px] px-6 pb-10 pt-10 md:pb-12 md:pt-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9a6b1a]">
            <span className="h-1.5 w-1.5 animate-hk-pulse rounded-full bg-accent" />
            Location-aware discovery
          </span>
          <h1 className="mt-4 text-[clamp(2rem,4.5vw,2.625rem)] font-bold leading-[1.05] tracking-[-0.03em] text-primary">
            What&apos;s Near You?
          </h1>
          <p className="mt-3.5 max-w-[56ch] text-[17px] leading-relaxed text-muted">
            Stays, food, viewpoints and cafés around you — sorted by how far
            you&apos;d actually travel.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] bg-white px-6">
        <div className="relative z-2 -mt-6 flex flex-col gap-5 rounded-2xl border border-line bg-white p-5 shadow-[0_8px_32px_-12px_rgba(29,58,88,0.12)] md:p-6">
          <div className="flex flex-col items-stretch gap-5 md:flex-row md:items-center">
            <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-2xl border border-line bg-canvas-subtle shadow-sm">
              <Crosshair className="h-6 w-6 text-steel" strokeWidth={1.7} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base font-semibold text-primary">
                  Showing results around{" "}
                  <span className="text-steel">{location.label}</span>
                </span>
                {isGps ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-open/25 bg-open/10 px-2.5 py-0.5 text-xs font-semibold text-open">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                    GPS active
                  </span>
                ) : null}
              </div>
              <div className="mt-0.5 text-[13.5px] text-muted">
                {isGps
                  ? "Distances calculated from your current position."
                  : "Enable precise location for live distances, or pick a base town below."}
              </div>
            </div>
            <button
              type="button"
              onClick={enableLocation}
              disabled={isDetecting}
              aria-label="Enable browser location"
              className="tap inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-mid disabled:opacity-70"
            >
              {isDetecting ? (
                <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
              ) : (
                <Crosshair className="h-4 w-4" strokeWidth={1.9} />
              )}
              {isDetecting ? "Detecting…" : "Enable Location"}
            </button>
          </div>

          {showBasePicker ? (
            <div className="rounded-xl border border-dashed border-line bg-canvas-subtle p-4">
              <p className="text-sm font-semibold text-primary">
                Choose your base location
              </p>
              <p className="mt-1 text-xs text-muted">
                Location access was denied or unavailable. Pick where you&apos;re
                starting from — we&apos;ll sort places by distance from there.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {BASE_LOCATIONS.map((base) => {
                  const selected =
                    location.status === "denied" && location.baseId === base.id;
                  return (
                    <button
                      key={base.id}
                      type="button"
                      onClick={() => selectBase(base.id)}
                      className={`tap rounded-full px-3.5 py-2 text-[13px] font-semibold transition shadow-sm ${
                        selected
                          ? "border border-primary bg-primary text-white"
                          : "border border-line bg-white text-primary hover:border-steel"
                      }`}
                    >
                      {base.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pt-8">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-primary">Within</span>
          {RADIUS_OPTIONS.map((r) => (
            <button
              key={r.km}
              type="button"
              onClick={() => setRadiusKm(r.km)}
              className={`tap rounded-full px-3.5 py-2 text-[13px] font-semibold ${
                radiusKm === r.km
                  ? "border border-primary bg-primary text-white"
                  : "border border-line bg-white text-muted hover:border-steel"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <FilterChips
          filters={nearFilters}
          active={active}
          onToggle={(l) => setActive((a) => toggleFilter(a, l))}
        />
      </section>

      <section className="mx-auto max-w-[1240px] px-6 pb-[72px] pt-6">
        <div className="mb-[18px] flex items-center justify-between gap-3">
          <span className="text-sm text-muted">
            <span className="font-mono font-semibold text-primary">
              {filtered.length}
            </span>{" "}
            places near you
          </span>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted">
            <MapPin className="h-3 w-3" strokeWidth={2} />
            Sorted by distance
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-canvas-subtle px-6 py-14 text-center">
            <p className="font-semibold text-primary">No places match your filters</p>
            <p className="mt-1 text-sm text-muted">
              Try clearing a filter or choosing a different base location.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[22px]">
            {filtered.map((r) => (
              <NearCard key={r.id} item={r} distanceLabel={r.computedDist} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
