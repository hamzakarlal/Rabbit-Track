import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { 
  HeartHandshake, 
  Plus, 
  Baby, 
  Trash2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X 
} from 'lucide-react';
import { calculateExpectedKindling } from '../../utils/calculations';
import { BreedingRecord } from '../../types';

interface BreedingModuleProps {
  onOpenBreedingModal: () => void;
  onOpenKindlingModal: (breedingRecord?: BreedingRecord) => void;
}

export const BreedingModule: React.FC<BreedingModuleProps> = ({ 
  onOpenBreedingModal, 
  onOpenKindlingModal 
}) => {
  const { breedingRecords, kindlingRecords, deleteBreedingRecord, deleteKindlingRecord } = useFarm();
  const [activeSubTab, setActiveSubTab] = useState<'breeding' | 'kindling'>('breeding');

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Breeding & Kindling</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Track pairings, calculate 31-day gestation dates, and log litter kit survival rates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenBreedingModal}
            className="px-3.5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-pink-700/20 transition"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Record Breeding</span>
          </button>
          <button
            onClick={() => onOpenKindlingModal()}
            className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-700/20 transition"
          >
            <Baby className="w-4 h-4" />
            <span>Record Kindling</span>
          </button>
        </div>
      </div>

      {/* Toggle Subtabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveSubTab('breeding')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeSubTab === 'breeding' 
              ? 'bg-pink-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Pairings & Gestation ({breedingRecords.length})
        </button>
        <button
          onClick={() => setActiveSubTab('kindling')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeSubTab === 'kindling' 
              ? 'bg-amber-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Kindling Litters ({kindlingRecords.length})
        </button>
      </div>

      {/* Breeding Subtab Content */}
      {activeSubTab === 'breeding' && (
        <div className="space-y-4">
          {breedingRecords.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
              <HeartHandshake className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-white">No breeding matches recorded</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">Pair bucks and does to track pregnancy stages.</p>
              <button
                onClick={onOpenBreedingModal}
                className="px-4 py-2 rounded-xl bg-pink-600 text-white text-xs font-semibold"
              >
                + Match First Breeding Pair
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {breedingRecords.map((record) => {
                const isKindled = record.status === 'Kindled';
                const isActive = record.status === 'Active';

                return (
                  <div
                    key={record.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-white">{record.doeName}</span>
                          <span className="text-xs text-pink-400 font-bold">×</span>
                          <span className="font-bold text-sm text-slate-300">{record.buckName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          Doe ID: {record.doeId} • Buck ID: {record.buckId}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          isKindled 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                            : (isActive ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' : 'bg-slate-800 text-slate-400')
                        }`}>
                          {record.status}
                        </span>

                        <button
                          onClick={() => {
                            if (window.confirm('Delete this breeding entry?')) {
                              deleteBreedingRecord(record.id);
                            }
                          }}
                          className="p-1 rounded-lg text-slate-600 hover:text-rose-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Timeline Data */}
                    <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Breeding Date</span>
                        <span className="font-semibold text-slate-200">{record.breedingDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Expected Kindling</span>
                        <span className="font-semibold text-emerald-400">{record.expectedKindlingDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Method</span>
                        <span className="font-medium text-slate-300">{record.breedingMethod} ({record.attemptsCount}x)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Actual Kindling</span>
                        <span className="font-medium text-slate-300">{record.actualKindlingDate || 'Pending birth'}</span>
                      </div>
                    </div>

                    {record.notes && (
                      <p className="text-xs text-slate-400 italic">
                        "{record.notes}"
                      </p>
                    )}

                    {isActive && (
                      <div className="pt-2">
                        <button
                          onClick={() => onOpenKindlingModal(record)}
                          className="w-full py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 border border-amber-500/30 text-amber-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                        >
                          <Baby className="w-3.5 h-3.5" />
                          <span>Doe Kindled! Log Kit Numbers</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Kindling Subtab Content */}
      {activeSubTab === 'kindling' && (
        <div className="space-y-4">
          {kindlingRecords.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
              <Baby className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-white">No litters recorded yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">Record litters to track survival rates & kit statistics.</p>
              <button
                onClick={() => onOpenKindlingModal()}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold"
              >
                + Log Litter Kindling
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {kindlingRecords.map((litter) => {
                const survivalRate = Math.min(100, Math.round((litter.liveKits / Math.max(1, litter.totalKits)) * 100));

                return (
                  <div
                    key={litter.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-base text-white">
                          Mother: {litter.doeName}
                        </h4>
                        <p className="text-xs text-slate-400">
                          Father: {litter.buckName || 'Sire record'} • Date: {litter.kindlingDate}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm('Delete this kindling litter entry?')) {
                            deleteKindlingRecord(litter.id);
                          }
                        }}
                        className="p-1 rounded-lg text-slate-600 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Stats Pill Matrix */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-750">
                        <span className="text-[10px] text-slate-400 block uppercase">Total Born</span>
                        <span className="text-lg font-black text-white">{litter.totalKits}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-400 block uppercase font-bold">Live Kits</span>
                        <span className="text-lg font-black text-emerald-400">{litter.liveKits}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-750">
                        <span className="text-[10px] text-slate-400 block uppercase">Survival Rate</span>
                        <span className="text-lg font-black text-white">{survivalRate}%</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 flex items-center justify-between px-1">
                      <span>Nest condition: <strong className="text-slate-200">{litter.nestCondition}</strong></span>
                      <span>Mother condition: <strong className="text-slate-200">{litter.motherCondition}</strong></span>
                      {litter.stillbornKits > 0 && (
                        <span className="text-rose-400 font-medium">Stillborn: {litter.stillbornKits}</span>
                      )}
                    </div>

                    {litter.notes && (
                      <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                        "{litter.notes}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

// Modal to Record New Breeding
export const RecordBreedingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { rabbits, addBreedingRecord } = useFarm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const bucks = rabbits.filter(r => r.gender === 'male' && r.status !== 'Sold' && r.status !== 'Deceased');
  const does = rabbits.filter(r => r.gender === 'female' && r.status !== 'Sold' && r.status !== 'Deceased');

  const [buckId, setBuckId] = useState(bucks[0]?.rabbitId || '');
  const [doeId, setDoeId] = useState(does[0]?.rabbitId || '');
  const [breedingDate, setBreedingDate] = useState(new Date().toISOString().split('T')[0]);
  const [breedingMethod, setBreedingMethod] = useState<'Natural' | 'Artificial Insemination'>('Natural');
  const [attemptsCount, setAttemptsCount] = useState(1);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const expectedDate = calculateExpectedKindling(breedingDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!buckId || !doeId) {
      setError('Please select both a male buck and female doe.');
      return;
    }
    if (buckId === doeId) {
      setError('Cannot mate a rabbit with itself.');
      return;
    }

    const buckObj = rabbits.find(r => r.rabbitId === buckId);
    const doeObj = rabbits.find(r => r.rabbitId === doeId);

    setLoading(true);
    try {
      await addBreedingRecord({
        buckId,
        buckName: buckObj?.name || buckId,
        doeId,
        doeName: doeObj?.name || doeId,
        breedingDate,
        expectedKindlingDate: expectedDate,
        breedingMethod,
        attemptsCount: Number(attemptsCount),
        status: 'Active',
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save breeding pairing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-pink-400" />
            <h3 className="font-bold text-base text-white">Record Breeding Match</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Buck (Male) *
            </label>
            <select
              required
              value={buckId}
              onChange={e => setBuckId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            >
              {bucks.map(b => (
                <option key={b.id} value={b.rabbitId}>
                  {b.name} ({b.rabbitId}) - {b.breed}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Doe (Female) *
            </label>
            <select
              required
              value={doeId}
              onChange={e => setDoeId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            >
              {does.map(d => (
                <option key={d.id} value={d.rabbitId}>
                  {d.name} ({d.rabbitId}) - {d.breed} {d.status === 'Pregnant' ? '⚠️ (Pregnant)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Breeding Date
              </label>
              <input
                type="date"
                required
                value={breedingDate}
                onChange={e => setBreedingDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Attempts Count
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={attemptsCount}
                onChange={e => setAttemptsCount(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Automated Kindling Date Display */}
          <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 text-xs">
            <span className="text-pink-300 font-semibold block mb-0.5">Automated 31-Day Gestation:</span>
            <span className="text-white">Expected Kindling on <strong className="text-emerald-400 font-mono">{expectedDate}</strong></span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Breeding Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Doe accepted buck 2 times. Fall off observed."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold disabled:opacity-50"
            >
              {loading ? 'Recording...' : 'Confirm Pairing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal to Record Kindling
export const RecordKindlingModal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void;
  linkedBreeding?: BreedingRecord;
}> = ({ isOpen, onClose, linkedBreeding }) => {
  const { rabbits, addKindlingRecord } = useFarm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const does = rabbits.filter(r => r.gender === 'female');

  const [doeId, setDoeId] = useState(linkedBreeding?.doeId || does[0]?.rabbitId || '');
  const [kindlingDate, setKindlingDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalKits, setTotalKits] = useState(7);
  const [liveKits, setLiveKits] = useState(7);
  const [stillbornKits, setStillbornKits] = useState(0);
  const [nestCondition, setNestCondition] = useState<'Good' | 'Fair' | 'Poor'>('Good');
  const [motherCondition, setMotherCondition] = useState<'Excellent' | 'Good' | 'Weak' | 'Distressed'>('Excellent');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (liveKits + stillbornKits !== totalKits) {
      setError(`Live kits (${liveKits}) + Stillborn kits (${stillbornKits}) must equal Total Kits (${totalKits}).`);
      return;
    }

    const doeObj = rabbits.find(r => r.rabbitId === doeId);

    setLoading(true);
    try {
      await addKindlingRecord({
        breedingId: linkedBreeding?.id,
        doeId,
        doeName: doeObj?.name || doeId,
        buckId: linkedBreeding?.buckId,
        buckName: linkedBreeding?.buckName,
        kindlingDate,
        expectedDate: linkedBreeding?.expectedKindlingDate,
        totalKits: Number(totalKits),
        liveKits: Number(liveKits),
        stillbornKits: Number(stillbornKits),
        nestCondition,
        motherCondition,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to record kindling');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Baby className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Record Kindling / Litter</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Mother (Doe) *
            </label>
            <select
              required
              value={doeId}
              onChange={e => setDoeId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            >
              {does.map(d => (
                <option key={d.id} value={d.rabbitId}>
                  {d.name} ({d.rabbitId}) - {d.breed}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Kindling Date *
            </label>
            <input
              type="date"
              required
              value={kindlingDate}
              onChange={e => setKindlingDate(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Total Born
              </label>
              <input
                type="number"
                min="1"
                required
                value={totalKits}
                onChange={e => {
                  const val = parseInt(e.target.value) || 0;
                  setTotalKits(val);
                  setLiveKits(val - stillbornKits);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Live Kits
              </label>
              <input
                type="number"
                min="0"
                required
                value={liveKits}
                onChange={e => setLiveKits(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Stillborn
              </label>
              <input
                type="number"
                min="0"
                required
                value={stillbornKits}
                onChange={e => {
                  const val = parseInt(e.target.value) || 0;
                  setStillbornKits(val);
                  setLiveKits(Math.max(0, totalKits - val));
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-rose-400 font-bold outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Nest Condition
              </label>
              <select
                value={nestCondition}
                onChange={e => setNestCondition(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Good">Good (Warm & clean)</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Mother Condition
              </label>
              <select
                value={motherCondition}
                onChange={e => setMotherCondition(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Weak">Weak</option>
                <option value="Distressed">Distressed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Kindling Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Kits nursing vigorously. Plenty of fur pulled."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none resize-none"
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
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Litter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
