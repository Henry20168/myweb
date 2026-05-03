"use client";

import React, { useEffect, useMemo, useState } from "react";
import { moroccanCities, getFeeFromRabat } from "@/lib/cities";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { getDictionary } from "@/i18n/dictionaries";

export type ExtraItem = { id: number; name: string; pricePerDay: number };

export default function BookingForm({ vehicleId, carId, vehicleType, dailyPrice, extras = [] as ExtraItem[] }: { 
  vehicleId?: number; 
  carId?: number; 
  vehicleType?: 'car' | 'motorcycle'; 
  dailyPrice: number; 
  extras?: ExtraItem[]; 
}) {
  // Handle both prop naming conventions for backward compatibility
  const finalVehicleId = vehicleId || carId;
  const finalVehicleType = vehicleType || (carId ? 'car' : 'motorcycle');
  
  const [ui, setUi] = useState(() => {
    const { dict } = getDictionary("en");
    const b = dict.bookingForm!;
    return {
      fullName: b.fullName,
      fullNamePlaceholder: b.fullNamePlaceholder,
      email: b.email,
      emailPlaceholder: b.emailPlaceholder,
      phone: b.phone,
      phonePlaceholder: b.phonePlaceholder,
      currentCity: b.currentCity,
      pickupCity: b.pickupCity,
      returnCity: b.returnCity,
      pickupDate: b.pickupDate,
      returnDate: b.returnDate,
      pickupTime: b.pickupTime,
      returnTime: b.returnTime,
      rentalDuration: b.rentalDuration,
      rentalDaysSuffix: b.rentalDaysSuffix,
      addExtras: b.addExtras,
      noExtrasAvailable: b.noExtrasAvailable,
      summaryCar: b.summaryCar,
      summaryPickupShipping: b.summaryPickupShipping,
      summaryReturnShipping: b.summaryReturnShipping,
      summaryExtras: b.summaryExtras,
      summaryTotal: b.summaryTotal,
      next: b.next,
      back: b.back,
      reserveNow: b.reserveNow,
      whatsapp: b.whatsapp,
      errorMissingDates: b.errorMissingDates,
      errorDuration: b.errorDuration,
      errorName: b.errorName,
      errorContact: b.errorContact,
      errorGeneric: b.errorGeneric,
      importantNote: b.importantNote,
      importantNoteShort: b.importantNoteShort,
      childSeatName: b.childSeatName,
      shippingFree: b.shippingFree,
      shippingExtraPrefix: b.shippingExtraPrefix,
    };
  });
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pickupCity, setPickupCity] = useState("Rabat");
  const [returnCity, setReturnCity] = useState("Rabat");
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnTime, setReturnTime] = useState("09:00");
  const [days, setDays] = useState(1);
  const [selected, setSelected] = useState<Record<number, number>>({}); // extraId -> qty
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<1|2|3>(1);
  const router = useRouter();
  const search = useSearchParams();

  const pickupAt = useMemo(() => (pickupDate ? `${pickupDate}T${pickupTime}` : ""), [pickupDate, pickupTime]);
  const returnAt = useMemo(() => (returnDate ? `${returnDate}T${returnTime}` : ""), [returnDate, returnTime]);

  const allExtras = useMemo<ExtraItem[]>(() => [
  ...(finalVehicleType === 'car' ? [{ id: -100, name: ui.childSeatName, pricePerDay: 50 }] : []),
  ...extras
], [extras, ui.childSeatName, finalVehicleType]);
  const extrasTotal = useMemo(() => {
    return Object.entries(selected).reduce((sum, [id, qty]) => {
      const extraId = Number(id);
      const e = allExtras.find((x) => x.id === extraId);
      if (!e) return sum;
      const billedDays = extraId === -100 ? Math.min(days, 5) : days;
      return sum + (e.pricePerDay * billedDays * (qty || 1));
    }, 0);
  }, [selected, allExtras, days]);

  const carTotal = useMemo(() => dailyPrice * days, [dailyPrice, days]);
  const pickupFee = useMemo(()=> getFeeFromRabat(pickupCity), [pickupCity]);
  const returnFee = useMemo(()=> getFeeFromRabat(returnCity), [returnCity]);
  const shippingTotal = pickupFee + returnFee;
  const total = carTotal + extrasTotal + shippingTotal;

  // Initialize pickup/return dates to today on first mount so the date field shows a real date by default
  useEffect(() => {
    if (!pickupDate) {
      const today = new Date();
      const iso = formatDateInput(today);
      setPickupDate(iso);
      // keep return date in sync with current duration
      const end = new Date(today);
      end.setDate(end.getDate() + days - 1);
      setReturnDate(formatDateInput(end));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-calculate rental days from pickup/return dates
  useEffect(() => {
    if (!pickupDate || !returnDate) return;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const ms = end.getTime() - start.getTime();
    if (isNaN(ms) || ms < 0) {
      setDays(1);
      return;
    }
    const d = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));
    setDays(d);
  }, [pickupDate, returnDate]);

  function formatDateInput(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // If navigated with ?withChildSeat=1, preselect the Child Seat virtual extra once on mount
  useEffect(() => {
    const flag = search?.get("withChildSeat");
    if (flag === "1") {
      setSelected((prev) => (prev[-100] ? prev : { ...prev, [-100]: 1 }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleExtra(extraId: number, checked: boolean) {
    setSelected((prev) => {
      const next = { ...prev };
      if (checked) next[extraId] = next[extraId] || 1; else delete next[extraId];
      return next;
    });
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      if (!pickupAt || !returnAt) throw new Error(ui.errorMissingDates);
      if (days < 1) throw new Error(ui.errorDuration);
      if (!name) throw new Error(ui.errorName);
      if (!phone || !email) throw new Error(ui.errorContact);
      const extrasPayload = Object.entries(selected)
        .filter(([extraId]) => Number(extraId) > 0)
        .map(([extraId, qty]) => ({ extraId: Number(extraId), qty }));
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(finalVehicleType === 'car' ? { carId: finalVehicleId } : { motorcycleId: finalVehicleId }),
          customerName: name,
          phone,
          email,
          pickupCity,
          returnCity,
          pickupAt,
          returnAt,
          days,
          price: total,
          extras: extrasPayload,
          notes: `Pickup/Return dates selected`,
        }),
      });
      if (!res.ok) throw new Error(ui.errorGeneric);
      const { id } = await res.json();
      router.push(`/booking-success/${id}?type=${finalVehicleType}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : ui.errorGeneric;
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function syncLang(code?: string) {
      try {
        const langCode = code
          || (typeof document !== "undefined"
                ? document.cookie.split(";").map(s => s.trim()).find(s => s.startsWith("lang="))?.split("=")[1]
                : undefined)
          || (typeof window !== "undefined" ? window.localStorage.getItem("lang") || undefined : undefined)
          || "en";
        const { dict } = getDictionary(langCode);
        const b = dict.bookingForm!;
        setUi({
          fullName: b.fullName,
          fullNamePlaceholder: b.fullNamePlaceholder,
          email: b.email,
          emailPlaceholder: b.emailPlaceholder,
          phone: b.phone,
          phonePlaceholder: b.phonePlaceholder,
          currentCity: b.currentCity,
          pickupCity: b.pickupCity,
          returnCity: b.returnCity,
          pickupDate: b.pickupDate,
          returnDate: b.returnDate,
          pickupTime: b.pickupTime,
          returnTime: b.returnTime,
          rentalDuration: b.rentalDuration,
          rentalDaysSuffix: b.rentalDaysSuffix,
          addExtras: b.addExtras,
          noExtrasAvailable: b.noExtrasAvailable,
          summaryCar: b.summaryCar,
          summaryPickupShipping: b.summaryPickupShipping,
          summaryReturnShipping: b.summaryReturnShipping,
          summaryExtras: b.summaryExtras,
          summaryTotal: b.summaryTotal,
          next: b.next,
          back: b.back,
          reserveNow: b.reserveNow,
          whatsapp: b.whatsapp,
          errorMissingDates: b.errorMissingDates,
          errorDuration: b.errorDuration,
          errorName: b.errorName,
          errorContact: b.errorContact,
          errorGeneric: b.errorGeneric,
          importantNote: b.importantNote,
          importantNoteShort: b.importantNoteShort,
          childSeatName: b.childSeatName,
          shippingFree: b.shippingFree,
          shippingExtraPrefix: b.shippingExtraPrefix,
        });
      } catch {
        // ignore
      }
    }

    syncLang();

    if (typeof window !== "undefined") {
      const handler = (ev: Event) => {
        const detail = (ev as CustomEvent<string>).detail;
        syncLang(detail);
      };
      window.addEventListener("aalikouch-lang-change", handler as EventListener);
      return () => window.removeEventListener("aalikouch-lang-change", handler as EventListener);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-gray-900' : 'bg-gray-100'}`} />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{ui.pickupCity}</label>
                <select 
                  value={pickupCity} 
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                >
                  {moroccanCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{ui.returnCity}</label>
                <select 
                  value={returnCity} 
                  onChange={(e) => setReturnCity(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                >
                  {moroccanCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{ui.pickupDate}</label>
                <div className="flex gap-2">
                  <input 
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="flex-[2] px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                  />
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="flex-1 px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                  >
                    {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{ui.returnDate}</label>
                <div className="flex gap-2">
                  <input 
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="flex-[2] px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                  />
                  <select
                    value={returnTime}
                    onChange={(e) => setReturnTime(e.target.value)}
                    className="flex-1 px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                  >
                    {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-gray-200 active:scale-[0.98]"
            >
              {ui.next}
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{ui.addExtras}</h4>
              <div className="grid grid-cols-1 gap-3">
                {allExtras.map((extra) => (
                  <div 
                    key={extra.id}
                    onClick={() => toggleExtra(extra.id, !selected[extra.id])}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selected[extra.id] ? 'bg-gray-900 border-gray-900 text-white' : 'bg-gray-50 border-gray-100 text-gray-900 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        selected[extra.id] ? 'bg-white border-white text-gray-900' : 'bg-white border-gray-200'
                      }`}>
                        {selected[extra.id] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M20 6L9 17l-5-5"/></svg>}
                      </div>
                      <span className="text-sm font-bold">{extra.name}</span>
                    </div>
                    <span className={`text-xs font-black ${selected[extra.id] ? 'text-gray-300' : 'text-gray-400'}`}>
                      +{extra.pricePerDay} MAD
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 py-4 bg-gray-50 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
              >
                {ui.back}
              </button>
              <button 
                onClick={() => setStep(3)}
                className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg shadow-gray-200"
              >
                {ui.next}
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{ui.fullName}</label>
                <input 
                  type="text"
                  placeholder={ui.fullNamePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{ui.phone}</label>
                <input 
                  type="tel"
                  placeholder={ui.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{ui.email}</label>
                <input 
                  type="email"
                  placeholder={ui.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-gray-900/10 transition-all"
                />
              </div>
            </div>

            {/* Summary */}
            <div className="p-6 bg-gray-900 rounded-3xl text-white space-y-4 shadow-xl shadow-gray-200">
              <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span>{ui.summaryTotal}</span>
                <span className="text-white text-lg font-black">{total.toLocaleString()} MAD</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>{days} {ui.rentalDaysSuffix}</span>
                  <span>{carTotal.toLocaleString()} MAD</span>
                </div>
                {shippingTotal > 0 && (
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Shipping</span>
                    <span>{shippingTotal.toLocaleString()} MAD</span>
                  </div>
                )}
                {extrasTotal > 0 && (
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Extras</span>
                    <span>{extrasTotal.toLocaleString()} MAD</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center">{error}</p>
            )}

            <div className="flex flex-col gap-3">
              <button 
                onClick={submit}
                disabled={loading}
                className="w-full py-4 bg-[var(--brand)] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg shadow-red-500/20 disabled:opacity-50"
              >
                {loading ? 'Processing...' : ui.reserveNow}
              </button>
              <button 
                onClick={() => setStep(2)}
                className="w-full py-4 bg-gray-50 text-gray-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
              >
                {ui.back}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
