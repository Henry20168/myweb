"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ShieldCheck, ChevronRight, X, Printer } from "lucide-react";

// Components
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminDashboard from "@/components/admin/AdminDashboard";
import VehicleManagement from "@/components/admin/VehicleManagement";
import BookingManagement from "@/components/admin/BookingManagement";
import SupportManagement from "@/components/admin/SupportManagement";
import ClientManagement from "@/components/admin/ClientManagement";
import VehicleForm from "@/components/admin/VehicleForm";
import TaskManagement from "@/components/admin/TaskManagement";
import RentalAgreement from "@/components/RentalAgreement";

// Types
import { 
  Vehicle, 
  Booking, 
  ContactMessage, 
  Client, 
  AdminStats, 
  AdminTab 
} from "@/types/admin";

const EMPTY_CAR: Partial<Vehicle> = { brand: '', model: '', year: undefined, category: 'Sedan', transmission: 'Automatic', fuel: 'Petrol', seats: null, dailyPrice: 0, description: '', status: 'available', imageUrl: '', offerImageUrl: ''};
const EMPTY_MOTORCYCLE: Partial<Vehicle> = { brand: '', model: '', year: undefined, category: 'Naked', transmission: 'Manual', fuel: 'Petrol', engine: '', engineCC: null, horsepower: null, dailyPrice: 0, description: '', status: 'available', imageUrl: '', offerImageUrl: ''};
const EMPTY_CLIENT: Partial<Client> = { fullName: '', phone: '', email: '', city: '', address: '', nationality: '', idType: 'National ID', idNumber: '', notes: '', status: 'active' };

function PinGate({ onAuthorized }: { onAuthorized: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (pin.length < 4) {
      setError("PIN is too short");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        onAuthorized();
      } else {
        setError("Invalid PIN. Please try again.");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" suppressHydrationWarning>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] p-12 shadow-2xl shadow-gray-200 border border-gray-100 text-center"
      >
        <div className="w-20 h-20 bg-red-50 text-[var(--brand)] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
          <Lock size={32} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Restricted Access</h1>
        <p className="text-gray-500 font-medium mb-10 leading-relaxed">Please enter your security PIN to access the administration panel.</p>
        
        <div className="space-y-4">
          <input 
            type="password"
            value={pin} 
            onChange={(e)=>setPin(e.target.value)} 
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-center text-2xl tracking-[0.5em] font-black focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all placeholder:tracking-normal placeholder:text-sm placeholder:font-bold" 
            placeholder="••••••"
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            autoFocus
          />
          {error && <p className="text-red-500 text-xs font-bold uppercase tracking-wider">{error}</p>}
          
          <button 
            onClick={submit} 
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-sm hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? 'Verifying...' : 'Unlock System'}
            {!loading && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-gray-400">
          <ShieldCheck size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Encrypted Session</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [tab, setTab] = useState<AdminTab>('analytics');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Data State
  const [cars, setCars] = useState<Vehicle[]>([]);
  const [motorcycles, setMotorcycles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // UI State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [printingBooking, setPrintingBooking] = useState<Booking | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(null);
  const [replyText, setReplyText] = useState("");
  
  // Forms
  const [carForm, setCarForm] = useState<Partial<Vehicle>>(EMPTY_CAR);
  const [motorcycleForm, setMotorcycleForm] = useState<Partial<Vehicle>>(EMPTY_MOTORCYCLE);
  const [clientForm, setClientForm] = useState<Partial<Client>>(EMPTY_CLIENT);

  const fetchData = useCallback(async () => {
    const safeFetch = async <T,>(url: string, fallback: T): Promise<T> => {
      try {
        const r = await fetch(url);
        if (!r.ok) return fallback;
        return await r.json() as T;
      } catch {
        return fallback;
      }
    };

    const [cs, ms, bs, cms, cls, st] = await Promise.all([
      safeFetch<Vehicle[]>('/api/cars', []),
      safeFetch<Vehicle[]>('/api/motorcycles', []),
      safeFetch<Booking[]>('/api/bookings', []),
      safeFetch<ContactMessage[]>('/api/admin/contact-messages', []),
      safeFetch<Client[]>('/api/admin/clients', []),
      safeFetch<AdminStats | null>('/api/admin/stats', null),
    ]);

    setCars(cs);
    setMotorcycles(ms);
    setBookings(bs);
    setContactMessages(cms);
    setClients(cls);
    setStats(st);
  }, []);

  useEffect(() => {
    fetch('/api/bookings').then(r => {
      if (r.ok) {
        setAuthorized(true);
        fetchData();
      } else {
        setAuthorized(false);
      }
    }).catch(() => setAuthorized(false));
  }, [fetchData]);

  // Actions
  const handleLogout = async () => {
    await fetch("/api/admin/session", { method: "DELETE" });
    setAuthorized(false);
  };

  const handleSaveVehicle = async (type: 'car' | 'motorcycle') => {
    const form = type === 'car' ? carForm : motorcycleForm;
    const endpoint = type === 'car' ? '/api/cars' : '/api/motorcycles';
    
    const res = await fetch(endpoint, { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(form) 
    });

    if (res.ok) {
      toast.success(`${type} added successfully`);
      if (type === 'car') {
        setCarForm(EMPTY_CAR);
      } else {
        setMotorcycleForm(EMPTY_MOTORCYCLE);
      }
      fetchData();
      setTab('manage');
    } else {
      toast.error(`Failed to add ${type}`);
    }
  };

  const handleUpdateVehicle = async () => {
    if (!editingVehicle || !editingVehicle.id) return;
    const isMotorcycle = motorcycles.some(m => m.id === editingVehicle.id);
    const endpoint = isMotorcycle ? `/api/motorcycles/${editingVehicle.id}` : `/api/cars/${editingVehicle.id}`;
    
    const res = await fetch(endpoint, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(editingVehicle) 
    });

    if (res.ok) {
      toast.success('Vehicle updated');
      setEditingVehicle(null);
      fetchData();
    } else {
      toast.error('Failed to update vehicle');
    }
  };

  const handleDeleteVehicle = async (id: number, type: 'car' | 'motorcycle') => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    
    const res = await fetch(`/api/${type}s/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success(`${type} deleted`);
      fetchData();
    } else {
      toast.error('Failed to delete');
    }
  };

  const handleToggleOffer = async (id: number, current: string, type: 'car' | 'motorcycle') => {
    const next = current === 'offer' ? 'available' : 'offer';
    const res = await fetch(`/api/${type}s/${id}`, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ status: next }) 
    });
    
    if (res.ok) {
      toast.success(next === 'offer' ? 'Added to offers' : 'Removed from offers');
      fetchData();
    }
  };

  const handleUpdateOfferFields = async (id: number, fields: Record<string, unknown>, type: 'car' | 'motorcycle' = 'car') => {
    const res = await fetch(`/api/${type}s/${id}`, { 
      method: 'PATCH', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(fields) 
    });
    if (res.ok) {
      toast.success('Offer updated');
      fetchData();
    }
  };

  const handleSaveClient = async () => {
    const isUpdate = !!clientForm.id;
    const url = isUpdate ? `/api/admin/clients/${clientForm.id}` : '/api/admin/clients';
    const method = isUpdate ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(clientForm),
    });

    if (res.ok) {
      toast.success(isUpdate ? 'Client updated' : 'Client added');
      setClientForm(EMPTY_CLIENT);
      fetchData();
    } else {
      toast.error('Failed to save client');
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    const res = await fetch(`/api/admin/contact-messages/${selectedMessage.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: replyText }),
    });
    if (res.ok) {
      toast.success('Reply sent');
      setReplyText('');
      fetchData();
    } else {
      toast.error('Failed to send reply');
    }
  };

  // Helper Utils
  const phoneDigits = (p: string) => (p || '').replace(/[^0-9+]/g, '');
  const waLink = (p: string, text: string) => {
    const digits = phoneDigits(p).replace(/^\+/, '');
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  };

  if (authorized === null) return null;
  if (authorized === false) return <PinGate onAuthorized={() => { setAuthorized(true); fetchData(); }} />;

  return (
    <div className="min-h-screen bg-gray-50 flex" suppressHydrationWarning>
      {/* Sidebar */}
      <AdminSidebar 
        activeTab={tab} 
        onTabChange={setTab} 
        onLogout={handleLogout} 
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ${
          isSidebarCollapsed ? 'md:ml-[80px]' : 'md:ml-[260px]'
        }`}
      >
        <AdminHeader 
          activeTab={tab} 
          onMenuClick={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab === 'analytics' && (
                <AdminDashboard stats={stats} onTabChange={setTab} />
              )}

              {(tab === 'manage' || tab === 'offers') && (
                <VehicleManagement 
                  cars={cars} 
                  motorcycles={motorcycles} 
                  tab={tab}
                  onEdit={(v) => { setEditingVehicle(v); }}
                  onDelete={handleDeleteVehicle}
                  onToggleOffer={handleToggleOffer}
                  onUpdateOfferFields={handleUpdateOfferFields}
                  onTabChange={setTab}
                />
              )}

              {tab === 'bookings' && (
                <BookingManagement 
                  bookings={bookings}
                  onSelect={setSelectedBooking}
                  onPrint={(b) => { setPrintingBooking(b); setTimeout(() => window.print(), 100); }}
                  waLink={waLink}
                />
              )}

              {tab === 'clients' && (
                <ClientManagement 
                  clients={clients}
                  clientForm={clientForm}
                  setClientForm={setClientForm}
                  onSave={handleSaveClient}
                  selectedClient={selectedClient}
                  setSelectedClient={setSelectedClient}
                  onUpdateStatus={async (client, status) => {
                    const res = await fetch(`/api/admin/clients/${client.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ ...client, status }),
                    });
                    if (res.ok) {
                      toast.success('Status updated');
                      fetchData();
                    }
                  }}
                />
              )}

              {tab === 'support' && (
                <SupportManagement 
                  messages={contactMessages}
                  selectedMessage={selectedMessage}
                  setSelectedMessage={setSelectedMessage}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  onSendReply={handleSendReply}
                />
              )}

              {tab === 'add' && (
                <VehicleForm 
                  type="car"
                  form={carForm}
                  setForm={setCarForm}
                  onSave={() => handleSaveVehicle('car')}
                  onCancel={() => setTab('manage')}
                />
              )}

              {tab === 'add-motorcycle' && (
                <VehicleForm 
                  type="motorcycle"
                  form={motorcycleForm}
                  setForm={setMotorcycleForm}
                  onSave={() => handleSaveVehicle('motorcycle')}
                  onCancel={() => setTab('manage')}
                />
              )}

              {tab === 'tasks' && (
                <TaskManagement />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Edit Vehicle Modal */}
      <AnimatePresence>
        {editingVehicle && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl"
            >
              <VehicleForm 
                type={motorcycles.some(m => m.id === (editingVehicle as Vehicle).id) ? 'motorcycle' : 'car'}
                form={editingVehicle}
                setForm={setEditingVehicle}
                onSave={handleUpdateVehicle}
                onCancel={() => setEditingVehicle(null)}
                title="Edit Vehicle Specifications"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Details Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBooking(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              {/* Modal content similar to previous but more professional */}
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Booking Details</h2>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Reference #{selectedBooking.id}</p>
                </div>
                <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Details here... I'll simplify for now but keep the logic */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Customer</p>
                    <p className="font-bold text-gray-900">{selectedBooking.customerName}</p>
                    <p className="text-sm text-gray-500">{selectedBooking.phone}</p>
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Vehicle</p>
                    <p className="font-bold text-gray-900">
                      {(selectedBooking.vehicle || (selectedBooking.vehicleType === 'motorcycle' ? selectedBooking.motorcycle : selectedBooking.car))?.brand}{' '}
                      {(selectedBooking.vehicle || (selectedBooking.vehicleType === 'motorcycle' ? selectedBooking.motorcycle : selectedBooking.car))?.model}
                    </p>
                    <p className="text-sm text-[var(--brand)] font-black uppercase tracking-widest">{selectedBooking.vehicleType}</p>
                  </div>
                </div>
                
                <div className="p-6 bg-gray-50 rounded-3xl flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pick-up</p>
                    <p className="text-sm font-bold text-gray-900">{selectedBooking.pickupCity}</p>
                    <p className="text-xs text-gray-500">{new Date(selectedBooking.pickupAt).toLocaleString()}</p>
                  </div>
                  <ChevronRight className="text-gray-300" />
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Return</p>
                    <p className="text-sm font-bold text-gray-900">{selectedBooking.returnCity}</p>
                    <p className="text-xs text-gray-500">{new Date(selectedBooking.returnAt).toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paid</p>
                    <p className="text-3xl font-black text-gray-900">{selectedBooking.price.toLocaleString()} MAD</p>
                  </div>
                  <button 
                    onClick={() => { setPrintingBooking(selectedBooking); setTimeout(() => window.print(), 100); }}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all"
                  >
                    <Printer size={18} /> Print Agreement
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Printing Agreement Container */}
      {printingBooking && (
        <div className="hidden print:block fixed inset-0 z-[9999] bg-white">
          <RentalAgreement booking={printingBooking} />
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          #rental-agreement, #rental-agreement * { visibility: visible; }
          #rental-agreement { position: absolute; left: 0; top: 0; width: 100%; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
