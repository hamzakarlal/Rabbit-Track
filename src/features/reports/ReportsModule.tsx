import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { 
  FileText, 
  Download, 
  Printer, 
  PieChart, 
  TrendingUp, 
  Users, 
  HeartHandshake, 
  Wheat, 
  CheckCircle2 
} from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

export const ReportsModule: React.FC = () => {
  const { 
    rabbits, 
    breedingRecords, 
    kindlingRecords, 
    healthRecords, 
    vaccinations, 
    feedingRecords, 
    expenses, 
    sales, 
    inventory, 
    stats 
  } = useFarm();

  const [dateRange, setDateRange] = useState<'this_month' | 'this_year' | 'all'>('this_month');

  // Compute Breeding KPIs
  const totalBreedingAttempts = breedingRecords.length;
  const successfulBreeds = breedingRecords.filter(b => b.status === 'Kindled' || b.status === 'Successful').length;
  const breedSuccessRate = totalBreedingAttempts > 0 ? Math.round((successfulBreeds / totalBreedingAttempts) * 100) : 0;

  // Kits stats
  const totalKitsRecorded = kindlingRecords.reduce((acc, k) => acc + k.totalKits, 0);
  const totalLiveKits = kindlingRecords.reduce((acc, k) => acc + k.liveKits, 0);
  const avgLitterSize = kindlingRecords.length > 0 ? (totalKitsRecorded / kindlingRecords.length).toFixed(1) : '0';
  const overallKitSurvival = totalKitsRecorded > 0 ? Math.round((totalLiveKits / totalKitsRecorded) * 100) : 0;

  // Inventory value
  const totalInventoryValue = inventory.reduce((acc, i) => acc + (i.quantity * (i.purchasePrice || 0)), 0);

  const handleExportCSV = () => {
    // Generate readable CSV report of rabbits & farm financials
    const headers = ['Rabbit ID', 'Name', 'Gender', 'Breed', 'Status', 'Weight(kg)', 'Cage', 'DOB'];
    const rows = rabbits.map(r => [
      `"${r.rabbitId}"`,
      `"${r.name}"`,
      `"${r.gender}"`,
      `"${r.breed}"`,
      `"${r.status}"`,
      r.weight,
      `"${r.cageNumber}"`,
      `"${r.dateOfBirth}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rabbit_track_herd_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Farm Performance Reports</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Comprehensive production metrics, kit survival ratios, feed conversion, and financial statements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-700/20 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Financial Executive Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-semibold uppercase">Total Sales Revenue</span>
          <span className="text-2xl font-black text-emerald-400 mt-1 block">
            {formatCurrency(stats.totalSales)}
          </span>
          <span className="text-[11px] text-slate-500">From meat, breeding, & kit sales</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-semibold uppercase">Operating Expenses</span>
          <span className="text-2xl font-black text-rose-400 mt-1 block">
            {formatCurrency(stats.totalExpenses)}
          </span>
          <span className="text-[11px] text-slate-500">Feed, medicine, equipment & cages</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-semibold uppercase">Net Farm Profit</span>
          <span className={`text-2xl font-black mt-1 block ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(stats.netProfit)}
          </span>
          <span className="text-[11px] text-slate-500">Gross Margin: {stats.totalSales > 0 ? Math.round((stats.netProfit / stats.totalSales) * 100) : 0}%</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-semibold uppercase">Total Inventory Asset Value</span>
          <span className="text-2xl font-black text-teal-400 mt-1 block">
            {formatCurrency(totalInventoryValue)}
          </span>
          <span className="text-[11px] text-slate-500">Current on-hand feed & supplies</span>
        </div>
      </div>

      {/* Production & Breeding Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Breeding & Litter Performance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <HeartHandshake className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-base text-white">Breeding & Kindling Performance</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750">
              <span className="text-slate-400 block text-[11px]">Total Pairings Recorded</span>
              <span className="text-xl font-bold text-white">{totalBreedingAttempts}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750">
              <span className="text-slate-400 block text-[11px]">Breeding Success Rate</span>
              <span className="text-xl font-bold text-pink-400">{breedSuccessRate}%</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750">
              <span className="text-slate-400 block text-[11px]">Total Kits Born</span>
              <span className="text-xl font-bold text-white">{totalKitsRecorded}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750">
              <span className="text-slate-400 block text-[11px]">Average Litter Size</span>
              <span className="text-xl font-bold text-emerald-400">{avgLitterSize} kits / doe</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 col-span-2">
              <span className="text-slate-400 block text-[11px]">Kit Survival to Weaning</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-lg font-black text-emerald-400">{overallKitSurvival}%</span>
                <span className="text-slate-400 text-xs">({totalLiveKits} live kits)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Herd Demographics & Distribution */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Herd Demographics & Composition</h3>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750">
              <span className="text-slate-400 block text-[11px]">Active Breeding Bucks</span>
              <span className="text-xl font-bold text-blue-400">{stats.bucks}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750">
              <span className="text-slate-400 block text-[11px]">Active Breeding Does</span>
              <span className="text-xl font-bold text-pink-400">{stats.does}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750">
              <span className="text-slate-400 block text-[11px]">Growing Kits / Weaners</span>
              <span className="text-xl font-bold text-amber-400">{stats.kits}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750">
              <span className="text-slate-400 block text-[11px]">Buck-to-Doe Ratio</span>
              <span className="text-xl font-bold text-white">
                1 : {stats.bucks > 0 ? (stats.does / stats.bucks).toFixed(1) : stats.does}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 col-span-2">
              <span className="text-slate-400 block text-[11px]">Herd Health Status</span>
              <div className="flex items-center justify-between mt-1">
                <span className="text-emerald-400 font-bold">{rabbits.length - stats.sickRabbits} Healthy</span>
                <span className="text-rose-400 font-bold">{stats.sickRabbits} Sick / Quarantine</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
