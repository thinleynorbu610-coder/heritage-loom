import { Skeleton } from "@/components/ui/LoadingSkeleton";

export default function ProductLoading() {
  return (
    <div className="container-page py-8" role="status" aria-label="Loading product">
      <Skeleton className="h-4 w-64" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Skeleton className="aspect-[4/5] w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-12 w-4/5" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-4 h-10 w-40" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="mt-4 h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    </div>
  );
}
