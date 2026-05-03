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

export type Motorcycle = {
  id: number;
  brand: string;
  model: string;
  category: string;
  transmission: string;
  fuel: string;
  engineCC: number | null;
  dailyPrice: number;
  images: { url: string; isPrimary: boolean }[];
};

export default function MotorcycleCard({ motorcycle, primaryLabel, lang }: { motorcycle: Motorcycle; primaryLabel?: string; lang?: string }) {
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
  const perDay = ui.perDay;
  const label = primaryLabel ?? ui.rentNow;
  const priceParts = useMemo(() => formatPriceParts(motorcycle.dailyPrice), [motorcycle.dailyPrice]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
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
  const img = motorcycle.images?.find((i) => i.isPrimary)?.url || motorcycle.images?.[0]?.url;
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="card p-4 transition-shadow duration-200 hover:shadow-xl group animate-card-in"
      suppressHydrationWarning
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="font-semibold text-sm md:text-base truncate" suppressHydrationWarning>{motorcycle.brand} {motorcycle.model}</div>
          <div className="text-xs text-gray-500 mt-0.5" suppressHydrationWarning>{motorcycle.brand}</div>
        </div>
        <div className="flex gap-2" suppressHydrationWarning>
          <CompareButton item={{
            id: motorcycle.id,
            brand: motorcycle.brand,
            model: motorcycle.model,
            image: img || "",
            price: motorcycle.dailyPrice,
            type: 'motorcycle'
          }} />
          <FavoriteButton id={motorcycle.id} inactiveClassName="text-black/60 hover:text-black" />
        </div>
      </div>

      <div className="mt-3 h-36 rounded-md bg-white relative flex items-center justify-center overflow-hidden" suppressHydrationWarning>
        {img ? (
          <Image
            src={img}
            alt={`${motorcycle.brand} ${motorcycle.model}`}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105 reveal-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <span className="text-white/50">Image</span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-5 text-xs text-gray-600" suppressHydrationWarning>
        <div className="flex items-center gap-1" suppressHydrationWarning><FuelIcon/> {fuelLabel(motorcycle.fuel)}</div>
        <div className="flex items-center gap-1" suppressHydrationWarning><GearIcon/> {transmissionLabel(motorcycle.transmission)}</div>
        {motorcycle.engineCC ? <div className="flex items-center gap-1" suppressHydrationWarning><EngineIcon/> {motorcycle.engineCC}cc</div> : null}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2" suppressHydrationWarning>
        {mounted ? (
          <div className="text-base font-bold text-[var(--brand)] flex items-baseline gap-1" suppressHydrationWarning>
            {priceParts.isPrefix && priceParts.symbol}
            {priceParts.value} 
            <span className="text-xs font-normal text-gray-600 ml-1" suppressHydrationWarning>
              {priceParts.symbol === 'MAD' ? 'MAD' : priceParts.symbol} {perDay}
            </span>
          </div>
        ) : (
          <div className="text-base font-bold text-[var(--brand)] flex items-baseline gap-1" suppressHydrationWarning>
            {motorcycle.dailyPrice}
            <span className="text-xs font-normal text-gray-600 ml-1" suppressHydrationWarning>
              MAD {perDay}
            </span>
          </div>
        )}
        <div className="flex gap-2" suppressHydrationWarning>
          <Link
            href={`/motorcycles/${motorcycle.id}?withHelmet=1#booking`}
            className="inline-flex items-center rounded-md bg-[var(--brand)] px-4 py-1 text-xs font-semibold text-white shadow-sm hover:opacity-90"
          >
            {label}
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FuelIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 9h10" stroke="currentColor" strokeWidth="1.5"/></svg>
  );
}
function GearIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.5"/><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1A2 2 0 1 1 7.5 4.1l.1.1a1 1 0 0 0 1.1.2H9c.4 0 .7-.3.8-.6V4a2 2 0 1 1 4 0v.1c.1.3.4.6.8.6h.3a1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1v.3c0 .4.3.7.6.8H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6Z" stroke="currentColor" strokeWidth="1.5"/></svg>
  );
}
function EngineIcon(){
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v6m0 0l-2-2m2 2l2-2M4 8h4l2 2h8a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-8l-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="1.5"/></svg>
  );
}
