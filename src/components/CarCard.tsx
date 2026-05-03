"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPriceParts } from "@/lib/util";
import { useCurrency } from "@/hooks/useCurrency";
import FavoriteButton from "@/components/FavoriteButton";
import CompareButton from "@/components/CompareButton";
import { useEffect, useState, useMemo } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import { motion } from "framer-motion";

export type Car = {
  id: number;
  brand: string;
  model: string;
  category: string;
  transmission: string;
  fuel: string;
  seats: number | null;
  dailyPrice: number;
  images: { url: string; isPrimary: boolean }[];
  engine?: string | null;
  engineCC?: number | null;
  mileagePolicy?: string | null;
  fuelPolicy?: string | null;
};

export default function CarCard({ car, primaryLabel, lang }: { car: Car; primaryLabel?: string; lang?: string }) {
  useCurrency();
  const [ui, setUi] = useState(() => {
    const initialLang = (lang && ['en', 'fr', 'ar'].includes(lang)) ? lang : 'en';
    const { dict } = getDictionary(initialLang);
    return {
      perDay: dict.home.perDayShort,
      fuelPetrol: dict.cars?.fuelPetrol ?? 'Petrol',
      fuelDiesel: dict.cars?.fuelDiesel ?? 'Diesel',
      fuelElectric: dict.cars?.fuelElectric ?? 'Electric',
      fuelHybrid: dict.cars?.fuelHybrid ?? 'Hybrid',
      transmissionManual: dict.cars?.transmissionManual ?? 'Manual',
      transmissionAutomatic: dict.cars?.transmissionAutomatic ?? 'Automatic',
      rentNow: dict.home.rentNowButton,
    };
  });

  useEffect(() => {
    function syncFromLang(code?: string) {
      try {
        const langCode = code
          || lang
          || (typeof document !== 'undefined'
              ? document.cookie.split(';').map(s => s.trim()).find(s => s.startsWith('lang='))?.split('=')[1]
              : undefined)
          || (typeof window !== 'undefined' ? window.localStorage.getItem('lang') || undefined : undefined)
          || 'en';
        const { dict } = getDictionary(langCode);
        setUi({
          perDay: dict.home.perDayShort,
          fuelPetrol: dict.cars?.fuelPetrol ?? 'Petrol',
          fuelDiesel: dict.cars?.fuelDiesel ?? 'Diesel',
          fuelElectric: dict.cars?.fuelElectric ?? 'Electric',
          fuelHybrid: dict.cars?.fuelHybrid ?? 'Hybrid',
          transmissionManual: dict.cars?.transmissionManual ?? 'Manual',
          transmissionAutomatic: dict.cars?.transmissionAutomatic ?? 'Automatic',
          rentNow: dict.home.rentNowButton,
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
  }, [lang]);

  const priceParts = useMemo(() => formatPriceParts(car.dailyPrice), [car.dailyPrice]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const label = primaryLabel ?? ui.rentNow;

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
  const img = car.images?.find((i) => i.isPrimary)?.url || car.images?.[0]?.url;

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="premium-card p-5 group flex flex-col h-full"
      suppressHydrationWarning
    >
      <div className="flex items-start justify-between mb-4" suppressHydrationWarning>
        <div className="min-w-0" suppressHydrationWarning>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">{car.brand}</span>
          <h3 className="font-black text-gray-900 text-lg leading-tight truncate group-hover:text-[var(--brand)] transition-colors">{car.model}</h3>
        </div>
        <div className="flex gap-2" suppressHydrationWarning>
          <CompareButton item={{
            id: car.id,
            brand: car.brand,
            model: car.model,
            image: img || "",
            price: car.dailyPrice,
            type: 'car'
          }} />
          <FavoriteButton id={car.id} inactiveClassName="text-gray-400 hover:text-red-500" />
        </div>
      </div>

      <div className="relative h-44 w-full mb-6 flex items-center justify-center overflow-hidden" suppressHydrationWarning>
        <div className="absolute inset-0 bg-gray-50/50 rounded-3xl transition-transform duration-700 group-hover:scale-95" suppressHydrationWarning />
        {img ? (
          <Image
            src={img}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-contain p-4 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <span className="text-gray-300 font-bold" suppressHydrationWarning>NO IMAGE</span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6" suppressHydrationWarning>
        <div className="bg-gray-50 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100" suppressHydrationWarning>
          <FuelIcon />
          <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">{fuelLabel(car.fuel)}</span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100" suppressHydrationWarning>
          <GearIcon />
          <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">{transmissionLabel(car.transmission)}</span>
        </div>
        <div className="bg-gray-50 rounded-2xl p-2 flex flex-col items-center justify-center gap-1 group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-100" suppressHydrationWarning>
          <SeatIcon />
          <span className="text-[10px] font-bold text-gray-600 truncate w-full text-center">{car.seats || 5} Seats</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between pt-5 border-t border-gray-50" suppressHydrationWarning>
        <div suppressHydrationWarning>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Daily</span>
          {mounted ? (
            <div className="flex items-baseline gap-1" suppressHydrationWarning>
              {priceParts.isPrefix && <span className="text-xl font-black text-gray-900">{priceParts.symbol}</span>}
              <span className="text-xl font-black text-gray-900">{priceParts.value}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">{priceParts.symbol === 'MAD' ? 'MAD' : priceParts.symbol}</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1" suppressHydrationWarning>
              <span className="text-xl font-black text-gray-900">{car.dailyPrice}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">MAD</span>
            </div>
          )}
        </div>
        <Link
          href={`/cars/${car.id}?withChildSeat=1#booking`}
          className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-95"
        >
          {label}
        </Link>
      </div>
    </motion.div>
  );
}

function FuelIcon(){
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400"><path d="M3 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 9h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
  );
}
function GearIcon(){
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2.5"/><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1A2 2 0 1 1 7.5 4.1l.1.1a1 1 0 0 0 1.1.2H9c.4 0 .7-.3.8-.6V4a2 2 0 1 1 4 0v.1c.1.3.4.6.8.6h.3a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.3c0 .4.3.7.6.8H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6Z" stroke="currentColor" strokeWidth="2.5"/></svg>
  );
}
function SeatIcon(){
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-400"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
  );
}
