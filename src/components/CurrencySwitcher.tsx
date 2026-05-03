"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CurrencyCode } from "@/lib/util";

const OPTIONS: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "MAD", label: "Moroccan Dirham", symbol: "MAD" },
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "USD", label: "US Dollar", symbol: "$" },
];

export default function CurrencySwitcher() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>("MAD");
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const fromCookie = typeof document !== "undefined"
      ? document.cookie.split(";").map(s=>s.trim()).find(s=>s.startsWith("currency="))?.split("=")[1]
      : undefined;
    const fromStorage = typeof window !== "undefined" ? window.localStorage.getItem("currency") || undefined : undefined;
    const initial = fromCookie || fromStorage || "MAD";
    if (OPTIONS.some(o => o.code === initial)) setCurrency(initial as CurrencyCode);
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function setCurrencyCode(code: CurrencyCode) {
    setCurrency(code);
    try {
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `currency=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
      localStorage.setItem("currency", code);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("aalikouch-currency-change", { detail: code }));
      }
    } catch {}
    setOpen(false);
    router.refresh();
  }

  const current = OPTIONS.find(o => o.code === currency) || OPTIONS[0];

  if (!mounted) {
    return (
      <div className="h-9 w-24 rounded-full border border-gray-200 bg-white/50 animate-pulse" suppressHydrationWarning />
    );
  }

  return (
    <div ref={ref} className="relative" suppressHydrationWarning>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
      >
        <span className="font-semibold text-gray-700">{current.symbol}</span>
        <span className="hidden sm:inline">{current.code}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg z-50">
          {OPTIONS.map((o) => (
            <button
              key={o.code}
              onClick={() => setCurrencyCode(o.code)}
              className={`flex items-center justify-between w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${currency === o.code ? "text-[var(--brand)] font-semibold" : "text-gray-900"}`}
            >
              <span>{o.label}</span>
              <span className="text-gray-400">{o.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
