import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";
import { NearMeContent } from "@/components/hk/NearMePage";

export const metadata: Metadata = {
  title: "Near me — stays, food & viewpoints around you",
  description:
    "Location-aware discovery in Kotagiri — sort homestays, cafés and viewpoints by distance from you.",
};

export default function NearMePage() {
  return (
    <HKShell>
      <NearMeContent />
    </HKShell>
  );
}
