"use client";

import { motion } from "framer-motion";
import { 
  Car, 
  Bike, 
  Calendar, 
  MessageSquare, 
  ArrowUpRight, 
  TrendingUp,
  Clock,
  Plus
} from "lucide-react";
import { AdminStats, AdminTab } from "@/types/admin";

interface AdminDashboardProps {
  stats: AdminStats | null;
  onTabChange: (tab: AdminTab) => void;
}

export default function AdminDashboard({ stats, onTabChange }: AdminDashboardProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const quickActions = [
    { label: 'Add New Car', icon: Plus, tab: 'add', color: 'bg-blue-500' },
    { label: 'View Bookings', icon: Calendar, tab: 'bookings', color: 'bg-purple-500' },
    { label: 'Manage Offers', icon: TrendingUp, tab: 'offers', color: 'bg-orange-500' },
    { label: 'Check Messages', icon: MessageSquare, tab: 'support', color: 'bg-green-500' },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <Car size={24} />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} /> 12%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Cars</h3>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats?.counts?.cars ?? 0}</p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Bike size={24} />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} /> 8%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Motorcycles</h3>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats?.counts?.motorcycles ?? 0}</p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <Calendar size={24} />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} /> 24%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Bookings</h3>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats?.counts?.bookings ?? 0}</p>
        </motion.div>

        <motion.div variants={item} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <MessageSquare size={24} />
            </div>
            <span className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
              <Clock size={12} /> 5 new
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Support Messages</h3>
          <p className="text-2xl font-black text-gray-900 mt-1">{stats?.counts?.messages ?? 0}</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-900">Inventory Distribution</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-gray-50 rounded-lg text-xs font-medium text-gray-500 border border-gray-100">Last 30 Days</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">By Category</p>
                <div className="space-y-4">
                  {stats?.categories?.map((cat) => {
                    const max = Math.max(...stats.categories.map((c) => c._count.id));
                    const percent = (cat._count.id / max) * 100;
                    return (
                      <div key={cat.category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-700">{cat.category || 'Other'}</span>
                          <span className="text-gray-400">{cat._count.id}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            className="h-full bg-[var(--brand)] rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">By Brand</p>
                <div className="space-y-4">
                  {stats?.brands?.map((brand) => {
                    const max = Math.max(...stats.brands.map((b) => b._count.id));
                    const percent = (brand._count.id / max) * 100;
                    return (
                      <div key={brand.brand} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold text-gray-700">{brand.brand}</span>
                          <span className="text-gray-400">{brand._count.id}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            className="h-full bg-gray-900 rounded-full"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-gray-900">Recent Bookings</h3>
              <button 
                onClick={() => onTabChange('bookings')}
                className="text-sm font-bold text-[var(--brand)] hover:underline flex items-center gap-1"
              >
                View All <ArrowUpRight size={14} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Customer</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Vehicle</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Dates</th>
                    <th className="pb-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats?.latestBookings?.slice(0, 5).map((b) => (
                    <tr key={b.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-gray-900">{b.customerName}</div>
                        <div className="text-xs text-gray-400">{b.phone}</div>
                      </td>
                      <td className="py-4">
                        <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase text-gray-600 mr-2">
                          {b.vehicleType}
                        </span>
                        <span className="text-sm text-gray-600">ID #{b.carId || b.motorcycleId}</span>
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-gray-600">
                          {new Date(b.pickupAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} - {new Date(b.returnAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        <div className="font-black text-gray-900">{b.price.toLocaleString()} MAD</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions & Tasks */}
        <div className="space-y-8">
          <motion.div variants={item} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => onTabChange(action.tab as AdminTab)}
                  className="p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 border border-transparent hover:border-gray-100 transition-all group text-left"
                >
                  <div className={`p-2 w-fit rounded-lg ${action.color} text-white mb-3 group-hover:scale-110 transition-transform`}>
                    <action.icon size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-900 block leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-gray-900 p-8 rounded-3xl shadow-xl shadow-gray-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={120} />
            </div>
            <div className="relative z-10">
              <h3 className="text-white text-lg font-bold mb-2">Grow your fleet</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">Add more vehicles to your inventory to reach more customers this season.</p>
              <button 
                onClick={() => onTabChange('add')}
                className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} /> Add New Vehicle
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
