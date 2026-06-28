import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import BookingForm from "@/components/BookingForm";
import StayGallery from "@/components/StayGallery";
import { getPublishedStays, getStayBySlug } from "@/lib/queries";

export const revalidate = 300;

// Pre-render a static page per published stay (SEO).
export async function generateStaticParams() {
  const stays = await getPublishedStays();
  return stays.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stay = await getStayBySlug(slug);
  if (!stay) return { title: "Stay not found" };
  return {
    title: `${stay.name} — ${stay.type} in ${stay.area ?? "Kotagiri"}`,
    description:
      stay.description ??
      `Book ${stay.name}, a ${stay.type.toLowerCase()} in ${stay.area ?? "Kotagiri"}, Nilgiris.`,
  };
}

export default async function StayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const stay = await getStayBySlug(slug);
  if (!stay) notFound();

  return (
    <>
      <SiteNav variant="solid" />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-24 md:py-28">
        <Link href="/stays" className="text-sm font-semibold text-leaf">
          ← All stays
        </Link>

        <div className="mt-4">
          <StayGallery
            photos={stay.homestay_photos ?? []}
            fallback={stay.image_url}
            name={stay.name}
          />
        </div>

        <div className="mt-5">
          <span className="rounded-full bg-mist px-3 py-1 text-xs font-semibold text-forest">
            {stay.type}
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-forest">
            {stay.name}
          </h1>
          <p className="mt-1 text-muted">
            {stay.area ? `📍 ${stay.area} · ` : ""}Kotagiri, Nilgiris
          </p>
          <div className="mt-2 flex items-center gap-3 text-sm">
            {stay.rating ? (
              <span className="font-semibold text-sun">★ {stay.rating}</span>
            ) : null}
            {stay.reviews_count ? (
              <span className="text-muted">{stay.reviews_count} reviews</span>
            ) : null}
          </div>
        </div>

        {stay.description ? (
          <p className="mt-5 text-ink">{stay.description}</p>
        ) : null}

        {stay.amenities && stay.amenities.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {stay.amenities.map((a) => (
              <span
                key={a}
                className="rounded-full bg-white px-3 py-1 text-sm text-ink ring-1 ring-forest/10"
              >
                {a}
              </span>
            ))}
          </div>
        ) : null}

        {/* Request-to-book */}
        <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-forest/5">
          <h2 className="font-serif text-xl font-semibold text-forest">
            Request to book
          </h2>
          <p className="mt-1 mb-4 text-sm text-muted">
            Send your dates — the host confirms availability over WhatsApp.
          </p>
          <BookingForm stayName={stay.name} hostPhone={stay.host_phone} />
        </section>

        {stay.website_url ? (
          <p className="mt-5 text-center text-sm">
            <a
              href={stay.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-leaf"
            >
              Visit the property website ↗
            </a>
          </p>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}
