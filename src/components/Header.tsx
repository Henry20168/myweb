"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "./CurrencySwitcher";

type SearchItem = {
  id: number;
  brand: string | null;
  model: string | null;
  year: number | null;
  images?: { url: string | null }[];
};

export default function Header({ dict }: { dict: any }) {
  const [open, setOpen] = useState(false);
  const close = () => { setOpen(false); };

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setSearchLoading(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search-cars?q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setResults(data.items || []);
      } finally {
        if (!cancelled) setSearchLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query]);

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border-b border-black/5 py-2" 
          : "bg-white border-b border-transparent py-5"
      }`} 
      suppressHydrationWarning
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between gap-8" suppressHydrationWarning>
        {/* Logo */}
        <Link href="/" className="shrink-0 flex items-center gap-3 group" aria-label="aalikouch car" suppressHydrationWarning>
          <div className="relative h-10 md:h-12 w-24 md:w-32 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2">
            <Image
              src="/aalikouch-logo.png"
              alt="aalikouch car logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop nav + search */}
        <div className="hidden lg:flex flex-1 items-center justify-center gap-10" suppressHydrationWarning>
          <nav className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-500" suppressHydrationWarning>
            <Link href="/cars" className="hover:text-gray-900 transition-colors relative group/link" suppressHydrationWarning>
              {dict?.nav?.cars ?? 'Cars'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand)] transition-all duration-300 group-hover/link:w-full" />
            </Link>
            <Link href="/motorcycles" className="hover:text-gray-900 transition-colors relative group/link" suppressHydrationWarning>
              {dict?.nav?.motorcycles ?? 'Motorcycles'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand)] transition-all duration-300 group-hover/link:w-full" />
            </Link>
            <Link href="/about" className="hover:text-gray-900 transition-colors relative group/link" suppressHydrationWarning>
              {dict?.nav?.about ?? 'About Us'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand)] transition-all duration-300 group-hover/link:w-full" />
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors relative group/link" suppressHydrationWarning>
              {dict?.nav?.contact ?? 'Contact'}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--brand)] transition-all duration-300 group-hover/link:w-full" />
            </Link>
          </nav>
          
          <div className="relative w-full max-w-xs" suppressHydrationWarning>
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              placeholder={dict?.search?.placeholder ?? 'Search fleet...'}
              className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 pl-11 pr-5 py-2.5 text-xs font-bold text-gray-800 placeholder-gray-400 outline-none focus:bg-white focus:ring-4 focus:ring-gray-900/5 focus:border-gray-200 transition-all"
              suppressHydrationWarning
            />
            {/* Search results remains the same but with better styling classes */}
            {searchOpen && query.trim().length >= 1 && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-gray-200 bg-white shadow-xl max-h-80 overflow-auto z-40">
                {searchLoading && (
                  <div className="px-4 py-3 text-sm text-gray-500">{dict.header.searching}</div>
                )}
                {!searchLoading && results.length > 0 && (
                  <div className="py-2">
                    {results.map((item) => {
                      const img = item.images?.[0]?.url || "";
                      return (
                        <Link
                          key={item.id}
                          href={`/cars/${item.id}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-sm text-gray-900"
                          onClick={() => setSearchOpen(false)}
                        >
                          <div className="h-10 w-16 rounded-md bg-gray-50 flex items-center justify-center overflow-hidden relative">
                            {img ? (
                              <Image 
                                src={img} 
                                alt={`${item.brand} ${item.model}`} 
                                fill
                                className="object-contain" 
                              />
                            ) : (
                              <span className="text-xs text-gray-400">{dict.header.noImage}</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{item.brand} {item.model}</div>
                            <div className="text-xs text-gray-500 truncate">{item.year ? `${item.brand} • ${item.year}` : item.brand}</div>
                          </div>
                          <span className="text-gray-400" aria-hidden>↗</span>
                        </Link>
                      );
                    })}
                    <div className="mt-1 border-t border-gray-100">
                      <Link
                        href={`/cars?q=${encodeURIComponent(query.trim())}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-[var(--brand)] hover:bg-gray-50"
                        onClick={() => setSearchOpen(false)}
                      >
                        <span>{dict.header.viewAllResults.replace('{query}', query.trim())}</span>
                      </Link>
                    </div>
                  </div>
                )}
                {!searchLoading && query.trim().length >= 2 && results.length === 0 && (
                  <div className="px-6 py-6 text-center text-sm text-gray-600">
                    <div className="mb-2 flex justify-center">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        🚗
                      </span>
                    </div>
                    <div className="font-semibold">{dict.header.noResults}</div>
                    <div className="mt-1 text-xs text-gray-500">{dict.header.searchHint}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right icons */}
        <div className="ml-auto flex items-center gap-2 text-gray-700" suppressHydrationWarning>
          <CurrencySwitcher />
          <LanguageSwitcher />
          <Link href="/favorites" aria-label="Favorites" className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 8.25c0-2.347-1.903-4.25-4.25-4.25-1.467 0-2.766.73-3.5 1.845A4.25 4.25 0 006.5 4c-2.347 0-4.25 1.903-4.25 4.25 0 7 9.75 11.5 9.75 11.5s9.75-4.5 9.75-11.5z"/></svg>
          </Link>
          <Link href="/cart" aria-label="Cart" className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 3.75h2.69l1.5 9a2.25 2.25 0 002.23 1.92h7.86a2.25 2.25 0 002.18-1.68l1.52-6.07H6.56"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 21a.75.75 0 110-1.5.75.75 0 010 1.5zm8.25 0a.75.75 0 110-1.5.75.75 0 010 1.5z"/></svg>
          </Link>
          {/* Mobile: cart icon */}
          <Link href="/cart" aria-label="Cart" className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.25 3.75h2.69l1.5 9a2.25 2.25 0 002.23 1.92h7.86a2.25 2.25 0 002.18-1.68l1.52-6.07H6.56"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 21a.75.75 0 110-1.5.75.75 0 010 1.5zm8.25 0a.75.75 0 110-1.5.75.75 0 010 1.5z"/></svg>
          </Link>
          {/* Mobile hamburger / close */}
          <button aria-label={open? 'Close menu':'Menu'} onClick={()=>setOpen(v=>!v)} className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700">
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth="1.5" d="M6 6l12 12M18 6L6 18"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {open && (
        <div className="fixed inset-x-0 top-[72px] z-40 md:hidden h-[calc(100vh-72px)] bg-black/40 backdrop-blur-md transition-all duration-300" onClick={close}>
          <div className="mx-auto max-w-6xl px-4 pt-4" onClick={e => e.stopPropagation()}>
            <div className="rounded-[2rem] border border-white/20 bg-white/95 backdrop-blur-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto animate-fade-in-up">
              {/* Enhanced Search */}
              <form action="/cars" method="get" className="relative mb-8">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </div>
                <input 
                  name="q" 
                  placeholder={dict?.search?.placeholder ?? 'Search fleet...'} 
                  className="w-full rounded-2xl border border-gray-100 bg-gray-50/50 pl-12 pr-4 py-3.5 text-sm font-bold text-gray-900 placeholder-gray-400 outline-none focus:bg-white focus:ring-4 focus:ring-red-600/5 focus:border-red-200 transition-all shadow-inner" 
                />
              </form>

              {/* Navigation with Icons */}
              <nav className="grid gap-2">
                <Link href="/" onClick={close} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all group">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-red-100 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">{dict?.nav?.home ?? 'Home'}</span>
                </Link>
                <Link href="/cars" onClick={close} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all group">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-red-100 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="10" x="3" y="11" rx="2"/><path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/><circle cx="7" cy="16" r="1"/><circle cx="17" cy="16" r="1"/></svg>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">{dict?.nav?.cars ?? 'Cars'}</span>
                </Link>
                <Link href="/motorcycles" onClick={close} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all group">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-red-100 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="18" r="3"/><circle cx="19" cy="18" r="3"/><path d="M12 18V7l7-2 2 4h-2"/><path d="M7 8l5-2 5 2"/><path d="M12 18h5l2-4"/></svg>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">{dict?.nav?.motorcycles ?? 'Motorcycles'}</span>
                </Link>
                <Link href="/about" onClick={close} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all group">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-red-100 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">{dict?.nav?.about ?? 'About Us'}</span>
                </Link>
                <Link href="/contact" onClick={close} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 text-gray-700 hover:text-red-600 transition-all group">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-50 group-hover:bg-red-100 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.74 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <span className="text-sm font-black uppercase tracking-widest">{dict?.nav?.contact ?? 'Contact'}</span>
                </Link>
              </nav>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <Link 
                    href="/favorites" 
                    onClick={close} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-gray-50 hover:bg-red-50 hover:text-red-600 transition-all group"
                  >
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white group-hover:bg-red-100 shadow-sm transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{dict?.nav?.favorites ?? 'Favorites'}</span>
                  </Link>
                  <Link 
                    href="/cart" 
                    onClick={close} 
                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-gray-900 text-white hover:bg-black transition-all shadow-lg shadow-gray-200"
                  >
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{dict?.nav?.cart ?? 'Command now'}</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
