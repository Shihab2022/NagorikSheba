
"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type CopyLinkButtonProps = {
  url?: string;
};

export default function CopyLinkButton({
  url,
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const link = url ?? window.location.href;

      await navigator.clipboard.writeText(link);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
      {copied ? "Link copied!" : "Copy link"}
    </button>
  );
}
