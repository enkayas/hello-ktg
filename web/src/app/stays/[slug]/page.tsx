import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HKDetailShell from "@/components/hk/DetailShell";
import StayDetailClient from "@/components/StayDetailClient";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getPublishedStays, getStayBySlug } from "@/lib/queries";

export const revalidate = 300;
export const dynamicParams = true;

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
    <HKDetailShell>
      <div className="mx-auto w-full max-w-3xl px-5 py-8 md:py-10">
        <div className="mb-4 flex justify-end">
          <LanguageSwitcher />
        </div>
        <StayDetailClient stay={stay} />
      </div>
    </HKDetailShell>
  );
}
