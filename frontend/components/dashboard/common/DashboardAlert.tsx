"use client";

import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardAlertProps {
  type: "success" | "error";
  message: string;
  onClose?: () => void;
  className?: string;
}

export function DashboardAlert({
  type,
  message,
  onClose,
  className,
}: DashboardAlertProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl p-4 text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-top-1",
        type === "success"
          ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border border-red-200 bg-red-50 text-red-800",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {type === "success" ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
        ) : (
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
        )}
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-4 font-bold text-slate-400 hover:text-slate-700 cursor-pointer"
        >
          ✕
        </button>
      )}
    </div>
  );
}
