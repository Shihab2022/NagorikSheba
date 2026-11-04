
"use client";

import HomeButton from "@/components/layout/HomeButton";
import { markHomeNavigationIntent } from "@/lib/home-navigation-intent";

export function HomeButtonAction() {
  return (
    <HomeButton
      tone="light"
      href="/"
      onClick={markHomeNavigationIntent}
    />
  );
}
