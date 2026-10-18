import Link from "next/link";
import { Settings, ArrowRight } from "lucide-react";
import { T } from "@/components/ui/T";

export interface AdminModulesGridProps {
  servicesCount: number;
  categoriesCount: number;
  officesCount: number;
  noticesCount: number;
}

export function AdminModulesGrid({
  servicesCount,
  categoriesCount,
  officesCount,
  noticesCount,
}: AdminModulesGridProps) {
  const modules = [
    {
      title: { bn: "সেবা পরিচালনা", en: "Services Management" },
      description: {
        bn: "সরকারি সেবাসমূহের তথ্য, ফি ও ধাপ হালনাগাদ করুন।",
        en: "Review, update and verify citizen government services.",
      },
      countBadge: {
        bn: `${servicesCount} টি সেবা প্রস্তুত`,
        en: `${servicesCount} services available`,
      },
      href: "/admin/services",
    },
    {
      title: { bn: "ক্যাটাগরি নিয়ন্ত্রণ", en: "Categories Overview" },
      description: {
        bn: "সেবা শ্রেণীকরণ ও ক্যাটাগরি তালিকা পরিচালনা।",
        en: "Organize services into citizen-friendly taxonomy categories.",
      },
      countBadge: {
        bn: `${categoriesCount} টি সক্রিয় ক্যাটাগরি`,
        en: `${categoriesCount} active categories`,
      },
      href: "/admin/categories",
    },
    {
      title: { bn: "অফিস ডিরেক্টরি", en: "Office Directory" },
      description: {
        bn: "মন্ত্রণালয়, অধিদপ্তর ও আঞ্চলিক অফিসসমূহ।",
        en: "Manage ministry, department and regional office directory.",
      },
      countBadge: {
        bn: `${officesCount} টি অফিস তালিকাভুক্ত`,
        en: `${officesCount} offices listed`,
      },
      href: "/government-offices",
    },
    {
      title: { bn: "নোটিশ বোর্ড", en: "Notice Board" },
      description: {
        bn: "নাগরিকদের জন্য সরকারি পরিপত্র ও নোটিশ প্রকাশনা।",
        en: "Broadcast official circulars, updates and alerts.",
      },
      countBadge: {
        bn: `${noticesCount} টি নোটিশ সক্রিয়`,
        en: `${noticesCount} active notices`,
      },
      href: "/notices",
    },
  ];

  return (
    <section className="rounded-2xl border border-line bg-white p-6 shadow-card">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-extrabold text-slate-900">
            <T bn="প্রশাসনিক মডিউল" en="Administrative Modules" />
          </h2>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          <T bn="সিস্টেম কন্ট্রোল" en="System Control" />
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {modules.map((m, i) => (
          <Link
            key={i}
            href={m.href}
            className="group flex flex-col justify-between rounded-xl border border-line bg-canvas p-4 transition-all hover:border-brand-300 hover:bg-white"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 group-hover:text-brand-700">
                  <T bn={m.title.bn} en={m.title.en} />
                </h3>
                <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                <T bn={m.description.bn} en={m.description.en} />
              </p>
            </div>
            <span className="mt-3 text-[11px] font-semibold text-brand-700">
              <T bn={m.countBadge.bn} en={m.countBadge.en} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default AdminModulesGrid;
