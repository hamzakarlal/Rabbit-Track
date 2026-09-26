import React from 'react';
import { 
  Users, 
  Heart, 
  Baby, 
  TrendingUp, 
  AlertCircle, 
  Syringe, 
  Package, 
  ArrowUpRight, 
  PlusCircle, 
  Activity,
  HeartHandshake,
  DollarSign,
  Wheat,
  Stethoscope,
  Sparkles,
  QrCode
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/calculations';
import { NavTab } from '../../components/Navigation';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenQuickAction: (actionType: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onOpenQuickAction }) => {
  const { profile } = useAuth();
  const { 
    rabbits, 
    breedingRecords, 
    stats, 
    notifications, 
    seedFarmData, 
    isLoading 
  } = useFarm();

  const [seeding, setSeeding] = React.useState(false);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedFarmData();
    } catch (e) {
      console.error(e);
    } finally {
      setSeeding(false);
    }
  };

  const upcomingKindlings = breedingRecords.filter(b => b.status === 'Active');
  const sickRabbitsList = rabbits.filter(r => r.status === 'Sick');

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      {/* Farm Top Greeting & Seed trigger banner */}
      <div className="bg-gradient-to-r from-emerald-900/60 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🐇</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {profile?.farmName || 'Rabbit Track Farm'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Welcome back, <span className="text-emerald-400 font-semibold">{profile?.fullName || 'Farmer'}</span>. Here is your herd summary for today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {rabbits.length === 0 && !isLoading && (
              <button
                onClick={handleSeed}
                disabled={seeding}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-emerald-700/20 transition disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{seeding ? 'Generating Sample Herd...' : 'Populate Sample Herd'}</span>
              </button>
            )}
            <button
              onClick={() => onOpenQuickAction('add-rabbit')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs flex items-center gap-2 transition"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Register Rabbit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons Grid (Requirement #39) */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
          Quick Farm Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {[
            { id: 'add-rabbit', label: 'Add Rabbit', icon: <PlusCircle className="w-4 h-4 text-emerald-400" /> },
            { id: 'record-breeding', label: 'Record Breeding', icon: <HeartHandshake className="w-4 h-4 text-pink-400" /> },
            { id: 'record-kindling', label: 'Record Kindling', icon: <Baby className="w-4 h-4 text-amber-400" /> },
            { id: 'add-health', label: 'Health Care', icon: <Stethoscope className="w-4 h-4 text-rose-400" /> },
            { id: 'record-feeding', label: 'Feed Herd', icon: <Wheat className="w-4 h-4 text-lime-400" /> },
            { id: 'record-sale', label: 'New Sale', icon: <DollarSign className="w-4 h-4 text-teal-400" /> },
            { id: 'add-expense', label: 'Log Expense', icon: <TrendingUp className="w-4 h-4 text-cyan-400" /> },
          ].map((action) => (
            <button
              key={action.id}
              onClick={() => onOpenQuickAction(action.id)}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition group"
            >
              <div className="p-1.5 rounded-lg bg-slate-800 group-hover:bg-slate-750 transition">
                {action.icon}
              </div>
              <span className="text-xs font-semibold text-slate-300 group-hover:text-white truncate">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Rabbits */}
        <div 
          onClick={() => onNavigate('rabbits')}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 transition shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Rabbits</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {stats.totalRabbits}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="text-emerald-400 font-medium">{stats.bucks} Bucks</span>
            <span>•</span>
            <span className="text-teal-400 font-medium">{stats.does} Does</span>
            <span>•</span>
            <span className="text-amber-400 font-medium">{stats.kits} Kits</span>
          </div>
        </div>

        {/* Breeding & Kindling */}
        <div 
          onClick={() => onNavigate('breeding')}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-pink-500/40 rounded-2xl p-4 sm:p-5 transition shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Pregnancies</span>
            <Heart className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-pink-400">
            {stats.activePregnancies}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {stats.pregnantDoes} does confirmed pregnant
          </div>
        </div>

        {/* Financial Net Revenue */}
        <div 
          onClick={() => onNavigate('sales')}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-4 sm:p-5 transition shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Estimated Net Profit</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className={`text-2xl sm:text-3xl font-extrabold ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(stats.netProfit)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Sales: <span className="text-slate-200">{formatCurrency(stats.totalSales)}</span> | Costs: <span className="text-slate-200">{formatCurrency(stats.totalExpenses)}</span>
          </div>
        </div>

        {/* Health / Stock Alerts */}
        <div 
          onClick={() => onNavigate('health')}
          className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 transition shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Care & Alerts</span>
            <AlertCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {stats.sickRabbits + stats.lowStockCount + stats.overdueVaccinationsCount}
            </span>
            <span className="text-xs text-amber-400 font-medium">attention items</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            {stats.sickRabbits} sick • {stats.lowStockCount} low stock • {stats.overdueVaccinationsCount} due vacc
          </div>
        </div>

      </div>

      {/* Main Grid: Active Breeds & Upcoming Kindlings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Upcoming Kindlings & Breeding Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-pink-400" />
                <h3 className="font-bold text-base text-white">Upcoming Kindlings & Gestation</h3>
              </div>
              <button 
                onClick={() => onNavigate('breeding')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {upcomingKindlings.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">
                <p>No active breeding records currently in gestation.</p>
                <button
                  onClick={() => onOpenQuickAction('record-breeding')}
                  className="mt-2 text-xs text-emerald-400 font-medium hover:underline"
                >
                  + Record a Breeding Match
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingKindlings.map((record) => {
                  const breedingDate = new Date(record.breedingDate);
                  const expectedDate = new Date(record.expectedKindlingDate);
                  const today = new Date();
                  const totalDays = 31;
                  const elapsedDays = Math.min(totalDays, Math.max(0, Math.floor((today.getTime() - breedingDate.getTime()) / (1000 * 60 * 60 * 24))));
                  const daysRemaining = Math.max(0, Math.ceil((expectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
                  const progressPct = Math.round((elapsedDays / totalDays) * 100);

                  return (
                    <div 
                      key={record.id}
                      className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-white">{record.doeName}</span>
                          <span className="text-xs text-slate-400 font-mono">({record.doeId})</span>
                          <span className="text-xs text-pink-400">×</span>
                          <span className="text-xs text-slate-300">{record.buckName}</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Bred: {record.breedingDate} • Expected: <strong className="text-emerald-400">{record.expectedKindlingDate}</strong>
                        </div>
                      </div>

                      <div className="sm:w-48 shrink-0">
                        <div className="flex justify-between text-[11px] mb-1 font-medium">
                          <span className="text-slate-400">Day {elapsedDays} / 31</span>
                          <span className={daysRemaining <= 3 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                            {daysRemaining === 0 ? 'Due Today!' : `${daysRemaining} days left`}
                          </span>
                        </div>
                        <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              daysRemaining <= 3 ? 'bg-gradient-to-r from-pink-500 to-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Herd Breed Distribution & Inventory snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Sick & Care Watchlist */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-rose-400" />
                  <h4 className="font-bold text-sm text-white">Infirmary / Sick Watch</h4>
                </div>
                <button
                  onClick={() => onNavigate('health')}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Manage
                </button>
              </div>

              {sickRabbitsList.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs">
                  ✅ All rabbits currently healthy & active.
                </div>
              ) : (
                <div className="space-y-2">
                  {sickRabbitsList.map((r) => (
                    <div key={r.id} className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-rose-300">{r.name} ({r.rabbitId})</div>
                        <div className="text-slate-400 text-[11px]">Cage: {r.cageNumber}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/30 text-rose-300">
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feeding & Expenses Snapshot */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-lime-400" />
                  <h4 className="font-bold text-sm text-white">Feed & Stock Monitor</h4>
                </div>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Manage
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
                  <span className="text-slate-400">Total Feed Cost Logged:</span>
                  <span className="font-bold text-white">{formatCurrency(stats.feedExpense)}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
                  <span className="text-slate-400">Medicine & Vaccines:</span>
                  <span className="font-bold text-white">{formatCurrency(stats.medicineExpense)}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
                  <span className="text-slate-400">Low Stock Alert Count:</span>
                  <span className={`font-bold ${stats.lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {stats.lowStockCount} items
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right 1 Col: Recent Alerts & Notifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-white">Recent Alerts</h3>
            <button
              onClick={() => onNavigate('notifications')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              All Alerts
            </button>
          </div>

          <div className="flex-1 space-y-3">
            {notifications.slice(0, 5).map((n) => (
              <div
                key={n.id}
                className={`p-3 rounded-xl border text-xs transition ${
                  n.isRead 
                    ? 'bg-slate-800/40 border-slate-800 text-slate-400' 
                    : 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-emerald-400">{n.title}</span>
                  <span className="text-[10px] text-slate-500">{n.date}</span>
                </div>
                <p className="line-clamp-2 text-slate-300 text-[11px] leading-relaxed">
                  {n.message}
                </p>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs">
                No new farm alerts or notifications.
              </div>
            )}
          </div>

          {/* Herd QR code quick shortcut */}
          <div className="mt-4 pt-4 border-t border-slate-800">
            <button
              onClick={() => onNavigate('rabbits')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition"
            >
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Browse Rabbits & QR Ear Tags</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
