"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatMAD } from "@/lib/util";
import { Check, Calendar, MapPin, Clock, ArrowLeft, Car as CarIcon, Bike } from "lucide-react";

interface BookingExtra {
  id: number;
  extra: {
    name: string;
  };
  qty: number;
}

interface Booking {
  id: number;
  status: string;
  pickupCity: string;
  pickupAt: Date;
  returnCity: string;
  returnAt: Date;
  days: number;
  price: number;
  extras: BookingExtra[];
}

interface Vehicle {
  brand: string;
  model: string;
  images: Array<{ url: string; isPrimary?: boolean }>;
}

interface BookingSuccessClientProps {
  booking: Booking;
  vehicle: Vehicle;
  vehicleType: "car" | "motorcycle";
  dict: {
    bookingSuccess?: {
      confirmedTitle?: string;
      confirmedBody?: string;
      backToMotorcycles?: string;
      backToCars?: string;
      detailsTitle?: string;
      days?: string;
      extras?: string;
      total?: string;
    };
    home?: {
      locations?: string;
    };
    bookingForm?: {
      rentalDaysSuffix?: string;
    };
  };
}

export default function BookingSuccessClient({
  booking,
  vehicle,
  vehicleType,
  dict,
}: BookingSuccessClientProps) {
  const t = dict.bookingSuccess;
  const img =
    vehicle?.images?.find((i) => i.isPrimary)?.url ||
    vehicle?.images?.[0]?.url ||
    "";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Success Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="h-20 w-20 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/20"
            >
              <Check size={40} strokeWidth={3} />
            </motion.div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            {t?.confirmedTitle || "Booking Confirmed!"}
          </h1>
          <p className="text-gray-500 max-w-lg mx-auto font-medium">
            {t?.confirmedBody || "Your reservation has been received. We will contact you shortly to finalize everything."}
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left Column: Vehicle Card */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden group">
              <div className="relative h-72 md:h-96 bg-gray-50 flex items-center justify-center p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-100/50" />
                {img ? (
                  <motion.img
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                    src={img}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="relative z-10 object-contain h-full w-full drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="text-gray-300 font-black text-4xl uppercase tracking-widest">
                    {vehicle.brand}
                  </div>
                )}
                <div className="absolute top-6 left-6 z-20">
                  <span className="px-4 py-2 bg-white/90 backdrop-blur rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 shadow-sm border border-gray-100">
                    {vehicleType === "car" ? "Premium Car" : "Motorcycle"}
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-black text-red-500 uppercase tracking-widest">
                      {vehicle.brand}
                    </span>
                    <h2 className="text-3xl font-black text-gray-900 mt-1 uppercase tracking-tight">
                      {vehicle.model}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      Booking ID
                    </p>
                    <p className="text-lg font-black text-gray-900">
                      #{booking.id.toString().padStart(6, "0")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Link */}
            <Link
              href={vehicleType === "motorcycle" ? "/motorcycles" : "/cars"}
              className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              {vehicleType === "motorcycle" ? t?.backToMotorcycles || "Back to fleet" : t?.backToCars || "Back to fleet"}
            </Link>
          </motion.div>

          {/* Right Column: Details Card */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-red-500/10 rounded-full blur-3xl" />
              
              <h3 className="text-xl font-black uppercase tracking-tight mb-8 flex items-center gap-3">
                <Calendar className="text-red-500" size={24} />
                {t?.detailsTitle || "Booking Details"}
              </h3>

              <div className="space-y-6 relative z-10">
                <div className="grid gap-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <MapPin size={12} className="text-red-500" />
                      {dict.home?.locations || "Pick-up Location"}
                    </div>
                    <p className="text-sm font-bold pl-5">
                      {booking.pickupCity}
                    </p>
                    <p className="text-[11px] font-medium text-gray-400 pl-5">
                      {new Date(booking.pickupAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <MapPin size={12} className="text-red-500" />
                      {dict.home?.locations || "Return Location"}
                    </div>
                    <p className="text-sm font-bold pl-5">
                      {booking.returnCity}
                    </p>
                    <p className="text-[11px] font-medium text-gray-400 pl-5">
                      {new Date(booking.returnAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-white/10 my-6" />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Clock size={12} />
                      {t?.days || "Duration"}
                    </div>
                    <span className="text-sm font-bold">{booking.days} {dict.bookingForm?.rentalDaysSuffix || "days"}</span>
                  </div>

                  {booking.extras.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        {t?.extras || "Selected Extras"}
                      </div>
                      <div className="space-y-1 pl-2 border-l-2 border-red-500/30">
                        {booking.extras.map((be) => (
                          <div key={be.id} className="flex justify-between text-[11px] font-bold">
                            <span className="text-gray-300">{be.extra.name}</span>
                            <span>×{be.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-red-500">
                      {t?.total || "Total Price"}
                    </span>
                    <span className="text-2xl font-black text-white">
                      {formatMAD(booking.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="bg-gray-50 rounded-[2rem] p-6 border border-gray-100 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center text-gray-900 shadow-sm">
                {vehicleType === "car" ? <CarIcon size={24} /> : <Bike size={24} />}
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">
                  Need Help?
                </h4>
                <p className="text-[11px] text-gray-500 font-bold">
                  Contact us via WhatsApp for any changes.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
