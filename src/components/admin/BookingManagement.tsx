"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Calendar, 
  Phone, 
  Mail, 
  Printer, 
  MessageCircle,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { Booking, VehicleImage } from "@/types/admin";

interface BookingManagementProps {
  bookings: Booking[];
  onSelect: (b: Booking) => void;
  onPrint: (b: Booking) => void;
  waLink: (p: string, text: string) => string;
}

export default function BookingManagement({ 
  bookings, 
  onSelect, 
  onPrint, 
  waLink, 
}: BookingManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.phone.includes(searchQuery) ||
                         (b.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getVehicleImage = (b: Booking) => {
    // Prefer the 'vehicle' property which is always set by the API
    const vehicle = b.vehicle || (b.vehicleType === 'motorcycle' ? b.motorcycle : b.car);
    
    // Check for images in the images array first (Prisma relations)
    const primaryImage = vehicle?.images?.find((i: VehicleImage) => i.isPrimary)?.url;
    const firstImage = vehicle?.images?.[0]?.url;
    
    // Fallback to various possible image URL fields
    return primaryImage || firstImage || vehicle?.imageUrl || vehicle?.offerImageUrl || '';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by customer name, phone or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 w-full md:w-auto">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${statusFilter === status ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredBookings.map((b) => {
            return (
              <motion.div
                layout
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onSelect(b)}
                className="group bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                {/* Vehicle Preview */}
                <div className="w-full md:w-32 h-24 bg-gray-50 rounded-xl overflow-hidden relative flex-shrink-0">
                  {getVehicleImage(b) && !imageErrors[b.id] ? (
                    <Image 
                      src={getVehicleImage(b)} 
                      alt="Vehicle" 
                      fill 
                      className="object-contain p-2"
                      sizes="128px"
                      onError={() => setImageErrors(prev => ({ ...prev, [b.id]: true }))}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 bg-gray-100">
                      <Calendar size={32} />
                    </div>
                  )}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-white/90 backdrop-blur rounded-md text-[8px] font-black uppercase tracking-wider text-gray-900 shadow-sm">
                    {b.vehicleType}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-black text-gray-900 truncate">{b.customerName}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      b.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Phone size={12} /> {b.phone}
                    </div>
                    {b.email && (
                      <div className="flex items-center gap-1.5">
                        <Mail size={12} /> {b.email}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4">
                    <div className="bg-gray-50 px-3 py-2 rounded-xl flex items-center gap-3">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Pickup</p>
                        <p className="text-xs font-bold text-gray-900">{b.pickupCity} · {new Date(b.pickupAt).toLocaleDateString()}</p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300" />
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Return</p>
                        <p className="text-xs font-bold text-gray-900">{b.returnCity} · {new Date(b.returnAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing & Actions */}
                <div className="w-full md:w-auto flex md:flex-col items-center md:items-end justify-between gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Total Price</p>
                    <p className="text-xl font-black text-gray-900">{b.price.toLocaleString()} MAD</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{b.days} Days</p>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onPrint(b); }}
                      className="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
                      title="Print Agreement"
                    >
                      <Printer size={16} />
                    </button>
                    <a 
                      href={waLink(b.phone, `Hello ${b.customerName}, regarding your booking #${b.id}`)}
                      target="_blank"
                      rel="noopener"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredBookings.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No bookings found</h3>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
