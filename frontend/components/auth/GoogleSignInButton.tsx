"use client";

import { useEffect, useRef, useState } from "react";
import { googleAuth } from "@/service/auth";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";

const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

type ErrKey = "notConfigured" | "failed" | "loadFailed";

const ERRORS = {
  bn: {
    notConfigured: "গুগল সাইন-ইন কনফিগার করা নেই।",
    failed: "গুগল সাইন-ইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    loadFailed: "গুগল সাইন-ইন লোড করা যায়নি।",
    unavailable: "গুগল সাইন-ইন অনুপলব্ধ",
  },
  en: {
    notConfigured: "Google sign-in is not configured.",
    failed: "Google sign-in failed. Please try again.",
    loadFailed: "Could not load Google sign-in.",
    unavailable: "Google sign-in unavailable",
  },
};

type GoogleCredentialResponse = { credential?: string };

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts) {
      resolve();
      return;
    }
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GSI_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      return;
    }
    const script = document.createElement("script");
    script.src = GSI_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Identity Services."));
    document.head.appendChild(script);
  });
}

export function GoogleSignInButton({
  onSuccess,
  className,
}: {
  onSuccess?: () => void;
  className?: string;
}) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const s = t(ERRORS);
  const [errorKey, setErrorKey] = useState<ErrKey | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) {
      setErrorKey("notConfigured");
      return;
    }

    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !window.google || !buttonRef.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async (response) => {
            if (!response.credential) {
              setErrorKey("failed");
              return;
            }
            setLoading(true);
            setErrorKey(null);
            setServerError(null);
            const result = await googleAuth(response.credential);
            setLoading(false);
            if (result.success) {
              onSuccess?.();
            } else if (result.message) {
              setServerError(result.message);
            } else {
              setErrorKey("failed");
            }
          },
        });
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: buttonRef.current.offsetWidth || 320,
          text: "continue_with",
          shape: "pill",
        });
      })
      .catch(() => setErrorKey("loadFailed"));

    return () => {
      cancelled = true;
    };
  }, [onSuccess]);

  if (!CLIENT_ID) {
    return (
      <button
        type="button"
        disabled
        className={cn(
          "inline-flex h-12 w-full items-center justify-center rounded-xl border border-line bg-white text-sm font-semibold text-slate-400",
          className,
        )}
      >
        {s.unavailable}
      </button>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        ref={buttonRef}
        className={cn("flex min-h-12 w-full items-center justify-center", loading && "opacity-60")}
        aria-busy={loading}
      />
      {(serverError ?? (errorKey ? s[errorKey] : null)) && (
        <p role="alert" className="mt-2 text-center text-xs font-semibold text-flag-600">
          {serverError ?? (errorKey ? s[errorKey] : null)}
        </p>
      )}
    </div>
  );
}

export default GoogleSignInButton;
