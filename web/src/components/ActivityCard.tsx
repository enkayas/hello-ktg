import Link from "next/link";
import type { Activity } from "@/lib/content";

export default function ActivityCard({ activity }: { activity: Activity }) {
  const price =
    activity.pricePerPerson > 0
      ? `From ₹${activity.pricePerPerson.toLocaleString("en-IN")}`
      : "Guided";

  return (
    <article className="group flex flex-col overflow-hidden rounded-[20px] border border-forest/5 bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      <div
        className="h-44 bg-cover bg-center transition duration-500 group-hover:scale-105"
        style={{
          backgroundImage: `url('${activity.image}')`,
          backgroundColor: "#7fa6cc",
        }}
      />
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[10px] font-bold tracking-wide text-leaf">
          {activity.category}
        </span>
        <h3 className="display mt-1 text-lg font-semibold text-forest">
          {activity.name}
        </h3>
        <p className="mt-2 flex-1 text-sm text-muted">{activity.description}</p>
        <Link
          href={`/things-to-do/${activity.id}`}
          className="mt-3 text-sm font-semibold text-leaf no-underline hover:text-pine"
        >
          {price} →
        </Link>
      </div>
    </article>
  );
}
