import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { T } from "@/components/ui/T";

export function ApplicationsCard() {
  return (
    <section aria-labelledby="dash-apps">
      <div className="flex items-center justify-between">
        <h2 id="dash-apps" className="text-lg font-extrabold text-slate-900">
          <T bn="আমার আবেদন" en="My Applications" />
        </h2>
        <Link
          href="/application-tracker"
          className="text-sm font-bold text-brand-700 hover:text-brand-800"
        >
          <T bn="ট্র্যাক করুন" en="Track one" />
        </Link>
      </div>
      <div className="mt-3 rounded-2xl border border-dashed border-line bg-white p-6 text-center">
        <Icon name="ScrollText" className="mx-auto h-8 w-8 text-slate-300" />
        <p className="mt-2 text-sm font-bold text-slate-700">
          <T bn="এখনো কোনো আবেদন নেই" en="No applications yet" />
        </p>
        <p className="mt-1 text-xs text-slate-400">
          <T
            bn="ট্র্যাক করা আবেদন এখানে দেখা যাবে।"
            en="Applications you track will appear here once accounts are connected."
          />
        </p>
      </div>
    </section>
  );
}

export default ApplicationsCard;
