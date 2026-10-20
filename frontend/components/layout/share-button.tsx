"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Share2, X, Link as LinkIcon } from "lucide-react";
import { FaFacebook, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import CopyLinkButton from "./copy-link-button";

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
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const getShareUrl = () => {
    if (typeof window === "undefined") return url ?? "";

    return url
      ? new URL(url, window.location.origin).href
      : window.location.href;
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const openShare = (platform: "whatsapp" | "facebook" | "linkedin" | "x") => {
    const shareUrl = getShareUrl();
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);

    const shareLinks = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        `${text} ${shareUrl}`,
      )}`,
      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    };

    window.open(
      shareLinks[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
  };

  const nativeShare = async () => {
    const shareData = {
      title,
      text,
      url: getShareUrl(),
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled the share dialog.
      }
    } else {
      try {
        await navigator.clipboard.writeText(getShareUrl());
      } catch {
        window.prompt("Copy this link:", getShareUrl());
      }
    }
  };

  const shareBySms = () => {
    const message = encodeURIComponent(`${text} ${getShareUrl()}`);
    window.location.href = `sms:?body=${message}`;
  };

  return (
    <div className="relative inline-block" ref={popupRef}>
      <button
        type="button"
        aria-label="Share"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
      >
        <Share2 size={18} />
        Share
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Share this page"
          className="absolute bottom-full left-0 z-50 mb-3 w-[min(440px,calc(100vw-32px))] rounded-2xl border border-white/10 bg-brand-600 p-5 text-white shadow-2xl"
        >
          <div className="grid grid-cols-4 gap-x-3 gap-y-4">
            <button
              type="button"
              onClick={() => openShare("linkedin")}
              className="flex flex-col items-center gap-2"
            >
              <span className="cursor-pointer flex size-14 items-center justify-center rounded-full bg-[#0A66C2] text-white transition hover:brightness-90">
                <FaLinkedin size={27} />
              </span>
              <span className="text-xs">LinkedIn</span>
            </button>

            <button
              type="button"
              onClick={() => openShare("whatsapp")}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#00C96B] text-white transition hover:brightness-90">
                <FaWhatsapp size={29} />
              </span>
              <span className="text-xs">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => openShare("facebook")}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#3165A5] text-white transition hover:brightness-90">
                <FaFacebook size={27} />
              </span>
              <span className="text-xs">Facebook</span>
            </button>
            <button
              type="button"
              onClick={() => openShare("linkedin")}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#0A66C2] text-white transition hover:brightness-90">
                <FaLinkedin size={27} />
              </span>
              <span className="text-xs">LinkedIn</span>
            </button>

            <button
              type="button"
              onClick={() => openShare("x")}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800">
                <X size={29} />
              </span>
              <span className="text-xs">X</span>
            </button>

            <button
              type="button"
              onClick={shareBySms}
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#343434] text-white transition hover:bg-[#454545]">
                <MessageCircle size={27} />
              </span>
              <span className="text-xs">Messages</span>
            </button>

            <div className="flex flex-col items-center gap-2">
              <CopyLinkButton url={getShareUrl()} iconOnly />
              <span className="text-xs">Copy link</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
