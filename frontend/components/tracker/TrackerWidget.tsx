"use client";
import { useState } from "react";
import { CheckCircle2, Circle, Loader2, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { DemoNote } from "@/components/ui/States";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const STAGES = [
  { bn: "জমা দেওয়া হয়েছে", en: "Submitted" },
  { bn: "পর্যালোচনাধীন", en: "Under Review" },
  { bn: "প্রক্রিয়াধীন", en: "Processing" },
  { bn: "অনুমোদিত", en: "Approved" },
];

const STRINGS = {
  bn: {
    applicationId: "আবেদন আইডি",
    placeholder: "যেমন: NID-2026-XXXXXX",
    tracking: "ট্র্যাক হচ্ছে…",
    trackApplication: "আবেদন ট্র্যাক করুন",
    demoResult: "{id} এর জন্য ডেমো ফলাফল",
    currentStage: "বর্তমান ধাপ (ডেমো)",
    completed: "সম্পন্ন (ডেমো)",
    pending: "অপেক্ষমাণ",
  },
  en: {
    applicationId: "Application ID",
    placeholder: "e.g. NID-2026-XXXXXX",
    tracking: "Tracking...",
    trackApplication: "Track Application",
    demoResult: "Demo result for {id}",
    currentStage: "Current stage (demo)",
    completed: "Completed (demo)",
    pending: "Pending",
  },
};

export function TrackerWidget({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const s = t(STRINGS);
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<number | null>(null);

  function track(e: React.FormEvent) {
    e.preventDefault();
    if (!id.trim()) return;
    setLoading(true);
    setStage(null);
    window.setTimeout(() => {
      setLoading(false);
      const h = id.trim().split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      setStage(h % STAGES.length);
    }, 900);
  }

  return (
    <div className={cn(!compact && "rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7")}>
      <form onSubmit={track} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={compact ? "trk-id-c" : "trk-id"} className="sr-only">{s.applicationId}</label>
        <input id={compact ? "trk-id-c" : "trk-id"} value={id} onChange={(e) => setId(e.target.value)}
          placeholder={s.placeholder} autoComplete="off"
          className="h-12 flex-1 rounded-xl border border-line bg-canvas px-4 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
        <Button type="submit" disabled={loading || !id.trim()} className="h-12 shrink-0">
          {loading ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> {s.tracking}</>) : (<><PackageSearch className="h-4 w-4" aria-hidden="true" /> {s.trackApplication}</>)}
        </Button>
      </form>
      {stage !== null && !loading ? (
        <div className="mt-6" role="status">
          <p className="text-xs font-bold text-slate-500">{s.demoResult.replace("{id}", id.trim())}</p>
          <ol className="mt-3 space-y-0">
            {STAGES.map((stage2, i) => {
              const done = i < stage;
              const current = i === stage;
              return (
                <li key={stage2.en} className="relative flex gap-3.5 pb-6 last:pb-0">
                  {i < STAGES.length - 1 ? (
                    <span className={cn("absolute top-7 left-[13px] h-[calc(100%-24px)] w-0.5", i < stage ? "bg-brand-500" : "bg-slate-200")} aria-hidden="true" />
                  ) : null}
                  <span className={cn("relative z-10 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    done ? "bg-brand-600 text-white" : current ? "bg-brand-100 text-brand-700 ring-2 ring-brand-500" : "bg-slate-100 text-slate-400")}>
                    {done ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : current ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Circle className="h-4 w-4" aria-hidden="true" />}
                  </span>
                  <div className="pt-0.5">
                    <p className={cn("text-sm font-bold", done || current ? "text-slate-900" : "text-slate-400")}>{t(stage2)}</p>
                    <p className="text-xs text-slate-400">{current ? s.currentStage : done ? s.completed : s.pending}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ) : null}
      {!compact ? <div className="mt-6"><DemoNote /></div> : null}
    </div>
  );
}
export default TrackerWidget;
