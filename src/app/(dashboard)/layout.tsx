import { Header } from "@/components/layout/Header";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="min-h-screen bg-background">
        {children}
      </main>
    </>
  );
}
