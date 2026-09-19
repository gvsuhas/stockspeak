import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { InventoryProvider } from './context/InventoryContext';
import Navbar from './components/Navbar';
import DashboardStats from './components/DashboardStats';
import ProductList from './components/ProductList';
import VoiceMicModal from './components/VoiceMicModal';
import AddProductModal from './components/AddProductModal';
import StockAlerts from './components/StockAlerts';
import TransactionHistory from './components/TransactionHistory';
import VoiceGuideCards from './components/VoiceGuideCards';

function StockSpeakApp() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isMicOpen, setIsMicOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen pb-12">
      
      {/* Top Navbar */}
      <Navbar
        onOpenMic={() => setIsMicOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6">
        
        {/* Metric Cards */}
        <DashboardStats
          onFilterLowStock={() => setActiveTab('alerts')}
        />

        {/* Quick Voice Command Cheat Sheet */}
        <VoiceGuideCards
          onSelectPrompt={(phrase) => {
            setIsMicOpen(true);
          }}
        />

        {/* Active Tab Content */}
        {activeTab === 'inventory' && (
          <ProductList
            onOpenAddModal={handleOpenAddModal}
            onEditProduct={handleOpenEditModal}
          />
        )}

        {activeTab === 'alerts' && (
          <StockAlerts />
        )}

        {activeTab === 'transactions' && (
          <TransactionHistory />
        )}

      </main>

      {/* Voice Assistant Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setIsMicOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 text-white font-bold shadow-2xl shadow-indigo-500/50 flex items-center justify-center transform hover:scale-110 active:scale-95 transition-all glow-mic-btn group"
        >
          <span className="text-xl group-hover:animate-bounce">🎙️</span>
        </button>
      </div>

      {/* Modals */}
      <VoiceMicModal
        isOpen={isMicOpen}
        onClose={() => setIsMicOpen(false)}
      />

      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        editingProduct={editingProduct}
      />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <InventoryProvider>
        <StockSpeakApp />
      </InventoryProvider>
    </LanguageProvider>
  );
}
