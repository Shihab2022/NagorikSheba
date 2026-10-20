import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

/** Ordered "How to Apply" steps with numbered badges. */
export function ServiceSteps({ steps }: { steps: string[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((step, i) => (
        <li key={step} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",
                i === 0
                  ? "bg-brand-600 text-white"
                  : "bg-brand-50 text-brand-700",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            {i < steps.length - 1 ? (
              <span aria-hidden="true" className="mt-1 w-0.5 flex-1 bg-line" />
            ) : null}
          </div>
          <div className="pb-1">
            <p className="text-sm font-semibold leading-6 text-slate-700">
              {step}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Section wrapper used across the service detail page. */
export function DetailSection({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28">
      <h2
        id={`${id}-title`}
        className="flex items-center gap-2.5 text-lg font-extrabold text-slate-900"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          {icon ?? <ClipboardList className="h-4 w-4" aria-hidden="true" />}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default ServiceSteps;
