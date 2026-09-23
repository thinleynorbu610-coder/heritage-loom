import { ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "FAQ" };

const faqs = [
  {
    section: "Buying",
    items: [
      ["Are all products made in Bhutan?", "Yes. Every artisan is reviewed before they can sell, and listings must describe how and where the piece was made."],
      ["How much does delivery cost?", "Delivery within Bhutan is Nu. 150, and free for orders over Nu. 5,000. Most orders arrive in 3–7 days, depending on the dzongkhag."],
      ["How can I pay?", "The checkout is designed for mobile banking, debit/credit card via a secure hosted page, and cash on delivery. In this demo, no payment is taken."],
      ["Can I track my order?", "Yes. After ordering you will receive an order number (for example HL-2026-0001). Use it on the Track an Order page or in your account."],
    ],
  },
  {
    section: "Selling",
    items: [
      ["Who can sell on Heritage Loom?", "Individual Bhutanese artisans and craft cooperatives. Choose “Continue as Artisan” when signing up and tell us about your craft."],
      ["How are artisans approved?", "Our team reviews your details and photos of your work and making process. Most applications are reviewed within a few working days."],
      ["Do I need technical skills?", "No. The seller dashboard uses simple forms with clear guidance. You can add a product in a few minutes from your phone."],
    ],
  },
];

export default function FaqPage() {
  return (
    <InfoPage title="Frequently asked questions" eyebrow="Help" intro="Quick answers about buying and selling on Heritage Loom.">
      <div className="grid gap-14 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-muted">Can&apos;t find what you need?</p>
          <Link href="/contact" className="mt-2 inline-block font-semibold text-primary hover:underline">
            Contact our team →
          </Link>
        </div>
        <div className="flex flex-col gap-12">
          {faqs.map((group) => (
            <section key={group.section}>
              <h2 className="font-serif text-3xl font-semibold">{group.section}</h2>
              <div className="mt-5 divide-y divide-border border-y border-border">
                {group.items.map(([q, a]) => (
                  <details key={q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                      {q}
                      <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden />
                    </summary>
                    <p className="mt-3 leading-relaxed text-muted">{a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </InfoPage>
  );
}
