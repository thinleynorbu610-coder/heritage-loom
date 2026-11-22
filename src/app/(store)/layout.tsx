import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { GuestAccessGate } from "@/components/layout/GuestAccessGate";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <GuestAccessGate>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </GuestAccessGate>
    </>
  );
}
