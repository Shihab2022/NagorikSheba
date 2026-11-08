"use client";

import type { ReactNode } from "react";

export function T({ bn: _bn, en }: { bn?: string; en: ReactNode }) {
  return <span>{en}</span>;
}

export default T;
