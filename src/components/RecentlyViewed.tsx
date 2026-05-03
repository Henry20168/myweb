"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface RecentVehicle {
  id: number;
  brand: string;
  model: string;
  image?: string;
  price: number;
  type: 'car' | 'motorcycle';
}

export default function RecentlyViewed() {
  const [recent, setRecent] = useState<RecentVehicle[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem("recentlyViewed");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRecent(JSON.parse(saved).slice(0, 5));
      } catch (e) {
        console.error("Failed to parse recently viewed", e);
      }
    }
  }, []);

  if (recent.length === 0) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 z-[90] -translate-y-1/2 rounded-r-xl bg-white p-2 shadow-lg border border-l-0 border-gray-200 hover:bg-gray-50 transition-colors hidden md:block"
        title="Recently Viewed"
      >
        <div className="flex flex-col items-center gap-1 text-[10px] font-bold text-gray-500 uppercase vertical-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          History
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[110] bg-black/20 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 z-[120] h-full w-72 bg-white shadow-2xl border-r border-gray-100 p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
                <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {recent.map((v) => (
                  <Link
                    key={`${v.type}-${v.id}`}
                    href={`/${v.type === 'car' ? 'cars' : 'motorcycles'}/${v.id}`}
                    onClick={() => setIsOpen(false)}
                    className="flex gap-3 group"
                  >
                    <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-50 border border-gray-100">
                      {v.image && !imageErrors[`${v.type}-${v.id}`] ? (
                        <Image
                          src={v.image}
                          alt={`${v.brand} ${v.model}`}
                          fill
                          className="object-contain p-1 transition-transform group-hover:scale-110"
                          onError={() => setImageErrors(prev => ({ ...prev, [`${v.type}-${v.id}`]: true }))}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-gray-400 bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-gray-300">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <div className="text-sm font-bold text-gray-900 truncate group-hover:text-[var(--brand)] transition-colors">
                        {v.brand} {v.model}
                      </div>
                      <div className="text-xs text-gray-500">
                        {v.price} MAD <span className="text-[10px]">/day</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
      `}</style>
    </>
  );
}
