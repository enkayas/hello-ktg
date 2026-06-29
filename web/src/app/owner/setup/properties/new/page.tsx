import Link from "next/link";
import PropertyForm from "@/components/PropertyForm";

export default function OnboardingNewPropertyPage() {
  return (
    <div>
      <Link href="/owner/setup" className="text-sm font-semibold text-steel">
        ← Back to setup
      </Link>
      <h1 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-primary">
        Register a new homestay
      </h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Tell guests about your stay. You can add photos after saving.
      </p>
      <PropertyForm redirectTo="/owner" />
    </div>
  );
}
