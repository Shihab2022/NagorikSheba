"use client";

import { useEffect, useRef, useState } from "react";
import { googleAuth } from "@/service/auth";
import { cn } from "@/lib/utils";

const GSI_SRC = "https://accounts.google.com/gsi/client";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) {
      setError("Google sign-in is not configured.");
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
              setError("Google sign-in failed. Please try again.");
              return;
            }
            setLoading(true);
            setError(null);
            const result = await googleAuth(response.credential);
            setLoading(false);
            if (result.success) {
              onSuccess?.();
            } else {
              setError(result.message || "Google sign-in failed. Please try again.");
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
      .catch(() => setError("Could not load Google sign-in."));

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
        Google sign-in unavailable
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
      {error && (
        <p role="alert" className="mt-2 text-center text-xs font-semibold text-flag-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default GoogleSignInButton;
