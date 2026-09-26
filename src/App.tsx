import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useFarm } from './context/FarmContext';
import { AuthScreen } from './features/auth/AuthScreen';
import { Navigation, NavTab } from './components/Navigation';
import { DashboardView } from './features/dashboard/DashboardView';
import { RabbitsModule, RabbitDetailModal, RabbitQrModal } from './features/rabbits/RabbitsModule';
import { AddRabbitModal } from './features/rabbits/AddRabbitModal';
import { BreedingModule, RecordBreedingModal, RecordKindlingModal } from './features/breeding/BreedingModule';
import { HealthModule, AddHealthModal, AddVaccinationModal } from './features/health/HealthModule';
import { FeedingExpensesModule, AddFeedingModal, AddExpenseModal } from './features/feeding/FeedingExpensesModule';
import { SalesModule, AddSaleModal } from './features/sales/SalesModule';
import { InventoryModule, AddInventoryModal } from './features/inventory/InventoryModule';
import { NotificationsModule } from './features/notifications/NotificationsModule';
import { ProfileSettingsModule } from './features/profile/ProfileSettingsModule';
import { ReportsModule } from './features/reports/ReportsModule';
import { GeminiChatBot } from './features/chat/GeminiChatBot';
import { BreedingRecord, Rabbit } from './types';

export default function App() {
  const { user, isDemoMode, loading: authLoading } = useAuth();
  const { updateRabbit } = useFarm();
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');

  // Modal states
  const [isAddRabbitOpen, setIsAddRabbitOpen] = useState(false);
  const [isBreedingOpen, setIsBreedingOpen] = useState(false);
  const [isKindlingOpen, setIsKindlingOpen] = useState(false);
  const [kindlingLinkedBreeding, setKindlingLinkedBreeding] = useState<BreedingRecord | undefined>(undefined);
  const [isHealthOpen, setIsHealthOpen] = useState(false);
  const [isVaccOpen, setIsVaccOpen] = useState(false);
  const [isFeedOpen, setIsFeedOpen] = useState(false);
  const [isExpenseOpen, setIsExpenseOpen] = useState(false);
  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);

  // Global Rabbit Dossier & QR Inspection from Search Bar
  const [activeSearchedRabbit, setActiveSearchedRabbit] = useState<Rabbit | null>(null);
  const [activeQrRabbit, setActiveQrRabbit] = useState<Rabbit | null>(null);

  // Gemini AI Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Quick action dispatcher
  const handleQuickAction = (actionType: string) => {
    switch (actionType) {
      case 'add-rabbit':
        setIsAddRabbitOpen(true);
        break;
      case 'record-breeding':
        setIsBreedingOpen(true);
        break;
      case 'record-kindling':
        setKindlingLinkedBreeding(undefined);
        setIsKindlingOpen(true);
        break;
      case 'add-health':
        setIsHealthOpen(true);
        break;
      case 'add-vaccination':
        setIsVaccOpen(true);
        break;
      case 'record-feeding':
        setIsFeedOpen(true);
        break;
      case 'record-sale':
        setIsSaleOpen(true);
        break;
      case 'add-expense':
        setIsExpenseOpen(true);
        break;
      case 'add-inventory':
        setIsInventoryOpen(true);
        break;
      default:
        break;
    }
  };

  // Auth loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-16 h-16 rounded-3xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-3xl animate-bounce mb-4">
          🐇
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-300">Loading Rabbit Track...</p>
        <span className="text-xs text-slate-500 mt-1">Connecting to Cloud Firestore</span>
      </div>
    );
  }

  // If not authenticated and not in demo mode, show sign-in/registration screen
  if (!user && !isDemoMode) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row antialiased">
      
      {/* Navigation (Desktop Sidebar with Global Search & Mobile Header with Global Search) */}
      <Navigation 
        currentTab={currentTab} 
        onTabChange={setCurrentTab}
        onSelectRabbit={(rabbit) => setActiveSearchedRabbit(rabbit)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
        {currentTab === 'dashboard' && (
          <DashboardView
            onNavigate={setCurrentTab}
            onOpenQuickAction={handleQuickAction}
          />
        )}

        {currentTab === 'rabbits' && (
          <RabbitsModule
            onOpenAddModal={() => setIsAddRabbitOpen(true)}
          />
        )}

        {currentTab === 'breeding' && (
          <BreedingModule
            onOpenBreedingModal={() => setIsBreedingOpen(true)}
            onOpenKindlingModal={(linked) => {
              setKindlingLinkedBreeding(linked);
              setIsKindlingOpen(true);
            }}
          />
        )}

        {currentTab === 'health' && (
          <HealthModule
            onOpenHealthModal={() => setIsHealthOpen(true)}
            onOpenVaccinationModal={() => setIsVaccOpen(true)}
          />
        )}

        {currentTab === 'feeding' && (
          <FeedingExpensesModule
            onOpenFeedModal={() => setIsFeedOpen(true)}
            onOpenExpenseModal={() => setIsExpenseOpen(true)}
          />
        )}

        {currentTab === 'sales' && (
          <SalesModule
            onOpenSaleModal={() => setIsSaleOpen(true)}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryModule
            onOpenInventoryModal={() => setIsInventoryOpen(true)}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsModule />
        )}

        {currentTab === 'notifications' && (
          <NotificationsModule />
        )}

        {currentTab === 'profile' && (
          <ProfileSettingsModule />
        )}
      </main>

      {/* Floating Action Launcher for Barny AI Chat on mobile/desktop */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-5 z-40 p-3.5 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-xl shadow-emerald-900/40 hover:scale-105 active:scale-95 transition flex items-center gap-2 group"
        title="Ask Barny AI"
      >
        <span className="text-xl">🐇</span>
        <span className="hidden sm:inline font-bold text-xs pr-1">Ask Barny AI</span>
      </button>

      {/* Gemini Chatbot Modal */}
      <GeminiChatBot
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Global Rabbit Detail Dossier Modal (Triggered by Global Search) */}
      {activeSearchedRabbit && (
        <RabbitDetailModal
          rabbit={activeSearchedRabbit}
          onClose={() => setActiveSearchedRabbit(null)}
          onOpenQR={() => {
            setActiveQrRabbit(activeSearchedRabbit);
            setActiveSearchedRabbit(null);
          }}
          onStatusChange={async (newStatus) => {
            await updateRabbit(activeSearchedRabbit.id, { status: newStatus });
            setActiveSearchedRabbit({ ...activeSearchedRabbit, status: newStatus });
          }}
        />
      )}

      {/* QR Modal when opened from searched rabbit dossier */}
      {activeQrRabbit && (
        <RabbitQrModal
          rabbit={activeQrRabbit}
          onClose={() => setActiveQrRabbit(null)}
        />
      )}

      {/* Application Modals */}
      <AddRabbitModal
        isOpen={isAddRabbitOpen}
        onClose={() => setIsAddRabbitOpen(false)}
      />

      <RecordBreedingModal
        isOpen={isBreedingOpen}
        onClose={() => setIsBreedingOpen(false)}
      />

      <RecordKindlingModal
        isOpen={isKindlingOpen}
        onClose={() => {
          setIsKindlingOpen(false);
          setKindlingLinkedBreeding(undefined);
        }}
        linkedBreeding={kindlingLinkedBreeding}
      />

      <AddHealthModal
        isOpen={isHealthOpen}
        onClose={() => setIsHealthOpen(false)}
      />

      <AddVaccinationModal
        isOpen={isVaccOpen}
        onClose={() => setIsVaccOpen(false)}
      />

      <AddFeedingModal
        isOpen={isFeedOpen}
        onClose={() => setIsFeedOpen(false)}
      />

      <AddExpenseModal
        isOpen={isExpenseOpen}
        onClose={() => setIsExpenseOpen(false)}
      />

      <AddSaleModal
        isOpen={isSaleOpen}
        onClose={() => setIsSaleOpen(false)}
      />

      <AddInventoryModal
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
      />

    </div>
  );
}
