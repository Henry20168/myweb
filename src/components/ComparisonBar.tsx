"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export type CompareItem = {
  id: number;
  brand: string;
  model: string;
  image: string;
  price: number;
  type: 'car' | 'motorcycle';
};

export default function ComparisonBar() {
  const [items, setItems] = useState<CompareItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("comparisonList");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(JSON.parse(saved));
      } catch {}
    }

    const handler = (e: Event) => {
      setItems((e as CustomEvent<CompareItem[]>).detail);
    };
    window.addEventListener("aalikouch-compare-change", handler);
    return () => window.removeEventListener("aalikouch-compare-change", handler);
  }, []);

  const removeItem = (id: number) => {
    const newList = items.filter(i => i.id !== id);
    setItems(newList);
    localStorage.setItem("comparisonList", JSON.stringify(newList));
    window.dispatchEvent(new CustomEvent("aalikouch-compare-change", { detail: newList }));
  };

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-20 left-1/2 z-[100] -translate-x-1/2 w-[95%] max-w-2xl px-2 sm:px-0">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-4"
      >
        <div className="flex -space-x-3 sm:-space-x-2 overflow-hidden flex-1">
          {items.map((item) => (
            <div key={item.id} className="relative group flex-shrink-0">
              <div className="h-10 w-14 sm:h-12 sm:w-16 rounded-lg border-2 border-white bg-gray-50 overflow-hidden shadow-sm relative">
                <Image 
                  src={item.image} 
                  alt={item.model} 
                  fill
                  className="object-contain p-1" 
                />
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="absolute -top-1 -right-1 h-5 w-5 bg-red-600 text-white rounded-full flex items-center justify-center scale-100 sm:scale-0 sm:group-hover:scale-100 transition-transform shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3 w-3"><path strokeWidth="3" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/compare"
            className="bg-[var(--brand)] text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/20 hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Compare
          </Link>
          <button
            onClick={() => {
              setItems([]);
              localStorage.removeItem("comparisonList");
              window.dispatchEvent(new CustomEvent("aalikouch-compare-change", { detail: [] }));
            }}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            aria-label="Clear all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5"><path strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
