"use client";

import { 
  X, 
  Save, 
  Image as ImageIcon, 
  Settings, 
  Info,
  LucideIcon,
  RefreshCw
} from "lucide-react";
import { Vehicle } from "@/types/admin";
import { useState } from "react";

interface VehicleFormProps {
  type: 'car' | 'motorcycle';
  form: Partial<Vehicle>;
  setForm: (form: Partial<Vehicle>) => void;
  onSave: () => void;
  onCancel: () => void;
  title?: string;
}

const InputField = ({ label, icon: Icon, children }: { label: string, icon?: LucideIcon, children: React.ReactNode }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
      {Icon && <Icon size={12} />} {label}
    </label>
    {children}
  </div>
);

export default function VehicleForm({
  type,
  form,
  setForm,
  onSave,
  onCancel,
  title
}: VehicleFormProps) {
  const [customFields, setCustomFields] = useState({
    brand: false,
    category: false,
    fuel: false,
    transmission: false
  });

  const brands = type === 'car' 
    ? ['Fiat','Hyundai','Mercedes','Volkswagen','Porsche','Land Rover','Peugeot','Dacia','Renault','Audi','Ford']
    : ['Yamaha','Honda','Kawasaki','BMW','Ducati','Suzuki'];

  const categories = type === 'car'
    ? ['Sedan','SUV','Hatchback','Coupe','Wagon','Luxury','Convertible','Van','Pickup']
    : ['Naked','Adventure','Sport','Scooter'];

  const handleSelectChange = (field: keyof typeof customFields, value: string) => {
    if (value === 'ADD_NEW') {
      setCustomFields(prev => ({ ...prev, [field]: true }));
      setForm({ ...form, [field]: '' });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const toggleCustom = (field: keyof typeof customFields) => {
    setCustomFields(prev => ({ ...prev, [field]: !prev[field] }));
    if (customFields[field]) {
      setForm({ ...form, [field]: '' });
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title || `Add New ${type}`}</h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Vehicle Specifications</p>
        </div>
        <button onClick={onCancel} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
          <X size={24} />
        </button>
      </div>

      <div className="p-8 space-y-10 max-h-[calc(100vh-280px)] overflow-y-auto no-scrollbar">
        {/* Basic Info */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><Info size={16} /></div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">General Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Brand">
              {customFields.brand ? (
                <div className="relative">
                  <input 
                    value={form.brand || ''} 
                    onChange={(e) => setForm({...form, brand: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-red-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 pr-12"
                    placeholder="Type new brand..."
                    autoFocus
                  />
                  <button 
                    onClick={() => toggleCustom('brand')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Switch back to list"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              ) : (
                <select 
                  value={form.brand || ''} 
                  onChange={(e) => handleSelectChange('brand', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">Select brand</option>
                  {brands.map(b => <option key={b} value={b}>{b}</option>)}
                  <option value="ADD_NEW" className="text-red-600 font-bold">+ Add New Type</option>
                </select>
              )}
            </InputField>
            <InputField label="Model">
              <input 
                value={form.model || ''} 
                onChange={(e) => setForm({...form, model: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                placeholder="e.g. Golf 8"
              />
            </InputField>
            <InputField label="Year">
              <input 
                type="number"
                value={form.year || ''} 
                onChange={(e) => setForm({...form, year: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                placeholder="2024"
              />
            </InputField>
            <InputField label="Category">
              {customFields.category ? (
                <div className="relative">
                  <input 
                    value={form.category || ''} 
                    onChange={(e) => setForm({...form, category: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-red-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 pr-12"
                    placeholder="Type new category..."
                    autoFocus
                  />
                  <button 
                    onClick={() => toggleCustom('category')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Switch back to list"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              ) : (
                <select 
                  value={form.category || ''} 
                  onChange={(e) => handleSelectChange('category', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  <option value="ADD_NEW" className="text-red-600 font-bold">+ Add New Type</option>
                </select>
              )}
            </InputField>
            <InputField label="Transmission">
              {customFields.transmission ? (
                <div className="relative">
                  <input 
                    value={form.transmission || ''} 
                    onChange={(e) => setForm({...form, transmission: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-red-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 pr-12"
                    placeholder="Type transmission..."
                    autoFocus
                  />
                  <button 
                    onClick={() => toggleCustom('transmission')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Switch back to list"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              ) : (
                <select 
                  value={form.transmission || ''} 
                  onChange={(e) => handleSelectChange('transmission', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                  <option value="ADD_NEW" className="text-red-600 font-bold">+ Add New Type</option>
                </select>
              )}
            </InputField>
            <InputField label="Fuel">
              {customFields.fuel ? (
                <div className="relative">
                  <input 
                    value={form.fuel || ''} 
                    onChange={(e) => setForm({...form, fuel: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-red-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 pr-12"
                    placeholder="Type fuel type..."
                    autoFocus
                  />
                  <button 
                    onClick={() => toggleCustom('fuel')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                    title="Switch back to list"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              ) : (
                <select 
                  value={form.fuel || ''} 
                  onChange={(e) => handleSelectChange('fuel', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  {['Petrol','Diesel','Electric','Hybrid'].map(f => <option key={f} value={f}>{f}</option>)}
                  <option value="ADD_NEW" className="text-red-600 font-bold">+ Add New Type</option>
                </select>
              )}
            </InputField>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Settings size={16} /></div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Technical Specifications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {type === 'car' ? (
              <>
                <InputField label="Seats"><input type="number" value={form.seats || ''} onChange={(e) => setForm({...form, seats: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20" /></InputField>
                <InputField label="Doors"><input type="number" value={form.doors || ''} onChange={(e) => setForm({...form, doors: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20" /></InputField>
                <InputField label="Luggage (L)"><input type="number" value={form.luggageCapacity || ''} onChange={(e) => setForm({...form, luggageCapacity: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20" /></InputField>
                <InputField label="Horsepower"><input type="number" value={form.horsepower || ''} onChange={(e) => setForm({...form, horsepower: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20" /></InputField>
              </>
            ) : (
              <>
                <InputField label="Engine CC"><input type="number" value={form.engineCC || ''} onChange={(e) => setForm({...form, engineCC: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20" /></InputField>
                <InputField label="Horsepower"><input type="number" value={form.horsepower || ''} onChange={(e) => setForm({...form, horsepower: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20" /></InputField>
              </>
            )}
          </div>
        </section>

        {/* Pricing & Images */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ImageIcon size={16} /></div>
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Pricing & Media</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <InputField label="Daily Price (MAD)">
                <input 
                  type="number"
                  value={form.dailyPrice || ''} 
                  onChange={(e) => setForm({...form, dailyPrice: Number(e.target.value)})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </InputField>
              <InputField label="Status">
                <select 
                  value={form.status || 'available'} 
                  onChange={(e) => setForm({...form, status: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="offer">Special Offer</option>
                </select>
              </InputField>
            </div>
            <div className="space-y-6">
              <InputField label="Main Image URL">
                <input 
                  value={form.imageUrl || ''} 
                  onChange={(e) => setForm({...form, imageUrl: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="https://..."
                />
              </InputField>
              <InputField label="Offer Image URL (Optional)">
                <input 
                  value={form.offerImageUrl || ''} 
                  onChange={(e) => setForm({...form, offerImageUrl: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="https://..."
                />
              </InputField>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Description</label>
          <textarea 
            value={form.description || ''} 
            onChange={(e) => setForm({...form, description: e.target.value})}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
            placeholder="Write a detailed description of the vehicle..."
          />
        </section>
      </div>

      <div className="p-8 bg-gray-50 flex justify-end gap-3">
        <button 
          onClick={onCancel}
          className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-white transition-colors"
        >
          Discard Changes
        </button>
        <button 
          onClick={onSave}
          className="px-10 py-3 bg-gray-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-gray-200 hover:bg-black transition-all flex items-center gap-2"
        >
          <Save size={18} /> Save Vehicle
        </button>
      </div>
    </div>
  );
}
