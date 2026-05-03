"use client";

import { motion } from "framer-motion";

import { Dict } from "@/i18n/dictionaries";

export default function HowItWorks({ dict }: { dict: Dict["howItWorks"] }) {
  if (!dict) return null;

  const STEPS = [
    {
      number: "01",
      title: dict.step1Title,
      desc: dict.step1Desc,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
    },
    {
      number: "02",
      title: dict.step2Title,
      desc: dict.step2Desc,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
        </svg>
      ),
    },
    {
      number: "03",
      title: dict.step3Title,
      desc: dict.step3Desc,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0Z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 relative" suppressHydrationWarning>
      <div className="text-center space-y-3 mb-16" suppressHydrationWarning>
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-tight" suppressHydrationWarning>{dict.title}</h2>
        <p className="text-gray-500 max-w-2xl mx-auto" suppressHydrationWarning>
          {dict.description}
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3 relative" suppressHydrationWarning>
        {/* Connection lines (desktop only) */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2" />
        
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="flex flex-col items-center text-center space-y-6 bg-white p-8 rounded-3xl relative"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-5xl font-black text-gray-50 opacity-10 select-none">
              {step.number}
            </div>
            
            <div className="h-20 w-20 flex items-center justify-center rounded-2xl bg-red-600 text-white shadow-xl shadow-red-600/20 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              {step.icon}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed px-4">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
