import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface GeminiChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChatBot: React.FC<GeminiChatBotProps> = ({ isOpen, onClose }) => {
  const { stats, rabbits, breedingRecords } = useFarm();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello Farmer! 🐇 I'm Barny, your AI Cuniculture & Rabbitry Assistant. Ask me anything about breeding cycles, gestation care, nutrition rations, disease management, or your current herd!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');
    setError('');

    const newMessages: Message[] = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Build farm context
      const farmContext = {
        totalRabbits: stats.totalRabbits,
        bucks: stats.bucks,
        does: stats.does,
        kits: stats.kits,
        activePregnancies: stats.activePregnancies,
        sickRabbits: stats.sickRabbits,
        upcomingKindlings: breedingRecords.filter(b => b.status === 'Active').map(b => ({
          doe: b.doeName,
          expectedDate: b.expectedKindlingDate,
        })),
      };

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          farmContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response from Gemini AI');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with Barny AI');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared. What rabbitry topic would you like to explore today?"
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl h-[85vh] sm:h-[600px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-xl shadow-md shadow-emerald-700/20 text-white">
              🐇
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">Barny AI Assistant</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Gemini 3.5 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Expert Rabbitry & Cuniculture Farm Advisor</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleClearHistory}
              title="Reset conversation"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-slate-850/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-500 shrink-0 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Prompt:
          </span>
          {[
            'Best diet for pregnant does',
            'Symptoms of snuffles / GI stasis',
            'Weaning kit protocol',
            'Optimal breeding age for bucks',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(prompt);
              }}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/50 transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-900/50">
          {messages.map((m, index) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 text-xs">
                    🐇
                  </div>
                )}
                <div
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-emerald-600 text-white rounded-br-sm shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-bl-sm'
                  }`}
                >
                  {m.content}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 items-center">
              <div className="w-7 h-7 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 text-xs">
                🐇
              </div>
              <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl py-2 px-3 text-xs text-slate-400 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Barny is analyzing your herd data...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              ⚠️ {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask Barny about rabbit feeding, breeding, kindling, health..."
            className="flex-1 bg-slate-800/90 border border-slate-700 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

      </div>
    </div>
  );
};
