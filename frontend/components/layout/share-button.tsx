"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Share2, X } from "lucide-react";
import {
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaRedditAlien,
  FaPinterest,
} from "react-icons/fa";
import CopyLinkButton from "./copy-link-button";

type ShareButtonProps = {
  url?: string;
  title?: string;
  text?: string;
};

type SharePlatform =
  | "whatsapp"
  | "facebook"
  | "linkedin"
  | "x"
  | "reddit"
  | "pinterest";

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
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const openShare = (platform: SharePlatform) => {
    const shareUrl = getShareUrl();
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedText = encodeURIComponent(text);

    const shareLinks: Record<SharePlatform, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,

      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,

      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        `${text} ${shareUrl}`,
      )}`,

      x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,

      reddit: `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      pinterest: `https://www.pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodeURIComponent(
        `${title} - ${text}`,
      )}`,
    };

    window.open(
      shareLinks[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
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
          className="absolute bottom-full -left-10 z-50 mb-3 w-[min(380px,calc(100vw-34px))] border border-white/10 bg-brand-600 p-5 text-white shadow-2xl"
        >
          <div className="grid grid-cols-4 gap-x-2 gap-y-2">
            {/* Reddit */}
            <button
              type="button"
              onClick={() => openShare("reddit")}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#FF4500] text-white transition hover:brightness-90">
                <FaRedditAlien size={27} />
              </span>
              <span className="text-xs">Reddit</span>
            </button>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={() => openShare("whatsapp")}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#00C96B] text-white transition hover:brightness-90">
                <FaWhatsapp size={29} />
              </span>
              <span className="text-xs">WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              onClick={() => openShare("facebook")}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#3165A5] text-white transition hover:brightness-90">
                <FaFacebook size={27} />
              </span>
              <span className="text-xs">Facebook</span>
            </button>

            {/* LinkedIn */}
            <button
              type="button"
              onClick={() => openShare("linkedin")}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#0A66C2] text-white transition hover:brightness-90">
                <FaLinkedin size={27} />
              </span>
              <span className="text-xs">LinkedIn</span>
            </button>

            {/* X */}
            <button
              type="button"
              onClick={() => openShare("x")}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-black text-white transition hover:bg-gray-800">
                <X size={29} />
              </span>
              <span className="text-xs">X</span>
            </button>

            {/* Messages */}
            <button
              type="button"
              onClick={shareBySms}
              className="flex cursor-pointer flex-col items-center gap-2"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#343434] text-white transition hover:bg-[#454545]">
                <MessageCircle size={27} />
              </span>
              <span className="text-xs">Messages</span>
            </button>

            {/* Copy Link */}
            <div className="flex flex-col items-center gap-2">
              <CopyLinkButton url={getShareUrl()} iconOnly />
              <span className="text-xs">Copy link</span>
            </div>
            {/* Pinterest */}
<button
  type="button"
  onClick={() => openShare("pinterest")}
  className="flex cursor-pointer flex-col items-center gap-2"
>
  <span className="flex size-14 items-center justify-center rounded-full bg-[#E60023] text-white transition hover:brightness-90">
    <FaPinterest size={27} />
  </span>
  <span className="text-xs">Pinterest</span>
</button>
          </div>
        </div>
      )}
    </div>
  );
}
