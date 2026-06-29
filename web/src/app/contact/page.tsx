import type { Metadata } from "next";
import HKShell from "@/components/hk/Shell";

export const metadata: Metadata = {
  title: "Contact — HelloKotagiri",
  description: "Get in touch with the HelloKotagiri team.",
};

export default function ContactPage() {
  return (
    <HKShell>
      <article className="mx-auto max-w-2xl px-6 py-12 pb-20">
        <h1 className="text-3xl font-bold text-primary">Contact</h1>
        <div className="mt-6 space-y-4 text-muted leading-relaxed">
          <p>
            Email:{" "}
            <a href="mailto:enkayas@gmail.com" className="font-semibold text-steel hover:text-primary">
              enkayas@gmail.com
            </a>
          </p>
          <p>
            WhatsApp (listings & support):{" "}
            <a
              href="https://wa.me/919962541214"
              className="font-semibold text-steel hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              +91 99625 41214
            </a>
          </p>
          <p>Business console: console.hellokotagiri.com</p>
        </div>
      </article>
    </HKShell>
  );
}
