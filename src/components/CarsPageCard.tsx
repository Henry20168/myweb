"use client";

import { formatMAD } from "@/lib/util";
import { useCurrency } from "@/hooks/useCurrency";
import FavoriteButton from "@/components/FavoriteButton";
import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import Image from "next/image";

export type Car = {
  id: number;
  brand: string;
  model: string;
  category: string;
  transmission: string;
  fuel: string;
  seats: number | null;
  dailyPrice: number;
  year: number | null;
  images: { url: string; isPrimary: boolean }[];
};

export default function CarsPageCard({ 
  c, 
  idx, 
  rentNowButton 
}: { 
  c: Car; 
  idx: number; 
  rentNowButton: string;
}) {
  useCurrency();
  const [ui, setUi] = useState(() => {
    const { dict } = getDictionary('en');
    return {
      fuelPetrol: dict.cars?.fuelPetrol ?? 'Petrol',
      fuelDiesel: dict.cars?.fuelDiesel ?? 'Diesel',
      fuelElectric: dict.cars?.fuelElectric ?? 'Electric',
      fuelHybrid: dict.cars?.fuelHybrid ?? 'Hybrid',
      transmissionManual: dict.cars?.transmissionManual ?? 'Manual',
      transmissionAutomatic: dict.cars?.transmissionAutomatic ?? 'Automatic',
    };
  });

  useEffect(() => {
    function syncFromLang(code?: string) {
      try {
        const langCode = code
          || (typeof document !== 'undefined'
              ? document.cookie.split(';').map(s => s.trim()).find(s => s.startsWith('lang='))?.split('=')[1]
              : undefined)
          || (typeof window !== 'undefined' ? window.localStorage.getItem('lang') || undefined : undefined)
          || 'en';
        const { dict } = getDictionary(langCode);
        setUi({
          fuelPetrol: dict.cars?.fuelPetrol ?? 'Petrol',
          fuelDiesel: dict.cars?.fuelDiesel ?? 'Diesel',
          fuelElectric: dict.cars?.fuelElectric ?? 'Electric',
          fuelHybrid: dict.cars?.fuelHybrid ?? 'Hybrid',
          transmissionManual: dict.cars?.transmissionManual ?? 'Manual',
          transmissionAutomatic: dict.cars?.transmissionAutomatic ?? 'Automatic',
        });
      } catch {
        // ignore
      }
    }

    syncFromLang();

    if (typeof window !== 'undefined') {
      const handler = (ev: Event) => {
        const detail = (ev as CustomEvent<string>).detail;
        syncFromLang(detail);
      };
      window.addEventListener('aalikouch-lang-change', handler as EventListener);
      return () => window.removeEventListener('aalikouch-lang-change', handler as EventListener);
    }
  }, []);

  const fuelLabel = (fuel: string | null | undefined) => {
    const v = (fuel || '').toLowerCase();
    if (v === 'petrol' || v === 'essence') return ui.fuelPetrol;
    if (v === 'diesel') return ui.fuelDiesel;
    if (v === 'electric') return ui.fuelElectric;
    if (v === 'hybrid') return ui.fuelHybrid;
    return fuel || '';
  };

  const transmissionLabel = (tr: string | null | undefined) => {
    const v = (tr || '').toLowerCase();
    if (v === 'manual' || v === 'manuelle') return ui.transmissionManual;
    if (v === 'automatic' || v === 'automatique') return ui.transmissionAutomatic;
    return tr || '';
  };
  
  return (
    <div
      key={c.id}
      className="bg-white rounded-[2rem] p-4 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/50 group border border-gray-100 relative flex flex-col h-full"
      suppressHydrationWarning
    >
      {/* Top Section: Brand & Favorite */}
      <div className="flex items-center justify-between mb-4" suppressHydrationWarning>
        <div suppressHydrationWarning>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-0.5">{c.brand}</span>
          <h3 className="font-black text-gray-900 text-lg leading-tight truncate max-w-[180px]">{c.model}</h3>
        </div>
        <div className="p-2 bg-gray-50 rounded-2xl group-hover:bg-white group-hover:shadow-sm transition-all" suppressHydrationWarning>
          <FavoriteButton id={c.id} inactiveClassName="text-gray-400 hover:text-red-500" />
        </div>
      </div>

      {/* Image Section */}
      <div className="relative h-44 w-full mb-6 group-hover:scale-105 transition-transform duration-500 ease-out" suppressHydrationWarning>
        {c.images[0]?.url ? (
          <Image 
            src={c.images[0].url} 
            alt={`${c.brand} ${c.model}`} 
            fill
            className="object-contain" 
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={idx < 6}
          />
        ) : (
          <div className="w-full h-full bg-gray-50 rounded-3xl flex items-center justify-center">
            <span className="text-gray-300 font-bold text-sm">NO IMAGE</span>
          </div>
        )}
      </div>

      {/* Features Row */}
      <div className="grid grid-cols-3 gap-2 mb-6" suppressHydrationWarning>
        <div className="bg-gray-50 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100" suppressHydrationWarning>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400"><path d="M3 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 9h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">{fuelLabel(c.fuel)}</span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100" suppressHydrationWarning>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1A2 2 0 1 1 7.5 4.1l.1.1a1 1 0 0 0 1.1.2H9c.4 0 .7-.3.8-.6V4a2 2 0 1 1 4 0v.1c.1.3.4.6.8.6h.3a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.3c0 .4.3.7.6.8H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">{transmissionLabel(c.transmission)}</span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100" suppressHydrationWarning>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">{c.seats || 5} Seats</span>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50" suppressHydrationWarning>
        <div suppressHydrationWarning>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Daily Rate</span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-gray-900">{formatMAD(c.dailyPrice).replace(' MAD', '')}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">MAD</span>
          </div>
        </div>
        <a
          href={`/cars/${c.id}`}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
        >
          {rentNowButton}
        </a>
      </div>
    </div>
  );
}
