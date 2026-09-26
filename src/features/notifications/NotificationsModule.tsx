import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Filter, 
  Syringe, 
  Heart, 
  AlertTriangle, 
  DollarSign, 
  Baby, 
  Stethoscope 
} from 'lucide-react';
import { FarmNotification } from '../../types';

export const NotificationsModule: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    deleteNotification 
  } = useFarm();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = notifications.filter(n => {
    if (categoryFilter === 'all') return true;
    return n.category === categoryFilter;
  });

  const getNotificationIcon = (cat: FarmNotification['category']) => {
    switch (cat) {
      case 'Vaccination':
        return <Syringe className="w-4 h-4 text-emerald-400" />;
      case 'Kindling':
        return <Baby className="w-4 h-4 text-pink-400" />;
      case 'Low Inventory':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'Breeding':
        return <Heart className="w-4 h-4 text-purple-400" />;
      case 'Health':
        return <Stethoscope className="w-4 h-4 text-rose-400" />;
      case 'Sale':
        return <DollarSign className="w-4 h-4 text-teal-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Farm Alerts & Reminders</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            FCM push reminders for kindling gestation, vaccination schedules, and low stock warnings
          </p>
        </div>

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={() => markAllNotificationsAsRead()}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All As Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Filter category:</span>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
        >
          <option value="all">All Alerts</option>
          <option value="Kindling">Kindling Reminders</option>
          <option value="Vaccination">Vaccination Boosters</option>
          <option value="Low Inventory">Low Inventory</option>
          <option value="Health">Health Follow-ups</option>
          <option value="Sale">Sale Confirmations</option>
        </select>
      </div>

      {/* Notification List */}
      {filtered.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center text-slate-400">
          <Bell className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-white">All caught up!</p>
          <p className="text-xs text-slate-500 mt-1">No alerts matching this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                item.isRead 
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-400' 
                  : 'bg-slate-900 border-emerald-500/30 text-slate-200 shadow-md'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-slate-800 border border-slate-700/60 mt-0.5">
                  {getNotificationIcon(item.category)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{item.title}</h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span>Date: {item.date}</span>
                    <span>•</span>
                    <span className="capitalize">Category: {item.category}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {!item.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(item.id)}
                    title="Mark Read"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-emerald-400 text-xs transition"
                  >
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(item.id)}
                  title="Delete Alert"
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-600 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
