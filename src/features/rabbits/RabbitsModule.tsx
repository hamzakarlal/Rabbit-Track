import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  QrCode, 
  Calendar, 
  Scale, 
  Eye,
  CheckCircle2,
  AlertTriangle,
  X,
  Share2,
  Printer
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { Rabbit, RabbitGender, RabbitStatus } from '../../types';
import { calculateAge } from '../../utils/calculations';

interface RabbitsModuleProps {
  onSelectRabbit?: (rabbit: Rabbit) => void;
  onOpenAddModal: () => void;
}

export const RabbitsModule: React.FC<RabbitsModuleProps> = ({ onSelectRabbit, onOpenAddModal }) => {
  const { rabbits, deleteRabbit, updateRabbit } = useFarm();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBreed, setFilterBreed] = useState<string>('all');
  const [selectedRabbitForDetail, setSelectedRabbitForDetail] = useState<Rabbit | null>(null);
  const [qrModalRabbit, setQrModalRabbit] = useState<Rabbit | null>(null);

  // Extract unique breeds for filter
  const breedsList = useMemo(() => {
    const set = new Set(rabbits.map(r => r.breed).filter(Boolean));
    return Array.from(set);
  }, [rabbits]);

  // Filtered rabbits
  const filteredRabbits = useMemo(() => {
    return rabbits.filter((r) => {
      const matchSearch = 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.rabbitId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.earTag && r.earTag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (r.cageNumber && r.cageNumber.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchGender = filterGender === 'all' || r.gender === filterGender;
      const matchStatus = filterStatus === 'all' || r.status === filterStatus;
      const matchBreed = filterBreed === 'all' || r.breed === filterBreed;

      return matchSearch && matchGender && matchStatus && matchBreed;
    });
  }, [rabbits, searchTerm, filterGender, filterStatus, filterBreed]);

  const getStatusBadge = (status: RabbitStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Pregnant':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/30';
      case 'Breeding':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Sick':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Sold':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Deceased':
        return 'bg-slate-700/50 text-slate-400 border-slate-600/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const handleDelete = async (rabbit: Rabbit) => {
    if (window.confirm(`Are you sure you want to remove ${rabbit.name} (${rabbit.rabbitId}) from the records?`)) {
      await deleteRabbit(rabbit.id);
      if (selectedRabbitForDetail?.id === rabbit.id) {
        setSelectedRabbitForDetail(null);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white">Rabbit Registry</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage pedigrees, ear tags, health statuses and cages ({filteredRabbits.length} of {rabbits.length} rabbits)
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Rabbit</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name, ear tag, cage number..."
              className="w-full bg-slate-800/80 border border-slate-700/70 focus:border-emerald-500 rounded-xl pl-10 pr-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap gap-2">
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
            >
              <option value="all">All Genders</option>
              <option value="male">Bucks (Males)</option>
              <option value="female">Does (Females)</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Breeding">Breeding</option>
              <option value="Pregnant">Pregnant</option>
              <option value="Sick">Sick</option>
              <option value="Sold">Sold</option>
              <option value="Deceased">Deceased</option>
            </select>

            <select
              value={filterBreed}
              onChange={(e) => setFilterBreed(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
            >
              <option value="all">All Breeds</option>
              {breedsList.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rabbit Grid */}
      {filteredRabbits.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto mb-3 text-2xl">
            🐇
          </div>
          <h3 className="text-base font-bold text-white mb-1">No rabbits found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            {searchTerm || filterGender !== 'all' || filterStatus !== 'all'
              ? 'Try modifying your search query or reset the filters.'
              : 'Register your first rabbit to begin tracking lineage, breeding, weights, and health.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            Add Your First Rabbit
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRabbits.map((rabbit) => {
            const age = calculateAge(rabbit.dateOfBirth);

            return (
              <div
                key={rabbit.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-sm hover:shadow-lg"
              >
                <div>
                  {/* Photo Banner with QR & Badges */}
                  <div className="relative h-40 bg-slate-950 overflow-hidden">
                    {rabbit.photoUrl ? (
                      <img
                        src={rabbit.photoUrl}
                        alt={rabbit.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800/60 text-slate-500">
                        <span className="text-4xl mb-1">🐇</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider">No Photo</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Status & Gender Tag */}
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(rabbit.status)}`}>
                        {rabbit.status}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        rabbit.gender === 'male' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'
                      }`}>
                        {rabbit.gender === 'male' ? '♂ Buck' : '♀ Doe'}
                      </span>
                    </div>

                    {/* QR Code Action Button */}
                    <button
                      onClick={() => setQrModalRabbit(rabbit)}
                      title="View Rabbit QR Tag"
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/60 transition"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    {/* Rabbit ID Tag & Cage at bottom of image */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700/70 text-emerald-400">
                          {rabbit.rabbitId}
                        </span>
                        {rabbit.earTag && (
                          <span className="font-mono text-[10px] text-slate-300 bg-slate-900/60 px-1.5 py-0.5 rounded">
                            {rabbit.earTag}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-300 bg-slate-900/80 px-2 py-0.5 rounded">
                        Cage: {rabbit.cageNumber}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-2.5">
                    <div>
                      <h3 className="font-bold text-base text-white truncate">{rabbit.name}</h3>
                      <p className="text-xs text-slate-400 font-medium">{rabbit.breed} • {rabbit.color}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
                      <div>
                        <span className="text-slate-500 block">Age:</span>
                        <span className="font-semibold text-slate-300">{age.formatted}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Weight:</span>
                        <span className="font-semibold text-slate-300">{rabbit.weight} kg</span>
                      </div>
                    </div>

                    {rabbit.notes && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                        "{rabbit.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedRabbitForDetail(rabbit)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => handleDelete(rabbit)}
                    title="Remove Rabbit"
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rabbit Profile / Detail Modal */}
      {selectedRabbitForDetail && (
        <RabbitDetailModal 
          rabbit={selectedRabbitForDetail} 
          onClose={() => setSelectedRabbitForDetail(null)}
          onOpenQR={() => {
            setQrModalRabbit(selectedRabbitForDetail);
            setSelectedRabbitForDetail(null);
          }}
          onStatusChange={async (newStatus) => {
            await updateRabbit(selectedRabbitForDetail.id, { status: newStatus });
            setSelectedRabbitForDetail({ ...selectedRabbitForDetail, status: newStatus });
          }}
        />
      )}

      {/* QR Code Modal for Rabbit Tag (Requirement #20) */}
      {qrModalRabbit && (
        <RabbitQrModal rabbit={qrModalRabbit} onClose={() => setQrModalRabbit(null)} />
      )}

    </div>
  );
};

// Rabbit Profile Modal Component (Requirement #8)
export interface RabbitDetailModalProps {
  rabbit: Rabbit;
  onClose: () => void;
  onOpenQR: () => void;
  onStatusChange: (status: RabbitStatus) => Promise<void>;
}

export const RabbitDetailModal: React.FC<RabbitDetailModalProps> = ({ rabbit, onClose, onOpenQR, onStatusChange }) => {
  const { breedingRecords, healthRecords, vaccinations, feedingRecords } = useFarm();
  const [activeTab, setActiveTab] = useState<'overview' | 'breeding' | 'health' | 'vaccinations'>('overview');

  const age = calculateAge(rabbit.dateOfBirth);

  const rabbitBreeding = breedingRecords.filter(b => b.buckId === rabbit.rabbitId || b.doeId === rabbit.rabbitId);
  const rabbitHealth = healthRecords.filter(h => h.rabbitId === rabbit.rabbitId || h.rabbitName === rabbit.name);
  const rabbitVacc = vaccinations.filter(v => v.rabbitId === rabbit.rabbitId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-950/70 border-b border-slate-800 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
              {rabbit.photoUrl ? (
                <img src={rabbit.photoUrl} alt={rabbit.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">🐇</div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">{rabbit.name}</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {rabbit.rabbitId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {rabbit.breed} • {rabbit.gender === 'male' ? '♂ Buck' : '♀ Doe'} • Cage {rabbit.cageNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQR}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
              title="Show QR Code"
            >
              <QrCode className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-800 px-4 sm:px-6 bg-slate-900/60">
          {(['overview', 'breeding', 'health', 'vaccinations'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-4 text-xs font-semibold capitalize border-b-2 transition ${
                activeTab === tab 
                  ? 'border-emerald-500 text-emerald-400' 
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Quick Status Bar */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-400">Current Status: </span>
                  <span className="font-bold text-white ml-1">{rabbit.status}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['Active', 'Breeding', 'Pregnant', 'Sick', 'Sold', 'Retired'] as RabbitStatus[]).map(st => (
                    <button
                      key={st}
                      onClick={() => onStatusChange(st)}
                      className={`px-2 py-1 rounded text-[10px] font-bold transition ${
                        rabbit.status === st 
                          ? 'bg-emerald-600 text-white shadow' 
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pedigree & Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Date of Birth</span>
                  <span className="text-xs font-semibold text-white">{rabbit.dateOfBirth || 'Unknown'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Calculated Age</span>
                  <span className="text-xs font-semibold text-emerald-400">{age.formatted}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Current Weight</span>
                  <span className="text-xs font-semibold text-white">{rabbit.weight} kg</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Sire / Father ID</span>
                  <span className="text-xs font-semibold text-slate-300">{rabbit.fatherId || 'None recorded'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Dam / Mother ID</span>
                  <span className="text-xs font-semibold text-slate-300">{rabbit.motherId || 'None recorded'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <span className="text-[11px] text-slate-500 block">Farm Section</span>
                  <span className="text-xs font-semibold text-slate-300">{rabbit.farmSection || 'Main Barn'}</span>
                </div>
              </div>

              {rabbit.notes && (
                <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800">
                  <span className="text-xs font-bold text-slate-400 block mb-1">Farmer Notes</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{rabbit.notes}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'breeding' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Breeding History ({rabbitBreeding.length})
              </h4>
              {rabbitBreeding.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No breeding records found for this rabbit.</p>
              ) : (
                rabbitBreeding.map(b => (
                  <div key={b.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-white">
                      <span>Bred with {b.buckName === rabbit.name ? b.doeName : b.buckName}</span>
                      <span className="text-pink-400">{b.status}</span>
                    </div>
                    <div className="text-slate-400">
                      Date: {b.breedingDate} • Expected Kindling: {b.expectedKindlingDate}
                    </div>
                    {b.notes && <p className="text-[11px] text-slate-400 italic">"{b.notes}"</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Health & Veterinary History ({rabbitHealth.length})
              </h4>
              {rabbitHealth.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No medical incidents recorded. Healthy rabbit.</p>
              ) : (
                rabbitHealth.map(h => (
                  <div key={h.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-white">
                      <span>{h.diagnosis || 'Health Treatment'}</span>
                      <span className="text-rose-400">{h.status}</span>
                    </div>
                    <div className="text-slate-400">
                      Medicine: {h.medicine} ({h.dosage}) • Date: {h.date}
                    </div>
                    {h.treatment && <div className="text-slate-300 text-[11px]">Treatment: {h.treatment}</div>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'vaccinations' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Vaccination Records ({rabbitVacc.length})
              </h4>
              {rabbitVacc.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No vaccination logs recorded for this rabbit.</p>
              ) : (
                rabbitVacc.map(v => (
                  <div key={v.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
                    <div className="flex justify-between font-semibold text-white">
                      <span>{v.vaccineName}</span>
                      <span className="text-emerald-400 font-mono text-[11px]">Dose: {v.dose}</span>
                    </div>
                    <div className="text-slate-400">
                      Administered: {v.dateAdministered} • Next Booster: <strong className="text-amber-400">{v.nextVaccinationDate}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

// QR Code Modal for Printing/Scanning (Requirement #20)
export const RabbitQrModal: React.FC<{ rabbit: Rabbit; onClose: () => void }> = ({ rabbit, onClose }) => {
  // Safe QR Payload containing non-sensitive ID metadata
  const qrData = JSON.stringify({
    type: 'rabbit_tag',
    id: rabbit.rabbitId,
    name: rabbit.name,
    tag: rabbit.earTag,
    cage: rabbit.cageNumber
  });

  // Generate dynamic QR code URL using SVG service for high crispness
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(qrData)}&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 text-center shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="font-bold text-lg text-white">Ear Tag QR Code</h3>
        <p className="text-xs text-slate-400 mb-4">
          Scan to quickly identify this rabbit & open cage records
        </p>

        {/* Printable Card Area */}
        <div id="printable-qr-card" className="bg-white p-5 rounded-2xl text-slate-900 shadow-inner mb-4 inline-block">
          <img 
            src={qrCodeUrl} 
            alt="Rabbit QR" 
            className="w-48 h-48 mx-auto object-contain"
          />
          <div className="mt-2 text-center">
            <div className="font-black text-sm tracking-tight">{rabbit.name}</div>
            <div className="font-mono text-xs font-bold text-emerald-700">ID: {rabbit.rabbitId}</div>
            <div className="text-[10px] text-slate-500">Cage: {rabbit.cageNumber} • {rabbit.breed}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Tag</span>
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
