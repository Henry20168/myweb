"use client";

import { useRef, useState } from "react";
import CarCard, { Car } from "@/components/CarCard";

export default function MobileCarCarousel({ cars, primaryLabel, lang }: { cars: Car[]; primaryLabel?: string; lang?: string }) {
  const [index, setIndex] = useState(0);
  const wrap = (i: number) => (i + cars.length) % cars.length;

  // simple swipe support
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setIndex((i) => wrap(i + 1)); else setIndex((i) => wrap(i - 1));
    }
    startX.current = null;
  };

  if (!cars || cars.length === 0) return <div className="text-white/60">No cars yet</div>;

  const currentIndex = wrap(index);
  const current = cars[currentIndex];

  return (
    <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="px-2">
        <CarCard car={current} primaryLabel={primaryLabel} lang={lang} />
      </div>
      {cars.length > 1 && (
        <>
          <button aria-label="Previous" className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full bg-white shadow p-2" onClick={()=>setIndex(i=>wrap(i-1))}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m15 19-7-7 7-7" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
          <button aria-label="Next" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-white shadow p-2" onClick={()=>setIndex(i=>wrap(i+1))}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5"/></svg>
          </button>
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
            {cars.map((_, i)=>(
              <span key={i} className={`h-1.5 w-1.5 rounded-full ${i===currentIndex? 'bg-[var(--brand)]' : 'bg-gray-300'}`}></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
