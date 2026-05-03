"use client";

import { Bell, Search, User, Menu } from "lucide-react";
import { AdminTab } from "@/types/admin";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onMenuClick?: () => void;
}

export default function AdminHeader({ activeTab, onMenuClick }: AdminHeaderProps) {
  const tabTitles: Record<AdminTab, string> = {
    analytics: 'Dashboard Overview',
    manage: 'Inventory Management',
    bookings: 'Reservations & Bookings',
    clients: 'Customer Directory',
    support: 'Support Center',
    add: 'Add New Car',
    'add-motorcycle': 'Add New Motorcycle',
    offers: 'Special Offers',
    tasks: 'Task Management'
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 md:hidden"
        >
          <Menu size={24} />
        </button>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">{tabTitles[activeTab]}</h1>
          <p className="text-[10px] md:text-sm text-gray-500">Welcome back, Administrator</p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search everything..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 w-64 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button className="p-2 md:p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors relative">
            <Bell size={18} className="md:w-5 md:h-5" />
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-gradient-to-tr from-gray-900 to-gray-700 flex items-center justify-center text-white shadow-lg shadow-gray-200">
            <User size={18} className="md:w-5 md:h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
