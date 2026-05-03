"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "fr", label: "Français" },
];

export default function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<string>("en");
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const fromCookie = typeof document !== "undefined"
      ? document.cookie.split(";").map(s=>s.trim()).find(s=>s.startsWith("lang="))?.split("=")[1]
      : undefined;
    const fromStorage = typeof window !== "undefined" ? window.localStorage.getItem("lang") || undefined : undefined;
    const initial = fromCookie || fromStorage || "en";
    if (OPTIONS.some(o => o.code === initial)) setLang(initial);
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function setLanguage(code: string) {
    setLang(code);
    try {
      // eslint-disable-next-line react-hooks/immutability
      document.cookie = `lang=${code}; path=/; max-age=${60 * 60 * 24 * 365}`;
      localStorage.setItem("lang", code);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("aalikouch-lang-change", { detail: code }));
      }
    } catch {}
    setOpen(false);
    // Trigger rerender of server components that read cookies
    router.refresh();
  }

  const current = OPTIONS.find(o => o.code === lang) || OPTIONS[0];

  if (!mounted) {
    return (
      <div 
        className="h-9 w-20 sm:w-28 rounded-full border border-gray-200 bg-white/50 animate-pulse" 
        suppressHydrationWarning
      />
    );
  }

  return (
    <div ref={ref} className="relative" suppressHydrationWarning>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-gray-200 bg-white px-2 sm:px-3 py-2 text-sm hover:bg-gray-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.5 0 4.5-4 4.5-9S14.5 3 12 3m0 18c-2.5 0-4.5-4-4.5-9S9.5 3 12 3m-8.5 9h17"/></svg>
        <span className="font-medium">
          <span className="sm:hidden">{lang.toUpperCase()}</span>
          <span className="hidden sm:inline">{lang === "ar" ? "العربية" : current.label}</span>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 9l6 6 6-6"/></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          {OPTIONS.map((o) => (
            <button
              key={o.code}
              onClick={() => setLanguage(o.code)}
              className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${lang === o.code ? "text-[var(--brand)] font-semibold" : "text-gray-900"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
