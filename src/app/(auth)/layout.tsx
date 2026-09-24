import { Header } from "@/components/layout/Header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main">{children}</main>
    </>
  );
}
