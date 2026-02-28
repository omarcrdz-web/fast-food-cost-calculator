import React from 'react';
import { LayoutDashboard, ShoppingCart, Utensils, Calculator } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ingredients', label: 'Ingredientes', icon: ShoppingCart },
    { id: 'recipes', label: 'Recetas', icon: Utensils },
    { id: 'converter', label: 'Convertidor', icon: Calculator },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen pt-16 md:pt-0">
      <div className="p-6 hidden md:block">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-400">FastFood Cost</h1>
        <p className="text-xs text-slate-400 mt-1">Calculadora de Costos</p>
      </div>
      <nav className="flex-1 px-4 py-4 md:py-0 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">© 2026 FastFood Cost</p>
      </div>
    </div>
  );
};
