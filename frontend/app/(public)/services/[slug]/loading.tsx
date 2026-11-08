import { Skeleton } from "@/components/ui/States";
import { CustomLoader } from "@/components/ui/CustomLoader";

export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header Skeleton */}
      <div className="border-b border-line bg-white py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <Skeleton className="h-4 w-48" />

          <div className="flex items-start gap-4 sm:gap-5 pt-2">
            <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-36 rounded-full" />
              </div>
              <Skeleton className="h-8 w-2/3 sm:w-1/2" />
              <Skeleton className="h-4 w-full max-w-xl" />
              <div className="flex flex-wrap gap-4 pt-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout Skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <CustomLoader
          size="md"
          message="সেবার বিস্তারিত বিবরণ লোড করা হচ্ছে..."
          subMessage="প্রয়োজনীয় কাগজপত্র ও প্রক্রিয়ার ধাপসমূহ আনা হচ্ছে"
          className="mb-8"
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          {/* Main Content Details Skeleton */}
          <div className="space-y-8">
            {/* Documents Section Skeleton */}
            <div className="rounded-2xl border border-line bg-white p-6 space-y-4">
              <Skeleton className="h-6 w-44" />
              <div className="space-y-2.5 pt-2">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            {/* Steps Section Skeleton */}
            <div className="rounded-2xl border border-line bg-white p-6 space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="space-y-4 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2 pt-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar Skeleton */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-5 space-y-4">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-3 pt-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-11 w-full rounded-xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
