import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFarm } from '../../context/FarmContext';
import { 
  User, 
  MapPin, 
  Phone, 
  Building, 
  LogOut, 
  Save, 
  Sparkles, 
  ShieldCheck, 
  Database,
  Trash2
} from 'lucide-react';

export const ProfileSettingsModule: React.FC = () => {
  const { user, profile, logout, updateUserProfile } = useAuth();
  const { seedFarmData, rabbits, stats } = useFarm();

  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [farmName, setFarmName] = useState(profile?.farmName || '');
  const [farmLocation, setFarmLocation] = useState(profile?.farmLocation || '');
  const [farmDescription, setFarmDescription] = useState(profile?.farmDescription || '');
  
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      await updateUserProfile({
        fullName,
        phoneNumber,
        farmName,
        farmLocation,
        farmDescription,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (window.confirm('Populate realistic sample farm data (rabbits, breeding, health, sales, inventory)?')) {
      setSeeding(true);
      try {
        await seedFarmData();
        alert('Sample herd data loaded successfully!');
      } catch (err: any) {
        alert('Error seeding data: ' + err.message);
      } finally {
        setSeeding(false);
      }
    }
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-8 max-w-3xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white">Farm & Account Settings</h2>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure farm details, export reports, seed demo data, and manage farmer account credentials
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <span>✓</span>
          <span>Farm profile settings updated successfully!</span>
        </div>
      )}

      {/* Farm Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider text-emerald-400">
          Farm Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Farm Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={farmName}
                onChange={e => setFarmName(e.target.value)}
                placeholder="Highland Meadow Rabbitry"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Farm Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={farmLocation}
                onChange={e => setFarmLocation(e.target.value)}
                placeholder="Cloverdale, Oregon"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Farm Bio & Operations Description
          </label>
          <textarea
            rows={3}
            value={farmDescription}
            onChange={e => setFarmDescription(e.target.value)}
            placeholder="Specialized commercial breed lines, meat rabbits, and pedigreed show stock."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 resize-none"
          />
        </div>

        <h3 className="font-bold text-sm text-white uppercase tracking-wider text-emerald-400 pt-3 border-t border-slate-800">
          Farmer Personal Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Dr. Gregory Finch"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 234-8901"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-emerald-700/25 transition disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>

      {/* Database & Demo Tools */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <h3 className="font-bold text-sm text-white uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Database className="w-4 h-4 text-teal-400" />
          <span>Farm Database & Demo Data</span>
        </h3>

        <p className="text-xs text-slate-400">
          Populate your Firestore collection with realistic rabbit records, breeding pairs, vaccination timelines, inventory items, and past sales.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSeed}
            disabled={seeding}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{seeding ? 'Seeding in progress...' : 'Seed Sample Farm Data'}</span>
          </button>
        </div>
      </div>

      {/* Account Info & Logout */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400">Authenticated Email:</div>
          <div className="font-semibold text-sm text-white">{user?.email || 'Anonymous Demo Account'}</div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">UID: {user?.uid}</div>
        </div>

        <button
          onClick={() => logout()}
          className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out of Farm</span>
        </button>
      </div>

    </div>
  );
};
