"use client";

import { useState, useEffect } from "react";

export default function FilterDrawer({ title = "Filter & Sort", children }: { title?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onEsc(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  return (
    <>
      <button
        type="button"
        className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm hover:bg-gray-50"
        onClick={() => setOpen(true)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M7 12h10M10 18h4"/></svg>
        <span>{title}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="text-base font-semibold text-gray-900">{title}</div>
              <button aria-label="Close" className="rounded-full border border-gray-200 p-1 hover:bg-gray-50" onClick={() => setOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 6l12 12M18 6l-12 12"/></svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
