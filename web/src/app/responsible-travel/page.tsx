import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";

export const metadata: Metadata = {
  title: "Responsible Travel — HelloKotagiri",
  description: "Travel the Nilgiris with care for forests, communities, and roads.",
};

export default function ResponsibleTravelPage() {
  return (
    <HKShell>
      <article className="mx-auto max-w-2xl px-6 py-12 pb-20">
        <h1 className="text-3xl font-bold text-primary">Responsible Travel</h1>
        <ul className="mt-6 list-inside list-disc space-y-3 text-muted leading-relaxed">
          <li>Carry litter back — shola forests and streams are fragile.</li>
          <li>Ask before photographing residents or entering private estates.</li>
          <li>Stick to marked paths; waterfalls and forest trails can be slippery in rain.</li>
          <li>Avoid night driving on ghat roads when fog is heavy.</li>
          <li>Support local homestays and cafés — your spend stays in the hills.</li>
        </ul>
      </article>
    </HKShell>
  );
}
