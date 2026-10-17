
"use client";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import {
  Share2,

  MessageCircle,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

type ShareButtonProps = {
  url?: string;
  title?: string;
  text?: string;
};

export default function ShareButton({
  url,
  title = "Check out this website!",
  text = "I thought you might find this interesting.",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return url ?? window.location.href;
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareUrl())}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${getShareUrl()}`)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(title)}`,
  };

  const handleShare = async () => {
    const shareData = {
      title,
      text,
      url: getShareUrl(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
      }
    }

    await navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(
      shareLinks[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        {copied ? <Check size={18} /> : <Share2 size={18} />}
        {copied ? "Link Copied!" : "Share"}
      </button>

      <button
        type="button"
        aria-label="Share on Facebook"
        onClick={() => openShare("facebook")}
        className="rounded-lg border p-2.5 transition hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <FaFacebook size={20} />
      </button>

      <button
        type="button"
        aria-label="Share on LinkedIn"
        onClick={() => openShare("linkedin")}
        className="rounded-lg border p-2.5 transition hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <FaLinkedin size={20} />
      </button>

      <button
        type="button"
        aria-label="Share on WhatsApp"
        onClick={() => openShare("whatsapp")}
        className="rounded-lg border p-2.5 transition hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <MessageCircle size={20} />
      </button>

      <button
        type="button"
        aria-label="Copy link"
        onClick={copyLink}
        className="rounded-lg border p-2.5 transition hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        {copied ? <Check size={20} /> : <Copy size={20} />}
      </button>
    </div>
  );
}
