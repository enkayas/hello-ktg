import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import { Btn } from "@/components/ui";
import { getActivities, getActivity } from "@/lib/content";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return getActivities().map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const activity = getActivity(id);
  if (!activity) return { title: "Not found" };
  return { title: activity.name, description: activity.description };
}

export default async function ActivityDetailPage({ params }: Props) {
  const { id } = await params;
  const activity = getActivity(id);
  if (!activity) notFound();

  return (
    <>
      <SiteNav variant="solid" />
      <header
        className="relative flex min-h-[36vh] items-end text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.45),rgba(0,0,0,.65)),url('${activity.image}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto w-full max-w-3xl px-5 pb-12 pt-28">
          <p className="text-sm text-white/80">
            <Link href="/things-to-do" className="text-gold-soft">
              Things to do
            </Link>
          </p>
          <span className="mt-2 inline-block text-xs font-bold tracking-wide text-gold-soft">
            {activity.category}
          </span>
          <h1 className="display mt-2 text-4xl font-bold">{activity.name}</h1>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-12">
        <p className="text-lg">{activity.description}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-mist p-4 text-sm">
            <b className="text-forest">Duration</b>
            <p className="text-muted">{activity.duration}</p>
          </div>
          <div className="rounded-xl bg-mist p-4 text-sm">
            <b className="text-forest">Difficulty</b>
            <p className="text-muted">{activity.difficulty}</p>
          </div>
          <div className="rounded-xl bg-mist p-4 text-sm">
            <b className="text-forest">Price</b>
            <p className="text-muted">
              {activity.pricePerPerson > 0
                ? `₹${activity.pricePerPerson.toLocaleString("en-IN")} / person`
                : "On request"}
            </p>
          </div>
        </div>
        <h2 className="display mt-10 text-xl font-semibold text-forest">Itinerary</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted">
          {activity.itinerary.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <h2 className="display mt-8 text-xl font-semibold text-forest">Includes</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-muted">
          {activity.includes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted">
          <b className="text-forest">Provider:</b> {activity.provider} · {activity.contact}
        </p>
        <div className="mt-10">
          <Btn href="/list-your-property">Send an enquiry</Btn>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
