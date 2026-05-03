"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

import { Dict } from "@/i18n/dictionaries";

export default function Newsletter({ dict }: { dict: Dict["newsletter"] }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!dict) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success(dict.success);
        setEmail("");
      } else {
        const data = await response.json();
        toast.error(data.error || dict.error);
      }
    } catch {
      toast.error(dict.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12" suppressHydrationWarning>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl bg-gray-900 px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16"
        suppressHydrationWarning
      >
        {/* Background decorative elements */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
            {dict.title}
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            {dict.description}
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dict.placeholder}
              className="flex-1 rounded-xl border-0 bg-white/10 px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-600 outline-none backdrop-blur-sm disabled:opacity-50"
              required
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {dict.loading}
                </span>
              ) : dict.button}
            </button>
          </form>
          
          <p className="text-xs text-gray-500">
            {dict.privacy}
          </p>
        </div>
      </motion.div>
    </section>
  );
}
