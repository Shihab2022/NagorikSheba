import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FIELD_BASE =
  "w-full rounded-xl border border-line bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 " +
  "transition-all duration-200 hover:border-slate-300 " +
  "focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none " +
  "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(FIELD_BASE, "h-11", className)}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(FIELD_BASE, "min-h-24 py-3 leading-relaxed", className)}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(FIELD_BASE, "h-11 appearance-none pr-9 cursor-pointer", className)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
      </div>
    );
  }
);
Select.displayName = "Select";

/** Label + control wrapper with optional hint and error message. */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={htmlFor} className="block text-xs font-bold text-slate-700 cursor-pointer">
        {label}
        {required ? (
          <span className="ml-1 text-flag-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-xs font-semibold text-flag-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export default Input;
