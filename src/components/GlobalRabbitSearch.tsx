import React, { useState, useRef, useEffect } from 'react';
import { Search, X, QrCode, ArrowRight, Eye } from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { Rabbit } from '../types';

interface GlobalRabbitSearchProps {
  onSelectRabbit: (rabbit: Rabbit) => void;
  className?: string;
}

export const GlobalRabbitSearch: React.FC<GlobalRabbitSearchProps> = ({ onSelectRabbit, className = '' }) => {
  const { rabbits } = useFarm();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = query.trim()
    ? rabbits.filter(r => {
        const q = query.toLowerCase().trim();
        return (
          r.rabbitId.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          (r.earTag && r.earTag.toLowerCase().includes(q)) ||
          r.breed.toLowerCase().includes(q) ||
          r.cageNumber.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const handleSelect = (rabbit: Rabbit) => {
    onSelectRabbit(rabbit);
    setQuery('');
    setIsOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'Pregnant':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
      case 'Sick':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Breeding':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Sold':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Bar Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Global rabbit search by ID (RT-...), name, cage..."
          className="w-full bg-slate-800/90 hover:bg-slate-800 focus:bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 outline-none transition"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Results List */}
      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 mt-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in divide-y divide-slate-800/80">
          <div className="p-2 bg-slate-950/70 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Rabbits Found ({results.length})</span>
            <span className="text-[10px] text-emerald-400">Click to open dossier</span>
          </div>

          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              No matching rabbit found for "{query}".
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {results.map(rabbit => (
                <button
                  key={rabbit.id}
                  onClick={() => handleSelect(rabbit)}
                  className="w-full p-2.5 hover:bg-slate-800/80 transition flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                      {rabbit.photoUrl ? (
                        <img src={rabbit.photoUrl} alt={rabbit.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">🐇</div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white truncate">{rabbit.name}</span>
                        <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          {rabbit.rabbitId}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">
                        {rabbit.breed} • Cage {rabbit.cageNumber} • {rabbit.gender === 'male' ? '♂ Buck' : '♀ Doe'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getStatusColor(rabbit.status)}`}>
                      {rabbit.status}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
