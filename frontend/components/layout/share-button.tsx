"use client";

import { useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { Share2, MessageCircle } from "lucide-react";

type ShareButtonProps = {
  url?: string;
  title?: string;
  text?: string;
};

export default function ShareButton({
  url,
  //   title = "Check out this website!",
  //   text = "I thought you might find this interesting.",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getShareUrl = () => {
    if (typeof window === "undefined") return url ?? "";

    return url
      ? new URL(url, window.location.origin).href
      : window.location.href;
  };

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      getShareUrl(),
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      getShareUrl(),
    )}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${getShareUrl()}`)}`,
    x: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      getShareUrl(),
    )}&text=${encodeURIComponent}`,
  };

  const openShare = (platform: keyof typeof shareLinks) => {
    window.open(
      shareLinks[platform],
      "_blank",
      "noopener,noreferrer,width=600,height=500",
    );
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Share Button */}
      <button
        type="button"
        aria-label="Share"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((previous) => !previous)}
        className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
      >
        <Share2 size={18} />
        Share
      </button>

      {/* Social Icons: Show Above on Hover */}
      <div
        className={`absolute bottom-full left-1/1 z-50 mb-2 flex -translate-x-1/2 items-center gap-2 transition-all duration-200 ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-2 opacity-0"
        }`}
      >
        {/* Facebook */}
        <button
          type="button"
          aria-label="Share on Facebook"
          title="Facebook"
          onClick={() => openShare("facebook")}
          className="cursor-pointer rounded-lg border bg-white p-2.5 text-white shadow-sm transition "
        >
          <FaFacebook size={20} className="text-[#0A66C2]" />
        </button>

        {/* LinkedIn */}
<button
  type="button"
  aria-label="Share on LinkedIn"
  title="LinkedIn"
  onClick={() => openShare("linkedin")}
  className="cursor-pointer rounded-lg border bg-white p-2.5 text-white shadow-sm transition "
>
  <FaLinkedin size={20} className="text-[#0A66C2]" />
</button>

        {/* WhatsApp */}
        <button
          type="button"
          aria-label="Share on WhatsApp"
          title="WhatsApp"
          onClick={() => openShare("whatsapp")}
          className="cursor-pointer rounded-lg border bg-brand-600 p-2.5 text-white shadow-sm transition hover:bg-brand-700"
        >
    <FaWhatsapp size={20} className="text-[#25D366]" />
        </button>

        {/* X */}
        <button
          type="button"
          aria-label="Share on X"
          title="X"
          onClick={() => openShare("x")}
          className="cursor-pointer rounded-lg border bg-white text-white  px-2.5 py-2 shadow-sm transition "
        >
  <FaTwitter className="text-blue-500" size={20} />
        </button>
      </div>
    </div>
  );
}
