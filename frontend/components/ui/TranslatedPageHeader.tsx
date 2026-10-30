"use client";

import type { ReactNode } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useTranslation, type Dict } from "@/lib/i18n";

/**
 * Server-page friendly PageHeader: accepts bilingual strings so pages that
 * export `metadata` (and must stay server components) can still translate
 * their title, description and breadcrumb trail.
 */
export function TranslatedPageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  containerClassName,
}: {
  title: Dict<string>;
  description?: Dict<string>;
  breadcrumbs?: { label: Dict<string>; href?: string }[];
  actions?: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const { t } = useTranslation();
  return (
    <PageHeader
      title={t(title)}
      description={description ? t(description) : undefined}
      breadcrumbs={breadcrumbs?.map((crumb) => ({ label: t(crumb.label), href: crumb.href }))}
      actions={actions}
      className={className}
      containerClassName={containerClassName}
    />
  );
}

export default TranslatedPageHeader;
