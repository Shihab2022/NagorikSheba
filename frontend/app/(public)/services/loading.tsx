import { Skeleton } from "@/components/ui/States";
import { CustomLoader } from "@/components/ui/CustomLoader";

export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Page Header Skeleton */}
      <div className="border-b border-line bg-white py-10 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 space-y-8">
        {/* Filter and Search Bar Skeleton */}
        <div className="space-y-4 rounded-2xl border border-line bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
          <div className="flex gap-2 overflow-x-auto pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Central Custom Animated Branded Loader */}
        <CustomLoader
          size="md"
          message="সরকারি সেবা তালিকা লোড করা হচ্ছে..."
          subMessage="ব্যাকেন্ড সার্ভার থেকে সরাসরি তথ্য সংগ্রহ করা হচ্ছে"
          className="my-4"
        />

        {/* Grid of Skeleton Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-card"
            >
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>

              <div className="mt-5 border-t border-line pt-3 space-y-3">
                <Skeleton className="h-3 w-1/3" />
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <div className="mt-4 pt-1">
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
