import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { 
  Stethoscope, 
  Syringe, 
  Plus, 
  Trash2, 
  AlertCircle, 
  Calendar, 
  CheckCircle,
  X 
} from 'lucide-react';
import { HealthRecord, VaccinationRecord, HealthSeverity } from '../../types';
import { formatCurrency, isOverdue, isUpcoming } from '../../utils/calculations';

interface HealthModuleProps {
  onOpenHealthModal: () => void;
  onOpenVaccinationModal: () => void;
}

export const HealthModule: React.FC<HealthModuleProps> = ({ 
  onOpenHealthModal, 
  onOpenVaccinationModal 
}) => {
  const { 
    healthRecords, 
    vaccinations, 
    deleteHealthRecord, 
    updateHealthRecord, 
    deleteVaccination 
  } = useFarm();

  const [activeTab, setActiveTab] = useState<'treatments' | 'vaccinations'>('treatments');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredHealth = healthRecords.filter(h => {
    if (filterSeverity === 'all') return true;
    return h.status === filterSeverity;
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Health & Vaccinations</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Log medical treatments, dosages, recovery progress, and preventive vaccination boosters
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenHealthModal}
            className="px-3.5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-rose-700/20 transition"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Add Treatment</span>
          </button>
          <button
            onClick={onOpenVaccinationModal}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-emerald-700/20 transition"
          >
            <Syringe className="w-4 h-4" />
            <span>Log Vaccine</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab('treatments')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'treatments' 
              ? 'bg-rose-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Medical Treatments ({healthRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('vaccinations')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
            activeTab === 'vaccinations' 
              ? 'bg-emerald-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Vaccinations ({vaccinations.length})
        </button>
      </div>

      {/* Treatments Tab */}
      {activeTab === 'treatments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Filter by status:</span>
            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
            >
              <option value="all">All Conditions</option>
              <option value="Sick">Sick</option>
              <option value="Under Treatment">Under Treatment</option>
              <option value="Recovered">Recovered</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {filteredHealth.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
              <Stethoscope className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-white">No treatment records</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">All rabbits in herd are healthy, or no illnesses logged.</p>
              <button
                onClick={onOpenHealthModal}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
              >
                + Log Health Incident
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHealth.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-white">{item.rabbitName}</h4>
                        <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {item.rabbitId}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-rose-300 mt-0.5">{item.diagnosis}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'Recovered' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {item.status}
                      </span>
                      <button
                        onClick={() => {
                          if (window.confirm('Delete this medical entry?')) deleteHealthRecord(item.id);
                        }}
                        className="p-1 rounded-lg text-slate-600 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-750 text-xs space-y-1.5">
                    <div>
                      <span className="text-slate-500">Symptoms: </span>
                      <span className="text-slate-300">{item.symptoms}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Medicine & Dose: </span>
                      <span className="font-medium text-white">{item.medicine} ({item.dosage})</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Treatment Plan: </span>
                      <span className="text-slate-300">{item.treatment}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-700/60 text-[11px] text-slate-400">
                      <span>Started: {item.treatmentStartDate}</span>
                      <span>Vet: {item.veterinarian || 'Farm Self-care'}</span>
                      {item.cost > 0 && <span className="text-emerald-400 font-bold">{formatCurrency(item.cost)}</span>}
                    </div>
                  </div>

                  {item.status !== 'Recovered' && (
                    <button
                      onClick={() => updateHealthRecord(item.id, { status: 'Recovered' })}
                      className="w-full py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Mark Patient Recovered</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vaccinations Tab */}
      {activeTab === 'vaccinations' && (
        <div className="space-y-4">
          {vaccinations.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-10 text-center text-slate-400 text-sm">
              <Syringe className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-white">No vaccination records</p>
              <p className="text-xs text-slate-500 mt-1 mb-3">Record VHD, Myxomatosis, and pasteurella vaccine batches.</p>
              <button
                onClick={onOpenVaccinationModal}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
              >
                + Administer Vaccine
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vaccinations.map((vac) => {
                const overdue = isOverdue(vac.nextVaccinationDate);
                const upcoming = isUpcoming(vac.nextVaccinationDate, 14);

                return (
                  <div
                    key={vac.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-base text-white">{vac.vaccineName}</h4>
                          {overdue && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              OVERDUE
                            </span>
                          )}
                          {upcoming && !overdue && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              DUE SOON
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Rabbit: <strong className="text-white">{vac.rabbitName}</strong> ({vac.rabbitId})
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm('Delete this vaccination log?')) deleteVaccination(vac.id);
                        }}
                        className="p-1 rounded-lg text-slate-600 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-slate-800/60 border border-slate-750">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Date Given</span>
                        <span className="font-semibold text-slate-200">{vac.dateAdministered}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Next Booster</span>
                        <span className={`font-bold ${overdue ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {vac.nextVaccinationDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Dose / Batch</span>
                        <span className="font-medium text-slate-300">{vac.dose} {vac.batchNumber ? `(${vac.batchNumber})` : ''}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Cost</span>
                        <span className="font-medium text-slate-300">{formatCurrency(vac.cost || 0)}</span>
                      </div>
                    </div>

                    {vac.notes && (
                      <p className="text-xs text-slate-400 italic">
                        "{vac.notes}"
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

// Modal for Adding Health / Medical Record
export const AddHealthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { rabbits, addHealthRecord } = useFarm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [rabbitId, setRabbitId] = useState(rabbits[0]?.rabbitId || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [symptoms, setSymptoms] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medicine, setMedicine] = useState('');
  const [dosage, setDosage] = useState('');
  const [veterinarian, setVeterinarian] = useState('');
  const [cost, setCost] = useState(0);
  const [status, setStatus] = useState<HealthSeverity>('Under Treatment');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rabbitId) {
      setError('Please select a rabbit.');
      return;
    }
    const rObj = rabbits.find(r => r.rabbitId === rabbitId);

    setLoading(true);
    try {
      await addHealthRecord({
        rabbitId,
        rabbitName: rObj?.name || rabbitId,
        date,
        symptoms,
        diagnosis,
        treatment,
        medicine,
        dosage,
        veterinarian: veterinarian.trim() || undefined,
        treatmentStartDate: date,
        status,
        cost: Number(cost) || 0,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-base text-white">Record Health Treatment</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && <div className="mb-3 text-red-400 text-xs">⚠️ {error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Rabbit *
            </label>
            <select
              value={rabbitId}
              onChange={e => setRabbitId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {rabbits.map(r => (
                <option key={r.id} value={r.rabbitId}>
                  {r.name} ({r.rabbitId}) - Cage {r.cageNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Condition Status
              </label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as HealthSeverity)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              >
                <option value="Sick">Sick</option>
                <option value="Under Treatment">Under Treatment</option>
                <option value="Critical">Critical</option>
                <option value="Recovered">Recovered</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Symptoms
            </label>
            <input
              type="text"
              required
              value={symptoms}
              onChange={e => setSymptoms(e.target.value)}
              placeholder="e.g. Sneezing, nasal discharge, lethargy"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Diagnosis
            </label>
            <input
              type="text"
              required
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              placeholder="e.g. Pasteurellosis / Snuffles"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Medicine Name
              </label>
              <input
                type="text"
                required
                value={medicine}
                onChange={e => setMedicine(e.target.value)}
                placeholder="e.g. Enrofloxacin"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Dosage
              </label>
              <input
                type="text"
                required
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                placeholder="e.g. 0.2ml bid x 5d"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Veterinarian
              </label>
              <input
                type="text"
                value={veterinarian}
                onChange={e => setVeterinarian(e.target.value)}
                placeholder="Dr. Jenkins"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Treatment Cost ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={cost}
                onChange={e => setCost(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Care Instructions
            </label>
            <textarea
              rows={2}
              value={treatment}
              onChange={e => setTreatment(e.target.value)}
              placeholder="e.g. Place in quarantine cage with fresh dry bedding."
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
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Health Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal for Administering Vaccination
export const AddVaccinationModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { rabbits, addVaccination } = useFarm();
  const [loading, setLoading] = useState(false);

  const [rabbitId, setRabbitId] = useState(rabbits[0]?.rabbitId || '');
  const [vaccineName, setVaccineName] = useState('Filavac VHD / RHDV2 & Myxo');
  const [dateAdministered, setDateAdministered] = useState(new Date().toISOString().split('T')[0]);
  
  // Calculate next date 6 months ahead by default
  const defaultBooster = new Date();
  defaultBooster.setMonth(defaultBooster.getMonth() + 6);
  const [nextVaccinationDate, setNextVaccinationDate] = useState(defaultBooster.toISOString().split('T')[0]);

  const [dose, setDose] = useState('0.5 ml subcutaneous');
  const [batchNumber, setBatchNumber] = useState('VAC-2026-X1');
  const [cost, setCost] = useState(15);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rObj = rabbits.find(r => r.rabbitId === rabbitId);

    setLoading(true);
    try {
      await addVaccination({
        rabbitId,
        rabbitName: rObj?.name || rabbitId,
        vaccineName,
        dateAdministered,
        nextVaccinationDate,
        dose,
        batchNumber: batchNumber.trim() || undefined,
        cost: Number(cost) || 0,
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
            <Syringe className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Log Rabbit Vaccination</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Select Rabbit *
            </label>
            <select
              value={rabbitId}
              onChange={e => setRabbitId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            >
              {rabbits.map(r => (
                <option key={r.id} value={r.rabbitId}>
                  {r.name} ({r.rabbitId})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Vaccine Name *
            </label>
            <input
              type="text"
              required
              value={vaccineName}
              onChange={e => setVaccineName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Date Administered
              </label>
              <input
                type="date"
                required
                value={dateAdministered}
                onChange={e => setDateAdministered(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Next Booster Date *
              </label>
              <input
                type="date"
                required
                value={nextVaccinationDate}
                onChange={e => setNextVaccinationDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Dose Administered
              </label>
              <input
                type="text"
                required
                value={dose}
                onChange={e => setDose(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Cost ($)
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={e => setCost(parseFloat(e.target.value) || 0)}
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Record Vaccination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
