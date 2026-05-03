"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Dict } from "@/i18n/dictionaries";

export default function FAQSection({ dict }: { dict: Dict["faqs"] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!dict) return null;

  const FAQS = [
    { q: dict.q1, a: dict.a1 },
    { q: dict.q2, a: dict.a2 },
    { q: dict.q3, a: dict.a3 },
    { q: dict.q4, a: dict.a4 },
    { q: dict.q5, a: dict.a5 }
  ];

  return (
    <section className="py-16" suppressHydrationWarning>
      <div className="grid lg:grid-cols-[1fr_2fr] gap-12" suppressHydrationWarning>
        <div className="space-y-4" suppressHydrationWarning>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight" suppressHydrationWarning>
            {dict.title}
          </h2>
          <p className="text-gray-500 leading-relaxed" suppressHydrationWarning>
            {dict.description}
          </p>
          <div className="pt-4" suppressHydrationWarning>
            <button className="inline-flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all">
              {dict.contactSupport} <span>→</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 ${
                openIndex === i ? "border-red-600 bg-red-50/30" : "border-gray-100 bg-white"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-gray-900">{faq.q}</span>
                <span className={`flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-300 ${openIndex === i ? "bg-red-600 text-white rotate-180" : "bg-gray-100 text-gray-500"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed border-t border-red-100 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
