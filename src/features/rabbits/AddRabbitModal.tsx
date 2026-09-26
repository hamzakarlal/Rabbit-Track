import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { RabbitGender, RabbitStatus } from '../../types';
import { X, Check } from 'lucide-react';

interface AddRabbitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_BREEDS = [
  'New Zealand White',
  'Californian',
  'Flemish Giant',
  'Rex',
  'Chinchilla',
  'Dutch',
  'English Angora',
  'Lionhead',
  'Mini Rex',
  'Silver Fox',
  'Crossbreed / Commercial'
];

export const AddRabbitModal: React.FC<AddRabbitModalProps> = ({ isOpen, onClose }) => {
  const { addRabbit, rabbits } = useFarm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [rabbitId, setRabbitId] = useState(`RT-${String(rabbits.length + 101)}`);
  const [earTag, setEarTag] = useState(`ET-${String(rabbits.length + 101)}`);
  const [name, setName] = useState('');
  const [gender, setGender] = useState<RabbitGender>('female');
  const [breed, setBreed] = useState('New Zealand White');
  const [color, setColor] = useState('White');
  const [dateOfBirth, setDateOfBirth] = useState(new Date().toISOString().split('T')[0]);
  const [weight, setWeight] = useState<number>(3.5);
  const [status, setStatus] = useState<RabbitStatus>('Active');
  const [cageNumber, setCageNumber] = useState('Cage-01');
  const [farmSection, setFarmSection] = useState('Breeder Barn A');
  const [fatherId, setFatherId] = useState('');
  const [motherId, setMotherId] = useState('');
  const [purchaseCost, setPurchaseCost] = useState<number>(0);
  const [source, setSource] = useState('Farm Born');
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const bucksList = rabbits.filter(r => r.gender === 'male');
  const doesList = rabbits.filter(r => r.gender === 'female');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation checks (Requirement #23)
    if (!name.trim()) {
      setError('Please provide a rabbit name or identifier.');
      return;
    }
    if (!rabbitId.trim()) {
      setError('Rabbit ID cannot be blank.');
      return;
    }
    if (rabbits.some(r => r.rabbitId.toLowerCase() === rabbitId.trim().toLowerCase())) {
      setError('This Rabbit ID already exists in your herd. Please choose a unique ID.');
      return;
    }
    if (weight <= 0) {
      setError('Weight must be greater than 0 kg.');
      return;
    }

    setLoading(true);
    try {
      await addRabbit({
        rabbitId: rabbitId.trim(),
        earTag: earTag.trim() || undefined,
        name: name.trim(),
        gender,
        breed,
        color: color.trim(),
        dateOfBirth,
        weight: Number(weight),
        status,
        cageNumber: cageNumber.trim(),
        farmSection: farmSection.trim() || undefined,
        fatherId: fatherId || undefined,
        motherId: motherId || undefined,
        purchaseCost: purchaseCost > 0 ? Number(purchaseCost) : undefined,
        source: source.trim() || undefined,
        photoUrl: photoUrl.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save rabbit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🐇</span>
            <h3 className="font-bold text-base text-white">Register New Rabbit</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Identification Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Rabbit ID *
              </label>
              <input
                type="text"
                required
                value={rabbitId}
                onChange={e => setRabbitId(e.target.value)}
                placeholder="RT-101"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Ear Tag #
              </label>
              <input
                type="text"
                value={earTag}
                onChange={e => setEarTag(e.target.value)}
                placeholder="ET-101"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Name / Nickname *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Luna"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Gender & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Gender *
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as RabbitGender)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="female">Doe (Female)</option>
                <option value="male">Buck (Male)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Breed *
              </label>
              <select
                value={breed}
                onChange={e => setBreed(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              >
                {COMMON_BREEDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Color / Coat
              </label>
              <input
                type="text"
                value={color}
                onChange={e => setColor(e.target.value)}
                placeholder="e.g. Broken Black"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* DOB, Weight, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={weight}
                onChange={e => setWeight(parseFloat(e.target.value) || 0)}
                placeholder="4.0"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Status *
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as RabbitStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="Active">Active</option>
                <option value="Breeding">Breeding</option>
                <option value="Pregnant">Pregnant</option>
                <option value="Sick">Sick</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          {/* Cage, Section & Photo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Cage / Pen # *
              </label>
              <input
                type="text"
                required
                value={cageNumber}
                onChange={e => setCageNumber(e.target.value)}
                placeholder="Cage A-12"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Farm Section
              </label>
              <input
                type="text"
                value={farmSection}
                onChange={e => setFarmSection(e.target.value)}
                placeholder="Row 1 / Maternity"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Photo URL
              </label>
              <input
                type="url"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Lineage / Parents (Searchable selectors Requirement #43) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Sire (Father)
              </label>
              <select
                value={fatherId}
                onChange={e => setFatherId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="">Unknown / None</option>
                {bucksList.map(b => (
                  <option key={b.id} value={b.rabbitId}>{b.name} ({b.rabbitId}) - {b.breed}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Dam (Mother)
              </label>
              <select
                value={motherId}
                onChange={e => setMotherId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              >
                <option value="">Unknown / None</option>
                {doesList.map(d => (
                  <option key={d.id} value={d.rabbitId}>{d.name} ({d.rabbitId}) - {d.breed}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Pedigree / Health Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Vigor, conformation notes, bloodline origin..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-700/25 disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Rabbit'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
