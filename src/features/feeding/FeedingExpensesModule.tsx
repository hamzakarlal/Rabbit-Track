import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { 
  Wheat, 
  DollarSign, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Calendar, 
  ShoppingBag,
  Receipt,
  X 
} from 'lucide-react';
import { FeedingRecord, ExpenseRecord, FeedType, ExpenseCategory } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface FeedingExpensesProps {
  onOpenFeedModal: () => void;
  onOpenExpenseModal: () => void;
}

export const FeedingExpensesModule: React.FC<FeedingExpensesProps> = ({ 
  onOpenFeedModal, 
  onOpenExpenseModal 
}) => {
  const { feedingRecords, expenses, deleteFeedingRecord, deleteExpense } = useFarm();
  const [activeTab, setActiveTab] = useState<'feeding' | 'expenses'>('feeding');

  const totalFeedCost = feedingRecords.reduce((acc, c) => acc + (c.totalCost || 0), 0);
  const totalFarmExpenses = expenses.reduce((acc, c) => acc + (c.amount || 0), 0);

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Feeding & Expense Management</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Automate feed portion calculations, sync feed inventory, and maintain farm expense balance sheets
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenFeedModal}
            className="px-3.5 py-2.5 rounded-xl bg-lime-600 hover:bg-lime-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-lime-700/20 transition"
          >
            <Wheat className="w-4 h-4" />
            <span>Record Feeding</span>
          </button>
          <button
            onClick={onOpenExpenseModal}
            className="px-3.5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-cyan-700/20 transition"
          >
            <Receipt className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab('feeding')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'feeding' 
              ? 'bg-lime-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Daily Feeding ({feedingRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'expenses' 
              ? 'bg-cyan-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Farm Expenses ({expenses.length})
        </button>
      </div>

      {/* Feeding Tab Content */}
      {activeTab === 'feeding' && (
        <div className="space-y-4">
          
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Cumulative Feeding Cost Logged</span>
              <span className="text-xl font-black text-lime-400">{formatCurrency(totalFeedCost)}</span>
            </div>
            <span className="text-xs text-slate-500">
              Auto-deducts from matching inventory stock levels
            </span>
          </div>

          {feedingRecords.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
              <Wheat className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-white">No feeding sessions recorded</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">Log hay, pellets, greens, or grower rations.</p>
              <button
                onClick={onOpenFeedModal}
                className="px-4 py-2 rounded-xl bg-lime-600 text-white text-xs font-semibold"
              >
                + Log First Feeding Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedingRecords.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-base text-white">{item.feedType} Ration</h4>
                      <p className="text-xs text-slate-400">
                        Target: <strong className="text-slate-200">{item.targetGroup}</strong> ({item.numberOfRabbits} rabbits)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-lime-400">
                        {formatCurrency(item.totalCost)}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this feeding record?')) deleteFeedingRecord(item.id);
                        }}
                        className="p-1 rounded-lg text-slate-600 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Date Fed</span>
                      <span className="font-semibold text-slate-200">{item.feedingDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Portion / Quantity</span>
                      <span className="font-semibold text-white">{item.quantity} {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Cost / Unit</span>
                      <span className="text-slate-300">${item.costPerUnit} / {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Cost Per Rabbit</span>
                      <span className="text-slate-300">
                        ${(item.totalCost / Math.max(1, item.numberOfRabbits)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {item.notes && (
                    <p className="text-xs text-slate-400 italic">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expenses Tab Content */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Total Operating Costs</span>
              <span className="text-xl font-black text-rose-400">{formatCurrency(totalFarmExpenses)}</span>
            </div>
            <span className="text-xs text-slate-500">
              Includes feed, veterinary, utility, cages, and maintenance
            </span>
          </div>

          {expenses.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
              <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-white">No expenses recorded</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">Track all outgoing farm cash flow.</p>
              <button
                onClick={onOpenExpenseModal}
                className="px-4 py-2 rounded-xl bg-cyan-600 text-white text-xs font-semibold"
              >
                + Log First Expense
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {exp.category}
                        </span>
                        <span className="text-xs text-slate-400">{exp.date}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white mt-1">{exp.description}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-rose-400">
                        {formatCurrency(exp.amount)}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this expense?')) deleteExpense(exp.id);
                        }}
                        className="p-1 rounded-lg text-slate-600 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-750">
                    <span>Payment: <strong className="text-slate-200">{exp.paymentMethod}</strong></span>
                    {exp.notes && <span className="truncate max-w-[200px]">"{exp.notes}"</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

// Modal for Feeding Herd
export const AddFeedingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addFeedingRecord, rabbits } = useFarm();
  const [loading, setLoading] = useState(false);

  const [feedType, setFeedType] = useState<FeedType>('Pellets');
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState<'kg' | 'g' | 'bags' | 'bundles'>('kg');
  const [costPerUnit, setCostPerUnit] = useState(1.2);
  const [feedingDate, setFeedingDate] = useState(new Date().toISOString().split('T')[0]);
  const [numberOfRabbits, setNumberOfRabbits] = useState(rabbits.length || 10);
  const [targetGroup, setTargetGroup] = useState('All Herd');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalCost = Number((quantity * costPerUnit).toFixed(2));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addFeedingRecord({
        feedType,
        quantity: Number(quantity),
        unit,
        costPerUnit: Number(costPerUnit),
        totalCost,
        feedingDate,
        numberOfRabbits: Number(numberOfRabbits),
        targetGroup,
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wheat className="w-5 h-5 text-lime-400" />
            <h3 className="font-bold text-base text-white">Record Herd Feeding</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Feed Type *
              </label>
              <select
                value={feedType}
                onChange={e => setFeedType(e.target.value as FeedType)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Pellets">Pellets (16-18% protein)</option>
                <option value="Hay">Timothy / Alfalfa Hay</option>
                <option value="Greens">Fresh Greens / Forage</option>
                <option value="Vegetables">Vegetables / Roots</option>
                <option value="Grains">Whole Grains</option>
                <option value="Supplements">Vitamins / Supplements</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={feedingDate}
                onChange={e => setFeedingDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Quantity *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                required
                value={quantity}
                onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Unit
              </label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="kg">kg</option>
                <option value="g">grams</option>
                <option value="bundles">bundles</option>
                <option value="bags">bags</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Price / Unit ($)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                required
                value={costPerUnit}
                onChange={e => setCostPerUnit(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-lime-500/10 border border-lime-500/20 text-xs flex justify-between items-center">
            <span className="text-lime-300 font-semibold">Total Feeding Cost (Qty × Price):</span>
            <span className="text-base font-black text-lime-400">{formatCurrency(totalCost)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Rabbits Fed
              </label>
              <input
                type="number"
                min="1"
                value={numberOfRabbits}
                onChange={e => setNumberOfRabbits(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Target Group
              </label>
              <input
                type="text"
                value={targetGroup}
                onChange={e => setTargetGroup(e.target.value)}
                placeholder="Breeding Does / Pen A"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
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
              className="px-5 py-2 rounded-xl bg-lime-600 hover:bg-lime-500 text-white text-xs font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Feeding Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Farm Expense
export const AddExpenseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addExpense } = useFarm();
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('Feed');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(50);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Bank Transfer' | 'Mobile Money' | 'Card' | 'Other'>('Cash');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addExpense({
        date,
        category,
        description,
        amount: Number(amount),
        paymentMethod,
        notes: notes.trim() || undefined,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Log Farm Expense</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ExpenseCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Feed">Feed</option>
                <option value="Medicine">Medicine</option>
                <option value="Vaccination">Vaccination</option>
                <option value="Equipment">Equipment / Tools</option>
                <option value="Cages">Cages & Housing</option>
                <option value="Electricity">Electricity</option>
                <option value="Water">Water / Irrigation</option>
                <option value="Labor">Farm Labor</option>
                <option value="Transportation">Transportation</option>
                <option value="Maintenance">Maintenance & Repairs</option>
                <option value="Other">Other Expenses</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Description *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. 5 bags of starter pellets & mineral salt"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Amount ($) *
              </label>
              <input
                type="number"
                step="0.5"
                min="0.1"
                required
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
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
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Mobile Money">Mobile Money</option>
                <option value="Card">Debit/Credit Card</option>
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
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Record Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
