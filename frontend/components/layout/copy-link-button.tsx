"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type CopyLinkButtonProps = {
  url?: string;
  iconOnly?: boolean;
};

export default function CopyLinkButton({
  url,
  iconOnly = false,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const link = url ?? window.location.href;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      window.prompt("Copy this link:", link);
    }
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied!" : "Copy link"}
        className="flex size-14 cursor-pointer items-center justify-center rounded-full bg-[#343434] text-white transition hover:bg-[#454545]"
      >
        {copied ? <Check size={26} /> : <Copy size={26} />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Link copied" : "Copy link"}
      className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-brand-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
