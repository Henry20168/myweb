"use client";

import { formatPriceParts } from "@/lib/util";
import { useCurrency } from "@/hooks/useCurrency";
import Link from "next/link";
import Image from "next/image";
import FavoriteButton from "@/components/FavoriteButton";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

export type OfferCar = {
  id: number;
  brand: string;
  model: string;
  dailyPrice: number;
  status?: string;
  offerDiscountPercent?: number | null;
  offerExpiresAt?: string | Date | null;
  images: { url: string; isPrimary: boolean }[];
};

export default function OfferCard({ car }: { car: OfferCar }) {
  useCurrency();
  const priceParts = useMemo(() => formatPriceParts(car.dailyPrice), [car.dailyPrice]);
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const img = car.images?.find((i) => i.isPrimary)?.url || car.images?.[0]?.url;
  const percent = typeof car.offerDiscountPercent === 'number' ? car.offerDiscountPercent : undefined;
  const expiry = car.offerExpiresAt ? new Date(car.offerExpiresAt) : undefined;
  const expiryLabel = expiry ? expiry.toISOString().slice(0, 10) : undefined;
  // Always use the car's own image; ignore any separate offer banner
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black via-zinc-900 to-red-700 p-6 text-white shadow-md"
      suppressHydrationWarning
    >
      <div className="absolute right-3 top-3 z-10" suppressHydrationWarning>
        <div className="rounded-full bg-white/10 backdrop-blur px-2 py-1" suppressHydrationWarning>
          <FavoriteButton id={car.id} />
        </div>
      </div>
      <div className="flex items-start justify-between gap-4 relative z-10" suppressHydrationWarning>
        <div className="space-y-3" suppressHydrationWarning>
          <div className="flex items-center gap-2 text-xs" suppressHydrationWarning>
            {typeof percent === 'number' && (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-1 font-semibold backdrop-blur" suppressHydrationWarning>
                % {percent} OFF
              </span>
            )}
            {(car.status === 'offer' || typeof percent === 'number') && (
              <span className="inline-flex items-center gap-1 rounded-md bg-red-500/90 px-2 py-1 font-semibold" suppressHydrationWarning>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-3.5 w-3.5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3l2.6 5.3L20 9l-4 3.9.9 5.6L12 16.8 7.1 18.5 8 12.9 4 9l5.4-.7L12 3z"/></svg>
                Special Offer
              </span>
            )}
          </div>
          <div className="text-xl font-bold leading-tight" suppressHydrationWarning>
            {car.brand} {car.model}
          </div>
          {typeof percent === 'number' && (
            <div className="text-white/80 text-sm" suppressHydrationWarning>Save {percent}% on daily rental - Special Deal</div>
          )}
          {expiryLabel && (
            <div className="text-white/70 text-xs inline-flex items-center gap-2" suppressHydrationWarning>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 3v4M17 3v4M4 11h16M5 7h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5"/></svg>
              Valid until {expiryLabel}
            </div>
          )}
          <div className="pt-2" suppressHydrationWarning>
            <Link href={`/cars/${car.id}?withChildSeat=1#booking`} className="inline-flex items-center rounded-lg bg-white text-gray-900 px-4 py-2 text-sm font-semibold hover:bg-white/90">
              Get Offer
            </Link>
          </div>
        </div>
        {/* Desktop/tablet image on the right */}
        <div className="pointer-events-none relative -mb-10 -mr-4 hidden sm:block w-48 h-36" suppressHydrationWarning>
          {img && !imageError ? (
            <Image
              src={img}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-contain drop-shadow-xl"
              sizes="(max-width: 768px) 0vw, 200px"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
            </div>
          )}
        </div>
      </div>
      {/* Mobile image below content */}
      <div className="sm:hidden mt-3 flex justify-center h-28 relative" suppressHydrationWarning>
        {img && !imageError ? (
          <Image
            src={img}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-contain drop-shadow-xl"
            sizes="(max-width: 768px) 100vw, 0vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white/30">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </div>
        )}
      </div>
      <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" aria-hidden suppressHydrationWarning />
      {mounted ? (
        <div className="absolute bottom-3 right-4 text-sm font-bold text-white/90 pointer-events-none" suppressHydrationWarning>
          {priceParts.isPrefix && priceParts.symbol}
          {priceParts.value}
          <span className="text-white/70 text-xs font-normal ml-1" suppressHydrationWarning>
            {priceParts.symbol === 'MAD' ? 'MAD' : priceParts.symbol}/day
          </span>
        </div>
      ) : (
        <div className="absolute bottom-3 right-4 text-sm font-bold text-white/90 pointer-events-none" suppressHydrationWarning>
          {car.dailyPrice}
          <span className="text-white/70 text-xs font-normal ml-1" suppressHydrationWarning>
            MAD/day
          </span>
        </div>
      )}
      <Link href={`/cars/${car.id}?withChildSeat=1#booking`} aria-label={`Open ${car.brand} ${car.model} booking`} className="absolute inset-0 z-0">
        {/* Invisible full-card link for easy navigation */}
      </Link>
    </motion.div>
  );
}
