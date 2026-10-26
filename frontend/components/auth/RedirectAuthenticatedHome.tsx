
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getMeDeduplicated } from "@/lib/get-me-deduplicated";
import {
  consumeHomeNavigationIntent,
  clearHomeNavigationIntent,
} from "@/lib/home-navigation-intent";

export function RedirectAuthenticatedHome() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== "/") {
      clearHomeNavigationIntent();
      return;
    }

    // Logo click করে Home-এ এলে redirect করবে না।
    if (consumeHomeNavigationIntent()) {
      return;
    }

    let active = true;

    async function checkUser() {
      try {
        const response = await getMeDeduplicated();

        if (!active || !response?.success || !response?.data) {
          return;
        }

        const role = response.data.role?.toUpperCase();

        if (role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (role === "USER") {
          router.replace("/dashboard");
        }
      } catch {
        // Not authenticated; remain on Home.
      }
    }

    void checkUser();

    return () => {
      active = false;
    };
  }, [pathname, router]);

  return null;
}

export default RedirectAuthenticatedHome;
