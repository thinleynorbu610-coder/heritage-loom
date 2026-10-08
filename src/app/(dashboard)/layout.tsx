export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <main id="main" className="min-h-screen bg-background">
      {children}
    </main>
  );
}
