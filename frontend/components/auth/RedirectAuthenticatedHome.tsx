
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

import { getMe } from "@/service/auth";

const HOME_INTENT_KEY = "nagoriksheba-user-chose-home";

export function RedirectAuthenticatedHome() {
  const pathname = usePathname();
  const router = useRouter();
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (pathname !== "/") {
      hasCheckedRef.current = false;
      return;
    }

    if (hasCheckedRef.current) {
      return;
    }

    // Respect the user's intentional navigation to Home.
    try {
      if (sessionStorage.getItem(HOME_INTENT_KEY) === "true") {
        sessionStorage.removeItem(HOME_INTENT_KEY);
        hasCheckedRef.current = true;
        return;
      }
    } catch {
      // Continue with authentication check if storage is unavailable.
    }

    hasCheckedRef.current = true;
    let isActive = true;

    const checkAuthentication = async () => {
      try {
        const response = await getMe();

        if (!isActive || !response.success || !response.data) {
          return;
        }

        const role = response.data.role?.toUpperCase();

        if (role === "ADMIN") {
          router.replace("/admin/dashboard");
          return;
        }

        router.replace("/dashboard");
      } catch {
        // Unauthenticated users remain on the Home page.
      }
    };

    void checkAuthentication();

    return () => {
      isActive = false;
    };
  }, [pathname, router]);

  return null;
}
