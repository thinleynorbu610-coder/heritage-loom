import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/layout/ContactForm";
import { InfoPage } from "@/components/layout/InfoPage";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <InfoPage title="Contact us" eyebrow="We're here to help" intro="Questions about an order, a commission or selling on Heritage Loom? Send us a message.">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <ul className="flex flex-col gap-6">
          {[
            { icon: Mail, label: "Email", value: "hello@heritageloom.bt (placeholder)" },
            { icon: Phone, label: "Phone", value: "+975 00 000 000 (placeholder)" },
            { icon: MapPin, label: "Based in", value: "Thimphu, Bhutan" },
            { icon: Clock, label: "Hours", value: "Mon–Fri, 9:00–17:00 BTT" },
          ].map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-start gap-4">
              <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm text-muted">{label}</span>
                <span className="font-semibold">{value}</span>
              </span>
            </li>
          ))}
        </ul>
        <ContactForm />
      </div>
    </InfoPage>
  );
}
