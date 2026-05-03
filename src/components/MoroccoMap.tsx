"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Dict } from "@/i18n/dictionaries";

export default function MoroccoMap({ dict }: { dict?: Dict["map"] }) {
  const LOCATIONS = dict ? [
    { name: "Rabat", x: "35%", y: "25%", details: dict.rabat },
    { name: "Casablanca", x: "28%", y: "35%", details: dict.casablanca },
    { name: "Marrakech", x: "25%", y: "60%", details: dict.marrakech },
    { name: "Tangier", x: "42%", y: "5%", details: dict.tangier },
    { name: "Agadir", x: "15%", y: "75%", details: dict.agadir },
  ] : [];

  const [selected, setSelected] = useState(LOCATIONS[0]);

  if (!dict) return null;

  return (
    <section className="space-y-8 py-10" suppressHydrationWarning>
      <div className="text-center space-y-2" suppressHydrationWarning>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" suppressHydrationWarning>{dict.title}</h2>
        <p className="text-sm sm:text-base text-gray-500" suppressHydrationWarning>{dict.description}</p>
      </div>

      <div className="grid gap-10 md:grid-cols-2 items-center" suppressHydrationWarning>
        {/* SVG Map */}
        <div className="relative aspect-square bg-gray-50 rounded-3xl border border-gray-100 p-8 flex items-center justify-center overflow-hidden" suppressHydrationWarning>
          <svg viewBox="0 0 100 100" className="w-full h-full text-gray-200 fill-current" suppressHydrationWarning>
            <path d="M45,2 L48,5 L52,8 L55,15 L53,20 L50,25 L45,35 L40,45 L35,55 L30,65 L25,75 L20,85 L15,95 L40,98 L60,95 L80,90 L95,85 L90,70 L85,50 L80,30 L75,15 L70,5 L50,2 Z" />
            {LOCATIONS.map((loc) => (
              <motion.circle
                key={loc.name}
                cx={loc.x}
                cy={loc.y}
                r="1.5"
                className={`cursor-pointer transition-colors ${selected?.name === loc.name ? "text-red-600" : "text-gray-400"}`}
                whileHover={{ scale: 1.5 }}
                onClick={() => setSelected(loc)}
              />
            ))}
            {LOCATIONS.map((loc) => (
              <motion.g key={`pin-${loc.name}`} initial={false} animate={{ opacity: selected?.name === loc.name ? 1 : 0.4 }}>
                <circle cx={loc.x} cy={loc.y} r="0.8" className="fill-red-600" />
                {selected?.name === loc.name && (
                  <circle cx={loc.x} cy={loc.y} r="2" className="stroke-red-600 fill-none animate-ping" />
                )}
              </motion.g>
            ))}
          </svg>
          <div className="absolute bottom-4 left-4 text-[10px] text-gray-400 uppercase font-bold tracking-widest">{dict.interactiveMap}</div>
        </div>

        {/* Location Details */}
        <div className="space-y-6">
          <div className="grid gap-4">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.name}
                onClick={() => setSelected(loc)}
                className={`text-left p-4 rounded-2xl border transition-all ${
                  selected.name === loc.name 
                    ? "bg-white border-red-600 shadow-xl shadow-red-600/5 ring-1 ring-red-600" 
                    : "bg-gray-50 border-transparent hover:border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-gray-900">{loc.name}</div>
                  {selected.name === loc.name && <div className="h-2 w-2 rounded-full bg-red-600" />}
                </div>
                <div className="text-sm text-gray-500 mt-1">{loc.details}</div>
              </button>
            ))}
          </div>
          <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-colors">
            View on Google Maps
          </button>
        </div>
      </div>
    </section>
  );
}
