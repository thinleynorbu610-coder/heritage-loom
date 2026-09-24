import { Compass } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { LinkButton } from "@/components/ui/Button";
import { MotifDivider } from "@/components/ui/Motif";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center bg-motif px-6 py-16 text-center">
      <Logo />
      <MotifDivider className="my-10 w-full max-w-sm" />
      <Compass className="size-10 text-primary" aria-hidden />
      <p className="mt-6 eyebrow">Page not found</p>
      <h1 className="mt-3 font-display text-5xl text-balance sm:text-6xl">This thread seems to have come loose.</h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s get you back to the collection.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <LinkButton href="/" size="lg">Back to home</LinkButton>
        <LinkButton href="/shop" size="lg" variant="outline">Explore the Collection</LinkButton>
      </div>
    </main>
  );
}
