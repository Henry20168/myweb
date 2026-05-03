"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Car, 
  Bike, 
  CalendarDays, 
  MessageSquare, 
  Users, 
  Tag, 
  PlusCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  X
} from "lucide-react";
import { AdminTab } from "@/types/admin";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ 
  activeTab, 
  onTabChange, 
  onLogout, 
  isCollapsed, 
  onToggle,
  isMobileOpen,
  onMobileClose
}: AdminSidebarProps) {

  const menuItems = [
    { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manage', label: 'Vehicles', icon: Car },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'support', label: 'Support', icon: MessageSquare },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  ];

  const addItems = [
    { id: 'add', label: 'Add Car', icon: PlusCircle },
    { id: 'add-motorcycle', label: 'Add Bike', icon: Bike },
  ];

  const handleTabClick = (id: AdminTab) => {
    onTabChange(id);
    if (onMobileClose) onMobileClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside 
         initial={false}
         animate={{ 
           width: (typeof window !== 'undefined' && window.innerWidth < 768) ? 260 : (isCollapsed ? 80 : 260),
           x: typeof window !== 'undefined' && window.innerWidth < 768 
             ? (isMobileOpen ? 0 : -260) 
             : 0
         }}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col transition-all duration-300 ease-in-out ${
          isMobileOpen ? 'shadow-2xl' : ''
        }`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center justify-between">
          {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-black tracking-tighter text-gray-900"
            >
              ADMIN<span className="text-[var(--brand)]">PANEL</span>
            </motion.div>
          )}
          <button 
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors md:block hidden"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          
          {/* Mobile Close Button */}
          <button 
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar">
          <div className="mb-4">
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>}
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? "bg-[var(--brand)] text-white shadow-lg shadow-red-500/20" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-gray-500"} />
                {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100">
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Inventory</p>}
            {addItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id as AdminTab)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === item.id 
                    ? "bg-[var(--brand)] text-white shadow-lg shadow-red-500/20" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={isCollapsed ? item.label : ""}
              >
                <item.icon size={20} className={activeTab === item.id ? "text-white" : "text-gray-500"} />
                {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && <span className="font-medium text-sm">{item.label}</span>}
              </button>
            ))}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200"
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut size={20} />
            {(!isCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
