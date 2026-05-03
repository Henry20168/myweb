"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Tag, 
  Car, 
  Bike,
  Plus,
  MoreVertical
} from "lucide-react";
import Image from "next/image";
import { Vehicle, AdminTab } from "@/types/admin";

interface VehicleManagementProps {
  cars: Vehicle[];
  motorcycles: Vehicle[];
  onEdit: (v: Vehicle) => void;
  onDelete: (id: number, type: 'car' | 'motorcycle') => void;
  onToggleOffer: (id: number, current: string, type: 'car' | 'motorcycle') => void;
  onUpdateOfferFields: (id: number, fields: Record<string, unknown>, type: 'car' | 'motorcycle') => void;
  tab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export default function VehicleManagement({ 
  cars, 
  motorcycles, 
  onEdit, 
  onDelete, 
  onToggleOffer,
  onUpdateOfferFields,
  tab,
  onTabChange
}: VehicleManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<'all' | 'car' | 'motorcycle'>('all');

  const allVehicles = [
    ...(Array.isArray(cars) ? cars : []).map(c => ({ ...c, type: 'car' as const })),
    ...(Array.isArray(motorcycles) ? motorcycles : []).map(m => ({ ...m, type: 'motorcycle' as const }))
  ];

  const filteredVehicles = allVehicles
    .filter(v => {
      if (!v) return false;
      const searchStr = (searchQuery || '').toLowerCase();
      const brand = (v.brand || '').toLowerCase();
      const model = (v.model || '').toLowerCase();
      
      const matchesSearch = brand.includes(searchStr) || model.includes(searchStr);
      const matchesType = filterType === 'all' || v.type === filterType;
      const matchesTab = tab === 'offers' ? !!v.offerDiscountPercent : true;
      
      return matchesSearch && matchesType && matchesTab;
    })
    .sort((a, b) => (b.id || 0) - (a.id || 0));

  const getVehicleImage = (v: Vehicle) => {
    if (!v) return '';
    const images = Array.isArray(v.images) ? v.images : [];
    const primary = images.find(i => i?.isPrimary);
    const first = images[0];
    const url = primary?.url || first?.url || v.imageUrl || '';
    
    if (typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (trimmed === '' || trimmed === 'undefined' || trimmed === 'null') return '';
    return trimmed;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by brand or model..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100 w-full md:w-auto">
            <button 
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilterType('car')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'car' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Cars
            </button>
            <button 
              onClick={() => setFilterType('motorcycle')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filterType === 'motorcycle' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Bikes
            </button>
          </div>
          <button className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredVehicles.map((v) => {
            const vehicleImage = getVehicleImage(v);
            return (
              <motion.div
                layout
                key={`${v.type}-${v.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
              >
                {/* Image Header */}
                <div className="h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center">
                  {vehicleImage ? (
                    <Image 
                      src={vehicleImage} 
                      alt={`${v.brand || ''} ${v.model || ''}`} 
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300">
                    {v.type === 'car' ? <Car size={48} /> : <Bike size={48} />}
                    <span className="text-xs mt-2 font-medium">No Image</span>
                  </div>
                )}
                
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm ${
                    v.status === 'available' ? 'bg-green-500 text-white' : 
                    v.status === 'offer' ? 'bg-orange-500 text-white' : 
                    'bg-gray-500 text-white'
                  }`}>
                    {v.status}
                  </span>
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur rounded-lg text-[10px] font-black uppercase tracking-wider text-gray-900 shadow-sm">
                    {v.type}
                  </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white rounded-lg shadow-lg text-gray-600 hover:text-gray-900">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-4">
                  <h4 className="text-lg font-black text-gray-900 leading-tight">{v.brand} {v.model}</h4>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                    {v.category} · {v.transmission} · {v.fuel}
                  </p>
                </div>

                <div className="flex items-center justify-between py-4 border-t border-gray-50">
                  <div>
                    <span className="text-2xl font-black text-gray-900">{v.dailyPrice}</span>
                    <span className="text-xs font-bold text-gray-400 ml-1">MAD/day</span>
                  </div>
                </div>

                {/* Offer Fields (Visible if tab is offers or status is offer) */}
                {(tab === 'offers' || v.status === 'offer') && (
                  <div className="mb-4 p-3 bg-orange-50 rounded-xl space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-orange-600 uppercase">Offer Discount</span>
                      <input 
                        type="number" 
                        defaultValue={v.offerDiscountPercent || 0}
                        onBlur={(e) => onUpdateOfferFields(v.id, { offerDiscountPercent: Number(e.target.value) }, v.type)}
                        className="w-16 bg-white border border-orange-100 rounded px-1.5 py-0.5 text-xs font-bold text-orange-700"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-orange-600 uppercase">Expires</span>
                      <input 
                        type="date" 
                        defaultValue={v.offerExpiresAt ? new Date(v.offerExpiresAt).toISOString().split('T')[0] : ''}
                        onBlur={(e) => onUpdateOfferFields(v.id, { offerExpiresAt: e.target.value }, v.type)}
                        className="bg-white border border-orange-100 rounded px-1.5 py-0.5 text-[10px] font-bold text-orange-700"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => onEdit(v)}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => onToggleOffer(v.id, v.status, v.type)}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      v.status === 'offer' 
                        ? 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100' 
                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Tag size={14} /> {v.status === 'offer' ? 'Remove' : 'Offer'}
                  </button>
                  <button 
                    onClick={() => onDelete(v.id, v.type)}
                    className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-100 text-red-500 text-xs font-bold hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} /> Delete Vehicle
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

        {/* Add Card */}
        <motion.button
          onClick={() => onTabChange('add')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 gap-4 group hover:border-[var(--brand)] hover:bg-red-50 transition-all min-h-[400px]"
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm text-gray-400 group-hover:text-[var(--brand)] transition-colors">
            <Plus size={32} />
          </div>
          <div className="text-center">
            <p className="font-black text-gray-900">Add New Vehicle</p>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Expand your fleet</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}
