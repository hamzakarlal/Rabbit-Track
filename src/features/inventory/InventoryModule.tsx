import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { 
  Boxes, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Calendar, 
  MapPin, 
  Package, 
  X,
  Edit2
} from 'lucide-react';
import { InventoryItem, InventoryCategory } from '../../types';
import { formatCurrency } from '../../utils/calculations';

interface InventoryModuleProps {
  onOpenInventoryModal: () => void;
}

export const InventoryModule: React.FC<InventoryModuleProps> = ({ onOpenInventoryModal }) => {
  const { inventory, deleteInventoryItem, updateInventoryItem } = useFarm();
  const [filterCat, setFilterCat] = useState<string>('all');

  const filteredItems = inventory.filter(i => {
    if (filterCat === 'all') return true;
    return i.category === filterCat;
  });

  const lowStockCount = inventory.filter(i => i.quantity <= i.minStockLevel).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Inventory & Supplies</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Track feed bags, medicines, vitamins, equipment, and automatic low-stock alerts
          </p>
        </div>

        <button
          onClick={onOpenInventoryModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stock Item</span>
        </button>
      </div>

      {/* Top Banner if low stock */}
      {lowStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>{lowStockCount} inventory items</strong> have reached or dropped below minimum safety thresholds.
            </span>
          </div>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Filter category:</span>
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
        >
          <option value="all">All Categories</option>
          <option value="Feed">Feed (Pellets, Hay, Grains)</option>
          <option value="Medicines">Medicines & Antibiotics</option>
          <option value="Supplements">Supplements & Electrolytes</option>
          <option value="Equipment">Cages, Feeders, Nest Boxes</option>
        </select>
      </div>

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
          <Boxes className="w-12 h-12 text-slate-600 mx-auto mb-2" />
          <p className="font-semibold text-white">No items found in stock</p>
          <p className="text-xs text-slate-500 mt-1 mb-3">Add feed bags, bottles of medicine, or equipment to track consumption.</p>
          <button
            onClick={onOpenInventoryModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
          >
            + Add Stock Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isLow = item.quantity <= item.minStockLevel;

            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                        {item.category}
                      </span>
                      <h4 className="font-bold text-base text-white mt-1">{item.name}</h4>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isLow && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          LOW STOCK
                        </span>
                      )}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete ${item.name} from inventory?`)) {
                            deleteInventoryItem(item.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-600 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quantity Display with Quick Increment / Decrement */}
                  <div className="p-3 my-3 rounded-xl bg-slate-800/60 border border-slate-750 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-semibold">Current Quantity</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-2xl font-black ${isLow ? 'text-amber-400' : 'text-white'}`}>
                          {item.quantity}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">{item.unit}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Min safety: {item.minStockLevel} {item.unit}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateInventoryItem(item.id, { quantity: Math.max(0, item.quantity - 1) })}
                        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold flex items-center justify-center text-sm"
                        title="Deduct 1"
                      >
                        -
                      </button>
                      <button
                        onClick={() => updateInventoryItem(item.id, { quantity: item.quantity + 1 })}
                        className="w-8 h-8 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-bold flex items-center justify-center text-sm"
                        title="Add 1"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Location:</span>
                      <span className="text-slate-300 font-medium">{item.location || 'Store Room'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">Supplier:</span>
                      <span className="text-slate-300 font-medium">{item.supplier || 'Standard'}</span>
                    </div>
                    {item.expiryDate && (
                      <div className="col-span-2">
                        <span className="text-slate-500 block text-[10px]">Expiry Date:</span>
                        <span className="text-slate-300 font-medium">{item.expiryDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {item.notes && (
                  <p className="text-[11px] text-slate-400 italic pt-2 border-t border-slate-800/80">
                    "{item.notes}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

// Modal for Adding Stock (Requirement #15)
export const AddInventoryModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { addInventoryItem } = useFarm();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<InventoryCategory>('Feed');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState('kg');
  const [purchasePrice, setPurchasePrice] = useState<number>(1.2);
  const [supplier, setSupplier] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState('');
  const [minStockLevel, setMinStockLevel] = useState<number>(15);
  const [location, setLocation] = useState('Feed Room Bin 1');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await addInventoryItem({
        name: name.trim(),
        category,
        quantity: Number(quantity),
        unit: unit.trim(),
        purchasePrice: Number(purchasePrice),
        supplier: supplier.trim() || undefined,
        purchaseDate,
        expiryDate: expiryDate || undefined,
        minStockLevel: Number(minStockLevel),
        location: location.trim() || undefined,
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
            <Boxes className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Add Inventory Stock</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. 16% Breeder Alfalfa Pellets"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as InventoryCategory)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Feed">Feed</option>
                <option value="Medicines">Medicines</option>
                <option value="Supplements">Supplements</option>
                <option value="Equipment">Equipment</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Storage Location
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Feed Room Shelf 2"
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
                min="0"
                required
                value={quantity}
                onChange={e => setQuantity(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Unit (kg/bags)
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={e => setUnit(e.target.value)}
                placeholder="kg, bottles"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Min Stock Alert
              </label>
              <input
                type="number"
                min="0"
                value={minStockLevel}
                onChange={e => setMinStockLevel(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Purchase Price ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={purchasePrice}
                onChange={e => setPurchasePrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Supplier
              </label>
              <input
                type="text"
                value={supplier}
                onChange={e => setSupplier(e.target.value)}
                placeholder="AgriSupply Co"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Expiry Date (If applicable)
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={e => setExpiryDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Add Stock Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
