import { Skeleton } from "@/components/ui/States";
import { CustomLoader } from "@/components/ui/CustomLoader";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Top Banner / Hero Skeleton */}
      <div className="relative overflow-hidden bg-white border-b border-line py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="inline-flex justify-center">
              <Skeleton className="h-7 w-48 rounded-full" />
            </div>
            <Skeleton className="h-12 w-full max-w-xl mx-auto rounded-xl" />
            <Skeleton className="h-5 w-4/5 mx-auto rounded-lg" />

            {/* Custom Animated Branded Loader */}
            <div className="pt-8">
              <CustomLoader
                size="lg"
                message="নাগরিক সেবায় তথ্য লোড হচ্ছে..."
                subMessage="সরকারি সেবার সর্বশেষ হালনাগাদ প্রস্তুত করা হচ্ছে"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grid skeletons */}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="space-y-3 mb-8">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                </div>
              </div>
              <div className="mt-6 border-t border-line pt-4 flex justify-between items-center">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
