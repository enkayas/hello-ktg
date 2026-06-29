import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/PropertyForm";
import PhotoManager from "@/components/PhotoManager";
import UnitManager from "@/components/UnitManager";
import AvailabilityManager from "@/components/AvailabilityManager";
import type { Homestay, PropertyUnit } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data } = await supabase
    .from("homestays")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .maybeSingle();
  if (!data) notFound();
  const property = data as Homestay;

  const [{ data: photos }, { data: units }, { data: blocked }] =
    await Promise.all([
      supabase
        .from("homestay_photos")
        .select("*")
        .eq("homestay_id", id)
        .order("sort_order"),
      supabase
        .from("property_units")
        .select("*")
        .eq("homestay_id", id)
        .order("sort_order"),
      supabase
        .from("blocked_dates")
        .select("*")
        .eq("homestay_id", id)
        .order("date"),
    ]);

  const allPhotos = photos ?? [];
  const propertyPhotos = allPhotos.filter((p) => !p.unit_id);
  const unitList = (units ?? []) as PropertyUnit[];

  return (
    <div className="space-y-10">
      <div>
        <Link href="/owner" className="text-sm font-semibold text-steel">
          ← Back
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-primary">
            {property.name}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              property.is_published
                ? "bg-canvas text-primary"
                : "bg-accent/20 text-[#8a5a10]"
            }`}
          >
            {property.is_published ? "Published" : "Pending review"}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted capitalize">
          Property · {property.type}
          {property.area ? ` · ${property.area}` : ""}
        </p>
      </div>

      <section>
        <h2 className="mb-1 text-lg font-semibold text-primary">
          Property details
        </h2>
        <p className="mb-3 text-sm text-muted">
          Overall property name, type and contact — like the Airbnb listing
          header.
        </p>
        <PropertyForm property={property} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-primary">
          Rooms & units
        </h2>
        <UnitManager homestayId={property.id} initialUnits={unitList} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-primary">
          Property photos
        </h2>
        <p className="mb-3 text-sm text-muted">
          Shared photos of the estate, grounds, common areas and overview.
        </p>
        <PhotoManager
          homestayId={property.id}
          unitId={null}
          initialPhotos={propertyPhotos}
        />
      </section>

      {unitList.map((unit) => (
        <section key={unit.id}>
          <h2 className="mb-3 text-lg font-semibold text-primary">
            {unit.name} — photos
          </h2>
          <PhotoManager
            homestayId={property.id}
            unitId={unit.id}
            initialPhotos={allPhotos.filter((p) => p.unit_id === unit.id)}
          />
        </section>
      ))}

      <section>
        <h2 className="mb-3 text-lg font-semibold text-primary">
          Availability
        </h2>
        <AvailabilityManager
          homestayId={property.id}
          initialBlocked={blocked ?? []}
        />
      </section>
    </div>
  );
}
