import type { ReactNode } from "react";

export default function NoTranslate({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`notranslate ${className || ""}`.trim()} translate="no">
      {children}
    </span>
  );
}

export { NoTranslate };
