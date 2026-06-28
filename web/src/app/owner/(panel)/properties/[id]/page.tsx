import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/PropertyForm";
import PhotoManager from "@/components/PhotoManager";
import AvailabilityManager from "@/components/AvailabilityManager";
import type { Homestay } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("homestays")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const property = data as Homestay;

  const { data: photos } = await supabase
    .from("homestay_photos")
    .select("*")
    .eq("homestay_id", id)
    .order("sort_order");
  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("*")
    .eq("homestay_id", id)
    .order("date");

  return (
    <div className="space-y-10">
      <div>
        <Link href="/owner" className="text-sm font-semibold text-leaf">
          ← Back
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <h1 className="font-serif text-2xl font-semibold text-forest">
            {property.name}
          </h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              property.is_published
                ? "bg-mist text-forest"
                : "bg-sun/20 text-sun"
            }`}
          >
            {property.is_published ? "Published" : "Pending review"}
          </span>
        </div>
      </div>

      <section>
        <h2 className="mb-3 font-serif text-lg font-semibold text-forest">
          Details
        </h2>
        <PropertyForm property={property} />
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg font-semibold text-forest">
          Photos
        </h2>
        <PhotoManager
          homestayId={property.id}
          initialPhotos={photos ?? []}
        />
      </section>

      <section>
        <h2 className="mb-3 font-serif text-lg font-semibold text-forest">
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
