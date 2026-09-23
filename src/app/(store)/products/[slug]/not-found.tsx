import { PackageSearch } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ProductNotFound() {
  return (
    <div className="container-page py-24">
      <EmptyState
        icon={<PackageSearch className="size-6" aria-hidden />}
        title="We couldn’t find that piece"
        description="It may have sold out or been removed by the artisan. Explore the collection for more handmade pieces."
        action={<LinkButton href="/shop">Explore the Collection</LinkButton>}
      />
    </div>
  );
}
