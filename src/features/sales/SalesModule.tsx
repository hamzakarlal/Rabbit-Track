import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { 
  DollarSign, 
  Plus, 
  Trash2, 
  ShoppingBag, 
  User, 
  Phone, 
  Scale, 
  CheckCircle,
  X 
} from 'lucide-react';
import { SaleRecord, SaleType, PaymentStatus } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface SalesModuleProps {
  onOpenSaleModal: () => void;
}

export const SalesModule: React.FC<SalesModuleProps> = ({ onOpenSaleModal }) => {
  const { sales, deleteSale, stats } = useFarm();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredSales = sales.filter(s => {
    if (filterType === 'all') return true;
    return s.saleType === filterType;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Sales & Revenue</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Record meat rabbits, breeding stock pairs, kit sales, and track customer receipts
          </p>
        </div>

        <button
          onClick={onOpenSaleModal}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-700/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Sale</span>
        </button>
      </div>

      {/* Sales Summary Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Total Gross Revenue</span>
          <span className="text-2xl font-black text-emerald-400">{formatCurrency(stats.totalSales)}</span>
          <span className="text-[11px] text-slate-500 block mt-1">From {sales.length} transactions</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Net Profit Margin</span>
          <span className={`text-2xl font-black ${stats.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {formatCurrency(stats.netProfit)}
          </span>
          <span className="text-[11px] text-slate-500 block mt-1">Revenue minus all expenses</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block font-medium">Rabbits Sold</span>
          <span className="text-2xl font-black text-teal-400">{stats.soldRabbits}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Stock status automatically synced</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Filter sale type:</span>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
        >
          <option value="all">All Sales</option>
          <option value="Meat Rabbit">Meat Rabbit</option>
          <option value="Breeding Stock">Breeding Stock</option>
          <option value="Kit">Kit / Youngsters</option>
          <option value="Pet">Pet Rabbits</option>
          <option value="Manure/Fur">Manure / Fur</option>
        </select>
      </div>

      {/* Sales Transactions Grid */}
      {filteredSales.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
          <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-white">No sales transactions logged</p>
          <p className="text-xs text-slate-500 mt-1 mb-3">Record live or dressed rabbit sales to generate revenue receipts.</p>
          <button
            onClick={onOpenSaleModal}
            className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold"
          >
            + Record First Sale
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSales.map((sale) => (
            <div
              key={sale.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/30">
                      {sale.saleType}
                    </span>
                    <span className="text-xs text-slate-400">{sale.saleDate}</span>
                  </div>
                  <h4 className="font-bold text-base text-white mt-1">
                    {sale.customerName}
                  </h4>
                  {sale.customerPhone && (
                    <p className="text-xs text-slate-400">{sale.customerPhone}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-emerald-400">
                    {formatCurrency(sale.totalPrice)}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this sale record?')) deleteSale(sale.id);
                    }}
                    className="p-1 rounded-lg text-slate-600 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                <div>
                  <span className="text-slate-500 block text-[10px]">Quantity</span>
                  <span className="font-semibold text-slate-200">{sale.rabbitCount} rabbit(s)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Payment Status</span>
                  <span className="font-semibold text-emerald-400">{sale.paymentStatus} ({sale.paymentMethod})</span>
                </div>
                {sale.weightKg && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">Total Weight</span>
                    <span className="font-medium text-slate-300">{sale.weightKg} kg</span>
                  </div>
                )}
                {sale.pricePerKg && (
                  <div>
                    <span className="text-slate-500 block text-[10px]">Price / kg</span>
                    <span className="font-medium text-slate-300">${sale.pricePerKg} / kg</span>
                  </div>
                )}
              </div>

              {sale.rabbitName && (
                <div className="text-xs text-slate-400">
                  Transferred Animal: <strong className="text-white">{sale.rabbitName}</strong> ({sale.rabbitId})
                </div>
              )}

              {sale.notes && (
                <p className="text-xs text-slate-400 italic">
                  "{sale.notes}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

// Modal for Logging Sale (Requirement #16)
export const AddSaleModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addSale, rabbits } = useFarm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Rabbits available for sale
  const availableRabbits = rabbits.filter(r => r.status !== 'Sold' && r.status !== 'Deceased');

  const [saleType, setSaleType] = useState<SaleType>('Meat Rabbit');
  const [rabbitId, setRabbitId] = useState('');
  const [rabbitCount, setRabbitCount] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Weight & price per kg or fixed price
  const [pricingMode, setPricingMode] = useState<'perKg' | 'fixed'>('perKg');
  const [weightKg, setWeightKg] = useState(2.8);
  const [pricePerKg, setPricePerKg] = useState(12.0);
  const [fixedPrice, setFixedPrice] = useState(50.0);
  
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Mobile Money' | 'Bank Transfer' | 'Card'>('Cash');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('Paid');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Auto calculate total price = weight * pricePerKg
  const calculatedTotal = pricingMode === 'perKg' 
    ? Number((weightKg * pricePerKg).toFixed(2)) 
    : Number(fixedPrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Customer name is required.');
      return;
    }

    const rObj = rabbits.find(r => r.rabbitId === rabbitId);

    setLoading(true);
    try {
      await addSale({
        rabbitId: rabbitId || undefined,
        rabbitName: rObj ? `${rObj.name} (${rObj.rabbitId})` : undefined,
        rabbitCount: Number(rabbitCount),
        saleType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        saleDate,
        weightKg: pricingMode === 'perKg' ? Number(weightKg) : undefined,
        pricePerKg: pricingMode === 'perKg' ? Number(pricePerKg) : undefined,
        totalPrice: calculatedTotal,
        paymentMethod,
        paymentStatus,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-teal-400" />
            <h3 className="font-bold text-base text-white">Record Rabbit Sale</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="mb-3 text-red-400 text-xs">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Sale Type *
              </label>
              <select
                value={saleType}
                onChange={e => setSaleType(e.target.value as SaleType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Meat Rabbit">Meat Rabbit (Live/Dressed)</option>
                <option value="Breeding Stock">Breeding Buck/Doe</option>
                <option value="Kit">Kit / Weaner</option>
                <option value="Pet">Pet Rabbit</option>
                <option value="Manure/Fur">Manure / Fur</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Sale Date *
              </label>
              <input
                type="date"
                required
                value={saleDate}
                onChange={e => setSaleDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Optional specific rabbit selection to update status to "Sold" */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Specific Rabbit (Optional)
            </label>
            <select
              value={rabbitId}
              onChange={e => {
                setRabbitId(e.target.value);
                const r = rabbits.find(rab => rab.rabbitId === e.target.value);
                if (r && r.weight) {
                  setWeightKg(r.weight);
                }
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              <option value="">Bulk batch or not assigned to specific pedigree</option>
              {availableRabbits.map(r => (
                <option key={r.id} value={r.rabbitId}>
                  {r.name} ({r.rabbitId}) - {r.breed} ({r.weight}kg)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Customer Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                placeholder="e.g. Robert Vance"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Customer Phone
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Pricing Mode Toggle */}
          <div className="flex bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPricingMode('perKg')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                pricingMode === 'perKg' ? 'bg-teal-600 text-white' : 'text-slate-400'
              }`}
            >
              Live Weight Rate (Weight × Price/kg)
            </button>
            <button
              type="button"
              onClick={() => setPricingMode('fixed')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
                pricingMode === 'fixed' ? 'bg-teal-600 text-white' : 'text-slate-400'
              }`}
            >
              Fixed Price
            </button>
          </div>

          {pricingMode === 'perKg' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Total Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weightKg}
                  onChange={e => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Price Per Kg ($)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={pricePerKg}
                  onChange={e => setPricePerKg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Fixed Price ($)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={fixedPrice}
                onChange={e => setFixedPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          )}

          {/* Automated Total calculation preview */}
          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs flex justify-between items-center">
            <span className="text-teal-300 font-semibold">Total Revenue Calculation:</span>
            <span className="text-lg font-black text-emerald-400">{formatCurrency(calculatedTotal)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Paid">Paid in Full</option>
                <option value="Pending">Pending Payment</option>
                <option value="Partial">Partial Deposit</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Confirm Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
