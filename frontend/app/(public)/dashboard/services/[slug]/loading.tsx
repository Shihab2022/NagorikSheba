import { CustomLoader } from "@/components/ui/CustomLoader";
import { Skeleton } from "@/components/ui/States";

export default function DashboardServiceDetailLoading() {
  return (
    <div className="w-full space-y-6">
      <CustomLoader
        size="md"
        message="Loading service details..."
        subMessage="Fetching requirements, procedure steps, and fees from database"
      />

      {/* Hero Skeleton */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card space-y-4">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-7 w-2/3 rounded-lg" />
            <Skeleton className="h-4 w-full rounded" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
          <Skeleton className="h-14 rounded-xl" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-56 rounded-2xl" />
      </div>
    </div>
  );
}
