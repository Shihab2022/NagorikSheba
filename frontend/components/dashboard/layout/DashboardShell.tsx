import React from "react";
import { cn } from "@/lib/utils";

export interface DashboardShellProps {
  header?: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

/**
 * Standard responsive dashboard layout shell.
 * Organizes sticky/collapsible sidebar and main content in an industry standard layout.
 */
export function DashboardShell({
  header,
  sidebar,
  children,
  className,
  containerClassName,
}: DashboardShellProps) {
  return (
    <div className={cn("min-h-screen bg-canvas/30", className)}>
      {header}

      <div
        className={cn(
          "mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8",
          containerClassName
        )}
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {sidebar}

          <main className="min-w-0 flex-1 space-y-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default DashboardShell;
