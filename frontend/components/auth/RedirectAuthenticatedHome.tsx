
"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getMe } from "@/service/auth";

const SESSION_KEY = "nagoriksheba-initial-redirect-done";

export function RedirectAuthenticatedHome() {
  const pathname = usePathname();
  const router = useRouter();
  const checkedRef = useRef(false);

  useEffect(() => {
    if (pathname !== "/" || checkedRef.current) {
      return;
    }

    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") {
        return;
      }

      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      return;
    }

    checkedRef.current = true;
    let cancelled = false;

    async function checkAuthentication() {
      try {
        const response = await getMe();

        if (cancelled || !response.success || !response.data) {
          return;
        }

        const role = response.data.role?.toUpperCase();

        router.replace(
          role === "ADMIN" ? "/admin/dashboard" : "/dashboard",
        );
      } catch {
        // Stay on the Home page when the user is not authenticated.
      }
    }

    void checkAuthentication();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}
