import React from 'react';
import { LayoutDashboard, Droplets, BarChart3, MessageSquareText, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventory & Tanks', icon: Droplets },
    { id: 'sales', label: 'Sales & Logs', icon: BarChart3 },
    { id: 'assistant', label: 'AI Analyst', icon: MessageSquareText },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300">
      <div className="p-6 flex items-center justify-center lg:justify-start border-b border-slate-800">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl mr-0 lg:mr-3">
          F
        </div>
        <span className="font-bold text-xl hidden lg:block tracking-tight">FuelOps</span>
      </div>

      <nav className="flex-1 mt-6 px-2 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center p-3 rounded-lg transition-colors duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={22} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="ml-3 hidden lg:block font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <Settings size={22} />
          <span className="ml-3 hidden lg:block font-medium">Settings</span>
        </button>
      </div>
    </div>
  );
};