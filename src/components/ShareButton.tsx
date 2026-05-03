"use client";

import { useCallback } from "react";

interface ShareButtonProps {
  brand: string;
  model: string;
}

export default function ShareButton({ brand, model }: ShareButtonProps) {
  const handleShare = useCallback(async () => {
    try {
      const url = typeof window !== "undefined" ? window.location.href : "";
      const title = `${brand} ${model}`;
      const text = `Check out this car: ${brand} ${model}`;

      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      if (navigator.clipboard && url) {
        await navigator.clipboard.writeText(`${title} - ${url}`);
        alert("Link copied to clipboard");
        return;
      }

      if (url) {
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
        window.open(shareUrl, "_blank");
      }
    } catch (err) {
      console.error("Share failed", err);
      alert("Unable to share this car. Please try again.");
    }
  }, [brand, model]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="h-4 w-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 4.5L21 9L15 13.5V11C10.5 11 7.5 12.5 5 16.5C6 12.5 8.5 8.5 15 7.5V4.5Z"
        />
      </svg>
      <span>Share</span>
    </button>
  );
}
