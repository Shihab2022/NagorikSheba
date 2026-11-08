import Link from "next/link";
import { Compass, FileQuestion, Home, Search } from "lucide-react";
import { T } from "@/components/ui/T";

export default function ServiceNotFound() {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8 bg-gradient-to-b from-canvas/40 via-white to-canvas/20">
      <div className="mx-auto w-full max-w-xl text-center">
        {/* Visual Badge & Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 border border-amber-200 text-amber-600 shadow-sm mb-6">
          <FileQuestion className="h-10 w-10" aria-hidden="true" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider mb-3">
          404 · Service Not Found
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          <T bn="সেবাটি খুঁজে পাওয়া যায়নি" en="Service Not Found" />
        </h1>

        <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
          <T
            bn="দুঃখিত, আপনি যে সরকারি সেবাটি খুঁজছেন তা বর্তমানে সার্ভারে উপলব্ধ নেই অথবা লিংকটি ভুল হতে পারে।"
            en="Sorry, the service you are looking for is currently unavailable in the database or the link may be mistyped."
          />
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-brand-700 transition-all hover:shadow"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            <T bn="সকল সেবা ব্রাউজ করুন" en="Browse All Services" />
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <T bn="সেবা খুঁজুন" en="Search Services" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Home className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <T bn="হোমপেজ" en="Home" />
          </Link>
        </div>
      </div>
    </div>
  );
}
