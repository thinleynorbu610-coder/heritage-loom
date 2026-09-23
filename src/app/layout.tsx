import type { Metadata, Viewport } from "next";
import { Providers } from "@/context/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Heritage Loom — Crafted in Bhutan",
    template: "%s · Heritage Loom",
  },
  description:
    "Connecting Bhutanese artisans with customers through culture and commerce. Discover handwoven textiles, gho & kira, jewellery, paintings and woodwork — with the story behind every piece.",
  applicationName: "Heritage Loom",
};

export const viewport: Viewport = {
  themeColor: "#1ba3e0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[200] rounded-md bg-ink px-4 py-2 font-semibold text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
