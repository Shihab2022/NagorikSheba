import { CustomLoader } from "@/components/ui/CustomLoader";
import { Skeleton } from "@/components/ui/States";

export default function CategoryNoticesLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <CustomLoader
        size="md"
        message="Loading category notices..."
        subMessage="Fetching latest official announcements from database"
      />
      <div className="mt-8 space-y-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-line bg-white p-5 shadow-card space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
