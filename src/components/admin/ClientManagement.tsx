"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  CreditCard, 
  Star,
  Edit2,
  Trash2,
  MoreVertical
} from "lucide-react";
import { Client } from "@/types/admin";

interface ClientManagementProps {
  clients: Client[];
  clientForm: Partial<Client>;
  setClientForm: (form: Partial<Client>) => void;
  onSave: () => void;
  onUpdateStatus: (client: Client, status: Client['status']) => void;
  selectedClient: Client | null;
  setSelectedClient: (client: Client | null) => void;
}

export default function ClientManagement({
  clients,
  clientForm,
  setClientForm,
  onSave,
  onUpdateStatus,
  selectedClient,
  setSelectedClient
}: ClientManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(c => 
    c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Client List */}
      <div className={`lg:col-span-5 space-y-6 ${selectedClient ? 'hidden lg:block' : 'block'}`}>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
          
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Saved Customers ({clients.length})</h3>
            <button 
              onClick={() => {
                setClientForm({
                  fullName: '', phone: '', email: '', city: '', address: '',
                  nationality: '', idType: 'National ID', idNumber: '', notes: '', status: 'active'
                });
                setSelectedClient(null);
              }}
              className="text-xs font-bold text-[var(--brand)] flex items-center gap-1 hover:underline"
            >
              <UserPlus size={14} /> New Client
            </button>
          </div>
        </div>

        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto no-scrollbar pr-1">
          {filteredClients.map((client) => (
            <motion.div
              layout
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`group p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                selectedClient?.id === client.id 
                  ? "bg-white border-red-500 shadow-xl shadow-red-500/5 ring-1 ring-red-500" 
                  : "bg-white border-gray-100 hover:border-gray-300 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-black text-gray-900">{client.fullName}</h4>
                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                  client.status === 'vip' ? 'bg-amber-100 text-amber-700' :
                  client.status === 'blocked' ? 'bg-red-100 text-red-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {client.status}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-xs font-bold text-gray-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Phone size={12} /> {client.phone}</span>
                {client.email && <span className="flex items-center gap-1.5"><Mail size={12} /> {client.email}</span>}
              </div>
              
              {selectedClient?.id === client.id && (
                <motion.div 
                  layoutId="active-indicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"
                />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Column: Detail & Form */}
      <div className={`lg:col-span-7 ${!selectedClient && !clientForm.id && (clientForm.fullName === '' || !clientForm.fullName) ? 'hidden lg:block' : 'block'}`}>
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {selectedClient ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setSelectedClient(null)}
                        className="p-2 -ml-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 lg:hidden"
                      >
                        <MoreVertical size={20} className="rotate-90" />
                      </button>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-3xl font-black text-gray-900 tracking-tight">{selectedClient.fullName}</h2>
                          {selectedClient.status === 'vip' && <Star className="text-amber-400 fill-amber-400" size={24} />}
                        </div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">Customer Profile</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setClientForm(selectedClient);
                          setSelectedClient(null);
                        }}
                        className="p-3 bg-gray-50 text-gray-600 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button className="p-3 bg-gray-50 text-red-600 rounded-2xl hover:bg-red-50 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Information</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Phone size={14} /></div>
                            {selectedClient.phone}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Mail size={14} /></div>
                            {selectedClient.email || 'No email provided'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Identity & Nationality</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><CreditCard size={14} /></div>
                            {selectedClient.idType}: {selectedClient.idNumber || 'N/A'}
                          </div>
                          <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Globe size={14} /></div>
                            {selectedClient.nationality || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 text-sm font-bold text-gray-700">
                            <div className="p-2 bg-gray-50 text-gray-600 rounded-lg"><MapPin size={14} /></div>
                            {selectedClient.city || 'N/A'}
                          </div>
                          <p className="text-xs text-gray-500 ml-10 leading-relaxed">
                            {selectedClient.address || 'No full address provided'}
                          </p>
                        </div>
                      </div>
                      
                      {selectedClient.notes && (
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Internal Notes</p>
                          <div className="p-4 bg-gray-50 rounded-2xl">
                            <p className="text-xs text-gray-600 leading-relaxed italic">&quot;{selectedClient.notes}&quot;</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => onUpdateStatus(selectedClient, selectedClient.status === 'vip' ? 'active' : 'vip')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          selectedClient.status === 'vip' 
                            ? "bg-amber-100 text-amber-700" 
                            : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-amber-700"
                        }`}
                      >
                        {selectedClient.status === 'vip' ? 'Remove VIP' : 'Mark as VIP'}
                      </button>
                      <button 
                        onClick={() => onUpdateStatus(selectedClient, selectedClient.status === 'blocked' ? 'active' : 'blocked')}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          selectedClient.status === 'blocked' 
                            ? "bg-red-500 text-white shadow-lg shadow-red-200" 
                            : "bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600"
                        }`}
                      >
                        {selectedClient.status === 'blocked' ? 'Unblock Account' : 'Block Account'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                      {clientForm.id ? 'Edit Customer Profile' : 'Add New Customer'}
                    </h2>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">
                      {clientForm.id ? 'Update existing records' : 'Create a new entry in your directory'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        value={clientForm.fullName || ''}
                        onChange={(e) => setClientForm({...clientForm, fullName: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        value={clientForm.phone || ''}
                        onChange={(e) => setClientForm({...clientForm, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="+212 6..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        value={clientForm.email || ''}
                        onChange={(e) => setClientForm({...clientForm, email: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nationality</label>
                      <input 
                        value={clientForm.nationality || ''}
                        onChange={(e) => setClientForm({...clientForm, nationality: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="Moroccan"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID Type</label>
                      <select 
                        value={clientForm.idType || 'National ID'}
                        onChange={(e) => setClientForm({...clientForm, idType: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      >
                        <option>National ID</option>
                        <option>Passport</option>
                        <option>Driver License</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ID Number</label>
                      <input 
                        value={clientForm.idNumber || ''}
                        onChange={(e) => setClientForm({...clientForm, idNumber: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="AB123456"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Notes / Preferences</label>
                      <textarea 
                        value={clientForm.notes || ''}
                        onChange={(e) => setClientForm({...clientForm, notes: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        placeholder="Any specific notes about this customer..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      onClick={() => {
                        setClientForm({});
                        setSelectedClient(null);
                      }}
                      className="px-6 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={onSave}
                      className="px-8 py-3 bg-[var(--brand)] text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
                    >
                      {clientForm.id ? 'Update Customer' : 'Save Customer'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
