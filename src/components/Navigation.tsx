import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Rabbit, 
  HeartHandshake, 
  Stethoscope, 
  Wheat, 
  DollarSign, 
  Boxes, 
  Bell, 
  Settings, 
  User,
  Bot,
  Sparkles,
  Search
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { GlobalRabbitSearch } from './GlobalRabbitSearch';
import { Rabbit as RabbitType } from '../types';

export type NavTab = 
  | 'dashboard'
  | 'rabbits'
  | 'breeding'
  | 'health'
  | 'feeding'
  | 'sales'
  | 'inventory'
  | 'reports'
  | 'notifications'
  | 'profile';

interface NavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onSelectRabbit: (rabbit: RabbitType) => void;
  onOpenChat: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentTab, 
  onTabChange, 
  onSelectRabbit,
  onOpenChat 
}) => {
  const { notifications } = useFarm();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'rabbits', label: 'Rabbits', icon: <Rabbit className="w-5 h-5" /> },
    { id: 'breeding', label: 'Breeding', icon: <HeartHandshake className="w-5 h-5" /> },
    { id: 'health', label: 'Health', icon: <Stethoscope className="w-5 h-5" /> },
    { id: 'feeding', label: 'Feeding', icon: <Wheat className="w-5 h-5" /> },
    { id: 'sales', label: 'Sales', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'inventory', label: 'Inventory', icon: <Boxes className="w-5 h-5" /> },
    { id: 'notifications', label: 'Alerts', icon: <Bell className="w-5 h-5" />, badge: unreadCount },
    { id: 'profile', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Top Mobile Bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-4 py-2.5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-lg">
              🐇
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-100 tracking-tight leading-tight">Rabbit Track</h1>
              <span className="text-[10px] text-emerald-400 font-medium">Farm Manager</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Barny AI Chat Button */}
            <button
              onClick={onOpenChat}
              className="p-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              title="Ask Barny AI"
            >
              <Bot className="w-4 h-4" />
            </button>

            {/* Toggle Mobile Search */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className={`p-2 rounded-xl border transition ${
                mobileSearchOpen 
                  ? 'bg-emerald-600 text-white border-emerald-500' 
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <Search className="w-4 h-4" />
            </button>

            <button
              onClick={() => onTabChange('notifications')}
              className="relative p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onTabChange('profile')}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Mobile Global Search Bar */}
        {mobileSearchOpen && (
          <div className="pt-1 pb-1">
            <GlobalRabbitSearch 
              onSelectRabbit={(rabbit) => {
                onSelectRabbit(rabbit);
                setMobileSearchOpen(false);
              }} 
            />
          </div>
        )}
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-800 bg-slate-900/90 backdrop-blur-xl p-4 shrink-0">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-xl shadow-md shadow-emerald-600/20">
            🐇
          </div>
          <div>
            <h2 className="font-black text-lg text-white tracking-tight leading-none">Rabbit Track</h2>
            <p className="text-xs text-emerald-400 font-semibold mt-1">Track. Breed. Grow.</p>
          </div>
        </div>

        {/* Global Rabbit Search Bar (Requirement: Global search bar in navigation header) */}
        <div className="my-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1 block">
            Quick Rabbit Search
          </label>
          <GlobalRabbitSearch onSelectRabbit={onSelectRabbit} />
        </div>

        {/* Barny AI Chat Shortcut Banner */}
        <button
          onClick={onOpenChat}
          className="my-2 p-2.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-850 border border-emerald-500/30 hover:border-emerald-500/50 flex items-center justify-between text-left group transition shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-white group-hover:text-emerald-300">Ask Barny AI</span>
                <Sparkles className="w-3 h-3 text-emerald-400" />
              </div>
              <p className="text-[10px] text-slate-400">Rabbitry Cuniculture Expert</p>
            </div>
          </div>
        </button>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 overflow-y-auto mt-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-emerald-800' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System info status footer */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cloud & AI Online</span>
          </div>
          <span className="font-mono text-[10px]">v1.2.0</span>
        </div>
      </aside>

      {/* Bottom Navigation for Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex justify-around items-center">
        {[
          { id: 'dashboard' as NavTab, label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
          { id: 'rabbits' as NavTab, label: 'Rabbits', icon: <Rabbit className="w-5 h-5" /> },
          { id: 'breeding' as NavTab, label: 'Breeding', icon: <HeartHandshake className="w-5 h-5" /> },
          { id: 'health' as NavTab, label: 'Health', icon: <Stethoscope className="w-5 h-5" /> },
          { id: 'feeding' as NavTab, label: 'Feeding', icon: <Wheat className="w-5 h-5" /> },
          { id: 'sales' as NavTab, label: 'Sales', icon: <DollarSign className="w-5 h-5" /> },
          { id: 'inventory' as NavTab, label: 'Stock', icon: <Boxes className="w-5 h-5" /> },
        ].map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition ${
                isActive ? 'text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-500/10' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
