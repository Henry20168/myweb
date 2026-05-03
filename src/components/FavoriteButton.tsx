"use client";

import { useEffect, useState } from "react";

const KEY = "favCars";

export default function FavoriteButton({
  id,
  onChange,
  className,
  inactiveClassName,
}: {
  id: number;
  onChange?: (isFav: boolean) => void;
  className?: string;
  inactiveClassName?: string;
}) {
  const [isFav, setIsFav] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    try {
      const raw = window.localStorage.getItem(KEY);
      const arr: number[] = raw ? JSON.parse(raw) : [];
      setIsFav(arr.includes(id));
    } catch {
      setIsFav(false);
    }
  }, [id]);

  function toggle() {
    if (!isMounted) return;
    try {
      const raw = localStorage.getItem(KEY);
      const arr: number[] = raw ? JSON.parse(raw) : [];
      const idx = arr.indexOf(id);

      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(id);

      localStorage.setItem(KEY, JSON.stringify(arr));

      const next = !isFav;
      setIsFav(next);
      onChange?.(next);
    } catch {}
  }

  if (!isMounted) {
    return (
      <button
        className={
          (className ? className + " " : "") +
          (inactiveClassName || "text-white/70 hover:text-white")
        }
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 21s-6.716-4.547-9.192-7.023a5.5 5.5 0 1 1 7.778-7.778L12 6.613l1.414-1.414a5.5 5.5 0 0 1 7.778 7.778C18.716 16.453 12 21 12 21Z"
            strokeWidth="1.5"
          />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isFav ? "remove from favorites" : "add to favorites"}
      className={
        (className ? className + " " : "") +
        (isFav
          ? "text-red-500"
          : inactiveClassName || "text-white/70 hover:text-white")
      }
    >
      {isFav ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            d="M12 21s-6.716-4.547-9.192-7.023a5.5 5.5 0 1 1 7.778-7.778L12 6.613l1.414-1.414a5.5 5.5 0 0 1 7.778 7.778C18.716 16.453 12 21 12 21Z"
            strokeWidth="1.5"
          />
        </svg>
      )}
    </button>
  );
}